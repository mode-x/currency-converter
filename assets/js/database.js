class Database {
  constructor () {
    this.db = this.openDatabase()
  }

  openDatabase () {
    if (!navigator.serviceWorker) {
      return Promise.resolve()
    }
    return idb.open('convert-db', 1, function(upgradeDb) {
      var store = upgradeDb.createObjectStore('exchange-rates', {
        keyPath: 'id'
      })
      store.createIndex('by-date', 'time')
    })
  }

  checkPair (pair) {
    return this.db.then((db) => {
      return db.transaction('exchange-rates').objectStore('exchange-rates').get(pair)
    }).then((obj) => {
      return obj
    })
  }

  insert (currency) {
    if (!this.db) return
    this.db.then((db) => {
      var tx = db.transaction('exchange-rates', 'readwrite')
      var store = tx.objectStore('exchange-rates')
      store.put(currency)
    })
  }

  delete () {
    // Remove pairs
  }

}
