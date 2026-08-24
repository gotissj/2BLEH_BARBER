<script>
	import { enhance } from '$app/forms';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';

	let { data } = $props();
	const allBookings = $derived(data.bookings);
	const barbers = $derived(data.barbers);

	let barberId = $state(data.barberId || '');
	let date = $state(data.date || new Date().toISOString().slice(0, 10));

	const selectedBarber = $derived(barbers.find((b) => b.id === barberId));
	const bookings = $derived(
		barberId ? allBookings.filter((b) => b.barberId === barberId && b.date === date) : []
	);

	/** @param {string} id */
	function selectBarber(id) {
		barberId = id;
		history.replaceState(null, '', `/admin/turnos?date=${date}&barberId=${id}`);
	}

	function changeDate() {
		history.replaceState(null, '', `/admin/turnos?date=${date}&barberId=${barberId}`);
	}

	let deleteModalOpen = $state(false);
	let pendingDeleteId = $state(/** @type {string | null} */ (null));
	let deleteForm = $state(/** @type {HTMLFormElement | null} */ (null));

	/** @param {string} id */
	function askDelete(id) {
		pendingDeleteId = id;
		deleteModalOpen = true;
	}

	function cancelDelete() {
		deleteModalOpen = false;
		pendingDeleteId = null;
	}

	function confirmDelete() {
		if (pendingDeleteId && deleteForm) {
			const input = deleteForm.querySelector('input[name="id"]');
			if (input) /** @type {HTMLInputElement} */ (input).value = pendingDeleteId;
			deleteForm.requestSubmit();
		}
		deleteModalOpen = false;
		pendingDeleteId = null;
	}
</script>

<div class="space-y-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold sm:text-3xl">Gestión de turnos</h1>
		<p class="mt-1 text-sm text-base-content/60 sm:text-base">
			Elegí un barbero para ver sus turnos del día.
		</p>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title">Barbero</h2>
			<div class="grid gap-3 sm:grid-cols-3">
				{#each barbers as b (b.id)}
					<button
						type="button"
						class="card bg-base-200 text-left transition-all hover:bg-base-300 aria-[current]:ring-2 aria-[current]:ring-primary"
						aria-current={barberId === b.id ? 'true' : undefined}
						onclick={() => selectBarber(b.id)}
					>
						<div class="card-body flex-row items-center gap-3 p-4">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-base-300 text-base-content/70"
								>{b.name.charAt(0).toUpperCase()}</div
							>
							<div class="min-w-0">
								<p class="truncate font-medium">{b.name}</p>
								<p class="truncate text-xs text-base-content/60">{b.email}</p>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>

	{#if selectedBarber}
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-4 sm:p-6">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<h2 class="card-title">Turnos de {selectedBarber.name}</h2>
					<div class="flex items-center gap-2">
						<label class="label" for="turnos-date"><span class="label-text">Día</span></label>
						<input
							id="turnos-date"
							type="date"
							bind:value={date}
							onchange={changeDate}
							class="input-bordered input w-full sm:w-auto"
						/>
					</div>
				</div>

				{#if bookings.length === 0}
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
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/></svg
						>
						<p class="mt-2 text-base-content/60">No hay turnos para esta fecha.</p>
					</div>
				{:else}
					<div class="mt-4 overflow-x-auto">
						<table class="table-responsive table">
							<thead>
								<tr>
									<th>Hora</th>
									<th>Cliente</th>
									<th class="hidden md:table-cell">Teléfono</th>
									<th>Servicio</th>
									<th>Estado</th>
									<th class="text-right">Acciones</th>
								</tr>
							</thead>
							<tbody>
								{#each bookings as b (b.id)}
									<tr class="hover:bg-base-200">
										<td class="font-semibold">{b.time}</td>
										<td class="font-medium">{b.clientName}</td>
										<td class="hidden md:table-cell">{b.clientPhone}</td>
										<td>{b.service}</td>
										<td>
											<form method="POST" action="?/cambiarEstado" use:enhance>
												<input type="hidden" name="id" value={b.id} />
												<select
													name="status"
													class="select-bordered select w-full max-w-xs select-sm"
													onchange={(e) => {
														const target = /** @type {HTMLInputElement} */ (e.target);
														target.form?.requestSubmit();
													}}
												>
													<option value="pendiente" selected={b.status === 'pendiente'}
														>Pendiente</option
													>
													<option value="confirmada" selected={b.status === 'confirmada'}
														>Confirmada</option
													>
													<option value="cancelada" selected={b.status === 'cancelada'}
														>Cancelada</option
													>
													<option value="realizado" selected={b.status === 'realizado'}
														>Realizado</option
													>
													<option value="ausente" selected={b.status === 'ausente'}
														>Ausente</option
													>
												</select>
											</form>
										</td>
										<td class="text-right">
											<button
												type="button"
												class="btn btn-circle btn-ghost text-red-600 btn-sm"
												aria-label="Eliminar turno"
												onclick={() => askDelete(b.id)}
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
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v12m-6 0h14m-6 0v-8m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h10"
													/></svg
												></button
											>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-4 sm:p-6">
				<div class="flex items-center justify-center gap-2 py-8 text-base-content/60">
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/></svg
					>
					<p>Elegí un barbero para ver sus turnos.</p>
				</div>
			</div>
		</div>
	{/if}

	<form bind:this={deleteForm} method="POST" action="?/eliminar" use:enhance style="display: none;">
		<input type="hidden" name="id" value={pendingDeleteId ?? ''} />
	</form>

	<ConfirmModal
		open={deleteModalOpen}
		message="¿Eliminar turno? Esta acción no se puede deshacer."
		onConfirm={confirmDelete}
		onCancel={cancelDelete}
	/>
</div>