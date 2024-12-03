import React, { useState } from 'react';

const AddCourse = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        department: '',
        isOpen: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Course created successfully!');
                setFormData({ id: '', name: '', department: '', isOpen: true });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="form-container">
            <h2>Add New Course</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>ID:</label>
                    <input
                        type="number"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Department:</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="isOpen"
                            checked={formData.isOpen}
                            onChange={handleChange}
                        />
                        Is Open
                    </label>
                </div>
                <button type="submit" className="submit-btn">Add Course</button>
            </form>
        </div>
    );
};

export default AddCourse;