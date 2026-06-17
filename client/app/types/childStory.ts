
export type Characters = {
  id: number
  name: string
  animation:any
}

export type StoryTopics={
  id:number
  title:string
  emoji:string
  color:string
  shadowColor:string
}

// story
export type StoryScene = {
  id: number
  image: string
  text: string

  question?: {
    title: string
    options: string[]
    correct: number
  } | null
}