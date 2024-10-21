import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const filter = url.searchParams.get('filter') || 'tree';
	const dateParam = url.searchParams.get('date');

	// Konvertiere dateParam zu einem Date-Objekt oder nimm das aktuelle Datum, falls keins angegeben ist
	const selectedDate = dateParam ? new Date(dateParam) : new Date();
	const today = new Date(); // Das heutige Datum
	let filterQuery = '';

	try {
		if (filter === 'tree') {
			// Zeige alle Todos, die bis einschließlich dem angegebenen Datum erstellt wurden (vor oder am heutigen Tag)
			filterQuery = `date <= "${selectedDate.toISOString()}"`;
		} else if (filter === 'all') {
			// Zeige alle Aufgaben außer die erledigten, die nicht am heutigen Tag sind
			filterQuery = `checked = false && date != "${today.toISOString()}"`;
		} else if (filter === 'week') {
			// Zeige alle Aufgaben von heute bis in 7 Tagen
			const weekLater = new Date();
			weekLater.setDate(today.getDate() + 7);
			filterQuery = `date >= "${today.toISOString()}" && created <= "${weekLater.toISOString()}"`;
		} else if (filter === 'month') {
			// Zeige alle Aufgaben von heute bis in 30 Tagen
			const monthLater = new Date();
			monthLater.setDate(today.getDate() + 30);
			filterQuery = `date >= "${today.toISOString()}" && date <= "${monthLater.toISOString()}"`;
		}

		const tasks = await locals.pb.collection('tasks').getFullList({
			filter: filterQuery
		});

		return { tasks };
	} catch (err) {
		console.error('Error fetching tasks:', err);
		throw error(500, 'Error fetching tasks');
	}
};

export const actions: Actions = {
	addTask: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const text = formData.get('text') as string;
		const dateParam = formData.get('data') as string;
		console.log(dateParam);

		// Konvertiere dateParam zu einem Date-Objekt oder nimm das aktuelle Datum, falls keins angegeben ist
		const selectedDate = dateParam ? new Date(dateParam) : new Date();
		console.log(selectedDate, dateParam);
		if (!text) {
			return { success: false, error: 'Task text is required' };
		}

		try {
			await locals.pb.collection('tasks').create({
				text,
				checked: false,
				pinned: false,
				time: 0,
				date: selectedDate.toISOString().split('T')[0],
				users: [locals.user.id]
			});
			return { success: true };
		} catch (err) {
			console.error('Error adding task:', err);
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
