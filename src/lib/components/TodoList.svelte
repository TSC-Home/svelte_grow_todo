<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let todos: {
		id: number;
		text: string;
		completed: boolean;
		date: string;
		timeSpent: number;
		locked: boolean;
	}[];
	export let addTodo: (text: string) => void;
	export let toggleTodo: (id: number) => void;
	export let deleteTodo: (id: number) => void;
	export let updateTodoTime: (id: number, time: number) => void;
	export let lockTodo: (id: number) => void;
	export let selectedDate: string;

	let newTodoText = '';
	let timers: { [key: number]: { interval: any; startTime: number; localElapsedTime: number } } =
		{};
	let filterType: 'all' | 'tree' | 'week' | 'month' = 'tree';

	onMount(() => {
		if (browser) {
			const storedFilterType = localStorage.getItem('todoFilterType');
			if (storedFilterType) {
				filterType = storedFilterType as typeof filterType;
			}
		}
	});

	$: {
		if (browser) {
			localStorage.setItem('todoFilterType', filterType);
		}
	}

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
			let todo = todos.find((todo) => todo.id === id);
			if (todo) {
				timers[id] = {
					startTime: Date.now(),
					localElapsedTime: todo.timeSpent,
					interval: setInterval(() => {
						const currentTime = Date.now();
						timers[id].localElapsedTime =
							todo.timeSpent + Math.floor((currentTime - timers[id].startTime) / 1000);
					}, 1000)
				};
			}
		}
	}

	function stopTimer(id: number) {
		if (timers[id]) {
			const totalTime = timers[id].localElapsedTime;
			clearInterval(timers[id].interval);
			updateTodoTime(id, totalTime);
			delete timers[id];
		}
	}

	onDestroy(() => {
		Object.keys(timers).forEach((id) => clearInterval(timers[Number(id)].interval));
	});

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function getDateColor(todoDate: string): string {
		const today = new Date();
		const dueDate = new Date(todoDate);
		const timeDiff = dueDate.getTime() - today.getTime();
		const dayDiff = timeDiff / (1000 * 3600 * 24);

		if (dayDiff < 0) return 'bg-red-200'; // Overdue
		if (dayDiff < 3) return 'bg-yellow-200'; // Due in next 3 days
		if (dayDiff < 7) return 'bg-green-200'; // Due in next week
		return 'bg-blue-200'; // Due later
	}

	function isToday(date: string): boolean {
		const today = new Date();
		const todoDate = new Date(date);
		return todoDate.toDateString() === today.toDateString();
	}

	function isInCurrentWeek(date: string): boolean {
		const today = new Date();
		const todoDate = new Date(date);
		const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekEnd.getDate() + 6);
		return todoDate >= weekStart && todoDate <= weekEnd;
	}

	function isInCurrentMonth(date: string): boolean {
		const today = new Date();
		const todoDate = new Date(date);
		return (
			todoDate.getMonth() === today.getMonth() && todoDate.getFullYear() === today.getFullYear()
		);
	}

	$: filteredTodos = todos
		.filter((todo) => {
			const todoDate = new Date(todo.date);
			const selected = new Date(selectedDate);

			switch (filterType) {
				case 'all':
					return true;
				case 'tree':
					// Show todos for the selected date or earlier if not completed
					// return (
					// 	todoDate <= selected &&
					// 	(!todo.completed || todoDate.toDateString() === selected.toDateString())
					// );
					const today = new Date();
					today.setHours(0, 0, 0, 0); // Reset today's time to 00:00:00 for accurate comparison

					return (
						todoDate.toDateString() === selected.toDateString() || // Todos from the selected date
						(todoDate < today && !todo.completed) // Uncompleted todos from before today
					);
				case 'week':
					return isInCurrentWeek(todo.date);
				case 'month':
					return isInCurrentMonth(todo.date);
				default:
					return true;
			}
		})
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	$: groupedTodos = filteredTodos.reduce(
		(acc, todo) => {
			if (!acc[todo.date]) {
				acc[todo.date] = [];
			}
			acc[todo.date].push(todo);
			return acc;
		},
		{} as { [key: string]: typeof todos }
	);
</script>

<div class="h-fit rounded-lg bg-white p-6 shadow-md">
	<div class="flex items-center justify-between">
		<h2 class="mb-4 text-2xl font-semibold text-green-700">Tasks</h2>
		<div class="mb-4">
			<select bind:value={filterType} class="rounded border p-1">
				<option value="all">All Tasks</option>
				<option value="tree">Tree View (Selected Date)</option>
				<option value="week">This Week</option>
				<option value="month">This Month</option>
			</select>
		</div>
	</div>
	<form on:submit|preventDefault={handleSubmit} class="mb-4">
		<input
			bind:value={newTodoText}
			placeholder="Add new task for {selectedDate}"
			class="w-full rounded-md border border-green-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
		/>
		<button
			type="submit"
			class="mt-2 w-full rounded-md bg-green-500 py-2 text-white transition-colors hover:bg-green-600"
		>
			Add
		</button>
	</form>
	<div class="h-full overflow-y-scroll">
		{#each Object.entries(groupedTodos) as [date, todosForDate]}
			<div class="mb-4">
				<h3 class="mb-2 text-lg font-semibold text-gray-700">{date}</h3>
				<ul class="space-y-2">
					{#each todosForDate as todo (todo.id)}
						<li
							class={`flex items-center justify-between rounded-md p-3 ${isToday(todo.date) || selectedDate === todo.date ? 'bg-green-50' : getDateColor(todo.date)}`}
						>
							<div class="flex items-center gap-x-2">
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
							<div class="flex w-fit items-center gap-x-2">
								<span class="text-sm text-green-600">
									{#if timers[todo.id]}
										{formatTime(timers[todo.id].localElapsedTime)}
									{:else}
										{formatTime(todo.timeSpent)}
									{/if}
								</span>
								<button
									on:click={() => startTimer(todo.id)}
									class="mr-2 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
								>
									{timers[todo.id] ? 'Stop' : 'Start'}
								</button>
								<button
									on:click={() => lockTodo(todo.id)}
									class="icon {todo.locked ? 'text-orange-600/60' : 'text-green-600/60'}"
									title="Keep task"
								>
									{todo.locked ? 'lock' : 'lock_open_right'}
								</button>
								<button
									on:click={() => deleteTodo(todo.id)}
									class="icon text-red-600/80"
									title="Delete"
								>
									delete
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</div>
