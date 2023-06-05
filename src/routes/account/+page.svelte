<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { getAvatarFallbackfromName } from '$src/lib/utils.js';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let data;

	let fallback = '';
	let src = data.avatarSrc;

	if (!data.userProfile.has_compiled) {
		if (browser) {
			goto(`/account/${data.userProfile.id}/profileEdit?new=true`);
		}
	}

	$: {
		if (data.userProfile.full_name) {
			fallback = getAvatarFallbackfromName(data.userProfile.full_name);
		}
	}
</script>

<div class="w-full md:max-w-5xl md:mx-auto">
	<section class="p-8 border border-primary rounded-lg">
		<div class="flex gap-x-8 items-center">
			<Avatar class="w-32" {src} alt={data.userProfile.username ?? ''} {fallback} />
			<div class="flex flex-col">
				<span>Nome: {data.userProfile.full_name}</span>
				<span>Username: {data.userProfile.username}</span>
			</div>
		</div>
		<div class="mt-8">
			<a class="btn variant-filled-primary" href={`/account/${data.userProfile.id}/edit`}
				>Modifica il profilo</a
			>
		</div>
	</section>
	<section class="mt-4">
		<h2 class="text-xl font-bold">Parametri fitness</h2>
		<div class="p-8 border border-primary rounded-lg mt-4">
			{#if data.userProfile.fitness_data}
				{#each Object.entries(data.userProfile.fitness_data) as [title, value]}
					<div>
						<strong>{title}</strong>
						<span>{value}</span>
					</div>
				{/each}
			{:else}
				<div>Non ci sono dati</div>
			{/if}
			<hr class="text-primary my-4 border-primary" />
			{#if data.userProfile.fitness_notes}
				<div>
					<h2 class="text-lg font-semibold">Note</h2>
					<div
						class="mt-2 prose break-words p-2 border border-primary min-w-full"
						bind:innerHTML={data.userProfile.fitness_notes}
						contenteditable="false"
					/>
				</div>
			{/if}
			<div class="mt-4">
				<a class="btn variant-filled-primary" href={`/account/${data.userProfile.id}/fitness/edit`}
					>Modifica dati atleta</a
				>
			</div>
		</div>
	</section>
</div>
