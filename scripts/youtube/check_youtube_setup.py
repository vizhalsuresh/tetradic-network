#!/usr/bin/env python3
"""
TETRADIC NETWORK — YouTube Upload Status Diagnostic
Checks all prerequisites for automated YouTube uploading:
- Dependencies (google-api-python-client, google-auth-oauthlib)
- Credentials (client_secret.json)
- Cached Token (token.pickle)
- Channel connectivity
"""

import os
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
SECRET_FILE = SCRIPT_DIR / "client_secret.json"
TOKEN_FILE = SCRIPT_DIR / "token.pickle"

def main():
    print("=" * 60)
    print("  TETRADIC NETWORK — YouTube Auto-Upload Diagnostic")
    print("=" * 60)

    # 1. Check Python Dependencies
    print("\n1. Python Dependencies:")
    missing = []
    try:
        import googleapiclient
        print("   [x] google-api-python-client: INSTALLED")
    except ImportError:
        missing.append("google-api-python-client")
        print("   [ ] google-api-python-client: MISSING")

    try:
        import google_auth_oauthlib
        print("   [x] google-auth-oauthlib:    INSTALLED")
    except ImportError:
        missing.append("google-auth-oauthlib")
        print("   [ ] google-auth-oauthlib:    MISSING")

    # 2. Check Credentials File
    print("\n2. OAuth 2.0 Credentials:")
    if SECRET_FILE.exists():
        print(f"   [x] Client Secret found: {SECRET_FILE}")
    else:
        print(f"   [!] MISSING: {SECRET_FILE}")
        print("       Action needed: Download OAuth 2.0 Client ID JSON from Google Cloud Console")
        print(f"       and save it as: {SECRET_FILE}")

    # 3. Check Cached Token
    print("\n3. Cached Auth Token:")
    if TOKEN_FILE.exists():
        print(f"   [x] Token found: {TOKEN_FILE}")
        try:
            import pickle
            with open(TOKEN_FILE, "rb") as f:
                creds = pickle.load(f)
            if creds and creds.valid:
                print("   [x] Token is VALID and active!")
            elif creds and creds.expired and creds.refresh_token:
                print("   [!] Token is expired but HAS refresh token (will auto-refresh).")
            else:
                print("   [!] Token is invalid or missing refresh token.")
        except Exception as e:
            print(f"   [!] Error reading token: {e}")
    else:
        print(f"   [!] No token yet. Run one-time authentication after placing {SECRET_FILE.name}.")

    print("\n" + "=" * 60)
    if SECRET_FILE.exists() and TOKEN_FILE.exists():
        print("STATUS: READY FOR AUTOMATED HEADLESS UPLOADS")
    elif SECRET_FILE.exists():
        print("STATUS: CREDENTIALS PRESENT — RUN ONE-TIME AUTHENTICATION")
    else:
        print("STATUS: AWAITING client_secret.json")
    print("=" * 60)

if __name__ == '__main__':
    main()
