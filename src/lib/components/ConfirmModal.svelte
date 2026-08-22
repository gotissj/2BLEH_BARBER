<script>
	let { open = false, message, onConfirm, onCancel } = $props();
</script>

{#if open}
	<div class="modal modal-open" role="presentation" onclick={(event) => event.target === event.currentTarget && onCancel()}>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Confirmar acción</h3>
			<p class="py-4 text-base-content/70">{message}</p>
			<div class="modal-action">
				<button type="button" class="btn btn-ghost" onclick={onCancel}>Cancelar</button>
				<button type="button" class="btn btn-primary" onclick={onConfirm}>Confirmar</button>
			</div>
		</div>
	</div>
{/if}