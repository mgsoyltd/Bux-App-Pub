import React, { Component } from "react";
import ImageUploader from "react-images-upload";
import strings from "../../services/textService";

/**
 * Dialog to upload image(s) from PC
 */
class ImageUpload extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pictures: [],
		};
		this.onDrop = this.onDrop.bind(this);
	}

	onDrop(picture) {
		this.setState({
			pictures: this.state.pictures.concat(picture),
		});
		// Callback for the selected array of images
		// console.log("<<<onDrop>>>", picture, this.state.pictures);
		this.props.onSelectImage(picture);
	}

	render() {
		return (
			<ImageUploader
				withIcon={true}
				buttonText={strings.choose_images}
				label={strings.formatString(strings.image_label, 5, "jpg|gif|png")}
				onChange={this.onDrop}
				imgExtension={[".jpg", ".gif", ".png"]}
				maxFileSize={5242880}
				singleImage={true}
				withPreview={true}
			/>
		);
	}
}

export default ImageUpload;
