import { useState, useEffect } from 'react';
import { ChefHat, Utensils, Clock } from 'lucide-react';
import '@/styles/loading.css';

export default function LoadingPage() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('initializing');

  useEffect(() => {
    const phases = [
      { name: 'initializing', duration: 800 },
      { name: 'loading', duration: 1200 },
      { name: 'preparing', duration: 1000 },
      { name: 'ready', duration: 500 }
    ];

    let currentPhaseIndex = 0;
    let progressInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;

    const startProgress = () => {
      progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 3;
        });
      }, 50);
    };

    const runPhases = () => {
      if (currentPhaseIndex < phases.length) {
        const phase = phases[currentPhaseIndex];
        setCurrentPhase(phase.name);
        
        if (phase.name === 'loading') {
          startProgress();
        }

        phaseTimeout = setTimeout(() => {
          currentPhaseIndex++;
          if (currentPhaseIndex < phases.length) {
            runPhases();
          } else {
            setLoadingProgress(100);
          }
        }, phase.duration);
      }
    };

    runPhases();

    return () => {
      clearInterval(progressInterval);
      clearTimeout(phaseTimeout);
    };
  }, []);

  const getPhaseMessage = () => {
    switch (currentPhase) {
      case 'initializing':
        return 'Starting up...';
      case 'loading':
        return 'Loading menu...';
      case 'preparing':
        return 'Preparing your experience...';
      case 'ready':
        return 'Almost ready...';
      default:
        return 'Loading...';
    }
  };

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case 'initializing':
        return <ChefHat className="w-8 h-8" />;
      case 'loading':
        return <Utensils className="w-8 h-8" />;
      case 'preparing':
        return <Clock className="w-8 h-8" />;
      case 'ready':
        return <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>;
      default:
        return <ChefHat className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col items-center justify-center p-4">
      {/* Logo Animation Container */}
      <div className="relative mb-12">
        {/* Animated Background Circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-orange-200 rounded-full animate-pulse opacity-20"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-red-200 rounded-full animate-ping opacity-30 animation-delay-200"></div>
        </div>
        
        {/* Main Logo */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-500 hover:scale-110">
            <ChefHat className="w-10 h-10 text-white animate-bounce" />
          </div>
        </div>

        {/* Rotating Elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>
      </div>

      {/* App Name */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in">
        Digital Menu
      </h1>
      
      {/* Tagline */}
      <p className="text-gray-600 mb-8 text-center animate-fade-in animation-delay-200">
        Delicious food at your fingertips
      </p>

      {/* Loading Status */}
      <div className="w-full max-w-sm space-y-4">
        {/* Phase Indicator */}
        <div className="flex items-center justify-center space-x-3 animate-fade-in animation-delay-400">
          {getPhaseIcon()}
          <span className="text-gray-700 font-medium">{getPhaseMessage()}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden animate-fade-in animation-delay-600">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
            style={{ width: `${loadingProgress}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="text-center text-sm text-gray-600 animate-fade-in animation-delay-800">
          {Math.round(loadingProgress)}%
        </div>
      </div>

      {/* Loading Dots */}
      <div className="flex space-x-2 mt-8">
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
