<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	import TipTap from '$src/lib/components/TipTap.svelte';

	import type { SubmitFunction } from '@sveltejs/kit';
	import { AlertTriangle, Minus } from 'lucide-svelte';

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

<form method="post" class=" mt-8 w-full" use:enhance={handleSubmit}>
	{#if form?.error}
		<div class="mb-8">
			<div class="variant-filled-error alert">
				<AlertTriangle />
				<div class="alert-message">{form?.errorMessage ?? 'Si è verificato un errore'}</div>
			</div>
			<!-- <ErrorAlert description={form?.errorMessage ?? 'Si è verificato un errore'} /> -->
		</div>
	{/if}
	<div class="border-primary flex flex-col space-y-8 border p-8">
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

	<div class="border-primary my-4 border p-8">
		<TipTap bind:content={notes} />
		<input type="hidden" name="fitness_notes" value={notes} />
	</div>

	<button disabled={loading} type="submit" class="btn variant-filled-primary">Salva</button>
</form>
