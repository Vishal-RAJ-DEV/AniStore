import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navigation from './pages/Auth/Navigation';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { loadUserCart } from "./redux/features/cart/cartSlice";
import { loadUserFavorites } from "./redux/features/favorites/favoriteSlice";

const App = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Load user cart and favorites on app initialization
  useEffect(() => {
    if (userInfo) {
      dispatch(loadUserCart(userInfo._id));
      dispatch(loadUserFavorites(userInfo._id));
    }
  }, [userInfo, dispatch]);

  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
};

export default App;