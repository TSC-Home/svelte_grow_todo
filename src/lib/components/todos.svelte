<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fade, slide, fly, crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';

	export let tasks: any;
	let newTaskText = '';

	let filter: 'all' | 'tree' | 'week' | 'month' = 'tree';
	let selectedDate: string = new Date().toISOString().split('T')[0];
	let checkboxToggle: HTMLFormElement[] = [];
	let lockcheckbox = Array(tasks.length).fill(false);

	const [send, receive] = crossfade({
		duration: 400,
		easing: quintOut,
		fallback: (node, params) => slide(node, { duration: 400 })
	});

	function setUrlQuery(key: string, value: string | null) {
		const urlInstance = new URL($page.url);
		if (value) {
			urlInstance.searchParams.set(key, value);
		} else {
			urlInstance.searchParams.delete(key); // Entfernt den Parameter, wenn 'value' null ist
		}
		return urlInstance;
	}

	$: if (browser) {
		goto(setUrlQuery('filter', filter));
	}

	$: {
		const urlparams = new URLSearchParams($page.url.search);
		if (urlparams.has('date')) {
			const dateParam = urlparams.get('date');
			selectedDate = dateParam || new Date().toISOString().split('T')[0];
		}
	}

	// Funktion, um beim Klick die Task-ID in die URL als 'selected' zu setzen oder zu entfernen
	function handleTaskClick(taskId: string) {
		const urlparams = new URLSearchParams($page.url.search);
		const currentSelectedId = urlparams.get('selected');

		if (currentSelectedId === taskId) {
			// Wenn die Task-ID bereits ausgewählt ist, entferne den Parameter 'selected'
			goto(setUrlQuery('selected', null));
		} else {
			// Andernfalls füge die Task-ID als 'selected' hinzu
			goto(setUrlQuery('selected', taskId));
		}
	}

	async function handleDelete({ formElement }: { formElement: HTMLFormElement }) {
		const taskId = (formElement.querySelector('input[name="id"]') as HTMLInputElement)?.value;
		const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
		if (taskElement) {
			(taskElement as HTMLElement).style.height = `${(taskElement as HTMLElement).offsetHeight}px`;
			(taskElement as HTMLElement).style.overflow = 'hidden';
		}
		await new Promise((resolve) => setTimeout(resolve, 400)); // Warte auf die Transition
		if (taskElement) {
			(taskElement as HTMLElement).style.height = '0';
			(taskElement as HTMLElement).style.opacity = '0';
		}
	}
</script>

<div class="h-fit rounded-lg bg-white p-6 shadow-md" transition:fade|local={{ duration: 200 }}>
	<div class="flex items-center justify-between">
		<h2 class="mb-4 text-2xl font-semibold text-green-700">Tasks</h2>
		<div class="mb-4">
			<select class="rounded border p-1" bind:value={filter}>
				<option value="all">All Tasks</option>
				<option selected value="tree">Tree View (Selected Date)</option>
				<option value="week">This Week</option>
				<option value="month">This Month</option>
			</select>
		</div>
	</div>
	<form method="POST" action="?/addTask" use:enhance class="mb-4">
		<input name="date" type="hidden" value={selectedDate} />
		<input
			name="text"
			bind:value={newTaskText}
			placeholder="Add new task"
			class="w-full rounded-md border border-green-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
		/>
		<button
			type="submit"
			class="mt-2 w-full rounded-md bg-green-500 py-2 text-white transition-colors hover:bg-green-600"
		>
			Add
		</button>
	</form>
	<div class="h-full">
		<div class="mb-4" in:fade|local={{ duration: 150, delay: 50 }}>
			<h3 class="mb-2 text-lg font-semibold text-gray-700">
				{new Date(selectedDate).toLocaleDateString()}
			</h3>
			<ul class="space-y-2">
				{#each tasks as task, index (task.id)}
					<li
						class="flex w-full items-center justify-between rounded-md bg-green-50 p-3 transition-all duration-300"
						data-task-id={task.id}
						in:receive|local={{ key: task.id }}
						out:send|local={{ key: task.id }}
						animate:flip={{ duration: 300 }}
					>
						<form
							method="POST"
							action="?/toggleCheckBox"
							use:enhance={() => {
								lockcheckbox[index] = true;
								return async ({ update }) => {
									await update();
									lockcheckbox[index] = false;
								};
							}}
							bind:this={checkboxToggle[index]}
							class="flex items-center gap-x-2"
						>
							<input type="hidden" name="id" value={task.id} />
							<input
								type="checkbox"
								name="checked"
								class="form-checkbox h-5 w-5 text-green-600"
								checked={task.checked}
								disabled={lockcheckbox[index]}
								on:change={() => {
									checkboxToggle[index].requestSubmit();
								}}
							/>
							<span
								class="transition-all duration-200 {task.checked
									? 'text-green-800/60 line-through'
									: 'text-green-800'}"
							>
								{task.text}
							</span>
						</form>
						<div class="flex w-fit items-center gap-x-2">
							<span class="text-sm text-green-600">00:00:00</span>
							<form method="POST" action="?/toggleTimer" use:enhance>
								<input type="hidden" name="id" value={task.id} />
								<button
									type="submit"
									class="mr-2 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
								>
									{task.timer_running ? 'Stop' : 'Start'}
								</button>
							</form>
							<form method="POST" action="?/togglePin" use:enhance>
								<input type="hidden" name="id" value={task.id} />
								<button
									type="submit"
									class="icon {task.pinned
										? 'text-orange-600/60'
										: 'text-green-600/60'} transition-colors duration-200"
									title="Keep task"
								>
									{task.pinned ? 'keep_off' : 'keep'}
								</button>
							</form>
							<form method="POST" action="?/deleteTask" use:enhance={handleDelete}>
								<input type="hidden" name="id" value={task.id} />
								<button type="submit" class="icon text-red-600/80" title="Delete"> delete </button>
							</form>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
