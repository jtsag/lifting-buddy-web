import DropdownMenu from "./DropdownMenu";
import '../styles/CheckboxDropdownMenu.css'

interface CDMProps {
    tags:Set<string>;
    selectedFilters:Set<string>;
    setSelectedFilters:React.Dispatch<React.SetStateAction<Set<string>>>;
}

const CheckboxDropdownMenu:React.FC<CDMProps> = ({
    tags, 
    selectedFilters, 
    setSelectedFilters
}) => {

    const trigger = (
        <p><b>{"\u25BC"}</b>{selectedFilters.size === 0? "" : ` (${selectedFilters.size} selected)`}</p>
    )

    const children = [...tags].map((item) => {

        function onCheckedChange() {
            setSelectedFilters(prev => {
                const next = new Set(prev);
                next.has(item) ? next.delete(item) : next.add(item);
                return next;
            });
        }

        return <div className= "menu-item-container">
            <input type="checkbox" checked={selectedFilters.has(item)} onChange={() => onCheckedChange()}/>
            <p>{item}</p>
        </div>
    })

    const clearElement = <div id="clear-element">
        <p onClick={ () => {
            setSelectedFilters(new Set())
        }}>Clear</p>
    </div>

    return <DropdownMenu trigger={trigger} children={<div>{clearElement} {children}</div>}/>
}

export default CheckboxDropdownMenu