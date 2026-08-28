<script>
	import './layout.css';
	import favicon from '$lib/assets/2bleh-logo.png';
	import Navbar from '$lib/components/Navbar.svelte';
	import { onNavigate } from '$app/navigation';

	let { data, children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	/** @param {KeyboardEvent} e */
	function handleKeydown(e) {
		if (e.key !== 'Enter') return;
		const target = /** @type {EventTarget & HTMLElement} */ (e.target);
		if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) return;
		if (target.type === 'checkbox' || target.type === 'radio') return;
		const form = target.form;
		if (form) {
			e.preventDefault();
			form.requestSubmit();
		}
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="page-wrapper" onkeydown={handleKeydown}>
	<Navbar user={data.user}>
		<main class="container-mobile spacing-responsive">
			{@render children()}
		</main>
	</Navbar>
</div>
