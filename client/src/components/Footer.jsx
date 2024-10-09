import React from 'react'
import { Link } from 'react-router-dom'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { Grid } from '@mui/material';

const Footer = () => {
  return (
    <div className="">
    
      
    <div className='bg-[#543a31] w-full hidden md:flex'>
       <div className='md:flex-row flex flex-col  w-full h-full justify-around md:items-start items-start sm:gap-5 sm:text-xs font-extralight text-white md:my-6 text-md'>
         <div className="flex flex-col gap-6 sm:text-start md:text-start ">
          
           <Link  className='flex  font-bold   '>Authors</Link>
           <Link to='/mansucript_handling_fee' className='  '>Fee for Publication</Link>
           <Link to='/faq/authorfaq' className='  '>FAQ for Authors </Link>
           <Link to='/waiver_policy' className='  '>Policy on Waivers</Link>
           <Link to='/peer_review' className=' '>Peer Review Process</Link>

         </div>
         <div className=" flex flex-col gap-6 sm:text-start md:text-start mb-6">
           <Link to='/waiver_policy' className=' font-bold '>Editors & Reviewers</Link>
          
           <Link to='/faq/reviewfaq' className='  '>FAQ for Reviewers</Link>
           <Link to='/faq/editorfaq' className=' '>FAQ for Editors </Link>
           <Link to='/reviewers_guidelines' className=' '>Reviewers Guidelines</Link>
           
           <Link to='/for_editors' className=' '>Editors</Link>
           <Link to='/editorial-board' className=' '>Editorial board</Link>
         </div>
         <div className="flex flex-col gap-6 sm:text-start md:text-start">
           <Link  className=' font-bold '>General </Link>
           <Link to='/policies' className=' '>Policies </Link>
           <Link to='/contact/new' className=' '>Contact Us </Link>
           <Link to='/all_articles.rss' className=' '>Subscribe to RSS </Link>
           <Link to='/terms' className=' '>Terms of Use </Link>
         </div>
       </div>
     </div>
    <Container 
    sx={{
      display:{xs:'flex',sm:'none'},
      backgroundColor: '#543a31',
      color: 'white',
      padding: '5px',
      fontSize: '20px',
      fontWeight: 'bold',
      paddingLeft: '20px',
      // justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <Stack 
      direction='column'
      spacing={2}
      >
        <Typography 
        sx={{
          fontSize: '22px',
          fontWeight: 'bold',

        }}
        >
          Authors
        </Typography>

        <Grid container spacing={2}>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/mansucript_handling_fee' className=''>Fee for Publication</Link>
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/faq/authorfaq' className=''>FAQ for Authors</Link>
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/peer_review' className=''>Peer Review Process</Link>
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/waiver_policy' className=''>Policy on Waivers</Link>
        </Typography>
      </Grid>
    
      {/* Add more Grid items as needed */}
    </Grid> 
        <Typography  sx={{
          fontSize: '22px',
          fontWeight: 'bold',

        }}>
          Editors & Reviewers
        </Typography>
        <Grid container spacing={2}>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/mansucript_handling_fee' className=''>Fee for Publication</Link>
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/faq/authorfaq' className=''>FAQ for Authors</Link>
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/waiver_policy' className=''>Policy on Waivers</Link>
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/faq/reviewfaq' className=''>FAQ for Reviewers</Link>
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/faq/editorfaq' className=''>FAQ for Editors</Link>
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/reviewers_guidelines' className=''>Reviewers Guidelines</Link>
        </Typography>
      </Grid>
     
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/for_editors' className=''>Editors</Link>
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/editorial-board' className=''>Editorial Board</Link>
        </Typography>
      </Grid>
    </Grid>
        <Typography  sx={{
          fontSize: '22px',
          fontWeight: 'bold',

        }}>
          General
        </Typography>
        <Grid container spacing={2}>
        <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/policies' className=''>Policies</Link>
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/contact/new' className=''>Contact Us</Link>
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/all_articles.rss' className=''>Subscribe to RSS</Link>
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'normal',
          }}
        >
          <Link to='/terms' className=''>Terms of Use</Link>
        </Typography>
      </Grid>
      </Grid>

      </Stack>
      </Container>
      </div>
  )
}

export default Footer