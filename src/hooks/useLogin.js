import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const loginUser = async (email, password) => {
    setError(null);
    setIsPending(true);

    //sign the user out
    try {
      const res = await projectAuth.signInWithEmailAndPassword(email, password);
      // update online status onec user is logged in
      await projectFirestore
        .collection("users")
        .doc(res.user.uid)
        .update({ online: true });
      // dispatch login action to make state match
      dispatch({ type: "LOGIN", payload: res.user });
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

  return { loginUser, error, isPending };
};
