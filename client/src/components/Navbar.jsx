import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import NavLinksStatic from "./NavLinksStatic"
import axios from "axios"
import { httpRoute } from "../helperFunctions.js"

const Navbar = () => {
  const Navigate = useNavigate()
  const [userActive, setUserActive] = useState(false)
  const [openMobileNav, setOpenMobileNav] = useState(false)

  const isActive = () => {
    window.scrollY > 0 ? setUserActive(true) : setUserActive(false)
  }

  const handleMobileNavBar = () => {
    console.log('clicked');
    setOpenMobileNav(prev => !prev)
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  console.log(currentUser,'in navbar');
  const handleLogout = async() => {
    const resp = await axios.get(`${httpRoute}/api/auth/logout`)
    localStorage.removeItem("currentUser")
    console.log(resp.data);
    Navigate('/')
  }

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive)
    }
  }, [])


  return (
    <div >
      <div className="hidden md:block">
        <nav className={`h-20 sm:h-24 md:h-28 p-3 sm:p-4 flex justify-between items-center fixed z-50 w-full transition-all duration-500 ease-in-out ${userActive ? 'bg-[#f1ded7] shadow-md' : 'bg-white/95 backdrop-blur-sm'} `}>
          {/* Logo on the left */}
          <Link className="text-black text-lg font-light hover:opacity-80 transition-opacity" to="/">
            <img src="./images/logo.png" alt="ScientificJournalsPortal" className='h-16 sm:h-20 md:h-24 object-cover' />
          </Link>

          {/* Navigation links on the right */}
          <div className="flex justify-around items-center space-x-3 sm:space-x-4 text-black font-medium">
            <NavLinksStatic />
            <Link 
              to={currentUser ? `/dashboard/${currentUser?.user?.id}?tab=0`:`/login`} 
              className="hover:text-[#543a31] transition-colors duration-200 text-sm sm:text-base"
            >
              Submit Manuscript
            </Link> 
            {!currentUser ?
              (<span className="p-2 space-x-2 flex items-center">
                <Link 
                  to="/login" 
                  className="text-sm sm:text-base font-semibold border-2 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 text-white transition-all duration-200 hover:scale-105"
                >
                  <button>Login</button>
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm sm:text-base font-semibold border-2 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 transition-all duration-200 hover:scale-105"
                >
                  <button>Register</button>
                </Link>
              </span>)
              :
              (
                <span className="p-2 space-x-2 flex items-center">
                  <Link 
                    to={`/dashboard/${currentUser?.user?.id}`} 
                    className="hover:text-[#543a31] transition-colors duration-200 text-sm sm:text-base"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/" 
                    className="text-sm sm:text-base font-semibold border-2 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-red-500 hover:text-white border-red-400 text-red-600 transition-all duration-200 hover:scale-105"
                  >
                    <button onClick={handleLogout}>Logout</button>
                  </Link>
                </span>
              )}
          </div>
        </nav>
      </div>


      {/* Mobile Navbar Overlay  */}
      <div className='md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md'>
        <div className="flex justify-between items-center p-3 sm:p-4">
          <Link className="text-black text-lg font-light hover:opacity-80 transition-opacity" to="/">
            <img src="./images/logo.png" alt="ScientificJournalsPortal" className='h-16 sm:h-20 object-cover' />
          </Link>
          {/* Hamburger icon */}
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={handleMobileNavBar}
            aria-label="Toggle menu"
          >
            <img src='./images/mobile-hamburger.png' width="30px" height="30px" alt="Menu" />
          </button>
        </div>

        {openMobileNav && (
          <div className="fixed inset-0 w-full h-full bg-white z-50 animate-slideIn">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b">
              <Link to="/" onClick={handleMobileNavBar}>
                <img src="./images/logo.png" alt="ScientificJournalsPortal" className='h-16 sm:h-20 object-cover' />
              </Link>
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={handleMobileNavBar}
                aria-label="Close menu"
              >
                <img src='./images/mobile-close-icon.png' width="30px" height="30px" alt="Close" />
              </button>
            </div>

            <div className='mt-8 sm:mt-12 flex flex-col items-center text-lg sm:text-xl gap-4 sm:gap-6 px-4'>
              <NavLinksStatic handleMobileNavBar={handleMobileNavBar} />
              {currentUser ? (
                <Link 
                  to={`/dashboard/${currentUser.user.id}?tab=1`} 
                  onClick={handleMobileNavBar}
                  className="hover:text-[#543a31] transition-colors duration-200 font-medium"
                >
                  Submit Manuscript
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  onClick={handleMobileNavBar}
                  className="hover:text-[#543a31] transition-colors duration-200 font-medium"
                >
                  Submit Manuscript
                </Link>
              )}
              <div className="w-full max-w-xs mt-4">
                {!currentUser ?
                  (<div className="flex flex-col gap-4 items-center w-full">
                    <Link 
                      to="/login" 
                      className="w-full text-center text-base sm:text-lg font-semibold border-2 rounded-lg px-6 py-3 bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 text-white transition-all duration-200" 
                      onClick={handleMobileNavBar}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="w-full text-center text-base sm:text-lg font-semibold border-2 rounded-lg px-6 py-3 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 transition-all duration-200" 
                      onClick={handleMobileNavBar}
                    >
                      Register
                    </Link>
                  </div>)
                  :
                  (
                    <div className="flex flex-col gap-4 items-center w-full">
                      <Link 
                        to={`/dashboard/${currentUser.user.id}`} 
                        onClick={handleMobileNavBar}
                        className="hover:text-[#543a31] transition-colors duration-200 font-medium text-base sm:text-lg"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/" 
                        className="w-full text-center text-base sm:text-lg font-semibold border-2 rounded-lg px-6 py-3 hover:bg-red-500 hover:text-white border-red-400 text-red-600 transition-all duration-200" 
                        onClick={handleLogout}
                      >
                        Logout
                      </Link>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar