export type EnabledSupabaseConfig = { enabled: true; url: string; publishableKey: string };
export type SupabaseConfig = EnabledSupabaseConfig | { enabled: false; reason: "missing" | "incomplete" | "invalid" };
export function isPublicSupabaseKey(value: unknown): boolean;
export function normalizeSupabaseUrl(value: unknown): string | null;
export function readSupabaseConfig(env?: Record<string, string | undefined>): SupabaseConfig;
