<script lang="ts">
	import { page } from '$app/stores';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { Auth } from '@supabase/auth-ui-svelte';
	import { AlertTriangle } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	let formView: 'login' | 'forgotpsw' | 'register' = 'login';
	let loading = false;

	const {
		errors: loginErrors,
		enhance: loginEnhance,
		message: loginMessage
	} = superForm(data.loginForm, {
		invalidateAll: false,
		onSubmit() {
			loading = true;
		},
		onResult({ result }) {
			loading = false;
		}
	});

	const {
		errors: registerErrors,
		enhance: registerEnhance,
		message: registerMessage
	} = superForm(data.registerForm, {
		invalidateAll: false,
		onSubmit() {
			loading = true;
		},
		onResult({ result }) {
			loading = false;
		}
	});
</script>

<div class="mt-8 flex p-4 flex-col gap-y-8 mx-auto container">
	<h1 class="text-center text-2xl">Palestrina</h1>
	{#if formView === 'login'}
		{#if $page.status >= 400 && $loginMessage}
			<div class="alert variant-filled-error">
				<AlertTriangle />
				<span class="alert-message">{$loginMessage}</span>
			</div>
		{/if}
		<form action="?/login" method="post" class="flex flex-col space-y-8" use:loginEnhance>
			<div>
				<label class="label" for="email">Email</label>
				<input disabled={loading} class="input" name="email" type="text" />
				{#if $loginErrors.email}
					<small class="text-error-500">{$loginErrors.email[0]}</small>
				{/if}
			</div>
			<div>
				<label class="label" for="password">Password</label>
				<input disabled={loading} class="input" name="password" type="text" />
				{#if $loginErrors.password}
					<small class="text-error-500">{$loginErrors.password[0]}</small>
				{/if}
			</div>
			<button disabled={loading} class="btn variant-filled-primary" type="submit">Login</button>
			<button type="button" class="anchor cursor-pointer" on:click={(e) => (formView = 'register')}>
				Non hai un account?
			</button>
		</form>
	{:else if formView === 'register'}
		{#if $page.status >= 400 && $registerMessage}
			<div class="alert variant-filled-error">
				<AlertTriangle />
				<span class="alert-message">{$registerMessage}</span>
			</div>
		{/if}
		<form action="?/register" method="post" class="flex flex-col space-y-8" use:registerEnhance>
			<div>
				<label class="label" for="email">Email</label>
				<input disabled={loading} class="input" name="email" type="text" />
				{#if $registerErrors.email}
					<small class="text-error-500">{$registerErrors.email[0]}</small>
				{/if}
			</div>
			<div>
				<label class="label" for="password">Password</label>
				<input disabled={loading} class="input" name="password" type="text" />
				{#if $registerErrors.password}
					<small class="text-error-500">{$registerErrors.password[0]}</small>
				{/if}
			</div>
			<button disabled={loading} class="btn variant-filled-primary" type="submit">Registrati</button
			>
			<button type="button" class="anchor cursor-pointer" on:click={(e) => (formView = 'login')}
				>Hai già un account?</button
			>
		</form>
	{:else}
		forgotpsw
	{/if}
	<!-- TODO: Refactor with custom form -->
	<div class="hidden">
		<Auth
			additionalData={{}}
			supabaseClient={data.supabase}
			appearance={{
				theme: ThemeSupa,
				variables: {
					default: {
						colors: {
							brand: 'rgb(250 204 21)',
							inputBorder: 'rgb(250 204 21)',
							inputBorderFocus: 'rgb(59 130 246)',
							brandAccent: 'rgb(250 204 21)',
							anchorTextColor: 'rgb(250 204 21)',
							anchorTextHoverColor: 'rgb(250 204 21)'
						}
					}
				}
			}}
			redirectTo={`${data.url}/logging-in?redirect=/account`}
		/>
	</div>
</div>
