import React from 'react'
import { journals } from '../../data';
import { Link } from 'react-router-dom';


const ArticleCard = ({journalRanking}) => {
    const wordLimit = (journalAbstract) => {
        const string = journalAbstract
        let finalString = ''
        const tempArray = string.split(' ')
        if(tempArray.length >=60){
            tempArray.splice(60)
            finalString = tempArray.join(' ') + "..."
            return finalString
        }
        else return string
        
    }
    console.log(props);
  return (
    <div>
         <div className=" md:w-4/6 mx-auto  ">
                {journals.filter(journal => journal.journalRanking).map(journal => (
                    <div key={journal.id} className=" bg-white rounded-md flex flex-col gap-2 mt-8 h-auto  ">

                        <p className=' text-blue-500 mx-2 p-4'>{journal.proceedingTitle}</p>
                        <h3 className=' font-medium mx-6 '>{journal.title}</h3>
                        <p className=' mx-6 text-sm text-justify'>{wordLimit(journal.abstract)}</p>
                        <p className=' mx-6'>Authors: {journal.authors.map((author,idx) => (
                            <React.Fragment key={idx}>{author} | </React.Fragment>

                        ))}</p>
                        <p>{journal.authors.split}</p>
                        <p className='  mx-6'>Proceeding Number: {journal.proceedingNo}</p>

                        <Link to="/" className='font-bold border-2 rounded p-2 mx-6 border-greenS bg-green-400 md:w-1/6 sm: text-center  mb-4  '>
                            <button>View Article</button>
                        </Link>
                    </div>
                ))}
            </div>
    </div>
  )
}

export default ArticleCard