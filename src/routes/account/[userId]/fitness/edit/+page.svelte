<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	import TipTap from '$src/lib/components/TipTap.svelte';

	import type { SubmitFunction } from '@sveltejs/kit';
	import { Minus } from 'lucide-svelte';

	export let data;
	export let form;

	const { userProfile } = data;

	let loading = false;
	let notes = data.notesContent;

	const addParameter = () => {
		fitnessData = [...fitnessData, ['Nuovo parametro', '']];
	};

	const removeParameter = (indexToRemove: number) => {
		fitnessData = fitnessData.filter((el, idx) => idx !== indexToRemove);
	};

	const handleSubmit: SubmitFunction = ({ formData }) => {
		loading = true;

		return async ({ update, result }) => {
			await update();
			loading = false;

			if (result.type === 'success') {
				goto('/account');
			}
		};
	};

	let fitnessData = userProfile.fitness_data
		? Object.entries(userProfile.fitness_data as Record<string, any>)
		: [];
</script>

<h1 class="w-full text-xl">Modifica parametri atleta</h1>

<form method="post" class=" w-full mt-8" use:enhance={handleSubmit}>
	{#if form?.error}
		<div class="mb-8">
			<!-- <ErrorAlert description={form?.errorMessage ?? 'Si è verificato un errore'} /> -->
		</div>
	{/if}
	<div class="p-8 border border-primary space-y-8 flex-col flex">
		{#each fitnessData as [name, value], i}
			<div class="flex items-center gap-x-4">
				<div>
					<label for="">Nome parametro</label>
					<input class="input" disabled={loading} bind:value={name} />
				</div>
				<span class="pt-6">:</span>
				<div class="w-full">
					<label for="">Valore parametro</label>
					<input class="input" disabled={loading} bind:value />
				</div>
				<input
					type="hidden"
					name={form?.fitnessData?.[name]?.name ?? name}
					value={form?.fitnessData?.[name]?.value ?? value}
				/>
				<button disabled={loading} class="btn-icon" on:click={(e) => removeParameter(i)}>
					<Minus /></button
				>
			</div>
		{/each}
		<button class="btn variant-ghost" disabled={loading} type="button" on:click={addParameter}
			>Aggiungi parametro</button
		>
	</div>

	<div class="mt-4 p-8 border border-primary">
		<TipTap bind:content={notes} />
		<input type="hidden" name="fitness_notes" value={notes} />
	</div>

	<button disabled={loading} type="submit" class="btn variant-filled-primary">Salva</button>
</form>
