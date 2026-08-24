#!/usr/bin/env python3
"""
Standalone image downloader. Reads images_manifest.csv and downloads all remote images into ./images.
Safe to re-run and resumes interrupted downloads automatically.
"""
import csv
import os
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

OUT = "images"
os.makedirs(OUT, exist_ok=True)
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

manifest_file = "images_manifest.csv"
if not os.path.exists(manifest_file):
    print(f"Error: Cannot find {manifest_file}")
    sys.exit(1)

with open(manifest_file, encoding="utf-8") as fh:
    rows = list(csv.DictReader(fh))

print(f"Loaded {len(rows)} images from {manifest_file}.")

def download_one(row):
    filename = row["local_filename"]
    url = row["url"]
    dest = os.path.join(OUT, filename)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return ("skipped", filename, None)
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as resp, open(dest, "wb") as out:
            out.write(resp.read())
        return ("ok", filename, None)
    except Exception as exc:
        return ("failed", filename, str(exc))

ok = skipped = failed = 0
failures = []

with ThreadPoolExecutor(max_workers=16) as executor:
    futures = [executor.submit(download_one, row) for row in rows]
    count = 0
    for future in as_completed(futures):
        count += 1
        status, fname, err = future.result()
        if status == "ok":
            ok += 1
        elif status == "skipped":
            skipped += 1
        else:
            failed += 1
            failures.append((fname, err))
        if count % 100 == 0 or count == len(rows):
            print(f"Progress: {count}/{len(rows)} (Downloaded: {ok}, Skipped: {skipped}, Failed: {failed})")

print(f"\nDownload summary: {ok} downloaded, {skipped} already existed, {failed} failed.")
if failures:
    print(f"Failed images ({len(failures)}):")
    for f, err in failures[:10]:
        print(f"  - {f}: {err}")
