import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ProfileContainer } from '@/components/ProfileContainer';
import { SplashScreen } from '@/components/SplashScreen';
import { useProfile } from '@/lib/hooks/useProfile';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [fid, setFid] = useState<number | null>(null);
  const [inputFid, setInputFid] = useState('');
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const { profileData, isLoading, error, refetch } = useProfile(fid);

  useEffect(() => {
    // Try to detect FID from URL params only (Frame SDK only works in Warpcast)
    const detectUser = async () => {
      try {
        console.log('🔍 Auto-detecting user...');

        // Method 1: URL params (for direct links)
        const urlParams = new URLSearchParams(window.location.search);
        const urlFid = urlParams.get('fid');
        
        if (urlFid) {
          console.log('✅ Found FID in URL:', urlFid);
          setFid(parseInt(urlFid, 10));
          localStorage.setItem('warpprofile_fid', urlFid);
          return;
        }

        // Method 2: Farcaster Frame SDK (in Warpcast)
        if (window.self !== window.top) {
          try {
            const sdk = await import('@farcaster/frame-sdk');
            await sdk.default.actions.ready();
            const context = await sdk.default.context;
            
            if (context?.user?.fid) {
              console.log('✅ Found FID from Farcaster SDK:', context.user.fid);
              setFid(context.user.fid);
              localStorage.setItem('warpprofile_fid', context.user.fid.toString());
              return;
            }
          } catch (sdkError) {
            console.log('Farcaster SDK not available');
          }
        }

        // Method 3: Check if wallet is connected (Base app, MetaMask)
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          try {
            const ethereum = (window as any).ethereum;
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            
            if (accounts && accounts.length > 0) {
              const address = accounts[0];
              console.log('🔍 Found wallet address, searching for FID...');
              
              // Try to find FID by wallet address using Neynar API
              try {
                const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}`, {
                  headers: {
                    'accept': 'application/json',
                    'api_key': '934B4756-79EB-4300-8C6B-54F5D34C3076',
                  },
                });
                
                if (response.ok) {
                  const data = await response.json();
                  if (data[address] && data[address].length > 0) {
                    const detectedFid = data[address][0].fid;
                    console.log('✅ Found FID by wallet:', detectedFid);
                    setFid(detectedFid);
                    localStorage.setItem('warpprofile_fid', detectedFid.toString());
                    return;
                  }
                }
              } catch (apiError) {
                console.log('Wallet-to-FID lookup failed');
              }
            }
          } catch (walletError) {
            console.log('Wallet detection failed');
          }
        }

        // Method 4: Check localStorage for previous user
        const savedFid = localStorage.getItem('warpprofile_fid');
        if (savedFid) {
          console.log('✅ Found saved FID:', savedFid);
          setFid(parseInt(savedFid, 10));
          return;
        }

        // Method 5: Default auto-login (always show someone's profile)
        console.log('🎯 No user detected, auto-loading popular profile...');
        const defaultFid = 3; // dwr (Dan Romero) - popular user
        setFid(defaultFid);
        console.log('✅ Auto-loaded default profile:', defaultFid);
      } catch (error) {
        console.log('Auto-detection failed, using manual input');
      }
    };

    detectUser();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fidNumber = parseInt(inputFid, 10);
    if (!isNaN(fidNumber)) {
      setFid(fidNumber);
      localStorage.setItem('warpprofile_fid', fidNumber.toString());
    }
  };

  // Function to handle quick access buttons
  const handleQuickAccess = (fidNumber: number) => {
    setFid(fidNumber);
    localStorage.setItem('warpprofile_fid', fidNumber.toString());
    setShowUserSwitcher(false); // Hide switcher after selection
  };

  // Function to handle user switching
  const handleSwitchUser = () => {
    setShowUserSwitcher(true);
  };

  // Function to go back to current profile
  const handleBackToProfile = () => {
    setShowUserSwitcher(false);
  };

  // Show splash screen on first load
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <>
      <Head>
        <title>WarpProfile - Farcaster Profile Analytics</title>
        <meta name="description" content="Automatic Farcaster Profile Analytics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-base-surface cosmic-theme">
        {/* Cosmic Header */}
        <div className="cosmic-header">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="cosmic-title">
              <span style={{color: 'var(--base-blue-light)'}}>WARP</span>
              <span style={{color: 'white'}}>PROFILE</span>
            </h1>
            <p className="cosmic-subtitle">Your Farcaster Analytics Dashboard</p>
          </div>
        </div>

        {/* User Switcher / FID Login System */}
        {(!fid || showUserSwitcher) && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="cosmic-card p-6">
              {/* Dynamic title based on context */}
              {showUserSwitcher ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="cosmic-title">
                      🔄 Switch User Profile
                    </h2>
                    <button
                      onClick={handleBackToProfile}
                      className="cosmic-button px-4 py-2 text-sm"
                    >
                      ← Back to Profile
                    </button>
                  </div>
                  <p className="cosmic-text mb-6">
                    Enter any FID to view their profile analytics and scores.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="cosmic-title mb-4">
                    🔍 User Not Auto-Detected
                  </h2>
                  <p className="cosmic-text mb-6">
                    We couldn't automatically detect your Farcaster profile. Please enter your FID manually or use quick access below.
                  </p>
                  
                  <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-200">
                      💡 <strong>Next time:</strong> Open this app from Warpcast or Base app for automatic login!
                    </p>
                  </div>
                </>
              )}
              
              {/* Manual FID Input */}
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={inputFid}
                    onChange={(e) => setInputFid(e.target.value)}
                    placeholder="Enter your FID (e.g., 12345)"
                    className="cosmic-input flex-1 text-lg"
                  />
                  <button
                    type="submit"
                    className="cosmic-button px-8 py-3 text-lg"
                  >
                    Login
                  </button>
                </div>
              </form>

              {/* Quick Access - Popular Users */}
              <div className="border-t border-gray-600 pt-6">
                <h3 className="cosmic-subtitle mb-4">
                  🌟 Quick Access - Popular Users
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleQuickAccess(3)}
                    className="cosmic-card p-4 text-left hover:scale-105 transition-transform"
                  >
                    <div className="font-semibold" style={{color: 'var(--text-primary)'}}>Dan Romero</div>
                    <div className="text-sm" style={{color: 'var(--text-secondary)'}}>@dwr • FID 3</div>
                    <div className="text-xs mt-1" style={{color: 'var(--base-blue-light)'}}>Farcaster Founder</div>
                  </button>
                  
                  <button
                    onClick={() => handleQuickAccess(2)}
                    className="cosmic-card p-4 text-left hover:scale-105 transition-transform"
                  >
                    <div className="font-semibold" style={{color: 'var(--text-primary)'}}>Varun Srinivasan</div>
                    <div className="text-sm" style={{color: 'var(--text-secondary)'}}>@v • FID 2</div>
                    <div className="text-xs mt-1" style={{color: 'var(--base-blue-light)'}}>Farcaster Co-founder</div>
                  </button>
                  
                  <button
                    onClick={() => handleQuickAccess(1)}
                    className="cosmic-card p-4 text-left hover:scale-105 transition-transform"
                  >
                    <div className="font-semibold" style={{color: 'var(--text-primary)'}}>Farcaster</div>
                    <div className="text-sm" style={{color: 'var(--text-secondary)'}}>@farcaster • FID 1</div>
                    <div className="text-xs mt-1" style={{color: 'var(--base-blue-light)'}}>Official Account</div>
                  </button>
                  
                  <button
                    onClick={() => handleQuickAccess(5650)}
                    className="cosmic-card p-4 text-left hover:scale-105 transition-transform"
                  >
                    <div className="font-semibold" style={{color: 'var(--text-primary)'}}>Vitalik Buterin</div>
                    <div className="text-sm" style={{color: 'var(--text-secondary)'}}>@vitalik.eth • FID 5650</div>
                    <div className="text-xs mt-1" style={{color: 'var(--base-blue-light)'}}>Ethereum Founder</div>
                  </button>
                  
                  <button
                    onClick={() => handleQuickAccess(99)}
                    className="cosmic-card p-4 text-left hover:scale-105 transition-transform"
                  >
                    <div className="font-semibold" style={{color: 'var(--text-primary)'}}>Balaji Srinivasan</div>
                    <div className="text-sm" style={{color: 'var(--text-secondary)'}}>@balajis.eth • FID 99</div>
                    <div className="text-xs mt-1" style={{color: 'var(--base-blue-light)'}}>Tech Investor</div>
                  </button>
                  
                  <button
                    onClick={() => handleQuickAccess(239)}
                    className="cosmic-card p-4 text-left hover:scale-105 transition-transform"
                  >
                    <div className="font-semibold text-base-text">Farcaster</div>
                    <div className="text-sm text-base-text-secondary">@farcaster • FID 1</div>
                    <div className="text-xs text-blue-600 mt-1">Official Account</div>
                  </button>
                </div>
              </div>

              {/* How to Find Your FID */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-base-text mb-3">
                  ❓ How to Find Your FID
                </h3>
                <div className="space-y-2 text-sm text-base-text-secondary">
                  <p>• <strong>Warpcast:</strong> Go to your profile → Settings → Advanced → Your FID</p>
                  <p>• <strong>URL Method:</strong> Visit warpcast.com/username → Check URL for FID</p>
                  <p>• <strong>Farcaster Explorer:</strong> Search your username on explorer.farcaster.xyz</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Display */}
        {fid && (
          <>
            {/* User Switch Bar */}
            <div className="bg-white border-b shadow-sm">
              <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-sm text-base-text-secondary">
                  Viewing profile for FID: <span className="font-mono font-semibold text-base-blue">{fid}</span>
                </div>
                <button
                  onClick={handleSwitchUser}
                  className="cosmic-button px-4 py-2 text-sm"
                >
                  🔄 Switch User
                </button>
              </div>
            </div>
            
            <ProfileContainer
              profileData={profileData}
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
              onSwitchUser={handleSwitchUser}
            />
          </>
        )}
      </main>
    </>
  );
}
