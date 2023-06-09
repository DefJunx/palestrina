<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import Avatar from '$src/lib/components/Avatar.svelte';
  import NewConversationForm from '$src/lib/components/NewConversationForm.svelte';
  import { userStore } from '$src/lib/stores';
  import { modalStore, toastStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
  import { ChevronRight, Plus } from 'lucide-svelte';

  export let data;

  if (browser && $page.status === 400) {
    toastStore.trigger({ message: 'Errore nella creazione di una conversazione. Si prega di riprovare più tardi' });
  }

  const userProfileId = $userStore.profile.id;

  const modalComponent: ModalComponent = {
    ref: NewConversationForm,
    props: {
      users: data.users
    }
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
      <a href={`/account/messages/${conversation.id}`}>
        <div class="flex items-center gap-2 rounded-md bg-primary-500 p-2 text-black">
          <div class="flex gap-1">
            {#each conversation.participants as participant}
              <Avatar src={participant.avatarSrc} alt={participant.fullName ?? 'Avatar Image'} width="w-12" />
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
    {/each}
  {:else}
    <div>Non ci sono messaggi</div>
  {/if}
</div>
