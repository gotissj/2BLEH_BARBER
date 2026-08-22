<script>
	import { resolve } from '$app/paths';
	let { children } = $props();
</script>

<div class="space-y-4">
	<nav class="border-b border-base-300 bg-base-100 p-4">
		<ul class="menu menu-horizontal flex-wrap gap-2">
			<li><a href={resolve('/barbero/agenda')}>Agenda</a></li>
		</ul>
	</nav>
	{@render children()}
</div>
