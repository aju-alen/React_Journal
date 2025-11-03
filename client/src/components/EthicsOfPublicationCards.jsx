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
        <div className="w-full">
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-gray-900'>
                Ethics of Publication
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-center px-4 sm:px-6 md:px-8'>
                {EthicsOfPublicationdata.map(data =>(
                    <Card 
                        sx={{ 
                            maxWidth: 345, 
                            minHeight: 380,
                            display: "flex", 
                            flexDirection: "column", 
                            justifyContent: 'space-between',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                            }
                        }} 
                        className='my-4 sm:my-6 w-full max-w-sm' 
                        key={data.link}
                    >
                        <CardMedia
                            sx={{ height: 160 }}
                            image={data.img}
                            title={data.title}
                        />
                        <CardContent sx={{ flexGrow: 1, padding: '20px' }}>
                            <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600, marginBottom: '12px', fontSize: '1.25rem' }}>
                                {data.EthicsOfPublicationTitle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                                {data.EthicsOfPublicationContent}
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ padding: '0 20px 20px' }}>
                            <Link to={`/ethics${data.link}`} className="no-underline">
                                <Button 
                                    size='medium' 
                                    sx={{ 
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        padding: '10px 24px',
                                        backgroundColor: '#543a31',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#3d2a23'
                                        }
                                    }}
                                >
                                    Learn More
                                </Button>
                            </Link>
                        </CardActions>
                    </Card>
                ))}
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