import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import emailjs from '@emailjs/browser';

/**
 * FileUploadModal Props
 *
 * @property isOpen - Whether the modal is visible
 * @property onClose - Callback fired when modal closes
 */
interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * UploadFile
 * 
 * Internal type for tracking uploaded files
 * @property file - The File object
 * @property preview - Object URL for preview (if applicable)
 */
interface UploadFile {
  file: File;
  preview: string;
}

// Securely read EmailJS credentials from environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * FileUploadModal
 *
 * Modal dialog for uploading design files with email notification.
 *
 * Features:
 * - Drag-and-drop file upload interface
 * - Accepts: PDF, JPEG, PNG files (max 15MB each, 5 files max)
 * - Optional phone number field
 * - Multi-step flow: upload → success/failure
 * - Email notification via EmailJS on submission
 * - File list with removal capability
 * - Animated transitions between steps
 * - Error handling with user feedback
 *
 * State:
 * - `step`: current modal step ('upload', 'success', 'failure')
 * - `files`: array of uploaded files with preview URLs
 * - `phoneNumber`: optional contact number
 * - `loading`: tracks email submission state
 * - `error`: error message string
 */
const FileUploadModal = ({ isOpen, onClose }: FileUploadModalProps) => {
  const [step, setStep] = useState<'upload' | 'success' | 'failure'>('upload');
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Allowed file types configuration for react-dropzone
  const allowedTypes = { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: allowedTypes,
    maxFiles: 5,
    maxSize: 15 * 1024 * 1024, // 15MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError(rejectedFiles[0].errors[0]?.message || 'File not allowed');
        return;
      }
      // Create preview URLs for each accepted file
      const newFiles = acceptedFiles.map(file => ({ file, preview: URL.createObjectURL(file) }));
      setFiles(prev => [...prev, ...newFiles]);
      setError('');
    },
  });

  /**
   * removeFile
   *
   * Removes a file from the upload list by index.
   *
   * @param index - Index of file to remove
   */
  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  /**
   * handleSendNotification
   *
   * Validates form, compiles file list, and sends email notification via EmailJS.
   * Transitions to success/failure step based on result.
   */
  const handleSendNotification = async () => {
    if (files.length === 0) {
      setError('Please upload at least one file.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Format file list for email body
      const fileList = files
        .map(f => `${f.file.name} (${(f.file.size / 1024 / 1024).toFixed(1)} MB)`) 
        .join('\n');
      const templateParams = { phoneNumber: phoneNumber || 'Not provided', fileList };
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      setStep('success');
    } catch (emailError) {
      setError('Could not send notification.');
      setStep('failure');
    } finally {
      setLoading(false);
    }
  };

  /**
   * resetModal
   *
   * Resets all modal state and closes the dialog.
   */
  const resetModal = () => {
    setStep('upload');
    setFiles([]);
    setPhoneNumber('');
    setError('');
    setLoading(false);
    onClose();
  };

  /**
   * getFileIcon
   *
   * Returns a display label for file type (PDF or IMG).
   *
   * @param file - File object
   * @returns File type label
   */
  const getFileIcon = (file: File) => (file.type.includes('pdf') ? 'PDF' : 'IMG');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetModal(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-center">
            Upload Your Files
          </DialogTitle>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div key="upload" className="space-y-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${
                  isDragActive ? 'border-cyan bg-cyan/5' : 'border-border hover:border-cyan hover:bg-cyan/5'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files'}
                </p>
                <p className="text-sm text-muted-foreground">or click to browse — Max 15MB each</p>
              </div>
              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files:</Label>
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span>{getFileIcon(f.file)}</span>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{f.file.name}</p>
                          <p className="text-xs text-muted-foreground">{(f.file.size / 1024 / 1024).toFixed(1)} MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(i)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button
                variant="cyan"
                className="w-full"
                onClick={handleSendNotification}
                disabled={files.length === 0 || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  'Send Notification'
                )}
              </Button>
            </motion.div>
          )}
          {step === 'success' && (
            <motion.div key="success" className="text-center space-y-6">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h3>Notification Sent!</h3>
              <p>We've received your request. We will contact you shortly to arrange the file transfer.</p>
              <Button variant="cyan" onClick={resetModal} className="w-full">
                Done
              </Button>
            </motion.div>
          )}
          {step === 'failure' && (
            <motion.div key="failure" className="text-center space-y-6">
              <AlertCircle className="w-16 h-16 mx-auto text-destructive" />
              <h3>Something Went Wrong</h3>
              <p>{error || 'An unknown error occurred.'}</p>
              <Button variant="outline" onClick={() => setStep('upload')} className="w-full">
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;

