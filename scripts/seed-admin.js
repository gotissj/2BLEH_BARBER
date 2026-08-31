import { createClient } from '@libsql/client';
import { hashPassword } from '../src/lib/server/auth/password.js';
import { randomUUID } from 'node:crypto';

const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
	console.error('Faltan variables de entorno: ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD');
	process.exit(1);
}
if (!DATABASE_URL) {
	console.error('Falta DATABASE_URL');
	process.exit(1);
}

const client = createClient({
	url: DATABASE_URL,
	authToken: DATABASE_AUTH_TOKEN
});

async function main() {
	try {
		// Check if admin already exists
		const existing = await client.execute({
			sql: 'SELECT id FROM user WHERE email = ?',
			args: [ADMIN_EMAIL.toLowerCase()]
		});

		if (existing.rows.length > 0) {
			console.log('Admin ya existe:', ADMIN_EMAIL);
		} else {
			const passwordHash = hashPassword(ADMIN_PASSWORD);
			const id = randomUUID();
			const now = new Date();

			await client.execute({
				sql: `INSERT INTO user (id, name, email, phone, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
				args: [id, ADMIN_NAME, ADMIN_EMAIL.toLowerCase(), '', passwordHash, 'admin', now]
			});

			console.log('Admin creado:', ADMIN_EMAIL);
		}

		// Seed default services
		const services = [
			{ id: 'corte', name: 'Corte de cabello', price: 2000, duration: 30 },
			{ id: 'barba', name: 'Arreglo de barba', price: 1500, duration: 20 },
			{ id: 'corte-barba', name: 'Corte + barba', price: 3000, duration: 50 }
		];

		for (const s of services) {
			const exists = await client.execute({
				sql: 'SELECT id FROM service WHERE id = ?',
				args: [s.id]
			});
			if (exists.rows.length === 0) {
				await client.execute({
					sql: `INSERT INTO service (id, name, price, duration, active, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
					args: [s.id, s.name, s.price, s.duration, 1, new Date()]
				});
				console.log('Servicio creado:', s.name);
			}
		}

		// Seed default business config
		const config = {
			name: '2bleh Barber',
			openHour: '9',
			closeHour: '19',
			slotMinutes: '60',
			timezone: 'America/Asuncion'
		};

		for (const [key, value] of Object.entries(config)) {
			const exists = await client.execute({
				sql: 'SELECT key FROM business_config WHERE key = ?',
				args: [key]
			});
			if (exists.rows.length === 0) {
				await client.execute({
					sql: `INSERT INTO business_config (key, value, updated_at) VALUES (?, ?, ?)`,
					args: [key, value, new Date()]
				});
			}
		}

		console.log('Configuración por defecto aplicada');
	} catch (err) {
		console.error('Error en seed:', err);
		process.exit(1);
	} finally {
		await client.close();
	}
}

main();
