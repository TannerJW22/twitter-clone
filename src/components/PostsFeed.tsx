import { api } from "@/utils/api";
import React from "react";
import PostView, { PostViewProps } from "./PostView";

const PostsFeed = () => {
  const { data, isLoading: postsIsLoading } = api.posts.getAll.useQuery();

  if (!data) return <div>Error Loading Data. Try Again.</div>;

  return (
    //
    <div className="container flex w-full flex-col">
      {data.map(({ post, author }: PostViewProps) => (
        <PostView key={post.id} post={post} author={author} />
      ))}
    </div>
  );
};

export interface PostsFeedProps {
  //
}

export default PostsFeed;
