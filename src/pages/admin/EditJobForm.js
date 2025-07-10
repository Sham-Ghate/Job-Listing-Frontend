import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditJobForm = () => {
    const { id } = useParams(); // Get job ID from URL
    const navigate = useNavigate();

    const [job, setJob] = useState({
        title: "",
        company: "",
        description: "",
        skills: ""
    });

    // Fetch job data when component mounts
    useEffect(() => {
        axios.get(`http://localhost:5000/jobs/${id}`)
            .then(res => {
                const jobData = res.data;
                setJob({
                    ...jobData,
                    skills: jobData.skills.join(", ")
                });
            })
            .catch(err => console.error("Fetch job failed:", err));
    }, [id]);

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = {
            ...job,
            skills: job.skills.split(",").map(s => s.trim()).filter(Boolean)
        };

        try {
            await axios.put(`http://localhost:5000/jobs/${id}`, updatedData);
            navigate("/"); // Go back to home after successful update
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Job</h2>
            <input type="text" name="title" value={job.title} onChange={handleChange} placeholder="Title" /><br />
            <input type="text" name="company" value={job.company} onChange={handleChange} placeholder="Company" /><br />
            <input type="text" name="description" value={job.description} onChange={handleChange} placeholder="Description" /><br />
            <input type="text" name="skills" value={job.skills} onChange={handleChange} placeholder="Skills (comma-separated)" /><br />
            <button type="submit">Update Job</button>
        </form>
    );
};

export default EditJobForm;
