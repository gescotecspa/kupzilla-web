import { useEffect } from 'react';
import { FaMoneyBillWave, FaGift, FaBolt, FaHandshake,FaChartLine, FaCogs, FaRocket, FaRegHandshake } from 'react-icons/fa';


import { useAppDispatch } from '../redux/store/hooks';
import '../styles/pages/Home.scss';
import { fetchRoles, fetchStatuses } from '../redux/actions/userActions';
import { fetchCategories, fetchCountries } from '../redux/actions/globalDataActions';
import gescotec from '../assets/images/gescotec1.png';

import kupzillaImage from '../assets/images/01_kupzilla.jpeg';
import kupzillaImage01 from '../assets/images/02_Kupzilla.jpeg';
import kupzillaImage03 from '../assets/images/03_Kupzilla.jpeg';
import kupzillaImage02 from '../assets/images/04_Kupzilla.jpeg';

import santi from '../assets/images/team/Santi.jpeg';
import seba from '../assets/images/team/seba.jpeg';
import juan from '../assets/images/team/juan.png';
import francisco from '../assets/images/team/francisco.png';
import javier from '../assets/images/team/javier.jpeg';
import pablo from '../assets/images/team/pablo.jpeg';
import marcos from '../assets/images/team/marcos.png';

const HomePage = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchStatuses());
    dispatch(fetchCountries());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Discover top local deals in real time</h1>
        <div className="hero-content">
          <div className="hero-text">
            <p>Kupzilla is the ultimate app for local deals, connecting businesses with customers in real time. Businesses get full control to create and customize promotions instantly, while consumers enjoy unbeatable savings at their favorite spots. With an easy-to-use platform and a risk-free start, Kupzilla is redefining local promotions—one deal at a time.</p>
            <a href="https://play.google.com/store/apps/details?id=com.kupzilla.tourists&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://play.google.com/intl/en_us/badges/static/images/badges/es_badge_web_generic.png" 
                alt="Disponible en Google Play" 
                className="google-play-badge"
              />
            </a>
          </div>
          <div className="hero-image">
            <img src={kupzillaImage} alt="Mockup de Kupzilla" />
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="benefits-section">
        <h2>Why choose Kupzilla?</h2>
        <div className="benefits-group">
        <ul>
          <li>
            <p>Get exclusive promotions right on your phone</p>
            <div className="benefit-image">
              <img 
                src={kupzillaImage01} 
                alt="Exclusive promotions" 
              />
            </div>
          </li>
          <li>
            <p>Discover the best local deals near you and enjoy savings</p>
            <div className="benefit-image">
              <img 
                src={kupzillaImage02} 
                alt="Local deals" 
              />
            </div>
          </li>
          <li>
            <p>Businesses manage their promotions in real time</p>
            <div className="benefit-image">
              <img 
                src={kupzillaImage03} 
                alt="Manage promotions" 
              />
            </div>
          </li>
        </ul>
        </div>
        {/* Clientes */}
        <div className="benefits-group">
          <h3>For Customers</h3>
          <ul>
            <li>
              <p><strong>Save Money Daily</strong> - Discover the best local deals near you</p>
              <div className="benefit-icon"><FaMoneyBillWave size={32} color="#2c3e50" /></div>
            </li>
            <li>
              <p><strong>Exclusive Offers</strong> - Get discounts tailored by businesses</p>
              <div className="benefit-icon"><FaGift size={32} color="#2c3e50" /></div>
            </li>
            <li>
              <p><strong>Fast & Simple</strong> - Claim deals with just a tap!</p>
              <div className="benefit-icon"><FaBolt size={32} color="#2c3e50" /></div>
            </li>
            <li>
              <p><strong>Support Local</strong> - Enjoy great savings while helping small businesses grow</p>
              <div className="benefit-icon"><FaHandshake size={32} color="#2c3e50" /></div>
            </li>
          </ul>
        </div>

        {/* Comercios */}
        <div className="benefits-group">
          <h3>For Businesses</h3>
          <ul>
            <li>
              <p><strong>Boost Sales & Visibility</strong> - Attract more customers when you need them most</p>
              <div className="benefit-icon"><FaChartLine /></div>
            </li>
            <li>
              <p><strong>Full Control</strong> - Set your own deals: an hour, a day, or weeks - your choice</p>
              <div className="benefit-icon"><FaCogs /></div>
            </li>
            <li>
              <p><strong>Easy to Use</strong> - Post promotions instantly, no hassle</p>
              <div className="benefit-icon"><FaRocket /></div>
            </li>
            <li>
              <p><strong>Risk-Free Start</strong> - First 6 months are free</p>
              <div className="benefit-icon"><FaRegHandshake /></div>
            </li>
          </ul>
        </div>
      </section>

      {/* About Us */}
      <section className="mission-section">
        <h2>About Us</h2>
        <div className="mission-content">
        <p>
          Founded in 2024 in Malmö, Sweden, Kupzilla began with a simple idea: make local deals accessible to everyone.
        </p>
        <p>
          What started as a small project among entrepreneurs passionate about technology and community growth has become a platform that helps businesses thrive and customers save every day.
        </p>
        <p>
          Kupzilla gives local businesses full control to create and share real-time promotions with nearby customers—whether it's a café, boutique, or barber—without upfront risk.
        </p>
        <p>
          Backed by an international team of developers, marketers, and community builders, we’re focused on connecting communities and helping small businesses grow.
        </p>
        <p>
          As we expand globally, our mission remains the same: empower local connections through simple, transparent, and user-friendly experiences.
        </p>
        </div>
      </section>
      {/* Team */}
      <section className="team-section">
        <h2>Meet the Team</h2>
        <p>At Kupzilla, a small but driven team with big ambitions powers everything we do. With diverse backgrounds in tech, marketing, and design, we share one mission: making local deals accessible and helping small businesses thrive.

As a lean startup, we move fast, stay close to our users, and build with purpose. Every feature and promotion is crafted with care, because we believe great things start small—but grow to make a big impact.</p>

        <div className="team-members">
          <div className="team-card">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team Member" />
            <h4>Malin Svensson</h4>
            <p>CEO</p>
          </div>
          <div className="team-card">
            <img src={francisco} alt="Team Member" />
            <h4>Francisco Gustafsson</h4>
            <p>Community Manager</p>
          </div>
          <div className="team-card">
            <img src={seba} alt="Team Member" />
            <h4>Sebastian Alvarez</h4>
            <p>Customer Engagement</p>
          </div>
          <div className="team-card">
            <img src={pablo} alt="Team Member" />
            <h4>Pablo Charras</h4>
            <p>CTO</p>
          </div>
          <div className="team-card">
            <img src={marcos} alt="Team Member" />
            <h4>Marcos Celiz</h4>
            <p>Product Delivery Lead</p>
          </div>
          <div className="team-card">
            <img src={javier} alt="Team Member" />
            <h4>Javier Pedernera</h4>
            <p>Software Developer</p>
          </div>
          <div className="team-card">
            <img src={santi} alt="Team Member" />
            <h4>Santiago Celiz</h4>
            <p>Software Developer</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <img src={gescotec} alt="Logo Kupzilla" className="footer-logo" />
        <p>© 2025 Kupzilla. All rights reserved.</p>
        <p className="baja">Do you want to delete your account?</p>
        <a href="/delete-account" className="delete-account-link">Delete Account</a>
      </footer>
    </div>
  );
};

export default HomePage;
