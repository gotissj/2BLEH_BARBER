<script>
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<div class="flex min-h-screen bg-base-200">
	<aside class="hidden min-h-screen w-64 border-r border-base-300 bg-base-100 lg:block">
		<div class="p-4">
			<h2 class="mb-4 text-lg font-bold">Administración</h2>
			<ul class="menu-compact menu">
				<li><a href={resolve('/admin')}>Dashboard</a></li>
				<li><a href={resolve('/admin/barberos')}>Barberos</a></li>
				<li><a href={resolve('/admin/servicios')}>Servicios</a></li>
				<li><a href={resolve('/admin/turnos')}>Turnos</a></li>
				<li><a href={resolve('/admin/clientes')}>Clientes</a></li>
				<li><a href={resolve('/admin/bloqueos')}>Bloqueos</a></li>
				<li><a href={resolve('/admin/configuracion')}>Configuración</a></li>
			</ul>
		</div>
	</aside>
	<div class="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-6 lg:p-8">
		{@render children()}
	</div>
</div>
