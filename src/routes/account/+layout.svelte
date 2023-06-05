<script lang="ts">
	import { goto } from '$app/navigation';
	import Navigation from '$src/lib/components/Navigation.svelte';
	import {
		AppBar,
		AppShell,
		Avatar,
		Drawer,
		LightSwitch,
		drawerStore,
		popup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { LogOut, Mail, Menu } from 'lucide-svelte';

	export let data;

	$: ({ avatarSrc, avatarFallback, userId, supabase, session } = data);

	$: if (!session) goto('/');

	function drawerOpen(): void {
		drawerStore.open();
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
	<Navigation {userId} />
</Drawer>

<div class="card p-4 w-72 shadow-xl !z-[999]" data-popup="userPopup">
	<div><p>Demo Content</p></div>
	<div class="arrow bg-surface-100-800-token" />
</div>

<AppShell slotSidebarLeft="w-0 md:w-52 bg-primary-500">
	<svelte:fragment slot="header">
		<AppBar shadow="shadow-lg" background="bg-primary-500">
			<svelte:fragment slot="lead">
				<button class="md:hidden btn btn-sm mr-4" on:click={drawerOpen}>
					<Menu />
				</button>
				<strong class="text-xl uppercase">Palestrina</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<button class="block md:hidden btn-icon" on:click={goToMessages}>
					<Mail />
				</button>
				<button class="block md:hidden btn-icon" on:click={logout}>
					<LogOut class="block" />
				</button>
				<button type="button" class="hidden md:block btn-icon" use:popup={userPopup}>
					<Avatar
						class="hidden md:block"
						src={avatarSrc}
						initials={avatarFallback}
						width="w-10"
						background="bg-primary-500"
					/>
				</button>
				<button />
				<LightSwitch class="hidden md:block" bgDark="bg-primary-700" bgLight="bg-primary-200" />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Navigation {userId} />
	</svelte:fragment>
	<div class="container p-10 mx-auto"><slot /></div>
</AppShell>
