layout = {
    title: "Temperature and Rainfall",
    yaxis: { title: "Temperature (°C)", side: "right" },
    yaxis2: { title: "Rainfall (mm)", overlaying: "y" },
    colorway: ['red', 'blue'],
    font: {
        family: "Courier New, monospace",
        size: 15,
        color: "#094C94",
    }
}

layoutWind = {
    yaxis: { title: 'Wind Speed (knots)' },
    title: 'Wind Speed and Direction',
    font: {
        family: "Courier New, monospace",
        size: 15,
        color: "#094C94"
    }
}

function loadChart() {
    cityName = document.getElementById('cityName').value
    if (cityName.length === 0) {
        return
    }
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            Plotly.purge('chart')
            Plotly.purge('chart2')
            Plotly.plot('chart', modifyData(this.response), layout)
            Plotly.plot('chart2', modifyData2(this.response), layoutWind)
        }
    }
    url = '/weather?city=' + cityName
    xhttp.open('GET', url)
    xhttp.send()
}

function modifyData(data) {
    json = JSON.parse(data)
    if (json.cod !== '200') {
        return []
    }
    temp = json.list.map(elem => elem.main.temp)
    time = json.list.map(elem => elem.dt_txt)
    rain = json.list.map(elem => elem.rain ? elem.rain['3h'] : 0)

    trace1 = {
        x: time,
        y: temp,
        name: "Temperature",
        type: 'scatter',
        line: { width: 3.5 }
    }
    trace2 = {
        x: time,
        y: rain,
        name: "Rain",
        yaxis: "y2",
        type: 'bar',
        opacity: 0.5
    }
    result = [trace1, trace2]

    return result
}

function modifyData2(data) {
    json = JSON.parse(data)
    time = json.list.map(elem => elem.dt_txt)
    wind = json.list.map(elem => elem.wind.speed)
    direction = json.list.map(elem => getDirectionLetter(elem.wind.deg))

    trace1 = [{
        x: time,
        y: wind,
        type: 'bar',
        text: direction,
        textposition: 'auto',
        hoverinfo: 'none',
        marker: {
            color: 'rgb(158,202,225)',
            opacity: 0.6,
            line: {
                width: 1,
                color: "red",

            }
        }
    }]

    return trace1
}

function getDirectionLetter(degrees) {
    if (degrees == 0 || degrees == 360) {
        return "N"
    } else if (degrees == 90) {
        return "E"
    } else if (degrees == 180) {
        return "S"
    } else if (degrees == 270) {
        return "W"
    } else if (degrees > 0 && degrees < 90) {
        return "NE"
    } else if (degrees > 90 && degrees < 180) {
        return "SE"
    } else if (degrees > 180 && degrees < 270) {
        return "SW"
    } else if (degrees > 270 && degrees < 360) {
        return "NW"
    }
}