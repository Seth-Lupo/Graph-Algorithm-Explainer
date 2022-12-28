function drawIntersectionSprite(p, x, y, dim, backgroundColor) {
	p.strokeWeight(dim/25)
		p.stroke(0)
		p.fill(220)
		p.ellipse(x + dim * 0.5, y + dim * 0.5, dim * 0.9, dim * 0.9)
		p.fill(backgroundColor)
		p.ellipse(x + dim * 0.5, y + dim * 0.5, dim * 0.3, dim * 0.3)

		p.stroke(253,218,22)
		let increment = Math.PI / 8
		for (let i = 0; i < Math.PI * 2; i += 2 * increment) {
			p.line(x + dim * 0.5 + dim * 0.3 * Math.cos(i),
						y + dim * 0.5 + dim * 0.3 * Math.sin(i),
						x + dim * 0.5 + dim * 0.3 * Math.cos(i + increment), 
						y + dim * 0.5 + dim * 0.3 * Math.sin(i + increment))
		}
}

function drawRoadSprite(p, x, y, dim) {

	p.noStroke()
	p.fill(220)

	p.rect(x + 0.1 * dim, y + 0.333 * dim, 0.8 * dim, 0.333 * dim)

	p.strokeWeight(dim/25)
	p.stroke(0)

	p.line(x + 0.1 * dim, y + 0.333 * dim, x + 0.9 * dim, y + 0.333 * dim)
	p.line(x + 0.1 * dim, y + 0.667 * dim, x + 0.9 * dim, y + 0.667 * dim)

	p.stroke(253,218,22)
	let increment = dim * 0.1
	for (let i = x + dim * 0.15; i < x + dim * 0.9; i += increment * 2) {
		p.line(i, y + dim * 0.5, i + increment, y + dim * 0.5)
	}
}

function displayMatrix(p, matrix, info) {

	let matrixString = ""
	for (let i = 0; i < matrix.length; i++) {
		let row = "<br>|"
		for (let j = 0; j < matrix.length; j++) {
			let num = Math.round(matrix[i][j]).toString()
			if (matrix[i][j] == Number.POSITIVE_INFINITY) num = "inf"
			let whiteSpace = 5 - num.length
			row += (num.padStart(whiteSpace * 6 + num.length, "&nbsp;") + ",")
		}
		matrixString += row.slice(0, -1) + '|';
	}

	$("#output").html(info + "<br>"+ matrixString)
}

class Palette {

	constructor(p, x, y, type) {

		this.dim = 100;
		this.backgroundColor = p.color(246, 245, 245)
		this.clickable = false
		this.selected = false

		this.p = p
		this.x = x
		this.y = y
		this.type = type;

	}

	draw() {

		this.checkHover()
		if (this.selected) {
			if (this.type != 3) this.backgroundColor = this.p.color("#6bff8d")
			else this.backgroundColor = this.p.color("#ff6977")
		}

		this.p.fill(this.backgroundColor)
		this.p.stroke(this.backgroundColor)
		this.p.rect(this.x, this.y, this.dim, this.dim, 5)

		if (this.type == 0) this.p.image(this.p.HOUSE_IMG, this.x, this.y, this.dim, this.dim); 
		else if (this.type == 1) drawIntersectionSprite(this.p, this.x, this.y, this.dim, this.backgroundColor)
		else if (this.type == 2) drawRoadSprite(this.p, this.x, this.y, this.dim)
		else if (this.type == 3) this.p.image(this.p.TRASH_IMG, this.x, this.y, this.dim, this.dim); 
	
	}

	checkHover () {


		let withinX = (this.p.mouseX > this.x) && (this.p.mouseX < this.x + this.dim)
		let withinY = (this.p.mouseY > this.y) && (this.p.mouseY < this.y + this.dim)

		this.clickable = withinX && withinY

		if (this.clickable) {

			if (this.type == 3) this.backgroundColor = this.p.color("#bd2130")
			else this.backgroundColor = this.p.color("#28a745")


		} else {

			this.backgroundColor = this.p.color(246, 245, 245)

		}

	}

	checkGrab () {

		this.selected = false

		if (this.clickable && this.p.selectedNode != this.p.nodeArray[0]) {

			if (this.selected) this.selected = false
			else this.selected = true

			if (this.type == 0) this.p.holdingHouse = true
			else if (this.type == 1) this.p.holdingIntersection = true
			else if (this.type == 2) this.p.holdingRoad = true
			else this.p.deleting = true

		} 

		



	}
}

class GraphNode {

	constructor(p, x, y, type) {

		this.highlighted = false
		this.semilighted = false
		this.markated = false

		this.selected = false
		this.clickable = false

		this.index = 0

		this.p = p
		this.x = x
		this.y = y
		this.type = type

	}

	draw() {

		this.checkHover()

		if (this.selected) {
			this.x = this.p.mouseX
			this.y = this.p.mouseY
		}

		this.p.noStroke()
		this.p.fill(0, 0, 0, 0)
		
		if (this.markated) this.p.fill(255, 0, 0, 180)
		else if (this.highlighted) this.p.fill(255, 255, 0, 180)
		else if (this.semilighted) this.p.fill(255, 255, 255, 180)
		else if (this.clickable) this.p.fill(255, 255, 0, 90)
		this.p.ellipse(this.x, this.y, 60, 60)
		
		if (this.p.sound) {
			
			if (this.type == 0) this.p.fill(188,74,60)
			else if (this.type == 1) this.p.fill(115,103,89)
			else this.p.fill(220,220,220)
			this.p.rect(this.x-15, this.y-15, 30, 30, 5)
			this.p.fill(0)
			this.p.textSize(20)
			this.p.textAlign(this.p.CENTER)
			this.p.text(this.index.toString(), this.x, this.y+7)


		} else {

			if (this.type == 0) this.p.image(this.p.STORE_IMG, this.x - 20, this.y - 20, 40, 40)
			else if (this.type == 1) this.p.image(this.p.HOUSE_IMG, this.x - 20, this.y - 20, 40, 40)
			else drawIntersectionSprite(this.p, this.x - 20, this.y - 20, 40, this.p.color(210,228,213))

		}




	}

	checkHover() {

		let withinX = (this.p.mouseX > this.x - 20) && (this.p.mouseX < this.x + 20)
		let withinY = (this.p.mouseY > this.y - 20) && (this.p.mouseY < this.y + 20)

		this.clickable = withinX && withinY


	}

	checkGrab() {

		if (this.selected) {
			
			this.selected = false
			if (this == this.p.selectedNode) this.p.selectedNode = null
			
			if (this.x < 130) {
				if (this.type == 0) {
					this.selected = true
					this.p.selectedNode = this
				}
				else this.delete()
			}
		
		} else if (this.clickable) {
			
			if (this.p.deleting && this != this.p.nodeArray[0]) this.delete() 
			else {
				this.selected = true
				this.p.selectedNode = this
			}
		}

	}

	delete() {
		
		var thisNode = this

		this.p.nodeArray = this.p.nodeArray.filter(function(value){ 
        	return value != thisNode
    	});

		this.p.edgeArray = this.p.edgeArray.filter(function(value){ 
        	return (value.node1 != thisNode) && (value.node2 != thisNode)
    	});

	
		
	}
}

class GraphEdge {

	constructor (p, node1, node2) {

		this.clickable = false
		this.markated = false
		this.highlighted = false
		this.semilighted = false

		this.p = p
		this.node1 = node1
		this.node2 = node2

	}

	draw() {

		this.clickable = this.pDistance(this.p.mouseX, this.p.mouseY, this.node1.x, this.node1.y, this.node2.x, this.node2.y) < 10

		this.p.strokeWeight(24)
		this.p.stroke(0, 0, 0, 0)
		
		if (this.markated) this.p.stroke(255, 0, 0, 180)
		else if (this.highlighted) this.p.stroke(255, 255, 0, 180)
		else if (this.semilighted) this.p.stroke(255, 255, 255, 180)
		else if (this.clickable) this.p.stroke(255, 255, 0, 90)
		this.p.line(this.node1.x, this.node1.y, this.node2.x, this.node2.y)

		this.p.strokeWeight(12)
		this.p.stroke(220)
		this.p.line(this.node1.x, this.node1.y, this.node2.x, this.node2.y)

		this.p.strokeWeight(1)
		this.p.stroke(0)
		let angle = this.p.atan2((this.node2.y - this.node1.y), (this.node2.x - this.node1.x))
		let shiftX = Math.cos(angle + Math.PI/2) * 6
		let shiftY = Math.sin(angle +  Math.PI/2) * 6
		this.p.line(this.node1.x + shiftX, this.node1.y + shiftY, this.node2.x + shiftX, this.node2.y + shiftY)
		this.p.line(this.node1.x - shiftX, this.node1.y - shiftY, this.node2.x - shiftX, this.node2.y - shiftY)
		
		this.p.stroke(253,218,22)
		let incrementX = Math.cos(angle) * 5
		let incrementY = Math.sin(angle) * 5
		let i = this.node1.x
		let j = this.node1.y
		while (Math.pow((i - this.node2.x), 2) + Math.pow((j - this.node2.y), 2) > 50) {
			this.p.line(i, j, i + incrementX, j + incrementY)
			i += incrementX * 2
			j += incrementY * 2
		}


	}

	checkGrab() {

		if (this.p.deleting) {
			if (this.clickable) {
				var thisEdge = this
				this.p.edgeArray = this.p.edgeArray.filter(function(value){ 
		        	return value != thisEdge;
		    	});
			}
		}

	}

	getWeight() {
		return Math.sqrt(Math.pow(this.node2.x - this.node1.x, 2) + Math.pow(this.node2.y - this.node1.y, 2))
	} 

	//Thx Joshua from Stack Exchange :D
	pDistance(x, y, x1, y1, x2, y2) {

		  var A = x - x1;
		  var B = y - y1;
		  var C = x2 - x1;
		  var D = y2 - y1;

		  var dot = A * C + B * D;
		  var len_sq = C * C + D * D;
		  var param = -1;
		  if (len_sq != 0) //in case of 0 length line
		      param = dot / len_sq;

		  var xx, yy;

		  if (param < 0) {
		    xx = x1;
		    yy = y1;
		  }
		  else if (param > 1) {
		    xx = x2;
		    yy = y2;
		  }
		  else {
		    xx = x1 + param * C;
		    yy = y1 + param * D;
		  }

		  var dx = x - xx;
		  var dy = y - yy;
		  return Math.sqrt(dx * dx + dy * dy);
	}

}

function clone2DArray(arr) {

	var copy = new Array(arr.length)
	for (var i = 0; i < arr.length; i++) {
		copy[i] = [...arr[i]]
	}

	return copy

}

async function checkpoint(p) {
	if (p.pause) {
		while (p.pause) {
			await new Promise(r => setTimeout(r, 200))
		}
	}
}

function resetNums(p) {
	p.nodeArray.sort((a, b) => a.type - b.type);
	for (let i = 0; i < p.nodeArray.length; i++) {
		p.nodeArray[i].index = i
	}
} 

async function createRawMatrices(p) {

	resetNums(p)

	var rawWeightMatrix = []
	var rawEdgeMatrix = []

	for (let i = 0; i < p.nodeArray.length; i++) {
		
		let weightRow = []
		let edgeRow = []
		
		for (let j = 0; j < p.nodeArray.length; j++) {
			
			edgeRow.push(0)
			weightRow.push(Number.POSITIVE_INFINITY)
		
		}
		
		rawWeightMatrix.push(weightRow)
		rawEdgeMatrix.push(edgeRow)

	} 


	for (let edge of p.edgeArray) {

		edge.semilighted = true
		edge.node1.semilighted = true
		edge.node2.semilighted = true

		rawEdgeMatrix[edge.node1.index][edge.node2.index] = edge
		rawEdgeMatrix[edge.node2.index][edge.node1.index] = edge

		rawWeightMatrix[edge.node1.index][edge.node2.index] = edge.getWeight()
		rawWeightMatrix[edge.node2.index][edge.node1.index] = edge.getWeight()
		

		if (p.animateCalc) {
			$("#output").text("Recording nodes " + edge.node1.index + " and " + edge.node2.index + " into adjacency matrix with weight of " + edge.getWeight() + "." )
			await new Promise(r => setTimeout(r, p.animationSpeed * 15 + 20));
		} else $("#output").text("Calculating...")

		await checkpoint(p)

		edge.semilighted = false
		edge.node1.semilighted = false
		edge.node2.semilighted = false


	}

	return Promise.resolve([rawWeightMatrix, rawEdgeMatrix])

}

async function createAPSPMatrices(p, weightMatrix, edgeMatrix) {
	
	var apspWeightMatrix = clone2DArray(weightMatrix)
	var apspPathMatrix = clone2DArray(edgeMatrix)

	for (let i = 0; i < apspPathMatrix.length; i++) {
		for (let j = 0; j < apspPathMatrix.length; j++) {
			if (apspPathMatrix[i][j] != 0) {
				apspPathMatrix[i][j] = [p.nodeArray[i], p.nodeArray[j]]
			}
		}
	}

	for (let k = 0; k < apspWeightMatrix.length; k++) {
		for (let i = 0; i < apspWeightMatrix.length; i++) {
			for (let j = 0; j < apspWeightMatrix.length; j++) {
				
				var display = false
				var secondSentence = ""

				var newPath = []
				if (apspWeightMatrix[i][k] > 0 && apspWeightMatrix[k][j] > 0 && apspWeightMatrix[i][k] + apspWeightMatrix[k][j] < Number.POSITIVE_INFINITY) {
					newPath = [].concat(apspPathMatrix[i][k].slice(0, -1), apspPathMatrix[k][j])	
				} 
				
				var originalPath = []
				if (apspPathMatrix[i][j] != 0) {
					originalPath = apspPathMatrix[i][j]
				}
			
				for (let node of originalPath) node.highlighted = true
                for (let i = 0; i < originalPath.length - 1; i++) {
                	edgeMatrix[originalPath[i].index][originalPath[i + 1].index].highlighted = true
                }
                
                let useNewPath = apspWeightMatrix[i][k] + apspWeightMatrix[k][j] < apspWeightMatrix[i][j]
				if (useNewPath) {

					secondSentence = "YES Our new route is faster "

                	apspWeightMatrix[i][j] = apspWeightMatrix[i][k] + apspWeightMatrix[k][j];
                	apspPathMatrix[i][j] = newPath
                	
					for (let node of newPath) {
						if (!node.highlighted) {
							node.markated = true
							display = true
						}
					}
                	for (let i = 0; i < newPath.length - 1; i++) {
                		if (!edgeMatrix[newPath[i].index][newPath[i + 1].index].highlighted) {
                			edgeMatrix[newPath[i].index][newPath[i + 1].index].markated = true
                		}
                	}
              
                } else {

                	secondSentence = "NO! Our new route is slower "

                	for (let node of newPath) {
						if (!node.highlighted) {
							node.semilighted = true
							display = true
						}
					}
                	
                	for (let i = 0; i < newPath.length - 1; i++) {
                		if (!edgeMatrix[newPath[i].index][newPath[i + 1].index].highlighted) {
                			edgeMatrix[newPath[i].index][newPath[i + 1].index].semilighted = true
                		}
                	}

                }

                if (p.animateCalc && display) {

                	let originalString = "("
                	for (let node of originalPath) {
                		originalString += node.index.toString() + ","
                	}
                	originalString = originalString.slice(0, -1) + ")"

                	let newString = "("
                	for (let node of newPath) {
                		newString += node.index.toString() + ","
                	}
                	newString = newString.slice(0, -1) + ")"

                	if (originalString.length == 1) originalString = "()"
                	if (newString.length == 1) newString = "()"

                	difference = "by " + Math.abs(apspWeightMatrix[i][k] + apspWeightMatrix[k][j] - apspWeightMatrix[i][j]).toString() + "."
                	if (originalString == "()") difference = "because it is the first path connecting these nodes!"

					$("#output").text("Is the new path " + newString + " faster than " + originalString + "? " + secondSentence + difference)
					await new Promise(r => setTimeout(r, p.animationSpeed * 15 + 2));
				} else $("#output").text("Calculating...")

                await checkpoint(p)

                for (let node of p.nodeArray) {
                	node.semilighted = false
                	node.highlighted = false
                	node.markated = false
                }

                for (let edge of p.edgeArray)  {
                	edge.semilighted = false
                	edge.highlighted = false
                	edge.markated = false
                }

			}
		}
	}

	return [apspWeightMatrix, apspPathMatrix]

	

}

async function completeTSP(p, weightMatrix, edgeMatrix, pathMatrix) {

	if (p.animateCalc) {
		$("#output").text("We can finally begin the TSP Algorithm. First, lets record all of the nodes original distance to the store. This is analogous to our base case.")
		await new Promise(r => setTimeout(r, 3000));
	} else $("#output").text("Calculating...")

	var memo = []
	for (let i = 0; i < p.importantNodeQuantity; i++) {
		let row = new Array(Math.pow(2, p.importantNodeQuantity)).fill(Number.POSITIVE_INFINITY)
		memo.push(row) 
	}

	for (let i = 1; i < p.importantNodeQuantity; i++) {

		if (p.animateCalc) {

			let visibleNodePath = pathMatrix[0][i]
			visibleNodePath[0].semilighted = true
			for (let i = 0; i < visibleNodePath.length-1; i++) {
				visibleNodePath[i+1].semilighted = true
				edgeMatrix[visibleNodePath[i].index][visibleNodePath[i+1].index].semilighted = true
			}
			
			$("#output").text("Plugging in path from node 0 to node " + i + ".")
			await new Promise(r => setTimeout(r, p.animationSpeed * 15 + 20));

			visibleNodePath[0].semilighted = false
			for (let i = 0; i < visibleNodePath.length-1; i++) {
				visibleNodePath[i+1].semilighted = false
				edgeMatrix[visibleNodePath[i].index][visibleNodePath[i+1].index].semilighted = false
			}
		
		} else $("#output").text("Calculating...")

		memo[i][1 | 1<<i] = weightMatrix[0][i]
	}

	var combUtil = (set, at, n, k, subsets) => {
		if (k == 0) {
			subsets.push(set)
		} else {
			for (let i = at; i < n; i++) {
				set = set | (1<<i)
				combUtil(set, i+1, n, k-1, subsets)
				set = set ^ (1<<i)
			}
		}
	}

	var comb = (n, k) => {

		subsets = []
		
		combUtil(0, 0, n, k, subsets)
		return subsets
	
	}

	var notIn = (i, subset) => {
		return ((1<<i) & subset) == 0
	}

	if (p.animateCalc) {
		$("#output").text("Knowing the base case, we can now find and record the distance it takes to visit each subset and end at a certain node (this is very resource intensive).")
		await new Promise(r => setTimeout(r, 3000));
	} else $("#output").text("Calculating...")

	for (let size = 3; size <= p.importantNodeQuantity; size++) {

		for (let subsetMask of comb(p.importantNodeQuantity, size)) {
			
			if (notIn(0, subsetMask)) continue 
			for (let nextNode = 1; nextNode < p.importantNodeQuantity; nextNode++) {
				
				if (notIn(nextNode, subsetMask)) continue
				
				let subsetMaskWithoutNext = subsetMask ^ (1<<nextNode) 
				let minDist = Number.POSITIVE_INFINITY
				
				for (let endNode = 1; endNode < p.importantNodeQuantity; endNode++) {
					
					if (endNode == nextNode || notIn(endNode, subsetMask)) continue

					newDist = memo[endNode][subsetMaskWithoutNext] + weightMatrix[endNode][nextNode]

					if (p.animateCalc) {
						
						let nodeSubset = p.nodeArray.filter((obj) => {return !notIn(obj.index, subsetMaskWithoutNext)})
						let lastPath = pathMatrix[endNode][nextNode]

						let nodeSubsetString = "{"
						for (let node of nodeSubset) {
							nodeSubsetString += node.index + ","
						}
						nodeSubsetString = nodeSubsetString.slice(0, -1) + "}"

						let secondSentence = ""

						if (newDist < minDist) {
							for (let node of nodeSubset) {
								node.markated = true
							}
							for (let i = 0; i < lastPath.length-1; i++) {
								edgeMatrix[lastPath[i].index][lastPath[i+1].index].highlighted = true
							}
							secondSentence = "YES! It is faster by " + (minDist - newDist) + "!"
							if ((minDist - newDist) == Number.POSITIVE_INFINITY) secondSentence = "YES! It is the first time we have recorded this subset and node!"
						} else {
							for (let node of nodeSubset) {
								node.semilighted = true
							}
							for (let i = 0; i < lastPath.length-1; i++) {
								edgeMatrix[lastPath[i].index][lastPath[i+1].index].highlighted = true
							}
							secondSentence = "NO! It is slower by " + (newDist - minDist) + "!" 
						}
						
						p.nodeArray[nextNode].highlighted = true
						
						$("#output").text("Is traversing subset " + nodeSubsetString + " and than arriving at node " + nextNode + " fastest when visiting node " + endNode + " last? " + secondSentence)
						await new Promise(r => setTimeout(r, p.animationSpeed * 15 + 1));

						await checkpoint(p)

						p.nodeArray[nextNode].highlighted = false

						for (let node of nodeSubset) {
							node.markated = false
							node.semilighted = false
						}
						for (let i = 0; i < lastPath.length-1; i++) {
							edgeMatrix[lastPath[i].index][lastPath[i+1].index].highlighted = false
						}

					} else $("#output").text("Calculating...")

					minDist = Math.min(newDist, minDist)

				}

				memo[nextNode][subsetMask] = minDist

			}

		}

	}

	if (p.animateCalc) {
		$("#output").text("Because we recorded the minimum distance for subsets all subsets ending at a certain node, we can backtrack to find the shortest path that contains all necessary nodes.")
		await new Promise(r => setTimeout(r, 3000));
	} else $("#output").text("Calculating...")

	let nodePath = [p.nodeArray[0]]
	let edgePath = []
	let currMask = (1<<p.importantNodeQuantity) - 1
	let lastNode = 0
	let optimalNode = -1
	for (let i = p.importantNodeQuantity-1; i > 0; i--) {
		
		optimalNode = -1
		
		for (let j = 1; j < p.importantNodeQuantity; j++) {
			
			if (notIn(j, currMask)) continue

			if (optimalNode == -1) optimalNode = j

			let prevDist = memo[optimalNode][currMask] + weightMatrix[optimalNode][lastNode]
			let newDist = memo[j][currMask] + weightMatrix[j][lastNode]

			if (p.animateCalc) {

				let secondSentence = "NO! According to our memo table, that route is slower by " + (newDist - prevDist) + "!"
				if (prevDist == newDist) secondSentence = "NO! According to our memo table, that route is simply equal in distance."
				if (newDist < prevDist) secondSentence = "YES! According to our memo table, that route is faster by " + (prevDist - newDist) + "!"

				for (let node of nodePath) {
					node.highlighted = true
				}
				for (let edge of edgePath) {
					edge.highlighted = true
				}

				let newTestingNodePath = pathMatrix[j][nodePath[0].index] 
				let oldTestingNodePath = pathMatrix[optimalNode][nodePath[0].index] 

				if (newDist < prevDist) p.nodeArray[j].markated = true 
				else p.nodeArray[j].semilighted = true 

				for (let k = 0; k < newTestingNodePath.length-1; k++) {
					if (newDist < prevDist) {
						edgeMatrix[newTestingNodePath[k].index][newTestingNodePath[k+1].index].markated = true
					} else {
						edgeMatrix[newTestingNodePath[k].index][newTestingNodePath[k+1].index].semilighted = true
					}
				}

				p.nodeArray[optimalNode].highlighted = true 
				for (let k = 0; k < oldTestingNodePath.length-1; k++) {
					edgeMatrix[oldTestingNodePath[k].index][oldTestingNodePath[k+1].index].highlighted = true
				}

				$("#output").text("Should the next last node in our path be node " + j + " or our previous optimal node " + optimalNode + "? " + secondSentence )
				await new Promise(r => setTimeout(r, p.animationSpeed * 15 + 10));

				await checkpoint(p)
				
				for (let node of p.nodeArray) {
					node.highlighted = false
					node.semilighted = false
					node.markated = false
				}
				for (let edge of p.edgeArray) {
					edge.highlighted = false
					edge.semilighted = false
					edge.markated = false
				}

			} else $("#output").text("Calculating...")

			if (newDist < prevDist) optimalNode = j

		}


		let additionalPath = pathMatrix[optimalNode][nodePath[0].index]

		for (let j = additionalPath.length-1; j > 0; j--) {
			edgePath = [edgeMatrix[additionalPath[j].index][additionalPath[j-1].index]].concat(edgePath)
		}

		additionalPath = additionalPath.slice(0, additionalPath.length-1)
		nodePath = additionalPath.concat(nodePath)

		currMask = currMask ^ (1<<optimalNode)
		lastNode = optimalNode

	}

	let additionalPath = pathMatrix[0][optimalNode]



	for (let j = additionalPath.length-1; j > 0; j--) {
		edgePath = [edgeMatrix[additionalPath[j].index][additionalPath[j-1].index]].concat(edgePath)
	}

	additionalPath = additionalPath.slice(0, additionalPath.length-1)
	nodePath = additionalPath.concat(nodePath)

	if (p.animateCalc) {

		$("#output").text("There are no other options than to connect the path back to the store.")

		for (node in nodePath) node.highlighted = true
		for (edge in edgePath) edge.highlighted = true

		await new Promise(r => setTimeout(r, p.animationSpeed * 15 + 10));

		for (node in nodePath) node.highlighted = false
		for (edge in edgePath) edge.highlighted = false

	}

	nodePath[0].highlighted = true
	let pathLength = 0
	$("#output").text("Loading... The path is " + pathLength + " pixels.")
	await new Promise(r => setTimeout(r, 100))
	nodePath[0].markated = true
	nodePath[0].highlighted = false

	nodePath[1].highlighted = true
	edgePath[0].highlighted = true
	pathLength += edgePath[0].getWeight()
	$("#output").text("Loading... The path is " + pathLength + " pixels.")
	await new Promise(r => setTimeout(r, 100))
	
	for (let i = 0; i < nodePath.length-2; i++) {
		
		nodePath[i+1].markated = true
		edgePath[i].markated = true
		nodePath[i+1].highlighted = false
		edgePath[i].highlighted = false
		
		nodePath[i+2].highlighted = true
		edgePath[i+1].highlighted = true

		pathLength += edgePath[i].getWeight()
		$("#output").text("Loading... The path is " + pathLength + " pixels.")
		await new Promise(r => setTimeout(r, 100))
		await checkpoint(p)
	
	}

	nodePath[nodePath.length-1].markated = true
	edgePath[edgePath.length-1].markated = true
	nodePath[nodePath.length-1].highlighted = false
	edgePath[edgePath.length-1].highlighted = false

	let pathString = "("
	for (let node of nodePath) {
		pathString += node.index.toString() + ","
	}
	pathString = pathString.slice(0, -1) + ")"

	let secondSentence = ""
	if (p.animateDrive) secondSentence =  "Knowing this, lets drive to every house! :D"

	$("#output").text("The shortest path that visits all houses is " + pathString + ". This path is " + pathLength + " pixels. " + secondSentence)
	await new Promise(r => setTimeout(r, 100))

	return [nodePath, pathLength]

}

async function animateDrive(p, path) {

	p.drawCar = true

	p.carDir = p.atan2(path[1].y - path[0].y, path[1].x - path[0].x)

	for (let i = 0; (i < path.length-1) && p.animateDrive; i++) {

		await checkpoint(p)

		p.carX = path[i].x
		p.carY = path[i].y

		if (path[i].type != 2 && !path[i].highlighted) {
			await new Promise(r => setTimeout(r, 200 + 8 * p.animationSpeed));
			path[i].markated = false
			path[i].highlighted = true
		}

		
		p.carDir = p.atan2(path[i+1].y - path[i].y, path[i+1].x - path[i].x)

		let speed = 2 - 1.5 * p.animationSpeed/100
		let velX =  speed * Math.cos(p.carDir)
		let velY = speed * Math.sin(p.carDir)


		let remainingDist = Math.sqrt(Math.pow(path[i+1].y - path[i].y, 2) + Math.pow(path[i+1].x - path[i].x, 2))

		while (p.animateDrive && remainingDist > 2) {

			p.carX += velX
			p.carY += velY
			remainingDist -= speed

			await checkpoint(p)
			if (!p.animateDrive) break
			await new Promise(r => setTimeout(r, 1));
		
		}

	}

	await new Promise(r => setTimeout(r, 1000));

	p.drawCar = false

}

function simulation(p) {
	
	p.init = function () {

		p.HOUSE_IMG = p.loadImage("https://i.ibb.co/J3LLbJH/house.png");
		p.CAR_IMG = p.loadImage("https://i.ibb.co/0Jsc2hQ/car.png");
		p.STORE_IMG = p.loadImage("https://i.ibb.co/kctg4Pt/store.png");
		p.TRASH_IMG = p.loadImage("https://i.ibb.co/WG26jqZ/trash.png");

		p.pause = false
		p.runningSim = false

		p.sound = $("#soundCheckbox").is(':checked')
		p.animateDrive = $("#drivingCheckbox").is(':checked')
		p.animateCalc = $("#processingCheckbox").is(':checked')
		p.animationSpeed = 100-$("#speedRange").val()

		p.holdingHouse = false
		p.holdingIntersection = false
		p.holdingRoad = false
		p.draggingRoad = false
		p.draggingRoadNode = null
		p.deleting = false

		p.drawCar = false
		p.carDir = 0
		p.carX = 400
		p.carY = 400

		p.housePalette = new Palette(p, 10, 10, 0)
		p.intersectionPalette = new Palette(p, 10, 120, 1)
		p.roadPalette = new Palette(p, 10, 230, 2)
		p.trashPalette = new Palette(p, 10, 340, 3)		

		p.selectedNode = null
		p.importantNodeQuantity = 0
		p.nodeArray = []
		p.nodeArray.push(new GraphNode(p, $("#canvasDiv").width() * 0.5, $("#canvasDiv").height() * 0.5, 0))

		p.edgeArray = []

	}

	p.runSim = async function () {

		for (let node of p.nodeArray) {
			node.markated = false
			node.highlighted = false
		}

		for (let edge of p.edgeArray) {
			edge.markated = false
			edge.highlighted = false
		}

		p.pause = false
		p.runningSim = true
		$("#startButton").prop("disabled", true)
		$("#clearButton").prop("disabled", true)
		$("#endButton").prop("disabled", false)

		p.importantNodeQuantity = p.nodeArray.filter((obj) => obj.type == 1).length + 1

		if (p.importantNodeQuantity < 2) {

			$("#output").text("Simulation ended! You need to add at least one house to the map. Restart the simulation when fixed.")
			$("#startButton").prop("disabled", false)
			$("#clearButton").prop("disabled", false)
			$("#endButton").prop("disabled", true)
			p.runningSim = false
			return -1

		} else if (p.importantNodeQuantity > 21) {

			$("#output").text("Simulation ended! Remember that this algorithm CANNOT BE DONE IN POLYNOMIAL TIME! Please limit youself to only 20 houses. Restart the simulation when fixed.")
			$("#startButton").prop("disabled", false)
			$("#clearButton").prop("disabled", false)
			$("#endButton").prop("disabled", true)
			p.runningSim = false
			return -1
		}

		if (p.animateCalc) {
			$("#output").text("We first must create an adjacency matrix based on this graph. It will weight edges based on distances.")
			await new Promise(r => setTimeout(r, 3000))
		} else {
			$("#output").text("Calculating...")
			await new Promise(r => setTimeout(r, 100))
		}

		await checkpoint(p)

		let [weightMatrix, edgeMatrix] = await createRawMatrices(p)

		await checkpoint(p)

		if (p.animateCalc) {
			displayMatrix(p, weightMatrix, "This is our weighted adjacency matrix for using 1 edge (rounded to the nearest integer):")
			await new Promise(r => setTimeout(r, 3000));
		} else $("#output").text("Calculating...")

		await checkpoint(p)

		if (p.animateCalc) {
			$("#output").text("Now we use the Floyd-Warshall Algorithm to find the all pairs shortest path matrix. Simulatanously, we will store the least length paths between all nodes. (Animation will not show new and old paths that are identical)" )
			await new Promise(r => setTimeout(r, 3000));
		} else $("#output").text("Calculating...")

		await checkpoint(p)

		let [apspWeightMatrix, apspPathMatrix] = await createAPSPMatrices(p, weightMatrix, edgeMatrix)

		if (p.animateCalc) {
			displayMatrix(p, apspWeightMatrix, "This is our weighted adjacency matrix for using any quantity of edges (rounded to the nearest integer):")
			await new Promise(r => setTimeout(r, 3000));
		} else $("#output").text("Calculating...")

		await checkpoint(p)

		let allNodesAccessible = true
		mainLoop: 
			for (let i = 0; i < p.importantNodeQuantity; i++) {
				for (let j = 0; j < p.importantNodeQuantity; j++) {
					if (apspWeightMatrix[i][j] == Number.POSITIVE_INFINITY) {
						allNodesAccessible = false
						break mainLoop
					}
				}
			}

		if (!allNodesAccessible) {

			$("#output").text("Simulation ended! At least one house is not accessible from the store. Restart the simulation when fixed.")
			$("#startButton").prop("disabled", false)
			$("#clearButton").prop("disabled", false)
			$("#endButton").prop("disabled", true)
			p.runningSim = false
			return -1

		}

		await checkpoint(p)

		let [path, pathDist] = await completeTSP(p, apspWeightMatrix, edgeMatrix, apspPathMatrix)

		await checkpoint(p)

		await new Promise(r => setTimeout(r, 3000));

		await checkpoint(p)

		await animateDrive(p, path)

		p.runningSim = false
		$("#output").text("Simulation complete! Edit the map or replay the simulation.")
		$("#startButton").prop("disabled", false)
		$("#clearButton").prop("disabled", false)
		$("#endButton").prop("disabled", true)

	}

	p.setup = function () {

		p.init()

		$("#clearButton").click(p.init)

		$("#startButton").click(p.runSim)

		$("#endButton")
		.click(() => {

			if (p.pause) {
				$("#endButton")
				.html("Pause<br>Sim")
				.attr("class", "simulationButtons btn btn-outline-warning")
				p.pause = false
			} else {
				$("#endButton")
				.html("Resume<br>Sim")
				.attr("class", "simulationButtons btn btn-outline-secondary")
				p.pause = true
			}

		})

		$("#speedRange")
		.change(function() {
			p.animationSpeed = 100-$("#speedRange").val()
		})


		$("#processingCheckbox")
		.change(function() {
			p.animateCalc = $("#processingCheckbox").is(':checked')
		})

		$("#drivingCheckbox")
		.change(function() {
			p.animateDrive = $("#drivingCheckbox").is(':checked')
		})
		
		$("#soundCheckbox")
		.change(function() {
			p.sound = $("#soundCheckbox").is(':checked')
		})


    	p.createCanvas($("#canvasDiv").width(), 500);
  	}

  	p.draw = function () {
    	
    	p.background(210,228,213)

    	if (p.draggingRoad) {
    		
    		p.strokeWeight(12)
    		p.stroke(220)
    		p.line(p.draggingRoadNode.x, p.draggingRoadNode.y, p.mouseX, p.mouseY)

    		p.strokeWeight(1)
    		p.stroke(0)
    		let angle = p.atan2((p.mouseY - p.draggingRoadNode.y) , (p.mouseX - p.draggingRoadNode.x))
    		let shiftX = Math.cos(angle + Math.PI/2) * 6
    		let shiftY = Math.sin(angle +  Math.PI/2) * 6
    		p.line(p.draggingRoadNode.x + shiftX, p.draggingRoadNode.y + shiftY, p.mouseX + shiftX, p.mouseY + shiftY)
    		p.line(p.draggingRoadNode.x - shiftX, p.draggingRoadNode.y - shiftY, p.mouseX - shiftX, p.mouseY - shiftY)

    		p.stroke(253,218,22)
    		let incrementX = Math.cos(angle) * 5
    		let incrementY = Math.sin(angle) * 5
    		let i = p.draggingRoadNode.x
    		let j = p.draggingRoadNode.y
    		while (Math.pow((i - p.mouseX), 2) + Math.pow((j - p.mouseY), 2) > 50) {
    			p.line(i, j, i + incrementX, j + incrementY)
    			i += incrementX * 2
    			j += incrementY * 2
    		}

    	}

    	p.housePalette.draw()
    	p.intersectionPalette.draw()
    	p.roadPalette.draw()
    	p.trashPalette.draw()

    	if (p.selectedNode) p.selectedNode.draw()

    	for (let edge of p.edgeArray) {
    		edge.draw()
    	}

    	for (let node of p.nodeArray) {
    		node.draw()
    	}

    	if (p.drawCar && p.animateDrive) {

    		p.push()
    			p.translate(p.carX, p.carY)
  				p.rotate(p.carDir)
  				console.log(p.carDir > Math.PI/2 || p.carDir < -1*Math.PI/2)
  				if (p.carDir > Math.PI/2 || p.carDir < -1*Math.PI/2) p.scale([1,-1])
    			p.image(p.CAR_IMG, -22, -22, 44, 44)
    		p.pop()
    	}

    	if (p.holdingHouse) p.image(p.HOUSE_IMG, p.mouseX - 20, p.mouseY - 20, 40, 40)
    	if (p.holdingIntersection) drawIntersectionSprite(p, p.mouseX - 20, p.mouseY - 20, 40, p.color(210,228,213))
    	if (p.holdingRoad) drawRoadSprite(p, p.mouseX - 20, p.mouseY - 20, 40)


    	

  	}

  	p.windowResized = function () {
  		p.createCanvas($("#canvasDiv").width(), 500);
	}

	p.mouseClicked = function () {

		if (!p.runningSim) {

			for (let node of p.nodeArray) {
				node.markated = false
				node.highlighted = false
			}

			for (let edge of p.edgeArray) {
				edge.markated = false
				edge.highlighted = false
			}

	    	if (p.mouseX > 130) {

	    		if (p.holdingRoad) {
		    		for (let node of p.nodeArray) {
		    			if (node.clickable) {
		    				p.draggingRoad = true
		    				p.draggingRoadNode = node
		    				break
		    			}
		    		}
		    	} 

		    	if (p.holdingHouse) p.nodeArray.push(new GraphNode(p, p.mouseX, p.mouseY, 1))
		    	if (p.holdingIntersection) p.nodeArray.push(new GraphNode(p, p.mouseX, p.mouseY, 2))
		    
		    } else {

		    	p.draggingRoad = false
		    	p.draggingRoadNode = null

		    }

			if (!p.draggingRoad) {
				for (let node of p.nodeArray) {
	    			node.checkGrab()
	    		}
	    		for (let edge of p.edgeArray) {
	    			edge.checkGrab()
	    		}

	    	} else {
	    		
	    		for (let node of p.nodeArray) {
	    			
	    			if (node.clickable && node != p.draggingRoadNode) {
	    				p.draggingRoad = false
	    				p.edgeArray.push(new GraphEdge(p, p.draggingRoadNode, node))
		    			p.draggingRoadNode = null
		    			
		    			for (let i = 0; i < p.edgeArray.length - 1; i++) {

		    				if (p.edgeArray[i].node1 == p.edgeArray[p.edgeArray.length - 1].node1 
		    					|| p.edgeArray[i].node1 == p.edgeArray[p.edgeArray.length - 1].node2) {

		    					if (p.edgeArray[i].node2 == p.edgeArray[p.edgeArray.length - 1].node1 
		    						|| p.edgeArray[i].node2 == p.edgeArray[p.edgeArray.length - 1].node2) {

		    						p.edgeArray.pop()

		    					}

		    				}
		    			
		    			}

	    				break
	    			}
	    		}
	    	}

			p.holdingHouse = false
			p.holdingIntersection = false
			p.holdingRoad = false
			p.deleting = false

			
			p.housePalette.checkGrab()
	    	p.intersectionPalette.checkGrab()
	    	p.roadPalette.checkGrab()
	    	p.trashPalette.checkGrab()

	    	resetNums(p)
	    
	    }


	}

}



new p5(simulation, 'canvasDiv')

