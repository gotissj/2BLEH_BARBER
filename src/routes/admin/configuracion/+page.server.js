import { getBusinessConfig, setBusinessConfig } from '$lib/server/services/admin';

export async function load() {
	const config = await getBusinessConfig();
	/** @type {Record<string, string>} */
	const obj = {};
	for (const row of config) obj[row.key] = row.value;
	return { config: obj };
}

export const actions = {
	guardar: async ({ request }) => {
		const data = await request.formData();
		/** @type {Record<string, string>} */
		const config = {};
		for (const [key, value] of data.entries()) {
			if (key !== 'guardar') config[key] = String(value);
		}
		await setBusinessConfig(config);
		return { success: true };
	}
};
