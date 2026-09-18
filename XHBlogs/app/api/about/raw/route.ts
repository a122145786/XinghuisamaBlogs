// app/api/about/raw/route.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fullPath = path.join(process.cwd(), 'app', 'about', 'about.md');
    const raw = fs.readFileSync(fullPath, 'utf8');

    // 剥离 YAML frontmatter（--- 开头到第二个 --- 结束），只给编辑者看正文
    let frontmatter = '';
    let content = raw;
    if (raw.startsWith('---')) {
      const endIdx = raw.indexOf('\n---', 3);
      if (endIdx !== -1) {
        frontmatter = raw.slice(0, endIdx + 4); // 包含结束的 ---
        content = raw.slice(endIdx + 4).replace(/^\n+/, '');
      }
    }

    return NextResponse.json({ success: true, frontmatter, content });
  } catch (e) {
    return NextResponse.json({ success: false, message: '读取失败: ' + (e as Error).message }, { status: 500 });
  }
}
