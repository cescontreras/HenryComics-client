import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import RenderStarRating from "./rating/renderStarRating";
import StarRating from "./rating/rating";
import Review from "./review";
import "./reviewsBox.css";

export default function ReviewBox({
	productId,
	nestedModal,
	toggleNested,
	closeAll,
	toggle,
	rating,
	setRating,
}) {
	const [reviews, setReviews] = useState([]);
	const [review, setReview] = useState({
		comentarios: "",
		puntaje: 0,
	});

	const user = useSelector((store) => store.userState.userLogin);

	let history = useHistory();

	useEffect(() => {
		getReviews();
	}, []);

	useEffect(() => {
		setRating(getProductRating());
	}, [reviews]);

	const handleInputChange = (e) => {
		setReview({
			...review,
			[e.target.name]: e.target.value,
		});
	};

	const postReview = async () => {
		try {
			if (user.id) {
				await axios.post(
					`http://localhost:3001/reviews/${productId}/user/${user.id}`,
					review,
					{ withCredentials: true }
				);
				setReview({
					comentarios: "",
					puntaje: 0,
				});
				getReviews();
			} else {
				alert("Para comentar debe loguearse");
				history.push("/login");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getReviews = async () => {
		try {
			const {
				data,
			} = await axios.get(`http://localhost:3001/products/${productId}/review`, {
				withCredentials: true,
			});
			setReviews(data);
		} catch (err) {
			console.log(err);
		}
	};

	const getProductRating = () => {
		let sum = reviews.reduce(
			function (acc, rev) {
				return { puntaje: acc.puntaje + rev.puntaje };
			},
			{ puntaje: 0 }
		);

		return sum.puntaje / reviews.length || 0;
	};

	const onSubmit = () => {
		postReview();
	};

	return (
		<Modal
			isOpen={nestedModal}
			toggle={toggleNested}
			onClosed={closeAll ? toggle : undefined}
			className="modal-lg review-box"
			contentClassName="review-box-content"
		>
			<ModalHeader toggle={toggleNested}>
				<div className="reviews">
					<div>Opiniones sobre el producto</div>
					<div className="rating-box">
						<h1> {rating.toFixed(1)} </h1>{" "}
						<RenderStarRating puntaje={rating} size="medium" />
					</div>
				</div>
			</ModalHeader>
			<ModalBody contentClassName="form-review">
				<div className="allReviews">
					{reviews[0] &&
						reviews.map((r, i) => (
							<Review
								comentario={r.comentarios}
								puntaje={r.puntaje}
								id={r.id}
								user={r.user.email}
								userId={r.user.id}
								getReviews={getReviews}
								productId={productId}
								key={i}
							/>
						))}
				</div>
				<ModalFooter>
					<textarea
						id="text-comment"
						className="form-control"
						name="comentarios"
						placeholder="Ingrese Comentario"
						value={review.comentarios}
						onChange={handleInputChange}
					/>
					<div className="function">
						<StarRating
							handleInputChange={handleInputChange}
							valueInicial={review.puntaje}
						/>
						<Button color="danger" onClick={onSubmit}>
							Enviar
						</Button>
					</div>
				</ModalFooter>
			</ModalBody>
		</Modal>
	);
}
