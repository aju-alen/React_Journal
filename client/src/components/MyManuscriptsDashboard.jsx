import {useEffect,useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';

 const MyManuscriptsDashboard=({user})=> {
  const [articles, setArticles] = useState(false);
    useEffect(() => {
      setArticles(prev=>!prev)
    }, [user]);
    console.log(user,'user details');
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Manuscript Id</TableCell>
            <TableCell align="center">Article Title</TableCell>
            <TableCell align="center">Message History</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Edit</TableCell>
            <TableCell align="center">Payment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {user?.articles?.map((row) =>{
            console.log(row,'rowData');
            return(
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="center">{row.articleTitle}</TableCell>
                <TableCell sx={{fontWeight:'bold'}} align="center">{row.rejectionText}</TableCell>
                <TableCell sx={{fontWeight:'bold'}} align="center">{row.articleStatus}</TableCell>
               {!row.isReview && !row.isPublished ? <TableCell sx={{fontWeight:'bold'}} align="center">
                  <Link to={`/editManuscript/${row.userId}/${row.id}`}>
                  <Button variant="contained" color="primary">
                    Edit
                  </Button>
                  </Link>
                </TableCell> : <TableCell></TableCell>}

                <TableCell sx={{fontWeight:'bold'}} align="center">
                  <Link to={`/checkout/${row.id}`}>
                  <Button variant="contained" color="primary">
                    Payment
                  </Button>
                  </Link>
                </TableCell>
              </TableRow>
              
            )
          } )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default MyManuscriptsDashboard