import React from "react";
import { RangeStepInput } from "react-range-step-input";

const Slider = ({ name, label, value, ...rest }) => {
	return (
		<div className="input-group mb-2">
			<div className="input-group-prepend">
				<label>{label}</label>
			</div>
			<RangeStepInput
				{...rest}
				value={value}
				name={name}
				id={name}
				className="form-control ml-3"
			/>
			<div className="input-group-append">
				<span className="input-group-text ml-3">{value}</span>
			</div>
			{/* {error && <div className="alert alert-danger"></div>} */}
		</div>
	);
};

export default Slider;
