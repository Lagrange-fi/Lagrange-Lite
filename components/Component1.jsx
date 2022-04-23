import Link from 'next/link'

const Component1 = () => {
  return (
    <>
      <div className="Component1">
        <aside>
          <div className="planet"></div>
          <div className="galaxy">
            <div className="planet1"></div>
          </div>
        </aside>
        <aside>
          <span className="span1">
            Doesn't require any broker or settlement periods.
          </span>
          <span className="span2">
            Fully decentralized <br /> 24/7 FX market
          </span>
          <div className="buttondiv">
            <button>
              {' '}
              <Link href="/swap">
                <a>Lite version</a>
              </Link>{' '}
              <i
                className="fa-solid fa-arrow-right"
                style={{ marginLeft: '10px' }}
              ></i>
            </button>
            <button>
              Pro version
              <span
                style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '700' }}
              >
                (soon)
              </span>
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}

export default Component1
