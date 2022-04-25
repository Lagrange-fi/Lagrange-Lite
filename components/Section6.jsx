//@typescript-eslint/no-unused-vars
import FooterLandingPage from './FooterLandingPage'

const Section6 = () => {
  return (
    <div className="Section6">
      <div className="chart-lagrange">
        <div className="chart-pro">
          <img src="https://i.ibb.co/Lx0bssq/pro-version-1.png" />
        </div>
        <div className="lagrange-plnt"></div>
      </div>
      <div className="orderbook-pro-vers">
        <div className="order-img"></div>
        <div className="pro-vers-text">
          <p className="pro-ver-title">Pro version</p>
          <p className="pro-ver-cont">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <button className="pro-ver-button">
            Explore &nbsp; <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div className="end-solar-sistem">
        <div className="joinfast-and-sosialm">
          <div className="join-fast">
            <p className="mini-connect-title">
              Connect with us on social media
            </p>
            <p className="join-main">Join a fast growing community</p>
          </div>
          <div className="sosial-media-part">
            <div className="twitter-follow">
              <i className="fa-brands fa-twitter-square"></i>
              <div>
                <p className="twitter-title">Twitter</p>
                <p className="twitter-text">
                  Follow @lagrange to het the lstest news and updates
                </p>
              </div>
              <a
                href="https://twitter.com/lagrange_fi"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
            <div className="discord-follow">
              <i className="fa-brands fa-discord"></i>
              <div>
                <p className="discord-title">Discord</p>
                <p className="discord-text">Have a technical question?</p>
              </div>
              <a
                href="https://discord.com/invite/lagrange-fi"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
            <div className="medium-follow">
              <i className="fa-brands fa-medium"></i>
              <div>
                <p className="medium-title">Medium</p>
                <p className="medium-text">Deeper in our community</p>
              </div>
              <a
                href="https://medium.com/lagrange"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="receive-input">
          <p className="receive-new">Receive new updates</p>
          <p className="recive-mini-cont">
            Duis aute irure dolor in reprehenderit in voluptate velit{' '}
          </p>
          <div className="input-i">
            <input placeholder="Your email" />
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div>
        <FooterLandingPage />
      </div>
    </div>
  )
}
export default Section6
