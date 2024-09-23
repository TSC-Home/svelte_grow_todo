<script lang="ts">
	import { onDestroy } from 'svelte';

	export let todos: {
		id: number;
		text: string;
		completed: boolean;
		date: string;
		timeSpent: number; // Zeit, die bisher für dieses Todo verbracht wurde
	}[];
	export let addTodo: (text: string) => void;
	export let toggleTodo: (id: number) => void;
	export let deleteTodo: (id: number) => void;
	export let updateTodoTime: (id: number, time: number) => void; // Funktion zum Aktualisieren der Zeit im Todo
	export let selectedDate: string;

	let newTodoText = '';
	let timers: { [key: number]: { interval: any; startTime: number; localElapsedTime: number } } =
		{};

	// Hinzufügen eines neuen Todos
	function handleSubmit() {
		if (newTodoText.trim()) {
			addTodo(newTodoText.trim());
			newTodoText = '';
		}
	}

	// Timer-Start- und Stoppfunktion
	function startTimer(id: number) {
		// Wenn der Timer bereits läuft, stoppen wir ihn
		if (timers[id]) {
			stopTimer(id);
		} else {
			let todo = todos.find((todo) => todo.id === id);

			if (todo) {
				// Starte den Timer, merke die aktuelle Zeit
				timers[id] = {
					startTime: Date.now(), // Starte den Timer ab dem aktuellen Zeitpunkt
					localElapsedTime: todo.timeSpent, // Beginne mit der bereits gespeicherten Zeit
					interval: setInterval(() => {
						// Erhöhe die verstrichene Zeit basierend auf der Startzeit
						const currentTime = Date.now();
						timers[id].localElapsedTime =
							todo.timeSpent + Math.floor((currentTime - timers[id].startTime) / 1000);
					}, 1000)
				};
			}
		}
	}

	// Timer-Stoppen-Funktion und Zeit speichern
	function stopTimer(id: number) {
		if (timers[id]) {
			// Berechne die verstrichene Zeit, seit der Timer gestartet wurde
			const totalTime = timers[id].localElapsedTime;

			// Timer stoppen
			clearInterval(timers[id].interval);

			// Zeit endgültig speichern (im Backend oder der Hauptliste)
			updateTodoTime(id, totalTime);

			// Timer löschen
			delete timers[id];
		}
	}

	// Stoppe alle Timer, wenn die Komponente zerstört wird
	onDestroy(() => {
		Object.keys(timers).forEach((id) => clearInterval(timers[Number(id)].interval));
	});

	// Zeitformatierung (hh:mm:ss)
	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
			.toString()
			.padStart(2, '0')}`;
	}

	// Reaktive Variable für die gefilterten Todos
	$: filteredTodos = todos.filter((todo) => todo.date === selectedDate);
</script>

<!-- Benutzeroberfläche -->
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
					<!-- Zeigt die live verstrichene Zeit an, wenn der Timer läuft -->
					<span class="text-sm text-green-600">
						{#if timers[todo.id]}
							{formatTime(timers[todo.id].localElapsedTime)}
						{:else}
							{formatTime(todo.timeSpent)}
							<!-- Zeigt die gespeicherte Zeit, wenn der Timer nicht läuft -->
						{/if}
					</span>
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
