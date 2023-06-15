import { uploadAvatar } from '$src/lib/server/cloudinary';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { validationSchema } from './validation.schema';

export async function load({ url, parent }) {
  const parentData = await parent();
  let data: Record<string, string> | undefined;

  if (!url.searchParams.has('new')) {
    data = {
      username: parentData.profile.username ?? '',
      fullName: parentData.profile.fullName ?? ''
    };
  }

  return { form: superValidate(data, validationSchema), avatarPath: parentData.profile.avatarPath };
}

export const actions = {
  default: async ({ request, params: { profileId }, locals: { prisma, authRequest } }) => {
    const formData = await request.formData();

    const form = await superValidate(formData, validationSchema);
    let avatarPath: string | undefined;

    if (!form.valid) {
      // Again, always return { form } and things will just work.
      return fail(400, { form });
    }

    const {
      data: { fullName, username }
    } = form;

    const avatar = formData.get('avatar')?.valueOf() as File;

    if (avatar.size !== 0) {
      const { user } = await authRequest.validateUser();

      if (!user) {
        throw new Error('User not found');
      }

      avatarPath = await uploadAvatar(avatar, user.userId);
    }

    try {
      await prisma.profile.update({
        where: { id: profileId },
        data: {
          hasCompiled: true,
          fullName,
          username,
          ...(avatarPath ? { avatarPath } : {})
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
