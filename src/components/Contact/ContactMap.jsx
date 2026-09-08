import { motion } from "framer-motion";

const ContactMap = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-8">
      <motion.div 
        className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg h-[400px]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.1625267204136!2d85.80869087523678!3d20.29353878117823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d6ffffffff%3A0xbe34740a580fee49!2sUsthi%20Hospital%20%7C%20Best%20Multispeciality%20Hospital%20in%20Bhubaneshwar!5e0!3m2!1sen!2sin!4v1781865991044!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Hospital Location Map"
          className="filter grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
        ></iframe>
      </motion.div>
    </section>
  );
};

export default ContactMap;
