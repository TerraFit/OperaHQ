import React, { useState } from 'react';
import { InteractiveDashboardCardConfig, CardExpandedContent, CardType } from '../types';
import { Loader2, X } from 'lucide-react';
import DashboardExpandedViews from './DashboardExpandedViews';

interface InteractiveDashboardCardProps {
  card: InteractiveDashboardCardConfig;
  onExpand: (id: string) => Promise<CardExpandedContent>;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

const InteractiveDashboardCard: React.FC<InteractiveDashboardCardProps> = ({
  card,
  onExpand,
  isExpanded,
  onToggleExpand
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedData, setExpandedData] = useState<CardExpandedContent | null>(null);

  const handleExpand = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!card.isExpandable) return;

    if (!isExpanded) {
      onToggleExpand(card.id);
      setIsLoading(true);
      try {
        const data = await onExpand(card.type);
        setExpandedData(data);
      } catch (error) {
        console.error("Failed to fetch expanded data", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      onToggleExpand(card.id);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(card.id);
  };

  const statusColors = {
    normal: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
    success: 'bg-green-500'
  };

  const borderColors = {
    normal: 'hover:border-blue-300',
    warning: 'hover:border-yellow-300 border-yellow-200',
    critical: 'hover:border-red-300 border-red-200',
    success: 'hover:border-green-300 border-green-200'
  };

  return (
    <>
      {/* OVERLAY for Expanded State */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />
      )}

      <div
        className={`
          relative bg-white rounded-xl shadow-sm border transition-all duration-300
          ${isExpanded ? 'z-50 col-span-1 md:col-span-2 row-span-2 scale-100 ring-4 ring-blue-50/50' : 'cursor-pointer hover:-translate-y-1 hover:shadow-lg'}
          ${!isExpanded && borderColors[card.status]}
          ${isExpanded ? 'border-blue-500 shadow-2xl' : 'border-gray-200'}
        `}
        onClick={!isExpanded ? handleExpand : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ minHeight: isExpanded ? '400px' : 'auto' }}
      >
        {/* Status Dot */}
        <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${statusColors[card.status]} shadow-sm`} />

        {/* Close Button (Expanded Only) */}
        {isExpanded && (
          <button 
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-50"
          >
            <X size={20} />
          </button>
        )}

        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{card.title}</h3>
              <div className={`text-3xl font-bold text-gray-900 ${isExpanded ? 'text-4xl text-blue-600' : ''}`}>
                {card.currentValue}
              </div>
            </div>
            <div className={`p-2 rounded-lg bg-gray-50 text-gray-400 ${isExpanded ? 'bg-blue-50 text-blue-600' : ''}`}>
              {/* Icon Placeholder or Render */}
              <span className="text-2xl">{card.icon}</span>
            </div>
          </div>

          {/* Subvalue */}
          {!isExpanded && card.subValue && (
            <div className="text-sm text-gray-400 font-medium mt-auto">
              {card.subValue}
            </div>
          )}

          {/* Hover Hint */}
          {!isExpanded && isHovered && card.isExpandable && (
            <div className="absolute bottom-4 right-4 text-xs text-blue-500 font-bold animate-pulse">
              Click to view details
            </div>
          )}

          {/* Expanded Content Area */}
          {isExpanded && (
            <div className="flex-1 mt-4 pt-4 border-t border-gray-100 overflow-y-auto animate-in fade-in slide-in-from-bottom-2">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-blue-500">
                  <Loader2 className="animate-spin w-8 h-8" />
                </div>
              ) : expandedData ? (
                <DashboardExpandedViews type={card.type} data={expandedData} />
              ) : (
                <div className="text-center text-gray-400 py-10">No details available.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InteractiveDashboardCard;