import React, { useEffect, useState } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function CreatePost({ userImg }) {
  const maxLength = 280;
  const [preview, setPreview] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const queryClient = useQueryClient();

  const schema = z.object({
    body: z.string().min(10, "min length is 10 char").max(maxLength),
    image: z
      .any()
      .refine((files) => files?.length <= 1, "Please select max one image")
      .refine(
        (files) =>
          !files?.[0] ||
          ["image/jpeg", "image/png", "image/jpg"].includes(files[0]?.type),
        "Only JPEG/PNG/JPG formats are allowed"
      )
      .refine(
        (files) => !files?.[0] || files[0]?.size <= 4 * 1024 * 1024,
        "Max file size is 4MB"
      ),
  });

  const form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
    resolver: zodResolver(schema),
  });

  let { register, handleSubmit, reset, watch, resetField, formState } = form;

  const text = watch("body", "");
  const imageFile = watch("image");

  useEffect(() => {
    if (imageFile && imageFile[0]) {
      const file = imageFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [imageFile]);

  function handlePost(values) {
    setisLoading(true);
    let formData = new FormData();
    formData.append("body", values.body);
    if (values.image && values.image[0]) {
      formData.append("image", values.image[0]);
    }
    axios
      .post(`https://linked-posts.routemisr.com/posts`, formData, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        console.log(res.data);
        queryClient.invalidateQueries(["posts"]);
        queryClient.invalidateQueries(["getUserPosts"]);
        setPreview(null);
        resetField("image");
        resetField("body");
        reset();
        toast.success("Post added successfully", {
          duration: 3000,
          position: "top-right",
        });
        setisLoading(false);
      })
      .catch((err) => {
        setisLoading(false);
        toast.error(err.response?.data?.error || "Something went wrong", {
          duration: 3000,
          position: "top-right",
        });
      });
  }

  function removeImage() {
    setPreview(null);
    resetField("image");
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mx-auto max-w-3xl">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={userImg}
          alt="user"
          className="w-10 h-10 rounded-full border border-gray-300"
        />
        <span className="text-gray-700 font-semibold text-sm sm:text-base">
          Create post
        </span>
      </div>

      <form onSubmit={handleSubmit(handlePost)}>
        <textarea
          {...register("body")}
          maxLength={maxLength}
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-700 text-sm sm:text-base"
          rows={3}
        />

        {formState.errors.body && formState.touchedFields.body && (
          <p className="text-red-500 text-sm">
            {formState.errors.body.message}
          </p>
        )}

        <input
          type="file"
          className="hidden"
          id="imageInput"
          {...register("image")}
          accept="image/jpeg, image/png, image/jpg"
        />

        <div className="flex justify-between items-center my-3.5">
          <label htmlFor="imageInput" className="cursor-pointer">
            <span className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition ">
              <FaImage className="text-lg" />
              <span className="text-sm font-medium">Add Image</span>
            </span>
          </label>
          {formState.errors.image && formState.touchedFields.image && (
            <p className="text-red-500 text-sm">
              {formState.errors.image.message}
            </p>
          )}

          <button
            disabled={!text.trim() || isLoading}
            className={`ms-auto flex px-4 py-2 rounded-lg font-semibold text-white transition ${
              text.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? <i className="fa fa-spinner fa-spin"></i> : "Post"}
          </button>
        </div>

        {/* Preview للصورة + زرار Remove */}
        {preview && (
          <div className="relative mt-3 inline-block">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-lg border border-gray-300 object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow"
            >
              <FaTimes />
            </button>
          </div>
        )}
      </form>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
        <span className="text-sm text-gray-500">
          {maxLength - text.length} characters left
        </span>
      </div>
    </div>
  );
}
