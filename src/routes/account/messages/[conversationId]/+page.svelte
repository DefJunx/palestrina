<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { dateFormatter } from '$src/lib/client/dateFormatter.js';
  import pusherClient from '$src/lib/client/pusher';
  import Avatar from '$src/lib/components/Avatar.svelte';
  import type { Message, Profile } from '@prisma/client';
  import { toastStore } from '@skeletonlabs/skeleton';
  import { Send } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;
  const { enhance, constraints, form, message } = superForm(data.form);
  const maxChars = 250;
  let typedChars = 0;
  let elemChat: HTMLElement;
  let submitButton: HTMLButtonElement;

  $: typedChars = $form.message.length;

  $: if ($page.status === 200 && $message) {
    if (browser) toastStore.trigger({ message: $message });
    scrollChatBottom('smooth');
    $form.message = '';
  }

  function scrollChatBottom(behavior?: ScrollBehavior) {
    elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
  }

  const handleKeydown = (
    e: KeyboardEvent & {
      currentTarget: EventTarget & HTMLTextAreaElement;
    }
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitButton.click();
    }
  };

  onMount(() => {
    const chat = pusherClient.subscribe($page.params.conversationId);
    chat.bind('new-message', (newMessage: Message & { sender: Profile & { avatarSrc: string } }) => {
      console.log(newMessage);

      if (newMessage.senderId === data.profile.id) {
        return;
      }

      newMessage.createdAt = new Date(newMessage.createdAt);

      data.messages = [...data.messages, newMessage];

      setTimeout(() => {
        scrollChatBottom('smooth');
      }, 250);
    });

    return () => {
      chat.unsubscribe();
      chat.unbind('new-message');
    };
  });
</script>

<div class="grid h-full grid-rows-[auto_1fr_auto] gap-1">
  <div class="bg-primary-400 p-4 text-black">
    {#each data.conversation.participants.filter((p) => p.id !== data.profile.id) as participant}
      <div class="flex gap-1">
        <span>{participant.fullName}</span>
      </div>
    {/each}
  </div>
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

            <Avatar src={message.sender.avatarPath} width="w-12" />
          </div>
        {:else}
          <div class="grid grid-cols-[auto_1fr] gap-2">
            <Avatar src={message.sender.avatarPath} width="w-12" />

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
        on:keydown={handleKeydown}
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

      <input
        type="hidden"
        name="receiverId"
        value={data.conversation.participants.filter((p) => p.id !== data.profile.id)[0]}
      />

      <button
        bind:this={submitButton}
        type="submit"
        class="variant-filled-primary"
        disabled={$form.message === '' || maxChars - typedChars === 0}
      >
        <Send class="text-white" />
      </button>
    </form>
  </div>
</div>
