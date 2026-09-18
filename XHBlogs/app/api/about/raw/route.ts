// app/api/about/raw/route.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fullPath = path.join(process.cwd(), 'app', 'about', 'about.md');
    const content = fs.readFileSync(fullPath, 'utf8');
    return NextResponse.json({ success: true, content });
  } catch (e) {
    return NextResponse.json({ success: false, message: '读取失败: ' + (e as Error).message }, { status: 500 });
  }
}
