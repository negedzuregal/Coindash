import { ETHTransaction, ERC20Data } from './ETHTransaction';
import { ETHWallet } from './Wallet';
import { Token } from './Token';
import { Investment } from './Investment';

export class InvestmentEngine {
	constructor(wallet) {    
	    this.wallet = wallet;
	}

	getInvestments(account) {
		let all = this.savedInvestments(account);
		var _investments = [];
		for(let idx in all) {
			let dic = all[idx];
			_investments.push(Investment.fromDic(dic));
		}
		return _investments;
	}

	addInvestment(account, investment) {
		let all = this.savedInvestments(account);

		// check no duplicate ids
		for (let idx in all) {
			let d = all[idx];
			if (d.id === investment.id) {
				return;
			}
		}

		all.push(investment.serialize());
		this.setInvestments(account, all);
	}

	mergeInvestmentsToSaved(account, investments) {
		for (let idx in investments) {
			this.addInvestment(account, investments[idx]);
		}

		return this.getInvestments(account);
	}

	savedInvestments(account) {
		let k = "localInvestments_" + account;
		return localStorage.getItem(k) != null ? JSON.parse(localStorage.getItem(k)) : [];
	}

	setInvestments(account, investments) {
		let k = "localInvestments_" + account;
		return localStorage.setItem(k, JSON.stringify(investments));
	}

	//
	fetchInvestmentsForAccount(account, callback) {
		let parentObj = this;
		this.fetchTxsForAccount(account, function(txs, error) {
			if(error != null) {
				callback(null, error);
			}
			else {
				let _ret = [];
				for(let idx in txs) {
					let tx = txs[idx];
					tx.tokenTransaction = parentObj.wallet.findTokenICOInvestment(tx);
					let erc20Data = tx.getERC20Data();
					if (erc20Data != null) {
						_ret.push(Investment.fromETC20(erc20Data));
						// buyin
						if (erc20Data.type === ERC20Data.OperationType().Buyin) {
							console.log(erc20Data.timestamp + ") Bought " + tx.tokenTransaction.prettyName() + " for " + erc20Data.value + " ETH");
						}

						// transfer
						else if (erc20Data.type === ERC20Data.OperationType().Transfer) {
							console.log(erc20Data.timestamp + ") Transfered " + erc20Data.value + " from " + tx.tokenTransaction.prettyName());
						}
					}
				}

				callback(_ret, null);
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