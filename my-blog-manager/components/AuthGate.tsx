"use client";

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AUTH_KEY = 'xh_admin_auth';

export default function AuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChange, setShowChange] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(AUTH_KEY) === '1') {
        setAuthed(true);
        return;
      }
    } catch (e) {}
    setAuthed(false);
    // 查一次是否默认密码
    (async () => {
      try {
        const r = await fetch(`/backend_config.json?t=${Date.now()}`);
        const cfg = await r.json();
        const res = await fetch(`http://127.0.0.1:${cfg.api_port}/api/auth/status`, { cache: 'no-store' });
        const data = await res.json();
        setIsDefault(!!data.isDefault);
      } catch (e) {}
    })();
  }, []);

  const login = async () => {
    if (!password.trim()) { setError('请输入密码'); return; }
    setLoading(true);
    setError('');
    try {
      const r = await fetch(`/backend_config.json?t=${Date.now()}`);
      const cfg = await r.json();
      const res = await fetch(`http://127.0.0.1:${cfg.api_port}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        try { localStorage.setItem(AUTH_KEY, '1'); } catch (e) {}
        setAuthed(true);
      } else {
        setError(data.message || '密码错误');
      }
    } catch (e) {
      setError('无法连接后端服务');
    }
    setLoading(false);
  };

  const changePw = async () => {
    if (!oldPw.trim() || !newPw.trim()) { setError('请填写完整'); return; }
    setLoading(true);
    setError('');
    try {
      const r = await fetch(`/backend_config.json?t=${Date.now()}`);
      const cfg = await r.json();
      const res = await fetch(`http://127.0.0.1:${cfg.api_port}/api/auth/change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw })
      });
      const data = await res.json();
      if (data.success) {
        setShowChange(false);
        setOldPw(''); setNewPw(''); setPassword('');
        setError('密码已修改，请用新密码登录');
        setIsDefault(false);
      } else {
        setError(data.message || '修改失败');
      }
    } catch (e) {
      setError('无法连接后端服务');
    }
    setLoading(false);
  };

  if (authed === null) return null;

  if (authed) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm rounded-[32px] bg-white/10 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-lg mb-4">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-widest">星辉云端·控制台</h1>
            <p className="text-xs text-slate-400 mt-2 font-medium">输入管理密码进入</p>
          </div>

          {!showChange ? (
            <div className="flex flex-col gap-4">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder={isDefault ? '默认密码 123456' : '管理密码'}
                className="w-full bg-white/10 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              {error && <p className="text-xs text-pink-400 font-bold px-1">{error}</p>}
              <button
                onClick={login}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl text-sm font-black shadow-xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? '验证中...' : '进 入'}
              </button>
              {isDefault && (
                <p className="text-[11px] text-amber-400/90 text-center px-2 leading-relaxed">
                  当前为默认密码，登录后建议点击下方「修改密码」
                </p>
              )}
              <button
                onClick={() => { setShowChange(true); setError(''); }}
                className="text-xs text-slate-400 hover:text-indigo-400 transition-colors font-medium py-1"
              >
                修改密码
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                type="password"
                value={oldPw}
                onChange={e => setOldPw(e.target.value)}
                placeholder="当前密码"
                className="w-full bg-white/10 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700 rounded-2xl px-5 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="新密码（至少 4 位）"
                className="w-full bg-white/10 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700 rounded-2xl px-5 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {error && <p className="text-xs text-pink-400 font-bold px-1">{error}</p>}
              <button
                onClick={changePw}
                disabled={loading}
                className="w-full py-3 bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? '提交中...' : '确认修改'}
              </button>
              <button
                onClick={() => { setShowChange(false); setError(''); }}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium py-1"
              >
                返回登录
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
