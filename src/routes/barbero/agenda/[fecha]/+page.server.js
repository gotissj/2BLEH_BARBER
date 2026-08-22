import { redirect } from '@sveltejs/kit';
import { listDayBookings } from '$lib/server/services/bookings';
import { listBarberBlocks, deleteAgendaBlock } from '$lib/server/services/admin';

export async function load({ locals, params }) {
	if (!locals.user) throw redirect(303, '/login');
	const date = params.fecha;
	const bookings = await listDayBookings(locals.user.id, date);
	const blocks = await listBarberBlocks(locals.user.id, date);
	return { date, bookings, blocks };
}

export const actions = {
	confirmar: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return { error: 'No autenticado' };
		const data = await request.formData();
		const id = data.get('id');
		if (!id) return { error: 'ID requerido' };
		await import('$lib/server/services/bookings').then((m) =>
			m.updateBookingStatus(String(id), user.id, 'confirmada')
		);
		return { success: true };
	},
	cancelar: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return { error: 'No autenticado' };
		const data = await request.formData();
		const id = data.get('id');
		if (!id) return { error: 'ID requerido' };
		await import('$lib/server/services/bookings').then((m) =>
			m.updateBookingStatus(String(id), user.id, 'cancelada')
		);
		return { success: true };
	},
	realizar: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return { error: 'No autenticado' };
		const data = await request.formData();
		const id = data.get('id');
		if (!id) return { error: 'ID requerido' };
		await import('$lib/server/services/bookings').then((m) =>
			m.updateBookingStatus(String(id), user.id, 'realizado')
		);
		return { success: true };
	},
	ausente: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return { error: 'No autenticado' };
		const data = await request.formData();
		const id = data.get('id');
		if (!id) return { error: 'ID requerido' };
		await import('$lib/server/services/bookings').then((m) =>
			m.updateBookingStatus(String(id), user.id, 'ausente')
		);
		return { success: true };
	},
	bloquear: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return { error: 'No autenticado' };
		const data = await request.formData();
		const date = data.get('date');
		const startTime = data.get('startTime');
		const endTime = data.get('endTime');
		const reason = data.get('reason');
		if (!date || !startTime || !endTime) return { error: 'Faltan datos' };
		await import('$lib/server/services/admin').then((m) =>
			m.createAgendaBlock({
				barberId: user.id,
				date: String(date),
				startTime: String(startTime),
				endTime: String(endTime),
				reason: reason ? String(reason) : undefined
			})
		);
		return { success: true };
	},
	eliminarBloqueo: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return { error: 'No autenticado' };
		const data = await request.formData();
		const id = data.get('id');
		if (!id) return { error: 'ID requerido' };
		await deleteAgendaBlock(String(id), user.id);
		return { success: true };
	}
};
