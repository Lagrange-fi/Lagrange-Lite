/* eslint-disable @typescript-eslint/no-unused-vars */

import { useCallback, useState, useEffect } from 'react'
import Link from 'next/link'
import { abbreviateAddress } from '../utils/index'
import useLocalStorageState from '../hooks/useLocalStorageState'
import MenuItem from './MenuItem'
import times from '../public/assets/icons/cancel.png'
import useMangoStore from '../stores/useMangoStore'
import ConnectWalletButton from './ConnectWalletButton'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

const TopBar = () => {
  const [a, setA] = useState(false)
  const router = useRouter()
  const [matches, setMatches] = useState(
    window.matchMedia('(max-width: 768px)').matches
  )
  const { t } = useTranslation('common')
  const mangoAccount = useMangoStore((s) => s.selectedMangoAccount.current)
  const wallet = useMangoStore((s) => s.wallet.current)
  const [showAccountsModal, setShowAccountsModal] = useState(false)

  useEffect(() => {
    window
      .matchMedia('(min-width: 768px)')
      .addEventListener('change', (e) => setMatches(e.matches))
  }, [])

  const handleCloseAccounts = useCallback(() => {
    setShowAccountsModal(false)
  }, [])

  const burger = (e) => {
    setA((prevState) => !prevState)
    console.log(
      e.target.parentNode.parentNode.previousElementSibling.children[1]
    )

    if (a === true) {
      e.target.classList.remove('deactivemenu')
      e.target.parentNode.parentNode.previousElementSibling.children[1].style.display =
        'hidden'
    } else {
      e.target.classList.add('deactivemenu')
      e.target.parentNode.parentNode.previousElementSibling.children[1].style.visibility =
        'visible'
    }
  }

  const times = (e) => {
    setA((prevState) => !prevState)

    if (a === true) {
      e.target.classList.remove('deactivemenu')
      e.target.parentNode.parentNode.style.visibility = 'hidden'
    } else {
      e.target.classList.add('deactivemenu')
      e.target.parentNode.parentNode.style.visibility = 'visible'
    }
  }

  return (
    <>
      <div className="topbar">
        <nav>
          <div className="imgandul">
            <Link href="/">
              <a>
                <img src="/Lagrange-logo-light.png" alt="next" />
              </a>
            </Link>
            <ul>
              <li>
                <img
                  src="/assets/icons/cancel.png"
                  className="fa-times"
                  alt=""
                  onClick={times}
                />
              </li>
              <li className={router.asPath == '/swap' ? 'active' : ''}>
                <Link href="/swap">
                  <a>Swap</a>
                </Link>
              </li>
              <li className={router.asPath == '/overview' ? 'active' : ''}>
                <Link href="/overview">
                  <a>Market Overview</a>
                </Link>
              </li>
              <li className={router.asPath == '/pools' ? 'active' : ''}>
                <Link href="/pools">
                  <a>Pools</a>
                </Link>
              </li>
              <li>{matches && <ConnectWalletButton />}</li>
            </ul>
          </div>

          <div className="imgandul">
            {!matches && <ConnectWalletButton />}
            <div className="burger" onClick={burger}>
              <i className="fas fa-bars"></i>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

export default TopBar
