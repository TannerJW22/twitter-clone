/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { type Post } from "@prisma/client";
import { parseClerkUser } from "@/utils";
import { TRPCError } from "@trpc/server";

// :::
export const postsController = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post: Post) => post.authorId),
        limit: 100,
      })
    ).map(parseClerkUser); //sanitize {ClerkUser} down to what is necessary

    return posts.map((post: Post) => {
      const author = users.find((user: any) => user.id === post.authorId);

      if (!author || !author.username)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author/User not found {postsController.getAll()}",
        });

      return {
        post,
        author: author,
        // {post.author} now has a mini user info object.
      };
    });
  }),
});
