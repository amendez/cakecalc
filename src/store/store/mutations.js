export function registerWeb3Instance (state, payload) {
    console.debug('registerWeb3instance Mutation being executed', payload)
    let result = payload
    let web3Copy = state.web3
    web3Copy.coinbase = result.coinbase
    web3Copy.networkId = result.networkId
    web3Copy.balance = parseInt(result.balance, 10)
    web3Copy.isInjected = result.injectedWeb3
    web3Copy.web3Instance = result.web3
    state.web3 = web3Copy
}

export function registerPoolContractInstance (state, payload) {
    console.debug('Pool contract instance: ', payload)
    state.contractInstance = () => payload
}

export function registerCakeContractInstance (state, payload) {
    console.debug('Cake contract instance: ', payload)
    state.cakeContractInstance = () => payload
}

export function registerSwapContractInstance (state, payload) {
    console.debug('Swap contract instance: ', payload)
    state.swapContractInstance = () => payload
}