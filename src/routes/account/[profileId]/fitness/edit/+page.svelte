<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';

  import TipTap from '$src/lib/components/TipTap.svelte';
  import { Minus } from 'lucide-svelte';

  export let data;

  let loading = false;
  let charsTyped = 0;
  let maxChars = 500;

  const { errors, enhance, form } = superForm(data.form, {
    dataType: 'json',
    onSubmit() {
      loading = true;
    },
    onResult() {
      loading = false;
    }
  });

  const addParameter = () => {
    $form.fitnessData = [...$form.fitnessData, { label: 'Nuovo parametro', value: '' }];
  };

  const removeParameter = (indexToRemove: number) => {
    $form.fitnessData = $form.fitnessData.filter((el, idx) => idx !== indexToRemove);
  };
</script>

<h1 class="w-full text-xl">Modifica parametri atleta</h1>

<form method="post" class=" mt-8 w-full" use:enhance>
  <div class="border-primary flex flex-col space-y-8 border p-8">
    {#each $form.fitnessData as _, i}
      <div class="flex items-center gap-x-4">
        <div>
          <label class="label" for={`label_${i}`}>Nome parametro</label>
          <input
            id={`label_${i}`}
            class="input"
            type="text"
            disabled={loading}
            bind:value={$form.fitnessData[i].label}
          />
          {#if $errors.fitnessData?.[i]?.label}
            <small class="font-semibold text-red-400">{$errors.fitnessData[i]?.label}</small>
          {/if}
        </div>
        <span class="pt-6">:</span>
        <div class="w-full">
          <label for={`value_${i}`}>Valore parametro</label>
          <input
            id={`value_${i}`}
            class="input"
            type="text"
            disabled={loading}
            bind:value={$form.fitnessData[i].value}
          />
          {#if $errors.fitnessData?.[i]?.value}
            <small class="font-semibold text-red-400">{$errors.fitnessData[i]?.value}</small>
          {/if}
        </div>
        <button disabled={loading} class="btn-icon mt-6" on:click={() => removeParameter(i)}>
          <Minus />
        </button>
      </div>
    {/each}

    <button class="btn variant-ghost" disabled={loading} type="button" on:click={addParameter}
      >Aggiungi parametro</button
    >
  </div>

  <div class="border-primary my-4 border p-8">
    <TipTap bind:content={$form.fitnessNotes} bind:charsTyped bind:maxChars />
    {#if charsTyped >= maxChars}
      <span>troppi caratteri</span>
    {/if}
    <span>{maxChars - charsTyped} / {maxChars}</span>
  </div>

  <button disabled={loading || charsTyped >= maxChars} type="submit" class="btn variant-filled-primary">Salva</button>
</form>
