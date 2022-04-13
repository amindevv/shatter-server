import { ComplexQuote, ComplexResponse } from "src/@types";
import { TDComplexResponse } from "src/@types";

export const formatComplexResponse = (res: TDComplexResponse): ComplexResponse => {

  if (res.data && res.data[0].values) {

    const quotes = res.data.find((data) => data.meta.indicator === undefined)
    const containsIndicators = res.data.length > 1

    const atr = res.data.find((data) => {
      return data.meta.indicator != undefined && data.meta.indicator.name.includes('ATR')
    })

    const ichi = res.data.find((data) => {
      return data.meta.indicator != undefined && data.meta.indicator.name.includes('ICHIMOKU')
    })

    const macd = res.data.find((data) => {
      return data.meta.indicator != undefined && data.meta.indicator.name.includes('MACD')
    })

    const complexQuotes = quotes.values.map((quote, index): ComplexQuote => {

      let quoteResponse: ComplexQuote = {
        date: new Date(quote.datetime),
        quotes: {
          high: parseFloat(quote.high),
          low: parseFloat(quote.low),
          open: parseFloat(quote.open),
          close: parseFloat(quote.close),
        },
      }

      if (containsIndicators) {
        quoteResponse = {
          ...quoteResponse,
          indicators: {
            atr: atr === undefined ? undefined : parseFloat(atr.values[index].atr),
            ichi: ichi === undefined ? undefined : parseFloat(ichi.values[index].senkou_span_a)
          }
        }
      }

      return quoteResponse
    })

    return {
      meta: quotes.meta,
      series: complexQuotes
    }
  }
}