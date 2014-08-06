#!/usr/bin/env ruby

require 'json'
require 'pp'

f = File.new(ARGV[0])


data = JSON.parse(f.read)

data.delete("transects")
data.delete("points")
data.delete("lines")
data.delete("polygons")
data.delete("texts")
data.delete("referenceColumn")

data["timelines"] = data["markers"]
data.delete("markers")

data["image"]["dataURL"] = data["image"]["data"]
data["image"].delete("data")
data["image"]["isVisible"] = data["image"]["visible"]
data["image"].delete("visible")
data["image"]["isPreserveAspectRatio"] = data["image"]["preserveAspectRatio"]
data["image"].delete("preserveAspectRatio")
data["image"]["curWidth"] = data["image"]["width"]
data["image"].delete("width")
data["image"]["curHeight"] = data["image"]["height"]
data["image"].delete("height")
data["image"]["rotation"] = data["image"]["angle"]
data["image"].delete("angle")

data["backgroundImage"] = data["image"]
data.delete("image")

data["timelines"].each do |t|
  t.delete("edit")
  t.delete("hover")
end
data["zones"].each do |t|
  t.delete("edit")
  t.delete("hover")
  t.delete("toggle")
  t["top"] = t["topMarker"]
  t.delete("topMarker")
  t["base"] = t["baseMarker"]
  t.delete("baseMarker")
end


puts JSON.pretty_generate(data)
#puts JSON.generate(data)
