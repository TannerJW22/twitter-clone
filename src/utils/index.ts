import { type User } from "@clerk/nextjs/dist/api";
import { RouterOutputs } from "./api";

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
