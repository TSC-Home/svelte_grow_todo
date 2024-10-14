import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (locals?.user) {
		return redirect(302, `/home/${locals.user.id}`);
	} else {
		return redirect(302, '/auth');
	}
};
