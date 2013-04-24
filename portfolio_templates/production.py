#! /usr/bin/python

#from glob import glob
from os import walk

if __name__ == "__main__":
    files = []
    for listing in walk("."):
        for file in listing[2]:
            if (file.find("_test") != -1) and (file.find("~") == -1):
                files.append(listing[0]+"/"+file)

    for file in files:
        f1 = open(file, 'r')
        f2 = open(file.replace("_test", ""), 'w')
        s = f1.read().replace("_test", "")
        f2.write(s)
        f1.close()
        f2.close()
