import "./indivisual_post_css.css";

export default function IndividualPost() {
  return (
    <main>
      <section className="article-header">
        <div className="article-category">Technology</div>
        <h1 className="article-title">
          Vancouver Tech Hub Expansion Drives Economic Growth
        </h1>
        <h2 className="article-subtitle">
          Local start-ups and tech giants are fueling job creation and
          innovation in British Columbia's largest city
        </h2>

        <div className="article-meta">
          <span className="byline">By Jane Smith</span>
          <span className="publish-date">May 15, 2025</span>
        </div>

        <div className="article-actions">
          <button className="action-button">
            <i className="fas fa-share-alt"></i> Share
          </button>
          <button className="action-button">
            <i className="fas fa-expand"></i> Resize
          </button>
          <button className="action-button">
            <i className="fas fa-comment"></i> Comments
          </button>
          <button className="action-button">
            <i className="fas fa-volume-up"></i> Listen
          </button>
        </div>
      </section>

      <section className="feature-image">
        <img
          src="/api/placeholder/800/450"
          alt="Vancouver skyline with tech company logos overlaid"
        ></img>
        <div className="feature-caption">
          Vancouver's technology sector has grown by 35% in the past three
          years, transforming the city's business landscape. Credit: BCIT Times
        </div>
      </section>

      <section className="article-content">
        <p>
          VANCOUVER, BC — The expansion of Vancouver's technology sector has
          reached unprecedented levels, with over 75,000 tech workers now
          employed across the city. This growth represents a significant shift
          in the local economy, traditionally dominated by real estate, tourism,
          and natural resources.
        </p>

        <p>
          Major tech companies including Amazon, Microsoft, and local success
          story Hootsuite have all expanded their operations in the past year,
          while dozens of new startups have established footholds in
          neighborhoods like Gastown and Mount Pleasant.
        </p>

        <img
          src="/api/placeholder/800/450"
          alt="Tech workers collaborating in a modern Vancouver office space"
        ></img>
        <div className="feature-caption">
          Tech workers collaborate at one of Vancouver's growing number of
          innovation hubs. Credit: BCIT Times
        </div>

        <p>
          "We're seeing Vancouver emerge as a genuine competitor to Seattle and
          San Francisco," said Dr. Sarah Chen, economics professor at BCIT. "The
          combination of top technical talent, quality of life, and proximity to
          Asian markets makes Vancouver particularly attractive."
        </p>

        <p>
          The growth hasn't come without challenges. Housing prices, already
          among North America's highest, have continued to climb as tech
          salaries drive up the market. Meanwhile, traditional industries report
          difficulties competing for talent.
        </p>

        <img
          src="/api/placeholder/800/450"
          alt="Graph showing Vancouver tech sector growth compared to other industries"
        ></img>
        <div className="feature-caption">
          Vancouver's tech sector growth has outpaced all other industries in
          the region. Credit: BCIT Times
        </div>

        <p>
          Local government has responded with incentives aimed at balancing
          growth across sectors. "We want to ensure Vancouver maintains its
          diverse economic base while embracing innovation," said Mayor Jackson
          Lee. "Our new initiatives include tax incentives for companies that
          hire locally and invest in training programs."
        </p>

        <p>
          The tech boom has also sparked increased enrollment in technology
          programs at local educational institutions. BCIT reports a 45%
          increase in applications to its computing programs compared to five
          years ago.
        </p>

        <p>
          "Students recognize where the opportunities are," said BCIT President
          Dr. Maria Gonzalez. "We're working closely with industry partners to
          ensure our graduates have the skills needed in this rapidly evolving
          landscape."
        </p>
      </section>

      <section className="author-bio">
        <h2>About the Author</h2>
        <div className="author-info">
          <div className="author-image">
            <img src="/api/placeholder/100/100" alt="Jane Smith"></img>
          </div>
          <div className="author-details">
            <p>
              <strong>Jane Smith</strong> is the Technology Editor at BCIT
              Times. She has covered the tech industry for over a decade,
              focusing on how technology transforms urban economies and
              cultures.
            </p>
            <p>
              Previously, she worked at Wired and The Verge. She holds a
              Master's in Digital Media from UBC.
            </p>
          </div>
        </div>
      </section>

      <section className="related-stories">
        <h2>Related Stories</h2>
        <div className="stories-grid">
          <div className="story-card">
            <h3>
              <a href="#">
                Vancouver's AI Companies Attract $2.3 Billion in Funding
              </a>
            </h3>
            <p>
              Local artificial intelligence startups are drawing major
              investment despite global economic uncertainty
            </p>
          </div>
          <div className="story-card">
            <h3>
              <a href="#">
                Tech Workers Drive Housing Demand in Mount Pleasant
              </a>
            </h3>
            <p>
              Real estate prices continue to climb as high-earning professionals
              seek homes near innovation hubs
            </p>
          </div>
          <div className="story-card">
            <h3>
              <a href="#">BCIT Launches Advanced Machine Learning Program</a>
            </h3>
            <p>
              New educational initiative aims to meet growing industry demand
              for specialized AI talent
            </p>
          </div>
        </div>
      </section>

      <section className="comments-section">
        <div className="comments-header">
          <h2>Comments</h2>
          <button className="button-outline">Comment</button>
        </div>
        <div className="comments-container">
          <p>Be the first to comment on this article.</p>
        </div>
      </section>

      <section className="popular-section">
        <h2>Popular Now in Technology</h2>
        <div className="popular-list">
          <div className="popular-item">
            <div className="popular-number"></div>
            <div className="popular-title">
              <a href="#">
                Quantum Computing Breakthrough Could Transform Machine Learning
                Applications
              </a>
            </div>
          </div>
          <div className="popular-item">
            <div className="popular-number"></div>
            <div className="popular-title">
              <a href="#">
                Canadian Tech Salaries See Largest Annual Increase in Decade
              </a>
            </div>
          </div>
          <div className="popular-item">
            <div className="popular-number"></div>
            <div className="popular-title">
              <a href="#">
                The Environmental Cost of Data Centers: New Study Reveals Impact
              </a>
            </div>
          </div>
          <div className="popular-item">
            <div className="popular-number"></div>
            <div className="popular-title">
              <a href="#">Five Technologies That Will Define the Next Decade</a>
            </div>
          </div>
          <div className="popular-item">
            <div className="popular-number"></div>
            <div className="popular-title">
              <a href="#">
                How Digital Nomads Are Changing Vancouver's Work Culture
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
