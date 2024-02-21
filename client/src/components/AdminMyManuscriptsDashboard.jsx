import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Article from '../pages/Article';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { axiosTokenHeader } from '../helperFunctions';

const AdminMyManuscriptsDashboard = ({ user }) => {
  const [open, setOpen] = React.useState(false);
  const [rejectionText, setRejectionText] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log(user, 'verify details');
  if (!Array.isArray(user) || user.length === 0) {
    // Handle empty or non-array user prop
    return (
      <div>No Manuscripts To Verify</div>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Manuscript Id</TableCell>
            <TableCell align="center">Article Title</TableCell>
            <TableCell align="center">Article Abstract</TableCell>
            <TableCell align="center">Article Keywords</TableCell>
            <TableCell align="center">Article Files</TableCell>
            <TableCell align="center">Verification</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {user?.map((row) => {
            console.log(row, 'rowData');
            return (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="center">{row.articleTitle}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">{row.articleAbstract}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">{row.articleKeywords}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'blue' }} align="center">
                  <Link to={row.filesURL[0]} target="_blank" rel="noopener noreferrer">
                    📄 Article File 1
                  </Link>
                  <Link to={row.filesURL[1]} target="_blank" rel="noopener noreferrer">
                    📄 Article File 2
                  </Link>
                  <Link to={row.filesURL[2]} target="_blank" rel="noopener noreferrer">
                    📄 Article File 3
                  </Link>
                </TableCell>

                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  <Button variant='outlined' >
                    ✅
                  </Button>
                  <Button variant="outlined" onClick={handleClickOpen}>
                    ❌
                  </Button>
                  <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event) => {
            event.preventDefault();
            try{
              axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
              await axios.post(`http://localhost:3001/api/journalArticle/verifyArticles/sendRejectionText`,{rejectionText:event.target[0].value,articleId:row.id})
            }
            catch(err){
              console.log(err);
            }
            handleClose();
          },
        }}
      >
        <DialogTitle>Rejection Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
           Write here a message to the user on why the article was rejected.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="text"
            name="text"
            label="Rejection Text Message Here"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Send Rejection Message</Button>
        </DialogActions>
      </Dialog>
      
                </TableCell>

              </TableRow>

            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default AdminMyManuscriptsDashboard