import { useFormik } from 'formik';
import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuthData } from '@/hooks/useAuthData';

const VerifyPasswordPage = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const { verifyOtp, forgotPassword, isLoading } = useAuthData();
  const [timeLeft, setTimeLeft] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = async () => {
    if (!canResend) return;
    await forgotPassword({ email });
    setTimeLeft(15);
    setCanResend(false);
  };

  const formatTime = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const formik = useFormik({
    initialValues: {
      otp: ['', '', '', '', '', ''],
    },
    validationSchema: Yup.object({
      otp: Yup.array()
        .of(Yup.string().matches(/^\d$/, 'Each digit must be a number').required('Required'))
        .test(
          'all-filled',
          'Please enter all 6 digits of the verification code',
          (val) => !!val && val.every((d) => d !== ''),
        ),
    }),
    onSubmit: (values) => {
      verifyOtp({ email, otp: values.otp.join('') });
    },
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...formik.values.otp];
    newOtp[index] = value;
    formik.setFieldValue('otp', newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !formik.values.otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    const newOtp = [...formik.values.otp];
    text.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    formik.setFieldValue('otp', newOtp);
    const nextEmpty = newOtp.findIndex((d) => d === '');
    const focusIndex = nextEmpty === -1 ? 5 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  const otpError = formik.touched.otp && formik.errors.otp;
  const otpErrorMsg =
    typeof otpError === 'string'
      ? otpError
      : Array.isArray(otpError)
        ? 'Please fill in all verification code digits'
        : null;

  return (
    <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-[#f0f0f0] overflow-y-auto p-4">
      <div className="bg-white shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] rounded-xl w-full max-w-[560px] max-h-[600px] overflow-auto px-5 sm:px-10 py-8 sm:py-10 my-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.svg" alt="Zipo" className="h-[32px] w-[32px]" />
          <h3 className="font-semibold text-[24px] text-[#000000] font-inter">Zipo</h3>
        </div>

        {/* Heading */}
        <h1 className="text-[24px] font-bold text-[#000000] mb-1 font-inter">Verify Your Email</h1>
        <p className="text-[14px] font-medium text-[#4E616A] mb-6 font-inter">
          Please enter the code from your email to reset your password.
        </p>

        <form onSubmit={formik.handleSubmit} noValidate>
          {/* OTP Boxes */}
          <div className="mb-3">
            <label className="block text-[14px] font-medium text-[#4E616A] mb-2 font-inter">
              Verification Code
            </label>
            <div className="flex gap-2 sm:gap-3 justify-between sm:justify-start">
              {formik.values.otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className={`w-14 h-14  text-center text-base font-semibold border rounded-lg outline-none transition text-[#000000]
                    ${
                      otpError
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#DFE6E5] focus-within:border-[#1DAFA1] hover:shadow-[0_0_16px_0_#ED9B0E3D]'
                    }`}
                />
              ))}
            </div>
            {otpErrorMsg && <p className="mt-2 text-xs text-red-500">{otpErrorMsg}</p>}
          </div>

          {/* Resend */}
          <p className="text-[12px] font-medium text-[#4E616A] mb-25">
            Resend code?{' '}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-[#1DAFA1] text-[12px] font-bold cursor-pointer hover:underline bg-transparent border-none p-0"
              >
                Resend
              </button>
            ) : (
              <span className="text-[#1DAFA1] text-[12px] font-bold">{formatTime(timeLeft)}</span>
            )}
          </p>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1DAFA1] cursor-pointer text-white font-semibold text-[16px] py-2.5 rounded-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? <LoadingSpinner size={20} className="text-white" /> : 'Verify Code'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[12px] font-medium text-[#4E616A] mt-6">
          © 2026 Zipo Ride. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default VerifyPasswordPage;
