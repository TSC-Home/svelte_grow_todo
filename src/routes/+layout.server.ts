export const load = async ({ locals, cookies }) => {
	return { user: locals.user };
};
