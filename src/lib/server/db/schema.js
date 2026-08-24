import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	phone: text('phone').notNull(),
	passwordHash: text('password_hash').notNull(),
	role: text('role', { enum: ['admin', 'barbero', 'cliente'] })
		.notNull()
		.default('cliente'),
	avatar: text('avatar'),
	notifications: integer('notifications', { mode: 'boolean' }).notNull().default(true),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const session = sqliteTable('session', {
	token: text('token').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const passwordResetToken = sqliteTable('password_reset_token', {
	token: text('token').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const service = sqliteTable('service', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull().unique(),
	price: integer('price').notNull(),
	duration: integer('duration').notNull().default(60),
	active: integer('active', { mode: 'boolean' }).notNull().default(true),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const agendaBlock = sqliteTable(
	'agenda_block',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		barberId: text('barber_id')
			.notNull()
			.references(() => user.id),
		date: text('date').notNull(),
		startTime: text('start_time').notNull(),
		endTime: text('end_time').notNull(),
		reason: text('reason'),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => ({
		barberDateIdx: uniqueIndex('agenda_block_barber_date_idx').on(
			table.barberId,
			table.date,
			table.startTime
		)
	})
);

export const businessConfig = sqliteTable('business_config', {
	key: text('key').primaryKey(),
	value: text('value').notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const booking = sqliteTable(
	'booking',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		clientId: text('client_id')
			.notNull()
			.references(() => user.id),
		barberId: text('barber_id')
			.notNull()
			.references(() => user.id),
		service: text('service').notNull(),
		date: text('date').notNull(),
		time: text('time').notNull(),
		status: text('status', { enum: ['pendiente', 'confirmada', 'cancelada', 'realizado', 'ausente'] })
			.notNull()
			.default('pendiente'),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => ({
		barberDateTimeIdx: uniqueIndex('booking_barber_date_time_idx')
			.on(table.barberId, table.date, table.time)
			.where(sql`${table.status} != 'cancelada'`)
	})
);
