<script>
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="card-mobile">
	<div class="card-body p-6 sm:p-8">
		<h1 class="text-center text-2xl font-bold">Crear cuenta</h1>
		<p class="mt-2 text-center text-sm text-base-content/60">Registrate para reservar turnos.</p>

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

		<form method="POST" use:enhance class="mt-6 space-y-4">
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
					placeholder="Tu nombre"
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
					placeholder="tu@email.com"
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
					placeholder="0985123498"
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
			<button type="submit" class="btn mt-2 w-full btn-primary">Crear cuenta</button>
		</form>

		<p class="mt-6 text-center text-sm text-base-content/60">
			¿Ya tenés cuenta?
			<a href={resolve('/login')} class="link link-primary">Ingresá</a>
		</p>
	</div>
</div>
