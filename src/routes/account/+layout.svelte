<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import Avatar from '$src/lib/components/Avatar.svelte';
  import Navigation from '$src/lib/components/Navigation.svelte';
  import { userStore } from '$src/lib/stores.js';
  import {
    AppBar,
    AppShell,
    Drawer,
    LightSwitch,
    drawerStore,
    popup,
    toastStore,
    type PopupSettings
  } from '@skeletonlabs/skeleton';
  import { LogOut, Mail, Menu } from 'lucide-svelte';

  export let data;

  if (browser && data.newMessageCount > 0) {
    toastStore.trigger({
      message: 'Ci sono messaggi non letti',
      action: {
        label: 'Vai ai messaggi',
        response: () => goto('/account/messages')
      }
    });
  }

  $: ({ avatarSrc, avatarFallback, supabase, session, profile } = data);

  $: if (browser) userStore.set({ profile, avatarInitials: avatarFallback, avatarSrc });

  $: if (!session) goto('/');

  function drawerOpen(): void {
    if (browser) drawerStore.open();
  }

  const userPopup: PopupSettings = { event: 'click', target: 'userPopup', placement: 'bottom' };

  function goToMessages() {
    goto('/account/messages');
  }

  async function logout() {
    await supabase.auth.signOut();
  }
</script>

<Drawer bgDrawer="bg-primary-500">
  <Navigation profileId={profile.id} />
</Drawer>

<div class="card !z-[999] w-72 p-4 shadow-xl" data-popup="userPopup">
  <div class="flex flex-col gap-y-2">
    <button class="flex flex-row items-center gap-x-2" on:click={goToMessages}>
      <Mail class="block" />
      <span>Messaggi</span>
    </button>
    <hr />
    <button class="flex flex-row items-center gap-x-2" on:click={logout}>
      <LogOut class="block" />
      <span>Logout</span>
    </button>
  </div>
  <div class="arrow bg-surface-100-800-token" />
</div>

<AppShell slotSidebarLeft="w-0 md:w-52 bg-primary-500">
  <svelte:fragment slot="header">
    <AppBar shadow="shadow-lg" background="bg-primary-500">
      <svelte:fragment slot="lead">
        <button class="btn btn-sm mr-4 md:hidden" on:click={drawerOpen}>
          <Menu />
        </button>
        <strong class="text-xl uppercase">Palestrina</strong>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <button class="btn-icon block md:hidden" on:click={goToMessages}>
          <Mail />
        </button>
        <button class="btn-icon block md:hidden" on:click={logout}>
          <LogOut class="block" />
        </button>
        <button type="button" class="btn-icon hidden md:block" use:popup={userPopup}>
          <Avatar
            class="hidden md:block"
            bind:src={$userStore.avatarSrc}
            bind:initials={$userStore.avatarInitials}
            width="w-10"
          />
        </button>
        <button />
        <LightSwitch class="hidden md:block" bgDark="bg-primary-700" bgLight="bg-primary-200" />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <svelte:fragment slot="sidebarLeft">
    <Navigation profileId={profile.id} />
  </svelte:fragment>
  <div class="container mx-auto h-full p-4"><slot /></div>
</AppShell>
