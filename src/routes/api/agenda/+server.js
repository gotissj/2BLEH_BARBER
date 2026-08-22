import { json } from '@sveltejs/kit';
import { getAvailableSlots, getTakenSlots } from '$lib/server/services/bookings';

export async function GET({ url }) {
	const barberId = url.searchParams.get('barbero');
	const date = url.searchParams.get('fecha');
	if (!barberId || !date) return json({ slots: [] });
	const [slots, taken] = await Promise.all([
		getAvailableSlots(barberId, date),
		getTakenSlots(barberId, date)
	]);
	return json({ slots, taken });
}
