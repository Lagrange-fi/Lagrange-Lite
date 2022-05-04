//@typescript-eslint/no-unused-vars
import FooterLandingPage from './FooterLandingPage'

const Component6 = () => {
  return (
    <div className="Component6">
      <div className="joinfast-and-sosialm">
        <div className="join-fast">
          <p className="mini-connect-title">Connect with us on social media</p>
          <p className="join-main">
            Join <br /> our fast growing <br /> community
          </p>
        </div>
        <div className="sosial-media-part">
          <div className="twitter-follow">
            <figure>
              <i className="fa-brands fa-twitter"></i>
              <div>
                <p className="twitter-title">Twitter</p>
                <p className="twitter-text">
                  Follow @lagrange_fi to get the latest news and updates
                </p>
              </div>
            </figure>

            <a
              href="https://twitter.com/lagrange_fi"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
          <div className="discord-follow">
            <figure>
              <i className="fa-brands fa-discord"></i>
              <div>
                <p className="discord-title">Discord</p>
                <p className="discord-text">Have a technical question?</p>
              </div>
            </figure>

            <a
              href="https://discord.com/invite/lagrange-fi"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
          <div className="medium-follow">
            <figure>
              <i className="fa-brands fa-medium"></i>
              <div>
                <p className="medium-title">Medium</p>
                <p className="medium-text">Deeper in our community</p>
              </div>
            </figure>
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
          Subscribe now to keep up to date with Lagrange
        </p>
        <div className="input-i">
          <input placeholder="Your email" />
          <i className="fa-solid fa-arrow-right"></i>
        </div>
      </div>
      <FooterLandingPage />
    </div>
  )
}

export default Component6
