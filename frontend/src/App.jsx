import React from "react";
import Routing from "./router/routing";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./services/queryClient";

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routing />
      </QueryClientProvider>
    </>
  );
};

export default App;
