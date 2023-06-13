import type { PrismaClient, Profile } from '@prisma/client';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      prisma: PrismaClient;

      getProfile(profileOrUserId: string): Promise<Profile>;
      authRequest: import('lucia-auth').AuthRequest;
    }
    interface PageData {
      profile: Profile;
    }
    // interface Platform {}
  }

  /// <reference types="lucia-auth" />
  namespace Lucia {
    type Auth = import('$lib/server/lucia').Auth;
    type UserAttributes = {
      email: string;
    };
  }

  var __prisma: PrismaClient;
}

export {};
