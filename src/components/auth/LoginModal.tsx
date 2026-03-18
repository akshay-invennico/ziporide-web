import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'

const LoginModal = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Please enter a valid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: (values) => {
            console.log('Login submitted:', values)
        },
    })

    return (
        <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-white overflow-y-auto p-4">
            <div className="bg-white shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] rounded-xl w-full max-w-[560px] max-h-[600px] overflow-auto px-5 sm:px-10 py-8 sm:py-10 my-auto">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-6">
                    <img src="/logo.svg" alt="ZipoRide" className="w-[32px] h-[32px]" />
                    <h3 className='font-semibold text-[24px] text-[#000000] font-inter'>ZipoRide</h3>
                </div>

                {/* Heading */}
                <h1 className="text-[24px] font-bold text-[#000000] mb-1 font-inter">Welcome Back</h1>
                <p className="text-[14px] font-medium text-[#4E616A] mb-6 font-inter">
                    Log in to manage drivers, rides, and platform operations.
                </p>

                <form onSubmit={formik.handleSubmit} noValidate>
                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-[#4E616A] mb-2 font-inter">
                            Email
                        </label>
                        <div className={`flex items-center border rounded-lg px-3 py-3 transition
                            ${formik.touched.email && formik.errors.email
                                ? 'border-red-400 focus-within:border-red-500'
                                : 'border-[#DFE6E5] focus-within:border-[#1DAFA1] hover:shadow-[0_0_16px_0_#ED9B0E3D]'
                            }`}>
                            <img src="/icons/auth/mail.svg" alt="email" className="w-5 h-5 mr-2 shrink-0" />
                            <input
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                                {...formik.getFieldProps('email')}
                                className="flex-1 text-[14px] font-medium text-[#000000] outline-none placeholder-[#939999] bg-transparent"
                            />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-[#4E616A] mb-2 font-inter">
                            Password
                        </label>
                        <div className={`flex items-center border rounded-lg px-3 py-3 transition
                            ${formik.touched.password && formik.errors.password
                                ? 'border-red-400 focus-within:border-red-500'
                                : 'border-[#DFE6E5] focus-within:border-[#1DAFA1] hover:shadow-[0_0_16px_0_#ED9B0E3D]'
                            }`}>
                            <img src={formik.values.password ? "/icons/auth/lockOn.svg" : "/icons/auth/lockOff.svg"} alt="password" className="w-5 h-5 mr-2 shrink-0" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...formik.getFieldProps('password')}
                                className="flex-1 text-[14px] font-medium text-[#000000] outline-none placeholder-[#939999] bg-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="ml-2"
                            >
                                <img src={showPassword ? "/icons/auth/eyeOpen.svg" : "/icons/auth/eyeClose.svg"} alt="toggle visibility" className="w-5 h-5" />
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>
                        )}
                    </div>

                    {/* Remember me + Forgot */}
                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                id="rememberMe"
                                type="checkbox"
                                {...formik.getFieldProps('rememberMe')}
                                checked={formik.values.rememberMe}
                                className="accent-[#1DAFA1] w-3.5 h-3.5"
                            />
                            <span className="text-[12px] font-medium text-[#000000]">Remember me</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="text-[12px] font-medium  text-[#686262] hover:text-[#1DAFA1] hover:underline cursor-pointer"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#1DAFA1] cursor-pointer  text-white font-semibold text-[16px] py-2.5 rounded-lg transition"
                    >
                        Log in
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-[12px] font-medium text-[#4E616A] mt-6">© 2026 Zipo Ride. All rights reserved.</p>
            </div>
        </div>
    )
}

export default LoginModal