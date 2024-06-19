import React from 'react'
import ImageHeader from '../components/ImageHeader'
import { editorialBoardData } from '../utils/editorialBoardData.js'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Icon } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';







const EditorialBoard = () => {
    const [open, setOpen] = React.useState(false);
    const [about, setAbout] = React.useState('');
    const [contactDetails, setContactDetails] = React.useState('');
    const [profileImage, setProfileImage] = React.useState('');

    const toggleDrawer = (newOpen,about,contact,profileImage) => () => {
        console.log(about,contact);
        setOpen(newOpen);
        setAbout(about);
        setContactDetails(contact);
        setProfileImage(profileImage);
    };

    const DrawerList = (
        <Box sx={{ width: {xs:300,md:500} }} role="presentation" onClick={toggleDrawer(false)}>
            <Typography variant='h4' sx={{ textAlign: 'center', marginY: 2 }}>Biography</Typography>
            <Divider />
            <img src={profileImage} alt='profile' className='w-[250px] h-[190px] mx-auto' />
            <p className=' text-xs md:text-sm font-light w-5/6 mx-auto mt-3 '>
                {about}
            </p>
            <br />
            <p className=' text-xs md:text-sm font-light w-5/6 mx-auto text-blue-600'>
                Contact Details: {contactDetails}
            </p>
            
        </Box>
    );

    const card = (
        <React.Fragment>

            {editorialBoardData.map((editor, idx) => (
                <CardContent key={idx} sx={{
                    width: { xs: 5 / 6, md: 1 / 2, },
                    marginX: 'auto',
                    marginY: 2,
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Add shadow
                    borderRadius: 2, // Optional: add rounded corners
                }}>
                    <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                        {editor.designation}
                    </Typography>
                    <Typography variant="h5" component="div" sx={{
                        fontWeight: 'bold',
                    }}>
                        {editor.name}
                    </Typography>
                    <Typography sx={{
                        mb: 1.5,
                        fontWeight: 'bold',
                    }} color="text.secondary">
                        {editor.university}
                    </Typography>

                    <CardActions sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'

                    }}>
                        <Button size="small"
                            onClick={toggleDrawer(true,editor.about,editor.contact_details,editor.profileImg)}
                        >
                            View full biography
                            <Icon sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'

                            }}

                            >
                                <NavigateNextIcon />
                            </Icon>
                        </Button>
                    </CardActions>
                </CardContent>

            ))}

        </React.Fragment>
    );


    return (
        <div>
            <ImageHeader />
            <h1 className='text-center text-3xl font-bold my-4'>Editorial Board</h1>
            <Box sx={{ minWidth: 275 }}>
                <Card variant='elevation' >{card}</Card>
            </Box>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    )
}

export default EditorialBoard