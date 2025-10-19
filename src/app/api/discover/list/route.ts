/* eslint-disable no-console */
/**
 * Discover 榜单列表 API
 * GET /api/discover/list?cateId=xxx&page=1&pageSize=15
 */

import { NextRequest, NextResponse } from 'next/server';

import { getDiscoverList } from '@/lib/gz360.client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cateId = searchParams.get('cateId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '15', 10);

    if (!cateId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少 cateId 参数',
        },
        { status: 400 }
      );
    }

    const data = await getDiscoverList(cateId, page, pageSize);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取 Discover 列表失败:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取榜单列表失败',
      },
      { status: 500 }
    );
  }
}
