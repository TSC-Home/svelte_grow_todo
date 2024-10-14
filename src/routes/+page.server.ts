import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, `/home/${locals.user.id}`);
	} else {
		return redirect(302, '/auth');
	}
};

export const actions: Actions = {};
