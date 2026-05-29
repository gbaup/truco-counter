export const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
export const NAME_RE = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{1,30}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(value: string): boolean {
    return UUID_RE.test(value);
}
