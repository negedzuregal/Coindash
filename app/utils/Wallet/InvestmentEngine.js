import { ETHTransaction, ERC20Data } from './ETHTransaction';
import { ETHWallet } from './Wallet';
import { Token } from './Token';

export class InvestmentEngine {
	constructor(wallet) {    
	    this.wallet = wallet;
	}

	fetchInvestmentsForAccount(account, callback) {
		let parentObj = this;
		this.fetchTxsForAccount(account, function(txs, error) {
			if(error != null) {

			}
			else {
				for(let idx in txs) {
					let tx = txs[idx];
					tx.tokenTransaction = parentObj.wallet.findTokenICOInvestment(tx);
					let erc20Data = tx.getERC20Data();
					if (erc20Data != null) {
						// buyin
						if (erc20Data.type === ERC20Data.OperationType().Buyin) {
							console.log("Bought " + tx.tokenTransaction.prettyName() + " for " + erc20Data.value + " ETH");
						}

						// transfer
						else if (erc20Data.type === ERC20Data.OperationType().Transfer) {
							console.log("Transfered " + erc20Data.value + " from " + tx.tokenTransaction.prettyName());
						}
					}
				}
			}
		});
	}

	fetchTxsForAccount(account, callback) {
		let prefix = "http://api.etherscan.io/api?module=account&action=txlist&address="
		let suffix = "&startblock=0&endblock=99999999&sort=asc&apikey=38DE12F4P7CNASZBM3RRAEWPHJKMWQD2NU";
		let serverUrl = prefix + account + suffix;

	    let parentObj = this;

	    fetch(serverUrl, {
	      method: 'get',
	    })
	    .then((response) => response.json())
	    .then((data) => {
	      if (data.status === "1") {
	      	let _txs = [];
	      	for (let idx in data.result) {
	      		_txs.push(ETHTransaction.fromEtherscanDic(data.result[idx]));
	      	}

	      	callback(_txs, null);
	      }
	      else {
	      	// handle error
	      }
	    })
	    .catch((error) => {
	      console.error(error);
	    });
	}
}