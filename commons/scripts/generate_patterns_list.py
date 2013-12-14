import os
import json


def read_patterns_dir(directory):
	patterns = {}
	files = os.listdir(directory)
	files.sort()
	for file in files:
		if file.endswith(".svg"):
			patterns[get_pattern_name(file)] = file

	sorted_patterns = {}
	pat_names = sorted(patterns.keys());
	for pat in pat_names:
		sorted_patterns[pat] = patterns[pat]
	print json.dumps(sorted_patterns)


def get_pattern_name(file):
	name = file.split(".")[0].split('_')
	to_ret = ""
	for n in name:
		to_ret += n.capitalize() + " "

	return to_ret.strip()



read_patterns_dir("../pattern_manager/patterns")
