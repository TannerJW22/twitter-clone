import { type NextPage } from "next";
import Head from "next/head";

import { SignIn, SignInButton, useUser } from "@clerk/nextjs";
import CreatePostWidget from "@/components/CreatePostWidget";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import PostsFeed from "@/components/PostsFeed";
import { api } from "@/utils/api";

const HomePage: NextPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const userIsLoading = !isLoaded;

  // Start fetching ASAP (react query will auto-cache it for the PostsFeed load)
  const { data, isLoading: postsIsLoading } = api.posts.getAll.useQuery();

  if (userIsLoading) return <div />;

  return (
    <>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {isSignedIn && <CreatePostWidget />}
          </div>
          {postsIsLoading ? (
            <LoadingSpinner displayType="component" size={50} />
          ) : (
            <PostsFeed />
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;
