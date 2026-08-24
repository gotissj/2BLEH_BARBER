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
	eliminar: async () => {
		return { error: 'Acción no permitida: no se puede eliminar clientes desde el panel' };
	}
};
