import { Link } from "react-router-dom";
import "../../styles/components/_footer.scss";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <p>©2024 - Todos los derechos reservados | <span className="brand">Kupzilla</span></p>
                    <Link to="/terms" className="footer-link">
                        Términos y Condiciones
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
