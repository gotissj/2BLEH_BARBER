/** @param {string} iso */
export function formatDate(iso) {
	if (!iso) return '';
	const [y, m, d] = iso.split('-').map(Number);
	return new Date(y, m - 1, d).toLocaleDateString('es-PY', {
		weekday: 'short',
		day: 'numeric',
		month: 'short'
	});
}

/** @param {string} iso @param {number} offset */
export function shiftDate(iso, offset) {
	if (!iso) return '';
	const [y, m, d] = iso.split('-').map(Number);
	const dt = new Date(y, m - 1, d);
	dt.setDate(dt.getDate() + offset);
	const yy = dt.getFullYear();
	const mm = String(dt.getMonth() + 1).padStart(2, '0');
	const dd = String(dt.getDate()).padStart(2, '0');
	return `${yy}-${mm}-${dd}`;
}

/** @type {Record<string, string>} */
export const statusLabels = {
	pendiente: 'Pendiente',
	confirmada: 'Confirmada',
	cancelada: 'Cancelada',
	realizado: 'Realizado',
	ausente: 'No vino'
};

/** @param {string} status */
export function statusBadge(status) {
	/** @type {{[k: string]: string}} */
	const classes = {
		pendiente: 'badge-info',
		confirmada: 'badge-success',
		cancelada: 'badge-error',
		realizado: 'badge-success',
		ausente: 'badge-error'
	};
	return classes[status] || 'badge-neutral';
}

/** @param {string} phone */
export function whatsappPhone(phone) {
	const digits = String(phone ?? '').replace(/\D/g, '');
	if (!digits) return '';
	if (digits.startsWith('00')) return digits.slice(2);
	if (digits.startsWith('595')) return digits;
	if (digits.length === 9 && digits.startsWith('9')) return `595${digits}`;
	return digits.startsWith('0') ? `595${digits.slice(1)}` : digits;
}
