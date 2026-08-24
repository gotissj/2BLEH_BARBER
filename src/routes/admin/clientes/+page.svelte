<script>
	import { formatDate } from '$lib/format';
	import { resolve } from '$app/paths';

	let { data } = $props();
	const clients = $derived(data.clients);
	const clientId = $derived(data.clientId);
	const clientBookings = $derived(data.clientBookings);

	const statusBadge = (/** @type {string} */ s) => {
		const base = 'badge badge-sm';
		if (s === 'pendiente') return `${base} badge-warning`;
		if (s === 'confirmada') return `${base} badge-success`;
		if (s === 'realizado') return `${base} badge-neutral`;
		if (s === 'ausente') return `${base} badge-error`;
		return `${base} badge-error`;
	};
</script>

<div class="space-y-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold sm:text-3xl">Clientes</h1>
		<p class="mt-1 text-sm text-base-content/60 sm:text-base">Gestioná los clientes registrados.</p>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title">Clientes registrados</h2>
			{#if clients.length === 0}
				<div class="py-8 text-center">
					<svg
						class="mx-auto h-12 w-12 text-base-content/30"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
						/></svg
					>
					<p class="mt-2 text-base-content/60">No hay clientes registrados.</p>
				</div>
			{/if}
			<div class="mt-4 overflow-x-auto">
				<table class="table-responsive table">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Email</th>
							<th>Teléfono</th>
							<th>Registrado</th>
							<th class="text-right">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{#each clients as c (c.id)}
							<tr class="hover:bg-base-200">
								<td class="font-medium">{c.name}</td>
								<td>{c.email}</td>
								<td class="hidden md:table-cell">{c.phone}</td>
								<td class="hidden lg:table-cell">{formatDate(String(c.createdAt).split('T')[0])}</td
								>
								<td class="text-right">
									<form method="GET" action={resolve('/admin/clientes')} class="inline">
										<input type="hidden" name="clientId" value={c.id} />
										<button class="btn btn-circle btn-ghost btn-sm" aria-label="Ver historial"
											><svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/></svg
											></button
										>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	{#if clientId}
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-4 sm:p-6">
				<h2 class="mb-4 card-title">Historial de turnos</h2>
				{#if clientBookings.length === 0}
					<p class="py-4 text-center text-base-content/60">Sin turnos.</p>
				{/if}
				<div class="overflow-x-auto">
					<table class="table-responsive table">
						<thead>
							<tr>
								<th>Fecha</th>
								<th>Hora</th>
								<th>Barbero</th>
								<th>Servicio</th>
								<th>Estado</th>
							</tr>
						</thead>
						<tbody>
							{#each clientBookings as b (b.id)}
								<tr class="hover:bg-base-200">
									<td>{formatDate(b.date)}</td>
									<td>{b.time}</td>
									<td>{b.barberName}</td>
									<td>{b.service}</td>
									<td><span class={statusBadge(b.status)}>{b.status}</span></td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{/if}
</div>
