import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { v4 as uuidv4 } from 'uuid';
import { newExerciseSchema } from './validation.schema';
import type { PageServerLoad } from './$types.js';
import { uploadExercisePhoto, uploadExerciseVideo } from '$src/lib/server/cloudinary';

export const load = (async ({ params: { exerciseId }, locals: { prisma } }) => {
  if (exerciseId === 'new') {
    return { form: superValidate(newExerciseSchema) };
  }

  const exercise = await prisma.exercise.findFirstOrThrow({ where: { id: exerciseId } });

  return { form: superValidate({ name: exercise.name }, newExerciseSchema) };
}) satisfies PageServerLoad;

export const actions = {
  createExercise: async ({ request, locals: { prisma } }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, newExerciseSchema);
    let videoPath: string | undefined;
    let photoPath: string | undefined;

    if (!form.valid) {
      return fail(400, { form });
    }

    const exerciseId = uuidv4();

    // if (photo.size !== 0) {
    //   const { data: photoData, error: photoError } = await supabase.storage
    //     .from('exercise_photos')
    //     .upload(`${exerciseId}`, photo, { cacheControl: '60', upsert: true, contentType: photo.type });

    //   if (photoError) {
    //     console.log('photoError', photoError);
    //     captureException(photoError);
    //   }

    //   photoPath = photoData?.path;
    // }

    // if (video.size !== 0) {
    //   const { data: videoData, error: videoError } = await supabase.storage
    //     .from('exercise_videos')
    //     .upload(`${exerciseId}`, video, { cacheControl: '60', upsert: true, contentType: video.type });

    //   if (videoError) {
    //     console.log('videoError', videoError);
    //     captureException(videoError);
    //   }

    //   videoPath = videoData?.path;
    // }

    console.log(form.data);

    const newExercise = await prisma.exercise.create({
      data: { id: exerciseId, name: form.data.name, description: form.data.description, photoPath, videoPath }
    });

    try {
      // TODO
      const photo = formData.get('photo')?.valueOf() as File;
      const video = formData.get('video')?.valueOf() as File;

      if (photo && photo.size !== 0) {
        uploadExercisePhoto(photo, newExercise.id);
      }

      if (video && video.size !== 0) {
        uploadExerciseVideo(video, newExercise.id);
      }
    } catch {
      return { form };
    }

    return { form };
  },
  editExercise: async ({ request, locals: { prisma }, params: { exerciseId } }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, newExerciseSchema);
    let photoPath: string | undefined;
    let videoPath: string | undefined;

    if (!form.valid) {
      return fail(400, { form });
    }

    // const photo = formData.get('photo')?.valueOf() as File;
    // const video = formData.get('video')?.valueOf() as File;

    // if (photo.size !== 0) {
    //   const { data: photoData, error: photoError } = await supabase.storage
    //     .from('exercise_photos')
    //     .upload(`${exerciseId}`, photo, { cacheControl: '60', upsert: true, contentType: photo.type });

    //   if (photoError) {
    //     console.log('photoError', photoError);
    //     captureException(photoError);
    //   }

    //   photoPath = photoData?.path;
    // }

    // if (video.size !== 0) {
    //   const { data: videoData, error: videoError } = await supabase.storage
    //     .from('exercise_videos')
    //     .upload(`${exerciseId}`, video, { cacheControl: '60', upsert: true, contentType: video.type });

    //   if (videoError) {
    //     console.log('videoError', videoError);
    //     captureException(videoError);
    //   }

    //   videoPath = videoData?.path;
    // }

    await prisma.exercise.update({
      where: { id: exerciseId },
      data: {
        name: form.data.name,
        ...(photoPath ? { photoPath } : {}),
        ...(videoPath ? { videoPath } : {})
      }
    });
  }
} satisfies Actions;
