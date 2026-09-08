import ContactHero from "../components/Contact/ContactHero";
// import ContactDetails from "../components/Contact/ContactDetails";
import ContactMap from "../components/Contact/ContactMap";
import HomeContact from "../components/Home/HomeContact";

const Contact = () => {
  return (
    <main className="bg-background min-h-screen pb-24">
      <ContactHero />
      <HomeContact />
      {/* <ContactDetails /> */}
      <ContactMap />
    </main>
  );
};

export default Contact;