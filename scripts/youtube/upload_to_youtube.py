#!/usr/bin/env python3
"""
ORBIT Broadcast Network — Automated YouTube Uploader.
Uses YouTube Data API v3 with resumable chunked uploads, thumbnail attachment, and release scheduling.

Setup:
  1. Download OAuth 2.0 Client Credentials from Google Cloud Console.
  2. Save it as 'scripts/youtube/client_secret.json'.
  3. First run will open a one-time browser auth window to save 'scripts/youtube/token.pickle'.

Usage:
  python3 scripts/youtube/upload_to_youtube.py \\
    --video out/broadcast/episodes/BP001_master.mp4 \\
    --thumbnail out/broadcast/thumbnails/BP001_thumb.png \\
    --title "How 1,200,000 km of Undersea Cables Move the Entire Internet" \\
    --description "Episode 001 of The Blueprint. 100% code-rendered." \\
    --tags "technology,internet,cables,engineering,code,remotion" \\
    --privacy public
"""

import os
import sys
import time
import pickle
import argparse
import http.client
from pathlib import Path

try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    from googleapiclient.http import MediaFileUpload
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
except ImportError:
    print("\n[!] Missing Google API dependencies. Install via:")
    print("    pip install google-api-python-client google-auth-oauthlib google-auth-httplib2\n")
    sys.exit(1)

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube"
]

CHUNK_SIZE = 4 * 1024 * 1024  # 4MB chunks (must be multiple of 256KB)
SCRIPT_DIR = Path(__file__).resolve().parent
SECRET_FILE = SCRIPT_DIR / "client_secret.json"
TOKEN_FILE = SCRIPT_DIR / "token.pickle"


def get_authenticated_service():
    """Authenticates via OAuth 2.0 and reuses persisted token."""
    creds = None
    if TOKEN_FILE.exists():
        with open(TOKEN_FILE, "rb") as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not SECRET_FILE.exists():
                raise FileNotFoundError(
                    f"Missing credentials file: {SECRET_FILE}\n"
                    f"Please download your OAuth 2.0 Client ID json from Google Cloud Console "
                    f"and save it to {SECRET_FILE}"
                )
            flow = InstalledAppFlow.from_client_secrets_file(str(SECRET_FILE), SCOPES)
            creds = flow.run_local_server(port=0)

        with open(TOKEN_FILE, "wb") as token:
            pickle.dump(creds, token)

    return build("youtube", "v3", credentials=creds)


def upload_thumbnail(youtube, video_id: str, thumbnail_path: str):
    """Uploads custom thumbnail for the video."""
    if not os.path.exists(thumbnail_path):
        print(f"[!] Thumbnail not found at {thumbnail_path}. Skipping.")
        return

    print(f"[*] Attaching thumbnail: {thumbnail_path}...")
    try:
        youtube.thumbnails().set(
            videoId=video_id,
            media_body=MediaFileUpload(thumbnail_path)
        ).execute()
        print("[+] Thumbnail successfully attached!")
    except Exception as e:
        print(f"[!] Warning: Failed to attach thumbnail: {e}")


def resumable_upload(insert_request, max_retries: int = 5):
    """Executes resumable chunked upload with exponential backoff."""
    response = None
    error = None
    retry = 0

    print("[*] Starting resumable chunked upload to YouTube...")
    while response is None:
        try:
            status, response = insert_request.next_chunk()
            if status:
                percent = int(status.progress() * 100)
                print(f"    --> Upload progress: {percent}%")
        except HttpError as e:
            if e.resp.status in [500, 502, 503, 504]:
                error = f"Retriable HTTP error {e.resp.status}: {e.content}"
            else:
                raise
        except (IOError, http.client.IncompleteRead) as e:
            error = f"Retriable connection error: {e}"

        if error:
            print(f"[!] {error}")
            retry += 1
            if retry > max_retries:
                raise RuntimeError("Max upload retries exceeded. Upload aborted.")
            sleep_time = 2 ** retry
            print(f"[*] Retrying in {sleep_time}s...")
            time.sleep(sleep_time)
            error = None

    video_id = response.get("id")
    print(f"\n[+] Upload Complete! Video ID: {video_id}")
    print(f"[+] Watch URL: https://youtu.be/{video_id}")
    return video_id


def upload_video(
    video_path: str,
    title: str,
    description: str,
    tags: list = None,
    category_id: str = "28",  # 28 = Science & Technology
    privacy_status: str = "private",
    publish_at: str = None,
    thumbnail_path: str = None
):
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file does not exist: {video_path}")

    youtube = get_authenticated_service()

    status_body = {
        "privacyStatus": privacy_status,
        "selfDeclaredMadeForKids": False,
    }
    if publish_at and privacy_status == "private":
        status_body["publishAt"] = publish_at

    body = {
        "snippet": {
            "title": title,
            "description": description,
            "tags": tags or [],
            "categoryId": category_id,
        },
        "status": status_body,
    }

    media = MediaFileUpload(
        video_path,
        chunksize=CHUNK_SIZE,
        resumable=True
    )

    insert_request = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=media
    )

    video_id = resumable_upload(insert_request)

    if thumbnail_path:
        upload_thumbnail(youtube, video_id, thumbnail_path)

    return video_id


def main():
    parser = argparse.ArgumentParser(description="ORBIT Automated YouTube Uploader")
    parser.add_argument("--video", "-v", required=True, help="Path to video MP4 file")
    parser.add_argument("--thumbnail", "-t", default=None, help="Path to thumbnail PNG file")
    parser.add_argument("--title", required=True, help="Video title")
    parser.add_argument("--description", default="", help="Video description")
    parser.add_argument("--tags", default="", help="Comma-separated tags")
    parser.add_argument("--privacy", default="private", choices=["public", "private", "unlisted"], help="Privacy status")
    parser.add_argument("--publish-at", default=None, help="Scheduled publish time (ISO 8601 UTC string)")

    args = parser.parse_args()
    tag_list = [t.strip() for t in args.tags.split(",") if t.strip()]

    upload_video(
        video_path=args.video,
        title=args.title,
        description=args.description,
        tags=tag_list,
        privacy_status=args.privacy,
        publish_at=args.publish_at,
        thumbnail_path=args.thumbnail,
    )


if __name__ == "__main__":
    main()
