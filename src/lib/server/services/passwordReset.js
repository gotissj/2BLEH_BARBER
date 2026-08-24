import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { passwordResetToken, user } from '$lib/server/db/schema';

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hora

/**
 * Crea un token de reseteo para el usuario. Invalida tokens previos del mismo usuario.
 * @param {string} userId
 * @returns {Promise<string>} token
 */
export async function createPasswordResetToken(userId) {
	// Invalida tokens previos
	await db.delete(passwordResetToken).where(eq(passwordResetToken.userId, userId));

	const token = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + RESET_TTL_MS);

	await db.insert(passwordResetToken).values({ token, userId, expiresAt });
	return token;
}

/**
 * Valida un token y retorna el usuario asociado si es válido y no expirado.
 * @param {string} token
 * @returns {Promise<{ token: any, user: any } | null>}
 */
export async function validatePasswordResetToken(token) {
	if (!token) return null;
	const rows = await db
		.select({ token: passwordResetToken, user: user })
		.from(passwordResetToken)
		.innerJoin(user, eq(passwordResetToken.userId, user.id))
		.where(eq(passwordResetToken.token, token))
		.limit(1);

	const row = rows[0];
	if (!row) return null;
	if (row.token.expiresAt < new Date()) {
		// Expirado -> borrar
		await db.delete(passwordResetToken).where(eq(passwordResetToken.token, token));
		return null;
	}
	return row;
}

/**
 * Consume (borra) un token después de uso exitoso.
 * @param {string} token
 */
export async function consumePasswordResetToken(token) {
	await db.delete(passwordResetToken).where(eq(passwordResetToken.token, token));
}

/**
 * Borra todos los tokens de un usuario (ej. al cambiar password).
 * @param {string} userId
 */
export async function deleteUserResetTokens(userId) {
	await db.delete(passwordResetToken).where(eq(passwordResetToken.userId, userId));
}
