/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element, no-console */
'use client';

import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import PageLayout from '@/components/PageLayout';

interface RankingItem {
  vod_id: string;
  title?: string;
  name?: string;
  pic: string;
  score?: string;
  sub_title?: string;
  remarks?: string;
  content?: string;
}

export default function DiscoverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cateId = params.cateId as string;

  const [rankingData, setRankingData] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('榜单详情');
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const loadRankingData = async () => {
      setLoading(true);
      try {
        // 获取所有分页数据
        const allItems: RankingItem[] = [];
        let currentPage = 1;
        let hasMore = true;

        while (hasMore && currentPage <= 10) {
          const response = await fetch(
            `/api/discover/list?cateId=${cateId}&page=${currentPage}&pageSize=15`
          );
          const result = await response.json();

          if (result.success && result.data) {
            allItems.push(...result.data.list);
            hasMore = result.data.is_more && result.data.list.length > 0;
            currentPage++;
          } else {
            hasMore = false;
          }
        }

        setRankingData(allItems);
      } catch (error) {
        console.error('加载榜单详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    // 从 sessionStorage 获取分类信息
    const categoryInfo = sessionStorage.getItem(`discover_${cateId}`);
    if (categoryInfo) {
      const info = JSON.parse(categoryInfo);
      setCategoryName(info.name);
      setBackgroundImage(info.pic);
    }

    loadRankingData();
  }, [cateId]);

  const handleBack = () => {
    router.push('/?tab=discover');
  };

  const handleItemClick = (item: RankingItem) => {
    // 跳转到播放页面
    const title = item.title || item.name || '';
    router.push(`/play?title=${encodeURIComponent(title)}`);
  };

  return (
    <PageLayout activePath='/discover'>
      <div
        className='min-h-screen'
        style={{
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* 背景遮罩 */}
        <div className='min-h-screen backdrop-blur-[24px] bg-black/76'>
          <div className='max-w-[960px] mx-auto px-4 sm:px-6 py-12 sm:py-16'>
            {/* 头部 */}
            <div className='flex items-center justify-between mb-8'>
              <h1 className='text-3xl sm:text-4xl font-semibold text-white'>
                {categoryName}
              </h1>
              <button
                onClick={handleBack}
                className='flex items-center gap-2 text-white/80 hover:text-white text-sm px-4 py-2 rounded-full border border-white/35 hover:bg-white/10 transition-all'
              >
                <ArrowLeft size={16} />
                返回
              </button>
            </div>

            {/* 内容区域 */}
            {loading ? (
              <div className='text-center py-20'>
                <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white'></div>
                <p className='mt-4 text-white/60'>加载中...</p>
              </div>
            ) : rankingData.length > 0 ? (
              <div className='flex flex-col gap-4'>
                {rankingData.map((item, index) => (
                  <div
                    key={item.vod_id}
                    onClick={() => handleItemClick(item)}
                    className='flex gap-4 p-4 rounded-2xl bg-white/6 hover:bg-white/12 transition-all duration-200 cursor-pointer group'
                  >
                    {/* 排名 */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl text-xl font-bold flex items-center justify-center ${
                        index === 0
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black'
                          : index === 1
                          ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black'
                          : index === 2
                          ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-black'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* 海报 */}
                    <div className='flex-shrink-0 w-[120px] h-[170px] rounded-xl overflow-hidden bg-black/40'>
                      <img
                        src={item.pic}
                        alt={item.title || item.name}
                        className='w-full h-full object-cover'
                      />
                    </div>

                    {/* 信息 */}
                    <div className='flex-1 flex flex-col gap-2 sm:gap-3 min-w-0'>
                      <h3 className='text-lg sm:text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors truncate'>
                        {item.title || item.name}
                      </h3>
                      {item.score && (
                        <div className='text-base text-white/75'>
                          评分: {item.score}
                        </div>
                      )}
                      {(item.sub_title || item.remarks) && (
                        <div className='text-sm text-white/60 line-clamp-2'>
                          {item.sub_title || item.remarks}
                        </div>
                      )}
                      {item.content && (
                        <div className='text-sm text-white/85 leading-relaxed line-clamp-3'>
                          {item.content}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-20'>
                <p className='text-white/60'>暂无数据</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
