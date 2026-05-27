import es from "@/locales/es.json";
import esColoquial from "@/locales/es-coloquial.json";

type Translations = Record<string, unknown>;

function getNestedValue(obj: Translations, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : path;
}

export function serverT(key: string, interpolations?: Record<string, string>): string {
  const lang = process.env.NEXT_PUBLIC_APP_LANG ?? "es";
  const translations = lang === "es-coloquial" ? (esColoquial as Translations) : (es as Translations);
  let value = getNestedValue(translations, key);

  if (interpolations) {
    for (const [k, v] of Object.entries(interpolations)) {
      value = value.replace(`{{${k}}}`, v);
    }
  }

  return value;
}
