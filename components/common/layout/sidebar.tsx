import {
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { UserInfo } from '../../../api/users'
import { GlobalState } from '../../../store/reducers'
import classNames from '../../../utils/classNames'
import { LogoutDialog } from '../LogoutDialog'

export interface SidebarOption {
  name: string
  link: string
  key: string
  colorClass: string
  icon: ReactNode
}

export interface SidebarProps {
  userInfo: UserInfo
}

function Sidebar({ userInfo }: SidebarProps) {
  const router = useRouter()
  const [show, setShow] = useState(false)

  const [userData, setUserData] = useState<UserInfo>({
    id: '',
    name: '',
    email: '',
    avatar: '',
    age: '',
    providers: ''
  })

  useEffect(() => {
    setUserData(userInfo)
  }, [userInfo])

  const SidebarOptions: SidebarOption[] = [
    {
      name: 'My Shelf',
      link: '/',
      key: 'my shelf',
      colorClass: 'text-light',
      icon: <HomeIcon className='w-5 h-5 mobile:w-7 mobile:h-7' />
    },
    {
      name: 'Explore',
      link: '/explore',
      key: 'explore',
      colorClass: 'text-light',
      icon: <MagnifyingGlassIcon className='w-5 h-5 mobile:w-7 mobile:h-7' />
    },
    {
      name: 'Categories',
      link: '/categories',
      key: 'categories',
      colorClass: 'text-light',
      icon: <Squares2X2Icon className='w-5 h-5 mobile:w-7 mobile:h-7' />
    },
    {
      name: 'Settings',
      link: '/settings',
      key: 'settings',
      colorClass: 'text-light',
      icon: (
        <Cog6ToothIcon className='w-5 h-5 mobile:w-7 mobile:h-7' />
      )
    },
    {
      name: 'Log out',
      link: '/logout',
      key: 'logout',
      colorClass: 'text-light',
      icon: (
        <ArrowRightStartOnRectangleIcon className='w-5 h-5 mobile:w-7 mobile:h-7' />
      )
    }
  ]

  const optionChip = (data: SidebarOption) => {
    return (
      <div
        className={`gap-3 flex justify-start items-center cursor-pointer ${data.colorClass
          } ${router.pathname === data.link ? 'text-sky-500' : ''}`}
        onClick={() => {
          data.key == 'logout' ? setShow(true) : router.push(data.link)
        }}
      >
        <div
          className={`${router.pathname === data.link ? 'text-sky-500 ' : 'text-gray-400'
            }`}
        >
          {data.icon}
        </div>
        <p className='text-base block mobile:hidden'>{data.name}</p>
      </div>
    )
  }


  return (
    <>
      <LogoutDialog show={show} setShow={setShow} />
      <div
        className={`relative z-[999] w-full flex flex-col h-screen mobile:p-0 overflow-y-auto justify-between text-xl mobile:text-md mobile:w-full mobile:h-fit mobile:flex-row mobile:bottom-0 mobile:left-0 mobile:right-0 items-center mobile:bg-white`}
      >
        <div className='flex flex-col justify-center items-center my-12 sm:my-8 sm:px-4 p-8 rounded-r-3xl bg-gradient-to-r from-sky-50/50 to-sky-100 mobile:hidden w-full'>
          <img
            className='w-16 h-16 mobile:hidden mb-3 rounded-3xl shadow-lg object-cover'
            src={
              userData?.avatar
                ? userData?.avatar
                : '/images/reading_book_profile.png'
            }
          />
          <p className='text-sm'>Welcome back,</p>
          <p className='text-md font-bold'>{userData?.name}</p>
        </div>
        <div
          className={classNames(
            'flex flex-col justify-between h-full w-full p-10 sm:p-7 mobile:p-0 tablet:p-5 overflow-auto scrollbar-hide'
          )}
        >
          <div className='flex mobile:fixed mobile:bottom-0 mobile:bg-white flex-col gap-7 mobile:gap-3 w-full mobile:items-center mobile:justify-between mobile:px-8 mobile:py-3 mobile:flex-row'>
            {SidebarOptions &&
              SidebarOptions.map((data: SidebarOption, index: number) => {
                return <div key={index}>{optionChip(data)}</div>
              })}
          </div>
        </div>
        <div className='absolute bottom-2 right-2 left-2 cursor-pointer mobile:w-fit mobile:hidden '>
          <div
            className='flex justify-center items-center cursor-pointer m-5 mobile:hidden'
            onClick={() => router.push('/')}
          >
            <Image
              className='object-contain w-36'
              src={'/images/logo-full.png'}
              alt={'thebookbrief'}
              width={150}
              height={80}
            />
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

export default connect(mapStateToPros)(Sidebar)
