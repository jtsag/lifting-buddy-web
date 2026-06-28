import { useState } from 'react'
import '../styles/NewExerciseScreen.css'
// import '../db_utils_v2.ts'
import { saveExercise } from '../db_utils_v2.ts'
import { useNavigate } from 'react-router-dom'

interface NewExerciseProps {

}

const NewExerciseScreen:React.FC<NewExerciseProps> = ({

}) => {

    const [name, setName] = useState<string>("")
    const navigate = useNavigate();

    return (
    <div id="main-container-new-ex">
        <div id="title">
            <h1>NEW EXERCISE</h1>
        </div>

        <div id="add-row-new-ex">
            <p>Name of exercise: </p>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
            <button onClick={async () => {saveExercise({name:name, tags:[]}); navigate('/')}}>Submit</button>
        </div>
    </div>
    )
}

export default NewExerciseScreen