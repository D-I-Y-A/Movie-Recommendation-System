import numpy as np
import pandas as pd
from flask import Flask, render_template, request
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import bs4 as bs
import urllib.request
import pickle
import requests
from datetime import date, datetime


app = Flask(__name__)

@app.route("/")
def index():
    message = "This content is dynamically generated by Flask!"
    return render_template("index.html", message=message)



if __name__ == '__main__':
    app.run(debug=True)
