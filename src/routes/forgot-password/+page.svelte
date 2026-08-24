<script>
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<div class="card-mobile">
	<div class="card-body p-6 sm:p-8">
		<h1 class="text-center text-2xl font-bold">Recuperar contraseña</h1>
		<p class="mt-2 text-center text-sm text-base-content/60">
			Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
		</p>

		{#if form?.success}
			<div class="alert alert-success mt-6" role="alert">
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
				<span
					>Si el correo existe, te enviamos un email con instrucciones. Revisá tu bandeja (y spam).
					El enlace expira en 1 hora.</span
				>
			</div>
			<div class="mt-6 text-center">
				<a href={resolve('/login')} class="link link-primary text-sm">Volver a ingresar</a>
			</div>
		{:else}
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
							d="M10 14l2-2m0 0l2-2m-2 2l-2 2m-2-2l2-2m2 2l2 2"
						/></svg
					>
					<span>{form.error}</span>
				</div>
			{/if}

			<form method="POST" use:enhance class="mt-6 space-y-4">
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
						autocomplete="email"
					/>
				</div>

				<button type="submit" class="btn mt-2 w-full btn-primary">Enviar enlace</button>
			</form>

			<p class="mt-6 text-center text-sm text-base-content/60">
				¿Recordaste tu contraseña?
				<a href={resolve('/login')} class="link link-primary">Ingresá</a>
			</p>
		{/if}
	</div>
</div>
