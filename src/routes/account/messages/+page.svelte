<script lang="ts">
  import Avatar from '$src/lib/components/Avatar.svelte';
  import { userStore } from '$src/lib/stores.js';
  import { ChevronRight, Plus } from 'lucide-svelte';

  export let data;

  const userProfileId = $userStore.profile.id;
</script>

<div class="flex items-center justify-between">
  <h1 class="h1">Conversazioni</h1>
  <button class="btn variant-filled-primary">
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
