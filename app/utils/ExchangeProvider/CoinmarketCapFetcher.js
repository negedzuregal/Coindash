import { ExchangeDataFetcherBase } from './ExchangeDataFetcherBase'
import { ExchangeValuePoint, ExchangeDataPoint, TokenHistoricData } from './ExchangeProvider'

// debugging
import EthData from './CoinMarketCapETHRaw.json';

export class CoinMarketCapFetcher extends ExchangeDataFetcherBase {
	fetch(token, callback) {
		let parentObj = this;
		this.fetchRaw(token, function(raw, error) {
			parentObj.parseRaw(token, raw, callback);
		});
	}

	parseRaw(token, raw, callback) {
		if (!raw) {
			callback(new TokenHistoricData(token, []))
			return;
		};

		let history = raw.history;
		let dataPoints = []
		for (let date in history) {
			let data = history[date];

			let change1H = this.dicToValueArray(data.change1h);
			let change7H = this.dicToValueArray(data.change7h);
			let change7D = this.dicToValueArray(data.change7d);

			let marketCap = this.dicToValueArray(data.marketCap);

			let price = this.dicToValueArray(data.price);

			let volume24H = this.dicToValueArray(data.volume24);

			let timestamp = data.timestamp;

			let dataPoint = new ExchangeDataPoint(timestamp, 
													price,
													marketCap,
													volume24H,
													change1H,
													change7H,
													change7D);

			dataPoints.push(dataPoint);
		}
		let historicalData = new TokenHistoricData(token, dataPoints);
		callback(historicalData);
	}

	dicToValueArray(dic) {
		let ret = [];
		for (let key in dic) {
			let value = dic[key];
			ret.push(new ExchangeValuePoint(key, value));
		}

		return ret;
	}

	fetchRaw(token, callback) {
		callback(EthData, null);

		// let url = "http://coinmarketcap.northpole.ro/api/v5/history/" + token.symbol + "_2016.json";
		// fetch(url, {
	 //      method: 'get',
	 //      dataType: "jsonp",
	 //    })
	 //    .then((response) => response.json())
	 //    .then((data) => {
	 //      console.log(data);
	 //    })
	 //    .catch((error) => {
	 //      console.error(error);
	 //    })
	}
}