<script>
	import { enhance } from '$app/forms';
	import { formatDate } from '$lib/format';

	let { data, form } = $props();
	const blocks = $derived(data.blocks);
	const barbers = $derived(data.barbers);
	const date = $derived(data.date);
</script>

<div class="space-y-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold sm:text-3xl">Bloqueos de agenda</h1>
		<p class="mt-1 text-sm text-base-content/60 sm:text-base">
			Gestioná días/horarios no disponibles.
		</p>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title">Crear bloqueo</h2>
			{#if form?.error}
				<div class="mt-4 alert alert-error" role="alert">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 shrink-0 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2"
						/></svg
					><span>{form.error}</span>
				</div>
			{/if}
			<form method="POST" action="?/crear" use:enhance class="mt-4 grid gap-4 sm:grid-cols-4">
				<div class="form-control">
					<label class="label"><span class="label-text">Barbero</span></label>
					<select name="barberId" required class="select-bordered select w-full">
						<option value="">Elegí barbero</option>
						{#each barbers as b (b.id)}
							<option value={b.id}>{b.name}</option>
						{/each}
					</select>
				</div>
				<div class="form-control">
					<label class="label"><span class="label-text">Fecha</span></label>
					<input type="date" name="date" required min={date} class="input-bordered input w-full" />
				</div>
				<div class="form-control">
					<label class="label"><span class="label-text">Desde</span></label>
					<input type="time" name="startTime" required class="input-bordered input w-full" />
				</div>
				<div class="form-control">
					<label class="label"><span class="label-text">Hasta</span></label>
					<input type="time" name="endTime" required class="input-bordered input w-full" />
				</div>
				<div class="form-control sm:col-span-4">
					<label class="label"><span class="label-text">Motivo (opcional)</span></label>
					<input
						type="text"
						name="reason"
						class="input-bordered input w-full"
						placeholder="Ej: Almuerzo, Mantenimiento, Feriado"
					/>
				</div>
				<button type="submit" class="btn w-full self-start btn-primary sm:col-span-4 sm:w-auto"
					>Crear bloqueo</button
				>
			</form>
		</div>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title">Bloqueos programados</h2>
			{#if blocks.length === 0}
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
					<p class="mt-2 text-base-content/60">No hay bloqueos.</p>
				</div>
			{/if}
			<div class="mt-4 overflow-x-auto">
				<table class="table-responsive table">
					<thead>
						<tr>
							<th>Barbero</th>
							<th>Fecha</th>
							<th>Desde</th>
							<th>Hasta</th>
							<th class="hidden md:table-cell">Motivo</th>
							<th class="text-right">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{#each blocks as b (b.id)}
							<tr class="hover:bg-base-200">
								<td class="font-medium">{b.barberName}</td>
								<td>{formatDate(b.date)}</td>
								<td>{b.startTime}</td>
								<td>{b.endTime}</td>
								<td class="hidden text-base-content/60 md:table-cell">{b.reason ?? '—'}</td>
								<td class="text-right">
									<form
										method="POST"
										action="?/eliminar"
										use:enhance
										onsubmit={(e) => !confirm('Eliminar bloqueo?') && e.preventDefault()}
									>
										<input type="hidden" name="id" value={b.id} />
										<input type="hidden" name="barberId" value={b.barberId} />
										<button type="submit" class="btn btn-circle btn-ghost text-red-600 btn-sm"
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
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
