import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import AppRoutes from "./routes/AppRoutes";
import { QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "./lib/react-query";
import AuthInitializer from "./features/auth/component/AuthInitializer";
import OutOfCreditsModal from "./features/pricing/components/OutOfCreditsModal";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <AppRoutes />
        <OutOfCreditsModal />
      </AuthInitializer>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </BrowserRouter>,
);
