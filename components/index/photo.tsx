import Image from "next/image"

const IndexPhoto = () => {
  return (
    <div className="relative w-7/12 h-screen">
      <div className="relative w-full h-screen">
        <Image src="/index/index.jpg" fill sizes="100vw" alt="Splash Image" />
      </div>
      <div className="absolute bottom-0 left-0 text-white">
        Photo by{" "}
        <a
          href="https://unsplash.com/@ninjason?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          className="text-blue-600 hover:text-blue-700"
        >
          Jason Leung
        </a>{" "}
        on{" "}
        <a
          href="https://unsplash.com/s/photos/chat?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          className="text-blue-600 hover:text-blue-700"
        >
          Unsplash
        </a>
      </div>
    </div>
  )
}

export default IndexPhoto
