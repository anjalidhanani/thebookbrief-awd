import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'

const GoBackButton = () => {
  const router = useRouter()
  return (
    <button
      className='bg-gray-100 rounded-full p-2.5 outline-none'
      onClick={() => {
        router.back()
      }}
    >
      <ArrowLeftIcon className='w-4 h-4' />
    </button>
  )
}
export default GoBackButton
