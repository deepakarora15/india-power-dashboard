import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserRole = 'admin' | 'user' | null;

interface UserAccount {
  username: string;
  password: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface LoginLog {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  loginTime: string;
  ipAddress: string;
  userAgent: string;
}

interface AuthStore {
  isLoggedIn: boolean;
  role: UserRole;
  username: string;
  email: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const USERS_STORAGE_KEY = 'power-dashboard-users';
const LOGIN_LOGS_KEY = 'power-dashboard-login-logs';

// Default accounts (always available)
const DEFAULT_ACCOUNTS: UserAccount[] = [
  { username: 'admin', password: 'admin123', email: 'admin@icicilombard.com', role: 'admin', createdAt: '2025-01-01' },
  { username: 'user', password: 'user123', email: 'user@icicilombard.com', role: 'user', createdAt: '2025-01-01' },
];

// Get all user accounts (default + admin-created)
export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    const custom: UserAccount[] = raw ? JSON.parse(raw) : [];
    return [...DEFAULT_ACCOUNTS, ...custom];
  } catch { return [...DEFAULT_ACCOUNTS]; }
}

// Admin creates a new user
export function createUser(username: string, password: string, role: UserRole): { success: boolean; error?: string } {
  const allUsers = getAllUsers();
  if (allUsers.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: 'Username already exists.' };
  }
  const email = `${username}@icicilombard.com`;
  const newUser: UserAccount = { username, password, email, role, createdAt: new Date().toLocaleString() };
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    const custom: UserAccount[] = raw ? JSON.parse(raw) : [];
    custom.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(custom));
    return { success: true };
  } catch { return { success: false, error: 'Storage error.' }; }
}

// Delete a user (only custom ones, not defaults)
export function deleteUser(username: string): boolean {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    const custom: UserAccount[] = raw ? JSON.parse(raw) : [];
    const filtered = custom.filter(u => u.username !== username);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch { return false; }
}

// Login logs
export function getLoginLogs(): LoginLog[] {
  try {
    const raw = localStorage.getItem(LOGIN_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLoginLog(log: LoginLog) {
  const logs = getLoginLogs();
  logs.unshift(log);
  localStorage.setItem(LOGIN_LOGS_KEY, JSON.stringify(logs.slice(0, 500)));
}

async function fetchIP(): Promise<string> {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip || 'Unknown';
  } catch { return 'Unknown'; }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      role: null,
      username: '',
      email: '',

      login: (username: string, password: string) => {
        const allUsers = getAllUsers();
        const user = allUsers.find(u => u.username === username && u.password === password);
        if (!user) return false;

        set({ isLoggedIn: true, role: user.role, username: user.username, email: user.email });

        // Log the login (async)
        fetchIP().then((ip) => {
          saveLoginLog({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
            username: user.username,
            email: user.email,
            role: user.role,
            loginTime: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium' }),
            ipAddress: ip,
            userAgent: navigator.userAgent,
          });
        });

        return true;
      },

      logout: () => {
        set({ isLoggedIn: false, role: null, username: '', email: '' });
      },
    }),
    {
      name: 'power-dashboard-auth',
      version: 2,
      migrate: () => ({
        isLoggedIn: false,
        role: null,
        username: '',
        email: '',
      }),
    }
  )
);
