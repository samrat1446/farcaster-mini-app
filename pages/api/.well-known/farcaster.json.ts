import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const manifest = {
    "frame": {
      "version": "next",
      "name": "WarpProfile",
      "iconUrl": "https://warpprofile.vercel.app/icon-192.png",
      "homeUrl": "https://warpprofile.vercel.app",
      "imageUrl": "https://warpprofile.vercel.app/og-image.png",
      "button": {
        "title": "View Profile Analytics",
        "action": {
          "type": "launch_frame",
          "name": "WarpProfile",
          "url": "https://warpprofile.vercel.app",
          "splashImageUrl": "https://warpprofile.vercel.app/splash.png",
          "splashBackgroundColor": "#0A0E1A"
        }
      }
    },
    "miniApp": {
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
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(manifest);
}