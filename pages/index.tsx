import type { NextPage } from "next"

import ConnectForm from "@components/index/connect-form"
import IndexPhoto from "@components/index/photo"

const Home: NextPage = () => {
  return (
    <div className="flex flex-row">
      <IndexPhoto />
      <ConnectForm />
    </div>
  )
}

export default Home
