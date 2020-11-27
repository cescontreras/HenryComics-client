import React from "react";
import { useState } from "react";
import {
	Col,
	Row,
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	Toast,
	ToastHeader,
	ToastBody,
} from "reactstrap";
import Axios from "axios";
import "./resetPass.css";

const ResetPass = (props) => {
	const { id, firstname, email } = props.user;

	const [password, setPassword] = useState({
		actual: "",
		new: "",
	});

	const handlerChange = (e) => {
		setPassword({
			...password,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	const handlerNewPass = async () => {
		let body = {
			password: password.actual,
		};
		if (!password.new || !password.actual) {
			return alert("Deve Completar Todos sus campos");
		}

		const { data } = await Axios.post(
			`https://api-henrycomics.herokuapp.com/user/${id}/password`,
			body,
			{ withCredentials: true }
		);
		if (data) {
			await Axios.post(
				`https://api-henrycomics.herokuapp.com/user/${id}/passwordReset`,
				{
					password: password.new,
				},
				{ withCredentials: true }
			);
			alert("Contraseña cambiada correctamente ");
		} else {
			alert("Invalid pass");
		}
	};

	return (
		<div class="contreset">
			<Toast>
				<Form onSubmit={handleSubmit}>
					<ToastHeader>Resetar Password: </ToastHeader>
					<ToastBody>
						<h5>
							<p>{firstname}</p>
						</h5>
						<p>{email}</p>
					</ToastBody>
					<Row form>
						<Col md={5}>
							<FormGroup>
								<Label className="ml-3" for="examplePassword">
									Contraseña Actual
								</Label>
								<Input
									className="ml-3 mr-3"
									type="password"
									name="actual"
									placeholder="Contraseña actual ..."
									value={password.actual}
									onChange={handlerChange}
								/>
							</FormGroup>
						</Col>
						<Col md={5}>
							<FormGroup>
								<Label className="ml-3" for="examplePassword">
									Contraseña Nueva
								</Label>
								<Input
									className="ml-3 mr-3"
									type="password"
									name="new"
									placeholder="Nueva contraseña ..."
									value={password.new}
									onChange={handlerChange}
								/>
							</FormGroup>
						</Col>
					</Row>
					<Button className="m-3" type="submit" onClick={() => handlerNewPass()}>
						Confirmar
					</Button>
				</Form>
			</Toast>
		</div>
	);
};

export default ResetPass;
