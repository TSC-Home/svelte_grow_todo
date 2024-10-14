import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, `/home/${locals.user.id}`);
	}
};

export const actions: Actions = {
	authPopUp: async ({ request, locals }) => {
		if (locals.user) {
			return { isAuthenticationPopupVisible: true };
		}
		return { isAuthenticationPopupVisible: false };
	},

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
		const username = data.get('username');

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required' });
		}

		try {
			await locals.pb
				.collection('users')
				.create({ username, email, password, passwordConfirm: password });
			await locals.pb.collection('users').authWithPassword(email as string, password as string);

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
		return { success: true };
	}
};
