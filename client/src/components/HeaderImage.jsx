import axios from "axios"
import { Link } from "react-router-dom"
import { httpRoute } from "../helperFunctions.js"
const HeaderImage = ()=>{

  const handleClickJournal =async () => {
    const resp = await axios.get(`${httpRoute}/api/users`)
    console.log(resp.data);
  }

    return (
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[85vh] lg:h-[100vh]">
          <img
            src="./images/desert.jpg"
            alt="Scientific Journals Portal Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8">
          <div className="text-center w-full max-w-5xl flex flex-col justify-center items-center gap-4 sm:gap-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white drop-shadow-lg leading-tight px-4">
              Scientific Journals Portal
            </h1>
            {/* <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 drop-shadow-md max-w-3xl px-4">
              Advancing Knowledge Through Peer-Reviewed Research
            </p> */}
          </div>
        </div>
      </div>
    )
}

export default HeaderImage