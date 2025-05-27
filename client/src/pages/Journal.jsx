import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sortJournalByAZ } from '../helperFunctions'
import ListJournalBySubject from '../components/ListJournalBySubject'
import axios from 'axios'
import ImageHeader from '../components/ImageHeader'
import { httpRoute } from '../helperFunctions.js'
import { DNA } from 'react-loader-spinner'

const Journal = () => {
  const [journalCategory, setJournalCategory] = useState([])
  const [loading, setLoading] = useState(true)
  const sortedJournal = sortJournalByAZ(journalCategory)

  useEffect(() => {
    const fetchAllJournalCategory = async () => {
      const resp = await axios(`${httpRoute}/api/journal`)
      setJournalCategory(resp.data)
      setLoading(false)
    }
    fetchAllJournalCategory()
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ImageHeader />
      
      {/* Hero Section */}
      <div className=" py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold  text-center">
            Explore Our Journals
          </h1>
          <p className="mt-4 text-xl text-blue-800 text-center max-w-3xl mx-auto">
            Discover a wide range of scientific journals across various disciplines
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar - Browse By Subject */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Browse By Subject
              </h2>
              <ListJournalBySubject />
            </div>
          </div>

          {/* Journals List */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Journals by Title
              </h2>
              
              <div className="space-y-8">
                {Object.entries(sortedJournal).map(([key, value]) => (
                  <div key={key} className="space-y-4">
                    <h3 className="text-2xl font-medium text-gray-700">
                      {key}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {value.map(data => (
                        <Link 
                          to={`/journal/${data.journalAbbreviation}`} 
                          key={data.id}
                          className="group p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-gray-800 group-hover:text-blue-600">
                                {data.journalTitle}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {data.journalAbbreviation}
                              </p>
                            </div>
                            <svg 
                              className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5l7 7-7 7" 
                              />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Journal


