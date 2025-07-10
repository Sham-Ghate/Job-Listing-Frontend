import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Admin pages
import AddJobForm from "./pages/admin/AddJobForm";
import EditJobForm from "./pages/admin/EditJobForm";
import JobListAdmin from "./pages/admin/JobListAdmin";

// Candidate pages
import JobListCandidate from "./pages/candidate/JobListCandidate";
import JobDetailPage from "./pages/candidate/JobDetailPage";
import ApplyForm from "./pages/candidate/ApplyForm";

function App() {
  return (
    <Router>
      <Routes>

        {/* Candidate Routes */}
        <Route path="/" element={<JobListCandidate />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/jobs/:id/apply" element={<ApplyForm />} />

        {/* Admin Routes */}
        <Route path="/admin/jobs" element={<JobListAdmin />} />
        <Route path="/add" element={<AddJobForm />} />
        <Route path="/edit/:id" element={<EditJobForm />} />

      </Routes>
    </Router>
  );
}

export default App;
