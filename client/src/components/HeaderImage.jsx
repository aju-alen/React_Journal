import axios from "axios"
import { Link } from "react-router-dom"
import { httpRoute } from "../helperFunctions.js"
const HeaderImage = ()=>{

  const handleClickJournal =async () => {
    const resp = await axios.get(`${httpRoute}/api/users`)
    console.log(resp.data);
  }

    return (
      <div className="">
      <img
        src="./images/desert.jpg"
        alt="Your Image Alt Text"
        className="w-full md:h-auto h-[370px] object-cover"
      />
      
      <div className="absolute sm:top-40 md:top-1/4 top-1/4  left-1/2  transform -translate-x-1/2 -translate-y-1/2 text-gray-900 text-center w-full flex flex-col justify-center items-center gap-3 ">
        <h1 className=" text-3xl font-bold font sm:text-4xl md:text-6xl">Scientific Journals Portal</h1>
        {/* <p className="text-lg text-center w-1/2">Paragraph about the scientific Journal  </p> */}
        {/* <Link to="/journal" className=" text-lg font-bold border-2 rounded p-4 border-black bg-black md:w-1/6 text-white"> */}
        {/* <button onClick={handleClickJournal}>
          View Journal
        </button> */}
        {/* </Link> */}
      </div>
    </div>
          
    )
}

export default HeaderImage