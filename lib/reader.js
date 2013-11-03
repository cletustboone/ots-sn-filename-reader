var
Stream         = require("stream")
Transform      = Stream.Transform,
util = require("util"),
path          = require("path"),
fs            = require("fs"),
sportMappings = require("../mappings/sport"),
pbpPattern    = /^[A-Z]{2}\-/;

module.exports = exports = Reader;

// Reader is a Transform stream.
util.inherits( Reader, Transform );

function Reader( options ) {
  this.options = options;
  this.inZero = this.options.in0;
  this.outZero = this.options.out0;
  this.inDelim = this.inZero ? "\0" : "\n";
  this.outDelim = this.outZero ? "\0" : "\n";
  Transform.call( this );
  this.checkInput();
};

// Check to see if arguments are coming from stdin.
// If they are pipe the input to this and pipe that to stdout.
Reader.prototype.checkInput = function() {
  if ( this.options.file ) {
    var
    fileName = this.options.file,
    inDelim = this.inDelim,
    stream = new Stream();

    stream.pipe = function( dest ) {
      dest.write( fileName + inDelim, "utf8" );
    };

    stream.pipe( this );
    this.pipe( process.stdout );
  } else {
    process.stdin.pipe( this ).pipe( process.stdout );
  }

};

Reader.prototype.cleanFileName = function() {
  this.normalized = path.normalize( this.fileName );
  this.resolvedPath = path.resolve( process.cwd(), this.normalized );
  this.basename = path.basename( this.resolvedPath );
};

// Checks the name of the file and determines if it's play by play or not.s
Reader.prototype.checkFileName = function() {

  if ( !this.fileName ) { return; }

  if ( pbpPattern.test(this.basename ) ) {
    this.fileType = "pbp";
    return;
  }

  this.fileType = "other";
  return;
};

// Checks second letter of pbp file match to determine the sport.
Reader.prototype.checkSport = function() {
  var
  secondLetter = this.basename.charAt(1);

  this.sportType = "null";
  if ( this.fileType != "pbp" ) { return; }
  this.sportType = sportMappings[secondLetter];
  return;
};

// Implemented function for readable stream implementors
// http://nodejs.org/api/stream.html#stream_api_for_stream_implementors
Reader.prototype._transform = function( chunk, encoding, done ) {
  var
  input = chunk.toString(),
  pieces;

  input = input.split( this.inDelim );
  for( var i = 0; i<input.length-1; i++ ) {
    pieces = [];
    this.fileName = input[i];
    this.cleanFileName();
    this.checkFileName();
    this.checkSport();
    pieces.push( i );
    pieces.push( input.length );
    pieces.push( this.resolvedPath );
    pieces.push( this.fileType );
    pieces.push( this.sportType );
    this.push( pieces.join("|") );
    if ( !this.outZero ) {this.push( "\n" );}
  }
  done();
};
