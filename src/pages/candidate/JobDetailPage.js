import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Message from "../../components/Message";
import "../styles/jobDetailPage.css";

const JobDetailPage = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/jobs/${id}`)
            .then(res => setJob(res.data))
            .catch(err => {
                console.error(err);
                setError("❌ Job not found or server error.");
            });
    }, [id]);

    if (error) return <Message type="error" text={error} />;
    if (!job) return <p className="loading-text">Loading job details...</p>;

    return (
        <div className="job-detail-container">
            <h1 className="job-title">{job.title}</h1>
            <p className="job-company">{job.company}</p>

            {job.logo && (
                <div className="company-logo-wrapper">
                    <img src={job.logo} alt="Company Logo" className="company-logo" />
                </div>
            )}

            <div className="job-meta">
                <span><strong>Type:</strong> {job.jobType || "Full-Time"}</span>
                <span><strong>Location:</strong> {job.location || "Remote"}</span>
                <span><strong>Salary:</strong> ₹{job.salaryRange || "Not Disclosed"}</span>
                <span><strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}</span>
                <span><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : "Not Specified"}</span>
            </div>

            <div className="job-section">
                <h3>Job Description</h3>
                <p>{job.description}</p>
            </div>

            <div className="job-section">
                <h3>Key Responsibilities</h3>
                <ul>
                    {(job.responsibilities || []).map((r, idx) => (
                        <li key={idx}>{r}</li>
                    ))}
                </ul>
            </div>

            <div className="job-section">
                <h3>Required Skills</h3>
                <div className="skills-container">
                    {job.skills.map((skill, idx) => (
                        <span key={idx} className="skill-badge">{skill}</span>
                    ))}
                </div>
            </div>

            <div className="job-section">
                <h3>Qualifications</h3>
                <ul>
                    {(job.qualifications || []).map((q, idx) => (
                        <li key={idx}>{q}</li>
                    ))}
                </ul>
            </div>

            <div className="job-section">
                <h3>Perks & Benefits</h3>
                <ul>
                    {(job.benefits || []).map((b, idx) => (
                        <li key={idx}>{b}</li>
                    ))}
                </ul>
            </div>

            <div className="apply-button-container">
                <Link to={`/jobs/${id}/apply`}>
                    <button className="apply-button">Apply Now</button>
                </Link>
            </div>
        </div>
    );
};

export default JobDetailPage;