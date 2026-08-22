<script>
	/** @type {{ value: string; name?: string; min?: string; onchange?: (e: Event) => void }} */
	let { value = $bindable(''), name, min, onchange } = $props();

	let input = $state(/** @type {HTMLInputElement | null} */ (null));

	function openPicker() {
		if (input && typeof input.showPicker === 'function') {
			try {
				input.showPicker();
			} catch (_err) {
				// showPicker requiere un gesto del usuario; si falla, el click nativo lo maneja
				input?.focus();
			}
		}
	}
</script>

<div class="flex gap-2">
	<input
		bind:this={input}
		bind:value
		type="date"
		{name}
		{min}
		class="input-bordered input min-w-0 flex-1"
		onclick={openPicker}
		{onchange}
	/>
	<button
		type="button"
		class="btn btn-neutral btn-square"
		aria-label="Abrir calendario"
		title="Abrir calendario"
		onclick={openPicker}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
			/></svg
		>
	</button>
</div>