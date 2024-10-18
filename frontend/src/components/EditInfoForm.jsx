// EditInfoForm.jsx
import React, { useState } from 'react';

const EditInfoForm = ({ user, onUpdate }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedInfo = { username, email };

    // Make API call to update user information
    try {
      const response = await fetch('/api/update_user_info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInfo),
      });

      if (response.ok) {
        onUpdate(updatedInfo); // Call the onUpdate function to update state in the parent component
        alert('Information updated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update information');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditInfoForm;
