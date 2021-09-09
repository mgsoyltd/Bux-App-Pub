import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import RangeSlider from "react-bootstrap-range-slider";
import Input from "./input";

const Slider = ({ name, label, value, onChange, error, ...rest }) => {
	return (
		<div className="input-group mb-2">
			<div className="input-group-prepend">
				<label>{label}</label>
			</div>
			<RangeSlider
				{...rest}
				value={value}
				name={name}
				id={name}
				className="form-control ml-3"
				onChange={onChange}
			/>
			<div className="input-group-append ml-4">
				<span>
					<Input type="text" name={name} value={value} onChange={onChange} />
				</span>
			</div>
			{error && <div className="alert alert-danger"></div>}
		</div>
	);
};

export default Slider;
