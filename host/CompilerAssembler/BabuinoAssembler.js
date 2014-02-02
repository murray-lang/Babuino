/*
        Default driver template for JS/CC generated parsers for V8
        
        Features:
        - Parser trace messages
        - Step-by-step parsing
        - Integrated panic-mode error recovery
        - Pseudo-graphical parse tree generation
        
        Written 2007 by Jan Max Meyer, J.M.K S.F. Software Technologies
        Modified 2008 from driver.js_ to support V8 by Louis P.Santillan
                        <lpsantil@gmail.com>
        
        This is in the public domain.
*/


//--------------------------------------------------------------------------
// My stuff

function CricketAssembler ()
{
	this.reset();
}

CricketAssembler.prototype.reset = 
	function ()
	{
		this.codes       = new Array();
		this.output      = null;
		this.errorOutput = null;
	}

CricketAssembler.prototype.parse = 
	function (text, output, errorOutput)
	{
		this.reset();
		this.output      = output;
		this.errorOutput = errorOutput;
		
		var error_cnt 	= 0;
		var error_off	= new Array();
		var error_la	= new Array();
		
		//BVM_dbg_withparsetree = true;
		
		if( ( error_cnt = __BVMparse( text, error_off, error_la ) ) > 0 )
		{
			var i;
			for( var i = 0; i < error_cnt; i++ )
				this.errorOutput( "Parse error near >" 
					+ text.substr( error_off[i], 30 ) + "<, expecting \"" + error_la[i].join() + "\"" );
		}
		else
		{
			this.printMachineCodes();
		}
		return error_cnt;
	};

CricketAssembler.prototype.printMachineCodes =
	function ()
	{
		for (var i = 0; i < this.codes.length; i++)
		{
			this.output(this.codes[i]);
		}
	};
	
CricketAssembler.prototype.append =
	function (str)
	{
		this.codes.push(str);
	};

var as = new CricketAssembler();


var BVM_dbg_withparsetree        = false;
var BVM_dbg_withtrace            = false;
var BVM_dbg_withstepbystep       = false;

function __BVMdbg_print( text )
{
        print( text );
}

function __BVMdbg_wait()
{
   var v = read_line();
}

function __BVMlex( info )
{
        var state               = 0;
        var match               = -1;
        var match_pos   = 0;
        var start               = 0;
        var pos                 = info.offset + 1;

        do
        {
                pos--;
                state = 0;
                match = -2;
                start = pos;

                if( info.src.length <= start )
                        return 98;

                do
                {

switch( state )
{
	case 0:
		if( ( info.src.charCodeAt( pos ) >= 9 && info.src.charCodeAt( pos ) <= 10 ) || info.src.charCodeAt( pos ) == 13 || info.src.charCodeAt( pos ) == 32 ) state = 1;
		else if( info.src.charCodeAt( pos ) == 48 ) state = 2;
		else if( info.src.charCodeAt( pos ) == 59 ) state = 3;
		else if( info.src.charCodeAt( pos ) == 45 ) state = 92;
		else if( ( info.src.charCodeAt( pos ) >= 49 && info.src.charCodeAt( pos ) <= 57 ) ) state = 93;
		else if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 96;
		else if( info.src.charCodeAt( pos ) == 66 || info.src.charCodeAt( pos ) == 98 ) state = 98;
		else if( info.src.charCodeAt( pos ) == 67 || info.src.charCodeAt( pos ) == 99 ) state = 99;
		else if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 100;
		else if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 101;
		else if( info.src.charCodeAt( pos ) == 70 || info.src.charCodeAt( pos ) == 102 ) state = 102;
		else if( info.src.charCodeAt( pos ) == 71 || info.src.charCodeAt( pos ) == 103 ) state = 103;
		else if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 104;
		else if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 105;
		else if( info.src.charCodeAt( pos ) == 77 || info.src.charCodeAt( pos ) == 109 ) state = 106;
		else if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 107;
		else if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 108;
		else if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 109;
		else if( info.src.charCodeAt( pos ) == 83 ) state = 110;
		else if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 111;
		else if( info.src.charCodeAt( pos ) == 87 || info.src.charCodeAt( pos ) == 119 ) state = 112;
		else if( info.src.charCodeAt( pos ) == 88 || info.src.charCodeAt( pos ) == 120 ) state = 233;
		else if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 234;
		else if( info.src.charCodeAt( pos ) == 115 ) state = 291;
		else state = -1;
		break;

	case 1:
		state = -1;
		match = 1;
		match_pos = pos;
		break;

	case 2:
		if( info.src.charCodeAt( pos ) == 58 ) state = 4;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 93;
		else if( info.src.charCodeAt( pos ) == 98 ) state = 113;
		else if( info.src.charCodeAt( pos ) == 120 ) state = 114;
		else state = -1;
		match = 87;
		match_pos = pos;
		break;

	case 3:
		if( info.src.charCodeAt( pos ) == 10 ) state = 1;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 9 ) || ( info.src.charCodeAt( pos ) >= 11 && info.src.charCodeAt( pos ) <= 254 ) ) state = 115;
		else state = -1;
		match = 91;
		match_pos = pos;
		break;

	case 4:
		state = -1;
		match = 90;
		match_pos = pos;
		break;

	case 5:
		state = -1;
		match = 60;
		match_pos = pos;
		break;

	case 6:
		state = -1;
		match = 28;
		match_pos = pos;
		break;

	case 7:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 151;
		else state = -1;
		match = 63;
		match_pos = pos;
		break;

	case 8:
		state = -1;
		match = 29;
		match_pos = pos;
		break;

	case 9:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 153;
		else state = -1;
		match = 10;
		match_pos = pos;
		break;

	case 10:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 154;
		else if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 260;
		else state = -1;
		match = 62;
		match_pos = pos;
		break;

	case 11:
		state = -1;
		match = 30;
		match_pos = pos;
		break;

	case 12:
		if( info.src.charCodeAt( pos ) == 87 || info.src.charCodeAt( pos ) == 119 ) state = 261;
		else state = -1;
		match = 64;
		match_pos = pos;
		break;

	case 13:
		if( info.src.charCodeAt( pos ) == 70 || info.src.charCodeAt( pos ) == 102 ) state = 243;
		else state = -1;
		match = 45;
		match_pos = pos;
		break;

	case 14:
		state = -1;
		match = 32;
		match_pos = pos;
		break;

	case 15:
		state = -1;
		match = 50;
		match_pos = pos;
		break;

	case 16:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 16;
		else state = -1;
		match = 88;
		match_pos = pos;
		break;

	case 17:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 17;
		else state = -1;
		match = 89;
		match_pos = pos;
		break;

	case 18:
		state = -1;
		match = 23;
		match_pos = pos;
		break;

	case 19:
		state = -1;
		match = 31;
		match_pos = pos;
		break;

	case 20:
		state = -1;
		match = 26;
		match_pos = pos;
		break;

	case 21:
		state = -1;
		match = 6;
		match_pos = pos;
		break;

	case 22:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 242;
		else state = -1;
		match = 71;
		match_pos = pos;
		break;

	case 23:
		state = -1;
		match = 27;
		match_pos = pos;
		break;

	case 24:
		state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 25:
		state = -1;
		match = 34;
		match_pos = pos;
		break;

	case 26:
		state = -1;
		match = 47;
		match_pos = pos;
		break;

	case 27:
		state = -1;
		match = 82;
		match_pos = pos;
		break;

	case 28:
		state = -1;
		match = 24;
		match_pos = pos;
		break;

	case 29:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 41;
		else state = -1;
		match = 57;
		match_pos = pos;
		break;

	case 30:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 42;
		else state = -1;
		match = 56;
		match_pos = pos;
		break;

	case 31:
		state = -1;
		match = 33;
		match_pos = pos;
		break;

	case 32:
		state = -1;
		match = 38;
		match_pos = pos;
		break;

	case 33:
		state = -1;
		match = 37;
		match_pos = pos;
		break;

	case 34:
		state = -1;
		match = 12;
		match_pos = pos;
		break;

	case 35:
		state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 36:
		state = -1;
		match = 61;
		match_pos = pos;
		break;

	case 37:
		state = -1;
		match = 70;
		match_pos = pos;
		break;

	case 38:
		state = -1;
		match = 14;
		match_pos = pos;
		break;

	case 39:
		state = -1;
		match = 81;
		match_pos = pos;
		break;

	case 40:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 53;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 41:
		state = -1;
		match = 78;
		match_pos = pos;
		break;

	case 42:
		state = -1;
		match = 77;
		match_pos = pos;
		break;

	case 43:
		if( info.src.charCodeAt( pos ) == 85 || info.src.charCodeAt( pos ) == 117 ) state = 206;
		else state = -1;
		match = 16;
		match_pos = pos;
		break;

	case 44:
		state = -1;
		match = 44;
		match_pos = pos;
		break;

	case 45:
		state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 46:
		state = -1;
		match = 5;
		match_pos = pos;
		break;

	case 47:
		state = -1;
		match = 52;
		match_pos = pos;
		break;

	case 48:
		state = -1;
		match = 83;
		match_pos = pos;
		break;

	case 49:
		state = -1;
		match = 43;
		match_pos = pos;
		break;

	case 50:
		state = -1;
		match = 84;
		match_pos = pos;
		break;

	case 51:
		state = -1;
		match = 53;
		match_pos = pos;
		break;

	case 52:
		state = -1;
		match = 46;
		match_pos = pos;
		break;

	case 53:
		state = -1;
		match = 73;
		match_pos = pos;
		break;

	case 54:
		state = -1;
		match = 42;
		match_pos = pos;
		break;

	case 55:
		state = -1;
		match = 4;
		match_pos = pos;
		break;

	case 56:
		state = -1;
		match = 17;
		match_pos = pos;
		break;

	case 57:
		state = -1;
		match = 59;
		match_pos = pos;
		break;

	case 58:
		state = -1;
		match = 11;
		match_pos = pos;
		break;

	case 59:
		state = -1;
		match = 54;
		match_pos = pos;
		break;

	case 60:
		state = -1;
		match = 58;
		match_pos = pos;
		break;

	case 61:
		state = -1;
		match = 8;
		match_pos = pos;
		break;

	case 62:
		if( info.src.charCodeAt( pos ) == 88 || info.src.charCodeAt( pos ) == 120 ) state = 222;
		else state = -1;
		match = 22;
		match_pos = pos;
		break;

	case 63:
		state = -1;
		match = 40;
		match_pos = pos;
		break;

	case 64:
		state = -1;
		match = 39;
		match_pos = pos;
		break;

	case 65:
		state = -1;
		match = 9;
		match_pos = pos;
		break;

	case 66:
		state = -1;
		match = 18;
		match_pos = pos;
		break;

	case 67:
		state = -1;
		match = 7;
		match_pos = pos;
		break;

	case 68:
		state = -1;
		match = 79;
		match_pos = pos;
		break;

	case 69:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 75;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 70:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 76;
		else state = -1;
		match = 55;
		match_pos = pos;
		break;

	case 71:
		state = -1;
		match = 80;
		match_pos = pos;
		break;

	case 72:
		state = -1;
		match = 15;
		match_pos = pos;
		break;

	case 73:
		state = -1;
		match = 68;
		match_pos = pos;
		break;

	case 74:
		state = -1;
		match = 41;
		match_pos = pos;
		break;

	case 75:
		state = -1;
		match = 74;
		match_pos = pos;
		break;

	case 76:
		state = -1;
		match = 76;
		match_pos = pos;
		break;

	case 77:
		state = -1;
		match = 67;
		match_pos = pos;
		break;

	case 78:
		state = -1;
		match = 49;
		match_pos = pos;
		break;

	case 79:
		state = -1;
		match = 48;
		match_pos = pos;
		break;

	case 80:
		state = -1;
		match = 85;
		match_pos = pos;
		break;

	case 81:
		state = -1;
		match = 86;
		match_pos = pos;
		break;

	case 82:
		state = -1;
		match = 66;
		match_pos = pos;
		break;

	case 83:
		state = -1;
		match = 69;
		match_pos = pos;
		break;

	case 84:
		state = -1;
		match = 72;
		match_pos = pos;
		break;

	case 85:
		state = -1;
		match = 65;
		match_pos = pos;
		break;

	case 86:
		state = -1;
		match = 51;
		match_pos = pos;
		break;

	case 87:
		state = -1;
		match = 36;
		match_pos = pos;
		break;

	case 88:
		state = -1;
		match = 35;
		match_pos = pos;
		break;

	case 89:
		state = -1;
		match = 13;
		match_pos = pos;
		break;

	case 90:
		state = -1;
		match = 21;
		match_pos = pos;
		break;

	case 91:
		state = -1;
		match = 75;
		match_pos = pos;
		break;

	case 92:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 97;
		else state = -1;
		break;

	case 93:
		if( info.src.charCodeAt( pos ) == 58 ) state = 4;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 93;
		else state = -1;
		match = 87;
		match_pos = pos;
		break;

	case 94:
		if( ( info.src.charCodeAt( pos ) >= 49 && info.src.charCodeAt( pos ) <= 56 ) ) state = 80;
		else state = -1;
		match = 79;
		match_pos = pos;
		break;

	case 95:
		if( ( info.src.charCodeAt( pos ) >= 49 && info.src.charCodeAt( pos ) <= 56 ) ) state = 81;
		else state = -1;
		match = 80;
		match_pos = pos;
		break;

	case 96:
		if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 116;
		else if( info.src.charCodeAt( pos ) == 71 || info.src.charCodeAt( pos ) == 103 ) state = 117;
		else if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 118;
		else if( info.src.charCodeAt( pos ) == 83 || info.src.charCodeAt( pos ) == 115 ) state = 235;
		else state = -1;
		break;

	case 97:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 97;
		else state = -1;
		match = 87;
		match_pos = pos;
		break;

	case 98:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 119;
		else if( info.src.charCodeAt( pos ) == 89 || info.src.charCodeAt( pos ) == 121 ) state = 120;
		else if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 232;
		else if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 258;
		else state = -1;
		break;

	case 99:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 121;
		else state = -1;
		break;

	case 100:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 5;
		else if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 122;
		else state = -1;
		break;

	case 101:
		if( info.src.charCodeAt( pos ) == 81 || info.src.charCodeAt( pos ) == 113 ) state = 6;
		else if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 123;
		else if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 124;
		else if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 236;
		else state = -1;
		break;

	case 102:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 125;
		else state = -1;
		break;

	case 103:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 7;
		else if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 8;
		else if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 259;
		else state = -1;
		break;

	case 104:
		if( info.src.charCodeAt( pos ) == 70 || info.src.charCodeAt( pos ) == 102 ) state = 9;
		else state = -1;
		break;

	case 105:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 10;
		else if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 11;
		else if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 126;
		else state = -1;
		break;

	case 106:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 127;
		else if( info.src.charCodeAt( pos ) == 85 || info.src.charCodeAt( pos ) == 117 ) state = 128;
		else state = -1;
		break;

	case 107:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 12;
		else if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 129;
		else state = -1;
		break;

	case 108:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 13;
		else if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 14;
		else if( info.src.charCodeAt( pos ) == 70 || info.src.charCodeAt( pos ) == 102 ) state = 130;
		else if( info.src.charCodeAt( pos ) == 85 || info.src.charCodeAt( pos ) == 117 ) state = 274;
		else state = -1;
		break;

	case 109:
		if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 15;
		else if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 133;
		else if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 134;
		else state = -1;
		break;

	case 110:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 135;
		else if( info.src.charCodeAt( pos ) == 85 || info.src.charCodeAt( pos ) == 117 ) state = 136;
		else if( info.src.charCodeAt( pos ) == 86 || info.src.charCodeAt( pos ) == 118 ) state = 137;
		else if( info.src.charCodeAt( pos ) == 87 || info.src.charCodeAt( pos ) == 119 ) state = 138;
		else if( info.src.charCodeAt( pos ) == 72 || info.src.charCodeAt( pos ) == 104 ) state = 237;
		else state = -1;
		break;

	case 111:
		if( info.src.charCodeAt( pos ) == 72 || info.src.charCodeAt( pos ) == 104 ) state = 139;
		else if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 140;
		else state = -1;
		break;

	case 112:
		if( info.src.charCodeAt( pos ) == 72 || info.src.charCodeAt( pos ) == 104 ) state = 141;
		else if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 239;
		else state = -1;
		break;

	case 113:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 16;
		else state = -1;
		break;

	case 114:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 17;
		else state = -1;
		break;

	case 115:
		if( info.src.charCodeAt( pos ) == 10 ) state = 1;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 9 ) || ( info.src.charCodeAt( pos ) >= 11 && info.src.charCodeAt( pos ) <= 254 ) ) state = 115;
		else state = -1;
		break;

	case 116:
		if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 18;
		else state = -1;
		break;

	case 117:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 143;
		else state = -1;
		break;

	case 118:
		if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 19;
		else state = -1;
		break;

	case 119:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 145;
		else if( info.src.charCodeAt( pos ) == 71 || info.src.charCodeAt( pos ) == 103 ) state = 262;
		else state = -1;
		break;

	case 120:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 148;
		else state = -1;
		break;

	case 121:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 149;
		else state = -1;
		break;

	case 122:
		if( info.src.charCodeAt( pos ) == 86 || info.src.charCodeAt( pos ) == 118 ) state = 20;
		else state = -1;
		break;

	case 123:
		if( info.src.charCodeAt( pos ) == 66 || info.src.charCodeAt( pos ) == 98 ) state = 21;
		else state = -1;
		break;

	case 124:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 238;
		else state = -1;
		break;

	case 125:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 22;
		else state = -1;
		break;

	case 126:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 155;
		else state = -1;
		break;

	case 127:
		if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 23;
		else if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 156;
		else state = -1;
		break;

	case 128:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 24;
		else state = -1;
		break;

	case 129:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 25;
		else state = -1;
		break;

	case 130:
		if( info.src.charCodeAt( pos ) == 70 || info.src.charCodeAt( pos ) == 102 ) state = 26;
		else state = -1;
		break;

	case 131:
		if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 27;
		else state = -1;
		break;

	case 132:
		if( info.src.charCodeAt( pos ) == 83 || info.src.charCodeAt( pos ) == 115 ) state = 158;
		else state = -1;
		break;

	case 133:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 159;
		else state = -1;
		break;

	case 134:
		if( info.src.charCodeAt( pos ) == 67 || info.src.charCodeAt( pos ) == 99 ) state = 160;
		else if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 161;
		else if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 240;
		else if( info.src.charCodeAt( pos ) == 83 || info.src.charCodeAt( pos ) == 115 ) state = 263;
		else state = -1;
		break;

	case 135:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 162;
		else if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 163;
		else if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 275;
		else state = -1;
		break;

	case 136:
		if( info.src.charCodeAt( pos ) == 66 || info.src.charCodeAt( pos ) == 98 ) state = 28;
		else state = -1;
		break;

	case 137:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 29;
		else if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 30;
		else state = -1;
		break;

	case 138:
		if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 165;
		else state = -1;
		break;

	case 139:
		if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 166;
		else if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 246;
		else state = -1;
		break;

	case 140:
		if( info.src.charCodeAt( pos ) == 77 || info.src.charCodeAt( pos ) == 109 ) state = 276;
		else state = -1;
		break;

	case 141:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 168;
		else if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 241;
		else state = -1;
		break;

	case 142:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 31;
		else state = -1;
		break;

	case 143:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 32;
		else state = -1;
		break;

	case 144:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 33;
		else state = -1;
		break;

	case 145:
		if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 34;
		else state = -1;
		break;

	case 146:
		if( info.src.charCodeAt( pos ) == 67 || info.src.charCodeAt( pos ) == 99 ) state = 170;
		else state = -1;
		break;

	case 147:
		if( info.src.charCodeAt( pos ) == 75 || info.src.charCodeAt( pos ) == 107 ) state = 171;
		else state = -1;
		break;

	case 148:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 35;
		else state = -1;
		break;

	case 149:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 36;
		else state = -1;
		break;

	case 150:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 172;
		else state = -1;
		break;

	case 151:
		if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 174;
		else if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 175;
		else if( info.src.charCodeAt( pos ) == 71 || info.src.charCodeAt( pos ) == 103 ) state = 264;
		else if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 265;
		else state = -1;
		break;

	case 152:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 37;
		else state = -1;
		break;

	case 153:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 247;
		else state = -1;
		break;

	case 154:
		if( info.src.charCodeAt( pos ) == 86 || info.src.charCodeAt( pos ) == 118 ) state = 176;
		else state = -1;
		break;

	case 155:
		if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 38;
		else state = -1;
		break;

	case 156:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 245;
		else state = -1;
		break;

	case 157:
		if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 244;
		else state = -1;
		break;

	case 158:
		if( info.src.charCodeAt( pos ) == 72 || info.src.charCodeAt( pos ) == 104 ) state = 39;
		else state = -1;
		break;

	case 159:
		if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 179;
		else state = -1;
		break;

	case 160:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 180;
		else if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 266;
		else state = -1;
		break;

	case 161:
		if( info.src.charCodeAt( pos ) == 85 || info.src.charCodeAt( pos ) == 117 ) state = 277;
		else state = -1;
		break;

	case 162:
		if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 40;
		else if( info.src.charCodeAt( pos ) == 83 || info.src.charCodeAt( pos ) == 115 ) state = 250;
		else state = -1;
		break;

	case 163:
		if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 181;
		else if( info.src.charCodeAt( pos ) == 83 || info.src.charCodeAt( pos ) == 115 ) state = 182;
		else if( info.src.charCodeAt( pos ) == 71 || info.src.charCodeAt( pos ) == 103 ) state = 251;
		else if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 270;
		else if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 278;
		else if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 285;
		else state = -1;
		break;

	case 164:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 183;
		else state = -1;
		break;

	case 165:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 184;
		else state = -1;
		break;

	case 166:
		if( info.src.charCodeAt( pos ) == 83 || info.src.charCodeAt( pos ) == 115 ) state = 286;
		else state = -1;
		break;

	case 167:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 43;
		else state = -1;
		break;

	case 168:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 44;
		else state = -1;
		break;

	case 169:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 45;
		else state = -1;
		break;

	case 170:
		if( info.src.charCodeAt( pos ) == 75 || info.src.charCodeAt( pos ) == 107 ) state = 46;
		else state = -1;
		break;

	case 171:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 47;
		else state = -1;
		break;

	case 172:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 48;
		else state = -1;
		break;

	case 173:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 49;
		else state = -1;
		break;

	case 174:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 188;
		else state = -1;
		break;

	case 175:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 189;
		else state = -1;
		break;

	case 176:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 50;
		else state = -1;
		break;

	case 177:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 51;
		else if( info.src.charCodeAt( pos ) == 70 || info.src.charCodeAt( pos ) == 102 ) state = 191;
		else state = -1;
		break;

	case 178:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 52;
		else state = -1;
		break;

	case 179:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 194;
		else state = -1;
		break;

	case 180:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 195;
		else state = -1;
		break;

	case 181:
		if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 54;
		else state = -1;
		break;

	case 182:
		if( info.src.charCodeAt( pos ) == 86 || info.src.charCodeAt( pos ) == 118 ) state = 203;
		else state = -1;
		break;

	case 183:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 55;
		else state = -1;
		break;

	case 184:
		if( info.src.charCodeAt( pos ) == 67 || info.src.charCodeAt( pos ) == 99 ) state = 204;
		else state = -1;
		break;

	case 185:
		if( info.src.charCodeAt( pos ) == 87 || info.src.charCodeAt( pos ) == 119 ) state = 205;
		else state = -1;
		break;

	case 186:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 56;
		else state = -1;
		break;

	case 187:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 57;
		else state = -1;
		break;

	case 188:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 279;
		else state = -1;
		break;

	case 189:
		if( info.src.charCodeAt( pos ) == 77 || info.src.charCodeAt( pos ) == 109 ) state = 211;
		else state = -1;
		break;

	case 190:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 58;
		else state = -1;
		break;

	case 191:
		if( info.src.charCodeAt( pos ) == 70 || info.src.charCodeAt( pos ) == 102 ) state = 59;
		else state = -1;
		break;

	case 192:
		if( info.src.charCodeAt( pos ) == 83 || info.src.charCodeAt( pos ) == 115 ) state = 60;
		else state = -1;
		break;

	case 193:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 61;
		else state = -1;
		break;

	case 194:
		if( info.src.charCodeAt( pos ) == 77 || info.src.charCodeAt( pos ) == 109 ) state = 62;
		else state = -1;
		break;

	case 195:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 63;
		else state = -1;
		break;

	case 196:
		if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 64;
		else state = -1;
		break;

	case 197:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 65;
		else state = -1;
		break;

	case 198:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 66;
		else if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 213;
		else state = -1;
		break;

	case 199:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 67;
		else state = -1;
		break;

	case 200:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 68;
		else state = -1;
		break;

	case 201:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 69;
		else state = -1;
		break;

	case 202:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 287;
		else state = -1;
		break;

	case 203:
		if( info.src.charCodeAt( pos ) == 72 || info.src.charCodeAt( pos ) == 104 ) state = 70;
		else state = -1;
		break;

	case 204:
		if( info.src.charCodeAt( pos ) == 72 || info.src.charCodeAt( pos ) == 104 ) state = 71;
		else state = -1;
		break;

	case 205:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 216;
		else state = -1;
		break;

	case 206:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 218;
		else state = -1;
		break;

	case 207:
		if( info.src.charCodeAt( pos ) == 82 ) state = 68;
		else if( info.src.charCodeAt( pos ) == 114 ) state = 94;
		else state = -1;
		break;

	case 208:
		if( info.src.charCodeAt( pos ) == 72 ) state = 71;
		else if( info.src.charCodeAt( pos ) == 104 ) state = 95;
		else state = -1;
		break;

	case 209:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 72;
		else state = -1;
		break;

	case 210:
		if( info.src.charCodeAt( pos ) == 66 || info.src.charCodeAt( pos ) == 98 ) state = 219;
		else state = -1;
		break;

	case 211:
		if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 73;
		else state = -1;
		break;

	case 212:
		if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 257;
		else state = -1;
		break;

	case 213:
		if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 74;
		else state = -1;
		break;

	case 214:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 224;
		else state = -1;
		break;

	case 215:
		if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 77;
		else state = -1;
		break;

	case 216:
		if( info.src.charCodeAt( pos ) == 89 || info.src.charCodeAt( pos ) == 121 ) state = 78;
		else state = -1;
		break;

	case 217:
		if( info.src.charCodeAt( pos ) == 89 || info.src.charCodeAt( pos ) == 121 ) state = 79;
		else state = -1;
		break;

	case 218:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 225;
		else state = -1;
		break;

	case 219:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 226;
		else state = -1;
		break;

	case 220:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 82;
		else state = -1;
		break;

	case 221:
		if( info.src.charCodeAt( pos ) == 77 || info.src.charCodeAt( pos ) == 109 ) state = 83;
		else state = -1;
		break;

	case 222:
		if( info.src.charCodeAt( pos ) == 89 || info.src.charCodeAt( pos ) == 121 ) state = 84;
		else state = -1;
		break;

	case 223:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 85;
		else state = -1;
		break;

	case 224:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 86;
		else state = -1;
		break;

	case 225:
		if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 229;
		else state = -1;
		break;

	case 226:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 87;
		else state = -1;
		break;

	case 227:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 230;
		else state = -1;
		break;

	case 228:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 88;
		else state = -1;
		break;

	case 229:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 89;
		else state = -1;
		break;

	case 230:
		if( info.src.charCodeAt( pos ) == 63 ) state = 90;
		else if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 231;
		else state = -1;
		break;

	case 231:
		if( info.src.charCodeAt( pos ) == 63 ) state = 91;
		else state = -1;
		break;

	case 232:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 147;
		else state = -1;
		break;

	case 233:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 142;
		else state = -1;
		break;

	case 234:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 131;
		else if( info.src.charCodeAt( pos ) == 85 || info.src.charCodeAt( pos ) == 117 ) state = 132;
		else state = -1;
		break;

	case 235:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 144;
		else state = -1;
		break;

	case 236:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 150;
		else state = -1;
		break;

	case 237:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 164;
		else state = -1;
		break;

	case 238:
		if( info.src.charCodeAt( pos ) == 83 || info.src.charCodeAt( pos ) == 115 ) state = 173;
		else state = -1;
		break;

	case 239:
		if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 167;
		else state = -1;
		break;

	case 240:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 248;
		else state = -1;
		break;

	case 241:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 187;
		else state = -1;
		break;

	case 242:
		if( info.src.charCodeAt( pos ) == 86 || info.src.charCodeAt( pos ) == 118 ) state = 269;
		else state = -1;
		break;

	case 243:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 178;
		else state = -1;
		break;

	case 244:
		if( info.src.charCodeAt( pos ) == 85 || info.src.charCodeAt( pos ) == 117 ) state = 193;
		else state = -1;
		break;

	case 245:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 192;
		else state = -1;
		break;

	case 246:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 185;
		else state = -1;
		break;

	case 247:
		if( info.src.charCodeAt( pos ) == 83 || info.src.charCodeAt( pos ) == 115 ) state = 190;
		else state = -1;
		break;

	case 248:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 197;
		else state = -1;
		break;

	case 249:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 254;
		else state = -1;
		break;

	case 250:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 200;
		else state = -1;
		break;

	case 251:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 202;
		else state = -1;
		break;

	case 252:
		if( info.src.charCodeAt( pos ) == 67 ) state = 204;
		else if( info.src.charCodeAt( pos ) == 99 ) state = 208;
		else state = -1;
		break;

	case 253:
		if( info.src.charCodeAt( pos ) == 87 || info.src.charCodeAt( pos ) == 119 ) state = 214;
		else state = -1;
		break;

	case 254:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 212;
		else state = -1;
		break;

	case 255:
		if( info.src.charCodeAt( pos ) == 77 || info.src.charCodeAt( pos ) == 109 ) state = 215;
		else state = -1;
		break;

	case 256:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 217;
		else state = -1;
		break;

	case 257:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 227;
		else state = -1;
		break;

	case 258:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 146;
		else state = -1;
		break;

	case 259:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 152;
		else state = -1;
		break;

	case 260:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 177;
		else state = -1;
		break;

	case 261:
		if( info.src.charCodeAt( pos ) == 83 || info.src.charCodeAt( pos ) == 115 ) state = 249;
		else state = -1;
		break;

	case 262:
		if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 169;
		else state = -1;
		break;

	case 263:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 267;
		else state = -1;
		break;

	case 264:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 282;
		else state = -1;
		break;

	case 265:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 271;
		else state = -1;
		break;

	case 266:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 196;
		else state = -1;
		break;

	case 267:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 198;
		else state = -1;
		break;

	case 268:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 201;
		else state = -1;
		break;

	case 269:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 209;
		else state = -1;
		break;

	case 270:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 288;
		else state = -1;
		break;

	case 271:
		if( info.src.charCodeAt( pos ) == 67 || info.src.charCodeAt( pos ) == 99 ) state = 272;
		else state = -1;
		break;

	case 272:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 220;
		else state = -1;
		break;

	case 273:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 228;
		else state = -1;
		break;

	case 274:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 157;
		else state = -1;
		break;

	case 275:
		if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 268;
		else state = -1;
		break;

	case 276:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 186;
		else state = -1;
		break;

	case 277:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 199;
		else state = -1;
		break;

	case 278:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 253;
		else state = -1;
		break;

	case 279:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 221;
		else state = -1;
		break;

	case 280:
		if( info.src.charCodeAt( pos ) == 79 ) state = 200;
		else if( info.src.charCodeAt( pos ) == 111 ) state = 207;
		else state = -1;
		break;

	case 281:
		if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 223;
		else state = -1;
		break;

	case 282:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 210;
		else state = -1;
		break;

	case 283:
		if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 40;
		else if( info.src.charCodeAt( pos ) == 83 ) state = 250;
		else if( info.src.charCodeAt( pos ) == 115 ) state = 280;
		else state = -1;
		break;

	case 284:
		if( info.src.charCodeAt( pos ) == 84 ) state = 184;
		else if( info.src.charCodeAt( pos ) == 116 ) state = 252;
		else state = -1;
		break;

	case 285:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 255;
		else state = -1;
		break;

	case 286:
		if( info.src.charCodeAt( pos ) == 87 || info.src.charCodeAt( pos ) == 119 ) state = 256;
		else state = -1;
		break;

	case 287:
		if( info.src.charCodeAt( pos ) == 66 || info.src.charCodeAt( pos ) == 98 ) state = 273;
		else state = -1;
		break;

	case 288:
		if( info.src.charCodeAt( pos ) == 67 || info.src.charCodeAt( pos ) == 99 ) state = 281;
		else state = -1;
		break;

	case 289:
		if( info.src.charCodeAt( pos ) == 78 ) state = 162;
		else if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 163;
		else if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 275;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 283;
		else state = -1;
		break;

	case 290:
		if( info.src.charCodeAt( pos ) == 73 ) state = 165;
		else if( info.src.charCodeAt( pos ) == 105 ) state = 284;
		else state = -1;
		break;

	case 291:
		if( info.src.charCodeAt( pos ) == 69 ) state = 135;
		else if( info.src.charCodeAt( pos ) == 85 || info.src.charCodeAt( pos ) == 117 ) state = 136;
		else if( info.src.charCodeAt( pos ) == 86 || info.src.charCodeAt( pos ) == 118 ) state = 137;
		else if( info.src.charCodeAt( pos ) == 87 ) state = 138;
		else if( info.src.charCodeAt( pos ) == 72 || info.src.charCodeAt( pos ) == 104 ) state = 237;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 289;
		else if( info.src.charCodeAt( pos ) == 119 ) state = 290;
		else state = -1;
		break;

}


                        pos++;

                }
                while( state > -1 );

        }
        while( 1 > -1 && match == 1 );

        if( match > -1 )
        {
                info.att = info.src.substr( start, match_pos - start );
                info.offset = match_pos;
                
switch( match )
{
	case 2:
		{
		 info.att = 0; 
		}
		break;

	case 3:
		{
		 info.att = 1; 
		}
		break;

	case 4:
		{
		 info.att = 2; 
		}
		break;

	case 5:
		{
		 info.att = 3; 
		}
		break;

	case 6:
		{
		 info.att = 4; 
		}
		break;

	case 7:
		{
		 info.att = 7; 
		}
		break;

	case 8:
		{
		 info.att = 8; 
		}
		break;

	case 9:
		{
		 info.att = 9; 
		}
		break;

	case 10:
		{
		 info.att = 10; 
		}
		break;

	case 11:
		{
		 info.att = 11; 
		}
		break;

	case 12:
		{
		 info.att = 12; 
		}
		break;

	case 13:
		{
		 info.att = 14; 
		}
		break;

	case 14:
		{
		 info.att = 15; 
		}
		break;

	case 15:
		{
		 info.att = 15; 
		}
		break;

	case 16:
		{
		 info.att = 16; 
		}
		break;

	case 17:
		{
		 info.att = 17; 
		}
		break;

	case 18:
		{
		 info.att = 18; 
		}
		break;

	case 19:
		{
		 info.att = 19; 
		}
		break;

	case 20:
		{
		 info.att = 20; 
		}
		break;

	case 21:
		{
		 info.att = 21; 
		}
		break;

	case 22:
		{
		 info.att = 22; 
		}
		break;

	case 23:
		{
		 info.att = 23; 
		}
		break;

	case 24:
		{
		 info.att = 24; 
		}
		break;

	case 25:
		{
		 info.att = 25; 
		}
		break;

	case 26:
		{
		 info.att = 26; 
		}
		break;

	case 27:
		{
		 info.att = 27; 
		}
		break;

	case 28:
		{
		 info.att = 28; 
		}
		break;

	case 29:
		{
		 info.att = 29; 
		}
		break;

	case 30:
		{
		 info.att = 30; 
		}
		break;

	case 31:
		{
		 info.att = 31; 
		}
		break;

	case 32:
		{
		 info.att = 32; 
		}
		break;

	case 33:
		{
		 info.att = 33; 
		}
		break;

	case 34:
		{
		 info.att = 34; 
		}
		break;

	case 35:
		{
		 info.att = 35; 
		}
		break;

	case 36:
		{
		 info.att = 36; 
		}
		break;

	case 37:
		{
		 info.att = 37; 
		}
		break;

	case 38:
		{
		 info.att = 38; 
		}
		break;

	case 39:
		{
		 info.att = 39; 
		}
		break;

	case 40:
		{
		 info.att = 40; 
		}
		break;

	case 41:
		{
		 info.att = 41; 
		}
		break;

	case 42:
		{
		 info.att = 42; 
		}
		break;

	case 43:
		{
		 info.att = 45; 
		}
		break;

	case 44:
		{
		 info.att = 44; 
		}
		break;

	case 45:
		{
		 info.att = 49; 
		}
		break;

	case 46:
		{
		 info.att = 50; 
		}
		break;

	case 47:
		{
		 info.att = 51; 
		}
		break;

	case 48:
		{
		 info.att = 52; 
		}
		break;

	case 49:
		{
		 info.att = 53; 
		}
		break;

	case 50:
		{
		 info.att = 54; 
		}
		break;

	case 51:
		{
		 info.att = 59; 
		}
		break;

	case 52:
		{
		 info.att = 60; 
		}
		break;

	case 53:
		{
		 info.att = 85; 
		}
		break;

	case 54:
		{
		 info.att = 86; 
		}
		break;

	case 55:
		{
		 info.att = 87; 
		}
		break;

	case 56:
		{
		 info.att = 88; 
		}
		break;

	case 57:
		{
		 info.att = 89; 
		}
		break;

	case 58:
		{
		 info.att = 90; 
		}
		break;

	case 59:
		{
		 info.att = 128; 
		}
		break;

	case 60:
		{
		 info.att = 129; 
		}
		break;

	case 61:
		{
		 info.att = 130; 
		}
		break;

	case 62:
		{
		 info.att = 131; 
		}
		break;

	case 63:
		{
		 info.att = 132; 
		}
		break;

	case 64:
		{
		 info.att = 133; 
		}
		break;

	case 65:
		{
		 info.att = 134; 
		}
		break;

	case 66:
		{
		 info.att = 135; 
		}
		break;

	case 67:
		{
		 info.att = 136; 
		}
		break;

	case 68:
		{
		 info.att = 137; 
		}
		break;

	case 69:
		{
		 info.att = 138; 
		}
		break;

	case 70:
		{
		 info.att = 139; 
		}
		break;

	case 71:
		{
		 info.att = 140; 
		}
		break;

	case 72:
		{
		 info.att = 141; 
		}
		break;

	case 73:
		{
		 info.att = 142; 
		}
		break;

	case 74:
		{
		 info.att = 143; 
		}
		break;

	case 75:
		{
		 info.att = 144; 
		}
		break;

	case 76:
		{
		 info.att = 145; 
		}
		break;

	case 77:
		{
		 info.att = 146; 
		}
		break;

	case 78:
		{
		 info.att = 147; 
		}
		break;

	case 79:
		{
		 info.att = 148; /* sensor number is provided by the previous short */
		}
		break;

	case 80:
		{
		 info.att = 149; /* switch number is provided by the previous short */
		}
		break;

	case 81:
		{
		 info.att = 150; 
		}
		break;

	case 82:
		{
		 info.att = 151; 
		}
		break;

	case 83:
		{
		 info.att = 152; 
		}
		break;

	case 84:
		{
		 info.att = 153; 
		}
		break;

	case 85:
		{
			var id = info.att.substr( 6 ); 
										// Legacy sensor[1-8] commands
									var num = parseInt(id);
									if (num == 1)
										info.att = 55;
									else if (num == 2)
										info.att = 56;
									else
										info.att = 70 + num; // ie 73 to 78
								
		}
		break;

	case 86:
		{
		 var id = info.att.substr( 6 ); 
										// Legacy switch[1-8] commands
									var num = parseInt(id);
									if (num == 1)
										info.att = 57;
									else if (num == 2)
										info.att = 58;
									else
										info.att = 76 + num; // ie 79 to 84
								
		}
		break;

	case 87:
		{
		 info.att = parseInt(info.att); 
		}
		break;

	case 88:
		{
		 info.att = parseInt(info.att.substr(2), 2); 
		}
		break;

	case 89:
		{
		 info.att = parseInt(info.att.substr(2), 16); 
		}
		break;

}


        }
        else
        {
                info.att = new String();
                match = -1;
        }

        return match;
}


function infoClass()
{
	var offset; var src; var att;
}

function nodeClass()
{
	var sym; var att; var child;
}

function __BVMparse( src, err_off, err_la )
{
        var             sstack                  = new Array();
        var             vstack                  = new Array();
        var     err_cnt                 = 0;
        var             act;
        var             go;
        var             la;
        var             rval;
        //var 	parseinfo		= new Function( "", "var offset; var src; var att;" );
		var		info			= new infoClass(); //new parseinfo();
        
        //Visual parse tree generation
        //var     treenode                = new Function( "", "var sym; var att; var child;" );
		var     treenode                = new nodeClass();
        var             treenodes               = new Array();
        var             tree                    = new Array();
        var             tmptree                 = null;

/* Pop-Table */
var pop_tab = new Array(
	new Array( 0/* Program' */, 1 ),
	new Array( 92/* Program */, 2 ),
	new Array( 92/* Program */, 0 ),
	new Array( 93/* Stmt */, 2 ),
	new Array( 93/* Stmt */, 1 ),
	new Array( 94/* Cmd */, 1 ),
	new Array( 94/* Cmd */, 1 ),
	new Array( 96/* BinaryCmd */, 2 ),
	new Array( 96/* BinaryCmd */, 2 ),
	new Array( 96/* BinaryCmd */, 2 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 95/* UnaryCmd */, 1 ),
	new Array( 97/* Value */, 1 ),
	new Array( 97/* Value */, 1 ),
	new Array( 97/* Value */, 1 )
);

/* Action-Table */
var act_tab = new Array(
	/* State 0 */ new Array( 98/* "$" */,-2 , 90/* "Address" */,-2 , 2/* "begin" */,-2 , 6/* "eob" */,-2 , 7/* "return" */,-2 , 8/* "output" */,-2 , 9/* "repeat" */,-2 , 10/* "if" */,-2 , 11/* "ifelse" */,-2 , 70/* "goto" */,-2 , 12/* "beep" */,-2 , 13/* "waituntil" */,-2 , 14/* "loop" */,-2 , 71/* "for" */,-2 , 15/* "forever" */,-2 , 16/* "wait" */,-2 , 17/* "timer" */,-2 , 18/* "resett" */,-2 , 19/* "send" */,-2 , 73/* "sendn" */,-2 , 20/* "serial" */,-2 , 74/* "serialn" */,-2 , 21/* "NewSerial" */,-2 , 75/* "NewSerialn" */,-2 , 22/* "random" */,-2 , 72/* "randomxy" */,-2 , 23/* "add" */,-2 , 24/* "sub" */,-2 , 25/* "mul" */,-2 , 26/* "div" */,-2 , 27/* "mod" */,-2 , 28/* "eq" */,-2 , 29/* "gt" */,-2 , 30/* "lt" */,-2 , 62/* "le" */,-2 , 63/* "ge" */,-2 , 64/* "ne" */,-2 , 31/* "and" */,-2 , 32/* "or" */,-2 , 33/* "xor" */,-2 , 34/* "not" */,-2 , 35/* "setglobal" */,-2 , 36/* "getglobal" */,-2 , 37/* "aset" */,-2 , 38/* "aget" */,-2 , 39/* "record" */,-2 , 40/* "recall" */,-2 , 41/* "resetdp" */,-2 , 42/* "setdp" */,-2 , 43/* "erase" */,-2 , 44/* "when" */,-2 , 45/* "on" */,-2 , 46/* "onfor" */,-2 , 47/* "off" */,-2 , 48/* "thisway" */,-2 , 49/* "thatway" */,-2 , 50/* "rd" */,-2 , 51/* "setpower" */,-2 , 52/* "brake" */,-2 , 53/* "ledon" */,-2 , 54/* "ledoff" */,-2 , 55/* "setsvh" */,-2 , 56/* "svr" */,-2 , 57/* "svl" */,-2 , 58/* "motors" */,-2 , 59/* "while" */,-2 , 60/* "do" */,-2 , 61/* "call" */,-2 , 65/* "setlocal" */,-2 , 66/* "getlocal" */,-2 , 67/* "settemp" */,-2 , 68/* "gettemp" */,-2 , 69/* "getparam" */,-2 , 79/* "sensor" */,-2 , 85/* "Sensorn" */,-2 , 80/* "switch" */,-2 , 86/* "Switchn" */,-2 , 81/* "push" */,-2 , 82/* "pop" */,-2 , 83/* "enter" */,-2 , 84/* "leave" */,-2 , 3/* "byte" */,-2 , 4/* "short" */,-2 , 5/* "block" */,-2 ),
	/* State 1 */ new Array( 90/* "Address" */,3 , 2/* "begin" */,7 , 6/* "eob" */,8 , 7/* "return" */,9 , 8/* "output" */,10 , 9/* "repeat" */,11 , 10/* "if" */,12 , 11/* "ifelse" */,13 , 70/* "goto" */,14 , 12/* "beep" */,15 , 13/* "waituntil" */,16 , 14/* "loop" */,17 , 71/* "for" */,18 , 15/* "forever" */,19 , 16/* "wait" */,20 , 17/* "timer" */,21 , 18/* "resett" */,22 , 19/* "send" */,23 , 73/* "sendn" */,24 , 20/* "serial" */,25 , 74/* "serialn" */,26 , 21/* "NewSerial" */,27 , 75/* "NewSerialn" */,28 , 22/* "random" */,29 , 72/* "randomxy" */,30 , 23/* "add" */,31 , 24/* "sub" */,32 , 25/* "mul" */,33 , 26/* "div" */,34 , 27/* "mod" */,35 , 28/* "eq" */,36 , 29/* "gt" */,37 , 30/* "lt" */,38 , 62/* "le" */,39 , 63/* "ge" */,40 , 64/* "ne" */,41 , 31/* "and" */,42 , 32/* "or" */,43 , 33/* "xor" */,44 , 34/* "not" */,45 , 35/* "setglobal" */,46 , 36/* "getglobal" */,47 , 37/* "aset" */,48 , 38/* "aget" */,49 , 39/* "record" */,50 , 40/* "recall" */,51 , 41/* "resetdp" */,52 , 42/* "setdp" */,53 , 43/* "erase" */,54 , 44/* "when" */,55 , 45/* "on" */,56 , 46/* "onfor" */,57 , 47/* "off" */,58 , 48/* "thisway" */,59 , 49/* "thatway" */,60 , 50/* "rd" */,61 , 51/* "setpower" */,62 , 52/* "brake" */,63 , 53/* "ledon" */,64 , 54/* "ledoff" */,65 , 55/* "setsvh" */,66 , 56/* "svr" */,67 , 57/* "svl" */,68 , 58/* "motors" */,69 , 59/* "while" */,70 , 60/* "do" */,71 , 61/* "call" */,72 , 65/* "setlocal" */,73 , 66/* "getlocal" */,74 , 67/* "settemp" */,75 , 68/* "gettemp" */,76 , 69/* "getparam" */,77 , 79/* "sensor" */,78 , 85/* "Sensorn" */,79 , 80/* "switch" */,80 , 86/* "Switchn" */,81 , 81/* "push" */,82 , 82/* "pop" */,83 , 83/* "enter" */,84 , 84/* "leave" */,85 , 3/* "byte" */,86 , 4/* "short" */,87 , 5/* "block" */,88 , 98/* "$" */,0 ),
	/* State 2 */ new Array( 98/* "$" */,-1 , 90/* "Address" */,-1 , 2/* "begin" */,-1 , 6/* "eob" */,-1 , 7/* "return" */,-1 , 8/* "output" */,-1 , 9/* "repeat" */,-1 , 10/* "if" */,-1 , 11/* "ifelse" */,-1 , 70/* "goto" */,-1 , 12/* "beep" */,-1 , 13/* "waituntil" */,-1 , 14/* "loop" */,-1 , 71/* "for" */,-1 , 15/* "forever" */,-1 , 16/* "wait" */,-1 , 17/* "timer" */,-1 , 18/* "resett" */,-1 , 19/* "send" */,-1 , 73/* "sendn" */,-1 , 20/* "serial" */,-1 , 74/* "serialn" */,-1 , 21/* "NewSerial" */,-1 , 75/* "NewSerialn" */,-1 , 22/* "random" */,-1 , 72/* "randomxy" */,-1 , 23/* "add" */,-1 , 24/* "sub" */,-1 , 25/* "mul" */,-1 , 26/* "div" */,-1 , 27/* "mod" */,-1 , 28/* "eq" */,-1 , 29/* "gt" */,-1 , 30/* "lt" */,-1 , 62/* "le" */,-1 , 63/* "ge" */,-1 , 64/* "ne" */,-1 , 31/* "and" */,-1 , 32/* "or" */,-1 , 33/* "xor" */,-1 , 34/* "not" */,-1 , 35/* "setglobal" */,-1 , 36/* "getglobal" */,-1 , 37/* "aset" */,-1 , 38/* "aget" */,-1 , 39/* "record" */,-1 , 40/* "recall" */,-1 , 41/* "resetdp" */,-1 , 42/* "setdp" */,-1 , 43/* "erase" */,-1 , 44/* "when" */,-1 , 45/* "on" */,-1 , 46/* "onfor" */,-1 , 47/* "off" */,-1 , 48/* "thisway" */,-1 , 49/* "thatway" */,-1 , 50/* "rd" */,-1 , 51/* "setpower" */,-1 , 52/* "brake" */,-1 , 53/* "ledon" */,-1 , 54/* "ledoff" */,-1 , 55/* "setsvh" */,-1 , 56/* "svr" */,-1 , 57/* "svl" */,-1 , 58/* "motors" */,-1 , 59/* "while" */,-1 , 60/* "do" */,-1 , 61/* "call" */,-1 , 65/* "setlocal" */,-1 , 66/* "getlocal" */,-1 , 67/* "settemp" */,-1 , 68/* "gettemp" */,-1 , 69/* "getparam" */,-1 , 79/* "sensor" */,-1 , 85/* "Sensorn" */,-1 , 80/* "switch" */,-1 , 86/* "Switchn" */,-1 , 81/* "push" */,-1 , 82/* "pop" */,-1 , 83/* "enter" */,-1 , 84/* "leave" */,-1 , 3/* "byte" */,-1 , 4/* "short" */,-1 , 5/* "block" */,-1 ),
	/* State 3 */ new Array( 2/* "begin" */,7 , 6/* "eob" */,8 , 7/* "return" */,9 , 8/* "output" */,10 , 9/* "repeat" */,11 , 10/* "if" */,12 , 11/* "ifelse" */,13 , 70/* "goto" */,14 , 12/* "beep" */,15 , 13/* "waituntil" */,16 , 14/* "loop" */,17 , 71/* "for" */,18 , 15/* "forever" */,19 , 16/* "wait" */,20 , 17/* "timer" */,21 , 18/* "resett" */,22 , 19/* "send" */,23 , 73/* "sendn" */,24 , 20/* "serial" */,25 , 74/* "serialn" */,26 , 21/* "NewSerial" */,27 , 75/* "NewSerialn" */,28 , 22/* "random" */,29 , 72/* "randomxy" */,30 , 23/* "add" */,31 , 24/* "sub" */,32 , 25/* "mul" */,33 , 26/* "div" */,34 , 27/* "mod" */,35 , 28/* "eq" */,36 , 29/* "gt" */,37 , 30/* "lt" */,38 , 62/* "le" */,39 , 63/* "ge" */,40 , 64/* "ne" */,41 , 31/* "and" */,42 , 32/* "or" */,43 , 33/* "xor" */,44 , 34/* "not" */,45 , 35/* "setglobal" */,46 , 36/* "getglobal" */,47 , 37/* "aset" */,48 , 38/* "aget" */,49 , 39/* "record" */,50 , 40/* "recall" */,51 , 41/* "resetdp" */,52 , 42/* "setdp" */,53 , 43/* "erase" */,54 , 44/* "when" */,55 , 45/* "on" */,56 , 46/* "onfor" */,57 , 47/* "off" */,58 , 48/* "thisway" */,59 , 49/* "thatway" */,60 , 50/* "rd" */,61 , 51/* "setpower" */,62 , 52/* "brake" */,63 , 53/* "ledon" */,64 , 54/* "ledoff" */,65 , 55/* "setsvh" */,66 , 56/* "svr" */,67 , 57/* "svl" */,68 , 58/* "motors" */,69 , 59/* "while" */,70 , 60/* "do" */,71 , 61/* "call" */,72 , 65/* "setlocal" */,73 , 66/* "getlocal" */,74 , 67/* "settemp" */,75 , 68/* "gettemp" */,76 , 69/* "getparam" */,77 , 79/* "sensor" */,78 , 85/* "Sensorn" */,79 , 80/* "switch" */,80 , 86/* "Switchn" */,81 , 81/* "push" */,82 , 82/* "pop" */,83 , 83/* "enter" */,84 , 84/* "leave" */,85 , 3/* "byte" */,86 , 4/* "short" */,87 , 5/* "block" */,88 ),
	/* State 4 */ new Array( 98/* "$" */,-4 , 90/* "Address" */,-4 , 2/* "begin" */,-4 , 6/* "eob" */,-4 , 7/* "return" */,-4 , 8/* "output" */,-4 , 9/* "repeat" */,-4 , 10/* "if" */,-4 , 11/* "ifelse" */,-4 , 70/* "goto" */,-4 , 12/* "beep" */,-4 , 13/* "waituntil" */,-4 , 14/* "loop" */,-4 , 71/* "for" */,-4 , 15/* "forever" */,-4 , 16/* "wait" */,-4 , 17/* "timer" */,-4 , 18/* "resett" */,-4 , 19/* "send" */,-4 , 73/* "sendn" */,-4 , 20/* "serial" */,-4 , 74/* "serialn" */,-4 , 21/* "NewSerial" */,-4 , 75/* "NewSerialn" */,-4 , 22/* "random" */,-4 , 72/* "randomxy" */,-4 , 23/* "add" */,-4 , 24/* "sub" */,-4 , 25/* "mul" */,-4 , 26/* "div" */,-4 , 27/* "mod" */,-4 , 28/* "eq" */,-4 , 29/* "gt" */,-4 , 30/* "lt" */,-4 , 62/* "le" */,-4 , 63/* "ge" */,-4 , 64/* "ne" */,-4 , 31/* "and" */,-4 , 32/* "or" */,-4 , 33/* "xor" */,-4 , 34/* "not" */,-4 , 35/* "setglobal" */,-4 , 36/* "getglobal" */,-4 , 37/* "aset" */,-4 , 38/* "aget" */,-4 , 39/* "record" */,-4 , 40/* "recall" */,-4 , 41/* "resetdp" */,-4 , 42/* "setdp" */,-4 , 43/* "erase" */,-4 , 44/* "when" */,-4 , 45/* "on" */,-4 , 46/* "onfor" */,-4 , 47/* "off" */,-4 , 48/* "thisway" */,-4 , 49/* "thatway" */,-4 , 50/* "rd" */,-4 , 51/* "setpower" */,-4 , 52/* "brake" */,-4 , 53/* "ledon" */,-4 , 54/* "ledoff" */,-4 , 55/* "setsvh" */,-4 , 56/* "svr" */,-4 , 57/* "svl" */,-4 , 58/* "motors" */,-4 , 59/* "while" */,-4 , 60/* "do" */,-4 , 61/* "call" */,-4 , 65/* "setlocal" */,-4 , 66/* "getlocal" */,-4 , 67/* "settemp" */,-4 , 68/* "gettemp" */,-4 , 69/* "getparam" */,-4 , 79/* "sensor" */,-4 , 85/* "Sensorn" */,-4 , 80/* "switch" */,-4 , 86/* "Switchn" */,-4 , 81/* "push" */,-4 , 82/* "pop" */,-4 , 83/* "enter" */,-4 , 84/* "leave" */,-4 , 3/* "byte" */,-4 , 4/* "short" */,-4 , 5/* "block" */,-4 ),
	/* State 5 */ new Array( 98/* "$" */,-5 , 90/* "Address" */,-5 , 2/* "begin" */,-5 , 6/* "eob" */,-5 , 7/* "return" */,-5 , 8/* "output" */,-5 , 9/* "repeat" */,-5 , 10/* "if" */,-5 , 11/* "ifelse" */,-5 , 70/* "goto" */,-5 , 12/* "beep" */,-5 , 13/* "waituntil" */,-5 , 14/* "loop" */,-5 , 71/* "for" */,-5 , 15/* "forever" */,-5 , 16/* "wait" */,-5 , 17/* "timer" */,-5 , 18/* "resett" */,-5 , 19/* "send" */,-5 , 73/* "sendn" */,-5 , 20/* "serial" */,-5 , 74/* "serialn" */,-5 , 21/* "NewSerial" */,-5 , 75/* "NewSerialn" */,-5 , 22/* "random" */,-5 , 72/* "randomxy" */,-5 , 23/* "add" */,-5 , 24/* "sub" */,-5 , 25/* "mul" */,-5 , 26/* "div" */,-5 , 27/* "mod" */,-5 , 28/* "eq" */,-5 , 29/* "gt" */,-5 , 30/* "lt" */,-5 , 62/* "le" */,-5 , 63/* "ge" */,-5 , 64/* "ne" */,-5 , 31/* "and" */,-5 , 32/* "or" */,-5 , 33/* "xor" */,-5 , 34/* "not" */,-5 , 35/* "setglobal" */,-5 , 36/* "getglobal" */,-5 , 37/* "aset" */,-5 , 38/* "aget" */,-5 , 39/* "record" */,-5 , 40/* "recall" */,-5 , 41/* "resetdp" */,-5 , 42/* "setdp" */,-5 , 43/* "erase" */,-5 , 44/* "when" */,-5 , 45/* "on" */,-5 , 46/* "onfor" */,-5 , 47/* "off" */,-5 , 48/* "thisway" */,-5 , 49/* "thatway" */,-5 , 50/* "rd" */,-5 , 51/* "setpower" */,-5 , 52/* "brake" */,-5 , 53/* "ledon" */,-5 , 54/* "ledoff" */,-5 , 55/* "setsvh" */,-5 , 56/* "svr" */,-5 , 57/* "svl" */,-5 , 58/* "motors" */,-5 , 59/* "while" */,-5 , 60/* "do" */,-5 , 61/* "call" */,-5 , 65/* "setlocal" */,-5 , 66/* "getlocal" */,-5 , 67/* "settemp" */,-5 , 68/* "gettemp" */,-5 , 69/* "getparam" */,-5 , 79/* "sensor" */,-5 , 85/* "Sensorn" */,-5 , 80/* "switch" */,-5 , 86/* "Switchn" */,-5 , 81/* "push" */,-5 , 82/* "pop" */,-5 , 83/* "enter" */,-5 , 84/* "leave" */,-5 , 3/* "byte" */,-5 , 4/* "short" */,-5 , 5/* "block" */,-5 ),
	/* State 6 */ new Array( 98/* "$" */,-6 , 90/* "Address" */,-6 , 2/* "begin" */,-6 , 6/* "eob" */,-6 , 7/* "return" */,-6 , 8/* "output" */,-6 , 9/* "repeat" */,-6 , 10/* "if" */,-6 , 11/* "ifelse" */,-6 , 70/* "goto" */,-6 , 12/* "beep" */,-6 , 13/* "waituntil" */,-6 , 14/* "loop" */,-6 , 71/* "for" */,-6 , 15/* "forever" */,-6 , 16/* "wait" */,-6 , 17/* "timer" */,-6 , 18/* "resett" */,-6 , 19/* "send" */,-6 , 73/* "sendn" */,-6 , 20/* "serial" */,-6 , 74/* "serialn" */,-6 , 21/* "NewSerial" */,-6 , 75/* "NewSerialn" */,-6 , 22/* "random" */,-6 , 72/* "randomxy" */,-6 , 23/* "add" */,-6 , 24/* "sub" */,-6 , 25/* "mul" */,-6 , 26/* "div" */,-6 , 27/* "mod" */,-6 , 28/* "eq" */,-6 , 29/* "gt" */,-6 , 30/* "lt" */,-6 , 62/* "le" */,-6 , 63/* "ge" */,-6 , 64/* "ne" */,-6 , 31/* "and" */,-6 , 32/* "or" */,-6 , 33/* "xor" */,-6 , 34/* "not" */,-6 , 35/* "setglobal" */,-6 , 36/* "getglobal" */,-6 , 37/* "aset" */,-6 , 38/* "aget" */,-6 , 39/* "record" */,-6 , 40/* "recall" */,-6 , 41/* "resetdp" */,-6 , 42/* "setdp" */,-6 , 43/* "erase" */,-6 , 44/* "when" */,-6 , 45/* "on" */,-6 , 46/* "onfor" */,-6 , 47/* "off" */,-6 , 48/* "thisway" */,-6 , 49/* "thatway" */,-6 , 50/* "rd" */,-6 , 51/* "setpower" */,-6 , 52/* "brake" */,-6 , 53/* "ledon" */,-6 , 54/* "ledoff" */,-6 , 55/* "setsvh" */,-6 , 56/* "svr" */,-6 , 57/* "svl" */,-6 , 58/* "motors" */,-6 , 59/* "while" */,-6 , 60/* "do" */,-6 , 61/* "call" */,-6 , 65/* "setlocal" */,-6 , 66/* "getlocal" */,-6 , 67/* "settemp" */,-6 , 68/* "gettemp" */,-6 , 69/* "getparam" */,-6 , 79/* "sensor" */,-6 , 85/* "Sensorn" */,-6 , 80/* "switch" */,-6 , 86/* "Switchn" */,-6 , 81/* "push" */,-6 , 82/* "pop" */,-6 , 83/* "enter" */,-6 , 84/* "leave" */,-6 , 3/* "byte" */,-6 , 4/* "short" */,-6 , 5/* "block" */,-6 ),
	/* State 7 */ new Array( 98/* "$" */,-10 , 90/* "Address" */,-10 , 2/* "begin" */,-10 , 6/* "eob" */,-10 , 7/* "return" */,-10 , 8/* "output" */,-10 , 9/* "repeat" */,-10 , 10/* "if" */,-10 , 11/* "ifelse" */,-10 , 70/* "goto" */,-10 , 12/* "beep" */,-10 , 13/* "waituntil" */,-10 , 14/* "loop" */,-10 , 71/* "for" */,-10 , 15/* "forever" */,-10 , 16/* "wait" */,-10 , 17/* "timer" */,-10 , 18/* "resett" */,-10 , 19/* "send" */,-10 , 73/* "sendn" */,-10 , 20/* "serial" */,-10 , 74/* "serialn" */,-10 , 21/* "NewSerial" */,-10 , 75/* "NewSerialn" */,-10 , 22/* "random" */,-10 , 72/* "randomxy" */,-10 , 23/* "add" */,-10 , 24/* "sub" */,-10 , 25/* "mul" */,-10 , 26/* "div" */,-10 , 27/* "mod" */,-10 , 28/* "eq" */,-10 , 29/* "gt" */,-10 , 30/* "lt" */,-10 , 62/* "le" */,-10 , 63/* "ge" */,-10 , 64/* "ne" */,-10 , 31/* "and" */,-10 , 32/* "or" */,-10 , 33/* "xor" */,-10 , 34/* "not" */,-10 , 35/* "setglobal" */,-10 , 36/* "getglobal" */,-10 , 37/* "aset" */,-10 , 38/* "aget" */,-10 , 39/* "record" */,-10 , 40/* "recall" */,-10 , 41/* "resetdp" */,-10 , 42/* "setdp" */,-10 , 43/* "erase" */,-10 , 44/* "when" */,-10 , 45/* "on" */,-10 , 46/* "onfor" */,-10 , 47/* "off" */,-10 , 48/* "thisway" */,-10 , 49/* "thatway" */,-10 , 50/* "rd" */,-10 , 51/* "setpower" */,-10 , 52/* "brake" */,-10 , 53/* "ledon" */,-10 , 54/* "ledoff" */,-10 , 55/* "setsvh" */,-10 , 56/* "svr" */,-10 , 57/* "svl" */,-10 , 58/* "motors" */,-10 , 59/* "while" */,-10 , 60/* "do" */,-10 , 61/* "call" */,-10 , 65/* "setlocal" */,-10 , 66/* "getlocal" */,-10 , 67/* "settemp" */,-10 , 68/* "gettemp" */,-10 , 69/* "getparam" */,-10 , 79/* "sensor" */,-10 , 85/* "Sensorn" */,-10 , 80/* "switch" */,-10 , 86/* "Switchn" */,-10 , 81/* "push" */,-10 , 82/* "pop" */,-10 , 83/* "enter" */,-10 , 84/* "leave" */,-10 , 3/* "byte" */,-10 , 4/* "short" */,-10 , 5/* "block" */,-10 ),
	/* State 8 */ new Array( 98/* "$" */,-11 , 90/* "Address" */,-11 , 2/* "begin" */,-11 , 6/* "eob" */,-11 , 7/* "return" */,-11 , 8/* "output" */,-11 , 9/* "repeat" */,-11 , 10/* "if" */,-11 , 11/* "ifelse" */,-11 , 70/* "goto" */,-11 , 12/* "beep" */,-11 , 13/* "waituntil" */,-11 , 14/* "loop" */,-11 , 71/* "for" */,-11 , 15/* "forever" */,-11 , 16/* "wait" */,-11 , 17/* "timer" */,-11 , 18/* "resett" */,-11 , 19/* "send" */,-11 , 73/* "sendn" */,-11 , 20/* "serial" */,-11 , 74/* "serialn" */,-11 , 21/* "NewSerial" */,-11 , 75/* "NewSerialn" */,-11 , 22/* "random" */,-11 , 72/* "randomxy" */,-11 , 23/* "add" */,-11 , 24/* "sub" */,-11 , 25/* "mul" */,-11 , 26/* "div" */,-11 , 27/* "mod" */,-11 , 28/* "eq" */,-11 , 29/* "gt" */,-11 , 30/* "lt" */,-11 , 62/* "le" */,-11 , 63/* "ge" */,-11 , 64/* "ne" */,-11 , 31/* "and" */,-11 , 32/* "or" */,-11 , 33/* "xor" */,-11 , 34/* "not" */,-11 , 35/* "setglobal" */,-11 , 36/* "getglobal" */,-11 , 37/* "aset" */,-11 , 38/* "aget" */,-11 , 39/* "record" */,-11 , 40/* "recall" */,-11 , 41/* "resetdp" */,-11 , 42/* "setdp" */,-11 , 43/* "erase" */,-11 , 44/* "when" */,-11 , 45/* "on" */,-11 , 46/* "onfor" */,-11 , 47/* "off" */,-11 , 48/* "thisway" */,-11 , 49/* "thatway" */,-11 , 50/* "rd" */,-11 , 51/* "setpower" */,-11 , 52/* "brake" */,-11 , 53/* "ledon" */,-11 , 54/* "ledoff" */,-11 , 55/* "setsvh" */,-11 , 56/* "svr" */,-11 , 57/* "svl" */,-11 , 58/* "motors" */,-11 , 59/* "while" */,-11 , 60/* "do" */,-11 , 61/* "call" */,-11 , 65/* "setlocal" */,-11 , 66/* "getlocal" */,-11 , 67/* "settemp" */,-11 , 68/* "gettemp" */,-11 , 69/* "getparam" */,-11 , 79/* "sensor" */,-11 , 85/* "Sensorn" */,-11 , 80/* "switch" */,-11 , 86/* "Switchn" */,-11 , 81/* "push" */,-11 , 82/* "pop" */,-11 , 83/* "enter" */,-11 , 84/* "leave" */,-11 , 3/* "byte" */,-11 , 4/* "short" */,-11 , 5/* "block" */,-11 ),
	/* State 9 */ new Array( 98/* "$" */,-12 , 90/* "Address" */,-12 , 2/* "begin" */,-12 , 6/* "eob" */,-12 , 7/* "return" */,-12 , 8/* "output" */,-12 , 9/* "repeat" */,-12 , 10/* "if" */,-12 , 11/* "ifelse" */,-12 , 70/* "goto" */,-12 , 12/* "beep" */,-12 , 13/* "waituntil" */,-12 , 14/* "loop" */,-12 , 71/* "for" */,-12 , 15/* "forever" */,-12 , 16/* "wait" */,-12 , 17/* "timer" */,-12 , 18/* "resett" */,-12 , 19/* "send" */,-12 , 73/* "sendn" */,-12 , 20/* "serial" */,-12 , 74/* "serialn" */,-12 , 21/* "NewSerial" */,-12 , 75/* "NewSerialn" */,-12 , 22/* "random" */,-12 , 72/* "randomxy" */,-12 , 23/* "add" */,-12 , 24/* "sub" */,-12 , 25/* "mul" */,-12 , 26/* "div" */,-12 , 27/* "mod" */,-12 , 28/* "eq" */,-12 , 29/* "gt" */,-12 , 30/* "lt" */,-12 , 62/* "le" */,-12 , 63/* "ge" */,-12 , 64/* "ne" */,-12 , 31/* "and" */,-12 , 32/* "or" */,-12 , 33/* "xor" */,-12 , 34/* "not" */,-12 , 35/* "setglobal" */,-12 , 36/* "getglobal" */,-12 , 37/* "aset" */,-12 , 38/* "aget" */,-12 , 39/* "record" */,-12 , 40/* "recall" */,-12 , 41/* "resetdp" */,-12 , 42/* "setdp" */,-12 , 43/* "erase" */,-12 , 44/* "when" */,-12 , 45/* "on" */,-12 , 46/* "onfor" */,-12 , 47/* "off" */,-12 , 48/* "thisway" */,-12 , 49/* "thatway" */,-12 , 50/* "rd" */,-12 , 51/* "setpower" */,-12 , 52/* "brake" */,-12 , 53/* "ledon" */,-12 , 54/* "ledoff" */,-12 , 55/* "setsvh" */,-12 , 56/* "svr" */,-12 , 57/* "svl" */,-12 , 58/* "motors" */,-12 , 59/* "while" */,-12 , 60/* "do" */,-12 , 61/* "call" */,-12 , 65/* "setlocal" */,-12 , 66/* "getlocal" */,-12 , 67/* "settemp" */,-12 , 68/* "gettemp" */,-12 , 69/* "getparam" */,-12 , 79/* "sensor" */,-12 , 85/* "Sensorn" */,-12 , 80/* "switch" */,-12 , 86/* "Switchn" */,-12 , 81/* "push" */,-12 , 82/* "pop" */,-12 , 83/* "enter" */,-12 , 84/* "leave" */,-12 , 3/* "byte" */,-12 , 4/* "short" */,-12 , 5/* "block" */,-12 ),
	/* State 10 */ new Array( 98/* "$" */,-13 , 90/* "Address" */,-13 , 2/* "begin" */,-13 , 6/* "eob" */,-13 , 7/* "return" */,-13 , 8/* "output" */,-13 , 9/* "repeat" */,-13 , 10/* "if" */,-13 , 11/* "ifelse" */,-13 , 70/* "goto" */,-13 , 12/* "beep" */,-13 , 13/* "waituntil" */,-13 , 14/* "loop" */,-13 , 71/* "for" */,-13 , 15/* "forever" */,-13 , 16/* "wait" */,-13 , 17/* "timer" */,-13 , 18/* "resett" */,-13 , 19/* "send" */,-13 , 73/* "sendn" */,-13 , 20/* "serial" */,-13 , 74/* "serialn" */,-13 , 21/* "NewSerial" */,-13 , 75/* "NewSerialn" */,-13 , 22/* "random" */,-13 , 72/* "randomxy" */,-13 , 23/* "add" */,-13 , 24/* "sub" */,-13 , 25/* "mul" */,-13 , 26/* "div" */,-13 , 27/* "mod" */,-13 , 28/* "eq" */,-13 , 29/* "gt" */,-13 , 30/* "lt" */,-13 , 62/* "le" */,-13 , 63/* "ge" */,-13 , 64/* "ne" */,-13 , 31/* "and" */,-13 , 32/* "or" */,-13 , 33/* "xor" */,-13 , 34/* "not" */,-13 , 35/* "setglobal" */,-13 , 36/* "getglobal" */,-13 , 37/* "aset" */,-13 , 38/* "aget" */,-13 , 39/* "record" */,-13 , 40/* "recall" */,-13 , 41/* "resetdp" */,-13 , 42/* "setdp" */,-13 , 43/* "erase" */,-13 , 44/* "when" */,-13 , 45/* "on" */,-13 , 46/* "onfor" */,-13 , 47/* "off" */,-13 , 48/* "thisway" */,-13 , 49/* "thatway" */,-13 , 50/* "rd" */,-13 , 51/* "setpower" */,-13 , 52/* "brake" */,-13 , 53/* "ledon" */,-13 , 54/* "ledoff" */,-13 , 55/* "setsvh" */,-13 , 56/* "svr" */,-13 , 57/* "svl" */,-13 , 58/* "motors" */,-13 , 59/* "while" */,-13 , 60/* "do" */,-13 , 61/* "call" */,-13 , 65/* "setlocal" */,-13 , 66/* "getlocal" */,-13 , 67/* "settemp" */,-13 , 68/* "gettemp" */,-13 , 69/* "getparam" */,-13 , 79/* "sensor" */,-13 , 85/* "Sensorn" */,-13 , 80/* "switch" */,-13 , 86/* "Switchn" */,-13 , 81/* "push" */,-13 , 82/* "pop" */,-13 , 83/* "enter" */,-13 , 84/* "leave" */,-13 , 3/* "byte" */,-13 , 4/* "short" */,-13 , 5/* "block" */,-13 ),
	/* State 11 */ new Array( 98/* "$" */,-14 , 90/* "Address" */,-14 , 2/* "begin" */,-14 , 6/* "eob" */,-14 , 7/* "return" */,-14 , 8/* "output" */,-14 , 9/* "repeat" */,-14 , 10/* "if" */,-14 , 11/* "ifelse" */,-14 , 70/* "goto" */,-14 , 12/* "beep" */,-14 , 13/* "waituntil" */,-14 , 14/* "loop" */,-14 , 71/* "for" */,-14 , 15/* "forever" */,-14 , 16/* "wait" */,-14 , 17/* "timer" */,-14 , 18/* "resett" */,-14 , 19/* "send" */,-14 , 73/* "sendn" */,-14 , 20/* "serial" */,-14 , 74/* "serialn" */,-14 , 21/* "NewSerial" */,-14 , 75/* "NewSerialn" */,-14 , 22/* "random" */,-14 , 72/* "randomxy" */,-14 , 23/* "add" */,-14 , 24/* "sub" */,-14 , 25/* "mul" */,-14 , 26/* "div" */,-14 , 27/* "mod" */,-14 , 28/* "eq" */,-14 , 29/* "gt" */,-14 , 30/* "lt" */,-14 , 62/* "le" */,-14 , 63/* "ge" */,-14 , 64/* "ne" */,-14 , 31/* "and" */,-14 , 32/* "or" */,-14 , 33/* "xor" */,-14 , 34/* "not" */,-14 , 35/* "setglobal" */,-14 , 36/* "getglobal" */,-14 , 37/* "aset" */,-14 , 38/* "aget" */,-14 , 39/* "record" */,-14 , 40/* "recall" */,-14 , 41/* "resetdp" */,-14 , 42/* "setdp" */,-14 , 43/* "erase" */,-14 , 44/* "when" */,-14 , 45/* "on" */,-14 , 46/* "onfor" */,-14 , 47/* "off" */,-14 , 48/* "thisway" */,-14 , 49/* "thatway" */,-14 , 50/* "rd" */,-14 , 51/* "setpower" */,-14 , 52/* "brake" */,-14 , 53/* "ledon" */,-14 , 54/* "ledoff" */,-14 , 55/* "setsvh" */,-14 , 56/* "svr" */,-14 , 57/* "svl" */,-14 , 58/* "motors" */,-14 , 59/* "while" */,-14 , 60/* "do" */,-14 , 61/* "call" */,-14 , 65/* "setlocal" */,-14 , 66/* "getlocal" */,-14 , 67/* "settemp" */,-14 , 68/* "gettemp" */,-14 , 69/* "getparam" */,-14 , 79/* "sensor" */,-14 , 85/* "Sensorn" */,-14 , 80/* "switch" */,-14 , 86/* "Switchn" */,-14 , 81/* "push" */,-14 , 82/* "pop" */,-14 , 83/* "enter" */,-14 , 84/* "leave" */,-14 , 3/* "byte" */,-14 , 4/* "short" */,-14 , 5/* "block" */,-14 ),
	/* State 12 */ new Array( 98/* "$" */,-15 , 90/* "Address" */,-15 , 2/* "begin" */,-15 , 6/* "eob" */,-15 , 7/* "return" */,-15 , 8/* "output" */,-15 , 9/* "repeat" */,-15 , 10/* "if" */,-15 , 11/* "ifelse" */,-15 , 70/* "goto" */,-15 , 12/* "beep" */,-15 , 13/* "waituntil" */,-15 , 14/* "loop" */,-15 , 71/* "for" */,-15 , 15/* "forever" */,-15 , 16/* "wait" */,-15 , 17/* "timer" */,-15 , 18/* "resett" */,-15 , 19/* "send" */,-15 , 73/* "sendn" */,-15 , 20/* "serial" */,-15 , 74/* "serialn" */,-15 , 21/* "NewSerial" */,-15 , 75/* "NewSerialn" */,-15 , 22/* "random" */,-15 , 72/* "randomxy" */,-15 , 23/* "add" */,-15 , 24/* "sub" */,-15 , 25/* "mul" */,-15 , 26/* "div" */,-15 , 27/* "mod" */,-15 , 28/* "eq" */,-15 , 29/* "gt" */,-15 , 30/* "lt" */,-15 , 62/* "le" */,-15 , 63/* "ge" */,-15 , 64/* "ne" */,-15 , 31/* "and" */,-15 , 32/* "or" */,-15 , 33/* "xor" */,-15 , 34/* "not" */,-15 , 35/* "setglobal" */,-15 , 36/* "getglobal" */,-15 , 37/* "aset" */,-15 , 38/* "aget" */,-15 , 39/* "record" */,-15 , 40/* "recall" */,-15 , 41/* "resetdp" */,-15 , 42/* "setdp" */,-15 , 43/* "erase" */,-15 , 44/* "when" */,-15 , 45/* "on" */,-15 , 46/* "onfor" */,-15 , 47/* "off" */,-15 , 48/* "thisway" */,-15 , 49/* "thatway" */,-15 , 50/* "rd" */,-15 , 51/* "setpower" */,-15 , 52/* "brake" */,-15 , 53/* "ledon" */,-15 , 54/* "ledoff" */,-15 , 55/* "setsvh" */,-15 , 56/* "svr" */,-15 , 57/* "svl" */,-15 , 58/* "motors" */,-15 , 59/* "while" */,-15 , 60/* "do" */,-15 , 61/* "call" */,-15 , 65/* "setlocal" */,-15 , 66/* "getlocal" */,-15 , 67/* "settemp" */,-15 , 68/* "gettemp" */,-15 , 69/* "getparam" */,-15 , 79/* "sensor" */,-15 , 85/* "Sensorn" */,-15 , 80/* "switch" */,-15 , 86/* "Switchn" */,-15 , 81/* "push" */,-15 , 82/* "pop" */,-15 , 83/* "enter" */,-15 , 84/* "leave" */,-15 , 3/* "byte" */,-15 , 4/* "short" */,-15 , 5/* "block" */,-15 ),
	/* State 13 */ new Array( 98/* "$" */,-16 , 90/* "Address" */,-16 , 2/* "begin" */,-16 , 6/* "eob" */,-16 , 7/* "return" */,-16 , 8/* "output" */,-16 , 9/* "repeat" */,-16 , 10/* "if" */,-16 , 11/* "ifelse" */,-16 , 70/* "goto" */,-16 , 12/* "beep" */,-16 , 13/* "waituntil" */,-16 , 14/* "loop" */,-16 , 71/* "for" */,-16 , 15/* "forever" */,-16 , 16/* "wait" */,-16 , 17/* "timer" */,-16 , 18/* "resett" */,-16 , 19/* "send" */,-16 , 73/* "sendn" */,-16 , 20/* "serial" */,-16 , 74/* "serialn" */,-16 , 21/* "NewSerial" */,-16 , 75/* "NewSerialn" */,-16 , 22/* "random" */,-16 , 72/* "randomxy" */,-16 , 23/* "add" */,-16 , 24/* "sub" */,-16 , 25/* "mul" */,-16 , 26/* "div" */,-16 , 27/* "mod" */,-16 , 28/* "eq" */,-16 , 29/* "gt" */,-16 , 30/* "lt" */,-16 , 62/* "le" */,-16 , 63/* "ge" */,-16 , 64/* "ne" */,-16 , 31/* "and" */,-16 , 32/* "or" */,-16 , 33/* "xor" */,-16 , 34/* "not" */,-16 , 35/* "setglobal" */,-16 , 36/* "getglobal" */,-16 , 37/* "aset" */,-16 , 38/* "aget" */,-16 , 39/* "record" */,-16 , 40/* "recall" */,-16 , 41/* "resetdp" */,-16 , 42/* "setdp" */,-16 , 43/* "erase" */,-16 , 44/* "when" */,-16 , 45/* "on" */,-16 , 46/* "onfor" */,-16 , 47/* "off" */,-16 , 48/* "thisway" */,-16 , 49/* "thatway" */,-16 , 50/* "rd" */,-16 , 51/* "setpower" */,-16 , 52/* "brake" */,-16 , 53/* "ledon" */,-16 , 54/* "ledoff" */,-16 , 55/* "setsvh" */,-16 , 56/* "svr" */,-16 , 57/* "svl" */,-16 , 58/* "motors" */,-16 , 59/* "while" */,-16 , 60/* "do" */,-16 , 61/* "call" */,-16 , 65/* "setlocal" */,-16 , 66/* "getlocal" */,-16 , 67/* "settemp" */,-16 , 68/* "gettemp" */,-16 , 69/* "getparam" */,-16 , 79/* "sensor" */,-16 , 85/* "Sensorn" */,-16 , 80/* "switch" */,-16 , 86/* "Switchn" */,-16 , 81/* "push" */,-16 , 82/* "pop" */,-16 , 83/* "enter" */,-16 , 84/* "leave" */,-16 , 3/* "byte" */,-16 , 4/* "short" */,-16 , 5/* "block" */,-16 ),
	/* State 14 */ new Array( 98/* "$" */,-17 , 90/* "Address" */,-17 , 2/* "begin" */,-17 , 6/* "eob" */,-17 , 7/* "return" */,-17 , 8/* "output" */,-17 , 9/* "repeat" */,-17 , 10/* "if" */,-17 , 11/* "ifelse" */,-17 , 70/* "goto" */,-17 , 12/* "beep" */,-17 , 13/* "waituntil" */,-17 , 14/* "loop" */,-17 , 71/* "for" */,-17 , 15/* "forever" */,-17 , 16/* "wait" */,-17 , 17/* "timer" */,-17 , 18/* "resett" */,-17 , 19/* "send" */,-17 , 73/* "sendn" */,-17 , 20/* "serial" */,-17 , 74/* "serialn" */,-17 , 21/* "NewSerial" */,-17 , 75/* "NewSerialn" */,-17 , 22/* "random" */,-17 , 72/* "randomxy" */,-17 , 23/* "add" */,-17 , 24/* "sub" */,-17 , 25/* "mul" */,-17 , 26/* "div" */,-17 , 27/* "mod" */,-17 , 28/* "eq" */,-17 , 29/* "gt" */,-17 , 30/* "lt" */,-17 , 62/* "le" */,-17 , 63/* "ge" */,-17 , 64/* "ne" */,-17 , 31/* "and" */,-17 , 32/* "or" */,-17 , 33/* "xor" */,-17 , 34/* "not" */,-17 , 35/* "setglobal" */,-17 , 36/* "getglobal" */,-17 , 37/* "aset" */,-17 , 38/* "aget" */,-17 , 39/* "record" */,-17 , 40/* "recall" */,-17 , 41/* "resetdp" */,-17 , 42/* "setdp" */,-17 , 43/* "erase" */,-17 , 44/* "when" */,-17 , 45/* "on" */,-17 , 46/* "onfor" */,-17 , 47/* "off" */,-17 , 48/* "thisway" */,-17 , 49/* "thatway" */,-17 , 50/* "rd" */,-17 , 51/* "setpower" */,-17 , 52/* "brake" */,-17 , 53/* "ledon" */,-17 , 54/* "ledoff" */,-17 , 55/* "setsvh" */,-17 , 56/* "svr" */,-17 , 57/* "svl" */,-17 , 58/* "motors" */,-17 , 59/* "while" */,-17 , 60/* "do" */,-17 , 61/* "call" */,-17 , 65/* "setlocal" */,-17 , 66/* "getlocal" */,-17 , 67/* "settemp" */,-17 , 68/* "gettemp" */,-17 , 69/* "getparam" */,-17 , 79/* "sensor" */,-17 , 85/* "Sensorn" */,-17 , 80/* "switch" */,-17 , 86/* "Switchn" */,-17 , 81/* "push" */,-17 , 82/* "pop" */,-17 , 83/* "enter" */,-17 , 84/* "leave" */,-17 , 3/* "byte" */,-17 , 4/* "short" */,-17 , 5/* "block" */,-17 ),
	/* State 15 */ new Array( 98/* "$" */,-18 , 90/* "Address" */,-18 , 2/* "begin" */,-18 , 6/* "eob" */,-18 , 7/* "return" */,-18 , 8/* "output" */,-18 , 9/* "repeat" */,-18 , 10/* "if" */,-18 , 11/* "ifelse" */,-18 , 70/* "goto" */,-18 , 12/* "beep" */,-18 , 13/* "waituntil" */,-18 , 14/* "loop" */,-18 , 71/* "for" */,-18 , 15/* "forever" */,-18 , 16/* "wait" */,-18 , 17/* "timer" */,-18 , 18/* "resett" */,-18 , 19/* "send" */,-18 , 73/* "sendn" */,-18 , 20/* "serial" */,-18 , 74/* "serialn" */,-18 , 21/* "NewSerial" */,-18 , 75/* "NewSerialn" */,-18 , 22/* "random" */,-18 , 72/* "randomxy" */,-18 , 23/* "add" */,-18 , 24/* "sub" */,-18 , 25/* "mul" */,-18 , 26/* "div" */,-18 , 27/* "mod" */,-18 , 28/* "eq" */,-18 , 29/* "gt" */,-18 , 30/* "lt" */,-18 , 62/* "le" */,-18 , 63/* "ge" */,-18 , 64/* "ne" */,-18 , 31/* "and" */,-18 , 32/* "or" */,-18 , 33/* "xor" */,-18 , 34/* "not" */,-18 , 35/* "setglobal" */,-18 , 36/* "getglobal" */,-18 , 37/* "aset" */,-18 , 38/* "aget" */,-18 , 39/* "record" */,-18 , 40/* "recall" */,-18 , 41/* "resetdp" */,-18 , 42/* "setdp" */,-18 , 43/* "erase" */,-18 , 44/* "when" */,-18 , 45/* "on" */,-18 , 46/* "onfor" */,-18 , 47/* "off" */,-18 , 48/* "thisway" */,-18 , 49/* "thatway" */,-18 , 50/* "rd" */,-18 , 51/* "setpower" */,-18 , 52/* "brake" */,-18 , 53/* "ledon" */,-18 , 54/* "ledoff" */,-18 , 55/* "setsvh" */,-18 , 56/* "svr" */,-18 , 57/* "svl" */,-18 , 58/* "motors" */,-18 , 59/* "while" */,-18 , 60/* "do" */,-18 , 61/* "call" */,-18 , 65/* "setlocal" */,-18 , 66/* "getlocal" */,-18 , 67/* "settemp" */,-18 , 68/* "gettemp" */,-18 , 69/* "getparam" */,-18 , 79/* "sensor" */,-18 , 85/* "Sensorn" */,-18 , 80/* "switch" */,-18 , 86/* "Switchn" */,-18 , 81/* "push" */,-18 , 82/* "pop" */,-18 , 83/* "enter" */,-18 , 84/* "leave" */,-18 , 3/* "byte" */,-18 , 4/* "short" */,-18 , 5/* "block" */,-18 ),
	/* State 16 */ new Array( 98/* "$" */,-19 , 90/* "Address" */,-19 , 2/* "begin" */,-19 , 6/* "eob" */,-19 , 7/* "return" */,-19 , 8/* "output" */,-19 , 9/* "repeat" */,-19 , 10/* "if" */,-19 , 11/* "ifelse" */,-19 , 70/* "goto" */,-19 , 12/* "beep" */,-19 , 13/* "waituntil" */,-19 , 14/* "loop" */,-19 , 71/* "for" */,-19 , 15/* "forever" */,-19 , 16/* "wait" */,-19 , 17/* "timer" */,-19 , 18/* "resett" */,-19 , 19/* "send" */,-19 , 73/* "sendn" */,-19 , 20/* "serial" */,-19 , 74/* "serialn" */,-19 , 21/* "NewSerial" */,-19 , 75/* "NewSerialn" */,-19 , 22/* "random" */,-19 , 72/* "randomxy" */,-19 , 23/* "add" */,-19 , 24/* "sub" */,-19 , 25/* "mul" */,-19 , 26/* "div" */,-19 , 27/* "mod" */,-19 , 28/* "eq" */,-19 , 29/* "gt" */,-19 , 30/* "lt" */,-19 , 62/* "le" */,-19 , 63/* "ge" */,-19 , 64/* "ne" */,-19 , 31/* "and" */,-19 , 32/* "or" */,-19 , 33/* "xor" */,-19 , 34/* "not" */,-19 , 35/* "setglobal" */,-19 , 36/* "getglobal" */,-19 , 37/* "aset" */,-19 , 38/* "aget" */,-19 , 39/* "record" */,-19 , 40/* "recall" */,-19 , 41/* "resetdp" */,-19 , 42/* "setdp" */,-19 , 43/* "erase" */,-19 , 44/* "when" */,-19 , 45/* "on" */,-19 , 46/* "onfor" */,-19 , 47/* "off" */,-19 , 48/* "thisway" */,-19 , 49/* "thatway" */,-19 , 50/* "rd" */,-19 , 51/* "setpower" */,-19 , 52/* "brake" */,-19 , 53/* "ledon" */,-19 , 54/* "ledoff" */,-19 , 55/* "setsvh" */,-19 , 56/* "svr" */,-19 , 57/* "svl" */,-19 , 58/* "motors" */,-19 , 59/* "while" */,-19 , 60/* "do" */,-19 , 61/* "call" */,-19 , 65/* "setlocal" */,-19 , 66/* "getlocal" */,-19 , 67/* "settemp" */,-19 , 68/* "gettemp" */,-19 , 69/* "getparam" */,-19 , 79/* "sensor" */,-19 , 85/* "Sensorn" */,-19 , 80/* "switch" */,-19 , 86/* "Switchn" */,-19 , 81/* "push" */,-19 , 82/* "pop" */,-19 , 83/* "enter" */,-19 , 84/* "leave" */,-19 , 3/* "byte" */,-19 , 4/* "short" */,-19 , 5/* "block" */,-19 ),
	/* State 17 */ new Array( 98/* "$" */,-20 , 90/* "Address" */,-20 , 2/* "begin" */,-20 , 6/* "eob" */,-20 , 7/* "return" */,-20 , 8/* "output" */,-20 , 9/* "repeat" */,-20 , 10/* "if" */,-20 , 11/* "ifelse" */,-20 , 70/* "goto" */,-20 , 12/* "beep" */,-20 , 13/* "waituntil" */,-20 , 14/* "loop" */,-20 , 71/* "for" */,-20 , 15/* "forever" */,-20 , 16/* "wait" */,-20 , 17/* "timer" */,-20 , 18/* "resett" */,-20 , 19/* "send" */,-20 , 73/* "sendn" */,-20 , 20/* "serial" */,-20 , 74/* "serialn" */,-20 , 21/* "NewSerial" */,-20 , 75/* "NewSerialn" */,-20 , 22/* "random" */,-20 , 72/* "randomxy" */,-20 , 23/* "add" */,-20 , 24/* "sub" */,-20 , 25/* "mul" */,-20 , 26/* "div" */,-20 , 27/* "mod" */,-20 , 28/* "eq" */,-20 , 29/* "gt" */,-20 , 30/* "lt" */,-20 , 62/* "le" */,-20 , 63/* "ge" */,-20 , 64/* "ne" */,-20 , 31/* "and" */,-20 , 32/* "or" */,-20 , 33/* "xor" */,-20 , 34/* "not" */,-20 , 35/* "setglobal" */,-20 , 36/* "getglobal" */,-20 , 37/* "aset" */,-20 , 38/* "aget" */,-20 , 39/* "record" */,-20 , 40/* "recall" */,-20 , 41/* "resetdp" */,-20 , 42/* "setdp" */,-20 , 43/* "erase" */,-20 , 44/* "when" */,-20 , 45/* "on" */,-20 , 46/* "onfor" */,-20 , 47/* "off" */,-20 , 48/* "thisway" */,-20 , 49/* "thatway" */,-20 , 50/* "rd" */,-20 , 51/* "setpower" */,-20 , 52/* "brake" */,-20 , 53/* "ledon" */,-20 , 54/* "ledoff" */,-20 , 55/* "setsvh" */,-20 , 56/* "svr" */,-20 , 57/* "svl" */,-20 , 58/* "motors" */,-20 , 59/* "while" */,-20 , 60/* "do" */,-20 , 61/* "call" */,-20 , 65/* "setlocal" */,-20 , 66/* "getlocal" */,-20 , 67/* "settemp" */,-20 , 68/* "gettemp" */,-20 , 69/* "getparam" */,-20 , 79/* "sensor" */,-20 , 85/* "Sensorn" */,-20 , 80/* "switch" */,-20 , 86/* "Switchn" */,-20 , 81/* "push" */,-20 , 82/* "pop" */,-20 , 83/* "enter" */,-20 , 84/* "leave" */,-20 , 3/* "byte" */,-20 , 4/* "short" */,-20 , 5/* "block" */,-20 ),
	/* State 18 */ new Array( 98/* "$" */,-21 , 90/* "Address" */,-21 , 2/* "begin" */,-21 , 6/* "eob" */,-21 , 7/* "return" */,-21 , 8/* "output" */,-21 , 9/* "repeat" */,-21 , 10/* "if" */,-21 , 11/* "ifelse" */,-21 , 70/* "goto" */,-21 , 12/* "beep" */,-21 , 13/* "waituntil" */,-21 , 14/* "loop" */,-21 , 71/* "for" */,-21 , 15/* "forever" */,-21 , 16/* "wait" */,-21 , 17/* "timer" */,-21 , 18/* "resett" */,-21 , 19/* "send" */,-21 , 73/* "sendn" */,-21 , 20/* "serial" */,-21 , 74/* "serialn" */,-21 , 21/* "NewSerial" */,-21 , 75/* "NewSerialn" */,-21 , 22/* "random" */,-21 , 72/* "randomxy" */,-21 , 23/* "add" */,-21 , 24/* "sub" */,-21 , 25/* "mul" */,-21 , 26/* "div" */,-21 , 27/* "mod" */,-21 , 28/* "eq" */,-21 , 29/* "gt" */,-21 , 30/* "lt" */,-21 , 62/* "le" */,-21 , 63/* "ge" */,-21 , 64/* "ne" */,-21 , 31/* "and" */,-21 , 32/* "or" */,-21 , 33/* "xor" */,-21 , 34/* "not" */,-21 , 35/* "setglobal" */,-21 , 36/* "getglobal" */,-21 , 37/* "aset" */,-21 , 38/* "aget" */,-21 , 39/* "record" */,-21 , 40/* "recall" */,-21 , 41/* "resetdp" */,-21 , 42/* "setdp" */,-21 , 43/* "erase" */,-21 , 44/* "when" */,-21 , 45/* "on" */,-21 , 46/* "onfor" */,-21 , 47/* "off" */,-21 , 48/* "thisway" */,-21 , 49/* "thatway" */,-21 , 50/* "rd" */,-21 , 51/* "setpower" */,-21 , 52/* "brake" */,-21 , 53/* "ledon" */,-21 , 54/* "ledoff" */,-21 , 55/* "setsvh" */,-21 , 56/* "svr" */,-21 , 57/* "svl" */,-21 , 58/* "motors" */,-21 , 59/* "while" */,-21 , 60/* "do" */,-21 , 61/* "call" */,-21 , 65/* "setlocal" */,-21 , 66/* "getlocal" */,-21 , 67/* "settemp" */,-21 , 68/* "gettemp" */,-21 , 69/* "getparam" */,-21 , 79/* "sensor" */,-21 , 85/* "Sensorn" */,-21 , 80/* "switch" */,-21 , 86/* "Switchn" */,-21 , 81/* "push" */,-21 , 82/* "pop" */,-21 , 83/* "enter" */,-21 , 84/* "leave" */,-21 , 3/* "byte" */,-21 , 4/* "short" */,-21 , 5/* "block" */,-21 ),
	/* State 19 */ new Array( 98/* "$" */,-22 , 90/* "Address" */,-22 , 2/* "begin" */,-22 , 6/* "eob" */,-22 , 7/* "return" */,-22 , 8/* "output" */,-22 , 9/* "repeat" */,-22 , 10/* "if" */,-22 , 11/* "ifelse" */,-22 , 70/* "goto" */,-22 , 12/* "beep" */,-22 , 13/* "waituntil" */,-22 , 14/* "loop" */,-22 , 71/* "for" */,-22 , 15/* "forever" */,-22 , 16/* "wait" */,-22 , 17/* "timer" */,-22 , 18/* "resett" */,-22 , 19/* "send" */,-22 , 73/* "sendn" */,-22 , 20/* "serial" */,-22 , 74/* "serialn" */,-22 , 21/* "NewSerial" */,-22 , 75/* "NewSerialn" */,-22 , 22/* "random" */,-22 , 72/* "randomxy" */,-22 , 23/* "add" */,-22 , 24/* "sub" */,-22 , 25/* "mul" */,-22 , 26/* "div" */,-22 , 27/* "mod" */,-22 , 28/* "eq" */,-22 , 29/* "gt" */,-22 , 30/* "lt" */,-22 , 62/* "le" */,-22 , 63/* "ge" */,-22 , 64/* "ne" */,-22 , 31/* "and" */,-22 , 32/* "or" */,-22 , 33/* "xor" */,-22 , 34/* "not" */,-22 , 35/* "setglobal" */,-22 , 36/* "getglobal" */,-22 , 37/* "aset" */,-22 , 38/* "aget" */,-22 , 39/* "record" */,-22 , 40/* "recall" */,-22 , 41/* "resetdp" */,-22 , 42/* "setdp" */,-22 , 43/* "erase" */,-22 , 44/* "when" */,-22 , 45/* "on" */,-22 , 46/* "onfor" */,-22 , 47/* "off" */,-22 , 48/* "thisway" */,-22 , 49/* "thatway" */,-22 , 50/* "rd" */,-22 , 51/* "setpower" */,-22 , 52/* "brake" */,-22 , 53/* "ledon" */,-22 , 54/* "ledoff" */,-22 , 55/* "setsvh" */,-22 , 56/* "svr" */,-22 , 57/* "svl" */,-22 , 58/* "motors" */,-22 , 59/* "while" */,-22 , 60/* "do" */,-22 , 61/* "call" */,-22 , 65/* "setlocal" */,-22 , 66/* "getlocal" */,-22 , 67/* "settemp" */,-22 , 68/* "gettemp" */,-22 , 69/* "getparam" */,-22 , 79/* "sensor" */,-22 , 85/* "Sensorn" */,-22 , 80/* "switch" */,-22 , 86/* "Switchn" */,-22 , 81/* "push" */,-22 , 82/* "pop" */,-22 , 83/* "enter" */,-22 , 84/* "leave" */,-22 , 3/* "byte" */,-22 , 4/* "short" */,-22 , 5/* "block" */,-22 ),
	/* State 20 */ new Array( 98/* "$" */,-23 , 90/* "Address" */,-23 , 2/* "begin" */,-23 , 6/* "eob" */,-23 , 7/* "return" */,-23 , 8/* "output" */,-23 , 9/* "repeat" */,-23 , 10/* "if" */,-23 , 11/* "ifelse" */,-23 , 70/* "goto" */,-23 , 12/* "beep" */,-23 , 13/* "waituntil" */,-23 , 14/* "loop" */,-23 , 71/* "for" */,-23 , 15/* "forever" */,-23 , 16/* "wait" */,-23 , 17/* "timer" */,-23 , 18/* "resett" */,-23 , 19/* "send" */,-23 , 73/* "sendn" */,-23 , 20/* "serial" */,-23 , 74/* "serialn" */,-23 , 21/* "NewSerial" */,-23 , 75/* "NewSerialn" */,-23 , 22/* "random" */,-23 , 72/* "randomxy" */,-23 , 23/* "add" */,-23 , 24/* "sub" */,-23 , 25/* "mul" */,-23 , 26/* "div" */,-23 , 27/* "mod" */,-23 , 28/* "eq" */,-23 , 29/* "gt" */,-23 , 30/* "lt" */,-23 , 62/* "le" */,-23 , 63/* "ge" */,-23 , 64/* "ne" */,-23 , 31/* "and" */,-23 , 32/* "or" */,-23 , 33/* "xor" */,-23 , 34/* "not" */,-23 , 35/* "setglobal" */,-23 , 36/* "getglobal" */,-23 , 37/* "aset" */,-23 , 38/* "aget" */,-23 , 39/* "record" */,-23 , 40/* "recall" */,-23 , 41/* "resetdp" */,-23 , 42/* "setdp" */,-23 , 43/* "erase" */,-23 , 44/* "when" */,-23 , 45/* "on" */,-23 , 46/* "onfor" */,-23 , 47/* "off" */,-23 , 48/* "thisway" */,-23 , 49/* "thatway" */,-23 , 50/* "rd" */,-23 , 51/* "setpower" */,-23 , 52/* "brake" */,-23 , 53/* "ledon" */,-23 , 54/* "ledoff" */,-23 , 55/* "setsvh" */,-23 , 56/* "svr" */,-23 , 57/* "svl" */,-23 , 58/* "motors" */,-23 , 59/* "while" */,-23 , 60/* "do" */,-23 , 61/* "call" */,-23 , 65/* "setlocal" */,-23 , 66/* "getlocal" */,-23 , 67/* "settemp" */,-23 , 68/* "gettemp" */,-23 , 69/* "getparam" */,-23 , 79/* "sensor" */,-23 , 85/* "Sensorn" */,-23 , 80/* "switch" */,-23 , 86/* "Switchn" */,-23 , 81/* "push" */,-23 , 82/* "pop" */,-23 , 83/* "enter" */,-23 , 84/* "leave" */,-23 , 3/* "byte" */,-23 , 4/* "short" */,-23 , 5/* "block" */,-23 ),
	/* State 21 */ new Array( 98/* "$" */,-24 , 90/* "Address" */,-24 , 2/* "begin" */,-24 , 6/* "eob" */,-24 , 7/* "return" */,-24 , 8/* "output" */,-24 , 9/* "repeat" */,-24 , 10/* "if" */,-24 , 11/* "ifelse" */,-24 , 70/* "goto" */,-24 , 12/* "beep" */,-24 , 13/* "waituntil" */,-24 , 14/* "loop" */,-24 , 71/* "for" */,-24 , 15/* "forever" */,-24 , 16/* "wait" */,-24 , 17/* "timer" */,-24 , 18/* "resett" */,-24 , 19/* "send" */,-24 , 73/* "sendn" */,-24 , 20/* "serial" */,-24 , 74/* "serialn" */,-24 , 21/* "NewSerial" */,-24 , 75/* "NewSerialn" */,-24 , 22/* "random" */,-24 , 72/* "randomxy" */,-24 , 23/* "add" */,-24 , 24/* "sub" */,-24 , 25/* "mul" */,-24 , 26/* "div" */,-24 , 27/* "mod" */,-24 , 28/* "eq" */,-24 , 29/* "gt" */,-24 , 30/* "lt" */,-24 , 62/* "le" */,-24 , 63/* "ge" */,-24 , 64/* "ne" */,-24 , 31/* "and" */,-24 , 32/* "or" */,-24 , 33/* "xor" */,-24 , 34/* "not" */,-24 , 35/* "setglobal" */,-24 , 36/* "getglobal" */,-24 , 37/* "aset" */,-24 , 38/* "aget" */,-24 , 39/* "record" */,-24 , 40/* "recall" */,-24 , 41/* "resetdp" */,-24 , 42/* "setdp" */,-24 , 43/* "erase" */,-24 , 44/* "when" */,-24 , 45/* "on" */,-24 , 46/* "onfor" */,-24 , 47/* "off" */,-24 , 48/* "thisway" */,-24 , 49/* "thatway" */,-24 , 50/* "rd" */,-24 , 51/* "setpower" */,-24 , 52/* "brake" */,-24 , 53/* "ledon" */,-24 , 54/* "ledoff" */,-24 , 55/* "setsvh" */,-24 , 56/* "svr" */,-24 , 57/* "svl" */,-24 , 58/* "motors" */,-24 , 59/* "while" */,-24 , 60/* "do" */,-24 , 61/* "call" */,-24 , 65/* "setlocal" */,-24 , 66/* "getlocal" */,-24 , 67/* "settemp" */,-24 , 68/* "gettemp" */,-24 , 69/* "getparam" */,-24 , 79/* "sensor" */,-24 , 85/* "Sensorn" */,-24 , 80/* "switch" */,-24 , 86/* "Switchn" */,-24 , 81/* "push" */,-24 , 82/* "pop" */,-24 , 83/* "enter" */,-24 , 84/* "leave" */,-24 , 3/* "byte" */,-24 , 4/* "short" */,-24 , 5/* "block" */,-24 ),
	/* State 22 */ new Array( 98/* "$" */,-25 , 90/* "Address" */,-25 , 2/* "begin" */,-25 , 6/* "eob" */,-25 , 7/* "return" */,-25 , 8/* "output" */,-25 , 9/* "repeat" */,-25 , 10/* "if" */,-25 , 11/* "ifelse" */,-25 , 70/* "goto" */,-25 , 12/* "beep" */,-25 , 13/* "waituntil" */,-25 , 14/* "loop" */,-25 , 71/* "for" */,-25 , 15/* "forever" */,-25 , 16/* "wait" */,-25 , 17/* "timer" */,-25 , 18/* "resett" */,-25 , 19/* "send" */,-25 , 73/* "sendn" */,-25 , 20/* "serial" */,-25 , 74/* "serialn" */,-25 , 21/* "NewSerial" */,-25 , 75/* "NewSerialn" */,-25 , 22/* "random" */,-25 , 72/* "randomxy" */,-25 , 23/* "add" */,-25 , 24/* "sub" */,-25 , 25/* "mul" */,-25 , 26/* "div" */,-25 , 27/* "mod" */,-25 , 28/* "eq" */,-25 , 29/* "gt" */,-25 , 30/* "lt" */,-25 , 62/* "le" */,-25 , 63/* "ge" */,-25 , 64/* "ne" */,-25 , 31/* "and" */,-25 , 32/* "or" */,-25 , 33/* "xor" */,-25 , 34/* "not" */,-25 , 35/* "setglobal" */,-25 , 36/* "getglobal" */,-25 , 37/* "aset" */,-25 , 38/* "aget" */,-25 , 39/* "record" */,-25 , 40/* "recall" */,-25 , 41/* "resetdp" */,-25 , 42/* "setdp" */,-25 , 43/* "erase" */,-25 , 44/* "when" */,-25 , 45/* "on" */,-25 , 46/* "onfor" */,-25 , 47/* "off" */,-25 , 48/* "thisway" */,-25 , 49/* "thatway" */,-25 , 50/* "rd" */,-25 , 51/* "setpower" */,-25 , 52/* "brake" */,-25 , 53/* "ledon" */,-25 , 54/* "ledoff" */,-25 , 55/* "setsvh" */,-25 , 56/* "svr" */,-25 , 57/* "svl" */,-25 , 58/* "motors" */,-25 , 59/* "while" */,-25 , 60/* "do" */,-25 , 61/* "call" */,-25 , 65/* "setlocal" */,-25 , 66/* "getlocal" */,-25 , 67/* "settemp" */,-25 , 68/* "gettemp" */,-25 , 69/* "getparam" */,-25 , 79/* "sensor" */,-25 , 85/* "Sensorn" */,-25 , 80/* "switch" */,-25 , 86/* "Switchn" */,-25 , 81/* "push" */,-25 , 82/* "pop" */,-25 , 83/* "enter" */,-25 , 84/* "leave" */,-25 , 3/* "byte" */,-25 , 4/* "short" */,-25 , 5/* "block" */,-25 ),
	/* State 23 */ new Array( 98/* "$" */,-26 , 90/* "Address" */,-26 , 2/* "begin" */,-26 , 6/* "eob" */,-26 , 7/* "return" */,-26 , 8/* "output" */,-26 , 9/* "repeat" */,-26 , 10/* "if" */,-26 , 11/* "ifelse" */,-26 , 70/* "goto" */,-26 , 12/* "beep" */,-26 , 13/* "waituntil" */,-26 , 14/* "loop" */,-26 , 71/* "for" */,-26 , 15/* "forever" */,-26 , 16/* "wait" */,-26 , 17/* "timer" */,-26 , 18/* "resett" */,-26 , 19/* "send" */,-26 , 73/* "sendn" */,-26 , 20/* "serial" */,-26 , 74/* "serialn" */,-26 , 21/* "NewSerial" */,-26 , 75/* "NewSerialn" */,-26 , 22/* "random" */,-26 , 72/* "randomxy" */,-26 , 23/* "add" */,-26 , 24/* "sub" */,-26 , 25/* "mul" */,-26 , 26/* "div" */,-26 , 27/* "mod" */,-26 , 28/* "eq" */,-26 , 29/* "gt" */,-26 , 30/* "lt" */,-26 , 62/* "le" */,-26 , 63/* "ge" */,-26 , 64/* "ne" */,-26 , 31/* "and" */,-26 , 32/* "or" */,-26 , 33/* "xor" */,-26 , 34/* "not" */,-26 , 35/* "setglobal" */,-26 , 36/* "getglobal" */,-26 , 37/* "aset" */,-26 , 38/* "aget" */,-26 , 39/* "record" */,-26 , 40/* "recall" */,-26 , 41/* "resetdp" */,-26 , 42/* "setdp" */,-26 , 43/* "erase" */,-26 , 44/* "when" */,-26 , 45/* "on" */,-26 , 46/* "onfor" */,-26 , 47/* "off" */,-26 , 48/* "thisway" */,-26 , 49/* "thatway" */,-26 , 50/* "rd" */,-26 , 51/* "setpower" */,-26 , 52/* "brake" */,-26 , 53/* "ledon" */,-26 , 54/* "ledoff" */,-26 , 55/* "setsvh" */,-26 , 56/* "svr" */,-26 , 57/* "svl" */,-26 , 58/* "motors" */,-26 , 59/* "while" */,-26 , 60/* "do" */,-26 , 61/* "call" */,-26 , 65/* "setlocal" */,-26 , 66/* "getlocal" */,-26 , 67/* "settemp" */,-26 , 68/* "gettemp" */,-26 , 69/* "getparam" */,-26 , 79/* "sensor" */,-26 , 85/* "Sensorn" */,-26 , 80/* "switch" */,-26 , 86/* "Switchn" */,-26 , 81/* "push" */,-26 , 82/* "pop" */,-26 , 83/* "enter" */,-26 , 84/* "leave" */,-26 , 3/* "byte" */,-26 , 4/* "short" */,-26 , 5/* "block" */,-26 ),
	/* State 24 */ new Array( 98/* "$" */,-27 , 90/* "Address" */,-27 , 2/* "begin" */,-27 , 6/* "eob" */,-27 , 7/* "return" */,-27 , 8/* "output" */,-27 , 9/* "repeat" */,-27 , 10/* "if" */,-27 , 11/* "ifelse" */,-27 , 70/* "goto" */,-27 , 12/* "beep" */,-27 , 13/* "waituntil" */,-27 , 14/* "loop" */,-27 , 71/* "for" */,-27 , 15/* "forever" */,-27 , 16/* "wait" */,-27 , 17/* "timer" */,-27 , 18/* "resett" */,-27 , 19/* "send" */,-27 , 73/* "sendn" */,-27 , 20/* "serial" */,-27 , 74/* "serialn" */,-27 , 21/* "NewSerial" */,-27 , 75/* "NewSerialn" */,-27 , 22/* "random" */,-27 , 72/* "randomxy" */,-27 , 23/* "add" */,-27 , 24/* "sub" */,-27 , 25/* "mul" */,-27 , 26/* "div" */,-27 , 27/* "mod" */,-27 , 28/* "eq" */,-27 , 29/* "gt" */,-27 , 30/* "lt" */,-27 , 62/* "le" */,-27 , 63/* "ge" */,-27 , 64/* "ne" */,-27 , 31/* "and" */,-27 , 32/* "or" */,-27 , 33/* "xor" */,-27 , 34/* "not" */,-27 , 35/* "setglobal" */,-27 , 36/* "getglobal" */,-27 , 37/* "aset" */,-27 , 38/* "aget" */,-27 , 39/* "record" */,-27 , 40/* "recall" */,-27 , 41/* "resetdp" */,-27 , 42/* "setdp" */,-27 , 43/* "erase" */,-27 , 44/* "when" */,-27 , 45/* "on" */,-27 , 46/* "onfor" */,-27 , 47/* "off" */,-27 , 48/* "thisway" */,-27 , 49/* "thatway" */,-27 , 50/* "rd" */,-27 , 51/* "setpower" */,-27 , 52/* "brake" */,-27 , 53/* "ledon" */,-27 , 54/* "ledoff" */,-27 , 55/* "setsvh" */,-27 , 56/* "svr" */,-27 , 57/* "svl" */,-27 , 58/* "motors" */,-27 , 59/* "while" */,-27 , 60/* "do" */,-27 , 61/* "call" */,-27 , 65/* "setlocal" */,-27 , 66/* "getlocal" */,-27 , 67/* "settemp" */,-27 , 68/* "gettemp" */,-27 , 69/* "getparam" */,-27 , 79/* "sensor" */,-27 , 85/* "Sensorn" */,-27 , 80/* "switch" */,-27 , 86/* "Switchn" */,-27 , 81/* "push" */,-27 , 82/* "pop" */,-27 , 83/* "enter" */,-27 , 84/* "leave" */,-27 , 3/* "byte" */,-27 , 4/* "short" */,-27 , 5/* "block" */,-27 ),
	/* State 25 */ new Array( 98/* "$" */,-28 , 90/* "Address" */,-28 , 2/* "begin" */,-28 , 6/* "eob" */,-28 , 7/* "return" */,-28 , 8/* "output" */,-28 , 9/* "repeat" */,-28 , 10/* "if" */,-28 , 11/* "ifelse" */,-28 , 70/* "goto" */,-28 , 12/* "beep" */,-28 , 13/* "waituntil" */,-28 , 14/* "loop" */,-28 , 71/* "for" */,-28 , 15/* "forever" */,-28 , 16/* "wait" */,-28 , 17/* "timer" */,-28 , 18/* "resett" */,-28 , 19/* "send" */,-28 , 73/* "sendn" */,-28 , 20/* "serial" */,-28 , 74/* "serialn" */,-28 , 21/* "NewSerial" */,-28 , 75/* "NewSerialn" */,-28 , 22/* "random" */,-28 , 72/* "randomxy" */,-28 , 23/* "add" */,-28 , 24/* "sub" */,-28 , 25/* "mul" */,-28 , 26/* "div" */,-28 , 27/* "mod" */,-28 , 28/* "eq" */,-28 , 29/* "gt" */,-28 , 30/* "lt" */,-28 , 62/* "le" */,-28 , 63/* "ge" */,-28 , 64/* "ne" */,-28 , 31/* "and" */,-28 , 32/* "or" */,-28 , 33/* "xor" */,-28 , 34/* "not" */,-28 , 35/* "setglobal" */,-28 , 36/* "getglobal" */,-28 , 37/* "aset" */,-28 , 38/* "aget" */,-28 , 39/* "record" */,-28 , 40/* "recall" */,-28 , 41/* "resetdp" */,-28 , 42/* "setdp" */,-28 , 43/* "erase" */,-28 , 44/* "when" */,-28 , 45/* "on" */,-28 , 46/* "onfor" */,-28 , 47/* "off" */,-28 , 48/* "thisway" */,-28 , 49/* "thatway" */,-28 , 50/* "rd" */,-28 , 51/* "setpower" */,-28 , 52/* "brake" */,-28 , 53/* "ledon" */,-28 , 54/* "ledoff" */,-28 , 55/* "setsvh" */,-28 , 56/* "svr" */,-28 , 57/* "svl" */,-28 , 58/* "motors" */,-28 , 59/* "while" */,-28 , 60/* "do" */,-28 , 61/* "call" */,-28 , 65/* "setlocal" */,-28 , 66/* "getlocal" */,-28 , 67/* "settemp" */,-28 , 68/* "gettemp" */,-28 , 69/* "getparam" */,-28 , 79/* "sensor" */,-28 , 85/* "Sensorn" */,-28 , 80/* "switch" */,-28 , 86/* "Switchn" */,-28 , 81/* "push" */,-28 , 82/* "pop" */,-28 , 83/* "enter" */,-28 , 84/* "leave" */,-28 , 3/* "byte" */,-28 , 4/* "short" */,-28 , 5/* "block" */,-28 ),
	/* State 26 */ new Array( 98/* "$" */,-29 , 90/* "Address" */,-29 , 2/* "begin" */,-29 , 6/* "eob" */,-29 , 7/* "return" */,-29 , 8/* "output" */,-29 , 9/* "repeat" */,-29 , 10/* "if" */,-29 , 11/* "ifelse" */,-29 , 70/* "goto" */,-29 , 12/* "beep" */,-29 , 13/* "waituntil" */,-29 , 14/* "loop" */,-29 , 71/* "for" */,-29 , 15/* "forever" */,-29 , 16/* "wait" */,-29 , 17/* "timer" */,-29 , 18/* "resett" */,-29 , 19/* "send" */,-29 , 73/* "sendn" */,-29 , 20/* "serial" */,-29 , 74/* "serialn" */,-29 , 21/* "NewSerial" */,-29 , 75/* "NewSerialn" */,-29 , 22/* "random" */,-29 , 72/* "randomxy" */,-29 , 23/* "add" */,-29 , 24/* "sub" */,-29 , 25/* "mul" */,-29 , 26/* "div" */,-29 , 27/* "mod" */,-29 , 28/* "eq" */,-29 , 29/* "gt" */,-29 , 30/* "lt" */,-29 , 62/* "le" */,-29 , 63/* "ge" */,-29 , 64/* "ne" */,-29 , 31/* "and" */,-29 , 32/* "or" */,-29 , 33/* "xor" */,-29 , 34/* "not" */,-29 , 35/* "setglobal" */,-29 , 36/* "getglobal" */,-29 , 37/* "aset" */,-29 , 38/* "aget" */,-29 , 39/* "record" */,-29 , 40/* "recall" */,-29 , 41/* "resetdp" */,-29 , 42/* "setdp" */,-29 , 43/* "erase" */,-29 , 44/* "when" */,-29 , 45/* "on" */,-29 , 46/* "onfor" */,-29 , 47/* "off" */,-29 , 48/* "thisway" */,-29 , 49/* "thatway" */,-29 , 50/* "rd" */,-29 , 51/* "setpower" */,-29 , 52/* "brake" */,-29 , 53/* "ledon" */,-29 , 54/* "ledoff" */,-29 , 55/* "setsvh" */,-29 , 56/* "svr" */,-29 , 57/* "svl" */,-29 , 58/* "motors" */,-29 , 59/* "while" */,-29 , 60/* "do" */,-29 , 61/* "call" */,-29 , 65/* "setlocal" */,-29 , 66/* "getlocal" */,-29 , 67/* "settemp" */,-29 , 68/* "gettemp" */,-29 , 69/* "getparam" */,-29 , 79/* "sensor" */,-29 , 85/* "Sensorn" */,-29 , 80/* "switch" */,-29 , 86/* "Switchn" */,-29 , 81/* "push" */,-29 , 82/* "pop" */,-29 , 83/* "enter" */,-29 , 84/* "leave" */,-29 , 3/* "byte" */,-29 , 4/* "short" */,-29 , 5/* "block" */,-29 ),
	/* State 27 */ new Array( 98/* "$" */,-30 , 90/* "Address" */,-30 , 2/* "begin" */,-30 , 6/* "eob" */,-30 , 7/* "return" */,-30 , 8/* "output" */,-30 , 9/* "repeat" */,-30 , 10/* "if" */,-30 , 11/* "ifelse" */,-30 , 70/* "goto" */,-30 , 12/* "beep" */,-30 , 13/* "waituntil" */,-30 , 14/* "loop" */,-30 , 71/* "for" */,-30 , 15/* "forever" */,-30 , 16/* "wait" */,-30 , 17/* "timer" */,-30 , 18/* "resett" */,-30 , 19/* "send" */,-30 , 73/* "sendn" */,-30 , 20/* "serial" */,-30 , 74/* "serialn" */,-30 , 21/* "NewSerial" */,-30 , 75/* "NewSerialn" */,-30 , 22/* "random" */,-30 , 72/* "randomxy" */,-30 , 23/* "add" */,-30 , 24/* "sub" */,-30 , 25/* "mul" */,-30 , 26/* "div" */,-30 , 27/* "mod" */,-30 , 28/* "eq" */,-30 , 29/* "gt" */,-30 , 30/* "lt" */,-30 , 62/* "le" */,-30 , 63/* "ge" */,-30 , 64/* "ne" */,-30 , 31/* "and" */,-30 , 32/* "or" */,-30 , 33/* "xor" */,-30 , 34/* "not" */,-30 , 35/* "setglobal" */,-30 , 36/* "getglobal" */,-30 , 37/* "aset" */,-30 , 38/* "aget" */,-30 , 39/* "record" */,-30 , 40/* "recall" */,-30 , 41/* "resetdp" */,-30 , 42/* "setdp" */,-30 , 43/* "erase" */,-30 , 44/* "when" */,-30 , 45/* "on" */,-30 , 46/* "onfor" */,-30 , 47/* "off" */,-30 , 48/* "thisway" */,-30 , 49/* "thatway" */,-30 , 50/* "rd" */,-30 , 51/* "setpower" */,-30 , 52/* "brake" */,-30 , 53/* "ledon" */,-30 , 54/* "ledoff" */,-30 , 55/* "setsvh" */,-30 , 56/* "svr" */,-30 , 57/* "svl" */,-30 , 58/* "motors" */,-30 , 59/* "while" */,-30 , 60/* "do" */,-30 , 61/* "call" */,-30 , 65/* "setlocal" */,-30 , 66/* "getlocal" */,-30 , 67/* "settemp" */,-30 , 68/* "gettemp" */,-30 , 69/* "getparam" */,-30 , 79/* "sensor" */,-30 , 85/* "Sensorn" */,-30 , 80/* "switch" */,-30 , 86/* "Switchn" */,-30 , 81/* "push" */,-30 , 82/* "pop" */,-30 , 83/* "enter" */,-30 , 84/* "leave" */,-30 , 3/* "byte" */,-30 , 4/* "short" */,-30 , 5/* "block" */,-30 ),
	/* State 28 */ new Array( 98/* "$" */,-31 , 90/* "Address" */,-31 , 2/* "begin" */,-31 , 6/* "eob" */,-31 , 7/* "return" */,-31 , 8/* "output" */,-31 , 9/* "repeat" */,-31 , 10/* "if" */,-31 , 11/* "ifelse" */,-31 , 70/* "goto" */,-31 , 12/* "beep" */,-31 , 13/* "waituntil" */,-31 , 14/* "loop" */,-31 , 71/* "for" */,-31 , 15/* "forever" */,-31 , 16/* "wait" */,-31 , 17/* "timer" */,-31 , 18/* "resett" */,-31 , 19/* "send" */,-31 , 73/* "sendn" */,-31 , 20/* "serial" */,-31 , 74/* "serialn" */,-31 , 21/* "NewSerial" */,-31 , 75/* "NewSerialn" */,-31 , 22/* "random" */,-31 , 72/* "randomxy" */,-31 , 23/* "add" */,-31 , 24/* "sub" */,-31 , 25/* "mul" */,-31 , 26/* "div" */,-31 , 27/* "mod" */,-31 , 28/* "eq" */,-31 , 29/* "gt" */,-31 , 30/* "lt" */,-31 , 62/* "le" */,-31 , 63/* "ge" */,-31 , 64/* "ne" */,-31 , 31/* "and" */,-31 , 32/* "or" */,-31 , 33/* "xor" */,-31 , 34/* "not" */,-31 , 35/* "setglobal" */,-31 , 36/* "getglobal" */,-31 , 37/* "aset" */,-31 , 38/* "aget" */,-31 , 39/* "record" */,-31 , 40/* "recall" */,-31 , 41/* "resetdp" */,-31 , 42/* "setdp" */,-31 , 43/* "erase" */,-31 , 44/* "when" */,-31 , 45/* "on" */,-31 , 46/* "onfor" */,-31 , 47/* "off" */,-31 , 48/* "thisway" */,-31 , 49/* "thatway" */,-31 , 50/* "rd" */,-31 , 51/* "setpower" */,-31 , 52/* "brake" */,-31 , 53/* "ledon" */,-31 , 54/* "ledoff" */,-31 , 55/* "setsvh" */,-31 , 56/* "svr" */,-31 , 57/* "svl" */,-31 , 58/* "motors" */,-31 , 59/* "while" */,-31 , 60/* "do" */,-31 , 61/* "call" */,-31 , 65/* "setlocal" */,-31 , 66/* "getlocal" */,-31 , 67/* "settemp" */,-31 , 68/* "gettemp" */,-31 , 69/* "getparam" */,-31 , 79/* "sensor" */,-31 , 85/* "Sensorn" */,-31 , 80/* "switch" */,-31 , 86/* "Switchn" */,-31 , 81/* "push" */,-31 , 82/* "pop" */,-31 , 83/* "enter" */,-31 , 84/* "leave" */,-31 , 3/* "byte" */,-31 , 4/* "short" */,-31 , 5/* "block" */,-31 ),
	/* State 29 */ new Array( 98/* "$" */,-32 , 90/* "Address" */,-32 , 2/* "begin" */,-32 , 6/* "eob" */,-32 , 7/* "return" */,-32 , 8/* "output" */,-32 , 9/* "repeat" */,-32 , 10/* "if" */,-32 , 11/* "ifelse" */,-32 , 70/* "goto" */,-32 , 12/* "beep" */,-32 , 13/* "waituntil" */,-32 , 14/* "loop" */,-32 , 71/* "for" */,-32 , 15/* "forever" */,-32 , 16/* "wait" */,-32 , 17/* "timer" */,-32 , 18/* "resett" */,-32 , 19/* "send" */,-32 , 73/* "sendn" */,-32 , 20/* "serial" */,-32 , 74/* "serialn" */,-32 , 21/* "NewSerial" */,-32 , 75/* "NewSerialn" */,-32 , 22/* "random" */,-32 , 72/* "randomxy" */,-32 , 23/* "add" */,-32 , 24/* "sub" */,-32 , 25/* "mul" */,-32 , 26/* "div" */,-32 , 27/* "mod" */,-32 , 28/* "eq" */,-32 , 29/* "gt" */,-32 , 30/* "lt" */,-32 , 62/* "le" */,-32 , 63/* "ge" */,-32 , 64/* "ne" */,-32 , 31/* "and" */,-32 , 32/* "or" */,-32 , 33/* "xor" */,-32 , 34/* "not" */,-32 , 35/* "setglobal" */,-32 , 36/* "getglobal" */,-32 , 37/* "aset" */,-32 , 38/* "aget" */,-32 , 39/* "record" */,-32 , 40/* "recall" */,-32 , 41/* "resetdp" */,-32 , 42/* "setdp" */,-32 , 43/* "erase" */,-32 , 44/* "when" */,-32 , 45/* "on" */,-32 , 46/* "onfor" */,-32 , 47/* "off" */,-32 , 48/* "thisway" */,-32 , 49/* "thatway" */,-32 , 50/* "rd" */,-32 , 51/* "setpower" */,-32 , 52/* "brake" */,-32 , 53/* "ledon" */,-32 , 54/* "ledoff" */,-32 , 55/* "setsvh" */,-32 , 56/* "svr" */,-32 , 57/* "svl" */,-32 , 58/* "motors" */,-32 , 59/* "while" */,-32 , 60/* "do" */,-32 , 61/* "call" */,-32 , 65/* "setlocal" */,-32 , 66/* "getlocal" */,-32 , 67/* "settemp" */,-32 , 68/* "gettemp" */,-32 , 69/* "getparam" */,-32 , 79/* "sensor" */,-32 , 85/* "Sensorn" */,-32 , 80/* "switch" */,-32 , 86/* "Switchn" */,-32 , 81/* "push" */,-32 , 82/* "pop" */,-32 , 83/* "enter" */,-32 , 84/* "leave" */,-32 , 3/* "byte" */,-32 , 4/* "short" */,-32 , 5/* "block" */,-32 ),
	/* State 30 */ new Array( 98/* "$" */,-33 , 90/* "Address" */,-33 , 2/* "begin" */,-33 , 6/* "eob" */,-33 , 7/* "return" */,-33 , 8/* "output" */,-33 , 9/* "repeat" */,-33 , 10/* "if" */,-33 , 11/* "ifelse" */,-33 , 70/* "goto" */,-33 , 12/* "beep" */,-33 , 13/* "waituntil" */,-33 , 14/* "loop" */,-33 , 71/* "for" */,-33 , 15/* "forever" */,-33 , 16/* "wait" */,-33 , 17/* "timer" */,-33 , 18/* "resett" */,-33 , 19/* "send" */,-33 , 73/* "sendn" */,-33 , 20/* "serial" */,-33 , 74/* "serialn" */,-33 , 21/* "NewSerial" */,-33 , 75/* "NewSerialn" */,-33 , 22/* "random" */,-33 , 72/* "randomxy" */,-33 , 23/* "add" */,-33 , 24/* "sub" */,-33 , 25/* "mul" */,-33 , 26/* "div" */,-33 , 27/* "mod" */,-33 , 28/* "eq" */,-33 , 29/* "gt" */,-33 , 30/* "lt" */,-33 , 62/* "le" */,-33 , 63/* "ge" */,-33 , 64/* "ne" */,-33 , 31/* "and" */,-33 , 32/* "or" */,-33 , 33/* "xor" */,-33 , 34/* "not" */,-33 , 35/* "setglobal" */,-33 , 36/* "getglobal" */,-33 , 37/* "aset" */,-33 , 38/* "aget" */,-33 , 39/* "record" */,-33 , 40/* "recall" */,-33 , 41/* "resetdp" */,-33 , 42/* "setdp" */,-33 , 43/* "erase" */,-33 , 44/* "when" */,-33 , 45/* "on" */,-33 , 46/* "onfor" */,-33 , 47/* "off" */,-33 , 48/* "thisway" */,-33 , 49/* "thatway" */,-33 , 50/* "rd" */,-33 , 51/* "setpower" */,-33 , 52/* "brake" */,-33 , 53/* "ledon" */,-33 , 54/* "ledoff" */,-33 , 55/* "setsvh" */,-33 , 56/* "svr" */,-33 , 57/* "svl" */,-33 , 58/* "motors" */,-33 , 59/* "while" */,-33 , 60/* "do" */,-33 , 61/* "call" */,-33 , 65/* "setlocal" */,-33 , 66/* "getlocal" */,-33 , 67/* "settemp" */,-33 , 68/* "gettemp" */,-33 , 69/* "getparam" */,-33 , 79/* "sensor" */,-33 , 85/* "Sensorn" */,-33 , 80/* "switch" */,-33 , 86/* "Switchn" */,-33 , 81/* "push" */,-33 , 82/* "pop" */,-33 , 83/* "enter" */,-33 , 84/* "leave" */,-33 , 3/* "byte" */,-33 , 4/* "short" */,-33 , 5/* "block" */,-33 ),
	/* State 31 */ new Array( 98/* "$" */,-34 , 90/* "Address" */,-34 , 2/* "begin" */,-34 , 6/* "eob" */,-34 , 7/* "return" */,-34 , 8/* "output" */,-34 , 9/* "repeat" */,-34 , 10/* "if" */,-34 , 11/* "ifelse" */,-34 , 70/* "goto" */,-34 , 12/* "beep" */,-34 , 13/* "waituntil" */,-34 , 14/* "loop" */,-34 , 71/* "for" */,-34 , 15/* "forever" */,-34 , 16/* "wait" */,-34 , 17/* "timer" */,-34 , 18/* "resett" */,-34 , 19/* "send" */,-34 , 73/* "sendn" */,-34 , 20/* "serial" */,-34 , 74/* "serialn" */,-34 , 21/* "NewSerial" */,-34 , 75/* "NewSerialn" */,-34 , 22/* "random" */,-34 , 72/* "randomxy" */,-34 , 23/* "add" */,-34 , 24/* "sub" */,-34 , 25/* "mul" */,-34 , 26/* "div" */,-34 , 27/* "mod" */,-34 , 28/* "eq" */,-34 , 29/* "gt" */,-34 , 30/* "lt" */,-34 , 62/* "le" */,-34 , 63/* "ge" */,-34 , 64/* "ne" */,-34 , 31/* "and" */,-34 , 32/* "or" */,-34 , 33/* "xor" */,-34 , 34/* "not" */,-34 , 35/* "setglobal" */,-34 , 36/* "getglobal" */,-34 , 37/* "aset" */,-34 , 38/* "aget" */,-34 , 39/* "record" */,-34 , 40/* "recall" */,-34 , 41/* "resetdp" */,-34 , 42/* "setdp" */,-34 , 43/* "erase" */,-34 , 44/* "when" */,-34 , 45/* "on" */,-34 , 46/* "onfor" */,-34 , 47/* "off" */,-34 , 48/* "thisway" */,-34 , 49/* "thatway" */,-34 , 50/* "rd" */,-34 , 51/* "setpower" */,-34 , 52/* "brake" */,-34 , 53/* "ledon" */,-34 , 54/* "ledoff" */,-34 , 55/* "setsvh" */,-34 , 56/* "svr" */,-34 , 57/* "svl" */,-34 , 58/* "motors" */,-34 , 59/* "while" */,-34 , 60/* "do" */,-34 , 61/* "call" */,-34 , 65/* "setlocal" */,-34 , 66/* "getlocal" */,-34 , 67/* "settemp" */,-34 , 68/* "gettemp" */,-34 , 69/* "getparam" */,-34 , 79/* "sensor" */,-34 , 85/* "Sensorn" */,-34 , 80/* "switch" */,-34 , 86/* "Switchn" */,-34 , 81/* "push" */,-34 , 82/* "pop" */,-34 , 83/* "enter" */,-34 , 84/* "leave" */,-34 , 3/* "byte" */,-34 , 4/* "short" */,-34 , 5/* "block" */,-34 ),
	/* State 32 */ new Array( 98/* "$" */,-35 , 90/* "Address" */,-35 , 2/* "begin" */,-35 , 6/* "eob" */,-35 , 7/* "return" */,-35 , 8/* "output" */,-35 , 9/* "repeat" */,-35 , 10/* "if" */,-35 , 11/* "ifelse" */,-35 , 70/* "goto" */,-35 , 12/* "beep" */,-35 , 13/* "waituntil" */,-35 , 14/* "loop" */,-35 , 71/* "for" */,-35 , 15/* "forever" */,-35 , 16/* "wait" */,-35 , 17/* "timer" */,-35 , 18/* "resett" */,-35 , 19/* "send" */,-35 , 73/* "sendn" */,-35 , 20/* "serial" */,-35 , 74/* "serialn" */,-35 , 21/* "NewSerial" */,-35 , 75/* "NewSerialn" */,-35 , 22/* "random" */,-35 , 72/* "randomxy" */,-35 , 23/* "add" */,-35 , 24/* "sub" */,-35 , 25/* "mul" */,-35 , 26/* "div" */,-35 , 27/* "mod" */,-35 , 28/* "eq" */,-35 , 29/* "gt" */,-35 , 30/* "lt" */,-35 , 62/* "le" */,-35 , 63/* "ge" */,-35 , 64/* "ne" */,-35 , 31/* "and" */,-35 , 32/* "or" */,-35 , 33/* "xor" */,-35 , 34/* "not" */,-35 , 35/* "setglobal" */,-35 , 36/* "getglobal" */,-35 , 37/* "aset" */,-35 , 38/* "aget" */,-35 , 39/* "record" */,-35 , 40/* "recall" */,-35 , 41/* "resetdp" */,-35 , 42/* "setdp" */,-35 , 43/* "erase" */,-35 , 44/* "when" */,-35 , 45/* "on" */,-35 , 46/* "onfor" */,-35 , 47/* "off" */,-35 , 48/* "thisway" */,-35 , 49/* "thatway" */,-35 , 50/* "rd" */,-35 , 51/* "setpower" */,-35 , 52/* "brake" */,-35 , 53/* "ledon" */,-35 , 54/* "ledoff" */,-35 , 55/* "setsvh" */,-35 , 56/* "svr" */,-35 , 57/* "svl" */,-35 , 58/* "motors" */,-35 , 59/* "while" */,-35 , 60/* "do" */,-35 , 61/* "call" */,-35 , 65/* "setlocal" */,-35 , 66/* "getlocal" */,-35 , 67/* "settemp" */,-35 , 68/* "gettemp" */,-35 , 69/* "getparam" */,-35 , 79/* "sensor" */,-35 , 85/* "Sensorn" */,-35 , 80/* "switch" */,-35 , 86/* "Switchn" */,-35 , 81/* "push" */,-35 , 82/* "pop" */,-35 , 83/* "enter" */,-35 , 84/* "leave" */,-35 , 3/* "byte" */,-35 , 4/* "short" */,-35 , 5/* "block" */,-35 ),
	/* State 33 */ new Array( 98/* "$" */,-36 , 90/* "Address" */,-36 , 2/* "begin" */,-36 , 6/* "eob" */,-36 , 7/* "return" */,-36 , 8/* "output" */,-36 , 9/* "repeat" */,-36 , 10/* "if" */,-36 , 11/* "ifelse" */,-36 , 70/* "goto" */,-36 , 12/* "beep" */,-36 , 13/* "waituntil" */,-36 , 14/* "loop" */,-36 , 71/* "for" */,-36 , 15/* "forever" */,-36 , 16/* "wait" */,-36 , 17/* "timer" */,-36 , 18/* "resett" */,-36 , 19/* "send" */,-36 , 73/* "sendn" */,-36 , 20/* "serial" */,-36 , 74/* "serialn" */,-36 , 21/* "NewSerial" */,-36 , 75/* "NewSerialn" */,-36 , 22/* "random" */,-36 , 72/* "randomxy" */,-36 , 23/* "add" */,-36 , 24/* "sub" */,-36 , 25/* "mul" */,-36 , 26/* "div" */,-36 , 27/* "mod" */,-36 , 28/* "eq" */,-36 , 29/* "gt" */,-36 , 30/* "lt" */,-36 , 62/* "le" */,-36 , 63/* "ge" */,-36 , 64/* "ne" */,-36 , 31/* "and" */,-36 , 32/* "or" */,-36 , 33/* "xor" */,-36 , 34/* "not" */,-36 , 35/* "setglobal" */,-36 , 36/* "getglobal" */,-36 , 37/* "aset" */,-36 , 38/* "aget" */,-36 , 39/* "record" */,-36 , 40/* "recall" */,-36 , 41/* "resetdp" */,-36 , 42/* "setdp" */,-36 , 43/* "erase" */,-36 , 44/* "when" */,-36 , 45/* "on" */,-36 , 46/* "onfor" */,-36 , 47/* "off" */,-36 , 48/* "thisway" */,-36 , 49/* "thatway" */,-36 , 50/* "rd" */,-36 , 51/* "setpower" */,-36 , 52/* "brake" */,-36 , 53/* "ledon" */,-36 , 54/* "ledoff" */,-36 , 55/* "setsvh" */,-36 , 56/* "svr" */,-36 , 57/* "svl" */,-36 , 58/* "motors" */,-36 , 59/* "while" */,-36 , 60/* "do" */,-36 , 61/* "call" */,-36 , 65/* "setlocal" */,-36 , 66/* "getlocal" */,-36 , 67/* "settemp" */,-36 , 68/* "gettemp" */,-36 , 69/* "getparam" */,-36 , 79/* "sensor" */,-36 , 85/* "Sensorn" */,-36 , 80/* "switch" */,-36 , 86/* "Switchn" */,-36 , 81/* "push" */,-36 , 82/* "pop" */,-36 , 83/* "enter" */,-36 , 84/* "leave" */,-36 , 3/* "byte" */,-36 , 4/* "short" */,-36 , 5/* "block" */,-36 ),
	/* State 34 */ new Array( 98/* "$" */,-37 , 90/* "Address" */,-37 , 2/* "begin" */,-37 , 6/* "eob" */,-37 , 7/* "return" */,-37 , 8/* "output" */,-37 , 9/* "repeat" */,-37 , 10/* "if" */,-37 , 11/* "ifelse" */,-37 , 70/* "goto" */,-37 , 12/* "beep" */,-37 , 13/* "waituntil" */,-37 , 14/* "loop" */,-37 , 71/* "for" */,-37 , 15/* "forever" */,-37 , 16/* "wait" */,-37 , 17/* "timer" */,-37 , 18/* "resett" */,-37 , 19/* "send" */,-37 , 73/* "sendn" */,-37 , 20/* "serial" */,-37 , 74/* "serialn" */,-37 , 21/* "NewSerial" */,-37 , 75/* "NewSerialn" */,-37 , 22/* "random" */,-37 , 72/* "randomxy" */,-37 , 23/* "add" */,-37 , 24/* "sub" */,-37 , 25/* "mul" */,-37 , 26/* "div" */,-37 , 27/* "mod" */,-37 , 28/* "eq" */,-37 , 29/* "gt" */,-37 , 30/* "lt" */,-37 , 62/* "le" */,-37 , 63/* "ge" */,-37 , 64/* "ne" */,-37 , 31/* "and" */,-37 , 32/* "or" */,-37 , 33/* "xor" */,-37 , 34/* "not" */,-37 , 35/* "setglobal" */,-37 , 36/* "getglobal" */,-37 , 37/* "aset" */,-37 , 38/* "aget" */,-37 , 39/* "record" */,-37 , 40/* "recall" */,-37 , 41/* "resetdp" */,-37 , 42/* "setdp" */,-37 , 43/* "erase" */,-37 , 44/* "when" */,-37 , 45/* "on" */,-37 , 46/* "onfor" */,-37 , 47/* "off" */,-37 , 48/* "thisway" */,-37 , 49/* "thatway" */,-37 , 50/* "rd" */,-37 , 51/* "setpower" */,-37 , 52/* "brake" */,-37 , 53/* "ledon" */,-37 , 54/* "ledoff" */,-37 , 55/* "setsvh" */,-37 , 56/* "svr" */,-37 , 57/* "svl" */,-37 , 58/* "motors" */,-37 , 59/* "while" */,-37 , 60/* "do" */,-37 , 61/* "call" */,-37 , 65/* "setlocal" */,-37 , 66/* "getlocal" */,-37 , 67/* "settemp" */,-37 , 68/* "gettemp" */,-37 , 69/* "getparam" */,-37 , 79/* "sensor" */,-37 , 85/* "Sensorn" */,-37 , 80/* "switch" */,-37 , 86/* "Switchn" */,-37 , 81/* "push" */,-37 , 82/* "pop" */,-37 , 83/* "enter" */,-37 , 84/* "leave" */,-37 , 3/* "byte" */,-37 , 4/* "short" */,-37 , 5/* "block" */,-37 ),
	/* State 35 */ new Array( 98/* "$" */,-38 , 90/* "Address" */,-38 , 2/* "begin" */,-38 , 6/* "eob" */,-38 , 7/* "return" */,-38 , 8/* "output" */,-38 , 9/* "repeat" */,-38 , 10/* "if" */,-38 , 11/* "ifelse" */,-38 , 70/* "goto" */,-38 , 12/* "beep" */,-38 , 13/* "waituntil" */,-38 , 14/* "loop" */,-38 , 71/* "for" */,-38 , 15/* "forever" */,-38 , 16/* "wait" */,-38 , 17/* "timer" */,-38 , 18/* "resett" */,-38 , 19/* "send" */,-38 , 73/* "sendn" */,-38 , 20/* "serial" */,-38 , 74/* "serialn" */,-38 , 21/* "NewSerial" */,-38 , 75/* "NewSerialn" */,-38 , 22/* "random" */,-38 , 72/* "randomxy" */,-38 , 23/* "add" */,-38 , 24/* "sub" */,-38 , 25/* "mul" */,-38 , 26/* "div" */,-38 , 27/* "mod" */,-38 , 28/* "eq" */,-38 , 29/* "gt" */,-38 , 30/* "lt" */,-38 , 62/* "le" */,-38 , 63/* "ge" */,-38 , 64/* "ne" */,-38 , 31/* "and" */,-38 , 32/* "or" */,-38 , 33/* "xor" */,-38 , 34/* "not" */,-38 , 35/* "setglobal" */,-38 , 36/* "getglobal" */,-38 , 37/* "aset" */,-38 , 38/* "aget" */,-38 , 39/* "record" */,-38 , 40/* "recall" */,-38 , 41/* "resetdp" */,-38 , 42/* "setdp" */,-38 , 43/* "erase" */,-38 , 44/* "when" */,-38 , 45/* "on" */,-38 , 46/* "onfor" */,-38 , 47/* "off" */,-38 , 48/* "thisway" */,-38 , 49/* "thatway" */,-38 , 50/* "rd" */,-38 , 51/* "setpower" */,-38 , 52/* "brake" */,-38 , 53/* "ledon" */,-38 , 54/* "ledoff" */,-38 , 55/* "setsvh" */,-38 , 56/* "svr" */,-38 , 57/* "svl" */,-38 , 58/* "motors" */,-38 , 59/* "while" */,-38 , 60/* "do" */,-38 , 61/* "call" */,-38 , 65/* "setlocal" */,-38 , 66/* "getlocal" */,-38 , 67/* "settemp" */,-38 , 68/* "gettemp" */,-38 , 69/* "getparam" */,-38 , 79/* "sensor" */,-38 , 85/* "Sensorn" */,-38 , 80/* "switch" */,-38 , 86/* "Switchn" */,-38 , 81/* "push" */,-38 , 82/* "pop" */,-38 , 83/* "enter" */,-38 , 84/* "leave" */,-38 , 3/* "byte" */,-38 , 4/* "short" */,-38 , 5/* "block" */,-38 ),
	/* State 36 */ new Array( 98/* "$" */,-39 , 90/* "Address" */,-39 , 2/* "begin" */,-39 , 6/* "eob" */,-39 , 7/* "return" */,-39 , 8/* "output" */,-39 , 9/* "repeat" */,-39 , 10/* "if" */,-39 , 11/* "ifelse" */,-39 , 70/* "goto" */,-39 , 12/* "beep" */,-39 , 13/* "waituntil" */,-39 , 14/* "loop" */,-39 , 71/* "for" */,-39 , 15/* "forever" */,-39 , 16/* "wait" */,-39 , 17/* "timer" */,-39 , 18/* "resett" */,-39 , 19/* "send" */,-39 , 73/* "sendn" */,-39 , 20/* "serial" */,-39 , 74/* "serialn" */,-39 , 21/* "NewSerial" */,-39 , 75/* "NewSerialn" */,-39 , 22/* "random" */,-39 , 72/* "randomxy" */,-39 , 23/* "add" */,-39 , 24/* "sub" */,-39 , 25/* "mul" */,-39 , 26/* "div" */,-39 , 27/* "mod" */,-39 , 28/* "eq" */,-39 , 29/* "gt" */,-39 , 30/* "lt" */,-39 , 62/* "le" */,-39 , 63/* "ge" */,-39 , 64/* "ne" */,-39 , 31/* "and" */,-39 , 32/* "or" */,-39 , 33/* "xor" */,-39 , 34/* "not" */,-39 , 35/* "setglobal" */,-39 , 36/* "getglobal" */,-39 , 37/* "aset" */,-39 , 38/* "aget" */,-39 , 39/* "record" */,-39 , 40/* "recall" */,-39 , 41/* "resetdp" */,-39 , 42/* "setdp" */,-39 , 43/* "erase" */,-39 , 44/* "when" */,-39 , 45/* "on" */,-39 , 46/* "onfor" */,-39 , 47/* "off" */,-39 , 48/* "thisway" */,-39 , 49/* "thatway" */,-39 , 50/* "rd" */,-39 , 51/* "setpower" */,-39 , 52/* "brake" */,-39 , 53/* "ledon" */,-39 , 54/* "ledoff" */,-39 , 55/* "setsvh" */,-39 , 56/* "svr" */,-39 , 57/* "svl" */,-39 , 58/* "motors" */,-39 , 59/* "while" */,-39 , 60/* "do" */,-39 , 61/* "call" */,-39 , 65/* "setlocal" */,-39 , 66/* "getlocal" */,-39 , 67/* "settemp" */,-39 , 68/* "gettemp" */,-39 , 69/* "getparam" */,-39 , 79/* "sensor" */,-39 , 85/* "Sensorn" */,-39 , 80/* "switch" */,-39 , 86/* "Switchn" */,-39 , 81/* "push" */,-39 , 82/* "pop" */,-39 , 83/* "enter" */,-39 , 84/* "leave" */,-39 , 3/* "byte" */,-39 , 4/* "short" */,-39 , 5/* "block" */,-39 ),
	/* State 37 */ new Array( 98/* "$" */,-40 , 90/* "Address" */,-40 , 2/* "begin" */,-40 , 6/* "eob" */,-40 , 7/* "return" */,-40 , 8/* "output" */,-40 , 9/* "repeat" */,-40 , 10/* "if" */,-40 , 11/* "ifelse" */,-40 , 70/* "goto" */,-40 , 12/* "beep" */,-40 , 13/* "waituntil" */,-40 , 14/* "loop" */,-40 , 71/* "for" */,-40 , 15/* "forever" */,-40 , 16/* "wait" */,-40 , 17/* "timer" */,-40 , 18/* "resett" */,-40 , 19/* "send" */,-40 , 73/* "sendn" */,-40 , 20/* "serial" */,-40 , 74/* "serialn" */,-40 , 21/* "NewSerial" */,-40 , 75/* "NewSerialn" */,-40 , 22/* "random" */,-40 , 72/* "randomxy" */,-40 , 23/* "add" */,-40 , 24/* "sub" */,-40 , 25/* "mul" */,-40 , 26/* "div" */,-40 , 27/* "mod" */,-40 , 28/* "eq" */,-40 , 29/* "gt" */,-40 , 30/* "lt" */,-40 , 62/* "le" */,-40 , 63/* "ge" */,-40 , 64/* "ne" */,-40 , 31/* "and" */,-40 , 32/* "or" */,-40 , 33/* "xor" */,-40 , 34/* "not" */,-40 , 35/* "setglobal" */,-40 , 36/* "getglobal" */,-40 , 37/* "aset" */,-40 , 38/* "aget" */,-40 , 39/* "record" */,-40 , 40/* "recall" */,-40 , 41/* "resetdp" */,-40 , 42/* "setdp" */,-40 , 43/* "erase" */,-40 , 44/* "when" */,-40 , 45/* "on" */,-40 , 46/* "onfor" */,-40 , 47/* "off" */,-40 , 48/* "thisway" */,-40 , 49/* "thatway" */,-40 , 50/* "rd" */,-40 , 51/* "setpower" */,-40 , 52/* "brake" */,-40 , 53/* "ledon" */,-40 , 54/* "ledoff" */,-40 , 55/* "setsvh" */,-40 , 56/* "svr" */,-40 , 57/* "svl" */,-40 , 58/* "motors" */,-40 , 59/* "while" */,-40 , 60/* "do" */,-40 , 61/* "call" */,-40 , 65/* "setlocal" */,-40 , 66/* "getlocal" */,-40 , 67/* "settemp" */,-40 , 68/* "gettemp" */,-40 , 69/* "getparam" */,-40 , 79/* "sensor" */,-40 , 85/* "Sensorn" */,-40 , 80/* "switch" */,-40 , 86/* "Switchn" */,-40 , 81/* "push" */,-40 , 82/* "pop" */,-40 , 83/* "enter" */,-40 , 84/* "leave" */,-40 , 3/* "byte" */,-40 , 4/* "short" */,-40 , 5/* "block" */,-40 ),
	/* State 38 */ new Array( 98/* "$" */,-41 , 90/* "Address" */,-41 , 2/* "begin" */,-41 , 6/* "eob" */,-41 , 7/* "return" */,-41 , 8/* "output" */,-41 , 9/* "repeat" */,-41 , 10/* "if" */,-41 , 11/* "ifelse" */,-41 , 70/* "goto" */,-41 , 12/* "beep" */,-41 , 13/* "waituntil" */,-41 , 14/* "loop" */,-41 , 71/* "for" */,-41 , 15/* "forever" */,-41 , 16/* "wait" */,-41 , 17/* "timer" */,-41 , 18/* "resett" */,-41 , 19/* "send" */,-41 , 73/* "sendn" */,-41 , 20/* "serial" */,-41 , 74/* "serialn" */,-41 , 21/* "NewSerial" */,-41 , 75/* "NewSerialn" */,-41 , 22/* "random" */,-41 , 72/* "randomxy" */,-41 , 23/* "add" */,-41 , 24/* "sub" */,-41 , 25/* "mul" */,-41 , 26/* "div" */,-41 , 27/* "mod" */,-41 , 28/* "eq" */,-41 , 29/* "gt" */,-41 , 30/* "lt" */,-41 , 62/* "le" */,-41 , 63/* "ge" */,-41 , 64/* "ne" */,-41 , 31/* "and" */,-41 , 32/* "or" */,-41 , 33/* "xor" */,-41 , 34/* "not" */,-41 , 35/* "setglobal" */,-41 , 36/* "getglobal" */,-41 , 37/* "aset" */,-41 , 38/* "aget" */,-41 , 39/* "record" */,-41 , 40/* "recall" */,-41 , 41/* "resetdp" */,-41 , 42/* "setdp" */,-41 , 43/* "erase" */,-41 , 44/* "when" */,-41 , 45/* "on" */,-41 , 46/* "onfor" */,-41 , 47/* "off" */,-41 , 48/* "thisway" */,-41 , 49/* "thatway" */,-41 , 50/* "rd" */,-41 , 51/* "setpower" */,-41 , 52/* "brake" */,-41 , 53/* "ledon" */,-41 , 54/* "ledoff" */,-41 , 55/* "setsvh" */,-41 , 56/* "svr" */,-41 , 57/* "svl" */,-41 , 58/* "motors" */,-41 , 59/* "while" */,-41 , 60/* "do" */,-41 , 61/* "call" */,-41 , 65/* "setlocal" */,-41 , 66/* "getlocal" */,-41 , 67/* "settemp" */,-41 , 68/* "gettemp" */,-41 , 69/* "getparam" */,-41 , 79/* "sensor" */,-41 , 85/* "Sensorn" */,-41 , 80/* "switch" */,-41 , 86/* "Switchn" */,-41 , 81/* "push" */,-41 , 82/* "pop" */,-41 , 83/* "enter" */,-41 , 84/* "leave" */,-41 , 3/* "byte" */,-41 , 4/* "short" */,-41 , 5/* "block" */,-41 ),
	/* State 39 */ new Array( 98/* "$" */,-42 , 90/* "Address" */,-42 , 2/* "begin" */,-42 , 6/* "eob" */,-42 , 7/* "return" */,-42 , 8/* "output" */,-42 , 9/* "repeat" */,-42 , 10/* "if" */,-42 , 11/* "ifelse" */,-42 , 70/* "goto" */,-42 , 12/* "beep" */,-42 , 13/* "waituntil" */,-42 , 14/* "loop" */,-42 , 71/* "for" */,-42 , 15/* "forever" */,-42 , 16/* "wait" */,-42 , 17/* "timer" */,-42 , 18/* "resett" */,-42 , 19/* "send" */,-42 , 73/* "sendn" */,-42 , 20/* "serial" */,-42 , 74/* "serialn" */,-42 , 21/* "NewSerial" */,-42 , 75/* "NewSerialn" */,-42 , 22/* "random" */,-42 , 72/* "randomxy" */,-42 , 23/* "add" */,-42 , 24/* "sub" */,-42 , 25/* "mul" */,-42 , 26/* "div" */,-42 , 27/* "mod" */,-42 , 28/* "eq" */,-42 , 29/* "gt" */,-42 , 30/* "lt" */,-42 , 62/* "le" */,-42 , 63/* "ge" */,-42 , 64/* "ne" */,-42 , 31/* "and" */,-42 , 32/* "or" */,-42 , 33/* "xor" */,-42 , 34/* "not" */,-42 , 35/* "setglobal" */,-42 , 36/* "getglobal" */,-42 , 37/* "aset" */,-42 , 38/* "aget" */,-42 , 39/* "record" */,-42 , 40/* "recall" */,-42 , 41/* "resetdp" */,-42 , 42/* "setdp" */,-42 , 43/* "erase" */,-42 , 44/* "when" */,-42 , 45/* "on" */,-42 , 46/* "onfor" */,-42 , 47/* "off" */,-42 , 48/* "thisway" */,-42 , 49/* "thatway" */,-42 , 50/* "rd" */,-42 , 51/* "setpower" */,-42 , 52/* "brake" */,-42 , 53/* "ledon" */,-42 , 54/* "ledoff" */,-42 , 55/* "setsvh" */,-42 , 56/* "svr" */,-42 , 57/* "svl" */,-42 , 58/* "motors" */,-42 , 59/* "while" */,-42 , 60/* "do" */,-42 , 61/* "call" */,-42 , 65/* "setlocal" */,-42 , 66/* "getlocal" */,-42 , 67/* "settemp" */,-42 , 68/* "gettemp" */,-42 , 69/* "getparam" */,-42 , 79/* "sensor" */,-42 , 85/* "Sensorn" */,-42 , 80/* "switch" */,-42 , 86/* "Switchn" */,-42 , 81/* "push" */,-42 , 82/* "pop" */,-42 , 83/* "enter" */,-42 , 84/* "leave" */,-42 , 3/* "byte" */,-42 , 4/* "short" */,-42 , 5/* "block" */,-42 ),
	/* State 40 */ new Array( 98/* "$" */,-43 , 90/* "Address" */,-43 , 2/* "begin" */,-43 , 6/* "eob" */,-43 , 7/* "return" */,-43 , 8/* "output" */,-43 , 9/* "repeat" */,-43 , 10/* "if" */,-43 , 11/* "ifelse" */,-43 , 70/* "goto" */,-43 , 12/* "beep" */,-43 , 13/* "waituntil" */,-43 , 14/* "loop" */,-43 , 71/* "for" */,-43 , 15/* "forever" */,-43 , 16/* "wait" */,-43 , 17/* "timer" */,-43 , 18/* "resett" */,-43 , 19/* "send" */,-43 , 73/* "sendn" */,-43 , 20/* "serial" */,-43 , 74/* "serialn" */,-43 , 21/* "NewSerial" */,-43 , 75/* "NewSerialn" */,-43 , 22/* "random" */,-43 , 72/* "randomxy" */,-43 , 23/* "add" */,-43 , 24/* "sub" */,-43 , 25/* "mul" */,-43 , 26/* "div" */,-43 , 27/* "mod" */,-43 , 28/* "eq" */,-43 , 29/* "gt" */,-43 , 30/* "lt" */,-43 , 62/* "le" */,-43 , 63/* "ge" */,-43 , 64/* "ne" */,-43 , 31/* "and" */,-43 , 32/* "or" */,-43 , 33/* "xor" */,-43 , 34/* "not" */,-43 , 35/* "setglobal" */,-43 , 36/* "getglobal" */,-43 , 37/* "aset" */,-43 , 38/* "aget" */,-43 , 39/* "record" */,-43 , 40/* "recall" */,-43 , 41/* "resetdp" */,-43 , 42/* "setdp" */,-43 , 43/* "erase" */,-43 , 44/* "when" */,-43 , 45/* "on" */,-43 , 46/* "onfor" */,-43 , 47/* "off" */,-43 , 48/* "thisway" */,-43 , 49/* "thatway" */,-43 , 50/* "rd" */,-43 , 51/* "setpower" */,-43 , 52/* "brake" */,-43 , 53/* "ledon" */,-43 , 54/* "ledoff" */,-43 , 55/* "setsvh" */,-43 , 56/* "svr" */,-43 , 57/* "svl" */,-43 , 58/* "motors" */,-43 , 59/* "while" */,-43 , 60/* "do" */,-43 , 61/* "call" */,-43 , 65/* "setlocal" */,-43 , 66/* "getlocal" */,-43 , 67/* "settemp" */,-43 , 68/* "gettemp" */,-43 , 69/* "getparam" */,-43 , 79/* "sensor" */,-43 , 85/* "Sensorn" */,-43 , 80/* "switch" */,-43 , 86/* "Switchn" */,-43 , 81/* "push" */,-43 , 82/* "pop" */,-43 , 83/* "enter" */,-43 , 84/* "leave" */,-43 , 3/* "byte" */,-43 , 4/* "short" */,-43 , 5/* "block" */,-43 ),
	/* State 41 */ new Array( 98/* "$" */,-44 , 90/* "Address" */,-44 , 2/* "begin" */,-44 , 6/* "eob" */,-44 , 7/* "return" */,-44 , 8/* "output" */,-44 , 9/* "repeat" */,-44 , 10/* "if" */,-44 , 11/* "ifelse" */,-44 , 70/* "goto" */,-44 , 12/* "beep" */,-44 , 13/* "waituntil" */,-44 , 14/* "loop" */,-44 , 71/* "for" */,-44 , 15/* "forever" */,-44 , 16/* "wait" */,-44 , 17/* "timer" */,-44 , 18/* "resett" */,-44 , 19/* "send" */,-44 , 73/* "sendn" */,-44 , 20/* "serial" */,-44 , 74/* "serialn" */,-44 , 21/* "NewSerial" */,-44 , 75/* "NewSerialn" */,-44 , 22/* "random" */,-44 , 72/* "randomxy" */,-44 , 23/* "add" */,-44 , 24/* "sub" */,-44 , 25/* "mul" */,-44 , 26/* "div" */,-44 , 27/* "mod" */,-44 , 28/* "eq" */,-44 , 29/* "gt" */,-44 , 30/* "lt" */,-44 , 62/* "le" */,-44 , 63/* "ge" */,-44 , 64/* "ne" */,-44 , 31/* "and" */,-44 , 32/* "or" */,-44 , 33/* "xor" */,-44 , 34/* "not" */,-44 , 35/* "setglobal" */,-44 , 36/* "getglobal" */,-44 , 37/* "aset" */,-44 , 38/* "aget" */,-44 , 39/* "record" */,-44 , 40/* "recall" */,-44 , 41/* "resetdp" */,-44 , 42/* "setdp" */,-44 , 43/* "erase" */,-44 , 44/* "when" */,-44 , 45/* "on" */,-44 , 46/* "onfor" */,-44 , 47/* "off" */,-44 , 48/* "thisway" */,-44 , 49/* "thatway" */,-44 , 50/* "rd" */,-44 , 51/* "setpower" */,-44 , 52/* "brake" */,-44 , 53/* "ledon" */,-44 , 54/* "ledoff" */,-44 , 55/* "setsvh" */,-44 , 56/* "svr" */,-44 , 57/* "svl" */,-44 , 58/* "motors" */,-44 , 59/* "while" */,-44 , 60/* "do" */,-44 , 61/* "call" */,-44 , 65/* "setlocal" */,-44 , 66/* "getlocal" */,-44 , 67/* "settemp" */,-44 , 68/* "gettemp" */,-44 , 69/* "getparam" */,-44 , 79/* "sensor" */,-44 , 85/* "Sensorn" */,-44 , 80/* "switch" */,-44 , 86/* "Switchn" */,-44 , 81/* "push" */,-44 , 82/* "pop" */,-44 , 83/* "enter" */,-44 , 84/* "leave" */,-44 , 3/* "byte" */,-44 , 4/* "short" */,-44 , 5/* "block" */,-44 ),
	/* State 42 */ new Array( 98/* "$" */,-45 , 90/* "Address" */,-45 , 2/* "begin" */,-45 , 6/* "eob" */,-45 , 7/* "return" */,-45 , 8/* "output" */,-45 , 9/* "repeat" */,-45 , 10/* "if" */,-45 , 11/* "ifelse" */,-45 , 70/* "goto" */,-45 , 12/* "beep" */,-45 , 13/* "waituntil" */,-45 , 14/* "loop" */,-45 , 71/* "for" */,-45 , 15/* "forever" */,-45 , 16/* "wait" */,-45 , 17/* "timer" */,-45 , 18/* "resett" */,-45 , 19/* "send" */,-45 , 73/* "sendn" */,-45 , 20/* "serial" */,-45 , 74/* "serialn" */,-45 , 21/* "NewSerial" */,-45 , 75/* "NewSerialn" */,-45 , 22/* "random" */,-45 , 72/* "randomxy" */,-45 , 23/* "add" */,-45 , 24/* "sub" */,-45 , 25/* "mul" */,-45 , 26/* "div" */,-45 , 27/* "mod" */,-45 , 28/* "eq" */,-45 , 29/* "gt" */,-45 , 30/* "lt" */,-45 , 62/* "le" */,-45 , 63/* "ge" */,-45 , 64/* "ne" */,-45 , 31/* "and" */,-45 , 32/* "or" */,-45 , 33/* "xor" */,-45 , 34/* "not" */,-45 , 35/* "setglobal" */,-45 , 36/* "getglobal" */,-45 , 37/* "aset" */,-45 , 38/* "aget" */,-45 , 39/* "record" */,-45 , 40/* "recall" */,-45 , 41/* "resetdp" */,-45 , 42/* "setdp" */,-45 , 43/* "erase" */,-45 , 44/* "when" */,-45 , 45/* "on" */,-45 , 46/* "onfor" */,-45 , 47/* "off" */,-45 , 48/* "thisway" */,-45 , 49/* "thatway" */,-45 , 50/* "rd" */,-45 , 51/* "setpower" */,-45 , 52/* "brake" */,-45 , 53/* "ledon" */,-45 , 54/* "ledoff" */,-45 , 55/* "setsvh" */,-45 , 56/* "svr" */,-45 , 57/* "svl" */,-45 , 58/* "motors" */,-45 , 59/* "while" */,-45 , 60/* "do" */,-45 , 61/* "call" */,-45 , 65/* "setlocal" */,-45 , 66/* "getlocal" */,-45 , 67/* "settemp" */,-45 , 68/* "gettemp" */,-45 , 69/* "getparam" */,-45 , 79/* "sensor" */,-45 , 85/* "Sensorn" */,-45 , 80/* "switch" */,-45 , 86/* "Switchn" */,-45 , 81/* "push" */,-45 , 82/* "pop" */,-45 , 83/* "enter" */,-45 , 84/* "leave" */,-45 , 3/* "byte" */,-45 , 4/* "short" */,-45 , 5/* "block" */,-45 ),
	/* State 43 */ new Array( 98/* "$" */,-46 , 90/* "Address" */,-46 , 2/* "begin" */,-46 , 6/* "eob" */,-46 , 7/* "return" */,-46 , 8/* "output" */,-46 , 9/* "repeat" */,-46 , 10/* "if" */,-46 , 11/* "ifelse" */,-46 , 70/* "goto" */,-46 , 12/* "beep" */,-46 , 13/* "waituntil" */,-46 , 14/* "loop" */,-46 , 71/* "for" */,-46 , 15/* "forever" */,-46 , 16/* "wait" */,-46 , 17/* "timer" */,-46 , 18/* "resett" */,-46 , 19/* "send" */,-46 , 73/* "sendn" */,-46 , 20/* "serial" */,-46 , 74/* "serialn" */,-46 , 21/* "NewSerial" */,-46 , 75/* "NewSerialn" */,-46 , 22/* "random" */,-46 , 72/* "randomxy" */,-46 , 23/* "add" */,-46 , 24/* "sub" */,-46 , 25/* "mul" */,-46 , 26/* "div" */,-46 , 27/* "mod" */,-46 , 28/* "eq" */,-46 , 29/* "gt" */,-46 , 30/* "lt" */,-46 , 62/* "le" */,-46 , 63/* "ge" */,-46 , 64/* "ne" */,-46 , 31/* "and" */,-46 , 32/* "or" */,-46 , 33/* "xor" */,-46 , 34/* "not" */,-46 , 35/* "setglobal" */,-46 , 36/* "getglobal" */,-46 , 37/* "aset" */,-46 , 38/* "aget" */,-46 , 39/* "record" */,-46 , 40/* "recall" */,-46 , 41/* "resetdp" */,-46 , 42/* "setdp" */,-46 , 43/* "erase" */,-46 , 44/* "when" */,-46 , 45/* "on" */,-46 , 46/* "onfor" */,-46 , 47/* "off" */,-46 , 48/* "thisway" */,-46 , 49/* "thatway" */,-46 , 50/* "rd" */,-46 , 51/* "setpower" */,-46 , 52/* "brake" */,-46 , 53/* "ledon" */,-46 , 54/* "ledoff" */,-46 , 55/* "setsvh" */,-46 , 56/* "svr" */,-46 , 57/* "svl" */,-46 , 58/* "motors" */,-46 , 59/* "while" */,-46 , 60/* "do" */,-46 , 61/* "call" */,-46 , 65/* "setlocal" */,-46 , 66/* "getlocal" */,-46 , 67/* "settemp" */,-46 , 68/* "gettemp" */,-46 , 69/* "getparam" */,-46 , 79/* "sensor" */,-46 , 85/* "Sensorn" */,-46 , 80/* "switch" */,-46 , 86/* "Switchn" */,-46 , 81/* "push" */,-46 , 82/* "pop" */,-46 , 83/* "enter" */,-46 , 84/* "leave" */,-46 , 3/* "byte" */,-46 , 4/* "short" */,-46 , 5/* "block" */,-46 ),
	/* State 44 */ new Array( 98/* "$" */,-47 , 90/* "Address" */,-47 , 2/* "begin" */,-47 , 6/* "eob" */,-47 , 7/* "return" */,-47 , 8/* "output" */,-47 , 9/* "repeat" */,-47 , 10/* "if" */,-47 , 11/* "ifelse" */,-47 , 70/* "goto" */,-47 , 12/* "beep" */,-47 , 13/* "waituntil" */,-47 , 14/* "loop" */,-47 , 71/* "for" */,-47 , 15/* "forever" */,-47 , 16/* "wait" */,-47 , 17/* "timer" */,-47 , 18/* "resett" */,-47 , 19/* "send" */,-47 , 73/* "sendn" */,-47 , 20/* "serial" */,-47 , 74/* "serialn" */,-47 , 21/* "NewSerial" */,-47 , 75/* "NewSerialn" */,-47 , 22/* "random" */,-47 , 72/* "randomxy" */,-47 , 23/* "add" */,-47 , 24/* "sub" */,-47 , 25/* "mul" */,-47 , 26/* "div" */,-47 , 27/* "mod" */,-47 , 28/* "eq" */,-47 , 29/* "gt" */,-47 , 30/* "lt" */,-47 , 62/* "le" */,-47 , 63/* "ge" */,-47 , 64/* "ne" */,-47 , 31/* "and" */,-47 , 32/* "or" */,-47 , 33/* "xor" */,-47 , 34/* "not" */,-47 , 35/* "setglobal" */,-47 , 36/* "getglobal" */,-47 , 37/* "aset" */,-47 , 38/* "aget" */,-47 , 39/* "record" */,-47 , 40/* "recall" */,-47 , 41/* "resetdp" */,-47 , 42/* "setdp" */,-47 , 43/* "erase" */,-47 , 44/* "when" */,-47 , 45/* "on" */,-47 , 46/* "onfor" */,-47 , 47/* "off" */,-47 , 48/* "thisway" */,-47 , 49/* "thatway" */,-47 , 50/* "rd" */,-47 , 51/* "setpower" */,-47 , 52/* "brake" */,-47 , 53/* "ledon" */,-47 , 54/* "ledoff" */,-47 , 55/* "setsvh" */,-47 , 56/* "svr" */,-47 , 57/* "svl" */,-47 , 58/* "motors" */,-47 , 59/* "while" */,-47 , 60/* "do" */,-47 , 61/* "call" */,-47 , 65/* "setlocal" */,-47 , 66/* "getlocal" */,-47 , 67/* "settemp" */,-47 , 68/* "gettemp" */,-47 , 69/* "getparam" */,-47 , 79/* "sensor" */,-47 , 85/* "Sensorn" */,-47 , 80/* "switch" */,-47 , 86/* "Switchn" */,-47 , 81/* "push" */,-47 , 82/* "pop" */,-47 , 83/* "enter" */,-47 , 84/* "leave" */,-47 , 3/* "byte" */,-47 , 4/* "short" */,-47 , 5/* "block" */,-47 ),
	/* State 45 */ new Array( 98/* "$" */,-48 , 90/* "Address" */,-48 , 2/* "begin" */,-48 , 6/* "eob" */,-48 , 7/* "return" */,-48 , 8/* "output" */,-48 , 9/* "repeat" */,-48 , 10/* "if" */,-48 , 11/* "ifelse" */,-48 , 70/* "goto" */,-48 , 12/* "beep" */,-48 , 13/* "waituntil" */,-48 , 14/* "loop" */,-48 , 71/* "for" */,-48 , 15/* "forever" */,-48 , 16/* "wait" */,-48 , 17/* "timer" */,-48 , 18/* "resett" */,-48 , 19/* "send" */,-48 , 73/* "sendn" */,-48 , 20/* "serial" */,-48 , 74/* "serialn" */,-48 , 21/* "NewSerial" */,-48 , 75/* "NewSerialn" */,-48 , 22/* "random" */,-48 , 72/* "randomxy" */,-48 , 23/* "add" */,-48 , 24/* "sub" */,-48 , 25/* "mul" */,-48 , 26/* "div" */,-48 , 27/* "mod" */,-48 , 28/* "eq" */,-48 , 29/* "gt" */,-48 , 30/* "lt" */,-48 , 62/* "le" */,-48 , 63/* "ge" */,-48 , 64/* "ne" */,-48 , 31/* "and" */,-48 , 32/* "or" */,-48 , 33/* "xor" */,-48 , 34/* "not" */,-48 , 35/* "setglobal" */,-48 , 36/* "getglobal" */,-48 , 37/* "aset" */,-48 , 38/* "aget" */,-48 , 39/* "record" */,-48 , 40/* "recall" */,-48 , 41/* "resetdp" */,-48 , 42/* "setdp" */,-48 , 43/* "erase" */,-48 , 44/* "when" */,-48 , 45/* "on" */,-48 , 46/* "onfor" */,-48 , 47/* "off" */,-48 , 48/* "thisway" */,-48 , 49/* "thatway" */,-48 , 50/* "rd" */,-48 , 51/* "setpower" */,-48 , 52/* "brake" */,-48 , 53/* "ledon" */,-48 , 54/* "ledoff" */,-48 , 55/* "setsvh" */,-48 , 56/* "svr" */,-48 , 57/* "svl" */,-48 , 58/* "motors" */,-48 , 59/* "while" */,-48 , 60/* "do" */,-48 , 61/* "call" */,-48 , 65/* "setlocal" */,-48 , 66/* "getlocal" */,-48 , 67/* "settemp" */,-48 , 68/* "gettemp" */,-48 , 69/* "getparam" */,-48 , 79/* "sensor" */,-48 , 85/* "Sensorn" */,-48 , 80/* "switch" */,-48 , 86/* "Switchn" */,-48 , 81/* "push" */,-48 , 82/* "pop" */,-48 , 83/* "enter" */,-48 , 84/* "leave" */,-48 , 3/* "byte" */,-48 , 4/* "short" */,-48 , 5/* "block" */,-48 ),
	/* State 46 */ new Array( 98/* "$" */,-49 , 90/* "Address" */,-49 , 2/* "begin" */,-49 , 6/* "eob" */,-49 , 7/* "return" */,-49 , 8/* "output" */,-49 , 9/* "repeat" */,-49 , 10/* "if" */,-49 , 11/* "ifelse" */,-49 , 70/* "goto" */,-49 , 12/* "beep" */,-49 , 13/* "waituntil" */,-49 , 14/* "loop" */,-49 , 71/* "for" */,-49 , 15/* "forever" */,-49 , 16/* "wait" */,-49 , 17/* "timer" */,-49 , 18/* "resett" */,-49 , 19/* "send" */,-49 , 73/* "sendn" */,-49 , 20/* "serial" */,-49 , 74/* "serialn" */,-49 , 21/* "NewSerial" */,-49 , 75/* "NewSerialn" */,-49 , 22/* "random" */,-49 , 72/* "randomxy" */,-49 , 23/* "add" */,-49 , 24/* "sub" */,-49 , 25/* "mul" */,-49 , 26/* "div" */,-49 , 27/* "mod" */,-49 , 28/* "eq" */,-49 , 29/* "gt" */,-49 , 30/* "lt" */,-49 , 62/* "le" */,-49 , 63/* "ge" */,-49 , 64/* "ne" */,-49 , 31/* "and" */,-49 , 32/* "or" */,-49 , 33/* "xor" */,-49 , 34/* "not" */,-49 , 35/* "setglobal" */,-49 , 36/* "getglobal" */,-49 , 37/* "aset" */,-49 , 38/* "aget" */,-49 , 39/* "record" */,-49 , 40/* "recall" */,-49 , 41/* "resetdp" */,-49 , 42/* "setdp" */,-49 , 43/* "erase" */,-49 , 44/* "when" */,-49 , 45/* "on" */,-49 , 46/* "onfor" */,-49 , 47/* "off" */,-49 , 48/* "thisway" */,-49 , 49/* "thatway" */,-49 , 50/* "rd" */,-49 , 51/* "setpower" */,-49 , 52/* "brake" */,-49 , 53/* "ledon" */,-49 , 54/* "ledoff" */,-49 , 55/* "setsvh" */,-49 , 56/* "svr" */,-49 , 57/* "svl" */,-49 , 58/* "motors" */,-49 , 59/* "while" */,-49 , 60/* "do" */,-49 , 61/* "call" */,-49 , 65/* "setlocal" */,-49 , 66/* "getlocal" */,-49 , 67/* "settemp" */,-49 , 68/* "gettemp" */,-49 , 69/* "getparam" */,-49 , 79/* "sensor" */,-49 , 85/* "Sensorn" */,-49 , 80/* "switch" */,-49 , 86/* "Switchn" */,-49 , 81/* "push" */,-49 , 82/* "pop" */,-49 , 83/* "enter" */,-49 , 84/* "leave" */,-49 , 3/* "byte" */,-49 , 4/* "short" */,-49 , 5/* "block" */,-49 ),
	/* State 47 */ new Array( 98/* "$" */,-50 , 90/* "Address" */,-50 , 2/* "begin" */,-50 , 6/* "eob" */,-50 , 7/* "return" */,-50 , 8/* "output" */,-50 , 9/* "repeat" */,-50 , 10/* "if" */,-50 , 11/* "ifelse" */,-50 , 70/* "goto" */,-50 , 12/* "beep" */,-50 , 13/* "waituntil" */,-50 , 14/* "loop" */,-50 , 71/* "for" */,-50 , 15/* "forever" */,-50 , 16/* "wait" */,-50 , 17/* "timer" */,-50 , 18/* "resett" */,-50 , 19/* "send" */,-50 , 73/* "sendn" */,-50 , 20/* "serial" */,-50 , 74/* "serialn" */,-50 , 21/* "NewSerial" */,-50 , 75/* "NewSerialn" */,-50 , 22/* "random" */,-50 , 72/* "randomxy" */,-50 , 23/* "add" */,-50 , 24/* "sub" */,-50 , 25/* "mul" */,-50 , 26/* "div" */,-50 , 27/* "mod" */,-50 , 28/* "eq" */,-50 , 29/* "gt" */,-50 , 30/* "lt" */,-50 , 62/* "le" */,-50 , 63/* "ge" */,-50 , 64/* "ne" */,-50 , 31/* "and" */,-50 , 32/* "or" */,-50 , 33/* "xor" */,-50 , 34/* "not" */,-50 , 35/* "setglobal" */,-50 , 36/* "getglobal" */,-50 , 37/* "aset" */,-50 , 38/* "aget" */,-50 , 39/* "record" */,-50 , 40/* "recall" */,-50 , 41/* "resetdp" */,-50 , 42/* "setdp" */,-50 , 43/* "erase" */,-50 , 44/* "when" */,-50 , 45/* "on" */,-50 , 46/* "onfor" */,-50 , 47/* "off" */,-50 , 48/* "thisway" */,-50 , 49/* "thatway" */,-50 , 50/* "rd" */,-50 , 51/* "setpower" */,-50 , 52/* "brake" */,-50 , 53/* "ledon" */,-50 , 54/* "ledoff" */,-50 , 55/* "setsvh" */,-50 , 56/* "svr" */,-50 , 57/* "svl" */,-50 , 58/* "motors" */,-50 , 59/* "while" */,-50 , 60/* "do" */,-50 , 61/* "call" */,-50 , 65/* "setlocal" */,-50 , 66/* "getlocal" */,-50 , 67/* "settemp" */,-50 , 68/* "gettemp" */,-50 , 69/* "getparam" */,-50 , 79/* "sensor" */,-50 , 85/* "Sensorn" */,-50 , 80/* "switch" */,-50 , 86/* "Switchn" */,-50 , 81/* "push" */,-50 , 82/* "pop" */,-50 , 83/* "enter" */,-50 , 84/* "leave" */,-50 , 3/* "byte" */,-50 , 4/* "short" */,-50 , 5/* "block" */,-50 ),
	/* State 48 */ new Array( 98/* "$" */,-51 , 90/* "Address" */,-51 , 2/* "begin" */,-51 , 6/* "eob" */,-51 , 7/* "return" */,-51 , 8/* "output" */,-51 , 9/* "repeat" */,-51 , 10/* "if" */,-51 , 11/* "ifelse" */,-51 , 70/* "goto" */,-51 , 12/* "beep" */,-51 , 13/* "waituntil" */,-51 , 14/* "loop" */,-51 , 71/* "for" */,-51 , 15/* "forever" */,-51 , 16/* "wait" */,-51 , 17/* "timer" */,-51 , 18/* "resett" */,-51 , 19/* "send" */,-51 , 73/* "sendn" */,-51 , 20/* "serial" */,-51 , 74/* "serialn" */,-51 , 21/* "NewSerial" */,-51 , 75/* "NewSerialn" */,-51 , 22/* "random" */,-51 , 72/* "randomxy" */,-51 , 23/* "add" */,-51 , 24/* "sub" */,-51 , 25/* "mul" */,-51 , 26/* "div" */,-51 , 27/* "mod" */,-51 , 28/* "eq" */,-51 , 29/* "gt" */,-51 , 30/* "lt" */,-51 , 62/* "le" */,-51 , 63/* "ge" */,-51 , 64/* "ne" */,-51 , 31/* "and" */,-51 , 32/* "or" */,-51 , 33/* "xor" */,-51 , 34/* "not" */,-51 , 35/* "setglobal" */,-51 , 36/* "getglobal" */,-51 , 37/* "aset" */,-51 , 38/* "aget" */,-51 , 39/* "record" */,-51 , 40/* "recall" */,-51 , 41/* "resetdp" */,-51 , 42/* "setdp" */,-51 , 43/* "erase" */,-51 , 44/* "when" */,-51 , 45/* "on" */,-51 , 46/* "onfor" */,-51 , 47/* "off" */,-51 , 48/* "thisway" */,-51 , 49/* "thatway" */,-51 , 50/* "rd" */,-51 , 51/* "setpower" */,-51 , 52/* "brake" */,-51 , 53/* "ledon" */,-51 , 54/* "ledoff" */,-51 , 55/* "setsvh" */,-51 , 56/* "svr" */,-51 , 57/* "svl" */,-51 , 58/* "motors" */,-51 , 59/* "while" */,-51 , 60/* "do" */,-51 , 61/* "call" */,-51 , 65/* "setlocal" */,-51 , 66/* "getlocal" */,-51 , 67/* "settemp" */,-51 , 68/* "gettemp" */,-51 , 69/* "getparam" */,-51 , 79/* "sensor" */,-51 , 85/* "Sensorn" */,-51 , 80/* "switch" */,-51 , 86/* "Switchn" */,-51 , 81/* "push" */,-51 , 82/* "pop" */,-51 , 83/* "enter" */,-51 , 84/* "leave" */,-51 , 3/* "byte" */,-51 , 4/* "short" */,-51 , 5/* "block" */,-51 ),
	/* State 49 */ new Array( 98/* "$" */,-52 , 90/* "Address" */,-52 , 2/* "begin" */,-52 , 6/* "eob" */,-52 , 7/* "return" */,-52 , 8/* "output" */,-52 , 9/* "repeat" */,-52 , 10/* "if" */,-52 , 11/* "ifelse" */,-52 , 70/* "goto" */,-52 , 12/* "beep" */,-52 , 13/* "waituntil" */,-52 , 14/* "loop" */,-52 , 71/* "for" */,-52 , 15/* "forever" */,-52 , 16/* "wait" */,-52 , 17/* "timer" */,-52 , 18/* "resett" */,-52 , 19/* "send" */,-52 , 73/* "sendn" */,-52 , 20/* "serial" */,-52 , 74/* "serialn" */,-52 , 21/* "NewSerial" */,-52 , 75/* "NewSerialn" */,-52 , 22/* "random" */,-52 , 72/* "randomxy" */,-52 , 23/* "add" */,-52 , 24/* "sub" */,-52 , 25/* "mul" */,-52 , 26/* "div" */,-52 , 27/* "mod" */,-52 , 28/* "eq" */,-52 , 29/* "gt" */,-52 , 30/* "lt" */,-52 , 62/* "le" */,-52 , 63/* "ge" */,-52 , 64/* "ne" */,-52 , 31/* "and" */,-52 , 32/* "or" */,-52 , 33/* "xor" */,-52 , 34/* "not" */,-52 , 35/* "setglobal" */,-52 , 36/* "getglobal" */,-52 , 37/* "aset" */,-52 , 38/* "aget" */,-52 , 39/* "record" */,-52 , 40/* "recall" */,-52 , 41/* "resetdp" */,-52 , 42/* "setdp" */,-52 , 43/* "erase" */,-52 , 44/* "when" */,-52 , 45/* "on" */,-52 , 46/* "onfor" */,-52 , 47/* "off" */,-52 , 48/* "thisway" */,-52 , 49/* "thatway" */,-52 , 50/* "rd" */,-52 , 51/* "setpower" */,-52 , 52/* "brake" */,-52 , 53/* "ledon" */,-52 , 54/* "ledoff" */,-52 , 55/* "setsvh" */,-52 , 56/* "svr" */,-52 , 57/* "svl" */,-52 , 58/* "motors" */,-52 , 59/* "while" */,-52 , 60/* "do" */,-52 , 61/* "call" */,-52 , 65/* "setlocal" */,-52 , 66/* "getlocal" */,-52 , 67/* "settemp" */,-52 , 68/* "gettemp" */,-52 , 69/* "getparam" */,-52 , 79/* "sensor" */,-52 , 85/* "Sensorn" */,-52 , 80/* "switch" */,-52 , 86/* "Switchn" */,-52 , 81/* "push" */,-52 , 82/* "pop" */,-52 , 83/* "enter" */,-52 , 84/* "leave" */,-52 , 3/* "byte" */,-52 , 4/* "short" */,-52 , 5/* "block" */,-52 ),
	/* State 50 */ new Array( 98/* "$" */,-53 , 90/* "Address" */,-53 , 2/* "begin" */,-53 , 6/* "eob" */,-53 , 7/* "return" */,-53 , 8/* "output" */,-53 , 9/* "repeat" */,-53 , 10/* "if" */,-53 , 11/* "ifelse" */,-53 , 70/* "goto" */,-53 , 12/* "beep" */,-53 , 13/* "waituntil" */,-53 , 14/* "loop" */,-53 , 71/* "for" */,-53 , 15/* "forever" */,-53 , 16/* "wait" */,-53 , 17/* "timer" */,-53 , 18/* "resett" */,-53 , 19/* "send" */,-53 , 73/* "sendn" */,-53 , 20/* "serial" */,-53 , 74/* "serialn" */,-53 , 21/* "NewSerial" */,-53 , 75/* "NewSerialn" */,-53 , 22/* "random" */,-53 , 72/* "randomxy" */,-53 , 23/* "add" */,-53 , 24/* "sub" */,-53 , 25/* "mul" */,-53 , 26/* "div" */,-53 , 27/* "mod" */,-53 , 28/* "eq" */,-53 , 29/* "gt" */,-53 , 30/* "lt" */,-53 , 62/* "le" */,-53 , 63/* "ge" */,-53 , 64/* "ne" */,-53 , 31/* "and" */,-53 , 32/* "or" */,-53 , 33/* "xor" */,-53 , 34/* "not" */,-53 , 35/* "setglobal" */,-53 , 36/* "getglobal" */,-53 , 37/* "aset" */,-53 , 38/* "aget" */,-53 , 39/* "record" */,-53 , 40/* "recall" */,-53 , 41/* "resetdp" */,-53 , 42/* "setdp" */,-53 , 43/* "erase" */,-53 , 44/* "when" */,-53 , 45/* "on" */,-53 , 46/* "onfor" */,-53 , 47/* "off" */,-53 , 48/* "thisway" */,-53 , 49/* "thatway" */,-53 , 50/* "rd" */,-53 , 51/* "setpower" */,-53 , 52/* "brake" */,-53 , 53/* "ledon" */,-53 , 54/* "ledoff" */,-53 , 55/* "setsvh" */,-53 , 56/* "svr" */,-53 , 57/* "svl" */,-53 , 58/* "motors" */,-53 , 59/* "while" */,-53 , 60/* "do" */,-53 , 61/* "call" */,-53 , 65/* "setlocal" */,-53 , 66/* "getlocal" */,-53 , 67/* "settemp" */,-53 , 68/* "gettemp" */,-53 , 69/* "getparam" */,-53 , 79/* "sensor" */,-53 , 85/* "Sensorn" */,-53 , 80/* "switch" */,-53 , 86/* "Switchn" */,-53 , 81/* "push" */,-53 , 82/* "pop" */,-53 , 83/* "enter" */,-53 , 84/* "leave" */,-53 , 3/* "byte" */,-53 , 4/* "short" */,-53 , 5/* "block" */,-53 ),
	/* State 51 */ new Array( 98/* "$" */,-54 , 90/* "Address" */,-54 , 2/* "begin" */,-54 , 6/* "eob" */,-54 , 7/* "return" */,-54 , 8/* "output" */,-54 , 9/* "repeat" */,-54 , 10/* "if" */,-54 , 11/* "ifelse" */,-54 , 70/* "goto" */,-54 , 12/* "beep" */,-54 , 13/* "waituntil" */,-54 , 14/* "loop" */,-54 , 71/* "for" */,-54 , 15/* "forever" */,-54 , 16/* "wait" */,-54 , 17/* "timer" */,-54 , 18/* "resett" */,-54 , 19/* "send" */,-54 , 73/* "sendn" */,-54 , 20/* "serial" */,-54 , 74/* "serialn" */,-54 , 21/* "NewSerial" */,-54 , 75/* "NewSerialn" */,-54 , 22/* "random" */,-54 , 72/* "randomxy" */,-54 , 23/* "add" */,-54 , 24/* "sub" */,-54 , 25/* "mul" */,-54 , 26/* "div" */,-54 , 27/* "mod" */,-54 , 28/* "eq" */,-54 , 29/* "gt" */,-54 , 30/* "lt" */,-54 , 62/* "le" */,-54 , 63/* "ge" */,-54 , 64/* "ne" */,-54 , 31/* "and" */,-54 , 32/* "or" */,-54 , 33/* "xor" */,-54 , 34/* "not" */,-54 , 35/* "setglobal" */,-54 , 36/* "getglobal" */,-54 , 37/* "aset" */,-54 , 38/* "aget" */,-54 , 39/* "record" */,-54 , 40/* "recall" */,-54 , 41/* "resetdp" */,-54 , 42/* "setdp" */,-54 , 43/* "erase" */,-54 , 44/* "when" */,-54 , 45/* "on" */,-54 , 46/* "onfor" */,-54 , 47/* "off" */,-54 , 48/* "thisway" */,-54 , 49/* "thatway" */,-54 , 50/* "rd" */,-54 , 51/* "setpower" */,-54 , 52/* "brake" */,-54 , 53/* "ledon" */,-54 , 54/* "ledoff" */,-54 , 55/* "setsvh" */,-54 , 56/* "svr" */,-54 , 57/* "svl" */,-54 , 58/* "motors" */,-54 , 59/* "while" */,-54 , 60/* "do" */,-54 , 61/* "call" */,-54 , 65/* "setlocal" */,-54 , 66/* "getlocal" */,-54 , 67/* "settemp" */,-54 , 68/* "gettemp" */,-54 , 69/* "getparam" */,-54 , 79/* "sensor" */,-54 , 85/* "Sensorn" */,-54 , 80/* "switch" */,-54 , 86/* "Switchn" */,-54 , 81/* "push" */,-54 , 82/* "pop" */,-54 , 83/* "enter" */,-54 , 84/* "leave" */,-54 , 3/* "byte" */,-54 , 4/* "short" */,-54 , 5/* "block" */,-54 ),
	/* State 52 */ new Array( 98/* "$" */,-55 , 90/* "Address" */,-55 , 2/* "begin" */,-55 , 6/* "eob" */,-55 , 7/* "return" */,-55 , 8/* "output" */,-55 , 9/* "repeat" */,-55 , 10/* "if" */,-55 , 11/* "ifelse" */,-55 , 70/* "goto" */,-55 , 12/* "beep" */,-55 , 13/* "waituntil" */,-55 , 14/* "loop" */,-55 , 71/* "for" */,-55 , 15/* "forever" */,-55 , 16/* "wait" */,-55 , 17/* "timer" */,-55 , 18/* "resett" */,-55 , 19/* "send" */,-55 , 73/* "sendn" */,-55 , 20/* "serial" */,-55 , 74/* "serialn" */,-55 , 21/* "NewSerial" */,-55 , 75/* "NewSerialn" */,-55 , 22/* "random" */,-55 , 72/* "randomxy" */,-55 , 23/* "add" */,-55 , 24/* "sub" */,-55 , 25/* "mul" */,-55 , 26/* "div" */,-55 , 27/* "mod" */,-55 , 28/* "eq" */,-55 , 29/* "gt" */,-55 , 30/* "lt" */,-55 , 62/* "le" */,-55 , 63/* "ge" */,-55 , 64/* "ne" */,-55 , 31/* "and" */,-55 , 32/* "or" */,-55 , 33/* "xor" */,-55 , 34/* "not" */,-55 , 35/* "setglobal" */,-55 , 36/* "getglobal" */,-55 , 37/* "aset" */,-55 , 38/* "aget" */,-55 , 39/* "record" */,-55 , 40/* "recall" */,-55 , 41/* "resetdp" */,-55 , 42/* "setdp" */,-55 , 43/* "erase" */,-55 , 44/* "when" */,-55 , 45/* "on" */,-55 , 46/* "onfor" */,-55 , 47/* "off" */,-55 , 48/* "thisway" */,-55 , 49/* "thatway" */,-55 , 50/* "rd" */,-55 , 51/* "setpower" */,-55 , 52/* "brake" */,-55 , 53/* "ledon" */,-55 , 54/* "ledoff" */,-55 , 55/* "setsvh" */,-55 , 56/* "svr" */,-55 , 57/* "svl" */,-55 , 58/* "motors" */,-55 , 59/* "while" */,-55 , 60/* "do" */,-55 , 61/* "call" */,-55 , 65/* "setlocal" */,-55 , 66/* "getlocal" */,-55 , 67/* "settemp" */,-55 , 68/* "gettemp" */,-55 , 69/* "getparam" */,-55 , 79/* "sensor" */,-55 , 85/* "Sensorn" */,-55 , 80/* "switch" */,-55 , 86/* "Switchn" */,-55 , 81/* "push" */,-55 , 82/* "pop" */,-55 , 83/* "enter" */,-55 , 84/* "leave" */,-55 , 3/* "byte" */,-55 , 4/* "short" */,-55 , 5/* "block" */,-55 ),
	/* State 53 */ new Array( 98/* "$" */,-56 , 90/* "Address" */,-56 , 2/* "begin" */,-56 , 6/* "eob" */,-56 , 7/* "return" */,-56 , 8/* "output" */,-56 , 9/* "repeat" */,-56 , 10/* "if" */,-56 , 11/* "ifelse" */,-56 , 70/* "goto" */,-56 , 12/* "beep" */,-56 , 13/* "waituntil" */,-56 , 14/* "loop" */,-56 , 71/* "for" */,-56 , 15/* "forever" */,-56 , 16/* "wait" */,-56 , 17/* "timer" */,-56 , 18/* "resett" */,-56 , 19/* "send" */,-56 , 73/* "sendn" */,-56 , 20/* "serial" */,-56 , 74/* "serialn" */,-56 , 21/* "NewSerial" */,-56 , 75/* "NewSerialn" */,-56 , 22/* "random" */,-56 , 72/* "randomxy" */,-56 , 23/* "add" */,-56 , 24/* "sub" */,-56 , 25/* "mul" */,-56 , 26/* "div" */,-56 , 27/* "mod" */,-56 , 28/* "eq" */,-56 , 29/* "gt" */,-56 , 30/* "lt" */,-56 , 62/* "le" */,-56 , 63/* "ge" */,-56 , 64/* "ne" */,-56 , 31/* "and" */,-56 , 32/* "or" */,-56 , 33/* "xor" */,-56 , 34/* "not" */,-56 , 35/* "setglobal" */,-56 , 36/* "getglobal" */,-56 , 37/* "aset" */,-56 , 38/* "aget" */,-56 , 39/* "record" */,-56 , 40/* "recall" */,-56 , 41/* "resetdp" */,-56 , 42/* "setdp" */,-56 , 43/* "erase" */,-56 , 44/* "when" */,-56 , 45/* "on" */,-56 , 46/* "onfor" */,-56 , 47/* "off" */,-56 , 48/* "thisway" */,-56 , 49/* "thatway" */,-56 , 50/* "rd" */,-56 , 51/* "setpower" */,-56 , 52/* "brake" */,-56 , 53/* "ledon" */,-56 , 54/* "ledoff" */,-56 , 55/* "setsvh" */,-56 , 56/* "svr" */,-56 , 57/* "svl" */,-56 , 58/* "motors" */,-56 , 59/* "while" */,-56 , 60/* "do" */,-56 , 61/* "call" */,-56 , 65/* "setlocal" */,-56 , 66/* "getlocal" */,-56 , 67/* "settemp" */,-56 , 68/* "gettemp" */,-56 , 69/* "getparam" */,-56 , 79/* "sensor" */,-56 , 85/* "Sensorn" */,-56 , 80/* "switch" */,-56 , 86/* "Switchn" */,-56 , 81/* "push" */,-56 , 82/* "pop" */,-56 , 83/* "enter" */,-56 , 84/* "leave" */,-56 , 3/* "byte" */,-56 , 4/* "short" */,-56 , 5/* "block" */,-56 ),
	/* State 54 */ new Array( 98/* "$" */,-57 , 90/* "Address" */,-57 , 2/* "begin" */,-57 , 6/* "eob" */,-57 , 7/* "return" */,-57 , 8/* "output" */,-57 , 9/* "repeat" */,-57 , 10/* "if" */,-57 , 11/* "ifelse" */,-57 , 70/* "goto" */,-57 , 12/* "beep" */,-57 , 13/* "waituntil" */,-57 , 14/* "loop" */,-57 , 71/* "for" */,-57 , 15/* "forever" */,-57 , 16/* "wait" */,-57 , 17/* "timer" */,-57 , 18/* "resett" */,-57 , 19/* "send" */,-57 , 73/* "sendn" */,-57 , 20/* "serial" */,-57 , 74/* "serialn" */,-57 , 21/* "NewSerial" */,-57 , 75/* "NewSerialn" */,-57 , 22/* "random" */,-57 , 72/* "randomxy" */,-57 , 23/* "add" */,-57 , 24/* "sub" */,-57 , 25/* "mul" */,-57 , 26/* "div" */,-57 , 27/* "mod" */,-57 , 28/* "eq" */,-57 , 29/* "gt" */,-57 , 30/* "lt" */,-57 , 62/* "le" */,-57 , 63/* "ge" */,-57 , 64/* "ne" */,-57 , 31/* "and" */,-57 , 32/* "or" */,-57 , 33/* "xor" */,-57 , 34/* "not" */,-57 , 35/* "setglobal" */,-57 , 36/* "getglobal" */,-57 , 37/* "aset" */,-57 , 38/* "aget" */,-57 , 39/* "record" */,-57 , 40/* "recall" */,-57 , 41/* "resetdp" */,-57 , 42/* "setdp" */,-57 , 43/* "erase" */,-57 , 44/* "when" */,-57 , 45/* "on" */,-57 , 46/* "onfor" */,-57 , 47/* "off" */,-57 , 48/* "thisway" */,-57 , 49/* "thatway" */,-57 , 50/* "rd" */,-57 , 51/* "setpower" */,-57 , 52/* "brake" */,-57 , 53/* "ledon" */,-57 , 54/* "ledoff" */,-57 , 55/* "setsvh" */,-57 , 56/* "svr" */,-57 , 57/* "svl" */,-57 , 58/* "motors" */,-57 , 59/* "while" */,-57 , 60/* "do" */,-57 , 61/* "call" */,-57 , 65/* "setlocal" */,-57 , 66/* "getlocal" */,-57 , 67/* "settemp" */,-57 , 68/* "gettemp" */,-57 , 69/* "getparam" */,-57 , 79/* "sensor" */,-57 , 85/* "Sensorn" */,-57 , 80/* "switch" */,-57 , 86/* "Switchn" */,-57 , 81/* "push" */,-57 , 82/* "pop" */,-57 , 83/* "enter" */,-57 , 84/* "leave" */,-57 , 3/* "byte" */,-57 , 4/* "short" */,-57 , 5/* "block" */,-57 ),
	/* State 55 */ new Array( 98/* "$" */,-58 , 90/* "Address" */,-58 , 2/* "begin" */,-58 , 6/* "eob" */,-58 , 7/* "return" */,-58 , 8/* "output" */,-58 , 9/* "repeat" */,-58 , 10/* "if" */,-58 , 11/* "ifelse" */,-58 , 70/* "goto" */,-58 , 12/* "beep" */,-58 , 13/* "waituntil" */,-58 , 14/* "loop" */,-58 , 71/* "for" */,-58 , 15/* "forever" */,-58 , 16/* "wait" */,-58 , 17/* "timer" */,-58 , 18/* "resett" */,-58 , 19/* "send" */,-58 , 73/* "sendn" */,-58 , 20/* "serial" */,-58 , 74/* "serialn" */,-58 , 21/* "NewSerial" */,-58 , 75/* "NewSerialn" */,-58 , 22/* "random" */,-58 , 72/* "randomxy" */,-58 , 23/* "add" */,-58 , 24/* "sub" */,-58 , 25/* "mul" */,-58 , 26/* "div" */,-58 , 27/* "mod" */,-58 , 28/* "eq" */,-58 , 29/* "gt" */,-58 , 30/* "lt" */,-58 , 62/* "le" */,-58 , 63/* "ge" */,-58 , 64/* "ne" */,-58 , 31/* "and" */,-58 , 32/* "or" */,-58 , 33/* "xor" */,-58 , 34/* "not" */,-58 , 35/* "setglobal" */,-58 , 36/* "getglobal" */,-58 , 37/* "aset" */,-58 , 38/* "aget" */,-58 , 39/* "record" */,-58 , 40/* "recall" */,-58 , 41/* "resetdp" */,-58 , 42/* "setdp" */,-58 , 43/* "erase" */,-58 , 44/* "when" */,-58 , 45/* "on" */,-58 , 46/* "onfor" */,-58 , 47/* "off" */,-58 , 48/* "thisway" */,-58 , 49/* "thatway" */,-58 , 50/* "rd" */,-58 , 51/* "setpower" */,-58 , 52/* "brake" */,-58 , 53/* "ledon" */,-58 , 54/* "ledoff" */,-58 , 55/* "setsvh" */,-58 , 56/* "svr" */,-58 , 57/* "svl" */,-58 , 58/* "motors" */,-58 , 59/* "while" */,-58 , 60/* "do" */,-58 , 61/* "call" */,-58 , 65/* "setlocal" */,-58 , 66/* "getlocal" */,-58 , 67/* "settemp" */,-58 , 68/* "gettemp" */,-58 , 69/* "getparam" */,-58 , 79/* "sensor" */,-58 , 85/* "Sensorn" */,-58 , 80/* "switch" */,-58 , 86/* "Switchn" */,-58 , 81/* "push" */,-58 , 82/* "pop" */,-58 , 83/* "enter" */,-58 , 84/* "leave" */,-58 , 3/* "byte" */,-58 , 4/* "short" */,-58 , 5/* "block" */,-58 ),
	/* State 56 */ new Array( 98/* "$" */,-60 , 90/* "Address" */,-60 , 2/* "begin" */,-60 , 6/* "eob" */,-60 , 7/* "return" */,-60 , 8/* "output" */,-60 , 9/* "repeat" */,-60 , 10/* "if" */,-60 , 11/* "ifelse" */,-60 , 70/* "goto" */,-60 , 12/* "beep" */,-60 , 13/* "waituntil" */,-60 , 14/* "loop" */,-60 , 71/* "for" */,-60 , 15/* "forever" */,-60 , 16/* "wait" */,-60 , 17/* "timer" */,-60 , 18/* "resett" */,-60 , 19/* "send" */,-60 , 73/* "sendn" */,-60 , 20/* "serial" */,-60 , 74/* "serialn" */,-60 , 21/* "NewSerial" */,-60 , 75/* "NewSerialn" */,-60 , 22/* "random" */,-60 , 72/* "randomxy" */,-60 , 23/* "add" */,-60 , 24/* "sub" */,-60 , 25/* "mul" */,-60 , 26/* "div" */,-60 , 27/* "mod" */,-60 , 28/* "eq" */,-60 , 29/* "gt" */,-60 , 30/* "lt" */,-60 , 62/* "le" */,-60 , 63/* "ge" */,-60 , 64/* "ne" */,-60 , 31/* "and" */,-60 , 32/* "or" */,-60 , 33/* "xor" */,-60 , 34/* "not" */,-60 , 35/* "setglobal" */,-60 , 36/* "getglobal" */,-60 , 37/* "aset" */,-60 , 38/* "aget" */,-60 , 39/* "record" */,-60 , 40/* "recall" */,-60 , 41/* "resetdp" */,-60 , 42/* "setdp" */,-60 , 43/* "erase" */,-60 , 44/* "when" */,-60 , 45/* "on" */,-60 , 46/* "onfor" */,-60 , 47/* "off" */,-60 , 48/* "thisway" */,-60 , 49/* "thatway" */,-60 , 50/* "rd" */,-60 , 51/* "setpower" */,-60 , 52/* "brake" */,-60 , 53/* "ledon" */,-60 , 54/* "ledoff" */,-60 , 55/* "setsvh" */,-60 , 56/* "svr" */,-60 , 57/* "svl" */,-60 , 58/* "motors" */,-60 , 59/* "while" */,-60 , 60/* "do" */,-60 , 61/* "call" */,-60 , 65/* "setlocal" */,-60 , 66/* "getlocal" */,-60 , 67/* "settemp" */,-60 , 68/* "gettemp" */,-60 , 69/* "getparam" */,-60 , 79/* "sensor" */,-60 , 85/* "Sensorn" */,-60 , 80/* "switch" */,-60 , 86/* "Switchn" */,-60 , 81/* "push" */,-60 , 82/* "pop" */,-60 , 83/* "enter" */,-60 , 84/* "leave" */,-60 , 3/* "byte" */,-60 , 4/* "short" */,-60 , 5/* "block" */,-60 ),
	/* State 57 */ new Array( 98/* "$" */,-61 , 90/* "Address" */,-61 , 2/* "begin" */,-61 , 6/* "eob" */,-61 , 7/* "return" */,-61 , 8/* "output" */,-61 , 9/* "repeat" */,-61 , 10/* "if" */,-61 , 11/* "ifelse" */,-61 , 70/* "goto" */,-61 , 12/* "beep" */,-61 , 13/* "waituntil" */,-61 , 14/* "loop" */,-61 , 71/* "for" */,-61 , 15/* "forever" */,-61 , 16/* "wait" */,-61 , 17/* "timer" */,-61 , 18/* "resett" */,-61 , 19/* "send" */,-61 , 73/* "sendn" */,-61 , 20/* "serial" */,-61 , 74/* "serialn" */,-61 , 21/* "NewSerial" */,-61 , 75/* "NewSerialn" */,-61 , 22/* "random" */,-61 , 72/* "randomxy" */,-61 , 23/* "add" */,-61 , 24/* "sub" */,-61 , 25/* "mul" */,-61 , 26/* "div" */,-61 , 27/* "mod" */,-61 , 28/* "eq" */,-61 , 29/* "gt" */,-61 , 30/* "lt" */,-61 , 62/* "le" */,-61 , 63/* "ge" */,-61 , 64/* "ne" */,-61 , 31/* "and" */,-61 , 32/* "or" */,-61 , 33/* "xor" */,-61 , 34/* "not" */,-61 , 35/* "setglobal" */,-61 , 36/* "getglobal" */,-61 , 37/* "aset" */,-61 , 38/* "aget" */,-61 , 39/* "record" */,-61 , 40/* "recall" */,-61 , 41/* "resetdp" */,-61 , 42/* "setdp" */,-61 , 43/* "erase" */,-61 , 44/* "when" */,-61 , 45/* "on" */,-61 , 46/* "onfor" */,-61 , 47/* "off" */,-61 , 48/* "thisway" */,-61 , 49/* "thatway" */,-61 , 50/* "rd" */,-61 , 51/* "setpower" */,-61 , 52/* "brake" */,-61 , 53/* "ledon" */,-61 , 54/* "ledoff" */,-61 , 55/* "setsvh" */,-61 , 56/* "svr" */,-61 , 57/* "svl" */,-61 , 58/* "motors" */,-61 , 59/* "while" */,-61 , 60/* "do" */,-61 , 61/* "call" */,-61 , 65/* "setlocal" */,-61 , 66/* "getlocal" */,-61 , 67/* "settemp" */,-61 , 68/* "gettemp" */,-61 , 69/* "getparam" */,-61 , 79/* "sensor" */,-61 , 85/* "Sensorn" */,-61 , 80/* "switch" */,-61 , 86/* "Switchn" */,-61 , 81/* "push" */,-61 , 82/* "pop" */,-61 , 83/* "enter" */,-61 , 84/* "leave" */,-61 , 3/* "byte" */,-61 , 4/* "short" */,-61 , 5/* "block" */,-61 ),
	/* State 58 */ new Array( 98/* "$" */,-62 , 90/* "Address" */,-62 , 2/* "begin" */,-62 , 6/* "eob" */,-62 , 7/* "return" */,-62 , 8/* "output" */,-62 , 9/* "repeat" */,-62 , 10/* "if" */,-62 , 11/* "ifelse" */,-62 , 70/* "goto" */,-62 , 12/* "beep" */,-62 , 13/* "waituntil" */,-62 , 14/* "loop" */,-62 , 71/* "for" */,-62 , 15/* "forever" */,-62 , 16/* "wait" */,-62 , 17/* "timer" */,-62 , 18/* "resett" */,-62 , 19/* "send" */,-62 , 73/* "sendn" */,-62 , 20/* "serial" */,-62 , 74/* "serialn" */,-62 , 21/* "NewSerial" */,-62 , 75/* "NewSerialn" */,-62 , 22/* "random" */,-62 , 72/* "randomxy" */,-62 , 23/* "add" */,-62 , 24/* "sub" */,-62 , 25/* "mul" */,-62 , 26/* "div" */,-62 , 27/* "mod" */,-62 , 28/* "eq" */,-62 , 29/* "gt" */,-62 , 30/* "lt" */,-62 , 62/* "le" */,-62 , 63/* "ge" */,-62 , 64/* "ne" */,-62 , 31/* "and" */,-62 , 32/* "or" */,-62 , 33/* "xor" */,-62 , 34/* "not" */,-62 , 35/* "setglobal" */,-62 , 36/* "getglobal" */,-62 , 37/* "aset" */,-62 , 38/* "aget" */,-62 , 39/* "record" */,-62 , 40/* "recall" */,-62 , 41/* "resetdp" */,-62 , 42/* "setdp" */,-62 , 43/* "erase" */,-62 , 44/* "when" */,-62 , 45/* "on" */,-62 , 46/* "onfor" */,-62 , 47/* "off" */,-62 , 48/* "thisway" */,-62 , 49/* "thatway" */,-62 , 50/* "rd" */,-62 , 51/* "setpower" */,-62 , 52/* "brake" */,-62 , 53/* "ledon" */,-62 , 54/* "ledoff" */,-62 , 55/* "setsvh" */,-62 , 56/* "svr" */,-62 , 57/* "svl" */,-62 , 58/* "motors" */,-62 , 59/* "while" */,-62 , 60/* "do" */,-62 , 61/* "call" */,-62 , 65/* "setlocal" */,-62 , 66/* "getlocal" */,-62 , 67/* "settemp" */,-62 , 68/* "gettemp" */,-62 , 69/* "getparam" */,-62 , 79/* "sensor" */,-62 , 85/* "Sensorn" */,-62 , 80/* "switch" */,-62 , 86/* "Switchn" */,-62 , 81/* "push" */,-62 , 82/* "pop" */,-62 , 83/* "enter" */,-62 , 84/* "leave" */,-62 , 3/* "byte" */,-62 , 4/* "short" */,-62 , 5/* "block" */,-62 ),
	/* State 59 */ new Array( 98/* "$" */,-63 , 90/* "Address" */,-63 , 2/* "begin" */,-63 , 6/* "eob" */,-63 , 7/* "return" */,-63 , 8/* "output" */,-63 , 9/* "repeat" */,-63 , 10/* "if" */,-63 , 11/* "ifelse" */,-63 , 70/* "goto" */,-63 , 12/* "beep" */,-63 , 13/* "waituntil" */,-63 , 14/* "loop" */,-63 , 71/* "for" */,-63 , 15/* "forever" */,-63 , 16/* "wait" */,-63 , 17/* "timer" */,-63 , 18/* "resett" */,-63 , 19/* "send" */,-63 , 73/* "sendn" */,-63 , 20/* "serial" */,-63 , 74/* "serialn" */,-63 , 21/* "NewSerial" */,-63 , 75/* "NewSerialn" */,-63 , 22/* "random" */,-63 , 72/* "randomxy" */,-63 , 23/* "add" */,-63 , 24/* "sub" */,-63 , 25/* "mul" */,-63 , 26/* "div" */,-63 , 27/* "mod" */,-63 , 28/* "eq" */,-63 , 29/* "gt" */,-63 , 30/* "lt" */,-63 , 62/* "le" */,-63 , 63/* "ge" */,-63 , 64/* "ne" */,-63 , 31/* "and" */,-63 , 32/* "or" */,-63 , 33/* "xor" */,-63 , 34/* "not" */,-63 , 35/* "setglobal" */,-63 , 36/* "getglobal" */,-63 , 37/* "aset" */,-63 , 38/* "aget" */,-63 , 39/* "record" */,-63 , 40/* "recall" */,-63 , 41/* "resetdp" */,-63 , 42/* "setdp" */,-63 , 43/* "erase" */,-63 , 44/* "when" */,-63 , 45/* "on" */,-63 , 46/* "onfor" */,-63 , 47/* "off" */,-63 , 48/* "thisway" */,-63 , 49/* "thatway" */,-63 , 50/* "rd" */,-63 , 51/* "setpower" */,-63 , 52/* "brake" */,-63 , 53/* "ledon" */,-63 , 54/* "ledoff" */,-63 , 55/* "setsvh" */,-63 , 56/* "svr" */,-63 , 57/* "svl" */,-63 , 58/* "motors" */,-63 , 59/* "while" */,-63 , 60/* "do" */,-63 , 61/* "call" */,-63 , 65/* "setlocal" */,-63 , 66/* "getlocal" */,-63 , 67/* "settemp" */,-63 , 68/* "gettemp" */,-63 , 69/* "getparam" */,-63 , 79/* "sensor" */,-63 , 85/* "Sensorn" */,-63 , 80/* "switch" */,-63 , 86/* "Switchn" */,-63 , 81/* "push" */,-63 , 82/* "pop" */,-63 , 83/* "enter" */,-63 , 84/* "leave" */,-63 , 3/* "byte" */,-63 , 4/* "short" */,-63 , 5/* "block" */,-63 ),
	/* State 60 */ new Array( 98/* "$" */,-64 , 90/* "Address" */,-64 , 2/* "begin" */,-64 , 6/* "eob" */,-64 , 7/* "return" */,-64 , 8/* "output" */,-64 , 9/* "repeat" */,-64 , 10/* "if" */,-64 , 11/* "ifelse" */,-64 , 70/* "goto" */,-64 , 12/* "beep" */,-64 , 13/* "waituntil" */,-64 , 14/* "loop" */,-64 , 71/* "for" */,-64 , 15/* "forever" */,-64 , 16/* "wait" */,-64 , 17/* "timer" */,-64 , 18/* "resett" */,-64 , 19/* "send" */,-64 , 73/* "sendn" */,-64 , 20/* "serial" */,-64 , 74/* "serialn" */,-64 , 21/* "NewSerial" */,-64 , 75/* "NewSerialn" */,-64 , 22/* "random" */,-64 , 72/* "randomxy" */,-64 , 23/* "add" */,-64 , 24/* "sub" */,-64 , 25/* "mul" */,-64 , 26/* "div" */,-64 , 27/* "mod" */,-64 , 28/* "eq" */,-64 , 29/* "gt" */,-64 , 30/* "lt" */,-64 , 62/* "le" */,-64 , 63/* "ge" */,-64 , 64/* "ne" */,-64 , 31/* "and" */,-64 , 32/* "or" */,-64 , 33/* "xor" */,-64 , 34/* "not" */,-64 , 35/* "setglobal" */,-64 , 36/* "getglobal" */,-64 , 37/* "aset" */,-64 , 38/* "aget" */,-64 , 39/* "record" */,-64 , 40/* "recall" */,-64 , 41/* "resetdp" */,-64 , 42/* "setdp" */,-64 , 43/* "erase" */,-64 , 44/* "when" */,-64 , 45/* "on" */,-64 , 46/* "onfor" */,-64 , 47/* "off" */,-64 , 48/* "thisway" */,-64 , 49/* "thatway" */,-64 , 50/* "rd" */,-64 , 51/* "setpower" */,-64 , 52/* "brake" */,-64 , 53/* "ledon" */,-64 , 54/* "ledoff" */,-64 , 55/* "setsvh" */,-64 , 56/* "svr" */,-64 , 57/* "svl" */,-64 , 58/* "motors" */,-64 , 59/* "while" */,-64 , 60/* "do" */,-64 , 61/* "call" */,-64 , 65/* "setlocal" */,-64 , 66/* "getlocal" */,-64 , 67/* "settemp" */,-64 , 68/* "gettemp" */,-64 , 69/* "getparam" */,-64 , 79/* "sensor" */,-64 , 85/* "Sensorn" */,-64 , 80/* "switch" */,-64 , 86/* "Switchn" */,-64 , 81/* "push" */,-64 , 82/* "pop" */,-64 , 83/* "enter" */,-64 , 84/* "leave" */,-64 , 3/* "byte" */,-64 , 4/* "short" */,-64 , 5/* "block" */,-64 ),
	/* State 61 */ new Array( 98/* "$" */,-65 , 90/* "Address" */,-65 , 2/* "begin" */,-65 , 6/* "eob" */,-65 , 7/* "return" */,-65 , 8/* "output" */,-65 , 9/* "repeat" */,-65 , 10/* "if" */,-65 , 11/* "ifelse" */,-65 , 70/* "goto" */,-65 , 12/* "beep" */,-65 , 13/* "waituntil" */,-65 , 14/* "loop" */,-65 , 71/* "for" */,-65 , 15/* "forever" */,-65 , 16/* "wait" */,-65 , 17/* "timer" */,-65 , 18/* "resett" */,-65 , 19/* "send" */,-65 , 73/* "sendn" */,-65 , 20/* "serial" */,-65 , 74/* "serialn" */,-65 , 21/* "NewSerial" */,-65 , 75/* "NewSerialn" */,-65 , 22/* "random" */,-65 , 72/* "randomxy" */,-65 , 23/* "add" */,-65 , 24/* "sub" */,-65 , 25/* "mul" */,-65 , 26/* "div" */,-65 , 27/* "mod" */,-65 , 28/* "eq" */,-65 , 29/* "gt" */,-65 , 30/* "lt" */,-65 , 62/* "le" */,-65 , 63/* "ge" */,-65 , 64/* "ne" */,-65 , 31/* "and" */,-65 , 32/* "or" */,-65 , 33/* "xor" */,-65 , 34/* "not" */,-65 , 35/* "setglobal" */,-65 , 36/* "getglobal" */,-65 , 37/* "aset" */,-65 , 38/* "aget" */,-65 , 39/* "record" */,-65 , 40/* "recall" */,-65 , 41/* "resetdp" */,-65 , 42/* "setdp" */,-65 , 43/* "erase" */,-65 , 44/* "when" */,-65 , 45/* "on" */,-65 , 46/* "onfor" */,-65 , 47/* "off" */,-65 , 48/* "thisway" */,-65 , 49/* "thatway" */,-65 , 50/* "rd" */,-65 , 51/* "setpower" */,-65 , 52/* "brake" */,-65 , 53/* "ledon" */,-65 , 54/* "ledoff" */,-65 , 55/* "setsvh" */,-65 , 56/* "svr" */,-65 , 57/* "svl" */,-65 , 58/* "motors" */,-65 , 59/* "while" */,-65 , 60/* "do" */,-65 , 61/* "call" */,-65 , 65/* "setlocal" */,-65 , 66/* "getlocal" */,-65 , 67/* "settemp" */,-65 , 68/* "gettemp" */,-65 , 69/* "getparam" */,-65 , 79/* "sensor" */,-65 , 85/* "Sensorn" */,-65 , 80/* "switch" */,-65 , 86/* "Switchn" */,-65 , 81/* "push" */,-65 , 82/* "pop" */,-65 , 83/* "enter" */,-65 , 84/* "leave" */,-65 , 3/* "byte" */,-65 , 4/* "short" */,-65 , 5/* "block" */,-65 ),
	/* State 62 */ new Array( 98/* "$" */,-66 , 90/* "Address" */,-66 , 2/* "begin" */,-66 , 6/* "eob" */,-66 , 7/* "return" */,-66 , 8/* "output" */,-66 , 9/* "repeat" */,-66 , 10/* "if" */,-66 , 11/* "ifelse" */,-66 , 70/* "goto" */,-66 , 12/* "beep" */,-66 , 13/* "waituntil" */,-66 , 14/* "loop" */,-66 , 71/* "for" */,-66 , 15/* "forever" */,-66 , 16/* "wait" */,-66 , 17/* "timer" */,-66 , 18/* "resett" */,-66 , 19/* "send" */,-66 , 73/* "sendn" */,-66 , 20/* "serial" */,-66 , 74/* "serialn" */,-66 , 21/* "NewSerial" */,-66 , 75/* "NewSerialn" */,-66 , 22/* "random" */,-66 , 72/* "randomxy" */,-66 , 23/* "add" */,-66 , 24/* "sub" */,-66 , 25/* "mul" */,-66 , 26/* "div" */,-66 , 27/* "mod" */,-66 , 28/* "eq" */,-66 , 29/* "gt" */,-66 , 30/* "lt" */,-66 , 62/* "le" */,-66 , 63/* "ge" */,-66 , 64/* "ne" */,-66 , 31/* "and" */,-66 , 32/* "or" */,-66 , 33/* "xor" */,-66 , 34/* "not" */,-66 , 35/* "setglobal" */,-66 , 36/* "getglobal" */,-66 , 37/* "aset" */,-66 , 38/* "aget" */,-66 , 39/* "record" */,-66 , 40/* "recall" */,-66 , 41/* "resetdp" */,-66 , 42/* "setdp" */,-66 , 43/* "erase" */,-66 , 44/* "when" */,-66 , 45/* "on" */,-66 , 46/* "onfor" */,-66 , 47/* "off" */,-66 , 48/* "thisway" */,-66 , 49/* "thatway" */,-66 , 50/* "rd" */,-66 , 51/* "setpower" */,-66 , 52/* "brake" */,-66 , 53/* "ledon" */,-66 , 54/* "ledoff" */,-66 , 55/* "setsvh" */,-66 , 56/* "svr" */,-66 , 57/* "svl" */,-66 , 58/* "motors" */,-66 , 59/* "while" */,-66 , 60/* "do" */,-66 , 61/* "call" */,-66 , 65/* "setlocal" */,-66 , 66/* "getlocal" */,-66 , 67/* "settemp" */,-66 , 68/* "gettemp" */,-66 , 69/* "getparam" */,-66 , 79/* "sensor" */,-66 , 85/* "Sensorn" */,-66 , 80/* "switch" */,-66 , 86/* "Switchn" */,-66 , 81/* "push" */,-66 , 82/* "pop" */,-66 , 83/* "enter" */,-66 , 84/* "leave" */,-66 , 3/* "byte" */,-66 , 4/* "short" */,-66 , 5/* "block" */,-66 ),
	/* State 63 */ new Array( 98/* "$" */,-67 , 90/* "Address" */,-67 , 2/* "begin" */,-67 , 6/* "eob" */,-67 , 7/* "return" */,-67 , 8/* "output" */,-67 , 9/* "repeat" */,-67 , 10/* "if" */,-67 , 11/* "ifelse" */,-67 , 70/* "goto" */,-67 , 12/* "beep" */,-67 , 13/* "waituntil" */,-67 , 14/* "loop" */,-67 , 71/* "for" */,-67 , 15/* "forever" */,-67 , 16/* "wait" */,-67 , 17/* "timer" */,-67 , 18/* "resett" */,-67 , 19/* "send" */,-67 , 73/* "sendn" */,-67 , 20/* "serial" */,-67 , 74/* "serialn" */,-67 , 21/* "NewSerial" */,-67 , 75/* "NewSerialn" */,-67 , 22/* "random" */,-67 , 72/* "randomxy" */,-67 , 23/* "add" */,-67 , 24/* "sub" */,-67 , 25/* "mul" */,-67 , 26/* "div" */,-67 , 27/* "mod" */,-67 , 28/* "eq" */,-67 , 29/* "gt" */,-67 , 30/* "lt" */,-67 , 62/* "le" */,-67 , 63/* "ge" */,-67 , 64/* "ne" */,-67 , 31/* "and" */,-67 , 32/* "or" */,-67 , 33/* "xor" */,-67 , 34/* "not" */,-67 , 35/* "setglobal" */,-67 , 36/* "getglobal" */,-67 , 37/* "aset" */,-67 , 38/* "aget" */,-67 , 39/* "record" */,-67 , 40/* "recall" */,-67 , 41/* "resetdp" */,-67 , 42/* "setdp" */,-67 , 43/* "erase" */,-67 , 44/* "when" */,-67 , 45/* "on" */,-67 , 46/* "onfor" */,-67 , 47/* "off" */,-67 , 48/* "thisway" */,-67 , 49/* "thatway" */,-67 , 50/* "rd" */,-67 , 51/* "setpower" */,-67 , 52/* "brake" */,-67 , 53/* "ledon" */,-67 , 54/* "ledoff" */,-67 , 55/* "setsvh" */,-67 , 56/* "svr" */,-67 , 57/* "svl" */,-67 , 58/* "motors" */,-67 , 59/* "while" */,-67 , 60/* "do" */,-67 , 61/* "call" */,-67 , 65/* "setlocal" */,-67 , 66/* "getlocal" */,-67 , 67/* "settemp" */,-67 , 68/* "gettemp" */,-67 , 69/* "getparam" */,-67 , 79/* "sensor" */,-67 , 85/* "Sensorn" */,-67 , 80/* "switch" */,-67 , 86/* "Switchn" */,-67 , 81/* "push" */,-67 , 82/* "pop" */,-67 , 83/* "enter" */,-67 , 84/* "leave" */,-67 , 3/* "byte" */,-67 , 4/* "short" */,-67 , 5/* "block" */,-67 ),
	/* State 64 */ new Array( 98/* "$" */,-68 , 90/* "Address" */,-68 , 2/* "begin" */,-68 , 6/* "eob" */,-68 , 7/* "return" */,-68 , 8/* "output" */,-68 , 9/* "repeat" */,-68 , 10/* "if" */,-68 , 11/* "ifelse" */,-68 , 70/* "goto" */,-68 , 12/* "beep" */,-68 , 13/* "waituntil" */,-68 , 14/* "loop" */,-68 , 71/* "for" */,-68 , 15/* "forever" */,-68 , 16/* "wait" */,-68 , 17/* "timer" */,-68 , 18/* "resett" */,-68 , 19/* "send" */,-68 , 73/* "sendn" */,-68 , 20/* "serial" */,-68 , 74/* "serialn" */,-68 , 21/* "NewSerial" */,-68 , 75/* "NewSerialn" */,-68 , 22/* "random" */,-68 , 72/* "randomxy" */,-68 , 23/* "add" */,-68 , 24/* "sub" */,-68 , 25/* "mul" */,-68 , 26/* "div" */,-68 , 27/* "mod" */,-68 , 28/* "eq" */,-68 , 29/* "gt" */,-68 , 30/* "lt" */,-68 , 62/* "le" */,-68 , 63/* "ge" */,-68 , 64/* "ne" */,-68 , 31/* "and" */,-68 , 32/* "or" */,-68 , 33/* "xor" */,-68 , 34/* "not" */,-68 , 35/* "setglobal" */,-68 , 36/* "getglobal" */,-68 , 37/* "aset" */,-68 , 38/* "aget" */,-68 , 39/* "record" */,-68 , 40/* "recall" */,-68 , 41/* "resetdp" */,-68 , 42/* "setdp" */,-68 , 43/* "erase" */,-68 , 44/* "when" */,-68 , 45/* "on" */,-68 , 46/* "onfor" */,-68 , 47/* "off" */,-68 , 48/* "thisway" */,-68 , 49/* "thatway" */,-68 , 50/* "rd" */,-68 , 51/* "setpower" */,-68 , 52/* "brake" */,-68 , 53/* "ledon" */,-68 , 54/* "ledoff" */,-68 , 55/* "setsvh" */,-68 , 56/* "svr" */,-68 , 57/* "svl" */,-68 , 58/* "motors" */,-68 , 59/* "while" */,-68 , 60/* "do" */,-68 , 61/* "call" */,-68 , 65/* "setlocal" */,-68 , 66/* "getlocal" */,-68 , 67/* "settemp" */,-68 , 68/* "gettemp" */,-68 , 69/* "getparam" */,-68 , 79/* "sensor" */,-68 , 85/* "Sensorn" */,-68 , 80/* "switch" */,-68 , 86/* "Switchn" */,-68 , 81/* "push" */,-68 , 82/* "pop" */,-68 , 83/* "enter" */,-68 , 84/* "leave" */,-68 , 3/* "byte" */,-68 , 4/* "short" */,-68 , 5/* "block" */,-68 ),
	/* State 65 */ new Array( 98/* "$" */,-69 , 90/* "Address" */,-69 , 2/* "begin" */,-69 , 6/* "eob" */,-69 , 7/* "return" */,-69 , 8/* "output" */,-69 , 9/* "repeat" */,-69 , 10/* "if" */,-69 , 11/* "ifelse" */,-69 , 70/* "goto" */,-69 , 12/* "beep" */,-69 , 13/* "waituntil" */,-69 , 14/* "loop" */,-69 , 71/* "for" */,-69 , 15/* "forever" */,-69 , 16/* "wait" */,-69 , 17/* "timer" */,-69 , 18/* "resett" */,-69 , 19/* "send" */,-69 , 73/* "sendn" */,-69 , 20/* "serial" */,-69 , 74/* "serialn" */,-69 , 21/* "NewSerial" */,-69 , 75/* "NewSerialn" */,-69 , 22/* "random" */,-69 , 72/* "randomxy" */,-69 , 23/* "add" */,-69 , 24/* "sub" */,-69 , 25/* "mul" */,-69 , 26/* "div" */,-69 , 27/* "mod" */,-69 , 28/* "eq" */,-69 , 29/* "gt" */,-69 , 30/* "lt" */,-69 , 62/* "le" */,-69 , 63/* "ge" */,-69 , 64/* "ne" */,-69 , 31/* "and" */,-69 , 32/* "or" */,-69 , 33/* "xor" */,-69 , 34/* "not" */,-69 , 35/* "setglobal" */,-69 , 36/* "getglobal" */,-69 , 37/* "aset" */,-69 , 38/* "aget" */,-69 , 39/* "record" */,-69 , 40/* "recall" */,-69 , 41/* "resetdp" */,-69 , 42/* "setdp" */,-69 , 43/* "erase" */,-69 , 44/* "when" */,-69 , 45/* "on" */,-69 , 46/* "onfor" */,-69 , 47/* "off" */,-69 , 48/* "thisway" */,-69 , 49/* "thatway" */,-69 , 50/* "rd" */,-69 , 51/* "setpower" */,-69 , 52/* "brake" */,-69 , 53/* "ledon" */,-69 , 54/* "ledoff" */,-69 , 55/* "setsvh" */,-69 , 56/* "svr" */,-69 , 57/* "svl" */,-69 , 58/* "motors" */,-69 , 59/* "while" */,-69 , 60/* "do" */,-69 , 61/* "call" */,-69 , 65/* "setlocal" */,-69 , 66/* "getlocal" */,-69 , 67/* "settemp" */,-69 , 68/* "gettemp" */,-69 , 69/* "getparam" */,-69 , 79/* "sensor" */,-69 , 85/* "Sensorn" */,-69 , 80/* "switch" */,-69 , 86/* "Switchn" */,-69 , 81/* "push" */,-69 , 82/* "pop" */,-69 , 83/* "enter" */,-69 , 84/* "leave" */,-69 , 3/* "byte" */,-69 , 4/* "short" */,-69 , 5/* "block" */,-69 ),
	/* State 66 */ new Array( 98/* "$" */,-70 , 90/* "Address" */,-70 , 2/* "begin" */,-70 , 6/* "eob" */,-70 , 7/* "return" */,-70 , 8/* "output" */,-70 , 9/* "repeat" */,-70 , 10/* "if" */,-70 , 11/* "ifelse" */,-70 , 70/* "goto" */,-70 , 12/* "beep" */,-70 , 13/* "waituntil" */,-70 , 14/* "loop" */,-70 , 71/* "for" */,-70 , 15/* "forever" */,-70 , 16/* "wait" */,-70 , 17/* "timer" */,-70 , 18/* "resett" */,-70 , 19/* "send" */,-70 , 73/* "sendn" */,-70 , 20/* "serial" */,-70 , 74/* "serialn" */,-70 , 21/* "NewSerial" */,-70 , 75/* "NewSerialn" */,-70 , 22/* "random" */,-70 , 72/* "randomxy" */,-70 , 23/* "add" */,-70 , 24/* "sub" */,-70 , 25/* "mul" */,-70 , 26/* "div" */,-70 , 27/* "mod" */,-70 , 28/* "eq" */,-70 , 29/* "gt" */,-70 , 30/* "lt" */,-70 , 62/* "le" */,-70 , 63/* "ge" */,-70 , 64/* "ne" */,-70 , 31/* "and" */,-70 , 32/* "or" */,-70 , 33/* "xor" */,-70 , 34/* "not" */,-70 , 35/* "setglobal" */,-70 , 36/* "getglobal" */,-70 , 37/* "aset" */,-70 , 38/* "aget" */,-70 , 39/* "record" */,-70 , 40/* "recall" */,-70 , 41/* "resetdp" */,-70 , 42/* "setdp" */,-70 , 43/* "erase" */,-70 , 44/* "when" */,-70 , 45/* "on" */,-70 , 46/* "onfor" */,-70 , 47/* "off" */,-70 , 48/* "thisway" */,-70 , 49/* "thatway" */,-70 , 50/* "rd" */,-70 , 51/* "setpower" */,-70 , 52/* "brake" */,-70 , 53/* "ledon" */,-70 , 54/* "ledoff" */,-70 , 55/* "setsvh" */,-70 , 56/* "svr" */,-70 , 57/* "svl" */,-70 , 58/* "motors" */,-70 , 59/* "while" */,-70 , 60/* "do" */,-70 , 61/* "call" */,-70 , 65/* "setlocal" */,-70 , 66/* "getlocal" */,-70 , 67/* "settemp" */,-70 , 68/* "gettemp" */,-70 , 69/* "getparam" */,-70 , 79/* "sensor" */,-70 , 85/* "Sensorn" */,-70 , 80/* "switch" */,-70 , 86/* "Switchn" */,-70 , 81/* "push" */,-70 , 82/* "pop" */,-70 , 83/* "enter" */,-70 , 84/* "leave" */,-70 , 3/* "byte" */,-70 , 4/* "short" */,-70 , 5/* "block" */,-70 ),
	/* State 67 */ new Array( 98/* "$" */,-71 , 90/* "Address" */,-71 , 2/* "begin" */,-71 , 6/* "eob" */,-71 , 7/* "return" */,-71 , 8/* "output" */,-71 , 9/* "repeat" */,-71 , 10/* "if" */,-71 , 11/* "ifelse" */,-71 , 70/* "goto" */,-71 , 12/* "beep" */,-71 , 13/* "waituntil" */,-71 , 14/* "loop" */,-71 , 71/* "for" */,-71 , 15/* "forever" */,-71 , 16/* "wait" */,-71 , 17/* "timer" */,-71 , 18/* "resett" */,-71 , 19/* "send" */,-71 , 73/* "sendn" */,-71 , 20/* "serial" */,-71 , 74/* "serialn" */,-71 , 21/* "NewSerial" */,-71 , 75/* "NewSerialn" */,-71 , 22/* "random" */,-71 , 72/* "randomxy" */,-71 , 23/* "add" */,-71 , 24/* "sub" */,-71 , 25/* "mul" */,-71 , 26/* "div" */,-71 , 27/* "mod" */,-71 , 28/* "eq" */,-71 , 29/* "gt" */,-71 , 30/* "lt" */,-71 , 62/* "le" */,-71 , 63/* "ge" */,-71 , 64/* "ne" */,-71 , 31/* "and" */,-71 , 32/* "or" */,-71 , 33/* "xor" */,-71 , 34/* "not" */,-71 , 35/* "setglobal" */,-71 , 36/* "getglobal" */,-71 , 37/* "aset" */,-71 , 38/* "aget" */,-71 , 39/* "record" */,-71 , 40/* "recall" */,-71 , 41/* "resetdp" */,-71 , 42/* "setdp" */,-71 , 43/* "erase" */,-71 , 44/* "when" */,-71 , 45/* "on" */,-71 , 46/* "onfor" */,-71 , 47/* "off" */,-71 , 48/* "thisway" */,-71 , 49/* "thatway" */,-71 , 50/* "rd" */,-71 , 51/* "setpower" */,-71 , 52/* "brake" */,-71 , 53/* "ledon" */,-71 , 54/* "ledoff" */,-71 , 55/* "setsvh" */,-71 , 56/* "svr" */,-71 , 57/* "svl" */,-71 , 58/* "motors" */,-71 , 59/* "while" */,-71 , 60/* "do" */,-71 , 61/* "call" */,-71 , 65/* "setlocal" */,-71 , 66/* "getlocal" */,-71 , 67/* "settemp" */,-71 , 68/* "gettemp" */,-71 , 69/* "getparam" */,-71 , 79/* "sensor" */,-71 , 85/* "Sensorn" */,-71 , 80/* "switch" */,-71 , 86/* "Switchn" */,-71 , 81/* "push" */,-71 , 82/* "pop" */,-71 , 83/* "enter" */,-71 , 84/* "leave" */,-71 , 3/* "byte" */,-71 , 4/* "short" */,-71 , 5/* "block" */,-71 ),
	/* State 68 */ new Array( 98/* "$" */,-72 , 90/* "Address" */,-72 , 2/* "begin" */,-72 , 6/* "eob" */,-72 , 7/* "return" */,-72 , 8/* "output" */,-72 , 9/* "repeat" */,-72 , 10/* "if" */,-72 , 11/* "ifelse" */,-72 , 70/* "goto" */,-72 , 12/* "beep" */,-72 , 13/* "waituntil" */,-72 , 14/* "loop" */,-72 , 71/* "for" */,-72 , 15/* "forever" */,-72 , 16/* "wait" */,-72 , 17/* "timer" */,-72 , 18/* "resett" */,-72 , 19/* "send" */,-72 , 73/* "sendn" */,-72 , 20/* "serial" */,-72 , 74/* "serialn" */,-72 , 21/* "NewSerial" */,-72 , 75/* "NewSerialn" */,-72 , 22/* "random" */,-72 , 72/* "randomxy" */,-72 , 23/* "add" */,-72 , 24/* "sub" */,-72 , 25/* "mul" */,-72 , 26/* "div" */,-72 , 27/* "mod" */,-72 , 28/* "eq" */,-72 , 29/* "gt" */,-72 , 30/* "lt" */,-72 , 62/* "le" */,-72 , 63/* "ge" */,-72 , 64/* "ne" */,-72 , 31/* "and" */,-72 , 32/* "or" */,-72 , 33/* "xor" */,-72 , 34/* "not" */,-72 , 35/* "setglobal" */,-72 , 36/* "getglobal" */,-72 , 37/* "aset" */,-72 , 38/* "aget" */,-72 , 39/* "record" */,-72 , 40/* "recall" */,-72 , 41/* "resetdp" */,-72 , 42/* "setdp" */,-72 , 43/* "erase" */,-72 , 44/* "when" */,-72 , 45/* "on" */,-72 , 46/* "onfor" */,-72 , 47/* "off" */,-72 , 48/* "thisway" */,-72 , 49/* "thatway" */,-72 , 50/* "rd" */,-72 , 51/* "setpower" */,-72 , 52/* "brake" */,-72 , 53/* "ledon" */,-72 , 54/* "ledoff" */,-72 , 55/* "setsvh" */,-72 , 56/* "svr" */,-72 , 57/* "svl" */,-72 , 58/* "motors" */,-72 , 59/* "while" */,-72 , 60/* "do" */,-72 , 61/* "call" */,-72 , 65/* "setlocal" */,-72 , 66/* "getlocal" */,-72 , 67/* "settemp" */,-72 , 68/* "gettemp" */,-72 , 69/* "getparam" */,-72 , 79/* "sensor" */,-72 , 85/* "Sensorn" */,-72 , 80/* "switch" */,-72 , 86/* "Switchn" */,-72 , 81/* "push" */,-72 , 82/* "pop" */,-72 , 83/* "enter" */,-72 , 84/* "leave" */,-72 , 3/* "byte" */,-72 , 4/* "short" */,-72 , 5/* "block" */,-72 ),
	/* State 69 */ new Array( 98/* "$" */,-73 , 90/* "Address" */,-73 , 2/* "begin" */,-73 , 6/* "eob" */,-73 , 7/* "return" */,-73 , 8/* "output" */,-73 , 9/* "repeat" */,-73 , 10/* "if" */,-73 , 11/* "ifelse" */,-73 , 70/* "goto" */,-73 , 12/* "beep" */,-73 , 13/* "waituntil" */,-73 , 14/* "loop" */,-73 , 71/* "for" */,-73 , 15/* "forever" */,-73 , 16/* "wait" */,-73 , 17/* "timer" */,-73 , 18/* "resett" */,-73 , 19/* "send" */,-73 , 73/* "sendn" */,-73 , 20/* "serial" */,-73 , 74/* "serialn" */,-73 , 21/* "NewSerial" */,-73 , 75/* "NewSerialn" */,-73 , 22/* "random" */,-73 , 72/* "randomxy" */,-73 , 23/* "add" */,-73 , 24/* "sub" */,-73 , 25/* "mul" */,-73 , 26/* "div" */,-73 , 27/* "mod" */,-73 , 28/* "eq" */,-73 , 29/* "gt" */,-73 , 30/* "lt" */,-73 , 62/* "le" */,-73 , 63/* "ge" */,-73 , 64/* "ne" */,-73 , 31/* "and" */,-73 , 32/* "or" */,-73 , 33/* "xor" */,-73 , 34/* "not" */,-73 , 35/* "setglobal" */,-73 , 36/* "getglobal" */,-73 , 37/* "aset" */,-73 , 38/* "aget" */,-73 , 39/* "record" */,-73 , 40/* "recall" */,-73 , 41/* "resetdp" */,-73 , 42/* "setdp" */,-73 , 43/* "erase" */,-73 , 44/* "when" */,-73 , 45/* "on" */,-73 , 46/* "onfor" */,-73 , 47/* "off" */,-73 , 48/* "thisway" */,-73 , 49/* "thatway" */,-73 , 50/* "rd" */,-73 , 51/* "setpower" */,-73 , 52/* "brake" */,-73 , 53/* "ledon" */,-73 , 54/* "ledoff" */,-73 , 55/* "setsvh" */,-73 , 56/* "svr" */,-73 , 57/* "svl" */,-73 , 58/* "motors" */,-73 , 59/* "while" */,-73 , 60/* "do" */,-73 , 61/* "call" */,-73 , 65/* "setlocal" */,-73 , 66/* "getlocal" */,-73 , 67/* "settemp" */,-73 , 68/* "gettemp" */,-73 , 69/* "getparam" */,-73 , 79/* "sensor" */,-73 , 85/* "Sensorn" */,-73 , 80/* "switch" */,-73 , 86/* "Switchn" */,-73 , 81/* "push" */,-73 , 82/* "pop" */,-73 , 83/* "enter" */,-73 , 84/* "leave" */,-73 , 3/* "byte" */,-73 , 4/* "short" */,-73 , 5/* "block" */,-73 ),
	/* State 70 */ new Array( 98/* "$" */,-74 , 90/* "Address" */,-74 , 2/* "begin" */,-74 , 6/* "eob" */,-74 , 7/* "return" */,-74 , 8/* "output" */,-74 , 9/* "repeat" */,-74 , 10/* "if" */,-74 , 11/* "ifelse" */,-74 , 70/* "goto" */,-74 , 12/* "beep" */,-74 , 13/* "waituntil" */,-74 , 14/* "loop" */,-74 , 71/* "for" */,-74 , 15/* "forever" */,-74 , 16/* "wait" */,-74 , 17/* "timer" */,-74 , 18/* "resett" */,-74 , 19/* "send" */,-74 , 73/* "sendn" */,-74 , 20/* "serial" */,-74 , 74/* "serialn" */,-74 , 21/* "NewSerial" */,-74 , 75/* "NewSerialn" */,-74 , 22/* "random" */,-74 , 72/* "randomxy" */,-74 , 23/* "add" */,-74 , 24/* "sub" */,-74 , 25/* "mul" */,-74 , 26/* "div" */,-74 , 27/* "mod" */,-74 , 28/* "eq" */,-74 , 29/* "gt" */,-74 , 30/* "lt" */,-74 , 62/* "le" */,-74 , 63/* "ge" */,-74 , 64/* "ne" */,-74 , 31/* "and" */,-74 , 32/* "or" */,-74 , 33/* "xor" */,-74 , 34/* "not" */,-74 , 35/* "setglobal" */,-74 , 36/* "getglobal" */,-74 , 37/* "aset" */,-74 , 38/* "aget" */,-74 , 39/* "record" */,-74 , 40/* "recall" */,-74 , 41/* "resetdp" */,-74 , 42/* "setdp" */,-74 , 43/* "erase" */,-74 , 44/* "when" */,-74 , 45/* "on" */,-74 , 46/* "onfor" */,-74 , 47/* "off" */,-74 , 48/* "thisway" */,-74 , 49/* "thatway" */,-74 , 50/* "rd" */,-74 , 51/* "setpower" */,-74 , 52/* "brake" */,-74 , 53/* "ledon" */,-74 , 54/* "ledoff" */,-74 , 55/* "setsvh" */,-74 , 56/* "svr" */,-74 , 57/* "svl" */,-74 , 58/* "motors" */,-74 , 59/* "while" */,-74 , 60/* "do" */,-74 , 61/* "call" */,-74 , 65/* "setlocal" */,-74 , 66/* "getlocal" */,-74 , 67/* "settemp" */,-74 , 68/* "gettemp" */,-74 , 69/* "getparam" */,-74 , 79/* "sensor" */,-74 , 85/* "Sensorn" */,-74 , 80/* "switch" */,-74 , 86/* "Switchn" */,-74 , 81/* "push" */,-74 , 82/* "pop" */,-74 , 83/* "enter" */,-74 , 84/* "leave" */,-74 , 3/* "byte" */,-74 , 4/* "short" */,-74 , 5/* "block" */,-74 ),
	/* State 71 */ new Array( 98/* "$" */,-75 , 90/* "Address" */,-75 , 2/* "begin" */,-75 , 6/* "eob" */,-75 , 7/* "return" */,-75 , 8/* "output" */,-75 , 9/* "repeat" */,-75 , 10/* "if" */,-75 , 11/* "ifelse" */,-75 , 70/* "goto" */,-75 , 12/* "beep" */,-75 , 13/* "waituntil" */,-75 , 14/* "loop" */,-75 , 71/* "for" */,-75 , 15/* "forever" */,-75 , 16/* "wait" */,-75 , 17/* "timer" */,-75 , 18/* "resett" */,-75 , 19/* "send" */,-75 , 73/* "sendn" */,-75 , 20/* "serial" */,-75 , 74/* "serialn" */,-75 , 21/* "NewSerial" */,-75 , 75/* "NewSerialn" */,-75 , 22/* "random" */,-75 , 72/* "randomxy" */,-75 , 23/* "add" */,-75 , 24/* "sub" */,-75 , 25/* "mul" */,-75 , 26/* "div" */,-75 , 27/* "mod" */,-75 , 28/* "eq" */,-75 , 29/* "gt" */,-75 , 30/* "lt" */,-75 , 62/* "le" */,-75 , 63/* "ge" */,-75 , 64/* "ne" */,-75 , 31/* "and" */,-75 , 32/* "or" */,-75 , 33/* "xor" */,-75 , 34/* "not" */,-75 , 35/* "setglobal" */,-75 , 36/* "getglobal" */,-75 , 37/* "aset" */,-75 , 38/* "aget" */,-75 , 39/* "record" */,-75 , 40/* "recall" */,-75 , 41/* "resetdp" */,-75 , 42/* "setdp" */,-75 , 43/* "erase" */,-75 , 44/* "when" */,-75 , 45/* "on" */,-75 , 46/* "onfor" */,-75 , 47/* "off" */,-75 , 48/* "thisway" */,-75 , 49/* "thatway" */,-75 , 50/* "rd" */,-75 , 51/* "setpower" */,-75 , 52/* "brake" */,-75 , 53/* "ledon" */,-75 , 54/* "ledoff" */,-75 , 55/* "setsvh" */,-75 , 56/* "svr" */,-75 , 57/* "svl" */,-75 , 58/* "motors" */,-75 , 59/* "while" */,-75 , 60/* "do" */,-75 , 61/* "call" */,-75 , 65/* "setlocal" */,-75 , 66/* "getlocal" */,-75 , 67/* "settemp" */,-75 , 68/* "gettemp" */,-75 , 69/* "getparam" */,-75 , 79/* "sensor" */,-75 , 85/* "Sensorn" */,-75 , 80/* "switch" */,-75 , 86/* "Switchn" */,-75 , 81/* "push" */,-75 , 82/* "pop" */,-75 , 83/* "enter" */,-75 , 84/* "leave" */,-75 , 3/* "byte" */,-75 , 4/* "short" */,-75 , 5/* "block" */,-75 ),
	/* State 72 */ new Array( 98/* "$" */,-76 , 90/* "Address" */,-76 , 2/* "begin" */,-76 , 6/* "eob" */,-76 , 7/* "return" */,-76 , 8/* "output" */,-76 , 9/* "repeat" */,-76 , 10/* "if" */,-76 , 11/* "ifelse" */,-76 , 70/* "goto" */,-76 , 12/* "beep" */,-76 , 13/* "waituntil" */,-76 , 14/* "loop" */,-76 , 71/* "for" */,-76 , 15/* "forever" */,-76 , 16/* "wait" */,-76 , 17/* "timer" */,-76 , 18/* "resett" */,-76 , 19/* "send" */,-76 , 73/* "sendn" */,-76 , 20/* "serial" */,-76 , 74/* "serialn" */,-76 , 21/* "NewSerial" */,-76 , 75/* "NewSerialn" */,-76 , 22/* "random" */,-76 , 72/* "randomxy" */,-76 , 23/* "add" */,-76 , 24/* "sub" */,-76 , 25/* "mul" */,-76 , 26/* "div" */,-76 , 27/* "mod" */,-76 , 28/* "eq" */,-76 , 29/* "gt" */,-76 , 30/* "lt" */,-76 , 62/* "le" */,-76 , 63/* "ge" */,-76 , 64/* "ne" */,-76 , 31/* "and" */,-76 , 32/* "or" */,-76 , 33/* "xor" */,-76 , 34/* "not" */,-76 , 35/* "setglobal" */,-76 , 36/* "getglobal" */,-76 , 37/* "aset" */,-76 , 38/* "aget" */,-76 , 39/* "record" */,-76 , 40/* "recall" */,-76 , 41/* "resetdp" */,-76 , 42/* "setdp" */,-76 , 43/* "erase" */,-76 , 44/* "when" */,-76 , 45/* "on" */,-76 , 46/* "onfor" */,-76 , 47/* "off" */,-76 , 48/* "thisway" */,-76 , 49/* "thatway" */,-76 , 50/* "rd" */,-76 , 51/* "setpower" */,-76 , 52/* "brake" */,-76 , 53/* "ledon" */,-76 , 54/* "ledoff" */,-76 , 55/* "setsvh" */,-76 , 56/* "svr" */,-76 , 57/* "svl" */,-76 , 58/* "motors" */,-76 , 59/* "while" */,-76 , 60/* "do" */,-76 , 61/* "call" */,-76 , 65/* "setlocal" */,-76 , 66/* "getlocal" */,-76 , 67/* "settemp" */,-76 , 68/* "gettemp" */,-76 , 69/* "getparam" */,-76 , 79/* "sensor" */,-76 , 85/* "Sensorn" */,-76 , 80/* "switch" */,-76 , 86/* "Switchn" */,-76 , 81/* "push" */,-76 , 82/* "pop" */,-76 , 83/* "enter" */,-76 , 84/* "leave" */,-76 , 3/* "byte" */,-76 , 4/* "short" */,-76 , 5/* "block" */,-76 ),
	/* State 73 */ new Array( 98/* "$" */,-77 , 90/* "Address" */,-77 , 2/* "begin" */,-77 , 6/* "eob" */,-77 , 7/* "return" */,-77 , 8/* "output" */,-77 , 9/* "repeat" */,-77 , 10/* "if" */,-77 , 11/* "ifelse" */,-77 , 70/* "goto" */,-77 , 12/* "beep" */,-77 , 13/* "waituntil" */,-77 , 14/* "loop" */,-77 , 71/* "for" */,-77 , 15/* "forever" */,-77 , 16/* "wait" */,-77 , 17/* "timer" */,-77 , 18/* "resett" */,-77 , 19/* "send" */,-77 , 73/* "sendn" */,-77 , 20/* "serial" */,-77 , 74/* "serialn" */,-77 , 21/* "NewSerial" */,-77 , 75/* "NewSerialn" */,-77 , 22/* "random" */,-77 , 72/* "randomxy" */,-77 , 23/* "add" */,-77 , 24/* "sub" */,-77 , 25/* "mul" */,-77 , 26/* "div" */,-77 , 27/* "mod" */,-77 , 28/* "eq" */,-77 , 29/* "gt" */,-77 , 30/* "lt" */,-77 , 62/* "le" */,-77 , 63/* "ge" */,-77 , 64/* "ne" */,-77 , 31/* "and" */,-77 , 32/* "or" */,-77 , 33/* "xor" */,-77 , 34/* "not" */,-77 , 35/* "setglobal" */,-77 , 36/* "getglobal" */,-77 , 37/* "aset" */,-77 , 38/* "aget" */,-77 , 39/* "record" */,-77 , 40/* "recall" */,-77 , 41/* "resetdp" */,-77 , 42/* "setdp" */,-77 , 43/* "erase" */,-77 , 44/* "when" */,-77 , 45/* "on" */,-77 , 46/* "onfor" */,-77 , 47/* "off" */,-77 , 48/* "thisway" */,-77 , 49/* "thatway" */,-77 , 50/* "rd" */,-77 , 51/* "setpower" */,-77 , 52/* "brake" */,-77 , 53/* "ledon" */,-77 , 54/* "ledoff" */,-77 , 55/* "setsvh" */,-77 , 56/* "svr" */,-77 , 57/* "svl" */,-77 , 58/* "motors" */,-77 , 59/* "while" */,-77 , 60/* "do" */,-77 , 61/* "call" */,-77 , 65/* "setlocal" */,-77 , 66/* "getlocal" */,-77 , 67/* "settemp" */,-77 , 68/* "gettemp" */,-77 , 69/* "getparam" */,-77 , 79/* "sensor" */,-77 , 85/* "Sensorn" */,-77 , 80/* "switch" */,-77 , 86/* "Switchn" */,-77 , 81/* "push" */,-77 , 82/* "pop" */,-77 , 83/* "enter" */,-77 , 84/* "leave" */,-77 , 3/* "byte" */,-77 , 4/* "short" */,-77 , 5/* "block" */,-77 ),
	/* State 74 */ new Array( 98/* "$" */,-78 , 90/* "Address" */,-78 , 2/* "begin" */,-78 , 6/* "eob" */,-78 , 7/* "return" */,-78 , 8/* "output" */,-78 , 9/* "repeat" */,-78 , 10/* "if" */,-78 , 11/* "ifelse" */,-78 , 70/* "goto" */,-78 , 12/* "beep" */,-78 , 13/* "waituntil" */,-78 , 14/* "loop" */,-78 , 71/* "for" */,-78 , 15/* "forever" */,-78 , 16/* "wait" */,-78 , 17/* "timer" */,-78 , 18/* "resett" */,-78 , 19/* "send" */,-78 , 73/* "sendn" */,-78 , 20/* "serial" */,-78 , 74/* "serialn" */,-78 , 21/* "NewSerial" */,-78 , 75/* "NewSerialn" */,-78 , 22/* "random" */,-78 , 72/* "randomxy" */,-78 , 23/* "add" */,-78 , 24/* "sub" */,-78 , 25/* "mul" */,-78 , 26/* "div" */,-78 , 27/* "mod" */,-78 , 28/* "eq" */,-78 , 29/* "gt" */,-78 , 30/* "lt" */,-78 , 62/* "le" */,-78 , 63/* "ge" */,-78 , 64/* "ne" */,-78 , 31/* "and" */,-78 , 32/* "or" */,-78 , 33/* "xor" */,-78 , 34/* "not" */,-78 , 35/* "setglobal" */,-78 , 36/* "getglobal" */,-78 , 37/* "aset" */,-78 , 38/* "aget" */,-78 , 39/* "record" */,-78 , 40/* "recall" */,-78 , 41/* "resetdp" */,-78 , 42/* "setdp" */,-78 , 43/* "erase" */,-78 , 44/* "when" */,-78 , 45/* "on" */,-78 , 46/* "onfor" */,-78 , 47/* "off" */,-78 , 48/* "thisway" */,-78 , 49/* "thatway" */,-78 , 50/* "rd" */,-78 , 51/* "setpower" */,-78 , 52/* "brake" */,-78 , 53/* "ledon" */,-78 , 54/* "ledoff" */,-78 , 55/* "setsvh" */,-78 , 56/* "svr" */,-78 , 57/* "svl" */,-78 , 58/* "motors" */,-78 , 59/* "while" */,-78 , 60/* "do" */,-78 , 61/* "call" */,-78 , 65/* "setlocal" */,-78 , 66/* "getlocal" */,-78 , 67/* "settemp" */,-78 , 68/* "gettemp" */,-78 , 69/* "getparam" */,-78 , 79/* "sensor" */,-78 , 85/* "Sensorn" */,-78 , 80/* "switch" */,-78 , 86/* "Switchn" */,-78 , 81/* "push" */,-78 , 82/* "pop" */,-78 , 83/* "enter" */,-78 , 84/* "leave" */,-78 , 3/* "byte" */,-78 , 4/* "short" */,-78 , 5/* "block" */,-78 ),
	/* State 75 */ new Array( 98/* "$" */,-79 , 90/* "Address" */,-79 , 2/* "begin" */,-79 , 6/* "eob" */,-79 , 7/* "return" */,-79 , 8/* "output" */,-79 , 9/* "repeat" */,-79 , 10/* "if" */,-79 , 11/* "ifelse" */,-79 , 70/* "goto" */,-79 , 12/* "beep" */,-79 , 13/* "waituntil" */,-79 , 14/* "loop" */,-79 , 71/* "for" */,-79 , 15/* "forever" */,-79 , 16/* "wait" */,-79 , 17/* "timer" */,-79 , 18/* "resett" */,-79 , 19/* "send" */,-79 , 73/* "sendn" */,-79 , 20/* "serial" */,-79 , 74/* "serialn" */,-79 , 21/* "NewSerial" */,-79 , 75/* "NewSerialn" */,-79 , 22/* "random" */,-79 , 72/* "randomxy" */,-79 , 23/* "add" */,-79 , 24/* "sub" */,-79 , 25/* "mul" */,-79 , 26/* "div" */,-79 , 27/* "mod" */,-79 , 28/* "eq" */,-79 , 29/* "gt" */,-79 , 30/* "lt" */,-79 , 62/* "le" */,-79 , 63/* "ge" */,-79 , 64/* "ne" */,-79 , 31/* "and" */,-79 , 32/* "or" */,-79 , 33/* "xor" */,-79 , 34/* "not" */,-79 , 35/* "setglobal" */,-79 , 36/* "getglobal" */,-79 , 37/* "aset" */,-79 , 38/* "aget" */,-79 , 39/* "record" */,-79 , 40/* "recall" */,-79 , 41/* "resetdp" */,-79 , 42/* "setdp" */,-79 , 43/* "erase" */,-79 , 44/* "when" */,-79 , 45/* "on" */,-79 , 46/* "onfor" */,-79 , 47/* "off" */,-79 , 48/* "thisway" */,-79 , 49/* "thatway" */,-79 , 50/* "rd" */,-79 , 51/* "setpower" */,-79 , 52/* "brake" */,-79 , 53/* "ledon" */,-79 , 54/* "ledoff" */,-79 , 55/* "setsvh" */,-79 , 56/* "svr" */,-79 , 57/* "svl" */,-79 , 58/* "motors" */,-79 , 59/* "while" */,-79 , 60/* "do" */,-79 , 61/* "call" */,-79 , 65/* "setlocal" */,-79 , 66/* "getlocal" */,-79 , 67/* "settemp" */,-79 , 68/* "gettemp" */,-79 , 69/* "getparam" */,-79 , 79/* "sensor" */,-79 , 85/* "Sensorn" */,-79 , 80/* "switch" */,-79 , 86/* "Switchn" */,-79 , 81/* "push" */,-79 , 82/* "pop" */,-79 , 83/* "enter" */,-79 , 84/* "leave" */,-79 , 3/* "byte" */,-79 , 4/* "short" */,-79 , 5/* "block" */,-79 ),
	/* State 76 */ new Array( 98/* "$" */,-80 , 90/* "Address" */,-80 , 2/* "begin" */,-80 , 6/* "eob" */,-80 , 7/* "return" */,-80 , 8/* "output" */,-80 , 9/* "repeat" */,-80 , 10/* "if" */,-80 , 11/* "ifelse" */,-80 , 70/* "goto" */,-80 , 12/* "beep" */,-80 , 13/* "waituntil" */,-80 , 14/* "loop" */,-80 , 71/* "for" */,-80 , 15/* "forever" */,-80 , 16/* "wait" */,-80 , 17/* "timer" */,-80 , 18/* "resett" */,-80 , 19/* "send" */,-80 , 73/* "sendn" */,-80 , 20/* "serial" */,-80 , 74/* "serialn" */,-80 , 21/* "NewSerial" */,-80 , 75/* "NewSerialn" */,-80 , 22/* "random" */,-80 , 72/* "randomxy" */,-80 , 23/* "add" */,-80 , 24/* "sub" */,-80 , 25/* "mul" */,-80 , 26/* "div" */,-80 , 27/* "mod" */,-80 , 28/* "eq" */,-80 , 29/* "gt" */,-80 , 30/* "lt" */,-80 , 62/* "le" */,-80 , 63/* "ge" */,-80 , 64/* "ne" */,-80 , 31/* "and" */,-80 , 32/* "or" */,-80 , 33/* "xor" */,-80 , 34/* "not" */,-80 , 35/* "setglobal" */,-80 , 36/* "getglobal" */,-80 , 37/* "aset" */,-80 , 38/* "aget" */,-80 , 39/* "record" */,-80 , 40/* "recall" */,-80 , 41/* "resetdp" */,-80 , 42/* "setdp" */,-80 , 43/* "erase" */,-80 , 44/* "when" */,-80 , 45/* "on" */,-80 , 46/* "onfor" */,-80 , 47/* "off" */,-80 , 48/* "thisway" */,-80 , 49/* "thatway" */,-80 , 50/* "rd" */,-80 , 51/* "setpower" */,-80 , 52/* "brake" */,-80 , 53/* "ledon" */,-80 , 54/* "ledoff" */,-80 , 55/* "setsvh" */,-80 , 56/* "svr" */,-80 , 57/* "svl" */,-80 , 58/* "motors" */,-80 , 59/* "while" */,-80 , 60/* "do" */,-80 , 61/* "call" */,-80 , 65/* "setlocal" */,-80 , 66/* "getlocal" */,-80 , 67/* "settemp" */,-80 , 68/* "gettemp" */,-80 , 69/* "getparam" */,-80 , 79/* "sensor" */,-80 , 85/* "Sensorn" */,-80 , 80/* "switch" */,-80 , 86/* "Switchn" */,-80 , 81/* "push" */,-80 , 82/* "pop" */,-80 , 83/* "enter" */,-80 , 84/* "leave" */,-80 , 3/* "byte" */,-80 , 4/* "short" */,-80 , 5/* "block" */,-80 ),
	/* State 77 */ new Array( 98/* "$" */,-81 , 90/* "Address" */,-81 , 2/* "begin" */,-81 , 6/* "eob" */,-81 , 7/* "return" */,-81 , 8/* "output" */,-81 , 9/* "repeat" */,-81 , 10/* "if" */,-81 , 11/* "ifelse" */,-81 , 70/* "goto" */,-81 , 12/* "beep" */,-81 , 13/* "waituntil" */,-81 , 14/* "loop" */,-81 , 71/* "for" */,-81 , 15/* "forever" */,-81 , 16/* "wait" */,-81 , 17/* "timer" */,-81 , 18/* "resett" */,-81 , 19/* "send" */,-81 , 73/* "sendn" */,-81 , 20/* "serial" */,-81 , 74/* "serialn" */,-81 , 21/* "NewSerial" */,-81 , 75/* "NewSerialn" */,-81 , 22/* "random" */,-81 , 72/* "randomxy" */,-81 , 23/* "add" */,-81 , 24/* "sub" */,-81 , 25/* "mul" */,-81 , 26/* "div" */,-81 , 27/* "mod" */,-81 , 28/* "eq" */,-81 , 29/* "gt" */,-81 , 30/* "lt" */,-81 , 62/* "le" */,-81 , 63/* "ge" */,-81 , 64/* "ne" */,-81 , 31/* "and" */,-81 , 32/* "or" */,-81 , 33/* "xor" */,-81 , 34/* "not" */,-81 , 35/* "setglobal" */,-81 , 36/* "getglobal" */,-81 , 37/* "aset" */,-81 , 38/* "aget" */,-81 , 39/* "record" */,-81 , 40/* "recall" */,-81 , 41/* "resetdp" */,-81 , 42/* "setdp" */,-81 , 43/* "erase" */,-81 , 44/* "when" */,-81 , 45/* "on" */,-81 , 46/* "onfor" */,-81 , 47/* "off" */,-81 , 48/* "thisway" */,-81 , 49/* "thatway" */,-81 , 50/* "rd" */,-81 , 51/* "setpower" */,-81 , 52/* "brake" */,-81 , 53/* "ledon" */,-81 , 54/* "ledoff" */,-81 , 55/* "setsvh" */,-81 , 56/* "svr" */,-81 , 57/* "svl" */,-81 , 58/* "motors" */,-81 , 59/* "while" */,-81 , 60/* "do" */,-81 , 61/* "call" */,-81 , 65/* "setlocal" */,-81 , 66/* "getlocal" */,-81 , 67/* "settemp" */,-81 , 68/* "gettemp" */,-81 , 69/* "getparam" */,-81 , 79/* "sensor" */,-81 , 85/* "Sensorn" */,-81 , 80/* "switch" */,-81 , 86/* "Switchn" */,-81 , 81/* "push" */,-81 , 82/* "pop" */,-81 , 83/* "enter" */,-81 , 84/* "leave" */,-81 , 3/* "byte" */,-81 , 4/* "short" */,-81 , 5/* "block" */,-81 ),
	/* State 78 */ new Array( 98/* "$" */,-82 , 90/* "Address" */,-82 , 2/* "begin" */,-82 , 6/* "eob" */,-82 , 7/* "return" */,-82 , 8/* "output" */,-82 , 9/* "repeat" */,-82 , 10/* "if" */,-82 , 11/* "ifelse" */,-82 , 70/* "goto" */,-82 , 12/* "beep" */,-82 , 13/* "waituntil" */,-82 , 14/* "loop" */,-82 , 71/* "for" */,-82 , 15/* "forever" */,-82 , 16/* "wait" */,-82 , 17/* "timer" */,-82 , 18/* "resett" */,-82 , 19/* "send" */,-82 , 73/* "sendn" */,-82 , 20/* "serial" */,-82 , 74/* "serialn" */,-82 , 21/* "NewSerial" */,-82 , 75/* "NewSerialn" */,-82 , 22/* "random" */,-82 , 72/* "randomxy" */,-82 , 23/* "add" */,-82 , 24/* "sub" */,-82 , 25/* "mul" */,-82 , 26/* "div" */,-82 , 27/* "mod" */,-82 , 28/* "eq" */,-82 , 29/* "gt" */,-82 , 30/* "lt" */,-82 , 62/* "le" */,-82 , 63/* "ge" */,-82 , 64/* "ne" */,-82 , 31/* "and" */,-82 , 32/* "or" */,-82 , 33/* "xor" */,-82 , 34/* "not" */,-82 , 35/* "setglobal" */,-82 , 36/* "getglobal" */,-82 , 37/* "aset" */,-82 , 38/* "aget" */,-82 , 39/* "record" */,-82 , 40/* "recall" */,-82 , 41/* "resetdp" */,-82 , 42/* "setdp" */,-82 , 43/* "erase" */,-82 , 44/* "when" */,-82 , 45/* "on" */,-82 , 46/* "onfor" */,-82 , 47/* "off" */,-82 , 48/* "thisway" */,-82 , 49/* "thatway" */,-82 , 50/* "rd" */,-82 , 51/* "setpower" */,-82 , 52/* "brake" */,-82 , 53/* "ledon" */,-82 , 54/* "ledoff" */,-82 , 55/* "setsvh" */,-82 , 56/* "svr" */,-82 , 57/* "svl" */,-82 , 58/* "motors" */,-82 , 59/* "while" */,-82 , 60/* "do" */,-82 , 61/* "call" */,-82 , 65/* "setlocal" */,-82 , 66/* "getlocal" */,-82 , 67/* "settemp" */,-82 , 68/* "gettemp" */,-82 , 69/* "getparam" */,-82 , 79/* "sensor" */,-82 , 85/* "Sensorn" */,-82 , 80/* "switch" */,-82 , 86/* "Switchn" */,-82 , 81/* "push" */,-82 , 82/* "pop" */,-82 , 83/* "enter" */,-82 , 84/* "leave" */,-82 , 3/* "byte" */,-82 , 4/* "short" */,-82 , 5/* "block" */,-82 ),
	/* State 79 */ new Array( 98/* "$" */,-83 , 90/* "Address" */,-83 , 2/* "begin" */,-83 , 6/* "eob" */,-83 , 7/* "return" */,-83 , 8/* "output" */,-83 , 9/* "repeat" */,-83 , 10/* "if" */,-83 , 11/* "ifelse" */,-83 , 70/* "goto" */,-83 , 12/* "beep" */,-83 , 13/* "waituntil" */,-83 , 14/* "loop" */,-83 , 71/* "for" */,-83 , 15/* "forever" */,-83 , 16/* "wait" */,-83 , 17/* "timer" */,-83 , 18/* "resett" */,-83 , 19/* "send" */,-83 , 73/* "sendn" */,-83 , 20/* "serial" */,-83 , 74/* "serialn" */,-83 , 21/* "NewSerial" */,-83 , 75/* "NewSerialn" */,-83 , 22/* "random" */,-83 , 72/* "randomxy" */,-83 , 23/* "add" */,-83 , 24/* "sub" */,-83 , 25/* "mul" */,-83 , 26/* "div" */,-83 , 27/* "mod" */,-83 , 28/* "eq" */,-83 , 29/* "gt" */,-83 , 30/* "lt" */,-83 , 62/* "le" */,-83 , 63/* "ge" */,-83 , 64/* "ne" */,-83 , 31/* "and" */,-83 , 32/* "or" */,-83 , 33/* "xor" */,-83 , 34/* "not" */,-83 , 35/* "setglobal" */,-83 , 36/* "getglobal" */,-83 , 37/* "aset" */,-83 , 38/* "aget" */,-83 , 39/* "record" */,-83 , 40/* "recall" */,-83 , 41/* "resetdp" */,-83 , 42/* "setdp" */,-83 , 43/* "erase" */,-83 , 44/* "when" */,-83 , 45/* "on" */,-83 , 46/* "onfor" */,-83 , 47/* "off" */,-83 , 48/* "thisway" */,-83 , 49/* "thatway" */,-83 , 50/* "rd" */,-83 , 51/* "setpower" */,-83 , 52/* "brake" */,-83 , 53/* "ledon" */,-83 , 54/* "ledoff" */,-83 , 55/* "setsvh" */,-83 , 56/* "svr" */,-83 , 57/* "svl" */,-83 , 58/* "motors" */,-83 , 59/* "while" */,-83 , 60/* "do" */,-83 , 61/* "call" */,-83 , 65/* "setlocal" */,-83 , 66/* "getlocal" */,-83 , 67/* "settemp" */,-83 , 68/* "gettemp" */,-83 , 69/* "getparam" */,-83 , 79/* "sensor" */,-83 , 85/* "Sensorn" */,-83 , 80/* "switch" */,-83 , 86/* "Switchn" */,-83 , 81/* "push" */,-83 , 82/* "pop" */,-83 , 83/* "enter" */,-83 , 84/* "leave" */,-83 , 3/* "byte" */,-83 , 4/* "short" */,-83 , 5/* "block" */,-83 ),
	/* State 80 */ new Array( 98/* "$" */,-84 , 90/* "Address" */,-84 , 2/* "begin" */,-84 , 6/* "eob" */,-84 , 7/* "return" */,-84 , 8/* "output" */,-84 , 9/* "repeat" */,-84 , 10/* "if" */,-84 , 11/* "ifelse" */,-84 , 70/* "goto" */,-84 , 12/* "beep" */,-84 , 13/* "waituntil" */,-84 , 14/* "loop" */,-84 , 71/* "for" */,-84 , 15/* "forever" */,-84 , 16/* "wait" */,-84 , 17/* "timer" */,-84 , 18/* "resett" */,-84 , 19/* "send" */,-84 , 73/* "sendn" */,-84 , 20/* "serial" */,-84 , 74/* "serialn" */,-84 , 21/* "NewSerial" */,-84 , 75/* "NewSerialn" */,-84 , 22/* "random" */,-84 , 72/* "randomxy" */,-84 , 23/* "add" */,-84 , 24/* "sub" */,-84 , 25/* "mul" */,-84 , 26/* "div" */,-84 , 27/* "mod" */,-84 , 28/* "eq" */,-84 , 29/* "gt" */,-84 , 30/* "lt" */,-84 , 62/* "le" */,-84 , 63/* "ge" */,-84 , 64/* "ne" */,-84 , 31/* "and" */,-84 , 32/* "or" */,-84 , 33/* "xor" */,-84 , 34/* "not" */,-84 , 35/* "setglobal" */,-84 , 36/* "getglobal" */,-84 , 37/* "aset" */,-84 , 38/* "aget" */,-84 , 39/* "record" */,-84 , 40/* "recall" */,-84 , 41/* "resetdp" */,-84 , 42/* "setdp" */,-84 , 43/* "erase" */,-84 , 44/* "when" */,-84 , 45/* "on" */,-84 , 46/* "onfor" */,-84 , 47/* "off" */,-84 , 48/* "thisway" */,-84 , 49/* "thatway" */,-84 , 50/* "rd" */,-84 , 51/* "setpower" */,-84 , 52/* "brake" */,-84 , 53/* "ledon" */,-84 , 54/* "ledoff" */,-84 , 55/* "setsvh" */,-84 , 56/* "svr" */,-84 , 57/* "svl" */,-84 , 58/* "motors" */,-84 , 59/* "while" */,-84 , 60/* "do" */,-84 , 61/* "call" */,-84 , 65/* "setlocal" */,-84 , 66/* "getlocal" */,-84 , 67/* "settemp" */,-84 , 68/* "gettemp" */,-84 , 69/* "getparam" */,-84 , 79/* "sensor" */,-84 , 85/* "Sensorn" */,-84 , 80/* "switch" */,-84 , 86/* "Switchn" */,-84 , 81/* "push" */,-84 , 82/* "pop" */,-84 , 83/* "enter" */,-84 , 84/* "leave" */,-84 , 3/* "byte" */,-84 , 4/* "short" */,-84 , 5/* "block" */,-84 ),
	/* State 81 */ new Array( 98/* "$" */,-85 , 90/* "Address" */,-85 , 2/* "begin" */,-85 , 6/* "eob" */,-85 , 7/* "return" */,-85 , 8/* "output" */,-85 , 9/* "repeat" */,-85 , 10/* "if" */,-85 , 11/* "ifelse" */,-85 , 70/* "goto" */,-85 , 12/* "beep" */,-85 , 13/* "waituntil" */,-85 , 14/* "loop" */,-85 , 71/* "for" */,-85 , 15/* "forever" */,-85 , 16/* "wait" */,-85 , 17/* "timer" */,-85 , 18/* "resett" */,-85 , 19/* "send" */,-85 , 73/* "sendn" */,-85 , 20/* "serial" */,-85 , 74/* "serialn" */,-85 , 21/* "NewSerial" */,-85 , 75/* "NewSerialn" */,-85 , 22/* "random" */,-85 , 72/* "randomxy" */,-85 , 23/* "add" */,-85 , 24/* "sub" */,-85 , 25/* "mul" */,-85 , 26/* "div" */,-85 , 27/* "mod" */,-85 , 28/* "eq" */,-85 , 29/* "gt" */,-85 , 30/* "lt" */,-85 , 62/* "le" */,-85 , 63/* "ge" */,-85 , 64/* "ne" */,-85 , 31/* "and" */,-85 , 32/* "or" */,-85 , 33/* "xor" */,-85 , 34/* "not" */,-85 , 35/* "setglobal" */,-85 , 36/* "getglobal" */,-85 , 37/* "aset" */,-85 , 38/* "aget" */,-85 , 39/* "record" */,-85 , 40/* "recall" */,-85 , 41/* "resetdp" */,-85 , 42/* "setdp" */,-85 , 43/* "erase" */,-85 , 44/* "when" */,-85 , 45/* "on" */,-85 , 46/* "onfor" */,-85 , 47/* "off" */,-85 , 48/* "thisway" */,-85 , 49/* "thatway" */,-85 , 50/* "rd" */,-85 , 51/* "setpower" */,-85 , 52/* "brake" */,-85 , 53/* "ledon" */,-85 , 54/* "ledoff" */,-85 , 55/* "setsvh" */,-85 , 56/* "svr" */,-85 , 57/* "svl" */,-85 , 58/* "motors" */,-85 , 59/* "while" */,-85 , 60/* "do" */,-85 , 61/* "call" */,-85 , 65/* "setlocal" */,-85 , 66/* "getlocal" */,-85 , 67/* "settemp" */,-85 , 68/* "gettemp" */,-85 , 69/* "getparam" */,-85 , 79/* "sensor" */,-85 , 85/* "Sensorn" */,-85 , 80/* "switch" */,-85 , 86/* "Switchn" */,-85 , 81/* "push" */,-85 , 82/* "pop" */,-85 , 83/* "enter" */,-85 , 84/* "leave" */,-85 , 3/* "byte" */,-85 , 4/* "short" */,-85 , 5/* "block" */,-85 ),
	/* State 82 */ new Array( 98/* "$" */,-86 , 90/* "Address" */,-86 , 2/* "begin" */,-86 , 6/* "eob" */,-86 , 7/* "return" */,-86 , 8/* "output" */,-86 , 9/* "repeat" */,-86 , 10/* "if" */,-86 , 11/* "ifelse" */,-86 , 70/* "goto" */,-86 , 12/* "beep" */,-86 , 13/* "waituntil" */,-86 , 14/* "loop" */,-86 , 71/* "for" */,-86 , 15/* "forever" */,-86 , 16/* "wait" */,-86 , 17/* "timer" */,-86 , 18/* "resett" */,-86 , 19/* "send" */,-86 , 73/* "sendn" */,-86 , 20/* "serial" */,-86 , 74/* "serialn" */,-86 , 21/* "NewSerial" */,-86 , 75/* "NewSerialn" */,-86 , 22/* "random" */,-86 , 72/* "randomxy" */,-86 , 23/* "add" */,-86 , 24/* "sub" */,-86 , 25/* "mul" */,-86 , 26/* "div" */,-86 , 27/* "mod" */,-86 , 28/* "eq" */,-86 , 29/* "gt" */,-86 , 30/* "lt" */,-86 , 62/* "le" */,-86 , 63/* "ge" */,-86 , 64/* "ne" */,-86 , 31/* "and" */,-86 , 32/* "or" */,-86 , 33/* "xor" */,-86 , 34/* "not" */,-86 , 35/* "setglobal" */,-86 , 36/* "getglobal" */,-86 , 37/* "aset" */,-86 , 38/* "aget" */,-86 , 39/* "record" */,-86 , 40/* "recall" */,-86 , 41/* "resetdp" */,-86 , 42/* "setdp" */,-86 , 43/* "erase" */,-86 , 44/* "when" */,-86 , 45/* "on" */,-86 , 46/* "onfor" */,-86 , 47/* "off" */,-86 , 48/* "thisway" */,-86 , 49/* "thatway" */,-86 , 50/* "rd" */,-86 , 51/* "setpower" */,-86 , 52/* "brake" */,-86 , 53/* "ledon" */,-86 , 54/* "ledoff" */,-86 , 55/* "setsvh" */,-86 , 56/* "svr" */,-86 , 57/* "svl" */,-86 , 58/* "motors" */,-86 , 59/* "while" */,-86 , 60/* "do" */,-86 , 61/* "call" */,-86 , 65/* "setlocal" */,-86 , 66/* "getlocal" */,-86 , 67/* "settemp" */,-86 , 68/* "gettemp" */,-86 , 69/* "getparam" */,-86 , 79/* "sensor" */,-86 , 85/* "Sensorn" */,-86 , 80/* "switch" */,-86 , 86/* "Switchn" */,-86 , 81/* "push" */,-86 , 82/* "pop" */,-86 , 83/* "enter" */,-86 , 84/* "leave" */,-86 , 3/* "byte" */,-86 , 4/* "short" */,-86 , 5/* "block" */,-86 ),
	/* State 83 */ new Array( 98/* "$" */,-87 , 90/* "Address" */,-87 , 2/* "begin" */,-87 , 6/* "eob" */,-87 , 7/* "return" */,-87 , 8/* "output" */,-87 , 9/* "repeat" */,-87 , 10/* "if" */,-87 , 11/* "ifelse" */,-87 , 70/* "goto" */,-87 , 12/* "beep" */,-87 , 13/* "waituntil" */,-87 , 14/* "loop" */,-87 , 71/* "for" */,-87 , 15/* "forever" */,-87 , 16/* "wait" */,-87 , 17/* "timer" */,-87 , 18/* "resett" */,-87 , 19/* "send" */,-87 , 73/* "sendn" */,-87 , 20/* "serial" */,-87 , 74/* "serialn" */,-87 , 21/* "NewSerial" */,-87 , 75/* "NewSerialn" */,-87 , 22/* "random" */,-87 , 72/* "randomxy" */,-87 , 23/* "add" */,-87 , 24/* "sub" */,-87 , 25/* "mul" */,-87 , 26/* "div" */,-87 , 27/* "mod" */,-87 , 28/* "eq" */,-87 , 29/* "gt" */,-87 , 30/* "lt" */,-87 , 62/* "le" */,-87 , 63/* "ge" */,-87 , 64/* "ne" */,-87 , 31/* "and" */,-87 , 32/* "or" */,-87 , 33/* "xor" */,-87 , 34/* "not" */,-87 , 35/* "setglobal" */,-87 , 36/* "getglobal" */,-87 , 37/* "aset" */,-87 , 38/* "aget" */,-87 , 39/* "record" */,-87 , 40/* "recall" */,-87 , 41/* "resetdp" */,-87 , 42/* "setdp" */,-87 , 43/* "erase" */,-87 , 44/* "when" */,-87 , 45/* "on" */,-87 , 46/* "onfor" */,-87 , 47/* "off" */,-87 , 48/* "thisway" */,-87 , 49/* "thatway" */,-87 , 50/* "rd" */,-87 , 51/* "setpower" */,-87 , 52/* "brake" */,-87 , 53/* "ledon" */,-87 , 54/* "ledoff" */,-87 , 55/* "setsvh" */,-87 , 56/* "svr" */,-87 , 57/* "svl" */,-87 , 58/* "motors" */,-87 , 59/* "while" */,-87 , 60/* "do" */,-87 , 61/* "call" */,-87 , 65/* "setlocal" */,-87 , 66/* "getlocal" */,-87 , 67/* "settemp" */,-87 , 68/* "gettemp" */,-87 , 69/* "getparam" */,-87 , 79/* "sensor" */,-87 , 85/* "Sensorn" */,-87 , 80/* "switch" */,-87 , 86/* "Switchn" */,-87 , 81/* "push" */,-87 , 82/* "pop" */,-87 , 83/* "enter" */,-87 , 84/* "leave" */,-87 , 3/* "byte" */,-87 , 4/* "short" */,-87 , 5/* "block" */,-87 ),
	/* State 84 */ new Array( 98/* "$" */,-88 , 90/* "Address" */,-88 , 2/* "begin" */,-88 , 6/* "eob" */,-88 , 7/* "return" */,-88 , 8/* "output" */,-88 , 9/* "repeat" */,-88 , 10/* "if" */,-88 , 11/* "ifelse" */,-88 , 70/* "goto" */,-88 , 12/* "beep" */,-88 , 13/* "waituntil" */,-88 , 14/* "loop" */,-88 , 71/* "for" */,-88 , 15/* "forever" */,-88 , 16/* "wait" */,-88 , 17/* "timer" */,-88 , 18/* "resett" */,-88 , 19/* "send" */,-88 , 73/* "sendn" */,-88 , 20/* "serial" */,-88 , 74/* "serialn" */,-88 , 21/* "NewSerial" */,-88 , 75/* "NewSerialn" */,-88 , 22/* "random" */,-88 , 72/* "randomxy" */,-88 , 23/* "add" */,-88 , 24/* "sub" */,-88 , 25/* "mul" */,-88 , 26/* "div" */,-88 , 27/* "mod" */,-88 , 28/* "eq" */,-88 , 29/* "gt" */,-88 , 30/* "lt" */,-88 , 62/* "le" */,-88 , 63/* "ge" */,-88 , 64/* "ne" */,-88 , 31/* "and" */,-88 , 32/* "or" */,-88 , 33/* "xor" */,-88 , 34/* "not" */,-88 , 35/* "setglobal" */,-88 , 36/* "getglobal" */,-88 , 37/* "aset" */,-88 , 38/* "aget" */,-88 , 39/* "record" */,-88 , 40/* "recall" */,-88 , 41/* "resetdp" */,-88 , 42/* "setdp" */,-88 , 43/* "erase" */,-88 , 44/* "when" */,-88 , 45/* "on" */,-88 , 46/* "onfor" */,-88 , 47/* "off" */,-88 , 48/* "thisway" */,-88 , 49/* "thatway" */,-88 , 50/* "rd" */,-88 , 51/* "setpower" */,-88 , 52/* "brake" */,-88 , 53/* "ledon" */,-88 , 54/* "ledoff" */,-88 , 55/* "setsvh" */,-88 , 56/* "svr" */,-88 , 57/* "svl" */,-88 , 58/* "motors" */,-88 , 59/* "while" */,-88 , 60/* "do" */,-88 , 61/* "call" */,-88 , 65/* "setlocal" */,-88 , 66/* "getlocal" */,-88 , 67/* "settemp" */,-88 , 68/* "gettemp" */,-88 , 69/* "getparam" */,-88 , 79/* "sensor" */,-88 , 85/* "Sensorn" */,-88 , 80/* "switch" */,-88 , 86/* "Switchn" */,-88 , 81/* "push" */,-88 , 82/* "pop" */,-88 , 83/* "enter" */,-88 , 84/* "leave" */,-88 , 3/* "byte" */,-88 , 4/* "short" */,-88 , 5/* "block" */,-88 ),
	/* State 85 */ new Array( 98/* "$" */,-89 , 90/* "Address" */,-89 , 2/* "begin" */,-89 , 6/* "eob" */,-89 , 7/* "return" */,-89 , 8/* "output" */,-89 , 9/* "repeat" */,-89 , 10/* "if" */,-89 , 11/* "ifelse" */,-89 , 70/* "goto" */,-89 , 12/* "beep" */,-89 , 13/* "waituntil" */,-89 , 14/* "loop" */,-89 , 71/* "for" */,-89 , 15/* "forever" */,-89 , 16/* "wait" */,-89 , 17/* "timer" */,-89 , 18/* "resett" */,-89 , 19/* "send" */,-89 , 73/* "sendn" */,-89 , 20/* "serial" */,-89 , 74/* "serialn" */,-89 , 21/* "NewSerial" */,-89 , 75/* "NewSerialn" */,-89 , 22/* "random" */,-89 , 72/* "randomxy" */,-89 , 23/* "add" */,-89 , 24/* "sub" */,-89 , 25/* "mul" */,-89 , 26/* "div" */,-89 , 27/* "mod" */,-89 , 28/* "eq" */,-89 , 29/* "gt" */,-89 , 30/* "lt" */,-89 , 62/* "le" */,-89 , 63/* "ge" */,-89 , 64/* "ne" */,-89 , 31/* "and" */,-89 , 32/* "or" */,-89 , 33/* "xor" */,-89 , 34/* "not" */,-89 , 35/* "setglobal" */,-89 , 36/* "getglobal" */,-89 , 37/* "aset" */,-89 , 38/* "aget" */,-89 , 39/* "record" */,-89 , 40/* "recall" */,-89 , 41/* "resetdp" */,-89 , 42/* "setdp" */,-89 , 43/* "erase" */,-89 , 44/* "when" */,-89 , 45/* "on" */,-89 , 46/* "onfor" */,-89 , 47/* "off" */,-89 , 48/* "thisway" */,-89 , 49/* "thatway" */,-89 , 50/* "rd" */,-89 , 51/* "setpower" */,-89 , 52/* "brake" */,-89 , 53/* "ledon" */,-89 , 54/* "ledoff" */,-89 , 55/* "setsvh" */,-89 , 56/* "svr" */,-89 , 57/* "svl" */,-89 , 58/* "motors" */,-89 , 59/* "while" */,-89 , 60/* "do" */,-89 , 61/* "call" */,-89 , 65/* "setlocal" */,-89 , 66/* "getlocal" */,-89 , 67/* "settemp" */,-89 , 68/* "gettemp" */,-89 , 69/* "getparam" */,-89 , 79/* "sensor" */,-89 , 85/* "Sensorn" */,-89 , 80/* "switch" */,-89 , 86/* "Switchn" */,-89 , 81/* "push" */,-89 , 82/* "pop" */,-89 , 83/* "enter" */,-89 , 84/* "leave" */,-89 , 3/* "byte" */,-89 , 4/* "short" */,-89 , 5/* "block" */,-89 ),
	/* State 86 */ new Array( 87/* "DecInteger" */,90 ),
	/* State 87 */ new Array( 87/* "DecInteger" */,91 ),
	/* State 88 */ new Array( 87/* "DecInteger" */,92 ),
	/* State 89 */ new Array( 98/* "$" */,-3 , 90/* "Address" */,-3 , 2/* "begin" */,-3 , 6/* "eob" */,-3 , 7/* "return" */,-3 , 8/* "output" */,-3 , 9/* "repeat" */,-3 , 10/* "if" */,-3 , 11/* "ifelse" */,-3 , 70/* "goto" */,-3 , 12/* "beep" */,-3 , 13/* "waituntil" */,-3 , 14/* "loop" */,-3 , 71/* "for" */,-3 , 15/* "forever" */,-3 , 16/* "wait" */,-3 , 17/* "timer" */,-3 , 18/* "resett" */,-3 , 19/* "send" */,-3 , 73/* "sendn" */,-3 , 20/* "serial" */,-3 , 74/* "serialn" */,-3 , 21/* "NewSerial" */,-3 , 75/* "NewSerialn" */,-3 , 22/* "random" */,-3 , 72/* "randomxy" */,-3 , 23/* "add" */,-3 , 24/* "sub" */,-3 , 25/* "mul" */,-3 , 26/* "div" */,-3 , 27/* "mod" */,-3 , 28/* "eq" */,-3 , 29/* "gt" */,-3 , 30/* "lt" */,-3 , 62/* "le" */,-3 , 63/* "ge" */,-3 , 64/* "ne" */,-3 , 31/* "and" */,-3 , 32/* "or" */,-3 , 33/* "xor" */,-3 , 34/* "not" */,-3 , 35/* "setglobal" */,-3 , 36/* "getglobal" */,-3 , 37/* "aset" */,-3 , 38/* "aget" */,-3 , 39/* "record" */,-3 , 40/* "recall" */,-3 , 41/* "resetdp" */,-3 , 42/* "setdp" */,-3 , 43/* "erase" */,-3 , 44/* "when" */,-3 , 45/* "on" */,-3 , 46/* "onfor" */,-3 , 47/* "off" */,-3 , 48/* "thisway" */,-3 , 49/* "thatway" */,-3 , 50/* "rd" */,-3 , 51/* "setpower" */,-3 , 52/* "brake" */,-3 , 53/* "ledon" */,-3 , 54/* "ledoff" */,-3 , 55/* "setsvh" */,-3 , 56/* "svr" */,-3 , 57/* "svl" */,-3 , 58/* "motors" */,-3 , 59/* "while" */,-3 , 60/* "do" */,-3 , 61/* "call" */,-3 , 65/* "setlocal" */,-3 , 66/* "getlocal" */,-3 , 67/* "settemp" */,-3 , 68/* "gettemp" */,-3 , 69/* "getparam" */,-3 , 79/* "sensor" */,-3 , 85/* "Sensorn" */,-3 , 80/* "switch" */,-3 , 86/* "Switchn" */,-3 , 81/* "push" */,-3 , 82/* "pop" */,-3 , 83/* "enter" */,-3 , 84/* "leave" */,-3 , 3/* "byte" */,-3 , 4/* "short" */,-3 , 5/* "block" */,-3 ),
	/* State 90 */ new Array( 98/* "$" */,-7 , 90/* "Address" */,-7 , 2/* "begin" */,-7 , 6/* "eob" */,-7 , 7/* "return" */,-7 , 8/* "output" */,-7 , 9/* "repeat" */,-7 , 10/* "if" */,-7 , 11/* "ifelse" */,-7 , 70/* "goto" */,-7 , 12/* "beep" */,-7 , 13/* "waituntil" */,-7 , 14/* "loop" */,-7 , 71/* "for" */,-7 , 15/* "forever" */,-7 , 16/* "wait" */,-7 , 17/* "timer" */,-7 , 18/* "resett" */,-7 , 19/* "send" */,-7 , 73/* "sendn" */,-7 , 20/* "serial" */,-7 , 74/* "serialn" */,-7 , 21/* "NewSerial" */,-7 , 75/* "NewSerialn" */,-7 , 22/* "random" */,-7 , 72/* "randomxy" */,-7 , 23/* "add" */,-7 , 24/* "sub" */,-7 , 25/* "mul" */,-7 , 26/* "div" */,-7 , 27/* "mod" */,-7 , 28/* "eq" */,-7 , 29/* "gt" */,-7 , 30/* "lt" */,-7 , 62/* "le" */,-7 , 63/* "ge" */,-7 , 64/* "ne" */,-7 , 31/* "and" */,-7 , 32/* "or" */,-7 , 33/* "xor" */,-7 , 34/* "not" */,-7 , 35/* "setglobal" */,-7 , 36/* "getglobal" */,-7 , 37/* "aset" */,-7 , 38/* "aget" */,-7 , 39/* "record" */,-7 , 40/* "recall" */,-7 , 41/* "resetdp" */,-7 , 42/* "setdp" */,-7 , 43/* "erase" */,-7 , 44/* "when" */,-7 , 45/* "on" */,-7 , 46/* "onfor" */,-7 , 47/* "off" */,-7 , 48/* "thisway" */,-7 , 49/* "thatway" */,-7 , 50/* "rd" */,-7 , 51/* "setpower" */,-7 , 52/* "brake" */,-7 , 53/* "ledon" */,-7 , 54/* "ledoff" */,-7 , 55/* "setsvh" */,-7 , 56/* "svr" */,-7 , 57/* "svl" */,-7 , 58/* "motors" */,-7 , 59/* "while" */,-7 , 60/* "do" */,-7 , 61/* "call" */,-7 , 65/* "setlocal" */,-7 , 66/* "getlocal" */,-7 , 67/* "settemp" */,-7 , 68/* "gettemp" */,-7 , 69/* "getparam" */,-7 , 79/* "sensor" */,-7 , 85/* "Sensorn" */,-7 , 80/* "switch" */,-7 , 86/* "Switchn" */,-7 , 81/* "push" */,-7 , 82/* "pop" */,-7 , 83/* "enter" */,-7 , 84/* "leave" */,-7 , 3/* "byte" */,-7 , 4/* "short" */,-7 , 5/* "block" */,-7 ),
	/* State 91 */ new Array( 98/* "$" */,-8 , 90/* "Address" */,-8 , 2/* "begin" */,-8 , 6/* "eob" */,-8 , 7/* "return" */,-8 , 8/* "output" */,-8 , 9/* "repeat" */,-8 , 10/* "if" */,-8 , 11/* "ifelse" */,-8 , 70/* "goto" */,-8 , 12/* "beep" */,-8 , 13/* "waituntil" */,-8 , 14/* "loop" */,-8 , 71/* "for" */,-8 , 15/* "forever" */,-8 , 16/* "wait" */,-8 , 17/* "timer" */,-8 , 18/* "resett" */,-8 , 19/* "send" */,-8 , 73/* "sendn" */,-8 , 20/* "serial" */,-8 , 74/* "serialn" */,-8 , 21/* "NewSerial" */,-8 , 75/* "NewSerialn" */,-8 , 22/* "random" */,-8 , 72/* "randomxy" */,-8 , 23/* "add" */,-8 , 24/* "sub" */,-8 , 25/* "mul" */,-8 , 26/* "div" */,-8 , 27/* "mod" */,-8 , 28/* "eq" */,-8 , 29/* "gt" */,-8 , 30/* "lt" */,-8 , 62/* "le" */,-8 , 63/* "ge" */,-8 , 64/* "ne" */,-8 , 31/* "and" */,-8 , 32/* "or" */,-8 , 33/* "xor" */,-8 , 34/* "not" */,-8 , 35/* "setglobal" */,-8 , 36/* "getglobal" */,-8 , 37/* "aset" */,-8 , 38/* "aget" */,-8 , 39/* "record" */,-8 , 40/* "recall" */,-8 , 41/* "resetdp" */,-8 , 42/* "setdp" */,-8 , 43/* "erase" */,-8 , 44/* "when" */,-8 , 45/* "on" */,-8 , 46/* "onfor" */,-8 , 47/* "off" */,-8 , 48/* "thisway" */,-8 , 49/* "thatway" */,-8 , 50/* "rd" */,-8 , 51/* "setpower" */,-8 , 52/* "brake" */,-8 , 53/* "ledon" */,-8 , 54/* "ledoff" */,-8 , 55/* "setsvh" */,-8 , 56/* "svr" */,-8 , 57/* "svl" */,-8 , 58/* "motors" */,-8 , 59/* "while" */,-8 , 60/* "do" */,-8 , 61/* "call" */,-8 , 65/* "setlocal" */,-8 , 66/* "getlocal" */,-8 , 67/* "settemp" */,-8 , 68/* "gettemp" */,-8 , 69/* "getparam" */,-8 , 79/* "sensor" */,-8 , 85/* "Sensorn" */,-8 , 80/* "switch" */,-8 , 86/* "Switchn" */,-8 , 81/* "push" */,-8 , 82/* "pop" */,-8 , 83/* "enter" */,-8 , 84/* "leave" */,-8 , 3/* "byte" */,-8 , 4/* "short" */,-8 , 5/* "block" */,-8 ),
	/* State 92 */ new Array( 98/* "$" */,-9 , 90/* "Address" */,-9 , 2/* "begin" */,-9 , 6/* "eob" */,-9 , 7/* "return" */,-9 , 8/* "output" */,-9 , 9/* "repeat" */,-9 , 10/* "if" */,-9 , 11/* "ifelse" */,-9 , 70/* "goto" */,-9 , 12/* "beep" */,-9 , 13/* "waituntil" */,-9 , 14/* "loop" */,-9 , 71/* "for" */,-9 , 15/* "forever" */,-9 , 16/* "wait" */,-9 , 17/* "timer" */,-9 , 18/* "resett" */,-9 , 19/* "send" */,-9 , 73/* "sendn" */,-9 , 20/* "serial" */,-9 , 74/* "serialn" */,-9 , 21/* "NewSerial" */,-9 , 75/* "NewSerialn" */,-9 , 22/* "random" */,-9 , 72/* "randomxy" */,-9 , 23/* "add" */,-9 , 24/* "sub" */,-9 , 25/* "mul" */,-9 , 26/* "div" */,-9 , 27/* "mod" */,-9 , 28/* "eq" */,-9 , 29/* "gt" */,-9 , 30/* "lt" */,-9 , 62/* "le" */,-9 , 63/* "ge" */,-9 , 64/* "ne" */,-9 , 31/* "and" */,-9 , 32/* "or" */,-9 , 33/* "xor" */,-9 , 34/* "not" */,-9 , 35/* "setglobal" */,-9 , 36/* "getglobal" */,-9 , 37/* "aset" */,-9 , 38/* "aget" */,-9 , 39/* "record" */,-9 , 40/* "recall" */,-9 , 41/* "resetdp" */,-9 , 42/* "setdp" */,-9 , 43/* "erase" */,-9 , 44/* "when" */,-9 , 45/* "on" */,-9 , 46/* "onfor" */,-9 , 47/* "off" */,-9 , 48/* "thisway" */,-9 , 49/* "thatway" */,-9 , 50/* "rd" */,-9 , 51/* "setpower" */,-9 , 52/* "brake" */,-9 , 53/* "ledon" */,-9 , 54/* "ledoff" */,-9 , 55/* "setsvh" */,-9 , 56/* "svr" */,-9 , 57/* "svl" */,-9 , 58/* "motors" */,-9 , 59/* "while" */,-9 , 60/* "do" */,-9 , 61/* "call" */,-9 , 65/* "setlocal" */,-9 , 66/* "getlocal" */,-9 , 67/* "settemp" */,-9 , 68/* "gettemp" */,-9 , 69/* "getparam" */,-9 , 79/* "sensor" */,-9 , 85/* "Sensorn" */,-9 , 80/* "switch" */,-9 , 86/* "Switchn" */,-9 , 81/* "push" */,-9 , 82/* "pop" */,-9 , 83/* "enter" */,-9 , 84/* "leave" */,-9 , 3/* "byte" */,-9 , 4/* "short" */,-9 , 5/* "block" */,-9 )
);

/* Goto-Table */
var goto_tab = new Array(
	/* State 0 */ new Array( 92/* Program */,1 ),
	/* State 1 */ new Array( 93/* Stmt */,2 , 94/* Cmd */,4 , 95/* UnaryCmd */,5 , 96/* BinaryCmd */,6 ),
	/* State 2 */ new Array(  ),
	/* State 3 */ new Array( 94/* Cmd */,89 , 95/* UnaryCmd */,5 , 96/* BinaryCmd */,6 ),
	/* State 4 */ new Array(  ),
	/* State 5 */ new Array(  ),
	/* State 6 */ new Array(  ),
	/* State 7 */ new Array(  ),
	/* State 8 */ new Array(  ),
	/* State 9 */ new Array(  ),
	/* State 10 */ new Array(  ),
	/* State 11 */ new Array(  ),
	/* State 12 */ new Array(  ),
	/* State 13 */ new Array(  ),
	/* State 14 */ new Array(  ),
	/* State 15 */ new Array(  ),
	/* State 16 */ new Array(  ),
	/* State 17 */ new Array(  ),
	/* State 18 */ new Array(  ),
	/* State 19 */ new Array(  ),
	/* State 20 */ new Array(  ),
	/* State 21 */ new Array(  ),
	/* State 22 */ new Array(  ),
	/* State 23 */ new Array(  ),
	/* State 24 */ new Array(  ),
	/* State 25 */ new Array(  ),
	/* State 26 */ new Array(  ),
	/* State 27 */ new Array(  ),
	/* State 28 */ new Array(  ),
	/* State 29 */ new Array(  ),
	/* State 30 */ new Array(  ),
	/* State 31 */ new Array(  ),
	/* State 32 */ new Array(  ),
	/* State 33 */ new Array(  ),
	/* State 34 */ new Array(  ),
	/* State 35 */ new Array(  ),
	/* State 36 */ new Array(  ),
	/* State 37 */ new Array(  ),
	/* State 38 */ new Array(  ),
	/* State 39 */ new Array(  ),
	/* State 40 */ new Array(  ),
	/* State 41 */ new Array(  ),
	/* State 42 */ new Array(  ),
	/* State 43 */ new Array(  ),
	/* State 44 */ new Array(  ),
	/* State 45 */ new Array(  ),
	/* State 46 */ new Array(  ),
	/* State 47 */ new Array(  ),
	/* State 48 */ new Array(  ),
	/* State 49 */ new Array(  ),
	/* State 50 */ new Array(  ),
	/* State 51 */ new Array(  ),
	/* State 52 */ new Array(  ),
	/* State 53 */ new Array(  ),
	/* State 54 */ new Array(  ),
	/* State 55 */ new Array(  ),
	/* State 56 */ new Array(  ),
	/* State 57 */ new Array(  ),
	/* State 58 */ new Array(  ),
	/* State 59 */ new Array(  ),
	/* State 60 */ new Array(  ),
	/* State 61 */ new Array(  ),
	/* State 62 */ new Array(  ),
	/* State 63 */ new Array(  ),
	/* State 64 */ new Array(  ),
	/* State 65 */ new Array(  ),
	/* State 66 */ new Array(  ),
	/* State 67 */ new Array(  ),
	/* State 68 */ new Array(  ),
	/* State 69 */ new Array(  ),
	/* State 70 */ new Array(  ),
	/* State 71 */ new Array(  ),
	/* State 72 */ new Array(  ),
	/* State 73 */ new Array(  ),
	/* State 74 */ new Array(  ),
	/* State 75 */ new Array(  ),
	/* State 76 */ new Array(  ),
	/* State 77 */ new Array(  ),
	/* State 78 */ new Array(  ),
	/* State 79 */ new Array(  ),
	/* State 80 */ new Array(  ),
	/* State 81 */ new Array(  ),
	/* State 82 */ new Array(  ),
	/* State 83 */ new Array(  ),
	/* State 84 */ new Array(  ),
	/* State 85 */ new Array(  ),
	/* State 86 */ new Array(  ),
	/* State 87 */ new Array(  ),
	/* State 88 */ new Array(  ),
	/* State 89 */ new Array(  ),
	/* State 90 */ new Array(  ),
	/* State 91 */ new Array(  ),
	/* State 92 */ new Array(  )
);



/* Symbol labels */
var labels = new Array(
	"Program'" /* Non-terminal symbol */,
	"WHITESPACE" /* Terminal symbol */,
	"begin" /* Terminal symbol */,
	"byte" /* Terminal symbol */,
	"short" /* Terminal symbol */,
	"block" /* Terminal symbol */,
	"eob" /* Terminal symbol */,
	"return" /* Terminal symbol */,
	"output" /* Terminal symbol */,
	"repeat" /* Terminal symbol */,
	"if" /* Terminal symbol */,
	"ifelse" /* Terminal symbol */,
	"beep" /* Terminal symbol */,
	"waituntil" /* Terminal symbol */,
	"loop" /* Terminal symbol */,
	"forever" /* Terminal symbol */,
	"wait" /* Terminal symbol */,
	"timer" /* Terminal symbol */,
	"resett" /* Terminal symbol */,
	"send" /* Terminal symbol */,
	"serial" /* Terminal symbol */,
	"NewSerial" /* Terminal symbol */,
	"random" /* Terminal symbol */,
	"add" /* Terminal symbol */,
	"sub" /* Terminal symbol */,
	"mul" /* Terminal symbol */,
	"div" /* Terminal symbol */,
	"mod" /* Terminal symbol */,
	"eq" /* Terminal symbol */,
	"gt" /* Terminal symbol */,
	"lt" /* Terminal symbol */,
	"and" /* Terminal symbol */,
	"or" /* Terminal symbol */,
	"xor" /* Terminal symbol */,
	"not" /* Terminal symbol */,
	"setglobal" /* Terminal symbol */,
	"getglobal" /* Terminal symbol */,
	"aset" /* Terminal symbol */,
	"aget" /* Terminal symbol */,
	"record" /* Terminal symbol */,
	"recall" /* Terminal symbol */,
	"resetdp" /* Terminal symbol */,
	"setdp" /* Terminal symbol */,
	"erase" /* Terminal symbol */,
	"when" /* Terminal symbol */,
	"on" /* Terminal symbol */,
	"onfor" /* Terminal symbol */,
	"off" /* Terminal symbol */,
	"thisway" /* Terminal symbol */,
	"thatway" /* Terminal symbol */,
	"rd" /* Terminal symbol */,
	"setpower" /* Terminal symbol */,
	"brake" /* Terminal symbol */,
	"ledon" /* Terminal symbol */,
	"ledoff" /* Terminal symbol */,
	"setsvh" /* Terminal symbol */,
	"svr" /* Terminal symbol */,
	"svl" /* Terminal symbol */,
	"motors" /* Terminal symbol */,
	"while" /* Terminal symbol */,
	"do" /* Terminal symbol */,
	"call" /* Terminal symbol */,
	"le" /* Terminal symbol */,
	"ge" /* Terminal symbol */,
	"ne" /* Terminal symbol */,
	"setlocal" /* Terminal symbol */,
	"getlocal" /* Terminal symbol */,
	"settemp" /* Terminal symbol */,
	"gettemp" /* Terminal symbol */,
	"getparam" /* Terminal symbol */,
	"goto" /* Terminal symbol */,
	"for" /* Terminal symbol */,
	"randomxy" /* Terminal symbol */,
	"sendn" /* Terminal symbol */,
	"serialn" /* Terminal symbol */,
	"NewSerialn" /* Terminal symbol */,
	"setsvhn" /* Terminal symbol */,
	"svrn" /* Terminal symbol */,
	"svln" /* Terminal symbol */,
	"sensor" /* Terminal symbol */,
	"switch" /* Terminal symbol */,
	"push" /* Terminal symbol */,
	"pop" /* Terminal symbol */,
	"enter" /* Terminal symbol */,
	"leave" /* Terminal symbol */,
	"Sensorn" /* Terminal symbol */,
	"Switchn" /* Terminal symbol */,
	"DecInteger" /* Terminal symbol */,
	"BinInteger" /* Terminal symbol */,
	"HexInteger" /* Terminal symbol */,
	"Address" /* Terminal symbol */,
	";" /* Terminal symbol */,
	"Program" /* Non-terminal symbol */,
	"Stmt" /* Non-terminal symbol */,
	"Cmd" /* Non-terminal symbol */,
	"UnaryCmd" /* Non-terminal symbol */,
	"BinaryCmd" /* Non-terminal symbol */,
	"Value" /* Non-terminal symbol */,
	"$" /* Terminal symbol */
);


        
        info.offset = 0;
        info.src = src;
        info.att = new String();
        
        if( !err_off )
                err_off = new Array();
        if( !err_la )
        err_la = new Array();
        
        sstack.push( 0 );
        vstack.push( 0 );
        
        la = __BVMlex( info );
                        
        while( true )
        {
                act = 94;
                for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
                {
                        if( act_tab[sstack[sstack.length-1]][i] == la )
                        {
                                act = act_tab[sstack[sstack.length-1]][i+1];
                                break;
                        }
                }

                /*
                _print( "state " + sstack[sstack.length-1] + " la = " + la + " info.att = >" +
                                info.att + "< act = " + act + " src = >" + info.src.substr( info.offset, 30 ) + "..." + "<" +
                                        " sstack = " + sstack.join() );
                */
                
                if( BVM_dbg_withtrace && sstack.length > 0 )
                {
                        __BVMdbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
                                                        "\tLookahead: " + labels[la] + " (\"" + info.att + "\")\n" +
                                                        "\tAction: " + act + "\n" + 
                                                        "\tSource: \"" + info.src.substr( info.offset, 30 ) + ( ( info.offset + 30 < info.src.length ) ?
                                                                        "..." : "" ) + "\"\n" +
                                                        "\tStack: " + sstack.join() + "\n" +
                                                        "\tValue stack: " + vstack.join() + "\n" );
                        
                        if( BVM_dbg_withstepbystep )
                                __BVMdbg_wait();
                }
                
                        
                //Panic-mode: Try recovery when parse-error occurs!
                if( act == 94 )
                {
                        if( BVM_dbg_withtrace )
                                __BVMdbg_print( "Error detected: There is no reduce or shift on the symbol " + labels[la] );
                        
                        err_cnt++;
                        err_off.push( info.offset - info.att.length );                  
                        err_la.push( new Array() );
                        for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
                                err_la[err_la.length-1].push( labels[act_tab[sstack[sstack.length-1]][i]] );
                        
                        //Remember the original stack!
                        var rsstack = new Array();
                        var rvstack = new Array();
                        for( var i = 0; i < sstack.length; i++ )
                        {
                                rsstack[i] = sstack[i];
                                rvstack[i] = vstack[i];
                        }
                        
                        while( act == 94 && la != 98 )
                        {
                                if( BVM_dbg_withtrace )
                                        __BVMdbg_print( "\tError recovery\n" +
                                                                        "Current lookahead: " + labels[la] + " (" + info.att + ")\n" +
                                                                        "Action: " + act + "\n\n" );
                                if( la == -1 )
                                        info.offset++;
                                        
                                while( act == 94 && sstack.length > 0 )
                                {
                                        sstack.pop();
                                        vstack.pop();
                                        
                                        if( sstack.length == 0 )
                                                break;
                                                
                                        act = 94;
                                        for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
                                        {
                                                if( act_tab[sstack[sstack.length-1]][i] == la )
                                                {
                                                        act = act_tab[sstack[sstack.length-1]][i+1];
                                                        break;
                                                }
                                        }
                                }
                                
                                if( act != 94 )
                                        break;
                                
                                for( var i = 0; i < rsstack.length; i++ )
                                {
                                        sstack.push( rsstack[i] );
                                        vstack.push( rvstack[i] );
                                }
                                
                                la = __BVMlex( info );
                        }
                        
                        if( act == 94 )
                        {
                                if( BVM_dbg_withtrace )
                                        __BVMdbg_print( "\tError recovery failed, terminating parse process..." );
                                break;
                        }


                        if( BVM_dbg_withtrace )
                                __BVMdbg_print( "\tError recovery succeeded, continuing" );
                }
                
                /*
                if( act == 94 )
                        break;
                */
                
                
                //Shift
                if( act > 0 )
                {
                        //Parse tree generation
                        if( BVM_dbg_withparsetree )
                        {
                                var node = new treenode();
                                node.sym = labels[ la ];
                                node.att = info.att;
                                node.child = new Array();
                                tree.push( treenodes.length );
                                treenodes.push( node );
                        }
                        
                        if( BVM_dbg_withtrace )
                                __BVMdbg_print( "Shifting symbol: " + labels[la] + " (" + info.att + ")" );
                
                        sstack.push( act );
                        vstack.push( info.att );
                        
                        la = __BVMlex( info );
                        
                        if( BVM_dbg_withtrace )
                                __BVMdbg_print( "\tNew lookahead symbol: " + labels[la] + " (" + info.att + ")" );
                }
                //Reduce
                else
                {               
                        act *= -1;
                        
                        if( BVM_dbg_withtrace )
                                __BVMdbg_print( "Reducing by producution: " + act );
                        
                        rval = void(0);
                        
                        if( BVM_dbg_withtrace )
                                __BVMdbg_print( "\tPerforming semantic action..." );
                        
switch( act )
{
	case 0:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 1:
	{
		 
	}
	break;
	case 2:
	{
		rval = vstack[ vstack.length - 0 ];
	}
	break;
	case 3:
	{
		rval = vstack[ vstack.length - 2 ];
	}
	break;
	case 4:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 5:
	{
		 as.append(vstack[ vstack.length - 1 ]); 
	}
	break;
	case 6:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 7:
	{
		 as.append(vstack[ vstack.length - 2 ]); as.append(vstack[ vstack.length - 1 ]); 
	}
	break;
	case 8:
	{
		 as.append(vstack[ vstack.length - 2 ]); as.append((vstack[ vstack.length - 1 ] >> 8) & 0xff ); as.append(vstack[ vstack.length - 1 ] & 0xff);
	}
	break;
	case 9:
	{
		 as.append(vstack[ vstack.length - 2 ]); as.append(vstack[ vstack.length - 1 ]); 
	}
	break;
	case 10:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 11:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 12:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 13:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 14:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 15:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 16:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 17:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 18:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 19:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 20:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 21:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 22:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 23:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 24:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 25:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 26:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 27:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 28:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 29:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 30:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 31:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 32:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 33:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 34:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 35:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 36:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 37:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 38:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 39:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 40:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 41:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 42:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 43:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 44:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 45:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 46:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 47:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 48:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 49:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 50:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 51:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 52:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 53:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 54:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 55:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 56:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 57:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 58:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 59:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 60:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 61:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 62:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 63:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 64:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 65:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 66:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 67:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 68:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 69:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 70:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 71:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 72:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 73:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 74:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 75:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 76:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 77:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 78:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 79:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 80:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 81:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 82:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 83:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 84:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 85:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 86:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 87:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 88:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 89:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 90:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 91:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 92:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
}


                        
                        if( BVM_dbg_withparsetree )
                                tmptree = new Array();

                        if( BVM_dbg_withtrace )
                                __BVMdbg_print( "\tPopping " + pop_tab[act][1] + " off the stack..." );
                                
                        for( var i = 0; i < pop_tab[act][1]; i++ )
                        {
                                if( BVM_dbg_withparsetree )
                                        tmptree.push( tree.pop() );
                                        
                                sstack.pop();
                                vstack.pop();
                        }
                                                                        
                        go = -1;
                        for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )
                        {
                                if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )
                                {
                                        go = goto_tab[sstack[sstack.length-1]][i+1];
                                        break;
                                }
                        }
                        
                        if( BVM_dbg_withparsetree )
                        {
                                var node = new treenode();
                                node.sym = labels[ pop_tab[act][0] ];
                                node.att = new String();
                                node.child = tmptree.reverse();
                                tree.push( treenodes.length );
                                treenodes.push( node );
                        }
                        
                        if( act == 0 )
                                break;
                                
                        if( BVM_dbg_withtrace )
                                __BVMdbg_print( "\tPushing non-terminal " + labels[ pop_tab[act][0] ] );
                                
                        sstack.push( go );
                        vstack.push( rval );                    
                }
        }

        if( BVM_dbg_withtrace )
                __BVMdbg_print( "\nParse complete." );

        if( BVM_dbg_withparsetree )
        {
                if( err_cnt == 0 )
                {
                        __BVMdbg_print( "\n\n--- Parse tree ---" );
                        __BVMdbg_parsetree( 0, treenodes, tree );
                }
                else
                {
                        __BVMdbg_print( "\n\nParse tree cannot be viewed. There where parse errors." );
                }
        }
        
        return err_cnt;
}


function __BVMdbg_parsetree( indent, nodes, tree )
{
        var str = new String();
        for( var i = 0; i < tree.length; i++ )
        {
                str = "";
                for( var j = indent; j > 0; j-- )
                        str += "\t";
                
                str += nodes[ tree[i] ].sym;
                if( nodes[ tree[i] ].att != "" )
                        str += " >" + nodes[ tree[i] ].att + "<" ;
                        
                __BVMdbg_print( str );
                if( nodes[ tree[i] ].child.length > 0 )
                        __BVMdbg_parsetree( indent + 1, nodes, nodes[ tree[i] ].child );
        }
}



/* comment out the following Windows-specific code when compiling for chrome */
/*
function open_file( file )
{
	var fs = new ActiveXObject( 'Scripting.FileSystemObject' );	
	var src = new String();

	if( fs && fs.fileExists( file ) )
	{
		var f = fs.OpenTextFile( file, 1 );
		if( f )
		{
			src = f.ReadAll();
			f.Close();
		}
	}
	
	return src;
}

function outputHandler(str)
{
	WScript.Echo(str);
}

function errorOutputHandler(str)
{
	WScript.Echo(str);
}

// This code will be called when the generated script is run
if( WScript.Arguments.length > 0 )
{
	var str = open_file( WScript.Arguments(0) );
	
	//as = new CricketAssembler();
	as.parse(str, outputHandler, errorOutputHandler);
}
else
{
	errorOutputHandler( "usage: CricketAssembler.js <filename>" );
}
*/

