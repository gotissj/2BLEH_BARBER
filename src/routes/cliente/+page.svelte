<script>
	import { resolve } from '$app/paths';
	import { formatDate, statusLabels } from '$lib/format';

	let { data } = $props();

	const statusBadge = (/** @type {string} */ status) => {
		const base = 'badge badge-sm';
		if (status === 'pendiente') return `${base} badge-warning`;
		if (status === 'confirmada') return `${base} badge-success`;
		if (status === 'realizado') return `${base} badge-neutral`;
		if (status === 'ausente') return `${base} badge-error`;
		return `${base} badge-error`;
	};
</script>

<div class="card-wide">
	<div class="card-body p-4 sm:p-6">
		<div class="mb-4 text-center">
			<h1 class="text-xl font-bold sm:text-2xl">Mis reservas</h1>
		</div>

		{#if data.bookings.length === 0}
			<div class="py-12 text-center">
				<svg
					class="mx-auto h-16 w-16 text-base-content/30"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<p class="mt-4 text-base-content/60">Todavía no tenés reservas.</p>
				<a href={resolve('/reservar')} class="btn mt-4 w-full btn-primary sm:w-auto"
					>Reservar mi primer turno</a
				>
			</div>
		{/if}

		<div class="overflow-x-auto">
			<table class="table-responsive table">
				<thead>
					<tr>
						<th class="hidden sm:table-cell">Servicio</th>
						<th class="hidden md:table-cell">Barbero</th>
						<th>Día</th>
						<th>Hora</th>
						<th>Estado</th>
						<th class="w-12"></th>
					</tr>
				</thead>
				<tbody>
					{#each data.bookings as b (b.id)}
						<tr class="hover:bg-base-200">
							<td class="hidden font-medium sm:table-cell">{b.service}</td>
							<td class="hidden md:table-cell">{b.barberName}</td>
							<td>{formatDate(b.date)}</td>
							<td>{b.time}</td>
							<td><span class={statusBadge(b.status)}>{statusLabels[b.status]}</span></td>
							<td>
								<a
									href={resolve(`/reservas/${b.id}`)}
									class="btn btn-circle btn-ghost btn-sm"
									aria-label="Ver detalle de la reserva"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
										/>
									</svg>
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
