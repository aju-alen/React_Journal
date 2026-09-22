import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { httpRoute } from '../helperFunctions';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FormSection from './dashboard/FormSection';

const CreateNewJournal = () => {
    const [formJournalData, setFormJournalData] = useState({
        journalTitle: '',
        journalImageURL: '',
        journalAbbreviation: '',
        journalLanguage: '',
        journalDescription: '',
        journalISSN: '',
        journalDOI: '',
        journalStartYear: '',
        journalStartMonth: '',
        journalPublishedArticles: '',
    });
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [alertStatus, setAlertStatus] = useState('success');
    const [alertText, setAlertText] = useState('');

    const handleFormData = (e) => {
        const { name, value } = e.target;
        setFormJournalData({
            ...formJournalData,
            [name]: value,
        });
    };

    const handleSubmitJournal = async () => {
        try {
            setLoading(true);
            await axios.post(`${httpRoute}/api/journal/create`, formJournalData);
            setAlertStatus('success');
            setAlertText('Journal created successfully');
            setOpen(true);
            setFormJournalData({
                journalTitle: '',
                journalImageURL: '',
                journalAbbreviation: '',
                journalLanguage: '',
                journalDescription: '',
                journalISSN: '',
                journalDOI: '',
                journalStartYear: '',
                journalStartMonth: '',
                journalPublishedArticles: '',
            });
        } catch (err) {
            console.error(err);
            setAlertStatus('error');
            setAlertText('Error creating journal. Please try again.');
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: 'journalTitle', label: 'Journal title', placeholder: 'Title' },
        { name: 'journalAbbreviation', label: 'Abbreviation', placeholder: 'e.g. EIJER' },
        { name: 'journalLanguage', label: 'Language' },
        {
            name: 'journalDescription',
            label: 'Description',
            multiline: true,
            rows: 4,
        },
        { name: 'journalISSN', label: 'ISSN' },
        { name: 'journalDOI', label: 'DOI' },
        { name: 'journalStartYear', label: 'Start year', placeholder: 'e.g. 2024' },
        {
            name: 'journalStartMonth',
            label: 'Start month',
            placeholder: 'Month number, e.g. 1 for January',
        },
    ];

    return (
        <FormSection
            title="Create new journal"
            subtitle="Add a journal category for submissions and publishing."
        >
            <Box
                component="form"
                sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
                noValidate
                autoComplete="off"
            >
                {fields.map((field) => (
                    <TextField
                        key={field.name}
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={formJournalData[field.name]}
                        placeholder={field.placeholder}
                        onChange={handleFormData}
                        multiline={field.multiline}
                        rows={field.rows}
                    />
                ))}
                <Button
                    variant="contained"
                    onClick={handleSubmitJournal}
                    disabled={loading}
                    sx={{ alignSelf: 'flex-start' }}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                >
                    {loading ? 'Creating…' : 'Create journal'}
                </Button>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert
                    onClose={() => setOpen(false)}
                    severity={alertStatus}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertText}
                </Alert>
            </Snackbar>
        </FormSection>
    );
};

export default CreateNewJournal;
