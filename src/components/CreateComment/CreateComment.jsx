import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function CreateComment({ postId }) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  let schema = z.object({
    content: z.string().min(1, "content is required"),
  });

  let form = useForm({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(schema),
  });

  let { register, handleSubmit, reset } = form;

  function addComment(values) {
    setIsLoading(true);
    axios
      .post(
        `https://linked-posts.routemisr.com/comments`,
        { ...values, post: postId },
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setIsLoading(false);
        queryClient.invalidateQueries(["getPostComments", postId]);
        reset();
        toast.success("comment added successfully", {
          duration: 3000,
          position: "top-right",
        });
        console.log("hello");
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        toast.error(err.response.data.error);
      });
  }

  return (
    <div className=" border-t border-gray-200 ">
      <form onSubmit={handleSubmit(addComment)}>
        <div className="flex items-center gap-3 mt-2">
          <input
            {...register("content")}
            type="text"
            placeholder="Write a comment..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={isLoading}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium 
                       hover:bg-blue-600 transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin text-white"></i>
            ) : (
              "add comment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
