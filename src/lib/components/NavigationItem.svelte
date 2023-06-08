<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { drawerStore } from '@skeletonlabs/skeleton';

  export let href: string;
  export let label: string;

  function drawerClose(): void {
    if (browser) drawerStore.close();
  }

  $: classesActive = (href: string) => (href === $page.url.pathname ? '!bg-secondary-500 !text-white' : '');
</script>

<a {href} class="flex items-center text-black {classesActive(href)}" on:click={drawerClose}>
  <slot name="icon" />
  <span>{label}</span>
</a>
