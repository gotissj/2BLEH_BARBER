import { redirect } from '@sveltejs/kit';
import { getUser, updateUser } from '$lib/server/services/users';
import { verifyPassword, hashPassword } from '$lib/server/auth/password.js';

export async function load({ locals }) {
	if (!locals.user || locals.user.role !== 'barbero') throw redirect(303, '/login');
	const user = await getUser(locals.user.id);
	return { user: user ? { ...user, passwordHash: undefined } : null };
}

export const actions = {
	actualizar: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'barbero') return { error: 'No autenticado' };
		const data = await request.formData();
		const name = data.get('name');
		const phone = data.get('phone');
		const avatar = data.get('avatar');
		const notifications = data.get('notifications') === 'on';
		const updates = {};
		if (name) updates.name = String(name);
		if (phone) updates.phone = String(phone);
		if (avatar) updates.avatar = String(avatar);
		updates.notifications = notifications;
		await updateUser(locals.user.id, updates);
		return { success: true };
	},
	cambiarPassword: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'barbero') return { error: 'No autenticado' };
		const data = await request.formData();
		const current = data.get('current');
		const nuevo = data.get('nuevo');
		const confirmar = data.get('confirmar');
		if (!current || !nuevo || !confirmar) return { error: 'Faltan datos' };
		if (nuevo !== confirmar) return { error: 'Las contraseñas no coinciden' };
		if (String(nuevo).length < 6) return { error: 'Mínimo 6 caracteres' };
		const user = await getUser(locals.user.id);
		if (!user || !verifyPassword(String(current), user.passwordHash)) {
			return { error: 'Contraseña actual incorrecta' };
		}
		await updateUser(locals.user.id, { passwordHash: hashPassword(String(nuevo)) });
		return { success: true };
	}
};