<script lang="ts">
  import { dateFormatter } from '$src/lib/client/dateFormatter';
  import { Avatar } from '@skeletonlabs/skeleton';

  export let data;
</script>

{#each data.messages as message}
  <div class="my-8">
    {#if data.profile.id !== message.sender.id}
      <div class="grid grid-cols-[auto_1fr] gap-2">
        <Avatar src={message.sender.avatarSrc} width="w-12" />

        <div class="card variant-filled-secondary space-y-2 rounded-tl-none p-4">
          <header class="flex items-center justify-between">
            <p class="font-bold">{message.sender.fullName}</p>
            <small class="font-semibold opacity-50">{dateFormatter.format(message.createdAt)}</small>
          </header>
          <p>{message.text}</p>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-[1fr_auto] gap-2">
        <div class="card variant-filled-primary space-y-2 rounded-tr-none p-4">
          <header class="flex items-center justify-between">
            <p class="font-bold">{message.sender.fullName}</p>
            <small class="font-semibold opacity-50">{dateFormatter.format(message.createdAt)}</small>
          </header>
          <p>{message.text}</p>
        </div>
        <Avatar src={message.sender.avatarSrc} width="w-12" />
      </div>
    {/if}
  </div>
{/each}
