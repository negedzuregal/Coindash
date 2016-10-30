
import { Token } from '../Wallet/Token'
import { ExchangeDataFetcherBase } from './ExchangeDataFetcherBase'
import { CoinMarketCapFetcher } from './CoinMarketCapFetcher'

export class ExchangeValuePoint {
	constructor(currency, value) {
		this.currency = currency;
		this.value = value;
	}
}

export class ExchangeDataPoint {
	constructor(timestamp, price, marketCap, volume24H, change1H, change7H, change7D) {
		this.timestamp = timestamp;
		this.price = price;
		this.marketCap = marketCap;
		this.volume24H = volume24H;
		this.change1H = change1H;
		this.change7H = change7H;
		this.change7D = change7D;
	}

	priceForCurrency(currency) {
		return this.valueForKey(this.price, currency);
	}

	volumeForCurrency(currency) {
		return this.valueForKey(this.volume24H, currency);
	}

	capForCurrency(currency) {
		return this.valueForKey(this.marketCap, currency);
	}

	valueForKey(array, currency) {
		for(p in array) {
			if (p.currency === currency) {
				return p.value;
			}
		}

		return null;
	}
}

export class TokenHistoricData {
	constructor(token, dataPoints) {
		this.token = token;
		this.dataPoints = dataPoints.sort(this.sortByData);
	}

	sortByData(a, b) {
		if (a.timestamp < b.timestamp) return -1;
		if (a.timestamp > b.timestamp) return 1;

		return 0;
	}
}

export const FiatUSD = "USD";
export const BTC = "BTC";
export const ETH = "ETH";

export class ExchangeProvider {
	static coinMarketCapProvider() {
		return new ExchangeProvider(new CoinMarketCapFetcher());
	}

	constructor(fetcher) {
		this.fetcher = fetcher;
		this.cachedData = [];
	}

	fetchHistoricalDataForToken(token, callback) {
		let cached = this.findCachedData(token, this.cachedData);
		if (!cached) {
			let parentObj = this;
			this.fetcher.fetch(token, function(historicalData) {
				parentObj.cachedData.push(historicalData);
				callback(historicalData);
			})
		}
		else {
			callback(cached);
		}
	}

	findCachedData(token, cache) {
		for (let idx in cache) {
			let dataPoint = cache[idx];
			if (!dataPoint) continue;
			if (dataPoint.token.symbol === token.symbol) {
				return dataPoint;
			}
		}
		return null;
	}
}