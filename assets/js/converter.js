class Converter extends Database {
  constructor (amount = 1) {
    super()
    this.base = window.base
    this.target = window.target
    this.first_pair = `${this.base}_${this.target}`
    this.second_pair = `${this.target}_${this.base}`
    this.amount = amount
    this.exchange_pairs = null
    this.rate = 0
  }

  currencies () {
    caches.match('https://free.currencyconverterapi.com/api/v5/currencies')
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        const options = Object.keys(response.results).sort()
        const ul = document.getElementById('currency-container') 
        ul.innerHTML = ''
        // Populate list with options:
        for(const option of options) {
          let li = document.createElement('li')
          li.appendChild(document.createTextNode(`${option}, ${response.results[option].currencyName}`))
          ul.appendChild(li)
        }
        ul.addEventListener('click', (e) => {
          if (e.target && e.target.nodeName === 'LI') {
            const btnId = window.initiatorValue
            const value = e.target.textContent.split(',')[0]
            const currencyName = e.target.textContent.split(',')[1]
            document.getElementById('currencies-list').style.display='none'
            if (btnId.split('-')[0] === 'base') {
              document.getElementById('base-input').value = '1'
              document.getElementById('base-text').innerHTML = currencyName
              window.base = value
            } else if (btnId.split('-')[0] === 'target') {
              document.getElementById('target-input').value = ' '
              document.getElementById('target-text').innerHTML = currencyName
              window.target = value
            }
            document.getElementById(btnId).innerText = value
          }
        })
      })
  }

  fetchRateAndStore () {
    if (navigator.onLine) {
      const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${this.first_pair},${this.second_pair}&compact=ultra`
      fetch(url)
        .then((response) => {
          return response.json()
        })
        .then((pairs) => {
          this.exchange_pairs = pairs
          this.rate = pairs[this.first_pair]
          this.display()
          const time = Date.parse(new Date())
          super.insert({id: `${this.first_pair}/${this.second_pair}`, pairs: pairs, time: time})
        })
        .catch((error) => {
          console.log(error)
          document.getElementById('error-dialog').style.display = 'block'
          document.getElementById('error-message').innerHTML = 'Something went wrong'
        })
    } else {
      document.getElementById('error-dialog').style.display = 'block'
      document.getElementById('error-message').innerHTML = `The exchange rate cannot be fetched now.\nConnect to the internet and try again.\nReverting to default.`
      // Reset to default
      window.base = 'USD'
      window.target = 'NGN'
      document.getElementById('base-btn').innerHTML = 'USD'
      document.getElementById('target-btn').innerHTML = 'NGN'
      document.getElementById('base-text').innerHTML = 'United States Dollar'
      document.getElementById('target-text').innerHTML = 'Nigerian Naira'
      new Converter().convert()
    }
  }

  convert () {
    if (!this.base || !this.target) {
      document.getElementById('error-dialog').style.display = 'block'
      document.getElementById('error-message').innerHTML = 'From and To initiators are undefined'
      return
    }
    const _firstPair = `${this.first_pair}/${this.second_pair}`
    const _secondPair = `${this.second_pair}/${this.first_pair}`
    const pairsPromise = []
    // Check if the pair exists in database
    // This returns an array of promises
    for (const pair of [_firstPair, _secondPair]) {
      pairsPromise.push(super.checkPair(pair))
    }
    // Resolve all promises
    // This ensures that no action is performed unless all promises are resolved/rejected
    return Promise.all(pairsPromise).then((values) => {
      const result = values.filter(value => value !== undefined)
      // If it doesn't exist
      // Fetch from API
      if (result.length === 0) {
        this.fetchRateAndStore()
      } else {
        // If it exists
        // Fetch from database
        // Before fetching from database 
        // check if the record is outdated
        // An outdated record is one that has time greater than 1 hour compared to the current time
        const currTime = Date.parse(new Date())
        const dataTime = result[0].time
        const timeDiff = (currTime - dataTime) / 3600000
        if ((timeDiff) > 1 && navigator.onLine) {
          this.fetchRateAndStore()
        } else {
          this.rate = result[0].pairs[this.first_pair]
          this.exchange_pairs = result[0].pairs
          this.display()
        }
      }
    })
  }

  display () {
    document.getElementById('first-conversion-rate').innerText = `${this.first_pair.replace('_', ' => ')} = ${this.exchange_pairs[this.first_pair]}`
    document.getElementById('second-conversion-rate').innerText = `${this.second_pair.replace('_', ' => ')} = ${this.exchange_pairs[this.second_pair]}`
    document.getElementById('target-input').value = (this.rate * this.amount).toFixed(6)
  }
}
