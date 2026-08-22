import { redirect } from '@sveltejs/kit';
import { toPublicUser, roleHome } from '$lib/server/services/users';

export function load({ locals }) {
	if (!locals.user) throw redirect(303, '/login');
	if (locals.user.role !== 'cliente') throw redirect(303, roleHome(locals.user.role));
	return { user: toPublicUser(locals.user) };
}
