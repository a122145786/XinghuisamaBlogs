"use client";

import { motion } from 'framer-motion';

function LogoInput({ label, value, onChange, onClear }: any) {
  return (
    <div>
      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">{label}</label>
      <div className="flex items-center gap-3 mt-1">
        {value ? (
          value.trim().startsWith('<svg') ? (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/60 dark:border-slate-600 shadow-md shrink-0 bg-white/40 dark:bg-slate-700/40 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:block" dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            <img src={value} alt="logo" className="w-12 h-12 rounded-full object-cover border-2 border-white/60 dark:border-slate-600 shadow-md shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          )
        ) : (
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-400 shrink-0">Logo</div>
        )}
        <input
          type="text"
          value={value || ''}
          onChange={onChange}
          placeholder="SVG代码或图片URL，留空不显示"
          className="flex-1 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {value && (
          <button onClick={onClear} className="px-3 py-2 text-xs text-slate-500 hover:text-red-500 border border-slate-200 dark:border-slate-700 rounded-xl">清除</button>
        )}
      </div>
    </div>
  );
}

export default function HomeNoticeSection({ formData, handleUpdate, pushToQueue }: any) {
  const safeData = formData || {};
  const color = safeData.homeNoticeColor || '';
  const logo = safeData.homeNoticeLogo || '';
  const logo2 = safeData.homeNoticeLogo2 || '';
  const logo3 = safeData.homeNoticeLogo3 || '';

  const handleSave = () => pushToQueue('首页心语');

  const renderPreviewIcon = (svg: string) => {
    if (!svg) return null;
    if (svg.trim().startsWith('<svg')) {
      return <span className="inline-block w-5 h-5 align-[-3px] mx-1 overflow-hidden rounded-full" dangerouslySetInnerHTML={{ __html: svg }} />;
    }
    return <img src={svg} alt="" className="inline-block w-5 h-5 rounded-full align-[-3px] mx-1" />;
  };

  const previewText = (safeData.homeNotice || '').replace(/\[logo(?:\d)?\]/g, '▲');

  return (
    <motion.section
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-slate-800/50 rounded-[40px] p-8 shadow-2xl relative"
    >
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">💬 首页心语</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            在心语文字里打 <code className="px-1 bg-slate-200 dark:bg-slate-700 rounded">[logo]</code> 显示图标1，<code className="px-1 bg-slate-200 dark:bg-slate-700 rounded">[logo2]</code> 显示图标2，<code className="px-1 bg-slate-200 dark:bg-slate-700 rounded">[logo3]</code> 显示图标3。
          </p>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">心语内容 (homeNotice)</label>
          <textarea
            rows={4}
            value={safeData.homeNotice || ''}
            onChange={e => handleUpdate('homeNotice', e.target.value)}
            placeholder={'例如：[logo] github: https://g.a1221.cc  [logo2] 飞牛: https://fn.a1221.cc'}
            className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm mt-1 outline-none resize-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">文字颜色 (homeNoticeColor)</label>
          <div className="flex items-center gap-3 mt-1">
            <input type="color" value={color || '#334155'} onChange={e => handleUpdate('homeNoticeColor', e.target.value)}
              className="w-14 h-10 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent" />
            <input type="text" value={color || ''} onChange={e => handleUpdate('homeNoticeColor', e.target.value)}
              placeholder="#334155（留空用默认色）"
              className="flex-1 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            {color && <button onClick={() => handleUpdate('homeNoticeColor', '')} className="px-3 py-2 text-xs text-slate-500 hover:text-red-500 border border-slate-200 dark:border-slate-700 rounded-xl">清除</button>}
          </div>
        </div>

        <LogoInput label="图标1 (homeNoticeLogo) — 心语里用 [logo]" value={logo} onChange={e => handleUpdate('homeNoticeLogo', e.target.value)} onClear={() => handleUpdate('homeNoticeLogo', '')} />
        <LogoInput label="图标2 (homeNoticeLogo2) — 心语里用 [logo2]" value={logo2} onChange={e => handleUpdate('homeNoticeLogo2', e.target.value)} onClear={() => handleUpdate('homeNoticeLogo2', '')} />
        <LogoInput label="图标3 (homeNoticeLogo3) — 心语里用 [logo3]" value={logo3} onChange={e => handleUpdate('homeNoticeLogo3', e.target.value)} onClear={() => handleUpdate('homeNoticeLogo3', '')} />

        {/* 实时预览 */}
        <div className="bg-white/30 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/50 rounded-3xl p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-3 ml-1">前台效果预览</p>
          <div className="rounded-2xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 px-6 py-5">
            <p className="text-left font-bold text-lg tracking-widest whitespace-pre-wrap leading-relaxed" style={{ color: color || undefined }}>
              {renderPreviewIcon(logo)}{previewText}
            </p>
          </div>
        </div>

        <button onClick={handleSave} className="px-10 py-3 bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-xl hover:bg-indigo-600 transition-all active:scale-95 w-full md:w-auto">
          暂存修改至操作队列
        </button>
      </div>
    </motion.section>
  );
}
