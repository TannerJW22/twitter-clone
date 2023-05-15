/* eslint-disable @next/next/no-img-element */
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "./LoadingSpinner";
import { primaryButtonStyle, secondaryButtonStyle } from "@/styles/index.tbz";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

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
          src={"/img/twitter-logo.png" || `${user?.profileImageUrl}`}
          alt="profile image"
          className="-white h-14 w-16 rounded-full border-2 border-dotted border-white p-1.5 opacity-[0.15]"
        />
        <input
          placeholder={`Hello ${
            `${user?.username}` || "Guest"
          }, share an emoji!`}
          className="grow bg-transparent outline-none"
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
        <div className="flex gap-4">
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
                className={`h-10 ${secondaryButtonStyle}`}
                onClick={() => setPickerIsVisible(true)}
                disabled={mutationInProgress}
              >
                Pick Emoji
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
