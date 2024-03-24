import NotFound from '@/pages/not-found';
import PrivateRoutes from './PrivateRoutes';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';


const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
);
const Category = lazy(
  () => import("@/pages/Category")
)
const SignInPage = lazy(() => import('@/pages/auth/signin'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const StudentPage = lazy(() => import('@/pages/students'));
const StudentDetailPage = lazy(
  () => import('@/pages/students/StudentDetailPage')
);

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: '/',
      element: (
        <PrivateRoutes >
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
        </PrivateRoutes>
      ),
      children: [
        {
          element:<PrivateRoutes ><DashboardPage /></PrivateRoutes> ,
          index: true
        },
        {
          path: 'student',
          element:<PrivateRoutes >  <StudentPage /></PrivateRoutes>
        },
        {
          path: 'category',
          element:<PrivateRoutes ><Category /></PrivateRoutes> 
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
