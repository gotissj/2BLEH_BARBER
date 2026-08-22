import { getUserFromSessionToken, SESSION_COOKIE } from '$lib/server/auth/session';

export async function handle({ event, resolve }) {
	event.locals.user = await getUserFromSessionToken(event.cookies.get(SESSION_COOKIE));
	return resolve(event);
}
