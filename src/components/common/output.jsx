import React from "react";

const Output = ({ name, label, error, ...rest }) => {
	return (
		<div className="form-group">
			<label for={name}>{label}</label>
			<output {...rest} name={name} id={name} className="form-control" />
		</div>
	);
};

export default Output;
