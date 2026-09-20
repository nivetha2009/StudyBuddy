import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Tutor from './pages/Tutor.jsx';
import Materials from './pages/Materials.jsx';
import Notes from './pages/Notes.jsx';
import McqGenerator from './pages/McqGenerator.jsx';
import Flashcards from './pages/Flashcards.jsx';
import Quiz from './pages/Quiz.jsx';
import ExamPrep from './pages/ExamPrep.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/mcqs" element={<McqGenerator />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/exam-prep" element={<ExamPrep />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
