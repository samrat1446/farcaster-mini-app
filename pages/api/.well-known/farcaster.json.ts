import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const manifest = {
    "accountAssociation": {
      "header": "eyJmaWQiOjc3Nzg3NywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDgxZDQyOGY3ZjMyODIwOEI5RjlBM2NiMjJGQUM5NGJiN0VlYTExNzIifQ",
      "payload": "eyJkb21haW4iOiJ3YXJwcHJvZmlsZS52ZXJjZWwuYXBwIn0",
      "signature": "MHg4MWQ0MjhmN2YzMjgyMDhCOUY5QTNjYjIyRkFDOTRiYjdFZWExMTcy"
    },
    "frame": {
      "version": "next",
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
      "description": "Farcaster Profile Analytics with Real Neynar Scores",
      "icon": "https://warpprofile.vercel.app/icon-192.png",
      "homeUrl": "https://warpprofile.vercel.app",
      "imageUrl": "https://warpprofile.vercel.app/preview.png"
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(manifest);
}