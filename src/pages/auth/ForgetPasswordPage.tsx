import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Please enter a valid email address').required('Email is required'),
    }),
    onSubmit: (_values, { setSubmitting }) => {
      setSubmitting(false);
      navigate('/verify-password');
    },
  });

  return (
    <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-[#f0f0f0] overflow-y-auto p-4">
      <div className="bg-white shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] rounded-xl w-full max-w-[560px] max-h-[600px] overflow-auto px-5 sm:px-10 py-8 sm:py-10 my-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.svg" alt="ZipoRide" className="h-[32px] w-[32px]" />
          <h3 className="font-semibold text-[24px] text-[#000000] font-inter">ZipoRide</h3>
        </div>

        {/* Heading */}
        <h1 className="text-[24px] font-bold text-[#000000] mb-1 font-inter">
          Forgot Your Password?
        </h1>
        <p className="text-[14px] font-medium text-[#4E616A] mb-6 font-inter">
          Enter your registered email to reset Password
        </p>

        <form onSubmit={formik.handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-40">
            <label className="block text-[14px] font-medium text-[#4E616A] mb-2 font-inter">
              Email
            </label>
            <div
              className={`flex items-center border rounded-lg px-3 py-3 transition
                            ${
                              formik.touched.email && formik.errors.email
                                ? 'border-red-400 focus-within:border-red-500'
                                : 'border-[#DFE6E5] focus-within:border-[#1DAFA1] hover:shadow-[0_0_16px_0_#ED9B0E3D]'
                            }`}
            >
              <img src="/icons/auth/mail.svg" alt="email" className="w-5 h-5 mr-2 shrink-0" />
              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...formik.getFieldProps('email')}
                className="flex-1 text-[14px] font-medium  text-[#000000] outline-none placeholder-[#939999] bg-transparent"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-[#1DAFA1] cursor-pointer  text-white font-semibold text-[16px] py-2.5 rounded-lg transition"
          >
            Send Verification Code
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-[12px] font-medium text-[#4E616A] mt-5">
          Remember Password?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[#1DAFA1] cursor-pointer hover:underline font-semibold text-[12px]"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
