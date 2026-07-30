import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    const success = login(username.trim(), password.trim());
    if (!success) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-mulish" style={{ background: 'linear-gradient(135deg, #B02A30 0%, #8B1A1F 40%, #003D50 70%, #005B75 100%)' }}>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* ICICI Lombard Logo */}
            <div className="text-center mb-6">
              <img src="/icici-logo.jpg" alt="ICICI Lombard" className="h-16 mx-auto mb-4 rounded-lg shadow-lg" />
              <h1 className="text-lg font-black text-gray-900">India Power Sector Dashboard</h1>
              <p className="text-xs text-gray-500 mt-1">Power & Energy Practice</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase block mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-icici-maroon focus:border-transparent"
                  placeholder="Enter username"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase block mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-icici-maroon focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-red-700 text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-icici-maroon to-icici-navy text-white font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
            </form>
          </div>

          {/* Disclaimer */}
          <div className="mt-5 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <p className="text-[11px] text-white/90 font-semibold text-center mb-2">Internal & Confidentiality Notice</p>
            <p className="text-[10px] text-white/70 text-center leading-relaxed">
              This portal and its contents are intended solely for internal use by authorized personnel. The information provided herein is compiled from third-party and public external sources for informational and analytical purposes only. While reasonable efforts are made to ensure accuracy, ICICI Lombard makes no representations or warranties regarding the completeness, reliability, or accuracy of the data.
            </p>
            <p className="text-[10px] text-white/70 text-center leading-relaxed mt-2">
              By logging in, you acknowledge that this information should not be solely relied upon for legal, commercial, or financial decisions, and you agree not to distribute or circulate any content externally without prior written authorization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
