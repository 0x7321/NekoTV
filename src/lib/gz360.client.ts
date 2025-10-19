/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * gz360 Discover 榜单 API 客户端
 * 遵循 KISS, DRY 原则
 */

import { decrypt, encrypt } from './gz360-crypto';

const BASE_API = 'https://haiwaiapi.1fc8ab0.com/Pc';

interface ApiResponse {
  code: number;
  data?: string;
  message?: string;
}

interface DiscoverIndexData {
  section: Array<{
    name: string;
    list: Array<{
      cate_id: string;
      name: string;
      pic: string;
    }>;
  }>;
  rank: Array<{
    name: string;
    list: Array<{
      cate_id: string;
      name: string;
      pic: string;
    }>;
  }>;
}

interface DiscoverListData {
  list: Array<{
    vod_id: string;
    title?: string;
    name?: string;
    pic: string;
    score?: string;
    sub_title?: string;
    remarks?: string;
    content?: string;
  }>;
  is_more: boolean;
}

/**
 * 通用 POST 请求
 */
async function post(
  endpoint: string,
  params: Record<string, any>
): Promise<ApiResponse> {
  const encrypted = encrypt(params);
  const payload = JSON.stringify({ params: encrypted });

  const response = await fetch(`${BASE_API}${endpoint}`, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
      origin: 'https://gz360.tv',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
    body: payload,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 获取 Discover 首页索引（榜单分类）
 */
export async function getDiscoverIndex(): Promise<DiscoverIndexData> {
  const response = await post('/Discover/GetIndex', {
    page: 1,
    pageSize: 10,
  });

  if (response.code !== 200 || !response.data) {
    throw new Error(response.message || '获取榜单索引失败');
  }

  return decrypt(response.data) as DiscoverIndexData;
}

/**
 * 获取特定分类的榜单列表
 */
export async function getDiscoverList(
  cateId: string | number,
  page = 1,
  pageSize = 15
): Promise<DiscoverListData> {
  const response = await post('/Discover/GetList', {
    page,
    pageSize,
    cateId: String(cateId),
  });

  if (response.code !== 200 || !response.data) {
    throw new Error(response.message || '获取榜单列表失败');
  }

  return decrypt(response.data) as DiscoverListData;
}

/**
 * 获取分类的所有分页数据
 */
export async function getDiscoverListAll(
  cateId: string | number,
  pageSize = 15
): Promise<DiscoverListData['list']> {
  const allItems: DiscoverListData['list'] = [];
  let currentPage = 1;
  let hasMore = true;

  while (hasMore) {
    const data = await getDiscoverList(cateId, currentPage, pageSize);
    allItems.push(...data.list);

    hasMore = data.is_more && data.list.length > 0;
    currentPage++;

    // 安全限制：最多抓取10页
    if (currentPage > 10) break;
  }

  return allItems;
}
