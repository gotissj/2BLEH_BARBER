<script>
	import { resolve } from '$app/paths';

	let { children, user } = $props();
</script>

<nav class="navbar rounded-lg border-b border-base-300 bg-base-100">
	<div class="navbar-start">
		<a
			href={resolve('/')}
			class="btn btn-ghost flex h-auto flex-col items-center justify-center gap-0 px-2 py-1 leading-none"
			aria-label="2BLEH BARBER - Inicio"
		>
			<span
				class="text-[30px] leading-none tracking-tight sm:text-[34px]"
				style="font-family: 'Kaushan Script', cursive; font-weight: 400;"
				>2'BLEH</span
			>
			<span
				class="text-[9px] font-semibold tracking-[0.45em] opacity-80 sm:text-[10px]"
				style="font-family: 'Poppins', sans-serif;"
				>BARBER</span
			>
		</a>
	</div>
	<div class="navbar-center">
		<ul class="menu menu-horizontal hidden gap-1 px-1 sm:gap-2 md:flex">
			{#if !user || user.role !== 'barbero'}
				<li><a href={resolve('/reservar')} class="font-bold">Reservar</a></li>
			{/if}
			<li><a href={resolve('/contacto')} class="font-bold">Contacto</a></li>
			{#if user}
				<li>
					{#if user.role === 'admin'}
						<a href={resolve('/admin/barberos')} class="font-bold">Barberos</a>
					{:else if user.role === 'barbero'}
						<a href={resolve('/barbero/agenda')} class="font-bold">Agenda</a>
					{:else}
						<a href={resolve('/cliente')} class="font-bold">Mis reservas</a>
					{/if}
				</li>
			{/if}
		</ul>
	</div>
	<div class="navbar-end">
		<div class="dropdown dropdown-end md:hidden">
			<button tabindex="0" class="btn btn-ghost btn-sm" aria-label="Menú de navegación">
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
						d="M4 6h16M4 12h16M4 18h16"
					/></svg
				>
			</button>
			<ul
				class="menu dropdown-content mt-3 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
			>
				{#if !user || user.role !== 'barbero'}
					<li><a href={resolve('/reservar')}>Reservar</a></li>
				{/if}
				<li><a href={resolve('/contacto')}>Contacto</a></li>
				{#if user}
					{#if user.role === 'admin'}
						<li class="menu-title mt-2">Administración</li>
						<li><a href={resolve('/admin')}>Dashboard</a></li>
						<li><a href={resolve('/admin/barberos')}>Barberos</a></li>
						<li><a href={resolve('/admin/servicios')}>Servicios</a></li>
						<li><a href={resolve('/admin/turnos')}>Turnos</a></li>
						<li><a href={resolve('/admin/clientes')}>Clientes</a></li>
						<li><a href={resolve('/admin/bloqueos')}>Bloqueos</a></li>
						<li><a href={resolve('/admin/configuracion')}>Configuración</a></li>
					{:else if user.role === 'barbero'}
						<li>
							<a href={resolve('/barbero/agenda')}>Agenda</a>
						</li>
					{:else}
						<li>
							<a href={resolve('/cliente')}>Mis reservas</a>
						</li>
					{/if}
				{/if}
			</ul>
		</div>
		{#if user}
			<ul class="menu menu-horizontal gap-1 px-1 sm:gap-2">
				<li>
					<div class="dropdown dropdown-end">
						<button
							tabindex="0"
							class="btn avatar btn-circle btn-ghost"
							aria-label="Menú de usuario"
						>
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-neutral text-sm font-medium text-neutral-content"
							>
								{user.name.charAt(0).toUpperCase()}
							</div>
						</button>
						<ul
							class="menu-compact menu dropdown-content mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
						>
							<li><span class="text-sm text-base-content/60 justify-start">{user.email}</span></li>
							<li><span class="text-sm text-base-content/60 capitalize justify-start">{user.role}</span></li>
							{#if user.role === 'cliente'}
								<li>
									<a href={resolve('/cliente/perfil')} class="text-sm justify-start">Mi perfil</a>
								</li>
							{:else if user.role === 'barbero'}
								<li>
									<a href={resolve('/barbero/perfil')} class="text-sm justify-start">Mi perfil</a>
								</li>
							{/if}
							<li>
								<form method="POST" action={resolve('/logout')} class="contents">
									<button
										type="submit"
										class="flex w-full justify-start px-3 py-1.5 text-left text-sm text-red-600 cursor-pointer"
										>Cerrar sesion</button
									>
								</form>
							</li>
						</ul>
					</div>
				</li>
			</ul>
		{:else}
			<a href={resolve('/login')} class="btn btn-primary btn-sm">Iniciar sesión</a>
		{/if}
	</div>
</nav>

{@render children()}
