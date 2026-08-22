<script>
	import { resolve } from '$app/paths';
	let { children } = $props();
</script>

<div class="space-y-4">
	<div class="max-w-2xl mx-auto w-full">
		{@render children()}
	</div>
</div>
