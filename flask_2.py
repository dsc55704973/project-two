import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Denver_beer_wine_whiskey.sqlite")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# table reference
breweryDB = Base.classes.denverBeer

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")

@app.route("/api/v1.0/bar_names")
def barNames():
    # session (link) from Python to the DB
    session = Session(engine)

    # Query bar names
    results = session.query(breweryDB.name_).all()
    session.close()

    # Convert list of tuples into normal list
    bar_names = list(np.ravel(results))

    return jsonify(bar_names)


@app.route("/api/v1.0/bar_data")
def barData():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query bar latitude, longitude, and rating
    results = session.query(breweryDB.latitude, breweryDB.longitude, breweryDB.rating, breweryDB.category, breweryDB.address1, breweryDB.zip_code).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    bar_data = []
    for latitude, longitude, rating, category, address1, zip_code in results:
        brewery_dict = {}
        brewery_dict["latitude"] = latitude
        brewery_dict["longitude"] = longitude
        brewery_dict["rating"] = rating
        brewery_dict["category"] = category
        brewery_dict["address"] = address1
        brewery_dict["zip_code"] = zip_code
        bar_data.append(brewery_dict)

    return jsonify(bar_data)

if __name__ == '__main__':
    app.run(debug=True)
