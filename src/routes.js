import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import AllOrders from './components/pages/AllOrders';
import Another from './components/pages/Another';
import OrderDetail from './components/pages/OrderDetail';
import OrderUpdate from './components/pages/OrderUpdate';
import PurchaseInvoice from './components/pages/PurchaseInvoice';
import Filters from './components/pages/Filters';
import PurchaseInvoiceDetail from './components/pages/PurchaseInvoiceDetail';
import PlaceImageOrder from './components/pages/PlaceImageOrder';

export default [
  {
    path: '/',
    component: Login
  },
  {
    path: '/dashboard/',
    component: Dashboard
  },
  {
    path: '/allorders/',
    component: AllOrders
  },
  {
    path: '/about/another/',
    component: Another
  },
  {
    path: '/orderdetail/',
    component: OrderDetail
  },
  {
    path: '/orderupdate/',
    component: OrderUpdate
  },
  {
    path: '/purchaseinvoice/',
    component: PurchaseInvoice
  },
  {
    path: '/filters/',
    component: Filters
  },
  {
    path: '/PurchaseInvoiceDetail/',
    component: PurchaseInvoiceDetail
  },
  {
    path: '/PlaceImageOrder/',
    component: PlaceImageOrder
  }
];
