import React from "react";
import style from "./LoadingPosts.module.css";

export default function LoadingPosts() {
  return (
    <>
      <div className="w-full max-w-3xl  bg-white rounded-lg shadow-md border border-gray-200 p-4 space-y-4 animate-pulse ">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full shimmer"></div>
          <div className="flex-1 space-y-2">
            <div className="w-24 h-3 bg-gray-300 rounded shimmer"></div>
            <div className="w-16 h-2 bg-gray-200 rounded shimmer"></div>
          </div>
        </div>
        {/* Body */}
        <div className="space-y-2">
          <div className="w-full h-3 bg-gray-300 rounded shimmer"></div>
          <div className="w-5/6 h-3 bg-gray-300 rounded shimmer"></div>
        </div>
        {/* Image */}
        <div className="w-full h-48 bg-gray-300 rounded shimmer"></div>
      </div>
    </>
  );
}
