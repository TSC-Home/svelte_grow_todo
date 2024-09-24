<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import PocketBase from 'pocketbase';
	import TodoList from '$lib/components/TodoList.svelte';
	import Plant from '$lib/components/Plant.svelte';
	import Calendar from '$lib/components/Calendar.svelte';
	import PlantSelector from '$lib/components/PlantSelector.svelte';

	const pb = new PocketBase('https://plantodo.krio.synthetix.me/');

	interface Todo {
		id: number;
		text: string;
		completed: boolean;
		date: string;
		timeSpent: number;
		locked: boolean;
	}

	let todos: Todo[] = [];
	let selectedDate = new Date().toISOString().split('T')[0];
	let selectedPlant = 'tree';
	let plantGrowth = 0;
	let showAuthPopup = false;
	let isLogin = true;
	let email = '';
	let password = '';
	let isAuthenticated = false;

	onMount(async () => {
		isAuthenticated = pb.authStore.isValid;
		if (isAuthenticated) {
			await fetchUserData();
		} else {
			loadFromLocalStorage();
		}
	});

	function loadFromLocalStorage() {
		if (browser) {
			const storedTodos = localStorage.getItem('todos');
			const storedPlant = localStorage.getItem('selectedPlant');
			if (storedTodos) {
				todos = JSON.parse(storedTodos);
			}
			if (storedPlant) {
				selectedPlant = storedPlant;
			}
			updatePlantGrowth();
			moveUncompletedTodos();
		}
	}

	function saveToLocalStorage() {
		if (browser) {
			localStorage.setItem('todos', JSON.stringify(todos));
			localStorage.setItem('selectedPlant', selectedPlant);
		}
	}

	async function fetchUserData() {
		try {
			const record = await pb
				.collection('data_store')
				.getFirstListItem(`user="${pb.authStore.model?.id}"`);
			const userData = record.store;
			todos = userData.todos || [];
			selectedPlant = userData.selectedPlant || 'tree';
			updatePlantGrowth();
			moveUncompletedTodos();
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	}

	async function saveUserData() {
		if (isAuthenticated) {
			try {
				const userData = {
					todos,
					selectedPlant
				};
				const record = await pb
					.collection('data_store')
					.getFirstListItem(`user="${pb.authStore.model?.id}"`);
				await pb.collection('data_store').update(record.id, {
					store: userData
				});
			} catch (error) {
				console.error('Error saving user data:', error);
			}
		} else {
			saveToLocalStorage();
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

	async function handleAuth() {
		try {
			if (isLogin) {
				await pb.collection('users').authWithPassword(email, password);
			} else {
				const user = await pb.collection('users').create({
					email,
					password,
					passwordConfirm: password
				});
				await pb.collection('users').authWithPassword(email, password);

				// Create initial data_store entry for the new user
				await pb.collection('data_store').create({
					user: user.id,
					store: {
						todos,
						selectedPlant
					}
				});
			}
			isAuthenticated = true;
			await fetchUserData();
			showAuthPopup = false;
			email = '';
			password = '';
		} catch (error) {
			console.error('Authentication error:', error);
			alert('Authentication failed. Please try again.');
		}
	}

	function handleOutsideClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.classList.contains('popup-overlay')) {
			showAuthPopup = false;
		}
	}

	async function handleLogout() {
		pb.authStore.clear();
		isAuthenticated = false;
		loadFromLocalStorage();
	}
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-green-100 p-4 {showAuthPopup
		? 'blur-sm'
		: ''}"
>
	<div class="absolute left-4 top-4 text-4xl">🌱</div>
	<div class="absolute right-4 top-4">
		{#if isAuthenticated}
			<button
				on:click={handleLogout}
				class="mr-2 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
			>
				Logout
			</button>
		{:else}
			<button
				on:click={toggleAuthPopup}
				class="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
			>
				Login / Register
			</button>
		{/if}
	</div>

	<h1 class="mb-8 text-4xl font-bold text-green-800">PlanTo-do</h1>
	<div class="flex w-full max-w-6xl flex-col gap-8 md:flex-row">
		<div class="flex-1">
			<Calendar {todos} {selectedDate} {changeDate} {isDateCompleted} />
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
		<div class="flex flex-1 flex-col items-center justify-center">
			<PlantSelector {selectedPlant} {changePlant} />
			<Plant type={selectedPlant} growth={plantGrowth} />
		</div>
	</div>
</div>

{#if showAuthPopup}
	<button
		class="popup-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
		on:click={handleOutsideClick}
	>
		<button class="relative rounded-lg bg-white p-8 shadow-lg" on:click|stopPropagation>
			<h2 class="mb-4 text-2xl font-bold">{isLogin ? 'Login' : 'Register'}</h2>
			<form on:submit|preventDefault={handleAuth} class="space-y-4">
				<div>
					<label for="email" class="mb-1 block">Email:</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						required
						class="w-full rounded border px-3 py-2"
					/>
				</div>
				<div>
					<label for="password" class="mb-1 block">Password:</label>
					<input
						type="password"
						id="password"
						bind:value={password}
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
			<button
				on:click={() => (isLogin = !isLogin)}
				class="mt-4 text-green-600 hover:text-green-700"
			>
				{isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
			</button>
			<button
				on:click={toggleAuthPopup}
				class="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
			>
				&times;
			</button>
		</button>
	</button>
{/if}
