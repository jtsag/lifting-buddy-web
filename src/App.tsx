import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './styles/App.css'
import Home from './screens/Home.tsx'
import NewExerciseScreen from './screens/NewExerciseScreen.tsx';
import EditScreen from './screens/EditScreen.tsx';
import TagEditScreen from './screens/TagEditScreen.tsx';
import ProgramAddScreen from './screens/ProgramAddScreen.tsx';
import ProgramDeleteScreen from './screens/ProgramDeleteScreen.tsx';
import { useEffect, useState, createContext, useContext } from 'react';
import { getAllExercises } from './db_utils.ts';
import { dataCleanup } from './data_utils.ts';

interface AppContextType {
  allTags : Set<string>;
  setAllTags : React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => useContext(AppContext)!;

function App() {

  const [allTags, setAllTags] = useState<Set<string>>(new Set(["Favorite"]))

  useEffect(() => {
    async function loadTags() {
        const exerList = await getAllExercises();
        var tags = new Set(allTags);
        for(const exer of exerList) {
          tags = new Set([...allTags, ...exer.tags])
        }
        setAllTags(tags)
    }
    loadTags();
  }, [])

  useEffect(() => {dataCleanup()}, []) // Fire once to clean up the local database in background

  return (
    <AppContext.Provider value={{allTags, setAllTags}}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home appName='Lifting Buddy' allTags={allTags}/>}/>
          <Route path='/newExercise' element={<NewExerciseScreen/>}/>
          <Route path='/editExercise/:name' element={<EditScreen/>}/>
          <Route path='/tagEdit/:name' element={<TagEditScreen/>}/>
          <Route path='/programAdd/:name' element={<ProgramAddScreen />}/>
          <Route path='/programDelete/:name' element={<ProgramDeleteScreen/>}/>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App
