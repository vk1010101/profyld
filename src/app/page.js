import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Artwork from "@/components/Artwork";
import Logos from "@/components/Logos";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Artwork />
      <Logos />
      <Contact />
    </main>
  );
}
