import React from 'react';
import styles from './Home.module.css'; // Make sure the path matches where your CSS module is located

function Home() {
  return (
    <div className={styles.homeBodyWrapper}>
      <header className={styles.homeHeader}>
        <h1>Welcome to AI Overlord</h1>
        <h2>Your Superior Tech Resource on AI Chat and Image Generation</h2>
      </header>

      <main className={styles.homeMain}>
        <section className={styles.homeSection}>
          <h2>About Us</h2>
          <p>At AI Overlord, we understand the power of artificial intelligence in revolutionizing the tech world. Our focus lies in understanding and harnessing the capabilities of AI chat and image generation. Whether you're seeking streamlined chatbots or advanced image generation, we've got you covered.</p>
        </section>

        <section className={styles.homeSection}>
          <h2>Our Services</h2>
          <p>We offer cutting-edge technological solutions on AI chat generation, turning simple input into intuitive and natural human-like conversations. Our image generation AI can create high-quality images from descriptions, revolutionizing the future of digital content creation.</p>
        </section>

        <section className={styles.homeSection}>
          <h2>Featured Services</h2>
          <div className={styles.featuredServices}>
            {/* Add featured service cards or elements here */}
            <div className={styles.serviceCard}>
              <h3>AI Chat Generation</h3>
              <p>Create intuitive chatbots with our AI-powered chat generation technology.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3>Image Generation</h3>
              <p>Generate high-quality images from descriptions effortlessly using our AI.</p>
            </div>
          </div>
        </section>

        {/* Add more sections or content as needed */}
      </main>
    </div>
  );
}

export default Home;
