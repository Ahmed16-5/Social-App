import React from "react";
import style from "./Comment.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import photo from "../../assets/user.png";
import DropdownMenu from "../DropdownMenu/DropdownMenu";

dayjs.extend(relativeTime);

export default function Comment({ postId }) {
  function getPostComments() {
    return axios.get(
      `https://linked-posts.routemisr.com/posts/${postId}/comments`,
      {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      }
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getPostComments", postId],
    queryFn: getPostComments,
    select: (data) => data?.data?.comments,
  });

  if (isLoading)
    return <p className="animate-pulse text-center"> Loading comments...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      {data?.map((comment) => (
        <div
          key={comment._id}
          className="flex items-start gap-3 p-3 border-b border-gray-200 py-4"
        >
          <img
            src={photo}
            alt={`${comment?.commentCreator?.name || "User"} profile`}
            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
          />

          <div className="flex flex-col bg-gray-100 rounded-lg px-4 py-2 w-full">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">
                {comment?.commentCreator?.name}
              </span>
              <span className="text-xs text-gray-500">
                {dayjs(comment?.createdAt).fromNow()}
              </span>
            </div>
            <p className="text-sm text-gray-800">{comment?.content}</p>
          </div>
          <DropdownMenu commentId={comment._id} commentText={comment?.content} />
        </div>
      ))}
    </>
  );
}
