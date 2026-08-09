#!/usr/bin/env python3
"""
Fetch freely-licensed fish photos from Wikimedia Commons for Angler's Arrows.

Run this on your own machine (it needs internet). It queries Wikimedia Commons
for each species, downloads the best freely-licensed image it finds, saves it to
../images/fish/<slug>.jpg, and writes CREDITS.txt with the author + licence for
each one so you can attribute properly.

  python3 fetch_fish_photos.py

Notes
- Wikimedia images carry a mix of licences. This script keeps only PUBLIC DOMAIN
  / CC0 / CC BY / CC BY-SA and records attribution. CC BY(-SA) require crediting
  the author and linking the licence — CREDITS.txt captures what you need.
- For the most authoritative, unambiguously public-domain art, consider the USFWS
  "Duane Raver" fish illustrations (used on most US state fishing regulations).
  Many are on Commons and will surface here; others are at the USFWS National
  Digital Library (digitalmedia.fws.gov). NOAA's photo library is public domain too.
- This is a starting point: review each result, swap any you don't like, and
  re-run for individual species by editing SPECIES below.
"""
import json, os, re, sys, time, urllib.parse, urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA  = "AnglersArrows-photo-fetch/1.0 (contact: you@example.com)"
OUT = os.path.join(os.path.dirname(__file__), "..", "images", "fish")

# slug -> search term (scientific name is most reliable)
SPECIES = {
    "bluegill":          "Lepomis macrochirus",
    "largemouth-bass":   "Micropterus salmoides",
    "smallmouth-bass":   "Micropterus dolomieu",
    "black-crappie":     "Pomoxis nigromaculatus",
    "yellow-perch":      "Perca flavescens",
    "channel-catfish":   "Ictalurus punctatus",
    "rainbow-trout":     "Oncorhynchus mykiss",
    "redfish":           "Sciaenops ocellatus",
    "spotted-seatrout":  "Cynoscion nebulosus",
    "striped-bass":      "Morone saxatilis",
    "flounder":          "Paralichthys",
    "sheepshead":        "Archosargus probatocephalus",
}
FREE = ("public domain", "pd", "cc0", "cc by", "cc-by")  # lowercase markers we accept

def api(params):
    params.update({"format": "json"})
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def strip_html(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()

def find_image(term):
    """Return (title, thumburl, artist, licence, filepage) for a free image, or None."""
    data = api({
        "action": "query", "generator": "search",
        "gsrsearch": f'{term} filetype:bitmap', "gsrnamespace": "6", "gsrlimit": "15",
        "prop": "imageinfo", "iiprop": "url|mime|extmetadata", "iiurlwidth": "1100",
    })
    pages = (data.get("query") or {}).get("pages") or {}
    # search order isn't guaranteed by dict; sort by index
    for page in sorted(pages.values(), key=lambda p: p.get("index", 999)):
        ii = (page.get("imageinfo") or [{}])[0]
        if ii.get("mime") not in ("image/jpeg", "image/png"):
            continue
        meta = ii.get("extmetadata") or {}
        lic = strip_html(meta.get("LicenseShortName", {}).get("value", "")).lower()
        if not any(m in lic for m in FREE):
            continue
        artist = strip_html(meta.get("Artist", {}).get("value", "")) or "Unknown"
        return (page.get("title"), ii.get("thumburl") or ii.get("url"),
                artist, strip_html(meta.get("LicenseShortName", {}).get("value", "")),
                ii.get("descriptionurl", ""))
    return None

def main():
    os.makedirs(OUT, exist_ok=True)
    credits = []
    for slug, term in SPECIES.items():
        try:
            hit = find_image(term)
        except Exception as e:
            print(f"[!] {slug}: query failed ({e})"); continue
        if not hit:
            print(f"[ ] {slug}: no free image found for '{term}' — add manually"); continue
        title, url, artist, lic, page = hit
        dest = os.path.join(OUT, slug + ".jpg")
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
                f.write(r.read())
            print(f"[✓] {slug}: {title}  ({lic})")
            credits.append(f"{slug}.jpg\n  {title}\n  by {artist} — {lic}\n  {page}\n")
        except Exception as e:
            print(f"[!] {slug}: download failed ({e})")
        time.sleep(1)  # be polite to the API
    if credits:
        with open(os.path.join(os.path.dirname(__file__), "CREDITS.txt"), "w") as f:
            f.write("Image credits (Wikimedia Commons)\n=================================\n\n" + "\n".join(credits))
        print("\nWrote CREDITS.txt — keep it with the app to satisfy attribution licences.")

if __name__ == "__main__":
    main()
