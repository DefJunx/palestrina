<script lang="ts">
	import { Calendar, ClipboardEdit, Dumbbell, Home, User } from 'lucide-svelte';
	import NavigationItem from './NavigationItem.svelte';

	export let userId: string;
</script>

<nav class="list-nav p-4">
	<ul>
		<li>
			<NavigationItem href="/account" label="Home">
				<svelte:fragment slot="icon">
					<Home />
				</svelte:fragment>
			</NavigationItem>
		</li>
		<li>
			<NavigationItem href={`/account/${userId}/training`} label="Allenamenti">
				<svelte:fragment slot="icon">
					<Dumbbell />
				</svelte:fragment>
			</NavigationItem>
		</li>
		<li>
			<NavigationItem href="/account/booking" label="Prenotazioni">
				<svelte:fragment slot="icon">
					<Calendar />
				</svelte:fragment>
			</NavigationItem>
		</li>
	</ul>
	<h2 class="mt-8 text-center underline text-black text-lg">Gestione</h2>
	<ul class="mt-4">
		<li>
			<NavigationItem href="/account/users" label="Utenti">
				<svelte:fragment slot="icon">
					<User />
				</svelte:fragment>
			</NavigationItem>
		</li>
		<li>
			<NavigationItem href="/account/exercises" label="Esercizi">
				<svelte:fragment slot="icon">
					<ClipboardEdit />
				</svelte:fragment>
			</NavigationItem>
		</li>
	</ul>
</nav>
