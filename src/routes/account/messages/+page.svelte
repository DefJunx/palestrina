<script lang="ts">
  // import { superForm } from 'sveltekit-superforms/client';

  export let data;

  // const { errors, constraints, form, enhance } = superForm(data.form);
</script>

<h1 class="h1">Conversazioni</h1>

<div class="mt-16">
  {#if data.conversations.length}
    {#each data.conversations as conversation}
      <a href={`/account/messages/${conversation.id}`}>
        {#if data.profile.id === conversation.sender.id}
          Conversazione con {conversation.receiver.fullName}
        {:else}
          Conversazione con {conversation.sender.fullName}
        {/if}
      </a>
    {/each}
  {:else}
    <div>Non ci sono messaggi</div>
  {/if}
</div>
