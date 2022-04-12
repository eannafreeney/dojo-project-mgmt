// styles
import "./avatar.css";

export default function Avatar({ src, name }) {
  const showName = (name) => {
    console.log(name);
  };

  return (
    <div className="avatar">
      <img src={src} alt="user avatar" onMouseOver={() => showName(name)} />
    </div>
  );
}
