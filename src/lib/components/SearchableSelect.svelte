<script lang="ts">
  import Select from 'svelte-select';

  export let name = '';
  export let value: string | null = null;
  export let items: { label: string; value: string }[] = [];
  let justValue: string | null;
</script>

<div class="themed">
  <Select {items} bind:value bind:justValue />
  <input type="hidden" {name} value={justValue} />
</div>

<style>
  .themed {
    --item-color: black;
    --list-background: rgb(var(--color-surface-800));
    --item-hover-bg: rgb(var(--color-surface-800));
    --selected-item-color: black;
    --item-is-active-bg: rgb(var(--color-primary-500));
  }
</style>
