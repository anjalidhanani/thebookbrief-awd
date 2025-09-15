import { useRouter } from "next/router";
import Layout from "../../components/common/layout";
import BooksByCat from "../../components/pages/categories/BooksByCat";

export default function Index() {
  const router = useRouter()
  const categoryName = router.query.categoryName
  return (
    <Layout title={`Books | ${categoryName}`}>
      <BooksByCat />
    </Layout>
  );
}
