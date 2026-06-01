import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { saveProgram } from "../db_utils";
import type { Program } from "../data_utils";

interface PASProps {

}

const ProgramAddScreen : React.FC<PASProps> = ({

}) => {
    const {name} = useParams<{name:string}>();
    const navigate = useNavigate()
    const [maxWeight, setMaxWeight] = useState<string>("")

    
    return (
        <div id="main-container-prog-add">
            <button onClick={() => navigate(`/editExercise/${name}`)}>Cancel</button>
            <p>Enter max: </p>
            <input type="text" value={maxWeight} onChange={(e) => setMaxWeight(e.target.value)}/>
            <button onClick={async () => {
                try {
                    const prog : Program = {exercise:name!!, max:Number(maxWeight)}
                    saveProgram(prog)
                } catch(error) {
                    console.log("Unable to save program")
                }
                navigate(`/editExercise/${name}`)
            }}>Submit</button>
        </div>
    )
}

export default ProgramAddScreen