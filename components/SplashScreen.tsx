import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1500);
    const timer3 = setTimeout(() => setStage(3), 2500);
    const timer4 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="splash-screen">
      {/* Animated Background */}
      <div className="splash-bg">
        <div className="particle-field">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Logo Animation */}
      <div className="splash-content">
        <div className={`logo-container ${stage >= 1 ? 'animate-in' : ''}`}>
          <div className="logo-circle">
            <div className="logo-inner">
              <span className="logo-text">W</span>
            </div>
          </div>
        </div>

        {/* App Name Animation */}
        <div className={`app-name ${stage >= 2 ? 'animate-in' : ''}`}>
          <h1 className="app-title">
            <span className="title-warp">WARP</span>
            <span className="title-profile">PROFILE</span>
          </h1>
          <p className="app-subtitle">Your Farcaster Analytics</p>
        </div>

        {/* Loading Animation */}
        <div className={`loading-container ${stage >= 3 ? 'animate-in' : ''}`}>
          <div className="loading-bar">
            <div className="loading-fill"></div>
          </div>
          <p className="loading-text">Loading your profile...</p>
        </div>
      </div>

      <style jsx>{`
        .splash-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #0A0E1A 0%, #1A1F3A 50%, #0A0E1A 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
        }

        .splash-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(0, 82, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 82, 255, 0.2) 0%, transparent 50%);
        }

        .particle-field {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #0052FF;
          border-radius: 50%;
          animation: float infinite ease-in-out;
          box-shadow: 0 0 6px rgba(0, 82, 255, 0.8);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
        }

        .splash-content {
          text-align: center;
          z-index: 1;
        }

        .logo-container {
          opacity: 0;
          transform: scale(0.5) rotate(-180deg);
          transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .logo-container.animate-in {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        .logo-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0052FF, #0040CC);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          box-shadow: 
            0 0 30px rgba(0, 82, 255, 0.5),
            0 0 60px rgba(0, 82, 255, 0.3),
            inset 0 0 30px rgba(255, 255, 255, 0.1);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .logo-inner {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .logo-text {
          font-size: 3rem;
          font-weight: 900;
          color: white;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 
              0 0 30px rgba(0, 82, 255, 0.5),
              0 0 60px rgba(0, 82, 255, 0.3),
              inset 0 0 30px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 
              0 0 50px rgba(0, 82, 255, 0.8),
              0 0 100px rgba(0, 82, 255, 0.5),
              inset 0 0 50px rgba(255, 255, 255, 0.2);
          }
        }

        .app-name {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
          margin-bottom: 3rem;
        }

        .app-name.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .app-title {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          letter-spacing: 3px;
        }

        .title-warp {
          background: linear-gradient(135deg, #0052FF, #3374FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-profile {
          background: linear-gradient(135deg, #FFFFFF, #B8C5D6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .app-subtitle {
          color: #B8C5D6;
          font-size: 1rem;
          font-weight: 400;
          letter-spacing: 1px;
        }

        .loading-container {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
        }

        .loading-container.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .loading-bar {
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          margin: 0 auto 1rem;
          overflow: hidden;
        }

        .loading-fill {
          height: 100%;
          background: linear-gradient(90deg, #0052FF, #3374FF, #0052FF);
          border-radius: 10px;
          animation: loading 2s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(0, 82, 255, 0.5);
        }

        @keyframes loading {
          0% {
            width: 0%;
            transform: translateX(-100%);
          }
          50% {
            width: 100%;
            transform: translateX(0%);
          }
          100% {
            width: 100%;
            transform: translateX(100%);
          }
        }

        .loading-text {
          color: #7A8BA0;
          font-size: 0.875rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .logo-circle {
            width: 100px;
            height: 100px;
          }

          .logo-inner {
            width: 75px;
            height: 75px;
          }

          .logo-text {
            font-size: 2.5rem;
          }

          .app-title {
            font-size: 2rem;
          }

          .loading-bar {
            width: 150px;
          }
        }
      `}</style>
    </div>
  );
};