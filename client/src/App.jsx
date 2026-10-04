import { ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";
import store from './store/store';
import theme from './utils/theme';

import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import TradesPage from './pages/TradesPage';
import AddTradePage from './pages/AddTradePage';
import CloseTradePage from './pages/CloseTradePage';
import PortfolioPage from './pages/PortfolioPage';


const App = () => {
  return (
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    { /* Public roputes */ }
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected routes*/}
                    <Route path="/dashboard" element={
                        <ProtectedRoute><TradesPage /></ProtectedRoute>
                    } />

                    <Route path="/trades" element={
                        <ProtectedRoute><TradesPage /></ProtectedRoute>
                    } />

                    <Route path="/trades/new" element={
                        <ProtectedRoute><AddTradePage /></ProtectedRoute>
                    } />

                    <Route path="/trades/close/:id" element={
                        <ProtectedRoute><CloseTradePage /></ProtectedRoute>
                    } />

                    <Route path="/portfolio" element={
                        <ProtectedRoute><PortfolioPage /></ProtectedRoute>
                    } />

                    {/*Default redirects */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </Provider>
  );
}

export default App;