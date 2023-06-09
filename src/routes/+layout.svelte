<script lang="ts">
  // The ordering of these imports is critical to your app working properly
  import '../theme.postcss';
  // If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
  import '@skeletonlabs/skeleton/styles/skeleton.css';
  // Most of your app wide CSS should be put in this file
  import '../app.postcss';

  import { invalidate } from '$app/navigation';
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
  import { Modal, Toast, storePopup } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  export let data;

  $: ({ supabase, session } = data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<Toast position="t" background="bg-primary-500" color="text-black" />
<Modal />

<svelte:head>
  <title>Palestrina</title>
  <meta name="description" content="Stay fit" />
</svelte:head>

<slot />
