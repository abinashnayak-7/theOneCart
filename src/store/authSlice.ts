import type{ PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type{ User } from "../types";

const USERS_KEY = "kart_users";
const SESSION_KEY = "kart_session";

// ── Helpers ──────────────────────────────────────────────────────────────────

export const hashPassword = (password: string): string =>
  btoa(unescape(encodeURIComponent(password)));

export const loadUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
};

export const loadSession = (): User | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveSession = (user: User | null): void => {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch {}
};

// ── State ─────────────────────────────────────────────────────────────────────

interface AuthState {
  currentUser: User | null;
  users: User[];
  error: string | null;
}

const initialState: AuthState = {
  currentUser: loadSession(),
  users: loadUsers(),
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Register a new user
    register(
      state,
      action: PayloadAction<{ name: string; email: string; password: string }>
    ) {
      const { name, email, password } = action.payload;

      const exists = state.users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (exists) {
        state.error = "An account with this email already exists.";
        return;
      }

      const newUser: User = {
        id: `u_${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      };

      state.users.push(newUser);
      state.currentUser = newUser;
      state.error = null;

      saveUsers(state.users);
      saveSession(newUser);
    },

    // Login an existing user
    login(
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) {
      const { email, password } = action.payload;

      const user = state.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        state.error = "No account found with that email.";
        return;
      }

      if (user.passwordHash !== hashPassword(password)) {
        state.error = "Incorrect password.";
        return;
      }

      state.currentUser = user;
      state.error = null;
      saveSession(user);
    },

    // Logout
    logout(state) {
      state.currentUser = null;
      state.error = null;
      saveSession(null);
    },

    // Clear any auth error
    clearError(state) {
      state.error = null;
    },
  },
});

export const { register, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;