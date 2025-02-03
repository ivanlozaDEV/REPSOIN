from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
import os

SCOPES = ['https://www.googleapis.com/auth/gmail.send']
CLIENT_SECRET_FILE = os.path.join(os.path.dirname(__file__), '..', 'credentials.json')
TOKEN_FILE = os.path.join(os.path.dirname(__file__), '..', 'token.json')

def get_credentials():
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=5001)  # Use fixed port 5001
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
    return creds