<script>
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<div class="card-mobile">
	<div class="card-body p-6 sm:p-8">
		<h1 class="text-center text-2xl font-bold">Restablecer contraseña</h1>

		{#if !data.valid}
			<div class="alert alert-error mt-6" role="alert">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 shrink-0 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
					/></svg
				>
				<span>{data.error}</span>
			</div>
			<div class="mt-6 flex flex-col gap-3">
				<a href={resolve('/forgot-password')} class="btn w-full btn-primary">Solicitar nuevo enlace</a>
				<a href={resolve('/login')} class="btn w-full btn-ghost">Volver a ingresar</a>
			</div>
		{:else}
			<p class="mt-2 text-center text-sm text-base-content/60">
				Para: <span class="font-medium text-base-content">{data.email}</span><br />
				Ingresá tu nueva contraseña (mín. 6 caracteres).
			</p>

			{#if form?.error}
				<div class="alert alert-error mt-4" role="alert">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 shrink-0 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l2 2m-2-2l2-2m2 2l2 2"
						/></svg
					>
					<span>{form.error}</span>
				</div>
			{/if}

			<form method="POST" use:enhance class="mt-6 space-y-4">
				<input type="hidden" name="token" value={form?.token ?? data.token} />

				<div class="form-control">
					<label class="label">
						<span class="label-text">Nueva contraseña</span>
					</label>
					<input
						type="password"
						name="password"
						required
						minlength="6"
						class="input-bordered input w-full"
						placeholder="••••••••"
						autocomplete="new-password"
					/>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Confirmar contraseña</span>
					</label>
					<input
						type="password"
						name="confirmPassword"
						required
						minlength="6"
						class="input-bordered input w-full"
						placeholder="••••••••"
						autocomplete="new-password"
					/>
				</div>

				<button type="submit" class="btn mt-2 w-full btn-primary">Guardar nueva contraseña</button>
			</form>

			<p class="mt-6 text-center text-xs text-base-content/50">
				El enlace expira en 1 hora y solo puede usarse una vez.
			</p>
		{/if}
	</div>
</div>
