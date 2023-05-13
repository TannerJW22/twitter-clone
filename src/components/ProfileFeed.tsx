import { type PostAuthor } from "@/utils";
import { api } from "@/utils/api";
import { type Post } from "@prisma/client";
import { type NextPage } from "next";
import PostView from "./PostView";

const ProfileFeed: NextPage<ProfileFeedProps> = ({ user }) => {
  const { data: posts, isLoading: postsIsLoading } =
    api.posts.getPostsByUserId.useQuery({
      userId: user.id as PostAuthor["id"],
    });

  if (!posts || posts.length === 0) return <div>No Posts Found for User</div>;

  return (
    <div className="flex flex-col">
      {posts.map((post: Post) => (
        <PostView post={post} author={user} key={post.id} />
      ))}
    </div>
  );
};

export interface ProfileFeedProps {
  user: PostAuthor;
}

export default ProfileFeed;
