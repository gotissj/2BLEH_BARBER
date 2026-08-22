import { redirect } from '@sveltejs/kit';
import { listClientBookings } from '$lib/server/services/bookings';

export async function load({ locals }) {
	if (!locals.user) throw redirect(303, '/login');
	return { bookings: await listClientBookings(locals.user.id) };
}
