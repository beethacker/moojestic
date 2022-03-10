
def export_line(line, n):
    outfile = "puzz_" + str(n).rjust(4, '0') + ".json"
    with open(outfile, "w") as f:
        f.write(line)

out_num = 0
with open("batch.json") as f:
    for line in f.readlines():
        if (line.startswith("START=")):
            out_num = int(line[6:])
        elif (line.startswith("{")):
            export_line(line, out_num)
            out_num += 1

