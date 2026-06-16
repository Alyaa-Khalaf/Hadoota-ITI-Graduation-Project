import {StoryScene} from "../types/childStory"

export const mockScenes:StoryScene[] = [
  {
    id: 1,
    image: "/assets/lion.jpg",

    text:
      "كان يا مكان، كان هناك أسد صغير يعيش في الغابة.",

    question: null,
  },

  {
    id: 2,
    image: "/assets/forest.jpg",

    text:
      "في يوم جميل، سمع الأسد صوتًا غريبًا خلف الأشجار.",

    question: {
      title: "ماذا تتوقع أن يكون الصوت؟",

      options: [
        "طائر",
        "تنين",
        "ريح",
      ],

      correct: 0,
    },
  },

  {
    id: 3,
    image: "/assets/friends.jpg",

    text:
      "اكتشف الأسد أن الصوت كان لطائر صغير يحتاج للمساعدة.",

    question: null,
  },
]