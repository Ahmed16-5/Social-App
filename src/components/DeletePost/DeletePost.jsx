import React, { useState } from "react";
import style from "./DeletePost.module.css";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

export default function DeletePost({ postId }) {
  const [isLoading, setisLoading] = useState(false);
  const queryClient = useQueryClient();
  function handleDelete() {
    setisLoading(true);
    axios
      .delete(`https://linked-posts.routemisr.com/posts/${postId} `, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then(() => {
        setisLoading(true);
        toast.success("Post deleted successfully");
        queryClient.invalidateQueries(["getUserPosts"  ]);
      })
      .catch((error) => {
        setisLoading(true);
        toast.error("Failed to  delete post: " + error.message);
      });
  }
  return (
    <>
      <button
        disabled={isLoading}
        onClick={handleDelete}
        className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500"
      >
        {isLoading ? "Deleting..." : "🗑️ Delete"}
      </button>
    </>
  );
}
