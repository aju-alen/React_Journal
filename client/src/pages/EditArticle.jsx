import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import { axiosTokenHeader, httpRoute } from '../helperFunctions'
import axios from 'axios'
import FormSection from '../components/dashboard/FormSection'
import { dashboardColors } from '../utils/theme'
import { canonicalSlotName, slotFieldName } from '../utils/manuscriptFileName'

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
})

const FILE_SLOTS = [
  { id: 0, label: 'Cover letter', required: false },
  { id: 1, label: 'Manuscript file', required: true },
  { id: 2, label: 'Supplementary file', required: false },
]

const MANUSCRIPT_SLOT_ID = 1

const EditArticle = () => {
  const navigate = useNavigate()
  const { articleId, userId } = useParams()
  const [articleData, setArticleData] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)
  const [alertStatus, setAlertStatus] = useState('success')
  const [alertText, setAlertText] = useState('')
  const [formData, setFormData] = useState({
    articleTitle: '',
    articleAbstract: '',
    articleKeywords: '',
  })
  const publicPdfName = useRef('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event, id) => {
    const selected = event.target.files?.[0]
    if (!selected) return
    const storedName = canonicalSlotName(selected, id, 'edit')
    if (!storedName) {
      event.target.value = ''
      showAlert('error', 'Only PDF and Word files (.pdf, .doc, .docx) are allowed.')
      return
    }
    setFiles((prev) => {
      const without = prev.filter((file) => file.id !== id)
      return [...without, { id, file: selected }]
    })
    if (id === 1) {
      publicPdfName.current = storedName
    }
  }

  const getFileName = (id) => {
    const selected = files.find((f) => f.id === id)?.file
    if (!selected) return undefined
    return canonicalSlotName(selected, id, 'edit')
  }
  const hasManuscript = Boolean(getFileName(MANUSCRIPT_SLOT_ID))

  useEffect(() => {
    const fetchEditableArticle = async () => {
      try {
        setLoading(true)
        axios.defaults.headers.common['Authorization'] = axiosTokenHeader()
        const res = await axios.get(
          `${httpRoute}/api/journalArticle/singleArticle/${articleId}`
        )
        setArticleData(res.data)
        setFormData({
          articleTitle: res.data.articleTitle || '',
          articleAbstract: res.data.articleAbstract || '',
          articleKeywords: res.data.articleKeywords || '',
        })
      } catch (err) {
        console.error(err)
        setAlertStatus('error')
        setAlertText('Could not load this article. Please try again.')
        setSnackOpen(true)
      } finally {
        setLoading(false)
      }
    }
    fetchEditableArticle()
  }, [articleId])

  const showAlert = (status, text) => {
    setAlertStatus(status)
    setAlertText(text)
    setSnackOpen(true)
  }

  const handleSubmit = async () => {
    if (!hasManuscript) {
      showAlert(
        'error',
        'A manuscript file is required before you can submit for verification.'
      )
      return
    }
    try {
      setSubmitting(true)
      const fileData = new FormData()
      for (const file of files) {
        const field = slotFieldName(file.id)
        if (!field) continue
        fileData.append(field, file.file)
      }

      const fileResp = await axios.post(
        `${httpRoute}/api/s3/upload/${articleData.awsId}?stage=edit`,
        fileData
      )
      const manuscriptName = fileResp.data?.manuscriptName
      if (!manuscriptName) {
        throw new Error('Upload did not return a manuscript name')
      }
      const fileGet = await axios.get(`${httpRoute}/api/s3/${articleData.awsId}`)
      const filesUrl = fileGet.data.files

      const mergeForm = Object.assign({}, formData, {
        filesUrl,
        publicPdfName: manuscriptName,
      })
      await axios.post(
        `${httpRoute}/api/journalArticle/updateArticle/${articleId}`,
        mergeForm
      )
      showAlert('success', 'Article updated. Returning to your manuscripts…')
      setTimeout(() => {
        navigate(`/dashboard/${userId}?section=manuscripts`)
      }, 1500)
    } catch (err) {
      console.error(err)
      showAlert('error', 'Update failed. Please try again or contact support.')
    } finally {
      setSubmitting(false)
    }
  }

  const goBack = () => navigate(`/dashboard/${userId}?section=manuscripts`)

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 112px)',
        backgroundColor: dashboardColors.canvas,
        pt: { xs: 12, sm: 14, md: 16 },
        pb: 6,
        px: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 720, mx: 'auto', mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={goBack}
          sx={{ color: dashboardColors.ink }}
        >
          Back to manuscripts
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <Skeleton variant="text" width={240} height={40} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" height={320} />
        </Box>
      ) : (
        <FormSection
          title="Edit your article"
          subtitle="Update the title, abstract, keywords, and upload revised files for verification."
        >
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
            noValidate
          >
            <TextField
              fullWidth
              label="Article title"
              name="articleTitle"
              value={formData.articleTitle}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Abstract"
              name="articleAbstract"
              value={formData.articleAbstract}
              onChange={handleChange}
              multiline
              minRows={5}
            />
            <TextField
              fullWidth
              label="Keywords"
              name="articleKeywords"
              value={formData.articleKeywords}
              onChange={handleChange}
              helperText="Separate keywords with commas"
            />

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: dashboardColors.ink, mb: 0.5 }}
              >
                Revised files
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 1.5 }}
              >
                The manuscript file is required. Cover letter and supplementary files are optional.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                useFlexGap
                flexWrap="wrap"
              >
                {FILE_SLOTS.map((slot) => {
                  const fileName = getFileName(slot.id)
                  const isManuscript = slot.id === MANUSCRIPT_SLOT_ID
                  return (
                    <Box key={slot.id} sx={{ flex: '1 1 160px' }}>
                      <Button
                        component="label"
                        fullWidth
                        variant={isManuscript ? 'contained' : 'outlined'}
                        color={isManuscript && !fileName ? 'primary' : undefined}
                        startIcon={<CloudUploadIcon />}
                        sx={
                          isManuscript && !fileName
                            ? {
                                border: `2px solid ${dashboardColors.ink}`,
                              }
                            : undefined
                        }
                      >
                        {slot.label}
                        {slot.required ? ' *' : ''}
                        <VisuallyHiddenInput
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(event) => handleFileChange(event, slot.id)}
                        />
                      </Button>
                      {fileName ? (
                        <Chip
                          label={fileName}
                          size="small"
                          sx={{
                            mt: 1,
                            maxWidth: '100%',
                            backgroundColor: dashboardColors.peach,
                            color: dashboardColors.ink,
                          }}
                        />
                      ) : (
                        slot.required && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ display: 'block', mt: 0.75 }}
                          >
                            Required to submit
                          </Typography>
                        )
                      )}
                    </Box>
                  )
                })}
              </Stack>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 1 }}>
              <Button variant="outlined" onClick={goBack} disabled={submitting}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting || !hasManuscript}
                startIcon={
                  submitting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : null
                }
              >
                {submitting ? 'Submitting…' : 'Submit for verification'}
              </Button>
            </Stack>
            {!hasManuscript && (
              <Typography variant="caption" color="error">
                Upload a manuscript file to enable submission.
              </Typography>
            )}
          </Box>
        </FormSection>
      )}

      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={alertStatus}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertText}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default EditArticle
