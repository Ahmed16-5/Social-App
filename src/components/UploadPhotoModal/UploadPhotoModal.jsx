import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function UploadPhotoModal() {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  // for display preview for user when select photo
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  const queryClient = useQueryClient();

  function resetinput() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setFileName("");
    setOpenModal(false);
    reset();
  }

  const schema = z.object({
    photo: z
      .instanceof(File, { message: "Please select a photo" })
      .refine((file) => file.size <= 4 * 1024 * 1024, "Max file size is 4MB")
      .refine(
        (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
        "Only JPEG/PNG/JPG formats are allowed"
      ),
  });
  const form = useForm({
    resolver: zodResolver(schema),
  });

  let { register, handleSubmit, formState, setValue, trigger, reset } = form;

  function handleUpload(values) {
    setisLoading(true);
    // console.log(" values", values?.photo);

    let formData = new FormData();
    formData.append("photo", values?.photo);

    axios
      .put(`https://linked-posts.routemisr.com/users/upload-photo`, formData, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        setisLoading(false);
        queryClient.invalidateQueries(["profileData"]);
        console.log(res);
        resetinput();
        toast.success("Photo uploaded successfully!");
      })
      .catch((err) => {
        console.error(err);
        setisLoading(false);
        toast.error(err.response?.data?.message || "Upload failed");
      });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);

      // لو فيه preview قديم نمسحه
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setValue("photo", file);
      trigger("photo");
    }
  }

  // لو فيه preview قديم نمسحه
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="mt-3 flex items-center gap-2 text-sm sm:text-base text-blue-600 hover:underline cursor-pointer"
        id="changePhoto"
      >
        <FaCamera /> Change Photo
      </button>

      {openModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm pb-10">
          <div className="relative w-full max-w-md">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800">
                  Change Photo
                </h3>
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <form
                  onSubmit={handleSubmit(handleUpload)}
                  className="space-y-5"
                >
                  <div className="flex flex-col items-center gap-3">
                    {/*  hidden File input */}
                    <input
                      accept="image/jpeg, image/png, image/jpg"
                      type="file"
                      id="photo"
                      {...register("photo", {
                        onChange: (e) => handleFileChange(e),
                      })}
                      className="hidden"
                    />

                    {/* Label as button */}
                    <label
                      htmlFor="photo"
                      className="cursor-pointer flex flex-col items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <FaCamera size={28} />
                      <span>Choose a photo</span>
                    </label>

                    {/* Preview */}
                    {preview && (
                      <div className="w-28 h-28 rounded-full overflow-hidden border shadow">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* File name */}
                    {fileName && (
                      <p className="text-sm text-gray-600">{fileName}</p>
                    )}

                    {formState.errors.photo && (
                      <p className="text-red-500 text-sm mt-1">
                        {formState.errors.photo.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        
                        resetinput();
                      }}
                      className="text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-4 py-2 transition"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 font-semibold rounded-lg text-sm px-5 py-2 transition shadow-md"
                    >
                      {isLoading ? (
                        <i className="fas fa-spinner fa-spin text-white"></i>
                      ) : (
                        "Upload"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
