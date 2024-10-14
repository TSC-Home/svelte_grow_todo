<script lang="ts">
	import { enhance } from '$app/forms';
	import { updated } from '$app/stores';
	export let isOpen: boolean = false;
	let register = false;
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<div class="absolute inset-0 bg-black opacity-50"></div>
		<div class="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
			<!-- Add your authentication form here -->
			{#if register}
				<h2 class="mb-4 text-2xl font-bold">Registration</h2>
				<form
					method="post"
					action="?/signUp"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							isOpen = false;
						};
					}}
				>
					<div>
						<label for="username">
							Username
							<input
								type="text"
								id="username"
								name="username"
								placeholder="Username"
								class="mb-2 w-full rounded border p-2"
							/>
						</label>
					</div>
					<div>
						<label for="email">
							Email
							<input
								type="email"
								id="email"
								name="email"
								placeholder="Email"
								class="mb-2 w-full rounded border p-2"
							/>
						</label>
					</div>
					<div>
						<label for="password">
							Password
							<input
								type="password"
								id="password"
								name="password"
								placeholder="Password"
								class="mb-2 w-full rounded border p-2"
							/>
						</label>
					</div>

					<button
						type="submit"
						class="mt-2 w-full rounded-md bg-green-500 py-2 text-white transition-colors hover:bg-green-600"
					>
						Sign Up
					</button>
					Don´t have an account?
					<button class="text-green-500 underline" on:click={() => (register = false)}>Login</button
					>
				</form>
			{:else}
				<h2 class="mb-4 text-2xl font-bold">Authentication</h2>
				<form
					method="post"
					action="?/signIn"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							isOpen = false;
						};
					}}
				>
					<div>
						<label for="email">
							Email
							<input
								type="email"
								id="email"
								name="email"
								placeholder="Email"
								class="mb-2 w-full rounded border p-2"
							/>
						</label>
					</div>
					<div>
						<label for="password">
							Password
							<input
								type="password"
								id="password"
								name="password"
								placeholder="Password"
								class="mb-2 w-full rounded border p-2"
							/>
						</label>
					</div>
					<button
						type="submit"
						class="mt-2 w-full rounded-md bg-green-500 py-2 text-white transition-colors hover:bg-green-600"
					>
						Sign In
					</button>
					Don´t have an account?
					<button class="text-green-500 underline" on:click={() => (register = true)}
						>Register</button
					>
				</form>
			{/if}
		</div>
	</div>
{/if}
