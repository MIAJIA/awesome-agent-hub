import { NextRequest, NextResponse } from 'next/server';
import { readdirSync, readFileSync } from 'fs';
import { join, extname } from 'path';

const DATA_DIR = join(process.cwd(), '..', 'data');

export async function GET(req: NextRequest) {
  try {
    const files = readdirSync(DATA_DIR).filter(f => extname(f) === '.json');
    const agents = files.map(f => {
      const content = readFileSync(join(DATA_DIR, f), 'utf-8');
      return JSON.parse(content);
    });
    return NextResponse.json(agents);
  } catch (e) {
    return new NextResponse('Failed to load agents', { status: 500 });
  }
}