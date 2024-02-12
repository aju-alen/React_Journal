import React from 'react'

const MobileNavbar = () => {
  return (
    <div>
        <div className='md:hidden'>
        {/* Hamburger icon */}
        <div className=" absolute top-0 right-0 p-3  ">
          <img src='./images/mobile-hamburger.png' width="30px" height="10px" onClick={handleMobileNavBar} />
        </div>
        
        {openMobileNav && (
          <div className=" fixed inset-x-0 top-0 w-full h-full bg-white z-50">
            <div className=" absolute top-0 right-0 p-3  ">
              <img src='./images/mobile-close-icon.png' width="30px" height="10px" onClick={handleMobileNavBar} />
            </div>

            <div className=' mt-28 flex flex-col items-center text-2xl gap-3 '>
              <Link to="/">Home</Link>
              <Link to="/" >Journals</Link>
              <Link to="/" >Proceedings</Link>
              <Link to="/" >Conferences</Link>
              <Link to="/" >Submit Manuscript</Link>
            
            <div>
            {currentUser ?
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

export default MobileNavbar