import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
export default function UpdatePostModal({ postId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview("");
    fileInputRef.current.value = "";
  };

  async function handleUpdate() {
    if (!body.trim()) {
      toast.error("Post body cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("body", body);
    if (image) {
      formData.append("image", image);
    }
    setIsLoading(true);
    try {
      await axios.put(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );

      toast.success("Post updated successfully!");
      queryClient.invalidateQueries(["getUserPosts"]);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update post: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="block w-full text-left px-3 py-2 hover:bg-gray-100"
      >
        ✏️ Edit
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

            <textarea
              placeholder="What's on your mind?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring"
              rows="4"
            />
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <div
                onClick={!preview ? handleClick : undefined}
                className={`cursor-pointer border-2 border-dashed border-gray-400 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition relative`}
              >
                {preview ? (
                  <div className="w-full relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-contain rounded-lg"
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-500 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-gray-600">Click to upload an image</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
