import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function DeleteComment({ commentId }) {
  const [isLoading, setisLoading] = useState(false);
  const queryClient = useQueryClient();
  function handleDelete() {
    setisLoading(true);
    axios
      .delete(`https://linked-posts.routemisr.com/comments/${commentId}`, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then(() => {
        toast.success("Comment deleted successfully");
        queryClient.invalidateQueries(["getPostComments"]);
        setisLoading(false);
      })
      .catch((error) => {
        setisLoading(false);
        toast.error("Error deleting comment: " + error.message);
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
