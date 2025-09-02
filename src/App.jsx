import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Notfound from "./components/Notfound/Notfound";
import UserContextProvider from "./Context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PostContextProvider from "./Context/PostContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PostDetails from "./components/PostDetails/PostDetails";
import { Toaster } from "react-hot-toast";
const query = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            {" "}
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/PostDetails/:id",
        element: (
          <ProtectedRoute>
            {" "}
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <Notfound /> },
    ],
  },
]);

function App() {



  useEffect(() => {
    if (window?.flowbite) {
      window.flowbite.initFlowbite(); 
    }
  }, []); 
  const [count, setCount] = useState(0);

  return (
    <>
      <UserContextProvider>
        <PostContextProvider>
          <QueryClientProvider client={query}>
            <RouterProvider router={router} />
            <Toaster />
            <ReactQueryDevtools />
          </QueryClientProvider>
        </PostContextProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
