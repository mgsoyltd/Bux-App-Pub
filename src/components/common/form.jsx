import React, { Component } from "react";

import Input from "./input";
import InputPH from "./inputPH";
import Select from "./select";
import Ratings from "./ratings";

class Form extends Component {
	state = {
		data: {},
		errors: {},
	};

	validate = () => {
		const options = { abortEarly: true, allowUnknown: true };
		const { error } = this.schema.validate(this.state.data, options);
		// console.log("<<VALIDATE>>", error);
		if (!error) return null;
		const errors = {};
		for (let item of error.details) errors[item.path[0]] = item.message;
		return errors;
	};

	validateProperty = ({ name, value }) => {
		// const obj = { [name]: value };
		const schema = this.schema.keys([name]);
		// console.log("SCHEMA", schema);
		const { error } = schema.validate(this.state.data);
		return error ? error.details[0].message : null;
	};

	handleSubmit = (e) => {
		e.preventDefault();

		const errors = this.validate();
		this.setState({ errors: errors || {} });
		if (errors) return;

		this.doSubmit();
	};

	handleChange = ({ currentTarget: input }) => {
		// const errors = { ...this.state.errors };
		const errors = {};
		// const errorMessage = this.validateProperty(input);
		// if (errorMessage) errors[input.name] = errorMessage;
		// else delete errors[input.name];

		const data = { ...this.state.data };
		data[input.name] = input.value;

		this.setState({ data, errors });
	};

	handleRatings = (newRating, name) => {
		const errors = { ...this.state.errors };
		const data = { ...this.state.data };
		data[name] = newRating;
		this.setState({ data, errors });
	};

	renderButton(label, className = "btn btn-primary") {
		return (
			<button disabled={this.validate()} className={className}>
				{label}
			</button>
		);
	}

	renderFreeButton(label, handler, className = "btn btn-secondary") {
		return (
			<button className={className} onclick={handler}>
				{label}
			</button>
		);
	}

	renderInputNumber(name, label, type = "number") {
		const { data, errors } = this.state;
		return (
			<Input
				type={type}
				name={name}
				label={label}
				value={data[name]}
				onChange={this.handleChange}
				error={errors[name]}
			/>
		);
	}

	renderInputRange(
		name,
		label,
		type = "number",
		min = "0",
		max = "10",
		step = "1"
	) {
		const { data, errors } = this.state;
		return (
			<Input
				type={type}
				name={name}
				label={label}
				value={data[name]}
				onChange={this.handleChange}
				error={errors[name]}
				min={min}
				max={max}
				step={step}
			/>
		);
	}

	renderInput(name, label, type = "text") {
		const { data, errors } = this.state;
		return (
			<Input
				type={type}
				name={name}
				label={label}
				value={data[name]}
				onChange={this.handleChange}
				error={errors[name]}
			/>
		);
	}

	renderInputPH(name, label, focus, type = "text", ...rest) {
		const { data, errors } = this.state;
		return (
			<InputPH
				{...rest}
				type={type}
				name={name}
				label={label}
				value={data[name]}
				autoFocus={focus}
				onChange={this.handleChange}
				error={errors[name]}
			/>
		);
	}

	renderOutput(name, label, type = "text") {
		const { data } = this.state;
		return (
			<Input
				type={type}
				name={name}
				label={label}
				value={data[name]}
				readonly
			/>
		);
	}

	renderSelect(name, label, options) {
		const { data, errors } = this.state;
		return (
			<Select
				name={name}
				value={data[name]}
				label={label}
				options={options}
				onChange={this.handleChange}
				error={errors[name]}
			/>
		);
	}

	renderRating(name, label, color = "blue") {
		const { data } = this.state;
		return (
			<Ratings
				name={name}
				label={label}
				value={data[name]}
				handler={this.handleRatings}
				color={color}
			/>
		);
	}
}

export default Form;
