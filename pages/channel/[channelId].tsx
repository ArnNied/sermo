import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { useAppSelector } from "../../store/hooks"

const Channel: NextPage = () => {
  const router = useRouter()
  const selectUsername = useAppSelector((state) => state.user.username)

  useEffect(() => {
    if (!selectUsername) {
      router.push("/")
    }
  }, [])

  return (
    <div className="centered flex flex-col items-center">
      <h1 className="font-bold text-6xl text-white">
        Username: {selectUsername}
      </h1>
      <Link href="/">
        <a className="font-bold text-white hover:text-gray-200">Return</a>
      </Link>
    </div>
  )
}

export default Channel
