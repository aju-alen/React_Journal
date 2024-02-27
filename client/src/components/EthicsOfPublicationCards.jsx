import { EthicsOfPublicationdata } from '../../data'
import { Link } from 'react-router-dom'
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const EthicsOfPublicationCards= () => {
   
    return (
        <div>
            <h2 className='text-3xl font-bold text-center'>Ethics of Publication</h2>
        <div className='flex flex-col md:flex-row justify-center md:justify-around items-center'>
        {EthicsOfPublicationdata.map(data =>(
                
             <Card sx={{ maxWidth: 345,minHeight:360,display:"flex", flexDirection:"column", justifyContent:'space-between' }} className='my-6' key={data.link}>

           
          <CardMedia
            sx={{ height: 140 }}
            image={data.img}
            title={data.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data.EthicsOfPublicationTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.EthicsOfPublicationContent}
            </Typography>
          </CardContent>
          <CardActions>
            <Link to={`/ethics${data.link}`} >
            <Button size='medium'>Learn More</Button>
            </Link>
          </CardActions>
          </Card>
          
            ))
        }
        </div>
        </div>
      );
}

export default EthicsOfPublicationCards


// return (
//     <div className=" w-full bg-white p-4">
//         <h2 className='text-3xl font-bold text-center'>Ethics of Publication</h2>
//         <div className="  bg-gray-100">
//         <div className='  md:grid md:grid-cols-4 sm:grid sm:grid-cols-1 gap-4  '>
            
//         {EthicsOfPublicationdata.map(data  => (
//             <Link to={`/ethics${data.link}`}   key={data.link} className='relative  h-full '>
//             <div   >
//             <img src="./images/card1.jpg" className=' bg-slate-900 object-cover' />
//                 <h2 className=' md:top-4 sm:top-24 left-5  z-1 lg:text-xl md:text-sm sm:text-2xl  font-bold text-gray-900 '>{data.EthicsOfPublicationTitle}</h2>
//                 <p className=' md:top-14 sm:top-32  left-5 z-1 sm:text-xl lg:text-lg  font-medium text-gray-900 '>{data.EthicsOfPublicationContent}</p>
                
//             </div>
//             </Link>
//         )) }
//         </div>
//         </div>
//     </div>
// )