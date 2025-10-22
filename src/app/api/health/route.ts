import { NextResponse } from 'next/server';
import { getCacheInfo } from '@/lib/dataLoader';

export async function GET() {
  const cacheInfo = getCacheInfo();

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cache: cacheInfo
  });
}