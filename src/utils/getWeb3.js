import Web3 from 'web3'

const getWeb3 = async () => {
  if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
    window.ethereum.enable()
    web3 = new Web3(window.ethereum)
  }else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider)
  }
  const result = {
    injectedWeb3: true,
    web3 () {
      return web3
    }
  }
  result.networkId = await web3.eth.net.getId()
  result.coinbase = await web3.eth.getCoinbase()
  result.balance = await web3.eth.getBalance(result.coinbase)
  return result
}

export default getWeb3