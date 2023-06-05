<script lang="ts">
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { Auth } from '@supabase/auth-ui-svelte';

	export let data;

	let status: 'login' | 'forgotpsw' | 'register' = 'login';
</script>

<div class="flex h-screen items-center justify-center">
	<div class="flex p-4 flex-col gap-y-8 mx-auto container">
		<h1 class="text-center text-2xl">Palestrina</h1>
		<!-- TODO: Refactor with custom form -->
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
