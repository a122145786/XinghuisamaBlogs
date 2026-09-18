// app/api/about/save/route.ts
import { NextRequest, NextResponse } from 'next/server';

const OWNER = 'a122145786';
const REPO = 'XinghuisamaBlogs';
const FILE_PATH = 'XHBlogs/app/about/about.md';

export async function POST(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { success: false, message: '未配置 GITHUB_TOKEN（请在 Vercel 环境变量中添加）' },
      { status: 500 }
    );
  }

  let content: string;
  try {
    const body = await req.json();
    content = body.content;
  } catch (e) {
    return NextResponse.json({ success: false, message: '请求体解析失败' }, { status: 400 });
  }
  if (typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ success: false, message: '内容不能为空' }, { status: 400 });
  }

  const api = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'xinghui-blog-editor',
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    // 1. 获取当前文件 sha
    const getRes = await fetch(api, { headers, cache: 'no-store' });
    if (!getRes.ok) {
      const txt = await getRes.text();
      return NextResponse.json({ success: false, message: '读取仓库文件失败: ' + txt.slice(0, 200) }, { status: 500 });
    }
    const meta = await getRes.json();
    const sha = meta.sha;

    // 2. 提交新内容
    const putRes = await fetch(api, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: 'feat: 网页端更新关于页',
        content: Buffer.from(content, 'utf-8').toString('base64'),
        sha,
      }),
    });
    if (!putRes.ok) {
      const txt = await putRes.text();
      return NextResponse.json({ success: false, message: '提交失败: ' + txt.slice(0, 200) }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '已提交到 GitHub，网站将自动重新部署，约 1-2 分钟后生效',
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: '网络错误: ' + (e as Error).message }, { status: 500 });
  }
}
