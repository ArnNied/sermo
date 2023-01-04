import Link from "next/link"
import { useEffect } from "react"

import { SVGInjector } from "@tanem/svg-injector"

const IndexPhoto = () => {
  useEffect(() => {
    SVGInjector(document.getElementById("index-photo"))
  }, [])

  return (
    <div className="hidden md:block relative w-full md:w-7/12 h-[45%] md:h-screen">
      <div
        id="index-photo"
        className="w-full h-full"
        data-src="/index/chat-rafiki.svg"
      ></div>
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <Link
          href="https://storyset.com/illustration/group-chat/rafiki#03DD33FF&hide=&hide=complete"
          className="text-white underline"
        >
          Credit
        </Link>
      </div>
    </div>
  )
}

export default IndexPhoto
