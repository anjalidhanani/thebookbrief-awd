import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux'
// import { userLogout } from '../../api/users'
import { initMain } from '../../store/main/actions'
import { clearAllCookie } from '../../utils/auth'
import DivLoader from './DivLoader'

export const LogoutDialog = ({ show, setShow }: any) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const logout = async () => {
    setLoading(true)
    dispatch(initMain())
    clearAllCookie()
    router.push('/login')
    setLoading(false)
    // await userLogout()
  }

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as='div' className='relative  z-[1000]' onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all w-full sm:w-96 font-satoshi'>
                <div className='flex justify-between px-6 pt-8 pb-2'>
                  <div>
                    <Dialog.Title
                      as='h3'
                      className='text-xl font-bold leading-6 text-sky-500'
                    >
                      Logging out
                    </Dialog.Title>
                    <Dialog.Description
                      as='p'
                      className='text-sm text-gray-500 mt-4'
                    >
                      Are you sure you want to logout?</Dialog.Description>
                  </div>
                  <div className='rounded-4xl'>
                    <XMarkIcon
                      className='rounded-4xl cursor-pointer w-6 h-6 text-gray-500 hover:text-sky-500 active:text-navy-1'
                      onClick={() => {
                        setShow(false)
                      }}
                    />
                  </div>
                </div>
                <div className='flex justify-between items-center mobile:flex-col-reverse px-6 pb-6 w-full'>
                  <button
                    className='border h-10 rounded-full ml-auto mt-4 mr-2 mobile:mr-0 text-light w-full outline-none'
                    onClick={() => setShow(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className='text-sky-700 h-10 rounded-full mt-4 ml-2 mobile:ml-0 w-full outline-none bg-sky-200'
                    disabled={loading}
                    onClick={() => logout()}
                  >
                    {loading ? (
                      <DivLoader className='w-6 h-6 border-b-sky-500 border-r-sky-500 ' />
                    ) : (
                      'Logout'
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
