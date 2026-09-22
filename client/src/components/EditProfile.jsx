import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { httpRoute } from '../helperFunctions'
import axios from 'axios'
import FormSection from './dashboard/FormSection'

const EditProfile = ({ userDetails }) => {
    const [open, setOpen] = useState(false)
    const [alertStatus, setAlertStatus] = useState('success')
    const [alertText, setAlertText] = useState('')
    const [saving, setSaving] = useState(false)
    const [userData, setUserData] = useState({
        title: '',
        surname: '',
        otherName: '',
        email: '',
        affiliation: '',
        marketingCommunications: false,
    })

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setUserData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCheckedChange = (e) => {
        const { name, checked } = e.target
        setUserData((prev) => ({ ...prev, [name]: checked }))
    }

    const handleSubmitEdit = async (e) => {
        e.preventDefault()
        try {
            setSaving(true)
            await axios.post(
                `${httpRoute}/api/users/edit/${userDetails.user.id}`,
                userData
            )
            setAlertStatus('success')
            setAlertText('Profile updated successfully')
            setOpen(true)

            const stored = JSON.parse(localStorage.getItem('currentUser'))
            if (stored?.user) {
                stored.user = {
                    ...stored.user,
                    surname: userData.surname,
                    otherName: userData.otherName,
                    email: userData.email,
                    affiliation: userData.affiliation,
                    marketingCommunications: userData.marketingCommunications,
                }
                localStorage.setItem('currentUser', JSON.stringify(stored))
            }
        } catch (error) {
            console.error(error)
            setAlertStatus('error')
            setAlertText('Update failed. Please try again or contact us.')
            setOpen(true)
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        const getUserData = async () => {
            try {
                const res = await axios.get(
                    `${httpRoute}/api/users/${userDetails.user.id}`
                )
                setUserData({
                    affiliation: res.data.affiliation || '',
                    email: res.data.email || '',
                    otherName: res.data.otherName || '',
                    surname: res.data.surname || '',
                    title: res.data.title || '',
                    marketingCommunications: res.data.marketingCommunications || false,
                })
            } catch (error) {
                console.error(error)
            }
        }
        if (userDetails?.user?.id) getUserData()
    }, [userDetails?.user?.id])

    return (
        <FormSection
            title="Edit profile"
            subtitle="Update your account details. Changes stay on this page."
        >
            <Box component="form" onSubmit={handleSubmitEdit} noValidate>
                <FormControl fullWidth>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            fullWidth
                            label="Surname"
                            name="surname"
                            value={userData.surname}
                            onChange={handleFormChange}
                        />
                        <TextField
                            fullWidth
                            label="Other name"
                            name="otherName"
                            value={userData.otherName}
                            onChange={handleFormChange}
                        />
                        <TextField
                            fullWidth
                            label="Email address"
                            name="email"
                            type="email"
                            value={userData.email}
                            onChange={handleFormChange}
                        />
                        <TextField
                            fullWidth
                            label="Affiliation"
                            name="affiliation"
                            value={userData.affiliation}
                            onChange={handleFormChange}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={userData.marketingCommunications}
                                    name="marketingCommunications"
                                    onChange={handleCheckedChange}
                                />
                            }
                            label="Scientific Journals Portal may send you marketing communications about relevant products and events. You can unsubscribe at any time."
                            sx={{
                                alignItems: 'flex-start',
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '0.85rem',
                                    color: 'text.secondary',
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                            sx={{ alignSelf: 'flex-start', mt: 1 }}
                        >
                            {saving ? 'Saving…' : 'Save changes'}
                        </Button>
                    </Box>
                </FormControl>
            </Box>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
            >
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
    )
}

export default EditProfile
