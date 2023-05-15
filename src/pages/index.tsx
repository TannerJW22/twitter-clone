// :::| 1) fix PostDetail page (also loading state is incorrect it should not say 404 during load)
// 2) fix Profile Feed

import { type NextPage } from "next";
import Head from "next/head";

import { SignIn, SignInButton, useUser } from "@clerk/nextjs";
import CreatePostWidget from "@/components/CreatePostWidget";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import PostsFeed from "@/components/PostsFeed";
import { api } from "@/utils/api";
import { SignOutButton } from "@clerk/clerk-react";
import { primaryButtonStyle } from "@/styles/index.tbz";

const HomePage: NextPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const userIsLoading = !isLoaded;

  // Start fetching ASAP (react query will auto-cache it for the PostsFeed load)
  const { data, isLoading: postsIsLoading } = api.posts.getAll.useQuery();

  if (userIsLoading) return <div />;

  return (
    <>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-700 md:max-w-2xl">
          <div className="container flex w-full items-center justify-center gap-6 border border-red-500 py-4 text-center">
            <span className="font-serif font-thin italic">Emoji Twitter</span>
            <img
              className="w-15 h-12"
              src="/img/twitter-logo.png"
              alt="twitter logo"
            />
            {!isSignedIn && (
              <SignInButton>
                <button className={primaryButtonStyle}>Sign In</button>
              </SignInButton>
            )}
            {isSignedIn && (
              <div className="flex justify-center">
                <SignOutButton>
                  <button className={primaryButtonStyle}>Sign Out</button>
                </SignOutButton>
              </div>
            )}
          </div>
          <div className="container flex flex-col border-b border-slate-700 p-4">
            <CreatePostWidget />
            {postsIsLoading ? (
              <LoadingSpinner displayType="component" size={50} />
            ) : (
              <PostsFeed />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
