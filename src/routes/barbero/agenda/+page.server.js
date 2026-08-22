import { redirect } from '@sveltejs/kit';
import { listDayBookings } from '$lib/server/services/bookings';
import { listBarberBlocks } from '$lib/server/services/admin';
import { actions } from '../agenda/[fecha]/+page.server.js';

export async function load({ locals }) {
	if (!locals.user) throw redirect(303, '/login');
	const today = new Date().toISOString().slice(0, 10);
	const bookings = await listDayBookings(locals.user.id, today);
	const blocks = await listBarberBlocks(locals.user.id, today);
	return { date: today, bookings, blocks };
}

export { actions };
