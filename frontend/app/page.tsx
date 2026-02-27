
import Header from '../components/landingPage/Header';
import Footer from '../components/landingPage/Footer';
import HeroSection from '../components/landingPage/HeroSection';
import FeaturesSection from '../components/landingPage/FeaturesSection';
import PricingSection from '../components/landingPage/PricingSection';

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;