import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import AllOrders from "./components/pages/AllOrders";
import Another from "./components/pages/Another";
import OrderDetail from "./components/pages/OrderDetail";
import OrderUpdate from "./components/pages/OrderUpdate";
import OrderPod from "./components/pages/OrderPod";
import PurchaseInvoice from "./components/pages/PurchaseInvoice";
import Filters from "./components/pages/Filters";
import PurchaseInvoiceDetail from "./components/pages/PurchaseInvoiceDetail";
import PlaceImageOrder from "./components/pages/PlaceImageOrder";
import AllImageOrders from "./components/pages/AllImageOrders";
import CommunicationPanel from "./components/pages/CommunicationPanel";
import AllUsers from "./components/pages/AllUsers";
import UserDetail from "./components/pages/UserDetail";
import UnconvertedImageOrders from "./components/pages/UnconvertedImageOrders";
import ServiceRequests from "./components/pages/ServiceRequests";
import PlaceServiceRequest from "./components/pages/PlaceServiceRequest";
import Returns from "./components/pages/Returns";
import InitiateReturn from "./components/pages/InitiateReturn";
import LandingPage from "./components/pages/LandingPage";

import OrderSearch from "./components/pages/OrderVerification/OrderSearch";
import OrderSelect from "./components/pages/OrderVerification/OrderSelect";
import OrderDetailVerify from "./components/pages/OrderVerification/OrderDetailVerify";
import VerifyProduct from "./components/pages/OrderVerification/VerifyProduct";
import VerifiedTitles from "./components/pages/OrderVerification/VerifiedTitles";
import TitleSearch from "./components/pages/OrderVerification/TitleSearch";
import AssignOrder from "./components/pages/OrderVerification/AssignOrder";

import OrderPackingSearch from "./components/pages/OrderPacking/OrderPackingSearch";
import OrderPackingSelect from "./components/pages/OrderPacking/OrderPackingSelect";

import Procurement from "./components/pages/Procurement";
import Products from "./components/pages/Products";

import DebitNotes from "./components/pages/DebitNotes/DebitNotes";
import ViewDnDetails from "./components/pages/DebitNotes/ViewDnDetails";

import SampleStockMemo from "./components/pages/SampleStockMemo/SampleStockMemo";
import ViewDispatchInfo from "./components/pages/SampleStockMemo/ViewDispatchInfo";
import AddDispatchInfo from "./components/pages/SampleStockMemo/AddDispatchInfo";

import LocateStock from "./components/pages/LocateStock/LocateStock";
import AddStockLocation from "./components/pages/LocateStock/AddStockLocation";

import BookSelector from "./components/shared/BookSelector";

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
    path: "/orderpod/",
    component: OrderPod
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
    path: "/ServiceRequests/",
    component: ServiceRequests
  },
  {
    path: "/PlaceServiceRequest/",
    component: PlaceServiceRequest
  },
  {
    path: "/Returns/",
    component: Returns
  },
  {
    path: "/InitiateReturn/",
    component: InitiateReturn
  },
  {
    path: "/OrderSearch/",
    component: OrderSearch
  },
  {
    path: "/OrderSelect/",
    component: OrderSelect
  },
  {
    path: "/OrderDetailVerify/",
    component: OrderDetailVerify
  },
  {
    path: "/VerifyProduct/",
    component: VerifyProduct
  },
  {
    path: "/VerifiedTitles/",
    component: VerifiedTitles
  },
  {
    path: "/TitleSearch/",
    component: TitleSearch
  },
  {
    path: "/AssignOrder/",
    component: AssignOrder
  },
  {
    path: "/Procurement/",
    component: Procurement
  },
  {
    path: "/Products/",
    component: Products
  },
  {
    path: "/DebitNotes/",
    component: DebitNotes
  },
  {
    path: "/DebitNotes/ViewDnDetails",
    component: ViewDnDetails
  },
  {
    path: "/SampleStockMemo/",
    component: SampleStockMemo
  },
  {
    path: "/SampleStockMemo/ViewDispatchInfo",
    component: ViewDispatchInfo
  },
  {
    path: "/SampleStockMemo/AddDispatchInfo",
    component: AddDispatchInfo
  },
  {
    path: "/LocateStock",
    component: LocateStock
  },
  {
    path: "/AddStockLocation",
    component: AddStockLocation
  },
  {
    path: "/book-selector",
    component: BookSelector
  },
  {
    path: "/OrderPackingSearch/",
    component: OrderPackingSearch
  },
  {
    path: "/OrderPackingSelect/",
    component: OrderPackingSelect
  }
];
