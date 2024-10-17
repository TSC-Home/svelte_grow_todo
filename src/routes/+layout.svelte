<script>
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import '../app.css';
</script>

<LoadingIndicator />
<slot></slot>

<style>
	:root {
		background-color: #dcfce7;
	}
</style>
