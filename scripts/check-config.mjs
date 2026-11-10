#!/usr/bin/env node

import { isIP } from "node:net";
import { isPublicSupabaseKey, readSupabaseConfig } from "../lib/supabase/config.mjs";

const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log("Cách dùng: node --env-file-if-exists=deploy/.env scripts/check-config.mjs [--production]");
  console.log("Kiểm tra cấu hình tại chỗ; không gửi yêu cầu mạng hoặc in giá trị khóa.");
  process.exit(0);
}

if (args.some((arg) => arg !== "--production")) {
  console.error("Tùy chọn không hợp lệ. Dùng --help để xem cách chạy.");
  process.exit(1);
}

const production = args.includes("--production");
const env = process.env;
const errors = [];
const notes = [];
const domain = (env.DOMAIN || "").trim().toLowerCase();
const siteUrl = (env.SITE_URL || "").trim();
const indexable = (env.SITE_INDEXABLE || "false").trim();

function isPublicDomain(value) {
  if (!value || value.length > 253 || isIP(value)) return false;
  const labels = value.split(".");
  if (labels.length < 2 || labels.some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) {
    return false;
  }
  if (/^(?:\d+\.)+\d+$/.test(value)) return false;
  return !/(^|\.)(localhost|local|internal|test|invalid|example|example\.com|example\.net|example\.org)$/.test(value);
}

function parseSiteUrl(value) {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/") return null;
    return url;
  } catch {
    return null;
  }
}

if (!["true", "false"].includes(indexable)) {
  errors.push("SITE_INDEXABLE chỉ nhận true hoặc false.");
}

if (domain && !isPublicDomain(domain)) {
  errors.push("DOMAIN phải là tên miền DNS thật, không có giao thức, cổng, đường dẫn hoặc ký tự đại diện.");
} else if (production && !domain) {
  errors.push("Thiếu DOMAIN: điền tên miền công khai vào deploy/.env.");
}

const parsedUrl = siteUrl ? parseSiteUrl(siteUrl) : null;
if (siteUrl && !parsedUrl) {
  errors.push("SITE_URL phải là URL gốc hợp lệ, không có đường dẫn, tài khoản, query hoặc fragment.");
} else if (production && !siteUrl) {
  errors.push("Thiếu SITE_URL: đặt URL HTTPS gốc ứng với DOMAIN.");
}

if (parsedUrl) {
  if ((production || indexable === "true") && (parsedUrl.protocol !== "https:" || parsedUrl.port || !isPublicDomain(parsedUrl.hostname))) {
    errors.push("SITE_URL khi triển khai hoặc bật lập chỉ mục phải dùng HTTPS, tên miền thật và cổng HTTPS mặc định.");
  }
  if (domain && parsedUrl.hostname.toLowerCase() !== domain) {
    errors.push("Tên miền trong SITE_URL phải trùng với DOMAIN để canonical và HTTPS thống nhất.");
  }
}

if (indexable === "true" && !parsedUrl) {
  errors.push("Cần SITE_URL hợp lệ trước khi đặt SITE_INDEXABLE=true.");
}

const supabase = readSupabaseConfig(env);
for (const name of ["SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY"]) {
  const value = env[name]?.trim();
  if (value && !isPublicSupabaseKey(value)) {
    errors.push(`${name} không phải publishable/anon key hợp lệ. Xóa giá trị không sử dụng; không đưa secret/service_role key vào ứng dụng.`);
  }
}
if (!supabase.enabled && supabase.reason === "incomplete") {
  errors.push("Supabase thiếu cặp cấu hình: điền SUPABASE_URL và SUPABASE_PUBLISHABLE_KEY (hoặc SUPABASE_ANON_KEY), hoặc để trống cả nhóm.");
} else if (!supabase.enabled && supabase.reason === "invalid") {
  errors.push("Cấu hình Supabase không hợp lệ: dùng Project URL và publishable/anon key; không dùng secret/service_role key. Xem docs/supabase.md.");
} else if (supabase.enabled && production && new URL(supabase.url).protocol !== "https:") {
  errors.push("SUPABASE_URL trên VPS phải dùng HTTPS.");
} else {
  notes.push(supabase.enabled
    ? "Supabase: định dạng cấu hình hợp lệ. Chưa xác minh kết nối, Auth hoặc RLS."
    : "Supabase: chưa bật; ứng dụng dùng dữ liệu học trên trình duyệt.");
}

if (indexable === "false") {
  notes.push("SEO: đang đặt noindex. Đổi SITE_INDEXABLE=true sau khi nghiệm thu tên miền chính thức.");
}

if (errors.length) {
  console.error(`Cấu hình chưa hợp lệ (${errors.length} lỗi):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Cấu hình ${production ? "VPS" : "local"}: hợp lệ.`);
  for (const note of notes) console.log(`- ${note}`);
  console.log("Kiểm tra này không xác minh DNS, chứng chỉ HTTPS, Supabase hoặc khả năng truy cập từ Internet.");
}
