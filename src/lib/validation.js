/**
 * Validación de teléfono paraguayo.
 * Formatos válidos (móvil):
 *  - 09XXXXXXXX (10 dígitos, ej: 0981123456)
 *  - 9XXXXXXXX  (9 dígitos sin 0, ej: 981123456)
 *  - +595 9XXXXXXXX (12 dígitos con código país, ej: +595981123456)
 *  - 5959XXXXXXXX
 * Se aceptan espacios, guiones y paréntesis pero se cuentan solo dígitos.
 * @param {string} phone
 * @returns {{ valid: boolean, error?: string, normalized?: string }}
 */
export function validateParaguayPhone(phone) {
	if (!phone || !String(phone).trim()) {
		return { valid: false, error: 'Teléfono requerido' };
	}
	const raw = String(phone).trim();
	// Solo caract. permitidos
	if (!/^[\d\s()+.\-]+$/.test(raw)) {
		return { valid: false, error: 'Teléfono solo debe contener números, espacios, +, - o paréntesis' };
	}
	const digits = raw.replace(/\D/g, '');

	let national = digits;
	let normalized = digits;

	if (digits.startsWith('595')) {
		national = digits.slice(3);
		if (national.length !== 9) {
			return {
				valid: false,
				error: 'Con código país +595 debe tener 9 dígitos (ej: +595 981 123456)'
			};
		}
		normalized = digits; // 5959...
	} else if (digits.startsWith('0')) {
		if (digits.length !== 10) {
			return {
				valid: false,
				error: 'Con 0 inicial debe tener 10 dígitos (ej: 0981123456)'
			};
		}
		national = digits.slice(1); // 9 dígitos
		normalized = digits; // 09...
	} else {
		if (digits.length !== 9) {
			return {
				valid: false,
				error: 'Debe tener 9 dígitos (ej: 981123456) o 10 con 0 (ej: 0981123456)'
			};
		}
		national = digits;
		normalized = `0${digits}`;
	}

	if (!/^9\d{8}$/.test(national)) {
		return {
			valid: false,
			error: 'Número paraguayo debe empezar con 9 (ej: 0981..., 0982..., 0983...)'
		};
	}

	return { valid: true, normalized };
}

/**
 * Límite de dígitos para input (para no permitir escribir de más).
 * @param {string} value
 * @returns {string} value truncado a dígitos permitidos
 */
export function truncateParaguayPhoneInput(value) {
	const digits = String(value).replace(/\D/g, '');
	if (digits.startsWith('595')) return digits.slice(0, 12);
	if (digits.startsWith('0')) return digits.slice(0, 10);
	return digits.slice(0, 9);
}
