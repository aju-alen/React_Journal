import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { httpRoute } from '../helperFunctions'

const FullIssueHome = () => {
    const [imageUrl, setImageUrl] = useState('')
    const [pdfUrl, setPdfUrl] = useState('')
    const [fullIssueId, setFullIssueId] = useState('')
    const [userId, setUserId] = useState('')

    useEffect(() => {
        try {
            const getLatestFullIssue = async () => {
                
                const getFullissueResp = await axios.get(`${httpRoute}/api/fullIssue/getIssue`)

                setImageUrl(getFullissueResp.data.getIssue[0]?.issueImageURL)
                setPdfUrl(getFullissueResp.data.getIssue[0]?.issueDoccumentURL)
                setFullIssueId(getFullissueResp.data.getIssue[0]?.id)

                const getUser = JSON.parse(localStorage.getItem('currentUser'))?.user?.id
                setUserId(getUser)
                console.log(getUser, 'gettttttttuser');
                // setUserId(getUser)
            }
            getLatestFullIssue()

        }
        catch (err) {
            console.log(err)
        }

    }, [])
    // console.log(imageUrl, pdfUrl, 'urls');
    console.log(fullIssueId, 'urls');

    return (
        <>
            {(imageUrl && pdfUrl) && (
                <div className=" flex flex-col items-center justify-center p-10">
                    <h1 className="text-center text-3xl font-bold p-4 ">Purchase Full Issue</h1>
                    <Link to={`/checkout/${fullIssueId}/fullIssue/${userId}`}>
                        <img src={imageUrl} alt="cloud" className=' w-64 h-64' />
                    </Link>
                </div>
            )}
        </>
    )
}

export default FullIssueHome