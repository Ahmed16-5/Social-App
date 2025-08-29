import DeletePost from "../DeletePost/DeletePost";
import UpdatePostModal from "../UpdatePostModal/UpdatePostModal";
import style from "./DropdownMenuPost.module.css";
import React, { useState, useEffect, useRef } from "react";
export default function DropdownMenuPost({ postId }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleEdit = () => {
    alert("Edit Clicked");
  };

  const handleDelete = () => {
    alert("Delete Clicked");
  };

  return (
    <div className="relative inline-block" ref={menuRef}>   
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="p-1 rounded-full hover:bg-gray-200"
      >
        <i className="fa-solid fa-list-ul"></i>
      </button>

      {menuOpen && (
        <div className="absolute right-3 top-0 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-md z-50">
          <UpdatePostModal postId={postId} />
          <DeletePost postId={postId} />
        </div>
      )}
    </div>
  );
}
