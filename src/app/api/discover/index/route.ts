/* eslint-disable no-console */
/**
 * Discover 榜单索引 API
 * GET /api/discover/index
 */

import { NextResponse } from 'next/server';

import { getDiscoverIndex } from '@/lib/gz360.client';

export async function GET() {
  try {
    const data = await getDiscoverIndex();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取 Discover 索引失败:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取榜单索引失败',
      },
      { status: 500 }
    );
  }
}
