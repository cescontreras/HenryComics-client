import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram,	faReddit,	faYoutube } from "@fortawesome/free-brands-svg-icons";
import logo from "../navBar/img/logo.png";

const Footer = () => {
	return (
		<div className="footer footer-bottom bg-dark">
			<div className="container-fluid d-flex justify-content-center">
				<div className="container-fluid row">
					<div className="col-md-2">
						<img src={logo} alt="logo" className="footerLogo" />
					</div>
					<div className="col-md-8 footerBorder">
						<h5>
							<b>HENRY COMICS</b>
						</h5>
						<p className="font-italic">©Henry Comics 2020</p>
						<p>
							<b>Contacto </b>
							<br></br>
							consultas@henrycomics.com.ar<br></br>
							<b>Teléfono </b>
							<br></br>
							(0351)44587632
						</p>
					</div>
					<div className="col-md-2 footerBorder">
						<h5 className="datos-h5">Seguinos en nuestras redes</h5>
						<h6>
							<FontAwesomeIcon icon={faInstagram} />
							<a href="#"> @henrycomics</a>
						</h6>
						<h6>
							<FontAwesomeIcon icon={faYoutube} />
							<a href="#"> HenryComics</a>
						</h6>
						<h6>
							<FontAwesomeIcon icon={faReddit} />
							<a href="#"> /HenryComics</a>
						</h6>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
