import React, { useState } from "react";
import ImageUpload from "./common/imageUpload";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import strings from "../services/textService";

const UploadImage = (state) => {
	const [show, setShow] = useState(false);

	const handleShow = () => setShow(true);

	const handleCancel = () => {
		setShow(false);
		selectedImages([]);
	};

	const handleUseImage = () => {
		setShow(false);
	};

	const selectedImages = (images) => {
		// console.log(state.data);
		// console.log("<<<selectedImages>>>", images);
		if (images.length === 0) {
			state.data.imageData = null;
			toast.success(strings.image_cancelled);
		} else {
			state.data.imageData = images[0];
			toast.success(strings.image_selected);
		}
	};

	return (
		<>
			<Button variant="secondary" onClick={handleShow}>
				{strings.upload_image}
			</Button>

			<Modal
				show={show}
				onHide={handleCancel}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title>{strings.upload_image}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ImageUpload onSelectImage={selectedImages} />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCancel}>
						{strings.cancel}
					</Button>
					<Button variant="primary" onClick={handleUseImage}>
						{strings.use_image}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default UploadImage;
