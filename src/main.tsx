import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import "./css/App.css"
import PlayerPage from "./pages/PlayerPage";
import Layout from "./Layout";

const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <MainPage /> },
        { path: "/profile", element: <ProfilePage /> },
        { path: "/search", element: <SearchPage /> },
        { path: "/play/:song-id", element: <PlayerPage /> },
        { path: "/discover", element: <></> },
        { path: "/library", element: <></> },
        { path: "/playlist/:playlist", element: <></> }
      ]
    },
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
