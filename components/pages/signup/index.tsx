import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { UserInfo, userSignup, userLogin } from '../../../api/users'
import { GlobalState } from '../../../store/reducers'
import { connect, useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import DivLoader from '../../common/DivLoader'
import { getToken, setToken } from '../../../utils/auth'
import FullLogo from '../../common/FullLogo'
import { setUserInfo } from '../../../store/main/actions'

interface SignUpPageProps {
  userInfo: UserInfo
}

const SignUp: React.FC<SignUpPageProps> = ({ userInfo }) => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [err, setErr] = useState('')
  const [errName, setErrName] = useState('')
  const [errEmail, setErrEmail] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [errPasswordConfirm, setErrPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const dispatch = useDispatch()

  function handleEmailChange(e: any) {
    setEmail(e.target.value)
    setErrEmail('')
    setErr('')
  }

  function handleNameChange(e: any) {
    setName(e.target.value)
    setErrName('')
    setErr('')
  }

  function handlePasswordChange(e: any) {
    setPassword(e.target.value)
    setErrPassword('')
    setErr('')
  }

  function handlePasswordConfirmChange(e: any) {
    setPasswordConfirm(e.target.value)
    setErrPasswordConfirm('')
    setErr('')
  }

  function validateData() {
    if (!name) {
      setErrName('Please enter full name')
      return false
    }
    if (!email) {
      setErrEmail('Please provide your email')
      return false
    }
    if (!password) {
      setErrPassword('Please enter a value')
      return false
    }
    if (!passwordConfirm) {
      setErrPasswordConfirm('Please enter a value')
      return false
    }
    if (password.length < 8) {
      setErrPassword('Password must contain at least 8 characters')
      return false
    }
    if (passwordConfirm.length < 8) {
      setErrPasswordConfirm('Password must contain at least 8 characters')
      return false
    }
    if (password !== passwordConfirm) {
      setErr('Both passwords are not same')
      return false
    }
    return true
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    let validate = validateData()
    if (validate) {
      try {
        setIsLoading(true)
        const inputData = {
          name: name,
          email: email,
          password: password,
          passwordConfirm: passwordConfirm
        }
        await userSignup(inputData)
        toast.success('Sign up successful!')
        // Automatically log the user in using the same credentials
        const loginRes = await userLogin({ email, password })
        setToken(loginRes.token.access_token)
        dispatch(setUserInfo(loginRes.user))
        router.push('/')
      } catch (err: any) {
        toast.error(err?.response?.data?.error ?? 'Sign up failed')
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    let token = getToken()
    if (token) {
      router.push('/')
    }
  }, [])

  return (
    <>
      <div className='flex gap-10 mobile:gap-0'>
        <div className='h-screen sticky top-0 left-0 bottom-0 w-72 mobile:w-16 flex items-start justify-center overflow-hidden'>
          <img
            className='h-full left-0 top-0 bottom-0 object-cover absolute'
            src='/images/authpage-gradient.avif'
          />
          <div className='z-10 mt-10 mobile:hidden'>
            <FullLogo />
          </div>
        </div>
        <div className='h-screen w-full flex flex-col items-start justify-start px-4 mobile:justify-start tablet:justify-start mobile:p-10 overflow-auto'>
          <div className='max-w-xs w-full space-y-8'>
            <div className='flex flex-col items-start'>
              <div className='hidden mobile:block'>
                <FullLogo />
              </div>
              <p className='text-sky-500 my-0 mt-10 text-2xl'>Sign up</p>
              <p className='text-gray-400 text-sm mt-2 my-5 text-start w-5/6'>
                <span className='text-sky-500'>Hello There!</span> Sign up for
                free to unlock 1000+ book summaries
              </p>
            </div>
            <form
              className='mt-8'
              action='#'
              method='POST'
              onSubmit={handleSubmit}
            >
              <input type='hidden' name='remember' defaultValue='true' />
              <div className='mb-6'>
                <label htmlFor='email' className='sr-only'>
                  name
                </label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  required
                  className='w-full rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-800'
                  placeholder='Full name'
                  value={name}
                  onChange={handleNameChange}
                />
                {errName && (
                  <p className='text-sm text-orange-500'>{errName}</p>
                )}
              </div>

              <div className='mb-6'>
                <label htmlFor='email' className='sr-only'>
                  email
                </label>
                <input
                  id='email'
                  name='email'
                  type='text'
                  required
                  className='w-full rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-800'
                  placeholder='Email'
                  value={email}
                  onChange={handleEmailChange}
                />
                {errEmail && (
                  <p className='text-sm text-orange-500'>{errEmail}</p>
                )}
              </div>
              <div className='mb-6'>
                <label htmlFor='password' className='sr-only'>
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className='w-full rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-800'
                  placeholder='Password'
                  value={password}
                  onChange={handlePasswordChange}
                />
                {errPassword && (
                  <p className='text-sm text-orange-500'>{errPassword}</p>
                )}
              </div>
              <div className='mb-6'>
                <label htmlFor='password' className='sr-only'>
                  Confirm Password
                </label>
                <input
                  id='passwordConfirm'
                  name='passwordConfirm'
                  type='password'
                  required
                  className='w-full rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-800'
                  placeholder='Re-enter password'
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                />
                {errPasswordConfirm && (
                  <p className='text-sm text-orange-500'>
                    {errPasswordConfirm}
                  </p>
                )}
              </div>
              <div className='flex items-center justify-between my-6'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    className='h-4 w-4 text-sky-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='remember-me'
                    className='ml-2 block text-sm text-dark'
                  >
                    Remember me
                  </label>
                </div>
              </div>

              <div className='flex flex-col items-center justify-center'>
                {err && <p className='text-sm text-orange-500'>{err}</p>}
                <button
                  type='submit'
                  className='group relative w-full flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-full text-white bg-sky-500 hover:bg-sky-600 outline-none h-10'
                >
                  {isLoading ? (
                    <DivLoader className='border-b-white border-r-white border-t-white border-transparent w-6 h-6' />
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </form>
            <p className='text-xs text-gray-400'>
              By signing up, you agree to our{' '}
              <span className='text-sky-500'>Terms of Service</span> and{' '}
              <span className='text-sky-500'>Privacy Policy</span>
            </p>
            <Link href={'/login'}>
              <p className='text-base text-sky-400 my-5'>
                Already have an account? let's login
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToPros = (state: GlobalState) => {
  return {
    userInfo: state.main.userInfo
  }
}

export default connect(mapStateToPros)(SignUp)
