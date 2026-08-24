<script>
	import { enhance } from '$app/forms';
	import { formatDate, statusLabels } from '$lib/format';
	import DateInput from '$lib/components/DateInput.svelte';

	let { data, form } = $props();
	let b = $derived(data.booking);
	let barbers = $derived(data.barbers);
	let services = $derived(data.services);

	const statusBadge = (/** @type {string} */ status) => {
		const base = 'badge badge-sm';
		if (status === 'pendiente') return `${base} badge-warning`;
		if (status === 'confirmada') return `${base} badge-success`;
		if (status === 'realizado') return `${base} badge-neutral`;
		if (status === 'ausente') return `${base} badge-error`;
		return `${base} badge-error`;
	};

	let showReagendar = $state(false);
	let reagendarData = $state({ barbero: '', servicio: '', fecha: '', hora: '' });
	let slots = $state(/** @type {string[]} */ ([]));
	let taken = $state(/** @type {string[]} */ ([]));
	let loadingSlots = $state(false);

	$effect(() => {
		if (b) {
			reagendarData = { barbero: b.barberId, servicio: b.service, fecha: b.date, hora: b.time };
		}
	});

	async function loadSlots() {
		if (!reagendarData.barbero || !reagendarData.fecha) {
			slots = [];
			taken = [];
			return;
		}
		loadingSlots = true;
		try {
			const res = await fetch(
				`/api/agenda?barbero=${encodeURIComponent(reagendarData.barbero)}&fecha=${reagendarData.fecha}`
			);
			const result = await res.json();
			slots = result.slots;
			taken = (result.taken ?? []).filter((/** @type {string} */ t) => t !== b.time);
			if (reagendarData.hora && !slots.includes(reagendarData.hora)) reagendarData.hora = '';
		} finally {
			loadingSlots = false;
		}
	}

	$effect(() => {
		if (showReagendar) loadSlots();
	});
</script>

<div class="card-mobile">
	<div class="card-body p-6 sm:p-8">
		<h1 class="text-center text-2xl font-bold">Tu reserva</h1>

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
				>
				<span>{form.error}</span>
			</div>
		{/if}

		<div class="card mt-4 bg-base-200">
			<div class="card-body">
				<div class="grid gap-3">
					<div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-0">
						<span class="text-sm text-base-content/60">Servicio</span>
						<span class="text-sm font-medium sm:text-base">{b.service}</span>
					</div>
					<div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-0">
						<span class="text-sm text-base-content/60">Barbero</span>
						<span class="text-sm font-medium sm:text-base">{b.barberName}</span>
					</div>
					<div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-0">
						<span class="text-sm text-base-content/60">Día</span>
						<span class="text-sm font-medium sm:text-base">{formatDate(b.date)}</span>
					</div>
					<div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-0">
						<span class="text-sm text-base-content/60">Hora</span>
						<span class="text-sm font-medium sm:text-base">{b.time}</span>
					</div>
					<div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-0">
						<span class="text-sm text-base-content/60">Estado</span>
						<span class={statusBadge(b.status)}>{statusLabels[b.status]}</span>
					</div>
					{#if data.user?.role === 'barbero'}
						<div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-0">
							<span class="text-sm text-base-content/60">Cliente</span>
							<span class="text-sm font-medium sm:text-base">{b.clientName}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		{#if (data.user?.id === b.clientId || data.user?.id === b.barberId) && (b.status === 'pendiente' || b.status === 'confirmada')}
			<div class="mt-4 space-y-3">
				<form
					method="POST"
					action="?/cancelar"
					use:enhance
					onsubmit={(e) => !confirm('¿Cancelar este turno?') && e.preventDefault()}
				>
					<button type="submit" class="btn w-full btn-error">Cancelar turno</button>
				</form>
				<button
					type="button"
					class="btn w-full btn-outline"
					onclick={() => (showReagendar = !showReagendar)}
				>
					{showReagendar ? 'Ocultar' : 'Reagendar'} turno
				</button>
			</div>
		{/if}

		{#if showReagendar && (data.user?.id === b.clientId || data.user?.id === b.barberId) && (b.status === 'pendiente' || b.status === 'confirmada')}
			<div class="card mt-4 border border-primary/30 bg-primary/10">
				<div class="card-body">
					<h3 class="card-title">Reagendar turno</h3>
					<form
						method="POST"
						action="?/reagendar"
						use:enhance
						class="mt-4 space-y-4"
						onsubmit={(e) => !confirm('¿Confirmar nuevo turno?') && e.preventDefault()}
					>
						<div class="form-control">
							<label class="label"><span class="label-text">Barbero</span></label>
							<select
								name="barbero"
								bind:value={reagendarData.barbero}
								class="select-bordered select w-full"
								onchange={() => loadSlots()}
							>
								<option value="" disabled>Elegí un barbero</option>
								{#each barbers as barber (barber.id)}
									<option value={barber.id}>{barber.name}</option>
								{/each}
							</select>
						</div>
						<div class="form-control">
							<label class="label"><span class="label-text">Servicio</span></label>
							<select
								name="servicio"
								bind:value={reagendarData.servicio}
								class="select-bordered select w-full"
							>
								<option value="" disabled>Elegí un servicio</option>
								{#each services as s (s.id)}
									<option value={s.name}>{s.name} · Gs. {s.price}</option>
								{/each}
							</select>
						</div>
						<div class="form-control">
							<label class="label"><span class="label-text">Día</span></label>
							<DateInput
								name="fecha"
								min={new Date().toISOString().slice(0, 10)}
								bind:value={reagendarData.fecha}
								onchange={() => loadSlots()}
							/>
						</div>
						<div class="form-control">
							<label class="label"><span class="label-text">Hora</span></label>
							<select
								name="hora"
								bind:value={reagendarData.hora}
								disabled={(!slots.length && !taken.length) || loadingSlots}
								class="select-bordered select w-full"
							>
								<option value="" disabled selected>
									{#if loadingSlots}
										Cargando horarios…
									{:else if slots.length || taken.length}
										Elegí un horario
									{:else}
										Elegí barbero y día
									{/if}
								</option>
								{#each slots as s (s)}
									<option value={s}>{s}</option>
								{/each}
								{#each taken as t (t)}
									<option value={t} disabled>Ocupado · {t}</option>
								{/each}
							</select>
						</div>
						<button
							type="submit"
							class="btn w-full btn-primary"
							disabled={!slots.length || loadingSlots}
						>
							Confirmar reagendamiento
						</button>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>
