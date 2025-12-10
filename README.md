# WarpProfile - Farcaster Profile Analytics Mini App

WarpProfile is a comprehensive Farcaster mini-app that automatically detects connected users and displays profile analytics including social metrics, trust scores, activity data, and a daily check-in system.

## Features

✅ **Auto User Detection** - Automatically detects Farcaster users via Frame SDK  
✅ **Complete Profile Info** - Username, display name, ENS/BNS, profile picture, bio, FID  
✅ **Social Graph** - Followers and following counts  
✅ **Trust Metrics** - Spam score (0-2) and Neynar reputation score (0-100)  
✅ **Score Improvement Tips** - Personalized recommendations to boost your Neynar score  
✅ **Activity Analytics** - Likes, comments, and recasts (given & received)  
✅ **Daily Check-In** - Track engagement streaks  
✅ **Base Theme** - Clean UI with Base brand colors  
✅ **Mobile Responsive** - Works perfectly on all devices

## Understanding Your Neynar Score

Your Neynar Score (0-100) reflects your reputation and trustworthiness in the Farcaster ecosystem. Here's what matters:

### 🟣 Quality Over Quantity
- Create genuine, useful, and interesting content
- 1 strong cast > 10 empty ones
- 5 strong opinions per week > 20 posts per day

### 🟣 Authenticity Matters
- Show YOUR thoughts, stories, and emotions
- Algorithm detects AI-generated or artificial content
- Add real emotion, detail, and personal experience

### 🟣 Add Value
- Posts that spark meaningful discussions
- Content that serves as useful advice
- Contributions that keep people engaged

### 🟣 Original Content
- Use your own photos and unique perspectives
- Avoid copied content from Pinterest/Google
- Show what others don't have

### 🟣 Engage Meaningfully
- Communication = 50% of your score
- Comments, dialogues, questions, and support matter
- Build genuine connections

**The Secret:** Neynar evaluates your social usefulness. If your posts give something to people, your score goes up. If they clutter the feed, it goes down.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEYNAR_API_KEY=your_neynar_api_key_here
```

Get your Neynar API key from: https://neynar.com

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Test the App

For testing, you can use these FIDs:
- FID 3 (dwr.eth) - Farcaster founder
- FID 2 (v) - Farcaster co-founder

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add `NEYNAR_API_KEY` environment variable
4. Deploy!

### Register as Farcaster Frame

1. Go to Farcaster Frames developer portal
2. Register your deployed URL
3. Your mini-app will be available in Warpcast!

## Tech Stack

- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Neynar SDK
- **State Management**: SWR for data fetching
- **Storage**: LocalStorage for check-ins

## Project Structure

```
├── components/          # React components
│   ├── Card.tsx
│   ├── ProfileHeader.tsx
│   ├── SocialStats.tsx
│   ├── TrustMetrics.tsx
│   ├── ActivityAnalytics.tsx
│   └── CheckInSection.tsx
├── lib/                # Utilities and clients
│   ├── neynarClient.ts
│   ├── checkInManager.ts
│   └── hooks/
├── pages/              # Next.js pages
│   ├── index.tsx
│   └── api/           # API routes
├── types/             # TypeScript types
└── styles/            # Global styles
```

## API Endpoints

- `GET /api/user/detect` - Auto-detect user FID
- `GET /api/profile?fid=<fid>` - Get complete profile data
- `POST /api/checkin` - Record daily check-in

## Development

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Contact

Developer: @samrat1446  
Email: samrathassan1446@gmail.com  
GitHub: https://github.com/samrat1446

## Resources

- [Farcaster Documentation](https://docs.farcaster.xyz)
- [Neynar API Docs](https://docs.neynar.com)
- [Base Network](https://base.org)
- [Next.js Documentation](https://nextjs.org/docs)
