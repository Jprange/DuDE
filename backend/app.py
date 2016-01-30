#!/usr/bin/env python
import logging
import json
import models
from flask import Flask, jsonify, request
from flask.ext.cors import CORS

app = Flask(__name__)

CORS(app)

@app.route('/')
def hello():
    return "hello"


@app.route('/example', methods=['GET', 'POST'])
def example():
    data = [
            {"id": 0, "state": {}},
            {"id": 1, "state": {"x": 3}},
            {"id": 2, "state": {"x": 3}},
            {"id": 3, "state": {"x": 25}},
            {"id": 4, "state": {"x": 25, "y": 7}},
            {"id": 5, "state": {"x": 25, "y": 7}}
        ]


    return jsonify(data=data)

@app.route('/evaluate', methods=['POST', 'GET', 'OPTIONS'])
def evaluate():
    if request.method == 'OPTIONS':
        return jsonify(data=''), 200

    data = request.get_json()

    app.logger.info(data)
    try:
        states = models.Program(data['program']).evaluate()
        return jsonify(data=states)

    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.debug = True
    app.run()
