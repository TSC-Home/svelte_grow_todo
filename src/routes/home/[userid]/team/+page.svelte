<script>
	import Navbar from '$lib/components/navbar.svelte';
</script>

<div class="h-screen w-full">
	<div class="flex flex-col px-4 py-4">
		<div>
			<Navbar />
		</div>
		<div class="mt-8 flex justify-center">
			<div class="flex w-full flex-col lg:flex-row 2xl:w-1/2">
				<div class="w-full px-2 2xl:w-1/3">
					<div class="mb-6 overflow-hidden rounded-lg bg-white p-6 shadow-md">
						<div class="flex flex-col gap-y-2">
							<h2 class="mb-4 text-2xl font-semibold text-green-700">Your teams</h2>
							<div class="flex w-full space-x-2">
								<input
									name="text"
									placeholder="Create a new team"
									class=" w-full rounded-md border border-green-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
								/>
								<button
									type="submit"
									class=" w-fit rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
								>
									Create
								</button>
							</div>
							<span class="-mt-1 mb-2 text-sm text-green-800/60">Select your required team.</span>
							<button
								class="flex items-center justify-between rounded-md bg-green-50 px-2 py-2 text-start text-green-800 hover:bg-green-100"
								><span>Helmut´s Team</span>
								<button class="icon text-red-500/80 hover:text-red-500">delete</button></button
							>
						</div>
					</div>
				</div>
				<div class="w-full px-2 2xl:w-1/2">
					<div class="mb-6 overflow-hidden rounded-lg bg-white p-6 shadow-md">
						<div class="flex flex-col">
							<h2 class="mb-4 text-2xl font-semibold text-green-700">Helmut´s team</h2>
							<span class="font-semibold text-green-800">Team members</span>
							<div class="flex w-full space-x-2">
								<input
									name="text"
									placeholder="A user's email address"
									class=" w-full rounded-md border border-green-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
								/>
								<button
									type="submit"
									class=" w-fit rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
									>Invite
								</button>
							</div>
							<table
								class="mt-4 w-full table-auto overflow-hidden rounded-lg border bg-green-50/50"
							>
								<thead class="rounded-md bg-green-100">
									<tr class="rounded-md text-sm text-green-800">
										<th class="px-3 py-2 text-left">Name</th>
										<th class="px-3 py-2 text-left">Positon</th>
										<th class="px-3 py-2 text-left">Date added</th>
										<th></th>
									</tr>
								</thead>
								<tbody class="text-sm font-light text-green-600">
									<tr class="">
										<td class="px-3 py-3 text-left">Max Mustermann</td>
										<td class="px-3 py-3 text-left">Administrator</td>
										<td class="px-3 py-3 text-left">2024-10-18</td>
										<td class="px-3 py-3 text-left">
											<button type="submit" class="icon pt-1 text-red-600/80" title="Remove member"
												>person_remove</button
											>
										</td>
									</tr>
									<tr class="">
										<td class="px-3 py-3 text-left">Anna Beispiel</td>
										<td class="px-3 py-3 text-left">Member</td>
										<td class="px-3 py-3 text-left">2024-10-17</td>
										<td class="px-3 py-3 text-left">
											<button type="submit" class="icon pt-1 text-red-600/80" title="Remove member"
												>person_remove</button
											>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:root {
		background-color: #dcfce7;
	}
</style>
