import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import ReviewBox from "./reviews/reviewsBox";
import "./product.css";

export default function Product(props) {
	const [nestedModal, setNestedModal] = useState(false);
	const [closeAll, setCloseAll] = useState(false);
	const [rating, setRating] = useState(0);
	const toggleNested = () => {
		setNestedModal(!nestedModal);
		setCloseAll(false);
	};
	const toggleAll = () => {
		setNestedModal(!nestedModal);
		setCloseAll(true);
	};

	let { modal, toggle, p, capitalize, addCart, cart } = props;

	const handleAdd = (e) => {
		toggle();
		addCart(e);
	};

	return (
		<Modal
			isOpen={modal}
			toggle={toggle}
			className="gral-content"
			contentClassName="content-title"
		>
			<ModalHeader toggle={toggle} id="header-product" className="box-title">
				<h2 className="title">{p.name}</h2>
			</ModalHeader>
			<ModalBody>
				<div className="content-body">
					<div className="content-img">
						<img src={p.image} className="img-body" />
					</div>
					<div className="data-body">
						<label className="info-label">
							<b>Autor:</b> {capitalize(p.author)}
						</label>
						<label className="info-label">
							<b>Año:</b> {p.year}
						</label>
						<label className="info-label">
							<b>Serie:</b> {capitalize(p.serie)}
						</label>
						<label className="info-label">
							<b>Calificación: </b>
							{rating.toFixed(1)}/5
						</label>
						<div>
							<label className="info-label">
								<b>Descripcion:</b>{" "}
							</label>
							<p className="description-body">
								"
								{
									(p.description =
										p.description[0].toUpperCase() + p.description.slice(1))
								}
								"
							</p>
						</div>
						<div className="price-cart">
							<h3 className="h3-price">${p.price}</h3>
							{!cart && (
								<Button color="dark" onClick={() => handleAdd(p)}>
									Agregar a carrito
								</Button>
							)}
						</div>
					</div>
				</div>
				<hr />
				<Button color="danger" className="comments" onClick={toggleNested}>
					Ver Comentarios
				</Button>

				<ReviewBox
					productId={p.id}
					nestedModal={nestedModal}
					toggleNested={toggleNested}
					closeAll={closeAll}
					toggle={toggle}
					toggleAll={toggleAll}
					rating={rating}
					setRating={setRating}
				/>
			</ModalBody>
		</Modal>
	);
}
