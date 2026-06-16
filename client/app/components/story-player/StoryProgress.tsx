type Props = {
  current: number
  total: number
}

export default function StoryProgress({
  current,
  total,
}: Props) {

  const width = (current / total) * 100

  return (

    <div className="mb-6">

      <div className="
        w-full
        h-4
        bg-gray-200
        rounded-full
        overflow-hidden
      ">

        <div
          className="
            h-full
            bg-primary
            transition-all
          "

          style={{
            width: `${width}%`
          }}
        />

      </div>

    </div>

  )
}