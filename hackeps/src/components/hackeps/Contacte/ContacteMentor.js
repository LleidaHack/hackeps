import { Link } from "react-router-dom";
import { ROUTES } from "src/config/routes";
import "src/components/hackeps/Forms/PublicFormLayout.css";

const ContacteMentorPage = () => (
  <section className="mx-auto max-w-3xl px-6 py-24 text-center font-space-mono text-white">
    <h1 className="mb-6 text-3xl font-bold">Inscripcions de mentors tancades</h1>
    <p className="mb-8 text-lg">
      Ja hem completat l’equip de mentors de la HackEPS 2026.
      Moltes gràcies pel vostre interès!
    </p>
    <Link className="underline" to={ROUTES.home}>Torna a l’inici</Link>
  </section>
);

export default ContacteMentorPage;
