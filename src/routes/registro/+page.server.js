import { fail, redirect } from '@sveltejs/kit';
import { findUserByEmail, createUser } from '$lib/server/services/users';
import { hashPassword } from '$lib/server/auth/password';
import { createSession, SESSION_COOKIE } from '$lib/server/auth/session';
import { roleHome } from '$lib/server/services/users';
import { validateParaguayPhone } from '$lib/validation.js';

export const load = async ({ locals }) => {
	if (locals.user) throw redirect(303, roleHome(locals.user.role));
};

export const actions = {
	async default({ request, cookies }) {
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

		const phoneCheck = validateParaguayPhone(phone);
		if (!phoneCheck.valid) {
			return fail(400, { error: phoneCheck.error, name, email, phone });
		}

		const existing = await findUserByEmail(email);
		if (existing) {
			return fail(400, { error: 'Ya existe una cuenta con ese email', name, email, phone });
		}

		const newUser = await createUser({
			name,
			email,
			phone: phoneCheck.normalized ?? phone,
			passwordHash: hashPassword(password),
			role: 'cliente'
		});
		const token = await createSession(newUser.id);
		cookies.set(SESSION_COOKIE, token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 30
		});
		throw redirect(303, '/cliente');
	}
};
