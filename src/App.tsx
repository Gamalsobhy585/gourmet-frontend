import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/layout";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Loader from "./components/loader";



const Products = React.lazy(() => import("./pages/products"));








const App: React.FC = () => {
  const queryClient = new QueryClient();

  const publicRoutes = [
    { path: "/", element: <Products /> },
   
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Loader size="w-24 h-24" color="border-t-primary" />}>
          <Routes>
            <Route element={<Layout />}>
              {publicRoutes.map(({ path, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <Suspense fallback={<Loader size="w-24 h-24" color="border-t-primary" />}>
                      {element}
                    </Suspense>
                  }
                />
              ))}
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer />
    </QueryClientProvider>

  );
};

export default App;
