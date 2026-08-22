import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { session, user } from '$lib/server/db/schema';

export const SESSION_COOKIE = 'session';

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** @param {string} userId */
export async function createSession(userId) {
	const token = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
	await db.insert(session).values({ token, userId, expiresAt });
	return token;
}

/** @param {string | undefined} token */
export async function deleteSession(token) {
	if (!token) return;
	await db.delete(session).where(eq(session.token, token));
}

/** @param {string | undefined} token */
export async function getUserFromSessionToken(token) {
	if (!token) return null;
	const rows = await db
		.select({ user: user, session: session })
		.from(session)
		.innerJoin(user, eq(session.userId, user.id))
		.where(eq(session.token, token))
		.limit(1);
	const row = rows[0];
	if (!row) return null;
	if (row.session.expiresAt < new Date()) {
		await deleteSession(token);
		return null;
	}
	return row.user;
}

/** @param {string} userId */
export async function deleteUserSessions(userId) {
	await db.delete(session).where(eq(session.userId, userId));
}
