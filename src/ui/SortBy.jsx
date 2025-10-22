import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options, defaultOption }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") || defaultOption.value;

  function handleChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      value={sortBy}
      type="white"
      onChange={handleChange}
    ></Select>
  );
}

export default SortBy;
