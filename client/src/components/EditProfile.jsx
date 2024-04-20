import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { httpRoute } from '../helperFunctions'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const EditProfile = ({ userDetails }) => {
    const navigate = useNavigate()
    console.log(userDetails, 'userDetails');
    const [open, setOpen] = useState(false);
    const [alertStatus, setAlertStatus] = useState('success');
    const [alertText, setAlertText] = useState('');
    const [userData, setUserData] = useState({
        title: '',
        surname: '',
        otherName: '',
        email: '',
        affiliation: '',
        marketingCommunications: false
    })
    const handleFormChange = (e) => {
        const { name, value } = e.target
        setUserData(prev => ({ ...prev, [name]: value }))
    }
    const handleCheckedChange = (e) => {
        const { name, checked } = e.target
        setUserData(prev => ({ ...prev, [name]: checked }))
    }
    const handleSubmitEdit = async (e) => {
        try {
            e.preventDefault()
            const resp = await axios.post(`${httpRoute}/api/users/edit/${userDetails.user.id}`, userData)
            console.log(resp.data, 'eddited response data');
            setAlertStatus('success')
            setAlertText('Edit successful')
            setOpen(true)
            setTimeout(() => {
                navigate('/')
            }, 3000);
        } catch (error) {
            console.log(error);
            setAlertStatus('error')
            setAlertText('Edit failed, Please try again or contact Us')
            setOpen(true)
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        const getUserData = async () => {
            try {
                const res = await axios.get(`${httpRoute}/api/users/${userDetails.user.id}`)
                console.log(res.data, 'res.data');
                setUserData({
                    affiliation: res.data.affiliation,
                    email: res.data.email,
                    otherName: res.data.otherName,
                    surname: res.data.surname,
                    marketingCommunications: res.data.marketingCommunications,
                })
            } catch (error) {
                console.log(error);
            }
        }
        getUserData()
    }, [])

    console.log(userDetails, 'userDetails in edit profile');
    return (
        <div>
            <Box sx={{ minWidth:"auto" }} className='md:p-20'>
                <FormControl fullWidth>

                    <div className="mt-5">
                        <TextField fullWidth
                            id="outlined-basic"
                            label="Affiliation"
                            variant="outlined"
                            name='affiliation'
                            value={userData.affiliation}
                            onChange={handleFormChange} />
                    </div>
                    <div className="mt-5">
                        <TextField fullWidth
                            id="outlined-basic"
                            label="Email Address"
                            variant="outlined"
                            name='email'
                            value={userData.email}
                            onChange={handleFormChange} />
                    </div>
                    <div className="mt-5">
                        <TextField fullWidth
                            id="outlined-basic"
                            label="Other Name"
                            variant="outlined"
                            name='otherName'
                            value={userData.otherName}
                            onChange={handleFormChange} />
                    </div>
                    <div className="mt-5">
                        <TextField fullWidth
                            id="outlined-basic"
                            label="Surname"
                            variant="outlined"
                            name='surname'
                            value={userData.surname}
                            onChange={handleFormChange} />
                    </div>
                    <div className=" flex justify-start items-center mt-5">
                        <Checkbox
                            checked={userData.marketingCommunications}
                            name='marketingCommunications'
                            onChange={handleCheckedChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <label className=' text-xs md:w-1/2 '>Scientific Journals Portal may send you marketing communications about relevant products and events. You can unsubscribe at any time via your Scientific Journals Portal account. </label>
                    </div>


                    <Button className='mt-5' variant="contained" onClick={handleSubmitEdit}>Edit User</Button>
                </FormControl>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={alertStatus}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertText}
                </Alert>
            </Snackbar>

        </div>
    )
}

export default EditProfile