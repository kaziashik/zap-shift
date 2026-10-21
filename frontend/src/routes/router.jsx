import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import RiderRoute from "./RiderRoute";
import Loading from "../components/Loading/Loading";
import RouteError from "../pages/RouteError/RouteError";

const withSuspense = (element) => (
  <Suspense fallback={<Loading />}>{element}</Suspense>
);

/* Route-level code splitting — users only download pages they visit */
const Home = lazy(() => import("../pages/Home/Home/Home"));
const Coverage = lazy(() => import("../pages/Coverage/Coverage"));
const CoverageDetails = lazy(() => import("../pages/Coverage/CoverageDetails"));
const Login = lazy(() => import("../pages/Auth/Login/Login"));
const Register = lazy(() => import("../pages/Auth/Register/Register"));
const Rider = lazy(() => import("../pages/Rider/Rider"));
const SendParcel = lazy(() => import("../pages/SendParcel/SendParcel"));
const EditParcel = lazy(() => import("../pages/SendParcel/EditParcel"));
const MyParcels = lazy(() => import("../pages/Dashboard/MyParcels/MyParcels"));
const Payment = lazy(() => import("../pages/Dashboard/Payment/Payment"));
const PaymentSuccess = lazy(() => import("../pages/Dashboard/Payment/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("../pages/Dashboard/Payment/PaymentCancelled"));
const PaymentHistory = lazy(() => import("../pages/Dashboard/PaymentHistory/PaymentHistory"));
const ApproveRiders = lazy(() => import("../pages/Dashboard/ApproveRiders/ApproveRiders"));
const UsersManagement = lazy(() => import("../pages/Dashboard/UsersManagement/UsersManagement"));
const AssignRiders = lazy(() => import("../pages/Dashboard/AssignRiders/AssignRiders"));
const AssignedDeliveries = lazy(() => import("../pages/Dashboard/AssignedDeliveries/AssignedDeliveries"));
const CompletedDeliveries = lazy(() => import("../pages/Dashboard/CompletedDeliveries/CompletedDeliveries"));
const ParcelTrack = lazy(() => import("../pages/ParcelTrack/ParcelTrack"));
const DashboardHome = lazy(() => import("../pages/Dashboard/DashboardHome/DashboardHome"));
const Settings = lazy(() => import("../pages/Dashboard/Settings/Settings"));
const Explore = lazy(() => import("../pages/Explore/Explore"));
const ServiceDetails = lazy(() => import("../pages/ServiceDetails/ServiceDetails"));
const About = lazy(() => import("../pages/About/About"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const Blog = lazy(() => import("../pages/Blog/Blog"));
const BlogDetails = lazy(() => import("../pages/Blog/BlogDetails"));
const Help = lazy(() => import("../pages/Help/Help"));
const Privacy = lazy(() => import("../pages/Legal/Privacy"));
const Terms = lazy(() => import("../pages/Legal/Terms"));
const AdminAnalytics = lazy(() => import("../pages/Dashboard/Analytics/AdminAnalytics"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: "explore", element: withSuspense(<Explore />) },
      { path: "services/:id", element: withSuspense(<ServiceDetails />) },
      { path: "about", element: withSuspense(<About />) },
      { path: "contact", element: withSuspense(<Contact />) },
      { path: "blog", element: withSuspense(<Blog />) },
      { path: "blog/:id", element: withSuspense(<BlogDetails />) },
      { path: "help", element: withSuspense(<Help />) },
      { path: "privacy", element: withSuspense(<Privacy />) },
      { path: "terms", element: withSuspense(<Terms />) },
      {
        path: "rider",
        element: withSuspense(
          <PrivateRoute>
            <Rider />
          </PrivateRoute>
        ),
      },
      {
        path: "send-parcel",
        element: withSuspense(
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
      },
      {
        path: "edit-parcel/:parcelId",
        element: withSuspense(
          <PrivateRoute>
            <EditParcel />
          </PrivateRoute>
        ),
      },
      { path: "coverage", element: withSuspense(<Coverage />) },
      { path: "coverage/:slug", element: withSuspense(<CoverageDetails />) },
      { path: "parcel-track/:trackingId", element: withSuspense(<ParcelTrack />) },
      { path: "*", element: withSuspense(<NotFound />) },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [
      { path: "login", element: withSuspense(<Login />) },
      { path: "register", element: withSuspense(<Register />) },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, element: withSuspense(<DashboardHome />) },
      { path: "my-parcels", element: withSuspense(<MyParcels />) },
      { path: "payment/:parcelId", element: withSuspense(<Payment />) },
      { path: "payment-history", element: withSuspense(<PaymentHistory />) },
      { path: "payment-success", element: withSuspense(<PaymentSuccess />) },
      { path: "payment-cancelled", element: withSuspense(<PaymentCancelled />) },
      { path: "settings", element: withSuspense(<Settings />) },
      {
        path: "assigned-deliveries",
        element: withSuspense(
          <RiderRoute>
            <AssignedDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "completed-deliveries",
        element: withSuspense(
          <RiderRoute>
            <CompletedDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "analytics",
        element: withSuspense(
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        ),
      },
      {
        path: "approve-riders",
        element: withSuspense(
          <AdminRoute>
            <ApproveRiders />
          </AdminRoute>
        ),
      },
      {
        path: "assign-riders",
        element: withSuspense(
          <AdminRoute>
            <AssignRiders />
          </AdminRoute>
        ),
      },
      {
        path: "users-management",
        element: withSuspense(
          <AdminRoute>
            <UsersManagement />
          </AdminRoute>
        ),
      },
      { path: "*", element: withSuspense(<NotFound />) },
    ],
  },
  {
    path: "*",
    element: withSuspense(<NotFound />),
  },
]);
