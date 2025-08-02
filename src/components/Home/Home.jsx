import React, { useContext, useEffect, useState } from "react";
import style from "./Home.module.css";
import { PostContext } from "../../Context/PostContext";

export default function Home() {
  let { getAllPosts } = useContext(PostContext);
  const [posts, setposts] = useState([]);

  async function getPosts() {
    try {
      let data = await getAllPosts();
      console.log(data);
      setposts(data);
    } catch (err) {
      // show error
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {posts.map((post) => (
        <div key={post.id} className="w-full mx-auto md:w-[80%] lg:w-[60%] p-3">
          <div className="post bg-slate-200 p-2 rounded-md">
            <div className="flex justify-between items-center my-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.user.photo}
                  className="size-[30px] rounded-full"
                  alt=""
                />
                <span className="text-xs font-bold">{post.user.name}</span>
              </div>
              <span className="text-xs text-slate-500">{post.createdAt}</span>
            </div>
            {post.body && <h2 className="mb-3">{post.body}</h2>}
            {post.image && <img src={post.image} alt="" />}
          </div>
        </div>
      ))}
    </>
  );
}
