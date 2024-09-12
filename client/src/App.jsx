
import './App.css'
import Navbar from './components/Navbar'

import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
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
import CheckoutForm from './pages/CheckoutForm'
import ReturnAfterStripe from './pages/ReturnAfterStripe'
import ProductDisplay from './pages/ProductDisplay'
import EthicalPractice from './pages/EthicalPractice'
import FeeForPublication from './pages/FeeForPublication'
import PolicyWaiver from './pages/PolicyWaiver'
import AuthorFAQ from './pages/AuthorFAQ'
import ReviewerFAQ from './components/ReviewerFAQ'
import EditorFAQ from './components/EditorFAQ'
import ReviewersGuidelines from './pages/ReviewersGuidelines'
import PeerReview from './pages/PeerReview'
import Editors from './pages/Editors'
import Policies from './pages/Policies'
import Contact from './pages/Contact'
import TermsAndCondPage from './pages/TermsAndCondPage'
import ComingSoon from './components/ComingSoon'
import ConferencesPage from './pages/ConferencesPage'
import ResetPassword from './pages/ResetPassword'
import ForgetPassword from './pages/ForgetPassword'
import EditorialBoard from './pages/EditorialBoard'
import FullIssueHome from './components/FullIssueHome'




function App() {

  const Layout = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Outlet className='' />
        <div className="p-10">
    <FullIssueHome purchase={true} />
</div>
      </div>
      <Footer />
    </div>
    );
  };

  const router = createBrowserRouter([{
    path: "/",
    element: <Layout />,
    children: [
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
      {
        path: "/conferences",
        element: <ConferencesPage/>,
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
        path: '/checkout/:articleId/:checkoutStatus/:userId/:emailId',
        element: <CheckoutForm />,
      },
      {
        path: '/returnPayment',
        element: <ReturnAfterStripe />,
      },
      {
        path: '/productDisplay',
        element: <ProductDisplay />,
      },
      {
        path: 'ethics/:ethicalSlug',
        element: <EthicalPractice />,
      },
      {
        path: '/mansucript_handling_fee',
        element: <FeeForPublication />,
      },
      {
        path: '/waiver_policy',
        element: <PolicyWaiver />,
      },
      {
        path: 'faq/authorFAQ',
        element: <AuthorFAQ />,
      },
      {
        path: 'faq/reviewFAQ',
        element: <ReviewerFAQ />,
      },
      {
        path: 'faq/editorFAQ',
        element: <EditorFAQ />,
      },
      {
        path: '/reviewers_guidelines',
        element: <ReviewersGuidelines/>,
      },
      {
        path: '/peer_review',
        element: <PeerReview/>,
      },
      {
        path: '/for_editors',
        element: <Editors/>,
      },
      {
        path: '/policies',
        element: <Policies/>,
      },
      {
        path: '/contact',
        element: <Contact/>,
      },
      {
        path: '/terms',
        element: <TermsAndCondPage/>,
      },
      {
        path: '/forget-password',
        element: <ForgetPassword/>,
      },
      {
        path: '/reset-password/:resetToken',
        element: <ResetPassword/>,
      },
      {
        path: '/editorial-board',
        element: <EditorialBoard/>,
      },
     
    ]
  }]);
  return <RouterProvider router={router} />;

}


export default App
