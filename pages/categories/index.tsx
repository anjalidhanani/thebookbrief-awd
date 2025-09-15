import Layout from "../../components/common/layout";
import Categories from "../../components/pages/categories";

export default function Index() {
  return (
    <Layout title={`All Categories`}>
      <Categories />
    </Layout>
  );
}
