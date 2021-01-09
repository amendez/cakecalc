export default function () {
  return {
    web3: {
      isInjected: false,
      web3Instance: null,
      networkId: null,
      coinbase: null,
      balance: null,
      error: null
    },
    contractInstance: null,
    cakeContractInstance: null,
    swapContractInstance: null,
  }
}
