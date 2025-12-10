# Farcaster Integration Guide

## 🟣 Add to Farcaster/Warpcast

### Method 1: Submit to Farcaster Directory

1. **Go to Farcaster Developer Portal**
   - Visit: https://developers.farcaster.xyz
   - Sign in with your Farcaster account

2. **Submit Your Mini App**
   - Click "Submit App"
   - Fill out the form:
     - App Name: WarpProfile
     - Description: "Farcaster Profile Analytics with Real Neynar Scores"
     - URL: https://your-deployed-url.vercel.app
     - Category: Analytics/Social
     - Screenshots: Upload 3-4 screenshots

3. **App Manifest (Required)**
   Your app already has manifest.json with:
   ```json
   {
     "name": "WarpProfile",
     "short_name": "WarpProfile",
     "description": "Farcaster Profile Analytics",
     "start_url": "/",
     "display": "standalone",
     "theme_color": "#0052FF",
     "background_color": "#0A0E1A"
   }
   ```

### Method 2: Share Directly

1. **Create Farcaster Cast**
   ```
   🚀 Just launched WarpProfile! 
   
   ✨ See your real Neynar Score
   📊 Profile analytics & insights  
   💰 Daily check-ins with micro-payments
   🌌 Beautiful cosmic design
   
   Try it: https://your-app.vercel.app
   
   #Farcaster #Analytics #MiniApp
   ```

2. **Tag Influential Users**
   - Tag @dwr, @v, @farcaster
   - Ask for feedback and shares

### Method 3: Frame Integration

Create a Farcaster Frame that links to your app:

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://your-app.vercel.app/frame-image.png" />
<meta property="fc:frame:button:1" content="View My Profile" />
<meta property="fc:frame:post_url" content="https://your-app.vercel.app/api/frame" />
```

## 📈 Promotion Strategy

1. **Post in Popular Channels**
   - /farcaster-dev
   - /builders
   - /analytics

2. **Engage with Community**
   - Comment on related posts
   - Share insights about Neynar scores
   - Help users understand their analytics

3. **Collaborate**
   - Partner with other mini app developers
   - Cross-promote with similar apps