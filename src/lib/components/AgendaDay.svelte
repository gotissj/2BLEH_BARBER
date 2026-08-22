<script>
	import { resolve } from '$app/paths';
	import { formatDate, shiftDate, statusLabels, statusBadge, whatsappPhone } from '$lib/format';
	import { enhance } from '$app/forms';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';

	let { date, bookings, blocks } = $props();
	let expanded = $state(new Set());
	/** @type {{ open: boolean; message: string; form: HTMLFormElement | null }} */
	let confirmation = $state({ open: false, message: '', form: null });

	/** @param {SubmitEvent} event @param {string} message */
	function askForConfirmation(event, message) {
		const form = /** @type {HTMLFormElement} */ (event.currentTarget);
		if (form.dataset.confirmed === 'true') {
			delete form.dataset.confirmed;
			return;
		}
		event.preventDefault();
		confirmation = { open: true, message, form };
	}

	function cancelConfirmation() {
		confirmation = { open: false, message: '', form: null };
	}

	function confirmAction() {
		const form = confirmation.form;
		cancelConfirmation();
		if (form) {
			form.dataset.confirmed = 'true';
			form.requestSubmit();
		}
	}
	/**
	 * @param {string} id
	 */
	const toggleExpand = (id) => {
		expanded.has(id) ? expanded.delete(id) : expanded.add(id);
	};
</script>

<div class="card-wide">
	<div class="card-body p-4 sm:p-6">
		<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div class="text-center sm:text-left">
				<h1 class="text-xl font-bold sm:text-2xl">Agenda del {formatDate(date)}</h1>
				<p class="mt-1 text-sm text-base-content/60">
					{bookings.length}
					{bookings.length === 1 ? 'turno' : 'turnos'}
					{blocks.length > 0 ? ` · ${blocks.length} bloqueo${blocks.length > 1 ? 's' : ''}` : ''}
				</p>
			</div>
			<div class="flex justify-center gap-2 sm:justify-end">
				<a
					href={resolve(`/barbero/agenda/${shiftDate(date, -1)}`)}
					class="btn btn-circle btn-ghost btn-sm"
					aria-label="Día anterior"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/></svg
					></a
				>
				<a
					href={resolve(`/barbero/agenda/${shiftDate(date, 1)}`)}
					class="btn btn-circle btn-ghost btn-sm"
					aria-label="Día siguiente"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/></svg
					></a
				>
			</div>
		</div>

		{#if blocks.length > 0}
			<div class="mb-4 rounded-lg border border-warning/30 bg-warning/10 p-3">
				<h3 class="font-semibold text-warning">Bloqueos del día:</h3>
				<ul class="mt-1 space-y-1 text-sm">
					{#each blocks as b (b.id)}
						<li class="flex justify-between">
							<span>{b.startTime} – {b.endTime}</span>
							<span class="text-base-content/60">{b.reason ?? 'Sin motivo'}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if bookings.length === 0 && blocks.length === 0}
			<div class="py-12 text-center">
				<svg
					class="mx-auto h-16 w-16 text-base-content/30"
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
				<p class="mt-4 text-base-content/60">No hay turnos ni bloqueos para este día.</p>
			</div>
		{/if}

		<div class="mt-4 overflow-x-auto">
			<table class="table-responsive table">
				<thead>
					<tr>
						<th class="w-16">Hora</th>
						<th>Cliente</th>
						<th>Servicio</th>
						<th class="hidden md:table-cell">Teléfono</th>
						<th>Estado</th>
						<th class="w-24">Acciones</th>
					</tr>
				</thead>
				<tbody>
					{#each bookings as b (b.id)}
						<tr class="hover:bg-base-200">
							<td class="text-sm font-semibold sm:text-base">{b.time}</td>
							<td class="font-medium">{b.clientName}</td>
							<td class="text-sm">{b.service}</td>
							<td class="hidden text-sm text-base-content/60 md:table-cell">{b.clientPhone}</td>
							<td>
								<span class={statusBadge(b.status)}>{statusLabels[b.status] ?? b.status}</span>
							</td>
							<td>
								<div class="flex justify-end gap-1">
									{#if b.status === 'pendiente'}
										<a
											href={resolve(`/reservas/${b.id}`)}
											class="btn btn-circle btn-ghost btn-info btn-sm"
											aria-label="Reagendar turno"
											title="Reagendar"
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
													d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
												/></svg
											></a
										>
										<a
											href={`https://wa.me/${whatsappPhone(b.clientPhone)}`}
											target="_blank"
											rel="noopener noreferrer"
											class="btn btn-circle btn-ghost btn-success btn-sm"
											aria-label="Escribir por WhatsApp"
											title="WhatsApp"
											><svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												fill="currentColor"
												viewBox="0 0 24 24"
												><path
													d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
												/></svg
											></a
										>
										<form method="POST" action="?/confirmar" use:enhance>
											<input type="hidden" name="id" value={b.id} />
											<button
												type="submit"
												class="btn btn-circle btn-ghost btn-success btn-sm"
												aria-label="Confirmar turno"
												title="Confirmar"
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
														d="M5 13l4 4L19 7"
													/></svg
												></button
											>
										</form>
										<form
											method="POST"
											action="?/cancelar"
											use:enhance
											onsubmit={(e) => askForConfirmation(e, '¿Cancelar turno?')}
										>
											<input type="hidden" name="id" value={b.id} />
											<button
												type="submit"
												class="btn btn-circle btn-ghost btn-error btn-sm"
												aria-label="Cancelar turno"
												title="Cancelar"
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
														d="M6 18L18 6M6 6l12 12"
													/></svg
												></button
											>
										</form>
									{:else if b.status === 'confirmada'}
										<a
											href={resolve(`/reservas/${b.id}`)}
											class="btn btn-circle btn-ghost btn-info btn-sm"
											aria-label="Reagendar turno"
											title="Reagendar"
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
													d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
												/></svg
											></a
										>
										<a
											href={`https://wa.me/${whatsappPhone(b.clientPhone)}`}
											target="_blank"
											rel="noopener noreferrer"
											class="btn btn-circle btn-ghost btn-success btn-sm"
											aria-label="Escribir por WhatsApp"
											title="WhatsApp"
											><svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												fill="currentColor"
												viewBox="0 0 24 24"
												><path
													d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
												/></svg
											></a
										>
										<form
											method="POST"
											action="?/cancelar"
											use:enhance
											onsubmit={(e) => askForConfirmation(e, '¿Cancelar turno confirmado?')}
										>
											<input type="hidden" name="id" value={b.id} />
											<button
												type="submit"
												class="btn btn-circle btn-ghost btn-error btn-sm"
												aria-label="Cancelar turno"
												title="Cancelar"
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
														d="M6 18L18 6M6 6l12 12"
													/></svg
												></button
											>
										</form>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
					{#each blocks as b (b.id)}
						<tr class="bg-warning/5 hover:bg-base-200">
							<td class="text-sm font-semibold sm:text-base">{b.startTime} – {b.endTime}</td>
							<td colspan="3" class="font-medium text-warning">BLOQUEADO</td>
							<td><span class="badge badge-sm badge-warning">{b.reason ?? 'Sin motivo'}</span></td>
							<td>
								<form
									method="POST"
									action="?/eliminarBloqueo"
									use:enhance
									onsubmit={(e) => askForConfirmation(e, '¿Eliminar bloqueo?')}
								>
									<input type="hidden" name="id" value={b.id} />
									<input type="hidden" name="barberId" value={b.barberId} />
									<button
										type="submit"
										class="btn btn-circle btn-ghost btn-error btn-sm"
										aria-label="Eliminar bloqueo"
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

		<div class="mt-6 rounded-lg bg-base-200 p-3">
			<h3 class="mb-2 font-semibold">Bloquear horario</h3>
			<form method="POST" action="?/bloquear" use:enhance class="grid gap-3 sm:grid-cols-4">
				<input type="hidden" name="date" value={date} />
				<div class="form-control">
					<label class="label" for="startTime"><span class="label-text">Desde</span></label>
					<input
						id="startTime"
						type="time"
						name="startTime"
						required
						class="input-bordered input w-full"
					/>
				</div>
				<div class="form-control">
					<label class="label" for="endTime"><span class="label-text">Hasta</span></label>
					<input
						id="endTime"
						type="time"
						name="endTime"
						required
						class="input-bordered input w-full"
					/>
				</div>
				<div class="form-control sm:col-span-2">
					<label class="label" for="reason"><span class="label-text">Motivo</span></label>
					<input
						id="reason"
						type="text"
						name="reason"
						class="input-bordered input w-full"
						placeholder="Ej: Almuerzo, Cita personal"
					/>
				</div>
				<button type="submit" class="btn self-start btn-primary sm:col-span-4">Bloquear</button>
			</form>
		</div>
	</div>
	<ConfirmModal
		open={confirmation.open}
		message={confirmation.message}
		onConfirm={confirmAction}
		onCancel={cancelConfirmation}
	/>
</div>
