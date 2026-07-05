# Deploying GumiPaws to Azure

This guide moves the **database**, **app (web + API)**, **email**, and
**secrets** onto Azure.

## Architecture

| Concern              | Azure service                                              |
| --------------------- | ----------------------------------------------------------- |
| Database (Postgres)  | **Azure Database for PostgreSQL – Flexible Server**          |
| Web + API + Auth     | **Azure App Service** (Linux, Node 20)                       |
| Email                 | **Azure Communication Services – Email**                    |
| Secrets & keys        | **Azure Key Vault**, read by App Service via managed identity |
| TLS / custom domain  | App Service custom domain + free managed cert                |
| CI/CD                 | GitHub Actions → `azure/webapps-deploy`                      |

**What stays external:** Google Calendar is a third-party API the app calls
over HTTP — that doesn't change with where the app is hosted. Its service
account email/key/calendar ID are treated the same as any other secret below
(stored in Key Vault, injected as env vars).

This guide requires one code change (swapping the Resend SDK for the Azure
Communication Services Email SDK in `src/lib/email.ts` / `package.json`,
and updating `.env.example`) — do that first, then provision the
infrastructure below.

Prerequisites: an Azure subscription, the [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
logged in (`az login`), and this repo pushed to GitHub.

---

## 1. Create a resource group

```bash
az group create --name gumipaws-rg --location eastus
```

Pick a region close to your customers; use the same region for every
resource below.

---

## 2. Provision the database

```bash
az postgres flexible-server create \
  --resource-group gumipaws-rg \
  --name gumipaws-db \
  --location eastus \
  --admin-user gumipawsadmin \
  --admin-password '<STRONG_PASSWORD_HERE>' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 16 \
  --public-access 0.0.0.0

az postgres flexible-server db create \
  --resource-group gumipaws-rg \
  --server-name gumipaws-db \
  --database-name gumipaws
```

- `--public-access 0.0.0.0` allows any Azure resource (including the App
  Service you'll create in step 5) to reach the server without listing
  individual IPs. It does **not** open the server to the whole internet —
  Postgres still requires the username/password and `sslmode=require`.
- If you also want to run `prisma migrate` from your own laptop, add your IP:
  ```bash
  az postgres flexible-server firewall-rule create \
    --resource-group gumipaws-rg --name gumipaws-db \
    --rule-name allow-my-ip \
    --start-ip-address <YOUR_IP> --end-ip-address <YOUR_IP>
  ```

Connection string (this is both `DATABASE_URL` and `DIRECT_URL` — Flexible
Server doesn't need a separate pooled endpoint the way Neon does):

```
postgresql://gumipawsadmin:<STRONG_PASSWORD_HERE>@gumipaws-db.postgres.database.azure.com:5432/gumipaws?sslmode=require
```

---

## 3. Provision email (Azure Communication Services)

The domain-linking steps here are fiddly in CLI, so the portal is faster:

1. Portal → **Create a resource → Communication Services** → name
   `gumipaws-acs`, same resource group, data location e.g. "United States".
2. **Create a resource → Email Communication Services** → name
   `gumipaws-email`, same resource group.
3. Open `gumipaws-email` → **Provision domains → Add domain**:
   - **Azure Managed Domain** — instant, gives you a sender like
     `DoNotReply@<random>.azurecomm.net`. Good enough to ship today.
   - **Custom domain** — add your domain, then add the TXT/SPF/DKIM/DMARC
     records Azure shows you to your DNS provider. Takes longer to verify but
     the sender looks like `hello@yourdomain.com`.
4. Back in `gumipaws-acs` → **Domains → Connect domain** → select the domain
   you just verified.
5. `gumipaws-acs` → **Keys** → copy the **connection string** — this becomes
   `AZURE_COMMUNICATION_CONNECTION_STRING`.
6. Note the exact sender address the domain gives you (e.g.
   `DoNotReply@xxxxx.azurecomm.net`, or a `MailFrom` address you configure on
   a custom domain) — this becomes `EMAIL_FROM`.

---

## 4. Create the Key Vault and store every secret

```bash
az keyvault create \
  --name gumipaws-kv \
  --resource-group gumipaws-rg \
  --location eastus \
  --enable-rbac-authorization true
```

(`gumipaws-kv` must be globally unique.) Key Vault secret names can't contain
underscores, so each `.env` var maps to a hyphenated secret name:

```bash
az keyvault secret set --vault-name gumipaws-kv --name DATABASE-URL \
  --value "postgresql://gumipawsadmin:<PASSWORD>@gumipaws-db.postgres.database.azure.com:5432/gumipaws?sslmode=require"
az keyvault secret set --vault-name gumipaws-kv --name DIRECT-URL \
  --value "postgresql://gumipawsadmin:<PASSWORD>@gumipaws-db.postgres.database.azure.com:5432/gumipaws?sslmode=require"
az keyvault secret set --vault-name gumipaws-kv --name NEXTAUTH-SECRET \
  --value "$(openssl rand -base64 32)"
az keyvault secret set --vault-name gumipaws-kv --name ADMIN-NAME --value "<admin display name>"
az keyvault secret set --vault-name gumipaws-kv --name ADMIN-PIN --value "<3-10 digit PIN>"
az keyvault secret set --vault-name gumipaws-kv --name GOOGLE-SERVICE-ACCOUNT-EMAIL --value "<client_email from the JSON key>"
az keyvault secret set --vault-name gumipaws-kv --name GOOGLE-SERVICE-ACCOUNT-PRIVATE-KEY --value "<private_key from the JSON key>"
az keyvault secret set --vault-name gumipaws-kv --name GOOGLE-CALENDAR-ID --value "<calendar id>"
az keyvault secret set --vault-name gumipaws-kv --name AZURE-COMMUNICATION-CONNECTION-STRING --value "<connection string from step 3>"
az keyvault secret set --vault-name gumipaws-kv --name BUSINESS-NOTIFICATION-EMAIL --value "<inbox for booking notifications>"
az keyvault secret set --vault-name gumipaws-kv --name EMAIL-FROM --value "<sender address from step 3>"
```

`NEXTAUTH_URL` isn't stored here — it depends on the App Service hostname
you're about to create, so it's set directly as a plain app setting in step 7.

---

## 5. Create the App Service

```bash
az appservice plan create \
  --name gumipaws-plan \
  --resource-group gumipaws-rg \
  --sku B1 \
  --is-linux

az webapp create \
  --resource-group gumipaws-rg \
  --plan gumipaws-plan \
  --name gumipaws-app \
  --runtime "NODE:20-lts"
```

`gumipaws-app` must be globally unique across all of Azure — change it if
`az webapp create` errors, and use your chosen name everywhere below. Your
default URL will be `https://gumipaws-app.azurewebsites.net`.

Tell App Service to build the app itself (installs deps, runs
`prisma generate` via `postinstall`, then `next build`) instead of expecting a
pre-built bundle — this matters for Prisma, since its native query engine
must be compiled in the *same* environment it runs in:

```bash
az webapp config appsettings set \
  --resource-group gumipaws-rg --name gumipaws-app \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true WEBSITE_NODE_DEFAULT_VERSION=~20
```

Next.js's `next start` (the app's `npm start`) already respects the `PORT`
env var that App Service injects, so no startup command override is needed.

---

## 6. Let the App Service read the Key Vault

Give the App Service a managed identity, then grant that identity
read-only access to the vault's secrets:

```bash
az webapp identity assign --resource-group gumipaws-rg --name gumipaws-app

principalId=$(az webapp identity show --resource-group gumipaws-rg --name gumipaws-app --query principalId -o tsv)
vaultId=$(az keyvault show --name gumipaws-kv --resource-group gumipaws-rg --query id -o tsv)

az role assignment create \
  --role "Key Vault Secrets User" \
  --assignee "$principalId" \
  --scope "$vaultId"
```

Role assignments can take a minute or two to propagate before references
resolve — that's expected.

---

## 7. Set app settings as Key Vault references

```bash
az webapp config appsettings set \
  --resource-group gumipaws-rg --name gumipaws-app \
  --settings \
    DATABASE_URL="@Microsoft.KeyVault(SecretUri=https://gumipaws-kv.vault.azure.net/secrets/DATABASE-URL/)" \
    DIRECT_URL="@Microsoft.KeyVault(SecretUri=https://gumipaws-kv.vault.azure.net/secrets/DIRECT-URL/)" \
    NEXTAUTH_SECRET="@Microsoft.KeyVault(SecretUri=https://gumipaws-kv.vault.azure.net/secrets/NEXTAUTH-SECRET/)" \
    NEXTAUTH_URL="https://gumipaws-app.azurewebsites.net" \
    ADMIN_NAME="@Microsoft.KeyVault(SecretUri=https://gumipaws-kv.vault.azure.net/secrets/ADMIN-NAME/)" \
    ADMIN_PIN="@Microsoft.KeyVault(SecretUri=https://gumipaws-kv.vault.azure.net/secrets/ADMIN-PIN/)" \
    GOOGLE_SERVICE_ACCOUNT_EMAIL="@Microsoft.KeyVault(SecretUri=https://gumipaws-kv.vault.azure.net/secrets/GOOGLE-SERVICE-ACCOUNT-EMAIL/)" \
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="@Microsoft.KeyVault(SecretUri=https://gumipaws-kv.vault.azure.net/secrets/GOOGLE-SERVICE-ACCOUNT-PRIVATE-KEY/)" \
    GOOGLE_CALENDAR_ID="@Microsoft.KeyVault(SecretUri=https://gumipaws-kv.vault.azure.net/secrets/GOOGLE-CALENDAR-ID/)" \
    AZURE_COMMUNICATION_CONNECTION_STRING="@Microsoft.KeyVault(SecretUri=https://gumipaws-kv.vault.azure.net/secrets/AZURE-COMMUNICATION-CONNECTION-STRING/)" \
    BUSINESS_NOTIFICATION_EMAIL="@Microsoft.KeyVault(SecretUri=https://gumipaws-kv.vault.azure.net/secrets/BUSINESS-NOTIFICATION-EMAIL/)" \
    EMAIL_FROM="@Microsoft.KeyVault(SecretUri=https://gumipaws-kv.vault.azure.net/secrets/EMAIL-FROM/)"
```

App Service resolves `@Microsoft.KeyVault(...)` values itself before the app
ever sees them — your code just reads `process.env.DATABASE_URL` etc as
plain strings, no SDK or code change needed for this part. Check
**App Service → Configuration** in the portal: each Key Vault-backed setting
shows a green "Key Vault Reference" checkmark once resolved (a red X usually
means the role assignment from step 6 hasn't propagated yet — wait a minute
and refresh).

---

## 8. Deploy via GitHub Actions

Get a publish profile and store it as a GitHub secret:

```bash
az webapp deployment list-publishing-profiles \
  --resource-group gumipaws-rg --name gumipaws-app --xml
```

Copy the output into a new GitHub repo secret named
`AZURE_WEBAPP_PUBLISH_PROFILE` (**Settings → Secrets and variables → Actions**).

Add `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure App Service

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/webapps-deploy@v3
        with:
          app-name: gumipaws-app
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: .
```

This ships the source as-is and lets Azure's Oryx builder run `npm install`
(→ `postinstall` → `prisma generate`) and `npm run build` on the server,
matching the "build where it runs" requirement from step 5. Push to `main`
to trigger the first deploy.

---

## 9. Run the initial migration and seed

The schema needs to be created once against the new database. Use the App
Service's built-in SSH console (it already has `DATABASE_URL` resolved from
Key Vault as an env var) rather than running it from your laptop or CI, so
you don't have to punch extra firewall holes:

1. Go to `https://gumipaws-app.scm.azurewebsites.net/webssh/host` (or
   **App Service → Development Tools → SSH** in the portal).
2. `cd /home/site/wwwroot`
3. Run:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

That applies the bundled migration and creates your initial `ADMIN` staff
user from `ADMIN_NAME` / `ADMIN_PIN`.

---

## 10. Custom domain + HTTPS

```bash
az webapp config hostname add \
  --webapp-name gumipaws-app --resource-group gumipaws-rg \
  --hostname www.yourdomain.com
```

Then in the portal: **App Service → Custom domains → Add binding →
App Service Managed Certificate (Free)** to get auto-renewing TLS.

Afterward, update the `NEXTAUTH_URL` app setting to the custom domain and
restart the app — Auth.js signs cookies against this value, so a mismatch
will break login.

---

## 11. Verify

- `https://gumipaws-app.azurewebsites.net` (or your custom domain) loads the
  marketing page.
- Complete a test booking end-to-end; confirm it appears in the shared
  Google Calendar and that confirmation emails arrive from the ACS sender.
- Log into `/admin/login` with the seeded `ADMIN_PIN` and confirm the
  dashboard loads.
- **App Service → Log stream** for live logs if anything fails.
- **App Service → Configuration** to confirm every Key Vault reference shows
  green, not red.

---

## Ongoing operations

- **Scaling:** `az appservice plan update --name gumipaws-plan --resource-group gumipaws-rg --sku P0v3` for a real production tier (autoscale, staging slots). Same for the DB: `az postgres flexible-server update --sku-name Standard_B2s ...`.
- **Backups:** Flexible Server takes automated backups (7-day retention by default, configurable up to 35 days) — no setup needed, but confirm the retention window matches your risk tolerance.
- **Monitoring:** enable Application Insights on the App Service for request traces and error alerts (`az monitor app-insights component create` + wire the connection string into app settings).
- **Rotating secrets:** update the value in Key Vault (`az keyvault secret set` with the same name creates a new version) and restart the App Service — no redeploy needed since the app only ever sees the resolved env var.
- **Rate limiting:** the README notes the login lockout in [`src/lib/rate-limit.ts`](src/lib/rate-limit.ts) is in-memory. A single App Service instance is fine; if you scale to multiple instances, back it with the DB or Azure Cache for Redis so lockouts are shared across instances.

**Rough monthly cost** at the sizes above: ~$13 (App Service B1) + ~$15
(Postgres B1ms/32GB) + a few cents (Key Vault operations) + email sent at
$0.25/1,000 (ACS) ≈ **$28-30/month** for low volume. Scale down to free/dev
tiers for a staging environment.
