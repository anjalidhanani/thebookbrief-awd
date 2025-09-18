import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import 'swiper/css'
import { SwiperSlide } from 'swiper/react'
import { getAllFreeBooks, getFeaturedBook } from '../../../api/books'
import BookInfo from '../../common/BookInfo'
import DivLoader from '../../common/DivLoader'
import SubHeaderText from '../../common/SubHeaderText'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Navigation } from 'swiper/modules'
import { Swiper } from 'swiper/react'
import useWindowSize from '../../../hooks/useWindowSize'

const Home: React.FC = () => {
  const router = useRouter()
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [freshBooks, setFreshBooks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasMoreBooks, setHasMoreBooks] = useState<boolean>(true)
  const [hasMoreFeatured, setHasMoreFeatured] = useState<boolean>(true)

  // Refs for sliders
  const featuredSliderRef = useRef<any>(null)
  const booksSliderRef = useRef<any>(null)
  const [width, height] = useWindowSize()

  const fetchFeaturedBooks = (appendMode: boolean = false) => {
    setIsLoading(true)
    const currentPage = appendMode ? Math.floor(featuredBooks.length / 20) : 0
    getFeaturedBook(currentPage, 20)
      .then(data => {
        setFeaturedBooks((preval: any) => {
          return appendMode ? preval.concat(data.data) : data.data
        })
        if (data.pagination) {
          setHasMoreFeatured(data.pagination.hasMore)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const fetchBooks = (appendMode: boolean = false) => {
    setIsLoading(true)
    const currentPage = appendMode ? Math.floor(books.length / 20) : 0
    getAllFreeBooks(currentPage, 20)
      .then(data => {
        setBooks((preval: any) => {
          return appendMode ? preval.concat(data.data) : data.data
        })
        if (data.pagination) {
          setHasMoreBooks(data.pagination.hasMore)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Custom slider component with load more functionality
  const CustomBookSlider = ({ children, onLoadMore, hasMore, sliderRef, congestion = 'HIGH' }: any) => {
    const navigationPrevRef = useRef<HTMLButtonElement>(null)
    const navigationNextRef = useRef<HTMLButtonElement>(null)
    const [isAtEnd, setIsAtEnd] = useState(false)
    const navClassNames = 'bg-white flex items-center justify-center cursor-pointer transition w-8 h-8 rounded-full absolute top-1/2 -mt-4 z-10 shadow-lg'

    const handleNextClick = () => {
      let atEnd = false

      if (sliderRef.current && sliderRef.current.swiper) {
        const swiper = sliderRef.current.swiper
        atEnd = swiper.isEnd || isAtEnd
      } else {
        atEnd = isAtEnd
      }

      if (atEnd && hasMore && onLoadMore) {
        onLoadMore()
      }
    }

    return (
      <Swiper
        key={width}
        modules={[Navigation]}
        spaceBetween={30}
        className='mt-3 relative !overflow-visible'
        onSwiper={(swiper) => {
          if (sliderRef) {
            sliderRef.current = swiper
          }
        }}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current
        }}
        onBeforeInit={(swiper: any) => {
          swiper.params.navigation.prevEl = navigationPrevRef.current
          swiper.params.navigation.nextEl = navigationNextRef.current
        }}
        onSlideChange={(swiper) => {
          if (swiper) {
            setIsAtEnd(swiper.isEnd)
          }
        }}
        breakpoints={
          congestion === 'HIGH'
            ? {
                320: { slidesPerView: 2 },
                500: { slidesPerView: 4 },
                992: { slidesPerView: 4 },
                1280: { slidesPerView: 6 },
                1441: { slidesPerView: 7 },
                1700: { slidesPerView: 8 }
              }
            : {
                320: { slidesPerView: 1 },
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
          <ArrowLeftIcon className='w-4 h-4 text-gray-500' />
        </button>

        {children}

        <button
          ref={navigationNextRef}
          className={`${navClassNames} -right-4`}
          onClick={handleNextClick}
        >
          <ArrowRightIcon className='w-4 h-4 text-gray-500' />
        </button>
      </Swiper>
    )
  }

  useEffect(() => {
    fetchBooks()
    fetchFeaturedBooks()
  }, [])

  return (
    <div className='flex flex-col items-start w-full'>
      <div className='w-full px-10 pt-10 mobile:px-3 mobile:pt-3 tablet:px-10 tablet:pt-8 h-[calc(100dvh)] mt-10'>
        {/* <div className='relative flex items-center justify-end w-full mb-8'>
          <div className='relative flex items-center w-2/6 mobile:w-full tablet:w-full'>
            <input
              className='w-full rounded-full p-3 pl-12 text-gray-600 bg-white focus:ring-2 focus:ring-sky-200 outline-none shadow-lg shadow-gray-100 placeholder:text-gray-300'
              placeholder='Find book from your shelf...'
            />
            <MagnifyingGlassIcon className='text-gray-400 w-6 h-6 absolute left-3' />
          </div>
          <div
            className='mx-5 cursor-pointer text-gray-600'
            onClick={() => {
              router.push('/settings')
            }}
          >
            <Cog6ToothIcon className='w-7 h-7' />
          </div>
        </div> */}
        {featuredBooks && featuredBooks?.length > 0 && (
          <>
            <SubHeaderText text='Top picks for you' />
            <div className='py-6 sm:px-4 smd:px-6 rounded-3xl overflow-hidden mobile:px-4'>
              <CustomBookSlider
                onLoadMore={() => fetchFeaturedBooks(true)}
                hasMore={hasMoreFeatured}
                sliderRef={featuredSliderRef}
                congestion="LOW"
              >
                {featuredBooks?.map((data: any, index: number) => {
                  return (
                    <SwiperSlide key={index}>
                      <div
                        className='py-10 w-[24rem] cursor-pointer mt-5 relative'
                        onClick={() => {
                          router.push(`/book/${data.id.toString()}/introduction`)
                        }}
                      >
                        <div className='relative w-[22rem] flex items-end gap-3 pt-2'>
                          <div className='relative bg-black bg-opacity-30 bottom-3 h-32 pl-32 ml-1 p-5 rounded-2xl shadow-lg shadow-gray-100 overflow-hidden'>
                            <div className='relative z-10 w-64'>
                              <p className='text-white font-bold text-xl w-52 mb-2 line-clamp-2'>
                                {data?.title}
                              </p>
                              <i className='text-white text-sm font-thin w-52 line-clamp-1'>
                                - {data?.author}
                              </i>
                            </div>
                            <div
                              className='absolute inset-0 z-0 saturate-200'
                              style={{
                                background: `url('${data?.imageUrl}')`,
                                backgroundSize: 'cover',
                                filter: 'blur(20px)',
                                transform: 'scale(1.2)'
                              }}
                            ></div>
                          </div>
                          <Image
                            className='absolute rounded-xl bottom-8 left-5 shadow-lg shadow-gray-800 transition duration-300 ease-in-out hover:scale-105'
                            src={data?.imageUrl}
                            alt={data?.title}
                            height={100}
                            width={100}
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                })}
              </CustomBookSlider>
            </div>
          </>
        )}

        {isLoading && (
          <DivLoader className='w-6 h-6 border-b-sky-500 border-r-sky-500' />
        )}
        {books && (
          <>
            <SubHeaderText text='Fresh Reads' />
            <div className='overflow-hidden scrollbar-hide px-8 tablet:px-4 mobile:px-4'>
              <CustomBookSlider
                onLoadMore={() => fetchBooks(true)}
                hasMore={hasMoreBooks}
                sliderRef={booksSliderRef}
                congestion="HIGH"
              >
                {books &&
                  books.map((data: any, index: number) => {
                    return (
                      <SwiperSlide key={index}>
                        <BookInfo data={data} />
                      </SwiperSlide>
                    )
                  })}
              </CustomBookSlider>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default Home
