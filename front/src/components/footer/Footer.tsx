import React from 'react';
import styles from "./Footer.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerAbout}>
          <h3>About Us</h3>
          <p>
            BCIT Times delivers the latest breaking news, insightful analysis, and
            in-depth stories from around the world. Stay informed, stay ahead.
          </p>
        </div>
    
        <div className={styles.footerLinks}>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">World</a></li>
            <li><a href="#">Politics</a></li>
            <li><a href="#">Business</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
    
        <div className={styles.footerSocial}>
          <h3>Follow Us</h3>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#" aria-label="Twitter"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#" aria-label="YouTube"><FontAwesomeIcon icon={faYoutube} /></a>
          </div>
        </div>
    
        <div className={styles.footerNewsletter}>
          <h3>Newsletter</h3>
          <p>Subscribe to get our latest news and updates.</p>
          <form>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} BCIT Times. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;