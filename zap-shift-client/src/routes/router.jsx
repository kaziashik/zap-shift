import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import Coverage from "../pages/Coverage/Coverage";
import CoverageDetails from "../pages/Coverage/CoverageDetails";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import PrivateRoute from "./PrivateRoute";
import Rider from "../pages/Rider/Rider";
import SendParcel from "../pages/sendParcel/SendParcel";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import ApproveRiders from "../pages/Dashboard/ApproveRiders/ApproveRiders";
import UsersManagement from "../pages/Dashboard/UsersManagement/UsersManagement";
import AdminRoute from "./AdminRoute";
import AssignRiders from "../pages/Dashboard/AssignRiders/AssignRiders";
import RiderRoute from "./RiderRoute";
import AssignedDeliveries from "../pages/Dashboard/AssignedDeliveries/AssignedDeliveries";
import CompletedDeliveries from "../pages/Dashboard/CompletedDeliveries/CompletedDeliveries";
import ParcelTrack from "../pages/ParcelTrack/ParcelTrack";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import Settings from "../pages/Dashboard/Settings/Settings";
import Explore from "../pages/Explore/Explore";
import ServiceDetails from "../pages/ServiceDetails/ServiceDetails";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Blog from "../pages/Blog/Blog";
import BlogDetails from "../pages/Blog/BlogDetails";
import Help from "../pages/Help/Help";
import AdminAnalytics from "../pages/Dashboard/Analytics/AdminAnalytics";

const centersLoader = () => fetch('/serviceCenters.json').then((res) => res.json());

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'explore', Component: Explore, loader: centersLoader },
      { path: 'services/:id', Component: ServiceDetails },
      { path: 'about', Component: About },
      { path: 'contact', Component: Contact },
      { path: 'blog', Component: Blog },
      { path: 'blog/:id', Component: BlogDetails },
      { path: 'help', Component: Help },
      {
        path: 'rider',
        element: <PrivateRoute><Rider /></PrivateRoute>,
        loader: centersLoader
      },
      {
        path: 'send-parcel',
        element: <PrivateRoute><SendParcel /></PrivateRoute>,
        loader: centersLoader
      },
      { path: 'coverage', Component: Coverage, loader: centersLoader },
      { path: 'coverage/:slug', Component: CoverageDetails, loader: centersLoader },
      { path: 'parcel-track/:trackingId', Component: ParcelTrack }
    ]
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      { path: 'login', Component: Login },
      { path: 'register', Component: Register }
    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { index: true, Component: DashboardHome },
      { path: 'my-parcels', Component: MyParcels },
      { path: 'payment/:parcelId', Component: Payment },
      { path: 'payment-history', Component: PaymentHistory },
      { path: 'payment-success', Component: PaymentSuccess },
      { path: 'payment-cancelled', Component: PaymentCancelled },
      { path: 'settings', Component: Settings },
      {
        path: 'assigned-deliveries',
        element: <RiderRoute><AssignedDeliveries /></RiderRoute>
      },
      {
        path: 'completed-deliveries',
        element: <RiderRoute><CompletedDeliveries /></RiderRoute>
      },
      {
        path: 'analytics',
        element: <AdminRoute><AdminAnalytics /></AdminRoute>
      },
      {
        path: 'approve-riders',
        element: <AdminRoute><ApproveRiders /></AdminRoute>
      },
      {
        path: 'assign-riders',
        element: <AdminRoute><AssignRiders /></AdminRoute>
      },
      {
        path: 'users-management',
        element: <AdminRoute><UsersManagement /></AdminRoute>
      }
    ]
  }
]);
