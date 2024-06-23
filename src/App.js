import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Authentication from './auth/Authentication';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Authentication />} />
      </Routes>
    </Router>
  )
}

export default App