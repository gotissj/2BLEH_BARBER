import { and, asc, desc, eq, ne } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { booking, user, agendaBlock, businessConfig } from '$lib/server/db/schema';

export async function listBarbers() {
	return db.select({ id: user.id, name: user.name }).from(user).where(eq(user.role, 'barbero'));
}

async function getShopConfigInternal() {
	const rows = await db.select().from(businessConfig).all();
	/** @type {{ openHour: number; closeHour: number; slotMinutes: number }} */
	const config = { openHour: 9, closeHour: 19, slotMinutes: 60 };
	for (const row of rows) {
		if (row.key === 'openHour' || row.key === 'closeHour' || row.key === 'slotMinutes') {
			const val = row.value;
			config[row.key] = isNaN(Number(val)) ? config[row.key] : Number(val);
		}
	}
	return config;
}

/** @param {string} date */
export async function getTimeSlots(date) {
	const [y, m, d] = date.split('-').map(Number);
	const day = new Date(y, m - 1, d);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	if (day < today) return [];

	const { openHour, closeHour, slotMinutes } = await getShopConfigInternal();
	const slots = [];
	const start = new Date(day);
	start.setHours(openHour, 0, 0, 0);
	const end = new Date(day);
	end.setHours(closeHour, 0, 0, 0);
	for (let t = new Date(start); t < end; t.setMinutes(t.getMinutes() + slotMinutes)) {
		const hh = String(t.getHours()).padStart(2, '0');
		const mm = String(t.getMinutes()).padStart(2, '0');
		slots.push(`${hh}:${mm}`);
	}
	return slots;
}

/** @param {string} barberId @param {string} date */
export async function getAvailableSlots(barberId, date) {
	const slots = await getTimeSlots(date);
	if (!slots.length) return [];

	const taken = await db
		.select({ time: booking.time })
		.from(booking)
		.where(
			and(eq(booking.barberId, barberId), eq(booking.date, date), ne(booking.status, 'cancelada'))
		);
	const takenSet = new Set(taken.map((t) => t.time));

	const blocks = await db
		.select({ startTime: agendaBlock.startTime, endTime: agendaBlock.endTime })
		.from(agendaBlock)
		.where(and(eq(agendaBlock.barberId, barberId), eq(agendaBlock.date, date)));

	const blocked = new Set();
	const slotMinutes = (await getShopConfigInternal()).slotMinutes;
	for (const b of blocks) {
		for (let t = b.startTime; t < b.endTime;) {
			blocked.add(t);
			const [h, m] = t.split(':').map(Number);
			const next = new Date(0, 0, 0, h, m + slotMinutes);
			t = `${String(next.getHours()).padStart(2, '0')}:${String(next.getMinutes()).padStart(2, '0')}`;
		}
	}

	return slots.filter((s) => !takenSet.has(s) && !blocked.has(s));
}

/** @param {string} barberId @param {string} date */
export async function getTakenSlots(barberId, date) {
	const slots = await getTimeSlots(date);
	if (!slots.length) return [];

	const taken = await db
		.select({ time: booking.time })
		.from(booking)
		.where(
			and(eq(booking.barberId, barberId), eq(booking.date, date), ne(booking.status, 'cancelada'))
		);
	const takenSet = new Set(taken.map((t) => t.time));

	const blocks = await db
		.select({ startTime: agendaBlock.startTime, endTime: agendaBlock.endTime })
		.from(agendaBlock)
		.where(and(eq(agendaBlock.barberId, barberId), eq(agendaBlock.date, date)));

	const blocked = new Set();
	const slotMinutes = (await getShopConfigInternal()).slotMinutes;
	for (const b of blocks) {
		for (let t = b.startTime; t < b.endTime;) {
			blocked.add(t);
			const [h, m] = t.split(':').map(Number);
			const next = new Date(0, 0, 0, h, m + slotMinutes);
			t = `${String(next.getHours()).padStart(2, '0')}:${String(next.getMinutes()).padStart(2, '0')}`;
		}
	}

	return slots.filter((s) => takenSet.has(s) || blocked.has(s));
}

/**
 * @param {{ clientId: string; barberId: string; service: string; date: string; time: string }} args
 */
export async function createBooking({ clientId, barberId, service, date, time }) {
	const available = await getAvailableSlots(barberId, date);
	if (!available.includes(time)) {
		throw new Error('Ese horario ya está ocupado. Elegí otro.');
	}
	try {
		const [row] = await db
			.insert(booking)
			.values({ clientId, barberId, service, date, time, status: 'pendiente' })
			.returning();
		return row;
	} catch (e) {
		if (e instanceof Error && e.message.includes('UNIQUE')) {
			throw new Error('Ese horario ya está ocupado. Elegí otro.');
		}
		throw e;
	}
}

/** @param {string} id */
export async function getBooking(id) {
	const rows = await db
		.select({ booking: booking, barber: user })
		.from(booking)
		.innerJoin(user, eq(booking.barberId, user.id))
		.where(eq(booking.id, id))
		.limit(1);
	const row = rows[0];
	if (!row) return null;
	const [client] = await db.select().from(user).where(eq(user.id, row.booking.clientId)).limit(1);
	return { ...row.booking, barberName: row.barber.name, clientName: client?.name ?? '' };
}

/** @param {string} clientId */
export async function listClientBookings(clientId) {
	const rows = await db
		.select({ booking: booking, barber: user })
		.from(booking)
		.innerJoin(user, eq(booking.barberId, user.id))
		.where(and(eq(booking.clientId, clientId), ne(booking.status, 'cancelada')))
		.orderBy(desc(booking.date), asc(booking.time));
	return rows.map((r) => ({ ...r.booking, barberName: r.barber.name }));
}

/** @param {string} barberId @param {string} date */
export async function listDayBookings(barberId, date) {
	const rows = await db
		.select({ booking: booking, client: user })
		.from(booking)
		.innerJoin(user, eq(booking.clientId, user.id))
		.where(and(eq(booking.barberId, barberId), eq(booking.date, date)))
		.orderBy(asc(booking.time));
	return rows.map((r) => ({
		...r.booking,
		clientName: r.client.name,
		clientPhone: r.client.phone
	}));
}

/** @param {string} id @param {string} userId */
export async function cancelBooking(id, userId) {
	const [row] = await db
		.update(booking)
		.set({ status: 'cancelada' })
		.where(and(eq(booking.id, id), eq(booking.clientId, userId)))
		.returning();
	if (!row) throw new Error('No podés cancelar esta reserva');
	return row;
}

/** @param {string} barberId */
export async function deleteBarberBookings(barberId) {
	await db.delete(booking).where(eq(booking.barberId, barberId));
}

/** @param {string} id @param {string} userId @param {'pendiente'|'confirmada'|'cancelada'|'realizado'|'ausente'} newStatus */
export async function updateBookingStatus(id, userId, newStatus) {
	const [row] = await db
		.update(booking)
		.set({ status: newStatus })
		.where(and(eq(booking.id, id), eq(booking.barberId, userId)))
		.returning();
	if (!row) throw new Error('No podés modificar esta reserva');
	return row;
}
