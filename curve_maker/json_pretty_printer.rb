#!/usr/bin/env ruby

require 'json'
require 'pp'

f = File.new(ARGV[0])
data = JSON.parse(f.read)
puts JSON.pretty_generate(data)
