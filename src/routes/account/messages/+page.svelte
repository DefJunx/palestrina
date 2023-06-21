<script lang="ts">
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import Avatar from '$src/lib/components/Avatar.svelte';
  import NewConversationForm from '$src/lib/components/NewConversationForm.svelte';
  import { userStore } from '$src/lib/stores';
  import { modalStore, toastStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
  import { ChevronRight, Plus, Trash } from 'lucide-svelte';
  import type { SubmitFunction } from './$types';

  export let data;

  if (browser && $page.status === 400) {
    toastStore.trigger({ message: 'Errore nella creazione di una conversazione. Si prega di riprovare più tardi' });
  }

  const userProfileId = $userStore.profile.id;

  const modalComponent: ModalComponent = {
    ref: NewConversationForm,
    props: {
      users: data.users
    },
    slot: '<div>loading...</div>'
  };
  const modal: ModalSettings = {
    type: 'component',
    // Pass the component directly:
    component: modalComponent
  };

  const openNewConversationModal = () => {
    if (browser) {
      modalStore.trigger(modal);
    }
  };

  const submitDeleteConversation: SubmitFunction = async ({ cancel }) => {
    const deleteConfirmed = await new Promise<boolean>((resolve) => {
      const modal: ModalSettings = {
        type: 'confirm',
        title: 'Conferma',
        body: 'Sei sicuro di voler cancellare la conversazione selezionata?',
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
          toastStore.trigger({ message: 'Conversazione cancellata con sucesso' });
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

<div class="flex items-center justify-between">
  <h1 class="h1">Conversazioni</h1>
  <button type="button" class="btn variant-filled-primary" on:click={openNewConversationModal}>
    <Plus />
    Nuova
  </button>
</div>

<div class="mt-16 flex flex-col gap-2">
  {#if data.conversations.length}
    {#each data.conversations as conversation}
      <div class="flex items-center gap-2">
        <a class="grow" href={`/account/messages/${conversation.id}`}>
          <div class="flex items-center gap-2 rounded-md bg-primary-500 p-2 text-black">
            <div class="flex gap-1">
              {#each conversation.participants as participant}
                <Avatar src={participant.avatarPath} alt={participant.fullName ?? 'Avatar Image'} width="w-12" />
              {/each}
            </div>
            <div class="grow">
              {conversation.participants.map((p) => (p.id === userProfileId ? 'Tu' : p.fullName)).join(', ')}
            </div>
            <div>
              <ChevronRight />
            </div>
          </div>
        </a>
        <form action="?/deleteConversation" method="post" use:enhance={submitDeleteConversation}>
          <input type="hidden" name="conversationId" value={conversation.id} />
          <button type="submit">
            <Trash />
          </button>
        </form>
      </div>
    {/each}
  {:else}
    <div>
      <span>Non ci sono conversazioni.</span>
      <button on:click={openNewConversationModal} class="anchor" type="button">Iniziane una!</button>
    </div>
  {/if}
</div>
