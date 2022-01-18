import { 
    chain, order, contract, token, accounts
} from '../config/local.json';
import { ethers } from "ethers";
import { BigNumber } from '@ethersproject/bignumber';
import * as readline from 'readline';
import { TransactionRequest } from '@ethersproject/abstract-provider';

const orderSize = order.size;
const minimumTokens = order.expected_tokens;
const { admin } = accounts;

const bscProvider = new ethers.providers.JsonRpcProvider(
    chain.nodes.configure,
    {
        chainId: chain.id,
        name: chain.name,
    }
)

async function configureTrigger(token: ethers.Contract, pair: string): Promise<void> {
    const triggerAdminWallet = new ethers.Wallet(admin, bscProvider)
    const triggerAbi = [
        "function getSnipeConfiguration() external view returns(address, uint, address, uint, bool)",
    ]
    const trigger = new ethers.Contract(contract.trigger, triggerAbi, triggerAdminWallet)
    const orderAmount = BigNumber.from(orderSize * 1000).mul(BigNumber.from(10).pow(15)) // orderSize can have up to 3 decimal places
    const gasPrice = await bscProvider.getGasPrice()

    let ok = await trigger.getSnipeConfiguration()
    if (!ok) {
        console.log('[ERROR] Halting.')
        return
    }
    console.log(ok)
}

async function readTrigger(): Promise<void> {
    const erc20Abi = [
        "function symbol() view returns (string)",
    ]
    const erc20 = new ethers.Contract(token.address, erc20Abi, bscProvider)
    const tokenSymbol = await erc20.symbol()

    console.log('[INFO] Read trigger info')
    await configureTrigger(erc20, token.pair_address)
}

readTrigger()