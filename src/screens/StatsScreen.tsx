import { useEffect, useState } from "react";
import { useNavigate, useParams} from "react-router-dom";
import { type Session, sessionDisplayParts } from "../data_utils.ts";
import { getSession, getSessionsByExercise } from "../db_utils_v2.ts";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface StatsScreenProps {

}

const StatsScreen : React.FC<StatsScreenProps> = ({

}) => {

    const {name} = useParams<{name:string}>();
    const navigate = useNavigate()
    if(!name) { navigate("/") }

    const [sessions, setSessions] = useState<Session[]>();

    useEffect(() => {
        async function refreshSessions() {
            const sessionList = await getSessionsByExercise(name!!);
            setSessions(sessionList.toReversed())    
        }

        refreshSessions()
    }, [])


    const maxWeightDisplay = () => {
        if(!sessions) return ""

        var maxWeight = 0
        sessions.forEach((e) => maxWeight = Math.max(maxWeight, e.weight))
        return String(maxWeight)
    }

    function getDateFormatShort(time : number) {
        const date = (new Date(time)).toLocaleDateString("en-US", {
            month:"numeric",
            day:'numeric'
        })
        return date
    }

    function getTimeTemplate(monthsBack : number) {
        const now = new Date();
        const refDate = new Date();
        refDate.setMonth(refDate.getMonth() - monthsBack);

        const twoMonthsAgo = new Date(refDate.getTime());
        const timeList = []
        while (twoMonthsAgo <= now) {
            timeList.push({date:twoMonthsAgo.getTime(), data:0})
            twoMonthsAgo.setDate(twoMonthsAgo.getDate() + 1)
        }
 
        return {timeList: timeList, startDate: refDate}
    }

    function timeVsWeightData(sessionTransform : (e: Session) => number) {
        const {timeList, startDate} = getTimeTemplate(2)
        const dataList : { date: string; data: number; highlight:boolean }[]= []
        const workingSessionList = sessions?.filter(e => new Date(e.time) >= startDate) ?? []
        const mostRecentSessionOutOfRange = sessions?.find(e => new Date(e.time) < startDate)

        var i = 0
        while(workingSessionList.length > 0) {
            const currentDateItem = new Date(timeList[i].date)
            const sessionDate = new Date(workingSessionList.at(-1)!.time)
            if(currentDateItem.getMonth() === sessionDate.getMonth() && currentDateItem.getDate() === sessionDate.getDate()) {
                dataList.push({date: getDateFormatShort(currentDateItem.getTime()), data:sessionTransform(workingSessionList.pop()!), highlight:true})
            } else {
                if(i === 0)
                    if(mostRecentSessionOutOfRange)
                        dataList.push({date: getDateFormatShort(currentDateItem.getTime()), data:sessionTransform(mostRecentSessionOutOfRange), highlight:false})
                    else
                        dataList.push({date: getDateFormatShort(currentDateItem.getTime()), data:0, highlight:false})
                else {
                    const lastItem = {...dataList.at(-1)!}
                    lastItem.highlight = false
                    lastItem.date = getDateFormatShort(currentDateItem.getTime())
                    dataList.push(lastItem)
                }  
            }
            i++
        }

        return dataList
    }

    return (
        <div id="main-container-stats">
            <h1 id="stats-title">STATS FOR {name?.toUpperCase()}</h1>
            <div id="info-snapshot-row">
                <p>Last session recorded: {sessions ? sessionDisplayParts(sessions![0])[0] : ""}</p>
                <p>Max weight achieved (all time): {maxWeightDisplay()}</p>
            </div>
            <LineChart data={timeVsWeightData((e) => (e.weight))} width={1000} height={300}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="date" />
                <YAxis />
                {/* <Tooltip /> */}
                <Line
                    dataKey="data"
                    dot={(props) => {
                        const { cx, cy, payload } = props;
                        const isBold = payload.highlight; // your condition here
                        return (
                        <circle
                            key={`dot-${cx}-${cy}`}
                            cx={cx}
                            cy={cy}
                            r={isBold ? 6 : 3}
                            fill={isBold ? "white" : "#8884d8"}
                            stroke="#8884d8"
                            strokeWidth={isBold ? 2 : 1}
                        />
                        );
                    }}
                />
            </LineChart>
        </div>
    )
}

export default StatsScreen