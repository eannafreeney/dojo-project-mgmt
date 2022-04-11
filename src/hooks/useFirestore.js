import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";
import firestoreReducer from "../reducers/firestoreReducer";

const initialState = {
  document: null,
  isPending: null,
  error: null,
  success: null,
};

export const useFirestore = (collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // reference to firestore collection
  const ref = projectFirestore.collection(collection);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document to firestore
  const addDocumentToFirestore = async (doc) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const createdAt = timestamp.fromDate(new Date());
      const addedDoc = await ref.add({ ...doc, createdAt });
      dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: addedDoc });
    } catch (error) {
      dispatchIfNotCancelled({ type: "ERROR", payload: error.message });
    }
  };

  // update documents in firestore
  const updateDocument = async (id, updates) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const updateDocument = await ref.doc(id).update(updates);
      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updateDocument,
      });
      return updateDocument;
    } catch (error) {
      dispatchIfNotCancelled({ type: "ERROR", payload: error.message });
      return null;
    }
  };

  // delete doc
  const deleteDocumentFromFirestore = async (id) => {
    dispatch({ type: "IS_PENDING" });
    try {
      await ref.doc(id).delete();
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
    } catch (error) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could no delete" });
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return {
    addDocumentToFirestore,
    updateDocument,
    deleteDocumentFromFirestore,
    response,
  };
};
