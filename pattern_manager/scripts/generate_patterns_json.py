import os
import json


def read_patterns_dir(directory):
	patterns = {}
	files = os.listdir(directory)
	files.sort()
	for file in files:
		if file.endswith(".svg"):
			patterns[get_pattern_name(file)] = file
	return patterns


def output_patterns_dir(directory):
	patterns = {}
	files = os.listdir(directory)
	files.sort()
	for file in files:
		if file.endswith(".svg") or file.endswith(".png"):
			patterns[get_pattern_name_with_spaces(file)] = file
	return patterns


def get_pattern_name(file):
	key = file.split(".")[0]
	key = key.replace('_', '').replace(' ', '').replace('-', '').lower()
	return key


def get_pattern_name_with_spaces(file):
	key = file.split(".")[0]
	key = key.replace('_', ' ').replace('-', ' ').title()
	return key


def read_patterns_width(path):
	patterns = {}
	pattern_images = read_patterns_dir("../patterns")
	fin = open(path, "r")
	for line in fin:
		line = line.strip().split('\t')
		key = line[0]
		key = key.replace('_', '').replace(' ', '').replace('-', '').lower()
		image = None
		if key in pattern_images:
			image = pattern_images[key]
			patterns[key] = {'name': line[0], 'width': line[1], 'image': image}

	sorted_patterns = {}
	pat_names = sorted(patterns.keys())
	for pat in pat_names:
		sorted_patterns[pat] = patterns[pat]

	return json.dumps(sorted_patterns)


print output_patterns_dir("../patterns")
