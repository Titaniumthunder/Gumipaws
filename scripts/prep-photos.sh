#!/usr/bin/env bash
#
# Prepare grooming photos and clips for the website gallery.
#
#   ./scripts/prep-photos.sh ~/Desktop/moms-photos
#   ./scripts/prep-photos.sh ~/Desktop/photo1.heic ~/Desktop/clip.mov
#
# Phone photos are far too large to publish as-is: a single iPhone shot is
# 2-5 MB, and a page with six of them takes painfully long to load on the
# phone most customers will be browsing on. This shrinks each one to a size
# that still looks sharp, converts Apple's HEIC to JPEG (browsers do not
# display HEIC), and drops the results into public/gallery/.
#
# It never touches your originals — everything is written to public/gallery/.
# Afterwards it prints entries ready to paste into src/content/site.ts.

set -euo pipefail

# Long edge in pixels. The largest gallery cell is ~800px wide on a big screen,
# so 1600 stays crisp on a 2x retina display without wasting bytes.
MAX_EDGE=1600
# JPEG quality. 68 is where grooming photos stop shrinking usefully and start
# showing blur in the coat detail, which is the whole point of the photo.
QUALITY=68
# Browsers must download a video before it plays. Past ~10MB that wait is long
# enough on a phone that people scroll away instead.
MAX_VIDEO_MB=10

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$REPO_ROOT/public/gallery"

if [ $# -eq 0 ]; then
  echo "Usage: $0 <folder-or-files...>" >&2
  echo "Example: $0 ~/Desktop/moms-photos" >&2
  exit 1
fi

mkdir -p "$DEST"

# Collect inputs: expand folders one level, take files as given.
inputs=()
for arg in "$@"; do
  if [ -d "$arg" ]; then
    while IFS= read -r f; do inputs+=("$f"); done < <(find "$arg" -maxdepth 1 -type f)
  elif [ -f "$arg" ]; then
    inputs+=("$arg")
  else
    echo "!  skipping (not found): $arg" >&2
  fi
done

# Lowercase, strip the extension, replace anything not a letter/number with a
# dash: "IMG_4821 copy.HEIC" becomes "img-4821-copy". Predictable filenames
# keep the URLs in site.ts readable.
slugify() {
  basename "$1" \
    | sed 's/\.[^.]*$//' \
    | tr '[:upper:]' '[:lower:]' \
    | sed 's/[^a-z0-9]\{1,\}/-/g; s/^-//; s/-$//'
}

photo_entries=()
video_entries=()

if [ ${#inputs[@]} -eq 0 ]; then
  echo "No files found in the paths given." >&2
  exit 1
fi

# macOS ships bash 3.2, where "${arr[@]}" on an empty array trips `set -u`.
# ${arr[@]+"${arr[@]}"} expands to nothing at all when the array is empty.
for src in ${inputs[@]+"${inputs[@]}"}; do
  ext="$(echo "${src##*.}" | tr '[:upper:]' '[:lower:]')"
  slug="$(slugify "$src")"

  case "$ext" in
    jpg|jpeg|png|heic|heif|tiff)
      out="$DEST/$slug.jpg"
      # sips reads HEIC natively on macOS, so one call covers convert + resize.
      if sips -Z "$MAX_EDGE" -s format jpeg -s formatOptions "$QUALITY" \
              "$src" --out "$out" >/dev/null 2>&1; then
        before=$(du -h "$src" | cut -f1 | tr -d ' ')
        after=$(du -h "$out" | cut -f1 | tr -d ' ')
        printf "photo  %-34s %6s -> %s\n" "$slug.jpg" "$before" "$after"
        photo_entries+=("$slug")
      else
        echo "!  could not convert: $src" >&2
      fi
      ;;

    mp4|mov|m4v)
      out="$DEST/$slug.$ext"
      cp "$src" "$out"
      size_mb=$(( $(stat -f%z "$out") / 1024 / 1024 ))
      printf "video  %-34s %5sMB\n" "$slug.$ext" "$size_mb"
      if [ "$size_mb" -gt "$MAX_VIDEO_MB" ]; then
        echo "   ^ over ${MAX_VIDEO_MB}MB — trim it shorter, or export at 720p," >&2
        echo "     otherwise phone visitors wait a long time before it plays." >&2
      fi
      if [ "$ext" = "mov" ]; then
        echo "   ^ .mov does not play in every browser. Export as .mp4 (H.264)" >&2
        echo "     from Photos or QuickTime for the widest support." >&2
      fi
      video_entries+=("$slug.$ext")
      ;;

    *)
      echo "!  skipping unsupported type: $src" >&2
      ;;
  esac
done

if [ ${#photo_entries[@]} -eq 0 ] && [ ${#video_entries[@]} -eq 0 ]; then
  echo "Nothing to do." >&2
  exit 1
fi

cat <<'BANNER'

--------------------------------------------------------------------
Done. Files are in public/gallery/.

Last step: open src/content/site.ts, find GALLERY_ITEMS, and paste the
entries below. Replace dogName with the dog's real name, and rewrite
each alt to describe that photo (it is read aloud to blind visitors
and shown if the image fails to load).
--------------------------------------------------------------------

BANNER

for slug in ${photo_entries[@]+"${photo_entries[@]}"}; do
  printf '  {\n    dogName: "REPLACE ME",\n    after: "/gallery/%s.jpg",\n    alt: "REPLACE ME — describe this photo",\n  },\n' "$slug"
done

for file in ${video_entries[@]+"${video_entries[@]}"}; do
  printf '  {\n    dogName: "REPLACE ME",\n    video: "/gallery/%s",\n    // poster: "/gallery/some-still.jpg",  // recommended\n  },\n' "$file"
done

cat <<'FOOTER'

Got a matching pre-groom shot of the same dog? Add `before` to its entry
and that cell turns into a drag-to-compare slider on its own:

  { dogName: "Bella",
    before: "/gallery/bella-before.jpg",
    after:  "/gallery/bella-after.jpg" },
FOOTER
