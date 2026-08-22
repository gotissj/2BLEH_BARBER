import { env } from '$env/dynamic/private';
import { whatsappPhone } from '$lib/format';

/**
 * @param {{ phone: string; clientName: string; time: string; date: string; service: string }} booking
 */
export async function notifyBarberNewBooking(booking) {
	if (!env.WHATSAPP_ACCESS_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
		console.warn('WhatsApp no configurado: falta WHATSAPP_ACCESS_TOKEN o WHATSAPP_PHONE_NUMBER_ID');
		return false;
	}

	const recipient = whatsappPhone(booking.phone);
	if (!recipient) {
		console.warn('No se pudo enviar WhatsApp: el teléfono del barbero está vacío');
		return false;
	}

	const response = await fetch(
		`https://graph.facebook.com/${env.WHATSAPP_API_VERSION || 'v23.0'}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				messaging_product: 'whatsapp',
				to: recipient,
				type: 'text',
				text: {
					preview_url: false,
					body: `Nueva reserva\nNombre: ${booking.clientName}\nHora: ${booking.time}\nFecha: ${booking.date}\nServicio: ${booking.service}`
				}
			})
		}
	);

	if (!response.ok) {
		console.error('No se pudo enviar la notificación de WhatsApp', await response.text());
		return false;
	}
	return true;
}
