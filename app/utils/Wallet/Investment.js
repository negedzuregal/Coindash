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
	constructor(id, type, lhsToken, lhsValue, rhsToken, rhsValue) {
		this.id = id;
		this.type = type;
		this.lhsToken = lhsToken;
		this.lhsValue = lhsValue;
		this.rhsToken = rhsToken;
		this.rhsValue = rhsValue;
	}

	constructor(type, lhsToken, lhsValue, rhsToken, rhsValue) {
		this((Math.random()*1e32).toString(36),
			type,
			lhsToken,
			lhsValue,
			rhsToken,
			rhsValue);
	}

	serialize() {
		return {
			"id": this.id,
			"type": this.type,
			"lhsToken": this.lhsToken.serialize(),
			"lhsValue": this.lhsValue,
			"rhsToken": this.rhsToken.serialize(),
			"rhsValue": this.rhsValue
		};
	}

	static fromDic(dic) {
		return new Investment(
				dic.id,
				dic.type,
				Token.fromDic(dic.lhsToken),
				dic.lhsValue,
				Token.fromDic(dic.rhsToken),
				dic.rhsValue
			);
	}
}