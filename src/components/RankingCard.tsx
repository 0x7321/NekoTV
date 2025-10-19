/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';

interface RankingCardProps {
  title: string;
  backgroundImage: string;
  topItems: Array<{
    title: string;
    poster: string;
  }>;
  onViewMore?: () => void;
}

const RankingCard: React.FC<RankingCardProps> = ({
  title,
  backgroundImage,
  topItems,
  onViewMore,
}) => {
  return (
    <div
      className='ranking-card min-w-[340px] min-h-[300px] rounded-[18px] p-[18px] flex flex-col gap-4 relative overflow-hidden'
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 渐变遮罩 */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/25 to-black/85 z-0'></div>

      {/* 查看全部按钮 */}
      {onViewMore && (
        <div className='absolute top-4 right-[18px] z-10'>
          <button
            onClick={onViewMore}
            className='text-white text-sm px-[10px] py-1 rounded-full bg-[#111111]/65 border border-white/35 hover:bg-white/90 hover:text-[#111] transition-all'
          >
            查看全部 &gt;
          </button>
        </div>
      )}

      {/* 标题 */}
      <div className='relative z-10'>
        <h3 className='text-white text-lg font-semibold'>{title}</h3>
      </div>

      {/* 视频海报 - 堆叠样式 */}
      <div className='relative z-10 flex gap-3'>
        {topItems.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className={`flex-1 h-[170px] rounded-xl overflow-hidden bg-black/40 rank-${
              index + 1
            }`}
          >
            <img
              src={item.poster}
              alt={item.title}
              className='w-full h-full object-cover'
            />
          </div>
        ))}
      </div>

      {/* 排名列表 */}
      <div className='relative z-10 flex flex-col gap-2'>
        {topItems.slice(0, 3).map((item, index) => (
          <div key={index} className='flex items-center gap-3'>
            <span
              className={`ranking-number flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                index === 0
                  ? 'bg-[#fbbf24] text-[#111] rank-1'
                  : index === 1
                  ? 'bg-white/60 text-[#111] rank-2'
                  : 'bg-white/35 text-[#111] rank-3'
              }`}
            >
              {index + 1}
            </span>
            <div className='flex-1 min-w-0'>
              <h3 className='text-white text-base font-medium truncate max-w-[220px]'>
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingCard;
