import Contact from "@components/Contact";
import Footer from "@components/Footer";
import Header from "@components/Header";
import Values from "@components/values";

import { Box } from "@mui/material";
import { useEffect } from "react";
import { margin } from "@utilities/Functions";
import { useLocation } from "react-router-dom";
import Hero from "@components/Hero";
import Services from "@components/Services";
import Areas from "@components/Areas";

import Publicaciones from "@components/Publicaciones";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.state?.scrollToSection;
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header margin={margin} />

      <Box id="inicio" sx={{ px: margin }}>
        <Hero />
      </Box>

      <Box id="servicios" sx={{ px: margin }}>
        <Services />
      </Box>

      <Box id="areas" sx={{ px: margin }}>
        <Areas />
      </Box>

     

      <Box id="publicaciones" sx={{ px: margin }}>
        <Publicaciones />
      </Box>

      <Box id="valores" sx={{ px: margin }}>
        <Values />
      </Box>

      <Box id="contacto" sx={{ px: margin }}>
        <Contact />
      </Box>

      <Footer margin={margin} />
    </Box>
  );
};

export default Home;
