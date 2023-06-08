<script lang="ts">
  import { Avatar } from '@skeletonlabs/skeleton';
  import { userStore } from '../stores';

  export let src = $userStore.avatarSrc;
  export let initials = $userStore.avatarInitials;
  export let fallback = '/images/user_placeholder.png';
  export let width = 'w-10';
  export let alt = 'Avatar image';
  let className = '';

  export { className as class };
  // export let class ="";
</script>

<Avatar class={className} {src} {initials} {fallback} {width} {alt} />
