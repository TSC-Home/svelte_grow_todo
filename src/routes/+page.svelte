<script lang="ts">
	import { enhance } from '$app/forms';
	import TodoList from '$lib/components/TodoList.svelte';
	import Plant from '$lib/components/Plant.svelte';
	import Calendar from '$lib/components/Calendar.svelte';
	import PlantSelector from '$lib/components/PlantSelector.svelte';
	import TeamPopup from '$lib/components/TeamPopUp.svelte';

	interface Todo {
		id: number;
		text: string;
		completed: boolean;
		date: string;
		timeSpent: number;
		locked: boolean;
	}
	export let data;
	let todos: Todo[] = (data.todos || []).map((todo: any) => ({ ...todo, id: Number(todo.id) }));
	let selectedDate = new Date().toISOString().split('T')[0];
	let selectedPlant = 'tree';
	let plantGrowth = 0;
	let showAuthPopup = false;
	let isLogin = true;
	let isAuthenticated = false;

	async function saveUserData() {
		const senddata = {
			todos: todos,
			selectedPlant: selectedPlant,
			plantGrowth: plantGrowth
		};

		const response = await fetch('/api/saveUserData', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(senddata) // Send the data
		});

		if (!response.ok) {
			console.error('Error saving user data:', response);
		} else {
			const result = await response.json();
			console.log('Response from server:', result);
		}
	}

	function updatePlantGrowth() {
		const todayTodos = todos.filter((todo) => todo.date === selectedDate);
		const completedTodos = todayTodos.filter((todo) => todo.completed);
		plantGrowth = todayTodos.length > 0 ? (completedTodos.length / todayTodos.length) * 100 : 0;
	}

	async function addTodo(text: string) {
		const newTodo: Todo = {
			id: parseInt(Date.now().toString()),
			text,
			completed: false,
			date: selectedDate,
			timeSpent: 0,
			locked: false
		};
		todos = [...todos, newTodo];
		await saveUserData();
		updatePlantGrowth();
	}

	async function toggleTodo(id: number) {
		todos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
		await saveUserData();
		updatePlantGrowth();
	}

	async function deleteTodo(id: number) {
		todos = todos.filter((todo) => todo.id !== id);
		await saveUserData();
		updatePlantGrowth();
	}

	async function lockTodo(id: number) {
		todos = todos.map((todo) => (todo.id === id ? { ...todo, locked: !todo.locked } : todo));
		await saveUserData();
	}

	async function updateTodoTime(id: number, time: number) {
		todos = todos.map((todo) => (todo.id === id ? { ...todo, timeSpent: time } : todo));
		await saveUserData();
	}

	function changeDate(newDate: string) {
		selectedDate = newDate;
		updatePlantGrowth();
	}

	async function changePlant(newPlant: string) {
		selectedPlant = newPlant;
		await saveUserData();
	}

	async function moveUncompletedTodos() {
		const today = new Date().toISOString().split('T')[0];
		todos = todos.map((todo) => {
			if (!todo.completed && !todo.locked && todo.date < today) {
				return { ...todo, date: today };
			}
			return todo;
		});
		await saveUserData();
	}

	function isDateCompleted(date: string): boolean {
		const dateTodos = todos.filter((todo) => todo.date === date);
		return dateTodos.length > 0 && dateTodos.every((todo) => todo.completed);
	}

	function toggleAuthPopup() {
		showAuthPopup = !showAuthPopup;
	}

	function handleOutsideClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.classList.contains('popup-overlay')) {
			showAuthPopup = false;
		}
	}
</script>

<div
	class="flex h-screen flex-col items-center bg-green-100 p-4 {showAuthPopup
		? 'blur-sm'
		: ''} overflow-y-auto"
>
	<!-- Header Section -->
	<nav class="flex w-full items-center justify-between">
		<span class=" w-1/3 cursor-default text-4xl">🌱</span>
		<h1 class="hidden w-1/3 justify-center text-4xl font-bold text-green-800 md:flex">PlanTo-do</h1>
		<div class="flex justify-end gap-x-2 md:w-1/3">
			{#if data?.user}
				<TeamPopup />
				<form method="POST" action="?/logout" use:enhance class="space-x-2">
					<button
						type="submit"
						class=" rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
					>
						Logout
					</button>
				</form>
			{:else}
				<button
					on:click={toggleAuthPopup}
					class="rounded-md bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
				>
					Login / Register
				</button>
			{/if}
		</div>
	</nav>

	<!-- Main Section -->
	<div class="flex w-full max-w-6xl flex-col md:flex-row">
		<!-- Left Column: Calendar -->
		<div class="mt-8 h-full w-full md:w-1/2">
			<Calendar {todos} {selectedDate} {changeDate} {isDateCompleted} />
		</div>

		<!-- Right Column: Plant Section -->
		<div class="mt-4 flex w-full flex-col items-center md:mt-16 md:w-1/2">
			<PlantSelector {selectedPlant} {changePlant} />
			<Plant type={selectedPlant} growth={plantGrowth} />
		</div>
	</div>
	<div class="w-full max-w-6xl">
		<div class="md:w-1/2">
			<TodoList
				{todos}
				{addTodo}
				{toggleTodo}
				{deleteTodo}
				{selectedDate}
				{updateTodoTime}
				{lockTodo}
			/>
		</div>
	</div>
</div>

<!-----------------------------------------------POPUPS----------------------------------------------------------->

{#if showAuthPopup}
	<!-- Auth Popup -->
	<button
		class="popup-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
		on:click={handleOutsideClick}
	>
		<button class="relative rounded-lg bg-white p-8 shadow-lg" on:click|stopPropagation>
			<h2 class="mb-4 text-2xl font-bold">{isLogin ? 'Login' : 'Register'}</h2>
			{#if isLogin}
				<form class="space-y-4" method="POST" use:enhance action="?/signIn">
					<div>
						<label for="email" class="mb-1 block">Email:</label>
						<input type="email" name="email" required class="w-full rounded border px-3 py-2" />
					</div>
					<div>
						<label for="password" class="mb-1 block">Password:</label>
						<input
							type="password"
							name="password"
							required
							class="w-full rounded border px-3 py-2"
						/>
					</div>
					<button
						type="submit"
						class="w-full rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
					>
						{isLogin ? 'Login' : 'Register'}
					</button>
				</form>
			{:else}
				<form class="space-y-4" method="POST" use:enhance action="?/signUp">
					<div>
						<label for="email" class="mb-1 block">Email:</label>
						<input type="email" name="email" required class="w-full rounded border px-3 py-2" />
					</div>
					<div>
						<label for="password" class="mb-1 block">Password:</label>
						<input
							type="password"
							name="password"
							required
							class="w-full rounded border px-3 py-2"
						/>
					</div>
					<button
						type="submit"
						class="w-full rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
					>
						{isLogin ? 'Login' : 'Register'}
					</button>
				</form>
			{/if}
			<button
				on:click={() => (isLogin = !isLogin)}
				class="mt-4 text-green-600 hover:text-green-700"
			>
				{isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
			</button>
		</button>
	</button>
{/if}
