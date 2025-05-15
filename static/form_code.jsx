import React from "react";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
  faTelegram,
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const App = () => {
  return (
    <div id="wrapper">
      <header>
        <h1>BCIT Times</h1>
        <nav>
          <ul className="c-ul">
            <li className="c-li">
              <a className="a-menu" href="../html/bilal_ecommerce_store.html">
                Home
              </a>
            </li>
            <li className="c-li">
              <a className="a-menu" href="../html/about-us.html">
                Crypto
              </a>
            </li>
            <li className="c-li">
              <a className="a-menu" href="../html/mens-watches.html">
                Vancouver Today
              </a>
            </li>
            <li className="c-li">
              <a className="a-menu" href="../html/womens-watches.html">
                Technologies
              </a>
            </li>
            <li className="c-li">
              <a className="a-menu" href="../html/contact-us.html">
                Health & Science
              </a>
            </li>
            <li className="c-li">
              <a className="a-menu" href="../html/sale.html">
                Sale
              </a>
            </li>
          </ul>
          <div>
            <li>
              <button className="button-outline">Sign In</button>
            </li>
          </div>
        </nav>
      </header>

      <main>
        <section>
          <article>
            <div className="form-container">
              <div className="tab-menu">
                <button className="tab active">Sign In</button>
                <button className="tab">Sign Up</button>
              </div>

              <div className="form-content">
                <div className="avatar">
                  <FontAwesomeIcon icon={faUser} />
                </div>

                <form>
                  <div className="input-group">
                    <FontAwesomeIcon icon={faUser} />
                    <input type="text" placeholder="Username" required />
                  </div>
                  <div className="input-group">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <input type="email" placeholder="youremail@gmail.com" required />
                  </div>
                  <div className="input-group">
                    <FontAwesomeIcon icon={faLock} />
                    <input type="password" placeholder="********" required />
                  </div>
                  <button type="submit" className="sign-in-btn">
                    Sign In
                  </button>
                </form>

                <div className="social-login">
                  <div className="social-icon google">
                    <FontAwesomeIcon icon={faGoogle} />
                  </div>
                  <div className="social-icon telegram">
                    <FontAwesomeIcon icon={faTelegram} />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-about">
            <h3>About Us</h3>
            <p>
              BCIT Times delivers the latest breaking news, insightful analysis, and
              in-depth stories from around the world. Stay informed, stay ahead.
            </p>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">World</a></li>
              <li><a href="#">Politics</a></li>
              <li><a href="#">Business</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
            </div>
          </div>

          <div className="footer-newsletter">
            <h3>Newsletter</h3>
            <p>Subscribe to get our latest news and updates.</p>
            <form>
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 BCIT Times. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;