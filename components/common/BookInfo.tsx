import Link from "next/link";
import { decode } from 'html-entities';


const BookInfo = ({ data }: any) => {
  return (
    <div className="inline-block">
      <Link href={`/book/${data?.id?.toString()}/introduction`}>
        <div className="m-2 min-w-fit cursor-pointer transition duration-300 ease-in-out hover:scale-105 ">
          <div className="rounded-xl w-32 mobile:w-32">
            <img
              className="rounded-xl object-contain"
              src={data?.imageUrl}
              alt={data?.title}
            />
          </div>
          <div className="p-1">
            <p className="w-32 text-md mt-2 text-dark font-bold line-clamp-2">
              {data?.title}
            </p>
            <p className="text-sm my-2 w-32 text-light mobile:text-sm mobile:w-24 overflow-hidden truncate">
              {data?.author}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default BookInfo;
