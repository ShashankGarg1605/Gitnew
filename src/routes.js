import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import AllOrders from "./components/pages/AllOrders";
import Another from "./components/pages/Another";
import OrderDetail from "./components/pages/OrderDetail";
import OrderUpdate from "./components/pages/OrderUpdate";
import PurchaseInvoice from "./components/pages/PurchaseInvoice";
import Filters from "./components/pages/Filters";
import PurchaseInvoiceDetail from "./components/pages/PurchaseInvoiceDetail";
import PlaceImageOrder from "./components/pages/PlaceImageOrder";
import AllImageOrders from "./components/pages/AllImageOrders";
import CommunicationPanel from "./components/pages/CommunicationPanel";
import AllUsers from "./components/pages/AllUsers";
import UserDetail from "./components/pages/UserDetail";
import UnconvertedImageOrders from "./components/pages/UnconvertedImageOrders";
import PlaceServiceRequest from "./components/pages/PlaceServiceRequest";
import InitiateReturn from "./components/pages/InitiateReturn";
import LandingPage from "./components/pages/LandingPage";

export default [
  {
    path: "/",
    component: Login
  },
  {
    path: "/LandingPage/",
    component: LandingPage
  },
  {
    path: "/dashboard/",
    component: Dashboard
  },
  {
    path: "/allorders/",
    component: AllOrders
  },
  {
    path: "/about/another/",
    component: Another
  },
  {
    path: "/orderdetail/",
    component: OrderDetail
  },
  {
    path: "/orderupdate/",
    component: OrderUpdate
  },
  {
    path: "/purchaseinvoice/",
    component: PurchaseInvoice
  },
  {
    path: "/filters/",
    component: Filters
  },
  {
    path: "/PurchaseInvoiceDetail/",
    component: PurchaseInvoiceDetail
  },
  {
    path: "/PlaceImageOrder/",
    component: PlaceImageOrder
  },
  {
    path: "/AllImageOrders/",
    component: AllImageOrders
  },
  {
    path: "/CommunicationPanel/",
    component: CommunicationPanel
  },
  {
    path: "/AllUsers/",
    component: AllUsers
  },
  {
    path: "/UserDetail/",
    component: UserDetail
  },
  {
    path: "/UnconvertedImageOrders/",
    component: UnconvertedImageOrders
  },
  {
    path: "/PlaceServiceRequest/",
    component: PlaceServiceRequest
  },
  {
    path: "/InitiateReturn/",
    component: InitiateReturn
  }

];
