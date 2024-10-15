<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	export let data: { tasks: any[] };

	let tasks = data.tasks;
	let newTaskText = '';
	let filter = 'all';

	function filterTasks(tasks: any[]) {
		const today = new Date().toISOString().split('T')[0];
		switch (filter) {
			case 'tree':
				return tasks.filter((task) => task.savedate === today);
			case 'week':
				const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
				return tasks.filter((task) => task.savedate >= weekAgo && task.savedate <= today);
			case 'month':
				const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
					.toISOString()
					.split('T')[0];
				return tasks.filter((task) => task.savedate >= monthAgo && task.savedate <= today);
			default:
				return tasks;
		}
	}

	function formatTime(seconds: number) {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}
</script>

<div class="h-fit rounded-lg bg-white p-6 shadow-md">
	<div class="flex items-center justify-between">
		<h2 class="mb-4 text-2xl font-semibold text-green-700">Tasks</h2>
		<div class="mb-4">
			<select class="rounded border p-1" bind:value={filter}>
				<option value="all">All Tasks</option>
				<option value="tree">Tree View (Selected Date)</option>
				<option value="week">This Week</option>
				<option value="month">This Month</option>
			</select>
		</div>
	</div>
	<form method="POST" action="?/addTask" use:enhance class="mb-4">
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
		<div class="mb-4">
			<h3 class="mb-2 text-lg font-semibold text-gray-700">{new Date().toLocaleDateString()}</h3>
			<ul class="space-y-2">
				{#each filterTasks(tasks) as task}
					<li class={`flex items-center justify-between rounded-md bg-green-50 p-3`}>
						<form
							method="POST"
							action="?/toggleCheckBox"
							use:enhance
							class="flex items-center gap-x-2"
						>
							<input type="hidden" name="id" value={task.id} />
							<button type="submit" class="form-checkbox h-6 w-6 text-green-600">
								<input
									type="checkbox"
									name="checked"
									class="form-checkbox h-5 w-5 text-green-600"
									checked={task.checked}
									readonly
								/>
							</button>
							<span class={task.checked ? 'text-green-500 line-through' : 'text-green-800'}>
								{task.text}
							</span>
						</form>
						<div class="flex w-fit items-center gap-x-2">
							<span class="text-sm text-green-600">{formatTime(task.time || 0)}</span>
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
									class="icon {task.pinned ? 'text-orange-600/60' : 'text-green-600/60'}"
									title="Keep task"
								>
									{task.pinned ? 'keep_off' : 'keep'}
								</button>
							</form>
							<form method="POST" action="?/deleteTask" use:enhance>
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
