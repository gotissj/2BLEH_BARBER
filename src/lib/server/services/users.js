import { eq, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';

/** @param {string} email */
export async function findUserByEmail(email) {
	const rows = await db.select().from(user).where(eq(user.email, email)).limit(1);
	return rows[0] ?? null;
}

/**
 * @param {{ id: string; name: string; email: string; phone: string; role: 'admin' | 'barbero' | 'cliente'; avatar?: string; notifications?: boolean }} u
 */
export function toPublicUser(u) {
	return {
		id: u.id,
		name: u.name,
		email: u.email,
		phone: u.phone,
		role: u.role,
		avatar: u.avatar,
		notifications: u.notifications
	};
}

/** @param {'admin' | 'barbero' | 'cliente'} role */
export function roleHome(role) {
	if (role === 'admin') return '/admin';
	if (role === 'barbero') return '/barbero';
	return '/cliente';
}

/** @param {{ name: string; email: string; phone: string; passwordHash: string; role: 'admin' | 'barbero' | 'cliente'; avatar?: string }} args */
export async function createUser({ name, email, phone, passwordHash, role, avatar }) {
	const [row] = await db
		.insert(user)
		.values({ name, email, phone, passwordHash, role, avatar })
		.returning();
	return row;
}

export async function listBarberUsers() {
	return db.select().from(user).where(eq(user.role, 'barbero')).orderBy(user.name);
}

export async function listAllUsers() {
	return db.select().from(user).orderBy(desc(user.createdAt));
}

/** @param {string} id */
export async function deleteUser(id) {
	await db.delete(user).where(eq(user.id, id));
}

/** @param {string} id @param {Partial<{ name: string; phone: string; avatar: string; notifications: boolean; passwordHash: string }>} data */
export async function updateUser(id, data) {
	const [row] = await db.update(user).set(data).where(eq(user.id, id)).returning();
	return row;
}

/** @param {string} id */
export async function getUser(id) {
	const rows = await db.select().from(user).where(eq(user.id, id)).limit(1);
	return rows[0] ?? null;
}
