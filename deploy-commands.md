# Quick Deploy Commands

## 🔄 Push to GitHub

```bash
# Add all changes
git add .

# Commit with message
git commit -m "WarpProfile v1.0 - Production Ready
- ✅ Cosmic blue design complete
- ✅ Real Neynar Score integration  
- ✅ Auto-login system
- ✅ Profile switching
- ✅ Base ETH payments (0.000003 ETH)
- ✅ Wallet: 0x81d428f7f328208B9F9A3cb22FAC94bb7Eea1172
- ✅ Cross-platform compatibility"

# Push to GitHub
git push origin main
```

## 🚀 Deploy to Vercel

### Option 1: Auto-Deploy (If connected)
- Changes will auto-deploy if Vercel is connected to your GitHub

### Option 2: Manual Deploy
1. Go to https://vercel.com/dashboard
2. Find your project
3. Click "Deploy" 
4. Or import from GitHub if not connected

### Option 3: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔧 Environment Variables (Important!)

Add these in Vercel dashboard:
```
NEYNAR_API_KEY=934B4756-79EB-4300-8C6B-54F5D34C3076
QUOTIENT_API_KEY=your_quotient_api_key_here
AIRSTACK_API_KEY=your_airstack_api_key_here
```

## 📱 After Deploy

You'll get a URL like:
- https://warpprofile.vercel.app
- https://your-repo-name.vercel.app

Test the deployed version before submitting to app stores!