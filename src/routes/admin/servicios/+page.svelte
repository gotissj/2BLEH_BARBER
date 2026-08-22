<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const services = $derived(data.services);
	let editingId = $state(/** @type {string | null} */ (null));
	let editData = $state({ name: '', price: '' });

	/** @param {{ id: string; name: string; price: number }} s */
	function startEdit(s) {
		editData = {
			name: s.name,
			price: String(s.price)
		};
		editingId = s.id;
	}

	/**
	 * Evita que enhance resetee los inputs bindeados y
	 * cierra el modo edición al guardar correctamente.
	 */
	/** @param {{ update: (opts?: { reset?: boolean }) => Promise<void>; result: import('@sveltejs/kit').ActionResult }} p */
	async function afterEdit({ update, result }) {
		await update({ reset: false });
		if (result.type === 'success') {
			editingId = null;
			editData = { name: '', price: '' };
		}
	}

	function enhanceEdit() {
		return afterEdit;
	}
</script>

<div class="space-y-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold sm:text-3xl">Servicios</h1>
		<p class="mt-1 text-sm text-base-content/60 sm:text-base">Gestioná los servicios del local.</p>
	</div>

	{#if form?.error}
		<div class="alert alert-error" role="alert">
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
			>
			<span>{form.error}</span>
		</div>
	{/if}

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title">Crear servicio</h2>
			<form
				method="POST"
				action="?/crear"
				use:enhance
				class="mt-4 grid gap-4 sm:grid-cols-2"
			>
				<div class="form-control">
					<label class="label"><span class="label-text">Nombre</span></label>
					<input
						type="text"
						name="name"
						required
						class="input-bordered input w-full"
						placeholder="Ej: Corte de cabello"
					/>
				</div>
				<div class="form-control">
					<label class="label"><span class="label-text">Precio (Gs.)</span></label>
					<input
						type="number"
						name="price"
						required
						min="0"
						class="input-bordered input w-full"
						placeholder="20000"
					/>
				</div>
				<button type="submit" class="btn self-start btn-primary sm:col-span-2"
					>Crear servicio</button
				>
			</form>
		</div>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title">Servicios registrados</h2>
			{#if services.length === 0}
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
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
						/></svg
					>
					<p class="mt-2 text-base-content/60">No hay servicios registrados.</p>
				</div>
			{/if}
			<div class="mt-4 overflow-x-auto">
				<table class="table-responsive table">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Precio</th>
							<th class="text-right">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{#each services as s (s.id)}
							<tr class="hover:bg-base-200">
								{#if editingId === s.id}
									<td colspan="3">
										<form
											method="POST"
											action="?/actualizar"
											use:enhance={enhanceEdit}
											class="grid items-center gap-3 sm:grid-cols-3"
										>
											<input type="hidden" name="id" value={s.id} />
											<input
												type="text"
												name="name"
												bind:value={editData.name}
												class="input-bordered input w-full input-sm"
												aria-label="Nombre del servicio"
											/>
											<input
												type="number"
												name="price"
												bind:value={editData.price}
												class="input-bordered input w-full input-sm"
												aria-label="Precio"
											/>
											<div class="flex justify-end gap-1">
												<button
													type="submit"
													class="btn btn-circle btn-ghost btn-sm"
													aria-label="Guardar cambios"
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
												<button
													type="button"
													class="btn btn-circle btn-ghost btn-sm"
													onclick={() => (editingId = null)}>×</button
												>
											</div>
										</form>
									</td>
								{:else}
									<td class="font-medium">{s.name}</td>
									<td>Gs. {s.price}</td>
									<td class="text-right">
										<div class="flex justify-end gap-1">
											<button
												type="button"
												class="btn btn-circle btn-ghost btn-sm"
												onclick={() => startEdit(s)}
												aria-label="Editar servicio"
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
														d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
													/></svg
												></button
											>
											<form
												method="POST"
												action="?/eliminar"
												use:enhance
												onsubmit={(e) => !confirm('Eliminar servicio?') && e.preventDefault()}
											>
												<input type="hidden" name="id" value={s.id} />
												<button
													type="submit"
													class="btn btn-circle btn-ghost text-red-600 btn-sm"
													aria-label="Eliminar servicio"
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
										</div>
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
