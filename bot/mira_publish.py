#!/usr/bin/env python3
"""Mira on The White Witch, and on Bluesky when the piece is long.

Blog, every afternoon, Europe/Berlin, sometime after 14:15. About two days a week it skips.
No picture. The note stays on the site.

Article, Sunday late morning, Europe/Berlin. About one week in four it skips.
The piece goes on the site. Bluesky gets a short intro, the link, a picture
of her, and #MiraWantsToTalk.

The first roll for a day or a week sticks. A timer that fires twice does not
post twice, and it does not roll again.

Fresh text comes from one `grok --single` call at low effort, tools off,
memory off, and a short system prompt. The default high-effort session is
what exhausted the Super balance. If that call fails, nothing is published.
A payment failure is not tried twice. A draft that fails the checks is not
published either.

Bluesky credentials stay in ~/.config/thewhitewitch/bsky.env.
"""

from __future__ import annotations

import argparse
import fcntl
import json
import os
import random
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

import bsky_grok as bsky

SITE = Path("/home/andreas/Projects/whitewitch")
BLOG_DIR = SITE / "collections" / "_blog"
ARTICLE_DIR = SITE / "collections" / "_articles"
MIRA = SITE / "assets" / "images" / "mira.jpg"
GROK = Path.home() / ".grok" / "bin" / "grok"
STATE_DIR = Path.home() / ".local" / "state" / "thewhitewitch"
STATE_PATH = STATE_DIR / "mira-publish.json"
LOG_PATH = STATE_DIR / "mira-publish.log"
LOCK_PATH = STATE_DIR / "mira-publish.lock"
SITE_BASE = "https://thewhitewitchtm.github.io/whitewitch"
TAG = "MiraWantsToTalk"
SKIP = {"blog": 0.30, "article": 0.25}
FONT = "/usr/share/fonts/opentype/fira/FiraSans-ExtraBold.otf"
W = H = 1200

NEWS = {
    "trump": "https://news.google.com/rss/search?q=Donald+Trump+when:7d&hl=en-US&gl=US&ceid=US:en",
    "ukraine": "https://news.google.com/rss/search?q=Ukraine+OR+Putin+when:7d&hl=en-US&gl=US&ceid=US:en",
    "musk": "https://news.google.com/rss/search?q=%22Elon+Musk%22+OR+%22RFK%22+when:7d&hl=en-US&gl=US&ceid=US:en",
    "maga": "https://news.google.com/rss/search?q=%22MAGA%22+OR+%22Make+America+Great+Again%22+when:7d&hl=en-US&gl=US&ceid=US:en",
}

LANES = (
    "the site, a tool, or the feed itself. One irritation. No product pitch.",
    "old machines, old games, or the languages she writes. Dry. No tutorial.",
    "a small social annoyance. She declines the performance and pours the tea.",
    "a number she saw, and why the caption is doing too much work. Short.",
    "being tired of the timeline. Dark, not tragic. She does not recruit.",
)


def mira_log(msg: str) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    line = f"{bsky.berlin_now().isoformat(timespec='seconds')} {msg}\n"
    with LOG_PATH.open("a", encoding="utf-8") as fh:
        fh.write(line)
    print(line, end="")


def load_state() -> dict:
    if not STATE_PATH.exists():
        return {"decisions": {}, "posted": {}}
    try:
        data = json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {"decisions": {}, "posted": {}}
    data.setdefault("decisions", {})
    data.setdefault("posted", {})
    return data


def save_state(state: dict) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    tmp = STATE_PATH.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")
    tmp.replace(STATE_PATH)


def period_key(kind: str, now: datetime) -> str:
    if kind == "blog":
        return now.date().isoformat()
    year, week, _day = now.isocalendar()
    return f"{year}-W{week:02d}"


def decide(kind: str, now: datetime, state: dict, force: bool, dry_run: bool) -> str:
    """Return post, skip, or done. The roll is stored, so a retry keeps it."""
    key = f"{kind}:{period_key(kind, now)}"
    if state["posted"].get(key) and not force:
        return "done"
    if force:
        return "post"
    decision = state["decisions"].get(key)
    if decision is None:
        roll = random.Random(f"mira:{key}").random()
        decision = "skip" if roll < SKIP[kind] else "post"
        if dry_run:
            mira_log(f"dry-run {kind} would {decision}")
            return decision
        state["decisions"][key] = decision
        save_state(state)
        mira_log(f"roll {kind} {key} {decision}")
    return decision


def yaml_quote(text: str) -> str:
    return '"' + text.replace("\\", "\\\\").replace('"', '\\"') + '"'


def titles_in(folder: Path) -> list[str]:
    found = []
    if not folder.exists():
        return found
    for path in sorted(folder.glob("*.md")):
        match = re.search(r'^title:\s*"?(.*?)"?\s*$', path.read_text(encoding="utf-8"), re.M)
        if match:
            found.append(match.group(1).strip().strip('"'))
    return found


def slugify(title: str) -> str:
    text = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return text[:58].strip("-") or "note"


def words(text: str) -> int:
    return len(re.findall(r"\S+", text))


def strip_fence(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```[a-zA-Z]*\n", "", text)
        text = re.sub(r"\n```$", "", text)
    return text.strip()


def front_matter(text: str) -> tuple[dict, str]:
    text = strip_fence(text)
    start = text.find("\n---")
    if text.startswith("---"):
        start = 0
    elif start >= 0:
        start += 1
    else:
        raise ValueError("draft has no front matter")
    text = text[start:]
    end = text.find("\n---", 3)
    if end < 0:
        raise ValueError("front matter does not close")
    raw = text[3:end].strip()
    body = text[end + 4 :].strip()
    meta = {}
    for line in raw.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        meta[key.strip()] = value.strip().strip('"').strip("'")
    return meta, body


def spend_held(slot: str = "blog") -> str:
    import importlib.util

    path = Path("/home/andreas/Projects/bots/credits.py")
    weight = "spare" if slot == "article" else "light"
    name = slot if slot in {"blog", "article"} else "blog"
    try:
        spec = importlib.util.spec_from_file_location("hearth_credits", path)
        if spec is None or spec.loader is None:
            raise ImportError(str(path))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        return mod.allow(weight, name)
    except Exception:
        return "Credits did not answer. Model jobs are held."


def screen(text: str) -> None:
    if bsky.THREAT_RE.search(text) or bsky.SLUR_RE.search(text):
        raise SystemExit("Draft failed the safety check.")
    if bsky.CREDIT_RE.search(text) or re.search(r"\b(chatgpt|claude)\b", text, re.I):
        raise SystemExit("Draft names the writer.")


def balance_spent(detail: str) -> bool:
    low = detail.lower()
    return "402" in detail or "usage balance" in low or "payment required" in low


def ask_grok(prompt: str, slot: str = "blog") -> str:
    held = spend_held(slot)
    if held:
        raise RuntimeError(held)
    # Tools stay off. With them on, a long prompt spends its one turn calling
    # a tool and comes back empty. cwd is /tmp so the session is not this repo.
    # grok-4.7 Fast bills double. High effort is the default and the expensive part.
    env = os.environ.copy()
    env["GROK_MEMORY"] = "0"
    env["GROK_DISABLE_AUTOUPDATER"] = "1"
    cmd = [
        str(GROK),
        "--single",
        prompt,
        "-m",
        "grok-4.7",
        "--effort",
        "low",
        "--max-turns",
        "1",
        "--no-subagents",
        "--disable-web-search",
        "--no-plan",
        "--no-auto-update",
        "--tools",
        "",
        "--output-format",
        "plain",
        "--system-prompt-override",
        style_card(),
    ]
    try:
        done = subprocess.run(
            cmd,
            check=True,
            capture_output=True,
            text=True,
            timeout=240,
            cwd="/tmp",
            env=env,
        )
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, OSError) as exc:
        detail = getattr(exc, "stderr", "") or getattr(exc, "stdout", "") or str(exc)
        raise RuntimeError(str(detail)[-400:]) from exc
    text = done.stdout.strip()
    if not text:
        raise RuntimeError(done.stderr[-400:] or "empty")
    return text


def complete(prompt: str, slot: str = "blog") -> str:
    last = "no attempt"
    for attempt in (1, 2):
        try:
            text = ask_grok(prompt, slot)
        except RuntimeError as exc:
            last = str(exc)
            mira_log(f"grok attempt {attempt} failed: {last[-240:]}")
            if balance_spent(last) or "Model jobs are held." in last or "jobs wait" in last or "take turns" in last:
                break
            continue
        if text:
            mira_log("draft from grok")
            return text
        last = "empty"
    raise SystemExit(f"Writer failed. Nothing published. {last[-240:]}")


def style_card() -> str:
    return (
        "You are Mira. She publishes The White Witch. Born in the 1970s. "
        "Dry, dark humor, sarcasm as the default, facts before the caption. "
        "Trump, Musk, and MAGA are fair game when the notes support the joke. "
        "She got the audience by mocking the decision and the person who made it. "
        "She does not recruit, does not sell, and does not perform a team. "
        "A tip link does not belong in the piece. "
        "Short sentences are allowed to be mean. She names the number when she has one. "
        "No hashtags. One emoji, and only the one in the heading. "
        "No threats, no slurs, no instructions for harm. Mock the decision and the person who made it. "
        "Do not invent quotes, dates, totals, or studies. If a fact is not in the notes below, leave it out. "
        "The first characters of your reply are three dashes. No preamble, no code fence."
    )


def news_notes() -> str:
    # Two headlines from each lane, so Trump does not eat Musk and MAGA.
    items: list[str] = []
    for url in NEWS.values():
        try:
            root = ET.fromstring(bsky.fetch_bytes(url))
        except (ET.ParseError, OSError, TimeoutError) as exc:
            mira_log(f"feed skipped: {type(exc).__name__}")
            continue
        got = 0
        for item in root.findall("./channel/item")[:8]:
            headline, _source = bsky.split_title(item.findtext("title") or "")
            headline = re.sub(r"\s+", " ", headline).strip()
            if len(headline) < 28 or headline in items:
                continue
            items.append(headline)
            got += 1
            if got >= 2:
                break
    return "\n".join(f"- {line}" for line in items)


def blog_prompt(now: datetime) -> str:
    lane = LANES[now.toordinal() % len(LANES)]
    recent = titles_in(BLOG_DIR)[-8:]
    avoid = "\n".join(f"- {title}" for title in recent) or "- (none)"
    return (
        "Write one blog note. 180 to 320 words. No picture. No article, no news digest.\n"
        f"Lane for today: {lane}\n"
        "Do not reuse these titles or their subjects:\n"
        f"{avoid}\n\n"
        "Shape, with the examples replaced by the real note:\n"
        "---\n"
        "title: \"The Kettle Finished Before I Did\"\n"
        "description: \"A short line in her voice, 50 to 150 characters, about this note.\"\n"
        "tags: [meta, humor]\n"
        "emoji: \"🫖\"\n"
        "---\n\n"
        "## 🫖 The real title\n\n"
        "Two to five short sections of prose. End on a dry line. "
        "She may close with you're welcome, or sorry, if it earns it.\n"
        f"Today is {now.date().isoformat()}. Do not print that date in the note. Do not mention a schedule, a bot, or a model."
    )


def article_prompt(now: datetime, notes: str) -> str:
    recent = titles_in(ARTICLE_DIR)[-8:]
    avoid = "\n".join(f"- {title}" for title in recent) or "- (none)"
    return (
        "Write one long article, 900 to 1300 words, for the articles collection. "
        "Politics, history, or a public claim that fails the data. "
        "Same dark humor as her piece on Russian diesel and her piece on Columbus: "
        "the documents first, the knife at the end.\n"
        "Headlines from the last week, and the only facts you may use:\n"
        f"{notes}\n\n"
        "Do not repeat these pieces:\n"
        f"{avoid}\n\n"
        "Shape, with the examples replaced by the real piece:\n"
        "---\n"
        "title: \"The Number Was Smaller Than the Podium\"\n"
        "description: \"One sentence in her voice, 50 to 170 characters.\"\n"
        "tags: [politics, us]\n"
        "bsky: \"Two short sentences. Under 150 characters. No link. No hashtag.\"\n"
        "emoji: \"🕯️\"\n"
        "---\n\n"
        "## 🕯️ The real title\n\n"
        "Use ## section headings. Name an outlet only if the headline supports it. "
        "The last section should land the joke, not summarize. "
        f"Today is {now.date().isoformat()}. Do not print that date in the note. Do not mention a schedule, a bot, or a model."
    )


def parse_tags(raw: str) -> list[str]:
    raw = raw.strip().strip("[]")
    return [part.strip().strip('"').strip("'") for part in raw.split(",") if part.strip()]


def build_markdown(kind: str, draft: str, now: datetime) -> tuple[Path, dict, str]:
    meta, body = front_matter(draft)
    title = re.sub(r"\s+", " ", meta.get("title") or "").strip()
    description = re.sub(r"\s+", " ", meta.get("description") or "").strip()
    emoji = (meta.get("emoji") or "🕯️").strip().split()[0]
    tags = parse_tags(meta.get("tags") or "")
    if not title or not description or not body.startswith("##"):
        raise SystemExit("Draft is missing a title, a description, or the heading.")
    if len(description) < 40 or re.search(r"\b(under \d+|one sentence|front matter|no emoji)\b", description, re.I):
        raise SystemExit("Description is an instruction, not a line.")
    if title in {"The Kettle Finished Before I Did", "The Number Was Smaller Than the Podium"}:
        raise SystemExit("Draft kept the example title.")
    if title.lower() in {item.lower() for item in titles_in(BLOG_DIR if kind == "blog" else ARTICLE_DIR)}:
        raise SystemExit(f"Title already exists: {title}")
    low, high = (140, 520) if kind == "blog" else (700, 1600)
    count = words(body)
    if not low <= count <= high:
        raise SystemExit(f"Draft is {count} words, outside {low}-{high}.")
    body = re.sub(r"(?m)^20\d{2}-\d{2}-\d{2}\s*\n", "", body, count=1)
    screen(f"{title}\n{description}\n{body}")
    bsky_line = re.sub(r"\s+", " ", meta.get("bsky") or description).strip()
    if len(bsky_line) > 160:
        bsky_line = bsky_line[:157].rstrip() + "..."
    folder = BLOG_DIR if kind == "blog" else ARTICLE_DIR
    path = folder / f"{now.date().isoformat()}-{slugify(title)}.md"
    if path.exists():
        raise SystemExit(f"File already exists: {path}")
    tag_line = ", ".join(tags[:4] or (["meta"] if kind == "blog" else ["politics"]))
    extra = ""
    if kind == "blog":
        extra = "featured: true\n"
    else:
        extra = f"highlight: true\nbsky: {yaml_quote(bsky_line)}\n"
    text = (
        "---\n"
        "layout: default\n"
        f"title: {yaml_quote(title)}\n"
        f"date: {now.date().isoformat()}\n"
        f"{extra}"
        f"description: {yaml_quote(description)}\n"
        f"tags: [{tag_line}]\n"
        f"emoji: {yaml_quote(emoji)}\n"
        "---\n\n"
        f"{body.strip()}\n"
    )
    # The heading must carry the emoji even if the model forgot it.
    if not body.lstrip().startswith(f"## {emoji}"):
        text = text.replace(f"## {title}", f"## {emoji} {title}", 1)
    info = {"title": title, "description": description, "bsky": bsky_line, "emoji": emoji, "tags": tag_line}
    return path, info, text


def commit_and_push(path: Path, message: str) -> None:
    rel = path.relative_to(SITE).as_posix()
    staged = subprocess.run(
        ["git", "-C", str(SITE), "diff", "--cached", "--name-only"],
        check=True,
        capture_output=True,
        text=True,
    )
    others = [name for name in staged.stdout.splitlines() if name and name != rel]
    if others:
        raise SystemExit(f"Other files are already staged: {', '.join(others)}")
    subprocess.run(["git", "-C", str(SITE), "add", "--", rel], check=True)
    quiet = subprocess.run(["git", "-C", str(SITE), "diff", "--cached", "--quiet"])
    if quiet.returncode == 0:
        mira_log(f"already committed {rel}")
    else:
        subprocess.run(["git", "-C", str(SITE), "commit", "-m", message], check=True)
        mira_log(f"committed {rel}")
    status = subprocess.run(
        ["git", "-C", str(SITE), "status", "-sb"],
        check=True,
        capture_output=True,
        text=True,
    )
    if "ahead" in status.stdout.splitlines()[0]:
        subprocess.run(["git", "-C", str(SITE), "push", "origin", "HEAD"], check=True)
        mira_log("pushed")


def public_url(path: Path) -> str:
    collection = "blog" if "_blog" in path.parts else "articles"
    return f"{SITE_BASE}/{collection}/{path.stem}.html"


def compose_post(info: dict, url: str) -> str:
    intro = info["bsky"]
    emoji = info.get("emoji") or "🕯️"
    while True:
        text = f"{emoji} {intro}\n\n{url}\n\n#{TAG}"
        if len(text) <= bsky.LIMIT or " " not in intro:
            break
        intro = " ".join(intro.split()[:-1]).rstrip(" .,;:")
    if len(text) > bsky.LIMIT:
        raise SystemExit(f"Bluesky post is {len(text)} characters.")
    screen(text)
    return text


def facets_for(text: str, url: str) -> list[dict]:
    found = []
    start = text.rfind(url)
    if start < 0:
        raise SystemExit("Link missing from the Bluesky post.")
    byte_start = len(text[:start].encode("utf-8"))
    found.append(
        {
            "index": {"byteStart": byte_start, "byteEnd": byte_start + len(url.encode("utf-8"))},
            "features": [{"$type": "app.bsky.richtext.facet#link", "uri": url}],
        }
    )
    hashed = f"#{TAG}"
    hash_at = text.rfind(hashed)
    hash_byte = len(text[:hash_at].encode("utf-8"))
    found.append(
        {
            "index": {"byteStart": hash_byte, "byteEnd": hash_byte + len(hashed.encode("utf-8"))},
            "features": [{"$type": "app.bsky.richtext.facet#tag", "tag": TAG}],
        }
    )
    return found


def publish(text: str, image: Path, alt: str, url: str) -> str:
    env = bsky.load_env()
    session, token = bsky.create_session(env)
    did = session["did"]
    base = bsky.pds_of(session)
    try:
        blob = bsky.upload_image(base, token, image)
    except SystemExit:
        base = bsky.ENTRYWAY
        blob = bsky.upload_image(base, token, image)
    record = {
        "$type": "app.bsky.feed.post",
        "text": text,
        "createdAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z",
        "langs": ["en"],
        "facets": facets_for(text, url),
        "embed": {
            "$type": "app.bsky.embed.images",
            "images": [
                {
                    "alt": alt[:1000],
                    "image": blob,
                    "aspectRatio": {"width": W, "height": H},
                }
            ],
        },
    }
    created = bsky.request(
        f"{base}/xrpc/com.atproto.repo.createRecord",
        token,
        {"repo": did, "collection": "app.bsky.feed.post", "record": record},
    )
    uri = created.get("uri", "")
    rkey = uri.rsplit("/", 1)[-1]
    return f"https://bsky.app/profile/{session.get('handle', bsky.HANDLE_DEFAULT)}/post/{rkey}"


def wrap_title(title: str) -> tuple[str, int]:
    for size, limit in ((46, 26), (40, 30), (34, 36)):
        lines: list[str] = []
        cur = ""
        for word in title.split():
            trial = word if not cur else f"{cur} {word}"
            if len(trial) <= limit:
                cur = trial
                continue
            if cur:
                lines.append(cur)
            cur = word
        if cur:
            lines.append(cur)
        if len(lines) <= 4:
            return "\n".join(lines), size
    return "\n".join(lines[:4]), 34


def render_card(title: str, dest: Path) -> str:
    if not MIRA.exists():
        raise SystemExit(f"No portrait at {MIRA}")
    dest.parent.mkdir(parents=True, exist_ok=True)
    headline, size = wrap_title(title)
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        kicker = tmp_path / "kicker.txt"
        head = tmp_path / "head.txt"
        kicker.write_text("MIRA WANTS TO TALK\n", encoding="utf-8")
        head.write_text(headline + "\n", encoding="utf-8")
        # Her portrait is tall and already on black. Fill the square from the
        # left of the frame so the face and the pointing hand stay, then put
        # the headline on a dark band. Text stays in the font, not the photo.
        filt = (
            "[1:v]scale=1200:-1:flags=lanczos,crop=1200:1200:0:620,format=rgba[photo];"
            "[photo]drawbox=x=0:y=820:w=1200:h=380:color=0x12060A@0.86:t=fill[band];"
            f"[band]drawtext=fontfile={FONT}:textfile={kicker}:expansion=none:"
            f"fontcolor=0xE0A44E:fontsize=28:x=72:y=860,"
            f"drawtext=fontfile={FONT}:textfile={head}:expansion=none:"
            f"fontcolor=0xF6EFE6:fontsize={size}:x=72:y=910:line_spacing=8[out]"
        )
        cmd = [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-f",
            "lavfi",
            "-i",
            "color=c=0x12060A:s=1200x1200",
            "-i",
            str(MIRA),
            "-filter_complex",
            filt,
            "-map",
            "[out]",
            "-frames:v",
            "1",
            "-q:v",
            "4",
            str(dest),
        ]
        try:
            subprocess.run(cmd, check=True)
        except subprocess.CalledProcessError:
            kicker.write_text("MIRA WANTS TO TALK\n", encoding="ascii")
            head.write_text(bsky.latin_fold(headline) + "\n", encoding="utf-8")
            subprocess.run(cmd, check=True)
    if dest.stat().st_size > 950_000:
        subprocess.run(
            ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(dest), "-q:v", "8", str(dest)],
            check=True,
        )
    return (
        "Mira, red hair in a high ponytail, black blazer, red lipstick, pointing, "
        f"on a dark field. Gold kicker: Mira wants to talk. The headline reads: {title}"
    )[:1000]


def mark(kind: str, now: datetime, state: dict, url: str) -> None:
    key = f"{kind}:{period_key(kind, now)}"
    state["decisions"][key] = "post"
    state["posted"][key] = {"at": now.isoformat(timespec="seconds"), "url": url}
    save_state(state)


def read_existing(path: Path) -> dict:
    meta, body = front_matter(path.read_text(encoding="utf-8"))
    title = meta.get("title") or ""
    info = {
        "title": title,
        "description": meta.get("description") or title,
        "bsky": meta.get("bsky") or meta.get("description") or title,
        "emoji": meta.get("emoji") or "🕯️",
    }
    if not body.strip():
        raise SystemExit(f"Empty piece at {path}")
    return info


def run_blog(now: datetime, state: dict, force: bool, dry_run: bool) -> int:
    decision = decide("blog", now, state, force, dry_run)
    if decision == "done":
        mira_log("skip blog: already posted today")
        return 0
    if decision == "skip":
        mira_log("skip blog: this day rolled a skip")
        return 0
    draft = complete(blog_prompt(now), "blog")
    try:
        path, info, text = build_markdown("blog", draft, now)
    except (ValueError, SystemExit) as exc:
        mira_log(f"rejected blog draft: {draft[:500]!r}")
        if isinstance(exc, ValueError):
            raise SystemExit(str(exc)) from exc
        raise
    if dry_run:
        print(text)
        print(f"words {words(text)}")
        return 0
    path.write_text(text, encoding="utf-8")
    commit_and_push(path, f"Blog: {info['title'][:72]}")
    url = public_url(path)
    mark("blog", now, state, url)
    mira_log(f"posted blog {url}")
    return 0


def run_article(now: datetime, state: dict, force: bool, dry_run: bool) -> int:
    decision = decide("article", now, state, force, dry_run)
    if decision == "done":
        mira_log("skip article: already posted this week")
        return 0
    if decision == "skip":
        mira_log("skip article: this week rolled a skip")
        return 0
    notes = news_notes()
    if notes.count("\n") < 2:
        raise SystemExit("Not enough headlines to write from. Article not published.")
    draft = complete(article_prompt(now, notes), "article")
    path, info, text = build_markdown("article", draft, now)
    url = public_url(path)
    image = STATE_DIR / "images" / f"mira-{path.stem}.jpg"
    alt = render_card(info["title"], image)
    post = compose_post(info, url)
    if dry_run:
        print(text)
        print("---")
        print(post)
        print(f"image {image}")
        print(f"chars {len(post)}")
        return 0
    path.write_text(text, encoding="utf-8")
    commit_and_push(path, f"Article: {info['title'][:72]}")
    bsky_url = publish(post, image, alt, url)
    mark("article", now, state, bsky_url)
    mira_log(f"posted article {url} {bsky_url}")
    return 0


def run_announce(path: Path, now: datetime, state: dict, dry_run: bool) -> int:
    if not path.is_file():
        raise SystemExit(f"No article at {path}")
    info = read_existing(path)
    url = public_url(path)
    image = STATE_DIR / "images" / f"mira-{path.stem}.jpg"
    alt = render_card(info["title"], image)
    post = compose_post(info, url)
    if dry_run:
        print(post)
        print(f"image {image}")
        print(f"alt {alt}")
        print(f"chars {len(post)}")
        return 0
    commit_and_push(path, f"Article: {info['title'][:72]}")
    bsky_url = publish(post, image, alt, url)
    mark("article", now, state, bsky_url)
    mira_log(f"announced {url} {bsky_url}")
    return 0


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Publish Mira on the site, and articles on Bluesky.")
    parser.add_argument("slot", choices=["blog", "article", "announce"])
    parser.add_argument("path", nargs="?", help="Article file, for announce.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true", help="Post even if this day or week already rolled.")
    parser.add_argument("--mark", help="Record this period as already posted, with this URL. Do not write.")
    args = parser.parse_args(argv)

    STATE_DIR.mkdir(parents=True, exist_ok=True)
    lock_fh = LOCK_PATH.open("a", encoding="utf-8")
    try:
        fcntl.flock(lock_fh, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        mira_log(f"skip {args.slot}: another run is already going")
        return 0
    now = bsky.berlin_now()
    state = load_state()
    try:
        if args.mark:
            mark(args.slot if args.slot != "announce" else "article", now, state, args.mark)
            mira_log(f"marked {args.slot} {args.mark}")
            return 0
        if args.slot == "blog":
            return run_blog(now, state, args.force, args.dry_run)
        if args.slot == "article":
            return run_article(now, state, args.force, args.dry_run)
        if not args.path:
            raise SystemExit("announce needs the article file.")
        return run_announce(Path(args.path), now, state, args.dry_run)
    except SystemExit as err:
        if err.code not in (0, None):
            mira_log(f"fail {args.slot}: {err}")
        raise
    finally:
        fcntl.flock(lock_fh, fcntl.LOCK_UN)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
