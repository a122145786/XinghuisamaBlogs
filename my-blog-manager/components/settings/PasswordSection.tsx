"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PasswordSection({ formData, handleUpdate, pushToQueue }: any) {
  const safeData = formData || {};
  const [show, setShow] = useState(false);
  const password = safeData.sitePassword || '';

  const handleSave = () => pushToQueue('站点密码');

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
            🔒 前台访问密码
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            设置前台网站的访问密码。开启后，访客打开网站需输入此密码才能进入。留空则不需要密码。
          </p>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">访问密码 (sitePassword)</label>
          <div className="flex items-center gap-3 mt-1">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => handleUpdate('sitePassword', e.target.value)}
              placeholder="留空 = 不启用密码"
              className="flex-1 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <button
              onClick={() => setShow(!show)}
              className="px-4 py-3 text-xs font-bold text-slate-500 hover:text-indigo-500 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white/40 dark:bg-slate-800/40"
            >
              {show ? '隐藏' : '显示'}
            </button>
          </div>
        </div>

        <div className="bg-white/30 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/50 rounded-3xl p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-3 ml-1">当前状态</p>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {password ? (
              <>
                <span className="text-emerald-500 mr-2">●</span>已启用密码（输入一次后浏览器会记住）
              </>
            ) : (
              <>
                <span className="text-slate-400 mr-2">○</span>未启用，任何人可直接访问
              </>
            )}
          </p>
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
