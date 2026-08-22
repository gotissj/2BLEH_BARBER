import { redirect } from '@sveltejs/kit';
import { listBarbers, createBooking, getAvailableSlots } from '$lib/server/services/bookings';
import { listActiveServices } from '$lib/server/services/admin';
import { notifyBarberNewBookingByEmail } from '$lib/server/services/email';
import { getUser } from '$lib/server/services/users';

export async function load({ locals }) {
	if (!locals.user) throw redirect(303, '/login');
	return { barbers: await listBarbers(), services: await listActiveServices() };
}

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) return { error: 'Debés iniciar sesión' };
		const data = await request.formData();
		const barbero = data.get('barbero');
		const servicio = data.get('servicio');
		const fecha = data.get('fecha');
		const hora = data.get('hora');
		if (!barbero || !servicio || !fecha || !hora) return { error: 'Faltan datos' };

		const date = String(fecha);
		const slots = await getAvailableSlots(String(barbero), date);
		if (!slots.includes(String(hora)))
			return { error: 'El horario seleccionado ya no está disponible' };

		try {
			const booking = await createBooking({
				clientId: locals.user.id,
				barberId: String(barbero),
				service: String(servicio),
				date,
				time: String(hora)
			});
			const barber = await getUser(String(barbero));
			if (barber) {
				try {
					await notifyBarberNewBookingByEmail({
						email: barber.email,
						clientName: locals.user.name,
						time: booking.time,
						date: booking.date,
						service: booking.service
					});
				} catch (notificationError) {
					console.error('Error enviando notificación por correo', notificationError);
				}
			}
			return { ok: true, id: booking.id };
		} catch (e) {
			return { error: e instanceof Error ? e.message : 'No se pudo reservar' };
		}
	}
};
