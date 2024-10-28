<script lang="ts">
	import { goto } from '$app/navigation';
	import { createEventDispatcher, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { slide, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let mobile: boolean;

	let selectedDate = new Date().toISOString().split('T')[0];
	let filter: string = 'tree';
	let containerRef: HTMLButtonElement;

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

	function isDateInCurrentWeek(dateString: string): boolean {
		const date = new Date(dateString);
		const currentDate = new Date(selectedDate);
		const firstDayOfWeek = new Date(currentDate);
		firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
		const lastDayOfWeek = new Date(firstDayOfWeek);
		lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

		return date >= firstDayOfWeek && date <= lastDayOfWeek;
	}

	function isDateInCurrentMonth(dateString: string): boolean {
		const date = new Date(dateString);
		const currentDate = new Date(selectedDate);
		return (
			date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
		);
	}

	$: currentDate = new Date(selectedDate);
	$: year = currentDate.getFullYear();
	$: month = currentDate.getMonth();
	$: weeks = getMonthData(year, month);
	$: isCollapsed = $page.url.searchParams.get('filter') === 'all';
	$: currentFilter = $page.url.searchParams.get('filter') || 'tree';

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
			selectedDate = new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];
			if (isCollapsed) {
				setUrlQuery('filter', 'tree');
			} else {
				setUrlQuery('date', selectedDate);
			}
		}
	}

	function toggleCalendar(event: MouseEvent) {
		if (isCollapsed) {
			event.stopPropagation(); // Verhindert Bubbling
			setUrlQuery('filter', 'tree');
		}
	}

	function isToday(date: string): boolean {
		const today = new Date();
		const todoDate = new Date(date);
		return todoDate.toDateString() === today.toDateString();
	}

	function formatDate(year: number, month: number, day: number): string {
		return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
	}

	function setUrlQuery(key: string, value: string) {
		const url = new URL($page.url);
		url.searchParams.set(key, value);
		goto(url.toString());
	}

	onMount(() => {
		const urlparams = new URLSearchParams($page.url.search);
		if (urlparams.has('date')) {
			const dateParam = urlparams.get('date');
			selectedDate = dateParam || new Date().toISOString().split('T')[0];
		}
		if (urlparams.has('filter')) {
			filter = urlparams.get('filter') || 'tree';
		}
	});
</script>

{#if mobile}
	<div
		class="mx-auto mb-6 max-w-md overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300"
	>
		<button
			bind:this={containerRef}
			class="w-full cursor-pointer px-4 py-3 transition-all duration-300"
			on:click={toggleCalendar}
		>
			<div class="flex items-center justify-between">
				{#if !isCollapsed}
					<button
						on:click={prevMonth}
						class="text-green-600 hover:text-green-800"
						transition:fade={{ duration: 200 }}
					>
						&lt; Prev
					</button>
				{/if}
				<h2 class="text-center text-xl font-semibold transition-all duration-300">
					{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
				</h2>
				{#if !isCollapsed}
					<button
						on:click={nextMonth}
						class="text-green-600 hover:text-green-800"
						transition:fade={{ duration: 200 }}
					>
						Next &gt;
					</button>
				{/if}
			</div>
			{#if !isCollapsed}
				<div transition:slide={{ duration: 300, easing: quintOut }}>
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
										<td class="w-fit p-2 text-center">
											{#if day !== null}
												{@const dateString = formatDate(year, month, day)}
												<button
													on:click|stopPropagation={() => selectDate(day)}
													class={`relative h-8 w-8 rounded-full ${
														selectedDate === dateString
															? 'bg-green-500 text-white'
															: currentFilter === 'week' && isDateInCurrentWeek(dateString)
																? 'bg-green-100'
																: currentFilter === 'month' && isDateInCurrentMonth(dateString)
																	? 'bg-green-100'
																	: 'hover:bg-green-100'
													} transition-colors duration-200`}
												>
													{day}
													{#if isToday(dateString)}
														<div class="absolute z-10 w-8">
															<span
																class={`mx-auto mt-1 block h-2 w-2 rounded-full ${
																	selectedDate === dateString ? '' : 'bg-green-400'
																}`}
															></span>
														</div>
													{/if}
												</button>
											{/if}
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</button>
	</div>
{:else}
	<div class="mb-6 overflow-hidden rounded-lg bg-white p-4 shadow-md">
		<div class="flex justify-center">
			<input
				class="w-32 text-xl outline-none"
				type="date"
				id="calendar"
				name="calendar"
				value="2024-10-13"
			/>
		</div>
	</div>
{/if}
