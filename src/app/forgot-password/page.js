'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState('');
  const [verified, setVerified] = useState(false);

  const sendOtp = async () => {
    setStatus('Sending OTP...');
    try {
      const res = await fetch('http://localhost:8000/send-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setStatus('OTP sent to your email');
        console.log(`[OTP SENT] OTP sent to ${email}`);
      } else {
        setStatus('❌ Failed to send OTP. Please check the email.');
        console.error('[OTP ERROR]', data.error);
      }
    } catch (err) {
      setStatus('❌ Server error while sending OTP.');
      console.error('[SERVER ERROR] while sending OTP:', err);
    }
  };

  const verifyOtp = async () => {
    setStatus('Verifying OTP...');
    try {
      const res = await fetch('http://localhost:8000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.verified) {
        setVerified(true);
        setStatus(' OTP verified. You may now reset your password.');
        console.log(`[OTP VERIFIED] for ${email}`);
      } else {
        setStatus('❌ Invalid OTP. Please try again.');
      }
    } catch (err) {
      setStatus('❌ Server error during OTP verification.');
      console.error('[SERVER ERROR] during OTP verification:', err);
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setStatus('❌ Passwords do not match.');
      return;
    }

    setStatus('Updating password...');
    try {
      const res = await fetch('http://localhost:8000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, new_password: newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('✅ Password changed successfully. Redirecting to login...');
        console.log(`[PASSWORD CHANGED] for ${email}`);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setStatus('❌ Failed to reset password.');
        console.error('[RESET ERROR]', data.error);
      }
    } catch (err) {
      setStatus('❌ Server error while resetting password.');
      console.error('[SERVER ERROR] during password reset:', err);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-6">
      <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-lg rounded-xl border border-gray-700 shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Forgot Password</h1>

        {status && (
          <div className="mb-4 text-sm text-center text-yellow-400 font-medium">
            {status}
          </div>
        )}

        {/* Email Input */}
        {!otpSent && (
          <>
            <label className="text-sm flex items-center gap-2 mb-1">
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={sendOtp}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition"
            >
              Send OTP
            </button>
          </>
        )}

        {/* OTP Verification */}
        {otpSent && !verified && (
  <>
    <label className="text-sm flex items-center gap-2 mt-4 mb-2">
      <ShieldCheck size={16} /> Enter OTP
    </label>
    <div
      className="flex justify-between gap-2 mb-4"
      onPaste={(e) => {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '');
        if (paste.length === 6) {
          const inputs = document.querySelectorAll('.otp-input');
          paste.split('').forEach((char, i) => {
            if (inputs[i]) {
              inputs[i].value = char;
              inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
            }
          });
        }
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="otp-input w-12 h-12 text-center text-xl rounded-md bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            const nextInput = document.getElementById(`otp-${index + 1}`);
            const otpArray = otp.split('');

            if (val) {
              otpArray[index] = val;
              setOtp(otpArray.join('').padEnd(6, ''));
              if (nextInput) nextInput.focus();
            } else {
              otpArray[index] = '';
              setOtp(otpArray.join('').padEnd(6, ''));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              if (!e.currentTarget.value && index > 0) {
                const prevInput = document.getElementById(`otp-${index - 1}`);
                if (prevInput) prevInput.focus();
              }
            }
          }}
          value={otp[index] || ''}
        />
      ))}
    </div>
    <button
      onClick={verifyOtp}
      className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-md font-semibold transition"
    >
      Verify OTP
    </button>
  </>
)}


        {/* Password Reset with Eye Toggle */}
        {verified && (
          <>
            <label className="text-sm flex items-center gap-2 mt-4 mb-1">
              <Lock size={16} /> New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 mb-4 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2/4 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="text-sm flex items-center gap-2 mb-1">
              <Lock size={16} /> Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 mb-4 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2/4 -translate-y-1/2 text-gray-400"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              onClick={handlePasswordReset}
              className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-md font-semibold transition"
            >
              Reset Password
            </button>
          </>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          Remember your password?{' '}
          <a href="/login" className="text-blue-400 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </section>
  );
}
