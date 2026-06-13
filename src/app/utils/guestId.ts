const GUEST_ID_KEY = "careerpass_guest_id";
const STATE_PREFIX = "careerpass_state_";

/** 获取或生成此设备的唯一访客 ID（永不清除） */
export function getGuestId(): string {
  try {
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id) {
      // 格式：GUEST-2026-A3F8K1 (年份 + 6位随机大写)
      const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
      id = `GUEST-${new Date().getFullYear()}-${suffix}`;
      localStorage.setItem(GUEST_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage 不可用时，返回内存中的临时 ID
    return `GUEST-${Date.now().toString(36).toUpperCase()}`;
  }
}

/** 获取该访客的状态存储 key */
export function getStateKey(guestId: string): string {
  return `${STATE_PREFIX}${guestId}`;
}

/** 保存用户状态到 localStorage */
export function saveGuestState(guestId: string, state: unknown): void {
  try {
    localStorage.setItem(getStateKey(guestId), JSON.stringify(state));
  } catch {
    // 静默失败（如存储已满）
  }
}

/** 读取用户状态 */
export function loadGuestState(guestId: string): unknown | null {
  try {
    const raw = localStorage.getItem(getStateKey(guestId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** 清除用户状态（但仍保留 guestId，下次可重建） */
export function clearGuestState(guestId: string): void {
  try {
    localStorage.removeItem(getStateKey(guestId));
  } catch {
    // 静默失败
  }
}
