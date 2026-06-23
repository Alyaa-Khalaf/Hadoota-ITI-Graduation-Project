type Props = {
  next: () => void
  prev: () => void
}

export default function StoryControls({
  next,
  prev,
}: Props) {

  return (

    <div className="
      flex
      justify-between
      mt-6
    ">

      <button
        onClick={prev}
        className="
          bg-gray-200
          px-6 py-3
          rounded-2xl
        "
      >
        السابق
      </button>

      <button
        onClick={next}
        className="
          bg-primary
          text-white
          px-6 py-3
          rounded-2xl
        "
      >
        التالي
      </button>

    </div>

  )
}