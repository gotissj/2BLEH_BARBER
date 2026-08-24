<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let editingId = $state(/** @type {string | null} */ (null));
	let editData = $state({ name: '', email: '', phone: '', password: '' });

	/** @param {{ id: string; name: string; email: string; phone: string }} b */
	function startEdit(b) {
		editData = { name: b.name, email: b.email, phone: b.phone, password: '' };
		editingId = b.id;
	}
</script>

<div class="space-y-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold sm:text-3xl">Barberos</h1>
		<p class="mt-1 text-sm text-base-content/60 sm:text-base">Gestioná los barberos del local.</p>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title">Crear barbero</h2>
			{#if form?.error}
				<div class="mt-4 alert alert-error" role="alert">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 shrink-0 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2"
						/>
					</svg>
					<span>{form.error}</span>
				</div>
			{/if}
			<form method="POST" action="?/crear" use:enhance class="mt-4 grid gap-4 sm:grid-cols-2">
				<div class="form-control">
					<label class="label">
						<span class="label-text">Nombre</span>
					</label>
					<input
						type="text"
						name="name"
						value={form?.name ?? ''}
						required
						class="input-bordered input w-full"
						placeholder="Nombre completo"
					/>
				</div>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Email</span>
					</label>
					<input
						type="email"
						name="email"
						value={form?.email ?? ''}
						required
						class="input-bordered input w-full"
						placeholder="barbero@email.com"
					/>
				</div>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Teléfono</span>
					</label>
					<input
						type="tel"
						name="phone"
						value={form?.phone ?? ''}
						required
						class="input-bordered input w-full"
						placeholder="0986744257"
					/>
				</div>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Contraseña</span>
					</label>
					<input
						type="password"
						name="password"
						required
						minlength="6"
						class="input-bordered input w-full"
						placeholder="Mínimo 6 caracteres"
					/>
				</div>
				<button type="submit" class="btn mt-2 self-start btn-primary sm:col-span-2"
					>Crear barbero</button
				>
			</form>
		</div>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title">Barberos registrados</h2>
			{#if data.barbers.length === 0}
				<div class="py-8 text-center">
					<svg
						class="mx-auto h-12 w-12 text-base-content/30"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
						/>
					</svg>
					<p class="mt-2 text-base-content/60">No hay barberos registrados.</p>
				</div>
			{/if}
			<div class="mt-4 overflow-x-auto">
				<table class="table-responsive table">
					<thead>
						<tr>
							<th>Nombre</th>
							<th class="hidden md:table-cell">Email</th>
							<th class="hidden lg:table-cell">Teléfono</th>
							<th class="w-16 text-right">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{#each data.barbers as b (b.id)}
							<tr class="hover:bg-base-200">
								{#if editingId === b.id}
									<td colspan="4">
										<form
											method="POST"
											action="?/actualizar"
											use:enhance
											class="grid items-center gap-3 sm:grid-cols-5"
										>
											<input type="hidden" name="id" value={b.id} />
											<input
												type="text"
												name="name"
												bind:value={editData.name}
												class="input-bordered input w-full input-sm"
												aria-label="Nombre"
											/>
											<input
												type="email"
												name="email"
												bind:value={editData.email}
												class="input-bordered input w-full input-sm"
												aria-label="Email"
											/>
											<input
												type="tel"
												name="phone"
												bind:value={editData.phone}
												class="input-bordered input w-full input-sm"
												aria-label="Teléfono"
											/>
											<input
												type="password"
												name="password"
												bind:value={editData.password}
												placeholder="Nueva contraseña (opcional)"
												class="input-bordered input w-full input-sm"
												aria-label="Nueva contraseña"
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
									<td class="font-medium">{b.name}</td>
									<td class="hidden md:table-cell">{b.email}</td>
									<td class="hidden lg:table-cell">{b.phone}</td>
									<td class="text-right">
										<div class="flex justify-end gap-1">
											<button
												type="button"
												class="btn btn-circle btn-ghost btn-sm"
												onclick={() => startEdit(b)}
												aria-label={`Editar a ${b.name}`}
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
												onsubmit={(e) =>
													!confirm('Eliminar barbero y sus turnos?') && e.preventDefault()}
											>
												<input type="hidden" name="id" value={b.id} />
												<button
													type="submit"
													class="btn btn-circle btn-ghost text-red-600 btn-sm"
													aria-label={`Eliminar a ${b.name}`}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-4 w-4"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v12m-6 0h14m-6 0v-8m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h10"
														/>
													</svg>
												</button>
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
