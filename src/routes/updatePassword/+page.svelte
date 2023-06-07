<script lang="ts">
  import { page } from '$app/stores';
  import { AlertTriangle } from 'lucide-svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { errors, constraints, enhance, message } = superForm(data.form);
</script>

<form method="post" use:enhance class="container mx-auto mt-8 space-y-6">
  <p class="text-center text-lg">Imposta una nuova password per il tuo account</p>
  {#if $page.status >= 400 && $message}
    <div class="variant-filled-error alert">
      <AlertTriangle />
      <span class="alert-message">{$message}</span>
    </div>
  {/if}
  <div>
    <label for="newPassword" class="label">Nuova Password</label>
    <input name="newPassword" type="text" class="input" {...$constraints.newPassword} />
    {#if $errors.newPassword}
      <small class="text-error-500">{$errors.newPassword[0]}</small>
    {/if}
  </div>
  <div>
    <label for="confirmNewPassword" class="label">Conferma Nuova Password</label>
    <input name="confirmNewPassword" type="text" class="input" {...$constraints.confirmNewPassword} />
    {#if $errors.confirmNewPassword}
      <small class="text-error-500">{$errors.confirmNewPassword[0]}</small>
    {/if}
  </div>
  <button class="btn variant-filled-primary" type="submit">Invia</button>
</form>
