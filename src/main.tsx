import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import WindowDecoration from "./components/WindowDecoration";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import "./css/App.css"
import PlayerPage from "./pages/PlayerPage";

const router = createBrowserRouter([
  { path: "/", element: <MainPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/play/:song-id", element: <PlayerPage /> }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WindowDecoration />
    <RouterProvider router={router} />
  </React.StrictMode>,
);
