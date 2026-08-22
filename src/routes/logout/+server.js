import { deleteSession, SESSION_COOKIE } from '$lib/server/auth/session';

export async function POST({ cookies }) {
	await deleteSession(cookies.get(SESSION_COOKIE));
	cookies.delete(SESSION_COOKIE, { path: '/', secure: false });
	return new Response(null, { status: 303, headers: { location: '/' } });
}
