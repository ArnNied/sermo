import type { NextPage } from "next"

import IndexForm from "@components/index/IndexForm"
import IndexPhoto from "@components/index/IndexPhoto"

const Home: NextPage = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row">
      <IndexPhoto />
      <IndexForm />
    </div>
  )
}

export default Home
