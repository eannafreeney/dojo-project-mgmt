import { useState } from "react";
import { useRegister } from "../../hooks/useRegister";

// styles
import "./register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  // error state
  const [thumbnailError, setThumbnailError] = useState(null);

  // destructure methods + variables from hook
  const { register, isPending, error } = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(email, password, displayName, thumbnail);
  };

  const handleFileChange = (e) => {
    setThumbnail(null);
    let selected = e.target.files[0];

    // check for errors
    if (!selected) {
      setThumbnailError("No image selected");
      return;
    }
    if (!selected.type.includes("image")) {
      setThumbnailError("Must be an image file");
      return;
    }
    if (selected.size > 100000) {
      setThumbnailError("Image must be less than 100kb");
      return;
    }

    // reset error
    setThumbnailError(null);
    setThumbnail(selected);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>register</h2>
      <label>
        <span>display name:</span>
        <input
          type="text"
          required
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>
      <label>
        <span>email:</span>
        <input
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        <span>password:</span>
        <input
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      <label>
        <span>thumbnail:</span>
        <input type="file" required onChange={handleFileChange} />
        {thumbnailError && <div className="error">{thumbnailError}</div>}
      </label>
      {!isPending && <button className="btn">Register</button>}
      {isPending && (
        <button className="btn" disabled>
          Loading
        </button>
      )}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
