#!/usr/bin/env ruby

require 'json'
require 'pp'

json_filename = "/Users/keehwanp/projects/TSCreator/timescale-creator-makers/commons/json/default-reference-column-data.json"
f = File.new(json_filename)

dashed_timelines = {
  "Period" => [145.01, 358.94],
  "Epoch" => [145.01, 315.16, 330.92, 358.94, 433.35, 433.46, 521],
  "Age/Stage" => [20.44, 28.09, 37.75, 41.28, 83.64, 86.26, 89.77, 112.95, 145.01, 209.46, 228.35, 250.01, 315.16, 330.92, 358.94, 433.35, 433.46, 514, 521, 529]
}

references_data = JSON.parse(f.read)
references_data = references_data["referenceBlockColumns"]
references_data.delete_if do |ref| ref["name"] == "Sub-Period" end.each do |ref|
  dashed_ref = dashed_timelines[ref["name"]]

  ref.delete("x")
  ref.delete("id")
  ref.delete("width")
  ref.delete("height")
  ref.delete("description")
  ref["timelines"] = ref["blockMarkers"]
  ref.delete("blockMarkers")
  ref["zones"] = ref["blocks"]
  ref.delete("blocks")

  #ref["backgroundColor"] = ref["settings"]["backgroundColor"]
  ref.delete("settings")

  ref["timelines"].each do |t|
    t.delete("edit")
    t.delete("hover")
    t.delete("id")
    t.delete("y")
    
    if t["age"].nil?
      t["age"] = 0
    end

    t["type"] = t["style"]
    t.delete("style")
    if dashed_ref.include?(t["age"])
      t["type"] = "dashed"
    end


    t["name"].upcase! if t["name"] == "top"
    t["name"] = nil if t["name"].strip == "base"
  end

  ref["zones"].each_with_index do |z, idx|
    z.delete("edit")
    z.delete("hover")
    z.delete("id")
    z["backgroundColor"] = z["settings"]["backgroundColor"]
    z.delete("settings")

    z["top"] = ref["timelines"][idx]
    z["base"] = ref["timelines"][idx+1]

    z["description"].gsub!(/""/, "\"") unless z["description"].nil?
    if z["description"] =~ /^"/ and z["description"] =~ /"$/
      z["description"].gsub!(/^"/, "")
      z["description"].gsub!(/"$/, "")
    end

  end
  
end

new_reference_data = references_data.reduce({}) do |memo, ref|
  name = ref["name"]
  ref.delete("name")
  memo[name] = ref
  memo
end

puts JSON.pretty_generate(new_reference_data)
puts JSON.generate(new_reference_data)
