import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import toast from "react-hot-toast";

const ChangePasswordModal = () => {
  const [openModal, setOpenModal] = useState(false);
  let { userLogin, setuserLogin } = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false);

  const schema = z
    .object({
      password: z
        .string()
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Must include 1 upper case, 1 lower case, 1 number, 1 special char and min 8 char"
        ),
      newPassword: z
        .string()
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Must include 1 upper case, 1 lower case, 1 number, 1 special char and min 8 char"
        ),
    })
    .refine((data) => data.newPassword !== data.password, {
      message: "New password must be different from current password",
      path: ["newPassword"],
    });

  const form = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
    resolver: zodResolver(schema),
  });

  let { register, handleSubmit, formState, reset } = form;

  function handleChangePassword(values) {
    setisLoading(true);
    axios
      .patch(
        `https://linked-posts.routemisr.com/users/change-password`,
        values,
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        localStorage.setItem("userToken", res.data.token);
        setuserLogin(res.data.token);
        setisLoading(false);
        toast.success("Password changed successfully", {
          duration: 3000,
          position: "top-right",
        });
        setOpenModal(false);
        reset();
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
        toast.error(err.response.data.error, {
          duration: 3000,
          position: "top-right",
        });
        setOpenModal(false);
        reset();
      });
    console.log("✅ Password changed:", values);
  }

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="text-white bg-gradient-to-r from-blue-500 to-indigo-600 
                   hover:from-blue-600 hover:to-indigo-700 
                   font-semibold rounded-xl shadow-md text-sm px-4 py-2.5 transition "
      >
        Change Password
      </button>

      {openModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center   backdrop-blur-sm  pb-10">
          <div className="relative w-full max-w-md ">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden ">
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800">
                  🔒 Change Password
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
                  onSubmit={handleSubmit(handleChangePassword)}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        🔑
                      </span>
                      <input
                        type="password"
                        id="password"
                        {...register("password")}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Enter current password"
                      />
                    </div>
                    {formState.errors.password &&
                      formState.touchedFields.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {formState.errors.password.message}
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        🔐
                      </span>
                      <input
                        type="password"
                        id="newPassword"
                        {...register("newPassword")}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Enter new password"
                      />
                    </div>
                    {formState.errors.newPassword &&
                      formState.touchedFields.newPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {formState.errors.newPassword.message}
                        </p>
                      )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setOpenModal(false)}
                      className="text-gray-700 bg-gray-200 hover:bg-gray-300 
                                 font-medium rounded-lg text-sm px-4 py-2 transition"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="text-white bg-gradient-to-r from-blue-500 to-indigo-600 
                                 hover:from-blue-600 hover:to-indigo-700 
                                 font-semibold rounded-lg text-sm px-5 py-2 transition shadow-md"
                    >
                      {isLoading ? (
                        <i className="fas fa-spinner fa-spin text-white"></i>
                      ) : (
                        "Change Password"
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
};

export default ChangePasswordModal;
