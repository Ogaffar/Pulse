export const AUTH_KEY = "pulse_authed";

export function isAuthed(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAuthed() {
  try {
    localStorage.setItem(AUTH_KEY, "true");
  } catch {}
}

export function clearAuthed() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {}
}
