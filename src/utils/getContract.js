import Web3 from 'web3'
import pool from './constants/poolContract'
import cake from './constants/cakeContract'
import swap from './constants/swapContract'
import pancakeProfile from './constants/pancakeProfileContract'

const getPoolContract = (web3) => new web3.eth.Contract(pool.ABI, pool.address, {})

const getCakeContract = (web3) => new web3.eth.Contract(cake.ABI, cake.address, {})

const getSwapContract = (web3) => new web3.eth.Contract(swap.ABI, swap.address, {})

const getPancakeProfileContract = (web3) => new web3.eth.Contract(pancakeProfile.ABI, pancakeProfile.address, {})

export default {getPoolContract, getCakeContract, getSwapContract, getPancakeProfileContract}