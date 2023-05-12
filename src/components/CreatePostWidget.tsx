/* eslint-disable @next/next/no-img-element */
import { useUser } from "@clerk/nextjs";
import React from "react";

const CreatePostWidget: React.FC<CreatePostWidgetProps> = () => {
  const { user } = useUser();
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
        placeholder="placeholder"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

export interface CreatePostWidgetProps {
  //
}

export default CreatePostWidget;
