import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Label, Toast, ToastBody } from "reactstrap";
import axios from "axios";
import "./recuperarPass.css";

const RecuperarPass = ({ id }) => {
	const history = useHistory();
	const [input, setInput] = useState({
		email: "",
		newPassword: "",
		password: "",
	});

	const handleChange = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
	};

	const recuperarPass = async () => {
		console.log(input);

		await axios.post(`https://api-henrycomics.herokuapp.com/user/resetPass`, input);
		alert("Correo de recuperación enviado");
		setInput({
			...input,
			email: "",
		});
	};

	const newPass = async () => {
		await axios.put(`https://api-henrycomics.herokuapp.com/user/resetPass/${id}`, input);
		alert("Se actualizó la contraseña, exitosamente.");
		history.push("/login");
	};

	let condition = input.newPassword === input.password;
	const [verNewPass, setVerNewPass] = useState(false);
	const [verPass, setVerPass] = useState(false);

	return (
		<div className="cont-use-contra">
			<Toast>
				<h5 className="m-3">Recuperación de usuario o contraseña </h5>
				<hr />
				{!id ? (
					<div>
						<ToastBody>
							<Label className="m-3">Email</Label>
						</ToastBody>
						<input
							id="login-input"
							placeholder="Ingrese su email"
							name="email"
							value={input.email}
							className="form-control col-4 m-3"
							onChange={handleChange}
						/>
					</div>
				) : (
					<div>
						<Label className="m-3 ">Nueva Contraseña</Label>
						<input
							id="login-input"
							name="newPassword"
							type={verNewPass ? "text" : "password"}
							className="form-control col-4 ml-3"
							onChange={handleChange}
							style={{ margin: "0px" }}
						/>
						<div
							style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
						>
							<input
								type="checkbox"
								onChange={() => setVerNewPass(!verNewPass)}
								style={{ marginRight: "10px" }}
							/>
							<label style={{ margin: "0" }}>mostrar contraseña</label>
						</div>
						<Label className="m-3">Confirmar Contraseña</Label>
						<input
							id="login-input"
							name="password"
							type={verPass ? "text" : "password"}
							className="form-control col-4 ml-3"
							onChange={handleChange}
							style={{ margin: "0px" }}
						/>
						<div
							style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
						>
							<input
								type="checkbox"
								onChange={() => setVerPass(!verPass)}
								style={{ marginRight: "10px" }}
							/>
							<label style={{ margin: "0" }}>mostrar contraseña</label>
						</div>
						{input.password && !condition && (
							<span className="ml-3" style={{ fontSize: "small", color: "red" }}>
								Las contraseñas no coinciden
							</span>
						)}
					</div>
				)}
				<ToastBody>
					{!id ? (
						<Button onClick={recuperarPass}>Enviar</Button>
					) : (
						<Button
							onClick={newPass}
							disabled={input.password && condition ? false : true}
						>
							Cambiar contraseña
						</Button>
					)}
				</ToastBody>
			</Toast>
		</div>
	);
};

export default RecuperarPass;
