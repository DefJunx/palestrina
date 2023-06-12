<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { modalStore, toastStore, type ModalSettings } from '@skeletonlabs/skeleton';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { Edit, Plus, Trash } from 'lucide-svelte';

  export let data;

  const deleteExercise: SubmitFunction = async ({ cancel }) => {
    const deleteConfirmed = await new Promise<boolean>((resolve) => {
      const modal: ModalSettings = {
        type: 'confirm',
        title: 'Conferma',
        body: "Sei sicuro di voler cancellare l'esercizio selezionato?",
        response: (r: boolean) => {
          resolve(r);
        }
      };
      modalStore.trigger(modal);
    }).then((r: boolean) => r);

    if (!deleteConfirmed) {
      cancel();
    }

    return ({ update, result }) => {
      switch (result.type) {
        case 'success':
          toastStore.trigger({ message: 'Esercizio cancellato con sucesso' });
          update();
          break;
        case 'error':
          toastStore.trigger({ message: 'Si è verificato un errore imprevisto. Si prega di riprovare più tardi' });
          break;
        default:
          throw new Error('unexpected case');
      }
    };
  };
</script>

<div class="flex justify-between">
  <h1 class="text-2xl">Gestione esercizi</h1>
  <button
    on:click={() => goto('/account/exercises/new')}
    class="btn variant-filled-primary inline-flex items-center gap-1"
  >
    <Plus />
    Nuovo
  </button>
</div>

<div class="mt-12">
  {#if data.exercises.length}
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {#each data.exercises as exercise}
        <div class="card card-hover overflow-hidden">
          <header>
            <img class="aspect-square w-full bg-black/50" src={exercise.photoSrc} alt="Exercise" />
          </header>
          <div class="p-4">{exercise.name}</div>
          <footer class="card-footer flex justify-end">
            <a href={`./exercises/${exercise.id}`} class="btn-icon">
              <Edit />
            </a>
            <form use:enhance={deleteExercise} action="?/deleteExercise" method="post">
              <input type="hidden" name="exerciseId" value={exercise.id} />
              <button type="submit" class="btn-icon">
                <Trash />
              </button>
            </form>
          </footer>
        </div>
      {/each}
    </div>
  {:else}
    <div>Non ci sono ancora esercizi.</div>
  {/if}
</div>
