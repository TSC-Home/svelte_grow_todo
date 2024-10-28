import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const filter = url.searchParams.get('filter') || 'tree';
	const dateParam = url.searchParams.get('date');

	// Stelle sicher, dass das heutige Datum auf den aktuellen Zeitpunkt gesetzt wird
	const today = new Date();
	const selectedDate = dateParam ? new Date(dateParam) : today;

	// Normiere das Datum auf YYYY-MM-DD
	const todayString = today.toISOString().split('T')[0];
	const selectedDateString = selectedDate.toISOString().split('T')[0];

	console.log('Heute:', today.toISOString());
	console.log('Ausgewähltes Datum:', selectedDate.toISOString());

	let filterQuery = '';
	let tasksToUpdate = [];

	try {
		if (filter === 'all') {
			// Alle Aufgaben anzeigen
			filterQuery = '';
		} else if (filter === 'tree') {
			// Nur Aufgaben für das ausgewählte Datum, die nicht erledigt sind
			if (selectedDateString !== todayString) {
				filterQuery = `((checked = false) && (date ~ "${selectedDateString}"))`;
			} else {
				// Zeige alte und aktuelle Aufgaben für heute
				filterQuery = `((date < "${today.toISOString()}" && checked = false) || date = "${today.toISOString()}")`;
			}
		} else if (filter === 'week') {
			// Aufgaben für diese Woche (bis Sonntag)
			const endOfWeek = new Date(today);
			endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // Nächster Sonntag
			filterQuery = `((date >= "${today.toISOString()}" && date <= "${endOfWeek.toISOString()}" && checked = false))`;
		} else if (filter === 'month') {
			// Aufgaben für diesen Monat (bis Ende des Monats)
			const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Letzter Tag des Monats
			filterQuery = `((date >= "${today.toISOString()}" && date <= "${endOfMonth.toISOString()}" && checked = false))`;
		}

		// Hole die Aufgaben, die dem Filter entsprechen
		const tasks = await locals.pb.collection('tasks').getFullList({
			filter: filterQuery,
			sort: 'date'
		});

		console.log('Gefundene Aufgaben:', tasks.length);
		tasks.forEach((task) => {
			console.log('Aufgabe:', task.id, 'Datum:', task.date, 'Erledigt:', task.checked);
		});

		// Markiere überfällige Aufgaben
		tasks.forEach((task) => {
			const taskDate = new Date(task.date);
			task.isOverdue = taskDate < today && !task.checked; // Überprüfen, ob die Aufgabe überfällig ist
			console.log('Aufgabe:', task.id, 'ist überfällig:', task.isOverdue);
		});

		// Aktualisiere die Aufgaben: älter als heute, nicht gepinnt, nicht erledigt
		tasksToUpdate = tasks.filter((task) => {
			const taskDate = new Date(task.date);
			return taskDate < today && !task.pinned && !task.checked;
		});

		console.log('Zu aktualisierende Aufgaben:', tasksToUpdate.length);
		for (const task of tasksToUpdate) {
			console.log('Aktualisiere Aufgabe:', task.id, 'auf heutiges Datum');
			await locals.pb.collection('tasks').update(task.id, {
				date: today.toISOString() // Update auf das aktuelle Datum und die Uhrzeit
			});
			task.date = today.toISOString(); // Aktualisiere das Datum im Task-Objekt
		}

		// Gib die Aufgaben, den Filter und das ausgewählte Datum zurück
		return {
			tasks,
			filter,
			selectedDate: selectedDate.toISOString() // Gib das vollständige Datum zurück
		};
	} catch (err) {
		console.error('Fehler beim Abrufen oder Aktualisieren der Aufgaben:', err);
		throw error(500, 'Fehler beim Abrufen oder Aktualisieren der Aufgaben');
	}
};

export const actions: Actions = {
	addTask: async ({ request, locals }) => {
		const formData = await request.formData();
		const text = formData.get('text') as string;
		const dateParam = formData.get('date') as string;

		if (!text) {
			return { success: false, error: 'Task text is required' };
		}

		// Verwende die lokale Zeit
		let selectedDate: Date;
		if (dateParam) {
			selectedDate = new Date(dateParam); // Verwende das angegebene Datum
		} else {
			selectedDate = new Date(); // Verwende das aktuelle Datum
		}

		// Keine Uhrzeit auf Mitternacht setzen, speichere die Zeit wie sie ist
		console.log('Aufgabe wird hinzugefügt mit folgendem Datum:', selectedDate.toISOString());

		try {
			await locals.pb.collection('tasks').create({
				text,
				checked: false,
				pinned: false,
				time: 0,
				date: selectedDate.toISOString(), // Speichere das Datum inklusive Zeit
				users: [locals.user.id]
			});
			return { success: true };
		} catch (err) {
			console.error('Fehler beim Hinzufügen der Aufgabe:', err);
			return { success: false, error: 'Failed to add task' };
		}
	},

	toggleCheckBox: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		try {
			let task = await locals.pb.collection('tasks').getOne(id);
			await locals.pb.collection('tasks').update(id, {
				checked: !task.checked
			});
			return { success: true };
		} catch (err) {
			console.error('Error toggling checkbox:', err);
			return { success: false, error: 'Failed to toggle checkbox' };
		}
	},

	togglePin: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		try {
			const task = await locals.pb.collection('tasks').getOne(id);
			await locals.pb.collection('tasks').update(id, {
				pinned: !task.pinned
			});
			return { success: true };
		} catch (err) {
			console.error('Error toggling pin:', err);
			return { success: false, error: 'Failed to toggle pin' };
		}
	},

	deleteTask: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		try {
			await locals.pb.collection('tasks').delete(id);
			return { success: true };
		} catch (err) {
			console.error('Error deleting task:', err);
			return { success: false, error: 'Failed to delete task' };
		}
	}
};
