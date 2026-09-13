"use client";

import { motion } from 'framer-motion';

// 🌟 首页心语设置：在这里输入一段文字，暂存并同步后会显示在前台首页横幅上
export default function HomeNoticeSection({ formData, handleUpdate, pushToQueue }: any) {
  const safeData = formData || {};

  const handleSave = () => {
    pushToQueue('首页心语');
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-slate-800/50 rounded-[40px] p-8 shadow-2xl relative"
    >
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            💬 首页心语
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            输入一段欢迎语或当下的心情，保存并同步后会以毛玻璃横幅的形式展示在前台首页个人卡片下方。留空则不显示。
          </p>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">心语内容 (homeNotice)</label>
          <textarea
            rows={4}
            value={safeData.homeNotice || ''}
            onChange={e => handleUpdate('homeNotice', e.target.value)}
            placeholder="例如：今天也要元气满满地写代码呀~"
            className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm mt-1 outline-none resize-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        {/* 实时预览 */}
        <div className="bg-white/30 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/50 rounded-3xl p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-3 ml-1">前台效果预览</p>
          <div className="rounded-2xl bg-gradient-to-r from-indigo-500/80 via-purple-500/80 to-pink-500/80 backdrop-blur-md border border-white/30 px-6 py-5 shadow-lg">
            <p className="text-center text-white font-bold text-lg sm:text-xl drop-shadow-sm">
              {safeData.homeNotice || '（这里将显示你输入的文字）'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-10 py-3 bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-xl hover:bg-indigo-600 transition-all active:scale-95 w-full md:w-auto"
        >
          暂存修改至操作队列
        </button>
      </div>
    </motion.section>
  );
}
