import { type RouterOutputs } from "@/utils/api";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

const PostView: React.FC<PostViewProps> = ({ post, author }) => {
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <img
        className="h-14 w-14 rounded-full"
        src={author.profileImageUrl}
        alt="post-image"
      />
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span className="font-semibold">{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}}`}>
            <span>{`·   ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

export type PostViewProps = RouterOutputs["posts"]["getAll"][number];
//number is on the end to indicate this type is for a single post in the array.
// excluding the number defaults the type to the entire returned array;

export default PostView;
