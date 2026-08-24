import { error, redirect } from '@sveltejs/kit';
import { getBooking, cancelBooking, createBooking, updateBookingStatus } from '$lib/server/services/bookings';
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
		const booking = await getBooking(params.id);
		if (!booking) throw error(404, 'Reserva no encontrada');
		if (locals.user.id !== booking.clientId && locals.user.id !== booking.barberId) {
			throw error(403, 'No tenés acceso a esta reserva');
		}
		const isClientCancelling = locals.user.id === booking.clientId;
		try {
			if (isClientCancelling) {
				await cancelBooking(params.id, locals.user.id);
			} else {
				// Barbero cancela su propio turno
				await updateBookingStatus(params.id, locals.user.id, 'cancelada');
			}
		} catch (e) {
			return { error: e instanceof Error ? e.message : 'No se pudo cancelar la reserva' };
		}

		// Si cancela el cliente, notificar al barbero
		if (isClientCancelling) {
			try {
				const { getUser } = await import('$lib/server/services/users');
				const { notifyBarberBookingCancelled } = await import('$lib/server/services/email');
				const barber = await getUser(booking.barberId);
				if (barber?.email) {
					await notifyBarberBookingCancelled({
						email: barber.email,
						clientName: booking.clientName || locals.user.name,
						date: booking.date,
						time: booking.time,
						service: booking.service
					});
				}
			} catch (e) {
				console.error('No se pudo notificar al barbero por cancelación', e);
			}
		}

		return { ok: true };
	},
	reagendar: async ({ locals, params, request }) => {
		if (!locals.user) throw redirect(303, '/login');
		const booking = await getBooking(params.id);
		if (!booking) throw error(404, 'Reserva no encontrada');
		if (locals.user.id !== booking.clientId && locals.user.id !== booking.barberId) {
			throw error(403, 'No tenés acceso a esta reserva');
		}
		if (booking.status !== 'pendiente' && booking.status !== 'confirmada') {
			return { error: 'Solo se puede reagendar turnos pendientes o confirmados' };
		}
		const data = await request.formData();
		const barberId = data.get('barbero');
		const service = data.get('servicio');
		const date = data.get('fecha');
		const time = data.get('hora');
		if (!barberId || !service || !date || !time) return { error: 'Faltan datos' };
		let newBooking;
		try {
			// Cancelar la reserva original según el rol
			if (locals.user.id === booking.clientId) {
				await cancelBooking(params.id, locals.user.id);
			} else {
				await updateBookingStatus(params.id, locals.user.id, 'cancelada');
			}
			// La nueva reserva mantiene el cliente original (no el barbero que reagenda)
			newBooking = await createBooking({
				clientId: booking.clientId,
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
