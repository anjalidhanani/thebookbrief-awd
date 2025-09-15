import { connect } from 'react-redux'
import { UserInfo } from '../../../api/users'
import { GlobalState } from '../../../store/reducers'

import { useState } from 'react'
import GoBackButton from '../../common/GoBackButton'
import HeaderText from '../../common/HeaderText'
import AccountSettings from './AccountSettings'

interface HomePageProps {
  userInfo: UserInfo
}

const Home: React.FC<HomePageProps> = ({ userInfo }) => {
  const [activeTab, setActiveTab] = useState<string>('account')
  const tabButtonOptions = ['account']
  const TabButton = (tab: string) => {
    return (
      <button
        className={`mobile:w-1/3 mobile:text-center ${
          activeTab === tab ? 'text-sky-500' : ''
        }`}
        onClick={() => {
          setActiveTab(tab)
        }}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    )
  }
  return (
    <div className='flex flex-col items-start w-full'>
      <div className='w-full px-5 pt-10 mobile:px-3 mobile:pt-3 tablet:px-10 tablet:pt-8'>
        <div className='flex items-center gap-5'>
          <GoBackButton />
          <HeaderText text='Settings' />
        </div>
        {/* <div className='w-full flex gap-10 py-4 mobile:py-2 text-lg mobile:text-lg mobile:justify-between content-center items-center border-b'>
          {tabButtonOptions.map((data, index) => {
            return <div key={index}>{TabButton(data)}</div>
          })}
        </div> */}
        <div className='flex flex-col py-6'>
          {activeTab === 'account' && <AccountSettings />}
          {/* {activeTab === 'content' && <ContentSettings />} */}
          {/* {activeTab === "preference" && <PreferenceSettings />} */}
        </div>
      </div>
    </div>
  )
}

const mapStateToPros = (state: GlobalState) => {
  return {
    userInfo: state.main.userInfo
  }
}

export default connect(mapStateToPros)(Home)
