import { useNavigate } from "react-router-dom"
import DropdownMenu from "./DropdownMenu"
import "../styles/EditOptionMenu.css"

interface EditOptionMenuProps {
    options:Record<string, string> // name -> route
}

const EditOptionMenu : React.FC<EditOptionMenuProps> = ({
    options
}) => {

    const navigate = useNavigate()

    const trigger = <p>{"\u2630"}</p>
    const children = Object.entries(options).map(([key, value]) => {
        return <div key={key} className="option-item" onClick={() => navigate(value)}><p>{key}</p></div>
    })

    return <DropdownMenu trigger={trigger} children={children}/>
}

export default EditOptionMenu