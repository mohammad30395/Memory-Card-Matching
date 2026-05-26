import { DEFAULT_SETTINGS, DEFAULT_USER, STORAGE_KEYS } from "./constants";
import type { GameSettings, UserProfile } from "./types";

const isBrowser = () => typeof window !== "undefined";

export function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(key);
}

export function getUserProfile(): UserProfile {
  const user = readStorage<UserProfile>(STORAGE_KEYS.user, DEFAULT_USER);
  return {
    name: user.name ?? "",
    username: user.username ?? "",
  };
}

export function saveUserProfile(user: UserProfile) {
  const normalizedUser = {
    name: user.name.trim(),
    username: user.username.trim(),
  };
  writeStorage(STORAGE_KEYS.user, normalizedUser);

  const settings = getGameSettings();
  writeStorage(STORAGE_KEYS.settings, {
    ...settings,
    user: normalizedUser,
  });
}

export function getGameSettings(): GameSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...readStorage<GameSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
  };
}

export function saveGameSettings(settings: Partial<GameSettings>) {
  writeStorage(STORAGE_KEYS.settings, {
    ...getGameSettings(),
    ...settings,
  });
}
