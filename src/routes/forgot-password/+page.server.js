import { fail } from '@sveltejs/kit';
import { findUserByEmail } from '$lib/server/services/users';
import { createPasswordResetToken } from '$lib/server/services/passwordReset';
import { sendPasswordResetEmail } from '$lib/server/services/email';

export const load = async ({ locals }) => {
	// Si ya está logueado, no necesita recuperar
	// Permitimos acceso igual, pero opcionalmente redirigir
	// if (locals.user) throw redirect(303, roleHome(locals.user.role));
	return {};
};

export const actions = {
	async default({ request }) {
		const data = await request.formData();
		const emailRaw = String(data.get('email') ?? '').trim().toLowerCase();

		if (!emailRaw || !emailRaw.includes('@')) {
			return fail(400, { error: 'Ingresá un email válido', email: emailRaw });
		}

		const user = await findUserByEmail(emailRaw);

		// Siempre responder con éxito para no enumerar usuarios
		// Si no existe, igual mostramos mensaje genérico
		if (!user) {
			// Pequeño delay para mitigar timing attacks (opcional)
			await new Promise((r) => setTimeout(r, 300));
			return { success: true };
		}

		try {
			const token = await createPasswordResetToken(user.id);
			const origin = new URL(request.url).origin;

			await sendPasswordResetEmail({
				email: user.email,
				name: user.name,
				token,
				origin
			});
		} catch (e) {
			console.error('Error al crear/enviar token reset', e);
			// No filtrar error al cliente, mostrar éxito genérico igualmente
		}

		return { success: true };
	}
};
