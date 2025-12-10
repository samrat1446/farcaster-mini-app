# WarpProfile Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Connect your GitHub account

### Step 2: Deploy from GitHub
1. Push your code to GitHub repository
2. Import project in Vercel
3. Deploy automatically

### Step 3: Environment Variables
Add these in Vercel dashboard:
```
NEYNAR_API_KEY=934B4756-79EB-4300-8C6B-54F5D34C3076
QUOTIENT_API_KEY=your_quotient_api_key_here
AIRSTACK_API_KEY=your_airstack_api_key_here
```

### Step 4: Custom Domain (Optional)
- Add custom domain like: warpprofile.vercel.app
- Or use your own domain

## 🎯 Alternative: Deploy to Netlify

### Step 1: Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub

### Step 2: Deploy
1. Drag & drop your build folder
2. Or connect GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `.next`

## 📱 Get Your Public URL
After deployment, you'll get a URL like:
- https://warpprofile.vercel.app
- https://your-app.netlify.app

This URL will be used for Farcaster and Base app integration.