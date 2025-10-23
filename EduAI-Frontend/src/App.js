import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LearningStylePredictor from "./components/LearnStylePredictor/LearnStylePredictor";
import RegistrationForm from './components/RegisterForm/RegistrationForm';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/learn" element={<LearningStylePredictor />} />
        <Route path='/register' element={<RegistrationForm/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
