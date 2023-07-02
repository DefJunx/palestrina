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

const uploadFile = (path: string, buffer: Buffer, resourceType?: 'image' | 'video' | 'raw' | 'auto') =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: resourceType, public_id: path, invalidate: true }, onDone)
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

export default cloudinary;

export const AVATARS_SUBFOLDER = 'avatars';
export const EXERCISE_PHOTOS_SUBFOLDER = 'exercise_photos';
export const EXERCISE_VIDEOS_SUBFOLDER = 'exercise_videos';

export async function uploadAvatar(avatarFile: File, userId: string): Promise<string | undefined> {
  const path = `${AVATARS_SUBFOLDER}/${userId}`;
  const arrayBuffer = await avatarFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const cloudinaryResponse = await uploadFile(path, buffer, 'image');
    return cloudinary.url(cloudinaryResponse.public_id, { version: cloudinaryResponse.version });
  } catch (e) {
    captureException(e);
    return undefined;
  }
}

export async function uploadExercisePhoto(file: File, exerciseId: string) {
  const path = `${EXERCISE_PHOTOS_SUBFOLDER}/${exerciseId}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const cloudinaryResponse = await uploadFile(path, buffer, 'image');
    return cloudinary.url(cloudinaryResponse.public_id, { version: cloudinaryResponse.version });
  } catch (e) {
    captureException(e);
    return undefined;
  }
}

export async function uploadExerciseVideo(file: File, exerciseId: string) {
  const path = `${EXERCISE_PHOTOS_SUBFOLDER}/${exerciseId}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const cloudinaryResponse = await uploadFile(path, buffer, 'video');
    return cloudinary.url(cloudinaryResponse.public_id, { version: cloudinaryResponse.version });
  } catch (e) {
    captureException(e);
    return undefined;
  }
}
