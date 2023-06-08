import { z } from 'zod';

export const conversationSchema = z.object({
  toId: z.string().nonempty()
});
