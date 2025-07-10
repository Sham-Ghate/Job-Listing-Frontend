import React, { useState } from "react";
import axios from "axios";
import "../styles/applyForm.css";

const ApplyForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        linkedIn: "",
        portfolio: "",
        experience: "",
        expectedSalary: "",
        availability: "Immediately",
        coverLetter: "",
        additionalNotes: "",
    });

    const [resume, setResume] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const availabilityOptions = ["Immediately", "1 Week", "2 Weeks", "1 Month"];

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Sanitize phone input
        if (name === "phone") {
            const onlyDigits = value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: onlyDigits }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setErrors(prev => ({ ...prev, resume: "Only PDF files are accepted." }));
            setResume(null);
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, resume: "File size must be less than 2MB." }));
            setResume(null);
            return;
        }

        setResume(file);
        setErrors(prev => ({ ...prev, resume: null }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format.";

        if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits.";

        if (!formData.experience) newErrors.experience = "Experience is required.";
        if (!resume) newErrors.resume = "Resume is required.";

        return newErrors;
    };

    const isFormValid = () => {
        const requiredFields = [
            formData.fullName,
            formData.email,
            formData.phone,
            formData.experience,
            resume
        ];
        return requiredFields.every(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);

        try {
            const form = new FormData();
            Object.keys(formData).forEach(key => form.append(key, formData[key]));
            form.append("resume", resume);

            await axios.post("http://localhost:5000/applications", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSubmitStatus({ type: "success", message: "🎉 Application submitted successfully!" });

            // Reset form
            setFormData({
                fullName: "", email: "", phone: "", linkedIn: "", portfolio: "",
                experience: "", expectedSalary: "", availability: "Immediately",
                coverLetter: "", additionalNotes: ""
            });
            setResume(null);
            setErrors({});
        } catch (err) {
            console.error(err);
            setSubmitStatus({ type: "error", message: "❌ Submission failed. Try again later." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="apply-form" onSubmit={handleSubmit}>
            <h2>Apply for this Job</h2>

            <input type="text" name="fullName" placeholder="Full Name *" value={formData.fullName} onChange={handleChange} />
            {errors.fullName && <p className="error">{errors.fullName}</p>}

            <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}

            <input type="text" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} />
            {errors.phone && <p className="error">{errors.phone}</p>}

            <input type="url" name="linkedIn" placeholder="LinkedIn Profile" value={formData.linkedIn} onChange={handleChange} />
            <input type="url" name="portfolio" placeholder="Portfolio / GitHub" value={formData.portfolio} onChange={handleChange} />

            <input type="number" name="experience" placeholder="Years of Experience *" value={formData.experience} onChange={handleChange} />
            {errors.experience && <p className="error">{errors.experience}</p>}

            <input type="number" name="expectedSalary" placeholder="Expected Salary (₹)" value={formData.expectedSalary} onChange={handleChange} />

            <select name="availability" value={formData.availability} onChange={handleChange}>
                {availabilityOptions.map(option => <option key={option}>{option}</option>)}
            </select>

            <textarea name="coverLetter" placeholder="Cover Letter (Optional)" value={formData.coverLetter} onChange={handleChange} />
            <textarea name="additionalNotes" placeholder="Additional Notes" value={formData.additionalNotes} onChange={handleChange} />

            <input type="file" accept=".pdf" onChange={handleFileChange} />
            {resume && <p className="file-name">Selected file: {resume.name}</p>}
            {errors.resume && <p className="error">{errors.resume}</p>}

            <button type="submit" disabled={submitting || !isFormValid()}>
                {submitting ? "Submitting..." : "Submit Application"}
            </button>

            {submitStatus && (
                <p className={submitStatus.type === "success" ? "success" : "error"}>
                    {submitStatus.message}
                </p>
            )}
        </form>
    );
};

export default ApplyForm;