import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine


from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/movies.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Samples_Metadata = Base.classes.movies_data
Genres = Base.classes.genres_clean

#Imported
top10_18 = Base.classes.eighteen
top10_17 = Base.classes.seventeen
SW = Base.classes.sw
JKR = Base.classes.jkr
MCU = Base.classes.mcu

#imported
#Weekly = Base.classes.wkly_mov_gross_2018


@app.route("/")
def index():
	"""Return the homepage."""
	return render_template("index.html")

@app.route("/chord")
def chordD():
	"""Chord Diagram."""
	return render_template("chord.html", sel=18)

@app.route("/chord/<select>")
def chords(select):
	"""Chord Diagram."""
	return render_template("chord.html", sel=select)

@app.route("/xrate")
def rate3():
	"""Ratings Correlation."""
	return render_template("scatter3.html")

@app.route("/active")
def active():
	"""Active Users."""
	return render_template("active.html")

@app.route("/ratings")
def ratings():
	"""Return a list of ratings."""

	# Use Pandas to perform the sql query
	stmt = db.session.query(Samples_Metadata).statement
	df = pd.read_sql_query(stmt, db.session.bind)
	
	sel = [
		Samples_Metadata.gross,
		Samples_Metadata.movie_title,
		Samples_Metadata.title_year,
		Samples_Metadata.bechdelRating,
		Samples_Metadata.gross
	]

	bechdelBubbles = db.session.query(*sel).all()
	
	bechdelarray = []
	for bechdelBubble in bechdelBubbles:
		rating_metadata = {}
		rating_metadata["gross"] = bechdelBubble[0]
		rating_metadata["title"] = bechdelBubble[1]
		rating_metadata["year"] = bechdelBubble[2]
		rating_metadata["rating"] = bechdelBubble[3]	
		bechdelarray.append(rating_metadata)
	
	return jsonify(bechdelarray)

@app.route("/genres")
def genres():
	"""Return a list of genres."""

	# Use Pandas to perform the sql query
	stmt = db.session.query(Genres).statement.distinct()
	genres = pd.read_sql_query(stmt, db.session.bind)
	
	#print(genres)
	
	return jsonify(list(genres.genres))
	
@app.route("/bechdel/<genres>")
def bechdel(genres):
	"""Return the MetaData for bechdel."""
	
	# Use Pandas to perform the sql query
	stmt = db.session.query(Samples_Metadata).statement
	df = pd.read_sql_query(stmt, db.session.bind)
	
	sel = [
		Samples_Metadata.genres,
		Samples_Metadata.gross,
		Samples_Metadata.movie_title,
		Samples_Metadata.title_year,
		Samples_Metadata.bechdelRating,
	]
	
	#allBechdelRatings = db.session.query(*sel).all()
	if genres == "All":
		rating_metadata = db.session.query(*sel).all()
	else:
		rating_metadata = db.session.query(*sel).filter(Samples_Metadata.genres == genres).all()
	
	# Create a dictionary entry for each row of metadata information
	genrearray = []
	for metadata in rating_metadata:
		rating_data = {}
		rating_data["genre"] = metadata[0]
		rating_data["gross"] = metadata[1]
		rating_data["title"] = metadata[2]
		rating_data["year"] = metadata[3]
		rating_data["rating"] = metadata[4]	
		genrearray.append(rating_data)
	
	return jsonify(genrearray)

#Youqing's routes
@app.route("/top18")
def top18():

    sel = [top10_18.source,top10_18.target,top10_18.value]
    results = db.session.query(*sel).all()
    node=[]
    link=[]
    for result in results:
        node.append({"name":result[0]})
        node.append({"name":result[1]})
        link.append({"source":result[0],"target":result[1],"value":result[2]})
    nodes = []
    for dic in node:
        if dic not in nodes:
            nodes.append(dic)
    links = []
    for dic in link:
        dic["source"] = nodes.index({"name":dic["source"]})
        dic["target"] = nodes.index({"name":dic["target"]})
        links.append(dic)
    graph = {"nodes":nodes,"links":links}
    # Return a list of the column names (sample names)
    return jsonify(graph)

@app.route("/top17")
def top17():

    sel = [top10_17.source,top10_17.target,top10_17.value]
    results = db.session.query(*sel).all()
    node=[]
    link=[]
    for result in results:
        node.append({"name":result[0]})
        node.append({"name":result[1]})
        link.append({"source":result[0],"target":result[1],"value":result[2]})
    nodes = []
    for dic in node:
        if dic not in nodes:
            nodes.append(dic)
    links = []
    for dic in link:
        dic["source"] = nodes.index({"name":dic["source"]})
        dic["target"] = nodes.index({"name":dic["target"]})
        links.append(dic)
    graph = {"nodes":nodes,"links":links}
    # Return a list of the column names (sample names)
    return jsonify(graph)

@app.route("/sw")
def sw():

    sel = [SW.source,SW.target,SW.value]
    results = db.session.query(*sel).all()
    node=[]
    link=[]
    for result in results:
        node.append({"name":result[0]})
        node.append({"name":result[1]})
        link.append({"source":result[0],"target":result[1],"value":result[2]})
    nodes = []
    for dic in node:
        if dic not in nodes:
            nodes.append(dic)
    links = []
    for dic in link:
        dic["source"] = nodes.index({"name":dic["source"]})
        dic["target"] = nodes.index({"name":dic["target"]})
        links.append(dic)
    graph = {"nodes":nodes,"links":links}
    # Return a list of the column names (sample names)
    return jsonify(graph)

@app.route("/jkr")
def jkr():

    sel = [JKR.source,JKR.target,JKR.value]
    results = db.session.query(*sel).all()
    node=[]
    link=[]
    for result in results:
        node.append({"name":result[0]})
        node.append({"name":result[1]})
        link.append({"source":result[0],"target":result[1],"value":result[2]})
    nodes = []
    for dic in node:
        if dic not in nodes:
            nodes.append(dic)
    links = []
    for dic in link:
        dic["source"] = nodes.index({"name":dic["source"]})
        dic["target"] = nodes.index({"name":dic["target"]})
        links.append(dic)
    graph = {"nodes":nodes,"links":links}
    # Return a list of the column names (sample names)
    return jsonify(graph)

@app.route("/mcu")
def mcu():

    sel = [MCU.source,MCU.target,MCU.value]
    results = db.session.query(*sel).all()
    node=[]
    link=[]
    for result in results:
        node.append({"name":result[0]})
        node.append({"name":result[1]})
        link.append({"source":result[0],"target":result[1],"value":result[2]})
    nodes = []
    for dic in node:
        if dic not in nodes:
            nodes.append(dic)
    links = []
    for dic in link:
        dic["source"] = nodes.index({"name":dic["source"]})
        dic["target"] = nodes.index({"name":dic["target"]})
        links.append(dic)
    graph = {"nodes":nodes,"links":links}
    # Return a list of the column names (sample names)
    return jsonify(graph)



if __name__ == "__main__":
	app.run()
