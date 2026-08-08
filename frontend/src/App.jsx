import { Routes, Route } from 'react-router';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>Hello world</h1>} />
    </Routes>
  );
};

export default App;
