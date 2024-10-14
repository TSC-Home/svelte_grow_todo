export const load = async ({ locals }) => {
	try {
		const tasks = await locals.pb.collection('tasks').getFullList();
		return { tasks };
	} catch (error) {
		console.log(error);
		return { tasks: [] };
	}
};
