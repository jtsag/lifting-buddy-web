import '../styles/Home.css'
import CheckboxDropdownMenu from '../panels/CheckboxDropdownMenu'
import ExerciseEntryDisplay from '../panels/ExerciseEntryDisplay';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllExercises } from '../db_utils';
import { type Exercise } from '../data_utils';

interface HomeScreenProps {
    appName:string;
    allTags:Set<string>;
}

function isIncludedInFilter(name:Exercise, filter:Set<string>) {
    for(const tag of filter) {
        if(name.tags.includes(tag)) {
            return true
        }
    }
    return false
}

const Home:React.FC<HomeScreenProps> = ({
    appName,
    allTags
}) => {
    const navigate = useNavigate()
    const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
    const [allExercises, setExerciseList] = useState<Exercise[]>([])
    
    useEffect(() => {
        async function load() {
            const all = await getAllExercises();
            setExerciseList(all);
        }
        load();
    }, [])

    return (
    <div id="main-container">
        <div id="title-bar">
            <div style={{flex:0.25}}/>
            <h1 id="title">{appName.toUpperCase()}</h1>
            <div style={{flex:0.25}}>
                <CheckboxDropdownMenu 
                    tags={allTags} 
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                />
            </div>
        </div>

        <div id="exercise-list">
            {allExercises.map((exer) => {
                const disp = selectedFilters.size === 0 || isIncludedInFilter(exer, selectedFilters)
                return disp ? <ExerciseEntryDisplay name={exer.name}/> : null
            })}
        </div>

        <div id="add-exercise-row">
            <button id="add-exercise-button" onClick={() => {navigate('/newExercise')}}>Add Exercise</button>
        </div>
    </div>
    )
}

export default Home