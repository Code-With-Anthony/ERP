import { BrowserRouter, Route, Routes } from "react-router-dom"
import NotFound from "./pages/NotFound"
import ProductsPage from "./pages/ProductsPage"
import { createTheme, ThemeProvider } from "@mui/material"
import Layout from "./pages/Layout"
import CustomersPage from "./pages/CustomersPage"
import OrdersPage from "./pages/OrdersPage"

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
  })
  return (
    <div>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<ProductsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App