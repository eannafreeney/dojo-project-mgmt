import { useEffect, useState, useRef } from "react";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // must use useRef, otherwise useEffect will cause infinite loop
  // _query is an array and is 'different' on every function call
  const query = useRef(_query).current;
  const orderBy = useRef(_orderBy).current;

  useEffect(() => {
    // set up listener to a firestore collection
    // keep local state in sync with firebase
    let ref = projectFirestore.collection(collection);
    // if a query has been passed in as a param, add where method to search collection
    // only sfetch data that belongs to current user
    if (query) {
      ref = ref.where(...query);
    }
    if (orderBy) {
      ref = ref.orderBy(...orderBy);
    }
    // subscribe to a collection
    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        // cycle through docs in snaphot
        let results = [];
        snapshot.docs.forEach((doc) => {
          // push it into results
          results.push({ ...doc.data(), id: doc.id });
        });
        // update state to macth firestore collection
        setDocuments(results);
        setError(null);
      },
      // if error, fire this function
      (error) => {
        console.log(error);
        setError("Could not fetch the data");
      }
    );

    // unsubscribe on unmount to stop listenting
    return () => unsubscribe();
  }, [collection, query, orderBy]);

  return { documents, error };
};
