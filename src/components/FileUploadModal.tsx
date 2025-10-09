import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadFile {
  file: File;
  preview: string;
}

const FileUploadModal = ({ isOpen, onClose }: FileUploadModalProps) => {
  const [step, setStep] = useState<'upload' | 'phone' | 'otp' | 'success'>('upload');
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpRequestCount, setOtpRequestCount] = useState(0);
  const [lastOtpRequest, setLastOtpRequest] = useState<number>(0);

  // Security: Allowed file types only
  const allowedTypes = {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/tiff': ['.tiff', '.tif'],
    'application/postscript': ['.eps'],
    'application/illustrator': ['.ai'],
    'image/svg+xml': ['.svg'],
    'application/vnd.adobe.photoshop': ['.psd'],
    'application/x-indesign': ['.indd'],
    'application/x-coreldraw': ['.cdr']
  };

  // Security: Blocked file types (malicious extensions)
  const blockedExtensions = ['.exe', '.bat', '.js', '.php', '.html', '.xml', '.zip', '.rar', '.scr', '.cmd', '.com', '.pif'];

  const validateFile = (file: File) => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (blockedExtensions.includes(extension)) {
      setError(`File type ${extension} is not allowed for security reasons`);
      return false;
    }
    return true;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: allowedTypes as any,
    maxFiles: 5,
    maxSize: 15 * 1024 * 1024, // 15MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const reason = rejectedFiles[0].errors[0]?.message || 'File not allowed';
        setError(reason);
        return;
      }

      // Validate each file for security
      const validFiles = acceptedFiles.filter(validateFile);
      
      const newFiles = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // Security: OTP rate limiting (max 5 requests per hour)
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;
    if (now - lastOtpRequest < hourMs && otpRequestCount >= 5) {
      setError('Too many OTP requests. Please try again in an hour.');
      return;
    }
    
    setLoading(true);
    setError('');
    setOtpRequestCount(prev => prev + 1);
    setLastOtpRequest(now);
    
    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    // Security: Block after too many attempts
    if (otpAttempts >= 6) {
      setError('Too many incorrect attempts. Account temporarily blocked.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate OTP verification and file upload
    setTimeout(() => {
      setLoading(false);
      setOtpAttempts(prev => prev + 1);
      
      // In demo, accept any 6-digit OTP
      if (otp === '123456' || otp.length === 6) {
        setStep('success');
        console.log('Files to upload:', files);
        console.log('Phone number:', phoneNumber);
      } else {
        setError(`Invalid OTP. ${6 - otpAttempts} attempts remaining.`);
      }
    }, 2000);
  };

  const resetModal = () => {
    setStep('upload');
    setFiles([]);
    setPhoneNumber('');
    setOtp('');
    setError('');
    setLoading(false);
    setOtpAttempts(0);
    setOtpRequestCount(0);
    setLastOtpRequest(0);
    onClose();
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return '📄';
    if (file.type.includes('image')) return '🖼️';
    return '📁';
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* File Drop Zone */}
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                  ${isDragActive 
                    ? 'border-cyan bg-cyan/5' 
                    : 'border-border hover:border-cyan hover:bg-cyan/5'
                  }
                `}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-muted-foreground text-sm">
                  or click to browse • PDF, JPG, PNG, TIFF, EPS, AI, SVG, PSD, INDD, CDR • Max 15MB each
                </p>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Selected Files:</Label>
                  {files.map((uploadFile, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getFileIcon(uploadFile.file)}</span>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {uploadFile.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadFile.file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                variant="cyan"
                className="w-full"
                onClick={() => files.length > 0 ? setStep('phone') : setError('Please select at least one file')}
                disabled={files.length === 0}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Phone className="w-12 h-12 mx-auto mb-4 text-cyan" />
                <p className="text-muted-foreground">
                  Enter your phone number to receive OTP verification
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-sm">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setStep('upload')} className="flex-1">
                    Back
                  </Button>
                  <Button
                    variant="cyan"
                    onClick={handlePhoneSubmit}
                    disabled={loading || phoneNumber.length !== 10}
                    className="flex-1"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-cyan/10 rounded-full flex items-center justify-center">
                  <span className="text-cyan font-bold text-lg">⚡</span>
                </div>
                <p className="text-muted-foreground">
                  Enter the 6-digit OTP sent to +91{phoneNumber}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp">OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setStep('phone')} className="flex-1">
                    Back
                  </Button>
                  <Button
                    variant="cyan"
                    onClick={handleOtpSubmit}
                    disabled={loading || otp.length !== 6}
                    className="flex-1"
                  >
                    {loading ? 'Verifying...' : 'Verify & Upload'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-6 text-center"
            >
              <div>
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                  Upload Successful!
                </h3>
                <p className="text-muted-foreground">
                  Your files have been uploaded and sent to our team. 
                  We'll contact you shortly with a quote.
                </p>
              </div>

              <div className="space-y-3">
                <Button variant="cyan" onClick={resetModal} className="w-full">
                  Upload More Files
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://wa.me/919377476343', '_blank')}
                  className="w-full"
                >
                  Chat with Us
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;