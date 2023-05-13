import { createTRPCRouter } from "@/server/api/trpc";
import { postsController } from "@/server/api/routers/posts";
import { profileController } from "./routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsController,
  profile: profileController,
});

// export type definition of API
export type AppRouter = typeof appRouter;
