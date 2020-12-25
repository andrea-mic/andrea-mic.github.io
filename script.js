// SETTINGS

function setGraphProperties() {

    document.querySelector("body").style.width = graph_width + 200
    graph.setAttribute('width', graph_width + 200)
    graph.setAttribute('height', graph_height + 70)

    data.style.width = graph_width
    document.querySelector("#wrapper").style.width = graph_width
}

function toggleOption(option) {
    switch (option) {
        case 'rect_fill':
            rect_fill = !rect_fill
            break
        case 'rect_border':
            rect_border = !rect_border
            break
    }
    drawColumns()
}

function randomizeItems() {

    stopAnimation()

    n_operations = 0
    rect_selected = []
    rect_parsed = []
    rect_sorted = []
    items = []

    applySettings()

    for (let i = 0; i < n_items; i++) {
        items[i] = Math.ceil(Math.random() * range)
    }

    document.getElementById("sorting_start_button").disabled = false

    updateDescription()
    resetOpCount()
    setGraphProperties()
    buildGraph()
    drawColumns()
}

function stopAnimation() {
    stop_animation = true
    clearInterval(animation)
    clearTimeout(animation)
}

function initSettings() {
    let settingsIcon = document.querySelector("#settings_icon_svg")
    settingsIcon.addEventListener('click', toggleSettings)

    rect_fill = document.querySelector("#fill_rect_input").checked
    rect_border = document.querySelector("#border_rect_input").checked

    applySettings()
}

function applySettings() {
    n_items = parseInt(document.querySelector("#items_number_input").value)
    operation_time = parseInt(document.querySelector("#operation_time_input").value)
    range = parseInt(document.querySelector("#range_input").value)
    graph_height = parseInt(document.querySelector("#graph_height_input").value)
    graph_width = parseInt(document.querySelector("#graph_width_input").value)
}

function toggleSettings() {
    let settingsWindow = document.querySelector('#settings')
    settingsWindow.style.display = settingsWindow.style.display === 'block' ? 'none' : 'block'
}

function linspace(x) {
    let arr = []
    for (let i = 0; i < x; i++) {
        arr[i] = i
    }
    return arr
}

function increaseOpCount() {
    data.innerHTML = "Operations: " + (parseInt(data.innerHTML.split(":")[1]) + 1)
}

function resetOpCount() {
    data.innerHTML = "Operations: 0"
}

function updateDescription(str) {
    /* let desc

    if (str==undefined) {
        str = document.querySelector('#algorithm_selection').value
    }
    
    switch (str) {
        case "- select algorithm -":
            desc = ""
            break
        default:
            desc = str.toUpperCase() + ": " + "sample text"
    }

    document.querySelector("#description-box").innerHTML = desc */
}

// VISUALS

function clearGraph() {
    ctx.clearRect(101, 48, graph_width + 1, graph_height + 1)
}

function buildGraph() {

    ctx.beginPath()
    ctx.moveTo(100, 50)
    ctx.lineTo(100, graph_height + 50)
    ctx.lineTo(graph_width + 102, graph_height + 50)
    ctx.stroke()

    for (let i = 0; i <= 10; i++) {
        ctx.moveTo(100, graph_height + 50 - i * graph_height / 10)
        ctx.lineTo(90, graph_height + 50 - i * graph_height / 10)
        ctx.stroke()
        ctx.font = "10px Arial"
        ctx.textAlign = 'right'
        ctx.fillText("" + i * range / 10, 85, graph_height + 50 - i * graph_height / 10 + 3)
    }
}

function drawColumns() {

    clearGraph()

    if (rect_fill === true) {
        for (let i = 0; i < n_items; i++) {
            if (rect_selected.includes(i)) {
                ctx.fillStyle = "red"
            } else if (rect_parsed.includes(i)) {
                ctx.fillStyle = "gray"
            } else if (rect_sorted.includes(i)) {
                ctx.fillStyle = "lightgreen"
            } else ctx.fillStyle = "lightgray"

            ctx.fillRect(Math.floor(graph_width / n_items * i + 101), graph_height + 49, Math.ceil(graph_width / n_items), - items[i] / range * graph_height)
        }
    }

    if (rect_border === true) {
        for (let i = 0; i < n_items; i++) {
            ctx.beginPath()
            ctx.strokeStyle = "gray"
            ctx.rect(graph_width / n_items * i + 101, graph_height + 49, graph_width / n_items, - items[i] / range * graph_height)
            ctx.lineWidth = 1;
            ctx.stroke()
        }
    }
}


// SORTING ALGORITHMS 

function startSort() {

    let input = document.querySelector('#algorithm_selection').value

    updateDescription(input)

    document.getElementById("sorting_start_button").disabled = true
    stop_animation = false

    switch (input) {
        case "- select algorithm -":
            document.getElementById("sorting_start_button").disabled = false
            break
        case "selection sort": selection_sort()
            break
        case "recursive selection sort": recursive_selection_sort([], items)
            break
        case "bubble sort": bubble_sort()
            break
        case "insertion sort": insertion_sort()
            break
        case "quick sort": quick_sort_grayAnim(0, items.length - 1)
            break
        case "merge sort (NA)": alert ("Not available yet")
            document.getElementById("sorting_start_button").disabled = true
            break
        case "bogo sort": bogo_sort() 
            break
    }
}

function finishedSorting() {
    clearInterval(animation)
    rect_parsed = []
    rect_selected = []
    rect_sorted = linspace(items.length)
    drawColumns()
}

function bogo_sort() {
    let i=1

    animation = setInterval( () => {
        rect_parsed = []
        rect_selected = []

        increaseOpCount()

        if (i === items.length) {
            finishedSorting()
            return
        }
        else if (items[i]<items[i-1]) {
            rect_selected = [i]
            i=1
            items = shuffle_array( items )
        } 
        else {
            rect_parsed = [i]
            i++
        }

        drawColumns()

    }, operation_time)
}

function selection_sort() {

    let lowest = 0
    let n_sorted = 0
    let i = 0

    animation = setInterval(() => {
        if (n_sorted === items.length) {
            finishedSorting()
        }

        increaseOpCount()

        rect_parsed = [i]
        if (i > n_items - 2) { rect_selected = [lowest] }
        else rect_selected = []

        drawColumns()

        if (items[i] < items[lowest]) { lowest = i }

        if (i === items.length - 1) {

            items.splice(n_sorted, 0, items[lowest])
            items.splice(lowest + 1, 1)

            n_sorted += 1
            rect_sorted = linspace(n_sorted)
            i = n_sorted
            lowest = n_sorted

        } else i += 1
    }, operation_time)
}

function bubble_sort() {

    let i = 0
    let isOrdered
    rect_sorted = []

    animation = setInterval(() => {
        if (i === 0) isOrdered = true

        increaseOpCount()

        if (items[i] > items[i + 1]) {
            let temp = items[i]
            items[i] = items[i + 1]
            items[i + 1] = temp

            rect_selected = [i, i + 1]
            rect_parsed = []
            isOrdered = false
        } else {
            rect_parsed = [i, i + 1]
            rect_selected = []
        }

        drawColumns()
        i++

        if (i === items.length - 1 - rect_sorted.length && isOrdered === false) {
            rect_sorted = rect_sorted.concat(items.length - rect_sorted.length - 1)
            i = 0
        }
        if (i === items.length - 1 - rect_sorted.length && isOrdered === true) {
            rect_sorted[items.length] = items.length
            clearInterval(animation)
            finishedSorting()
        }
    }, operation_time)

}

function insertion_sort() {

    rect_sorted = []

    let i = 0
    let unsorted = [...items]
    let sorted = []

    animation = setInterval(() => {
        increaseOpCount()

        if (i === sorted.length) {
            sorted.push(unsorted.shift())
            rect_sorted = rect_sorted.concat(rect_sorted.length)
            i = 0
        }

        rect_selected = [sorted.length]
        rect_parsed = [i]

        if (sorted[i] > unsorted[0]) {
            sorted.splice(i, 0, unsorted.shift())
            rect_sorted = rect_sorted.concat(rect_sorted.length)
            i = -1
        }

        if (unsorted.length === 0) {
            clearInterval(animation)
            finishedSorting()
        }

        items = [...sorted, ...unsorted]
        drawColumns()
        i += 1

    }, operation_time)
}

function quick_sort(start, end) {
    if (start === end) {
        rect_sorted.push(start)
        drawColumns()
        return
    }

    let i = start
    let j = end
    let pivot_left = true
    rect_selected.push(start, end)

    let animation = setInterval(() => {
        if (stop_animation === true) {
            clearInterval(animation)
            return
        }

        increaseOpCount()
        drawColumns()

        if (i === j) {
            rect_selected = rect_selected.filter(n => n != i)
            rect_sorted = [...rect_sorted, i]
            drawColumns()
            clearInterval(animation)

            if (i - 1 >= start) quick_sort(start, i - 1)
            if (j + 1 <= end) quick_sort(j + 1, end)

            return
        }

        if (items[i] > items[j]) {

            let temp = items[i]
            items[i] = items[j]
            items[j] = temp

            pivot_left = !pivot_left

        } else {
            switch (pivot_left) {
                case true:
                    rect_selected = rect_selected.filter(n => n != j)
                    j -= 1
                    rect_selected.push(j)
                    break
                case false:
                    rect_selected = rect_selected.filter(n => n != i)
                    i += 1
                    rect_selected.push(i)
                    break
            }
        }

    }, operation_time)

}

function quick_sort_grayAnim(start, end) {
    if (start === end) {
        rect_sorted.push(start)
        drawColumns()
        return
    }

    let i = start
    let j = end
    let pivot_left = true
    rect_selected.push(start)
    rect_parsed.push(end)

    let animation = setInterval(() => {
        if (stop_animation === true) {
            clearInterval(animation)
            return
        }

        increaseOpCount()
        drawColumns()

        if (i === j) {
            rect_selected = rect_selected.filter(n => n != i)
            rect_parsed = rect_parsed.filter(n => n != i)
            rect_sorted.push(i)
            drawColumns()
            clearInterval(animation)

            if (i - 1 >= start) quick_sort_grayAnim(start, i - 1)
            if (j + 1 <= end) quick_sort_grayAnim(j + 1, end)

            return
        }

        if (items[i] > items[j]) {

            let temp = items[i]
            items[i] = items[j]
            items[j] = temp

            switch (pivot_left) {
                case true:
                    rect_selected = rect_selected.filter(n => n != i)
                    rect_selected.push(j)
                    rect_parsed = rect_parsed.filter(n => n != j)
                    rect_parsed.push(i)
                    break
                case false:
                    rect_selected = rect_selected.filter(n => n != j)
                    rect_selected.push(i)
                    rect_parsed = rect_parsed.filter(n => n != i)
                    rect_parsed.push(j)
                    break
            }

            pivot_left = !pivot_left

        } else {
            switch (pivot_left) {
                case true:
                    rect_parsed = rect_parsed.filter(n => n != j)
                    j -= 1
                    rect_parsed.push(j)
                    break
                case false:
                    rect_parsed = rect_parsed.filter(n => n != i)
                    i += 1
                    rect_parsed.push(i)
                    break
            }
        }

    }, operation_time)
}

function merge_sort(arrays) {

    

}


// MISCELLANEA

function shuffle_array(arr) {
    let new_arr = []
    let i = 0

    while (arr.length != 0) {
        i = Math.floor( Math.random() * arr.length )

        new_arr.push( arr[i] )
        arr.splice( i, 1 )
    }

    return new_arr
}


// AUDIO 

function playNote(frequency, duration) {
    // create Oscillator node
    var oscillator = audioCtx.createOscillator();

    oscillator.type = 'square';
    oscillator.frequency.value = frequency; // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.onended = () => { };
    oscillator.start(0);
    oscillator.stop(audioCtx.currentTime + duration / 1000);
}


// SETTINGS
let redDutyCicle = 0.9


// DECLARATIONS

let rect_fill
let rect_border
let operation_time
let n_items
let range
let graph_width
let graph_height
let animation
let stop_animation
let data = document.querySelector('#data')
let graph = document.querySelector('#graph')
let wrapper = document.querySelector('main')
let ctx = graph.getContext('2d')
let rect_selected = []
let rect_parsed = []
let rect_sorted = []
// var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let items = []


// PROGRAM

initSettings()
randomizeItems()
setGraphProperties()
buildGraph()
drawColumns()