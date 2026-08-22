<script>
	import { resolve } from '$app/paths';
	import { formatDate } from '$lib/format';

	const today = new Date().toISOString().slice(0, 10);
</script>

<div class="mx-auto max-w-md px-4 py-8">
	<h1 class="text-2xl font-bold">Panel del barbero</h1>
	<p class="mt-2 text-sm text-gray-500">Hoy es {formatDate(today)}.</p>

	<a
		href={resolve('/barbero/agenda')}
		class="mt-6 block rounded border border-gray-300 px-4 py-3 text-sm font-medium hover:bg-gray-50"
	>
		Ver agenda de hoy →
	</a>
</div>
