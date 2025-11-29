import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authslice";
import { useProfileMutation } from "../../redux/api/userApiSlice";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaClipboardList } from "react-icons/fa";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  //here the loadingUpdateProfile is the loading state of the profile update request and it will be true when the request is in progress and false otherwise
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch(); 

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Only include password in the payload if it's provided
      const userData = password 
        ? {
            _id: userInfo._id,
            username,
            email,
            password,
          }
        : { username, email };

      const res = await updateProfile(userData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto p-4 mt-8">
      <div className="max-w-xl mx-auto bg-[#1e1e1e] p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Profile</h2>
          <Link
            to="/user-orders"
            className="flex items-center text-[#ff6b9d] hover:underline"
          >
            <FaClipboardList className="mr-2" />
            My Orders
          </Link>
        </div>

        {loadingUpdateProfile ? (
          <Loader />
        ) : (
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="username"
                  className="w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg
                            border border-[#333] px-10 py-2
                            focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent
                            placeholder:text-[#888] transition duration-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  className="w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg
                            border border-[#333] px-10 py-2
                            focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent
                            placeholder:text-[#888] transition duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg
                            border border-[#333] px-10 py-2
                            focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent
                            placeholder:text-[#888] transition duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (optional)"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-1">Leave blank to keep current password</p>
            </div>

            <div className="mb-8">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg
                            border border-[#333] px-10 py-2
                            focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent
                            placeholder:text-[#888] transition duration-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password (optional)"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white py-3 rounded-lg font-medium hover:from-[#ff5c92] hover:to-[#ff7a99] transition duration-200 flex items-center justify-center"
              disabled={loadingUpdateProfile}
            >
              {loadingUpdateProfile ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;