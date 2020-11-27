import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./review.css";
import RenderStarRating from "./rating/renderStarRating";

export default function Review({
	comentario,
	puntaje,
	user,
	userId,
	getReviews,
	productId,
	id,
}) {
	const userLogin = useSelector((store) => store.userState.userLogin);

	const deleteReview = async (productId, reviewId) => {
		await axios.delete(
			`http://localhost:3001/reviews/${reviewId}/product/${productId}`,
			{ withCredentials: true }
		);
		getReviews();
	};

	return (
		<div className="review-content">
			<div className="comment-header">
				<div className="comment-rate">
					<p id="user">{user}</p>
					<RenderStarRating size="small" puntaje={puntaje} />
				</div>
				{userLogin.isAdmin ? (
					<button
						className="btn eliminar"
						onClick={() => deleteReview(productId, id)}
					>
						<FontAwesomeIcon icon={faMinusSquare} />
					</button>
				) : (
					userId === userLogin.id && (
						<a className="btn eliminar" onClick={() => deleteReview(productId, id)}>
							<FontAwesomeIcon icon={faMinusSquare} />
						</a>
					)
				)}
			</div>
			<p id="comentario">
				<i>"{comentario}"</i>
			</p>
		</div>
	);
}
