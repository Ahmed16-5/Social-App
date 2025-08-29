// import React, { useContext, useState } from "react";
// import { useForm } from "react-hook-form";
// import z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../../Context/UserContext";

// export default function Login() {
//   const { userLogin, setuserLogin } = useContext(UserContext);
//   const [isLoading, setisLoading] = useState(false);
//   const [apiError, setapiError] = useState("");
//   const navigate = useNavigate();

//   const schema = z.object({
//     email: z.string().email("email is invalid"),
//     password: z
//       .string()
//       .regex(
//         /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
//         "Must include 1 upper case, 1 lower case, 1 number, 1 special char and min 8 char"
//       ),
//   });

//   const form = useForm({
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//     resolver: zodResolver(schema),
//   });

//   const { register, handleSubmit, formState } = form;

//   function handleLogin(values) {
//     setisLoading(true);
//     setapiError(null);

//     axios
//       .post(`https://linked-posts.routemisr.com/users/signin`, values)
//       .then((res) => {
//         localStorage.setItem("userToken", res.data.token);
//         setuserLogin(res.data.token);
//         setisLoading(false);
//         navigate("/");
//       })
//       .catch((err) => {
//         const errorMessage = err.response?.data?.error || "An error occurred";
//         setisLoading(false);
//         setapiError(errorMessage);
//       });
//   }

  
//   return (
//     <>
//       <form
//         className="max-w-md mx-auto my-12"
//         onSubmit={handleSubmit(handleLogin)}
//       >
//         {apiError && (
//           <h1 className="w-full p-3 bg-red-600 text-white rounded-2xl mx-auto font-bold text-center my-4">
//             {apiError}
//           </h1>
//         )}
//         <div className="relative z-0 w-full mb-5 group">
//           <input
//             type="email"
//             {...register("email")}
//             id="email"
//             className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//             placeholder=""
//           />
//           <label
//             htmlFor="email"
//             className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//           >
//             Enter your email
//           </label>
//           {formState.errors.email && formState.touchedFields.email && (
//             <p className="text-red-600 font-semibold text-center">
//               {formState.errors.email.message}
//             </p>
//           )}
//         </div>
//         <div className="relative z-0 w-full mb-5 group">
//           <input
//             type="password"
//             {...register("password")}
//             id="password"
//             className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//             placeholder=" "
//           />
//           <label
//             htmlFor="password"
//             className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//           >
//             Enter your password
//           </label>
//           {formState.errors.password && formState.touchedFields.password && (
//             <p className="text-red-600 font-semibold text-center">
//               {formState.errors.password.message}
//             </p>
//           )}
//         </div>
//         <div className="flex justify-center">
//           <button
//             type="submit"
//             className="cursor-pointer text-white bg-[#1DA1F2] hover:bg-[#1976D2] shadow-lg font-medium rounded-2xl text-center w-[50%] px-6 py-3 transition-all duration-200"
//           >
//             {isLoading ? (
//               <i className="fas fa-spinner fa-spin text-white"></i>
//             ) : (
//               "Login"
//             )}
//           </button>
//         </div>
//       </form>
//     </>
//   );
// }

import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function Login() {
  const { setuserLogin } = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false);
  const [apiError, setapiError] = useState("");
  const navigate = useNavigate();

  // Validation Schema
  const schema = z.object({
    email: z.string().email("Email is invalid"),
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Must include upper, lower, number, special char & min 8 chars"
      ),
  });

  const form = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schema),
  });

  const { register, handleSubmit, formState } = form;

  // Handle Login
  function handleLogin(values) {
    setisLoading(true);
    setapiError(null);

    axios
      .post(`https://linked-posts.routemisr.com/users/signin`, values)
      .then((res) => {
        localStorage.setItem("userToken", res.data.token);
        setuserLogin(res.data.token);
        navigate("/");
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.error || "An error occurred";
        setapiError(errorMessage);
      })
      .finally(() => setisLoading(false));
  }

  return (
    <section className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 md:py-0">
      {/* Left Side Image */}
      <div className="text-center md:w-1/2 w-full flex items-center justify-center ">
        <img
          src="https://img.freepik.com/free-vector/secure-login-concept-illustration_114360-4685.jpg"
          alt="Login Illustration"
          className="max-w-[80%] md:max-w-[70%] lg:max-w-[60%] object-contain"
        />
      </div>

      {/* Right Side Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center ">
        <div className="w-full max-w-md p-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back 👋
          </h2>

          {apiError && (
            <div className="p-3 mb-4 text-center text-white bg-red-600 rounded-lg">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-lg border ${
                  formState.errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formState.errors.email && formState.touchedFields.email && (
                <p className="mt-1 text-sm text-red-600">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-lg border ${
                  formState.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formState.errors.password && formState.touchedFields.password && (
                <p className="mt-1 text-sm text-red-600">
                  {formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition duration-200"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
