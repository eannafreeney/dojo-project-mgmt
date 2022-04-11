const filterList = [
  "all",
  "mine",
  "development",
  "design",
  "marketing",
  "sales",
];

export default function ProjectFilter({ currentFilter, changeFilter }) {
  const handleChange = (newFilter) => {
    changeFilter(newFilter);
  };

  return (
    <div className="project-filter">
      <nav>
        <p>Filter:</p>
        {filterList.map((f) => {
          return (
            <button
              key={f}
              onClick={() => handleChange(f)}
              className={currentFilter === f ? "active" : ""}
            >
              {f}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
