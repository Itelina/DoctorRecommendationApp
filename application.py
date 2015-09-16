import flask
from flask import render_template, request
import os
import json
import collections
from sqlalchemy import create_engine 
import itertools
import networkx as nx

app = flask.Flask(__name__)

@app.route("/")
def summary():
	data1=open("topdocs.json").read()
	data2=open("network.json").read()
	cities = open("cities.json").read()
	
	with open("../App/classdict.json") as tweetfile:
		classdict = json.loads(tweetfile.read())

	classdict= collections.OrderedDict(sorted(classdict.items()))
	for key, value in classdict.iteritems():
		classdict[key] = collections.OrderedDict(sorted(value.items()))

	return render_template('layout.html', data1=data1, data2=data2, cities=cities, classdict=classdict)

@app.route("/networkapi", methods=['POST'])
def getnetworkdata():

	engine = create_engine('mysql+pymysql://root:@localhost:3306/physicianReferral', encoding="utf-8")
	connection = engine.connect()
	
	vardict = flask.request.json
	print vardict

	if vardict['spec1'] == "General":
		vardict['spec1'] = "N/A"

	if vardict['spec2'] == "General":
		vardict['spec2'] = "N/A"

	# TODO: don't always default to NYC
	vardict['city'] = vardict.get('city', 'New York, NY').split(",")[0]

	#Build in exception for when no inputs
	linenr = {}
	linenr['class1'] = [12, 20, 28]
	linenr['class2'] = [41, 49, 57]

	#Get weighted edges with NPI numbers
	fd = open('sqlscript.sql', 'r')
	sqlFile = fd.read()
	fd.close()
	sqlsplit = sqlFile.split("\n")

	if vardict['spec1'] == "All" and vardict['spec2'] != "All":
	    skiplines = linenr['class1']
	    sqlFile = " ".join([line for i, line in enumerate(sqlsplit) if i not in skiplines])

	if vardict['spec2'] == "All" and vardict['spec1'] != "All":
	    skiplines = linenr['class2']
	    sqlFile = " ".join([line for i, line in enumerate(sqlsplit) if i not in skiplines])

	if vardict['spec1'] == "All" and vardict['spec2'] == "All":
	    skiplines = linenr['class1'] + linenr['class2']
	    sqlFile = " ".join([line for i, line in enumerate(sqlsplit) if i not in skiplines])


	sqlcommand = ['"' + vardict[word] + '"' if word in vardict.keys() else word for word in sqlFile.split()]
	sql = " ".join(sqlcommand)
	cmd = connection.execute(sql)
	wedges = {(line[0], line[1]):line[3] for line in cmd}

	#Get all doctor information including names and taxonomy codes
	fd = open('sqlscript2.sql', 'r')
	sqlFile = fd.read()
	fd.close()

	sqlsplit = sqlFile.split("\n")

	if vardict['spec1'] == "All" and vardict['spec2'] == "All":
	    skiplines = [9, 10, 11, 12, 13, 20, 21, 22, 23, 24, 31, 32, 33, 34, 35]
	    sqlFile = " ".join([line for i, line in enumerate(sqlsplit) if i not in skiplines])
	if vardict['spec1'] == "All" and vardict['spec2'] != "All":
	    skiplines = [10, 11, 21, 22, 32, 33]
	    sqlFile = " ".join([line for i, line in enumerate(sqlsplit) if i not in skiplines])
	if vardict['spec2'] == "All" and vardict['spec1'] != "All":
	    skiplines = [11, 12, 22, 23, 33, 34]
	    sqlFile = " ".join([line for i, line in enumerate(sqlsplit) if i not in skiplines])
	    
	sqlcommand = ['"' + vardict[word] + '"' if word in vardict.keys() else word for word in sqlFile.split()]
	sql = " ".join(sqlcommand)
	cmd = connection.execute(sql)
	doctors = {line[0]:(line[1], line[2], line[3], line[4], line[5], line[6], line[7], line[8], line[9]) for line in cmd}

	#Get taxonomy code mapping
	sql = "SELECT Code, Type, Classification, Specialization from taxonomy;"
	cmd = connection.execute(sql)
	taxonomy = {line[0]:(line[1], line[2], line[3]) for line in cmd}

	#Create nodes for inserting into networkx
	import itertools
	uniqueNPI = set(itertools.chain.from_iterable(wedges.keys()))
	dnames = dict([(key, str(value[0]) + ", " + str(value[1])) for key, value in doctors.iteritems() if key in uniqueNPI])
	dnames2 = dict([(str(value[0]) + ", " + str(value[1]), key) for key, value in doctors.iteritems() if key in uniqueNPI])
	nodes = dnames.values()
	
	#Create edges for inserting into networkx
	edges = [(dnames[key[0]], dnames[key[1]], value) for key, value in wedges.iteritems()]

	#Create networkx objects
	G1=nx.Graph()
	G1.add_nodes_from(nodes)
	G1.add_weighted_edges_from(edges)

	graphs = list(nx.connected_component_subgraphs(G1))

	subgroups = {}
	for i in range(len(graphs)):
		for node in graphs[i].nodes():
			subgroups[node] = i

	#creating referring docs list
	referringdocs = [key[0] for key in wedges.keys()]
	referreddocs = [key[1] for key in wedges.keys()]

	#make file for network graph
	nodelist = []
	for node in G1.nodes():
	    newdict = {}
	    newdict['name'] = node
	    if dnames2[node] in referringdocs:
	        newdict['type'] = 'referring'
	    elif dnames2[node] in referreddocs:
	        newdict['type'] = 'referred'
	    newdict['group'] = subgroups[node]
	    nodelist.append(newdict)

	namenumber = {}
	for i, node in enumerate(G1.nodes()):
	    namenumber[node] = i

	linklist = []
	for i, edge in enumerate(G1.edges()):
	    newdict = {}
	    newdict['source'] = namenumber[edge[0]]
	    newdict['target'] = namenumber[edge[1]]
	    linklist.append(newdict)

	network = {}
	network['nodes'] = nodelist
	network['links'] = linklist

	#make file for top doctors
	G = nx.DiGraph()

	G.add_nodes_from(nodes)
	G.add_weighted_edges_from(edges)

	centrality = nx.eigenvector_centrality(G, max_iter=100000)
	eigenlist = [(node,centrality[node]) for node in centrality]

	topdoctors = sorted(eigenlist, key = lambda tup: -tup[1])[0:20]

	topdocjson = []
	for i, doctor in enumerate(topdoctors):
	    newdict = {}
	    newdict['rank'] = i + 1
	    newdict['name'] = "DR. " + doctor[0]
	    newdict['NPI'] = dnames2[doctor[0]]
	    newdict['add'] = doctors[dnames2[doctor[0]]][5] + ", " + doctors[dnames2[doctor[0]]][6] + ", "+ doctors[dnames2[doctor[0]]][7] + ", "+ doctors[dnames2[doctor[0]]][8]
	    newdict['url'] = "https://www.google.com/search?q=" + "dr+" + doctor[0].split(", ")[0] + "+" + doctor[0].split(", ")[1]

	    specialty = [item for item in [doctors[dnames2[doctor[0]]][2], doctors[dnames2[doctor[0]]][3],doctors[dnames2[doctor[0]]][4]] if item is not None]
	    spec = []
	    for item in specialty:
	        if taxonomy[item][2] != "N/A":
	            spec.append(taxonomy[item][1] + "/ " + taxonomy[item][2])
	        elif taxonomy[item][2] == "N/A":
	            spec.append(taxonomy[item][1])
	    newdict['specialty'] = spec
	    
	    topdocjson.append(newdict)

	top={}
	top['output'] = topdocjson

	output={}
	output['network'] = network
	output['topdocs'] = top

	return flask.jsonify(output)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.debug = True
    app.run(host='0.0.0.0', port=port)