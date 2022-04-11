import { createContext, useReducer, useEffect } from "react";
import { projectAuth } from "../firebase/config";
import authReducer from "../reducers/authReducer";

export const AuthContext = createContext();

const initialState = {
  user: null,
  authIsReady: false,
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  // console.log("AuthContext state:", state);

  useEffect(() => {
    // communicate with firebase and tell us when status changes
    const unsubscribe = projectAuth.onAuthStateChanged((user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
      // unsub from listener to stop always firing
      unsubscribe();
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
