<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let todos: { id: number; text: string; completed: boolean; date: string }[];
	export let selectedDate: string;
	export let changeDate: (date: string) => void;
	export let isDateCompleted: (date: string) => boolean;

	const dispatch = createEventDispatcher();

	function getDaysInMonth(year: number, month: number) {
		return new Date(year, month + 1, 0).getDate();
	}

	function getMonthData(year: number, month: number) {
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = getDaysInMonth(year, month);
		const weeks = [];
		let week = new Array(7).fill(null);

		for (let i = 0; i < firstDay; i++) {
			week[i] = null;
		}

		for (let day = 1; day <= daysInMonth; day++) {
			const dayOfWeek = (firstDay + day - 1) % 7;
			week[dayOfWeek] = day;

			if (dayOfWeek === 6 || day === daysInMonth) {
				weeks.push(week);
				week = new Array(7).fill(null);
			}
		}

		return weeks;
	}

	$: currentDate = new Date(selectedDate);
	$: year = currentDate.getFullYear();
	$: month = currentDate.getMonth();
	$: weeks = getMonthData(year, month);

	function prevMonth() {
		currentDate.setMonth(currentDate.getMonth() - 1);
		currentDate = currentDate;
	}

	function nextMonth() {
		currentDate.setMonth(currentDate.getMonth() + 1);
		currentDate = currentDate;
	}

	function selectDate(day: number | null) {
		if (day !== null) {
			const newDate = new Date(Date.UTC(year, month, day)); // month - 1 to handle 0-based months
			changeDate(newDate.toISOString().split('T')[0]);
		}
	}

	function getTasksForDate(date: string) {
		return todos.filter((todo) => todo.date === date);
	}

	function formatDate(year: number, month: number, day: number): string {
		return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
	}
</script>

<div class="mb-6 rounded-lg bg-white p-6 shadow-md">
	<div class="mb-4 flex items-center justify-between">
		<button on:click={prevMonth} class="text-green-600 hover:text-green-800">&lt; Prev</button>
		<h2 class="text-xl font-semibold">
			{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
		</h2>
		<button on:click={nextMonth} class="text-green-600 hover:text-green-800">Next &gt;</button>
	</div>
	<table class="w-full">
		<thead>
			<tr>
				{#each ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] as day}
					<th class="p-2 text-center">{day}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each weeks as week}
				<tr>
					{#each week as day}
						<td class="p-2 text-center">
							{#if day !== null}
								{@const dateString = formatDate(year, month, day)}
								<button
									on:click={() => selectDate(day)}
									class={`h-8 w-8 rounded-full ${
										selectedDate === dateString
											? 'bg-green-500 text-white'
											: isDateCompleted(dateString)
												? 'bg-yellow-300 text-green-800'
												: 'hover:bg-green-100'
									}`}
								>
									{day}
								</button>
								{#if getTasksForDate(dateString).length > 0}
									<span class="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-400"></span>
								{/if}
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
