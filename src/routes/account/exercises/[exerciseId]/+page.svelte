<script lang="ts">
  import { toastStore } from '@skeletonlabs/skeleton';
  import { ChevronLeft } from 'lucide-svelte';
  import { superForm } from 'sveltekit-superforms/client';

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import TipTap from '$src/lib/components/TipTap.svelte';

  export let data;

  const isNewExercise = $page.params.exerciseId === 'new';
  const formAction = isNewExercise ? '?/createExercise' : '?/editExercise';

  const { errors, form, enhance, constraints, submitting } = superForm(data.form, {
    onResult({ result }) {
      if (result.type === 'failure') {
        toastStore.trigger({
          message:
            result?.data?.form?.message ??
            "Si è verificato un errore con la creazione dell'esercizio. Si prega di riprovare più tardi"
        });
        return;
      }

      // if (result.type === 'success') {
      //   toastStore.trigger({ message: 'Esercizio creato.' });
      //   return goto('./');
      // }
    }
  });

  let photos: FileList | undefined;
  let videos: FileList | undefined;
  let charsTyped = 0;
  let maxChars = 400;
</script>

<div class="flex items-center gap-2">
  <button class="btn-icon" on:click|preventDefault={() => goto('./')}><ChevronLeft /></button>
  <h1 class="text-2xl">{isNewExercise ? 'Nuovo esercizio' : 'Modifica esercizio'}</h1>
</div>

<form enctype="multipart/form-data" use:enhance method="post" action={formAction} class="mt-12 flex flex-col space-y-6">
  <div>
    <label class="label">
      <span>Nome esercizio</span>
      <input class="input" type="text" name="name" bind:value={$form.name} {...$constraints.name} />
      {#if $errors.name}
        <small class="font-semibold text-red-400">{$errors.name}</small>
      {/if}
    </label>
  </div>

  <div>
    <label class="label">
      <span>Descrizione</span>

      <TipTap bind:content={$form.description} bind:charsTyped {maxChars} />
      <input type="hidden" name="description" bind:value={$form.description} />
    </label>

    <span>{maxChars - charsTyped} / {maxChars}</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <label class="label">
      <span>Foto</span>
      <input type="file" class="input" name="photo" accept="image/*" bind:files={photos} />
    </label>

    <label class="label">
      <span>Video</span>
      <input type="file" class="input" name="video" accept="video/*" bind:files={videos} />
    </label>
  </div>

  <div class="text-right">
    <button disabled={$submitting} class="md:btn-lg btn variant-filled-primary" type="submit"
      >{isNewExercise ? 'Crea' : 'Salva modifiche'}</button
    >
  </div>
</form>
