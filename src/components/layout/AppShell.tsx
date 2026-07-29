import { ReactNode } from 'react';
import { useFilterStore } from '@/store/filterStore';
import { useAuthStore } from '@/store/authStore';

interface AppShellProps {
  children: ReactNode;
}

const SECTIONS = [
  { id: 'industry-overview', label: 'Industry Overview', icon: '🏭' },
  { id: 'generation', label: 'Generation', icon: '⚡' },
  { id: 'ownership', label: 'Ownership', icon: '🏛️' },
  { id: 'risks', label: 'Risk Analysis', icon: '🛡️' },
  { id: 'market-players', label: 'Market Players', icon: '🏢' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'downloads', label: 'Downloads', icon: '📥' },
  { id: 'audit-logs', label: 'Audit Logs', icon: '📋' },
  { id: 'geography', label: 'Geography', icon: '🗺️' },
  { id: 'quiz', label: 'Power Quiz', icon: '🎮' },
];

export function AppShell({ children }: AppShellProps) {
  const activeSection = useFilterStore((s) => s.activeSection);
  const setActiveSection = useFilterStore((s) => s.setActiveSection);
  const sectorView = useFilterStore((s) => s.sectorView);
  const setSectorView = useFilterStore((s) => s.setSectorView);
  const { role, username, logout } = useAuthStore();

  // Filter out Downloads and Audit Logs tabs for non-admin users
  const visibleSections = SECTIONS.filter(
    (s) => (s.id !== 'downloads' && s.id !== 'audit-logs') || role === 'admin'
  );

  return (
    <div className="min-h-screen bg-icici-cream flex flex-col font-mulish">
      {/* ICICI Lombard Branded Header */}
      <header className="icici-gradient sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* ICICI Lombard Logo */}
            <div className="hidden tablet:flex items-center gap-2">
              <div className="bg-gradient-to-r from-[#D94F00] to-[#F47B20] rounded-lg px-4 py-2 flex items-center gap-1 shadow-md">
                <span className="text-white text-xl font-black italic leading-none" style={{ fontFamily: 'serif' }}>i</span>
                <span className="text-white text-base font-black tracking-tight">CICI</span>
                <span className="text-white text-base font-black ml-0.5 flex items-center">
                  <span className="inline-block w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black mr-0.5">G</span>
                  Lombard
                </span>
              </div>
            </div>
            <div className="hidden tablet:block">
              <h1 className="text-lg font-bold text-white leading-tight">
                India {sectorView === 'all' ? 'Power Sector' : sectorView === 'fossil' ? 'Fossil Energy' : 'Non-Fossil Energy'}
              </h1>
              <p className="text-[14px] text-white/70 font-medium tracking-wide uppercase">
                Analytics Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sector View Toggle */}
            <div className="flex bg-white/10 rounded-lg p-0.5">
              {[
                { id: 'all' as const, label: '⚡ All', full: 'Power Sector' },
                { id: 'fossil' as const, label: '🔥 Fossil', full: 'Fossil' },
                { id: 'non_fossil' as const, label: '🌿 Non-Fossil', full: 'Non-Fossil' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSectorView(v.id)}
                  className={`px-3 py-1.5 rounded-md text-[14px] font-bold transition-all ${
                    sectorView === v.id
                      ? 'bg-white text-icici-maroon shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            {/* User info + Logout */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-white/60 hidden tablet:inline">
                {role === 'admin' ? '🔑' : '👤'} {username}
              </span>
              <button
                onClick={logout}
                className="text-[12px] text-white/80 hover:text-white font-bold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="max-w-[1920px] mx-auto px-6 overflow-x-auto">
          <div className="flex space-x-1 pb-3">
            {visibleSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg whitespace-nowrap transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-white text-icici-maroon shadow-md -mb-[1px]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                aria-current={activeSection === section.id ? 'page' : undefined}
              >
                <span className="mr-1.5">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1920px] mx-auto w-full px-6 py-6 pb-16">
        {children}
      </main>

      {/* Footer - Fixed at bottom */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#263f4a] py-2 px-6" style={{ borderTop: '3px solid #4db6ac' }}>
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <span className="text-[13px] text-white/90">
            ICICI Lombard General Insurance Company Ltd.
          </span>
          <span className="text-[11px] text-amber-300 font-semibold">
            For Internal Use Only
          </span>
          <span className="text-[13px] text-white/90">
            Designed by <span className="font-bold text-white">Deepak Arora</span>
          </span>
        </div>
      </footer>
    </div>
  );
}


