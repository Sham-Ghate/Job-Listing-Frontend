import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import SkillBadge from "../../components/SkillBadge";

const JobListCandidate = () => {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:5000/jobs")
            .then((res) => setJobs(res.data))
            .catch((err) => {
                console.error(err);
                setError("Failed to load job listings.");
            });
    }, []);

    return (
        <div className="job-list-candidate">
            <h2>Explore Job Opportunities</h2>

            {error && <Message type="error" text={error} />}

            {jobs.length === 0 ? (
                <p>No jobs available at the moment.</p>
            ) : (
                jobs.map((job) => (
                    <div className="job-card" key={job._id}>
                        <h3>{job.title}</h3>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p>{job.description}</p>

                        <div className="skills">
                            {job.skills.map((skill, i) => (
                                <SkillBadge key={i} skill={skill} />
                            ))}
                        </div>

                        <div className="actions">
                            <Link to={`/jobs/${job._id}`}>
                                <button>View</button>
                            </Link>
                            <Link to={`/jobs/${job._id}/apply`}>
                                <button className="ml-10">Apply Now</button>
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default JobListCandidate;