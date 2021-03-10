import React, { Component } from "react";
import Joi from "joi-browser";

// import Output from "./output";
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
		const options = { abortEarly: false };
		const { error } = Joi.validate(this.state.data, this.schema, options);
		if (!error) return null;
		const errors = {};
		for (let item of error.details) errors[item.path[0]] = item.message;
		console.log("<<<ERRORS>>>", errors);
		return errors;
	};

	validateProperty = ({ name, value }) => {
		const obj = { [name]: value };
		const schema = { [name]: this.schema[name] };
		const { error } = Joi.validate(obj, schema);
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
		const errors = { ...this.state.errors };
		const errorMessage = this.validateProperty(input);
		if (errorMessage) errors[input.name] = errorMessage;
		else delete errors[input.name];

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

	renderFreeButton(label, className = "btn btn-primary") {
		return <button className={className}>{label}</button>;
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