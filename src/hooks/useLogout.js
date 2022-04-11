import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    //sign the user out
    try {
      // update online status in database
      const { uid } = user;
      console.log(uid);

      // update users
      await projectFirestore
        .collection("users")
        .doc(uid)
        .update({ online: false });

      // sign out from auth
      await projectAuth.signOut();
      // dispatch logout action to make state match
      dispatch({ type: "LOGOUT" });
      // dont update state if isCancelled = true (because cleanup function in useEffect has run)
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      if (!isCancelled) {
        console.log(error.message);
        setError(error.message);
        setIsPending(false);
      }
    }
  };

  // cleanup function to be fired if we unmount component using this hook
  // cancel everything in the background
  // only update state if isCancelled = false (i.e. useEffect hasnt run)
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { logout, error, isPending };
};
