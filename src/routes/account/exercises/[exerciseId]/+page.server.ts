import { captureException } from '@sentry/sveltekit';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { v4 as uuidv4 } from 'uuid';
import { newExerciseSchema } from './validation.schema';

export async function load({ params: { exerciseId } }) {
  if (exerciseId === 'new') {
    return { form: superValidate(newExerciseSchema) };
  }

  const exercise = await prisma.exercise.findFirstOrThrow({ where: { id: exerciseId } });

  return { form: superValidate({ name: exercise.name }, newExerciseSchema) };
}

export const actions = {
  createExercise: async ({ request, locals: { supabase, prisma } }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, newExerciseSchema);
    let videoPath: string | undefined;
    let photoPath: string | undefined;

    if (!form.valid) {
      return fail(400, { form });
    }

    const exerciseId = uuidv4();

    const photo = formData.get('photo')?.valueOf() as File;
    const video = formData.get('video')?.valueOf() as File;

    if (photo.size !== 0) {
      const { data: photoData, error: photoError } = await supabase.storage
        .from('exercise_photos')
        .upload(`${exerciseId}`, photo, { cacheControl: '60', upsert: true, contentType: photo.type });

      if (photoError) {
        console.log('photoError', photoError);
        captureException(photoError);
      }

      photoPath = photoData?.path;
    }

    if (video.size !== 0) {
      const { data: videoData, error: videoError } = await supabase.storage
        .from('exercise_videos')
        .upload(`${exerciseId}`, video, { cacheControl: '60', upsert: true, contentType: video.type });

      if (videoError) {
        console.log('videoError', videoError);
        captureException(videoError);
      }

      videoPath = videoData?.path;
    }

    await prisma.exercise.create({ data: { id: exerciseId, name: form.data.name, photoPath, videoPath } });

    return { form };
  },
  editExercise: async ({ request, locals: { supabase, prisma }, params: { exerciseId } }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, newExerciseSchema);
    let photoPath: string | undefined;
    let videoPath: string | undefined;

    if (!form.valid) {
      return fail(400, { form });
    }

    const photo = formData.get('photo')?.valueOf() as File;
    const video = formData.get('video')?.valueOf() as File;

    if (photo.size !== 0) {
      const { data: photoData, error: photoError } = await supabase.storage
        .from('exercise_photos')
        .upload(`${exerciseId}`, photo, { cacheControl: '60', upsert: true, contentType: photo.type });

      if (photoError) {
        console.log('photoError', photoError);
        captureException(photoError);
      }

      photoPath = photoData?.path;
    }

    if (video.size !== 0) {
      const { data: videoData, error: videoError } = await supabase.storage
        .from('exercise_videos')
        .upload(`${exerciseId}`, video, { cacheControl: '60', upsert: true, contentType: video.type });

      if (videoError) {
        console.log('videoError', videoError);
        captureException(videoError);
      }

      videoPath = videoData?.path;
    }

    await prisma.exercise.update({
      where: { id: exerciseId },
      data: {
        name: form.data.name,
        ...(photoPath ? { photoPath } : {}),
        ...(videoPath ? { videoPath } : {})
      }
    });
  }
};
