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

// :::
export const postsController = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
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

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji("Only emojis are allowed").min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId!;

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),
});
