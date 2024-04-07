import NotFound from '@/pages/not-found';
import PrivateRoutes from './PrivateRoutes';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
);
const Category = lazy(() => import('@/pages/Category'));
const Size = lazy(() => import('@/pages/Size'));
const Product = lazy(() => import('@/pages/Product'));
const SignInPage = lazy(() => import('@/pages/auth/signin'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const StudentPage = lazy(() => import('@/pages/students'));
const Order = lazy(() => import("@/pages/Order"))
const Orderdetails = lazy(() => import("@/pages/Order/Orderdetail/Orderdetails"))

const StudentDetailPage = lazy(
  () => import('@/pages/students/StudentDetailPage')
);

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: '/',
      element: (
        <PrivateRoutes>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </PrivateRoutes>
      ),
      children: [
        {
          element: (
            <PrivateRoutes>
              <DashboardPage />
            </PrivateRoutes>
          ),
          index: true
        },
        {
          path: 'student',
          element: (
            <PrivateRoutes>
              {' '}
              <StudentPage />
            </PrivateRoutes>
          )
        },
        {
          path: 'category',
          element: (
            <PrivateRoutes>
              <Category />
            </PrivateRoutes>
          )
        },
        {
          path: 'size',
          element: (
            <PrivateRoutes>
              <Size />
            </PrivateRoutes>
          )
        },
        {
          path: 'product',
          element: (
            <PrivateRoutes>
              <Product />
            </PrivateRoutes>
          )
        },
        {
          path: 'order',
          element: (
            <PrivateRoutes>
              <Order />
            </PrivateRoutes>
          )
        },
        {
          path: 'order/:id',
          element: (
            <PrivateRoutes>
              <Orderdetails />
            </PrivateRoutes>
          )
        },
        {
          path: 'student/details',
          element: <StudentDetailPage />
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/login',
      element: <SignInPage />,
      index: true
    },
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
