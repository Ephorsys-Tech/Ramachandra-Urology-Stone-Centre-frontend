import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuthSession } from "./redux/features/auth/authThunk";
import AppRoutes from "./routes";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Automatically restore session using httpOnly refresh token cookie
    dispatch(checkAuthSession());
  }, [dispatch]);

  return (
    <div>
      <AppRoutes />
    </div>
  );
};

export default App;