import { Token } from './Token';
import { ETHTransaction } from './ETHTransaction';

export class ETHWallet {
	static walletFromDisk() {
		return new ETHWallet();
	}

	constructor(props) {    
	    this.walletAddresses = [
	    	"0xd7e10d75cf87abc5a2f34a83ccf27cd54108cbc3"
	    ];
	}

	// tokens
	getTokens() {
		var allTokens = ETHWallet.allTokens();
	    var _tokens = [];
	    for (var i = 0; i < allTokens.length; i++) {
	      let address = allTokens[i].address;
	      let symbol = allTokens[i].symbol;
	      let decimal = allTokens[i].decimal;

	      if (address == null || symbol == null || decimal == null) continue;

	      for (let idx in this.walletAddresses) {
	      	_tokens.push(new Token(allTokens[i].address,
	                             this.walletAddresses[idx], 
	                             allTokens[i].symbol, 
	                             allTokens[i].decimal)
	                  );
	      }
	    }
	    return _tokens;
	}

	addToken(token) {
		this.addToken(token.symbol, token.contractAddress, token.decimal);
	}

	addToken(symbol, address, decimal) {
		console.log("adding token with symbol: " + symbol + ", address: " + address + ", decimal: " + decimal);
		var tokens = Wallet.savedTokens() 
		tokens.push({
					address: address,
					symbol: symbol,
					decimal: decimal
				});
		localStorage.setItem("localTokens",JSON.stringify(tokens));
	}

	findTokenICOTrade(tx) {
		let allTokens = this.getTokens();
		for(let idx in allTokens) {
			let tokenAddress = allTokens[idx].contractAddress.replace('0x','');
			let txTo = tx.to.replace('0x','');
			if(tokenAddress === txTo) {
				return allTokens[idx];
			}
		}
		return null;
	}

	static allTokens() {
		return ETHWallet.savedTokens().concat(Token.hardcodedTokes());
	}


	static savedTokens() {
	    return localStorage.getItem("localTokens") != null ? JSON.parse(localStorage.getItem("localTokens")) : [];
	}
}

const Wallet = ETHWallet.walletFromDisk();
export default Wallet;