<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

{#each data.messages as message}
  <div class="my-8">
    {#if data.profile.id === message.receiverId}
      <div class="grid grid-cols-[auto_1fr] gap-2">
        <div class="card variant-filled-secondary space-y-2 rounded-tl-none p-4">
          <header class="flex items-center justify-between">
            <p class="font-bold">{message.receiverId}</p>
            <small class="opacity-50">{message.createdAt}</small>
          </header>
          <p>{message.text}</p>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-[1fr_auto] gap-2">
        <div class="card variant-filled-primary space-y-2 rounded-tr-none p-4">
          <header class="flex items-center justify-between">
            <p class="font-bold">{message.senderId}</p>
            <small class="opacity-50">{message.createdAt}</small>
          </header>
          <p>{message.text}</p>
        </div>
      </div>
    {/if}
  </div>
{/each}
