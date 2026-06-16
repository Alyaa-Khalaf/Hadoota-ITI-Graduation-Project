type Props = {
  image: string
}

export default function StoryImage({
  image,
}: Props) {

  return (

    <img
      src={image}
      className="w-fullh-[400px]object-coverrounded-3xlshadow-xl"/>
  )
}