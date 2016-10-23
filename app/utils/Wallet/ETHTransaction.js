
import { Token } from './Token';
import BigNumber from 'bignumber.js';

export class ERC20Data {
	static OperationType() {
		return {
			"Transfer": 1,
			"Balance": 2,
			"Buyin": 3
		};
	}

	constructor(type, account, value) {
		this.type = type;
		this.account = account;
		this.value = value;
	}
}

export class ETHTransaction {
	constructor(blockNumber,
		timeStamp,
		hash,
		txIdx,
		from,
		to,
		value,
		gas,
		input,
		contractAddress,
		confirmations) {

		this.blockNumber = blockNumber;
		this.timeStamp = timeStamp;
		this.hash = hash;
		this.txIdx = txIdx;
		this.from = from;
		this.to = to;
		this.value = value;
		this.gas = gas;
		this.input = input;
		this.contractAddress = contractAddress;
		this.confirmations = confirmations;

		// if this tx is for a token contract this var will hold that token
		this.tokenTransaction = null;

		this.isICOBuyin = false;
	}

	// TODO - refactor to ont use Token
	weiBalance() {
		let t = new Token('', '', "ETH", 0);
		t.balance = this.value;
		return t.weiBalance();
	}

	getERC20Data() {
		if (this.tokenTransaction == null) { return null; }

		// buyin
		if (this.input === "0x") {
			return new ERC20Data(ERC20Data.OperationType().Buyin,
				this.from,
				this.weiBalance());
		}

		// transfer tokens
		if(this.input.startsWith(this.tokenTransaction.transferHex)) {
			let idxStart = this.tokenTransaction.transferHex.length + 64;
			let balanceHex = "0x" + this.input.substring(idxStart);
			
			let decimal = this.tokenTransaction.decimal;
			let _balance = new BigNumber(balanceHex).div(new BigNumber(10).pow(decimal));

			return new ERC20Data(ERC20Data.OperationType().Transfer,
				this.input.substring(this.tokenTransaction.transferHex.length, this.tokenTransaction.transferHex.length + 64),
				_balance.toString(10));
		}

		return null;
	}

	static fromEtherscanDic(data) {
		return new ETHTransaction(
				data.blockNumber,
				data.timeStamp,
				data.hash,
				data.transactionIndex,
				data.from,
				data.to,
				data.value,
				data.gas,
				data.input,
				data.contractAddress,
				data.confirmations
			);
	}
}