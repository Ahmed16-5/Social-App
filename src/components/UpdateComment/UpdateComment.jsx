import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function UpdateCommentModal({ commentId, currentContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(currentContent);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  async function handleUpdate() {
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        { content }, 
        {
          headers: {
            token: localStorage.getItem("userToken"), 
          },
        }
      );
      toast.success("Comment updated successfully!");
      queryClient.invalidateQueries(["getPostComments"]);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update comment: " + error.message);
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

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Comment</h2>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring"
              rows="4"
            />

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
