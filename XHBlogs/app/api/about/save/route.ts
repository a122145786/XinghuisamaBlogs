// app/api/about/save/route.ts
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let content: string;
  let frontmatter = '';
  try {
    const body = await req.json();
    content = body.content;
    frontmatter = body.frontmatter || '';
  } catch (e) {
    return NextResponse.json({ success: false, message: '请求体解析失败' }, { status: 400 });
  }
  if (typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ success: false, message: '内容不能为空' }, { status: 400 });
  }

  // 重新拼回完整文件（frontmatter + 正文）
  const fullContent = frontmatter
    ? frontmatter.replace(/\n*$/, '') + '\n\n' + content.replace(/^\n+/, '') + '\n'
    : content + '\n';

  // 探测：线上环境（Vercel serverless）文件系统只读，无法直接写文件
  try {
    const probe = path.join(process.cwd(), '.write-probe.tmp');
    fs.writeFileSync(probe, 'ok');
    fs.unlinkSync(probe);
  } catch (e) {
    return NextResponse.json({
      success: false,
      code: 'READONLY',
      message: '线上环境无法直接保存。请打开本地网站（localhost:3000）编辑并保存，保存后会自动部署到线上。',
    }, { status: 500 });
  }

  try {
    // 1. 写入本地 about.md（XHBlogs）
    const aboutPath = path.join(process.cwd(), 'app', 'about', 'about.md');
    fs.writeFileSync(aboutPath, fullContent, 'utf8');

    // 2. 同步写入后台控制台副本（保证两处一致）
    const repoRoot = path.resolve(process.cwd(), '..');
    const managerAbout = path.join(repoRoot, 'my-blog-manager', 'app', 'about', 'about.md');
    try {
      fs.mkdirSync(path.dirname(managerAbout), { recursive: true });
      fs.writeFileSync(managerAbout, fullContent, 'utf8');
    } catch (e) {
      // 后台副本写入失败不阻断主流程
    }

    // 3. 自动 git 提交 + 推送（使用本机 SSH 配置，无需登录）
    try {
      execSync('git add -A && git commit -m "feat: 网页端更新关于页" || echo "no changes"', {
        cwd: repoRoot,
        stdio: 'pipe',
        encoding: 'utf8',
      });
      execSync('git push origin main', {
        cwd: repoRoot,
        stdio: 'pipe',
        encoding: 'utf8',
      });
    } catch (gitErr) {
      return NextResponse.json({
        success: false,
        message: '文件已保存到本地，但自动推送失败：' + (gitErr as Error).message.slice(0, 200),
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '已保存并推送，网站约 1-2 分钟后自动更新',
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: '写入失败: ' + (e as Error).message }, { status: 500 });
  }
}
