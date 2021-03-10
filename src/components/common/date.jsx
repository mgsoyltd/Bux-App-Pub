const FormatDate = ({ date }) => {
	const newdate = new Date(date);
	var date_format_str =
		(newdate.getDate().toString().length === 2
			? newdate.getDate().toString()
			: "0" + newdate.getDate().toString()) +
		"." +
		((newdate.getMonth() + 1).toString().length === 2
			? (newdate.getMonth() + 1).toString()
			: "0" + (newdate.getMonth() + 1).toString()) +
		"." +
		newdate.getFullYear().toString() +
		" " +
		(newdate.getHours().toString().length === 2
			? newdate.getHours().toString()
			: "0" + newdate.getHours().toString()) +
		":" +
		(parseInt(newdate.getMinutes()).toString().length === 2
			? parseInt(newdate.getMinutes()).toString()
			: "0" + parseInt(newdate.getMinutes()).toString()) +
		":" +
		(parseInt(newdate.getSeconds()).toString().length === 2
			? parseInt(newdate.getMinutes()).toString()
			: "0" + parseInt(newdate.getMinutes()).toString());

	console.log(date, newdate, date_format_str);
	return <div className="form-group">{date_format_str}</div>;
};

export default FormatDate;
