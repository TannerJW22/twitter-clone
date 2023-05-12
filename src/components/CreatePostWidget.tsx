/* eslint-disable @next/next/no-img-element */
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";

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
    });

  if (!user) return null;

  console.log(user); // <<--*

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
        disabled={mutationInProgress}
      />
      <button onClick={() => mutate({ content: input })}>Post</button>
    </div>
  );
};

export interface CreatePostWidgetProps {
  //
}

export default CreatePostWidget;
