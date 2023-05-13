/* eslint-disable @next/next/no-img-element */
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "./LoadingSpinner";

const CreatePostWidget: React.FC<CreatePostWidgetProps> = () => {
  const ctx = api.useContext();
  const { user } = useUser();
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

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <img
        src={user.profileImageUrl}
        alt="profile image"
        className="h-14 w-14 rounded-full"
      />
      <input
        placeholder="Share your Emojis!"
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
      <button
        onClick={() => mutate({ content: input })}
        disabled={mutationInProgress}
      >
        {mutationInProgress ? (
          <LoadingSpinner displayType="icon" size={30} />
        ) : (
          "Post"
        )}
      </button>
    </div>
  );
};

export interface CreatePostWidgetProps {
  //
}

export default CreatePostWidget;
