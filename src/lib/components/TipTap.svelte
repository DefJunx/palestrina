<script lang="ts">
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import { Heading1, Heading2, List, ListOrdered, Minus, Pilcrow } from 'lucide-svelte';
  import { onDestroy, onMount } from 'svelte';

  let editor: Editor;
  let element: HTMLDivElement;
  export let content = '';

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [StarterKit],
      content,
      onUpdate({ editor }) {
        content = editor.getHTML();
      },
      onTransaction() {
        editor = editor;
      },
      editorProps: {
        attributes: {
          class: 'prose dark:prose-invert prose-sm sm:prose-base border border-primary min-w-full focus:outline-none'
        }
      }
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

{#if editor}
  <div class="flex items-center gap-x-2">
    <button
      class="btn btn-sm {editor.isActive('heading', { level: 1 }) ? 'variant-filled-primary' : 'variant-ghost'}"
      type="button"
      on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
    >
      <Heading1 />
    </button>
    <button
      class="btn btn-sm {editor.isActive('heading', { level: 2 }) ? 'variant-filled-primary' : 'variant-ghost'}"
      type="button"
      on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    >
      <Heading2 />
    </button>
    <button
      class="btn btn-sm {editor.isActive('paragraph') ? 'variant-filled-primary' : 'variant-ghost'}"
      type="button"
      on:click={() => editor.chain().focus().setParagraph().run()}
    >
      <Pilcrow />
    </button>
    <button
      class="btn btn-sm {editor.isActive('bulletList') ? 'variant-filled-primary' : 'variant-ghost'}"
      type="button"
      on:click={() => editor.chain().focus().toggleBulletList().run()}
    >
      <List />
    </button>
    <button
      class="btn btn-sm {editor.isActive('orderedList') ? 'variant-filled-primary' : 'variant-ghost'}"
      type="button"
      on:click={() => editor.chain().focus().toggleOrderedList().run()}
    >
      <ListOrdered />
    </button>
    <button
      class="btn btn-sm {editor.isActive('horizontalRule') ? 'variant-filled-primary' : 'variant-ghost'}"
      type="button"
      on:click={() => editor.chain().focus().setHorizontalRule().run()}
    >
      <Minus />
    </button>
  </div>
{:else}
  <div>Loading...</div>
{/if}

<div class="mt-4" bind:this={element} />
