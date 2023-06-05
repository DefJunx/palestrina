<script lang="ts">
	import Navigation from '$src/lib/components/Navigation.svelte';
	import {
		AppBar,
		AppShell,
		Avatar,
		Drawer,
		LightSwitch,
		Modal,
		Toast,
		drawerStore
	} from '@skeletonlabs/skeleton';
	import { Menu } from 'lucide-svelte';

	export let data;

	$: ({ avatarSrc } = data);

	function drawerOpen(): void {
		drawerStore.open();
	}
</script>

<Toast position="tr" />
<Modal />
<Drawer>
	<Navigation />
</Drawer>

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
				<Avatar bind:src={avatarSrc} initials="JD" width="w-10" background="bg-primary-500" />
				<LightSwitch bgDark="bg-primary-700" bgLight="bg-primary-200" />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>
	<div class="container p-10 mx-auto"><slot /></div>
</AppShell>
