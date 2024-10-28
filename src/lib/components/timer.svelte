<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { calculateCountdown } from '$lib/utils';
	import { enhance } from '$app/forms';
	export let task;
	console.log(task);
	let started: boolean;
	let formattedTime: string;

	onMount(() => {
		let totaltime = task.timer_total;
		let interval: ReturnType<typeof setInterval>;
		if (started) {
			interval = setInterval(() => {
				formattedTime = calculateCountdown(totaltime).toString();
				totaltime++;
			}, 1000);
		}
		return () => {
			clearInterval(interval);
		};
	});
</script>

<span class="text-sm text-green-600">
	{#key task.timer_started}
		{#if started}
			{formattedTime}
		{:else}
			{calculateCountdown(task.timer_total).toString()}
		{/if}
	{/key}
</span>
<form method="POST" action="?/toggleTimer" use:enhance>
	<input type="hidden" name="id" value={task.id} />
	<input type="hidden" name="started" value={task.timer_started} />
	<input type="hidden" name="timer_started_at" value={task.timer_total} />
	<button
		type="submit"
		class="mr-2 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
	>
		{task.timer_started ? 'Stop' : 'Start'}
	</button>
</form>
