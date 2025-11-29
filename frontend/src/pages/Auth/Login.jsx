import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useLoginMutation } from '../../redux/api/userApiSlice'
import { setCredentials } from '../../redux/features/auth/authslice'
import { toast } from 'react-toastify'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    const { userInfo } = useSelector((state) => state.auth)
    // console.log(userInfo)

    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [userInfo, navigate, redirect])

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await login({ email, password }).unwrap()
            dispatch(setCredentials({ ...res }))
            navigate(redirect)
            toast.success("Login successful")
        } catch (err) {
            toast.error(err?.data?.message || err.error || "Login failed")
        }
    }

    return (
        <section className='pl-[10rem] flex'>
            <div className='mr-[4rem] mt-[5rem]'>
                <h1 className='text-2xl font-semibold mb-6 text-white'> Login </h1>

                <form className='container w-[40rem]' onSubmit={submitHandler}>
                    <div className='mb-6 relative'>
                        <label htmlFor="email"
                            className='block text-sm font-medium text-gray-300 mb-2'>
                            Email Address
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                id="email"
                                className='w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg
                                        border border-[#333] px-10 py-2
                                        focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent
                                        placeholder:text-[#888] transition duration-200'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div className='mb-6 relative'>
                        <label htmlFor="password"
                            className='block text-sm font-medium text-gray-300 mb-2'>
                            Password
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className='w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg
                                        border border-[#333] px-10 py-2
                                        focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent
                                        placeholder:text-[#888] transition duration-200'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <div
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ?
                                    <FaEyeSlash className="text-gray-400" /> :
                                    <FaEye className="text-gray-400" />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 bg-[#1e1e1e] border border-[#333] rounded focus:ring-[#ff6b9d]"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-300">
                                Remember me
                            </label>
                        </div>
                        <Link to="/forgot-password" className="text-sm text-[#ff6b9d] hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white py-3 rounded-lg font-medium hover:from-[#ff5c92] hover:to-[#ff7a99] transition duration-200 flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </>
                        ) : 'Sign In'}
                    </button>

                    <p className="mt-4 text-center text-gray-400">
                        Don't have an account?{" "}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-[#ff6b9d] hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
            <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
                alt="Register Illustration"
                className="h-[48rem] w-[50%] xl:block md:hidden sm:hidden rounded-lg"
            />
        </section>
    )
}

export default Login