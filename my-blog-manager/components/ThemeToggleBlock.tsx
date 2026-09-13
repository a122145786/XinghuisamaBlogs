"use client";

import { useTheme } from './ThemeProvider';

// 这里的 export default 非常关键！没有 default 就会报你那个错误
export default function ThemeToggleBlock() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      // 【核心修复】：移除了定高限制 (h-[180px] md:h-auto)，换成了统一的 h-full w-full
      className={`h-full w-full rounded-3xl backdrop-blur-md border shadow-xl flex items-center justify-center transition-all duration-500 hover:scale-[1.05] cursor-pointer group relative overflow-hidden
        ${isDark ? 'bg-slate-800/40 border-slate-600/50' : 'bg-white/40 border-white/60'}
      `}
    >
       {/* 日夜交替动画图标 */}
       <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-inner flex-shrink-0">
          <div className={`absolute inset-0 transition-transform duration-700 ${isDark ? '-translate-y-full' : 'translate-y-0'} bg-gradient-to-tr from-sky-300 to-yellow-200`}></div>
          <div className={`absolute inset-0 transition-transform duration-700 ${isDark ? 'translate-y-0' : 'translate-y-full'} bg-gradient-to-tr from-indigo-900 to-slate-800`}></div>

          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'} text-3xl drop-shadow-md`}>
            🌸
          </div>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'} text-3xl drop-shadow-md`}>
            ✨
          </div>
       </div>
    </div>
  );
}