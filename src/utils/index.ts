import { type User } from "@clerk/nextjs/dist/api";
import { RouterOutputs } from "./api";
import { Post } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs";

// ------------ Constants ------------ //

export type PostAuthor = {
  id: string;
  username: string | null;
  profileImageUrl: string | undefined;
};

// ------------ Util Functions ------------ //

export const parseClerkUser = (user: User): PostAuthor => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};
