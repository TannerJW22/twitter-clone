/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { type Post } from "@prisma/client";
import { parseClerkUser } from "@/utils";
import { TRPCError } from "@trpc/server";

export const profileController = createTRPCRouter({
  // :::
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username], // this function requries the username prop to be an array.
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user found.",
        });
      }

      return parseClerkUser(user);
    }),
});
