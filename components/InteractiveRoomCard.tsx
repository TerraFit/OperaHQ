
import React, { useState } from 'react';
import { RoomAttendantCardConfig, RoomAttendantCardType, RoomAttendantExpandedData } from '../types';
import RoomAttendantExpandedViews from './RoomAttendantExpandedViews';
import { Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';

interface InteractiveRoomCardProps {
  card: RoomAttendantCardConfig;
  isActive: boolean;
  isExpanded: boolean;
  onCardClick: (id: string) => void;
  onCardExpand: (id: string) => Promise<RoomAttendantExpandedData>;
  onCardClose: (id: string) => void;
}

const InteractiveRoomCard: React.FC<InteractiveRoomCardProps> = ({
  card,
  isActive,
  isExpanded,
  onCardClick,
  onCardExpand,
  onCardClose
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedData, setExpandedData] = useState<RoomAttendantExpandedData | null>(null);
  
  // Handle card click
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!card.expandable) return;
    
    // Toggle expansion
    if (isExpanded) {
      onCardClose(card.id);
      setExpandedData(null);
    } else {
      onCardClick(card.id);
      setIsLoading(true);
      
      try {
        const data = await onCardExpand(card.id);
        setExpandedData(data);
      } catch (error) {
        console.error('Failed to load expanded data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getTrendIndicator = (cardType: RoomAttendantCardType): React.ReactNode => {
    const trends: Record<string, { trend: 'up' | 'down' | 'neutral', text: string }> = {
      assigned: { trend: 'up', text: '+2 from yesterday' },
      completed: { trend: 'up', text: 'On track' },
      priority: { trend: 'down', text: '-1 urgent' },
      inspected: { trend: 'neutral', text: '100% today' },
      attendants: { trend: 'neutral', text: '4/6 active' }
    };
    
    const trend = trends[cardType] || { trend: 'neutral', text: 'No change' };
    const color = trend.trend === 'up' ? 'text-green-600' : trend.trend === 'down' ? 'text-red-600' : 'text-gray-500';
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded bg-gray-50 ${color}`}>
        {trend.text}
      </span>
    );
  };
  
  return (
    <>
      {/* Overlay for expanded card */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity" 
          onClick={(e) => {
             e.stopPropagation();
             onCardClose(card.id);
          }}
        />
      )}
      
      {/* Main Card */}
      <div
        className={`
          bg-white rounded-xl shadow-sm border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between
          ${isExpanded 
            ? 'z-50 fixed inset-4 md:inset-10 h-auto overflow-y-auto ring-4 ring-blue-50/50 scale-100 shadow-2xl' 
            : 'h-[160px] hover:-translate-y-1 hover:shadow-lg'
          }
          ${isActive ? 'border-blue-300 ring-2 ring-blue-100' : ''}
        `}
        style={{
          borderColor: isExpanded ? card.borderColor : isActive ? card.borderColor : 'transparent',
          backgroundColor: isExpanded ? '#ffffff' : isHovered ? '#f8fbff' : '#ffffff',
          borderWidth: '1px' // Tailwind override
        }}
        onClick={!isExpanded ? handleClick : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        aria-expanded={isExpanded}
      >
        {/* Border Left Strip for Color coding */}
        <div 
            className="absolute left-0 top-0 bottom-0 w-1.5 transition-all"
            style={{ backgroundColor: card.borderColor }}
        />

        <div className="p-5 flex flex-col h-full relative">
            {/* Close button for expanded state */}
            {isExpanded && (
            <button 
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-50"
                onClick={(e) => {
                    e.stopPropagation();
                    onCardClose(card.id);
                }}
                aria-label="Close expanded view"
            >
                <X size={20} />
            </button>
            )}
            
            {/* Loading state */}
            {isLoading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
            )}
            
            {/* Card Header */}
            <div className="flex justify-between items-start mb-2">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-2">{card.title}</div>
                <div className={`p-2 rounded-lg ${isExpanded ? 'bg-gray-50' : ''}`} style={{ color: card.borderColor }}>
                    {card.icon}
                </div>
            </div>
            
            {/* Card Content */}
            <div className="mb-auto pl-2">
                <div className="text-4xl font-bold text-gray-900 mb-1 leading-none">{card.count}</div>
                <div className="text-sm text-gray-500 line-clamp-1">{card.subText}</div>
            </div>
            
            {/* Card Footer */}
            <div className="flex justify-between items-center mt-4 pl-2">
                <div>
                    {getTrendIndicator(card.type)}
                </div>
                {card.expandable && !isExpanded && (
                    <div className="text-xs font-bold flex items-center gap-1" style={{ color: card.borderColor }}>
                        View Details <ChevronDown size={14} />
                    </div>
                )}
                {isExpanded && (
                    <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        Collapse <ChevronUp size={14} />
                    </div>
                )}
            </div>
            
            {/* Expanded Content */}
            {isExpanded && expandedData && !isLoading && (
            <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2">
                <RoomAttendantExpandedViews
                    cardType={card.type}
                    data={expandedData}
                />
            </div>
            )}
        </div>
      </div>
    </>
  );
};

export default InteractiveRoomCard;
