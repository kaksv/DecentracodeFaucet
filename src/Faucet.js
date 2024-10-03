// src/Faucet.js
import React, { useState, useEffect } from 'react'
import Web3 from 'web3'
import './Faucet.css' // Import CSS for styling
import abi from './faucet.json'
const Faucet = () => {
  const [account, setAccount] = useState(null)
  const [amount, setAmount] = useState(0.01) // Default amount to request
  const [transactionHash, setTransactionHash] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [lastRequestTime, setLastRequestTime] = useState(null)

  // Initialize Web3
  const web3 = new Web3(window.ethereum)

  // useEffect(() => {
  //   // Check local storage for last request time
  //   const storedTime = localStorage.getItem('lastRequestTime')
  //   if (storedTime) {
  //     setLastRequestTime(new Date(storedTime))
  //   }
  // }, [])
  // const contractAddress = '0x29f712B1e54E4109bF324F87B75a8a057Cedb3db'
  const contractAddress = '0x31df5968330898A6008fd1De83a0612629378B84'

  const contract = new web3.eth.Contract(abi, contractAddress)

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await web3.eth.requestAccounts()
        setAccount(accounts[0])
        setErrorMessage('')
      } catch (error) {
        console.error('Connection failed:', error)
        setErrorMessage('Connection failed: ' + error.message)
      }
    } else {
      setErrorMessage('Please install MetaMask!')
    }
  }

  const requestFunds = async () => {
    if (!account) {
      alert('Please connect your wallet first.')
      return
    }

    try {
      const accounts = await web3.eth.requestAccounts()

      const result = await contract.methods.claim().send({
        from: accounts[0],
        // ,
        //  value: web3.utils.toWei(amount, 'ether')
      })
    } catch (error) {
      console.error('Transaction failed:', error)
      setErrorMessage('Transaction failed: ' + error.message)
    }
  }

  return (
    <div className="faucet-container">
      <h1>Sepolia Faucet | Decentracode.</h1>
      <button className="connect-button" onClick={connectWallet}>
        {account
          ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
          : 'Connect Wallet'}
      </button>
      <div className="form-group">
        <label>You will Receive 0.01 (ETH):</label>
        {/* <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.01"
          className="amount-input"
          readOnly // Make it read-only since we want to limit to 0.01 ETH
        /> */}
      </div>
      <button className="request-button" onClick={requestFunds}>
        Request Funds
      </button>
      {transactionHash && (
        <p className="success-message">Transaction Hash: {transactionHash}</p>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  )
}

export default Faucet
