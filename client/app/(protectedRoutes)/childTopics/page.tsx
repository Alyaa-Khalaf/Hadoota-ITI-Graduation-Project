import StoryTitles from "@/components/StoryTopics";
import HomeButton from "@/components/ui/HomeButton";
import PreviousButton from "@/components/ui/PreviousButton";

export default function ChildTopicsPage(){

    return(
        <>
        <PreviousButton/>
       <HomeButton href="/childAdventure" />
       <StoryTitles/>
        </>
    )
}