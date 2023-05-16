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
import { PostAuthor, parseClerkUser } from "@/utils";
import { TRPCError } from "@trpc/server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const postsController = createTRPCRouter({
  // :::
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

    const enhancedPosts = posts.map((post: Post) => {
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

    return enhancedPosts;
  }),

  // :::
  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji("Only Emojis are Allowed").min(1).max(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId!;

      const { success: canPost } = await ratelimit.limit(authorId);

      if (!canPost) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),

  // :::
  getPostsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          authorId: input.userId,
        },
        take: 100,
        orderBy: [{ createdAt: "desc" }],
      });

      return posts;
    }),

  // :::
  getSinglePostById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!post)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Post not found {postsController.getSinglePostById()}",
        });

      const author = await clerkClient.users.getUser(post.authorId);

      return {
        post,
        author: parseClerkUser(author),
      };
    }),
});
