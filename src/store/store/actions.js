import getWeb3 from '../../utils/getWeb3'
import contracts from '../../utils/getContract'

export async function registerWeb3 ({commit}) {
    try {
        const result = await getWeb3()
        if (result && result.injectedWeb3){
            return commit('registerWeb3Instance', result)
        }
    }
    catch (e){
        console.error('Error in action registerWeb3', e)
    }
}

export function getContractInstance ({commit, state}) {
    const web3 = state.web3.web3Instance()
    commit('registerPoolContractInstance', contracts.getPoolContract(web3))
    commit('registerCakeContractInstance', contracts.getCakeContract(web3))
    commit('registerSwapContractInstance', contracts.getSwapContract(web3))
    commit('registerPancakeProfileContractInstance', contracts.getPancakeProfileContract(web3))
}