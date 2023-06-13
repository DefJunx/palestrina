<script lang="ts">
  import '../theme.postcss';

  import '@skeletonlabs/skeleton/styles/skeleton.css';

  import '../app.postcss';

  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
  import { Modal, Toast, storePopup } from '@skeletonlabs/skeleton';

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<Toast position="t" background="bg-primary-500" color="text-black" />
<Modal />

<svelte:head>
  <title>Palestrina</title>
  <meta name="description" content="Stay fit" />
</svelte:head>

<slot />
