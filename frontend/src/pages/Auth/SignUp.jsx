import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apipaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  //Handle SignUp Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = '';

    if (!profilePic) {
      setError("Please upload a profile photo.");
      return;
    }

    if (!fullName) {
      setError("Please enter Full Name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    // SignUp API Call 
    try {

      // Upload profile image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        // Removed adminInvitetoken
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // Redirect based on role 
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }

  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-8 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black pt-5">Create an Account </h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-3">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <span className='flex flex-col justify-center  text-center mb-2'>
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            <span className="text-sm text-gray-700 mt-1">Upload Profile Photo <span className="text-red-500">*</span></span>
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 text-black gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John Dude"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
              required
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
              required
            />

            <Input
              value={confirmPassword}
              onChange={({ target }) => setConfirmPassword(target.value)}
              label="Confirm Password"
              placeholder="Re-enter your password"
              type="password"
              required
            />

          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <button
            type="submit"
            className="btn-primary mt-2"
            disabled={!profilePic}
            title={!profilePic ? "Please upload a profile photo to continue" : ""}
          >
            SIGN UP
          </button>

          <p className="text-[15px] text-slate-800 mt-3">
            Have an account?{" "}
            <Link className="font-semibold text-blue-500 underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp