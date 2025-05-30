import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// 获取项目根目录的 data 目录（与 ai-agent-hub-web 同级）
const DATA_DIR = join(process.cwd(), '..', 'data');

export async function GET(req: NextRequest, context: { params: { filename: string } }) {
  const params = await context.params;
  const filePath = join(DATA_DIR, `${params.filename}.json`);
  try {
    const data = readFileSync(filePath, 'utf-8');
    return new NextResponse(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new NextResponse('Not found', { status: 404 });
  }
}
