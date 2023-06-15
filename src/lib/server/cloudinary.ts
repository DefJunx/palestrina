import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
import { captureException } from '@sentry/sveltekit';
import { v2 as cloudinary, type UploadApiErrorResponse, type UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

export default cloudinary;

export const AVATARS_SUBFOLDER = 'avatars';

export async function uploadAvatar(avatarFile: File, userId: string): Promise<UploadApiResponse | null> {
  const cloudinaryPath = `${AVATARS_SUBFOLDER}/${userId}`;
  const arrayBuffer = await avatarFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadFunction = () =>
    new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'image', public_id: cloudinaryPath, invalidate: true }, onDone)
        .end(buffer);

      function onDone(error?: UploadApiErrorResponse, result?: UploadApiResponse) {
        if (error) {
          return reject(error);
        }

        if (result) {
          return resolve(result);
        }

        return null;
      }
    });

  try {
    return await uploadFunction();
  } catch (e) {
    captureException(e);
    return null;
  }
}
