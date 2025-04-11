import { LoginPage } from "@/pages/auth/login";
import { HomePage } from "@/pages/home";
import PomodoroApp from "@/pages/pomodoro";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/pomodoro",
    element: <PomodoroApp />,
  },
]);
