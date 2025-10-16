import { SearchBox } from "@mapbox/search-js-react"
import { useState } from "react"

const SearchBoxComponent = ({accessToken, proximity}) => {
  const [value, setValue] = useState('')

  const handleChange = (d) => {
    setValue(d);
  };

  return (
    <SearchBox
      options={{
        proximity: proximity,
      }}
      value={value}
      onChange={handleChange}
      accessToken={accessToken}
    />
  );
}

export default SearchBoxComponent