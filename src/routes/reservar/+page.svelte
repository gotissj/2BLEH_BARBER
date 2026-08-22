<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DateInput from '$lib/components/DateInput.svelte';

	let { data, form } = $props();

	let barberId = $state('');
	let date = $state('');
	let time = $state('');
	let slots = $state(/** @type {string[]} */ ([]));
	let taken = $state(/** @type {string[]} */ ([]));
	let loadingSlots = $state(false);

	const today = new Date().toISOString().slice(0, 10);

	async function loadSlots() {
		if (!barberId || !date) {
			slots = [];
			taken = [];
			return;
		}
		loadingSlots = true;
		try {
			const res = await fetch(`/api/agenda?barbero=${encodeURIComponent(barberId)}&fecha=${date}`);
			const result = await res.json();
			slots = result.slots;
			taken = result.taken ?? [];
			if (time && !slots.includes(time)) time = '';
		} finally {
			loadingSlots = false;
		}
	}

	$effect(() => {
		loadSlots();
	});

	$effect(() => {
		if (form?.ok && form.id) {
			goto(resolve(`/reservas/${form.id}`));
		}
	});
</script>

<div class="card-mobile">
	<div class="card-body p-6 sm:p-8">
		<h1 class="text-center text-2xl font-bold">Reservar turno</h1>
		<p class="mt-2 text-center text-sm text-base-content/60">
			Elegí barbero, servicio, día y hora.
		</p>

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

		{#if data.barbers.length === 0}
			<div class="mt-4 alert alert-info">No hay barberos registrados todavía.</div>
		{/if}

		<form method="POST" use:enhance class="mt-6 space-y-5">
			<div class="form-control">
				<label class="label">
					<span class="label-text">Barbero</span>
				</label>
				<select name="barbero" bind:value={barberId} class="select-bordered select w-full">
					<option value="" disabled selected>Elegí un barbero</option>
					{#each data.barbers as b (b.id)}
						<option value={b.id}>{b.name}</option>
					{/each}
				</select>
			</div>

			<div class="form-control">
				<label class="label">
					<span class="label-text">Servicio</span>
				</label>
				<select name="servicio" class="select-bordered select w-full">
					<option value="" disabled selected>Elegí un servicio</option>
					{#each data.services as s (s.id)}
						<option value={s.name}>{s.name} · Gs. {s.price}</option>
					{/each}
				</select>
			</div>

			<div class="form-control">
				<label class="label">
					<span class="label-text">Día</span>
				</label>
				<DateInput name="fecha" min={today} bind:value={date} />
			</div>

			<div class="form-control">
				<label class="label">
					<span class="label-text">Hora</span>
				</label>
				<select
					name="hora"
					bind:value={time}
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
				class="btn mt-2 w-full btn-primary"
				disabled={data.barbers.length === 0}
			>
				Reservar turno
			</button>
		</form>
	</div>
</div>
