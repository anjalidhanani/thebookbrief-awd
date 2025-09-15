import { useRef } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Swiper } from 'swiper/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import useWindowSize from '../../hooks/useWindowSize'

export interface BookSliderProps {
  children: React.ReactNode
  congestion?: string
}

export const BookSlider: React.FC<BookSliderProps> = ({
  children,
  congestion
}) => {
  const [width, height] = useWindowSize()
  const navigationPrevRef = useRef<HTMLButtonElement>(null)
  const navigationNextRef = useRef<HTMLButtonElement>(null)
  const navClassNames =
    'bg-white flex items-center justify-center cursor-pointer transition w-8 h-8 rounded-full absolute top-1/2 -mt-4 z-10 shadow-lg'

  return (
    <Swiper
      key={width}
      modules={[Navigation]}
      spaceBetween={30}
      className='mt-3 relative !overflow-visible'
      navigation={{
        prevEl: navigationPrevRef.current,
        nextEl: navigationNextRef.current
      }}
      onBeforeInit={(swiper: any) => {
        swiper.params.navigation.prevEl = navigationPrevRef.current
        swiper.params.navigation.nextEl = navigationNextRef.current
      }}
      breakpoints={
        congestion === 'HIGH'
          ? {
              320: { width: 120 },
              500: { slidesPerView: 4 },
              992: { slidesPerView: 4 },
              1280: { slidesPerView: 6 },
              1441: { slidesPerView: 7 },
              1700: { slidesPerView: 8 }
            }
          : {
              320: { width: 360 },
              500: { slidesPerView: 1 },
              992: { slidesPerView: 2 },
              1280: { slidesPerView: 2 },
              1441: { slidesPerView: 3 },
              1700: { slidesPerView: 3 },
              1900: { slidesPerView: 4 }
            }
      }
    >
      <button ref={navigationPrevRef} className={`${navClassNames} -left-4`}>
        {/* <div className='w-1.5 h-3 m-auto'> */}
        <ArrowLeftIcon className='w-4 h-4 text-gray-500' /> {/* </div> */}
      </button>

      {children}

      <button ref={navigationNextRef} className={`${navClassNames} -right-4`}>
        {/* <div className='w-1.5 h-3 m-auto'> */}
        <ArrowRightIcon className='w-4 h-4 text-gray-500' /> {/* </div> */}
      </button>
    </Swiper>
  )
}
