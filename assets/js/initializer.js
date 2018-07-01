class Initializer extends Converter {
  constructor () {
    super()
    // Set the default display currency pairs
    this.getPair().then((response) => {
      if (response.length > 0) {
        this.base = response[0].pair.base_id
        this.target = response[0].pair.target_id
        document.getElementById('base-btn').innerText = response[0].pair.base_id
        document.getElementById('target-btn').innerText = response[0].pair.target_id
        document.getElementById('base-text').innerHTML = response[0].pair.base_name
        document.getElementById('target-text').innerHTML = response[0].pair.target_name
      } else {
        this.base = 'USD'
        this.target = 'NGN'
        document.getElementById('base-btn').innerText = 'USD'
        document.getElementById('target-btn').innerText = 'NGN'
        document.getElementById('base-text').innerHTML = 'United States Dollar'
        document.getElementById('target-text').innerHTML = 'Nigerian Naira'
      }
      this.first_pair = `${this.base}_${this.target}`
      this.second_pair = `${this.target}_${this.base}`
      this.convert()
    })
   
    document.addEventListener('DOMContentLoaded', (event) => {
      
      const baseInput = document.getElementById('base-input')
      
      baseInput.onkeydown = (e) => {
        document.getElementById('target-input').value = ' '
      }
    
      baseInput.onkeypress = (e) => {
        this.amount = e.target.value
      }
    
      baseInput.onchange = (e) => {
        this.amount = e.target.value
      }
      
      document.getElementById('base-btn').onclick = (e) => {
        e.preventDefault()
        document.getElementById('currencies-list').style.display='block'
        window.initiatorValue = e.target.id
        const converter = new Converter()
        converter.currencies()
      }
    
      document.getElementById('target-btn').onclick = (e) => {
        e.preventDefault()
        document.getElementById('currencies-list').style.display='block'
        window.initiatorValue = e.target.id
        const converter = new Converter()
        converter.currencies()
      }
    
      document.getElementById('form').onsubmit = (e) => {
        e.preventDefault()
      }
    
      document.getElementById('convert-btn').onclick = (e) => {
        if (document.getElementById('base-input').value === '1') {
          this.amount = 1
        }
        const base = document.getElementById('base-btn').innerText
        const target = document.getElementById('target-btn').innerText
        const converter = new Converter(base, target, this.amount)
        if (this.amount && baseInput.validity.valid) {
          converter.convert()
        } else {
          document.getElementById('target-input').value = ' '
        }
      }
    
    })
  }

}

