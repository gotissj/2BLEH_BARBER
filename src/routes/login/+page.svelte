<script>
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const panel = $derived(data.panel);
</script>

<div class="card-mobile">
	<div class="card-body p-6 sm:p-8">
		<h1 class="text-center text-2xl font-bold">
			{#if panel}
				Ingresar al panel
			{:else}
				Ingresar
			{/if}
		</h1>
		<p class="mt-2 text-center text-sm text-base-content/60">
			{#if panel}
				Acceso exclusivo para barberos.
			{:else}
				Accedé como barbero o cliente.
			{/if}
		</p>

		{#if data.resetSuccess}
			<div class="alert alert-success mt-4" role="alert">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 shrink-0 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>Contraseña restablecida. Ya podés ingresar.</span>
			</div>
		{/if}

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
						d="M10 14l2-2m0 0l2-2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l2 2"
					/>
				</svg>
				<span>{form.error}</span>
			</div>
		{/if}

		<form method="POST" use:enhance class="mt-6 space-y-4">
			{#if panel}
				<input type="hidden" name="panel" value="1" />
			{/if}
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
					placeholder="tu@email.com"
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
					class="input-bordered input w-full"
					placeholder="••••••••"
				/>
				<div class="mt-1 text-right">
					<a href={resolve('/forgot-password')} class="link link-primary text-xs"
						>¿Olvidaste tu contraseña?</a
					>
				</div>
			</div>
			<button type="submit" class="btn mt-2 w-full btn-primary">Ingresar</button>
		</form>

		<p class="mt-6 text-center text-sm text-base-content/60">
			¿No tenés cuenta?
			<a href={resolve('/registro')} class="link link-primary">Creá una</a>
		</p>
	</div>
</div>
