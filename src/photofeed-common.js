////////////////////////////////////////////////////////////////////////
//
// photofeed-common.js
//
// Copyright RVJ Callanan 2009-2017
// This is FREE software, released under a permissive MIT license
// For terms of use, see LICENSE file.
//
// This module contains gadget code, common to home and config views
//
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
/////////////////////// General Purpose Functions //////////////////////
////////////////////////////////////////////////////////////////////////

function zn(str)
{
	// Returns string unless it is null in which case it returns empty string
	
	return str === null ? '' : str;
};

////////////////////////////////////////////////////////////////////////

function nz(str)
{
	// Returns string unless it is empty in which case it returns null
	
	return str.length === 0 ? null : str;
};

////////////////////////////////////////////////////////////////////////

function trim(str)
{
	return str.replace(/^\s*/, "").replace(/\s*$/, "");
};

////////////////////////////////////////////////////////////////////////

function nFix2(num)
{
	return ('0' + num).slice(-2);
};

////////////////////////////////////////////////////////////////////////

function nFix3(num)
{
	return ('00' + num).slice(-3);
};

////////////////////////////////////////////////////////////////////////

function lpad3s(v)
{
	// left pad value to fit 3 characters using spaces 
	return ('   ' + v).slice(-3);
};

////////////////////////////////////////////////////////////////////////

function lpad3z(v)
{
	// left pad value to fit 3 characters using zeroes 
	return ('000' + v).slice(-3);
};

////////////////////////////////////////////////////////////////////////

function lpad4s(v)
{
	// left pad value to fit 4 characters using spaces 
	return ('    ' + v).slice(-4);
};

////////////////////////////////////////////////////////////////////////

function lpad4z(v)
{
	// left pad value to fit 4 characters using zeroes 
	return ('0000' + v).slice(-3);
};

////////////////////////////////////////////////////////////////////////

function gel(id)
{
	// shorthand for common function

	return document.getElementById(id);
};

////////////////////////////////////////////////////////////////////////

function strRepeat(str, repeat)
{
	return new Array(repeat+1).join(str);
};

////////////////////////////////////////////////////////////////////////

function tabsToSpaces(str, spacesPerTab)
{
	var spaces;
	
	if (!spacesPerTab) {spacesPerTab = 4;}
	spaces = strRepeat(" ", spacesPerTab);
	 
	return str.replace(/\t/g, spaces);
};

////////////////////////////////////////////////////////////////////////

function htmlEncode(str)
{
	var i;
	var aRet;
	var iC;
	
	i = str.length;
	aRet = [];

	while (i--)
	{
		iC = str[i].charCodeAt();
		
		if (iC < 65 || iC > 127 || (iC > 90 && iC < 97))
		{
			aRet[i] = '&#' + iC +';';
		}
		else
		{
			aRet[i] = str[i];
		}
	}
	
	return aRet.join('');    
};

////////////////////////////////////////////////////////////////////////

function textToHtml(txt)
{	
	var i;
	var html;
		
	html = '';
	txt = txt.split('\n');

	if (txt.length > 0)
	{
		for (i = 0; i < txt.length - 1; i++)
		{
			html += htmlEncode(txt[i]) + '<br/>';
		}

		// last line has no hard break

		html += htmlEncode(txt[i]);
	}
	
	return html;
};

////////////////////////////////////////////////////////////////////////

function writeChars(buf, ofs)
{
	// variadic function writes characters to buffer starting at offset

	var i;
	
	for (i = 2; i < arguments.length; i++)
	{
		for (var j = 0; j < arguments[i].length; j++)
		{
				buf[ofs++] = arguments[i].charAt(j);
		}
	}
};

////////////////////////////////////////////////////////////////////////

function bindEarly()
{
	// Typical Usage:
	// <obj>.onclick = bindEarly(<function>, this, args..);
	
	var args;
	var fn;
	var obj;
	
	args = Array.prototype.slice.call(arguments);
	fn = args.shift();
	obj = args.shift();

	return function() {
		return fn.apply(obj,
			args.concat(Array.prototype.slice.call(arguments)));
	};
};

////////////////////////////////////////////////////////////////////////

function byFilename(a, b)
{
	// sort helper function

    var x = a.filename;
    var y = b.filename;
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
};

////////////////////////////////////////////////////////////////////////

function byTitle(a, b)
{
	// sort helper function

    var x = a.title;
    var y = b.title;
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
};

////////////////////////////////////////////////////////////////////////

function catchUpAndDo(code, wait)
{
	// Allows other tasks to complete before executing code.
	// Typically used to give display a chance to reflect recent updates.
	// This is especially important when status info or color has to be
	// visible to the user immeduately. Do not over-use. This mechanism
	// is only needed when other pending asynchronous tasks do not have
    // sufficient dormancy to achieve the same end more efficiently. The
	// wait time (in mS) should be kept to a minimum. It should be tweaked
	// for the worst-case browser threading model in a particular scenario.
	// This function can also be used with a 1mS wait time to schedule an
	// "immediate" asynchronous function call where it is necessary for
	// the current thread to complete first. Use catchUpAndDo as a wrapper
	// instead of calling setTimeout directly because we may add more
    // functionality to this down the road, e.g. for error handling.
	
	setTimeout(code,wait);
};

////////////////////////////////////////////////////////////////////////

function clean(str)
{
	// Strips off any leading text up to and including a colon
	// and trims any resultant whitespace
	
	var i = str.indexOf(':');
	if (i === -1) {return str;}
	return trim(nz(str.substr(i+1)));
};

////////////////////////////////////////////////////////////////////////

function clearSelection()
{
	// Removes any annoying selection within window
	// e.g. due to inadvertent click=drag by user
	
	if (window.getSelection)
	{
		if (window.getSelection().empty)
		{
			window.getSelection().empty();
		}
		else
		{
			if (window.getSelection().removeAllRanges)
			{
				window.getSelection().removeAllRanges();
			}
		}
	}
	else
	{
		if (document.selection)
		{  
			document.selection.empty();
		}
	}
};

////////////////////////////////////////////////////////////////////////

function enable(id, enabled)
{
	// enable/disable html element with specified id

	var target;
	
	target = gel(id);
	if (target !== null) { target.disabled = !enabled;}
};

////////////////////////////////////////////////////////////////////////

function enableByTag(tag, enabled)
{
	// enable/disable all html elements on page wih specified tag
	var i;
	var nodes = document.getElementsByTagName(tag);
	
	if (!nodes) {return;} 

	for (i=0; i < nodes.length; i++)
	{
		nodes[i].disabled = !enabled;
	}
};

////////////////////////////////////////////////////////////////////////

function enablePage(enabled)
{
	// Enable/disable common inputs (does not cover everything!)
	
	enableByTag('input', enabled);
	enableByTag('select', enabled);
	enableByTag('button', enabled);
};

////////////////////////////////////////////////////////////////////////

function encodeI1(v)
{
	// encode 8-bit interger in 1-byte string

	return String.fromCharCode(v & 255);
};

////////////////////////////////////////////////////////////////////////

function encodeI2(v)
{
	// encode 16-bit integer in 2-byte string (msb first)  

	return String.fromCharCode((v >> 8) & 255, v & 255);
};

////////////////////////////////////////////////////////////////////////

function encodeI2rev(v)
{
	// encode 16-bit integer in 2-byte string (reversed/lsb first)   

	return String.fromCharCode(v & 255, (v >> 8) & 255);
};

////////////////////////////////////////////////////////////////////////

function encodeI4(v)
{
	// encode 32-bit integer in 4-byte string (msb to lsb)

	return String.fromCharCode((v >> 24) & 255, (v >> 16) & 255, (v >> 8) & 255, v & 255);
};

////////////////////////////////////////////////////////////////////////

function encodeI4rev(v)
{
	// encode 32-bit integer in 4-byte string (reversed/lsb to msb)

	return String.fromCharCode(v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >> 24) & 255);
};

////////////////////////////////////////////////////////////////////////

function crc32(buf, ofs, size, seed)
{
	// generates crc32 for data bytes within source buffer
	// source buffer can be an array or string
	// optional seed defaults to 0 if not specified
	// employs well-known efficient lookup table method

	var crc;
	var i;
	var c;

	if (typeof(crc32.table) === 'undefined')
	{
		// initialise static lookup table once

		crc32.table = new Array(256);

		for (i = 0; i < 256; i++)
		{
			c = i;

			for (var j = 0; j < 8; j++)
			{
				if (c & 1)
				{
					c = -306674912 ^ ((c >> 1) & 0x7fffffff);
				}
				else
				{
					c = (c >> 1) & 0x7fffffff;
				}
			}

			crc32.table[i] = c;
		}
	}

	crc = typeof(seed) === 'undefined' ? 0 : seed;
	crc = crc ^ -1;

	for (i = 0; i < size; i += 1)
	{
		crc = crc32.table[(crc ^ buf[ofs + i].charCodeAt(0)) & 0xff] ^ ((crc >> 8) & 0x00ffffff);
	}
	
	return crc ^ -1;
};

////////////////////////////////////////////////////////////////////////

function crc32cat(buf, ofs, size)
{
	// appends crc32 to data bytes within buffer
	// buffer must be a mutable array (not a string)
	// crc bytes (right after data bytes) will be over-written

	var crc = crc32(buf, ofs, size);
	writeChars(buf, ofs + size, encodeI4(crc));
};

////////////////////////////////////////////////////////////////////////

function eventTarget(event)
{
	// cross-browser implementation

	return document.all ? window.event.srcElement : event.target;
};

////////////////////////////////////////////////////////////////////////

function fontMetrics(styleName, elementHeight, fontclass)
{
	// Returns font height and width of a text element based on the
	// overall element height and the style name suffix letters.
	// Last letter is B|N indicating font weight (or width)
	// Second last letter is S|M|L indicating relative size within element.
	// This function employes empirical/guesstimates for our use cases.
	// Height calculation is safe to use across many fonts
	// Width calculatiion depends on optional fontclass argument
	// Fontclass values: standard | material (default = standard)
	// Width is returned as a floating-point value
	
	var m;
	var n;
	var w;
	var z;
	var u;

	m = {width: 0, height: 0, weight: 'normal'};

	fontclass = typeof(fontclass) === 'undefined' ? 'standard' : fontclass;

	ERR.CHK(typeof(styleName) === 'string', 'bad styleName');
	
	n = styleName.length;

	w = styleName.substr(n-1,1);
	z = styleName.substr(n-2,1);
	
	m.weight = w === 'B' ? 'bold' : 'normal';
	
	u = elementHeight/100;

	switch(z)
	{
	case 'S':
		m.height = Math.floor(25 * u);
		break;
	case 'M':
		m.height = Math.floor(50 * u);
		break;
	case 'L':
		m.height = Math.floor(75 * u);
		break;
	default:
		ERR.CHK(false, 'unknown textStyle size', fontclass);
		break;
	}

	switch(fontclass)
	{
	case 'standard':
		m.width = w === 'B' ? m.height * 0.6 : m.height * 0.55;
		break;

	case 'material':
		m.width = w === 'B' ? m.height * 1.5 : m.height * 1.0;
		break;

	default:
		ERR.CHK(false, 'unknown fontclass', fontclass);
		break;
	}

	return m;
};

////////////////////////////////////////////////////////////////////////

function getElementsByTagNameNS(node, ns, name)
{
	var e;
	   
	e = node.getElementsByTagName(ns + ":" + name);
	if (!e || e.length === 0) {e = node.getElementsByTagName(name);}
	if (!e || e.length === 0) {e = node.getElementsByTagNameNS(ns, name);}
	if (!e || e.length === 0) {e = node.getElementsByTagNameNS("*", name);}
	return e;
};

////////////////////////////////////////////////////////////////////////

function getNodeAttribute(node, attribute)
{
	// Consistent cross browser version
	// This may need to be updated!!
	
	return node.getAttribute(attribute);
};

////////////////////////////////////////////////////////////////////////

function getNodeBoolAttribute(node, attribute)
{
	// Consistent cross browser version
	
	var raw;
	
	raw = getNodeAttribute(node, attribute);
	
	switch(raw)
	{
		case 'true':
		case '1':
			return true;

		case 'false':
		case '0':
			return false;

		default:
			return null;
	}
};

////////////////////////////////////////////////////////////////////////

function getNodeText(node)
{
	// This function is separated out to handle potential browser and XML
	// feed quirks. As of now, it is browser and feed agnostic but this
	// may change. One potential bug-bear is "phantom" text nodes containing
	// whitespace. It may be necesary to add some intelligence for scenarios
	// like this. For now, at least, Google Sites feeds seem reliable in this
	// regard. If any hiccups are encountered, a zero-length string is
	// returned. And this can be checked by the caller
	   
	if (!node) {return "";}
	if (!node.childNodes) {return "";}
	if (node.childNodes.length === 0) {return "";}
	if (!node.firstChild) {return "";}
	if (!node.firstChild.nodeValue) {return "";}
	   
	return node.firstChild.nodeValue;	   
};
 
////////////////////////////////////////////////////////////////////////

function hexColor(val)
{
	// Normalises any colour value type to standard six digit hex format.
	// For example, the DOM style object returns colors in unpredictable
	// formats depending on the browser and how color was assigned in the
	// first place, e.g. style.backgroundColor. This function needs to be
	// be fast for use by Col object, colour generator and tracker, so only
	// do basic argument checks. The first time it is called, it will take
	// longer than usual as it initialises its static fast lookup tables.

	var i;
	var x;
	var y;
	
	if (typeof this.hex16 === 'undefined')
	{
		this.hex16 = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
		this.hex256 = new Array(256);
	
		i=0;
		
		for(x=0;x<16;x++)
		{
			for(y=0;y<16;y++)
			{
				this.hex256[i++] = this.hex16[x] + this.hex16[y];
			}
		}
	}
	
	switch(typeof val)
	{
	case 'object':
		// assume array of rgb integers
		return '#' + this.hex256[val[0]] + this.hex256[val[1]] + this.hex256[val[2]];
		
	case 'string':
		if (val.substr(0,3) === 'rgb')
		{		
			val = val.substr(4, val.length - 5).split(',');	
			val[0] = parseInt(val[0],10);
			val[1] = parseInt(val[1],10);
			val[2] = parseInt(val[2],10);
			return '#' + this.hex256[val[0]] + this.hex256[val[1]] + this.hex256[val[2]];
		}
		if (val.substr(0,1) === '#')
		{
			return val.toUpperCase();
		}
		val = parseInt(val,10);
		if (!isNaN(val))
		{
			return '#' + ('00000' + val.toString(16).toUpperCase()).slice(-6);	
		}
		return null;
		
	case 'number':
		return '#' + ('00000' + val.toString(16).toUpperCase()).slice(-6);	
				
	default:
		return null;
	}
};

////////////////////////////////////////////////////////////////////////

function hex2rgba(color, alpha)
{
	// returns rgba formatted 4-channel color

	var r = parseInt('0x' + color.substr(1, 2), 16);
	var g = parseInt('0x' + color.substr(3, 2), 16);
	var b = parseInt('0x' + color.substr(5, 2), 16);

	return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha.toFixed(1) + ')';
}

////////////////////////////////////////////////////////////////////////

function htmlMsg(str)
{
	// returns string as html span with black font and grey background
	// which ensures that message is visible regardless of parent style

 	return '<div style="display:inline-block;color:black;background-color:lightgray;font-size:10px;padding:2px">' + textToHtml(str) + '</div>'; 
};

////////////////////////////////////////////////////////////////////////

function htmlOpacity(percent)
{
	// converts percent opacity to normalised html opacity value string
	return (percent / 100.0).toFixed(1);
};

////////////////////////////////////////////////////////////////////////

function isArray(obj)
{	   
	if ( typeof(obj) === 'object' )
	{
		if (obj.length) {return true;}
	}
				
    return false;
};

////////////////////////////////////////////////////////////////////////

function isArrayMember(item, list)
{	   
	var m;
	
    for (m=0; m < list.length; m++)
	{
        if (item === list[m]) return true;
    }
    return false;
};

////////////////////////////////////////////////////////////////////////

function isArrayOf(obj, type, allowUndefinedItem)
{	
	var i;
	var val;
	   
	if (!allowUndefinedItem) {allowUndefinedItem = false;}
	   
	if ( typeof(obj) === 'object' )
	{
		if (!obj.length) {return false;}
			for (i=0; i<obj.length; i++)
			{
				val = obj[i];
							
				if (val === undefined)
				{
					if (allowUndefinedItem === false) {return false;}
				}
				else
				{				   
					if (typeof(obj[i]) !== type) {return false;}
				}
			}
			return true; 
	}
	return false;
};

////////////////////////////////////////////////////////////////////////

function isColor(val, allowNone)
{
	var rex;
	if (typeof(val) !== 'string') {return false;}
	
	if (val === '')
	{
		if (allowNone) {return true;} else {return false;}
	}
	
	rex = /^#[0-9a-f]{6}$/;  
	if (!rex.test(val.toLowerCase())) {return false;}
	return true;
};

////////////////////////////////////////////////////////////////////////

function isEnabled(id)
{
	var target;
	
	target = gel(id);
	if (target === null) {return null;}
	
	return !target.disabled;
};

////////////////////////////////////////////////////////////////////////

function isObjectMember(name, obj)
{
	var m;
	   
	for(m in obj)
	{
		if (name === m) return true;
	}	
	return false;
};

////////////////////////////////////////////////////////////////////////

function limitArray(items, maxLength)
{
	if (items.length > maxLength)
	{
		items.splice(maxLength, items.length - maxLength);
	}
};

////////////////////////////////////////////////////////////////////////

function listProperties(obj)
{
	// For debugging objects during traversal
	   
	var text;
	var p;
	   
	text = "";
	for(p in obj) {text += (p + "\n");}
	return text;
};

////////////////////////////////////////////////////////////////////////

function pngPattern(fgcolor, styleName, align, bgcolor)
{
	// Generates small PNG image patterns for dynamic embedding
	// background is transparent unless optional bgcolor specified
	
	var sn; 		// styleName length
	var sc;			// style category: dot, cross, spot, etc.
	var sq; 		// style qualifier: S = solid; T = translucent
	var ss; 		// style spacing
	
	var pat;  		// elementary pattern (array of strings)
	var pat_w;  	// pattern width
	var pat_h; 		// pattern height

	var img; 		// png image
	var img_w;  	// image width
	var img_h; 		// image height

	var ofs_x; 		// pattern offset (horizontal) 
	var ofs_y; 		// pattern offset (vertical) 

	var x;  		// image x coordinate
	var y;  		// image y coordinate

	var bgR; 		// background color
	var bgG;  		
	var bgB; 		
	var bgA;
	var bg_index;

	var fgR; 		// foreground color
	var fgG; 
	var fgB;
	var fgA;
	var fg_index;

	var smR;		// smoothing color
	var smG; 
	var smB;
	var smA; 
	var sm_index;
		
	sn = styleName.length;
	
	sc = styleName.substr(0, sn - 2);
	sq = styleName.substr(sn - 2, 1);
	ss = parseInt(styleName.substr(sn - 1, 1), 10);

	// Compute rgba channels for foreground color

	fgR = parseInt('0x' + fgcolor.substr(1, 2), 16);
	fgG = parseInt('0x' + fgcolor.substr(3, 2), 16);
	fgB = parseInt('0x' + fgcolor.substr(5, 2), 16);
	fgA = sq === 'S' ? 255 : 100;

	// Normally rgb channels of transparent background color
	// don't matter. By convention, they are set to white;
	// however, an optional over-ride is supported to address
	// rendering issues with oldish browsers (notably IE)

	if (typeof(bgcolor) === 'undefined')
	{
		bgR = 255;
		bgG = 255;
		bgB = 255;
		bgA = 0;
	}
	else
	{
		bgR = parseInt('0x' + bgcolor.substr(1, 2), 16);
		bgG = parseInt('0x' + bgcolor.substr(3, 2), 16);
		bgB = parseInt('0x' + bgcolor.substr(5, 2), 16);
		bgA = 0;
	}

	// Smoothing color = foreground color lower opacity

	smR = fgR;
	smG = fgG;
	smB = fgB;
	smA = sq === 'S' ? 100 : 50;

	// Elementary patterns using arrays of strings.
	// String characters are interpreted as follows:
	// 'o' = foreground color
	// 's' = smoothing color
	// Any other character interpreted as background.

	// Assertions are used to indicate that pattern is
	// intended to be used with or without spacing.
	// Shadows styles (bottom-right aligned) only use
	// the dot pattern with spacing variations. All
	// other patterns are intended for (centered) mat
	// styles. Even dimensions are preferred for mat
	// styles to ensure pixel-perfect symmetry since
	// image dimensions are usually even. Spacing is
	// also even since it is rendered in multiples of
	// 2 pixels. Naturally odd patterns are quadrupled
	// to obtain even dimensions and pixel-perfect
	// symmetry. While pixel-perfect symmetry is
	// desirable, it is not an absolute necessity.
	// For some patterns, it is not possible and the
	// lack of symmetry is barely noticable e.g. dot
	// pattern with single spacing.

	switch(sc)
	{
		case 'dot':

			// 1 x 1

			ERR.CHK(ss > 0);

			pat = [		'o'		];

		  	break;

		case 'gridA':

			// 6 x 6

			ERR.CHK(ss === 0);

			pat = [		'-o--o-'	,
						'oooooo'	,
						'-o--o-'	,
						'-o--o-'	,
						'oooooo'	,
		  		 		'-o--o-'	];

		  	break;

		case 'gridB':

			// 10 x 10

			ERR.CHK(ss === 0);

			pat = [		'--o----o--'	,
						'--o----o--'	,
						'oooooooooo'	,
						'--o----o--'	,
						'--o----o--'	,
						'--o----o--'	,
						'--o----o--'	,
						'oooooooooo'	,
		  		 		'--o----o--'	,
		  		 		'--o----o--'	];

		  	break;

		case 'gridC':

			// 14 x 14

			ERR.CHK(ss === 0);

			pat = [		'---o------o---'	,
						'---o------o---'	,
						'---o------o---'	,
						'oooooooooooooo'	,
						'---o------o---'	,
						'---o------o---'	,
						'---o------o---'	,
						'---o------o---'	,
						'---o------o---'	,
						'---o------o---'	,
						'oooooooooooooo'	,
						'---o------o---'	,
		  		 		'---o------o---'	,
		  		 		'---o------o---'	];

		  	break;

		case 'diagA':

			// 14 x 14

			ERR.CHK(ss === 0);

			pat = [		's-----ss-----s'	,
						'-o---o--o---o-'	,
						'--o-o----o-o--'	,
						'---o------o---'	,
						'--o-o----o-o--'	,
						'-o---o--o---o-'	,
						's-----ss-----s'	,
						's-----ss-----s'	,
						'-o---o--o---o-'	,
						'--o-o----o-o--'	,
						'---o------o---'	,
						'--o-o----o-o--'	,
						'-o---o--o---o-'	,
						's-----ss-----s'	];

		  	break;

		case 'diagB':

			// 18 x 18

			ERR.CHK(ss === 0);

			pat = [		's-------ss-------s'	,
						'-o-----o--o-----o-'	,
						'--o---o----o---o--'	,
						'---o-o------o-o---'	,
						'----o--------o----'	,
						'---o-o------o-o---'	,
						'--o---o----o---o--'	,
						'-o-----o--o-----o-'	,
						's-------ss-------s'	,
						's-------ss-------s'	,
						'-o-----o--o-----o-'	,
						'--o---o----o---o--'	,
						'---o-o------o-o---'	,
						'----o--------o----'	,
						'---o-o------o-o---'	,
						'--o---o----o---o--'	,
						'-o-----o--o-----o-'	,
						's-------ss-------s'	];

		  	break;

		case 'diagC':

			// 22 x 22

			ERR.CHK(ss === 0);

			pat = [		's---------ss---------s'	,
						'-o-------o--o-------o-'	,
						'--o-----o----o-----o--'	,
						'---o---o------o---o---'	,
						'----o-o--------o-o----'	,
						'-----o----------o-----'	,
						'----o-o--------o-o----'	,
						'---o---o------o---o---'	,
						'--o-----o----o-----o--'	,
						'-o-------o--o-------o-'	,
						's---------ss---------s'	,
						's---------ss---------s'	,
						'-o-------o--o-------o-'	,
						'--o-----o----o-----o--'	,
						'---o---o------o---o---'	,
						'----o-o--------o-o----'	,
						'-----o----------o-----'	,
						'----o-o--------o-o----'	,
						'---o---o------o---o---'	,
						'--o-----o----o-----o--'	,
						'-o-------o--o-------o-'	,
						's---------ss---------s'	];

		  	break;
	
		case 'checkerA':

			// 8 x 8

			ERR.CHK(ss === 0);

			pat = [		'oo----oo'	,
						'oo----oo'	,
						'--oooo--'	,
						'--oooo--'	,
						'--oooo--'	,
						'--oooo--'	,
						'oo----oo'	,
						'oo----oo'	];

		  	break;

		case 'checkerB':

			// 12 x 12

			ERR.CHK(ss === 0);

			pat = [		'ooo------ooo'	,
						'ooo------ooo'	,
						'ooo------ooo'	,
						'---oooooo---'	,
						'---oooooo---'	,
						'---oooooo---'	,
						'---oooooo---'	,
						'---oooooo---'	,
						'---oooooo---'	,
						'ooo------ooo'	,
						'ooo------ooo'	,
						'ooo------ooo'	];

		  	break;

		case 'checkerC':

			// 16 x 16

			ERR.CHK(ss === 0);

			pat = [		'oooo--------oooo'	,
						'oooo--------oooo'	,
						'oooo--------oooo'	,
						'oooo--------oooo'	,
						'----oooooooo----'	,
						'----oooooooo----'	,
						'----oooooooo----'	,
						'----oooooooo----'	,
						'----oooooooo----'	,
						'----oooooooo----'	,
						'----oooooooo----'	,
						'----oooooooo----'	,
						'oooo--------oooo'	,
						'oooo--------oooo'	,
						'oooo--------oooo'	,
						'oooo--------oooo'	];

		  	break;

		case 'weaveA':

			// 8 x 8

			ERR.CHK(ss === 0);

			pat = [		'ooossooo'	,
						's--ss--s'	,
						's--ss--s'	,
						'soooooos'	,
						'soooooos'	,
						's--ss--s'	,
						's--ss--s'	,
						'ooossooo'	];

		  	break;

		case 'weaveB':

			// 14 x 14

			ERR.CHK(ss === 0);

			pat = [		'ooooossssooooo'	,
						'ooooossssooooo'	,
						'ss---ssss---ss'	,
						'ss---ssss---ss'	,
						'ss---ssss---ss'	,
						'ssooooooooooss'	,
						'ssooooooooooss'	,
						'ssooooooooooss'	,
						'ssooooooooooss'	,
						'ss---ssss---ss'	,
						'ss---ssss---ss'	,
						'ss---ssss---ss'	,
						'ooooossssooooo'	,
						'ooooossssooooo'	];

		  	break;

		case 'weaveC':

			// 20 x 20

			ERR.CHK(ss === 0);

			pat = [		'ooooooossssssooooooo'	,
						'ooooooossssssooooooo'	,
						'ooooooossssssooooooo'	,
						'sss----ssssss----sss'	,
						'sss----ssssss----sss'	,
						'sss----ssssss----sss'	,
						'sss----ssssss----sss'	,
						'sssoooooooooooooosss'	,
						'sssoooooooooooooosss'	,
						'sssoooooooooooooosss'	,
						'sssoooooooooooooosss'	,
						'sssoooooooooooooosss'	,
						'sssoooooooooooooosss'	,
						'sss----ssssss----sss'	,
						'sss----ssssss----sss'	,
						'sss----ssssss----sss'	,
						'sss----ssssss----sss'	,
						'ooooooossssssooooooo'	,
						'ooooooossssssooooooo'	,
						'ooooooossssssooooooo'	];

		  	break;

		case 'spot':

			// 8 x 8

			ERR.CHK(ss > 0);

			pat = [		'--soos--'	,
						'-oooooo-'	,
						'soooooos'	,
						'oooooooo'	,
						'oooooooo'	,
						'soooooos'	,
						'-oooooo-'	,
		  		 		'--soos--'	];

		  	break;
		
		case 'cross':

			// 6 x 6

			ERR.CHK(ss > 0);

			pat = [		'--oo--'		,
						'--oo--'		,
						'oooooo'		,
						'oooooo'		,
						'--oo--'		,
		  		 		'--oo--'		];

		  	break;

		case 'squareA':

			// 2 x 2

			ERR.CHK(ss > 0);

			pat = [		'oo',
						'oo'	];

		  	break;

		case 'squareB':

			// 4 x 4

			ERR.CHK(ss > 0);

			pat = [		'oooo',
						'oooo',
						'oooo',
						'oooo'	];

		  	break;

		case 'squareC':

			// 6 x 6

			ERR.CHK(ss > 0);

			pat = [		'oooooo',
						'oooooo',
						'oooooo',
						'oooooo',
						'oooooo',
						'oooooo'	];

			break;

		case 'squareD':

			// 8 x 8

			ERR.CHK(ss > 0);

			pat = [		'oooooooo',
						'oooooooo',
						'oooooooo',
						'oooooooo',
						'oooooooo',
						'oooooooo',
						'oooooooo',
						'oooooooo'	];

			break;

		default:

			ERR.CHK(false, 'invalid PngPattern style', s);
	}

	pat_w = pat[0].length;
	pat_h = pat.length;

	// Pattern offsets within image are
	// determined by alignment and spacing.
	// Each dimension has two units of spacing.
	// to facilitate all alignment requirements.
	
	switch(align)
	{
		case 'LT':
			ofs_x = 0;
			ofs_y = 0;
			break;

		case 'LC':
			ofs_x = 0;
			ofs_y = 1 * ss;
			break;

		case 'LB':
			ofs_x = 0;
			ofs_y = 2 * ss;
			break;

		case 'RT':
			ofs_x = 2 * ss;
			ofs_y = 0;
			break;

		case 'RC':
			ofs_x = 2 * ss;
			ofs_y = 1 * ss;
			break;

		case 'RB':
			ofs_x = 2 * ss;
			ofs_y = 2 * ss;
			break;

		case 'CT':
			ofs_x = 1 * ss;
			ofs_y = 0;
			break;

		case 'CC':
			ofs_x = 1 * ss;
			ofs_y = 1 * ss;
			break;

		case 'CB':
			ofs_x = 1 * ss;
			ofs_y = 2 * ss;
			break;

		default:
			ERR.CHK(false, 'invalid PngPattern, align', align);
	}

	// Image needs enough space for pattern dimensions
	// and two units of spacing

	img_w = pat_w + 2 * ss;
	img_h = pat_h + 2 * ss;

	// Construct blank image object with computed dimensions
	// and required color palette depth.
	
	img = new Png(img_w, img_h, 3);

	// Build color palette.
	// Note that Png constructor initialises pixels to 0.
	// So, by adding background color to the palette first,
	// we only need to assign non-background pixels later

	bg_index = img.color(bgR, bgG, bgB, bgA);
	fg_index = img.color(fgR, fgG, fgB, fgA);
	sm_index = img.color(smR, smG, smB, smA);

	// Generate pattern pixels at alignment offsets

  	for (y = 0; y < pat_h; y++)
  	{
  		for (x = 0; x < pat_w; x++)
  		{
  			switch (pat[y][x])
  			{
  				case 'o':
  					img.buffer[img.index(ofs_x + x, ofs_y + y)] = fg_index;
  					break;

  				case 's':
  					img.buffer[img.index(ofs_x + x, ofs_y + y)] = sm_index;
  			}
  		}
  	} 

  	// return saved image with base64 encoding 
	
	return window.btoa(img.save());
}

////////////////////////////////////////////////////////////////////////

function rws(str)
{
	// Removes ALL whitespace within string
	
	return str.replace(/ /g,'');
};

////////////////////////////////////////////////////////////////////////

function scrollSelect(sel, force)
{
	// If the selected item is not visible, the scroll position is changed
	// to position it about half-way down the list. This also works around
	// Google Chrome issues with interpretation of scroll height and a
	// particularly nasty bug when the last item is selected which leaves
	// the control with an incomplete list. Note also that, with Chrome,
	// one should never force an overall pixel height on a multi-line select
	// control as this has other strange side-effects. 
	
	var siz;	// total select items displayed
	var len;	// total select items
	var sh;		// scroll height
	var ih;		// item height
	var st;		// current scroll top
	var ti;		// index of top item
	var bi;		// index of bottom item
	var ci;		// index of current item
	var max;	// maximum top item index
	
	force = !force ? false : true;
	
	siz = sel.size;
	len = sel.length;
	
	if (len === 0) { return; }
	
	sh = sel.scrollHeight;
	ih = Math.round(sh/len);
	st = sel.scrollTop;
	ti = Math.round(st/ih);
	bi = ti + siz - 1;
	ci = sel.selectedIndex;
		
	if (!force && ci >= ti && ci <= bi) { return; }
	
	ti = ci + 1 - Math.round(siz/2);
	ti = ti < 0 ? 0 : ti;
	max = len > siz ? len - siz: 0;
	ti = ti > max ? max : ti;
	st = ti * ih;
	
	if (ci === len-1)
	{
		// Google Last Item Bug Fix
		// Temporarily change to second last
		// item while setting up scroll position
		// This happens so quickly that it is
		// never noticed and does not trigger
		// any change events because it is
		// programmatic
		
		sel.selectedIndex = ci-1;
		sel.scrollTop = st;
		sel.selectedIndex = ci;
	}
	else
	{
		sel.scrollTop = st;
	}
}

////////////////////////////////////////////////////////////////////////
// OptList container class is analagous to a select element
////////////////////////////////////////////////////////////////////////

function OptList()
{
	// Contains unique named properties with friendly text representations
	// which must also be unique. Property values are implicit and correspond
	// to the item's zero-based index which is, by definition, unique.
	
	var a;
	
	this.items = [];  
	this.length = 0;

	if (arguments.length % 2 !== 0) {throw "OptList: Arguments must be in pairs";}
		  
	for (a=0; a < arguments.length; a+=2)
	{
		this.add(arguments[a],arguments[a+1]);
	}
};

////////////////////////////////////////////////////////////////////////

OptList.prototype.add = function(name, text)
{
	var i;
	
	if (typeof(name) !== 'string') {throw "OptList: Non-string name argument";}
	if (typeof(text) !== 'string') {throw "OptList: Non-string text argument";}	
	if (isObjectMember(name, this)) {throw "OptList: Name already in use: " + name;}
	
	for (i = 0; i < this.items.length; i++)
	{
		if (this.items[i].text === text) {throw "OptList: Non-unique text: " + text;}
	}
	
	this[name] = this.items.length;
	this.items.push({name:name, text:text});
	this.length += 1;
};

////////////////////////////////////////////////////////////////////////

OptList.prototype.nameOf = function(index)
{
	if (0 <= index && index < this.items.length) {return this.items[index].name;}	
	return null;
};

////////////////////////////////////////////////////////////////////////

OptList.prototype.textOf = function(index)
{
	if (0 <= index && index < this.items.length) {return this.items[index].text;}	
	return null;
};

////////////////////////////////////////////////////////////////////////

OptList.prototype.valueOf = function(index)
{
	if (0 <= index && index < this.items.length) {return index;}	
	return null;
};

////////////////////////////////////////////////////////////////////////

OptList.prototype.has = function(value)
{
	if (typeof(value) !== 'number') {return false;}
	if (0 <= value && value < this.items.length) {return true;}
	return false;
};

////////////////////////////////////////////////////////////////////////

OptList.prototype.valueIndex = function(value)
{
	// Returns index corresponding to supplied value or its string
	// equivalent. Returns -1 if not found
	
	var i;
	
	if (value % 1 === 0)
	{
		i = parseInt(value,10);
		if (0 <= i && i < this.items.length) {return i;}	
	}

	return -1;
};

////////////////////////////////////////////////////////////////////////

OptList.prototype.nameIndex = function(name)
{
	// Returns index corresponding to property name.
	// Note that name argument is case sensitive.
	// Returns -1 if not found.
	
	var i;
	
	if ( typeof(name) === 'string')
	{
		for (i = 0; i < this.items.length; i++)
		{
			if (name === this.items[i].name)
			{
				return i;
			}
		}
	}

	return -1;
};

////////////////////////////////////////////////////////////////////////

OptList.prototype.textIndex = function(text)
{
	// Returns index corresponding to text representation.
	// Note that text argument is NOT case sensitive
	// Returns -1 if not found.
	
	var i;
	
	if ( typeof(text) === 'string')
	{
		text = text.toLowerCase();

		for (i = 0; i < this.items.length; i++)
		{
			if (text === this.items[i].text.toLowerCase())
			{
				return i;
			}
		}
	}

	return -1;
};

////////////////////////////////////////////////////////////////////////
// StrList is a simple container class for strings
////////////////////////////////////////////////////////////////////////

function StrList()
{
	// Contains unique named properties with friendly text representations
	// which must also be unique. Property values are explicitly defined
	// strings which may differ from name and text but must be unique.

	var a;

	this.items = [];  
	this.length = 0;
	
	if (arguments.length % 3 !== 0) {throw "StrList: Arguments must be in triplets";}

	for (a=0; a < arguments.length; a+=3)
	{
		this.add(arguments[a],arguments[a+1],arguments[a+2]);
	}
};

////////////////////////////////////////////////////////////////////////

StrList.prototype.add = function(name, text, value)
{
	var i;
	
	if (typeof(name) !== 'string') {throw "StrList: Non-string name argument";}
	if (typeof(text) !== 'string') {throw "StrList: Non-string text argument";}	
	if (isObjectMember(name, this)) {throw "StrList: Name already in use: " + name;}
	
	for (i = 0; i < this.items.length; i++)
	{
		if (this.items[i].value === value) {throw "StrList: Non-unique value: " + name;}
		if (this.items[i].text === text) {throw "StrList: Non-unique text: " + text;}
	}
	
	this[name] = value;
	this.items.push({name:name, text:text, value:value});
	this.length += 1;
};

////////////////////////////////////////////////////////////////////////

StrList.prototype.nameOf = function(index)
{
	if (0 <= index && index < this.items.length) {return this.items[index].name;}	
	return null;
};

////////////////////////////////////////////////////////////////////////

StrList.prototype.textOf = function(index)
{
	if (0 <= index && index < this.items.length) {return this.items[index].text;}	
	return null;
};

////////////////////////////////////////////////////////////////////////

StrList.prototype.valueOf = function(index)
{
	if (0 <= index && index < this.items.length) {return this.items[index].value;}	
	return null;
};

////////////////////////////////////////////////////////////////////////

StrList.prototype.has = function(value)
{
	var i;

	for (i = 0; i < this.items.length; i++)
	{
		if (this.items[i].value === value) {return true;}
	}
	
	return false;
};

////////////////////////////////////////////////////////////////////////

StrList.prototype.valueIndex = function(value)
{
	// Returns index corresponding to supplied value or its string
	// equivalent. Returns -1 if not found
	
	var i;
	
	for (i = 0; i < this.items.length; i++)
	{
		if (value == this.items[i].value) {return i;}
	}
	
	return -1;
};

////////////////////////////////////////////////////////////////////////

StrList.prototype.nameIndex = function(name)
{
	// Returns index corresponding to supplied property name.
	// Returns -1 if not found.
	
	var i;
	
	if ( typeof(name) === 'string')
	{
		for (i = 0; i < this.items.length; i++)
		{
			if (name === this.items[i].name) {return i;}
		}
	}

	return -1;
};

////////////////////////////////////////////////////////////////////////

StrList.prototype.textIndex = function(text)
{
	// Returns index corresponding to supplied text representation.
	// Returns -1 if not found.
	
	var i;
	
	if ( typeof(text) === 'string')
	{
		for (i = 0; i < this.items.length; i++)
		{
			if (text === this.items[i].text) {return i;}
		}
	}

	return -1;
};

////////////////////////////////////////////////////////////////////////
// Con class is a namespace for global constants (instanced as CON)
////////////////////////////////////////////////////////////////////////
	  
function Con()
{
	this.debug = 		false;		// disable in production!!
	
	this.views =
	{
		home:			1,	
		config:			2
	};
	 
	this.errors =
	{  
		none:			0,
		chk:			1,
		run:			2,
		cfg:			3,
		web:			4
	};
	  
	this.typeMods =
	{
		mask:			0xF000,
		array:			0x1000
	};
	
	this.types =
	{	   
		bool:			0x01,
		integer:		0x02,
		flp:			0x03,
		str:			0x10,
		alpha:			0x11,
		alphaNum:		0x12,
		url:			0x20,
		source:			0x30,
		path:			0x40,
		page:			0x50,
		file:			0x60,
		color:			0x70
	};
	 
	this.arrayTypes =
	{		  
		bool:			this.typeMods.array | this.types.bool,
		integer:		this.typeMods.array | this.types.integer,
		flp:			this.typeMods.array | this.types.flp,
		str:			this.typeMods.array | this.types.str,
		alpha:			this.typeMods.array | this.types.alpha,
		alphaNum:		this.typeMods.array | this.types.alphaNum,
		url:			this.typeMods.array | this.types.url,
		source:			this.typeMods.array | this.types.source,
		path:			this.typeMods.array | this.types.path,
		color:			this.typeMods.array | this.types.color			  
	};
	
	this.cfg =
	{
		version:		217,
		required:		undefined,
		maxParams:		99
	};
	
	this.cfgStates =
	{
		idle:			0,
		initialising:	1,
		errored:		2,
		ready:			3
	};
	
	this.themeStatus = new OptList
	(
		'unknown',		'Unknown',
		'unavailable',	'Unavailable',
		'missing',		'Missing',
		'optional',		'Optional',
		'forced',		'Forced',
		'invalid',		'Invalid'
	);
	
	this.themes = new StrList
	(
		'disabled',	'Disabled',	'Disabled'
	);
	
	this.paramFlags =
	{
		valThemeable:	'V',	/* User configurable with both value and default themeable */
		defThemeable:	'D',	/* User configurable but only default is themeable (not value) */
		notThemeable:	'N',	/* User configurable but not themeable in any way */ 
		forced:			'F',	/* User configurable in the future but forced to a default value pending implementation */
		system:			'S',  	/* NOT user or theme configurable - required for system housekeeping */
		themeOnly:		'T'		/* NOT user configurable - forced to default or overridden by theme but NOT saved in gadget prefs */
	};
	
	this.paramThemes =
	{	   
		none:			0,
		val:			1,
		def:			2
	}; 
	
	this.sym64 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz()";
	
	this.symbols =
	{
		help:			'&#xE8FD;',		/* material font - help_outline 			*/
		moveFirst:		'&#xE5DA;',		/* material font - subdirectory_arrow_right */
		skipPrev:		'&#xE020;', 	/* material font - fast_rewind 				*/
		movePrev:		'&#xE045;', 	/* material font - skip_previous 			*/
		moveNext:		'&#xE044;', 	/* material font - skip_next 				*/
		skipNext: 		'&#xE01F;',     /* material font - fast_forward 			*/
		moveLast:		'&#xE5D9;', 	/* material font - subdirectory_arrow_left 	*/
		close:			'&#xE14C;', 	/* clear (X) 								*/
		readMore:  		'&#x2708;',		/* airplane pointing right 					*/
		viewMore: 		'&#x25F1;', 	/* white square with lower left quadrant 	*/
		leftArrow: 		'&#x2190;', 	/* left arrow key 							*/		
		rightArrow: 	'&#x2192;'		/* right arrow key 							*/
	};

	this.png =
	{
		header: 		String.fromCharCode(0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A)
	};

	this.content =
	{
		minHeight:		50
	};
	  
	this.dir =
	{
		forward:		1,
		none:			0,
		backward:		-1
	};
	  
	this.keyCodes =
	{
		escape:			27,
		space:			32,
		right: 			39,
		left:  			37
	};
	   
	this.cab =
	{
		timerInterval:	100,
		maxRetries:		200,			
		maxItems:		99
	};
	
	this.cabStates =
	{
		idle:			0,
		initialising:	1,
		errored:		2,
		ready:			3
	};	  
	
	this.crx =
	{			
		maxItems:		999
	};
	
	this.crxStates =
	{
		idle:			0,
		initialising:	1,
		errored:		2,
		ready:			3
	};
	   
	this.imgStates =
	{
		idle:			0,
		preloading:		1,
		preloaded:		2,
		aborted:		3
	};

	this.sel =
	{
		minConfigPhotoHeight: 	2,
		minHomePhotoHeight: 	50
	};

	this.sho =
	{
		cacheSize:      1,
		msgOffset: 		20,
		msgBorder: 		1,
		msgPadding:		20,
		msgWidth: 		240,
		msgHeight: 		140
	};

	this.aligns = new OptList
	(
		'left',			'Left',
		'right',		'Right',
		'center',		'Center'
	);
	   
	this.layouts = new OptList
	(
		'exact',		'Exact',
		'trimMin',		'Trim Min',
		'trimMax',		'Trim Max',
		'pushMin',		'Push Min',
		'pushMax',		'Push Max',
		'pullMin',		'Pull Min',
		'pullMax',		'Pull Max'
	);

	this.frameStyles = new OptList
	(
		'none',			'None',
		'solid',		'Solid',
		'double',		'Double',
		'groove',		'Groove',
		'ridge',		'Ridge',
		'inset',		'Inset',
		'outset',		'Outset',
		'dotted',		'Dotted',
		'dashed',		'Dashed'
	);

	this.edgeStyles = new OptList
	(
		'none',			'None',
		'solid',		'Solid',
		'double',		'Double',
		'groove',		'Groove',
		'ridge',		'Ridge',
		'inset',		'Inset',
		'outset',		'Outset',
		'dotted',		'Dotted',
		'dashed',		'Dashed'
	);

	this.revealStyles = new OptList
	(
		'none',			'None',
		'solid',		'Solid'
	);

	this.spaceStyles = new OptList
	(
		'clear',		'Clear',
		'solid',		'Solid'
	);

	this.shapeStyles = new OptList
	(
		'rect',			'Rect',
		'roundPX',		'Round px',
		'roundPC',		'Round %',
		'innerPX',		'Inner px',
		'innerPC',		'Inner %',
		'outerPX',		'Outer px',
		'outerPC',		'Outer %'
	);

	// shadow style offers a sensible
	// subset of supported PNG patterns
	// in addition to non-pattern styles

	this.shadowStyles = new OptList
	(
		'none',			'None',
		'solid',		'Solid',
		'translucent',	'Translucent',
		'blurS', 		'Blur S',
		'blurT', 		'Blur T',
		'hazeS', 		'Haze S',
		'hazeT', 		'Haze T',
		'dotS1',		'Dot S',
		'dotT1',		'Dot T'
	);

	// mat style has only solid options

	this.matStyles = new OptList
	(
		'none',			'None',
		'solid',		'Solid',
		'dotS1',		'Dot',
		'gridAS0',		'Grid A',
		'gridBS0',		'Grid B',
		'gridCS0',		'Grid C',
		'diagAS0',		'Diag A',
		'diagBS0',		'Diag B',
		'diagCS0',		'Diag C',
		'checkerAS0',	'Checker A',
		'checkerBS0',	'Checker B',
		'checkerCS0',	'Checker C',
		'weaveAS0',		'Weave A',
		'weaveBS0',		'Weave B',
		'weaveCS0',		'Weave C',
		'spotS1', 		'Spot 1',
		'spotS2', 		'Spot 2',
		'spotS3', 		'Spot 3',
		'spotS4', 		'Spot 4',
		'crossS1', 		'Cross 1',
		'crossS2', 		'Cross 2',
		'crossS3', 		'Cross 3',
		'crossS4', 		'Cross 4',
		'squareAS1',	'Square A 1',
		'squareAS2',	'Square A 2',
		'squareAS3',	'Square A 3',
		'squareAS4',	'Square A 4',
		'squareBS1',	'Square B 1',
		'squareBS2',	'Square B 2',
		'squareBS3',	'Square B 3',
		'squareBS4',	'Square B 4',
		'squareCS1',	'Square C 1',
		'squareCS2',	'Square C 2',
		'squareCS3',	'Square C 3',
		'squareCS4',	'Square C 4',
		'squareDS1',	'Square D 1',
		'squareDS2',	'Square D 2',
		'squareDS3',	'Square D 3',
		'squareDS4',	'Square D 4'
	);
	
	this.textStyles = new OptList
	(
		'none',			'None',
		'defSN',		'Normal S',
		'defMN',		'Normal M',
		'defLN',		'Normal L',
		'defSB',		'Bold S',
		'defMB',		'Bold M',
		'defLB',		'Bold L'
	);
	
	this.panelStyles = new OptList
	(
		'none',			'None',
		'padSN',		'Slim S',
		'padMN',		'Slim M',
		'padLN',		'Slim L',
		'padSB',		'Wide S',
		'padMB',		'Wide M',
		'padLB',		'Wide L',
		'strSN',		'Strip S',
		'strMN',		'Strip M',
		'strLN',		'Strip L'
	);

	this.buttonStyles = new OptList
	(
		'bare',			'Bare',
		'dotted',		'Dotted',
		'light',		'Light',
		'medium',		'Medium',
		'heavy',		'Heavy',
		'double',		'Double',
		'fillBare',		'Fill Bare',
		'fillDotted',	'Fill Dotted',
		'fillLight',	'Fill Light',
		'fillMedium',	'Fill Medium',
		'fillHeavy',	'Fill Heavy',
		'fillDouble',	'Fill Double',
		'fillInset',	'Fill Inset',
		'fillOutset',	'Fill Outset'
	);

	this.spreadStyles = new OptList
	(
		'clear',		'Clear',
		'solid',		'Solid',
		'blur',			'Blur'
	);
	  
	this.colors =
	{
		aliceblue:				'f0f8ff',
		antiquewhite:			'faebd7',
		aqua:					'00ffff',
		aquamarine:				'7fffd4',
		azure:					'f0ffff',
		beige:					'f5f5dc',
		bisque:					'ffe4c4',
		black:					'000000',
		blanchedalmond:			'ffebcd',
		blue:					'0000ff',
		blueviolet:				'8a2be2',
		brown:					'a52a2a',
		burlywood:				'deb887',
		cadetblue:				'5f9ea0',
		chartreuse:				'7fff00',
		chocolate:				'd2691e',
		coral:					'ff7f50',
		cornflowerblue:			'6495ed',
		cornsilk:				'fff8dc',
		crimson:				'dc143c',
		cyan:					'00ffff',
		darkblue:				'00008b',
		darkcyan:				'008b8b',
		darkgoldenrod:			'b8860b',
		darkgray:				'a9a9a9',
		darkgreen:				'006400',
		darkkhaki:				'bdb76b',
		darkmagenta:			'8b008b',
		darkolivegreen:			'556b2f',
		darkorange:				'ff8c00',
		darkorchid:				'9932cc',
		darkred:				'8b0000',
		darksalmon:				'e9967a',
		darkseagreen:			'8fbc8f',
		darkslateblue:			'483d8b',
		darkslategray:			'2f4f4f',
		darkturquoise:			'00ced1',
		darkviolet:				'9400d3',
		deeppink:				'ff1493',
		deepskyblue:			'00bfff',
		dimgray:				'696969',
		dodgerblue:				'1e90ff',
		feldspar:				'd19275',
		firebrick:				'b22222',
		floralwhite:			'fffaf0',
		forestgreen:			'228b22',
		fuchsia:				'ff00ff',
		gainsboro:				'dcdcdc',
		ghostwhite:				'f8f8ff',
		gold:					'ffd700',
		goldenrod:				'daa520',
		gray:					'808080',
		green:					'008000',
		greenyellow:			'adff2f',
		honeydew:				'f0fff0',
		hotpink:				'ff69b4',
		indianred:				'cd5c5c',
		indigo:					'4b0082',
		ivory:					'fffff0',
		khaki:					'f0e68c',
		lavender:				'e6e6fa',
		lavenderblush:			'fff0f5',
		lawngreen:				'7cfc00',
		lemonchiffon:			'fffacd',
		lightblue:				'add8e6',
		lightcoral:				'f08080',
		lightcyan:				'e0ffff',
		lightgoldenrodyellow:	'fafad2',
		lightgray:				'd3d3d3',
		lightgreen:				'90ee90',
		lightpink:				'ffb6c1',
		lightsalmon:			'ffa07a',
		lightseagreen:			'20b2aa',
		lightskyblue:			'87cefa',
		lightslateblue:			'8470ff',
		lightslategray:			'778899',
		lightsteelblue:			'b0c4de',
		lightyellow:			'ffffe0',
		lime:					'00ff00',
		limegreen:				'32cd32',
		linen:					'faf0e6',
		magenta:				'ff00ff',
		maroon:					'800000',
		mediumaquamarine:		'66cdaa',
		mediumblue:				'0000cd',
		mediumorchid:			'ba55d3',
		mediumpurple:			'9370d8',
		mediumseagreen:			'3cb371',
		mediumslateblue:		'7b68ee',
		mediumspringgreen:		'00fa9a',
		mediumturquoise:		'48d1cc',
		mediumvioletred:		'c71585',
		midnightblue:			'191970',
		mintcream:				'f5fffa',
		mistyrose:				'ffe4e1',
		moccasin:				'ffe4b5',
		navajowhite:			'ffdead',
		navy:					'000080',
		oldlace:				'fdf5e6',
		olive:					'808000',
		olivedrab:				'6b8e23',
		orange:					'ffa500',
		orangered:				'ff4500',
		orchid:					'da70d6',
		palegoldenrod:			'eee8aa',
		palegreen:				'98fb98',
		paleturquoise:			'afeeee',
		palevioletred:			'd87093',
		papayawhip:				'ffefd5',
		peachpuff:				'ffdab9',
		peru:					'cd853f',
		pink:					'ffc0cb',
		plum:					'dda0dd',
		powderblue:				'b0e0e6',
		purple:					'800080',
		red:					'ff0000',
		rosybrown:				'bc8f8f',
		royalblue:				'4169e1',
		saddlebrown:			'8b4513',
		salmon:					'fa8072',
		sandybrown:				'f4a460',
		seagreen:				'2e8b57',
		seashell:				'fff5ee',
		sienna:					'a0522d',
		silver:					'c0c0c0',
		skyblue:				'87ceeb',
		slateblue:				'6a5acd',
		slategray:				'708090',
		snow:					'fffafa',
		springgreen:			'00ff7f',
		steelblue:				'4682b4',
		tan:					'd2b48c',
		teal:					'008080',
		thistle:				'd8bfd8',
		tomato:					'ff6347',
		turquoise:				'40e0d0',
		violet:					'ee82ee',
		violetred:				'd02090',
		wheat:					'f5deb3',
		white:					'ffffff',
		whitesmoke:				'f5f5f5',
		yellow:					'ffff00',
		yellowgreen:			'9acd32'
	};   
};

////////////////////////////////////////////////////////////////////////
// Env class holds run-time information (instanced as ENV)
////////////////////////////////////////////////////////////////////////

function Env(viewName)
{	
	this.debug = CON.debug;
	this.viewName = viewName; 
	
	switch(viewName)
	{
	case "home":
		this.view = CON.views.home;
		break;
	case "configuration":
		this.view = CON.views.config;
		break;
	}
};

////////////////////////////////////////////////////////////////////////
// Err class is used for error handling (instanced as ERR)
////////////////////////////////////////////////////////////////////////

function Err()
{	
	this.type = CON.errors.none;
	this.cause = "";
	this.info = null;
	this.errHandler = null;	
};

////////////////////////////////////////////////////////////////////////

Err.prototype.setErrHandler = function(errHandler)
{
	this.errHandler = errHandler;
};

////////////////////////////////////////////////////////////////////////

Err.prototype.clearErrHandler = function()
{
	this.errHandler = null;	
};

////////////////////////////////////////////////////////////////////////

Err.prototype.clear = function()
{
	this.type = this.errNone;
	this.cause = "";
	this.info = null; 
};

////////////////////////////////////////////////////////////////////////

Err.prototype.CHK = function(assertion, cause, info)
{
	// Assertion functionality only enabled during debug mode 
	// A false assertion always generates an alert at the point of failure
	// and ignores any assigned error handler.

	if (ENV.debug)
	{
		if (!assertion)
		{		 
			this.clear();
					
			this.type = CON.errors.chk;	
			if (!cause) {cause = "UNKNOWN";}	 
			this.cause = cause;
			this.info = info;
					 
			alert(this.text());		
			throw this.text();	// always the last statement!!	
		}
	}		
};

////////////////////////////////////////////////////////////////////////

Err.prototype.RUN = function(cause, info)
{
	// Unexpected run-time fatal error handling
	   
	this.clear();
	   
	this.type = CON.errors.run;	
	   
	if (!cause) {cause = "UNKNOWN";}
	this.cause = cause;
	this.info = info;
	   
	if (this.errHandler)
	{
		this.errHandler();
	}
	else
	{	
		alert(this.text());		
	}

	throw this.text();	// always the last statement!!
};

////////////////////////////////////////////////////////////////////////

Err.prototype.CFG = function(cause, info)
{
	// Configuration error handling
	// These errors are expected when gadget config is incorrect
	
	this.clear();
	   
	this.type = CON.errors.cfg;	
	   
	if (!cause) {cause = "UNKNOWN";}
	this.cause = cause;
	this.info = info;
	   
	if (this.errHandler)
	{
		this.errHandler();
	}
	else
	{	
		alert(this.text());		
	}
	
	throw this.text(); // always the last statement!!
};

////////////////////////////////////////////////////////////////////////

Err.prototype.WEB = function(cause, info)
{
	// Web error handling
	// These errors are expected occassionally
	
	this.clear();
	   
	this.type = CON.errors.web;	
	   
	if (!cause) {cause = "UNKNOWN";}
	this.cause = cause;
	this.info = info;
	   
	if (this.errHandler)
	{
		this.errHandler();
	}
	else
	{	
		alert(this.text());		
	}
	
	throw this.text();	// always the last statement!!
};

////////////////////////////////////////////////////////////////////////

Err.prototype.text = function() 
{
	var txt;
	   
	txt = "";
	   
	switch(this.type)
	{
	case this.errNone:
	    txt += "NO ERROR\n";
		break;
			  
	case CON.errors.chk:
	    txt += "CHECK ERROR\n";
		break;	
			  
	case CON.errors.run:
	    txt += "RUN-TIME ERROR\n";
		break;	
			
	case CON.errors.cfg:
	    txt += "CONFIG ERROR\n";
		break;	
			  
	case CON.errors.web:
	    txt += "WEB ERROR\n";
		break;	
	}
	 
	txt += this.cause + "\n";
	txt += this.infoText();
	
	return trim(txt); 
};

////////////////////////////////////////////////////////////////////////

Err.prototype.infoText = function() 
{
	var i;
	var txt = ""; 

	try
	{  
		if (!this.info) {return "";}
		   
		if (isArray(this.info))
		{
			for (i=0; i < this.info.length; i++)
			{
				txt += this.info[i].toString() + "\n";	
			}
		}
		else
		{
			txt += this.info.toString() + "\n";
		}
		return txt;
	}
	catch(err)
	{
		// return whatever text we have thus far
			  
		return txt;	
	}	   		
};

////////////////////////////////////////////////////////////////////////

Err.prototype.html = function() 
{
	return textToHtml(this.text());
};

////////////////////////////////////////////////////////////////////////

Err.prototype.infoHtml = function() 
{
	if (!this.info) {return "";}
	return textToHtml(this.infoText());
};

////////////////////////////////////////////////////////////////////////
// Doc class hold web page information (instanced as DOC)
////////////////////////////////////////////////////////////////////////

function Doc()
{
	var loc;
	var pairs;
	var pair;
	var i;
	var s;

	loc = window.location; 
	
	// Make generic snapshots of certain items in case there turns out to be
	// cross-browser or Google Sites-specific issues. Some properties have
	// different values depending on view (config/home), protocol (http/https)
	// and security context (signed in or not). It can also make a difference
	// if it is a new configuration. If that were not enough, certain properties
	// of pages that are served dynamically can be subject to criteria that are
	// subjective to the server side software. For instance, lastModified does
	// not give us the last time the page was changed but is updated on-the-fly
	// tto reflect the current server time each the page is served (even if
	// the page is coming from a reverse proxy). This happens to be fortunate
	// in our context because the server time is very useful for disabling
	// caching and detecting the expiry of deferred caching.
	
	
	this.width = document.body.clientWidth;
	this.height = document.body.clientHeight;
	this.hash = loc.hash;
	this.host = loc.host;
	this.hostname = loc.hostname;
	this.href = loc.href;
	this.pathname = loc.pathhname;
	this.port = loc.port;
	this.protocol = loc.protocol;   
	this.search = loc.search;
	this.serveTime = new Date(document.lastModified).getTime();
	this.params = {};
	this.parent = null;
	this.noCache = false;
	
	pairs = this.search.length?this.search.substr(1).split("&"):[];   

	for(i=0; i < pairs.length; i++)
	{
		 pair = pairs[i].split("=");
		 this.params[pair[0]] = unescape(pair[1]);
	}
	
	// We just want the basic parent URL without the litany of search
	// parameters that arise in certain contexts. This property will
	// be "doubly" saved in the severely limited gadget prefs data
	// as CFG.origParent and CFG.parent. So it is vital that we trim
	// off all except the essential information. Note that it conveys
	// different things in different contexts. In home view, it actually
	// gives the parent page as expected but in config view it yields
	// some system URL. However, even in the latter case, the essential
	// domain and site elements can be extracted from the URL
	
	s = document.referrer;
	i = s.indexOf('?');
	s = i >= 0 ? s.substr(0,i) : s.substr(0);
	this.parent = s;
	
	if ((this.params.nocache !== undefined) && this.params.nocache.match(''|'1'))
	{
		this.noCache = true;
	}
	else
	{
		this.noCache = false;
	}
};

////////////////////////////////////////////////////////////////////////

Doc.prototype.listParams = function()
{
	var p;
	var text;
	   
	text = "";
	   
	for (p in DOC.params)
	{
		text += p + "=" + DOC.params[p] + "\n";   
	}
	return text;
};

////////////////////////////////////////////////////////////////////////
// Cfg class manages configuration settings (instanced as CFG)
////////////////////////////////////////////////////////////////////////

function Cfg()
{	
	this.params = null;
	this.prefs = null;
	this.revertPrefs = null;
	this.isNewConfig = null;
	this.state = CON.cfgStates.idle;
	this.error = null;
	this.themeStatus = CON.themeStatus.unknown;
	this.themeError = null;
	this.themeUrl = null;
	this.readyhandler = null;
	this.initCount = 0;
};	
	
////////////////////////////////////////////////////////////////////////

Cfg.prototype.init = function(readyHandler)
{
	this.params = {};
	this.prefs = new gadgets.Prefs();
	this.revertPrefs = this.prefs.getString("cfg");
	this.isNewConfig = this.revertPrefs === "" ? true : false;
	this.state = CON.cfgStates.initialising;
	this.readyHandler = readyHandler;
	this.initCount += 1;
	
	try
	{
		this.initParamAll();

		if (ENV.view === CON.views.config)
		{      
			if (this.isNewConfig)
			{
				this.setDefaultAll();
				this.set('origParent', DOC.parent);
			}
			else
			{
				this.read();
				
				// Reset an active deferred cache if it has long since expired.
				// This check is only done on the first initialisation because
				// this.serveTime will reflect the last saved config session
				// rather than current one which would make it self-perpetuating.
				// If deferCache is a themed value, it will be over-ridden by
				// by processTheme before data feeds and images are accessed.
				
				if (this.deferCache && this.initCount === 1)
				{
					if (Math.abs(DOC.serveTime - this.serveTime) > this.cacheDeferTime)
					{
						this.set('serveTime', false);
					}
				}				
			}
			
			this.set('parent', DOC.parent);
			this.set('serveTime', DOC.serveTime);			
		}
		else
		{
			this.read();
		}
	
		this.requestTheme();
	}
	
	catch(err)
	{
		ERR.clear();	
		this.state = CON.cfgStates.errored;
		this.error = err;	
		if (this.readyHandler) {this.readyHandler();}
	}
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.initParam = function(flag, pName, desc, type, def, min, max, minSize, maxSize)
{
	var baseType;
	
	// If this is part of a re-initialisation, need to delete straggling
	// property or it will cause reserved name assertion below to fail
	
	delete this[pName]; 
		
	ERR.CHK(!isObjectMember(pName, this), "Cfg.initParam: Reserved name", pName);
	ERR.CHK(minSize === undefined || minSize >= 0, "Cfg.initParam: Array Min is Negative", pName);
	ERR.CHK(maxSize === undefined || maxSize >= 0, "Cfg.initParam: Array Max is Negative", pName);
	ERR.CHK(typeof(type) === 'number' || type instanceof OptList || type instanceof StrList, "Cfg.initParam: Invalid data type", pName);
	ERR.CHK(!((type instanceof OptList || type instanceof StrList) && def === CON.cfg.required), "Cfg.initParam: List parameter must have a default(create a 'NONE' option if necessary)", pName);
	ERR.CHK(typeof(flag) === 'string' && flag.length === 1 && 'VDNFST'.indexOf(flag) >= 0, "Cfg.initParam: Bad flag", pName);

	if (ENV.debug)
	{	
		if (typeof(type) === 'number')
		{
			switch(type & ~CON.typeMods.mask)
			{
			case CON.types.bool:
				baseType = 'boolean';
				break;
			case CON.types.integer:
			case CON.types.flp:			
				baseType = 'number';
				break;
			case CON.types.str:			
			case CON.types.alpha:		
			case CON.types.alphaNum:	
			case CON.types.url:		
			case CON.types.source:		
			case CON.types.path:	
			case CON.types.page:				
			case CON.types.file:		
			case CON.types.color:				  
				baseType = 'string';
				break;	  
			default:
				ERR.CHK(false, "Cfg.initParam: Unsupported parameter type", pName);		
			}
			
			if ( def !== CON.cfg.required )
			{
				if (type & CON.typeMods.array)
				{
					ERR.CHK(isArrayOf(def, baseType), "Cfg.initParam: Config default is not an array of the correct type", pName);
				} 
				else
				{
					ERR.CHK(typeof(def) === baseType, "Cfg.initParam: Config default is not the correct type", pName);
				}
			} 
		}
	}

	this.params[pName] = { flag: 				flag,
						   name:				pName,
						   desc:				desc,
						   type:				type, 
						   def:					def, 
						   min:					min, 
						   max:					max, 
						   minSize:				minSize, 
						   maxSize:				maxSize, 
						   theme:				CON.paramThemes.none, 
						   extChangeHandler:	undefined };  			
};  

////////////////////////////////////////////////////////////////////////

Cfg.prototype.initParamAll = function()
{
	// FLAG MEANINGS

	// T = Theme-Only Parameter	
	// S = System Parameter (not themable)
	// V = User-configurable and fully themeable
	// D = User-configurable but only default value is themeable
	// N = User-configurable but not themeable
	
	// THEME-ONLY MISC PARAMETERS
	
	this.initParam('T',	'cacheDeferTime',	'Cache Defer Time',		CON.types.integer,		4000000, 0, 7200000				);
	this.initParam('T',	'showLoadingDelay',	'Show Loading Delay',	CON.types.integer,		3000, 1000, 10000			    );
	this.initParam('T',	'useImageProxy',	'Use Image Proxy',		CON.types.bool,			true							);
	this.initParam('T',	'captureKeys',		'Capture Keys',			CON.types.bool,			true							);
	this.initParam('T',	'cleanCaption',		'Clean Caption',		CON.types.bool,			true							);
	this.initParam('T',	'cleanTitle',		'Clean Title',			CON.types.bool,			true							);

	// THEME-ONLY LOCALISATION PARAMETERS

	this.initParam('T',	'langHelp',			'Lang Help',			CON.types.str,			'Help'							);
	this.initParam('T',	'langClose',		'Lang Close',			CON.types.str,			'Close'							);
	this.initParam('T',	'langFirst',		'Lang First',			CON.types.str,			'First'							);
	this.initParam('T',	'langLast',			'Lang Last',			CON.types.str,			'Last'							);
	this.initParam('T',	'langPrevious',		'Lang Previous',		CON.types.str,			'Previous'						);
	this.initParam('T',	'langNext',			'Lang Next',			CON.types.str,			'Next'							);
	this.initParam('T',	'langSkipBack',		'Lang Skip Back',		CON.types.str,			'Skip Back'						);
	this.initParam('T',	'langSkipAhead',	'Lang Skip Ahead',		CON.types.str,			'Skip Ahead'					);
	this.initParam('T',	'langViewMore',		'Lang View More',		CON.types.str,			'View More'						);
	this.initParam('T',	'langViewNext',		'Lang View Next',		CON.types.str,			'View Next'						);
	this.initParam('T',	'langReadMore',		'Lang Read More',		CON.types.str,			'Read More'						);
	this.initParam('T',	'langLoading',		'Lang Loading',			CON.types.str,			'Loading'						);
	
	// SYSTEM PARAMETERS

	this.initParam('S',	'origParent',		'Original Parent URL',	CON.types.url,			CON.cfg.required				); 
	this.initParam('S',	'parent',			'Parent URL',			CON.types.url,			CON.cfg.required				);
	this.initParam('S',	'serveTime',		'Serve Time',			CON.types.integer,		CON.cfg.required				); 
	this.initParam('S',	'themeForced',		'Theme Forced',			CON.types.bool,			false							);
	
	// USER-CONFIGURABLE PARAMETERS

	// Primary
		
  	this.initParam('N',	'theme',			'Theme',				CON.themes,				CON.themes.disabled				); 
	this.initParam('D',	'cabSource',		'Cabinet Source',		CON.types.source,		'photos'						); 
	this.initParam('N', 'cabName',			'Cabinet Name',			CON.types.page,			CON.cfg.required				);
	this.initParam('N',	'leadPhotoName',	'Lead Photo Name',		CON.types.file,			CON.cfg.required				);

	// General

	this.initParam('N',	'deferCache',		'Defer Cache',			CON.types.bool,			false							);
	this.initParam('V',	'noSlides',			'No Slides',			CON.types.bool,			false							);
	this.initParam('V',	'noSymbols',		'No Symbols',			CON.types.bool,			false							);
	this.initParam('V',	'padding',			'Padding',				CON.types.integer,		0, 0, 20						);
	this.initParam('V',	'align',			'Align',				CON.aligns,				CON.aligns.left					);
	this.initParam('V',	'refHeight',		'Reference Height',		CON.types.integer,		400, 150, 1200					);
	this.initParam('V', 'grid',				'Grid',					CON.arrayTypes.integer,	[1], 	1, 20, 1, 20			);
	this.initParam('V',	'wrap',				'Wrap',					CON.types.bool,			false							);
	this.initParam('N',	'text',				'Text',					CON.types.str,			''								);
	this.initParam('N',	'link',				'Link',					CON.types.url,			''								);
	this.initParam('V',	'linkNew',			'Link New',				CON.types.bool,			false							);

	// Selection

	this.initParam('V',	'layout',			'Layout',				CON.layouts,			CON.layouts.exact				);
	
	this.initParam('V',	'footerColor',		'Footer Color',			CON.types.color,		'#888888'						);
	this.initParam('V',	'footerStyle',		'Footer Style',			CON.textStyles,			CON.textStyles.defMN			);
	this.initParam('V',	'footerHeight',		'Footer Height',		CON.types.integer,		25, 20, 60						);

	this.initParam('V',	'hoverColor',		'Hover Color',			CON.types.color,		'#FF0000'						);

	this.initParam('V',	'frameColorA', 		'Frame Color A',		CON.types.color,		'#0000FF' 						); 
	this.initParam('V',	'frameStyleA',		'Frame Style A',		CON.frameStyles,		CON.frameStyles.solid			);
	this.initParam('V',	'frameWidthA',		'Frame Width A',		CON.types.integer,		5, 1, 20						);

	this.initParam('V',	'shapeColorA',		'Shape Color A',		CON.types.color,		'#FFFFFF'						);
	this.initParam('V',	'shapeStyleA',		'Shape Style A',		CON.shapeStyles,		CON.shapeStyles.roundPX 		);
	this.initParam('V',	'shapeRadiusA',		'Shape Radius A',		CON.types.integer,		5, 2, 50						);	
	
	this.initParam('V',	'matColorA',		'Mat Color A',			CON.types.color,		'#FFFFFF'						);
	this.initParam('V',	'matStyleA',		'Mat Style A',			CON.matStyles,			CON.matStyles.solid				);
	this.initParam('V',	'matWidthA',		'Mat Width A',			CON.types.integer,		5, 1, 30						);
	
	this.initParam('V',	'edgeColorA',		'Edge Color A',			CON.types.color,		'#000000'						);
	this.initParam('V',	'edgeStyleA',		'Edge Style A',			CON.edgeStyles,			CON.edgeStyles.solid			);
	this.initParam('V',	'edgeWidthA',		'Edge Width A',			CON.types.integer,		1, 1, 5 						);

	this.initParam('V',	'revealColorA',		'Reveal Color A',		CON.types.color,		'#FFFFFF'						);
	this.initParam('V',	'revealStyleA',		'Reveal Style A',		CON.revealStyles,		CON.revealStyles.solid			);
	this.initParam('V',	'revealWidthA',		'Reveal Width A',		CON.types.integer,		1, 1, 5		 					);
		
	this.initParam('V',	'shadowColorA',		'Shadow Color A',		CON.types.color,		'#888888'						);	
	this.initParam('V',	'shadowStyleA',		'Shadow Style A',		CON.shadowStyles,		CON.shadowStyles.blurS			);
	this.initParam('V',	'shadowWidthA',		'Shadow Width A',		CON.types.integer,		5, 5, 20						);
	
	this.initParam('V',	'spaceColorA',		'Space Color A',		CON.types.color,		'#FFFFFF'						);
	this.initParam('V',	'spaceStyleA',		'Space Style A',		CON.spaceStyles,		CON.spaceStyles.clear 			);
	this.initParam('V',	'spaceWidthA',		'Space Width A',		CON.types.integer,		5, 0, 20						);

	// Slides

	this.initParam('V',	'panelColor',		'Panel Color',			CON.types.color,		'#0000FF'						);
	this.initParam('V',	'panelStyle',		'Panel Style',			CON.panelStyles,		CON.panelStyles.padMB			);
	this.initParam('V',	'panelHeight',		'Panel Height',			CON.types.integer,		30, 20, 50						);
	this.initParam('V',	'panelOpacity',		'Panel Opacity',		CON.types.integer,		40, 10, 100						);
	
	this.initParam('V',	'buttonColor',		'Button Color',			CON.types.color,		'#FFFFFF'						);
	this.initParam('V',	'buttonStyle',		'Button Style',			CON.buttonStyles,		CON.buttonStyles.fillBare		);
	this.initParam('V',	'buttonRadius',		'Button Radius',		CON.types.integer,		10, 0, 50						);

	this.initParam('V',	'spreadColor',		'Spread Color',			CON.types.color,		'#888888'						);
	this.initParam('V',	'spreadStyle',		'Spread Style',			CON.spreadStyles,		CON.spreadStyles.clear			);
	this.initParam('V',	'spreadWidth',		'Spread Width',			CON.types.integer,		0, 0, 8							);
	
	this.initParam('V',	'glowColor',		'Glow Color',			CON.types.color,		'#00FF00'						);
	this.initParam('V',	'beckonColor',		'Beckon Color',			CON.types.color,		'#FF0000'						);

	this.initParam('V',	'upperColor',		'Upper Color',			CON.types.color,		'#888888'						);
	this.initParam('V',	'upperStyle',		'Upper Style',			CON.textStyles,			CON.textStyles.defMN			);
	this.initParam('V',	'upperHeight',		'Upper Height',			CON.types.integer,		30, 20, 60						);
	
	this.initParam('V',	'lowerColor',		'Lower Color',			CON.types.color,		'#888888'						);
	this.initParam('V',	'lowerStyle',		'Lower Style',			CON.textStyles,			CON.textStyles.defMN			);
	this.initParam('V',	'lowerHeight',		'Lower Height',			CON.types.integer,		30, 20, 60						);
	
	this.initParam('V',	'frameColorB', 		'Frame Color B',		CON.types.color,		'#0000FF' 						); 
	this.initParam('V',	'frameStyleB',		'Frame Style B',		CON.frameStyles,		CON.frameStyles.solid			);
	this.initParam('V',	'frameWidthB',		'Frame Width B',		CON.types.integer,		10, 1, 20						);

	this.initParam('V',	'shapeColorB',		'Shape Color B',		CON.types.color,		'#FFFFFF'						);
	this.initParam('V',	'shapeStyleB',		'Shape Style B',		CON.shapeStyles,		CON.shapeStyles.roundPX 		);
	this.initParam('V',	'shapeRadiusB',		'Shape Radius B',		CON.types.integer,		10, 2, 50						);	
	
	this.initParam('V',	'matColorB',		'Mat Color B',			CON.types.color,		'#FFFFFF'						);
	this.initParam('V',	'matStyleB',		'Mat Style B',			CON.matStyles,			CON.matStyles.solid				);
	this.initParam('V',	'matWidthB',		'Mat Width B',			CON.types.integer,		10, 1, 30						);
	
	this.initParam('V',	'edgeColorB',		'Edge Color B',			CON.types.color,		'#000000'						);
	this.initParam('V',	'edgeStyleB',		'Edge Style B',			CON.edgeStyles,			CON.edgeStyles.solid			);
	this.initParam('V',	'edgeWidthB',		'Edge Width B',			CON.types.integer,		2, 1, 5 						);

	this.initParam('V',	'revealColorB',		'Reveal Color B',		CON.types.color,		'#FFFFFF'						);
	this.initParam('V',	'revealStyleB',		'Reveal Style B',		CON.revealStyles,		CON.revealStyles.solid			);
	this.initParam('V',	'revealWidthB',		'Reveal Width B',		CON.types.integer,		2, 1, 5 						);

	this.initParam('V',	'shadowColorB',		'Shadow Color B',		CON.types.color,		'#888888'						);
	this.initParam('V',	'shadowStyleB',		'Shadow Style B',		CON.shadowStyles,		CON.shadowStyles.blurS			);
	this.initParam('V',	'shadowWidthB',		'Shadow Width B',		CON.types.integer,		10, 5, 20						);

	this.initParam('V',	'spaceColorB',		'Space Color B',		CON.types.color,		'#FFFFFF'						);
	this.initParam('V',	'spaceStyleB',		'Space Style B',		CON.spaceStyles,		CON.spaceStyles.clear 			);
	this.initParam('V',	'spaceWidthB',		'Space Width B',		CON.types.integer,		10, 0, 20						);
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.getThemeUrl = function()
{
	var parent; 
	var protocol;
	var host;
	var root;
	var path;
	var index;
	var url;
	var stub;
	
	parent = DOC.parent;
	
	if (parent.substr(0,8) === 'https://')
	{
		protocol = 'https://';
		stub = parent.substr(8);
	}
	else
	{
		protocol = 'http://';
		stub = parent.substr(7);
	}

	index = stub.indexOf('/');
	host = stub.substr(0, index);
	stub = stub.substr(index);
	
	if (host === 'sites.google.com')
	{
		if (stub.substr(0, 3) === '/a/')
		{
			index = stub.indexOf('/',3);			
			index = stub.indexOf('/', index + 1);
			root = stub.substr(0, index + 1);		
		}
		else
		{
			if (stub.substr(0,6) !== '/site/')
			{
				ERR.WEB('Unknown google host path', parent);
			}
			
			index = stub.indexOf('/',6);			
			root = stub.substr(0, index + 1);		
		}
	}
	else
	{
		root = '/';
	}
	
	url = protocol + host + root + 'sys/themes/rvjc.com.photofeed.xml';
	
	if (DOC.noCache)
	{
		url += "?nocache=" + DOC.serveTime;			// Google Trick
	}

	this.themeUrl = url;
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.requestTheme = function()
{
	var self = this;
	var params = {};
	
	this.getThemeUrl();
	
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
    gadgets.io.makeRequest(this.themeUrl, function(obj){self.processTheme(obj);}, params);
};

////////////////////////////////////////////////////////////////////////
	  
Cfg.prototype.processTheme = function(obj)
{	
	var status;
	var error;
	var forced;
	var params;
	var options;
	var optionsIndex;
	var oNodesMatch;
	var i;
	var j;
	var dNode;
	var tNodes;
	var tNode;
	var oNodes;
	var oNode;
	var pNodes;
	var pNode;
	var oName;
	var pName;
	var cp;
	var tp;
	var pVal;
	var pDef;
	
	ERR.CHK(this.state === CON.cfgStates.initialising, "Cfg.ProcessTheme: Invalid Config State");
	
	// Use LOCAL theme variables to track progress. We do not want
	// to update the main CFG object on the fly and leave it in an
	// incomplete state after a non-fatal error is encountered. It
	// is only updated at the end if we have a valid outcome.
	
	status = CON.themeStatus.unknown;
	error = null;
	forced = null;
	params = {};
	options = null;
	optionsIndex = -1;
	oNodesMatch = -1;

	dNode = obj.data;
	
	if (dNode)
	{
		// Theme file present but not yet validated
		
		try
		{
			tNodes = dNode.getElementsByTagName("theme");
			ERR.CHK(tNodes, "Cfg.processTheme: undefined <theme> nodes list");
			if (tNodes.length !== 1) {ERR.CFG("Theme file: Expected single <theme> node", this.themeUrl);}
			tNode = tNodes[0];
			
			switch(getNodeAttribute(tNode,'forced'))
			{
			case null:
			case 'false':
				forced = false;
				break;
			case 'true':
				forced = true;
				break;
			default:
				ERR.CFG("Theme file: <theme> node has invalid forced attribute value", forced);
			}
			
			// Now that we have established forcing status,
			// start off options list and update status.
			
			options = new StrList();
			optionsIndex = -1;
			
			if (forced)
			{
				// Disabled option not allowed, so
				// leave options list blank for now
				
				status = CON.themeStatus.forced;
			}
			else
			{
				// Disabled option allowed, so make it
				// the first option and select it
				
				options.add('disabled', 'Disabled', 'Disabled');
				optionsIndex = 0;		
				
				status = CON.themeStatus.optional;				
			}

			// Parse all options without worrying about configuration data for now.
			// Options are enumerated in the order that they appear in the XML file.
			// So sequence is entirely under the control of the webmaster.
			
			oNodes = tNode.getElementsByTagName("option");
			ERR.CHK(oNodes, "Cfg.processTheme: undefined <option> nodes list");
			if (oNodes.length === 0) {ERR.CFG("Theme file: At least one <option> node required");}
			
			for (i = 0; i < oNodes.length; i++)
			{
				oNode = oNodes[i];
				oName = zn(trim(getNodeAttribute(oNode,'name')));
				if (oName === null) {ERR.CFG("Theme file: <option> node has no name attribute");}
				if (oName.toLowerCase() === 'disabled') {ERR.CFG("Theme file: <option> node name is reserved", oName);}

				for (j = 0; j < options.length; j++)
				{
					if (options.has(oName)) { ERR.CFG("Theme file: <option> node with duplicate name", oName); }
				}
				
				options.add(rws(oName), oName, oName);
				
				if (oName === this.theme)
				{	
					oNodesMatch = i;
					optionsIndex = options.length - 1;
				}
			}
			
			if (this.theme !== 'Disabled' && oNodesMatch === -1)
			{
				ERR.CFG("Theme file: live <option> has been removed from theme file", this.theme);
			}

			// The FIRST theme file option will be selected automatically in a new config.
			// It will also be selected in an existing config where theme was previously
			// disabed but is now forced. 
			
			if (this.newConfig || (forced && this.theme === 'Disabled'))
			{
				oNodesMatch = 0;
				if (forced) {optionsIndex = 0;} else {optionsIndex = 1;}
			}
			
			// Only process configuration parameters for an ACTIVE theme
			
			if (oNodesMatch >= 0)
			{
				oName = options.valueOf(optionsIndex);
				oNode = oNodes[oNodesMatch];
				
				pNodes = oNode.getElementsByTagName("p");
				ERR.CHK(pNodes, "Cfg.processTheme: undefined <p> nodes list");
				
				// It is perfectly acceptable to have zero <p> nodes
				// such as might happen when theme file is being set up
			
				for (i = 0; i < pNodes.length; i++)
				{
					pNode = pNodes[i];
					
					pName = getNodeAttribute(pNode,'name');
					pVal = getNodeAttribute(pNode,'value');
					pDef = getNodeAttribute(pNode,'default');
					
					if (pName === null) {ERR.CFG("Theme file: <p> node has no name attribute", oName);}
					if (pVal === null && pDef === null) {ERR.CFG("Theme file: <p> node has no value or default attribute", oName + ':' + pName);}
					if (pVal !== null && pDef !== null) {ERR.CFG("Theme file: <p> node has BOTH value and default attributes", oName + ':' + pName);}
					
					cp = this.params[pName];
					if (cp === undefined) { ERR.CFG("Theme file: <p> node has an unrecognised parameter name", oName + ':' + pName); }							
					
					tp = {name:pName, theme:null, def:null, val:null};
					
					if (pDef)
					{
						switch (cp.flag)
						{
						case 'V':
						case 'D':
							tp.theme = CON.paramThemes.def;
							tp.def = this.parse(pName,pDef);
							break;
						default:
							ERR.CFG("Theme file: <p> node specified default for an unthemeable parameter", oName + ':' + pName);
						}
					}
					else
					{
						switch (cp.flag)
						{
						case 'V':
						case 'T':
							tp.theme = CON.paramThemes.val;
							tp.val = this.parse(pName, pVal);
							break;
						case 'D':
							ERR.CFG("Theme file: <p> node specified value for a default-only themable parameter", oName + ':' + pName);
							break;
						default:
							ERR.CFG("Theme file: <p> node specifid value for an unthemeable parameter", oName + ':' + pName);
						}
					}
					
					params[pName] = tp;
				}
			}
		}
		
		catch(err)
		{
			ERR.clear();
			
			status = CON.themeStatus.invalid;
			error = err;
			
			forced = null;
			params = {};
			options = null;
			optionsIndex = -1;
			oNodesMatch = -1;
		}
	}
	
	if (status === CON.themeStatus.unknown || status === CON.themeStatus.invalid)
	{	
		options = new StrList('disabled', 'Disabled', 'Disabled');
		optionsIndex = 0;	
	
		if (this.theme === 'Disabled')
		{		
			forced = false;

			if (status === CON.themeStatus.unknown)
			{
				status = CON.themeStatus.unavailable;
			}
		}
		else
		{
			forced = this.themeForced;
			
			for (pName in this.params)
			{	
				cp = this.params[pName];
				tp = {name:pName, theme:null, def:null, val:null};
				
				if (cp.flag === 'V')
				{
					tp.theme = CON.paramThemes.val;
					tp.val = this[pName];
				}
				
				params[pName] = tp;
			}
			
			options.add(rws(this.theme), this.theme, this.theme );				
			optionsIndex = 1;
	
			if (status === CON.themeStatus.unknown)
			{
				status = CON.themeStatus.missing;	
			}
		}
	}
	
	// Done with theme processing so update the main CFG object.

	for (pName in params)
	{
		cp = this.params[pName];
		tp = params[pName];
		
		cp.theme = tp.theme;
		
		switch (tp.theme)
		{
		case CON.paramThemes.def:
			cp.def = tp.def;
			if (this.isNewConfig || CFG.initCount > 1)
			{
				this.set(pName, tp.def);
			} 
			break;
			
		case CON.paramThemes.val:	
			this.set(pName, tp.val); 
			break;
		}
	}
	
	this.themeStatus = status;
	this.themeError = error;
	this.set('theme',options.valueOf(optionsIndex));
	this.set('themeForced',forced);
	this.params.theme.def = this.theme;
	this.params.theme.type = options;	

	// Now parse and validate all config data ensuring consistent
	// ready state regardless of theme status, view or re-init
	
	try
	{
		this.parseAll();
		this.validate();
		
		// In configuration view, ensure that back-end gadget
		// prefs are updated and consistent with a current
		// valid config. This bulk write is never a wasted
		// operation because something will always have changed
		// even if it is only a system parameters.
	
		if (ENV.view === CON.views.config)
		{
			this.write();
		}
		
		this.state = CON.cfgStates.ready;
	}
	
	catch(err)
	{
		ERR.clear();
		
		this.state = CON.cfgStates.errored;
		this.error = err;		
	}

	// Processing is complete so notify the ready handler
	
	if (this.readyHandler) {this.readyHandler();}
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.write = function()
{
	// Bulk write all config data to back-end gadget prefs. A crc32 check
	// is inserted as the "first raw parameter". Theme-only parameters
	// are ignored.
	
	var s;		// serialised data
	var crc;	// CRC32 checksum
	var i;  	// index of current parameter
	var pName;	// current parameter name
	var p;		// current parameter
	
	ERR.CHK(ENV.view === CON.views.config, "Cfg.write: only allowed in config mode", pName);	  

	i = 0;
	s = "";
	   
	for (pName in this.params)
	{
		p = this.params[pName];
		
		if (p.flag !== 'T')
		{
			s += (i > 0 ? ',' : '') + this.encode(this[pName], p.type);
			i++;
		}		
	}
	
	crc = crc32(s, 0, s.length, CON.cfg.version);

	s = this.encodeInt(crc) + ',' + s;
	this.prefs.set("cfg", s);
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.read = function()
{
	// Bulk read all config data from the gadget's back-end prefs but does
	// NOT perform any parsing or validation. However, it does check data
	// integrity using CRC32 checksum. Theme-only params are never stored
	// in the back-end prefs. A bulk read sets them to their defaults
	
	var s;			// serialised data
	var c;			// first comma position
	var crc;		// CRC32 checksum
	var chunks;		// serialsed data parameter chunks array 
	var i;			// index of current parameter
	var pName;		// current parameter name
	var p;			// current parameter
	var val;		// decoded value 

	s = this.prefs.getString("cfg");

	c = s.indexOf(',');
	crc = this.decodeInt(s.substr(0,c));

	s = s.substr(c+1);
	
	if (crc !== crc32(s, 0, s.length, CON.cfg.version))
	{	
		ERR.CFG("Config read error: Data Integrity Fail");
	}
	
	chunks = s.length?s.split(","):[];   
	i = 0;
	
	for (pName in this.params)
	{
		p = this.params[pName];
		
		if (p.flag === 'T')
		{
			this.setDefault(pName);
		}
		else
		{
			val = this.decode(chunks[i], p.type);
		
			if (val === undefined) {ERR.CFG("Config read error:" + pName, chunks[i]);}
	
			this.set(pName, val);
			i++;
		}
	}
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.set = function(pName, value)
{
	// Preferred way of setting the value of the named config parameter
	// Performs important checks in debug mode. We may do other checks
	// in the future. Do not assign using "this[pName] = value" method.
	// WARNING: New data is not actually saved until the next bulk write!
		
	ERR.CHK(this.params[pName] !== undefined, "Cfg.set: Unknown parameter name", pName);
	
	this[pName] = value;
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.setDefault = function(pName)
{
	// Sets default value for indicated parameter. A required parameter
	// is indicated when its default value is set to CON.cfg.required
	// which is actually undefined and can be transparently assigned.
	// This is a low level set and ignores forced theme values/defaults.
	// WARNING: New data is not actually saved until the next bulk write!
	
	var p;
	   
	p = this.params[pName];	
	ERR.CHK(p !== undefined, "Cfg.setDefault: Unknown parameter name", pName);
	
	this.set(pName, p.def);
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.setDefaultAll = function()
{
	// Sets default value for all parameters
	// This is a low level set and ignores forced theme values/defaults.
	// WARNING: New data is not actually saved until the next bulk write!	   
	
	var pName;
	   
	for (pName in this.params)
	{
		this.setDefault(pName);
	}
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.load = function(pName)
{
	// Sets up the indicated parameter's target element whose Id should
	// be identical to the parameter name. If no target element is found,
	// such as would be the case for a hidden parameter, the function
	// returns silently. If the target element is found, it is initialised
	// with the parameter's current value. For certain paramater types, it
	// is necessary to configure element attributes such as option lists.

	var p;
	var self;
	var type;
	var val;
	var str;
	var input;
	var i;
	var opt;
	
	self = this;
	
	ERR.CHK(ENV.view === CON.views.config, "Cfg.load: Unknown parameter name", pName);
	   
	p = this.params[pName];
	ERR.CHK(p !== undefined, "Unknown config parameter name", pName);	   

	input = gel(pName);
	if (!input) {return;}
	
	type = p.type;   
	val = this[pName];
	str = this.toString(pName);	// think about array strings
	
	// Always clear any visible errored alert on element which may be lingering
	
	this.clrAlert(input);
	   
	switch(input.type)
	{
		case 'text':
		
			input.value = str;
			break;
					 
		case 'checkbox':
		
			input.checked = val;
			break;	 
		
		case 'select-one':
		
			if ( type instanceof OptList || type instanceof StrList )
			{
				if (input.length === 0)
				{
					// populate on first load
					
					for (i=0; i < type.length; i++)
					{
						opt = new Option();
						opt.text = type.textOf(i);
						input.options.add(opt);
					}
				}
				ERR.CHK(type.has(val), "Invalid select box value", pName, val);
				input.selectedIndex = type.valueIndex(val);
			}
			else
			{
				ERR.CHK(false, "Select-one box must be bound to OptList or StrList", pName);
			}
			break;
	
		default:
			ERR.CHK(false, "Unsupported Input type", input.type);	  
	}
	 
	input.onchange = function(event){ self.changeHandler(event); };
	input.onkeydown = function(event){ self.keydownHandler(event); };
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.loadAll = function()
{	
	var pName;
	   
	for (pName in this.params)
	{
		this.load(pName);
	}
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.loadDefault = function(pName)
{	
	// Sets and loads default value for the indicated parameter. This is
	// a high level operation used after theme has been acquired. Defaults
	// are only applied to user-configurable parameters which actually have
	// defaults to apply (with the notable exception of the theme parameter
	// itself which is user-configurable and has a default value even if it
	// is purely for use in new configurations). Regardless of whether a
	// default is applied, all controls that are bound to parameters are
	// reloaded even if it means applying their current values just to
	// ensure consistency.
	//
	// WARNING: Data is not actually saved until the next bulk write!
	
	var p;
	   
	p = this.params[pName];	   
	ERR.CHK(p !== undefined, "Cfg.loadDefault: Unknown parameter name", pName);	   
	
	if ( pName !== 'theme'
	&&   'DVN'.indexOf(p.flag) >= 0
	&&   p.theme !== CON.paramThemes.val
	&&   p.def !== undefined )
	{
		this.set(pName, p.def);		
	}
	
	this.load(pName);
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.loadDefaultAll = function()
{
	// Sets and loads default values for all parameters
	// WARNING: Data is not actually saved until the next bulk write!
	
	var pName;
	   
	for (pName in this.params)
	{
		this.loadDefault(pName);
	}
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.popupXML = function()
{
	// Displays XML representation of configuration parameters in theme
	// file format. Non-themeable parameters are ignored. Employs a
	// "well-behaved" popup window which popup blockers will generally
	// allow with default browser settings.

	var width;
	var height;
	var left;
	var top;
	var title;
	var text;
	var pName;
	var settings;
	var win;
	var doc;
	var html;
	var p;
	
	width = 600;
	height = 400;

	left = (screen.width) ? Math.round((screen.width - width) / 2) : 0;
	top = (screen.height) ? Math.round((screen.height - height) / 2) : 0;

	title = 'XML Configuration';

	text = '';

	text += '<?xml version="1.0" encoding="UTF-8" ?>\n\n';

	text += '<theme forced="false">\n\n';

	text += '    <option name="Exported">\n\n';

	for (pName in this.params)
	{
		p = this.params[pName];

		// only display themable parameters

		if ('TV'.indexOf(p.flag) >= 0)
		{
			text += '        <p name="' + pName + '" value="' + this.toText(pName) + '"/>\n';
		}
		else if (p.flag === 'D')
		{
			text += '        <p name="' + pName + '" default="' + this.toText(pName) + '"/>\n';
		}
	}

	text += '\n';

	text += '    </option>\n\n';

	text += '</theme>\n';
	  
	settings = 'width=' + (width + 50)
			+ ',height=' + (height + 100)
			+ ',top=' + top
			+ ',left=' + left
			+ ',scrollbars=0'
			+ ',menubar=0'
			+ ',status=0'
			+ ',toolbar=0'
		    + ',location=0'		 
			+ ',resizable=0';

	win = window.open("","MessageWindow", settings);
	doc = win.document;
	win.name="MessageWindow";

	html = '<html>'
	     + '<head><title>' + title + '</title></head>'
		 + '<body>'
		 + '<textarea readonly rows="32" cols="80" style="font-family:monospace;font-size:12px">'
		 + text
		 + '</textarea>'
		 + '</body>'
		 + '</html>';
	
	doc.write(html);   
	doc.close();
	win.focus();
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.enable = function(pName, enabled)
{
	// Enables or disables target element bound to indicated parameter.
	// If no target element is found, such as would be the case for a
	// hidden parameter, the function returns silently. A parameter that
	// is not user-configurable is always disabled!
	
	var p;
	   
	p = this.params[pName];	   
	ERR.CHK(p !== undefined, "Cfg.enable: Unknown parameter name", pName);	  

	if (('DVN').indexOf(p.flag) >= 0 && p.theme !== CON.paramThemes.val)
	{
		enable(pName, enabled);
	}
	else
	{
		enable(pName, false);
	}
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.enableFriend = function(id, pName, enabled)
{
	// Works like enable except now it operates on a 'friend' control
	// bound to the parameter and indicated by its id

	var p;
	   
	p = this.params[pName];	   
	ERR.CHK(p !== undefined, "Cfg.enable: Unknown parameter name", pName);	 

	if (('DVN').indexOf(p.flag) >= 0 && p.theme !== CON.paramThemes.val)
	{
		enable(id, enabled);
	}
	else
	{
		enable(id, false);
	}	
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.enableAll = function(enabled, exclusions)
{
	// Enables or disables all parameters bound to target elements
	// except those in the optional exclusions array.
	
	var pName;
	   
	for (pName in this.params)
	{
		if (exclusions)
		{
			if (isArrayMember(pName, exclusions)) {continue;}
		}
		
		this.enable(pName, enabled);
	}
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.notifyParamChange = function(pName, extChangeHandler)
{
	// Used to associate an EXTERNAL change handler with the indicated
	// parameter. This additional change handler is typically required
	// for housekeeping tasks and is called at the end of an automatic
	// save operation triggered by a data change on the target element.
	
	var p;

	p = this.params[pName];
	ERR.CHK(p !== undefined, "Cfg.notifyParamChange: Unknown parameter name", pName);	   
	   
	p.extChangeHandler = extChangeHandler;
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.save = function(pName, notify)
{	
	var p;
	var input;
	var raw;
	
	ERR.CHK(ENV.view === CON.views.config, "Cfg.save: Unknown parameter name");
	   
	p = this.params[pName];
	ERR.CHK(p !== undefined, "Unknown config parameter name", pName);	

	if ('VDN'.indexOf(p.flag) == -1) {return;}
	if (p.theme == CON.paramThemes.val) {return;}
	   
	input = gel(pName);
	   
	if (!input) {return;}
	
	// Always clear any visible errored alert on element which may be lingering
	
	this.clrAlert(input);
	   
	switch(input.type)
	{
		case 'text':
			raw = input.value;
			break;
					 
		case 'checkbox':
			raw = input.checked.toString();
			break;
					 
		case 'select-one':
			raw = p.type.valueOf(input.selectedIndex).toString();
			break;	 		
	}
	
	// Only save if value has been changed
	
	if (raw === this.toString(pName)) {return;}
	   
	try
	{
		this.set(pName, this.parse(pName, raw));
		this.validate();
		this.write();
			  
		// Load back parsed value for consistent format
		// This would apply particularly to color values
		// Note that this will not trigger another
		// onChange event as it is a programmatic change
			  
		this.load(pName);
			  
		if (notify && p.extChangeHandler) {p.extChangeHandler();}
		return true;
	}
	catch(err)
	{
		ERR.clear();
		this.setAlert(input);
		return false;
	}
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.changeHandler = function(event)
{
	// This is a common handler for manual data changes on all target elements
	// This is NOT triggered by programmatic changes
	
	var pName;
	var p;
	   
	pName = eventTarget(event).id;   
	
	p = this.params[pName];
	ERR.CHK(p !== undefined, "Cfg.changeHandler: Unknown parameter name", pName);	   
	
	// automatically save and notify external changeHandler if specified
	
	return this.save(pName, true);
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.keydownHandler = function(event)
{
	// This is a common handler for key down events on all target elements
	// It clears any existing visible error alerts as user re-enters data
	
	var input;
	   
	input = eventTarget(event);	   
	this.clrAlert(input);
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.setAlert = function(element)
{
	// Reddens element to indicate errored data
	
	element.style.backgroundColor = 'MistyRose';
	element.style.color = 'red';
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.clrAlert = function(element)
{
	// Restores default color to element
	
	element.style.backgroundColor = '';
	element.style.color = '';
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.parse = function(pName, raw, index)
{
	// Parses the raw string representation of the named parameter,
	// checks for errors and updates the parameter's value.
	
	var p;
	var desc;
	var type;
	var def;
	var min;
	var max;
	var minSize;
	var maxSize;
	var val;
	var rex;
	var rgb;
	var red;
	var green;
	var blue;
	var key;
	var i;
	
	// Normalise to a raw string free of leading and lagging whitespace
	
	raw = raw === null ? '' : trim(raw.toString());
	
	p = this.params[pName];
	ERR.CHK(p !== undefined, "Unknown config parameter name", pName);   
	
	desc = p.desc;
	type = p.type;
	def = p.def;
	min = p.min;
	max = p.max;
	minSize = p.minSize;
	maxSize = p.maxSize;
		
	ERR.CHK(type & CON.typeMods.array || index === undefined, "Parse index supplied but config parameter is scalar", pName); 

	if (raw === '')
	{		  
		if (def === CON.cfg.required)
		{
			ERR.CFG("'" + desc + "' may not be left blank");	
		}

		return def;
	}
	 
	if (type instanceof OptList)
	{
		// Try to get normalised integer value from one of three raw forms
		
		val = type.valueIndex(raw);		   
		if (val === -1) {val = type.nameIndex(raw);}
		if (val === -1) {val = type.textIndex(raw);}	
		if (val === -1) {ERR.CFG("Invalid " + pName, raw);}
		return val;
	}
	
	if (type instanceof StrList)
	{
		// StrList requires explicit strings
		// with no whitespace or case anomalies
		
		i = type.valueIndex(raw);		   
		if (i === -1) {ERR.CFG("Invalid " + pName, raw);}
		val = raw;
		return val;
	}

	if (type & CON.typeMods.array)
	{  
		if (index === undefined)
		{
			if (minSize !== undefined && raw.length < minSize)
			{
				ERR.CFG("'" + desc + "' must have at least " + minSize + " entries" , raw);	
			}
			 
			if (maxSize !== undefined && raw.length > maxSize)
			{
				ERR.CFG("'" + desc + "' may not have more than " + maxSize + " entries" , raw);	
			}
		
			val = [];
			raw = raw.split(",");    
			
			for (i=0; i < raw.length; i++)
			{
				val.push(this.parse(pName, trim(raw[i]), i));
			}
			return val;
		}
		
		desc = desc + '[' + index + ']';
	}
	 
	// Now we're down to basic types
		    	 
	switch(type & ~CON.typeMods.mask)
	{
	case CON.types.bool:
   	   
		switch(raw.toLowerCase())
		{
			case 'true': case 'yes': case '1':
				val = true;
				break;
			case 'false': case 'no': case '0':
				val = false;
				break;
			default:
				ERR.CHK(false, "Invalid boolean value", pName, raw);
		}
		return val;
			  
	case CON.types.integer:
	   
		val = parseInt(raw,10);		   
		if (isNaN(val))
		{
			ERR.CFG("'" + desc + "' is not a valid integer", raw);	
		}
		if (min !== undefined)
		{
			if (val < min) {ERR.CFG("'" + desc + "' may not be less than " + min, val);}
		}
		if (max !== undefined)
		{
			if (val > max) {ERR.CFG("'" + desc + "' may not be greater than " + max, val);}
		}
		return val;
			  
	case CON.types.flp:
	   	   
	   	val = parseFloat(raw);		   
		if (isNaN(val))
		{
			ERR.CFG("'" + desc + "' is not a valid floating point decimal", raw);	
		}
		if (min !== undefined)
		{
			if (val < min) {ERR.CFG("'" + desc + "' may not be less than " + min, val);}
		}
		if (max !== undefined)
		{
			if (val > max) {ERR.CFG("'" + desc + "' may not be greater than " + max, val);}
		}
		return val;
			  
	case CON.types.str:
		
		if (min !== undefined && raw < min)
		{
			ERR.CFG("'" + desc + "' must have at least " + min + " characters", raw);	
		}
		if (max !== undefined && raw > max)
		{
			ERR.CFG("'" + desc + "' may not have more than " + max + " characters", raw);
		}
		val = raw; 
		return val;
	   
	case CON.types.alpha:

		rex = /^[a-zA-Z]*$/;
			  
		if (!rex.test(raw))
		{
			ERR.CFG("'" + desc + "' is not a valid alphabetic string", raw);	
		}
		if (min !== undefined && raw < min)
		{
			ERR.CFG("'" + desc + "' must have at least " + min + " characters", raw);	
		}
		if (max !== undefined && raw > max)
		{
			ERR.CFG("'" + desc + "' may not have more than " + max + " characters", raw);
		}
		val = raw;
		return val;
			  
	case CON.types.alphaNum:
	   
		rex = /^[a-zA-Z0-9]*$/;
	  
		if (!rex.test(raw))
		{
			ERR.CFG("'" + desc + "' is not a valid alphanumeric string", raw);	
		}
		if (min !== undefined && raw < min)
		{
			ERR.CFG("'" + desc + "' must have at least " + min + " characters", raw);	
		}
		if (max !== undefined && raw > max)
		{
			ERR.CFG("'" + desc + "' may not have more than " + max + " characters", raw);
		}
		val = raw;
		return val;
			  
	case CON.types.url:
	   
		rex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		
		if (!rex.test(raw))
		{
			ERR.CFG("'" + desc + "' is not a valid URL", raw);	
		}
		val = raw;
		return val;

	case CON.types.source:
	   	
		rex = /((http|https):\/\/)*(\~)*(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		
		if (!rex.test(raw))
		{
			ERR.CFG("'" + desc + "' is not a valid source", raw);	
		}
		val = raw;
		return val;
	 
	case CON.types.path:
	   
		rex = rex = /^[a-zA-Z0-9\-\/]*$/;
		  
		if (!rex.test(raw))
		{
			ERR.CFG("'" + desc + "' is not a valid path", raw);	
		}
		val = raw;
		return val;
			
	case CON.types.page:
	   
		rex = rex = /^[a-zA-Z0-9\-]*$/;
		  
		if (!rex.test(raw))
		{
			ERR.CFG("'" + desc + "' is not a valid page", raw);	
		}
		val = raw;
		return val;	
			
	case CON.types.file:
	   
		rex = rex = /^[a-zA-Z0-9\-\.]*$/;
		  
		if (!rex.test(raw))
		{
			ERR.CFG("'" + desc + "' is not a valid file", raw);	
		}
		val = raw;
		return val;	
			  
	case CON.types.color:		  

		val = raw.toLowerCase();
			  
		rex = /^(#[0-9a-f]+)|[0-9]+$/;
		if (rex.test(val))
		{
			if (val.charAt(0) === '#') {val = '0x' + val.substr(1);}
				  
			val = parseInt(val,16);		   
			if (isNaN(val))
			{
				ERR.CFG("'" + desc + "' is not a valid numerical color", raw);	
			}
			if (val < 0x0 || val > 0xFFFFFF)
			{
				ERR.CFG("'" + desc + "' is outside the valid color range", raw);	
			}
			val = hexColor(val);
			return val;
		}
		
		rex = /^rgb\([0-9]+,[0-9]+,[0-9]+\)$/;
		if (rex.test(val))	  
		{	  
			val = val.substr(4,val.length-2);
			rgb = val.split(',');
			ERR.CHK(rgb.length === 3, "RGB regex is incorrect");
			 
			red = parseInt(rgb[2],10);
			green = parseInt(rgb[1],10);
			blue = parseInt(rgb[0],10);
					 
			if ((isNaN(red) || red < 0 || red > 255)
			||  (isNaN(green) || green < 0 || green > 255)
			||  (isNaN(blue) || blue < 0 || blue > 255))
			{
				ERR.CFG("'" + desc + "' is not a valid RGB color", raw);	
			}	
			val = hexColor(red + 256 * green + 65536 * blue);
			return val;
		}
		
		val = CON.colors[val];		
		if (!val) {ERR.CFG("'" + desc + "' is not a valid color", raw);}
			  
		val = '#' + val.toUpperCase();
		return val;
	}

	ERR.CHK(false, "Unknown configuration type", pName, type);   	
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.parseAll = function()
{	
	var pName;
	   
	for (pName in this.params)
	{	
		if (this[pName] !== undefined)
		{
			this.set(pName, this.parse(pName, this.toString(pName)));
		}
	}
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.validate = function()
{
	var i;
	var frameWidth; 	
	var matWidth; 	
	var edgeWidth;
	var revealWidth;
	var shadowWidth;
	var spaceWidth;
	var footerHeight;
	var contentHeight;
	var selHeight;
	var minHeight;
	   
	// Validations for all views
	   	   
	for (i=0; i < this.grid.length; i++)
	{		  
		if (i > 0 && this.grid[i] < this.grid[i-1])
		{
			ERR.CFG("Select Grid: Max photos in Column " + (i+1) + " must not be less than previous column", this.grid[i]);
		}
	}
	 
	if (ENV.view === CON.views.config)
	{
		return;
	}

	// Metric validations cannot be done in config view because externally
	// controlled gadget height configuration is inaccessible and out of
	// scope. However, we can determine gadget content height "on the fly"
	// in home view based on DOC.height and CFG.padding. Initial content
	// height (at point of validation) reflects the default selection view.
	// Selection metrics (set A) need to be validated since gadget height
	// is fixed and image size is shrunk to accommodate decorations. There
	// is no need to validate slide metrics (set B) since slide height is
	// fixed and gadget height is dynamically increased (or decreased) to
	// accommodate overall size.

	frameWidth = this.frameStyleA === CON.frameStyles.none ? 0 : this.frameWidthA;
	matWidth = this.matStyleA === CON.matStyles.none ? 0 : this.matWidthA;
	edgeWidth = this.edgeStyleA === CON.edgeStyles.none ? 0 : this.edgeWidthA;
	revealWidth = this.revealStyleA === CON.revealStyles.none ? 0 : this.revealWidthA;
	shadowWidth = this.shadowStyleA === CON.shadowStyles.none ? 0 : this.shadowWidthA;
	spaceWidth = this.spaceWidthA;
	footerHeight = this.footerStyle === CON.textStyles.none ? 0 : this.footerHeight;
	 
	contentHeight = DOC.height - 2 * CFG.padding;

	if (contentHeight < CON.content.minHeight)
	{
		ERR.CFG("Gadget height is too small to be usable!"); 
	}

	selHeight = contentHeight - footerHeight;

	for (i=0; i < this.grid.length; i++)
	{
		minHeight = this.grid[i]*(2*frameWidth + 2*matWidth + 2*edgeWidth + 2*revealWidth + shadowWidth + CON.sel.minHomePhotoHeight)
				  + (this.grid[i]-1)*spaceWidth;
			
		if (minHeight > selHeight)
		{
			ERR.CFG("Gadget height is not sufficient for " + this.grid[i] + " photos in column " + (i+1) + " with configured metrics"); 
		}
	}	
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.toString = function(pName)
{
	// Returns raw string representation of parameter value.
	// Note that an OptList value is converted to an integer string.
	// Use toText() method for friendly textual representation.
	
	var p;
	var type;
	var val;
	var str;
	var i;
	   
	p = this.params[pName];   
	ERR.CHK(p !== undefined, "Cfg.toString: Unknown parameter name", pName);

	val = this[pName]; 
	   
	type = p.type;   
	
	if (type & CON.typeMods.array)
	{
		str = '';
		for (i=0; i < val.length; i++)
		{
			if (i>0) {str += ',';}
			str += val[i] !== undefined ? val[i].toString(): '';
		}	
	}
	else
	{
		str = val !== undefined ? val.toString(): '';	
	}
	return str;
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.toText = function(pName)
{
	// Returns friendly textual representation of parameter value.
	
	var p;
	var type;
	var val;
	var str;
	var i;
	   
	p = this.params[pName];   
	ERR.CHK(p !== undefined, "Cfg.toText: Unknown parameter name", pName);

	val = this[pName]; 
	   
	type = p.type;   
	
	if (type & CON.typeMods.array)
	{
		str = '';
		for (i=0; i < val.length; i++)
		{
			if (i>0) {str += ',';}
			str += val[i] !== undefined ? val[i].toString(): '';
		}	
	}
	else
	{
		if (type instanceof OptList)
		{	
			str = val !== undefined ? type.textOf(val): '';
		}
		else
		{
			str = val !== undefined ? val.toString(): '';
		}	
	}
	return str;
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.encode = function(val, type)
{
	// Encodes supplied value according to the indicated type
	
	var raw;
	var enc;
	var i;
	
	if (val === undefined)
	{
		return '';
	}
	
	if (val === null)
	{
		return '';
	}
	
	if (type & CON.typeMods.array)
	{
		// Recurse into array using : delimiters
		
		enc = '';
		for (i=0; i < val.length; i++)
		{
			if (i>0) {enc += ':';}
			enc += this.encode(val[i], type & ~CON.typeMods.mask);
		}	
	}
	else
	{
		if (type instanceof OptList)
		{
			// Encode OptList types like integers
			
			raw = this.encodeInt(val);
		}
		else if (type instanceof StrList)
		{
			// Encode StrList types like strings
			
			raw = val; 
		}
		else
		{
			// Down to standard types
			
			switch(type)
			{
			case CON.types.bool:
				switch(val)
				{
				case false:
					raw = '0';
					break;
				case true:
					raw = '1';
					break;
				default:
					raw = '!';
				}	
				break;
			
			case CON.types.integer:
				raw = this.encodeInt(val);
				break;
				
			case CON.types.flp:
				raw = this.encodeInt(parseInt(val)) + '.' + this.encodeInt(parseInt(val % 1));
				break;
				
			case CON.types.color:
				raw = val === '' ? '' : this.encodeInt(parseInt('0x' + val.substr(1), 16));
				break;
			
			default:
				// remaining string-based types are not compressed/encoded
				// null and null string are synonymous
				raw = val; 
			}
		}
		
		// use encodeURIComponent to conveniently encode all problematic characters,
		// not least our parameter delimter (:)
		
		enc = encodeURIComponent(raw);
	}
			
	return enc;
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.decode = function(enc, type)
{
	// Decodes supplied string according to the indicated type
	
	var val;
	var raw;
	var i;
	
	if (type & CON.typeMods.array)
	{
		val = [];
		enc = enc.split(':');
		for (i=0; i < enc.length; i++)
		{
			val.push(this.decode(enc[i], type & ~CON.typeMods.mask));
		}	
	}
	else
	{
		raw = decodeURIComponent(enc);
		
		if (type instanceof OptList)
		{
			// Decode OptList types like integers
			
			val = raw === '' ? null : this.decodeInt(raw);
		}
		else if (type instanceof StrList)
		{
			// Decode StrList types like strings
			
			val = raw;
		}
		else
		{
			// Down to standard types
			
			switch(type)
			{
			case CON.types.bool:
				switch(raw)
				{
				case '':
					val = null;
					break;
				case '0':
					val = false;
					break;
				case '1':
					val = true;
					break;
				default:
					val = undefined;
				}
				break;	
			
			case CON.types.integer:
				val = raw === '' ? null : this.decodeInt(raw);
				break;
				
			case CON.types.flp:
				raw = raw.split('.');
				val = (raw.length === 1 && raw[0] === '') ? null : parseFloat(this.decodeInt(raw[0]) + '.' + decodeInt(raw[1]));
				break;
				
			case CON.types.color:
				val = raw === '' ? '' : hexColor(this.decodeInt(raw));
				break;
				
			default:
				// remaining types are uncompressible string-based
				// where null and null string are synonymous
				val = raw;
			}
		}
	}
			
	return val;
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.encodeInt = function(intVal)
{
	var encVal; 
	var e;
    var residual;
	
	if (intVal === "") return null;

	if ( isNaN(Number(intVal)) ||  intVal % 1 !== 0 )
	{
		return '!';
	}

	encVal = "";
	residual = intVal < 0 ? Math.abs(intVal) : intVal;
	
	while (true)
	{
		e = residual % 64;
		encVal = CON.sym64.charAt(e) + encVal;
		residual = Math.floor(residual / 64);
		if (residual === 0) break;
	}
	
	if (intVal < 0) encVal = "-" + encVal;
	
	return encVal;
};

////////////////////////////////////////////////////////////////////////

Cfg.prototype.decodeInt = function(encVal)
{
	var intVal; 
	var e;
	var index;
	var isNeg = false;
	
	if (encVal === "") return null;
	
	if (encVal.substr(0,1) === '-')
	{
		isNeg = true;
		encVal = encVal.substr(1);
	}

	intVal = 0;
	encVal = encVal.split('');
	
	for (e in encVal)
	{
		index = CON.sym64.indexOf(encVal[e]);
		if (index === -1) { return undefined;}
		intVal = (intVal * 64) + index;
	}
	
	if (isNeg) intVal = -intVal;
	
	return intVal;
};

////////////////////////////////////////////////////////////////////////
// Src class manages source URL for photos/images (instanced as SRC)
////////////////////////////////////////////////////////////////////////

function Src()
{
	this.curParent	= null;
	this.cfgParent	= null;
	this.cfgSource	= null;
	this.protocol	= "";
	this.type		= "";
	this.appsDomain	= "";		
	this.siteName	= "";		
	this.path		= "";		
	this.hostName	= "";
	this.webAlias	= "";
	this.webDomain	= "";
	this.feedUrl	= "";
	this.siteUrl	= "";
	this.noCache	= false;

	// Perform raw parsing of relevant URLs
		   
	this.curParent = this.parse(DOC.parent);
	this.cfgParent = this.parse(CFG.parent);
	this.cfgSource = this.parse(CFG.cabSource);
	
	// If the config source type is not known but it has
	// a valid hostname, it is assumed to be 'Apps' and
	// the config source properties are over-ridden as
	// follows:
	//
	// - The Apps domain is identical to the Web domain.
	//
	// - The site name is assumed to be identical to the
	//   webAlias (CNAME record).
	//
	// - If the config source protocol is unknown, it
	//   defaults to HTTP.
	//
	// If the config source type cannot be established in
	// this way, it falls back to the CONFIG parent type.
	
	if (this.cfgSource.type.length > 0)
	{
		this.type = this.cfgSource.type;
	}
	else if (this.cfgSource.hostName.length > 0)
	{
		this.type = 'Apps';
		this.cfgSource.appsDomain = this.cfgSource.webDomain;
		this.cfgSource.siteName = this.cfgSource.webAlias;

		if (this.cfgSource.protocol.length === 0)
		{
			this.cfgSource.protocol = 'http';
		}
	}
	else
	{
		this.type = this.cfgParent.type;
	}

	// If the config source protocol is unknown,
	// it falls back to the CURRENT parent protocol

	if (this.cfgSource.protocol.length > 0)
	{	
		this.protocol = this.cfgSource.protocol;	
	}
	else
	{
		this.protocol = this.curParent.protocol;
	}

	// If the config source site name is unknown,
	// employ a fallback strategy for Apps hosts only
	// based on CURRENT and CONFIG parent properties   
	 
	if (this.cfgSource.siteName.length > 0)
	{
		this.siteName = this.cfgSource.siteName;		
	}
	else
	{
		if (this.type === "Apps")
		{
			if (this.curParent.siteName.length > 0)
			{
				this.siteName = this.curParent.siteName;
			}
			else
			{
				if (this.curParent.webAlias.length > 0)
				{
					this.siteName = this.curParent.webAlias;
				}
				else
				{
					this.siteName = this.cfgParent.siteName;
				}
			}
		}
		else
		{
			this.siteName = this.cfgParent.siteName;
		}
	}

	// If the config source Apps Domain is unknown,
	// employ a fallback strategy for Apps hosts only
	// based on CURRENT and CONFIG parent properties  
	 
	if (this.cfgSource.appsDomain.length > 0)
	{
		this.appsDomain = this.cfgSource.appsDomain;		
	}
	else
	{
		if (this.type === "Apps")
		{
			if (this.curParent.appsDomain.length > 0)
			{			    
				this.appsDomain = this.curParent.appsDomain;
			}
			else
			{
				this.appsDomain = this.curParent.webDomain;				
			}
		}
		else
		{
			this.appsDomain = this.cfgParent.appsDomain;
		}
	}
	 
	this.path = this.cfgSource.path;

	if (this.cfgSource.hostName.length > 0)
	{
		this.hostName = this.cfgSource.hostName;
		this.webAlias = this.cfgSource.webAlias;
		this.webDomain = this.cfgSource.webDomain;
	}
	else if (this.curParent.hostName.length > 0)
	{
		this.hostName = this.curParent.hostName;
		this.webAlias = this.curParent.webAlias;
		this.webDomain = this.curParent.webDomain;
	}
	else
	{
		// actually this should not happen

		ERR.CHK(false, 'source hostname anomaly');

		this.hostName = this.cfgParent.hostName;
		this.webAlias = this.cfgParent.webAlias;
		this.webDomain = this.cfgParent.webDomain;
	}

	// Google now forces feeds to use secure HTTPS
	// (his does not apply to the photos themselves)

	if (this.type === 'Apps')
	{
		this.feedUrl = 'https://'
				     + 'sites.google.com/feeds/content/' 
					 + this.appsDomain + '/'
					 + this.siteName;
	}
	else if (this.type === 'Site')
	{
		ERR.CHK(this.type === 'Site', "Source type error"); 
			  
		this.feedUrl = 'https://'
					 + 'sites.google.com/feeds/content/site/' 
					 + this.siteName; 
	}
	 
	if (this.hostName === 'sites.google.com')
	{
		if (this.type === 'Apps')
		{
			this.siteUrl = this.protocol + '://'
					     + 'sites.google.com/a/'
						 + this.appsDomain + '/'
						 + this.siteName;
		}
		else
		{
			this.siteUrl = this.protocol + '://'
					     + 'sites.google.com/site/'
						 + this.siteName;		 
		}
	}
	else
	{
		this.siteUrl = this.protocol + '://'
				     + this.hostName;
	}
	
	// Finally deal with caching status
		
	if ( DOC.noCache ||  CFG.deferCache && Math.abs(DOC.serveTime - CFG.serveTime) < CFG.cacheDeferTime )
	{
		this.noCache = true;
	}
};	   

////////////////////////////////////////////////////////////////////////

Src.prototype.parse = function(url)
{
	var result;
	var stub;
	var i;
	var s;
	
	// Initialise the result object to default/null values
	// The parsing strategy is to extract as much information as
	// possible from the raw URL until no more can be extracted
	  
	result =
	{
		protocol:		"",		// http, https or null
		type:			"",		// Apps, Site or null (other)
		appsDomain:		"",		// Google Apps domain name (if applicable).
		siteName:		"",		// Google Apps or Sites site name (if applicable).
		path:			"",		// Path part of URL if present
		hostName:		"",		// Hostname part of URL if present
		webAlias:		"",		// Alias part of hostname (null if naked domain)
		webDomain:		""		// Domain part of hostname
	};
	  
	stub = url;
	
	// get rid of any query or tag parameters
	
	i = stub.indexOf('#');
	if (i >= 0) {stub = stub.substr(0,i);}
	   
	i = url.indexOf('?');
	if (i >= 0) {stub = stub.substr(0,i);}
	   
	// protocol is either forced or automatic
	   
	if (stub.substr(0,7) === 'http://' )
	{
		result.protocol = 'http';
		stub = stub.substr(7);			
	}
	else
	{
		if (stub.substr(0,8) === 'https://')
		{
			result.protocol = 'https';	
			stub = stub.substr(8);	
		}
	}
	 
	// Special scenarios arise only with configuration source URLs
	   
	if (stub.indexOf('/') === -1)
	{
		result.path = stub;
		return result;
	}

	if (stub.charAt(0) === '/')
	{
		i = stub.indexOf('/',1);
		if (i < 2 || i > stub.length-2) {ERR.CFG("Source specifies a local site but no path", url);}
		result.siteName = stub.substr(1,i);
		result.path = stub.substr(i+1);
		
		return result;
	}
		 
	if (stub.charAt(0) === '~')
	{
		stub = 'sites.google.com' + stub.substr(1);
	}
		
	if (stub.substr(0,19) === 'sites.google.com/a/')
	{	
		stub = stub.substr(19);
			  
		result.type = 'Apps';
		result.hostName = 'sites.google.com';
		result.webAlias = 'sites';
		result.webDomain = 'google.com';
			  
		i = stub.indexOf('/',1);	  
		result.appsDomain = stub.substr(0,i);
		stub = stub.substr(i+1); 
			  
		i = stub.indexOf('/',1);	  
		result.siteName = stub.substr(0,i);
		stub = stub.substr(i+1); 
		result.path = stub;
	
		return result;
	}
	 
	if (stub.substr(0,22) === 'sites.google.com/site/')
	{	
		stub = stub.substr(22);
			  
		result.type = 'Site';
		result.hostName = 'sites.google.com';
		result.webAlias = 'sites';
		result.webDomain = 'google.com';
			  
		i = stub.indexOf('/',1);	  
		result.siteName = stub.substr(0,i);
		stub = stub.substr(i+1); 
		result.path = stub;	  
		  
		return result;
	}
			  
	// If we get this far the URL has no known Google Sites
	// internal representation (either Apps or Sites service).
	// It may be the public URL of a Google Apps or Sites page
	// but we are not to know this
  
	i = stub.indexOf('/',1);	  
	result.hostName = stub.substr(0,i);
	stub = stub.substr(i+1); 
	result.path = stub;	  
	   
	s = result.hostName.split('.');

	switch (s.length)
	{
	case 1:
		ERR.RUN("Illegal hostname", result.hostName);
		break;
	case 2:
		result.webDomain = s[0] + '.' + s[1];
		break;
	case 3:
		result.webDomain = s[1] + '.' + s[2];
		result.webAlias = s[0];
		break;   
	}
	
	return result;
};

////////////////////////////////////////////////////////////////////////

Src.prototype.curParentInfo = function()
{
	var info;
	   
	info = 'CURRENT PARENT\n'
		 + 'Protocol: ' + this.curParent.protocol + '\n'
	     + 'Type: ' + this.curParent.type + '\n'
	     + 'Apps Domain: ' + this.curParent.appsDomain + '\n'
		 + 'Site Name: ' + this.curParent.siteName + '\n'
		 + 'Path: ' + this.curParent.path + '\n'
		 + 'Host Name: ' + this.curParent.hostName + '\n'
		 + 'Web Alias: ' + this.curParent.webAlias + '\n'
	     + 'Web Domain: ' + this.curParent.webDomain;
			
	return info;
};

////////////////////////////////////////////////////////////////////////

Src.prototype.cfgParentInfo = function()
{
	var info;
	   
	info = 'CONFIG PARENT\n'
		 + 'Protocol: ' + this.cfgParent.protocol + '\n'
	     + 'Type: ' + this.cfgParent.type + '\n'
	     + 'Apps Domain: ' + this.cfgParent.appsDomain + '\n'
		 + 'Site Name: ' + this.cfgParent.siteName + '\n'
		 + 'Path: ' + this.cfgParent.path + '\n'
		 + 'Host Name: ' + this.cfgParent.hostName + '\n'
		 + 'Web Alias: ' + this.cfgParent.webAlias + '\n'
	     + 'Web Domain: ' + this.cfgParent.webDomain;
			
	return info;
};

////////////////////////////////////////////////////////////////////////

Src.prototype.cfgSourceInfo = function()
{
	var info;

	info = 'CONFIG SOURCE\n'
		 + 'Protocol: ' + this.cfgSource.protocol + '\n'
	     + 'Type: ' + this.cfgSource.type + '\n'
	     + 'Apps Domain: ' + this.cfgSource.appsDomain + '\n'
		 + 'Site Name: ' + this.cfgSource.siteName + '\n'
		 + 'Path: ' + this.cfgSource.path + '\n'
		 + 'Host Name: ' + this.cfgSource.hostName + '\n'
		 + 'Web Alias: ' + this.cfgSource.webAlias + '\n'
	     + 'Web Domain: ' + this.cfgSource.webDomain;
	
	return info;
};

////////////////////////////////////////////////////////////////////////

Src.prototype.activeInfo = function()
{	
	var info;

	info = 'ACTIVE PARAMETERS\n'
		 + 'Protocol: ' + this.protocol + '\n'
	     + 'Type: ' + this.type + '\n'
	     + 'Apps Domain: ' + this.appsDomain + '\n'
		 + 'Site Name: ' + this.siteName + '\n'
		 + 'Path: ' + this.path + '\n'
		 + 'Host Name: ' + this.hostName + '\n'
		 + 'Web Alias: ' + this.webAlias + '\n'
	     + 'Web Domain: ' + this.webDomain + '\n'
		 + 'Feed URL: ' + this.feedUrl + '\n'
		 + 'Site URL: ' + this.siteUrl + '\n'
		 + 'No Cache: ' + this.noCache;
	
	return info;
};
	   
////////////////////////////////////////////////////////////////////////
// CabItem class is instanced for each photo in a cabinet
////////////////////////////////////////////////////////////////////////

function CabItem(cabUrl, filename, caption)
{
	this.cabUrl = cabUrl;
	this.filename = filename;
	this.caption = caption;
	this.img = new Image();
	this.width = 0;   
	this.height = 0;
	this.state = CON.imgStates.idle; 
	this.retries = 0;
};

////////////////////////////////////////////////////////////////////////

CabItem.prototype.cabSrc = function()
{		
	return this.cabUrl + "/" + this.filename;
};

////////////////////////////////////////////////////////////////////////

CabItem.prototype.info = function()
{		
	var info;
	   
	info = "Name:" + this.filename + ", "
	     + "Caption:" + this.caption + ", "
		 + "Width:" + this.width + ", "
		 + "Height:" + this.height + ", "
	     + "State:" + this.state + ", "
		 + "Retries:" + this.retries;
			   
	return info;
};

////////////////////////////////////////////////////////////////////////
// Cab class manages an active file cabinet (instanced as CAB)
////////////////////////////////////////////////////////////////////////

function Cab()
{
	this.id = "";
	this.title = "";
	this.timer = 0;
	this.timerBusy = false;
	this.numIdle = 0;
	this.numPreloading = 0;
	this.numPreloaded = 0;
	this.numAborted = 0;
	this.state = CON.cabStates.idle;
	this.error = null;
	this.notifyOffset = 0;
	this.notifyLength = 0;
	
	this.readyHandler = null;
	this.preloadHandler = null;

	this.items = [];
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.init = function(readyHandler)
{
	try
	{
		this.state = CON.cabStates.initialising;
		this.readyHandler = readyHandler;
		this.requestData();
	}
	catch(err)
	{
		ERR.clear();
		this.error = err;
		this.state = CON.cabStates.errored;
		if (this.readyHandler) {this.readyHandler();}
	}	
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.numItems = function() 
{
	return this.items.length;
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.match = function(filename)
{
	var i;
	   
	for (i = 0; i < CAB.items.length; i++)
	{
		if (this.items[i].filename === filename) {return i;}
	}
	return -1;
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.dataFeedUrl = function()
{
	var url = SRC.feedUrl + "?kind=filecabinet&path=/" + SRC.path + "/" + CFG.cabName;
	 
	if (SRC.noCache)
	{		  
		url += "&nocache=" + DOC.serveTime;	// Google Trick
	}	
		 
	return url;
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.itemsFeedUrl = function()
{
	var url = SRC.feedUrl
			+ "?kind=attachment"
			+ "&parent=" + this.id
			+ "&max-results=" + (CON.cab.maxItems + 1);
					 
	// Note above that we specified one greater than maximum allowable
	// items. This will allow us to later determine if too many items
	// were present in the cabinet. This is important because the
	// problem might go unnoticed for a long time until someone noticed
	// If items were returned in alphabetic order then it wouldn't
	// matter if excess items were discarded but this is not the case
		
	if (SRC.noCache)
	{		  
		url += "&nocache=" + DOC.serveTime;	// Google Trick
	}	  
		 
	return url; 
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.webUrl = function()
{
	return SRC.siteUrl + "/" + SRC.path + "/" + CFG.cabName;	
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.requestData = function()
{   
	var params;
	var self = this;
   
	params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
    gadgets.io.makeRequest(this.dataFeedUrl(), function(obj){self.processData(obj);}, params);
};

////////////////////////////////////////////////////////////////////////
	  
Cab.prototype.processData = function(obj)
{
	var dNode;
	var fNodes;
	var fNode;
	var eNodes;
	var eNode;
	var tNodes;
	var tNode;
	var text;
	var id;
	var title;
	
	try
	{
		dNode = obj.data;
		if (!dNode) {ERR.WEB("Unable to retrieve photo cabinet feed", [this.dataFeedUrl(), obj.errors]);}
		   
		fNodes = dNode.getElementsByTagName("feed");
		ERR.CHK(fNodes, "Cab DOM feed");
		if (fNodes.length!==1) {ERR.WEB("Invalid photo cabinet feed", this.dataFeedUrl());}
		fNode = fNodes[0];
		   
		eNodes = fNode.getElementsByTagName("entry");
		ERR.CHK(eNodes, "Cab DOM entry");
		if (eNodes.length!==1) {ERR.WEB("Photo cabinet entry not found", this.dataFeedUrl());}
		eNode = eNodes[0];
		   
		tNodes = eNode.getElementsByTagName("id");
		ERR.CHK(tNodes, "Cab DOM id");
		if (tNodes.length!==1) {ERR.WEB("Bad photo cabinet feed: expected single entry for id", this.dataFeedUrl());}
		tNode = tNodes[0];	   	   
		text = getNodeText(tNode);
		if (text.length === 0) {ERR.WEB("Bad photo cabinet feed: blank entry id", this.dataFeedUrl());}
		id = text.slice(text.lastIndexOf("/")+1);
		   
		tNodes = eNode.getElementsByTagName("title");
		ERR.CHK(tNodes, "Cab DOM title");
		if (tNodes.length!==1) {ERR.WEB("Bad photo cabinet feed: expected single entry for title", this.dataFeedUrl());}
		tNode = tNodes[0];	   	   
		text = getNodeText(tNode);
		if (text.length === 0) {ERR.WEB("Bad photo cabinet feed: blank entry title", this.dataFeedUrl());}
		title = text;
		
		this.id = id;
		this.title = title;
		
		this.requestItems();
	}
	
	catch(err)
	{
		ERR.clear();
		this.error = err;
		this.state = CON.cabStates.errored;
		if (this.readyHandler) {this.readyHandler();}
	}
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.requestItems = function()
{   
	var params;
	var self = this;

	params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;

    gadgets.io.makeRequest(this.itemsFeedUrl(), function(obj){self.processItems(obj);}, params);
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.processItems = function(obj)
{ 
	var dNode;  
	var fNodes;
	var fNode;
	var eNodes;
	var eNode;
	var tNodes;
	var tNode;
	var text;
	var filename;
	var caption;
	var i;
	
	try
	{
		dNode = obj.data;
		if (!dNode) {ERR.WEB("Unable to retrieve photo cabinet items feed", [this.itemsFeedUrl(), obj.errors]);}
		   
		fNodes = dNode.getElementsByTagName("feed");
		ERR.CHK(fNodes, "DOM feed");
		if (fNodes.length!==1) {ERR.WEB("Bad photo cabinet items feed: expected single feed node", this.itemsFeedUrl());}
		fNode = fNodes[0];
		   
		eNodes = fNode.getElementsByTagName("entry");
		ERR.CHK(eNodes, "DOM entry");

		if (eNodes.length > CON.cab.maxItems)
		{
			ERR.WEB("Number of file cabinet items must not exceed " + CON.cab.maxItems, this.itemsFeedUrl());
		}
		 
		// Note it is possible to have zero cab entries    
		
		this.items = [];
			   
		for (i=0; i < eNodes.length; i++)
		{
			eNode = eNodes[i];
				  
			tNodes = eNode.getElementsByTagName("title");
			ERR.CHK(tNodes, "Cab items DOM entry title");
			if (tNodes.length!==1) {ERR.WEB("Bad photo cabinet items feed: expected single entry for title", this.itemsFeedUrl());}
			tNode = tNodes[0];			  
			text = getNodeText(tNode);
			if (text.length === 0) {ERR.WEB("Bad photo cabinet items feed: blank entry title", this.itemsFeedUrl());}
			filename = text;
				  
			tNodes = eNode.getElementsByTagName("summary");
			ERR.CHK(tNodes, "Cab items DOM entry summary");
		
			if (tNodes.length!==1) {ERR.WEB("Bad photo cabinet items feed: expected single entry for summary", this.itemsFeedUrl());}
			tNode = tNodes[0];			  
			text = getNodeText(tNode);
			caption = text === null ? '' : text;
				  
			this.addItem(new CabItem(this.webUrl(), filename, caption));
		}
		
		// All cab items are now processed but we need to sort and limit
		   
		this.items.sort(byFilename);
		limitArray(this.items, CON.cab.maxItems);
		
		this.state = CON.crxStates.ready;
	}
	
	catch(err)
	{
		ERR.clear();
		this.error = err;
		this.state = CON.cabStates.errored;
	}
	
	if (this.readyHandler) {this.readyHandler();}   		
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.addItem = function(item) 
{
	this.items.push(item);
	this.numIdle +=1;
};
	   
////////////////////////////////////////////////////////////////////////

Cab.prototype.timerEnabled = function() 
{
	return (this.timer === 0) ? false : true;
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.enableTimer = function(state) 
{
	var self = this;
	   
	if (state)
	{
		if (this.timer === 0)
		{
			this.timer=setInterval(function(){ self.timerHandler(); }, CON.cab.timerInterval);
			this.timerBusy = false;
		}
	}
	else
	{
		if (this.timer !== 0)
		{
			clearInterval(this.timer);
			this.timer=0;
			this.timerBusy = false;
		}
	}
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.preload = function(preloadHandler, offset, length)
{
	var self = this;	
	var atLeastOne = false;
	var item;
	var i;

	// Use sensible defaults for optional parameters
	   
	if (offset===undefined)
	{
		offset = 0;
			  
		if (length===undefined)
		{
			length = this.items.length;
		}
	}
	else
	{ 
		if (length===undefined)
		{
			length = 1;
		}
	}

	ERR.CHK(offset >= 0 && offset < CAB.items.length, "Cab preload offset out of range");
	ERR.CHK(length >= 0 && length <= CAB.items.length, "Cab preload length out of range");
	
	// Specifying a preloadhandler will trigger a notify when range is fully preloaded.
	// A preload call without a handler does not affect existing notify handler and range.
	// The former is used by Sel.show(); the latter by Sho.preload(), i.e. lookahead cache  

	if (preloadHandler)
	{
		this.notifyOffset = offset;
		this.notifyLength = length;
		this.preloadHandler = preloadHandler;
	}
	     
	for (i=offset; i < (offset + length); i++)
	{		  
		item = this.items[i % this.items.length];	// handles wrap
			  
		// Silently ignore items already preloading, preloaded or aborted
	  	  
		if (item.state !== CON.imgStates.idle)
		{
			continue;
		}
			  
		ERR.CHK(this.numPreloading < CON.cab.maxItems, "Cab preload tracking overrun");
		ERR.CHK(item.retries === 0, "Cab item retries should be 0");
	
		this.numPreloading += 1;
		this.numIdle -= 1;
		item.state = CON.imgStates.preloading;	 
		  
		if (SRC.noCache)
		{	
			item.img.src = item.cabSrc()+"?nocache=" + DOC.serveTime; // Google Trick; 	
		}
		else
		{
			if (CFG.useImageProxy)
			{
				item.img.src = gadgets.io.getProxyUrl(item.cabSrc());
			}	
			else
			{
				item.img.src = item.cabSrc(); 	
			}
		}
			  
		atLeastOne = true;
	}

	if (atLeastOne || this.preloadHandler)
	{
		if (!this.timerEnabled())
		{
			this.enableTimer(true);
		}
	}
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.timerHandler = function()
{
	var i;
	var item;
	var notify;

	// Ignore overlapping timer events

	if (this.timerBusy)
	{
		return;
	}

	this.timerBusy = true;
	   
	for (i=0; i < this.items.length; i++)
	{
		item = this.items[i];

		// We are only interested in items already preloading
		// This will also take care of any spurious timer events
		// which might be queued up before timer has been disabled
		
		if ( item.state !== CON.imgStates.preloading)
		{
			continue;
		}
		
		ERR.CHK(this.numPreloading > 0, "Cab preload tracking underrun");

		if (item.img.complete)
		{	
			// Preloaded

			item.width = item.img.width;		 
			item.height = item.img.height;	
				  		 
			// Update item state and global trackers
					 
			this.numPreloading -= 1;
			this.numPreloaded += 1;					 
			item.state = CON.imgStates.preloaded;
			item.retries = 0;
		}
		else
		{
			// Not yet preloaded
				
			if (item.retries === CON.cab.maxRetries)
			{	
				this.numPreloading -= 1;	   
				this.numAborted += 1;					 
				item.state = CON.imgStates.aborted;
				item.retries = 0;
				item.img.src = "";
			}
			else
			{
				// Still more time to wait
							   
				item.retries += 1;
			}
		}

		if (this.numPreloading <= 0)
		{
			// Good time to check tracking variables
			
			ERR.CHK(this.numPreloading === 0, "Cab numPreloading under-run");			
			ERR.CHK(this.numIdle + this.numPreloaded + this.numAborted === this.numItems(), "Cab tracking problem");
						   
			this.enableTimer(false);
		}
	}
	
	if (this.preloadHandler)
	{
		notify = true;

		for (i = this.notifyOffset; i < (this.notifyOffset + this.notifyLength); i++)	
		{
			item = this.items[i % this.items.length];	// handles wrap
			
			if (item.state === CON.imgStates.preloading)
			{
				notify = false;
				break;
			}

			ERR.CHK(item.state === CON.imgStates.preloaded || item.state === CON.imgStates.aborted);
		}

		if (notify)
		{
			this.preloadHandler();
			this.preloadHandler = null;
			this.notifyOffset = 0;
			this.notifyLength = 0;
		}
	}

	this.timerBusy = false;
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.info = function() 
{
	var i;
	var info;
	   
	info = "PHOTO CABINET INFO\n"
		 + "Title: " + this.title + "\n"
		 + "ID: " + this.id + "\n"
		 + "CONTENTS\n";
	   
	for (i=0; i < this.items.length; i++)
	{
		info += this.items[i].info() + "\n";
	}
	
	return info; 
};

////////////////////////////////////////////////////////////////////////

Cab.prototype.close = function()
{
	// Tear down object data so that there is no straggling html or
	// potential circular references or outstanding timer events
	
	this.enableTimer(false);
	
	this.readyHandler = null;
	this.preloadHandler = null;
	this.items = null;
};

////////////////////////////////////////////////////////////////////////
// CrxItem class is instanced for each cabinet in root directory
////////////////////////////////////////////////////////////////////////

function CrxItem(name, title)
{	
	this.name = name;
	this.title = title;
};

////////////////////////////////////////////////////////////////////////
// Crx class manages photo cabinet root directory (instanced as CRX)
////////////////////////////////////////////////////////////////////////

function Crx()
{
	this.id = "";
	this.title = "";   
	this.items = [];
	this.state = CON.crxStates.idle;
	this.error = null;
	this.readyHandler = null;
};

////////////////////////////////////////////////////////////////////////

Crx.prototype.init = function(readyHandler)
{
	try
	{
		this.state = CON.crxStates.initialising;
		this.readyHandler = readyHandler;
		this.requestData();
	}
	
	catch(err)
	{
		ERR.clear();
		this.error = err;
		this.state = CON.crxStates.errored;
		if (this.readyHandler) {this.readyHandler();}
	}
};

////////////////////////////////////////////////////////////////////////

Crx.prototype.dataFeedUrl = function()
{	   
	var url = SRC.feedUrl + "?path=/" + SRC.path;
	 
	if (SRC.noCache)
	{		  
		url += "&nocache=" + DOC.serveTime;	// Google Trick
	}	  
	return url;   
};

////////////////////////////////////////////////////////////////////////

Crx.prototype.itemsFeedUrl = function()
{
	var url = SRC.feedUrl
			+ "?kind=filecabinet"
			+ "&parent=" + this.id
			+ "&max-results=" + (CON.crx.maxItems + 1);
					 
	// Note above that we specified one greater than maximum allowable
	// items. This will allow us to later determine if too many cabinets
	// were present in the source directory.
			 
	if (SRC.noCache)
	{		  
		url += "&nocache=" + DOC.serveTime;	// Google Trick
	}	  
	 
	return url; 
};

////////////////////////////////////////////////////////////////////////

Crx.prototype.requestData = function()
{   
	var params;
	var self = this;
	
	params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
    gadgets.io.makeRequest(this.dataFeedUrl(), function(obj){self.processData(obj);}, params);	
};

////////////////////////////////////////////////////////////////////////
	  
Crx.prototype.processData = function(obj)
{
	var dNode;
	var fNodes;
	var fNode;
	var eNodes;
	var eNode;
	var tNodes;
	var tNode;
	var text;
	var id;
	var title;	
	
	try
	{
		dNode = obj.data;
		if (!dNode) {ERR.WEB("Unable to retrieve photo cabinet index feed", [this.dataFeedUrl(), obj.errors]);}   
		   
		fNodes = dNode.getElementsByTagName("feed");
		ERR.CHK(fNodes, "Cab DOM feed");
		if (fNodes.length!==1) {ERR.WEB("Invalid photo cabinet index feed", this.dataFeedUrl());}
		fNode = fNodes[0];
		   
		eNodes = fNode.getElementsByTagName("entry");
		ERR.CHK(eNodes, "Cab DOM entry");
		if (eNodes.length!==1) {ERR.WEB("Photo cabinet index not found", this.dataFeedUrl());}
		eNode = eNodes[0];
		   
		tNodes = eNode.getElementsByTagName("id");
		ERR.CHK(tNodes, "Cab DOM id");
		if (tNodes.length!==1) {ERR.WEB("Bad photo cabinet index feed: expected single entry for id", this.dataFeedUrl());}
		tNode = tNodes[0];	   	   
		text = getNodeText(tNode);
		if (text.length === 0) {ERR.WEB("Bad photo cabinet index feed: blank entry id", this.dataFeedUrl());}
		id = text.slice(text.lastIndexOf("/")+1);
		   
		tNodes = eNode.getElementsByTagName("title");
		ERR.CHK(tNodes, "Cab DOM title");
		if (tNodes.length!==1) {ERR.WEB("Bad photo cabinet index feed: expected single entry for title", this.dataFeedUrl());}
		tNode = tNodes[0];	   	   
		text = getNodeText(tNode);
		if (text.length === 0) {ERR.WEB("Bad photo cabinet index feed: blank entry title", this.dataFeedUrl());}
		title = text;
		
		this.id = id;
		this.title = title;
	
		this.requestItems();
	}
	catch(err)
	{
		ERR.clear();
		this.error = err;
		this.state = CON.crxStates.errored;
		if (this.readyHandler) {this.readyHandler();}
	}
};

////////////////////////////////////////////////////////////////////////

Crx.prototype.requestItems = function()
{   
	var params;
	var self = this;
	
	params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
	
    gadgets.io.makeRequest(this.itemsFeedUrl(), function(obj){self.processItems(obj);}, params);
};

////////////////////////////////////////////////////////////////////////

Crx.prototype.processItems = function(obj)
{ 
	var dNode;  
	var fNodes;
	var fNode;
	var eNodes;
	var eNode;
	var tNodes;
	var tNode;
	var text;
	var name;
	var title;
	var i;

	try
	{
		dNode = obj.data;
		if (!dNode) {ERR.WEB("Unable to retrieve photo cabinet index items feed", [this.itemsFeedUrl(), obj.errors]);}
		   
		fNodes = dNode.getElementsByTagName("feed");
		ERR.CHK(fNodes, "DOM feed");
		if (fNodes.length!==1) {ERR.WEB("Bad photo cabinet index items feed: expected single feed node", this.itemsFeedUrl());}
		fNode = fNodes[0];
		   
		eNodes = fNode.getElementsByTagName("entry");
		ERR.CHK(eNodes, "DOM entry");
		   
		if (eNodes.length > CON.crx.maxItems)
		{
			ERR.web("Number of source file cabinets must not exceed " + CON.crx.maxItems, this.itemsFeedUrl());
		}
		 
		// Note it is possible to have zero entries    
		
		this.items = [];
		
		for (i=0; i < eNodes.length; i++)
		{
			eNode = eNodes[i];
				  
			tNodes = eNode.getElementsByTagName("title");
			ERR.CHK(tNodes, "Cab items DOM entry title");
			if (tNodes.length!==1) {ERR.WEB("Bad photo cabinet index items feed: expected single entry for title", this.itemsFeedUrl());}
			tNode = tNodes[0];			  
			text = getNodeText(tNode);
			if (text.length === 0) {ERR.WEB("Bad photo cabinet index items feed: blank entry title", this.itemsFeedUrl());}
			title = (text.length === 0) ? "UNTITLED" : text;
				  
			tNodes = getElementsByTagNameNS(eNode, "sites", "pageName");
			ERR.CHK(tNodes, "Cab items DOM entry sites:pageName");
			if (tNodes.length!==1) {ERR.WEB("Bad photo cabinet index items feed: expected single entry for sites:pageName", this.itemsFeedUrl());}
			tNode = tNodes[0];			  
			text = getNodeText(tNode);
			name = text;
				  
			this.items.push(new CrxItem(name, title));
		}
		
		// All cab index items are now processed but we need to sort and limit
		   
		this.items.sort(byTitle);
		limitArray(this.items, CON.crx.maxItems);
		
		this.state = CON.crxStates.ready;
	}
	
	catch(err)
	{
		ERR.clear();
		this.error = err;
		this.state = CON.crxStates.errored;
	}
	
	if (this.readyHandler) {this.readyHandler();}   
};

////////////////////////////////////////////////////////////////////////

Crx.prototype.close = function()
{
	// Tear down object data so that there is no straggling html or
	// potential circular references using worst case assumptions
	   
	this.readyHandler = null;
};

////////////////////////////////////////////////////////////////////////
// Png class is a dynamic PNG-based image generator
////////////////////////////////////////////////////////////////////////


function Png(width, height, depth)
{
	// constructs Png object containing blank image

	var i;
	var header;
	var size;
	var bits;

	this.width   = width;
	this.height  = height;
	this.depth   = depth;

	this.pix_size = height * (width + 1);

	this.data_size = 2 + this.pix_size + 5 * Math.floor((0xfffe + this.pix_size) / 0xffff) + 4;


	this.ihdr_offs = 0;								
	this.ihdr_size = 4 + 4 + 13 + 4;

	this.plte_offs = this.ihdr_offs + this.ihdr_size;		
	this.plte_size = 4 + 4 + 3 * depth + 4;

	this.trns_offs = this.plte_offs + this.plte_size;		
	this.trns_size = 4 + 4 + depth + 4;

	this.idat_offs = this.trns_offs + this.trns_size;		
	this.idat_size = 4 + 4 + this.data_size + 4;

	this.iend_offs = this.idat_offs + this.idat_size;	
	this.iend_size = 4 + 4 + 4;

	this.buffer_size  = this.iend_offs + this.iend_size;

	this.buffer  = [];
	this.palette = {};
	this.pindex  = 0;

	// initialize buffer with blank image
	
	for (i = 0; i < this.buffer_size; i++)
	{
		this.buffer[i] = "\x00";
	}

	writeChars(this.buffer, this.ihdr_offs, encodeI4(this.ihdr_size - 12), 'IHDR', encodeI4(width), encodeI4(height), "\x08\x03");
	writeChars(this.buffer, this.plte_offs, encodeI4(this.plte_size - 12), 'PLTE');
	writeChars(this.buffer, this.trns_offs, encodeI4(this.trns_size - 12), 'tRNS');
	writeChars(this.buffer, this.idat_offs, encodeI4(this.idat_size - 12), 'IDAT');
	writeChars(this.buffer, this.iend_offs, encodeI4(this.iend_size - 12), 'IEND');

	header = ((8 + (7 << 4)) << 8) | (3 << 6);
	header += 31 - (header % 31);

	writeChars(this.buffer, this.idat_offs + 8, encodeI2(header));

	for (i = 0; (i << 16) - 1 < this.pix_size; i++)
	{
		if (i + 0xffff < this.pix_size)
		{
			size = 0xffff;
			bits = "\x00";
		}
		else
		{
			size = this.pix_size - (i << 16) - i;
			bits = "\x01";
		}

		writeChars(this.buffer, this.idat_offs + 8 + 2 + (i << 16) + (i << 2), bits, encodeI2rev(size), encodeI2rev(~size));
	}
};

////////////////////////////////////////////////////////////////////////

Png.prototype.index = function(x,y)
{
	// returns buffer index corresponding to x,y pixel position

	var i = y * (this.width + 1) + x + 1;
	var j = this.idat_offs + 8 + 2 + 5 * Math.floor((i / 0xffff) + 1) + i;

	return j;
};

////////////////////////////////////////////////////////////////////////

Png.prototype.color = function(red, green, blue, alpha)
{
	// adds color to palette, returning color index

	alpha = alpha >= 0 ? alpha : 255;

	var color = (((((alpha << 8) | red) << 8) | green) << 8) | blue;

	if (typeof this.palette[color] == "undefined")
	{
		if (this.pindex == this.depth)
		{
			return "\x00";
		}

		var ndx = this.plte_offs + 8 + 3 * this.pindex;

		this.buffer[ndx + 0] = String.fromCharCode(red);
		this.buffer[ndx + 1] = String.fromCharCode(green);
		this.buffer[ndx + 2] = String.fromCharCode(blue);
		this.buffer[this.trns_offs+8+this.pindex] = String.fromCharCode(alpha);

		this.palette[color] = String.fromCharCode(this.pindex++);
	}

	return this.palette[color];
};

////////////////////////////////////////////////////////////////////////

Png.prototype.save = function()
{
	// saves snapshot of image as a raw string of bytes
	// with required adler32 and crc32 computations

	var BASE = 65521; // largest prime smaller than 65536
	var NMAX = 5552;  // largest n such that 255n(n+1)/2 + (n+1)(BASE-1) <= 2^32-1
	var s1 = 1;
	var s2 = 0;
	var n = NMAX;

	for (var y = 0; y < this.height; y++)
	{
		for (var x = -1; x < this.width; x++)
		{
			s1 += this.buffer[this.index(x, y)].charCodeAt(0);
			s2 += s1;
			
			if ((n -= 1) === 0)
			{
				s1 %= BASE;
				s2 %= BASE;

				n = NMAX;
			}
		}
	}

	s1 %= BASE;
	s2 %= BASE;
	
	writeChars(this.buffer, this.idat_offs + this.idat_size - 8, encodeI4((s2 << 16) | s1));

	crc32cat(this.buffer, this.ihdr_offs + 4, this.ihdr_size - 8);
	crc32cat(this.buffer, this.plte_offs + 4, this.plte_size - 8);
	crc32cat(this.buffer, this.trns_offs + 4, this.trns_size - 8);
	crc32cat(this.buffer, this.idat_offs + 4, this.idat_size - 8);
	crc32cat(this.buffer, this.iend_offs + 4, this.iend_size - 8);

	return CON.png.header + this.buffer.join('');
};

////////////////////////////////////////////////////////////////////////
// SelColumn class holds essential information about a selection column
////////////////////////////////////////////////////////////////////////
	   
function SelColumn(max, rows, width, height)
{	
	this.max = max;
	this.rows = rows;	
	this.width = width;
	this.height = height;   
};

////////////////////////////////////////////////////////////////////////
// SelItem class holds essential information about a selection item
////////////////////////////////////////////////////////////////////////
	   
function SelItem(cabIndex, divId, width, height)
{	
	this.cabIndex = cabIndex;	
	this.divId = divId;
	this.width = width;   
	this.height = height;	
};

////////////////////////////////////////////////////////////////////////
// Sel class manages an active photo selection (instanced as SEL)
////////////////////////////////////////////////////////////////////////

function Sel(divId, leadIndex, cfgset, options, readyHandler, extClickHandler)
{	
	var contentHeight;
	var p;
	var i;
	var h;
	
	ERR.CHK(gel(divId), "Sel: DivId not found", divId); 
	this.divId = divId;

	contentHeight = DOC.height - 2 * CFG.padding;
	
	// should have been already validated

	ERR.CHK(contentHeight >= CON.content.minHeight, "height validation bug");

	// If not specified, lead photo is always the first
	
	this.leadIndex = typeof(leadIndex) === 'number' ? leadIndex : 0;
	
	// Only option overrides need to be supplied by caller
	// Remaining options will default to configuration settings
	// Some options have dual (A/B) configurations
	// Use cfgset parameter ('A'|'B') to specify which defaults to use.

	options = typeof(options === 'object') ? options : {};
	this.options = {};
	
	this.options.align = CON.aligns.has(options.align) ? options.align : CFG.align;
	this.options.height = typeof(options.height) === 'number' ? options.height : contentHeight;
	this.options.wrap = typeof(options.wrap) === 'boolean' ? options.wrap : CFG.wrap;
	this.options.noSymbols = typeof(options.noSymbols) === 'boolean' ? options.noSymbols : CFG.noSymbols;
	this.options.grid = isArrayOf(options.grid,'number') ? options.grid : CFG.grid;
	this.options.layout = typeof(options.layout) === 'number' ? options.layout : CFG.layout;
	this.options.text = typeof(options.text) === 'string' ? options.text : CFG.text;
	this.options.link = typeof(options.link) === 'string' ? options.link : CFG.link;
	this.options.linkNew = typeof(options.linkNew) === 'boolean' ? options.linkNew : CFG.linkNew;

	this.options.frameColor = isColor(options.frameColor) ? options.frameColor : cfgset === 'A' ? CFG.frameColorA : CFG.frameColorB;
	this.options.frameStyle = CON.frameStyles.has(options.frameStyle) ? options.frameStyle : cfgset === 'A' ? CFG.frameStyleA : CFG.frameStyleB;
	this.options.frameWidth = this.options.frameStyle === CON.frameStyles.none ? 0 : typeof(options.frameWidth) === 'number' ? options.frameWidth : cfgset === 'A' ? CFG.frameWidthA : CFG.frameWidthB;
	
	this.options.shapeColor = isColor(options.shapeColor) ? options.shapeColor : cfgset === 'A' ? CFG.shapeColorA : CFG.shapeColorB;
	this.options.shapeStyle = CON.shapeStyles.has(options.shapeStyle) ? options.shapeStyle : cfgset === 'A' ? CFG.shapeStyleA : CFG.shapeStyleB;
	this.options.shapeRadius = this.options.shapeStyle === CON.shapeStyles.rect ? 0 : typeof(options.shapeRadius) === 'number' ? options.shapeRadius : cfgset === 'A' ? CFG.shapeRadiusA : CFG.shapeRadiusB;

	this.options.matColor = isColor(options.matColor) ? options.matColor : cfgset === 'A' ? CFG.matColorA : CFG.matColorB;
	this.options.matStyle = CON.matStyles.has(options.matStyle) ? options.matStyle : cfgset === 'A' ? CFG.matStyleA : CFG.matStyleB;
	this.options.matWidth = this.options.matStyle === CON.matStyles.none ? 0 : typeof(options.matWidth) === 'number' ? options.matWidth : cfgset === 'A' ? CFG.matWidthA : CFG.matWidthB;

	this.options.edgeColor = isColor(options.edgeColor) ? options.edgeColor : cfgset === 'A' ? CFG.edgeColorA : CFG.edgeColorB;
	this.options.edgeStyle = CON.edgeStyles.has(options.edgeStyle) ? options.edgeStyle : cfgset === 'A' ? CFG.edgeStyleA : CFG.edgeStyleB;
	this.options.edgeWidth = this.options.edgeStyle === CON.edgeStyles.none ? 0 :typeof(options.edgeWidth) === 'number' ? options.edgeWidth : cfgset === 'A' ? CFG.edgeWidthA : CFG.edgeWidthB;

	this.options.revealColor = isColor(options.revealColor) ? options.revealColor : cfgset === 'A' ? CFG.revealColorA : CFG.revealColorB;
	this.options.revealStyle = CON.revealStyles.has(options.revealStyle) ? options.revealStyle : cfgset === 'A' ? CFG.revealStyleA : CFG.revealStyleB;
	this.options.revealWidth = this.options.revealStyle === CON.revealStyles.none ? 0 :typeof(options.revealWidth) === 'number' ? options.revealWidth : cfgset === 'A' ? CFG.revealWidthA : CFG.revealWidthB;

	this.options.shadowColor = isColor(options.shadowColor) ? options.shadowColor : cfgset === 'A' ? CFG.shadowColorA : CFG.shadowColorB;
	this.options.shadowStyle = CON.shadowStyles.has(options.shadowStyle) ? options.shadowStyle : cfgset === 'A' ? CFG.shadowStyleA : CFG.shadowStyleB;
	this.options.shadowWidth = this.options.shadowStyle === CON.shadowStyles.none ? 0 : typeof(options.shadowWidth) === 'number' ? options.shadowWidth : cfgset === 'A' ? CFG.shadowWidthA : CFG.shadowWidthB;

	this.options.spaceColor = isColor(options.spaceColor) ? options.spaceColor : cfgset === 'A' ? CFG.spaceColorA : CFG.spaceColorB;
	this.options.spaceStyle = CON.spaceStyles.has(options.spaceStyle) ? options.spaceStyle : cfgset === 'A' ? CFG.spaceStyleA : CFG.spaceStyleB;
	this.options.spaceWidth = typeof(options.spaceWidth) === 'number' ? options.spaceWidth : cfgset === 'A' ? CFG.spaceWidthA : CFG.spaceWidthB;

	this.options.footerColor = isColor(options.footerColor) ? options.footerColor : CFG.footerColor;
	this.options.footerStyle = CON.textStyles.has(options.footerStyle) ? options.footerStyle : CFG.footerStyle;
	this.options.footerHeight = this.options.footerStyle === CON.textStyles.none ? 0 : typeof(options.footerHeight) === 'number' ? options.footerHeight : CFG.footerHeight;
	
	this.options.hoverColor = isColor(options.hoverColor) ? options.HoverColor : CFG.hoverColor;
	
	// Ensure that frome here on in, we don't indavertently
	// use a raw parameter instead of a processed one
	
	options = undefined; 
	
	this.readyHandler = readyHandler;
	this.extClickHandler = extClickHandler;
	this.preloading = false;
	
	this.columns = [];
	this.items = [];
	this.gridWidth = 0;
	this.gridHeight = 0;
	this.footerId = divId + '-footer';
};

////////////////////////////////////////////////////////////////////////

Sel.prototype.show = function(leadIndex)
{	
	var self;			// Used for passing callback function
	var tc;				// Total number of columns available
	var ac;				// Actual number of columns to be displayed        
	var tp;				// Number of photos available from file cabinet
	var ap;				// Actual number of photos to be displayed
	var col;			// current column
	var c;				// column index
	var minHeight;		// Prevents raw photo from being scaled too low
	
	self = this;   
	
	// leadIndex can be changed or remain current
	
	if (typeof(leadIndex) === 'number')
	{
		this.leadIndex = leadIndex;
	}
	
	// Upstream code has to take care not to call this method
	// unless CAB has been initialised and has something to show
	// It cannot be assumed that a cabinet that was present during
	// configuration is still there or is not temporarily unavailable
	
	if (CAB.items.length === 0)
	{
		ERR.RUN("Sel.show: Empty CAB");
	}
	
	if (this.leadIndex < 0 || this.leadIndex >= CAB.items.length)
	{
		ERR.RUN("Sel.show: Lead Index out of range", this.leadIndex);
	}
	    
	this.columns = [];
	this.items = [];
	   
	this.gridHeight = this.options.height - this.options.footerHeight;

	// In home view, gadget height will have to be sufficiant to
	// accommodate minimum image height within selection and maximum
	// decoration, spacing and footer metrics. This will already have
	// been validated before attempting to display selection. Slide
	// mode is never a problem because height expands dynamically.
	// However, config view poses a problem because preview div
	// dimensions are limited. The preview image may be clipped on
	// the right in the case of exceptionally wide photos. However,
	// vertical clipping is harder to control and not desirable if a
	// meaningful preview is to be obtained. To meet these contrasting
	// requirements, two minimum photo heights are defined depending on
	// the view. The minimum config view photo height should be small
	// enough to accommodate maximum decoration and spacing metrics in
	// the preview div. Since this is a fertile ground for programming
	// bugs, additional run-time checks are included for config view.

	if (ENV.view === CON.views.config)
	{
		for (c=0; c < this.options.grid.length; c++)
		{
			minHeight = this.options.grid[c]*(2*this.options.frameWidth + 2*this.options.matWidth + 2*this.options.edgeWidth + 2*this.options.revealWidth + this.options.shadowWidth + CON.sel.minConfigPhotoHeight)
			  	      + (this.options.grid[c]-1)*this.options.spaceWidth;
			
			if (this.gridHeight < minHeight)
			{
				ERR.RUN('config metrics bug');
			}
		}
	}
	
	// Get total values into local variables
	   
	tc = this.options.grid.length;  
	   
	if (this.leadIndex === 0 || this.options.wrap === true)
	{
		tp = CAB.items.length;
	}
	else
	{
		tp = CAB.items.length - this.leadIndex;
	}
	 
	// Start off with exact layout and adjust later
	// if necessary for other layout options
	   
	ap = 0;
	   
	for (c=0; c < tc && ap < tp; c++)
	{
		col = new SelColumn();
		col.max = this.options.grid[c]; 
	 
		col.rows = tp - ap;
		if (col.rows > col.max) {col.rows = col.max;}
	
		ap += col.rows;			  
		this.columns.push(col);
	}
	
	ac = c;
	   
	// Adjust partial fit for various layout options
	   
	switch(this.options.layout)
	{
	case CON.layouts.exact:
		break;
			  
	case CON.layouts.trimMin:
		if (ac <= 1) {break;}
		if (this.columns[ac-1].rows < this.columns[ac-2].rows)
		{
			ap -= this.columns[ac-1].rows;
			ac -= 1;
			this.columns.pop();			 
		}
		break;	
			  
	case CON.layouts.trimMax:
		if (ac === 0) {break;}
		if (this.columns[ac-1].rows < this.columns[ac-1].max)
		{
			ap -= this.columns[ac-1].rows;
			ac -= 1;
			this.columns.pop();
		}
		break;	
	   
	case CON.layouts.pushMin:
	    if (ac <= 1) {break;}
		for (c=0; c < ac-1 && this.columns[ac-1].rows < this.columns[ac-2].rows; c++)
		{	 
			while (this.columns[c].rows > 1 && this.columns[ac-1].rows < this.columns[ac-2].rows)
			{
				this.columns[c].rows -= 1;
				this.columns[ac-1].rows += 1;
			}
		}
		break;
   
	case CON.layouts.pushMax:
	    if (ac <= 1) {break;}
		for (c=0; c < ac-1 && this.columns[ac-1].rows < this.columns[ac-1].max; c++)
		{	 
			while (this.columns[c].rows > 1 && this.columns[ac-1].rows < this.columns[ac-1].max)
			{
				this.columns[c].rows -= 1;
				this.columns[ac-1].rows += 1;
			}
		}
		break;
			  
	case CON.layouts.pullMin:
	    if (ac <= 1) {break;}
		c=ac-2;
		while (this.columns[ac-1].rows < this.columns[ac-2].rows)
		{
			if ((c===0 && this.columns[0].rows > 1) || (c>0 && this.columns[c].rows > this.columns[c-1].rows))
			{
				this.columns[c].rows -= 1;
				this.columns[ac-1].rows += 1;
				c=ac-2;			   
			}
			else
			{
				if ( c > 0) {c -= 1;} else {break;}
			}
		}
		break;
			  
	case CON.layouts.pullMax:
	    if (ac <= 1) {break;}
		c=ac-2;
		while (this.columns[ac-1].rows < this.columns[ac-1].max)
		{
			if ((c===0 && this.columns[0].rows > 1) || (c>0 && this.columns[c].rows > this.columns[c-1].rows))
			{
				this.columns[c].rows -= 1;
				this.columns[ac-1].rows += 1;
				c=ac-2;			   
			}
			else
			{
				if (c>0) {c-=1;} else {break;}
			}
		}
		break;	   
	}
	 
	ERR.CHK(ac===this.columns.length,"Selection columns tracking error", ac, this.columns.length);
	ERR.CHK(ap > 0, "no available photos", ap);

	// Start pre-loading selected image(s). This can complete quickly
	// if image(s) are already preloaded, e.g. by lookahead cache.
	// However, an uncached image can take time and may even time out
	// So rather than leaving blank screen, show loading status after
	// a theme-definable delay if still preloading

	this.preloading = true;
	catchUpAndDo(bindEarly(this.showLoading, this), CFG.showLoadingDelay);
	CAB.preload(function(){self.preloadHandler();}, this.leadIndex, ap);
};

////////////////////////////////////////////////////////////////////////

Sel.prototype.showLoading = function()
{	
	// show loading status if still preloading

	if (this.preloading)
	{
		gel(this.divId).innerHTML = htmlMsg(CFG.langLoading);
	}
}

////////////////////////////////////////////////////////////////////////

Sel.prototype.preloadHandler = function()
{
	var align;				// align name
	var imgShift; 			// center shift to compensate for shadow
	var styleName;			// generic style name;
	var shadowProps;		// shadow style properties common to all selection items
	var matProps; 			// mat div style properties common to all selection items
	var imgProps; 			// image style properties common to all selection items
	var shadowPos; 			// shadow position
	var shadowBlur; 		// shadow blur
	var shadowSpread; 		// shadow spread
	var shadowOpacity; 		// shadow opacity
	var shadowColor; 		// shadow color
	var matShadow; 			// shadow implemented as box-shadow in mat div
	var col;				// current column
	var c;					// column index
	var r;					// Row index (within a column)
	var i;					// Cab Item index;	   
	var s;					// Selection Item index;
	var cabItem;			// current cab item
	var selItem;			// current sel item
	var numPreloaded;		// number of selected photos fully preloaded
	var avgWidth;			// average width of preloaded photos
	var avgHeight;			// average height of preloaded photos
	var avgRatio;			// average aspect ratio of preloaded photos
	var html;				// main HTML stream
	var w;					// general purpose width variable   
	var h;					// general purpose height variable
	var n; 					// general purpose number (or size)
	var ow;					// outer width
	var oh;					// outer height
	var orx;				// outer radius x (px)
	var orxu; 				// inner radius x plus unit
	var ory;				// outer radius y (px)
	var oryu; 				// inner radius y plus unit
	var ors;				// outer border radius style value
	var iw;					// inner width
	var ih;					// inner height
	var irx;				// inner radius x (px)
	var irxu; 				// inner radius x plus unit
	var iry;				// inner radius y (px)
	var iryu; 				// inner radius y plus unit
	var irs; 				// inner border radius style value
	var cornerStyle;  		// corner style
	var pixelRadius; 		// radius expressed in pixels (not percent)
	var rowWidth;			// sum of all image width elements (except spacing)
	var rowHeight;			// sum of all image height elements (except spacing)
	var imgDesc;			// image description (caption or cab title)
	var e;					// DOM element
	var title;				// cabinet Title
	var caption;			// photo caption
	var footerMetrics;		// footer font characteristics
	var footerMaxChars;		// maximum chars that will fit in footer (on avergage!)
	var footerText; 		// footer text we would like to fit if enough space
	var footerSym;			// footer symbol we would like to fit if enough space 
	var footerContent;		// actual footer contents based on available space
	var useHardLink;		// if link specified and no footer space to accommodate link

	this.preloading = false;

	// Center alignment requires shadow shift except in config view

	align = CON.aligns.nameOf(this.options.align);

	if (align === 'center' && ENV.view !== CON.views.config)
	{
		imgShift = this.options.shadowWidth;
	}
	else
	{
		imgShift = 0;
	} 

	// Pre-generate shadow div style properties common to all selection items.
	// Shadow div is underlaid and shifted towards bottom right.
	// Note that a blur shadow is implemented as a box-shadow on the mat div.
	// In this case, the shadow div must leave enough space to accommodate blur.

	styleName = CON.shadowStyles.nameOf(this.options.shadowStyle);

	shadowProps = 'position:absolute;bottom:0;right:0;border-width:0;margin:0;padding:0;';

	matShadow = false;

	switch (styleName)
	{
		case 'none':

			shadowProps += 'background-color:transparent';
			break;

		case 'solid':

			shadowProps += 'opacity:1.0;background-color:' + this.options.shadowColor;
			break;

		case 'translucent':

			shadowProps += 'opacity:0.4; background-color:' + this.options.shadowColor;
			break;

		case 'hazeS':
		case 'hazeT':
		case 'blurS':
		case 'blurT':

			shadowProps += 'background-color:transparent';
			
			if (styleName.substr(0,4) === 'haze')
			{
				shadowPos = Math.round(this.options.shadowWidth / 2);
				shadowBlur = this.options.shadowWidth;
				shadowSpread = shadowPos - shadowBlur;
			}
			else
			{
				shadowPos = Math.round(3 * this.options.shadowWidth / 4);
				shadowBlur = Math.round(this.options.shadowWidth / 2);
				shadowSpread = shadowBlur - shadowPos;
			}

			shadowOpacity = styleName.substr(4,1) === 'S' ? 1.0 : 0.4;
			shadowColor = hex2rgba(this.options.shadowColor, shadowOpacity);

			matShadow = true;
			
			break;

		default:

			shadowProps += 'background-color:transparent;'
			    		 + 'background-image:url(data:image/png;base64,' + pngPattern(this.options.shadowColor, styleName, 'RB') + ');'
		        		 + 'background-repeat:repeat;'
		        		 + 'background-attachment:local;'
		        		 + 'background-position:right bottom';
		    break;
	}

	// Pre-generate mat div style properties common to all selection items.
	// Blurred shadow effects are implemented as a box-shadow on the mat div.
	// Shadow div will have left enough space on bottom-right to accommodate blur

	styleName = CON.matStyles.nameOf(this.options.matStyle);

	matProps = 'position:absolute;left:0;top;0;margin:0;'
			 + 'padding:' + this.options.matWidth + 'px;'
			 + 'border-width:' + this.options.frameWidth + 'px;'
			 + 'border-style:' + CON.frameStyles.nameOf(this.options.frameStyle) + ';'
			 + 'border-color:' + this.options.frameColor + ';';

	switch (styleName)
	{
		case 'none':

			matProps += 'background-color:transparent';
			break;

		case 'solid':

			matProps += 'background-color:' + this.options.matColor;
			break;

		default:

			matProps += 'background-color:' + this.options.shapeColor + ';'
			    	  + 'background-image:url(data:image/png;base64,' + pngPattern(this.options.matColor, styleName, 'CC') + ');'
		        	  + 'background-repeat:repeat;'
		        	  + 'background-attachment:local;'
		        	  + 'background-position:center';
		    break;
	}

	if (matShadow)
	{
		matProps += ';box-shadow:'
			 	  + shadowPos  + 'px '
			 	  + shadowPos  + 'px '
			 	  + shadowBlur + 'px '
			 	  + shadowSpread + 'px '
			 	  + shadowColor;
	}

	// Pre-generate image div properties common to all selection items.
	// Always use solid reveal color for image background even if reveal width is zero.
	// Otherwise mat or background shadow will show through if image is not rendered.
	// Reveal color is also the background color for certain edge styles.
	// Since edge color should contrast with reveal color, it is also used for text
	// Text explanation will be displayed if image cannot be rendered

	imgProps = 'padding:' + this.options.revealWidth + 'px;'
		  	 + 'border-width:' + this.options.edgeWidth + 'px;'
		  	 + 'border-style:' + CON.edgeStyles.nameOf(this.options.edgeStyle) + ';'
		  	 + 'border-color:' + this.options.edgeColor + ';'
		  	 + 'background-color:' + this.options.revealColor + ';'
		  	 + 'color:' + this.options.edgeColor;
 
	// Gather stats about selected photos to assist pixel dimensioning later
	   
	avgRatio = 0;
	avgWidth = 0;
	avgHeight = 0;
	numPreloaded = 0;

	i = this.leadIndex;

	for (c=0; c < this.columns.length; c++)
	{
		col = this.columns[c];

		for (r=0; r < col.rows; r++)
		{	
			cabItem = CAB.items[i];
				  
			if (cabItem.state === CON.imgStates.preloaded)
			{
				avgWidth = (avgWidth*numPreloaded + cabItem.width)/(numPreloaded + 1);
				avgHeight = (avgHeight*numPreloaded + cabItem.height)/(numPreloaded + 1); 
				avgRatio = (avgRatio*numPreloaded + cabItem.width/cabItem.height)/(numPreloaded + 1); 
				numPreloaded += 1;
			}
			
			i = (i + 1) % CAB.items.length;
		}
	}

	if (numPreloaded === 0)
	{
		// Use ref height to generate stats for images that did not preload

		avgWidth = CFG.refHeight;
		avgHeight = CFG.refHeight;
		avgRatio = 1.0;
	}

	i = this.leadIndex;
	   
	for (c=0; c < this.columns.length; c++)
	{
		col = this.columns[c];
			  
		for (r=0; r < col.rows; r++)
		{
			cabItem = CAB.items[i];
					 
			if (cabItem.state === CON.imgStates.preloaded)
			{
				w = cabItem.width;
				h = cabItem.height;
			}
			else
			{
				w = avgWidth;
				h = Math.round(avgWidth/avgRatio);
			}
					 
			if (r === 0)
			{
				col.width = w;
				col.height = h;
			}
			else
			{
				col.height += h * col.width/w;
			}
			 
			i = (i + 1) % CAB.items.length;
		}

		if (this.options.layout === CON.layouts.exact)
		{				   
			h = (this.gridHeight - (col.max * (2*this.options.frameWidth + 2*this.options.matWidth + 2*this.options.edgeWidth + 2*this.options.revealWidth + this.options.shadowWidth) + (col.max-1) * this.options.spaceWidth))
			  * col.height/(col.height + (col.width/avgRatio)*(col.max-col.rows));
		}
		else
		{
			h = this.gridHeight - (col.rows * (2*this.options.frameWidth + 2*this.options.matWidth + 2*this.options.edgeWidth + 2*this.options.revealWidth + this.options.shadowWidth) + (col.rows-1) * this.options.spaceWidth); 		 
		}

		h = Math.round(h);
		w = Math.round(col.width * h/col.height);
		  
		col.width = w;
		col.height = h;
	}
	 
	// Now populate selection items with exact display dimensions
	   
	i = this.leadIndex;
	   
	for (c=0; c < this.columns.length; c++)
	{		
		h=0;
		col = this.columns[c];	
			  
		for (r=0; r < col.rows; r++)
		{	  
			cabItem = CAB.items[i];
			selItem = new SelItem(i, this.divId + "-" + nFix2(i));
			
			selItem.width = col.width;
					 
			if (r < col.rows-1)
			{
				if (cabItem.state === CON.imgStates.preloaded)
				{
					selItem.height = Math.round(cabItem.height * col.width/cabItem.width);
				}
				else
				{
					selItem.height = Math.round(selItem.width/avgRatio);
				}
									
				h += selItem.height;	
			}
			else // adjust last photo for exact cumulative column height
			{
				selItem.height = col.height - h;
			}
			 
			this.items.push(selItem);
			
			i = (i + 1) % CAB.items.length;
		}
	}
	 
	// we now have enough info to calculate total grid width	
	
	w = 0;
	
	for (c = 0; c < this.columns.length; c++)
	{
		w += this.columns[c].width;
	}
	
	if (this.columns.length > 0)
	{
	    w += (this.columns.length-1) * this.options.spaceWidth
		   + this.columns.length * (2*this.options.frameWidth + 2*this.options.matWidth + 2*this.options.edgeWidth + 2*this.options.revealWidth + this.options.shadowWidth);
	}

	this.gridWidth = w;

	// determine footer characteristics
	
	if (this.options.footerHeight === 0)
	{
		footerText = '';
		footerSym = '';
		footerContent = '';
	}
	else
	{   
		// Choose footer text and symbol based on logical progression:
		// Link and text parameters always get priority.
		// Otherwise, photo caption (if available) is preferred for single selections.
		// However, caption may not be available if photo was lazily uploaded.
		// If no caption available or multiple selections, fall back to cabinet title.
		// If cabinet is untitled, use generic 'view more' prompt as last resort

		title = CFG.cleanTitle ? clean(CAB.title) : CAB.title;
		caption = CFG.cleanCaption ? clean(CAB.items[this.leadIndex].caption) : CAB.items[this.leadIndex].caption;

		if (this.options.link.length > 0)
		{
			if (this.options.text.length > 0)
			{
				footerText = this.options.text;
				footerSym = CON.symbols.readMore;
			}
			else	
			{
				footerText = CFG.langReadMore;
				footerSym = CON.symbols.readMore;
			}
		}
		else if (this.options.text.length > 0)
		{
			footerText = this.options.text;
			footerSym = CON.symbols.viewMore;
		}
		else if (this.items.length === 1 && caption.length > 0 && caption.toLowerCase() !== 'untitled')
		{
			footerText = caption;
			footerSym = CON.symbols.viewMore;
		}
		else if (title.length > 0 && title.toLowerCase() !== 'untitled')
		{
			footerText = title;
			footerSym = CON.symbols.viewMore;
		}
		else
		{
			footerText = CFG.langViewMore;
			footerSym = CON.symbols.viewMore;
		}

		// finalise actual footer content based on available space
		// allow some headroom for symbols, space and wider-than-usual text

		styleName = CON.textStyles.nameOf(this.options.footerStyle);
		footerMetrics = fontMetrics(styleName, this.options.footerHeight);
		footerMaxChars = Math.floor(this.gridWidth / footerMetrics.width);

		// Decide on final footer contents based on available grid width
		// Our gadget needs to gracefully accommodate small images.

		if (this.options.noSymbols)
		{
			if (footerMaxChars < footerText.length)
			{
				// no room for text

				footerContent = '';
			}
			else
			{
				// room for text

				footerContent = footerText;
			}
		}
		else
		{
			if (footerMaxChars < 3)
			{
				// no room for text or symbol

				footerContent = '';
			}
			else if (footerMaxChars < 5 + footerText.length)
			{
				// room for symbol only

				footerContent = footerSym;
			}
			else
			{
				// room for text and symbol

				footerContent = footerText + '&nbsp;' + footerSym;
			}
		}
	}

	// Start building html by opening grid wrapper div

	html  = '<div style="display:inline-block;vertical-align:top;'
		  + 'text-align:' + align + ';'
		  + 'height:' + this.gridHeight + 'px;'
		  + 'padding:0px 0px 0px ' + imgShift + 'px">';

	// Open grid table

	html += '<table border="0" cellpadding="0" cellspacing="0">';
	html += '<tr>';

	// Iterate through grid columns
	   
	s = 0;   
 
	for (c = 0; c < this.columns.length; c++)
	{
		col = this.columns[c];
			  
		html += '<td valign="top">';
		
		for (r=0; r < col.rows; r++)
		{
			selItem = this.items[s];
			cabItem = CAB.items[selItem.cabIndex];

			rowWidth = selItem.width + 2*this.options.revealWidth + 2*this.options.edgeWidth + 2*this.options.matWidth + 2*this.options.frameWidth + this.options.shadowWidth;	
			rowHeight = selItem.height + 2*this.options.revealWidth + 2*this.options.edgeWidth + 2*this.options.matWidth + 2*this.options.frameWidth + this.options.shadowWidth;

			ow = selItem.width + 2*this.options.revealWidth + 2*this.options.edgeWidth + 2*this.options.matWidth + 2*this.options.frameWidth;	
			oh = selItem.height + 2*this.options.revealWidth + 2*this.options.edgeWidth + 2*this.options.matWidth + 2*this.options.frameWidth;

			iw = selItem.width + 2*this.options.revealWidth + 2*this.options.edgeWidth;			
			ih = selItem.height + 2*this.options.revealWidth + 2*this.options.edgeWidth;

			styleName = CON.shapeStyles.nameOf(this.options.shapeStyle);
			n = styleName.length;

			if (styleName === 'rect')
			{
				orx = 0;
				ory = 0;	
				irx = 0;
				iry = 0;
			}
			else
			{
				cornerStyle = styleName.substr(0, n - 2);
				pixelRadius = styleName.substr(n - 2, 2) === 'PX'; 

				if (pixelRadius)
				{
					// shape radius is pixels (absolute) - x and y radii identical

					switch(cornerStyle)
					{
						case 'round':
						case 'outer':

							orx = this.options.shapeRadius;

							if (cornerStyle === 'round')
							{
								irx = orx - this.options.frameWidth - this.options.matWidth;
								irx = irx < 0 ? 0 : irx;
							}
							else
							{
								irx = 0;
							}

							break;
							
						case 'inner':

							orx = 0;
							irx = this.options.shapeRadius;	
				
							break;
					}

					ory = orx;
					iry = irx;
				}
				else
				{
					// shape radius is percent (relative) - x and y radii may not be identical

					switch(cornerStyle)
					{
						case 'round':
						case 'outer':

							orx = Math.round(this.options.shapeRadius * ow / 100);
							ory = Math.round(this.options.shapeRadius * oh / 100);

							if (cornerStyle === 'round')
							{
								irx = orx - this.options.frameWidth - this.options.matWidth;
								irx = irx < 0 ? 0 : irx;

								iry = ory - this.options.frameWidth - this.options.matWidth;
								iry = iry < 0 ? 0 : iry;
							}
							else
							{
								irx = 0;
								iry = 0;
							}

							break;
							
						case 'inner':

							orx = 0;
							ory = 0;

							irx = Math.round(this.options.shapeRadius * iw / 100);
							iry = Math.round(this.options.shapeRadius * ih / 100);
				
							break;
					}
				}
			}

			// At this point, all radii have been normalised to pixel values
			// However, if any radius is approaching an elliptical value, replace with clean 50%.
		    // This will allow browser to perform optimal smoothing

			orxu = orx < Math.floor(ow / 2) ? orx + 'px' : '50%';
			oryu = ory < Math.floor(oh / 2) ? ory + 'px' : '50%';

			irxu = irx < Math.floor(iw / 2) ? irx + 'px' : '50%';
			iryu = iry < Math.floor(ih / 2) ? iry + 'px' : '50%';

			ors = orxu + ' / ' + oryu;
			irs = irxu + ' / ' + iryu;

			// Open grid element div

			html += '<div style="position:relative;border-width:0;margin:0;padding:0;'
				  + 'width:' + rowWidth + 'px;'
				  + 'height:' + rowHeight + 'px;'
				  + '">';

			// Generate shadow div

			html += '<div style="'
				  + 'width:' + ow + 'px;'
				  + 'height:' + oh + 'px;'
				  + 'border-radius:' + ors + ';'
				  + shadowProps
				  + '">'
				  + '</div>';

			// Open mat div

			html += '<div id="' + selItem.divId + '" '
				  + 'style="'
				  + 'border-radius:' + ors + ';'
				  + 'width:' + iw + 'px;'
				  + 'height:' + ih + 'px;'
				  + matProps
				  + '">';

			// Generate image element

			switch(cabItem.state)
			{
				case CON.imgStates.idle:
					imgDesc = 'idle';
					break;

				case CON.imgStates.preloading:
					imgDesc = 'preloading';
					break;		

				case CON.imgStates.preloaded:
					title = CFG.cleanTitle ? clean(CAB.title) : CAB.title;
					caption = CFG.cleanCaption ? clean(cabItem.caption) : cabItem.caption;
					imgDesc = caption.length > 0 ? caption : title;
					break;	

				case CON.imgStates.aborted:
					imgDesc = 'no show'; // could be a time-out or a non-image file
					break;
			}

			html += '<img src="' + cabItem.img.src + '" '
				  + 'alt="' + imgDesc + '" '
				  + 'title="' + imgDesc + '" '
				  + 'style="'
				  + 'border-radius:' + irs + ';'
				  + 'width:' + selItem.width + ';'
				  + 'height:' + selItem.height + ';'
				  + imgProps
				  + '">';

			// Close mat div
						   
			html += '</div>';

			// Close grid element div
					 
			html += '</div>';

			// Vertical spacing div is only required between images
			// i.e. not at extremities
					 
			if (this.options.spaceWidth > 0)
			{
				if (col.rows > 1 && r < col.rows-1)
				{
					html += '<div style="'
						  + 'border-width:0;outline-width:0;margin:0;padding:0;line-height:1px;font-size:1px;overflow:hidden;'
						  + 'min-height:' + this.options.spaceWidth + 'px;'											
						  + 'max-height:' + this.options.spaceWidth + 'px;'
						  + 'height:' + this.options.spaceWidth + 'px;'	
						  + 'width:' + rowWidth +'px;'
						  + '"></div>';	
				}
			}

			s += 1;
		}
		 
		html += '</td>';
		 
		// An intermediate column may be inserted to control horizontal spacing
					 
		if (this.options.spaceWidth > 0)
		{
			if (this.columns.length > 1 && c < this.columns.length-1)
			{
				html += '<td style="'
					  + 'min-width:' + this.options.spaceWidth + 'px;'	
					  + 'max-width:' + this.options.spaceWidth + 'px;'						 
					  + 'width:' + this.options.spaceWidth + 'px;'
					  + '"></td>';		
			}
		}
	}

	// Close grid table
		 
	html += '</tr>';
	html += '</table>';

	// Close grid wrapper div

	html += '</div>';

	// Generate footer (if enabled)

	if (this.options.footerHeight > 0)
	{	
		html += '<div id="' + this.footerId + '" '
			  + 'style="display:block;vertical-align:middle;font-family:sans-serif;'
			  + 'text-align:' + align + ';'
		 	  + 'font-size:' + footerMetrics.height + 'px;'
			  + 'font-weight:' + footerMetrics.weight + ';'
			  + 'color:' + this.options.footerColor + ';'
			  + 'line-height:' + this.options.footerHeight + 'px;'
			  + 'height:' + this.options.footerHeight + 'px">'
			  + footerContent
			  +'</div>';
	}

	// Now insert html in top-level div using appropriate background color

	styleName = CON.spaceStyles.nameOf(this.options.spaceStyle);

	e = gel(this.divId);
	e.style.backgroundColor = styleName === 'solid' ? this.options.spaceColor : 'transparent';
	e.style.height = this.options.height + 'px';
	e.innerHTML = html;

	// With html inserted, bind event handlers to each image in selection.
	// Use hard link if link specified but no footer space available to contain link. 
	// It is understood that slides are not viewable in latter case.

	useHardLink = this.options.link.length > 0 && footerContent.length === 0;

	for (s=0; s < this.items.length; s++)
	{
		i = this.items[s].cabIndex;
		e = gel(this.items[s].divId);

		e.onclick = useHardLink ? bindEarly(this.intLinkHandler, this) : bindEarly(this.intClickHandler, this, i);
		e.onmouseover = bindEarly(this.mouseOverHandler, this, e.id);
		e.onmouseout = bindEarly(this.mouseOutHandler, this, e.id);
	}

	// Bind event handlers to non-empty footer
	   
	if (footerContent.length > 0)
	{
		e = gel(this.footerId);
		i = this.items[0].cabIndex;

		if (this.options.link.length > 0)
		{
			e.title = CFG.langReadMore;	
			e.onclick = bindEarly(this.intLinkHandler, this);
		}
		else
		{
			e.title = CFG.langViewMore;
			e.onclick = bindEarly(this.intClickHandler, this, i);
		}

		e.onmouseover = bindEarly(this.mouseOverHandler, this, this.footerId);
		e.onmouseout = bindEarly(this.mouseOutHandler, this, this.footerId);
	}

	// can now invoke external reay handler (if specified)

	if (this.readyHandler) {this.readyHandler();}
};

////////////////////////////////////////////////////////////////////////

Sel.prototype.intClickHandler = function(cabIndex)
{
	var index = cabIndex ? cabIndex : 0;
	   
	if (this.extClickHandler)
	{
		this.extClickHandler(index);
	}
	else
	{
		this.popup(index);
	}

	return false;
};

////////////////////////////////////////////////////////////////////////

Sel.prototype.intLinkHandler = function()
{
	ERR.CHK(this.options.link.length > 0, "expected link");

	window.open(this.options.link, this.options.linkNew ? '_blank' : '_top');
	
	return false;
};

////////////////////////////////////////////////////////////////////////

Sel.prototype.mouseOverHandler = function(id)
{
	var e = gel(id);

	e.style.cursor = 'pointer';
	
	switch (id)
	{
		case this.footerId:
		case this.footerId:
			e.style.color = this.options.hoverColor;
			break;

		default:
			break;
	}
};

////////////////////////////////////////////////////////////////////////

Sel.prototype.mouseOutHandler = function(id)
{
	var e = gel(id);

	switch (id)
	{
		case this.footerId:
		case this.footerId:
			e.style.color = this.options.footerColor;
			break;

		default:
			break;
	}

	e.style.cursor = 'default';	
};

////////////////////////////////////////////////////////////////////////

Sel.prototype.popup = function(cabIndex)
{
	// This is a "well-behaved" popup window which opens full-size photo
	// from a user click. Popup blockers will generally allow this with
	// default browser settings. As index is a cab index, it may not have
	// been preloaded. There are NO checks for this here. If it is one of
	// the current selection, it will by definition have been preloaded.

	var index;
	var cabItem;
	var width;
	var height;
	var src;
	var caption;
	var title;
	var left;
	var top;
	var settings;
	var win;
	var doc;
	var html;		
	   
	index = cabIndex ? cabIndex: 0;
	  
	cabItem = CAB.items[index];
	
	width = cabItem.width;
	height = cabItem.height;
	src = cabItem.img.src;
	caption = cabItem.caption;
	title = CAB.title;
	   
	left = (screen.width) ? Math.round((screen.width - width) / 2) : 0;
	top = (screen.height) ? Math.round((screen.height - height) / 2) : 0;

    // Many of the settings below are ignored by modern browsers for security
	// reasons (e.g. location, resizable, etc) so we can't depend on them
	   
	settings = 'width=' + (width + 50)
			+ ',height=' + (height + 100)
			+ ',top=' + top
			+ ',left=' + left
			+ ',scrollbars=0'
			+ ',menubar=0'
			+ ',status=0'
			+ ',toolbar=0'
		    + ',location=0'		 
			+ ',resizable=0';

	win = window.open("","MessageWindow",settings);
	doc = win.document;
	win.name="MessageWindow";

	html = '<html>'
	     + '<head><title>' + title + ' - ' + caption + '</title></head>'
		 + '<body><center>'
		 + '<p style="font-family:sans-serif;font-weight:bold">' + title + '</p>'
		 + '<img src="' + src + '" width="' + width + '" height="' + height + '">'
		 + '<p style="font-family:sans-serif;font-weight:bold">' + caption + '</p>'
		 + '</center></body>'
		 + '</html>';
	
	doc.write(html);   
	doc.close();
	win.focus();
};

////////////////////////////////////////////////////////////////////////

Sel.prototype.close = function()
{
	// Tear down object data so that there is no straggling html or
	// potential circular references using worst case assumptions
	   
	gel(this.divId).innerHTML = '';   
	   
	this.readyHandler = null;
	this.extClickHandler = null;
};

////////////////////////////////////////////////////////////////////////
// Sho class manages an active slide show (instanced as SHO)
////////////////////////////////////////////////////////////////////////

function Sho(divId, index, options, moveHandler, closeHandler)
{	
	var self;
	var align; 			// normalised align (name)
	var imgBounds; 		// frame + mat + edge
	var selHeight; 		// selection height (including decoration)
	var uplHeight; 		// upper + panel + lower height
	var uplSpace; 		// space betwen sel and upl
	var shoHeight; 		// total height of slide show object
	var msgWidth; 		// modal window width
	var msgHeight; 		// modal window height
	var msgLeft; 		// modal window left co-ordinate
	var msgBottom; 		// modal window bottom co-ordinate
	var msgHtml; 		// help text for modal window (usually hidden)
	var html; 			// html to be inserted into gadget content div
	var styleName;
	var upperMetrics;
	var lowerMetrics;
	var panelClass;
	var opacity; 		// normalised opacity (0.0 to 1.0)
	var fill; 			// panel/button background contains panel color
	var radius; 		// adjusted radius (panel class dependent)
	var rimStyle;
	var rimWidth;
	var panHeight;
	var panWidth;
	var panStyle;
	var tabHeight;
	var tabWidth;
	var tabStyle;
	var butStyle;
	var butMetrics;
	var butHeight;
	var butWidth;
	var gapStyle;
	var gapWidth;
	var difStyle;
	var difWidth;
	var rowStyle;
	var symStyle;
	var e;
	var selOptions;
	
	self = this;  
		
	ERR.CHK(gel(divId), "Sho: DivId not found", divId); 
	this.divId = divId;
	
	// If not specified, first photo is displayed first
	
	this.index = typeof(index) === 'number' ? index : 0;
		
	// Set up defaults for valid options that are not supplied
	// This means that only overrides need to be supplied by caller
	
	options = typeof(options === 'object') ? options : {};
	this.options = {};

	this.options.captureKeys = typeof(options.captureKeys) === 'boolean' ? options.captureKeys : CFG.captureKeys;
	this.options.align = CON.aligns.has(options.align) ? options.align : CFG.align;
	this.options.padding = typeof(options.padding) === 'number' ? options.padding : CFG.padding;
	this.options.refHeight = typeof(options.refHeight) === 'number' ? options.refHeight : CFG.refHeight;
	this.options.wrap = typeof(options.wrap) === 'boolean' ? options.wrap : CFG.wrap;

	this.options.frameColor = isColor(options.frameColor) ? options.frameColor : CFG.frameColorB;
	this.options.frameStyle = CON.frameStyles.has(options.frameStyle) ? options.frameStyle : CFG.frameStyleB;
	this.options.frameWidth = this.options.frameStyle === CON.frameStyles.none ? 0 : typeof(options.frameWidth) === 'number' ? options.frameWidth : CFG.frameWidthB;

	this.options.shapeColor = isColor(options.shapeColor) ? options.shapeColor : CFG.shapeColorB;
	this.options.shapeStyle = CON.shapeStyles.has(options.shapeStyle) ? options.shapeStyle : CFG.shapeStyleB;
	this.options.shapeRadius = this.options.shapeStyle === CON.shapeStyles.rect ? 0 : typeof(options.shapeRadius) === 'number' ? options.shapeRadius : CFG.shapeRadiusB;

	this.options.matColor = isColor(options.matColor) ? options.matColor : CFG.matColorB;
	this.options.matStyle = CON.matStyles.has(options.matStyle) ? options.matStyle : CFG.matStyleB;
	this.options.matWidth = this.options.matStyle === CON.matStyles.none ? 0 : typeof(options.matWidth) === 'number' ? options.matWidth : CFG.matWidthB;

	this.options.edgeColor = isColor(options.edgeColor) ? options.edgeColor : CFG.edgeColorB;
	this.options.edgeStyle = CON.edgeStyles.has(options.edgeStyle) ? options.edgeStyle : CFG.edgeStyleB;
	this.options.edgeWidth = this.options.edgeStyle === CON.edgeStyles.none ? 0 : typeof(options.edgeWidth) === 'number' ? options.edgeWidth : CFG.edgeWidthB;
	
	this.options.revealColor = isColor(options.revealColor) ? options.revealColor : CFG.revealColorB;
	this.options.revealStyle = CON.revealStyles.has(options.revealStyle) ? options.revealStyle : CFG.revealStyleB;
	this.options.revealWidth = this.options.revealStyle === CON.revealStyles.none ? 0 : typeof(options.revealWidth) === 'number' ? options.revealWidth : CFG.revealWidthB;
	
	this.options.shadowColor = isColor(options.shadowColor) ? options.shadowColor : CFG.shadowColorB;
	this.options.shadowStyle = CON.shadowStyles.has(options.shadowStyle) ? options.shadowStyle : CFG.shadowStyleB;
	this.options.shadowWidth = this.options.shadowStyle === CON.shadowStyles.none ? 0 : typeof(options.shadowWidth) === 'number' ? options.shadowWidth : CFG.shadowWidthB;
	
	this.options.spaceColor = isColor(options.spaceColor) ? options.spaceColor : CFG.spaceColorB;
	this.options.spaceStyle = CON.spaceStyles.has(options.spaceStyle) ? options.spaceStyle : CFG.spaceStyleB;
	this.options.spaceWidth = typeof(options.spaceWidth) === 'number' ? options.spaceWidth : CFG.spaceWidthB;

	this.options.upperColor = isColor(options.upperColor) ? options.upperColor : CFG.upperColor;
	this.options.upperStyle = CON.textStyles.has(options.upperStyle) ? options.upperStyle : CFG.upperStyle;	
	this.options.upperHeight = this.options.upperStyle === CON.textStyles.none ? 0 : typeof(options.upperHeight) === 'number' ? options.upperHeight : CFG.upperHeight;

	this.options.lowerColor = isColor(options.lowerColor) ? options.lowerColor : CFG.lowerColor;
	this.options.lowerStyle = CON.textStyles.has(options.lowerStyle) ? options.lowerStyle : CFG.lowerStyle;	
	this.options.lowerHeight = this.options.lowerStyle === CON.textStyles.none ? 0 : typeof(options.lowerHeight) === 'number' ? options.lowerHeight : CFG.lowerHeight;

	this.options.panelColor = isColor(options.panelColor) ? options.panelColor : CFG.panelColor;
	this.options.panelStyle = CON.panelStyles.has(options.panelStyle) ? options.panelStyle : CFG.panelStyle;
	this.options.panelHeight = this.options.panelStyle === CON.textStyles.none ? 0 : typeof(options.panelHeight) === 'number' ? options.panelHeight : CFG.panelHeight;	
	this.options.panelOpacity = typeof(options.panelOpacity) === 'number' ? options.panelOpacity : CFG.panelOpacity;
	
	this.options.buttonColor = isColor(options.buttonColor) ? options.buttonColor : CFG.buttonColor;
	this.options.buttonStyle = CON.buttonStyles.has(options.buttonStyle) ? options.buttonStyle : CFG.buttonStyle;
	this.options.buttonRadius = typeof(options.buttonRadius) === 'number' ? options.buttonRadius : CFG.buttonRadius;

	this.options.spreadColor = isColor(options.spreadColor) ? options.spreadColor : CFG.spreadColor;
	this.options.spreadStyle = CON.spreadStyles.has(options.spreadStyle) ? options.spreadStyle : CFG.spreadStyle;
	this.options.spreadWidth = typeof(options.spreadWidth) === 'number' ? options.spreadWidth : CFG.spreadWidth;

	this.options.glowColor = isColor(options.glowColor) ? options.glowColor : CFG.glowColor;
	this.options.beckonColor = isColor(options.beckonColor) ? options.beckonColor : CFG.beckonColor;

	// Ensure that from this point on, we don't indavertently use a raw parameter instead of a processed one
	
	options = undefined; 
	
	this.moveHandler = moveHandler;
	this.closeHandler = closeHandler;
	
	this.busy = true;
	this.beckonId = null;
	this.sel = null;
	this.direction = CON.dir.forward;
	
	this.selId = this.divId + '-sel';
	this.msgId = this.divId + '-msg';
	
	this.panelId		= this.divId + '-panel'; 
	this.upperId		= this.divId + '-upper'; 
	this.lowerId		= this.divId + '-lower';    
	
	this.helpId			= this.divId + '-help';
	this.moveFirstId	= this.divId + '-moveFirst';   
	this.skipPrevId		= this.divId + '-skipPrev';   
	this.movePrevId		= this.divId + '-movePrev';
	this.moveNextId		= this.divId + '-moveNext';
	this.skipNextId		= this.divId + '-skipNext';
	this.moveLastId		= this.divId + '-moveLast';
	this.closeId		= this.divId + '-close';

	// establish important dimensions and parameters before building html

	align 	  = CON.aligns.nameOf(this.options.align);

	imgBounds = this.options.frameWidth + this.options.matWidth + this.options.edgeWidth + this.options.revealWidth;

	selHeight = this.options.refHeight + 2 * imgBounds + this.options.shadowWidth;
	uplHeight = this.options.upperHeight + this.options.panelHeight + this.options.lowerHeight;
	uplSpace  = uplHeight === 0 ? 0 : this.options.spaceWidth;  
	shoHeight = selHeight + uplSpace + uplHeight;

	msgWidth  = CON.sho.msgWidth  - 2 * (CON.sho.msgPadding + CON.sho.msgBorder);
	msgHeight = CON.sho.msgHeight - 2 * (CON.sho.msgPadding + CON.sho.msgBorder);

	// modal window horizontal position depends on overall alignment
	// note that modal background cover entire gadget body including padding
	// so left and right alignments must factor in padding

	switch(align)
	{
		case 'left':
			msgLeft = this.options.padding + imgBounds + CON.sho.msgOffset;
			break;

		case 'center':
			msgLeft = Math.round((DOC.width - CON.sho.msgWidth) / 2);
			break;

		case 'right':
			msgLeft = DOC.width - CON.sho.msgWidth - this.options.padding - imgBounds - CON.sho.msgOffset - this.options.shadowWidth;
			break;
	}

	// modal window is centered vertically w.r.t. image.
	// this is important visually when image has heavily rounded corners

	msgBottom = this.options.padding + uplHeight + uplSpace + Math.round((selHeight - msgHeight) / 2) - CON.sho.msgBorder - CON.sho.msgPadding; 
	
	// format help message within column-aligned table
	
	msgHtml = '<table border="0" cellpadding="0" cellspacing="0" '
	 		+ 'style="width:100%;text-align:left;font-family:Verdana;font-size:15px;'
		    + 'color:' + this.options.buttonColor + ';'
		    + 'background-color:' + this.options.panelColor
		    + '">'

	// if capture keys are disabled by theme, use alternative help text

	if (this.options.captureKeys)
	{
		msgHtml += '<tr height="20px"><td width="50%">' + CON.symbols.leftArrow 	+ '</td>' + '<td width="50%">Previous</td></tr>'
				 + '<tr height="20px"><td width="50%">' + CON.symbols.rightArrow 	+ '</td>' + '<td width="50%">Next</td></tr>'
				 + '<tr height="20px"><td width="50%">' + 'SPACE' 					+ '</td>' + '<td width="50%">Continue</td></tr>'
				 + '<tr height="20px"><td width="50%">' + 'ESC or Click' 			+ '</td>' + '<td width="50%">Exit</td></tr>';
	}
	else
	{
		msgHtml += '<tr height="20px"><td>Keyboard is disabled</td></tr>'
				 + '<tr height="20px"><td>Use panel buttons</td></tr>'
				 + '<tr height="20px"><td>Or click to exit</td></tr>';
	}

	msgHtml += '</table>'; 
 
	html  = '<div id="' + this.selId + '" '
		  + 'style="display:inline-block;vertical-align:top;'
		  + 'text-align:' + align + ';'
		  + 'height:' + selHeight + 'px;'
		  + 'padding:0px 0px ' + uplSpace + 'px 0px">'
		  + '</div>';

	html += '<div id="' + this.msgId + '" '
		  + 'style="display:none;position:absolute;z-index:1;padding:0;'
		  + 'left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0,0,0,0.4);">';

	html += '<div style="position:absolute;text-align:right;border-radius:4px;'
		  + 'box-shadow:5px 5px 5px 0px ' + this.options.edgeColor + ';'
		  + 'padding:' + CON.sho.msgPadding + 'px;'
		  + 'background-color:' + this.options.panelColor + ';'
		  + 'color:' + this.options.buttonColor + ';'
		  + 'width:' + msgWidth + 'px;'
		  + 'height:' + msgHeight + 'px;'
		  + 'left:' + msgLeft + 'px;'
		  + 'bottom:' + msgBottom + 'px;'
		  + 'border:' + CON.sho.msgBorder + 'px solid ' + this.options.buttonColor + ';">'
		  + '<span><i class="material-icons" style="font-size:18px">' + CON.symbols.close + '</i></span>'
	      + msgHtml
	  	  + '</div>';

	html += '</div>';
	
	if (this.options.upperHeight > 0)
	{	
		styleName = CON.textStyles.nameOf(this.options.upperStyle);
		upperMetrics = fontMetrics(styleName, this.options.upperHeight);

		html += '<div id="' + this.upperId + '" '
			  + 'style="display:block;vertical-align:middle;font-family:sans-serif;'
			  + 'text-align:' + align + ';'
		 	  + 'font-size:' + upperMetrics.height + 'px;'
			  + 'font-weight:' + upperMetrics.weight + ';'
			  + 'color:' + this.options.upperColor + ';'
			  + 'line-height:' + this.options.upperHeight + 'px;'
			  + 'height:' + this.options.upperHeight + 'px">'
			  +'</div>';
	}
	
	if (this.options.panelHeight > 0)
	{
		styleName = CON.panelStyles.nameOf(this.options.panelStyle);
		panelClass = styleName.substr(0,3);

		opacity = htmlOpacity(this.options.panelOpacity);
		
		switch (this.options.buttonStyle)
		{
			case CON.buttonStyles.bare:
				fill = false;
				rimWidth = 0;
				rimStyle = 'none';
				break;

			case CON.buttonStyles.dotted:
				fill = false;
				rimWidth = 1;
				rimStyle = 'dotted';
				break;	

			case CON.buttonStyles.light:
				fill = false;
				rimWidth = 1;
				rimStyle = 'solid';
				break;	

			case CON.buttonStyles.medium:
				fill = false;
				rimWidth = 2;
				rimStyle = 'solid';
				break;	

			case CON.buttonStyles.heavy:
				fill = false;
				rimWidth = 3;
				rimStyle = 'solid';
				break;	

			case CON.buttonStyles.fillBare:
				fill = true;
				rimWidth = 0;
				rimStyle = 'none';
				break;

			case CON.buttonStyles.fillDotted:
				fill = true;
				rimWidth = 1;
				rimStyle = 'dotted';
				break;

			case CON.buttonStyles.fillLight:
				fill = true;
				rimWidth = 1;
				rimStyle = 'solid';
				break;

			case CON.buttonStyles.fillMedium:
				fill = true;
				rimWidth = 2;
				rimStyle = 'solid';
				break;

			case CON.buttonStyles.fillHeavy:
				fill = true;
				rimWidth = 3;
				rimStyle = 'solid';
				break;

			case CON.buttonStyles.fillDouble:
				fill = true;
				rimWidth = 3;
				rimStyle = 'double';
				break;

			case CON.buttonStyles.fillInset:
				fill = true;
				rimWidth = 4;
				rimStyle = 'inset';
				break;

			case CON.buttonStyles.fillOutset:
				fill = true;
				rimWidth = 4;
				rimStyle = 'outset';
				break;

			default:
				ERR.CHK(false, 'unknown buttonStyle');
				break;
		}

		// panel height is our reference point
		// surrounding div height also depends on spread
		// which is implemented as div padding

		panHeight = this.options.panelHeight - 2 * this.options.spreadWidth;

		// table and button heights follow

		if (panelClass === 'str')
		{
			// strip class implements rim as table border

			tabHeight = panHeight - 2 * rimWidth;
			butHeight = tabHeight;
		}
		else
		{
			// pads class implements rim as button borders

			ERR.CHK(panelClass === 'pad', 'panel class bug');

			tabHeight = panHeight;
			butHeight = tabHeight - 2 * rimWidth;
		}

		// button metrics depend on PANEL style

		butMetrics = fontMetrics(styleName, butHeight, 'material');

		// all panel columns have same height as button
		// however column widths depend on panel class

		if (panelClass === 'str')
		{	
			// continuous strip is more compact

			butWidth = Math.ceil(butMetrics.width);
			gapWidth = 1;
			difWidth = 2 + Math.ceil(butWidth/2);
			tabWidth = 8 * butWidth + 3 * gapWidth + 4 * difWidth;
			panWidth = tabWidth + 2 * rimWidth;
		}

		else
		{
			// distinct pads require more space between buttons

			butWidth = Math.ceil(butHeight - butMetrics.height + butMetrics.width);

			switch (this.options.spreadStyle)
			{
				case CON.spreadStyles.clear:
					gapWidth = Math.ceil((butWidth + 2 * rimWidth) / 6);
					break;

				case CON.spreadStyles.solid:
					gapWidth = 6 * this.options.spreadWidth;
					break;	

				case CON.spreadStyles.blur:
					gapWidth = 2 * this.options.spreadWidth;
					break;

				default:
					ERR.CHK(false, 'unknown spreadStyle');
					break;
			}

			difWidth = 2 * gapWidth;
			tabWidth = 8 * butWidth + 3 * gapWidth + 4 * difWidth + 16 * rimWidth;
			panWidth = tabWidth;
		}
		
		// construct basic element styles

		panStyle = 'display:inline-block;'
			     + 'color:' + this.options.buttonColor + ';'
				 + 'opacity:' + opacity + ';'
				 + 'padding:' + this.options.spreadWidth + 'px;'
				 + 'width:' + panWidth + 'px;'
				 + 'height:' + panHeight  + 'px';

		tabStyle = 'border-collapse:separate;margin:0px;'
				 + 'width:' + tabWidth + 'px;height:' + tabHeight  + 'px';

		rowStyle = 'height:' + tabHeight + 'px';

		butStyle = 'text-align:center;vertical-align:middle;'
				 + 'width:' + butWidth + 'px;height:' + butHeight + 'px';
			     
		gapStyle = 'text-align:center;vertical-align:middle;'
				 + 'width:' + gapWidth + 'px;height:' + butHeight + 'px';

		difStyle = 'text-align:center;vertical-align:middle;'
				 + 'width:' + difWidth + 'px;height:' + butHeight + 'px';

		symStyle = 'font-size:' + butMetrics.height + 'px';

		// style tweaks

		if (!fill || panelClass !== 'str')
		{ 
			tabStyle += ';background-color:transparent';
		}
		else
		{
			tabStyle += ';background-color:' + this.options.panelColor;	
		}

		if (!fill || panelClass !== 'pad')
		{ 
			butStyle += ';background-color:transparent';
		}
		else
		{
			butStyle += ';background-color:' + this.options.panelColor;	
		}

		if (panelClass === 'pad')
		{
			// percent radius rendered directly by browser
			// this will produce smooth elliptical buttons

			radius = this.options.buttonRadius;
			butStyle += ';border-radius:' + radius + '%';
		}
		else
		{
			// percent radius converted to pixels
			// relative to table height only

			radius = Math.floor(this.options.buttonRadius * tabHeight / 100);
			tabStyle += ';border-radius:' + radius + 'px';
		}
		
		if (rimWidth === 0 || panelClass !== 'str')
		{
			tabStyle += ';border-style:none';
		}
		else
		{
			tabStyle += ';border-style:' + rimStyle
			  	  	  + ';border-width:' + rimWidth + 'px'
			  	  	  + ';border-color:' + this.options.buttonColor;
		}

		if (rimWidth === 0 || panelClass !== 'pad')
		{
			butStyle += ';border-style:none';
		}
		else
		{
			butStyle += ';border-style:' + rimStyle
			  	  	  + ';border-width:' + rimWidth + 'px'
			  	  	  + ';border-color:' + this.options.buttonColor;
		}

		if (this.options.spreadWidth === 0)
		{
			butStyle += ';box-shadow:none';
			tabStyle += ';box-shadow:none';
		}
		else if (panelClass === 'str')
		{
			butStyle += ';box-shadow:none';

			switch (this.options.spreadStyle)
			{
				case CON.spreadStyles.clear:
					tabStyle += ';box-shadow:none';
					break;

				case CON.spreadStyles.solid:
					tabStyle += ';box-shadow:0px 0px 0px ' + this.options.spreadWidth + 'px ' + this.options.spreadColor;
					break;

				case CON.spreadStyles.blur:
					tabStyle += ';box-shadow:0px 0px ' + this.options.spreadWidth + 'px 0px ' + this.options.spreadColor;
					break;

				default:
					ERR.CHK(false, 'unknown spread Style', this.options.spreadStyle);
					break;
			}
		}
		else
		{
			tabStyle += ';box-shadow:none';

			switch (this.options.spreadStyle)
			{
				case CON.spreadStyles.clear:
					butStyle += ';box-shadow:none';
					break;

				case CON.spreadStyles.solid:
					butStyle += ';box-shadow:0px 0px 0px ' + this.options.spreadWidth + 'px ' + this.options.spreadColor;
					break;

				case CON.spreadStyles.blur:
					butStyle += ';box-shadow:0px 0px ' + this.options.spreadWidth + 'px 0px ' + this.options.spreadColor;
					break;

				default:
					ERR.CHK(false, 'unknown spread Style', this.options.spreadStyle);
					break;
			}
		}

		// now ready to generate html
		
		html += '<div style="display:block;background-color:transparent;'
			  + 'text-align:' + align + ';'
			  + 'height:' + this.options.panelHeight  + 'px">';

		html += '<div id="' + this.panelId + '" style="' + panStyle + '">';

		html += '<table border="0" cellpadding="0" cellspacing="0" style="' + tabStyle + '">';

		html += '<tr style="' + rowStyle + '">';

		html += '<td id="' + this.helpId + '" title="' + CFG.langHelp + '" style="' + butStyle + '">'
			  + '<i class="material-icons" style="' + symStyle + '">' + CON.symbols.help + '</i>'
			  + '</td>';

		html += '<td style = "' + difStyle + '"></td>';

		html += '<td id="' + this.moveFirstId + '" title="' + CFG.langFirst + '" style="' + butStyle + '">'
			  + '<i class="material-icons" style="' + symStyle + '">' + CON.symbols.moveFirst + '</i>'
			  + '</td>';
		  
		html += '<td style = "' + gapStyle + '"></td>';

		html += '<td id="' + this.skipPrevId + '" title="' + CFG.langSkipBack + '" style="' + butStyle + '">'
			  + '<i class="material-icons" style="' + symStyle + '">' + CON.symbols.skipPrev + '</i>'
			  + '</td>';
	 
		html += '<td style = "' + difStyle + '"></td>';

		html += '<td id="' + this.movePrevId + '" title="' + CFG.langPrevious + '" style="' + butStyle + '">'
			  + '<i class="material-icons" style="' + symStyle + '">' + CON.symbols.movePrev + '</i>'
			  + '</td>';
			  
		html += '<td style = "' + gapStyle + '"></td>';

		html += '<td id="' + this.moveNextId + '" title="' + CFG.langNext + '" style="' + butStyle + '">'
			  + '<i class="material-icons" style="' + symStyle + '">' + CON.symbols.moveNext + '</i>'
			  + '</td>';
			  
		html += '<td style = "' + difStyle + '"></td>';

		html += '<td id="' + this.skipNextId + '" title="' + CFG.langSkipAhead + '" style="' + butStyle + '">'
			  + '<i class="material-icons" style="' + symStyle + '">' + CON.symbols.skipNext + '</i>'
			  + '</td>';
			  
		html += '<td style = "' + gapStyle + '"></td>';

		html += '<td id="' + this.moveLastId + '" title="' + CFG.langLast + '" style="' + butStyle + '">'
			  + '<i class="material-icons" style="' + symStyle + '">' + CON.symbols.moveLast + '</i>'
			  + '</td>';
			  
		html += '<td style = "' + difStyle + '"></td>';

		html += '<td id="' + this.closeId + '" title="' + CFG.langClose + '" style="' + butStyle + '">'
			  + '<i class="material-icons" style="' + symStyle + '">' + CON.symbols.close + '</i>'
			  + '</td>';

		html += '</tr>';

		html += '</table>';

		html += '</div>';

		html += '</div>';  
	}

	if (this.options.lowerHeight > 0)
	{		
		styleName = CON.textStyles.nameOf(this.options.lowerStyle);
		lowerMetrics = fontMetrics(styleName, this.options.lowerHeight);
	
		html += '<div id="' + this.lowerId + '" '
			  + 'style="display:block;vertical-align:middle;font-family:sans-serif;'
			  + 'text-align:' + align + ';'
		 	  + 'font-size:' + lowerMetrics.height + 'px;'
			  + 'font-weight:' + lowerMetrics.weight + ';'
			  + 'color:' + this.options.lowerColor + ';'
			  + 'line-height:' + this.options.lowerHeight + 'px;'
			  + 'height:' + this.options.lowerHeight + 'px">'
			  +'</div>';
	}
	
	// now insert html in top-level div with appropriate background color

	styleName = CON.spaceStyles.nameOf(this.options.spaceStyle);

	e = gel(this.divId);
	e.style.backgroundColor = styleName === 'solid' ? this.options.spaceColor : 'transparent';
	e.style.height = shoHeight + 'px';
	e.innerHTML = html;

	// with html updated, we can set up event handlers

	if (this.options.panelHeight > 0)
	{
		e = gel(this.msgId);
		e.onclick = bindEarly(this.clickHandler, this, this.msgId);
		e.onmouseover = bindEarly(this.mouseOverHandler, this, this.msgId);
		e.onmouseout = bindEarly(this.mouseOutHandler, this, this.msgId);

		e = gel(this.panelId);
		e.onmouseover = bindEarly(this.mouseOverHandler, this, this.panelId);
		e.onmouseout = bindEarly(this.mouseOutHandler, this, this.panelId);

		e = gel(this.helpId);
		e.onclick = bindEarly(this.clickHandler, this, this.helpId);
		e.onmouseover = bindEarly(this.mouseOverHandler, this, this.helpId);
		e.onmouseout = bindEarly(this.mouseOutHandler, this, this.helpId);
		
		e = gel(this.moveFirstId);
		e.onclick = bindEarly(this.clickHandler, this, this.moveFirstId);
		e.onmouseover = bindEarly(this.mouseOverHandler, this, this.moveFirstId);
		e.onmouseout = bindEarly(this.mouseOutHandler, this, this.moveFirstId);
		
		e = gel(this.skipPrevId);
		e.onclick = bindEarly(this.clickHandler, this, this.skipPrevId);
		e.onmouseover = bindEarly(this.mouseOverHandler, this, this.skipPrevId);
		e.onmouseout = bindEarly(this.mouseOutHandler, this, this.skipPrevId);
		
		e = gel(this.movePrevId);
		e.onclick = bindEarly(this.clickHandler, this, this.movePrevId);
		e.onmouseover = bindEarly(this.mouseOverHandler, this, this.movePrevId);
		e.onmouseout = bindEarly(this.mouseOutHandler, this, this.movePrevId);
		
		e = gel(this.moveNextId);
		e.onclick = bindEarly(this.clickHandler, this, this.moveNextId);
		e.onmouseover = bindEarly(this.mouseOverHandler, this, this.moveNextId);
		e.onmouseout = bindEarly(this.mouseOutHandler, this, this.moveNextId);
		
		e = gel(this.skipNextId);
		e.onclick = bindEarly(this.clickHandler, this, this.skipNextId);
		e.onmouseover = bindEarly(this.mouseOverHandler, this, this.skipNextId);
		e.onmouseout = bindEarly(this.mouseOutHandler, this, this.skipNextId);
		
		e = gel(this.moveLastId);

		e.onclick = bindEarly(this.clickHandler, this, this.moveLastId);
		e.onmouseover = bindEarly(this.mouseOverHandler, this, this.moveLastId);
		e.onmouseout = bindEarly(this.mouseOutHandler, this, this.moveLastId);
		
		e = gel(this.closeId);

		e.onclick = bindEarly(this.clickHandler, this, this.closeId);
		e.onmouseover = bindEarly(this.mouseOverHandler, this, this.closeId);
		e.onmouseout = bindEarly(this.mouseOutHandler, this, this.closeId);
	}
	
	if (this.options.captureKeys)	   
	{
		// note: onkeypress event does not support escape key
		// so attach our key "press" event handler to onkeydown

		document.onkeydown = function(event) { return self.keyPressHandler(event); };
	}
	
	// Now display raw slide using single image selector with no footer, space or link 
	
	selOptions =
	{
		height:			selHeight,	  
		wrap:			false,
		grid:			[1],
		layout:			CON.layouts.exact,
		link: 			'',
		frameColor:		this.options.frameColor,
		frameStyle:		this.options.frameStyle,
		frameWidth:		this.options.frameWidth,
		matColor:		this.options.matColor,
		matStyle:		this.options.matStyle,
		matWidth:		this.options.matWidth,
		edgeColor:		this.options.edgeColor,
		edgeStyle:		this.options.edgeStyle,
		edgeWidth:		this.options.edgeWidth,
		revealColor:	this.options.revealColor,
		revealStyle:	this.options.revealStyle,
		revealWidth:	this.options.revealWidth,
		shadowColor:	this.options.shadowColor,
		shadowStyle:	this.options.shadowStyle,
		shadowWidth:	this.options.shadowWidth,
		shapeColor:		this.options.shapeColor,
		shapeStyle:		this.options.shapeStyle,
		shapeRadius:	this.options.shapeRadius,
		spaceStyle:		CON.spaceStyles.clear,
		spaceWidth: 	0,
		footerStyle:	CON.textStyles.none
	};
	
	this.sel = new Sel( this.selId,
						this.index,
						'B',
						selOptions,
						function() {self.selReadyHandler();},
						function(index) {self.selClickHandler(index);});	
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.show = function()
{
	this.sel.show();
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.op = function(id)
{
	var e;

	// only one operation at a time

	if (this.busy)
	{
		return;
	}

	this.busy = true;

	// operations can be performed without a panel (using keyboard)
	// but if panel is present, change button to glow state
	
	if (this.options.panelHeight > 0)
	{
		e = gel(id);

		e.style.color = this.options.glowColor;
		e.style.borderColor = this.options.glowColor;
	}

	switch(id)
	{
	case this.helpId:
		this.help();
		break;	 	

	case this.moveFirstId:
		this.moveFirst();
		break;
			  
	case this.skipPrevId:
		this.skipPrev();
		break;
			  
	case this.movePrevId:
		this.movePrev();
		break;
			  
	case this.moveNextId:
		this.moveNext();
		break;
			  
	case this.skipNextId:
		this.skipNext();
		break;
			  
	case this.moveLastId:
		this.moveLast();
		break; 	
			  
	case this.closeId:
		this.close();
		break;

	default:
		ERR.CHK(false, 'unknown operation', id);
	}

	// sho object will remain busy
	// until operation completes
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.clickHandler = function(id)
{
	// Sometimes user selects text inadvertently during a click
	// and it is ugly. This is a good place to clear selection
   
	clearSelection();

	if (id === this.msgId)
	{
		this.msgClose();
	}
	else
	{
		this.op(id);
	}

	return false;
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.mouseOverHandler = function(id)
{
	var e = gel(id);

	switch(id)
	{
	case this.panelId:

		// Moving over panel area:
		// Highlight panel by maximising opacity

		e.style.opacity = '1.0';
		break;

	case this.msgId:

		// Moving over modal message window:
		// Indicate clickability via mouse pointer

		e.style.cursor = 'pointer';
		break;

	default:

		// Moving over panel button:
		// - produce beckon (hover) effect on button
		// - indicate clickability via mouse pointer
		// If busy, postpone changes until operation
		// completed using hoverId property

		if (!this.busy)
		{
			e.style.cursor = 'pointer';
			e.style.color = this.options.beckonColor;
			e.style.borderColor = this.options.beckonColor;
		}

		ERR.CHK(this.beckonId === null, "beckon over bug");

		this.beckonId = id;
		break;
	}		
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.mouseOutHandler = function(id)
{
	var e = gel(id);

	switch(id)
	{
	case this.panelId:

		// Moving away from panel area:
		// Unhighlight panel by restoring defauly opacity

		e.style.opacity = htmlOpacity(this.options.panelOpacity);
		break;

	case this.msgId:

		// Moving away from modal message window:
		// Restore mouse pointer to default

		e.style.cursor = 'default';
		break;
	
	default:

		// Moving away from panel button:
		// - restore button and border color
		// - restore mouse pointer to default
		// If busy, postpone changes until operation
		// completed using hoverId property

		if (!this.busy)
		{
			e.style.cursor = 'default';
			e.style.color = this.options.buttonColor;
			e.style.borderColor = this.options.buttonColor;
		}

		ERR.CHK(this.beckonId !== null, "beckon out bug");

		this.beckonId = null;
		break;
	}	
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.keyPressHandler = function(event)
{	
	var keyCode;

	// Browser dependent
	   
	if (window.event) 
	{	
		keyCode = window.event.keyCode;
	}
	else
	{
		if (event.which)
		{
			keyCode = event.which;
		}
	}

	// any keystroke will close modal message window

	if ( gel(this.msgId).style.display === "block" )
	{
		this.msgClose();
		return false;
	}
	
	// Sometimes text gets selected inadvertently by user
	// and it is ugly. This is a good place to clear selection
	
	clearSelection();

	if (keyCode === CON.keyCodes.space)
	{
		if (this.direction === CON.dir.forward)
		{  
			this.op(this.moveNextId);
		}
		else
		{
			this.op(this.movePrevId); 
		}
		return false;
	}

	if (keyCode === CON.keyCodes.left)
	{
		
		this.op(this.movePrevId); 
		return false;
	}

	if (keyCode === CON.keyCodes.right)
	{
		
		this.op(this.moveNextId); 
		return false;
	}

	if (keyCode === CON.keyCodes.escape)
	{
		this.op(this.closeId);
		return false;
	}
	
	return true;	   
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.selReadyHandler = function()
{
	var text;
	var title;
	var caption;
	var status;
	var prompt;
	var upperText;
	var lowerText;
	var e;

	// caption may be missing or 'untitled' if photos are lazily uploaded
	// title should be valid (if it is 'untitled', that should also be visible)

	caption = CFG.cleanCaption ? clean(CAB.items[this.index].caption) : CAB.items[this.index].caption;
	caption = caption === 'untitled' ? '' : caption;
	title = CFG.cleanTitle ? clean(CAB.title) : CAB.title;
	status = (this.index + 1) + ' of ' + CAB.items.length;

	// Upper text contains caption if available or title as fall-back

	if (this.options.upperHeight > 0)
	{
		if (caption.length > 0)
		{
			upperText = caption;
		}
		else
		{
			upperText = title;
		}

		gel(this.upperId).innerHTML = upperText;
	}

	// Lower text contains title and status or only status if title already displayed
	// There is an assumption that all or no photos are lazily uploaded in a given cabinet
	// If this is not the case, lower text will alternate between two states

	if (this.options.lowerHeight > 0)
	{
		if (this.options.upperHeight > 0 && caption.length === 0)
		{
			lowerText = status;	
		}
		else
		{
			lowerText = title + ': ' + status;
		}

		gel(this.lowerId).innerHTML = lowerText;
	}
	   
	// if there is an external move handler, notify it
	// this will fire even if move is to same slide
	   
	if (this.moveHandler) {this.moveHandler();}

	// reset buttons to non-busy state

	if (this.options.panelHeight > 0)
	{
		this.resetButton(this.helpId);

		this.resetButton(this.moveFirstId);
		this.resetButton(this.skipPrevId);

		this.resetButton(this.movePrevId);
		this.resetButton(this.moveNextId);
		
		this.resetButton(this.skipNextId);
		this.resetButton(this.moveLastId);

		this.resetButton(this.closeId);
	}
	
	this.preload();
	this.busy = false;
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.resetButton = function(id)
{
	var e = gel(id);

	if (this.beckonId === id)
	{
		// postponed beckon effect

		e.style.cursor = 'pointer';
		e.style.color = this.options.beckonColor;
		e.style.borderColor = this.options.beckonColor;
	}
	else
	{
		// reset to idle state

		e.style.cursor = 'default';
		e.style.color = this.options.buttonColor;
		e.style.borderColor = this.options.buttonColor;
	}
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.selClickHandler = function(index)
{
	this.close();
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.preload = function()
{
	// lookahead cache preloads next image
	// in current forward or reverse progression

	var i;
	var item;
	var total;

	total = CAB.items.length;

	i = this.index;
	
	if (this.direction === CON.dir.forward)
	{
		i = (i + 1) % total;	
	}
	else
	{
		i = i > 0 ? i - 1 : total - 1;
	}

	item = CAB.items[i];
	
	switch (item.state)
	{
	case CON.imgStates.idle:
	case CON.imgStates.aborted:

		CAB.preload(null, i, 1);
	}
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.move = function(index)
{
	var total;
	   
	total = CAB.items.length;      
	
	ERR.CHK(index >= 0 && index <= total, "Bad move index", index);
	   
	if (index !== this.index)
	{
		if (this.options.wrap)
		{
			if ( ((index > this.index) && (index - this.index < total/2))
			||   ((index < this.index) && (this.index - index > total/2)) )
			{
				this.direction = CON.dir.forward;
			}
			else
			{
				this.direction = CON.dir.backward;
			}
		}
		else
		{
			if ( (index === 0)
			||   ((index > this.index) && (index !== total - 1)) )
			{
				this.direction = CON.dir.forward;
			}
			else
			{
				this.direction = CON.dir.backward ;
			}
		}
	 
		this.index = index;
	}
	
	// Add a little delay for pending operations to complete
	// and give button glow a chance to display
	
	catchUpAndDo(bindEarly(this.sel.show, this.sel, index), 200);
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.msgClose = function()
{
	// close modal message window and refresh view at current slide

	gel(this.msgId).style.display = "none";
	this.move(this.index);
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.help = function()
{
	// open modal message window which contains help info

	gel(this.msgId).style.display = "block";
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.moveFirst = function()
{
	this.move(0);	
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.moveLast = function()
{
	this.move(CAB.items.length - 1);	
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.moveNext = function()
{
	var index;
	
	if (this.index < CAB.items.length - 1)
	{
		index = this.index + 1;
	}
	else
	{
		if (this.options.wrap)
		{
			index = 0;
		}
		else
		{
			index = this.index;
		}
	}
	
	this.move(index);
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.movePrev = function()
{
	var index;
	
	if (this.index > 0)
	{
		index = this.index - 1;
	}
	else
	{
		if (this.options.wrap)
		{
			index = CAB.items.length - 1;
		}
		else
		{
			index = this.index;
		}
	}
	
	this.move(index);
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.skipNext = function()
{
	var total;
	var skip;
	var index;
	   
	total = CAB.items.length;   
	skip = Math.ceil(total/5);
	   
	if (this.options.wrap)
	{
		index = (this.index + skip) % total;
	}
	else
	{
		index = this.index + skip;
		if (index > total - 1) {index = total - 1;}
	}
	 
	this.move(index);	
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.skipPrev = function()
{
	var total;
	var skip;
	var index;
	
	total = CAB.items.length; 
	skip = Math.ceil(total/5);
   
	if (this.options.wrap)
	{
		index = (this.index - skip) % CAB.items.length;
		if (index < 0) {index = total + index;	}
	}
	else
	{
		index = this.index - skip;
		if (index < 0) {index = 0;}
	}
	 
	this.move(index);	
};

////////////////////////////////////////////////////////////////////////

Sho.prototype.close = function()
{
	var closeHandler = this.closeHandler;
	   
	this.sel.close();
	gel(this.divId).innerHTML = '';
	   
	this.closeHandler = null;
	if (closeHandler) {closeHandler();}
};

////////////////////////////////////////////////////////////////////////
// Col class is a color swatch utility (instanced as COL)
////////////////////////////////////////////////////////////////////////

function Col(divId)
{
	// Based on code snippet by Jean-Luc Antoine

	var self;
	var valueStyle;
	var tableStyle;
	var total;
	var html;
	var aR,aG,aB;
	var i,j;  
	var X,Y;
	var R,G,B;
	var x,y;
	var e;
	var opt;
	var c;
	var gridTableBorder; 
	var gridTableWidth;
	var gridTableHeight;	
	var gridTrHeight;
	var gridTdWidth;
	var gridRows;
	var gridCols;
	var mainTableWidth; 
	var mainTableHeight;
	var mainTableBorder;
	var mainTableSpacing; 
	var mainTrTopHeight;
	var mainTrBotHeight;
	var mainTdLeftWidth;
	var mainTdRightWidth;
	var statTableWidth; 
	var statTableHeight; 
	var statTableBorder;
	var statTrTopHeight; 
	var statTrBotHeight;
	var statTdWidth; 
	var selWidth; 
	var selHeight; 
	var valWidth; 
	var valHeight; 
	var mainTableStyle;								
	var mainTrTopStyle;			
	var mainTrBotStyle;		
	var mainTdLeftStyle;		
	var mainTdRightStyle;	
	var gridTableStyle; 		  
	var gridTrStyle; 
	var gridTdStyle; 
	var statTableStyle;					
	var statTrTopStyle;			
	var statTrBotStyle;			
	var statTdStyle;	
	var selFont; 
	var selStyle;			
	var valFont;	
	var valStyle;
	
	this.divId = divId;  
	this.mainId = divId + '-main'; 
	this.gridId = divId + '-grid';
	this.pickId = divId + '-pick';
	this.trackId = divId + '-track';   
	this.selectId = divId + '-select'; 
	this.valueId = divId + '-value';  
	this.trackValue = '';
	this.pickValue = '';
	this.enabled = false;
	
	self = this;	

	// Generate colors
	
	total=1657;
	
	aR=new Array(total);
	aG=new Array(total);
	aB=new Array(total);
	   
	for (i=0;i<256;i++)
	{
		aR[i+510]=aR[i+765]=aG[i+1020]=aG[i+5*255]=aB[i]=aB[i+255]=0;
		aR[510-i]=aR[i+1020]=aG[i]=aG[1020-i]=aB[i+510]=aB[1530-i]=i;
		aR[i]=aR[1530-i]=aG[i+255]=aG[i+510]=aB[i+765]=aB[i+1020]=255;
		if(i<255){aR[i/2+1530]=127;aG[i/2+1530]=127;aB[i/2+1530]=127;}
	}
	
	// Calculate dimensions for a perfect fit. The whole idea is to
	// tweak a few dimensions and let the rest take care of itself
	// rather than getting mired in messy and browser dependent HTML
	
	gridRows = 64;
	gridCols = 64;
	gridTdWidth = 2;						
	gridTrHeight = 2;						
	gridTableBorder = 1;
	gridTableWidth = gridRows * gridTdWidth + 2 * gridTableBorder;
	gridTableHeight = gridCols * gridTrHeight + 2 * gridTableBorder;
	
	mainTableWidth = 200;					
	mainTableHeight = 158;					
	mainTableBorder = 1;
	mainTableSpacing = 2;
	mainTrTopHeight = gridTableHeight;
	mainTrBotHeight = mainTableHeight - 2 * mainTableBorder - 3 * mainTableSpacing - mainTrTopHeight;
	mainTdLeftWidth = gridTableWidth;
	mainTdRightWidth = mainTableWidth - 2 * mainTableBorder - 3 * mainTableSpacing - mainTdLeftWidth;
	
	statTableWidth = mainTdRightWidth;
	statTableHeight = mainTrTopHeight;
	statTableBorder = 1;	
	statTrTopHeight = Math.round((statTableHeight - 2 * statTableBorder) / 2);
	statTrBotHeight = statTableHeight - 2 * statTableBorder - statTrTopHeight;
	statTdWidth = statTableWidth - 2 * statTableBorder;

	selWidth = mainTdLeftWidth;				// including own border
	selHeight = mainTrBotHeight;			// including own border
	
	valWidth = mainTdRightWidth;			// including own border
	valHeight = mainTrBotHeight;			// including own border
	
	// Now prepare styles and take no chances re: browser and CSS default styles.
	// The only pertinent defaults carried forward are border and font colors.
	// which can be set in the style sheets of the target environment.
	// Be specific at pixel level where possible so there is no dynamic adjusting by browser.
	// Note that these styles include old HTML properties which have to be mapped consistently.
	// IE in particular carries over a lot of past baggage.
	
	mainTableStyle		= 'border="' + mainTableBorder + 'px" '
						+ 'cellspacing="' + mainTableSpacing + 'px" '
						+ 'cellpadding="0" '
						+ 'style="'
						+ 'width:' + mainTableWidth + 'px;'
						+ 'height:' + mainTableHeight + 'px;'
						+ 'border-width:' + mainTableBorder + 'px;'
						+ 'border-spacing:' + mainTableSpacing + 'px;'
						+ 'border-collapse:separate;border-style:solid;padding:0px;margin:0px"';
						
	mainTrTopStyle		= 'style="'
						+ 'height:' + mainTrTopHeight + 'px"';
						
	mainTrBotStyle		= 'style="'
						+ 'height:' + mainTrBotHeight + 'px"';
						
	mainTdLeftStyle		= 'style="'
						+ 'width:' + mainTdLeftWidth + 'px"';
					
	mainTdRightStyle	= 'style="'
						+ 'width:' + mainTdRightWidth + 'px"';					

	gridTableStyle 		= 'border="' + gridTableBorder + 'px" '
						+ 'cellspacing="0" cellpadding="0" '
						+ 'style="'
						+ 'width:' + gridTableWidth + 'px;'
						+ 'height:' + gridTableHeight + 'px;'
						+ 'border-width:' + gridTableBorder + 'px;'
						+ 'border-spacing:0px;border-collapse:separate;border-style:solid;padding:0px;margin:0px"';
						
	gridTrStyle 		= 'style="'
						+ 'height:' + gridTrHeight + 'px;'
						+ 'border-width:0px;border-spacing:0px;padding:0px;margin:0px"';	
						
	gridTdStyle 		= 'style="'
						+ 'width:' + gridTdWidth + 'px;'
						+ 'border-width:0px;border-spacing:0px;padding:0px;margin:0px;';
						
						// purposely not terminated because background-color has to be dynamically appended
			  
	statTableStyle		= 'border="' + statTableBorder + 'px" '
						+ 'cellspacing="0" cellpadding="0" '
						+ 'style="'
						+ 'width:' + statTableWidth + 'px;'
						+ 'height:' + statTableHeight + 'px;'
						+ 'border-width:' + statTableBorder + 'px;'
						+ 'border-spacing:0px;border-collapse:separate;border-style:solid;padding:0px;margin:0px"';
						
	statTrTopStyle		= 'style="'
						+ 'height:' + statTrTopHeight + 'px"';
						
	statTrBotStyle		= 'style="'
						+ 'height:' + statTrBotHeight + 'px"';
						
	statTdStyle			= 'style="'
						+ 'width:' + statTdWidth + 'px"';	

	selFont				= "font-family:Arial,Helvetica,sans-serif;font-style:normal;font-weight:normal;font-size:12px";						

	selStyle			= 'style="'
						+ 'width:' + selWidth + 'px;'		
						+ 'height:' + selHeight + 'px;'	
						+ 'border-width:1px;border-style:solid;padding:0px;margin:0px;vertical-align:middle;' + selFont + '"';	
						
	valFont				= "font-family:'Courier New',Courier,monospace;font-weight:normal;font-size:13px";

	valStyle			= 'style="'
						+ 'width:' + valWidth + 'px;'		
						+ 'height:' + valHeight + 'px;'	
						+ 'line-height:' + valHeight + 'px;'	
						+ 'border-width:1px;border-style:solid;padding:0px;margin:0px;vertical-align:middle;' + valFont + '"';
	
	// Now generate HTML
	
	html = '';
	
	html += '<table border="0" cellpadding="0" cellspacing="0"' + mainTableStyle + ' id="' + this.mainId + '">';
	
		html += '<tr ' + mainTrTopStyle + '>'; 
		
			html += '<td ' + mainTdLeftStyle + '>'; 
			
				html += '<table border="0" cellpadding="0" cellspacing="0"' + gridTableStyle + ' id="' + this.gridId + '">';
				
					for (Y=0; Y < gridRows; Y++)
					{
						html += '<tr ' + gridTrStyle + '>';
						j=Math.round(Y*(510/(gridRows))-255);
							  
						for (X=0; X < gridCols; X++)
						{
							i=Math.round(X*(total/(gridCols-1)));
							R=aR[i]-j;if(R<0){R=0;}if(R>255||isNaN(R)){R=255;}
							G=aG[i]-j;if(G<0){G=0;}if(G>255||isNaN(G)){G=255;}
							B=aB[i]-j;if(B<0){B=0;}if(B>255||isNaN(B)){B=255;}
							html += '<td ' + gridTdStyle + 'background-color:' + hexColor([R,G,B]) + '"></td>';
						}
						html += '</tr>';
					}			

				html += '</table>';
			
			html += '</td>';
	   
			html += '<td ' + mainTdRightStyle + '>'; 
			
				html += '<table border="0" cellpadding="0" cellspacing="0"' + statTableStyle + '>';
					html += '<tr ' + statTrTopStyle + '>';
						html += '<td ' + statTdStyle + ' id="' + this.trackId + '"></td>';
					html += '</tr>';
					html += '<tr ' + statTrBotStyle + '>';
						html += '<td ' + statTdStyle + ' id="' + this.pickId + '"></td>';
					html += '</tr>';
				html += '</table>';
				
			html += '</td>';
	   
		html += '</tr>';
		
		html += '<tr ' + mainTrBotStyle + '>'; 
		
			html += '<td ' + mainTdLeftStyle + '>'; 
				html += '<select id="' + this.selectId + '"' + selStyle + '></select>';
			html += '</td>';
			
			html += '<td ' + mainTdRightStyle + '>'; 
				html += '<input type="text" maxlength="7" id="' + this.valueId + '"' +  valStyle + '/>';
			html += '</td>';
		
		html += '</tr>';
		
	html += '</table>';

	e = gel(this.divId);
	e.innerHTML = html;

	e = gel(this.selectId);

	opt = new Option();
	opt.text = 'CUSTOM';
	opt.value = '';
	e.options.add(opt);
	   
	for (c in CON.colors)
	{
		opt = new Option();
		opt.text = c;
		opt.value = '#' + CON.colors[c].toUpperCase();
		e.options.add(opt);
	}

	e.selectedIndex = 0;   
	e.onchange = function(){ self.selectChangeHandler(); };
		
	e = gel(this.gridId);
	e.onmouseover = function(event){ self.gridMouseoverHandler(event); };
	e.onclick = function(){ self.gridClickHandler(); };
	   
	e = gel(this.valueId);
	e.onchange = function(){ self.valueChangeHandler(); };
	e.onkeyup = function(){ self.valueKeyupHandler(); };
};

////////////////////////////////////////////////////////////////////////

Col.prototype.enable = function(enabled)
{
	// Color swatch is disabled on initialisation. Use this method to
	// enable/disable it. Note that enabling or disabling does not clear
	// any tracked ot picked values although it will reset any partially
	// entered values. Use clear method for clearing everything else.
	
	var e;
	
	e = gel(this.valueId);
	e.disabled = !enabled;
	e.style.backgroundColor = '';
	e.style.color = '';	
	e.value = this.pickValue;
	
	e = gel(this.selectId);
	e.disabled = !enabled;
	
	this.enabled = enabled;
};

////////////////////////////////////////////////////////////////////////

Col.prototype.clear = function()
{
	// Clears all swatch variables but does not affect enabled/disabled
	// status which is controlled by the enabled method.

	var e;
	
	this.trackValue = '';
	this.pickValue = '';

	e = gel(this.valueId);
	e.style.backgroundColor = '';
	e.style.color = '';	
	e.value = '';
	
	e = gel(this.selectId);
	e.selectedIndex = 0;   
	
	e = gel(this.trackId);
	e.style.backgroundColor = '';
	
	e = gel(this.pickId);
	e.style.backgroundColor = '';
};

////////////////////////////////////////////////////////////////////////

Col.prototype.stableValue = function()
{
	if (this.pickValue === gel(this.valueId).value)
	{
		return this.pickValue;
	}
};

////////////////////////////////////////////////////////////////////////

Col.prototype.selectChangeHandler = function()
{
	var s;
	   
	s = gel(this.selectId);
	this.pickValue = s.options[s.selectedIndex].value;
	this.update();
};

////////////////////////////////////////////////////////////////////////

Col.prototype.gridMouseoverHandler = function(event)
{
	var src;
	
	if (!this.enabled) {return;}
	src = eventTarget(event);
	if (src.tagName === "TABLE") {return;}
	while (src.tagName !== "TD" && src.tagName !== "HTML") {src = src.parentNode;}
	gel(this.trackId).style.backgroundColor = this.trackValue = hexColor(src.style.backgroundColor);
};

////////////////////////////////////////////////////////////////////////

Col.prototype.gridClickHandler = function()
{
	if (!this.enabled) {return;}

	this.pickValue = this.trackValue;
	this.update();
};

////////////////////////////////////////////////////////////////////////

Col.prototype.valueChangeHandler = function()
{
	var e;
	var v;
	var rex;
	   
	e = gel(this.valueId);
	v = trim(e.value.toUpperCase());
			  
	rex = /^#[0-9A-F]{6}$/;
	   
	if (rex.test(v))
	{
		this.pickValue = v;
		this.update();
	}	
	else
	{
		e.style.backgroundColor = 'MistyRose';
		e.style.color = 'red';	
	}
};

////////////////////////////////////////////////////////////////////////

Col.prototype.valueKeyupHandler = function()
{
	var e;
	var v;
	var rex;
	   
	e = gel(this.valueId);
	v = trim(e.value.toUpperCase());
	
	rex = /^#[0-9A-F]{6}$/;   
	
	if (rex.test(v))
	{
		this.valueChangeHandler();
	}
};

////////////////////////////////////////////////////////////////////////

Col.prototype.update = function()
{
	var p;
	var e;   
	var i;
	
	p = this.pickValue;
	   
	gel(this.pickId).style.backgroundColor = p;
	gel(this.valueId).value = p;
	
	e = gel(this.selectId);
	   
	for (i=0; i < e.options.length; i++)
	{
		if (e.options[i].value === p) {break;}
	}
	if (i === e.options.length) {i = 0;}
	e.selectedIndex = i;
	
	e = gel(this.valueId);
	   
	e.style.backgroundColor = '';
	e.style.color = '';	 
};

////////////////////////////////////////////////////////////////////////

Col.prototype.close = function()
{
	gel(this.divId).innerHTML = '';
};

////////////////////////////////////////////////////////////////////////
//////////////////////// Common App Functions //////////////////////////
////////////////////////////////////////////////////////////////////////

function commonInit(viewName)
{
	CON = new Con();   
	ENV = new Env(viewName);
	ERR = new Err();	
	DOC = new Doc(); 
};

////////////////////////////////////////////////////////////////////////
/////////////////////////// Global Variables ///////////////////////////
////////////////////////////////////////////////////////////////////////

// For clarity, all global variables are declared together in common code
// even though some will be undefined in certain views and/or contexts

var CON;	// global constants and enumerated values
var ENV;	// execution environment
var ERR;	// global error object
var DOC;	// global document data snapshot
var CFG;	// global configuration data
var SRC;	// global source data
var CRX;	// current photo cabinet root index
var CAB;	// current photo cabinet
var SEL;	// current photo selection
var SHO;	// current slide show
var COL;	// colour picker

////////////////////////////////////////////////////////////////////////
