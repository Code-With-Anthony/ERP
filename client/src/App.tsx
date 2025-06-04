import { BrowserRouter, Route, Routes } from "react-router-dom"
import NotFound from "./pages/NotFound"
import ProductsPage from "./pages/ProductsPage"

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App