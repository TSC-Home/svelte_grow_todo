<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';

	let register: boolean = false;
	let loading: boolean = false;
</script>

<div class="h-screen">
	<div class=" flex h-full items-center justify-center p-4">
		<div class="w-full max-w-md" in:fade={{ duration: 300 }}>
			<div class="mb-6 text-center">
				<h1 class="text-5xl">🌱</h1>
				<h1 class="text-4xl font-bold text-white">Grow Task</h1>
				<p class="mt-2 text-white">Nurture your productivity</p>
			</div>
			<div class="overflow-hidden rounded-lg bg-white shadow-2xl">
				<div class="p-8">
					<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">
						{register ? 'Create Account' : 'Welcome Back'}
					</h2>
					<formS
						method="post"
						action={register ? '?/signUp' : '?/signIn'}
						use:enhance={() => {
							loading = true;
							return async ({ update }) => {
								await update();
								loading = false;
							};
						}}
						class="space-y-6"
					>
						{#if register}
							<div>
								<label for="username" class="block text-sm font-medium text-gray-700"
									>Username</label
								>
								<input
									type="text"
									id="username"
									placeholder="Max Mustermann"
									name="username"
									disabled={loading}
									required
									class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 shadow-sm
                       focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
								/>
							</div>
						{/if}
						<div>
							<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
							<input
								type="email"
								placeholder="max@mustermann.de"
								id="email"
								name="email"
								disabled={loading}
								required
								class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 shadow-sm
                     focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
							/>
						</div>
						<div>
							<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
							<input
								type="password"
								placeholder="**********"
								id="password"
								name="password"
								disabled={loading}
								required
								class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 shadow-sm
                     focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
							/>
						</div>
						<div>
							<button
								type="submit"
								disabled={loading}
								class="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
							>
								{loading ? 'Loading...' : register ? 'Sign Up' : 'Sign In'}
							</button>
						</div>
					</formS>
				</div>
				<div class="border-t border-gray-100 bg-gray-50 px-8 py-6">
					<p class="text-center text-xs text-gray-600">
						{register ? 'Already have an account?' : "Don't have an account?"}
						<button
							class="font-medium text-green-600 transition-colors hover:text-green-500"
							on:click={() => (register = !register)}
						>
							{register ? 'Sign In' : 'Sign Up'}
						</button>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:root {
		background: #48b672;
		background: -webkit-linear-gradient(0deg, #48b672 0%, #41da79 100%);
		background: linear-gradient(0deg, #48b672 0%, #41da79 100%);
	}
</style>
