import style from "./DropdownMenu.module.css";
import DeleteComment from "../DeleteComment/DeleteComment";

import React, { useState, useEffect, useRef } from "react";
import UpdateComment from "../UpdateComment/UpdateComment";
export default function DropdownMenu({ commentId ,commentText  }) {
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



  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="p-1 rounded-full hover:bg-gray-200"
      >
        ⋮
      </button>

      {menuOpen && (
        <div className="absolute right-3 top-0 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-md z-50">
          <UpdateComment commentId={commentId} />
          <DeleteComment commentId={commentId} currentContent={commentText} />
        </div>
      )}
    </div>
  );
}
