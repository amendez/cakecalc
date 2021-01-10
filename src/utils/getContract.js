import Web3 from 'web3'
import pool from './constants/poolContract'
import cake from './constants/cakeContract'
import swap from './constants/swapContract'

let getPoolContract = () => new Promise(function (resolve, reject) {
  if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
    //getting Permission to access. This is for when the user has new MetaMask
    window.ethereum.enable()
    web3 = new Web3(window.ethereum)
  
  }else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider)
    // Acccounts always exposed. This is those who have old version of MetaMask
  
  }
  // let contract = web3.eth.contract(ABI)
  // let contractInstance = contract.at(address)
  
  const contract = new web3.eth.Contract(pool.ABI, pool.address, {});
  resolve(contract)
})

let getCakeContract = () => new Promise(function (resolve, reject) {
  if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
    //getting Permission to access. This is for when the user has new MetaMask
    window.ethereum.enable()
    web3 = new Web3(window.ethereum)
  
  }else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider)
    // Acccounts always exposed. This is those who have old version of MetaMask
  
  }
  // let contract = web3.eth.contract(ABI)
  // let contractInstance = contract.at(address)
  
  const contract = new web3.eth.Contract(cake.ABI, cake.address, {});
  resolve(contract)
})

let getSwapContract = () => new Promise(function (resolve, reject) {
  if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
    //getting Permission to access. This is for when the user has new MetaMask
    window.ethereum.enable()
    web3 = new Web3(window.ethereum)
  
  }else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider)
    // Acccounts always exposed. This is those who have old version of MetaMask
  
  }
  // let contract = web3.eth.contract(ABI)
  // let contractInstance = contract.at(address)
  
  const contract = new web3.eth.Contract(swap.ABI, swap.address, {});
  resolve(contract)
})

export default {getPoolContract, getCakeContract, getSwapContract}