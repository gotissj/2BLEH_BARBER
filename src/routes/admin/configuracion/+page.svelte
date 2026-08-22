<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const config = $derived(data.config);
</script>

<div class="space-y-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold sm:text-3xl">Configuración del negocio</h1>
		<p class="mt-1 text-sm text-base-content/60 sm:text-base">Ajustá los parámetros del local.</p>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			{#if form?.success}
				<div class="mb-4 alert alert-success">Guardado correctamente</div>
			{/if}
			<form method="POST" action="?/guardar" use:enhance class="grid gap-4 sm:grid-cols-2">
				<div class="form-control">
					<label class="label"><span class="label-text">Nombre del local</span></label>
					<input
						type="text"
						name="name"
						value={config.name ?? ''}
						class="input-bordered input w-full"
					/>
				</div>
				<div class="form-control">
					<label class="label"><span class="label-text">Hora de apertura (0-23)</span></label>
					<input
						type="number"
						name="openHour"
						value={config.openHour ?? '9'}
						min="0"
						max="23"
						class="input-bordered input w-full"
					/>
				</div>
				<div class="form-control">
					<label class="label"><span class="label-text">Hora de cierre (0-23)</span></label>
					<input
						type="number"
						name="closeHour"
						value={config.closeHour ?? '19'}
						min="0"
						max="23"
						class="input-bordered input w-full"
					/>
				</div>
				<div class="form-control">
					<label class="label"><span class="label-text">Duración de slot (minutos)</span></label>
					<input
						type="number"
						name="slotMinutes"
						value={config.slotMinutes ?? '60'}
						min="10"
						max="120"
						class="input-bordered input w-full"
					/>
				</div>
				<div class="form-control">
					<label class="label"><span class="label-text">Zona horaria</span></label>
					<input
						type="text"
						name="timezone"
						value={config.timezone ?? 'America/Asuncion'}
						class="input-bordered input w-full"
					/>
				</div>
				<button type="submit" class="btn w-full self-start btn-primary sm:col-span-2 sm:w-auto"
					>Guardar configuración</button
				>
			</form>
		</div>
	</div>
</div>
