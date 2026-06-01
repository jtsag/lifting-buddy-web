import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addTagToExercise, getExercise, removeTagFromExercise } from "../db_utils";
import "../styles/TagEditScreen.css";
import { useAppContext } from "../App";

interface TagEditScreenProps {

}

const TagEditScreen : React.FC<TagEditScreenProps> = ({
    
}) => {
    const {name} = useParams<{name:string}>();
    const navigate = useNavigate()
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState<string>("");
    if(!name) { navigate("/") }

    const { allTags, setAllTags } = useAppContext();

    async function refreshTags() {
        const exer = await getExercise(name!!);
        const tags = exer?.tags ?? [];
        setTags(tags);
    }

    useEffect(() => {refreshTags()}, [])

    return (
        <div id="main-container-tag-edit">
            <button onClick={() => {navigate(`/editExercise/${name}`)}}>Back</button>
            <div id="tag-row">
                {tags.map((tag) => {
                    return <button className="currentTag" onClick={async () => {
                        await removeTagFromExercise(name!!, tag)
                        await refreshTags()
                    }}>{`${tag} x`}</button>
                })}
            </div>
            <div className="divider"/>
            <div id="tag-row-2">
                {([...allTags].filter( (e) => !tags.includes(e))).map((tag) => {
                    return <button className="notTag" onClick={async () => {
                        await addTagToExercise(name!!, tag)
                        setAllTags(prev => {
                            return new Set([...prev, tag])
                        })
                        await refreshTags()
                    }}>{`${tag} +`}</button>
                })}
            </div>
            <div className="divider"/>
            <div id="new-tag-row">
                <p>New tag:</p>
                <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}/>
                <button onClick={ async () => {
                    if(newTag.trim().length > 0) {
                        await addTagToExercise(name!!, newTag)
                        setAllTags(prev => {
                            return new Set([...prev, newTag])
                        })
                        await refreshTags();
                        setNewTag("");
                    }
                }}>Submit</button>
            </div>
        </div>
    )
}

export default TagEditScreen