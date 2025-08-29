import React from "react";
import style from "./PostDetails.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LoadingPosts from "../LoadingPosts/LoadingPosts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import Comment from "../Comment/Comment";
import CreateComment from "../CreateComment/CreateComment";

dayjs.extend(relativeTime);

export default function PostDetails() {
  const { id } = useParams();

  function getPostDetails() {
    return axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getPostDetails", id],
    queryFn: getPostDetails,
    select: (res) => res.data.post,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 px-4">
        <LoadingPosts />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 font-semibold text-center py-6">
        Error: {error.message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-gray-500 text-center py-6">No post data found</div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4 px-4">
      <div className="w-full max-w-3xl bg-white  rounded-lg shadow-md overflow-hidden border border-gray-200 my-12 ">
        {/* ------- Header ------- */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={data?.user?.photo}
              className="w-10 h-10 rounded-full border border-gray-300"
              alt="profile"
            />
            <div>
              <span className="text-sm font-semibold">{data?.user?.name}</span>
              <p className="text-xs text-gray-500">
                {dayjs(data.createdAt).fromNow()}
              </p>
            </div>
          </div>
        </div>

        {/* ------- Body ------- */}
        <div className={`p-4 ${data.image ? "space-y-3" : "space-y-0"}`}>
          {data.body && (
            <p className="text-gray-800 leading-relaxed">{data.body}</p>
          )}
          {data.image && (
            <img
              src={data.image}
              alt="Post content"
              className="w-full rounded-lg border border-gray-200"
            />
          )}

          {/* ------- Comments Section ------- */}
          <div className="mt-4">
            <CreateComment postId={id} />
            <Comment postId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
