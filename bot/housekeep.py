#!/usr/bin/env python3
"""Once a week, throw out clips that already posted and posters that are old.

A clip still waiting to go up stays. So does a clip that has not posted yet.
Feed icons stay. Project folders stay.

The timer is Sunday morning, Europe/Berlin, inside a short window.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
from datetime import datetime, timedelta
from pathlib import Path

import bsky_grok as bsky

IMAGINE = Path("/home/andreas/Imagine")
CLIP_STATE = bsky.STATE_DIR / "bsky-clip.json"
IMAGE_DIR = bsky.STATE_DIR / "images"
LOG_PATH = bsky.STATE_DIR / "housekeep.log"
LOCK_PATH = bsky.STATE_DIR / "housekeep.lock"
BOT_DIR = Path(__file__).resolve().parent
DATE_RE = re.compile(r"(20\d{2}-\d{2}-\d{2})")
CLIP_DAYS = 7
POSTER_DAYS = 14
SCRAP_HOURS = 24


def say(msg: str) -> None:
    bsky.STATE_DIR.mkdir(parents=True, exist_ok=True)
    line = f"{bsky.berlin_now().isoformat(timespec='seconds')} {msg}\n"
    with LOG_PATH.open("a", encoding="utf-8") as fh:
        fh.write(line)
    print(line, end="")


def load_json(path: Path) -> dict:
    if not path.is_file():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def posted_names() -> tuple[set[str], str]:
    clip = load_json(CLIP_STATE)
    names = {str(item) for item in (clip.get("posted") or []) if item}
    video = load_json(bsky.STATE_PATH).get("video") or {}
    if video.get("file"):
        names.add(str(video["file"]))
    pending = ""
    raw = clip.get("pending") or {}
    if isinstance(raw, dict) and raw.get("file"):
        pending = Path(str(raw["file"])).name
    extras: set[str] = set()
    for name in list(names):
        if not name.endswith("-full.mp4"):
            continue
        stem = name[: -len("-full.mp4")]
        extras.add(f"{stem}.mp4")
        extras.add(f"{stem}-02.mp4")
    names.update(extras)
    if pending:
        names.discard(pending)
    return names, pending


def older_than(path: Path, now: datetime, span: timedelta) -> bool:
    stamp = datetime.fromtimestamp(path.stat().st_mtime, now.tzinfo)
    return now - stamp >= span


def drop(path: Path, dry_run: bool) -> None:
    if dry_run:
        say(f"would remove {path}")
        return
    path.unlink()
    say(f"removed {path}")


def clips(now: datetime, dry_run: bool) -> int:
    names, pending = posted_names()
    if pending:
        say(f"keep pending {pending}")
    count = 0
    if not IMAGINE.is_dir():
        return 0
    for path in sorted(IMAGINE.glob("*.mp4")):
        if path.name not in names:
            say(f"keep {path.name}")
            continue
        if not older_than(path, now, timedelta(days=CLIP_DAYS)):
            say(f"keep recent {path.name}")
            continue
        drop(path, dry_run)
        count += 1
    return count


def posters(now: datetime, dry_run: bool) -> int:
    count = 0
    if not IMAGE_DIR.is_dir():
        return 0
    for path in sorted(IMAGE_DIR.glob("*.jpg")):
        match = DATE_RE.search(path.name)
        if not match:
            continue
        day = datetime.fromisoformat(match.group(1)).date()
        if (now.date() - day).days < POSTER_DAYS:
            continue
        drop(path, dry_run)
        count += 1
    return count


def scraps(now: datetime, dry_run: bool) -> int:
    count = 0
    span = timedelta(hours=SCRAP_HOURS)
    for pattern in ("imagine-line-*.txt", "bsky-clip-*.txt"):
        for path in sorted(Path("/tmp").glob(pattern)):
            if not path.is_file() or not older_than(path, now, span):
                continue
            drop(path, dry_run)
            count += 1
    return count


def caches(dry_run: bool) -> int:
    count = 0
    for folder in (BOT_DIR / "__pycache__", IMAGINE / "__pycache__"):
        if not folder.is_dir():
            continue
        if dry_run:
            say(f"would remove {folder}")
        else:
            shutil.rmtree(folder)
            say(f"removed {folder}")
        count += 1
    return count


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Drop posted clips and old posters.")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)
    bsky.STATE_DIR.mkdir(parents=True, exist_ok=True)
    lock = LOCK_PATH.open("a", encoding="utf-8")
    try:
        import fcntl

        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        say("skip: another cleanup is already going")
        return 0
    try:
        now = bsky.berlin_now()
        mode = "dry-run" if args.dry_run else "run"
        say(f"start {mode}")
        gone = clips(now, args.dry_run) + posters(now, args.dry_run) + scraps(now, args.dry_run) + caches(args.dry_run)
        say(f"done {mode} {gone}")
    finally:
        import fcntl

        fcntl.flock(lock, fcntl.LOCK_UN)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
