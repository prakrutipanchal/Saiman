import React, { useState } from "react";
import supabase from "../../supabaseClient";

const AdminInterface = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    
    if (!role) {
      setMessage("Please select a valid role.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("email", email)
        .single();

      if (error) {
        setMessage("Error: User Not Found!!");
        console.log(error);
        return;
      }

      console.log("User data fetched:", data);

      if (data) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: role })
          .eq("email", email);

        if (updateError) {
          setMessage("Error updating role!");
          console.error(updateError);
        } else {
          setMessage(`User's role updated to ${role}`);
        }
      } else {
        setMessage("User Not Found!!");
      }
    } catch (error) {
      console.log(error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Admin Role Assignment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select Role</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Assigning..." : "Assign Role"}
          </button>
        </div>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminInterface;
