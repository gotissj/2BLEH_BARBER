import { listBarberUsers } from '$lib/server/services/users';
import { db } from '$lib/server/db';
import { booking, user } from '$lib/server/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';

const barber = alias(user, 'barber');
const client = alias(user, 'client');

export async function load({ url }) {
	const barbers = await listBarberUsers();
	const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10);
	const barberId = url.searchParams.get('barberId') || '';

	const rows = await db
		.select({ booking: booking, barber: barber, client: client })
		.from(booking)
		.innerJoin(barber, eq(booking.barberId, barber.id))
		.innerJoin(client, eq(booking.clientId, client.id))
		.orderBy(desc(booking.date), asc(booking.time));

	const bookings = rows.map((r) => ({
		...r.booking,
		barberName: r.barber.name,
		clientName: r.client.name,
		clientPhone: r.client.phone
	}));

	return { bookings, barbers, date, barberId };
}

export const actions = {
	cambiarEstado: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const status = data.get('status');
		if (!id || !status) return { error: 'Faltan datos' };
		await db
			.update(booking)
			.set({ status: /** @type {any} */ (status) })
			.where(eq(booking.id, String(id)));
		return { success: true };
	},
	eliminar: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		if (!id) return { error: 'ID requerido' };
		await db.delete(booking).where(eq(booking.id, String(id)));
		return { success: true };
	}
};
