import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { UserInfo, userLogin } from '../../../api/users'
import { GlobalState } from '../../../store/reducers'
import { connect, useDispatch } from 'react-redux'
import { setUserInfo } from '../../../store/main/actions'
import { toast } from 'react-hot-toast'
import { getToken, setToken } from '../../../utils/auth'
import Link from 'next/link'
import DivLoader from '../../common/DivLoader'
import FullLogo from '../../common/FullLogo'

interface LoginPageProps {
  userInfo: UserInfo
}

const Login: React.FC<LoginPageProps> = ({ userInfo }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingWithGoogle, setIsLoadingWithGoogle] = useState<boolean>(false)
  const [errEmail, setErrEmail] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const dispatch = useDispatch()

  function handleEmailChange(e: any) {
    setEmail(e.target.value)
    setErrEmail('')
  }

  function handlePasswordChange(e: any) {
    setPassword(e.target.value)
    setErrPassword('')
  }

  function validateData() {
    if (!email) {
      setErrEmail('Please provide your email')
      return false
    }
    if (!password) {
      setErrPassword('Please enter a value')
      return false
    }
    if (password.length < 8) {
      setErrPassword('Password must contain at least 8 characters')
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
        const loginData = { email: email, password: password }
        const res = await userLogin(loginData)
        setToken(res.token.access_token)
        dispatch(setUserInfo(res.user))
        router.push('/')
      } catch (err: any) {
        toast.error(err?.response?.data?.error ?? 'Login failed')
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
        <div className='h-screen w-full flex flex-col items-start justify-center px-4 mobile:justify-center tablet:justify-start mobile:p-10'>
          <div className='max-w-xs w-full space-y-8'>
            <div className='flex flex-col items-start justify-start w-full'>
              <div className='hidden mobile:block'>
                <FullLogo />
              </div>
              <p className='text-sky-500 my-0 mt-10 text-2xl'>Log in</p>
              <p className='text-gray-400 text-sm mt-2 my-5 text-start w-5/6'>
                <span className='text-sky-500'>Hello Again!</span> Nice to see
                you here, please provide your credentials to continue
              </p>
            </div>
            <form
              className='mt-5'
              action='#'
              method='POST'
              onSubmit={handleSubmit}
            >
              {/* <input type="hidden" name="remember" defaultValue="true" /> */}
              <div className='mb-6'>
                <label htmlFor='email' className='sr-only'>
                  email
                </label>
                <input
                  id='email'
                  name='email'
                  type='text'
                  autoComplete='email'
                  required
                  className='w-full rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-4 py-2 text-gray-600'
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
                  autoComplete='current-password'
                  required
                  className='w-full rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-4 py-2 text-gray-600'
                  placeholder='Password'
                  value={password}
                  onChange={handlePasswordChange}
                />
                {errPassword && (
                  <p className='text-sm text-orange-500'>{errPassword}</p>
                )}
              </div>
              <div className='flex items-center justify-between my-6'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    className='h-4 w-4 text-sky-500 border-gray-300 rounded bg-white'
                  />
                  <label
                    htmlFor='remember-me'
                    className='ml-2 block text-sm text-dark'
                  >
                    Remember me
                  </label>
                </div>

                <div className='text-sm'>
                  <Link
                    href='/forgot-password'
                    className='font-medium text-sky-500'
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div className='flex justify-center'>
                <button
                  type='submit'
                  className='group relative w-full flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-full text-white bg-sky-500 hover:bg-sky-600 outline-none h-10'
                >
                  <span className='absolute left-0 inset-y-0 flex items-center pl-3'></span>
                  {isLoading ? (
                    <DivLoader className='border-b-white border-r-white border-t-white border-transparent w-6 h-6' />
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

            </form>
            <Link href={'/signup'}>
              <p className='text-base text-sky-400 my-5'>
                Looking for Sign up?
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

export default connect(mapStateToPros)(Login)
