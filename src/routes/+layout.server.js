import { toPublicUser } from '$lib/server/services/users';

export function load({ locals }) {
	return { user: locals.user ? toPublicUser(locals.user) : null };
}
