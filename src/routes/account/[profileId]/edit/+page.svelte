<script lang="ts">
  import { page } from '$app/stores';
  import Avatar from '$src/lib/components/Avatar.svelte';
  import { userStore } from '$src/lib/stores.js';

  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form, errors, enhance, submitting } = superForm(data.form, {
    invalidateAll: false
  });

  let previewSrc = $userStore.avatarSrc;
  let avatarAlt = $form.username ?? '';

  const previewAvatar = async (
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    const inputElement = e.currentTarget;

    if (inputElement.files && inputElement.files.length !== 0) {
      const avatar = inputElement.files[0];
      previewSrc = URL.createObjectURL(avatar);
    }
  };
</script>

<h1 class="w-full text-xl">
  {#if $page.url.searchParams.has('new')}
    Benvenuto su Palestrina! Per favore, compila la seguente form con i tuoi dati per procedere.
  {:else}
    Modifica il tuo profilo.
  {/if}
</h1>

<form method="post" class="mt-8 flex w-full flex-col space-y-8" use:enhance enctype="multipart/form-data">
  <div class="flex flex-col">
    <label class="label" for="username">Username</label>
    <input disabled={$submitting} class="input mt-1" type="text" name="username" bind:value={$form.username} />
    {#if $errors.username}
      <small class="font-semibold text-red-400">{$errors.username}</small>
    {/if}
  </div>
  <div class="flex flex-col">
    <label class="label" for="fullName">Nome</label>
    <input class="input mt-1" disabled={$submitting} type="text" name="fullName" bind:value={$form.fullName} />
    {#if $errors.fullName}
      <small class="font-semibold text-red-400">{$errors.fullName}</small>
    {/if}
  </div>
  <div class="flex flex-col">
    <label class="label" for="full_name">Avatar</label>
    <div class="mt-4 flex items-center gap-x-4">
      <Avatar bind:src={previewSrc} alt={avatarAlt} initials={$userStore.avatarInitials} />

      <input
        class="input"
        disabled={$submitting}
        type="file"
        name="avatar"
        accept="image/*"
        on:change={previewAvatar}
      />
    </div>
  </div>
  <button class="btn variant-filled-primary" disabled={$submitting} type="submit">Salva</button>
</form>
