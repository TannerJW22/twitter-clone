/* eslint-disable @next/next/no-img-element */
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "./LoadingSpinner";
import {
  emojiButtonStyle,
  primaryButtonStyle,
  profileImgStyle,
  secondaryButtonStyle,
} from "@/styles/index.tbz";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { CiFaceSmile } from "react-icons/ci";

const CreatePostWidget: React.FC<CreatePostWidgetProps> = () => {
  const ctx = api.useContext();
  const [pickerIsVisible, setPickerIsVisible] = useState(false);
  const { user, isSignedIn } = useUser();
  const [input, setInput] = useState("");
  const { mutate, isLoading: mutationInProgress } =
    api.posts.create.useMutation({
      onSuccess: () => {
        setInput("");
        void ctx.posts.getAll.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;

        errorMessage && errorMessage[0]
          ? toast.error(errorMessage[0])
          : toast.error("Failed to post! Please try again later.");
      },
    });

  return (
    <div className="flex w-full gap-3 border-b border-slate-700">
      <div className="mb-8 flex w-full gap-6">
        <img
          src={user ? `${user?.profileImageUrl}` : "/img/twitter-logo.png"}
          alt="profile image"
          className={
            user ? profileImgStyle.isLoggedIn : profileImgStyle.isGuest
          }
        />
        <input
          placeholder={
            user
              ? `Hello ${user?.username}! Share an emoji.`
              : `Hello guest! Login to post.`
          }
          className="grow bg-transparent text-2xl outline-none placeholder:text-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              input !== "" && mutate({ content: input });
            }
          }}
          disabled={mutationInProgress}
        />
        <div className="flex gap-2 px-5">
          {pickerIsVisible ? (
            <div className="max-h-1">
              <Picker
                data={data}
                onEmojiSelect={(emoji: any) => {
                  setInput(input + emoji.native);
                  setPickerIsVisible(false);
                }}
                autoFocus={true}
                icons={"solid"}
                maxFrequentRows={1}
                theme={"dark"}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <button
                className=""
                onClick={() => setPickerIsVisible(true)}
                disabled={mutationInProgress}
              >
                <CiFaceSmile className="h-11 w-11 text-white opacity-70 hover:scale-[1.05] hover:opacity-100" />
              </button>
              <button
                onClick={() => mutate({ content: input })}
                disabled={mutationInProgress}
                className={`h-10 ${primaryButtonStyle}`}
              >
                {mutationInProgress ? (
                  <LoadingSpinner displayType="icon" size={20} />
                ) : (
                  "Post"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export interface CreatePostWidgetProps {
  //
}

export default CreatePostWidget;
