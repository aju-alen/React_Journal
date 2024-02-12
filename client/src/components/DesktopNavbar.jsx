import React from 'react'

const DesktopNavbar = () => {
  return (
    <div>
        <div className=" hidden md:block">
        <nav className={` h-28 p-4 flex justify-between items-center fixed w-full transition-all duration-500 ease-in-out ${userActive ? ' bg-cyan-200' : ''} `}>
          {/* Logo on the left */}
          <Link className="text-black text-lg font-bold" to="/">
            Logo
          </Link>

          {/* Navigation links on the right */}
          <div className="flex justify-around items-center space-x-4 text-black font-bold">
            <Link to="/">Home</Link>
            <Link to="/" >Journals</Link>
            <Link to="/" >Proceedings</Link>
            <Link to="/" >Conferences</Link>
            <Link to="/" >Submit Manuscript</Link>
            {currentUser ?
              (<span className=" p-2 space-x-2">
                <Link to="/" className="  text-lg font-bold border-2 rounded p-2 bg-green-300 hover:border-green-300 hover:bg-white">
                  <button >
                    Login
                  </button>
                </Link>
                <Link to="/" className=" text-lg font-bold border-2 rounded p-2 border-blue-500">
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
    </div>
  )
}

export default DesktopNavbar