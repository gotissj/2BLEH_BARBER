import { fail, redirect } from '@sveltejs/kit';
import { findUserByEmail, roleHome } from '$lib/server/services/users';
import { verifyPassword } from '$lib/server/auth/password';
import { createSession, SESSION_COOKIE } from '$lib/server/auth/session';

export const load = async ({ locals, url }) => {
	if (locals.user) throw redirect(303, roleHome(locals.user.role));
	return {
		panel: url.searchParams.get('panel') === '1',
		resetSuccess: url.searchParams.get('reset') === 'success'
	};
};

export const actions = {
	async default({ request, cookies }) {
		const data = await request.formData();
		const email = String(data.get('email') ?? '')
			.trim()
			.toLowerCase();
		const password = String(data.get('password') ?? '');
		const panel = String(data.get('panel') ?? '') === '1';

		const found = await findUserByEmail(email);
		if (!found || !verifyPassword(password, found.passwordHash)) {
			return fail(400, { error: 'Email o contraseña incorrectos', email });
		}

		if (panel && found.role === 'cliente') {
			return fail(403, {
				error: 'No tenés acceso al panel. Este acceso es solo para barberos.',
				email
			});
		}

		const token = await createSession(found.id);
		cookies.set(SESSION_COOKIE, token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 30
		});
		throw redirect(303, roleHome(found.role));
	}
};
