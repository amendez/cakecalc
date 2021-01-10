import getWeb3 from '../../utils/getWeb3'
import getContract from '../../utils/getContract'

export function registerWeb3 ({commit}) {
    console.debug('registerWeb3 Action being executed')
    return getWeb3().then(result => {
        console.debug('committing result to registerWeb3Instance mutation')
        return commit('registerWeb3Instance', result)
    }).catch(e => {
        console.debug('error in action registerWeb3', e)
    })
}

export function getContractInstance ({commit}) {
    console.debug("getContractInstance", getContract)
    
    const poolPromise = getContract.getPoolContract().then(result => {
        console.debug("pool contractInstance", result)
        return commit('registerPoolContractInstance', result)
    }).catch(e => console.debug(e))
    
    const cakePromise = getContract.getCakeContract().then(result => {
        console.debug("cake contractInstance", result)
        return commit('registerCakeContractInstance', result)
    }).catch(e => console.debug(e))

    const swapPromise = getContract.getSwapContract().then(result => {
        console.debug("seap contractInstance", result)
        return commit('registerSwapContractInstance', result)
    }).catch(e => console.debug(e))

    return Promise.all([poolPromise, cakePromise, swapPromise])
}