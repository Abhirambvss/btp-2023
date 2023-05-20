// import ProtectedRoute from './components/protectedRoute'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Graph from "./components/graph";
import InsertTextFile from "./components/insertTextFile";
import TestCases from "./components/generateTestCases";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InsertTextFile />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/testcases" element={<TestCases />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
