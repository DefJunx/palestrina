<script lang="ts">
  import { page } from '$app/stores';
  import { dateFormatter } from '$src/lib/client/dateFormatter';
  import { Avatar, toastStore } from '@skeletonlabs/skeleton';
  import { Send } from 'lucide-svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;
  const { enhance, constraints, form, message } = superForm(data.form);
  const maxChars = 250;
  let typedChars = 0;
  let elemChat: HTMLElement;

  $: typedChars = $form.message.length;

  $: if ($page.status === 200 && $message) {
    toastStore.trigger({ message: $message });
    scrollChatBottom('smooth');
    $form.message = '';
  }

  function scrollChatBottom(behavior?: ScrollBehavior) {
    elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
  }
</script>

<div class="my-8 grid h-full grid-rows-[1fr_auto] gap-1">
  <div bind:this={elemChat} class="max-h-[70vh] space-y-4 overflow-y-auto p-4">
    {#each data.messages as message}
      <div class="py-2">
        {#if data.profile.id === message.sender.id}
          <div class="grid grid-cols-[1fr_auto] gap-2">
            <div class="card variant-filled-primary space-y-2 rounded-tr-none p-4">
              <header class="flex items-center justify-between">
                <p class="font-bold">{message.sender.fullName}</p>
                <small class="font-semibold opacity-50">{dateFormatter.format(message.createdAt)}</small>
              </header>
              <p class="w-fit max-w-[40vw] break-words">{message.text}</p>
            </div>

            <Avatar src={message.sender.avatarSrc} width="w-12" />
          </div>
        {:else}
          <div class="grid grid-cols-[auto_1fr] gap-2">
            <Avatar src={message.sender.avatarSrc} width="w-12" />

            <div class="card variant-filled-secondary space-y-2 rounded-tl-none p-4">
              <header class="flex items-center justify-between">
                <p>{message.sender.fullName}</p>
                <small class="font-semibold opacity-50">{dateFormatter.format(message.createdAt)}</small>
              </header>
              <p class="w-fit max-w-[40vw] break-words">{message.text}</p>
            </div>
          </div>
        {/if}
      </div>
    {/each}
    {#if data.messages.length === 0}
      <div class="flex h-full items-center justify-center">Non ci sono messaggi</div>
    {/if}
  </div>
  <div>
    <form
      method="post"
      action="?/sendMessage"
      class="input-group-divider input-group grid-cols-[auto_1fr_auto] rounded-container-token"
      use:enhance
    >
      <span class="input-group-shim p- inline-flex items-center justify-center px-3 py-2">
        {maxChars - typedChars}
      </span>
      <textarea
        class="resize-none border-0 bg-transparent ring-0"
        name="message"
        placeholder="Inserisci un messaggio"
        rows="1"
        on:keypress={(e) => {
          if (maxChars - typedChars === 0) {
            e.preventDefault();
            return false;
          }
          return e;
        }}
        bind:value={$form.message}
        {...$constraints.message}
      />
      <input type="hidden" name="senderId" value={data.profile.id} />
      <button
        type="submit"
        class="variant-filled-primary"
        disabled={$form.message === '' || maxChars - typedChars === 0}
      >
        <Send class="text-white" />
      </button>
    </form>
  </div>
</div>
