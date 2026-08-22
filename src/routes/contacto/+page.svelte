<script>
	import { resolve } from '$app/paths';
</script>

<div class="space-y-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold sm:text-3xl">Contacto</h1>
		<p class="mt-1 text-sm text-base-content/60 sm:text-base">Escribinos, seguinos o visitanos.</p>
	</div>

	<div class="mx-auto grid w-full max-w-lg gap-6">
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-4 sm:p-6">
				<h2 class="card-title">Contáctanos</h2>
				<p class="text-sm text-base-content/70">Escribinos o seguinos en redes.</p>
				<div class="mt-3 flex flex-col gap-3">
					<a
						href="https://wa.me/"
						target="_blank"
						rel="noopener noreferrer"
						class="btn w-full btn-lg btn-outline btn-success"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="currentColor"
							viewBox="0 0 24 24"
						><path
								d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
							/></svg
						>
						WhatsApp
					</a>
					<a
						href="https://instagram.com/"
						target="_blank"
						rel="noopener noreferrer"
						class="btn w-full btn-lg btn-outline"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 8a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4V8zM12 15a3 3 0 100-6 3 3 0 000 6zM16.5 7.5h.01"
							/></svg
						>
						Instagram
					</a>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-4 sm:p-6">
				<h2 class="card-title">Nuestra ubicación</h2>
				<p class="text-sm text-base-content/70">Visitános en el local.</p>
				<div class="mt-3 flex flex-col gap-3">
					<a
						href="https://maps.app.goo.gl/ZVXnwirqjsnWH9Th6"
						target="_blank"
						rel="noopener noreferrer"
						class="btn w-full btn-lg btn-outline"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/></svg
						>
						Cómo llegar
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="text-center">
		<a href={resolve('/')} class="btn btn-ghost">← Volver al inicio</a>
	</div>
</div>