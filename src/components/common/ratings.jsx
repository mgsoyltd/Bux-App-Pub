import React from "react";
import StarRatings from "react-star-ratings";

const Ratings = ({
	name,
	label,
	value,
	handler,
	color = "yellow",
	stars = 5,
}) => {
	return (
		<div className="form-group">
			<label htmlFor={name}>{label}&nbsp;&nbsp;&nbsp;&nbsp;</label>
			<StarRatings
				className="form-control"
				id={name}
				name={name}
				rating={value}
				starRatedColor={color}
				changeRating={handler}
				numberOfStars={stars}
				starDimension="30px"
			/>
		</div>
	);
};

export default Ratings;
