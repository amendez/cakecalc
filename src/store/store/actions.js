import getWeb3 from '../../utils/getWeb3'
import contracts from '../../utils/getContract'

export function registerWeb3 ({commit}) {
    console.debug('registerWeb3 Action being executed')
    return getWeb3().then(result => {
        console.debug('committing result to registerWeb3Instance mutation')
        return commit('registerWeb3Instance', result)
    }).catch(e => {
        console.debug('error in action registerWeb3', e)
    })
}

export function getContractInstance ({commit, state}) {
    const web3 = state.web3.web3Instance()
    commit('registerPoolContractInstance', contracts.getPoolContract(web3))
    commit('registerCakeContractInstance', contracts.getCakeContract(web3))
    commit('registerSwapContractInstance', contracts.getSwapContract(web3))
    commit('registerPancakeProfileContractInstance', contracts.getPancakeProfileContract(web3))
}