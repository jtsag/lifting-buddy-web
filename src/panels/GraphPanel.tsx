import { ResponsiveContainer, LineChart, XAxis, YAxis, Line } from "recharts";
import { type GraphData } from "../data_utils.ts";

interface GraphPanelProps {
    data: GraphData[];
    title?:string;
    subtitle?:string;
    xlabel?:string;
    ylabel?:string;
}

const GraphPanel:React.FC<GraphPanelProps> = ({
    data,
    title = "",
    subtitle,
    xlabel = "",
    ylabel = ""
}) => {

    return (
        <div className="graph-panel" style={{display:"flex", flexDirection:"column", alignItems:"center", width:"100%"}}>
            <h2>{title}</h2>
            {subtitle? <h3>{subtitle}</h3> : null}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data} margin={{bottom:20, left:20, right:20}}>
                    <XAxis dataKey="date" label={{value:xlabel, position:"insideBottom", offset:-10}} />
                    <YAxis label={{value:ylabel, position:"insideLeft", angle:-90}}/>
                    <Line
                        dataKey="value"
                        dot={(props) => {
                            const { cx, cy, payload } = props;
                            const isBold = payload.highlight;
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
            </ResponsiveContainer>
        </div>)
}

export default GraphPanel