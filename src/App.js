import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ScrollToTop from "./customHook/useScrollToTop";
import Home from "./pages/website/Home/Home";
import About from "./pages/website/About/About";
import Faq from "./pages/website/faq/Faq";
import Contact from "./pages/website/contact/Contact";
import News from "./pages/website/news/News";
import Marketplace from "./pages/product/marketplace/Marketplace";
import Login from "./pages/product/auth/login/Login";
import Register from "./pages/product/auth/register/Register";
import Verify from "./pages/product/auth/verify/Verify";
import AccountCreated from "./pages/product/auth/verify/AccountCreated";
import Plans from "./pages/product/plans/Plans";
import Layout from "./components/layout/Layout";
import Profile from "./pages/product/profile/Profile";
import ProfileSetUpCompleted from "./pages/product/profile/ProfileSetUpCompleted";
import AddNewFarm from "./pages/product/farm/AddNewFarm";
import FarmList from "./pages/product/farm/FarmList";
import Dashboard from "./pages/product/dashboard/Dashboard";
import MyFarm from "./pages/product/farm/MyFarm";
import AddNewProduce from "./pages/product/farm/AddNewProduce";
import Wallet from "./pages/product/wallet/Wallet";
import Orders from "./pages/product/orders/Orders";
import Notifications from "./pages/product/notifications/Notifications";
import AllVehicles from "./pages/product/fleet/AllVehices";
import RegisterNewVehicle from "./pages/product/fleet/RegisterNewVehicle";
import Decline from "./pages/product/orders/Decline";
import LogisticsDelivery from "./pages/product/orders/LogisticsDelivery";
import Cart from "./pages/product/marketplace/Cart";
import Checkout from "./pages/product/marketplace/Checkout";
import { UserProvider } from "./UserContext";
import { CartProvider } from "./CartContext";
import OrderConfirmation from "./pages/product/marketplace/OrderConfirmation";
import FarmerOrders from "./pages/product/orders/FarmerOrders";
import BlogForm from "./pages/website/news/BlogForm";
import NewsBlog from "./pages/website/news/NewsBlog";
import LogisticsOrders from "./components/orders/LogisticsOrders";
import PrivateRoute from "./PrivateRoute";

axios.defaults.withCredentials = true;

function App() {
  return (
  <UserProvider>
    <CartProvider>
      <BrowserRouter>
        <ToastContainer />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/news/:id" element={<News />} />
          <Route path="/marketplace/" element={<Marketplace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:accountType" element={<Verify />} />
          <Route path="/news" element={<NewsBlog />} />
          <Route path="/news/create" element={<BlogForm />} />
          <Route path="/news/edit/:id" element={<BlogForm />} />

          <Route
            path="/registration-completed/:type"
            element={<AccountCreated />}
          />
          <Route path="/plans" element={<Plans />} />

          <Route
            path="/profile/:type"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />

          <Route
            path="/profile/setup-completed/:type"
            element={<ProfileSetUpCompleted />}
          />

          <Route
            path="/dashboard/:type"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/logistics/fleet"
            element={
            <PrivateRoute>
              <Layout>
                <AllVehicles />
              </Layout>
            </PrivateRoute>
            }
          />

          <Route
            path="/logistics/fleet/new"
            element={
            <PrivateRoute>
              <Layout>
                <RegisterNewVehicle />
              </Layout>
            </PrivateRoute>
            }
          />

          <Route
            path="/farmer/my-farm"
            element={
            <PrivateRoute>
              <Layout>
                <FarmList />
              </Layout>
            </PrivateRoute>
            }
          />


          <Route
            path="/farmer/my-farm/new"
            element={
            <PrivateRoute>
              <Layout>
                <AddNewFarm />
              </Layout>
            </PrivateRoute>
            }
          />

          <Route
            path="/farmer/my-farm/:farmId/new-produce"
            element={
            <PrivateRoute>
              <Layout>
                <AddNewProduce />
              </Layout>
            </PrivateRoute>
            }
          />
          <Route
            path="/farmer/my-farm/:farmId/produce-list"
            element={
            <PrivateRoute>
              <Layout>
                <MyFarm />
              </Layout>
            </PrivateRoute>
            }
          />

          <Route
            path="/farmer/my-farm/farms"
            element={
            <PrivateRoute>
              <Layout>
                <FarmList />
              </Layout>
            </PrivateRoute>

            }
          />

          <Route
            path="/farmer/wallet"
            element={
            <PrivateRoute>
              <Layout>
                <Wallet />
              </Layout>
            </PrivateRoute>
            }
          />

          <Route
            path="/orders/:type"
            element={
            <PrivateRoute>
              <Layout>
                <Orders />
              </Layout>
            </PrivateRoute>
            }
          />
          



          <Route
            path="/orders/ongoing-delivery/:type"
            element={
            <PrivateRoute>
              <Layout>
                <LogisticsDelivery />
              </Layout>
            </PrivateRoute>
            }
          />

          <Route path="/orders/rejected/:type" element={<Decline />} />

          <Route
            path="/notifications/:type"
            element={
            <PrivateRoute>
              <Layout>
                <Notifications />
              </Layout>
            </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <Cart />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout/>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <OrderConfirmation/>
            }
          />

          
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </UserProvider>
  );
}

export default App;

/*
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ScrollToTop from "./customHook/useScrollToTop";
import Home from "./pages/website/Home/Home";
import About from "./pages/website/About/About";
import Faq from "./pages/website/faq/Faq";
import Contact from "./pages/website/contact/Contact";
import News from "./pages/website/news/News";
import Marketplace from "./pages/product/marketplace/Marketplace";
import Login from "./pages/product/auth/login/Login";
import Register from "./pages/product/auth/register/Register";
import Verify from "./pages/product/auth/verify/Verify";
import AccountCreated from "./pages/product/auth/verify/AccountCreated";
import Plans from "./pages/product/plans/Plans";
import Layout from "./components/layout/Layout";
import Profile from "./pages/product/profile/Profile";
import ProfileSetUpCompleted from "./pages/product/profile/ProfileSetUpCompleted";
import AddNewFarm from "./pages/product/farm/AddNewFarm";
import FarmList from "./pages/product/farm/FarmList";
import Dashboard from "./pages/product/dashboard/Dashboard";
import MyFarm from "./pages/product/farm/MyFarm";
import AddNewProduce from "./pages/product/farm/AddNewProduce";
import Wallet from "./pages/product/wallet/Wallet";
import Orders from "./pages/product/orders/Orders";
import Notifications from "./pages/product/notifications/Notifications";
import AllVehicles from "./pages/product/fleet/AllVehices";
import RegisterNewVehicle from "./pages/product/fleet/RegisterNewVehicle";
import Decline from "./pages/product/orders/Decline";
import LogisticsDelivery from "./pages/product/orders/LogisticsDelivery";
import { UserProvider } from "./UserContext";
import { CartProvider } from "./CartContext";
import Cart from "./pages/product/marketplace/Cart";
import BlogForm from "./pages/website/news/BlogForm";
import NewsBlog from "./pages/website/news/NewsBlog";
import Checkout from "./pages/product/marketplace/Checkout";
import OrderConfirmation from "./pages/product/marketplace/OrderConfirmation";
import FarmerOrders from "./pages/product/orders/FarmerOrders";


axios.defaults.withCredentials = true;

function App() {
  return (
<UserProvider>
  <CartProvider>
    <BrowserRouter>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/faqs" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/marketplace" element={<Marketplace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:accountType" element={<Verify />} />

        <Route
          path="/registration-completed/:type"
          element={<AccountCreated />}
        />
        <Route path="/plans" element={<Plans />} />

        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route
          path="/profile/setup-completed"
          element={<ProfileSetUpCompleted />}
        />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/fleet"
          element={
            <Layout>
              <AllVehicles />
            </Layout>
          }
        />

        <Route
          path="/fleet/new"
          element={
            <Layout>
              <RegisterNewVehicle />
            </Layout>
          }
        />

        <Route
          path="/my-farm"
          element={
            <Layout>
              <MyFarm />
            </Layout>
          }
        />

        <Route
          path="/my-farm/new"
          element={
            <Layout>
              <AddNewFarm />
            </Layout>
          }
        />
        <Route
          path="/wallet"
          element={
            <Layout>
              <Wallet />
            </Layout>
          }
        />

        <Route
          path="/orders"
          element={
            <Layout>
              <Orders />
            </Layout>
          }
        />

        <Route
          path="/orders/ongoing-delivery"
          element={
            <Layout>
              <LogisticsDelivery />
            </Layout>
          }
        />

        <Route path="/orders/rejected" element={<Decline />} />

        <Route
          path="/notifications"
          element={
            <Layout>
              <Notifications />
            </Layout>
          }
        />
        <Route path="/news/create" element={<BlogForm/>} />
        <Route path="/news/edit/:id" element={<BlogForm />} />
        <Route path="/news" element={<NewsBlog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
            path="/order-confirmation"
            element={
              <OrderConfirmation/>
            }
          />
        <Route path="/farmer/orders" element={<Layout><FarmerOrders /></Layout>} />
        <Route path="/orders/ongoing-delivery/:type" element={<Layout><LogisticsDelivery /></Layout>} />
        <Route path="/farmer/my-farm/farms" element={<Layout><FarmList /></Layout>} />
        <Route path="/farmer/my-farm/:farmId/produce-list" element={<Layout><MyFarm /></Layout>} />
        <Route path="/farmer/my-farm/:farmId/new-produce" element={<Layout><AddNewProduce /></Layout>} />
        <Route path="/notifications/:type" element={<Layout><Notifications /></Layout>} />
        
      
      </Routes>
    </BrowserRouter>
  </CartProvider>
</UserProvider>
  );
}

export default App;
*/
