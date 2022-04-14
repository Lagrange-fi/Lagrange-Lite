/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable */
import {
  FunctionComponent,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ExternalLinkIcon, EyeOffIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Disclosure } from '@headlessui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import useDimensions from 'react-cool-dimensions'
import { IconButton } from './Button'
import { LineChartIcon } from './icons'

dayjs.extend(relativeTime)

interface SwapTokenInfoProps {
  inputTokenId?: any
  outputTokenId?: any
}

export const numberFormatter = Intl.NumberFormat('en', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 5,
})

export const numberCompacter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 2,
})

const SwapTokenInfo: FunctionComponent<SwapTokenInfoProps> = ({
  inputTokenId,
  outputTokenId,
}) => {
  const [chartData, setChartData] = useState([])
  const [hideChart, setHideChart] = useState(false)
  const [baseTokenId, setBaseTokenId] = useState('')
  const [quoteTokenId, setQuoteTokenId] = useState('')
  const [inputTokenInfo, setInputTokenInfo] = useState(null)
  const [outputTokenInfo, setOutputTokenInfo] = useState(null)
  const [mouseData, setMouseData] = useState<string | null>(null)
  const [daysToShow, setDaysToShow] = useState(1)
  const [topHolders, setTopHolders] = useState(null)
  const { observe, width, height } = useDimensions()

  const getTopHolders = async (inputMint: any, outputMint: any) => {
    const inputResponse = await fetch(
      `https://public-api.solscan.io/token/holders?tokenAddress=${inputMint}&offset=0&limit=10`
    )
    const outputResponse = await fetch(
      `https://public-api.solscan.io/token/holders?tokenAddress=${outputMint}&offset=0&limit=10`
    )
    const inputData = await inputResponse.json()
    const outputData = await outputResponse.json()

    setTopHolders({
      // @ts-ignore
      inputHolders: inputData.data,
      outputHolders: outputData.data,
    })
  }

  useEffect(() => {
    if (inputTokenInfo && outputTokenInfo) {
      getTopHolders(
        // @ts-ignore
        inputTokenInfo.contract_address, // @ts-ignore
        outputTokenInfo.contract_address
      )
    }
  }, [inputTokenInfo, outputTokenInfo])

  const handleMouseMove = (coords: {
    activePayload: { payload: SetStateAction<string | null> }[]
  }) => {
    if (coords.activePayload) {
      setMouseData(coords.activePayload[0].payload)
    }
  }

  const handleMouseLeave = () => {
    setMouseData(null)
  }

  useEffect(() => {
    if (['usd-coin', 'tether'].includes(inputTokenId)) {
      setBaseTokenId(outputTokenId)
      setQuoteTokenId(inputTokenId)
    } else {
      setBaseTokenId(inputTokenId)
      setQuoteTokenId(outputTokenId)
    }
  }, [inputTokenId, outputTokenId])

  // Use ohlc data

  const getChartData = async () => {
    // tokenleri aldiq /////
    const inputResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${baseTokenId}/ohlc?vs_currency=usd&days=${daysToShow}`
    )
    const outputResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${quoteTokenId}/ohlc?vs_currency=usd&days=${daysToShow}`
    )
    const inputData = await inputResponse.json()
    const outputData = await outputResponse.json()
    /// tokenleri birlesdirdik bir arraya //////
    let data: any[] = []
    if (Array.isArray(inputData)) {
      data = data.concat(inputData)
    }
    if (Array.isArray(outputData)) {
      data = data.concat(outputData)
    }
    //// tokenler format edirik ////
    const formattedData = data.reduce((a, c) => {
      const found = a.find((price: { time: any }) => price.time === c[0])
      if (found) {
        if (['usd-coin', 'tether'].includes(quoteTokenId)) {
          found.price = found.inputPrice / c[4]
        } else {
          found.price = c[4] / found.inputPrice
        }
      } else {
        a.push({ time: c[0], inputPrice: c[4] })
      }
      return a
    }, [])

    formattedData[formattedData.length - 1].time = Date.now()
    setChartData(formattedData.filter((d: { price: any }) => d.price))
  }

  const getInputTokenInfo = async () => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${inputTokenId}?localization=false&tickers=false&developer_data=false&sparkline=false
      `
    )
    const data = await response.json()
    setInputTokenInfo(data)
  }

  const getOutputTokenInfo = async () => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${outputTokenId}?localization=false&tickers=false&developer_data=false&sparkline=false
      `
    )
    const data = await response.json()
    setOutputTokenInfo(data)
  }

  useMemo(() => {
    if (baseTokenId && quoteTokenId) {
      getChartData()
    }
  }, [daysToShow, baseTokenId, quoteTokenId])

  useMemo(() => {
    if (baseTokenId) {
      getInputTokenInfo()
    }
    if (quoteTokenId) {
      getOutputTokenInfo()
    }
  }, [baseTokenId, quoteTokenId])

  const chartChange = chartData.length
    ? ((chartData[chartData.length - 1]['price'] - chartData[0]['price']) /
        chartData[0]['price']) *
      100
    : 0

  return (
    <>
      <div className="SwapTokenInfo1">
        {chartData.length && baseTokenId && quoteTokenId ? (
          <div>
            {!hideChart ? (
              <div
                className="w-full"
                ref={observe}
                style={{
                  borderRadius: '4px',
                  fontSize: '25px',
                }}
              >
                {/* symbol and date */}
                {inputTokenInfo && outputTokenInfo ? (
                  <div className="symbolanddate">
                    <span>
                      {`${
                        // @ts-ignore
                        outputTokenInfo?.symbol?.toUpperCase()
                      }/${inputTokenInfo?.symbol?.toUpperCase()}`}
                    </span>
                    <div className="dates">
                      <button onClick={() => setDaysToShow(1)}>24H</button>
                      <button onClick={() => setDaysToShow(7)}>7D</button>
                      <button onClick={() => setDaysToShow(30)}>30D</button>
                      <input
                        type="date"
                        id="start"
                        name="trip-start"
                        value="2018-07-22"
                      />
                    </div>
                  </div>
                ) : null}

                {/* chart number */}
                {mouseData ? (
                  <>
                    <div className="chartnumber">
                      <span>
                        {' '}
                        {
                          // @ts-ignore
                          numberFormatter.format(mouseData['price'])
                        }{' '}
                      </span>
                      <span className={`${chartChange >= 0 ? 'green' : 'red'}`}>
                        {chartChange.toFixed(2)}%
                      </span>
                      <span>
                        {
                          // @ts-ignore
                          dayjs(mouseData['time']).format('DD MMM YY, h:mma')
                        }
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="chartnumber">
                      <span>
                        {numberFormatter.format(
                          chartData[chartData.length - 1]['price']
                        )}
                      </span>
                      <span
                        className={` ${chartChange >= 0 ? 'green' : 'red'}`}
                      >
                        {chartChange.toFixed(2)}%
                      </span>
                      <span>
                        {dayjs(chartData[chartData.length - 1]['time']).format(
                          'DD MMM YY, h:mma'
                        )}
                      </span>
                    </div>
                  </>
                )}

                {/* chart  */}

                <ResponsiveContainer width="100%" height={195}>
                  <AreaChart
                    className="AreaChart"
                    data={chartData} // @ts-ignore
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Tooltip
                      cursor={{
                        strokeOpacity: 0,
                      }}
                      content={<></>}
                    />
                    <defs>
                      <linearGradient
                        id="gradientArea"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="rgba(253, 159, 129, 0.33) "
                          stopOpacity={1}
                        />
                        <stop
                          offset="90%"
                          stopColor="rgba(253, 159, 129, 0.33)"
                          stopOpacity={0.3}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      isAnimationActive={true}
                      type="monotone"
                      dataKey="price"
                      stroke="#FD9F81"
                      fill="url(#gradientArea)"
                    />
                    <XAxis dataKey="time" hide />
                    <YAxis
                      dataKey="price"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      hide
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="p-4 mt-4 text-center rounded-md bg-th-bkg-3 md:mt-0 text-th-fgd-3">
            <LineChartIcon className="w-6 h-6 mx-auto text-th-primary" />
          </div>
        )}
      </div>
      {/* accordion */}

      {inputTokenInfo && outputTokenInfo && baseTokenId ? (
        <div>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`default-transition flex items-center justify-between mt-4 p-2 rounded-md w-full hover:bg-th-bkg-2 ${
                    open
                      ? 'borderD1 rounded-b-none'
                      : 'borderD transform rotate-360'
                  }`}
                >
                  <div className="flex items-center">
                    {
                      // @ts-ignore
                      inputTokenInfo.image?.small ? (
                        <img
                          className="rounded-full" // @ts-ignore
                          src={inputTokenInfo.image?.small}
                          width="38"
                          height="40" // @ts-ignore
                          alt={inputTokenInfo.name}
                        />
                      ) : null
                    }
                    <div className="ml-2.5 text-left">
                      <h2 className="selecttokenname">
                        {
                          // @ts-ignore
                          inputTokenInfo?.symbol?.toUpperCase()
                        }
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {
                        // @ts-ignore
                        inputTokenInfo.market_data?.current_price?.usd ? (
                          <div className="selectnumber">
                            $
                            {numberFormatter.format(
                              // @ts-ignore
                              inputTokenInfo.market_data?.current_price.usd
                            )}
                          </div>
                        ) : null
                      }
                      {
                        // @ts-ignore
                        inputTokenInfo.market_data // @ts-ignore
                          ?.price_change_percentage_24h ? (
                          <div
                            id="selectnumber1"
                            className={`${
                              inputTokenInfo.market_data // @ts-ignore
                                .price_change_percentage_24h >= 0
                                ? 'green'
                                : 'red'
                            }`}
                          >
                            {
                              // @ts-ignore
                              inputTokenInfo.market_data.price_change_percentage_24h.toFixed(
                                2
                              )
                            }
                            %
                          </div>
                        ) : null
                      }
                    </div>
                    <ChevronDownIcon
                      style={{ height: '30px' }}
                      className={`default-transition text-th-fgd-3 ${
                        open ? 'transform rotate-180' : 'transform rotate-360'
                      }`}
                    />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel>
                  <div
                    className="pt-1 p-3 border border-t-0  rounded-b-md"
                    style={{ border: '1px solid #C8C8C8', borderTop: '0px' }}
                  >
                    <div style={{ fontSize: '18px' }}>Market data</div>
                    <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                      {
                        // @ts-ignore
                        inputTokenInfo.market_cap_rank ? (
                          <div
                            className="m-1  rounded-md "
                            style={{
                              border: '1px solid #C8C8C8',
                              height: '55px',
                              padding: '5px 7px',
                            }}
                          >
                            <div style={{ fontSize: '14px' }}>
                              market-cap-rank
                            </div>
                            <div
                              style={{ fontSize: '18px', fontWeight: '500' }}
                            >
                              #
                              {
                                // @ts-ignore
                                inputTokenInfo.market_cap_rank
                              }
                            </div>
                          </div>
                        ) : null
                      }
                      {
                        // @ts-ignore
                        inputTokenInfo.market_data?.market_cap &&
                        // @ts-ignore
                        inputTokenInfo.market_data?.market_cap?.usd !== 0 ? (
                          <div
                            className="p-3 m-1 rounded-md "
                            style={{
                              border: '1px solid #C8C8C8',
                              height: '55px',
                              padding: '5px 7px',
                            }}
                          >
                            <div style={{ fontSize: '14px' }}>market-cap</div>
                            <div
                              style={{ fontSize: '18px', fontWeight: '500' }}
                            >
                              $
                              {
                                // @ts-ignore
                                numberCompacter.format(
                                  // @ts-ignore
                                  inputTokenInfo.market_data?.market_cap?.usd
                                )
                              }
                            </div>
                          </div>
                        ) : null
                      }
                      {
                        // @ts-ignore
                        inputTokenInfo.market_data?.total_volume?.usd ? (
                          <div
                            className="p-3 m-1 rounded-md"
                            style={{
                              border: '1px solid #C8C8C8',
                              height: '55px',
                              padding: '5px 7px',
                            }}
                          >
                            <div style={{ fontSize: '14px' }}>daily-volume</div>
                            <div
                              style={{ fontSize: '18px', fontWeight: '500' }}
                            >
                              $
                              {numberCompacter.format(
                                // @ts-ignore
                                inputTokenInfo.market_data?.total_volume?.usd
                              )}
                            </div>
                          </div>
                        ) : null
                      }
                      {
                        // @ts-ignore
                        inputTokenInfo.market_data?.circulating_supply ? (
                          <div
                            className="p-3 m-1  rounded-md "
                            style={{
                              border: '1px solid #C8C8C8',
                              height: '55px',
                              padding: '5px 7px',
                            }}
                          >
                            <div style={{ fontSize: '14px' }}>token-supply</div>
                            <div
                              style={{ fontSize: '18px', fontWeight: '500' }}
                            >
                              {numberCompacter.format(
                                // @ts-ignore
                                inputTokenInfo.market_data.circulating_supply
                              )}
                            </div>
                            {
                              // @ts-ignore
                              inputTokenInfo.market_data?.max_supply ? (
                                <div className="text-xs text-th-fgd-2">
                                  max-supply:
                                  {
                                    // @ts-ignore
                                    numberCompacter.format(
                                      // @ts-ignore
                                      inputTokenInfo.market_data.max_supply
                                    )
                                  }
                                </div>
                              ) : null
                            }
                          </div>
                        ) : null
                      }
                      {
                        // @ts-ignore
                        inputTokenInfo.market_data?.ath?.usd ? (
                          <div
                            className="p-3 m-1  rounded-md "
                            style={{
                              border: '1px solid rgba(200, 200, 200, 1)',
                              height: '55px',
                              padding: '5px 7px',
                            }}
                          >
                            <div style={{ fontSize: '14px' }}>ath</div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '18px',
                                    fontWeight: '500',
                                  }}
                                >
                                  $
                                  {numberFormatter.format(
                                    // @ts-ignore
                                    inputTokenInfo.market_data.ath.usd
                                  )}
                                </div>

                                {
                                  // @ts-ignore
                                  inputTokenInfo.market_data
                                    ?.ath_change_percentage?.usd ? (
                                    <div
                                      style={{
                                        fontSize: '12px',
                                        fontWeight: '500',
                                      }}
                                      className={`mt-1.5 ml-1.5  ${
                                        // @ts-ignore
                                        inputTokenInfo.market_data
                                          ?.ath_change_percentage?.usd >= 0
                                          ? 'green'
                                          : 'red'
                                      }`}
                                    >
                                      {(inputTokenInfo.market_data?.ath_change_percentage?.usd) // @ts-ignore
                                        .toFixed(2)}
                                      %
                                    </div>
                                  ) : null
                                }
                              </div>

                              {
                                // @ts-ignore
                                inputTokenInfo.market_data?.ath_date?.usd ? (
                                  <div
                                    style={{ fontSize: '12px' }}
                                    className="fsa"
                                  >
                                    {dayjs(
                                      // @ts-ignore
                                      inputTokenInfo.market_data.ath_date.usd
                                    ).fromNow()}
                                  </div>
                                ) : null
                              }
                            </div>
                          </div>
                        ) : null
                      }
                      {
                        // @ts-ignore
                        inputTokenInfo.market_data?.atl?.usd ? (
                          <div
                            className="p-3 m-1  rounded-md "
                            style={{
                              border: '1px solid rgba(200, 200, 200, 1)',
                              height: '55px',
                              padding: '5px 7px',
                            }}
                          >
                            <div style={{ fontSize: '14px' }}>atl</div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '18px',
                                    fontWeight: '500',
                                  }}
                                >
                                  $
                                  {
                                    // @ts-ignore
                                    numberFormatter.format(
                                      // @ts-ignore
                                      inputTokenInfo.market_data.atl.usd
                                    )
                                  }
                                </div>

                                {
                                  // @ts-ignore
                                  inputTokenInfo.market_data
                                    ?.atl_change_percentage?.usd ? (
                                    <div
                                      style={{
                                        fontSize: '12px',
                                        fontWeight: '500',
                                      }}
                                      className={`ml-1.5 mt-1.5  ${
                                        // @ts-ignore
                                        inputTokenInfo.market_data
                                          ?.atl_change_percentage?.usd >= 0
                                          ? 'green'
                                          : 'red'
                                      }`}
                                    >
                                      {(inputTokenInfo.market_data?.atl_change_percentage?.usd).toLocaleString(
                                        undefined,
                                        {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 2,
                                        }
                                      )}
                                      %
                                    </div>
                                  ) : null
                                }
                              </div>
                              {
                                // @ts-ignore
                                inputTokenInfo.market_data?.atl_date?.usd ? (
                                  <div
                                    style={{ fontSize: '12px' }}
                                    className="fsa"
                                  >
                                    {dayjs(
                                      // @ts-ignore
                                      inputTokenInfo.market_data.atl_date.usd
                                    ).fromNow()}
                                  </div>
                                ) : null
                              }
                            </div>
                          </div>
                        ) : null
                      }
                    </div>
                    {
                      // @ts-ignore
                      topHolders?.inputHolders ? (
                        <div className="pt-4">
                          <div className="pb-3 m-1 text-base font-bold text-th-fgd-1">
                            top-ten
                          </div>
                          {
                            // @ts-ignore
                            topHolders.inputHolders.map((holder) => (
                              <a
                                className="border-t border-th-bkg-4 default transition flex justify-between mx-1 px-2 py-2.5 text-th-fgd-3 hover:bg-th-bkg-2"
                                href={`https://explorer.solana.com/address/${holder.owner}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={holder.owner}
                              >
                                <div className="text-th-fgd-3">
                                  {holder.owner.slice(0, 5) +
                                    '…' +
                                    holder.owner.slice(-5)}
                                </div>
                                <div className="flex items-center">
                                  <div className="text-th-fgd-1">
                                    {numberFormatter.format(
                                      holder.amount /
                                        Math.pow(10, holder.decimals)
                                    )}
                                  </div>
                                  <ExternalLinkIcon className="w-4 h-4 ml-2" />
                                </div>
                              </a>
                            ))
                          }
                        </div>
                      ) : null
                    }
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ) : (
        <div className="p-4 mt-3 text-center rounded-md bg-th-bkg-3 text-th-fgd-3"></div>
      )}

      {/*      {outputTokenInfo && quoteTokenId ? (*/}
      <div className="w-full">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`default-transition flex items-center justify-between mt-2 p-2 rounded-md w-full hover:bg-th-bkg-2 ${
                  open
                    ? 'borderD1 rounded-b-none'
                    : 'borderD transform rotate-360'
                }`}
              >
                <div className="flex items-center">
                  {
                    // @ts-ignore
                    outputTokenInfo?.image?.small ? (
                      <img
                        className="rounded-full" // @ts-ignore
                        src={outputTokenInfo?.image?.small}
                        width="38"
                        height="40" // @ts-ignore
                        alt={outputTokenInfo?.name}
                      />
                    ) : null
                  }
                  <div className="ml-2.5 text-left">
                    <h2 className="selecttokenname">
                      {
                        // @ts-ignore
                        outputTokenInfo?.symbol?.toUpperCase()
                      }
                    </h2>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {
                      // @ts-ignore
                      outputTokenInfo?.market_data?.current_price?.usd ? (
                        <div className="selectnumber">
                          $
                          {numberFormatter.format(
                            // @ts-ignore
                            outputTokenInfo?.market_data.current_price.usd
                          )}
                        </div>
                      ) : null
                    }
                    {
                      // @ts-ignore
                      outputTokenInfo?.market_data
                        ?.price_change_percentage_24h ? (
                        <div
                          id="selectnumber1"
                          className={`${
                            // @ts-ignore
                            outputTokenInfo.market_data
                              .price_change_percentage_24h >= 0
                              ? 'green'
                              : 'red'
                          }`}
                        >
                          {
                            // @ts-ignore
                            outputTokenInfo?.market_data.price_change_percentage_24h.toFixed(
                              2
                            )
                          }
                          %
                        </div>
                      ) : null
                    }
                  </div>
                  <ChevronDownIcon
                    style={{ height: '30px' }}
                    className={`default-transition text-th-fgd-3 ${
                      open ? 'transform rotate-180' : 'transform rotate-360'
                    }`}
                  />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div
                  className="pt-1 p-3 border border-t-0 border-th-bkg-4 rounded-b-md"
                  style={{ border: '1px solid #fff', borderTop: '0px' }}
                >
                  <div style={{ fontSize: '18px' }}>Market data</div>
                  <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                    {
                      // @ts-ignore
                      outputTokenInfo?.market_cap_rank ? (
                        <div
                          className="p-3 m-1 rounded-md "
                          style={{
                            border: '1px solid rgba(200, 200, 200, 1)',
                            height: '55px',
                            padding: '5px 7px',
                          }}
                        >
                          <div style={{ fontSize: '14px' }}>
                            market-cap-rank
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: '500' }}>
                            #
                            {
                              // @ts-ignore
                              outputTokenInfo?.market_cap_rank
                            }
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      // @ts-ignore
                      outputTokenInfo?.market_data?.market_cap && // @ts-ignore
                      outputTokenInfo?.market_data?.market_cap?.usd !== 0 ? (
                        <div
                          className="p-3 m-1 rounded-md "
                          style={{
                            border: '1px solid rgba(200, 200, 200, 1)',
                            height: '55px',
                            padding: '5px 7px',
                          }}
                        >
                          <div className="text-xs text-th-fgd-3">
                            market-cap
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: '500' }}>
                            $
                            {numberCompacter.format(
                              // @ts-ignore
                              outputTokenInfo?.market_data?.market_cap?.usd
                            )}
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      // @ts-ignore
                      outputTokenInfo?.market_data?.total_volume?.usd ? (
                        <div
                          className="p-3 m-1 rounded-md "
                          style={{
                            border: '1px solid rgba(200, 200, 200, 1)',
                            height: '55px',
                            padding: '5px 7px',
                          }}
                        >
                          <div style={{ fontSize: '14px' }}>daily-volume</div>
                          <div style={{ fontSize: '18px', fontWeight: '500' }}>
                            $
                            {numberCompacter.format(
                              // @ts-ignore
                              outputTokenInfo?.market_data?.total_volume?.usd
                            )}
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      // @ts-ignore
                      outputTokenInfo?.market_data?.circulating_supply ? (
                        <div
                          className="p-3 m-1 rounded-md "
                          style={{
                            border: '1px solid rgba(200, 200, 200, 1)',
                            height: '55px',
                            padding: '5px 7px',
                          }}
                        >
                          <div style={{ fontSize: '14px' }}>token-supply</div>
                          <div style={{ fontSize: '18px', fontWeight: '500' }}>
                            {numberCompacter.format(
                              // @ts-ignore
                              outputTokenInfo.market_data.circulating_supply
                            )}
                          </div>
                          {
                            // @ts-ignore
                            outputTokenInfo.market_data?.max_supply ? (
                              <div
                                style={{ fontSize: '18px', fontWeight: '500' }}
                              >
                                {' '}
                                {numberCompacter.format(
                                  // @ts-ignore
                                  outputTokenInfo.market_data.max_supply
                                )}
                              </div>
                            ) : null
                          }
                        </div>
                      ) : null
                    }
                    {
                      // @ts-ignore
                      outputTokenInfo?.market_data?.ath?.usd ? (
                        <div
                          className="p-3 m-1 rounded-md "
                          style={{
                            border: '1px solid rgba(200, 200, 200, 1)',
                            height: '55px',
                            padding: '5px 7px',
                          }}
                        >
                          <div style={{ fontSize: '14px' }}>ath</div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <div
                                style={{ fontSize: '18px', fontWeight: '500' }}
                              >
                                $
                                {numberFormatter.format(
                                  // @ts-ignore
                                  outputTokenInfo?.market_data.ath.usd
                                )}
                              </div>
                              {
                                // @ts-ignore
                                outputTokenInfo.market_data
                                  ?.ath_change_percentage?.usd ? (
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      fontWeight: '500',
                                    }}
                                    className={`ml-1.5 mt-1.5 text-xs ${
                                      // @ts-ignore
                                      outputTokenInfo.market_data
                                        ?.ath_change_percentage?.usd >= 0
                                        ? 'green'
                                        : 'red'
                                    }`}
                                  >
                                    {(outputTokenInfo?.market_data?.ath_change_percentage?.usd) // @ts-ignore
                                      .toFixed(2)}
                                    %
                                  </div>
                                ) : null
                              }
                            </div>
                            {
                              // @ts-ignore
                              outputTokenInfo.market_data?.ath_date?.usd ? (
                                <div
                                  style={{ fontSize: '12px' }}
                                  className="fsa"
                                >
                                  {dayjs(
                                    // @ts-ignore
                                    outputTokenInfo.market_data.ath_date.usd
                                  ).fromNow()}
                                </div>
                              ) : null
                            }
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      // @ts-ignore
                      outputTokenInfo?.market_data?.atl?.usd ? (
                        <div
                          className="p-3 m-1 rounded-md "
                          style={{
                            border: '1px solid rgba(200, 200, 200, 1)',
                            height: '55px',
                            padding: '5px 7px',
                          }}
                        >
                          <div style={{ fontSize: '14px' }}>atl</div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <div
                                style={{ fontSize: '18px', fontWeight: '500' }}
                              >
                                $
                                {numberFormatter.format(
                                  // @ts-ignore
                                  outputTokenInfo?.market_data.atl.usd
                                )}
                              </div>
                              {
                                // @ts-ignore
                                outputTokenInfo?.market_data
                                  ?.atl_change_percentage?.usd ? (
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      fontWeight: '500',
                                    }}
                                    className={`ml-1.5 mt-1.5 text-xs ${
                                      // @ts-ignore
                                      outputTokenInfo.market_data
                                        ?.atl_change_percentage?.usd >= 0
                                        ? 'green'
                                        : 'red'
                                    }`}
                                  >
                                    {(outputTokenInfo?.market_data?.atl_change_percentage?.usd) // @ts-ignore
                                      .toLocaleString(undefined, {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                      })}
                                    %
                                  </div>
                                ) : null
                              }
                            </div>
                            {
                              // @ts-ignore
                              outputTokenInfo?.market_data?.atl_date?.usd ? (
                                <div
                                  style={{ fontSize: '12px' }}
                                  className="fsa"
                                >
                                  {dayjs(
                                    // @ts-ignore
                                    outputTokenInfo?.market_data.atl_date.usd
                                  ).fromNow()}
                                </div>
                              ) : null
                            }
                          </div>
                        </div>
                      ) : null
                    }
                  </div>
                  {
                    // @ts-ignore
                    topHolders?.outputHolders ? (
                      <div className="pt-4">
                        <div className="pb-3 m-1 text-base font-bold text-th-fgd-1">
                          top-ten
                        </div>
                        {
                          // @ts-ignore
                          topHolders.outputHolders.map((holder) => (
                            <a
                              className="border-t border-th-bkg-4 default transition flex justify-between mx-1 px-2 py-2.5 text-th-fgd-3 hover:bg-th-bkg-2"
                              href={`https://explorer.solana.com/address/${holder.owner}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={holder.owner}
                            >
                              <div className="text-th-fgd-3">
                                {holder.owner.slice(0, 5) +
                                  '…' +
                                  holder.owner.slice(-5)}
                              </div>
                              <div className="flex items-center">
                                <div className="text-th-fgd-1">
                                  {numberFormatter.format(
                                    holder.amount /
                                      Math.pow(10, holder.decimals)
                                  )}
                                </div>
                                <ExternalLinkIcon className="w-4 h-4 ml-2" />
                              </div>
                            </a>
                          ))
                        }
                      </div>
                    ) : null
                  }
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  )
}

export default SwapTokenInfo
