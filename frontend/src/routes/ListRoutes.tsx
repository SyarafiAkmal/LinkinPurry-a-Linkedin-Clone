import React from "react";
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

const Login = React.lazy(() => import("@/pages/Login"));
const Register = React.lazy(() => import("@/pages/Register"));
const Profile = React.lazy(() => import("@/pages/Profile"));
const Feed = React.lazy(() => import("@/pages/Feed"));
const UserList = React.lazy(() => import("@/pages/Users"));
const ConnectionsList = React.lazy(() => import("@/pages/Connections/index"))
const ConnectionRequests = React.lazy(() => import("@/pages/Connections/request"));

const ListRoutes = [
  { path: "/", element: <Navigate to="/feed" /> },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profile/:user_id",
    element: <Profile />,
  },
  {
    path: "/users",
    element: <UserList />,
  },
  {
    path: "/feed",
    element:
    <ProtectedRoute>
      <Feed />
    </ProtectedRoute>
  },
  {
    path: "/connections",
    element: <ConnectionsList />
  },
  {
    path: "/connection-requests",
    element: <ConnectionRequests />
  }
];

export default ListRoutes;