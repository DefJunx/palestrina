import { invalidate } from '$app/navigation';
import { getAvatarUrl } from '$src/lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { validationSchema } from './validation.schema';

export async function load({ url, locals: { getProfile, supabase }, params }) {
	let avatarPath = '';
	let form: Awaited<ReturnType<typeof superValidate>>;
	let avatarSrc = '';

	if (!url.searchParams.has('new')) {
		const userProfile = await getProfile(params.userId);

		if (!userProfile) {
			throw error(500);
		}

		form = await superValidate(
			{
				username: userProfile.username ?? '',
				full_name: userProfile.full_name ?? ''
			},
			validationSchema
		);

		avatarPath = userProfile.avatar_path ?? '';

		if (avatarPath !== '') {
			avatarSrc = await getAvatarUrl(supabase, avatarPath);
		}
	} else {
		form = await superValidate(validationSchema);
	}

	return { form, avatarSrc, avatarPath };
}

export const actions = {
	default: async ({ request, params, locals: { supabase } }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, validationSchema);
		let avatar_path: string = formData.get('originalPath') as string;

		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		const avatar = formData.get('avatar');

		if (avatar && avatar instanceof File && avatar.size > 0) {
			try {
				const { data: avatarData, error: avatarError } = await supabase.storage
					.from('avatars')
					.upload(`${params.userId}`, avatar, {
						cacheControl: '60',
						upsert: true,
						contentType: avatar.type
					});

				if (avatarError) {
					console.error(avatarError);
				}

				if (avatarData) {
					avatar_path = avatarData.path;
				}
			} catch (e) {
				console.error(e);
			}
		}

		const {
			data: { full_name, username }
		} = form;

		const { count, error } = await supabase.from('profiles').upsert({
			id: params.userId,
			has_compiled: true,
			full_name,
			username,
			avatar_path,
			updated_at: new Date().toISOString()
		});

		if (error) {
			return fail(500, { form });
		}

		if (count !== 0) {
			throw redirect(302, '/account');
		}

		await invalidate('update:profile');
		return { form };
	}
};
