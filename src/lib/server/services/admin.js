import { eq, and, asc, desc, ne } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { service, agendaBlock, businessConfig, user } from '$lib/server/db/schema';

/** Servicios */

export async function listServices() {
	return db.select().from(service).orderBy(asc(service.name));
}

/** @param {string} id */
export async function getService(id) {
	const rows = await db.select().from(service).where(eq(service.id, id)).limit(1);
	return rows[0] ?? null;
}

export async function listActiveServices() {
	return db.select().from(service).where(eq(service.active, true)).orderBy(asc(service.name));
}

/** @param {{ name: string; price: number; duration?: number; active?: boolean }} data */
export async function createService(data) {
	const [row] = await db
		.insert(service)
		.values({ ...data, active: data.active ?? true })
		.returning();
	return row;
}

/** @param {string} id @param {Partial<{ name: string; price: number; duration: number; active: boolean }>} data */
export async function updateService(id, data) {
	const [row] = await db.update(service).set(data).where(eq(service.id, id)).returning();
	return row;
}

/** @param {string} id */
export async function deleteService(id) {
	await db.delete(service).where(eq(service.id, id));
}

/** Bloques de agenda */

/** @param {string} barberId @param {string} date */
export async function listBarberBlocks(barberId, date) {
	return db
		.select()
		.from(agendaBlock)
		.where(and(eq(agendaBlock.barberId, barberId), eq(agendaBlock.date, date)))
		.orderBy(asc(agendaBlock.startTime));
}

/** @param {{ barberId: string; date: string; startTime: string; endTime: string; reason?: string }} data */
export async function createAgendaBlock(data) {
	const [row] = await db.insert(agendaBlock).values(data).returning();
	return row;
}

/** @param {string} id @param {string} barberId */
export async function deleteAgendaBlock(id, barberId) {
	await db
		.delete(agendaBlock)
		.where(and(eq(agendaBlock.id, id), eq(agendaBlock.barberId, barberId)));
}

/** Configuración del negocio */

export async function getBusinessConfig() {
	return db.select().from(businessConfig);
}

/** @param {Record<string, string>} config */
export async function setBusinessConfig(config) {
	for (const [key, value] of Object.entries(config)) {
		await db
			.insert(businessConfig)
			.values({ key, value })
			.onConflictDoUpdate({ target: businessConfig.key, set: { value, updatedAt: new Date() } });
	}
}

/** Clientes */

export async function listClients() {
	return db.select().from(user).where(eq(user.role, 'cliente')).orderBy(desc(user.createdAt));
}

/** @param {string} id */
export async function getClientBookings(id) {
	const { booking } = await import('$lib/server/db/schema.js');
	const rows = await db
		.select({ booking: booking, barber: user })
		.from(booking)
		.innerJoin(user, eq(booking.barberId, user.id))
		.where(and(eq(booking.clientId, id), ne(booking.status, 'cancelada')))
		.orderBy(desc(booking.date), asc(booking.time));
	return rows.map((r) => ({ ...r.booking, barberName: r.barber.name }));
}
