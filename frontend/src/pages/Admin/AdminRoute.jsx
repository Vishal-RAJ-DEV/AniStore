import { useSelector } from "react-redux";
import { Navigate , Outlet } from "react-router-dom";

const AdminRoute = () => {
    const { userInfo } = useSelector((state) => state.auth); //getting the userInfo from the redux store

    return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" replace/>; //if user is admin then we are allowing to access the admin routes otherwise redirecting to login page
};

export default AdminRoute;