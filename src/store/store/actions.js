import getWeb3 from '../../utils/getWeb3'
import getContract from '../../utils/getContract'

export function registerWeb3 ({commit}) {
    console.debug('registerWeb3 Action being executed')
    getWeb3.then(result => {
        console.debug('committing result to registerWeb3Instance mutation')
        commit('registerWeb3Instance', result)
    }).catch(e => {
        console.debug('error in action registerWeb3', e)
    })
}

export function getContractInstance ({commit}) {
    console.debug("getContractInstance", getContract)
    
    getContract.getPoolContract.then(result => {
        console.debug("pool contractInstance", result)
        commit('registerPoolContractInstance', result)
    }).catch(e => console.debug(e))
    
    getContract.getCakeContract.then(result => {
        console.debug("cake contractInstance", result)
        commit('registerCakeContractInstance', result)
    }).catch(e => console.debug(e))

    getContract.getSwapContract.then(result => {
        console.debug("seap contractInstance", result)
        commit('registerSwapContractInstance', result)
    }).catch(e => console.debug(e))
}