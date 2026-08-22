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
			subject: 'Nueva reserva',
			text: `Nueva reserva\nNombre: ${booking.clientName}\nHora: ${booking.time}\nFecha: ${booking.date}\nServicio: ${booking.service}`,
			html: `<h2>Nueva reserva</h2><p><strong>Nombre:</strong> ${booking.clientName}</p><p><strong>Hora:</strong> ${booking.time}</p><p><strong>Fecha:</strong> ${booking.date}</p><p><strong>Servicio:</strong> ${booking.service}</p>`
		})
	});

	if (!response.ok) {
		console.error('No se pudo enviar la notificación por correo', await response.text());
		return false;
	}
	return true;
}
