import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { validationSchema } from './validation.schema';

export async function load({ url, locals: { getProfile }, params: { profileId } }) {
  const userProfile = await getProfile(profileId);
  let data: Record<string, string> | undefined;

  if (!url.searchParams.has('new')) {
    data = {
      username: userProfile.username ?? '',
      fullName: userProfile.fullName ?? ''
    };
  }

  const form = await superValidate(data, validationSchema);

  return { form, avatarPath: userProfile.avatarPath };
}

export const actions = {
  default: async ({ request, params: { profileId }, locals: { supabase, prisma } }) => {
    const formData = await request.formData();

    const form = await superValidate(formData, validationSchema);
    let avatar_path: string = formData.get('originalPath') as string;

    if (!form.valid) {
      // Again, always return { form } and things will just work.
      return fail(400, { form });
    }

    const {
      data: { fullName, username }
    } = form;

    const avatar = formData.get('avatar');

    if (avatar && avatar instanceof File && avatar.size > 0) {
      try {
        const { error: removeError } = await supabase.storage.from('avatars').remove([avatar_path]);

        if (removeError) {
          throw new Error('error removing old avatar');
        }

        const { data: avatarData, error: avatarError } = await supabase.storage
          .from('avatars')
          .upload(`${profileId}_${new Date().getTime()}`, avatar, {
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

    try {
      await prisma.profile.update({
        where: { id: profileId },
        data: {
          hasCompiled: true,
          fullName,
          username,
          avatarPath: avatar_path
        }
      });
    } catch (e) {
      if (e) {
        return fail(500, { form });
      }
    }

    throw redirect(302, '/account');
  }
};
