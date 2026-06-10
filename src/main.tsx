import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProfilePage from "./pages/Profile";
import MainPage from "./pages/Main";
import SearchPage from "./pages/Search";
import PlayerPage from "./pages/Player";
import Layout from "./Layout";
import "@style/App.sass"
import Library from "./pages/Library";

const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <MainPage /> },
        { path: "/profile", element: <ProfilePage /> },
        { path: "/search", element: <SearchPage /> },
        { path: "/play/:song-id", element: <PlayerPage /> },
        { path: "/discover", element: <></> },
        { path: "/library", element: <Library /> },
        { path: "/playlist/:playlist", element: <></> }
      ]
    },
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <RouterProvider router={router} />
  </>,
);
