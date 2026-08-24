import { env } from '$env/dynamic/private';

/**
 * @param {{ email: string; clientName: string; time: string; date: string; service: string }} booking
 */
export async function notifyBarberNewBookingByEmail(booking) {
	if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
		console.warn('Correo no configurado: falta RESEND_API_KEY o EMAIL_FROM');
		return false;
	}

	const recipient = env.EMAIL_TEST_RECIPIENT || booking.email;
	if (!recipient) {
		console.warn('No se pudo enviar el correo: el email del barbero está vacío');
		return false;
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: env.EMAIL_FROM,
			to: [recipient],
			subject: 'Nueva reserva recibida - 2bleh Barber',
			text: `¡Nueva reserva recibida!\n\nCliente: ${booking.clientName}\nFecha: ${booking.date}\nHora: ${booking.time}\nServicio: ${booking.service}\n\nGestioná tus turnos en tu panel de barbero.\n\n— 2bleh Barber`,
			html: `
				<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
					<h2 style="margin: 0 0 8px;">¡Nueva reserva recibida!</h2>
					<p>Hola,</p>
					<p>Tenés una <span style="color: #111; font-weight: 700;">nueva reserva</span> en <strong>2bleh Barber</strong>.</p>
					<table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
						<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Cliente</td><td style="padding: 8px 0; font-weight: 600; text-align: right;">${booking.clientName}</td></tr>
						<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Fecha</td><td style="padding: 8px 0; font-weight: 600; text-align: right;">${booking.date}</td></tr>
						<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Hora</td><td style="padding: 8px 0; font-weight: 600; text-align: right;">${booking.time}</td></tr>
						<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Servicio</td><td style="padding: 8px 0; font-weight: 600; text-align: right;">${booking.service}</td></tr>
					</table>
					<p style="font-size: 13px; color: #666;">Podés confirmar o gestionar el turno desde tu <strong>panel de barbero</strong>.</p>
					<hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
					<p style="font-size: 12px; color: #999;">Este es un mensaje automático, por favor no respondas a este correo.</p>
				</div>
			`
		})
	});

	if (!response.ok) {
		console.error('No se pudo enviar la notificación por correo', await response.text());
		return false;
	}
	return true;
}

/**
 * @param {{ email: string; clientName: string; barberName: string; date: string; time: string; service: string }} params
 */
export async function notifyClientBookingConfirmed({ email, clientName, barberName, date, time, service }) {
	if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
		console.warn('Correo no configurado: falta RESEND_API_KEY o EMAIL_FROM');
		console.log(`[DEV] Email de confirmación para ${email}: Tu turno con ${barberName} el ${date} a las ${time} (${service}) ha sido confirmado.`);
		return false;
	}

	const recipient = env.EMAIL_TEST_RECIPIENT || email;
	if (!recipient) {
		console.warn('No se pudo enviar el correo: el email del cliente está vacío');
		return false;
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: env.EMAIL_FROM,
			to: [recipient],
			subject: 'Tu turno ha sido confirmado - 2bleh Barber',
			text: `Hola ${clientName},\n\nTu turno ha sido confirmado.\n\nBarbero: ${barberName}\nFecha: ${date}\nHora: ${time}\nServicio: ${service}\n\n¡Te esperamos en 2bleh Barber!\nSi necesitás reprogramar, ingresá a tu panel.\n\n— 2bleh Barber`,
			html: `
				<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
					<h2 style="margin: 0 0 8px;">¡Tu turno ha sido confirmado!</h2>
					<p>Hola <strong>${clientName}</strong>,</p>
					<p>Tu turno en <strong>2bleh Barber</strong> ha sido <span style="color: #16a34a; font-weight: 700;">confirmado</span> por el barbero.</p>
					<table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
						<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Barbero</td><td style="padding: 8px 0; font-weight: 600; text-align: right;">${barberName}</td></tr>
						<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Fecha</td><td style="padding: 8px 0; font-weight: 600; text-align: right;">${date}</td></tr>
						<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Hora</td><td style="padding: 8px 0; font-weight: 600; text-align: right;">${time}</td></tr>
						<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Servicio</td><td style="padding: 8px 0; font-weight: 600; text-align: right;">${service}</td></tr>
					</table>
					<p style="font-size: 13px; color: #666;">¡Te esperamos! Si necesitás cancelar o reagendar, ingresá a <strong>Mis reservas</strong> en la web.</p>
					<hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
					<p style="font-size: 12px; color: #999;">Este es un mensaje automático, por favor no respondas a este correo.</p>
				</div>
			`
		})
	});

	if (!response.ok) {
		console.error('No se pudo enviar el email de confirmación al cliente', await response.text());
		return false;
	}
	return true;
}

/**
 * @param {{ email: string; name: string; token: string; origin: string }} params
 */
export async function sendPasswordResetEmail({ email, name, token, origin }) {
	const resetLink = `${origin}/reset-password?token=${encodeURIComponent(token)}`;

	if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
		console.warn('Correo no configurado: falta RESEND_API_KEY o EMAIL_FROM');
		console.log(`[DEV] Link de restablecimiento para ${email}: ${resetLink}`);
		return false;
	}

	// En dev, si hay TEST_RECIPIENT, respetarlo pero loguear el link real también
	const recipient = env.EMAIL_TEST_RECIPIENT || email;

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: env.EMAIL_FROM,
			to: [recipient],
			subject: 'Restablece tu contraseña - 2bleh Barber',
			text: `Hola ${name},\n\nRecibimos una solicitud para restablecer tu contraseña.\n\nHaz clic en el siguiente enlace (válido por 1 hora):\n${resetLink}\n\nSi no solicitaste esto, ignora este correo.\n\n— 2bleh Barber`,
			html: `
				<div style="font-family: sans-serif; max-width: 560px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
					<h2 style="margin: 0 0 12px;">Restablece tu contraseña</h2>
					<p>Hola <strong>${name}</strong>,</p>
					<p>Recibimos una solicitud para restablecer tu contraseña en <strong>2bleh Barber</strong>.</p>
					<p style="margin: 20px 0;">
						<a href="${resetLink}" style="display: inline-block; padding: 12px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">Restablecer contraseña</a>
					</p>
					<p style="font-size: 13px; color: #666;">Este enlace expira en <strong>1 hora</strong> y solo puede usarse una vez.</p>
					<p style="font-size: 13px; color: #666; word-break: break-all;">Si el botón no funciona, copia y pega este enlace:<br><a href="${resetLink}">${resetLink}</a></p>
					<hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
					<p style="font-size: 12px; color: #999;">Si no solicitaste esto, puedes ignorar este correo. Tu contraseña seguirá siendo la misma.</p>
				</div>
			`
		})
	});

	if (!response.ok) {
		console.error('No se pudo enviar el email de restablecimiento', await response.text());
		console.log(`[FALLBACK] Link de restablecimiento para ${email}: ${resetLink}`);
		return false;
	}
	return true;
}
