document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed')
  
  document.getElementById('base-input').onkeypress = (e) => {
    amount = e.target.value
  }

  document.getElementById('base-input').onchange = (e) => {
    amount = e.target.value
  }
  
  document.getElementById('base-btn').onclick = (e) => {
    document.getElementById('id01').style.display='block'
    window.initiatorValue = e.target.id
    e.preventDefault()
  }

  document.getElementById('target-btn').onclick = (e) => {
    document.getElementById('id01').style.display='block'
    window.initiatorValue = e.target.id
    e.preventDefault()
  }

  document.getElementById('convert-btn').onclick = (e) => {
    const converter = new Converter(amount, database)
    converter.convert()
    e.preventDefault()
  }

})

loadList = () => {
  window.base = 'USD'
  window.target = 'NGN'
  const database = new Database ()
  const converter = new Converter(1, database)
  converter.currencies()
  converter.convert()
}

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