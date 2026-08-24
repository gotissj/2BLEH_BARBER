import { fail, redirect } from '@sveltejs/kit';
import { hashPassword } from '$lib/server/auth/password';
import { updateUser } from '$lib/server/services/users';
import {
	validatePasswordResetToken,
	consumePasswordResetToken,
	deleteUserResetTokens
} from '$lib/server/services/passwordReset';
import { deleteUserSessions } from '$lib/server/auth/session';

export const load = async ({ url }) => {
	const token = url.searchParams.get('token') ?? '';

	if (!token) {
		return { valid: false, error: 'Falta el token de restablecimiento.' };
	}

	const result = await validatePasswordResetToken(token);
	if (!result) {
		return {
			valid: false,
			error: 'El enlace es inválido o expiró. Solicitá uno nuevo.'
		};
	}

	return { valid: true, token, email: result.user.email };
};

export const actions = {
	async default({ request }) {
		const data = await request.formData();
		const token = String(data.get('token') ?? '').trim();
		const password = String(data.get('password') ?? '');
		const confirm = String(data.get('confirmPassword') ?? '');

		if (!token) {
			return fail(400, { error: 'Token faltante. Solicitá un nuevo enlace.', token });
		}

		if (!password || password.length < 6) {
			return fail(400, {
				error: 'La contraseña debe tener al menos 6 caracteres',
				token
			});
		}

		if (password !== confirm) {
			return fail(400, { error: 'Las contraseñas no coinciden', token });
		}

		const result = await validatePasswordResetToken(token);
		if (!result) {
			return fail(400, {
				error: 'El enlace es inválido o expiró. Solicitá uno nuevo.',
				token
			});
		}

		try {
			const passwordHash = hashPassword(password);
			await updateUser(result.user.id, { passwordHash });
			await consumePasswordResetToken(token);
			// Invalida otras solicitudes y sesiones por seguridad
			await deleteUserResetTokens(result.user.id);
			await deleteUserSessions(result.user.id);
		} catch (e) {
			console.error('Error al restablecer contraseña', e);
			return fail(500, { error: 'No se pudo restablecer la contraseña. Intentá de nuevo.', token });
		}

		// Éxito -> redirigir a login con mensaje
		throw redirect(303, '/login?reset=success');
	}
};
