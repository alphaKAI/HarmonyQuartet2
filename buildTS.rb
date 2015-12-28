system("tsc #{Dir.entries("ts/").select{|e| e != "." && e != ".." && e.split(".")[1] == "ts" }.map{|e| "ts/#{e}"}.join(" ")} --module commonjs")
system("mkdir js")
system("mv ts/*.js js")
