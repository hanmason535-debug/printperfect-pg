import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, AlertCircle, Loader2, FileIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone, FileRejection } from 'react-dropzone';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

type UploadStatus = "pending" | "uploading" | "success" | "error";

interface UploadFile {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
}

const FileUploadModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setGlobalError('');
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      file,
      status: 'pending',
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles].slice(0, 5)); // Limit to 5 files

    if (rejectedFiles.length > 0) {
      const firstRejection = rejectedFiles[0];
      const message = firstRejection.errors[0]?.code === 'file-too-large'
        ? 'File is larger than 15MB'
        : firstRejection.errors[0]?.message;
      setGlobalError(message || 'Some files were rejected.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': [], 'image/png': [] },
    maxSize: 15 * 1024 * 1024, // 15MB
    maxFiles: 5,
    onDrop,
  });

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const handleSend = async () => {
    if (files.length === 0) {
      setGlobalError('Please upload at least one file.');
      return;
    }

    setIsSubmitting(true);
    setGlobalError('');

    const fileList = files.map(f => `${f.file.name} (${(f.file.size / 1024 / 1024).toFixed(2)} MB)`).join('\n');
    const templateParams = {
      phoneNumber: phoneNumber || 'Not provided',
      fileList
    };

    // Simulate progress for the notification
    setFiles(prev => prev.map(f => ({ ...f, status: 'uploading', progress: 50 })));

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      setFiles(prev => prev.map(f => ({ ...f, status: 'success', progress: 100 })));
    } catch (error) {
      setFiles(prev => prev.map(f => ({ ...f, status: 'error', error: 'Notification failed' })));
      setGlobalError('Failed to send notification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setFiles([]);
    setPhoneNumber('');
    setIsSubmitting(false);
    setGlobalError('');
    onClose();
  };

  const allSuccess = files.length > 0 && files.every(f => f.status === 'success');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetAndClose(); }}>
      <DialogContent className="sm:max-w-lg" data-test-id="upload-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-center">
            {allSuccess ? 'Files Sent' : 'Upload Your Files'}
          </DialogTitle>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {!allSuccess ? (
            <motion.div key="upload-view" className="space-y-4">
              <div
                {...getRootProps()}
                data-test-id="upload-dropzone"
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-semibold">
                  {isDragActive ? 'Drop files here' : 'Drag & drop or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground">Max 5 files, 15MB each</p>
              </div>

              {globalError && <p data-test-id="upload-error" className="text-destructive text-sm font-medium text-center">{globalError}</p>}

              {files.length > 0 && (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {files.map((f) => (
                    <FileProgressItem key={f.id} file={f} onRemove={() => removeFile(f.id)} />
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-semibold">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="For faster communication"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 15))}
                />
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
              <Button
                variant="cyan"
                onClick={handleSend}
                disabled={isSubmitting || files.length === 0}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Notification'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FileProgressItem = ({ file, onRemove }: { file: UploadFile, onRemove: () => void }) => {
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
        {file.status === 'pending' && <button onClick={onRemove}><X className="h-5 w-5 text-muted-foreground hover:text-foreground"/></button>}
        {file.status === 'uploading' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        {file.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
        {file.status === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
      </div>
    </div>
  )
}

export default FileUploadModal;

