import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import Signup from "./Pages/Signup/Signup";

function App() {
  const router = createBrowserRouter([
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
