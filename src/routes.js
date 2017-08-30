import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import AllOrders from './components/pages/AllOrders';
import Another from './components/pages/Another';
import OrderDetail from './components/pages/OrderDetail';
import OrderUpdate from './components/pages/OrderUpdate';

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
  }
];
