import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { CheckInManager } from '@/lib/checkInManager';

interface CheckInSectionProps {
  fid: number;
}

const CHECK_IN_FEE = '0.000003'; // ~0.000003 ETH on Base (equivalent to $0.01 USDC)
const RECIPIENT_ADDRESS = '0x81d428f7f328208B9F9A3cb22FAC94bb7Eea1172'; // Your Base app wallet address

export const CheckInSection: React.FC<CheckInSectionProps> = ({ fid }) => {
  const [streak, setStreak] = useState(0);
  const [canCheckIn, setCanCheckIn] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [txHash, setTxHash] = useState<string>('');

  useEffect(() => {
    const manager = new CheckInManager(fid);
    const data = manager.getCheckInData();
    setStreak(data.streak);
    setCanCheckIn(manager.canCheckInToday());
  }, [fid]);

  const handleCheckIn = async () => {
    setIsChecking(true);
    
    try {
      // Check if we're in a Warpcast frame context
      const isInFrame = window.self !== window.top;
      
      if (isInFrame) {
        // Try to use Frame SDK for in-app transactions
        try {
          // For now, use window.ethereum if available (MetaMask/Warpcast wallet)
          if (typeof window !== 'undefined' && (window as any).ethereum) {
            const ethereum = (window as any).ethereum;
            
            // Request account access
            await ethereum.request({ method: 'eth_requestAccounts' });
            
            // Send transaction
            const result = await ethereum.request({
              method: 'eth_sendTransaction',
              params: [{
                to: RECIPIENT_ADDRESS,
                value: '0x' + (BigInt(Math.floor(parseFloat(CHECK_IN_FEE) * 1e18))).toString(16),
                chainId: '0x2105', // Base mainnet
              }],
            });

            if (result) {
              setTxHash(result);
              const manager = new CheckInManager(fid);
              const data = manager.recordCheckIn();
              setStreak(data.streak);
              setCanCheckIn(false);

              await fetch('/api/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fid, txHash: result }),
              });
              return;
            }
          }
        } catch (sdkError) {
          console.log('Wallet not available, falling back to free check-in');
        }
      }
      
      // Fallback: Free check-in without payment (for testing/development)
      alert('💳 Ultra-micro payment (0.000003 ETH = $0.01) works with:\n• Warpcast Wallet (in Warpcast app)\n• Base App Wallet (in Base app)\n\n🆓 Recording free check-in for testing.');
      
      const manager = new CheckInManager(fid);
      const data = manager.recordCheckIn();
      setStreak(data.streak);
      setCanCheckIn(false);

      // Record free check-in
      await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid, txHash: 'free-checkin-' + Date.now() }),
      });
      
    } catch (error: any) {
      console.error('Check-in failed:', error);
      alert(error.message || 'Check-in failed. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="cosmic-card mb-6 p-6">
      <h2 className="cosmic-title mb-4">Daily Check-In</h2>
      
      <div className="text-center">
        {/* Streak Display */}
        <div className="mb-6">
          <p className="text-5xl font-bold text-base-blue mb-2">
            {streak}
          </p>
          <p className="text-base-text-secondary font-medium">
            Day Streak 🔥
          </p>
        </div>

        {/* Fee Info */}
        <div className="bg-base-surface rounded-lg p-3 mb-4">
          <p className="text-xs text-base-text-secondary mb-1">Check-in Fee</p>
          <p className="text-sm font-semibold text-base-text">
            {CHECK_IN_FEE} ETH <span className="text-xs text-base-text-secondary">(~$0.01 USD)</span>
          </p>
          <p className="text-xs text-base-text-secondary mt-1">Base Network • Ultra-low fee • Warpcast or Base App Wallet</p>
        </div>

        {/* Check-In Button */}
        <button
          onClick={handleCheckIn}
          disabled={!canCheckIn || isChecking}
          className={`cosmic-button w-full py-4 px-6 text-lg ${
            canCheckIn && !isChecking
              ? 'cursor-pointer'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isChecking ? 'Processing...' : canCheckIn ? 'Check In Now' : 'Already Checked In Today ✓'}
        </button>
        
        {canCheckIn && (
          <p className="text-xs text-base-text-secondary mt-2">
            💡 Ultra-micro payment: Only 1 cent! Base ETH transfer via Warpcast/Base wallet. Testing: free check-in.
          </p>
        )}

        {!canCheckIn && !txHash && (
          <p className="text-sm text-base-text-secondary mt-3">
            Come back tomorrow to continue your streak!
          </p>
        )}

        {txHash && (
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-base-blue hover:underline mt-3 block"
          >
            View transaction on Basescan ↗
          </a>
        )}
      </div>
    </div>
  );
};
