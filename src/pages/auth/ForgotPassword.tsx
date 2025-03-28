import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Invalid input',
        description: 'Please enter your email address',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Reset failed',
          description: error.message,
        });
      } else {
        setIsEmailSent(true);
        toast({
          title: 'Email sent',
          description: 'Check your inbox for the password reset link',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Reset error',
        description: error.message || 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* Header with back button */}
      <motion.div 
        className="p-6 flex items-start"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <button 
          onClick={() => navigate('/auth/login')} 
          className="p-1 text-white rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
      </motion.div>
      
      <motion.div 
        className="flex-1 flex flex-col p-6 pt-0"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Logo and Title */}
        <motion.div 
          className="mb-12 flex flex-col items-center"
          variants={itemVariants}
        >
          <div className="w-16 h-16 bg-[#C6FE1E] rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke="#0D0D0D" strokeWidth="2">
              <path d="M3 6.5V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V6.5M3 6.5H21M3 6.5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V6.5M12 11C12 9.89543 12.8954 9 14 9H17C18.1046 9 19 9.89543 19 11V14C19 15.1046 18.1046 16 17 16H14C12.8954 16 12 15.1046 12 14V11Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
        </motion.div>

        {isEmailSent ? (
          <motion.div 
            className="text-center space-y-6"
            variants={itemVariants}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mx-auto w-16 h-16 bg-[#C6FE1E] rounded-full flex items-center justify-center"
            >
              <svg className="w-8 h-8 text-[#0D0D0D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="text-xl font-semibold text-white">Email Sent!</h2>
            <p className="text-[#868686]">
              We've sent a password reset link to <span className="font-semibold text-white">{email}</span>. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <Button asChild className="mt-4 bg-[#C6FE1E] hover:bg-[#B0E018] text-[#0D0D0D] font-bold py-6 rounded-full w-full">
              <Link to="/auth/login">Return to Login</Link>
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.p 
              className="text-[#868686] mb-8 text-center"
              variants={itemVariants}
            >
              Enter your email address and we'll send you a link to reset your password.
            </motion.p>
            
            <motion.form 
              onSubmit={handleResetPassword} 
              className="space-y-6"
              variants={itemVariants}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white mb-2 block">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#292929] border-none text-white py-6 px-4 rounded-md placeholder:text-[#868686]"
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#C6FE1E] hover:bg-[#B0E018] text-[#0D0D0D] font-bold py-6 rounded-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>
              </div>
            </motion.form>
            
            {/* Sign In Link */}
            <motion.div 
              className="mt-auto pt-8 border-t border-[#292929] text-center"
              variants={itemVariants}
            >
              <p className="text-[#868686]">
                Remember your password?
              </p>
              <Link 
                to="/auth/login" 
                className="block w-full border border-[#868686] text-white py-3 px-6 rounded-full mt-4 font-medium hover:border-white"
              >
                Back to Login
              </Link>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword; 