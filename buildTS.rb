system("tsc #{Dir.entries("ts/").select{|e| e != "." && e != ".." && e.split(".")[1] == "ts" }.map{|e| "ts/#{e}"}.join(" ")}")
system("mv ts/*.js js")
