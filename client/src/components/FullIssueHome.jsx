import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { httpRoute } from '../helperFunctions'

const FullIssueHome = () => {
    const [imageUrl, setImageUrl] = useState('')
    const [pdfUrl, setPdfUrl] = useState('')

    useEffect(() => {
        try {
            const getLatestFullIssue = async () => {

                const getFullissueResp = await axios.get(`${httpRoute}/api/fullIssue/getIssue`)

                setImageUrl(getFullissueResp.data.getIssue[0]?.issueImageURL)
                setPdfUrl(getFullissueResp.data.getIssue[0]?.issueDoccumentURL)
            }
            getLatestFullIssue()

        }
        catch (err) {
            console.log(err)
        }

    }, [])
    console.log(imageUrl, pdfUrl, 'urls');
    return (
        <>
            {(imageUrl && pdfUrl) && (
                <div className=" flex flex-col items-center justify-center p-10">
                    <h1 className="text-center text-3xl font-bold p-4 ">Purchase Full Issue</h1>
                    <Link to={pdfUrl}>
                        <img src={imageUrl} alt="cloud" className=' w-64 h-64' />
                    </Link>
                </div>
            )}
        </>
    )
}

export default FullIssueHome