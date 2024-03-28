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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { axiosTokenHeader, httpRoute } from '../helperFunctions';
import { styled } from '@mui/material/styles';
import { getPdfName } from '../helperFunctions';


const AdminMyManuscriptsDashboard = ({ user }) => {
  const [open, setOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [articleId, setArticleId] = React.useState();
  const [rejectionText, setRejectionText] = useState('');
  const [files, setFiles] = useState([]);

  const handleClickOpen = (articleId) => {
    setArticleId(articleId);
    setOpen(true);
  };
console.log(articleId, 'articleId state');
  const handleClose = (id) => {

    setOpen(false);
  };
  const handleClicSuccessOpen = (articleId) => {
    setArticleId(articleId);
    setSuccessOpen(true);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };
  const handleFileChange = (event) => {
    setFiles([...files, event.target.files[0]]);
};

  const handleAcceptManuscript = async (articleId) => {
    console.log(articleId, 'articleId inside handleAcceptManuscript state');
    try {
      axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
      await axios.put(`${httpRoute}/api/journalArticle/verifyArticles/acceptManuscript`, { articleId });
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
            <TableCell>Manuscript Author</TableCell>
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
                  {row.articleAuthors[0].authorEmail}
                </TableCell>
                <TableCell align="center">{row.articleTitle}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="justify">{row.articleAbstract}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">{row.articleKeywords}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'blue', fontSize:10, display:'flex', flexDirection:"column",justifyContent:"center" }} align="center">
                  <Link to={row.filesURL[0]} className='mx-2 bg-indigo-100 rounded-md' target="_blank" rel="noopener noreferrer">
                  {row.filesURL[0] ? `📄${getPdfName(row.filesURL[0])} `:'' }
                  </Link>
                  <br />
                  <Link to={row.filesURL[1]} className='mx-2 bg-indigo-100 rounded-md' target="_blank" rel="noopener noreferrer">
                  {row.filesURL[1] ? `📄${getPdfName(row.filesURL[1])} `:'' }
                  </Link>
                  <br />
                  <Link to={row.filesURL[2]} className='mx-2 bg-indigo-100 rounded-md' target="_blank" rel="noopener noreferrer">
                    {row.filesURL[2] ? `📄${getPdfName(row.filesURL[2])} `:'' }
                  </Link>
                </TableCell>

                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  <Button variant='outlined' onClick={()=>handleClicSuccessOpen(row.id)} >
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
                      <Button onClick={() => handleAcceptManuscript(articleId)}>Accept</Button>
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
                    onClose={() => handleClose(articleId)}
                    PaperProps={{
                      component: 'form',
                      onSubmit: async (event) => {
                        event.preventDefault();
                        console.log(event.target[0].value, articleId, 'rejection text and article Id');
                        try {
                          const fileData = new FormData();
                          for(const file of files){
                              console.log(file, 'file in submit');
                              fileData.append('s3Files', file)
                          }
                          console.log(fileData, 'file data');
              
                          const fileResp = await axios.post(`${httpRoute}/api/s3/rejection/upload/${row.awsId}/${row.userId}`, fileData)
                          console.log(fileResp, 'file response');
              
                          const fileGet = await axios.get(`${httpRoute}/api/s3/rejection/${row.awsId}/${row.userId}`)
                          console.log(fileGet, 'file get data');
              
                          const filesUrl = fileGet.data.files
              
                          axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
                          await axios.post(`${httpRoute}/api/journalArticle/verifyArticles/sendRejectionText`, { rejectionText: event.target[0].value, articleId,filesUrl})
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
                      <Button fullWidth sx={{ mb: 3 }}

                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        startIcon={<CloudUploadIcon />}
                      >
                        Cover Letter
                        <VisuallyHiddenInput type="file" />
                      </Button>
                      <Button fullWidth sx={{ mb: 3 }}

                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        startIcon={<CloudUploadIcon />}
                      >
                        Manuscript File
                        <VisuallyHiddenInput type="file" />
                      </Button>
                      <Button fullWidth sx={{ mb: 3 }}

                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        startIcon={<CloudUploadIcon />}
                      >
                        Supplementary File
                        <VisuallyHiddenInput type="file" />
                      </Button>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => handleClose(row.id)}>Cancel</Button>
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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
export default AdminMyManuscriptsDashboard