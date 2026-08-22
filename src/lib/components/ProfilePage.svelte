<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const user = $derived(data.user);
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
					<input id="profile-phone" type="tel" name="phone" value={user?.phone ?? ''} required class="input-bordered input w-full" />
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
</div>