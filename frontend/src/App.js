import { useEffect, useState } from "react";
import "@/App.css";
import Preloader from "@/components/claw/Preloader";
import BackgroundFX from "@/components/claw/BackgroundFX";
import Cursor from "@/components/claw/Cursor";
import Navbar from "@/components/claw/Navbar";
import Hero from "@/components/claw/Hero";
import IndustryGame from "@/components/claw/IndustryGame";
import ThingsWeDo from "@/components/claw/ThingsWeDo";
import System360 from "@/components/claw/System360";
import HowWePlay from "@/components/claw/HowWePlay";
import CaseStudies from "@/components/claw/CaseStudies";
import PlayWithClaw from "@/components/claw/PlayWithClaw";
import ClawLab from "@/components/claw/ClawLab";
import WhyClaw from "@/components/claw/WhyClaw";
import FinalCTA from "@/components/claw/FinalCTA";
import Footer from "@/components/claw/Footer";
import { Marquee } from "@/components/claw/Bits";

function useAnalyticsBootstrap() {
  useEffect(() => {
    const id = process.env.REACT_APP_GA_ID;
    if (!id || typeof window === "undefined" || window.gtag) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id);
  }, []);
}

function App() {
  const [entered, setEntered] = useState(false);
  useAnalyticsBootstrap();

  return (
    <div className="App bg-black text-claw-text font-body" data-testid="claw-app">
      <BackgroundFX />
      <Cursor />
      {!entered && <Preloader onEnter={() => setEntered(true)} />}
      <Navbar />
      <main>
        <Hero />
        <Marquee
          testid="marquee-top"
          items={["Let us play your marketing game", "Build", "Create", "Grow", "Automate", "Tech × Media × Marketing"]}
        />
        <IndustryGame />
        <ThingsWeDo />
        <System360 />
        <HowWePlay />
        <CaseStudies />
        <Marquee
          testid="marquee-bottom"
          reverse
          items={["One business", "One system", "Your move", "Play with CLAW", "360° growth"]}
        />
        <PlayWithClaw />
        <ClawLab />
        <WhyClaw />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
