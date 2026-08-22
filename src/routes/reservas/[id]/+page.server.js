import { error, redirect } from '@sveltejs/kit';
import { getBooking, cancelBooking, createBooking } from '$lib/server/services/bookings';
import { toPublicUser, listBarberUsers } from '$lib/server/services/users';
import { listActiveServices } from '$lib/server/services/admin';

export const load = async ({ locals, params }) => {
	if (!locals.user) throw redirect(303, '/login');
	const booking = await getBooking(params.id);
	if (!booking) throw error(404, 'Reserva no encontrada');
	if (locals.user.id !== booking.clientId && locals.user.id !== booking.barberId) {
		throw error(403, 'No tenés acceso a esta reserva');
	}
	const barbers = await listBarberUsers();
	const services = await listActiveServices();
	return { booking, user: toPublicUser(locals.user), barbers, services };
};

export const actions = {
	cancelar: async ({ locals, params }) => {
		if (!locals.user) throw redirect(303, '/login');
		try {
			await cancelBooking(params.id, locals.user.id);
		} catch (e) {
			return { error: e instanceof Error ? e.message : 'No se pudo cancelar la reserva' };
		}
		return { ok: true };
	},
	reagendar: async ({ locals, params, request }) => {
		if (!locals.user) throw redirect(303, '/login');
		const data = await request.formData();
		const barberId = data.get('barbero');
		const service = data.get('servicio');
		const date = data.get('fecha');
		const time = data.get('hora');
		if (!barberId || !service || !date || !time) return { error: 'Faltan datos' };
		let newBooking;
		try {
			await cancelBooking(params.id, locals.user.id);
			newBooking = await createBooking({
				clientId: locals.user.id,
				barberId: String(barberId),
				service: String(service),
				date: String(date),
				time: String(time)
			});
		} catch (e) {
			return { error: e instanceof Error ? e.message : 'No se pudo reagendar' };
		}
		throw redirect(303, `/reservas/${newBooking.id}`);
	}
};
