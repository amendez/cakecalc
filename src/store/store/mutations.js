export function registerWeb3Instance (state, payload) {
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
    state.contractInstance = () => payload
}

export function registerCakeContractInstance (state, payload) {
    state.cakeContractInstance = () => payload
}

export function registerSwapContractInstance (state, payload) {
    state.swapContractInstance = () => payload
}

export function registerPancakeProfileContractInstance (state, payload) {
    state.pancakeProfileContractInstance = () => payload
}