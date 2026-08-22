import { fail, redirect } from '@sveltejs/kit';
import {
	listBarberUsers,
	createUser,
	deleteUser,
	findUserByEmail,
	updateUser
} from '$lib/server/services/users';
import { hashPassword } from '$lib/server/auth/password';
import { deleteBarberBookings } from '$lib/server/services/bookings';
import { deleteUserSessions } from '$lib/server/auth/session';

export async function load({ locals }) {
	if (!locals.user || locals.user.role !== 'admin') throw redirect(303, '/login');
	return { barbers: await listBarberUsers() };
}

export const actions = {
	async crear({ request, locals }) {
		if (!locals.user || locals.user.role !== 'admin') throw redirect(303, '/login');
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '')
			.trim()
			.toLowerCase();
		const phone = String(data.get('phone') ?? '').trim();
		const password = String(data.get('password') ?? '');

		if (!name || !email || !phone || !password) {
			return fail(400, { error: 'Completá todos los campos', name, email, phone });
		}
		if (password.length < 6) {
			return fail(400, {
				error: 'La contraseña debe tener al menos 6 caracteres',
				name,
				email,
				phone
			});
		}

		const existing = await findUserByEmail(email);
		if (existing) {
			return fail(400, { error: 'Ya existe una cuenta con ese email', name, email, phone });
		}

		await createUser({ name, email, phone, passwordHash: hashPassword(password), role: 'barbero' });
		throw redirect(303, '/admin/barberos');
	},

	async actualizar({ request, locals }) {
		if (!locals.user || locals.user.role !== 'admin') throw redirect(303, '/login');
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '')
			.trim()
			.toLowerCase();
		const phone = String(data.get('phone') ?? '').trim();
		const password = String(data.get('password') ?? '');

		if (!id) return fail(400, { error: 'ID requerido' });
		if (!name || !email || !phone) {
			return fail(400, { error: 'Completá todos los campos', name, email, phone });
		}
		if (password && password.length < 6) {
			return fail(400, {
				error: 'La contraseña debe tener al menos 6 caracteres',
				name,
				email,
				phone
			});
		}

		const existing = await findUserByEmail(email);
		if (existing && existing.id !== id) {
			return fail(400, { error: 'Ya existe otra cuenta con ese email', name, email, phone });
		}

		/** @type {Partial<{ name: string; email: string; phone: string; passwordHash: string }>} */
		const updates = { name, email, phone };
		if (password) updates.passwordHash = hashPassword(password);
		await updateUser(id, updates);
		throw redirect(303, '/admin/barberos');
	},

	async eliminar({ request, locals }) {
		if (!locals.user || locals.user.role !== 'admin') throw redirect(303, '/login');
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		if (!id) return fail(400, { error: 'ID requerido' });

		await deleteBarberBookings(id);
		await deleteUserSessions(id);
		await deleteUser(id);
		throw redirect(303, '/admin/barberos');
	}
};
