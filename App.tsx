import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Layout from '@/components/Layout';
import { useProducts, useOperations } from '@/hooks/useStore';
import DashboardPage from '@/pages/DashboardPage';
import ProductsPage from '@/pages/ProductsPage';
import OperationsPage from '@/pages/OperationsPage';
import VoicePage from '@/pages/VoicePage';
import ChatPage from '@/pages/ChatPage';
import NotFound from '@/pages/NotFound';

const App = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { operations, addOperation } = useOperations();

  return (
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage products={products} operations={operations} />} />
            <Route path="/products" element={<ProductsPage products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />} />
            <Route path="/operations" element={<OperationsPage products={products} operations={operations} addOperation={addOperation} updateProduct={updateProduct} />} />
            <Route path="/voice" element={<VoicePage products={products} addProduct={addProduct} addOperation={addOperation} updateProduct={updateProduct} />} />
            <Route path="/chat" element={<ChatPage products={products} operations={operations} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
