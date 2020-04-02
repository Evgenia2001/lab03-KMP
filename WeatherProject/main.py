from flask import Flask, render_template, request
import requests

app = Flask(__name__, static_url_path='')


@app.route('/')
def root():
    return render_template("index.html")


@app.route('/weather')
def routes():
    cityName = request.args.get('city')
    URL = "http://api.openweathermap.org/data/2.5/forecast"
    PARAMS = {'q': cityName,
              'APPID': '53452332f58592f125e206df45fe8c08',
              'units': 'metric'}

    r = requests.get(url=URL, params=PARAMS)
    return r.text

if __name__ == '__main__':
    app.run(debug=True)
