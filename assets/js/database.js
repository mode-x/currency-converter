class Database {
  constructor () {
    this.db = this.openDatabase()
  }

  openDatabase () {
    if (!navigator.serviceWorker) {
      return Promise.resolve()
    }
    return idb.open('convert-db', 2, function(upgradeDb) {
      switch (upgradeDb.oldVersion) {
        case 0:
          const store = upgradeDb.createObjectStore('exchange-rates', {keyPath: 'id'})
          store.createIndex('by-date', 'time')
        case 1:
          const appDefaultPair = upgradeDb.createObjectStore('app-default-pair', {keyPath: 'id'})
          appDefaultPair.createIndex('by-id', 'id')
      }
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

  insertDefault (pair) {
    if (!this.db) return
    this.db.then((db) => {
      var tx = db.transaction('app-default-pair', 'readwrite')
      var appDefaultPair = tx.objectStore('app-default-pair')
      appDefaultPair.put({id: 1, pair: pair})
    })
  }

  getPair () {
    return this.db.then((db) => {
      return db.transaction('app-default-pair').objectStore('app-default-pair').getAll()
    }).then((obj) => {
      return obj
    })
  }

  delete () {
    // Remove pairs
  }

}
