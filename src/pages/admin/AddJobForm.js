import { useState, useEffect } from "react";
import axios from "axios";

const JobForm = () => {
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [description, setDescription] = useState("");
    const [skills, setSkills] = useState("");
    const [message, setMessage] = useState(null);

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const trimmedSkills = skills
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

        setIsFormValid(
            title.trim() !== "" &&
            company.trim() !== "" &&
            description.trim() !== "" &&
            trimmedSkills.length > 0
        );
    }, [title, company, description, skills]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const skillArray = skills
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

        try {
            const response = await axios.post("http://localhost:5000/jobs", {
                title,
                company,
                description,
                skills: skillArray,
            });
            setMessage("✅ Job added successfully!");
            setTitle("");
            setCompany("");
            setDescription("");
            setSkills("");
        } catch (err) {
            console.error("Error adding job:", err);
            setMessage("❌ Failed to add job.");
        }

        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="job-form">
            <h2>Add Job</h2>

            {message && <div className="message">{message}</div>}

            <input
                type="text"
                placeholder="Job Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />

            <input
                type="text"
                placeholder="Company"
                value={company}
                onChange={e => setCompany(e.target.value)}
            />

            <textarea
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />

            <input
                type="text"
                placeholder="Skills (comma separated)"
                value={skills}
                onChange={e => setSkills(e.target.value)}
            />

            <button type="submit" disabled={!isFormValid}>
                Submit
            </button>
        </form>
    );
};

export default JobForm;