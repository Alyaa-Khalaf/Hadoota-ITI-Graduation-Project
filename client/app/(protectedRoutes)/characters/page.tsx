import ChildCharactres from "@/components/ChildCharacters";
import HomeButton from "@/components/ui/HomeButton";
import PreviousButton from "@/components/ui/PreviousButton";

export default function CharactersPage(){

    return(
        <>
        <PreviousButton/>
       <HomeButton href="/childAdventure" />
       <ChildCharactres/>
        </>
    )
}