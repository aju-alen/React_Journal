import { Link } from "react-router-dom"
const HeaderImage = ()=>{

    return (
      <div className="">
      <img
        src="./images/cloud-main-img.jpg"
        alt="Your Image Alt Text"
        className="w-full md:h-auto h-[370px] object-cover"
      />
      
      <div className="absolute md:top-1/3 top-1/4  left-1/2  transform -translate-x-1/2 -translate-y-1/2 text-gray-900 text-center w-full flex flex-col justify-center items-center gap-3 ">
        <h1 className=" text-3xl font-bold font md:text-8xl">Scientific Jounal</h1>
        <p className="text-lg text-center w-1/2">Paragraph about the scientific Journal  </p>
        <Link to="/journal" className=" text-lg font-bold border-2 rounded p-4 border-black bg-black md:w-1/6 text-white">
        <button >
          View Journal
        </button>
        </Link>
      </div>
    </div>
          
    )
}

export default HeaderImage