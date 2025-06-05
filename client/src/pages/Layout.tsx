import {
    AppBar,
    Box,
    Container,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material"
import {
    Menu as MenuIcon,
    People as CustomersIcon,
    Inventory as ProductsIcon,
    ShoppingCart as OrdersIcon,
} from "@mui/icons-material"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const drawerWidth = 240

const menuItems = [
    { path: "/", label: "Products", icon: <ProductsIcon /> },
    { path: "/customers", label: "Customers", icon: <CustomersIcon /> },
    { path: "/orders", label: "Orders", icon: <OrdersIcon /> },
]

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const navigate = useNavigate()
    const location = useLocation()

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap>ERP System</Typography>
            </Toolbar>
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.path}
                        onClick={() => {
                            navigate(item.path)
                            if (isMobile) setMobileOpen(false)
                        }}
                        sx={{
                            cursor: "pointer",
                            backgroundColor: location.pathname === item.path ? "action.selected" : "transparent",
                            "&:hover": { backgroundColor: "action.hover" },
                        }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
        </div>
    )

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {menuItems.find(item => item.path === location.pathname)?.label || "ERP System"}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            display: { xs: "block", md: "none" },
                            "& .MuiDrawer-paper": { width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                ) : (
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: "none", md: "block" },
                            "& .MuiDrawer-paper": { width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                )}
            </Box>

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Container maxWidth="xl">{children}</Container>
            </Box>
        </Box>
    )
}

export default Layout
