import Home from '../components/pages/home'
import Layout from '../components/common/layout'

export default function Index () {
  return (
    <Layout
      title={`Thebookbrief`}
      description="Read book summaries for free."
    >
      <Home />
    </Layout>
  )
}
