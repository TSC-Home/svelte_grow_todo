<script lang="ts">
	import Calendar from '$lib/components/calendar.svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import Plant from '$lib/components/plant.svelte';
	import Todos from '$lib/components/todos.svelte';
	import TaskEditor from '$lib/components/taskEditor.svelte';
	export let data;

	let selectedPlant: string = 'tree';
	let selectedTaskbyId: any;

	$: if (data.selectedTask) {
		selectedTaskbyId = data.tasks.find((task) => task.id === data.selectedTask);
	}
</script>

<div class="h-screen w-full">
	<div class="flex flex-col px-4 py-4">
		<div>
			<Navbar />
		</div>
		<div class="mt-8 flex justify-center">
			<div class="w-full 2xl:w-1/2">
				<div class="flex flex-col items-center justify-between lg:flex-row">
					<div class="w-full lg:w-1/2">
						<div class="hidden md:block">
							<Calendar mobile={true} />
						</div>
						<div class="block md:hidden">
							<Calendar mobile={false} />
						</div>
					</div>
					<div class="mb-4 w-fit">
						{#if selectedTaskbyId}
							<TaskEditor bind:task={selectedTaskbyId} />
						{:else}
							<Plant {selectedPlant} bind:plantGrowth={data.completedTasksInProzent} />
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="flex w-full justify-center">
			<div class="w-full 2xl:w-1/2">
				<div class="lg:w-1/2">
					<Todos bind:tasks={data.tasks} />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:root {
		background-color: #dcfce7;
	}
</style>
