<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import TodoList from '$lib/components/TodoList.svelte';
	import Plant from '$lib/components/Plant.svelte';
	import Calendar from '$lib/components/Calendar.svelte';
	import PlantSelector from '$lib/components/PlantSelector.svelte';

	interface Todo {
		id: number;
		text: string;
		completed: boolean;
		date: string;
		timeSpent: number;
	}

	let todos: Todo[] = [];
	let selectedDate = new Date().toISOString().split('T')[0];
	let selectedPlant = 'tree';
	let plantGrowth = 0;

	onMount(() => {
		if (browser) {
			const storedTodos = localStorage.getItem('todos');
			if (storedTodos) {
				todos = JSON.parse(storedTodos);
			}
			const storedPlant = localStorage.getItem('selectedPlant');
			if (storedPlant) {
				selectedPlant = storedPlant;
			}
			updatePlantGrowth();
			moveUncompletedTodos();
		}
	});

	function updatePlantGrowth() {
		const todayTodos = todos.filter((todo) => todo.date === selectedDate);
		const completedTodos = todayTodos.filter((todo) => todo.completed);
		plantGrowth = todayTodos.length > 0 ? (completedTodos.length / todayTodos.length) * 100 : 0;
	}

	function addTodo(text: string) {
		const newTodo: Todo = {
			id: Date.now(),
			text,
			completed: false,
			date: selectedDate,
			timeSpent: 0
		};
		todos = [...todos, newTodo];
		saveTodos();
		updatePlantGrowth();
	}

	function toggleTodo(id: number) {
		todos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
		saveTodos();
		updatePlantGrowth();
	}

	function deleteTodo(id: number) {
		todos = todos.filter((todo) => todo.id !== id);
		saveTodos();
		updatePlantGrowth();
	}

	function updateTodoTime(id: number, time: number) {
		todos = todos.map((todo) => (todo.id === id ? { ...todo, timeSpent: time } : todo));
		saveTodos();
	}

	function saveTodos() {
		if (browser) {
			localStorage.setItem('todos', JSON.stringify(todos));
		}
	}

	function changeDate(newDate: string) {
		selectedDate = newDate;
		updatePlantGrowth();
	}

	function changePlant(newPlant: string) {
		selectedPlant = newPlant;
		if (browser) {
			localStorage.setItem('selectedPlant', newPlant);
		}
	}

	function moveUncompletedTodos() {
		const today = new Date().toISOString().split('T')[0];
		todos = todos.map((todo) => {
			if (!todo.completed && todo.date < today) {
				return { ...todo, date: today };
			}
			return todo;
		});
		saveTodos();
	}

	function isDateCompleted(date: string): boolean {
		const dateTodos = todos.filter((todo) => todo.date === date);
		return dateTodos.length > 0 && dateTodos.every((todo) => todo.completed);
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-green-100 p-4">
	<h1 class="mb-8 text-4xl font-bold text-green-800">PlanTo-do</h1>
	<div class="flex w-full max-w-6xl flex-col gap-8 md:flex-row">
		<div class="flex-1">
			<Calendar {todos} {selectedDate} {changeDate} {isDateCompleted} />
			<TodoList {todos} {addTodo} {toggleTodo} {deleteTodo} {selectedDate} {updateTodoTime} />
		</div>
		<div class="flex flex-1 flex-col items-center justify-center">
			<PlantSelector {selectedPlant} {changePlant} />
			<Plant type={selectedPlant} growth={plantGrowth} />
		</div>
	</div>
</div>
