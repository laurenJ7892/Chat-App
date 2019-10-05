const socket = io()

// Elements
const $messageForm = document.querySelector('#messageForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $locationButton = document.querySelector('#shareLocation')
const $messages = document.querySelector('#messages')
const $locationMessages = document.querySelector('#locationMessages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#side-bar-template').innerHTML


//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


// Auto Scroll to Bottom for nice UI experience
const autoScroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

     // get margins
     const newMessageStyles = getComputedStyle($newMessage)

     // get just the number from the bottom margin 
     const newMessageMargin = parseInt(newMessageStyles.marginBottom)

    // Height of the new Message
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messages.offsetHeight
    
    // height of messages container height
    const containerHeight = $messages.scrollHeight

    //figure out where have currently scrolled to from the top
    const scrollOffset = $messages.scrollTop + visibleHeight

    // check if we were at the bottom
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }    

}

// receive an event from emit
socket.on('message', (welcomeMessage) => {
    const html = Mustache.render(messageTemplate, {
        username: welcomeMessage.username,
        welcomeMessage: welcomeMessage.text,
        createdAt: moment(welcomeMessage.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()

  })

  socket.on('locationMessage', (locationURL) => {
    const locHtml = Mustache.render(locationTemplate, {
        username: locationURL.username,
        locationURL: locationURL.url,
        createdAt: moment(locationURL.createdAt).format('h:mm a')
    })

    $locationMessages.insertAdjacentHTML('beforeend', locHtml)
    autoScroll()

  })

  socket.on('roomData', ({ room, users }) => {
    const sideBarHtml = Mustache.render(sidebarTemplate, {
        room,
        users
      })  
      
      document.querySelector('#sidebar').innerHTML = sideBarHtml
    })

  $messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    let userMessage = e.target.elements.userMessage.value

    socket.emit('sendMessage', userMessage, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
           return alert(error)
        }
    })
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {
            if (error) {
                return console.log(error)
            }

            $locationButton.removeAttribute('disabled')
            console.log('Location Shared')
        })

    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error) 
            location.href= '/'
    }
})