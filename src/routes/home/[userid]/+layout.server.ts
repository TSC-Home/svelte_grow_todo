import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (locals.user) {
	} else {
		return redirect(302, '/auth');
	}
};