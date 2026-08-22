import { listClients, getClientBookings } from '$lib/server/services/admin';

export async function load({ url }) {
	const clients = await listClients();
	const clientId = url.searchParams.get('clientId');
	/** @type {any[]} */
	let clientBookings = [];
	if (clientId) {
		clientBookings = await getClientBookings(clientId);
	}
	return { clients, clientId, clientBookings };
}

export const actions = {
	eliminar: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		if (!id) return { error: 'ID requerido' };
		await import('$lib/server/services/users').then((m) => m.deleteUser(String(id)));
		return { success: true };
	}
};
