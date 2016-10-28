import crypto from 'crypto-js'
import { AjaxUtils } from '../AjaxUtils';
import poloniexJson from './pt.json'
import { Trade } from './Trade';
import { Token } from './Token';

const version         = '0.0.6';
const PUBLIC_API_URL  = 'https://poloniex.com/public';
const PRIVATE_API_URL = 'https://poloniex.com/tradingApi';
const USER_AGENT      = 'poloniex.js ' + version;

export class PoloniexAPI {
	constructor(secret, api_key) {  
	    this.secret = secret;
	    this.api_key = api_key;
	}

	getHeaderSig(paramString) {
		if (!this.api_key || !this.secret) {
            throw 'Poloniex: Error. API key and secret required';
        }
        return crypto.HmacSHA512(paramString, this.secret).toString(crypto.enc.Hex);
	}

	getURIParams(command, parameters) {
		parameters = {};
		parameters.nonce = Math.floor(Date.now() * 1000);
		parameters.start = "1420070400";
		parameters.end = "1477571939";
		parameters.command = command;
		parameters.currencyPair="all"

		return AjaxUtils.queryParams(parameters);
	}

	userAgent() {
		return USER_AGENT;
	}

	makeAuthenticatedCall(command, parameters, callback) {
		let data = this.getURIParams(command, parameters);
		let sig = this.getHeaderSig(data);

		let parentObj = this;
		this.fetchAPIReq(PRIVATE_API_URL, 
			{
	      	"Content-Type": "application/x-www-form-urlencoded",
	      	"Sign": sig,
	      	"Key": this.api_key,
	      	},
	      	data, 
	      	function(data, error) {
	      		if (error == null) {
	      			parentObj.parsePoloniexData(data, callback);
	      		}
	      		else {

	      		}
	      	});
	}

	parsePoloniexData(data, callback) {
		for(let k in data) {
			let tokens = this.tokensFromCurrencyPair(k);
			let lhs = tokens[0];
			let rhs = tokens[1];

			let trades = data[k];
			for(let idx in trades) {
				let trade = trades[idx];
				if (trade.category === "exchange") {
					console.log(trade);

				}
			}
		}
	}

	tokensFromCurrencyPair(currencyPair) {
		let val = currencyPair.split("_");

		return [
			Token.fromSymbol(val[0]),
			Token.fromSymbol(val[1])
		];
	}

	fetchAPIReq(url, headers, data, callback) {
	    callback(poloniexJson, null);

	    //    fetch(PRIVATE_API_URL, {
	    //   method: 'post',
	    //   headers: {
	    //   	"Content-Type": "application/x-www-form-urlencoded",
	    //   	"Sign": sig,
	    //   	"Key": this.api_key,
	    //   },
	    //   body: data,
	    //   dataType: "json",
	    // })
	    // .then((response) => response.json())
	    // .then((data) => {
	    //   console.log(data);
	    // })
	    // .catch((error) => {
	    //   console.error(error);
	    // });
	}

	// API
	fetchAllTradeHistory(callback) {
		let params = {'currencyPair': 'all'};
		let command = "returnTradeHistory";
		this.makeAuthenticatedCall(command, params, callback);
	}
}