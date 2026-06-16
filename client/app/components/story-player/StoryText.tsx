type Props = {
  text: string
}

export default function StoryText({
  text,
}: Props) {

  return (

    <div className="
      bg-white
      rounded-3xl
      p-6
      mt-6
      text-xl
      leading-loose
      shadow-lg
    ">

      {text}

    </div>

  )
}