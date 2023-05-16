import { type RouterOutputs } from "@/utils/api";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import Link from "next/link";
import { Post } from "@prisma/client";
import { PostAuthor } from "@/utils";

dayjs.extend(relativeTime);
dayjs.extend(calendar);

const PostView: React.FC<PostViewProps> = ({
  post,
  author,
  timeDisplay = "fromNow",
  disabled = false,
}) => {
  return (
    <div
      key={post.id}
      className="mx-2 flex gap-3 border-b border-slate-700 py-1.5"
    >
      <Link
        className={
          disabled
            ? "flex w-full cursor-default gap-3 py-3 pl-4"
            : "flex w-full gap-3 py-3 pl-4 hover:bg-gradient-to-br hover:from-black hover:to-[#191919]"
        }
        href={disabled ? "#" : `/post/${post.id}`}
      >
        <img
          className="h-14 w-14 rounded-full"
          src={author.profileImageUrl}
          alt="post-image"
        />
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 text-slate-300">
            <Link href={`/@${author.username}`}>
              <span className="font-semibold hover:underline">{`@${author.username}`}</span>
            </Link>
            <Link href={`/post/${post.id}}`}>
              <span className="text-slate-500 ">{`·   ${dayjs(post.createdAt)[
                timeDisplay
              ]()}`}</span>
            </Link>
          </div>
          <span className="text-2xl">{post.content}</span>
        </div>
      </Link>
    </div>
  );
};

export interface PostViewProps {
  post: Post;
  author: PostAuthor;
  timeDisplay?: "calendar" | "fromNow";
  disabled?: boolean;
}
// number is on the end to indicate this type is for a single post in the array.
// excluding the number defaults the type to the entire returned array;

export default PostView;
