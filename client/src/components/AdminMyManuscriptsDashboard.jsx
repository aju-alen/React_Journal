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
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [articleId, setArticleId] = React.useState();
  const [rejectionText, setRejectionText] = useState('');

  const handleClickOpen = (articleId) => {
    setArticleId(articleId);
    console.log(articleId, 'articleId');
    setOpen(true);
  };

  const handleClose = (id) => {
 
    setOpen(false);
  };
  const handleClicSuccessOpen = () => {
    setSuccessOpen(true);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleAcceptManuscript = async (articleId) => {
    try {
      axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
      await axios.put(`http://localhost:3001/api/journalArticle/verifyArticles/acceptManuscript`, { articleId });
    }
    catch (err) {
      console.log(err);
    }
    handleSuccessClose();
  }

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
                  <Button variant='outlined' onClick={handleClicSuccessOpen} >
                    ✅
                  </Button>

                  <Dialog
                    open={successOpen}
                    onClose={handleSuccessClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Accept This Manuscript ?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Accepting this manuscript will make it available for the public to view. This action cannot be undone.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => handleAcceptManuscript(row.id)}>Accept</Button>
                      <Button onClick={handleSuccessClose} autoFocus>
                        Discard
                      </Button>
                    </DialogActions>
                  </Dialog>



                  <Button variant="outlined" onClick={() => handleClickOpen(row.id)}>
                    ❌
                  </Button>
                  <Dialog
                    open={open}
                    onClose={()=>handleClose(articleId)}
                    PaperProps={{
                      component: 'form',
                      onSubmit: async (event) => {
                        event.preventDefault();
                        console.log(event.target[0].value, articleId, 'rejection text and article Id');
                        try {
                          axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
                          await axios.post(`http://localhost:3001/api/journalArticle/verifyArticles/sendRejectionText`, { rejectionText: event.target[0].value, articleId })
                        }
                        catch (err) {
                          console.log(err);
                        }
                        handleClose(row.id);
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
                      <Button onClick={()=>handleClose(row.id)}>Cancel</Button>
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