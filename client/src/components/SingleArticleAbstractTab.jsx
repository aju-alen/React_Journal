import React from 'react'

const SingleArticleAbstractTab = ({journal}) => {
  return (
    <div>
        <div className=" md:px-52 md:py-10">
            <h1 className="font-bold text-3xl  ">Abstract</h1>
            <p className="text-justify">{journal.articleAbstract}</p>
        </div>
    </div>
  )
}

export default SingleArticleAbstractTab