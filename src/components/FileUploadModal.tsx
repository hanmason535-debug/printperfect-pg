import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/firebase';
import emailjs from '@emailjs/browser';

// --- Read keys securely from environment variables ---
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// --- Add a check to ensure keys are loaded ---
if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
  console.error("EmailJS environment variables are not configured. Please check your .env file.");
}

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadFile {
  file: File;
  preview: string;
}

const FileUploadModal = ({ isOpen, onClose }: FileUploadModalProps) => {
  const [step, setStep] = useState<'upload' | 'phone' | 'otp' | 'success' | 'failure'>('upload');
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && step === 'phone' && recaptchaContainerRef.current && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        size: 'invisible',
        callback: () => {},
      });
    }
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, [isOpen, step]);

  const allowedTypes = {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
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
      const newFiles = acceptedFiles.map(file => ({ file, preview: URL.createObjectURL(file) }));
      setFiles(prev => [...prev, ...newFiles]);
      setError('');
    },
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');

    const appVerifier = recaptchaVerifierRef.current;
    if (!appVerifier) {
      setError('reCAPTCHA verifier not initialized. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const fullPhoneNumber = `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError('Failed to send OTP. Please check the number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!confirmationResult) {
      setError("Verification session expired. Please try again.");
      return;
    }
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        setError("Email service is not configured correctly.");
        return;
    }
    setLoading(true);
    setError('');

    try {
      await confirmationResult.confirm(otp);
      
      const fileList = files.map(f => `${f.file.name} (${(f.file.size / 1024 / 1024).toFixed(1)} MB)`).join('\n');

      const templateParams = {
        phoneNumber: `+91${phoneNumber}`,
        fileList: fileList,
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);

      setStep('success');
    } catch (error) {
      console.error("Verification or EmailJS error:", error);
      setError('Verification failed or could not send notification. Please try again.');
      setStep('failure');
    } finally {
      setLoading(false);
    }
  };
  
  const resetModal = () => {
    setStep('upload');
    setFiles([]);
    setPhoneNumber('');
    setOtp('');
    setError('');
    setLoading(false);
    setConfirmationResult(null);
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
    onClose();
  };

  const getFileIcon = (file: File) => (file.type.includes('pdf') ? '📄' : '🖼️');

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-center">Upload Your Files</DialogTitle>
        </DialogHeader>
        <div ref={recaptchaContainerRef}></div>
        <AnimatePresence mode="wait">
          {step === 'upload' && (
             <motion.div key="upload" className="space-y-6">
             <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${isDragActive ? 'border-cyan bg-cyan/5' : 'border-border hover:border-cyan hover:bg-cyan/5'}`}>
               <input {...getInputProps()} />
               <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
               <p className="text-lg font-medium">{isDragActive ? 'Drop files here' : 'Drag & drop files'}</p>
               <p className="text-sm text-muted-foreground">or click to browse • Max 15MB each</p>
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
                     <Button variant="ghost" size="sm" onClick={() => removeFile(i)}>×</Button>
                   </div>
                 ))}
               </div>
             )}
             {error && <p className="text-destructive text-sm">{error}</p>}
             <Button variant="cyan" className="w-full" onClick={() => setStep('phone')} disabled={files.length === 0}>Continue</Button>
           </motion.div>
          )}
          {step === 'phone' && (
            <motion.div key="phone" className="space-y-6">
              <div className="text-center"><Phone className="w-12 h-12 mx-auto mb-4 text-cyan" /><p>Enter your phone number for OTP</p></div>
              <div className="space-y-4">
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-muted border border-r-0 rounded-l-md">+91</span>
                  <Input id="phone" type="tel" placeholder="10-digit number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} className="rounded-l-none" />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setStep('upload')} className="flex-1">Back</Button>
                  <Button variant="cyan" onClick={handlePhoneSubmit} disabled={loading || phoneNumber.length !== 10} className="flex-1">{loading ? 'Sending...' : 'Send OTP'}</Button>
                </div>
              </div>
            </motion.div>
          )}
          {step === 'otp' && (
            <motion.div key="otp" className="space-y-6">
              <div className="text-center"><p>Enter the 6-digit OTP sent to +91{phoneNumber}</p></div>
              <Input id="otp" type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="text-center tracking-widest" />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => { setStep('phone'); setError(''); }}>Back</Button>
                <Button variant="cyan" onClick={handleOtpSubmit} disabled={loading || otp.length !== 6}>{loading ? 'Verifying...' : 'Verify & Notify'}</Button>
              </div>
            </motion.div>
          )}
          {step === 'success' && (
            <motion.div key="success" className="text-center space-y-6">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h3>Notification Sent!</h3>
              <p>We've received your request. We will contact you shortly to arrange the file transfer.</p>
              <Button variant="cyan" onClick={resetModal} className="w-full">Done</Button>
            </motion.div>
          )}
          {step === 'failure' && (
            <motion.div key="failure" className="text-center space-y-6">
              <AlertCircle className="w-16 h-16 mx-auto text-destructive" />
              <h3>Something Went Wrong</h3>
              <p>{error || "An unknown error occurred."}</p>
              <Button variant="outline" onClick={() => setStep('otp')} className="w-full">Try Again</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;
