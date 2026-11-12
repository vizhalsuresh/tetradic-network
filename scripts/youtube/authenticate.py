#!/usr/bin/env python3
"""
TETRADIC NETWORK — YouTube One-Time OAuth Authenticator
Opens the browser for one-time authentication and verifies channel connectivity.
Saves token to scripts/youtube/token.pickle.
"""

import os
import sys
import pickle
from pathlib import Path

try:
    from googleapiclient.discovery import build
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
except ImportError:
    print("[!] Missing dependencies. Run: pip install google-api-python-client google-auth-oauthlib")
    sys.exit(1)

SCRIPT_DIR = Path(__file__).resolve().parent
SECRET_FILE = SCRIPT_DIR / "client_secret.json"
TOKEN_FILE = SCRIPT_DIR / "token.pickle"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube"
]

def authenticate():
    print("=" * 60)
    print("  TETRADIC NETWORK — YouTube One-Time Authentication")
    print("=" * 60)

    if not SECRET_FILE.exists():
        print(f"[!] Error: {SECRET_FILE} not found.")
        sys.exit(1)

    print("[*] Starting local OAuth authorization flow...")
    print("[*] A browser window should open automatically.")
    print("[*] If it does not, copy and open the URL shown below.\n")

    flow = InstalledAppFlow.from_client_secrets_file(
        str(SECRET_FILE),
        scopes=SCOPES
    )

    # Use fixed port 8080 or port 0
    creds = flow.run_local_server(
        port=0,
        open_browser=True,
        prompt="consent",
        authorization_prompt_message="Please visit this URL to authorize TETRADIC NETWORK:\n{url}\n"
    )

    with open(TOKEN_FILE, "wb") as f:
        pickle.dump(creds, f)
    print(f"\n[+] Authorization successful! Saved token to: {TOKEN_FILE}")

    # Verify connection by querying the authorized channel
    print("\n[*] Verifying YouTube Channel Connection...")
    youtube = build("youtube", "v3", credentials=creds)
    try:
        response = youtube.channels().list(mine=True, part="snippet,statistics").execute()
        items = response.get("items", [])
        if items:
            channel = items[0]
            title = channel["snippet"]["title"]
            cid = channel["id"]
            subs = channel["statistics"].get("subscriberCount", "0")
            videos = channel["statistics"].get("videoCount", "0")
            print(f"   [x] Connected Channel: {title}")
            print(f"   [x] Channel ID:        {cid}")
            print(f"   [x] Subscribers:       {subs}")
            print(f"   [x] Total Videos:      {videos}")
            print("\n============================================================")
            print("  SUCCESS: YouTube Upload Engine is Fully Configured!")
            print("============================================================")
        else:
            print("   [!] Warning: Authenticated, but no YouTube channel found for this Google account.")
    except Exception as e:
        print(f"   [!] Error querying channel: {e}")

if __name__ == "__main__":
    authenticate()
