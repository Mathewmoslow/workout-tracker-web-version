# Google OAuth Setup Instructions

## ⚠️ Important Setup Required

The Google Drive backup feature requires proper OAuth configuration in Google Cloud Console.

### Current Credentials:
- **Client ID**: `478540494447-nge845cbrr5cb25iq84h1vda8041lk1f.apps.googleusercontent.com`
- **API Key**: `AIzaSyBfApU2yHpZkyNkZKFeovExZSiCBiIpqv0`

### Required Google Cloud Console Configuration:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project (or create one)

2. **Enable Google Drive API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

3. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Select "External" user type (unless using G Suite)
   - Fill in required fields:
     - App name: "Workout Tracker Pro"
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `https://www.googleapis.com/auth/drive.file`

4. **Configure OAuth 2.0 Client ID**
   - Go to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 Client ID
   - Click on it to edit
   - Add Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://localhost:3000
     https://workout-tracker-ghirtfxo2-mathew-moslows-projects.vercel.app
     https://workout-tracker-two-theta.vercel.app
     https://workout-tracker-bvg7kue1t-mathew-moslows-projects.vercel.app
     https://workout-tracker.vercel.app
     ```
   - Add Authorized redirect URIs:
     ```
     http://localhost:3000
     https://workout-tracker-ghirtfxo2-mathew-moslows-projects.vercel.app
     ```

5. **API Key Restrictions (Optional but Recommended)**
   - Go to "APIs & Services" > "Credentials"
   - Click on your API key
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose "Google Drive API"
   - Under "Website restrictions":
     - Add your domains

### Testing the Configuration:

1. **Local Testing**:
   - Open: http://localhost:3000/google-verify.html
   - Click "Test Google Auth"
   - Should open Google sign-in

2. **Production Testing**:
   - Deploy to Vercel
   - Test on production URL

### Common Issues and Solutions:

**Error 400 (redirect_uri_mismatch)**
- The redirect URI in the request doesn't match authorized URIs
- Solution: Add the exact URL to authorized JavaScript origins

**Error 401 (unauthorized)**
- API key or Client ID is incorrect
- Solution: Verify credentials in .env file match Google Cloud Console

**Error 403 (access_denied)**
- API not enabled or scope not authorized
- Solution: Enable Google Drive API and verify OAuth consent screen

### Cross-Platform Sync with iOS:

Since you're using the same Client ID as your iOS app (`478540494447-nge845cbrr5cb25iq84h1vda8041lk1f`), make sure:

1. Both platforms are listed in authorized origins
2. The OAuth consent screen is properly configured
3. The app uses `appDataFolder` scope for hidden storage

### Deployment Checklist:

- [ ] Google Drive API enabled
- [ ] OAuth consent screen configured
- [ ] JavaScript origins include all domains
- [ ] Environment variables set in Vercel
- [ ] Test authentication on localhost
- [ ] Test authentication on production

### Vercel Environment Variables:

Make sure these are set in Vercel dashboard:
- Settings > Environment Variables
- Add:
  - `REACT_APP_GOOGLE_API_KEY`
  - `REACT_APP_GOOGLE_CLIENT_ID`