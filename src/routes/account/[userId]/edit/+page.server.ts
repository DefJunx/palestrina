import { invalidate } from '$app/navigation';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { validationSchema } from './validation.schema';

export async function load({ url, locals: { getProfile }, params }) {
	let form: Awaited<ReturnType<typeof superValidate>>;
	const userProfile = await getProfile(params.userId);
	if (!userProfile) {
		throw error(500);
	}

	if (!url.searchParams.has('new')) {
		form = await superValidate(
			{
				username: userProfile.username ?? '',
				fullName: userProfile.fullName ?? ''
			},
			validationSchema
		);
	} else {
		form = await superValidate(validationSchema);
	}

	return { form, avatarPath: userProfile.avatarPath };
}

export const actions = {
	default: async ({ request, params, locals: { supabase, prisma } }) => {
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
			data: { fullName, username }
		} = form;

		try {
			await prisma.profile.update({
				where: { id: params.userId },
				data: {
					hasCompiled: true,
					fullName,
					username,
					avatarPath: avatar_path
				}
			});
			await invalidate('update:profile');

			return { form };
		} catch (e) {
			if (e) {
				return fail(500, { form });
			}
		}
	}
};
