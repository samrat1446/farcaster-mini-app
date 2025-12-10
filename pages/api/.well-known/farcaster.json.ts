import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const manifest = {
    "accountAssociation": {
      "header": "eyJmaWQiOjc3Nzg3NywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDgxZDQyOGY3ZjMyODIwOEI5RjlBM2NiMjJGQUM5NGJiN0VlYTExNzIifQ",
      "payload": "eyJkb21haW4iOiJ3YXJwcHJvZmlsZS52ZXJjZWwuYXBwIn0",
      "signature": "MHg4MWQ0MjhmN2YzMjgyMDhCOUY5QTNjYjIyRkFDOTRiYjdFZWExMTcy"
    },
    "version": "next",
    "name": "WarpProfile",
    "iconUrl": "https://warpprofile.vercel.app/icon-192.png",
    "homeUrl": "https://warpprofile.vercel.app",
    "imageUrl": "https://warpprofile.vercel.app/og-image.png",
    "buttonTitle": "View Analytics",
    "splashImageUrl": "https://warpprofile.vercel.app/splash.png",
    "splashBackgroundColor": "#0A0E1A",
    "webhookUrl": "https://warpprofile.vercel.app/api/webhook",
    "subtitle": "Farcaster Profile Analytics",
    "description": "Real Neynar Scores, Profile Analytics, and Base ETH Check-ins",
    "screenshotUrls": [
      "https://warpprofile.vercel.app/screenshot1.png",
      "https://warpprofile.vercel.app/screenshot2.png"
    ],
    "primaryCategory": "social",
    "ogImageUrl": "https://warpprofile.vercel.app/og-image.png",
    "castShareUrl": "https://warpprofile.vercel.app"
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.status(200).json(manifest);
}