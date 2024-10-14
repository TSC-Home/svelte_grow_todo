<script lang="ts">
	export let tasks;
	console.log(tasks);
</script>

<div class="h-fit rounded-lg bg-white p-6 shadow-md">
	<div class="flex items-center justify-between">
		<h2 class="mb-4 text-2xl font-semibold text-green-700">Tasks</h2>
		<div class="mb-4">
			<select class="rounded border p-1">
				<option value="all">All Tasks</option>
				<option value="tree">Tree View (Selected Date)</option>
				<option value="week">This Week</option>
				<option value="month">This Month</option>
			</select>
		</div>
	</div>
	<form class="mb-4">
		<input
			placeholder="Add new task for"
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
			<h3 class="mb-2 text-lg font-semibold text-gray-700">13.10.2024</h3>
			<ul class="space-y-2">
				{#each tasks as task}
					<li class={`flex items-center justify-between rounded-md bg-green-50 p-3`}>
						<div class="flex items-center gap-x-2">
							<input
								type="checkbox"
								value={tasks.checked}
								class="form-checkbox h-5 w-5 text-green-600"
							/>
							<span class={true ? 'text-green-500 line-through' : 'text-green-800'}>
								{task.text}
							</span>
						</div>
						<div class="flex w-fit items-center gap-x-2">
							<span class="text-sm text-green-600">00:44:13</span>
							<button
								class="mr-2 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
							>
								{true ? 'Stop' : 'Start'}
							</button>
							<button
								class="icon {true ? 'text-orange-600/60' : 'text-green-600/60'}"
								title="Keep task"
							>
								{true ? 'keep_off' : 'keep'}
							</button>
							<button class="icon text-red-600/80" title="Delete"> delete </button>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
