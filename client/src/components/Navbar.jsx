import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import NavLinksStatic from "./NavLinksStatic"

const Navbar = () => {
  const [userActive, setUserActive] = useState(false)
  const [openMobileNav, setOpenMobileNav] = useState(false)

  const isActive = () => {
    window.scrollY > 0 ? setUserActive(true) : setUserActive(false)
  }

  const handleMobileNavBar = () => {
    setOpenMobileNav(prev => !prev)
  }

  // Dummy user Login
  const currentUser = false;

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive)
    }
  }, [])

  return (
    <div >
      <div className=" hidden md:block">
        <nav className={` h-28 p-4 flex justify-between items-center fixed z-50 w-full transition-all duration-500 ease-in-out ${userActive ? ' bg-cyan-200' : ''} `}>
          {/* Logo on the left */}
          <Link className="text-black text-lg font-bold" to="/">
            Logo
          </Link>

          {/* Navigation links on the right */}
          <div className="flex justify-around items-center space-x-4 text-black font-bold">
            <NavLinksStatic />
            {currentUser ? <Link to="/" >Submit Manuscript</Link> : <Link to="/login" >Submit Manuscript</Link>}
            {!currentUser ?
              (<span className=" p-2 space-x-2">
                <Link to="/login" className="  text-lg font-bold border-2 rounded p-2 bg-green-300 hover:border-green-300 hover:bg-white">
                  <button >
                    Login
                  </button>
                </Link>
                <Link to="/register" className=" text-lg font-bold border-2 rounded p-2 border-blue-500">
                  <button > Register
                  </button>
                </Link>
              </span>)
              :
              (
                <span className=" p-2 space-x-2">
                  <Link to="/" >Dashboard</Link>
                  <Link to="/" className="  text-lg font-bold border-2 rounded p-2 hover:bg-red-300">
                    <button >
                      Logout
                    </button>
                  </Link>
                </span>
              )}
          </div>
        </nav>
      </div>


      {/* Mobile Navbar Overlay  */}
      <div className='md:hidden'>
        {/* Hamburger icon */}
        <div className=" absolute top-0 right-0 p-3  ">
          <img src='./images/mobile-hamburger.png' width="30px" height="10px" onClick={handleMobileNavBar} />
        </div>

        {openMobileNav && (
          <div className=" fixed inset-x-0 top-0 w-full h-full bg-white z-50 ">
            <div className=" absolute top-0 right-0 p-3  ">
              <img src='./images/mobile-close-icon.png' width="30px" height="10px" onClick={handleMobileNavBar} />
            </div>

            <div className=' mt-28 flex flex-col items-center text-2xl gap-3 '>
              <NavLinksStatic />
              {currentUser ? <Link to="/" >Submit Manuscript</Link> : <Link to="/login" >Submit Manuscript</Link>}
              <div>
                {!currentUser ?
                  (<div className=" flex flex-col gap-6 items-center">
                    <div>
                      <Link to="/" className="  text-lg font-bold border-2 rounded p-2 bg-green-300 hover:border-green-300 hover:bg-white">
                        <button >
                          Login
                        </button>
                      </Link>
                    </div>
                    <div>
                      <Link to="/" className=" text-lg font-bold border-2 rounded p-2 border-blue-500">
                        <button > Register
                        </button>
                      </Link>
                    </div>
                  </div>)
                  :
                  (
                    <div className=" flex flex-col gap-6 items-center">
                      <div>
                        <Link to="/" >Dashboard</Link>
                      </div>
                      <div>
                        <Link to="/" className="  text-lg font-bold border-2 rounded p-2 hover:bg-red-300">
                          <button >
                            Logout
                          </button>
                        </Link>
                      </div>
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