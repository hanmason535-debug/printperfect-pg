/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FileUploadModal Component - File Upload with Email Notification
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Modal dialog for uploading print files with drag-and-drop,
 * file validation, and EmailJS notification system.
 *
 * @description
 * The FileUploadModal allows customers to submit print files:
 *
 * **File Upload**:
 * - Drag-and-drop interface using react-dropzone
 * - Click to browse file picker
 * - Accepts PDF, JPEG, PNG formats only
 * - Maximum 5 files per upload
 * - 15MB size limit per file
 *
 * **Validation**:
 * - File type validation (PDF, JPEG, PNG only)
 * - File size validation (15MB max)
 * - Automatic rejection of invalid files
 * - User-friendly error messages
 *
 * **Email Notification**:
 * - Sends file list notification via EmailJS
 * - Includes optional phone number for faster contact
 * - Shows upload progress simulation
 * - Success confirmation after send
 *
 * **UI States**:
 * 1. Upload view: Dropzone, file list, phone input
 * 2. Uploading: Progress indicators on each file
 * 3. Success: Confirmation message with "Done" button
 * 4. Error: Error message with retry option
 *
 * **File Management**:
 * - Preview uploaded files with name and size
 * - Remove individual files before sending
 * - Status indicators: pending, uploading, success, error
 * - Animated transitions between states
 *
 * **User Experience**:
 * - Drag active state highlights dropzone
 * - File size displayed in MB (2 decimal places)
 * - Loading spinner during upload
 * - Auto-reset on modal close
 * - Keyboard accessible (ESC to close)
 *
 * **Environment Variables Required**:
 * - VITE_EMAILJS_SERVICE_ID: EmailJS service identifier
 * - VITE_EMAILJS_TEMPLATE_ID: EmailJS template identifier
 * - VITE_EMAILJS_PUBLIC_KEY: EmailJS public key
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback to close modal
 *
 * @example
 * <FileUploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
 *
 * @see {@link https://react-dropzone.js.org/} React Dropzone
 * @see {@link https://www.emailjs.com/} EmailJS Documentation
 */

import React, { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, CheckCircle, AlertCircle, Loader2, FileIcon, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import emailjs from '@emailjs/browser'

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

interface FileUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

interface UploadFile {
  id: string
  file: File
  status: UploadStatus
  progress: number
  error?: string
}

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const FileUploadModal = ({ isOpen, onClose }: FileUploadModalProps) => {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setGlobalError('')
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      file,
      status: 'pending',
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...newFiles].slice(0, 5)) // limit to 5 files
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': [], 'image/png': [] },
    maxSize: 15 * 1024 * 1024,
    maxFiles: 5,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const msg = rejectedFiles[0].errors[0]?.message || 'Some files were rejected'
        setGlobalError(msg)
        return
      }
      onDrop(acceptedFiles as File[])
    },
  })

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id))

  const handleSend = async () => {
    if (files.length === 0) {
      setGlobalError('Please upload at least one file.')
      return
    }

    setIsSubmitting(true)
    setGlobalError('')

    const fileList = files.map((f) => `${f.file.name} (${(f.file.size / 1024 / 1024).toFixed(2)} MB)`).join('\n')
    const templateParams = { phoneNumber: phoneNumber || 'Not provided', fileList }

    // mark uploading
    setFiles((prev) => prev.map((f) => ({ ...f, status: 'uploading', progress: 50 })))

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
      setFiles((prev) => prev.map((f) => ({ ...f, status: 'success', progress: 100 })))
    } catch (error) {
      setFiles((prev) => prev.map((f) => ({ ...f, status: 'error', error: 'Notification failed' })))
      setGlobalError('Failed to send notification. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetAndClose = () => {
    setFiles([])
    setPhoneNumber('')
    setIsSubmitting(false)
    setGlobalError('')
    onClose()
  }

  const allSuccess = files.length > 0 && files.every((f) => f.status === 'success')

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-lg" data-testid="upload-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-center">{allSuccess ? 'Files Sent' : 'Upload Your Files'}</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!allSuccess ? (
            <motion.div key="upload-view" className="space-y-4">
              <div
                {...getRootProps()}
                data-testid="upload-dropzone"
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-semibold">{isDragActive ? 'Drop files here' : 'Drag & drop or click to browse'}</p>
                <p className="text-sm text-muted-foreground">Max 5 files, 15MB each</p>
              </div>

              {globalError && (
                <p data-testid="upload-error" className="text-destructive text-sm font-medium text-center">{globalError}</p>
              )}

              {files.length > 0 && (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {files.map((f) => (
                    <FileProgressItem key={f.id} file={f} onRemove={() => removeFile(f.id)} />
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-semibold">Phone Number (Optional)</Label>
                <Input id="phone" type="tel" placeholder="For faster communication" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 15))} onPaste={(e) => {
                  const pastedText = e.clipboardData.getData('text');
                  setPhoneNumber(pastedText.replace(/\D/g, '').slice(0, 15));
                  e.preventDefault();
                }} />
              </div>
            </motion.div>
          ) : (
            <motion.div key="success-view" className="text-center space-y-4 py-8">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h3 className="text-xl font-bold">Notification Sent!</h3>
              <p className="text-muted-foreground">We have received your file list and will contact you shortly.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter className="mt-4">
          {allSuccess ? (
            <Button onClick={resetAndClose} className="w-full" variant="cyan">Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={resetAndClose} disabled={isSubmitting}>Cancel</Button>
              <Button variant="cyan" onClick={handleSend} disabled={isSubmitting || files.length === 0} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  'Send Notification'
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const FileProgressItem = ({ file, onRemove }: { file: UploadFile; onRemove: () => void }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <FileIcon className="h-6 w-6 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.file.name}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
            {file.status === 'error' && <p className="text-xs text-destructive font-semibold">{file.error}</p>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {file.status === 'pending' && (
          <button onClick={onRemove}><X className="h-5 w-5 text-muted-foreground hover:text-foreground" /></button>
        )}
        {file.status === 'uploading' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        {file.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
        {file.status === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
      </div>
    </div>
  )
}

export default FileUploadModal
