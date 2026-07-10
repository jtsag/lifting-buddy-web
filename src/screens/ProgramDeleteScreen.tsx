import { useNavigate, useParams } from "react-router-dom";
import { deleteProgram } from "../db_utils_v2";

interface PDSProps {

}

const ProgramDeleteScreen : React.FC<PDSProps> = ({

}) => {
    const {name} = useParams<{name:string}>();
    const navigate = useNavigate()
    
    return (
        <div id="main-container-prog-del">
            <p>Are you sure you want to delete the current program?</p>
            <div id="selection-row">
                <button onClick={() => navigate(`/editExercise/${name}`)}>No</button>
                <button onClick={async () => {deleteProgram(name!!); navigate(`/editExercise/${name}`)}}>Yes</button>
            </div>
        </div>
    )
}

export default ProgramDeleteScreen