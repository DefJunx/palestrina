import { z } from 'zod';

export const messageSchema = z.object({
  message: z.string().nonempty(),
  senderId: z.string().nonempty()
});
