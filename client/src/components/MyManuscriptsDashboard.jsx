import {useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

 const MyManuscriptsDashboard=({user})=> {
    useEffect(() => {

    }, []);
    console.log(user,'user details');
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Manuscript Id</TableCell>
            <TableCell align="center">Article/Paper</TableCell>
            <TableCell align="center">Message History</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {user.articles.map((row) =>{
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
                <TableCell sx={{fontWeight:'bold'}} align="center">{row.articleStatus}</TableCell>
              </TableRow>
              
            )
          } )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default MyManuscriptsDashboard