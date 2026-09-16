import logo from "src/assets/img/home10/logonaranja.png";
import "./FormLayout.css";
import "./PublicFormLayout.css";

const FormLayout = ({ children, title, image = logo, imageAlt = "HackEPS 10a edició", visualFooter }) => (
  <section className="shared-form-layout">
    <div className="shared-form-visual">
      <img src={image} alt={imageAlt} className="shared-form-image" />
      {visualFooter}
    </div>
    <div className="shared-form-fields">
      {title && <h1 className="shared-form-title">{title}</h1>}
      {children}
    </div>
  </section>
);

export default FormLayout;
