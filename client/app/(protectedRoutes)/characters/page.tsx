import ChildCharactres from "@/components/ChildCharacters";
import HomeButton from "@/components/ui/HomeButton";

export default function CharactersPage(){

    return(
        <>
       <HomeButton href="/childAdventure" />
       <ChildCharactres/>
        </>
    )
}