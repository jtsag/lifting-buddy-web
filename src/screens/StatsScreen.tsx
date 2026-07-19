import { useEffect, useState } from "react";
import { useNavigate, useParams} from "react-router-dom";
import { type Session, sessionDisplayParts, timeVsSessionData } from "../data_utils.ts";
import { getSessionsByExercise } from "../db_utils_v2.ts";
import "../styles/StatsScreen.css";
import GraphPanel from "../panels/GraphPanel.tsx";

interface StatsScreenProps {

}

const StatsScreen : React.FC<StatsScreenProps> = ({

}) => {

    const {name} = useParams<{name:string}>();
    const navigate = useNavigate()
    if(!name) { navigate("/") }

    const [sessions, setSessions] = useState<Session[]>();
    const [monthOffset, setMonthOffset] = useState<number>(2);

    useEffect(() => {
        async function loadSessions() {
            const sessionList = await getSessionsByExercise(name!!);
            setSessions(sessionList.toReversed())    
        }

        loadSessions()
    }, [])


    const maxWeightDisplay = () => {
        if(!sessions) return ""

        var maxWeight = 0
        sessions.forEach((e) => maxWeight = Math.max(maxWeight, e.weight))
        return String(maxWeight)
    }

    return (
        <div id="main-container-stats">
            <button onClick={() => {navigate(`/editExercise/${name}`)}} style={{alignSelf:"flex-start"}}>Back</button>
            <h1 id="stats-title">STATS FOR {name?.toUpperCase()}</h1>
            <div id="info-snapshot-row">
                <p>Last session recorded: {sessions ? sessionDisplayParts(sessions![0])[0] : ""}</p>
                <div className="vertical-divider"><p>|</p></div>
                <p>Max weight achieved (all time): {maxWeightDisplay()} lbs</p>
            </div>
            <div className="divider"></div>
            <select value={monthOffset} onChange={(e) => setMonthOffset(Number(e.target.value))}>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
                <option value="5">5 Months</option>
                <option value="6">6 Months</option>
            </select>
            <div className="spacer"></div>
            <GraphPanel data={timeVsSessionData((e) => (e.weight), monthOffset, sessions)} xlabel="Date" ylabel="Weight (lbs)" title="Weight Over Time"/>
            <GraphPanel data={timeVsSessionData((e) => (e.weight * e.reps * e.sets), monthOffset, sessions)} xlabel="Date" ylabel="Volume" title="Total Volume Over Time" subtitle="Sets x Reps x Weight"/>
        </div>
    )
}

export default StatsScreen