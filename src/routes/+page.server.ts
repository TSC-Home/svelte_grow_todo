import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';

interface Todo {
	id: string;
	text: string;
	completed: boolean;
	date: string;
	timeSpent: number;
	locked: boolean;
}

interface DataStore {
	todos: Todo[];
	selectedPlant: string;
	plantGrowth: number;
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		return {
			todos: [],
			selectedPlant: 'tree',
			plantGrowth: 0
		};
	}

	try {
		const record = await locals.pb
			.collection('data_store')
			.getFirstListItem(`user="${locals.user.id}"`);

		const dataStore: DataStore = record.store || {
			todos: [],
			selectedPlant: 'tree',
			plantGrowth: 0
		};

		return dataStore;
	} catch (err) {
		console.error('Error fetching user data:', err);
		return {
			todos: [],
			selectedPlant: 'tree',
			plantGrowth: 0
		};
	}
};

export const actions: Actions = {
	signIn: async ({ request, locals }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required' });
		}
		try {
			await locals.pb.collection('users').authWithPassword(email as string, password as string);
			return { success: true };
		} catch (err) {
			if (err instanceof ClientResponseError) {
				return fail(400, { message: 'Invalid email or password' });
			}
			return fail(500, { message: 'An error occurred during sign in' });
		}
	},

	signUp: async ({ request, locals }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required' });
		}

		try {
			await locals.pb.collection('users').create({ email, password, passwordConfirm: password });
			await locals.pb.collection('users').authWithPassword(email as string, password as string);

			// Create initial data_store for the new user
			await locals.pb.collection('data_store').create({
				user: locals.pb.authStore.model?.id,
				store: {
					todos: [],
					selectedPlant: 'tree',
					plantGrowth: 0
				}
			});

			return { success: true };
		} catch (err) {
			if (err instanceof ClientResponseError) {
				return fail(400, { message: 'Email already exists' });
			}
			return fail(500, { message: 'An error occurred during sign up' });
		}
	},

	logout: async ({ locals }) => {
		locals.pb.authStore.clear();
	}
};
