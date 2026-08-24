import { redirect } from '@sveltejs/kit';
import { getUser, updateUser } from '$lib/server/services/users';
import { verifyPassword, hashPassword } from '$lib/server/auth/password.js';
import { deleteUserSessions } from '$lib/server/auth/session.js';
import { SESSION_COOKIE } from '$lib/server/auth/session.js';

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
	},
	borrarCuenta: async ({ request, locals, cookies }) => {
		if (!locals.user || locals.user.role !== 'barbero') return { error: 'No autenticado' };
		const data = await request.formData();
		const password = String(data.get('password') ?? '');
		if (!password) return { error: 'Debes confirmar tu contraseña' };

		const dbUser = await getUser(locals.user.id);
		if (!dbUser || !verifyPassword(password, dbUser.passwordHash)) {
			return { error: 'Contraseña incorrecta' };
		}

		const userId = locals.user.id;
		try {
			const { deleteBarberBookings, deleteClientBookings } = await import(
				'$lib/server/services/bookings.js'
			);
			const { deleteAllBarberBlocks } = await import('$lib/server/services/admin.js');
			const { deleteUserResetTokens } = await import('$lib/server/services/passwordReset.js');
			const { deleteUser } = await import('$lib/server/services/users.js');

			await deleteBarberBookings(userId);
			// Por si el barbero también tiene reservas como cliente
			await deleteClientBookings(userId);
			await deleteAllBarberBlocks(userId);
			await deleteUserResetTokens(userId);
			await deleteUserSessions(userId);
			await deleteUser(userId);
		} catch (e) {
			console.error('Error al borrar cuenta barbero', e);
			return { error: 'No se pudo borrar la cuenta. Intentá de nuevo.' };
		}

		cookies.delete(SESSION_COOKIE, { path: '/' });
		throw redirect(303, '/');
	}
};