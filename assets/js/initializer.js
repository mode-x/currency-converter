document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed')
  // if (!window.location.hostname === '127.0.0.1') {
  //   window.location.replace(`${window.location.hostname}/index.html`)
  // }

  let installPromptEvent

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    installPromptEvent = event
    document.querySelector('#install-button').disabled = false
  })

  document.getElementById('install-button').addEventListener('click', () => {
    document.querySelector('#install-button').disabled = true
    installPromptEvent.prompt()
    installPromptEvent.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt')
      } else {
        console.log('User dismissed the A2HS prompt')
      }
      installPromptEvent = null;
    })
  })

  window.base = 'USD'
  window.target = 'NGN'
  let amount = 1
  const database = new Database ()
  const converter = new Converter(amount, database)
  converter.currencies()
  converter.convert()

  document.getElementById('notify').style.display = 'none'
  
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