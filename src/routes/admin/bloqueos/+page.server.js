import { listBarberUsers } from '$lib/server/services/users';
import { db } from '$lib/server/db';
import { agendaBlock, user } from '$lib/server/db/schema';
import { and, eq, asc, gte } from 'drizzle-orm';

export async function load({ url }) {
	const barbers = await listBarberUsers();
	const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10);
	const barberId = url.searchParams.get('barberId') || '';

	/** @type {any} */
	let where = gte(agendaBlock.date, date);
	if (barberId) where = and(where, eq(agendaBlock.barberId, barberId));

	const rows = await db
		.select({ block: agendaBlock, barber: user })
		.from(agendaBlock)
		.innerJoin(user, eq(agendaBlock.barberId, user.id))
		.where(where)
		.orderBy(asc(agendaBlock.date), asc(agendaBlock.startTime));

	const blocks = rows.map((r) => ({ ...r.block, barberName: r.barber.name }));

	return { blocks, barbers, date, barberId };
}

export const actions = {
	crear: async ({ request }) => {
		const data = await request.formData();
		const barberId = data.get('barberId');
		const date = data.get('date');
		const startTime = data.get('startTime');
		const endTime = data.get('endTime');
		const reason = data.get('reason');
		if (!barberId || !date || !startTime || !endTime) return { error: 'Faltan datos' };
		await import('$lib/server/services/admin').then((m) =>
			m.createAgendaBlock({
				barberId: String(barberId),
				date: String(date),
				startTime: String(startTime),
				endTime: String(endTime),
				reason: reason ? String(reason) : undefined
			})
		);
		return { success: true };
	},
	eliminar: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const barberId = data.get('barberId');
		if (!id || !barberId) return { error: 'Faltan datos' };
		await import('$lib/server/services/admin').then((m) =>
			m.deleteAgendaBlock(String(id), String(barberId))
		);
		return { success: true };
	}
};
