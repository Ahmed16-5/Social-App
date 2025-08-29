import React from "react";
import style from "./UserPosts.module.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoadingPosts from "./../LoadingPosts/LoadingPosts";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import DropdownMenuPost from "../DropdownMenuPost/DropdownMenuPost";
import CreateComment from "./../CreateComment/CreateComment";

export default function UserPosts({ id }) {
  function getUserPosts() {
    return axios.get(`https://linked-posts.routemisr.com/users/${id}/posts`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["getUserPosts", id],
    queryFn: getUserPosts,
    keepPreviousData: true,

    select: (data) => data.data.posts,
  });

  console.log(data);

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 ">
        <LoadingPosts />
        <LoadingPosts />
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

  return (
    <div className="flex flex-col items-center ">
      <div className="w-full max-w-3xl ">
        {data?.map((post) => (
          <div
            className="flex flex-col items-center gap-6 py-4 relative"
            key={post.id}
          >
            <div className="w-full max-w-3xl  bg-white  rounded-lg shadow-md overflow-hidden border border-gray-200">
              <Link
                to={`/postDetails/${post.id}`}
                className="w-full  cursor-pointer"
              >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.user.photo}
                      className="w-10 h-10 rounded-full border border-gray-300"
                      alt={`${post.user.name} profile`}
                    />
                    <div>
                      <span className="text-sm font-semibold">
                        {post.user.name}
                      </span>
                      <p className="text-xs text-gray-500">
                        {dayjs(post.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div
                  className={`p-4 ${post.image ? "space-y-3" : "space-y-0"}`}
                >
                  {post.body && (
                    <p className="text-gray-800 leading-relaxed">{post.body}</p>
                  )}
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full rounded-lg border border-gray-200"
                    />
                  )}
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-600 hover:scale-105 m-4">
                  Add Comment
                </button>
              </Link>
              <div className="absolute top-10 right-5 ">
                <DropdownMenuPost postId={post.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
