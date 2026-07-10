import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { exerciseTagString, findSuggestion, sessionDisplayParts, type Exercise, type Program, type Session } from "../data_utils.ts";
import { deleteSession, getExercise, getProgram, getSessionsByExercise, saveSession } from "../db_utils_v2.ts";
import SuggestionRow from "../panels/SuggestionRow.tsx";
import EditOptionMenu from "../panels/EditOptionMenu.tsx";
import '../styles/EditScreen.css';

interface EditScreenProps {

}

const EditScreen:React.FC<EditScreenProps> = ({

}) => {
    const {name} = useParams<{name:string}>();
    const navigate = useNavigate()
    if(!name) { navigate("/") }
    const [program, setProgram] = useState<Program | undefined>(undefined);
    const [exercise, setExercise] = useState<Exercise>({name:name!!, tags:[]});
    const [sessions, setSessions] = useState<Session[]>([]);
    const [sets, setSets] = useState<string>();
    const [reps, setReps] = useState<string>();
    const [weight, setWeight] = useState<string>();
    const [suggestionRefreshKey, setSuggestionRefreshKey] = useState<number>(0);

    async function refreshSessions() {
        const sessionList = await getSessionsByExercise(name!!);
        setSessions(sessionList.toReversed())    
    }

    useEffect(() => {
        async function load() {
            const prog = await getProgram(name!!);
            setProgram(prog);
        }
        load();
    }, [])
    
    useEffect(() => {
        async function load() {
            const exer = await getExercise(name!!);
            setExercise(exer!!);
        }
        load();
    }, [])

    useEffect(() => {refreshSessions()}, [])

    return (
        <div id="main-container-edit">
            <div id="options-row">
                <button onClick={() => {navigate('/')}}>Back</button>
                <EditOptionMenu options={{
                    "Edit Tags" : `/tagEdit/${name}`,
                    [(program? "Delete Program" : "Add Program")]: (program? `/programDelete/${name}` : `/programAdd/${name}` )               
                }}/>
            </div>
            <h1 id="title">{name?.toUpperCase()}</h1>
            {program? <h2 className="subtitle">{`MAX: ${program!!.max} LBS`}</h2> : null}
            {(exercise.tags.length > 0)? <div id="tag-row">
                <h2 className="subtitle">{`Tags: ${exerciseTagString(exercise)}`}</h2>
            </div> : null
            }
            <div className="entry-row" id="add-row">
                <div className="box1">
                    <p>{(new Date()).toLocaleString("en-US", {
                        weekday:"short",
                        month:"short",
                        day:'2-digit'
                    })}</p>
                </div>
                <div className="box2">
                    <div id="reps-input">
                        <input type="text" value={sets} onChange={(e) => setSets(e.target.value)}/>
                        <p> x </p>
                        <input type="text" value={reps} onChange={(e) => setReps(e.target.value)}/>
                    </div>
                </div>
                <div className="box3">
                    <div id="weight-input">
                        <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)}/>
                        <p> lbs</p>
                    </div>
                </div>
                
                <div className="box4">
                    <button onClick={async () => {
                        try {
                            await saveSession({
                                time:Date.now(),
                                parent:name!!,
                                sets:Number(sets),
                                reps:Number(reps),
                                weight:Number(weight)
                            })

                            setSets("")
                            setReps("")
                            setWeight("")

                        } catch(error) {
                            console.log(error)
                        }
                        refreshSessions()
                    }}>+</button>
                </div>
            </div>
            <SuggestionRow exercise={name!!} firstWeight={0.2} lastAlignment="center" editing={true} refreshKey={suggestionRefreshKey} onSubmit={ async () => {
                try {
                    const lst = findSuggestion(program, sessions)
                    if(!lst) return;
                    await saveSession({
                        time:Date.now(),
                        parent:name!!,
                        sets:Number(lst[1].split("x")[0].trim()),
                        reps:Number(lst[1].split("x")[1].trim()),
                        weight:Number(lst[2].split("lbs")[0].trim())
                    })
                } catch(error) {
                    console.log(error)
                }
                setSuggestionRefreshKey(suggestionRefreshKey+1)
                refreshSessions()
            }}/>
            <div id="entry-history">
                {sessions.map((e) => {
                    const items = sessionDisplayParts(e)
                    return (
                        <div className="entry-row" key={e.time}>
                            <div className="box1"><p>{items[0]}</p></div>
                            <div className="box2"><p>{items[1]}</p></div>
                            <div className="box3"><p>{items[2]}</p></div>
                            <div className="box4"><button onClick={async () => {
                                await deleteSession(e.time)
                                setSuggestionRefreshKey(suggestionRefreshKey+1)
                                refreshSessions()
                            }}>-</button></div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default EditScreen