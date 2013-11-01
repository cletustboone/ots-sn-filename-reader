# OTS Sports Network Filename Reader

This program needs to be able to look at an XML file from The Sports and determine 2 things:

1. Is it a play by play file or some other file.
2. If it's a play by play file, what sport is it for?

This program is a readable stream with the stream output piped to stdout.

By knowing the sport, we can send the play by play files to the appropriate parser immediately. If we need to examine the file contents to determine the sport and type of file, we can use the heading parser. This program should work if the file is referenced by a path or directly by filename.

stdout output is formatted like so:
<<FILENAME>>|<<FILE_TYPE>>|<<SPORT>>
