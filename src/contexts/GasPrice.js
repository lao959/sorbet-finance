import { ethers } from 'ethers'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useBlockNumber } from './Application'

const GasContext = createContext()

function useGasContext() {
  return useContext(GasContext)
}

export default function Provider({ children }) {
  const [gasPrice, setGasPrice] = useState()

  const globalBlockNumber = useBlockNumber()

  useEffect(() => {
    fetch("https://www.gasnow.org/api/v3/gas/price?utm_source=gelato-uniswap").then((res) => {
      res.json().then(gasInfo => {
        try {
          setGasPrice(ethers.utils.bigNumberify(gasInfo.data.fast))
        } catch {}
      })
    })
  }, [globalBlockNumber])

  return (
    <GasContext.Provider value={useMemo(() => [gasPrice, { setGasPrice }], [gasPrice, setGasPrice])}>
      {children}
    </GasContext.Provider>
  )
}

export function useGasPrice() {
  const [gasPrice] = useGasContext()
  return gasPrice
}
