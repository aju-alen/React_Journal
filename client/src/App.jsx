
import './App.css'
import Navbar from './components/Navbar'

import { createBrowserRouter,Outlet,RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import Register from './pages/Register'
import Login from './pages/Login'
import Journal from './pages/Journal'
import Proceedings from './pages/Proceedings'
import JournalCards from './pages/JournalCards'
import Article from './pages/Article'
import ProfileDashboard from './pages/ProfileDashboard'
import EditArticle from './pages/EditArticle'
import Payment from './pages/Payment'


function App() {

  const Layout = () => {
    return (
      <div className="">
          <Navbar />
          <Outlet />
          <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([{
    path: "/",
    element:<Layout/>,
    children:[
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/journal",
        element: <Journal />,
      },
      {
        path: "/proceedings",
        element: <Proceedings />,
      },
      ,
      {
        path: '/journal/:catId',
        element: <JournalCards />,
      },
      ,
      {
        path: '/journal/:catId/:articleId',
        element: <Article />,
      },
      {
        path: '/dashboard/:profileId',
        element: <ProfileDashboard />,
      },
      {
        path: '/editManuscript/:userId/:articleId',
        element: <EditArticle />,
      },
      {
        path: '/payment',
        element: <Payment/>,
      },
    ]
  }]);
  return <RouterProvider router={router} />;
 
}


export default App
