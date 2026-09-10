import ContactHero from "../components/Contact/ContactHero";
import ContactSection from "../components/Contact/ContactSection";
import ContactMap from "../components/Contact/ContactMap";

const Contact = () => {
  return (
    <main className="bg-slate-50/50 min-h-screen pb-16">
      <ContactHero />
      <ContactSection />
      <ContactMap />
    </main>
  );
};

export default Contact;