import { Token } from './Token';

export class Investment {
	static Types() {
		return {
			"Buy": 1,
			"Sell": 2
		};
	}

	// example
	// Buy) i bought for 10 eth, 11 DAO
	// Sell) i sold for 10 eth, 5 DAO
	constructor(type, lhsToken, lhsValue, rhsToken, rhsValue, timestamp) {
		this.id = Math.random().toString(36);
		this.type = type;
		this.lhsToken = lhsToken;
		this.lhsValue = lhsValue;
		this.rhsToken = rhsToken;
		this.rhsValue = rhsValue;
		this.timestamp = timestamp;
	}

	serialize() {
		return {
			"id": this.id,
			"type": this.type,
			"lhsToken": this.lhsToken.serialize(),
			"lhsValue": this.lhsValue,
			"rhsToken": this.rhsToken.serialize(),
			"rhsValue": this.rhsValue,
			"timestamp": this.timestamp
		};
	}

	static fromDic(dic) {
		let ret =  new Investment(
				dic.type,
				Token.fromDic(dic.lhsToken),
				dic.lhsValue,
				Token.fromDic(dic.rhsToken),
				dic.rhsValue,
				dic.timestamp
			);
		ret.id = dic.id;
		return ret;
	}

	static fromETC20(erc20Data) {
		// currently we only support buyin of ICO token
		 	let ret = new Investment(
				Investment.Types().Buy,
				Token.ETH(),
				erc20Data.value,
				erc20Data.tx.tokenTransaction,
				"--", // currently we can't know the amount of tokens bought
				erc20Data.timestamp
			);
			ret.id = erc20Data.tx.nonce;
			return ret;
	}
}