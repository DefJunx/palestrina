<script lang="ts">
  // import { superForm } from 'sveltekit-superforms/client';

  export let data;

  // const { errors, constraints, form, enhance } = superForm(data.form);
</script>

<h1 class="h1">Messaggi</h1>

<div class="mt-16">
  {#if data.conversations.length}
    {#each data.conversations as conversation}
      <pre>{JSON.stringify(conversation)}</pre>
    {/each}
  {:else}
    <div>Non ci sono messaggi</div>
  {/if}
</div>
