import { useEffect, useState } from "react";
import { findSuggestion, type Program, type Session } from "../data_utils";
import { getProgram, getSessionsByExercise } from "../db_utils";
import "../styles/SuggestionRow.css";

interface SRProps {
    exercise : string;
    firstWeight : number;
    lastAlignment : string;
    editing : boolean;
    onSubmit: () => void;
    refreshKey : number;
}

const SuggestionRow:React.FC<SRProps> = ({
    exercise,
    firstWeight,
    lastAlignment,
    editing,
    onSubmit,
    refreshKey
}) => {
    
    const [prog, setProg] = useState<Program>()
    const [sessions, setSessions] = useState<Session[]>([])

    useEffect(() => {
        async function load() {
            const program = await getProgram(exercise)
            setProg(program)
        }
        load();
    }, [])

    useEffect(() => {
        async function load() {
            const sessionList = await getSessionsByExercise(exercise)
            setSessions(sessionList)
        }
        load();
    }, [refreshKey])
    
    const items = findSuggestion(prog, sessions)
    if(!items) return <div></div>

    return (
        <div id="row">
            <div className="sbox1" style={{flex:firstWeight}}><p>{items[0]}</p></div>
            <div className="sbox2"><p>{items[1]}</p></div>
            <div className="sbox3" style={{justifyContent:lastAlignment}}><p>{items[2]}</p></div>
            {editing && (items[0] !== "") &&
                <div className="sbox4"><button onClick={onSubmit}>+</button></div>
            }
        </div>
    )
}

export default SuggestionRow