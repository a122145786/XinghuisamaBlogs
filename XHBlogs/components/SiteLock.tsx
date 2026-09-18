"use client";

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '../siteConfig';

const UNLOCK_KEY = 'xh_site_unlocked';

export default function SiteLock({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const required = siteConfig.sitePassword || '';

  useEffect(() => {
    if (!required) {
      setUnlocked(true);
      return;
    }
    try {
      if (localStorage.getItem(UNLOCK_KEY) === '1') {
        setUnlocked(true);
        return;
      }
    } catch (e) {}
    setUnlocked(false);
  }, [required]);

  const submit = () => {
    if (!password) { setError('请输入密码'); return; }
    if (password === required) {
      try { localStorage.setItem(UNLOCK_KEY, '1'); } catch (e) {}
      setUnlocked(true);
    } else {
      setError('密码错误');
    }
  };

  if (unlocked === null) return null;

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-2xl p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm rounded-[32px] bg-white/15 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/30 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-500/30 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/40 dark:border-white/20 shadow-2xl mb-4 bg-white">
              <img src={siteConfig.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-black text-white tracking-widest">{siteConfig.authorName}</h1>
            <p className="text-xs text-slate-300/80 mt-2 font-medium">输入访问密码进入</p>
          </div>

          <div className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="访问密码"
              className="w-full bg-white/15 dark:bg-slate-800/60 border border-white/25 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-300/60 outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            {error && <p className="text-xs text-pink-400 font-bold px-1">{error}</p>}
            <button
              onClick={submit}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl text-sm font-black shadow-xl hover:opacity-90 transition-all active:scale-[0.98]"
            >
              进 入
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
