
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadFile {
  file: File;
  preview: string;
}

const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';

const FileUploadModal = ({ isOpen, onClose }: FileUploadModalProps) => {
  const [step, setStep] = useState<'upload' | 'success' | 'failure'>('upload');
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allowedTypes = { 
    'application/pdf': ['.pdf'], 
    'image/jpeg': ['.jpg', '.jpeg'], 
    'image/png': ['.png'] 
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: allowedTypes,
    maxFiles: 5,
    maxSize: 15 * 1024 * 1024,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError(rejectedFiles[0].errors[0]?.message || 'File not allowed');
        return;
      }
      const newFiles = acceptedFiles.map(file => ({ 
        file, 
        preview: URL.createObjectURL(file) 
      }));
      setFiles(prev => [...prev, ...newFiles]);
      setError('');
    },
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendNotification = async () => {
    if (files.length === 0) {
      setError('Please upload at least one file.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fileList = files
        .map(f => `${f.file.name} (${(f.file.size / 1024 / 1024).toFixed(1)} MB)`)
        .join('\n');
      const templateParams = { 
        phoneNumber: phoneNumber || "Not provided", 
        fileList 
      };
      await emailjs.send(
        EMAILJS_SERVICE_ID, 
        EMAILJS_TEMPLATE_ID, 
        templateParams, 
        EMAILJS_PUBLIC_KEY
      );
      setStep('success');
    } catch (emailError) {
      setError('Could not send notification.');
      setStep('failure');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep('upload');
    setFiles([]);
    setPhoneNumber('');
    setError('');
    setLoading(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    // Only reset and close when the dialog is closing (nextOpen === false)
    if (!nextOpen) {
      resetModal();
      onClose();
    }
  };

  const getFileIcon = (file: File) => (
    file.type.includes('pdf') ? '📄' : '🖼️'
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-center">
            Upload Your Files
          </DialogTitle>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div 
              key="upload" 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? 'border-cyan bg-cyan/5' 
                    : 'border-border hover:border-cyan hover:bg-cyan/5'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  or click to browse • Max 15MB each
                </p>
              </div>

              {/* Clean helper bullets - no mojibake */}
              <div className="bg-muted/50 rounded-lg p-4">
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Upload up to 5 files (PNG, JPG, PDF)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Max size 15MB per file</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Drag & drop supported</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>We'll process your files securely</span>
                  </li>
                </ul>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files:</Label>
                  {files.map((f, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getFileIcon(f.file)}</span>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {f.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(f.file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(i)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        ×
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
                  onChange={e => setPhoneNumber(
                    e.target.value.replace(/\D/g, '').slice(0, 10)
                  )} 
                />
              </div>

              {error && (
                <p className="text-destructive text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </p>
              )}

              <Button 
                variant="cyan" 
                className="w-full" 
                onClick={handleSendNotification} 
                disabled={files.length === 0 || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Sending...
                  </>
                ) : (
                  'Send Notification'
                )}
              </Button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success" 
              className="text-center space-y-6 py-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Notification Sent!</h3>
                <p className="text-muted-foreground">
                  We've received your request. We will contact you shortly to arrange 
                  the file transfer.
                </p>
              </div>
              <Button 
                variant="cyan" 
                onClick={handleOpenChange.bind(null, false)} 
                className="w-full"
              >
                Done
              </Button>
            </motion.div>
          )}

          {step === 'failure' && (
            <motion.div 
              key="failure" 
              className="text-center space-y-6 py-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <AlertCircle className="w-16 h-16 mx-auto text-destructive" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Something Went Wrong</h3>
                <p className="text-muted-foreground">
                  {error || "An unknown error occurred."}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setStep('upload')} 
                className="w-full"
              >
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
