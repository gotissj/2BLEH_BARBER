declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				name: string;
				email: string;
				phone: string;
				role: 'admin' | 'barbero' | 'cliente';
			} | null;
		}
	}
}

export {};
