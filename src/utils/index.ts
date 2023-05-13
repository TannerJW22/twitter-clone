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

// const addUserDataToPosts = async (posts: Post[]) => {
//   const userId = posts.map((post) => post.authorId);
//   const users = (
//     await clerkClient.users.getUserList({
//       userId: userId,
//       limit: 110,
//     })
//   ).map(parseClerkUser);
//   return posts.map((post) => {
//     const author = users.find((user) => user.id === post.authorId);

//     if (!author) {
//       console.error("AUTHOR NOT FOUND", post);
//       throw new TRPCError({
//         code: "INTERNAL_SERVER_ERROR",
//         message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
//       });
//     }
//     if (!author.username) {
//       // user the ExternalUsername
//       if (!author.externalUsername) {
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: `Author has no GitHub Account: ${author.id}`,
//         });
//       }
//       author.username = author.externalUsername;
//     }
//     return {
//       post,
//       author: {
//         ...author,
//         username: author.username ?? "(username not found)",
//       },
//     };
//   });
// };
