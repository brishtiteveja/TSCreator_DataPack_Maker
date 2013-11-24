import re
import json


class Parser(object):

	"""Parser for parsing timescale datapacks. """

	def __init__(self, filepath):
		"""Constructor to initialize parser
		@params:
			filepath: String  representing the relative or absolute path
			of the datapack being parsed.
		"""
		self.dataset = []
		f = open(filepath, 'r')
		self.data = f.readlines()
		f.close()

	def parse_all(self):
		"""Calling the function will begin parsing the datapack"""
		for i in range(len(self.data)):
			line = self.data[i].strip().split('\t')
			# if len(line) > 2 and line[1].lower() == 'block':
			# 	block_column, i = self.parse_block_column(line, i + 1)
			# 	self.dataset.append(block_column)
			# if len(line) > 2 and line[1].lower() == 'range':
			# 	range_column, i = self.parse_range_column(line, i + 1)
			# 	self.dataset.append(range_column)
			if len(line) > 2 and line[1].lower() == 'event':
				event_column, i = self.parse_event_column(line, i + 1)
				self.dataset.append(event_column)

	def parse_event_column(self, col_info, start_index):
		"""Parses the file for event column data
		@params:
			col_info: Array representing the line containing the column info
			in the datapack.
			start_index: Starting index of the lines that
			contain evnet data points.
		@returns:
			block_column: A dict representing the event column.
			i: index of the the last line that has any event
			data related to this column.
		"""
		name = col_info[0].strip()
		col_type = col_info[1].strip() if len(col_info) > 1 and len(col_info[1].strip()) > 1 else None
		width = int(float(col_info[2].strip())) if len(col_info) > 2 and len(col_info[2].strip()) > 1 else None
		background = self.rgb_to_hex(col_info[3]) if len(col_info) > 3 and len(col_info[3].strip()) > 1 else None
		description = col_info[4].strip() if len(col_info) > 4 and len(col_info[4].strip()) > 1 else None
		event_column = dict(
			name=name,
			col_type=col_type,
			width=width,
			background=background,
			description=description,
			datapoints=[]
		)

		event_type = None

		for i in range(start_index, len(self.data)):
			line = self.data[i].split('\t')

			if line[0] != '':
				if line[0].strip().lower() == 'fad' or line[0].strip().lower() == 'lad':
					event_type = line[0].strip().lower()
				else:
					break

			if len(line) < 2 or line[1] == '':
				continue

			event_column['datapoints'].append(
				self.parse_event_data(line, event_type)
			)
		return event_column, i

	def parse_event_data(self, data_info, event_type):
		event_data = dict(
			name=data_info[1].strip() if len(data_info[1].strip()) > 1 else None,
			age=float(data_info[2].strip()) if len(data_info[2].strip()) > 1 else None,
			event_type=event_type,
			description=data_info[4].strip() if len(data_info) > 4 and len(data_info[4]) > 1 else None,
			background=self.rgb_to_hex(data_info[5]) if len(data_info) > 5 and len(data_info[5]) > 1 else None
		)
		return event_data

	def parse_datapack_struct(self):
		"""Looks for the meta columns in tha datapack and parses them
		into an array of dicts."""
		meta_columns = []
		for i in range(len(self.data)):
			line = self.data[i].strip().split('\t')
			if len(line) > 2 and line[1] == ':':
				if line[0].lower() == 'format version' or line[0].lower() == 'date':
					continue
				else:
					meta_col_info = self.parse_column_struct(line)
					meta_columns.append(meta_col_info)

		return meta_columns

	def parse_column_struct(self, col_info):
		name = col_info[0].strip()
		sub_cols = []
		for i in range(1, len(col_info)):
			if col_info[i] == '':
				break
			if col_info[i] == ':' or col_info[i] == '_METACOLUMN_OFF' or col_info[i] == '_TITLE_OFF':
				continue
			sub_cols.append(col_info[i].strip())
		description = col_info[i+1].strip() if len(col_info) > i + 1 else None
		return dict(name=name, sub_columns=sub_cols, description=description)

	def get_data(self):
		return self.dataset

	def print_to_file(self, path):
		f = open(path, 'w')
		f.write(json.dumps(self.dataset, indent=2, separators=(',', ':')))
		f.close()

	def parse_block_column(self, col_info, start_index):
		"""Parses the file for block column data
		@params:
			col_info: Array representing the line containg the column info
			in the datapack.
			start_index: Starting index of the lines that
			contain block data points.
		@returns:
			block_column: A dict representing the block column.
			i: index of the the last line that has any block
			data related to this column.
		"""
		block_column = dict(
			name=col_info[0].strip(),
			col_type=col_info[1].strip(),
			width=col_info[2].strip(),
			background=self.rgb_to_hex(col_info[3]),
			description=col_info[4].strip() if len(col_info) > 4 else None,
			datapoints=[]
		)

		for i in range(start_index, len(self.data)):
			line = self.data[i].split('\t')
			if line[0] != '':
				break
			if line[1] == '':
				continue
			block_column['datapoints'].append(
				self.parse_block_data(line)
			)
		return block_column, i

	def parse_block_data(self, data_info):
		"""Returns the dict representing block data point."""
		data_point = dict(
			name=data_info[1].strip(),
			age=float(data_info[2].strip()),
			style=data_info[3] if len(data_info) > 3 else None,
			description=data_info[4].strip() if len(
				data_info) > 4 else None,
			background=self.rgb_to_hex(
				data_info[5]) if len(data_info) > 5 else None
		)
		return data_point

	def parse_range_column(self, col_info, start_index):
		"""Parses range column
		@params:
			col_info: An array containg range column info.
			start_index: Starting index of the lines containg range data.
		@returns:
			range_column: A dict representing range_column.
			i: last index of the range data.
		"""
		range_column = dict(
			name=col_info[0].strip(),
			col_type=col_info[1].strip(),
			width=col_info[2].strip(),
			background=self.rgb_to_hex(col_info[3]),
			description=col_info[4].strip() if len(
				col_info) > 4 else None,
			datapoints=[])

		datapoints = {}
		for i in range(start_index, len(self.data)):
			line = self.data[i].split('\t')
			if line[0] != '':
				break
			if line[1] == '':
				continue
			datapoint = self.parse_range_data(line)
			if datapoint['name'] not in datapoints:
				datapoints.update({datapoint['name']: datapoint})
			else:
				top_age = datapoints[datapoint['name']]['top_age']
				base_age = datapoint['top_age']
				if top_age > base_age:
					datapoints[datapoint['name']]['top_age'] = base_age
					datapoints[datapoint['name']]['base_age'] = top_age
				else:
					datapoints[datapoint['name']]['base_age'] = base_age

			datapoints[datapoint['name']]['description'] = datapoints[
				datapoint['name']]['description'] or datapoint['description']
			datapoints[datapoint['name']]['range_type'] = datapoints[
				datapoint['name']]['range_type'] or datapoint['range_type']

		for k, v in datapoints.iteritems():
			range_column['datapoints'].append(v)

		return range_column, i

	def parse_range_data(self, data_info):
		"""Returns the dict representing range data point."""
		range_data = dict(
			name=data_info[1].strip(),
			top_age=float(data_info[2].strip()),
			base_age=None,
			range_type=data_info[3].strip()if len(data_info) > 3 else None,
			description=data_info[4].strip() if len(data_info) > 4 else None,
			background=self.rgb_to_hex(
				data_info[5]) if len(data_info) > 5 else None
		)
		return range_data

	def rgb_to_hex(self, color_info):
		"""Converts rgb values to CSS color"""
		color_match = re.match(r"\d\d\d/\d\d\d/\d\d\d", color_info)
		if not color_match:
			return None
		rgb = tuple([int(x.strip()) for x in color_info.split('/')])
		if len(rgb) < 3:
			return None
		return '#%02x%02x%02x' % rgb
