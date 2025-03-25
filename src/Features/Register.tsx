import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { registerUser } from "../Features/registerSlice"; // Import registerUser
import { RootState, AppDispatch } from "../app/store"; // Import AppDispatch
import "../styles/Register.scss"; // Ensure the path is correct
import Navbar from "../components/Navbar";
import Footer from "../Pages/Footer";

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch<AppDispatch>(); // Type dispatch with AppDispatch
  const { loading, error } = useSelector((state: RootState) =>state.auth); // Use RootState
  const navigate = useNavigate(); // Initialize useNavigate

  // Debugging: Log Redux error state
  console.log("Redux Error State:", error);

  const onSubmit = async (data: any) => {
    try {
      await dispatch(registerUser(data)).unwrap(); // Use unwrap() to handle the promise
      navigate("/dashboard"); // Navigate to dashboard on success
    } catch (error: any) {
      console.error("Registration failed:", error.message || error);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="register-page">
      {/* Registration Form */}
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" {...register("username", { required: true })} />
            {errors.username && <span className="error">Username is required</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" {...register("email", { required: true })} />
            {errors.email && <span className="error">Email is required</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              {...register("password_hash", { required: true, minLength: 6 })}
            />
            {errors.password_hash && (
              <span className="error">Password must be at least 6 characters</span>
            )}
          </div>

          <div className="form-group">
            <label>County</label>
            <input type="text" {...register("county", { required: true })} />
            {errors.county && <span className="error">County is required</span>}
          </div>

          <div className="form-group">
            <label>Sub County</label>
            <input type="text" {...register("sub_county", { required: true })} />
            {errors.sub_county && <span className="error">Sub County is required</span>}
          </div>

          <div className="form-group">
            <label>Ward</label>
            <input type="text" {...register("ward", { required: true })} />
            {errors.ward && <span className="error">Ward is required</span>}
          </div>

          <div className="form-group">
            <label>Role</label>
            <select {...register("role", { required: true })}>
              <option value="citizen">Citizen</option>
            </select>
          </div>

          {/* Display Redux error safely */}
          {error && <p className="error">{typeof error === "string" ? error : "An error occurred"}</p>}

          {/* Display loading state */}
          {loading && <p>Registering...</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default Register;