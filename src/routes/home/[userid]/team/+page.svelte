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
							<button
								class="rounded-md bg-green-50 px-2 py-2 text-start text-green-800 hover:bg-green-100"
								>Helmut´s Team</button
							>
							<button
								class="rounded-md bg-green-50 px-2 py-2 text-start text-green-800 hover:bg-green-100"
								>Helmut´s Team</button
							>
							<button
								class="rounded-md bg-green-50 px-2 py-2 text-start text-green-800 hover:bg-green-100"
								>Helmut´s Team</button
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
							<div class="mt-2 flex flex-col space-y-2">
								<div
									class="flex w-full items-center justify-between rounded-md bg-green-100 px-2 py-2"
								>
									<span class="text-green-800">Helmut Müller</span>
									<div class="flex w-fit items-center gap-x-2">
										<form>
											<input type="hidden" name="id" />
											<button type="submit" class="icon pt-1 text-red-600/80" title="Remove member"
												>person_remove</button
											>
										</form>
									</div>
								</div>
								<div
									class="flex w-full items-center justify-between rounded-md bg-green-100 px-2 py-2"
								>
									<span class="text-green-800">Helmut Müller</span>
									<div class="flex w-fit items-center gap-x-2">
										<form>
											<input type="hidden" name="id" />
											<button type="submit" class="icon pt-1 text-red-600/80" title="Remove member"
												>person_remove</button
											>
										</form>
									</div>
								</div>
								<div
									class="flex w-full items-center justify-between rounded-md bg-green-100 px-2 py-2"
								>
									<span class="text-green-800">Helmut Müller</span>
									<div class="flex w-fit items-center gap-x-2">
										<form>
											<input type="hidden" name="id" />
											<button type="submit" class="icon pt-1 text-red-600/80" title="Remove member"
												>person_remove</button
											>
										</form>
									</div>
								</div>
							</div>
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
