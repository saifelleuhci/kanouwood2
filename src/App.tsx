import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import { AdminAuth } from "./components/AdminAuth";
import { AdminInterface } from "./components/AdminInterface";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { setupDatabase } from './lib/setupDatabase';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminInterface />
                </ProtectedRoute>
              }
            />
            <Route path="/products" element={<Products />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
