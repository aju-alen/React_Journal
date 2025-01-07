import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import { getPdfName, httpRoute } from '../helperFunctions';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const MyManuscriptsDashboard = ({ user }) => {
  const [articles, setArticles] = useState(false);
  const [userId, setUserId] = useState('');
  const [emailId, setEmailId] = useState('');
  const [articleId, setArticleId] = useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (id) => {
    setOpen(true);
    setArticleId(id)
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setArticles(prev => !prev)
  }, [user]);

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem('currentUser'))
    setUserId(getUser?.user?.id)
    setEmailId(getUser?.user?.email)
  }, []);

  const handleDeleteArticle = async () => {
    try{
      const response = await axios.delete(`${httpRoute}/api/journalArticle/delete-article/${articleId}/${userId}`)
      handleClose()
    }
    catch(err){
      console.log(err)
      
    }
  }

  console.log(user, 'user details');
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
            <TableCell align="center">Correction Files</TableCell>
            <TableCell align="center">Download PDF</TableCell>
            <TableCell align="center">Download Certificate</TableCell>
            <TableCell align="center">Payment</TableCell>
            <TableCell align="center">Delete Manuscript</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {user?.articles?.map((row) => {
            console.log(row, 'rowData');
            return (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="left">{row.articleTitle}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">{row.rejectionText}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">{row.articleStatus}</TableCell>
                {!row.isReview && !row.isPublished ? <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  <Link to={`/editManuscript/${row.userId}/${row.id}`}>
                    <Button variant="contained" color="primary">
                      Edit
                    </Button>
                  </Link>
                </TableCell> : <TableCell></TableCell>}

                {row.rejectionFilesURL.length !== 0 ? <TableCell sx={{ fontWeight: 'bold', color: 'blue', fontSize: 10, display: 'flex', flexDirection: "column", justifyContent: "center" }} align="center">
                  <Link to={row.rejectionFilesURL[0]} className='mx-2 bg-indigo-100 rounded-md'
                    target="_blank" rel="noopener noreferrer">
                    {row.rejectionFilesURL[0] ? `📄${getPdfName(row.rejectionFilesURL[0])} ` : ''}
                  </Link>
                  <br></br>
                  <Link to={row.rejectionFilesURL[1]} className='mx-2 bg-indigo-100 rounded-md'
                    target="_blank" rel="noopener noreferrer">
                    {row.rejectionFilesURL[1] ? `📄${getPdfName(row.rejectionFilesURL[1])} ` : ''}
                  </Link>
                  <br />
                  <Link to={row.rejectionFilesURL[2]} className='mx-2 bg-indigo-100 rounded-md' target="_blank" rel="noopener noreferrer">
                    {row.rejectionFilesURL[2] ? `📄${getPdfName(row.rejectionFilesURL[2])} ` : ''}
                  </Link>
                </TableCell> : <TableCell></TableCell>}

                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                <Link to={row.filesURL[0]} className='mx-2 bg-indigo-100 rounded-md' target="_blank" rel="noopener noreferrer">
                    {row.isPublished ? `📄${getPdfName(row.filesURL[0])} ` : ''}
                  </Link>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                <Link to={row.filesURL[1]} className='mx-2 bg-indigo-100 rounded-md' target="_blank" rel="noopener noreferrer">
                    {row.isPublished ? `📄${getPdfName(row.filesURL[1])} ` : ''}
                  </Link>
                </TableCell>

                {!row.paymentStatus ? <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  <Link to={`/checkout/${row.id}/publisharticle/${userId}/${emailId}`}>
                    <Button variant="contained" color="primary">
                      Pay Here
                    </Button>
                  </Link>
                </TableCell> : <TableCell sx={{ fontWeight: 'bold', color: 'green', fontSize: 20 }} align="center">Payment Complete</TableCell>}

                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  <Button variant="contained" color="error" onClick={()=>handleClickOpen(row.id)}>
                    Delete
                  </Button>
                  {/* Delete Manuscript Dialogue Box */}
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"This action will delete the Manuscript. Are you sure?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Deleting the Manuscript will remove it from the system. This action cannot be undone.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button onClick={ handleDeleteArticle} autoFocus>
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                  {/* End Of delete dialog */}
                </TableCell>

              </TableRow>

            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default MyManuscriptsDashboard