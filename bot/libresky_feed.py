#!/usr/bin/env python3
"""LibreSky feeds, a starter pack, and #LibreSky tracking.

The feeds are published on Skyfeed (did:web:skyfeed.me), the same host as the
other feeds on this account. The recipe is stored on the generator record, so
the feed keeps running when this machine is off.

Skyfeed reads the firehose and keeps a recent window, then applies the recipe.
New posts show up on their own. This script does not like, repost, or reply.

Commands:
  avatars   Draw the feed icons into the state directory.
  publish   Create or update the feeds, the list, and the starter pack.
  track     Note new #LibreSky posts. The first run only sets a baseline.
"""

from __future__ import annotations

import argparse
import json
import math
import random
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from bsky_grok import ENTRYWAY, STATE_DIR, create_session, load_env, pds_of

HANDLE = "thewhitewitchtm.sociallydead.me"
SERVICE_DID = "did:web:skyfeed.me"
LINK = "https://thewhitewitchtm.github.io/LibreSky/"
LICENSE = "EUPL-1.2"

RKEY_FEED = "libresky"
RKEY_TAG = "libresky-tag"
PUBLISHED_PATH = STATE_DIR / "libresky-published.json"

FONT_BOLD = "/usr/share/fonts/opentype/fira/FiraSans-ExtraBold.otf"
FONT_LIGHT = "/usr/share/fonts/opentype/fira/FiraSans-Light.otf"

IMAGE_DIR = STATE_DIR / "images"
TRACK_PATH = STATE_DIR / "libresky-tag.json"
TRACK_LOG = STATE_DIR / "libresky-track.log"
PREFS_BACKUP = STATE_DIR / "prefs-backup-libresky.json"

S32 = "234567abcdefghijklmnopqrstuvwxyz"
_CLOCK = random.randrange(32)
_LAST_MS = 0
_TICK = 0


def log(msg: str) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    line = f"{datetime.now().astimezone().isoformat(timespec='seconds')} {msg}\n"
    with TRACK_LOG.open("a", encoding="utf-8") as fh:
        fh.write(line)
    print(line, end="")


def new_tid() -> str:
    global _LAST_MS, _TICK
    now = int(time.time() * 1000)
    if now == _LAST_MS:
        _TICK += 1
    else:
        _LAST_MS = now
        _TICK = 0
    body = s32encode(now * 1000 + _TICK)
    if len(body) > 11:
        raise RuntimeError(f"TID timestamp overflow: {body}")
    tid = body.rjust(11, "2") + s32encode(_CLOCK).rjust(2, "2")
    if len(tid) != 13 or any(ch not in S32 for ch in tid):
        raise RuntimeError(f"Bad TID {tid}")
    return tid


def s32encode(number: int) -> str:
    if number < 0:
        raise RuntimeError("s32encode expects a positive integer")
    if number == 0:
        return ""
    out = ""
    while number:
        number, rem = divmod(number, 32)
        out = S32[rem] + out
    return out


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def call(url: str, token: str | None = None, payload: dict | None = None, raw: bytes | None = None, content_type: str | None = None, method: str | None = None) -> dict:
    headers = {"Accept": "application/json", "User-Agent": "LibreSkyFeed/1.0"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = None
    if raw is not None:
        data = raw
        headers["Content-Type"] = content_type or "application/octet-stream"
    elif payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as res:
            body = res.read()
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as err:
        detail = err.read().decode("utf-8", "replace")[:800]
        raise SystemExit(f"Bluesky {err.code} on {url.split('?', 1)[0]}: {detail}") from None


def get_record(pds: str, token: str, did: str, collection: str, rkey: str) -> dict | None:
    url = f"{pds}/xrpc/com.atproto.repo.getRecord?" + urllib.parse.urlencode({
        "repo": did,
        "collection": collection,
        "rkey": rkey,
    })
    try:
        return call(url, token)
    except SystemExit as err:
        text = str(err)
        if " 400 " in text or "RecordNotFound" in text or "Could not locate" in text:
            return None
        raise


def put_record(pds: str, token: str, did: str, collection: str, rkey: str, record: dict) -> dict:
    return call(
        f"{pds}/xrpc/com.atproto.repo.putRecord",
        token,
        {"repo": did, "collection": collection, "rkey": rkey, "record": record},
    )


def upload_image(pds: str, token: str, path: Path) -> dict:
    blob = path.read_bytes()
    if len(blob) > 1_000_000:
        raise SystemExit(f"{path.name} is {len(blob)} bytes, over the Bluesky limit.")
    result = call(
        f"{pds}/xrpc/com.atproto.repo.uploadBlob",
        token,
        raw=blob,
        content_type="image/jpeg",
    )
    return result["blob"]


def facet_link(text: str, url: str) -> dict:
    start = text.find(url)
    if start < 0:
        raise SystemExit(f"Link missing from text: {url}")
    byte_start = len(text[:start].encode("utf-8"))
    return {
        "index": {"byteStart": byte_start, "byteEnd": byte_start + len(url.encode("utf-8"))},
        "features": [{"$type": "app.bsky.richtext.facet#link", "uri": url}],
    }


def facet_tag(text: str, tag: str) -> dict | None:
    needle = "#" + tag
    start = text.find(needle)
    if start < 0:
        return None
    byte_start = len(text[:start].encode("utf-8"))
    return {
        "index": {"byteStart": byte_start, "byteEnd": byte_start + len(needle.encode("utf-8"))},
        "features": [{"$type": "app.bsky.richtext.facet#tag", "tag": tag}],
    }


def with_facets(text: str, url: str | None = None) -> dict:
    if len(text) > 300:
        raise SystemExit(f"Description is {len(text)} characters, over 300.")
    facets = []
    tag = facet_tag(text, "LibreSky")
    if tag:
        facets.append(tag)
    if url and url in text:
        facets.append(facet_link(text, url))
    record = {"description": text}
    if facets:
        record["descriptionFacets"] = facets
    return record


# --- icons -----------------------------------------------------------------


def _put(buf: bytearray, width: int, height: int, x: int, y: int, color: tuple[int, int, int], cover: float) -> None:
    if cover <= 0 or not (0 <= x < width and 0 <= y < height):
        return
    i = (y * width + x) * 3
    cover = 1.0 if cover > 1 else cover
    for channel in range(3):
        base = buf[i + channel]
        buf[i + channel] = int(base + (color[channel] - base) * cover)


def _disc(buf: bytearray, width: int, height: int, cx: float, cy: float, radius: float, color: tuple[int, int, int]) -> None:
    pad = int(radius) + 2
    for y in range(max(0, int(cy) - pad), min(height, int(cy) + pad + 1)):
        for x in range(max(0, int(cx) - pad), min(width, int(cx) + pad + 1)):
            dist = math.hypot(x + 0.5 - cx, y + 0.5 - cy)
            edge = radius - dist
            if edge > 0:
                _put(buf, width, height, x, y, color, min(1.0, edge))


def _ring(buf: bytearray, width: int, height: int, cx: float, cy: float, radius: float, thickness: float, color: tuple[int, int, int]) -> None:
    pad = int(radius + thickness) + 2
    inner = radius - thickness / 2
    outer = radius + thickness / 2
    for y in range(max(0, int(cy) - pad), min(height, int(cy) + pad + 1)):
        for x in range(max(0, int(cx) - pad), min(width, int(cx) + pad + 1)):
            dist = math.hypot(x + 0.5 - cx, y + 0.5 - cy)
            if inner <= dist <= outer:
                edge = min(dist - inner, outer - dist)
                _put(buf, width, height, x, y, color, min(1.0, edge + 0.6))


def draw_icon(title: str, path: Path) -> None:
    """Square sky icon. Bluesky shows it as a circle, so the type stays central."""
    width = height = 1000
    top = (8, 62, 148)
    bottom = (86, 176, 246)
    buf = bytearray(width * height * 3)
    for y in range(height):
        blend = y / (height - 1)
        blend = blend * blend * (3 - 2 * blend)
        color = tuple(int(top[i] + (bottom[i] - top[i]) * blend) for i in range(3))
        row = bytes(color) * width
        start = y * width * 3
        buf[start:start + width * 3] = row

    # Moon and rings sit in the upper right, still inside the circular crop.
    mx, my = 720, 228
    _ring(buf, width, height, mx, my, 132, 8, (214, 236, 255))
    _ring(buf, width, height, mx, my, 108, 7, (186, 220, 252))
    _disc(buf, width, height, mx, my, 78, (255, 252, 246))
    _disc(buf, width, height, mx - 10, my - 12, 64, (255, 255, 255))

    for sx, sy, sr in (
        (150, 150, 2.2), (240, 210, 1.6), (390, 130, 2.0), (520, 180, 1.5),
        (610, 120, 1.8), (880, 360, 1.7), (180, 320, 1.4), (460, 250, 1.3),
    ):
        _disc(buf, width, height, sx, sy, sr, (255, 255, 255))

    for x in range(width):
        wave = 870 + math.sin(x / width * math.tau) * 16 + math.sin(x / 150) * 5
        for y in range(int(wave) - 5, int(wave) + 6):
            cover = 1 - abs((y + 0.5) - wave) / 2.4
            _put(buf, width, height, x, y, (255, 255, 255), cover)

    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    ppm = path.with_suffix(".ppm")
    header = f"P6\n{width} {height}\n255\n".encode("ascii")
    ppm.write_bytes(header + bytes(buf))
    title_file = path.with_suffix(".title.txt")
    kicker_file = path.with_suffix(".kicker.txt")
    title_file.write_text(title + "\n", encoding="utf-8")
    kicker_file.write_text("A BLUESKY CLIENT\n", encoding="utf-8")
    size = 118 if title.startswith("#") else 138
    filt = (
        f"drawtext=fontfile={FONT_LIGHT}:textfile={kicker_file}:fontsize=28:"
        f"fontcolor=white:x=(w-text_w)/2:y=(h/2)-112,"
        f"drawtext=fontfile={FONT_BOLD}:textfile={title_file}:fontsize={size}:"
        f"fontcolor=white:x=(w-text_w)/2:y=(h/2)-70:"
        f"shadowcolor=0x062448:shadowx=0:shadowy=5"
    )
    subprocess.run(
        ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(ppm), "-vf", filt, "-frames:v", "1", "-q:v", "2", str(path)],
        check=True,
    )
    ppm.unlink(missing_ok=True)
    title_file.unlink(missing_ok=True)
    kicker_file.unlink(missing_ok=True)


def build_avatars() -> tuple[Path, Path]:
    for font in (FONT_BOLD, FONT_LIGHT):
        if not Path(font).exists():
            raise SystemExit(f"Missing font {font}")
    feed = IMAGE_DIR / "libresky-feed.jpg"
    tag = IMAGE_DIR / "libresky-tag.jpg"
    draw_icon("LibreSky", feed)
    draw_icon("#LibreSky", tag)
    return feed, tag


# --- records ---------------------------------------------------------------


def blocks_for(pattern: str, drop_replies: bool) -> list[dict]:
    blocks = [{"id": new_tid(), "type": "input", "inputType": "firehose"}]
    if drop_replies:
        blocks.append({"id": new_tid(), "type": "remove", "subject": "item", "value": "reply"})
    blocks.append({"id": new_tid(), "type": "regex", "value": pattern, "caseSensitive": False})
    blocks.append({"id": new_tid(), "type": "sort", "sortType": "created_at"})
    return blocks


def feed_specs() -> list[dict]:
    main = (
        "Tracking LibreSky, a free Bluesky client in the browser. "
        "Edit, AI, voice, video, and chat. The password stays with Bluesky.\n"
        + LINK
    )
    tag = (
        "Tracking #LibreSky. Posts with the tag land here, newest first. "
        "Replies stay in."
    )
    return [
        {
            "rkey": RKEY_FEED,
            "displayName": "LibreSky",
            "text": main,
            "url": LINK,
            "pattern": r"\bLibreSky\b",
            "drop_replies": True,
            "image": IMAGE_DIR / "libresky-feed.jpg",
        },
        {
            "rkey": RKEY_TAG,
            "displayName": "#LibreSky",
            "text": tag,
            "url": None,
            "pattern": r"#LibreSky\b",
            "drop_replies": False,
            "image": IMAGE_DIR / "libresky-tag.jpg",
        },
    ]


def remember_created(existing: dict | None) -> str:
    if existing:
        created = (existing.get("value") or {}).get("createdAt")
        if created:
            return created
    return now_iso()


def publish_feeds(pds: str, token: str, did: str, specs: list[dict]) -> list[str]:
    uris = []
    for spec in specs:
        if len(spec["displayName"]) > 24:
            raise SystemExit(f"Feed name is too long: {spec['displayName']}")
        spec["blocks"] = blocks_for(spec["pattern"], spec["drop_replies"])
        text = with_facets(spec["text"], spec["url"])
        collection = "app.bsky.feed.generator"
        existing = get_record(pds, token, did, collection, spec["rkey"])
        record = {
            "$type": collection,
            "did": SERVICE_DID,
            "displayName": spec["displayName"],
            "avatar": upload_image(pds, token, spec["image"]),
            "createdAt": remember_created(existing),
            "skyfeedBuilder": {
                "displayName": spec["displayName"],
                "license": LICENSE,
                "blocks": spec["blocks"],
            },
            **text,
        }
        put = put_record(pds, token, did, collection, spec["rkey"], record)
        uri = put.get("uri") or f"at://{did}/{collection}/{spec['rkey']}"
        uris.append(uri)
        log(f"feed {spec['displayName']} {uri}")
    return uris


def load_published() -> dict:
    if not PUBLISHED_PATH.exists():
        return {}
    try:
        return json.loads(PUBLISHED_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def save_published(data: dict) -> None:
    PUBLISHED_PATH.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def stable_tid(data: dict, name: str) -> str:
    """Lists and starter packs only accept TID record keys. Keep one per object."""
    current = data.get(name)
    if isinstance(current, str) and len(current) == 13:
        return current
    data[name] = new_tid()
    save_published(data)
    return data[name]


def publish_list(pds: str, token: str, did: str, avatar: dict, rkey: str, item_rkey: str) -> str:
    collection = "app.bsky.graph.list"
    existing = get_record(pds, token, did, collection, rkey)
    text = with_facets("People to follow with LibreSky. The client ships from this account.")
    record = {
        "$type": collection,
        "purpose": "app.bsky.graph.defs#curatelist",
        "name": "LibreSky",
        "avatar": avatar,
        "createdAt": remember_created(existing),
        **text,
    }
    put = put_record(pds, token, did, collection, rkey, record)
    uri = put.get("uri") or f"at://{did}/{collection}/{rkey}"
    item_collection = "app.bsky.graph.listitem"
    existing_item = get_record(pds, token, did, item_collection, item_rkey)
    put_record(pds, token, did, item_collection, item_rkey, {
        "$type": item_collection,
        "subject": did,
        "list": uri,
        "createdAt": remember_created(existing_item),
    })
    log(f"list {uri}")
    return uri


def publish_pack(pds: str, token: str, did: str, list_uri: str, feed_uris: list[str], rkey: str) -> str:
    collection = "app.bsky.graph.starterpack"
    existing = get_record(pds, token, did, collection, rkey)
    text = with_facets(
        "LibreSky, a free Bluesky client in the browser, and the feeds that watch it. "
        "Edit, AI, voice, video, and chat. The password stays with Bluesky.\n" + LINK,
        LINK,
    )
    record = {
        "$type": collection,
        "name": "LibreSky",
        "list": list_uri,
        "feeds": [{"uri": uri} for uri in feed_uris],
        "createdAt": remember_created(existing),
        **text,
    }
    if len(record["name"]) > 50:
        raise SystemExit("Starter pack name is too long.")
    put = put_record(pds, token, did, collection, rkey, record)
    uri = put.get("uri") or f"at://{did}/{collection}/{rkey}"
    log(f"starter pack {uri}")
    return uri


def pin_feeds(token: str, feed_uris: list[str], specs: list[dict]) -> None:
    prefs = call(f"{ENTRYWAY}/xrpc/app.bsky.actor.getPreferences", token)
    items = prefs.get("preferences") or []
    PREFS_BACKUP.write_text(json.dumps(prefs, indent=2), encoding="utf-8")
    before = len(items)

    saved = next((item for item in items if item.get("$type") == "app.bsky.actor.defs#savedFeedsPrefV2"), None)
    if saved is None:
        saved = {"$type": "app.bsky.actor.defs#savedFeedsPrefV2", "items": []}
        items.append(saved)
    have = {entry.get("value") for entry in saved.get("items") or []}
    for uri in reversed(feed_uris):
        if uri in have:
            for entry in saved["items"]:
                if entry.get("value") == uri:
                    entry["pinned"] = True
            continue
        saved["items"].insert(0, {"id": new_tid(), "type": "feed", "value": uri, "pinned": True})

    legacy = next((item for item in items if item.get("$type") == "app.bsky.actor.defs#savedFeedsPref"), None)
    if legacy is not None:
        pinned = legacy.setdefault("pinned", [])
        for uri in reversed(feed_uris):
            if uri not in pinned:
                pinned.insert(0, uri)

    sky = next((item for item in items if item.get("$type") == "app.bsky.actor.defs#skyfeedBuilderFeedsPref"), None)
    if sky is None:
        sky = {"$type": "app.bsky.actor.defs#skyfeedBuilderFeedsPref", "feeds": []}
        items.append(sky)
    built = {entry.get("id"): entry for entry in sky.get("feeds") or []}
    stamps = sky.setdefault("crdtFeedLastChangeTimestamps", {})
    for spec in specs:
        recipe = {
            "id": spec["rkey"],
            "published": True,
            "feed": {
                "displayName": spec["displayName"],
                "license": LICENSE,
                "blocks": spec["blocks"],
            },
        }
        if spec["rkey"] in built:
            built[spec["rkey"]].update(recipe)
        else:
            sky.setdefault("feeds", []).append(recipe)
        stamps[spec["rkey"]] = int(time.time())

    call(f"{ENTRYWAY}/xrpc/app.bsky.actor.putPreferences", token, {"preferences": items})
    if len(items) < before:
        raise SystemExit("Preferences shrank. Backup is at " + str(PREFS_BACKUP))
    log(f"pinned {len(feed_uris)} feeds, preferences {before} -> {len(items)}")


def publish() -> None:
    build_avatars()
    env = load_env()
    session, token = create_session(env)
    did = session["did"]
    pds = pds_of(session).rstrip("/")
    specs = feed_specs()
    uris = publish_feeds(pds, token, did, specs)
    published = load_published()
    list_rkey = stable_tid(published, "listRkey")
    item_rkey = stable_tid(published, "listItemRkey")
    pack_rkey = stable_tid(published, "packRkey")
    avatar = upload_image(pds, token, IMAGE_DIR / "libresky-feed.jpg")
    list_uri = publish_list(pds, token, did, avatar, list_rkey, item_rkey)
    pack_uri = publish_pack(pds, token, did, list_uri, uris, pack_rkey)
    pin_feeds(token, uris, specs)
    handle = session.get("handle") or HANDLE
    published["feeds"] = uris
    published["listUri"] = list_uri
    published["packUri"] = pack_uri
    save_published(published)
    print(f"https://bsky.app/profile/{handle}/feed/{RKEY_FEED}")
    print(f"https://bsky.app/profile/{handle}/feed/{RKEY_TAG}")
    print(f"https://bsky.app/starter-pack/{handle}/{pack_rkey}")
    print(pack_uri)


# --- tracking --------------------------------------------------------------


def search_tag(token: str) -> list[dict]:
    url = f"{ENTRYWAY}/xrpc/app.bsky.feed.searchPosts?" + urllib.parse.urlencode({
        "q": "#LibreSky",
        "sort": "latest",
        "limit": 40,
    })
    data = call(url, token)
    found = []
    for post in data.get("posts") or []:
        uri = post.get("uri") or ""
        if not uri:
            continue
        record = post.get("record") or {}
        found.append({
            "uri": uri,
            "cid": post.get("cid") or "",
            "handle": (post.get("author") or {}).get("handle") or "",
            "text": " ".join((record.get("text") or "").split()),
            "at": record.get("createdAt") or "",
        })
    return found


def track(baseline: bool) -> int:
    env = load_env()
    session, token = create_session(env)
    del session
    found = search_tag(token)
    state = {}
    if TRACK_PATH.exists():
        try:
            state = json.loads(TRACK_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            state = {}
    seen = set(state.get("seen") or [])
    fresh = [post for post in found if post["uri"] not in seen]
    first = not seen
    for post in found:
        seen.add(post["uri"])
    remembered = sorted(seen)[-500:]
    TRACK_PATH.write_text(
        json.dumps({"seen": remembered, "latest": found[:20]}, indent=2),
        encoding="utf-8",
    )
    if first or baseline:
        log(f"track baseline {len(found)} posts with #LibreSky")
        return 0
    if not fresh:
        log("track quiet")
        return 0
    for post in fresh:
        log(f"track new @{post['handle']} {post['uri']} {post['text'][:140]}")
    return 0


def selftest() -> None:
    seen = set()
    for _ in range(5):
        tid = new_tid()
        assert len(tid) == 13, tid
        assert tid not in seen
        seen.add(tid)
    sample = feed_specs()
    assert sample[0]["pattern"] == r"\bLibreSky\b"
    assert "#LibreSky" in sample[1]["text"]
    public = " ".join(spec["text"] for spec in sample)
    assert "Grok" not in public
    print("selftest ok", " ".join(sorted(seen)))


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Publish LibreSky feeds and track #LibreSky.")
    parser.add_argument("command", choices=("avatars", "publish", "track", "selftest"))
    parser.add_argument("--baseline", action="store_true", help="Record current #LibreSky posts without logging them as new.")
    args = parser.parse_args(argv)
    if args.command == "selftest":
        selftest()
        return 0
    if args.command == "avatars":
        feed, tag = build_avatars()
        print(feed)
        print(tag)
        return 0
    if args.command == "publish":
        publish()
        return 0
    return track(args.baseline)


if __name__ == "__main__":
    raise SystemExit(main(__import__("sys").argv[1:]))
