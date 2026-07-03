import ChildCharactres from "@/components/ChildCharacters";
import HomeButton from "@/components/ui/HomeButton";
import PreviousButton from "@/components/ui/PreviousButton";
import { console } from "inspector";

export default function CharactersPage(){


    console.log()
    return(
        <>
        <PreviousButton/>
       <HomeButton href="/childAdventure" />
       <ChildCharactres/>
       
        </>
    )
}