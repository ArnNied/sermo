import type { NextPage } from "next"

import IndexForm from "@components/index/IndexForm"
import IndexPhoto from "@components/index/IndexPhoto"

const Home: NextPage = () => {
  return (
    <div className="flex flex-row">
      <IndexPhoto />
      <IndexForm />
    </div>
  )
}

export default Home
