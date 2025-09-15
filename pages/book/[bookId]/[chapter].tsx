import { useRouter } from 'next/router'
import Layout from '../../../components/common/layout'
import Chapter from '../../../components/pages/bookread/Chapter'
import { INTRODUCTION_CHAPTER } from '../../../utils/consts';
import Introduction from '../../../components/pages/bookread/Introduction';

const ReadBook: React.FC = () => {
  const router = useRouter();
  const chapter = router.query.chapter;

  return (
    <Layout>
      {chapter == INTRODUCTION_CHAPTER ?
        <Introduction />
        :
        <Chapter />
      }
    </Layout>
  )
}
export default ReadBook
