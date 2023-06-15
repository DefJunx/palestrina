<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import Avatar from '$src/lib/components/Avatar.svelte';
  import { userStore } from '$src/lib/stores';

  export let data;

  if (!data.profile.hasCompiled) {
    if (browser) {
      goto(`/account/${data.profile.id}/edit?new=true`);
    }
  }
</script>

<div class="w-full md:mx-auto md:max-w-5xl">
  <section class="border-primary rounded-lg border p-8">
    <div class="flex items-center gap-x-8">
      <Avatar
        width="w-32"
        bind:src={$userStore.profile.avatarPath}
        alt={data.profile.username ?? undefined}
        bind:initials={$userStore.avatarInitials}
      />
      <div class="flex flex-col">
        <span>Nome: {data.profile.fullName}</span>
        <span>Username: {data.profile.username}</span>
      </div>
    </div>
    <div class="mt-8">
      <a class="btn variant-filled-primary" href={`/account/${data.profile.id}/edit`}>Modifica il profilo</a>
    </div>
  </section>
  <section class="mt-4">
    <h2 class="text-xl font-bold">Parametri fitness</h2>
    <div class="border-primary mt-4 rounded-lg border p-8">
      {#if data.fitnessData.length}
        {#each data.fitnessData as param}
          <div>
            <strong>{param.label}:</strong>
            <span>{param.value}</span>
          </div>
        {/each}
      {:else}
        <div>Non ci sono dati</div>
      {/if}
      <hr class="text-primary border-primary my-4" />
      {#if data.profile.fitnessNotes}
        <div>
          <h2 class="text-lg font-semibold">Note</h2>
          <div
            class="border-primary prose mt-2 max-h-96 min-w-full overflow-y-scroll break-words border p-2 prose-p:text-white"
          >
            {@html data.profile.fitnessNotes}
          </div>
        </div>
      {/if}
      <div class="mt-4">
        <a class="btn variant-filled-primary" href={`/account/${data.profile.id}/fitness/edit`}>Modifica dati atleta</a>
      </div>
    </div>
  </section>
</div>
