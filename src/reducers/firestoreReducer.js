const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { ...state, isPending: true };
    case "ADDED_DOCUMENT":
      return {
        ...state,
        document: action.payload,
        isPending: false,
        success: true,
      };
    case "ERROR":
      return {
        ...state,
        document: null,
        success: false,
        error: action.payload,
      };
    case "UPDATED_DOCUMENT":
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return {
        ...state,
        isPending: false,
        document: null,
        success: false,
        error: null,
      };
    default:
      return state;
  }
};

export default firestoreReducer;
