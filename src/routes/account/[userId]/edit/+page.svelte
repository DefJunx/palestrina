<script lang="ts">
	import { page } from '$app/stores';
	import { userStore } from '$src/lib/stores.js';
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

	let loading = false;
	let previewSrc = '';

	const previewAvatar = async (e: Event) => {
		const inputElement = e.target as HTMLInputElement;
		if (inputElement.files && inputElement.files.length !== 0) {
			const avatar = inputElement.files[0];
			previewSrc = URL.createObjectURL(avatar);
		}
	};
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
	class="mt-8 flex w-full flex-col space-y-8"
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
			class="input mt-1"
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
				src={previewSrc !== '' ? previewSrc : $userStore.avatarSrc}
				alt={$form.username ?? ''}
				initials={$userStore.avatarInitials}
				fallback="/images/user_placeholder.png"
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
