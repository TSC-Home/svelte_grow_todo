<script lang="ts">
	import { onDestroy } from 'svelte';

	export let todos: {
		id: number;
		text: string;
		completed: boolean;
		date: string;
		timeSpent: number;
	}[];
	export let addTodo: (text: string) => void;
	export let toggleTodo: (id: number) => void;
	export let deleteTodo: (id: number) => void;
	export let updateTodoTime: (id: number, time: number) => void;
	export let selectedDate: string;

	let newTodoText = '';
	let timers: { [key: number]: { interval: number; startTime: number } } = {};

	function handleSubmit() {
		if (newTodoText.trim()) {
			addTodo(newTodoText.trim());
			newTodoText = '';
		}
	}

	function startTimer(id: number) {
		if (timers[id]) {
			stopTimer(id);
		} else {
			timers[id] = {
				interval: setInterval(() => {
					const elapsedTime = Math.floor((Date.now() - timers[id].startTime) / 1000);
					updateTodoTime(id, elapsedTime);
				}, 1000),
				startTime: Date.now()
			};
		}
	}

	function stopTimer(id: number) {
		if (timers[id]) {
			clearInterval(timers[id].interval);
			delete timers[id];
		}
	}

	onDestroy(() => {
		Object.keys(timers).forEach((id) => clearInterval(timers[Number(id)].interval));
	});

	$: filteredTodos = todos.filter((todo) => todo.date === selectedDate);

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}
</script>

<div class="rounded-lg bg-white p-6 shadow-md">
	<h2 class="mb-4 text-2xl font-semibold text-green-700">Tasks for {selectedDate}</h2>
	<form on:submit|preventDefault={handleSubmit} class="mb-4">
		<input
			bind:value={newTodoText}
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
	<ul class="space-y-2">
		{#each filteredTodos as todo (todo.id)}
			<li class="flex items-center justify-between rounded-md bg-green-50 p-3">
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={todo.completed}
						on:change={() => toggleTodo(todo.id)}
						class="form-checkbox h-5 w-5 text-green-600"
					/>
					<span class={todo.completed ? 'text-green-500 line-through' : 'text-green-800'}>
						{todo.text}
					</span>
				</div>
				<div class="flex items-center space-x-2">
					<span class="text-sm text-green-600">{formatTime(todo.timeSpent)}</span>
					<button
						on:click={() => startTimer(todo.id)}
						class="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
					>
						{timers[todo.id] ? 'Stop' : 'Start'}
					</button>
					<button on:click={() => deleteTodo(todo.id)} class="text-red-500 hover:text-red-700">
						Delete
					</button>
				</div>
			</li>
		{/each}
	</ul>
</div>
