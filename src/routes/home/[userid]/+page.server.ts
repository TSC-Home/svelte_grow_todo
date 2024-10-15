import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const tasks = await locals.pb.collection('tasks').getFullList({
			sort: '-created'
		});
		return { tasks };
	} catch (err) {
		console.error('Error fetching tasks:', err);
		throw error(500, 'Error fetching tasks');
	}
};

export const actions: Actions = {
	addTask: async ({ request, locals }) => {
		const formData = await request.formData();
		const text = formData.get('text') as string;
		if (!text) {
			return { success: false, error: 'Task text is required' };
		}

		try {
			await locals.pb.collection('tasks').create({
				text,
				checked: false,
				pinned: false,
				timer_running: false,
				time: 0,
				savedate: new Date().toISOString().split('T')[0],
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

	toggleTimer: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		try {
			const task = await locals.pb.collection('tasks').getOne(id);
			const now = new Date();
			let newTime = task.time || 0;

			if (task.timer_running) {
				const startTime = new Date(task.start_timer);
				newTime += Math.floor((now.getTime() - startTime.getTime()) / 1000);
			}

			await locals.pb.collection('tasks').update(id, {
				timer_running: !task.timer_running,
				start_timer: task.timer_running ? null : now.toISOString(),
				time: newTime
			});
			return { success: true };
		} catch (err) {
			console.error('Error toggling timer:', err);
			return { success: false, error: 'Failed to toggle timer' };
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
