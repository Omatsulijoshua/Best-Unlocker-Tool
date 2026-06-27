import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const encoder = new TextEncoder();
const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_DAYS = 14;
const APP_SESSION_HOURS = 8;

export type TokenUser = {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
  sessionId?: string;
};

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function sha256(value: string) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)).then((buffer) =>
    Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
  );
}

function jwtSecret(name: "JWT_SECRET" | "REFRESH_TOKEN_SECRET") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return encoder.encode(value);
}

export async function createAccessToken(user: TokenUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.sub)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SECONDS}s`)
    .sign(jwtSecret("JWT_SECRET"));
}

export async function createRefreshToken(user: TokenUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.sub)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TTL_DAYS}d`)
    .sign(jwtSecret("REFRESH_TOKEN_SECRET"));
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, jwtSecret("JWT_SECRET"));
  return payload as TokenUser;
}

export function getClientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  const bucket = globalThis as unknown as {
    __rateLimit?: Map<string, { count: number; resetAt: number }>;
  };
  bucket.__rateLimit ??= new Map();
  const current = bucket.__rateLimit.get(key);
  if (!current || current.resetAt < now) {
    bucket.__rateLimit.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { ok: true, remaining: limit - 1 };
  }
  if (current.count >= limit) {
    return { ok: false, remaining: 0 };
  }
  current.count += 1;
  return { ok: true, remaining: limit - current.count };
}

export function sessionExpiry() {
  return new Date(Date.now() + APP_SESSION_HOURS * 60 * 60 * 1000);
}

export async function auditActivity(input: {
  userId?: string;
  action: string;
  metadata?: object;
  request?: NextRequest;
}) {
  await prisma.activityLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      metadata: input.metadata,
      ipAddress: input.request ? getClientIp(input.request) : undefined,
      userAgent: input.request?.headers.get("user-agent") ?? undefined
    }
  });
}

export async function requireAdmin(request: NextRequest) {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    return null;
  }
  try {
    const payload = await verifyAccessToken(token);
    if (payload.role !== "ADMIN") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function recordAdminAction(input: {
  adminId: string;
  targetUserId?: string;
  action: string;
  before?: object;
  after?: object;
  request: NextRequest;
}) {
  await prisma.adminActionLog.create({
    data: {
      adminId: input.adminId,
      targetUserId: input.targetUserId,
      action: input.action,
      before: input.before,
      after: input.after,
      ipAddress: getClientIp(input.request)
    }
  });
}
