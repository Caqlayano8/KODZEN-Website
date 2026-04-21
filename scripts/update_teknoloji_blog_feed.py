#!/usr/bin/env python3
"""
Builds a fresh, curated technology blog feed JSON for teknoloji-blog.html.

Design goals:
- Pull from reputable and frequently-updated RSS sources.
- Keep only newest records (old content is naturally dropped each run).
- Produce deterministic output so Git commits only when data changes.
"""

from __future__ import annotations

import hashlib
import html
import json
import re
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Iterable
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET


ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
OUTPUT_FILE = DATA_DIR / "tech-blog-feed.json"

USER_AGENT = "Mozilla/5.0 (compatible; KODZENBot/1.0; +https://kodzen.io/)"
MAX_PER_CATEGORY = 6
FRESH_DAYS = 45
TRANSLATE_TO_TR = True
TRANSLATION_ENDPOINT = "https://translate.googleapis.com/translate_a/single"
TRANSLATION_MAX_CHARS = 500


@dataclass(frozen=True)
class FeedSource:
    url: str
    source_name: str
    tags: tuple[str, ...]


CATEGORIES: dict[str, dict] = {
    "yazilim": {
        "label": "Yazilim Gelistirme",
        "default_tags": ("Software", "Dev", "Engineering"),
        "feeds": (
            FeedSource("https://github.blog/feed/", "GitHub Blog", ("GitHub", "Dev", "Platform")),
            FeedSource("https://devblogs.microsoft.com/feed/", "Microsoft DevBlogs", ("Microsoft", "Dev", "Cloud")),
        ),
        "keywords": (
            "software", "developer", "development", "programming", "framework",
            "api", "backend", "frontend", "engineering", "release", "tooling",
        ),
    },
    "ai": {
        "label": "Yapay Zeka",
        "default_tags": ("AI", "ML", "LLM"),
        "feeds": (
            FeedSource("https://openai.com/news/rss.xml", "OpenAI News", ("AI", "OpenAI", "Model")),
            FeedSource("https://research.google/blog/rss/", "Google Research Blog", ("AI", "Research", "Google")),
            FeedSource("https://blog.google/technology/ai/rss/", "Google AI Blog", ("AI", "Product", "Google")),
        ),
        "keywords": (
            "ai", "artificial intelligence", "model", "llm", "agent", "reasoning",
            "inference", "machine learning", "deep learning", "generative",
        ),
    },
    "robotik": {
        "label": "Robotik",
        "default_tags": ("Robotics", "Automation", "Systems"),
        "feeds": (
            FeedSource(
                "https://news.google.com/rss/search?q=robotics+automation+industry&hl=en-US&gl=US&ceid=US:en",
                "Google News Robotics",
                ("Robotics", "Automation", "Industry"),
            ),
        ),
        "keywords": (
            "robot", "robotics", "automation", "autonomous", "humanoid",
            "industrial robot", "manipulator", "vision system",
        ),
    },
    "web": {
        "label": "Web Tasarimi",
        "default_tags": ("Web", "UX", "Frontend"),
        "feeds": (
            FeedSource("https://web.dev/feed.xml", "web.dev", ("Web", "Performance", "Frontend")),
            FeedSource("https://developer.mozilla.org/en-US/blog/rss.xml", "MDN Blog", ("Web", "Standards", "Browser")),
        ),
        "keywords": (
            "web", "frontend", "css", "javascript", "html", "ui", "ux", "accessibility",
            "performance", "browser", "responsive",
        ),
    },
    "siber": {
        "label": "Siber Guvenlik",
        "default_tags": ("Security", "Defense", "Risk"),
        "feeds": (
            FeedSource("https://www.cisa.gov/cybersecurity-advisories/all.xml", "CISA Advisories", ("CISA", "Advisory", "Threat")),
            FeedSource("https://blog.cloudflare.com/tag/security/rss/", "Cloudflare Security", ("Cloudflare", "Security", "Web")),
        ),
        "keywords": (
            "security", "cyber", "vulnerability", "exploit", "ddos", "advisory",
            "threat", "cve", "malware", "zero-day", "incident",
        ),
    },
    "kamera": {
        "label": "Kamera Sistemleri",
        "default_tags": ("Camera", "Video", "Surveillance"),
        "feeds": (
            FeedSource(
                "https://news.google.com/rss/search?q=IP+camera+cybersecurity+video+surveillance&hl=en-US&gl=US&ceid=US:en",
                "Google News Camera Security",
                ("IP Camera", "Video", "Surveillance"),
            ),
        ),
        "keywords": (
            "camera", "cctv", "video surveillance", "nvr", "ip camera",
            "security camera", "vms", "monitoring", "analytics",
        ),
    },
}

CATEGORY_ORDER = ("yazilim", "ai", "robotik", "web", "siber", "kamera")


def fetch_url(url: str) -> bytes:
    req = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5",
        },
    )
    with urlopen(req, timeout=35) as response:
        return response.read()


def fetch_json_url(url: str) -> bytes:
    req = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/json, text/plain, */*",
        },
    )
    with urlopen(req, timeout=30) as response:
        return response.read()


def strip_html(text: str | None) -> str:
    if not text:
        return ""
    no_tags = re.sub(r"<[^>]+>", " ", text)
    compact = re.sub(r"\s+", " ", html.unescape(no_tags)).strip()
    return compact


def parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    value = value.strip()
    if not value:
        return None
    try:
        dt = parsedate_to_datetime(value)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        pass
    try:
        cleaned = value.replace("Z", "+00:00")
        dt = datetime.fromisoformat(cleaned)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        return None


def pick_atom_link(entry: ET.Element) -> str:
    for link in entry.findall("{http://www.w3.org/2005/Atom}link"):
        rel = (link.attrib.get("rel") or "").lower()
        href = link.attrib.get("href") or ""
        if rel in ("", "alternate") and href:
            return href
    first = entry.find("{http://www.w3.org/2005/Atom}link")
    if first is not None:
        return first.attrib.get("href") or ""
    return ""


def parse_feed(xml_bytes: bytes, source_name: str) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    items: list[dict] = []

    if root.tag.endswith("rss"):
        channel = root.find("channel")
        if channel is None:
            return items
        for node in channel.findall("item"):
            title = strip_html(node.findtext("title"))
            link = (node.findtext("link") or "").strip()
            description = strip_html(node.findtext("description"))
            pub_date = parse_datetime(node.findtext("pubDate"))
            if not title or not link:
                continue
            items.append(
                {
                    "title": title,
                    "url": link,
                    "summary": description,
                    "published_at": pub_date,
                    "source": source_name,
                }
            )
        return items

    if root.tag.endswith("feed"):
        ns = "{http://www.w3.org/2005/Atom}"
        for entry in root.findall(f"{ns}entry"):
            title = strip_html(entry.findtext(f"{ns}title"))
            link = pick_atom_link(entry).strip()
            summary = strip_html(entry.findtext(f"{ns}summary") or entry.findtext(f"{ns}content"))
            pub_date = parse_datetime(entry.findtext(f"{ns}published") or entry.findtext(f"{ns}updated"))
            if not title or not link:
                continue
            items.append(
                {
                    "title": title,
                    "url": link,
                    "summary": summary,
                    "published_at": pub_date,
                    "source": source_name,
                }
            )
        return items

    return items


def score_relevance(text_blob: str, keywords: Iterable[str]) -> int:
    lowered = text_blob.lower()
    return sum(1 for kw in keywords if kw in lowered)


def normalize_url(url: str) -> str:
    return url.strip()


def truncate(text: str, limit: int = 240) -> str:
    text = text.strip()
    if len(text) <= limit:
        return text
    return text[: limit - 3].rstrip() + "..."


def looks_like_turkish(text: str) -> bool:
    lowered = text.lower()
    if any(ch in lowered for ch in "çğıöşü"):
        return True
    markers = (" ve ", " için ", " ile ", " gibi ", " güvenlik ", " yazilim ", " yapay ")
    padded = f" {lowered} "
    return any(marker in padded for marker in markers)


def translate_text_to_tr(text: str, cache: dict[str, str]) -> str:
    raw = (text or "").strip()
    if not raw:
        return raw
    if looks_like_turkish(raw):
        return raw
    if raw in cache:
        return cache[raw]

    payload = raw[:TRANSLATION_MAX_CHARS]
    params = urlencode(
        {
            "client": "gtx",
            "sl": "auto",
            "tl": "tr",
            "dt": "t",
            "q": payload,
        }
    )
    url = f"{TRANSLATION_ENDPOINT}?{params}"

    try:
        data = json.loads(fetch_json_url(url).decode("utf-8", errors="ignore"))
        translated = "".join(part[0] for part in data[0] if isinstance(part, list) and part and part[0]).strip()
        if translated:
            cache[raw] = translated
            return translated
    except Exception as exc:
        print(f"[WARN] translation failed: {exc}")

    cache[raw] = raw
    return raw


def build_posts() -> list[dict]:
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=FRESH_DAYS)
    posts: list[dict] = []

    for category in CATEGORY_ORDER:
        cfg = CATEGORIES[category]
        keyword_set = cfg["keywords"]
        category_posts: list[dict] = []

        for feed in cfg["feeds"]:
            try:
                raw = fetch_url(feed.url)
                feed_items = parse_feed(raw, feed.source_name)
            except Exception as exc:
                print(f"[WARN] {category}: {feed.url} failed: {exc}")
                continue

            for item in feed_items:
                text_blob = f"{item['title']} {item['summary']}"
                score = score_relevance(text_blob, keyword_set)
                if score == 0 and category in ("robotik", "kamera"):
                    # News query feeds can be noisy; enforce minimum semantic match.
                    continue

                published_at = item["published_at"] or now
                category_posts.append(
                    {
                        "category": category,
                        "category_label": cfg["label"],
                        "title": item["title"],
                        "summary": truncate(item["summary"] or item["title"]),
                        "url": normalize_url(item["url"]),
                        "source": item["source"],
                        "published_at": published_at,
                        "score": score,
                        "tags": list(feed.tags[:3] or cfg["default_tags"]),
                        "keywords": f"{item['title']} {item['summary']} {' '.join(feed.tags)}",
                    }
                )

        unique: dict[tuple[str, str], dict] = {}
        for item in category_posts:
            key = (item["title"].lower(), item["url"].lower())
            best = unique.get(key)
            if best is None or item["score"] > best["score"] or item["published_at"] > best["published_at"]:
                unique[key] = item

        filtered = list(unique.values())
        filtered.sort(key=lambda x: (x["published_at"], x["score"], x["title"]), reverse=True)

        fresh = [x for x in filtered if x["published_at"] >= cutoff]
        chosen = (fresh if len(fresh) >= 2 else filtered)[:MAX_PER_CATEGORY]
        posts.extend(chosen)

    posts.sort(
        key=lambda x: (
            CATEGORY_ORDER.index(x["category"]),
            x["published_at"],
            x["score"],
            x["title"],
        ),
        reverse=False,
    )
    # Reverse date order inside category while preserving category order.
    ordered: list[dict] = []
    for cat in CATEGORY_ORDER:
        cat_items = [p for p in posts if p["category"] == cat]
        cat_items.sort(key=lambda x: (x["published_at"], x["score"], x["title"]), reverse=True)
        ordered.extend(cat_items)
    posts = ordered

    translation_cache: dict[str, str] = {}
    if TRANSLATE_TO_TR:
        for item in posts:
            title_original = item["title"]
            summary_original = item["summary"]
            item["title_original"] = title_original
            item["summary_original"] = summary_original
            item["title"] = translate_text_to_tr(title_original, translation_cache)
            item["summary"] = translate_text_to_tr(summary_original, translation_cache)
            item["keywords"] = (
                f"{item['title']} {item['summary']} {title_original} {summary_original} {' '.join(item.get('tags', []))}"
            ).strip()

    for item in posts:
        item["published_display"] = item["published_at"].strftime("%Y-%m-%d")
        item["published_at"] = item["published_at"].isoformat().replace("+00:00", "Z")
        item["id"] = hashlib.sha1(f"{item['category']}|{item['title']}|{item['url']}".encode("utf-8")).hexdigest()[:12]
        item.pop("score", None)

    return posts


def main() -> None:
    posts = build_posts()
    if not posts:
        raise RuntimeError("No posts collected. Check feed availability.")

    newest = max(post["published_at"] for post in posts)
    category_counts = {cat: 0 for cat in CATEGORY_ORDER}
    for post in posts:
        category_counts[post["category"]] += 1

    payload = {
        "schema_version": 1,
        "updated_at": newest,
        "total_posts": len(posts),
        "category_counts": category_counts,
        "posts": posts,
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[OK] Wrote {len(posts)} posts to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
