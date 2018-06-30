document.addEventListener('DOMContentLoaded', (event) => {

  let amount = 1
  
  window.base = 'USD'
  window.target = 'NGN'

  const baseInput = document.getElementById('base-input')
  
  baseInput.onkeydown = (e) => {
    document.getElementById('target-input').value = ' '
  }

  baseInput.onkeypress = (e) => {
    amount = e.target.value
  }

  baseInput.onchange = (e) => {
    amount = e.target.value
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

  document.getElementById('convert-btn').onclick = (e) => {
    e.preventDefault()
    const converter = new Converter(amount)
    converter.convert()
  }

  document.getElementById('form').onsubmit = (e) => {
    e.preventDefault()
  }

  document.getElementById('convert-btn').onclick = (e) => {
    const converter = new Converter(amount)
    if (amount && baseInput.validity.valid) {
      converter.convert()
    } else {
      document.getElementById('target-input').value = ' '
    }
  }

})

panels = () => {
  const sideBar = document.getElementById('mySidebar')
  const overLay = document.getElementById('myOverlay')
  return {side_bar: sideBar, over_lay: overLay}
}

w3_open = () => {
  if (panels().side_bar.style.display === 'block') {
    panels().side_bar.style.display = 'none'
    panels().over_lay.style.display = 'none'
  } else {
    panels().side_bar.style.display = 'block'
    panels().over_lay.style.display = 'block'
  }
}

w3_close = () => {
  panels().side_bar.style.display = 'none'
  panels().over_lay.style.display = 'none'
}
