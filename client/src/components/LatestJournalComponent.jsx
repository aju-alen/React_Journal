import React from 'react'
import LatestJournalsHome from './LatestJournalsHome'

const LatestJournalComponent = () => {
    return (
        <div>
            {window.innerWidth >= 1536 && <LatestJournalsHome width={'1400px'} />}
            {window.innerWidth >= 919 && window.innerWidth <= 1535 && <LatestJournalsHome width={'950px'} />}
            {window.innerWidth <= 919 && <LatestJournalsHome width={'350px'} />}
        </div>
    )
}

export default LatestJournalComponent