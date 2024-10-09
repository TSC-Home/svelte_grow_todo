import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	try {
		const data = await request.json(); // Parse the incoming JSON data
		console.info('Received data:', data.todos);

		const record = await locals.pb
			.collection('data_store')
			.getFirstListItem(`user="${locals.user.id}"`);

		try {
			let update = await locals.pb.collection('data_store').update(record.id, {
				store: {
					todos: data.todos,
					selectedPlant: data.selectedPlant,
					plantGrowth: data.plantGrowth
				}
			});
			console.log('Data updated:', update);
		} catch (error) {
			console.error('Error updating data:', error);
		}

		return json({ success: true, message: 'Data saved successfully' });
	} catch (error) {
		console.error('Error handling request:', error);
		return json({ success: false, error: 'Failed to save data' }, { status: 500 });
	}
};
