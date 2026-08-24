<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const user = $derived(data.user);
	let showDeleteModal = $state(false);
</script>

<div class="space-y-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold sm:text-3xl">Mi perfil</h1>
		<p class="mt-1 text-sm text-base-content/60 sm:text-base">Gestioná tu información personal.</p>
	</div>

	<div class="card rounded-lg bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title">Datos personales</h2>
			{#if form?.success}<div class="mb-4 alert alert-success">Guardado correctamente</div>{/if}
			{#if form?.error}<div class="mb-4 alert alert-error" role="alert">{form.error}</div>{/if}
			<form method="POST" action="?/actualizar" use:enhance class="mt-4 grid gap-4 sm:grid-cols-2">
				<div class="form-control">
					<label class="label" for="profile-name"><span class="label-text">Nombre</span></label>
					<input id="profile-name" type="text" name="name" value={user?.name ?? ''} required class="input-bordered input w-full" />
				</div>
				<div class="form-control">
					<label class="label" for="profile-email"><span class="label-text">Email</span></label>
					<input id="profile-email" type="email" value={user?.email ?? ''} disabled class="input-bordered input w-full bg-base-200" />
				</div>
				<div class="form-control">
					<label class="label" for="profile-phone"><span class="label-text">Teléfono</span></label>
					<input
						id="profile-phone"
						type="tel"
						name="phone"
						value={user?.phone ?? ''}
						required
						class="input-bordered input w-full"
						placeholder="0986744257"
					/>
				</div>
				<div class="form-control">
					<label class="label" for="profile-avatar"><span class="label-text">Avatar (URL)</span></label>
					<input id="profile-avatar" type="url" name="avatar" value={user?.avatar ?? ''} class="input-bordered input w-full" />
				</div>
				<label class="label cursor-pointer justify-start gap-3 sm:col-span-2">
					<input type="checkbox" name="notifications" class="checkbox checkbox-primary" checked={user?.notifications} />
					<span class="label-text">Recibir notificaciones</span>
				</label>
				<button type="submit" class="btn self-start btn-primary sm:col-span-2">Guardar cambios</button>
			</form>
		</div>
	</div>

	<div class="card rounded-lg bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title">Cambiar contraseña</h2>
			<form method="POST" action="?/cambiarPassword" use:enhance class="mt-4 grid gap-4">
				<div class="form-control">
					<label class="label" for="current-password"><span class="label-text">Contraseña actual</span></label>
					<input id="current-password" type="password" name="current" required class="input-bordered input w-full" />
				</div>
				<div class="form-control">
					<label class="label" for="new-password"><span class="label-text">Nueva contraseña</span></label>
					<input id="new-password" type="password" name="nuevo" required minlength="6" class="input-bordered input w-full" />
				</div>
				<div class="form-control">
					<label class="label" for="confirm-password"><span class="label-text">Confirmar nueva</span></label>
					<input id="confirm-password" type="password" name="confirmar" required minlength="6" class="input-bordered input w-full" />
				</div>
				<button type="submit" class="btn self-start btn-primary">Cambiar contraseña</button>
			</form>
		</div>
	</div>

	<div class="card rounded-lg border border-error/30 bg-base-100 shadow-sm">
		<div class="card-body p-4 sm:p-6">
			<h2 class="card-title text-error">Zona de peligro</h2>
			<p class="text-sm text-base-content/60">
				Borrar tu cuenta eliminará permanentemente tu perfil, tus reservas y, si sos barbero, tus bloqueos de
				agenda. Esta acción no se puede deshacer.
			</p>
			{#if form?.error && String(form.error).toLowerCase().includes('contraseña actual')}
				<div class="alert alert-error mt-3 py-2 text-sm">{form.error}</div>
			{/if}
			<button type="button" class="btn self-start btn-error mt-3" onclick={() => (showDeleteModal = true)}>
				Borrar mi cuenta
			</button>
		</div>
	</div>
</div>

{#if showDeleteModal}
	<div
		class="modal modal-open"
		role="presentation"
		onclick={(e) => e.target === e.currentTarget && (showDeleteModal = false)}
	>
		<div class="modal-box border border-error/20">
			<h3 class="text-lg font-bold text-error">¿Borrar cuenta permanentemente?</h3>
			<p class="py-3 text-sm text-base-content/70">
				Esta acción es irreversible. Se cerrará tu sesión y se eliminarán todos tus datos asociados.
				Ingresá tu contraseña para confirmar.
			</p>
			<form
				method="POST"
				action="?/borrarCuenta"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'redirect') {
							showDeleteModal = false;
							await update();
						} else if (result.type === 'failure') {
							await update();
						} else {
							showDeleteModal = false;
							await update();
						}
					};
				}}
				class="space-y-4"
			>
				<input
					type="password"
					name="password"
					required
					placeholder="Tu contraseña actual"
					class="input-bordered input w-full"
					autocomplete="current-password"
				/>
				{#if form?.error && !String(form.error).toLowerCase().includes('contraseña actual')}
					<div class="alert alert-error py-2 text-sm">{form.error}</div>
				{/if}
				<div class="modal-action">
					<button type="button" class="btn btn-ghost" onclick={() => (showDeleteModal = false)}
						>Cancelar</button
					>
					<button type="submit" class="btn btn-error">Sí, borrar mi cuenta</button>
				</div>
			</form>
		</div>
	</div>
{/if}