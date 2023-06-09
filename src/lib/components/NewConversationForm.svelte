<script lang="ts">
  import type { Profile } from '@prisma/client';
  import { userStore } from '../stores';

  export let parent: any;
  export let users: Profile[];

  let profileId = $userStore.profile.id;
</script>

<div class="card w-modal space-y-4 p-4 shadow-xl">
  <form method="post" action="?/createNewConversation">
    <header class="text-2xl font-bold">Nuova conversazione</header>

    <fieldset class="space-y-4 border border-surface-500 p-4 rounded-container-token">
      <label class="label">
        <span>Destinatario</span>
        <select name="destinationId" class="select">
          {#each users as user}
            <option value={user.id}>{user.fullName}</option>
          {/each}
        </select>
      </label>
      <input type="hidden" name="test" value="true" />
      <input type="hidden" name="profileId" value={profileId} />
    </fieldset>

    <div class="mt-4 flex gap-2">
      <button class="btn {parent.buttonNeutral}" type="button" on:click={parent.onClose}
        >{parent.buttonTextCancel}</button
      >
      <button class="btn {parent.buttonPositive}" type="submit">Crea</button>
    </div>
  </form>
</div>
