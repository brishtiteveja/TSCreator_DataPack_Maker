import sys
import re
import json

PIX_PER_MY = 30

class transect_parser(object):
	"""Parser for parsing transect datapack and generating json output"""
	def __init__(self, datapack_path):
		super(transect_parser, self).__init__()
		self.transect_data = []
		f = open(datapack_path, 'r')
		self.data = f.readlines()
		f.close()

	def parse(self):
		transect = None
		points = None
		for i in range(len(self.data)):
			line = self.data[i].strip().split('\t')

			if len(line) > 2 and line[1].lower() == 'transect':
				# if the line has transect in the second position then parse all
				# points in the transect to create a dictionary of all the points.
				transect = self.parse_transect_info(line);
				transect['points'], transect['topMarker'], transect['baseMarker'], i = self.parse_transect_data(i+1)
				self.transect_data.append(transect)
			

			
			if len(line) > 2 and line[0].lower() == 'polygon':
				if not transect:
					raise "Transect not defined"
				# If you find a polygons use the points form the dictionary to 
				# get the list of points and lines
				polygon, i = self.parse_polygon(i, transect)
				transect['polygons'].append(polygon)



	def parse_transect_info(self, transect_info):
		return {
			'name': transect_info[0],
			'width': transect_info[2],
			'background_color': transect_info[3],
			'description': transect_info[4],
			'polygons': [],
			'points': {}
		}

	def parse_transect_data(self, start_index):
		points = {}
		topMarker = None
		baseMarker = None

		percentage_intervals = self.data[start_index].split('\t')

		if percentage_intervals[0] != '':
			raise "Transect has format error in line " + start_index

		for i in range(start_index + 1, len(self.data)):
			row = self.data[i].split('\t')
			if row[0] != '':
				break

			for j in range(2, len(row)):
				if row[j] != '':
					if (not topMarker) or (topMarker < float( row[1].strip())):
						topMarker = {
							'age': float( row[1].strip()), 
							'y': 0
						}

					if (not baseMarker) or (baseMarker > float(row[1].strip())):
						baseMarker = {
							'age': float(row[1].strip()), 
							'y': int((float(row[1].strip()) - topMarker['age'])*PIX_PER_MY)
						}

					points[row[j].strip().lower()] = {
						'age': float(row[1].strip()),
						'relativeX': float(percentage_intervals[j].strip())/100,
						'y': int((float(row[1].strip()) - topMarker['age'])*PIX_PER_MY)
					}


		return points, topMarker, baseMarker, i


	def parse_polygon(self, start_index, transect):
		row = self.data[start_index].strip().split('\t')
		if row[0].lower() != 'polygon':
			raise 'Polygon format error in line ' + start_index

		polygon = {
			'name': row[2],
			'pattern': row[1].split(':')[1].strip(';').strip(),
			'lines': [],
			'points': [],
		}

		pattern = None

		for i in range(start_index + 1, len(self.data)):
			row = self.data[i].split('\t')
			if row[0] != '':
				break

			if row[1] != '':
				polygon['points'].append(transect['points']['x' + row[1].strip()])

			if i > start_index + 1 and row[1] != '':
				line = {
					'point1': polygon['points'][-2],
					'point2': polygon['points'][-1],
					'pattern': pattern,
				}
				polygon['lines'].append(line)

				if pattern:
					pattern = None


			if i > start_index + 1 and row[1] == '':
				pattern = row[2].strip().lower()

		polygon['lines'].append({
			'point1': polygon['points'][-1],
			'point2': polygon['points'][0],
			'pattern': pattern,
		})

		return polygon, i


def main():
	parser = transect_parser(sys.argv[1])
	parser.parse()
	print json.dumps(parser.transect_data)

if __name__ == '__main__':
	main()