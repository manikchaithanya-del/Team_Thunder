import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import PatientsPage from '@/components/pages/PatientsPage';
import PatientDetailPage from '@/components/pages/PatientDetailPage';
import DoctorPortalPage from '@/components/pages/DoctorPortalPage';
import PharmacyPortalPage from '@/components/pages/PharmacyPortalPage';
import LabPortalPage from '@/components/pages/LabPortalPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "patients",
        element: <PatientsPage />,
        routeMetadata: {
          pageIdentifier: 'patients',
        },
      },
      {
        path: "patients/:id",
        element: <PatientDetailPage />,
        routeMetadata: {
          pageIdentifier: 'patient-detail',
        },
      },
      {
        path: "doctor-portal",
        element: <DoctorPortalPage />,
        routeMetadata: {
          pageIdentifier: 'doctor-portal',
        },
      },
      {
        path: "pharmacy-portal",
        element: <PharmacyPortalPage />,
        routeMetadata: {
          pageIdentifier: 'pharmacy-portal',
        },
      },
      {
        path: "lab-portal",
        element: <LabPortalPage />,
        routeMetadata: {
          pageIdentifier: 'lab-portal',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
