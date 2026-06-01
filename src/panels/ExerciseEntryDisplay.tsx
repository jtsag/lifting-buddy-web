import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import SuggestionRow from "./SuggestionRow";
import { getSessionsByExercise } from "../db_utils.ts";
import { sessionDisplayParts, type Session } from "../data_utils.ts";
import '../styles/ExerciseEntryDisplay.css'

interface EEDProps {
    name:string;
}

const ExerciseEntryDisplay:React.FC<EEDProps> = ({
    name
}) => {
    const [expanded, setExpanded] = useState<boolean>(false)
    const [sessionList, setSessionList] = useState<Session[]>([])
    const navigate = useNavigate();
    const [suggestionRefreshKey, _] = useState<number>(0)

    useEffect(() => {
        async function load() {
            const all = await getSessionsByExercise(name);
            setSessionList(all.toReversed());
        }
        load();
    }, [])

    return (
    <div id="main-container-eed">
        <div id="title-row">
            <button onClick={() => {navigate(`/editExercise/${name}`)}}>{"\u270E"}</button>
            <h2 onClick={()=>{setExpanded(!expanded)}}>{name.toUpperCase()}</h2> {/* TODO: Add program indication */}
        </div>
        {expanded && (
            <div id="entry-col">
                <SuggestionRow exercise={name} firstWeight={1.0} lastAlignment="flex-end" editing={false} refreshKey={suggestionRefreshKey} onSubmit={() => {}}/>
                {sessionList.map( (sessionObj) => {
                    const items = sessionDisplayParts(sessionObj)
                    return (
                        <div className="session-row">
                            <div className="box1"><p>{items[0]}</p></div>
                            <div className="box2"><p>{items[1]}</p></div>
                            <div className="box3"><p>{items[2]}</p></div>
                        </div>
                    )
                })}
            </div>
        )
        }
    </div>
    )
}

export default ExerciseEntryDisplay