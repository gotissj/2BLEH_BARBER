import {
	listServices,
	createService,
	updateService,
	deleteService,
	getService
} from '$lib/server/services/admin';

export async function load() {
	return { services: await listServices() };
}

export const actions = {
	crear: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const price = Number(data.get('price'));
		if (!name || !price) return { error: 'Faltan datos' };
		try {
			await createService({ name: String(name).trim(), price });
			return { success: true };
		} catch (err) {
			console.error('Error al crear servicio:', err);
			return { error: 'No se pudo crear. Verificá que el nombre no esté repetido.' };
		}
	},
	actualizar: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const name = data.get('name');
		const price = Number(data.get('price'));
		if (!id) return { error: 'ID requerido' };
		try {
			const current = await getService(String(id));
			if (!current) return { error: 'Servicio no encontrado' };
			const active = data.has('active') ? data.get('active') === 'on' : current.active;
			await updateService(String(id), {
				name: String(name).trim(),
				price,
				active
			});
			return { success: true };
		} catch (err) {
			console.error('Error al actualizar servicio:', err);
			return { error: 'No se pudo actualizar. Verificá que el nombre no esté repetido.' };
		}
	},
	eliminar: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		if (!id) return { error: 'ID requerido' };
		await deleteService(String(id));
		return { success: true };
	}
};
