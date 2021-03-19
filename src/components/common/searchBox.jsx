import React from "react";
import strings from "../../services/textService";

const SearchBox = ({ value, onChange }) => {
	return (
		<input
			type="text"
			name="query"
			className="form-control my-3"
			placeholder={strings.search}
			value={value}
			onChange={(e) => onChange(e.currentTarget.value)}
		/>
	);
};

export default SearchBox;
