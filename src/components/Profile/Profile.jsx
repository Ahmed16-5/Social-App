import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaBirthdayCake,
  FaEnvelope,
  FaMars,
  FaVenus,
  FaCamera,
} from "react-icons/fa";
import dayjs from "dayjs";
import UserPosts from "../UserPosts/UserPosts";
import CreatePost from "./../CreatePost/CreatePost";
import ChangePassowrdModal from "../ChangePassowrdModal/ChangePassowrdModal";
import UpdatePostModal from "../UpdatePostModal/UpdatePostModal";
import UploadPhotoModal from "./../UploadPhotoModal/UploadPhotoModal";

export default function Profile() {
  function getProfileData() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }

  let { data, isLoading, isError } = useQuery({
    queryKey: ["profileData"],
    queryFn: getProfileData,
    select: (data) => data?.data?.user,
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto my-12 p-6 bg-white rounded-xl shadow-lg border border-gray-200 animate-pulse">
        <div className="flex flex-col items-center mt-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gray-300"></div>
          <div className="mt-3 w-32 h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="w-full h-4 bg-gray-300 rounded"></div>
          <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-12">
        Failed to load profile data
      </div>
    );
  }

  return (
    <>
      <div className=" px-4 md:px-0">
        <div className="w-full max-w-3xl     md:mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 my-12">
          {/* Profile Card */}
          <div className="flex flex-col items-center mt-6">
            <img
              src={data?.photo}
              alt="user profile"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-blue-500 object-cover"
            />
            <UploadPhotoModal />
          </div>

          <div className="text-center mt-3 px-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              {data?.name}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Joined {dayjs(data?.createdAt).format("DD MMM YYYY")}
            </p>
          </div>

          <div className="mt-5 px-4 sm:px-6 space-y-3 mb-4">
            {/* Email */}
            <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
              <FaEnvelope className="text-blue-500 text-lg" />
              <span className="break-all">{data?.email}</span>
            </div>

            {/* Birthday */}
            <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
              <FaBirthdayCake className="text-pink-500 text-lg" />
              <span>{dayjs(data?.dateOfBirth).format("DD MMM YYYY")}</span>
            </div>

            {/* Gender */}
            <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
              {data?.gender === "male" ? (
                <FaMars className="text-blue-500 text-lg" />
              ) : (
                <FaVenus className="text-pink-500 text-lg" />
              )}
              <span className="capitalize">{data?.gender}</span>
            </div>
          </div>

          <div className="px-4 pb-6 text-center">
            <ChangePassowrdModal />
          </div>
        </div>
      </div>

      {/* Create Post */}
      <div className="px-4 md:px-0">
        <CreatePost userImg={data?.photo} />
      </div>

      {/* User Posts */}
      <div className="px-4 md:px-0 mb-12">
        <UserPosts id={data?._id} />
      </div>

     
    </>
  );
}
