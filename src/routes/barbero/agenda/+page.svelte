<script>
	import AgendaDay from '$lib/components/AgendaDay.svelte';

	let { data } = $props();
</script>

<AgendaDay date={data.date} bookings={data.bookings} blocks={data.blocks} />
