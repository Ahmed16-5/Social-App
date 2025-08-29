import React, { useContext, useEffect, useState } from "react";
import style from "./Home.module.css";
// import { PostContext } from "../../Context/PostContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LoadingPosts from "../LoadingPosts/LoadingPosts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import CreatePost from "../CreatePost/CreatePost";
dayjs.extend(relativeTime);
export default function Home() {
  function getProfileData() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }
  let {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["profileData"],
    queryFn: getProfileData,
    select: (data) => data?.data?.user,
  });

  function getAllPosts() {
    return axios.get(
      `https://linked-posts.routemisr.com/posts?page=LAST_PAGE&limit=100&sort=-createdAt`,
      {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      }
    );
  }
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["getPosts"],
    queryFn: getAllPosts,
    keepPreviousData: true,
    select: (data) => data.data.posts,
  });

  console.log(data);

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col items-center gap-6 py-6">
        <LoadingPosts />
        <LoadingPosts />
        <LoadingPosts />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center py-6">
  <div className="w-full max-w-3xl my-4 px-4 md:px-0">
    <CreatePost userImg={profileData?.photo} />
  </div>
  {data?.map((post) => (
    <Link
      to={`/postDetails/${post.id}`}
      className="w-full cursor-default"
      key={post.id}
    >
      <div className="flex flex-col items-center gap-6 py-4 px-4 ">
        <div className="w-full max-w-3xl bg-white cursor-pointer rounded-lg shadow-md overflow-hidden border border-gray-200">
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
          <div className={`p-4 ${post.image ? "space-y-3" : "space-y-0"}`}>
            {post.body && (
              <p className="text-gray-800 leading-relaxed">{post.body}</p>
            )}
            {post.image && (
              <img
                src={post.image}
                alt="Post content"
                className="w-full rounded-lg border border-gray-300   "
              />
            )}
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-600 hover:scale-105 m-4">
            Add Comment
          </button>
        </div>
      </div>
    </Link>
  ))}
</div>

    </>
  );
}
