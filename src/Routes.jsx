import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Screens
import { Landpage } from "./screens/landpage/Landpage";
import { Profile } from "./screens/profile";
import { CaptureScreen } from "./screens/capture/Capture.jsx";
import { LandingPage } from "./screens/landpage/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landpage />,
  },
  {
    path: "/landingpage",
    element: <LandingPage />,
  },
  // {
  //   path: "/sign-in",
  //   element: <SignIn />,
  // },
  {
    path: "/:id/*",
    element: <Profile />,
  },
  {
    path: "/capture/*",
    element: <CaptureScreen />,
  },
]);

export const Routes = (props) => {
  // TODO: Preload all icons

  return <RouterProvider router={router} />;
};
