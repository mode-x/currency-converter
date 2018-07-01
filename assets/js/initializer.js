document.addEventListener('DOMContentLoaded', (event) => {

  let amount = 1
  
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

  // document.getElementById('convert-btn').onclick = (e) => {
  //   e.preventDefault()
  //   const converter = new Converter(amount)
  //   converter.convert()
  // }

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

closeSaveDefault = () => {
  document.getElementById('save-as-default').style.display='block'
  w3_close()
}

saveDefault = () => {
  const baseCurrenyName = document.getElementById('base-text').innerHTML
  const targetCurrenyName = document.getElementById('target-text').innerHTML
  const converter = new Converter()
  converter.insertDefault({base_id: window.base, base_name: baseCurrenyName, target_id: window.target, target_name: targetCurrenyName})
  document.getElementById('save-as-default').style.display='none'
  
  converter.getPair().then((response) => {
    window.base = response[0].pair.base_id
    window.target = response[0].pair.target_id
    document.getElementById('base-btn').innerText = response[0].pair.base_id
    document.getElementById('target-btn').innerText = response[0].pair.target_id
    document.getElementById('base-text').innerHTML = response[0].pair.base_name
    document.getElementById('target-text').innerHTML = response[0].pair.target_name
  })
  window.location.reload()
}

