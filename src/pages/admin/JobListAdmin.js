import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "../../components/ConfirmModal"
import { Link } from 'react-router-dom';

const JobListAdmin = () => {
    const [jobs, setJobs] = useState([]);
    const [message, setMessage] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    // Fetch jobs on mount
    useEffect(() => {
        axios.get("http://localhost:5000/jobs")
            .then(res => setJobs(res.data))
            .catch(err => console.log(err));
    }, []);

    // Trigger modal
    const openConfirm = (id) => {
        setJobToDelete(id);
        setConfirmOpen(true);
    };

    // Handle confirmed delete
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/jobs/${jobToDelete}`);
            setJobs(prev => prev.filter(job => job._id !== jobToDelete));
            setMessage({ type: "success", text: "✅ Job deleted successfully!" });
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "❌ Failed to delete job. Try again." });
        }
        setConfirmOpen(false);
        setJobToDelete(null);
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="job-list">
            <h2>Job Listings</h2>

            {/* Message UI */}
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Job Cards */}
            {jobs.length === 0 ? (
                <p>No jobs posted yet.</p>
            ) : (
                jobs.map((job) => (
                    <div className="job-card" key={job._id}>
                        <h3>{job.title}</h3>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p>{job.description}</p>
                        <p><strong>Skills:</strong> {job.skills.join(", ")}</p>

                        <button onClick={() => openConfirm(job._id)}>
                            Delete
                        </button>
                        <Link to={`/edit/${job._id}`}>
                            <button className="ml-10">Edit</button>
                        </Link>
                        <Link to={`/jobs/${job._id}`}>
                            <button className="ml-10">View</button>
                        </Link>
                    </div>
                ))
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default JobListAdmin;