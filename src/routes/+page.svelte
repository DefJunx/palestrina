<script lang="ts">
  import { page } from '$app/stores';
  import { toastStore } from '@skeletonlabs/skeleton';
  import { AlertTriangle } from 'lucide-svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  let formView: 'login' | 'forgotpsw' | 'register' = 'login';
  let loading = false;

  const {
    errors: loginErrors,
    enhance: loginEnhance,
    message: loginMessage
  } = superForm(data.loginForm, {
    invalidateAll: false,
    onSubmit() {
      loading = true;
    },
    onResult() {
      loading = false;
    }
  });

  const {
    errors: registerErrors,
    enhance: registerEnhance,
    message: registerMessage
  } = superForm(data.registerForm, {
    invalidateAll: false,
    onSubmit() {
      loading = true;
    },
    onResult() {
      loading = false;
    }
  });

  const {
    errors: forgotPasswordErrors,
    enhance: forgotPasswordEnhance,
    message: forgotPasswordMessage
  } = superForm(data.forgotPasswordForm, {
    invalidateAll: false,
    onSubmit() {
      loading = true;
    },
    onResult() {
      loading = false;
    }
  });

  $: {
    if ($page.status === 200) {
      if ($registerMessage) {
        toastStore.trigger({ message: $registerMessage });
      }
      if ($forgotPasswordMessage) {
        toastStore.trigger({ message: $forgotPasswordMessage });
      }
    }
  }
</script>

<div class="container mx-auto mt-8 flex flex-col gap-y-8 p-4">
  <h1 class="text-center text-2xl">Palestrina</h1>
  {#if formView === 'login'}
    <p class="text-center text-lg">Inserisci le tue credenziali per continuare.</p>
    {#if $page.status >= 400 && $loginMessage}
      <div class="variant-filled-error alert">
        <AlertTriangle />
        <span class="alert-message">{$loginMessage}</span>
      </div>
    {/if}
    <form action="?/login" method="post" class="flex flex-col space-y-8" use:loginEnhance>
      <div>
        <label class="label" for="email">Email</label>
        <input disabled={loading} class="input" name="email" type="text" />
        {#if $loginErrors.email}
          <small class="text-error-500">{$loginErrors.email}</small>
        {/if}
      </div>
      <div>
        <label class="label" for="password">Password</label>
        <input disabled={loading} class="input" name="password" type="password" />
        {#if $loginErrors.password}
          <small class="text-error-500">{$loginErrors.password}</small>
        {/if}
      </div>
      <button disabled={loading} class="btn variant-filled-primary" type="submit">Login</button>
      <hr class="divider border-t-2" />
      <div class="flex flex-col justify-center">
        <button type="button" class="anchor cursor-pointer" on:click={() => (formView = 'register')}>
          Non hai un account?
        </button>
        <button type="button" class="anchor cursor-pointer" on:click={() => (formView = 'forgotpsw')}>
          Password dimenticata?
        </button>
      </div>
    </form>
  {:else if formView === 'register'}
    <p class="text-center text-lg">Crea un nuovo account inserendo email e password.</p>
    {#if $page.status >= 400 && $registerMessage}
      <div class="variant-filled-error alert">
        <AlertTriangle />
        <span class="alert-message">{$registerMessage}</span>
      </div>
    {/if}
    <form action="?/register" method="post" class="flex flex-col space-y-8" use:registerEnhance>
      <div>
        <label class="label" for="email">Email</label>
        <input disabled={loading} class="input" name="email" type="text" />
        {#if $registerErrors.email}
          <small class="text-error-500">{$registerErrors.email}</small>
        {/if}
      </div>
      <div>
        <label class="label" for="password">Password</label>
        <input disabled={loading} class="input" name="password" type="password" />
        {#if $registerErrors.password}
          <small class="text-error-500">{$registerErrors.password}</small>
        {/if}
      </div>
      <button disabled={loading} class="btn variant-filled-primary" type="submit">Registrati</button>
      <hr class="divider border-t-2" />
      <button type="button" class="anchor cursor-pointer" on:click={() => (formView = 'login')}
        >Hai già un account?</button
      >
    </form>
  {:else}
    <p class="text-center text-lg">
      Inserisci la tua email per ricevere un link per il reset della password. (Controlla lo spam!)
    </p>
    {#if $page.status >= 400 && $forgotPasswordMessage}
      <div class="variant-filled-error alert">
        <AlertTriangle />
        <span class="alert-message">{$forgotPasswordMessage}</span>
      </div>
    {/if}
    <form action="?/forgotPassword" method="post" class="flex flex-col space-y-8" use:forgotPasswordEnhance>
      <div>
        <label class="label" for="email">Email</label>
        <input disabled={loading} class="input" name="email" type="text" />
        {#if $forgotPasswordErrors.email}
          <small class="text-error-500">{$forgotPasswordErrors.email}</small>
        {/if}
      </div>
      <button disabled={loading} class="btn variant-filled-primary" type="submit">Invia</button>
      <hr class="divider border-t-2" />
      <button type="button" class="anchor cursor-pointer" on:click={() => (formView = 'login')}
        >Hai già un account?</button
      >
    </form>
  {/if}
</div>
