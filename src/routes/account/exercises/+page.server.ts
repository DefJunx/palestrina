import { error } from '@sveltejs/kit';

export async function load({ locals: { prisma } }) {
  const getExercises = async () => {
    const exercises = await prisma.exercise.findMany();

    // TODO: getPublicBucketUrl(supabase, e.photoPath, 'exercise_photos')
    return exercises.map((e) => ({ ...e, photoSrc: '' }));
  };

  return {
    exercises: getExercises()
  };
}

export const actions = {
  deleteExercise: async ({ request, locals: { prisma } }) => {
    const data = Object.fromEntries(await request.formData());

    const { exerciseId } = data;

    if (!exerciseId) {
      throw error(500, 'no exercise ID passed');
    }

    // const { photoPath, videoPath } =
    await prisma.exercise.delete({ where: { id: exerciseId as string } });

    // TODO
    // if (photoPath) {
    //   const { error: photoError } = await supabase.storage.from('exercise_photos').remove([photoPath]);

    //   if (photoError) {
    //     captureException(photoError);
    //   }
    // }

    // if (videoPath) {
    //   //exercise_videos
    //   const { error: videoError } = await supabase.storage.from('exercise_videos').remove([videoPath]);

    //   if (videoError) {
    //     captureException(videoError);
    //   }
    // }

    return {};
  }
};
