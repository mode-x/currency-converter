class Converter {
  constructor (amount, database) {
    this.base = window.base
    this.target = window.target
    this.first_pair = `${this.base}_${this.target}`
    this.second_pair = `${this.target}_${this.base}`
    this.amount = amount
    this.database = database
    this.exchange_pairs = null
    this.rate = 0
  }

  currencies () {
    caches.open('app-cache-v1').then((cache) => {
      cache.match('https://free.currencyconverterapi.com/api/v5/currencies')
        .then((response) => {
          if (!response === null || !response === undefined) {
            return response.json()
          }
        })
        .then((response) => {
          if (!response === null || !response === undefined) return
          const options = Object.keys(response.results).sort()
          const ul = document.getElementById('currency-container') 
          ul.innerHTML = ''
          // Populate list with options:
          for(const option of options) {
            let li = document.createElement('li')
            li.appendChild(document.createTextNode(`${option},  ${response.results[option].currencyName}`))
            ul.appendChild(li)
          }
          ul.addEventListener('click', (e) => {
            if (e.target && e.target.nodeName === 'LI') {
              const btnId = window.initiatorValue
              const value = e.target.textContent.split(',')[0]
              document.getElementById('id01').style.display='none'
              if (btnId.split('-')[0] === 'base') {
                document.getElementById('convert-text').innerHTML = ` Convert ${value} to ${document.getElementById('target-btn').textContent}`
                window.base = value
              } else if (btnId.split('-')[0] === 'target') {
                document.getElementById('convert-text').innerHTML = ` Convert ${document.getElementById('base-btn').textContent} to ${value}`
                window.target = value
              }
              document.getElementById(btnId).innerText = value
            }
          })
        })
    })
  }

  fetchRateAndStore () {
    const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${this.first_pair},${this.second_pair}&compact=ultra`
    fetch(url)
      .then((response) => {
        return response.json()
      })
      .then((pairs) => {
        this.exchange_pairs = pairs
        this.rate = pairs[this.first_pair]
        this.display()
        this.database.insert({id: `${this.first_pair}/${this.second_pair}`, pairs: pairs, time: new Date().toISOString()})
      })
      .catch((error) => {
        console.log(error)
        document.getElementById('notify').style.display = 'block'
        document.getElementById('notify-message').innerHTML = 'Something went wrong'
      })
  }

  convert () {
    // Check if exists in indexedDB
    const _firstPair = `${this.first_pair}/${this.second_pair}`
    const _secondPair = `${this.second_pair}/${this.first_pair}`
    const pairsPromise = []
    for (const pair of [_firstPair, _secondPair]) {
      pairsPromise.push(this.database.checkPair(pair))
    }
    return Promise.all(pairsPromise).then((values) => {
      const result = values.filter(value => value !== undefined)
      if (result.length === 0) {
        if (navigator.onLine) {
          this.fetchRateAndStore()
        } else {
          document.getElementById('notify').style.display = 'block'
          document.getElementById('notify-message').innerHTML = `The exchange rate cannot be fetch now.\nConnected to the internet and try again.`
        }
      } else {
        this.rate = result[0].pairs[this.first_pair]
        this.exchange_pairs = result[0].pairs
        this.display()
      }
    })
  }

  display () {
    document.getElementById('first-conversion-rate').innerText = `${this.first_pair.replace('_', ' => ')} = ${this.exchange_pairs[this.first_pair]}`
    document.getElementById('second-conversion-rate').innerText = `${this.second_pair.replace('_', ' => ')} = ${this.exchange_pairs[this.second_pair]}`
    document.getElementById('target-input').value = this.rate * this.amount
  }
}