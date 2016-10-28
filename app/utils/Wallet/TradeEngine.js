import { ETHTransaction, ERC20Data } from './ETHTransaction';
import { ETHWallet } from './Wallet';
import { Token } from './Token';
import { Trade } from './Trade';
import { PoloniexAPI } from './PoloniexAPI';

export class TradeEngine {
	constructor(wallet) {    
	    this.wallet = wallet;
	}

	getTradess(account) {
		let all = this.savedTrades(account);
		var _trades = [];
		for(let idx in all) {
			let dic = all[idx];
			_trades.push(Trade.fromDic(dic));
		}
		return _trades;
	}

	addTrade(account, trade) {
		let all = this.savedTrades(account);

		// check no duplicate ids
		for (let idx in all) {
			let d = all[idx];
			if (d.id === trade.id) {
				return;
			}
		}

		all.push(trade.serialize());
		this.setTrades(account, all);
	}

	mergeTradesToSaved(account, trades) {
		for (let idx in trades) {
			this.addTrade(account, trades[idx]);
		}

		return this.getTrades(account);
	}

	savedTrades(account) {
		let k = "localTrades_" + account;
		return localStorage.getItem(k) != null ? JSON.parse(localStorage.getItem(k)) : [];
	}

	setTrades(account, trades) {
		let k = "localTrades_" + account;
		return localStorage.setItem(k, JSON.stringify(trades));
	}

	//
	fetchTradesForAccount(account, callback) {
		let parentObj = this;


		// poloniex
		this.fetchPoloniexTrades(function(trades, error) {

		});


		this.fetchICOBuyinTrades(account, function(trades, error) {
			console.log("ICO buyin:");
			console.log(trades);
		});
	}

	fetchPoloniexTrades(callback) {
		let secret = "85d32cf0f1a546ecdb79964f88143c01b6c3e1f8b61f9df0a5c37e71cf541130dbcda31e6916fb5d7a69130b3a8d59425b139aeebec84c63b42e3e91ce68efaf";
		let api_key = "MC2U9AG0-APDRGLJG-NZH42BCA-J71S4KCH";
		let poloniex = new PoloniexAPI(secret, api_key)
		poloniex.fetchAllTradeHistory(function(data, error) {

		});
	}

	fetchICOBuyinTrades(account, callback) {
		let parentObj = this;
		this.fetchTxsForAccount(account, function(txs, error) {
			if(error != null) {
				callback(null, error);
			}
			else {
				let _ret = [];
				for(let idx in txs) {
					let tx = txs[idx];
					tx.tokenTransaction = parentObj.wallet.findTokenICOTrade(tx);
					let erc20Data = tx.getERC20Data();
					if (erc20Data != null) {
						// buyin
						if (erc20Data.type === ERC20Data.OperationType().Buyin) {
							// console.log(erc20Data.timestamp + ") Bought " + tx.tokenTransaction.prettyName() + " for " + erc20Data.value + " ETH");
							_ret.push(Trade.fromETC20(erc20Data));
						}

						// transfer
						// else if (erc20Data.type === ERC20Data.OperationType().Transfer) {
						// 	console.log(erc20Data.timestamp + ") Transfered " + erc20Data.value + " from " + tx.tokenTransaction.prettyName());
						// }
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