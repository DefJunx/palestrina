<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar } from '@skeletonlabs/skeleton';

	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, errors, enhance } = superForm(data.form, {
		onSubmit() {
			loading = true;
		},
		onResult() {
			loading = false;
		}
	});

	let avatarFallback = '';
	let avatarSrc = data.avatarSrc;
	let loading = false;

	const previewAvatar = async (e: Event) => {
		const inputElement = e.target as HTMLInputElement;
		if (inputElement.files && inputElement.files.length !== 0) {
			const avatar = inputElement.files[0];
			avatarSrc = URL.createObjectURL(avatar);
		}
	};

	$: {
		if ($form.full_name) {
			const nameParts = $form.full_name.split(' ');
			const initials = nameParts.map((part: string) => part.charAt(0).toUpperCase());
			avatarFallback = initials.join('');
		}
	}
</script>

<h1 class="w-full text-xl">
	{#if $page.url.searchParams.has('new')}
		Benvenuto su Palestrina! Per favore, compila la seguente form con i tuoi dati per procedere.
	{:else}
		Modifica il tuo profilo.
	{/if}
</h1>

<form
	method="post"
	class="flex w-full flex-col space-y-8 mt-8"
	use:enhance
	enctype="multipart/form-data"
>
	<div class="flex flex-col">
		<label class="label" for="username">Username</label>
		<input
			disabled={loading}
			class="input mt-1"
			type="text"
			name="username"
			bind:value={$form.username}
		/>
		{#if $errors.username}
			<small class="font-semibold text-red-400">{$errors.username}</small>
		{/if}
	</div>
	<div class="flex flex-col">
		<label class="label" for="full_name">Nome</label>
		<input
			class="mt-1 input"
			disabled={loading}
			type="text"
			name="full_name"
			bind:value={$form.full_name}
		/>
		{#if $errors.full_name}
			<small class="font-semibold text-red-400">{$errors.full_name}</small>
		{/if}
	</div>
	<div class="flex flex-col">
		<label class="label" for="full_name">Avatar</label>
		<div class="mt-4 flex items-center gap-x-4">
			<Avatar
				src={avatarSrc}
				alt={$form.username ?? ''}
				initials={avatarFallback !== '' ? avatarFallback : 'NU'}
				fallback={avatarFallback}
			/>
			<input
				class="input"
				disabled={loading}
				type="file"
				name="avatar"
				accept="image/*"
				on:change={previewAvatar}
			/>
		</div>
	</div>
	<input type="hidden" name="originalPath" value={data.avatarPath} />
	<button class="btn variant-filled-primary" disabled={loading} type="submit">Salva</button>
</form>
