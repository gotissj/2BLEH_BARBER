import { sql, eq, ne, and } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { listBarberUsers } from '$lib/server/services/users';
import { db } from '$lib/server/db';
import { user, booking } from '$lib/server/db/schema';

export async function load({ locals }) {
	if (!locals.user || locals.user.role !== 'admin') throw redirect(303, '/login');

	const today = new Date().toISOString().slice(0, 10);
	const [barbers, clientsResult, bookingsTodayResult] = await Promise.all([
		listBarberUsers(),
		db
			.select({ count: sql`count(*)` })
			.from(user)
			.where(eq(user.role, 'cliente')),
		db
			.select({ count: sql`count(*)` })
			.from(booking)
			.where(and(eq(booking.date, today), ne(booking.status, 'cancelada')))
	]);
	return {
		barbers,
		clientsCount: Number(clientsResult[0]?.count ?? 0),
		bookingsTodayCount: Number(bookingsTodayResult[0]?.count ?? 0)
	};
}
