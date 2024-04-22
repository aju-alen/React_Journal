import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { httpRoute } from '../helperFunctions';


const CreateNewJournal = () => {
    const [formJournalData, setFormJournalData] = useState({
        journalTitle: "",
        journalImageURL: "",
        journalAbbreviation: "",
        journalLanguage: "",
        journalDescription: "",
        journalISSN: "",
        journalDOI: "",
        journalStartYear: "",
        journalStartMonth: "",
        journalPublishedArticles: "",
    })

    const handleFormData = (e) => {
        const { name, value } = e.target;
        setFormJournalData({
            ...formJournalData,
            [name]: value
        })
    }

    const handleSubmitJournal = async () => {
        try {
            await axios.post(`${httpRoute}/api/journal/create`, formJournalData)

        }
        catch (err) {
            console.log(err);
        }
    }

    console.log(formJournalData, 'form data');
    return (
        <Box
            component="form"
            className='flex flex-col justify-between p-4'
            noValidate
            autoComplete="off"

        >
            <TextField id="outlined-basic" label="Journal Title" variant="outlined"
                name='journalTitle'
                value={formJournalData.journalTitle}
                placeholder='Title'
                onChange={handleFormData}
            />

            <TextField id="outlined-basic" label="Journal Abbreviation" variant="outlined"
                name='journalAbbreviation'
                value={formJournalData.journalAbbreviation}
                placeholder='eg: EIJER'
                onChange={handleFormData}
            />

            <TextField id="outlined-basic" label="Journal Language" variant="outlined"
                name='journalLanguage'
                value={formJournalData.journalLanguage}
                onChange={handleFormData}
            />

            <TextField id="outlined-basic" label="Journal Description" variant="outlined"
                name='journalDescription'
                value={formJournalData.journalDescription}
                onChange={handleFormData}
            />

            <TextField id="outlined-basic" label="Journal ISSN" variant="outlined"
                name='journalISSN'
                value={formJournalData.journalISSN}
                onChange={handleFormData}
            />

            <TextField id="outlined-basic" label="Journal DOI" variant="outlined"
                name='journalDOI'
                value={formJournalData.journalDOI}
                onChange={handleFormData}
            />

            <TextField id="outlined-basic" label="Journal Start Year" variant="outlined"
                name='journalStartYear'
                value={formJournalData.journalStartYear}
                onChange={handleFormData}
                placeholder='eg: 2024'
            />

            <TextField id="outlined-basic" label="Journal Start Month" variant="outlined"
                name='journalStartMonth'
                value={formJournalData.journalStartMonth}
                onChange={handleFormData}
                placeholder='Number of month eg: 1 for January'
            />
            <Button variant="contained" onClick={handleSubmitJournal}>Create new Journal </Button>
        </Box>

    );
}

export default CreateNewJournal