#!/bin/sh
if ! /usr/bin/node ./CompilerAssembler/compiler/BabuinoLogo.js $1 $1.basm ; then
	exit 1
fi

if ! /usr/bin/node ./CompilerAssembler/assembler/BabuinoAssembler.js $1.basm $1.out ; then
	exit 1
fi

if ! [ -z $2 ] ; then
	/usr/bin/node ./Programmer/BabuinoProgrammer.js $1.out $2
fi
 
