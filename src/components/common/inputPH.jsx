import React from "react";

// Input with placeholder
const InputPH = ({ name, label, error, ...rest }) => {
	return (
		<div>
			<label htmlFor={name} className="visually-hidden">
				{label}
			</label>
			<input
				{...rest}
				name={name}
				id={name}
				className="form-control"
				placeholder={label}
			/>
			{error && <div className="alert alert-danger">{error}</div>}
		</div>
	);
};

export default InputPH;
