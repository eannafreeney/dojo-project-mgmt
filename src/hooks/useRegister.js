import { useState, useEffect } from "react";
import {
  projectAuth,
  projectStorage,
  projectFirestore,
} from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useRegister = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const register = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      // register user
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      // if no response comes back, throw error
      if (!res) {
        throw new Error("Could not complete registration");
      }

      // upload user thumbnail + get link to it
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      const thumbnailImg = await projectStorage.ref(uploadPath).put(thumbnail);
      const thumbnailImgURL = await thumbnailImg.ref.getDownloadURL();

      // add displayName to registered user
      await res.user.updateProfile({
        displayName: displayName,
        photoURL: thumbnailImgURL,
      });

      // create a user doc with user id as name, and set data
      await projectFirestore.collection("users").doc(res.user.uid).set({
        online: true,
        displayName: displayName,
        photoURL: thumbnailImgURL,
      });

      // dispatch login action
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

  return { error, isPending, register };
};
