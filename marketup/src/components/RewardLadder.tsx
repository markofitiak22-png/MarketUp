"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface Reward {
  id: number;
  requirement: number;
  reward: string;
  icon: string;
  unlocked: boolean;
  isNext: boolean;
}

export default function RewardLadder() {
  const { translations } = useTranslations();
  const [currentReferrals, setCurrentReferrals] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [unlockedRewards, setUnlockedRewards] = useState<number[]>([]);
  const [nextReward, setNextReward] = useState<Reward | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch real data from API
  useEffect(() => {
    const fetchRewardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/referrals/rewards');
        
        if (!response.ok) {
          throw new Error('Failed to fetch reward data');
        }

        const data = await response.json();
        
        setCurrentReferrals(data.subscribers || data.totalReferrals);
        setRewards(data.rewards);
        setNextReward(data.nextReward);
        
        const unlocked = data.rewards
          .filter((reward: Reward) => reward.unlocked)
          .map((reward: Reward) => reward.id);
        setUnlockedRewards(unlocked);
        
      } catch (err) {
        console.error('Error fetching reward data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        
        // Fallback to mock data if API fails
        const mockReferrals = 0;
        setCurrentReferrals(mockReferrals);

        const rewardsData: Reward[] = [
          { id: 1, requirement: 3, reward: translations.referralsDiscount, icon: "💰", unlocked: false, isNext: false },
          { id: 2, requirement: 5, reward: translations.referralsFreeMonth, icon: "📅", unlocked: false, isNext: false },
          { id: 3, requirement: 8, reward: translations.referralsGiftCard, icon: "🎁", unlocked: false, isNext: false },
          { id: 4, requirement: 12, reward: translations.referralsWirelessPad, icon: "🔋", unlocked: false, isNext: false },
          { id: 5, requirement: 18, reward: translations.referralsBluetoothHeadphones, icon: "🎧", unlocked: false, isNext: false },
          { id: 6, requirement: 25, reward: translations.referralsMiniDrone, icon: "🚁", unlocked: false, isNext: false },
          { id: 7, requirement: 35, reward: translations.referralsMechanicalKeyboard, icon: "⌨️", unlocked: false, isNext: false },
          { id: 8, requirement: 50, reward: translations.referralsAirPods, icon: "🎵", unlocked: false, isNext: false },
          { id: 9, requirement: 75, reward: translations.referralsAppleWatch, icon: "⌚", unlocked: false, isNext: false },
          { id: 10, requirement: 100, reward: translations.referralsNewIphone, icon: "📱", unlocked: false, isNext: false },
        ];

        const unlocked = rewardsData
          .filter(reward => mockReferrals >= reward.requirement)
          .map(reward => reward.id);

        const next = rewardsData.find(reward => mockReferrals < reward.requirement);

        const updatedRewards = rewardsData.map(reward => ({
          ...reward,
          unlocked: unlocked.includes(reward.id),
          isNext: next?.id === reward.id
        }));

        setRewards(updatedRewards);
        setUnlockedRewards(unlocked);
        setNextReward(next || null);
      } finally {
        setLoading(false);
      }
    };

    fetchRewardData();

    // Listen for referral data updates
    const handleReferralUpdate = () => {
      fetchRewardData();
    };

    window.addEventListener('referralDataUpdated', handleReferralUpdate);
    
    return () => {
      window.removeEventListener('referralDataUpdated', handleReferralUpdate);
    };
  }, [translations]);

  const getProgressPercentage = (requirement: number) => {
    return Math.min((currentReferrals / requirement) * 100, 100);
  };

  const getMotivationalMessage = () => {
    if (nextReward) {
      const remaining = nextReward.requirement - currentReferrals;
      if (remaining === 1) {
        return translations.referralsAlmostThere;
      } else if (remaining <= 3) {
        return translations.referralsGreatJob;
      } else {
        return translations.referralsNextReward.replace("{count}", remaining.toString());
      }
    }
    return translations.referralsGreatJob;
  };

  const claimReward = async (rewardId: number) => {
    try {
      const response = await fetch('/api/referrals/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Refresh data
        const refreshResponse = await fetch('/api/referrals/rewards');
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setCurrentReferrals(refreshData.totalReferrals);
          setRewards(refreshData.rewards);
          setNextReward(refreshData.nextReward);
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to claim reward');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Failed to claim reward');
    }
  };

  return (
    <div className="relative overflow-hidden">
        {/* Hero Section */}
        <div className="text-center pt-20 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            
            <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 leading-tight text-white">
              {translations.referralsRewardLadder}
            </h2>
            <p className="text-2xl md:text-3xl lg:text-4xl text-white/70 max-w-5xl mx-auto leading-relaxed font-light mb-16">
              {translations.referralsRewardLadderDesc}
            </p>
            
            {/* Motivational message */}
            <div className="inline-flex items-center gap-6 px-12 py-6 rounded-3xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 text-white font-bold text-xl shadow-2xl shadow-blue-500/20">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse" />
              <span>{getMotivationalMessage()}</span>
            </div>
          </div>
        </div>

        {/* Desktop Progress Bar Container */}
        <div className="hidden md:block relative mb-20 px-8">
          {/* Main progress bar */}
          <div className="relative h-8 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden shadow-inner border border-white/20">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${getProgressPercentage(100)}%` }}
            />
            {/* Glow effect */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400/50 via-cyan-500/50 to-blue-600/50 rounded-full blur-sm transition-all duration-1000 ease-out"
              style={{ width: `${getProgressPercentage(100)}%` }}
            />
          </div>

          {/* Rewards positioned along the progress bar */}
          <div className="relative mt-16 flex gap-8 overflow-x-auto pb-20 pt-4 pl-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {rewards.map((reward, index) => {
              const isUnlocked = reward.unlocked;
              const isNext = reward.isNext;
              
              return (
                <div
                  key={reward.id}
                  className="flex-shrink-0 relative z-10"
                  style={{ width: '380px', height: '400px' }}
                >
                  {/* Reward card */}
                  <div className={`
                    group relative w-full h-full transition-all duration-500 hover:scale-110 hover:-translate-y-3 z-20 pt-4
                    ${isUnlocked 
                      ? 'opacity-100' 
                      : isNext 
                        ? 'opacity-100' 
                        : 'opacity-60'
                    }
                  `}>
                    {/* Card */}
                    <div className={`
                      relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 shadow-2xl h-full flex flex-col
                      ${isUnlocked 
                        ? 'border-green-400/50 bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-green-500/30' 
                        : isNext 
                          ? 'border-blue-400/50 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 shadow-blue-500/30' 
                          : 'border-white/20 bg-white/5'
                      }
                    `}>
                      {/* Glow effect for unlocked/next */}
                      {(isUnlocked || isNext) && (
                        <div className={`
                          absolute inset-0 rounded-2xl blur-sm opacity-50
                          ${isUnlocked 
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                            : 'bg-gradient-to-br from-blue-400 to-cyan-500'
                          }
                        `} />
                      )}
                      {/* Icon and status */}
                      <div className="relative flex items-center justify-between mb-6">
                        <div className={`
                          w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-lg
                          ${isUnlocked 
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' 
                            : isNext 
                              ? 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white' 
                              : 'bg-white/10 text-white/50'
                          }
                        `}>
                          {reward.icon}
                        </div>
                        <div className={`
                          px-4 py-2 rounded-full text-base font-bold shadow-lg
                          ${isUnlocked 
                            ? 'bg-green-500/30 text-green-300 border border-green-400/50' 
                            : isNext 
                              ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' 
                              : 'bg-white/10 text-white/50 border border-white/20'
                          }
                        `}>
                          {isUnlocked ? '✓' : '🔒'}
                        </div>
                      </div>

                      {/* Requirement */}
                      <div className="text-center mb-6">
                        <div className={`
                          text-3xl font-bold
                          ${isUnlocked ? 'text-green-300' : isNext ? 'text-blue-300' : 'text-white/50'}
                        `}>
                          {reward.requirement}
                        </div>
                        <div className="text-base text-white/60 font-medium">
                          {translations.referralsSubscribers}
                        </div>
                      </div>

                      {/* Reward description */}
                      <div className={`
                        text-base font-medium text-center leading-tight mb-6
                        ${isUnlocked ? 'text-green-200' : isNext ? 'text-blue-200' : 'text-white/50'}
                      `}>
                        {reward.reward}
                      </div>

                                  {/* Progress indicator for this reward */}
                                  <div className="space-y-3">
                                    <div className="h-4 bg-white/10 rounded-full overflow-hidden shadow-inner">
                                      <div 
                                        className={`
                                          h-full rounded-full transition-all duration-1000 shadow-lg
                                          ${isUnlocked 
                                            ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                                            : isNext 
                                              ? 'bg-gradient-to-r from-blue-400 to-cyan-500' 
                                              : 'bg-white/20'
                                          }
                                        `}
                                        style={{ width: `${getProgressPercentage(reward.requirement)}%` }}
                                      />
                                    </div>
                                    <div className="text-base text-center text-white/40 font-medium">
                                      {Math.round(getProgressPercentage(reward.requirement))}%
                                    </div>
                                    
                                    {/* Claim button for unlocked rewards */}
                                    {isUnlocked && (
                                      <button
                                        onClick={() => claimReward(reward.id)}
                                        className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-110 hover:brightness-110 border-2 border-yellow-300/50 hover:border-yellow-200"
                                      >
                                        🎉 {translations.referralsClaimReward} 🎉
                                      </button>
                                    )}
                                  </div>
                    </div>

                    {/* Connection line to progress bar */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-gradient-to-b from-accent/50 to-transparent"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Rewards Grid */}
        <div className="md:hidden mb-16 px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {rewards.map((reward, index) => {
              const isUnlocked = reward.unlocked;
              const isNext = reward.isNext;
              
              return (
                <div
                  key={reward.id}
                  className={`
                    group relative transition-all duration-500 hover:scale-105 hover:-translate-y-1 pt-4 h-80
                    ${isUnlocked 
                      ? 'opacity-100' 
                      : isNext 
                        ? 'opacity-100' 
                        : 'opacity-60'
                    }
                  `}
                >
                  {/* Card */}
                  <div className={`
                    relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 shadow-xl h-full flex flex-col
                    ${isUnlocked 
                      ? 'border-green-400/50 bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-green-500/30' 
                      : isNext 
                        ? 'border-blue-400/50 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 shadow-blue-500/30' 
                        : 'border-white/20 bg-white/5'
                    }
                  `}>
                    {/* Glow effect for unlocked/next */}
                    {(isUnlocked || isNext) && (
                        <div className={`
                          absolute inset-0 rounded-2xl blur-sm opacity-50
                          ${isUnlocked 
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                            : 'bg-gradient-to-br from-blue-400 to-cyan-500'
                          }
                        `} />
                    )}
                    {/* Icon and status */}
                    <div className="relative flex items-center justify-between mb-3">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg
                        ${isUnlocked 
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' 
                          : isNext 
                            ? 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white' 
                            : 'bg-white/10 text-white/50'
                        }
                      `}>
                        {reward.icon}
                      </div>
                      <div className={`
                        px-2 py-1 rounded-full text-xs font-bold shadow-lg
                        ${isUnlocked 
                          ? 'bg-green-500/30 text-green-300 border border-green-400/50' 
                          : isNext 
                            ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' 
                            : 'bg-white/10 text-white/50 border border-white/20'
                        }
                      `}>
                        {isUnlocked ? '✓' : '🔒'}
                      </div>
                    </div>

                    {/* Requirement */}
                    <div className="text-center mb-3">
                      <div className={`
                        text-2xl font-bold
                        ${isUnlocked ? 'text-green-300' : isNext ? 'text-blue-300' : 'text-white/50'}
                      `}>
                        {reward.requirement}
                      </div>
                      <div className="text-sm text-white/60 font-medium">
                        {translations.referralsSubscribers}
                      </div>
                    </div>

                    {/* Reward description */}
                    <div className={`
                      text-sm font-medium text-center leading-tight mb-3
                      ${isUnlocked ? 'text-green-200' : isNext ? 'text-blue-200' : 'text-white/50'}
                    `}>
                      {reward.reward}
                    </div>

                    {/* Progress indicator for this reward */}
                    <div className="space-y-1">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`
                            h-full rounded-full transition-all duration-1000 shadow-lg
                            ${isUnlocked 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                              : isNext 
                                ? 'bg-gradient-to-r from-blue-400 to-cyan-500' 
                                : 'bg-white/20'
                            }
                          `}
                          style={{ width: `${getProgressPercentage(reward.requirement)}%` }}
                        />
                      </div>
                      <div className="text-xs text-center text-white/40 font-medium">
                        {Math.round(getProgressPercentage(reward.requirement))}%
                      </div>
                      
                      {/* Claim button for unlocked rewards */}
                      {isUnlocked && (
                        <button
                          onClick={() => claimReward(reward.id)}
                          className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-lg text-sm font-bold hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-110 hover:brightness-110 border-2 border-yellow-300/50 hover:border-yellow-200"
                        >
                          🎉 {translations.referralsClaim} 🎉
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current progress stats */}
        <div className="mt-24 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center px-6 sm:px-12 py-6 sm:py-8 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <div className="flex-1 text-center min-w-0">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {currentReferrals}
                </div>
                <div className="text-sm sm:text-base md:text-lg text-white/70 font-medium">
                  {translations.referralsSubscribers}
                </div>
              </div>
              <div className="w-px h-12 sm:h-16 bg-white/20 mx-2 sm:mx-4"></div>
              <div className="flex-1 text-center min-w-0">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  {nextReward?.requirement || 100}
                </div>
                <div className="text-sm sm:text-base md:text-lg text-white/70 font-medium">
                  Next Goal
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}