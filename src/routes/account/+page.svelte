<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { userStore } from '$src/lib/stores.js';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let data;

	if (!data.userProfile.has_compiled) {
		if (browser) {
			goto(`/account/${data.userProfile.id}/edit?new=true`);
		}
	}
</script>

<div class="w-full md:mx-auto md:max-w-5xl">
	<section class="border-primary rounded-lg border p-8">
		<div class="flex items-center gap-x-8">
			<Avatar
				class="w-32"
				src={$userStore.avatarSrc}
				alt={data.userProfile.username ?? ''}
				initials={$userStore.avatarInitials}
				fallback="/images/user_placeholder.png"
			/>
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
		<div class="border-primary mt-4 rounded-lg border p-8">
			{#if data.fitnessData.length}
				{#each data.fitnessData as param}
					<div>
						<strong>{param.label}:</strong>
						<span>{param.value}</span>
					</div>
				{/each}
			{:else}
				<div>Non ci sono dati</div>
			{/if}
			<hr class="text-primary border-primary my-4" />
			{#if data.userProfile.fitness_notes}
				<div>
					<h2 class="text-lg font-semibold">Note</h2>
					<div class="border-primary prose mt-2 min-w-full break-words border p-2">
						{@html data.userProfile.fitness_notes}
					</div>
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
