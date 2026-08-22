<script>
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<div class="space-y-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold sm:text-3xl">2bleh Barber</h1>
		<p class="mt-1 text-sm text-base-content/60 sm:text-base">Resumen del negocio</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-3">
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-4 text-center sm:p-6">
				<p class="text-sm text-base-content/60">Barberos</p>
				<p class="mt-1 text-2xl font-bold sm:text-3xl">{data.barbers.length}</p>
			</div>
		</div>
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-4 text-center sm:p-6">
				<p class="text-sm text-base-content/60">Clientes</p>
				<p class="mt-1 text-2xl font-bold sm:text-3xl">{data.clientsCount}</p>
			</div>
		</div>
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-4 text-center sm:p-6">
				<p class="text-sm text-base-content/60">Turnos hoy</p>
				<p class="mt-1 text-2xl font-bold sm:text-3xl">{data.bookingsTodayCount}</p>
			</div>
		</div>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h2 class="card-title">Barberos registrados</h2>
				<a href={resolve('/admin/barberos')} class="btn w-full btn-primary btn-sm sm:w-auto"
					>Gestionar</a
				>
			</div>
			{#if data.barbers.length === 0}
				<p class="py-4 text-center text-base-content/60">No hay barberos registrados.</p>
			{/if}
			<div class="overflow-x-auto">
				<table class="table-responsive table">
					<thead>
						<tr>
							<th>Nombre</th>
							<th class="hidden md:table-cell">Email</th>
							<th class="hidden lg:table-cell">Teléfono</th>
						</tr>
					</thead>
					<tbody>
						{#each data.barbers as b (b.id)}
							<tr class="hover:bg-base-200">
								<td class="font-medium">{b.name}</td>
								<td class="hidden md:table-cell">{b.email}</td>
								<td class="hidden lg:table-cell">{b.phone}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
