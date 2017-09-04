////////////////////////////////////////////////////////////////////////
//
// photofeed-config.js
//
// Copyright RVJ Callanan 2009-2017
// This is FREE software, released under a permissive MIT license
// For terms of use, see LICENSE file.
//
// This module contains gadget code for config view only
//
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
/////////////////////// Functions //////////////////////////////////////
////////////////////////////////////////////////////////////////////////

function init()
{
	commonInit("configuration");
	ERR.setErrHandler(errHandler);

	gadgets.util.registerOnLoadHandler(loadHandler);	
};

////////////////////////////////////////////////////////////////////////

function errHandler()
{
	// Silently ignore initialisation errors that will get picked up
	// by the corresponding ready handlers. Generate alerts for any
	// other errors which are routine parameter parsing or validation
	// errors trapped by the CFG.save method.
	
	if ( CFG.state !== CON.cfgStates.initialising
	&&   CRX.state !== CON.crxStates.initialising
	&&   CAB.state !== CON.cabStates.initialising )
	{
		alert(ERR.text());
	}
};

////////////////////////////////////////////////////////////////////////

function loadHandler()
{		
	ERR.setErrHandler(errHandler);
	
	COL = new Col("swatch");   
	CFG = new Cfg();	
	
	cfgChangeHandler();
};

////////////////////////////////////////////////////////////////////////

function cfgChangeHandler()
{
	// This is called after a page load or following a theme change.
	// The CFG object is either initialised or re-initialised and
	// everything follows from there.
	
	disableAll();
	
	resetCfg();
	resetSrc();
	resetCab();
	resetSel();
	
	catchUpAndDo(bindEarly(CFG.init, CFG, cfgReadyHandler), 100);
};

////////////////////////////////////////////////////////////////////////

function cfgReadyHandler()
{
	var msg;
	
	// A configuration error on initialisation is NOT recoverable in
	// the current set-up. This gadget is designed NOT to allow such
	// a scenario to arise. If it does, it is probably due to a serious
	// browser/web glitch or programmatic fault.
	
	if (CFG.state === CON.cfgStates.errored)
	{
		alert(CFG.error);
		throw CFG.error;
	}
	
	// A theme file error is never fatal but the user is alerted
	// in config view so that attention is brought to the problem.
	
	if ( CFG.themeStatus === CON.themeStatus.missing
	||   CFG.themeStatus === CON.themeStatus.invalid )
	{
		msg = "";
	
		if (CFG.themeStatus === CON.themeStatus.missing)
		{
			msg += "The theme file used by this gadget is missing.\n";
			msg += "You may want to try refreshing the page.";
		}
		else
		{
			msg += "The gadget theme file contains the following error:\n\n";
			msg += CFG.themeError;
		}
		
		msg += "\n\nIMPORTANT\n";
		
		if (CFG.theme === 'Disabled')
		{
			msg += "Theme options are disabled until a valid theme file is restored!";
		}
		else
		{
			msg += "To freely configure your gadget, you must disable the current theme.";
		
			if (CFG.themeForced)
			{
				msg += "\n\nWARNING\n";
				msg += "Your current theme was previously forced. If you disable this theme ";
				msg += "and a valid theme file comes back on-line, it may override your new settings. ";
				msg += "It is advisable to attend to the theme file problem first!";
			}
		}
		
		alert(msg);
	}
	
	// Update theme status indicator
	
	switch(CFG.themeStatus)
	{
	case CON.themeStatus.missing:	
	case CON.themeStatus.invalid:	
		setAlert('cfg', CON.themeStatus.textOf(CFG.themeStatus));
		break;
	default:
		setInfo('cfg', CON.themeStatus.textOf(CFG.themeStatus));
	}	
	
	// From this point on, the normal config dialog can continue.
	// If there are config errors still outstanding, they will be
	// of the contextual variety. For example, the cabSource,
	// cabName or leadPhotoName may refer to a resource that no
	// longer exists. While in home view, these errors will be
	// fatal, the sequential config dialog is designed to allow
	// these problems to be worked through in an orderly fashion.

	initCfgChangeSources();
	initCrxChangeSources();
	initCabChangeSources();
	initSelChangeSources();
	
	initPickAll();
	initMainButtons();
	
	CFG.loadAll();
	
	catchUpAndDo(crxChangeHandler, 100);
};

////////////////////////////////////////////////////////////////////////

function crxChangeHandler()
{
	disableAll();

	resetSrc();
	resetCab();
	resetSel();
	
	SRC = new Src();

	CRX = new Crx();  
	CRX.init(crxReadyHandler);
};

////////////////////////////////////////////////////////////////////////

function crxReadyHandler()
{
	var cabSelect;
	var crxLen;
	var i;
	var opt;
	var index;

	try
	{
		if (CRX.state === CON.crxStates.errored)
		{
			throw "Error";
		}
		
		cabSelect = gel('cabSelect');
		crxLen = CRX.items.length;
		
		if (crxLen === 0)
		{
			index = -1;
			cabSelect.selectedIndex = index;
			throw "Empty";
		}
		
		index = 0;
		
		for (i=0; i < crxLen; i++)
		{
			if (CRX.items[i].name === CFG.cabName) {index = i;}
			opt = new Option();
			opt.text = CRX.items[i].title;			
			cabSelect.options.add(opt);
		}
		
		cabSelect.selectedIndex = index;
		scrollSelect(cabSelect);	
	}
	
	catch(err)
	{
		setAlert('src', err);
		enable('cabSource', true);
		enable('deferCache', true);
		enable('theme', true);
		enableMainButtons(true);
		return;
	}
	
	cabChangeHandler();
};

////////////////////////////////////////////////////////////////////////

function cabChangeHandler()
{
	var index;
	var cabSelect;
	var i;
	
	disableAll();
	resetCab();
	resetSel();
	
	cabSelect = gel('cabSelect');
	index = cabSelect.selectedIndex;
	
	if (index === -1)
	{
		// This may happen ocassionally due to CHROME BUG
		// where an up or down arrow key press shows the
		// selected item changing visibly even though the
		// control is in the disabled state. But even worse,
		// the selectedIndex property enters a limbo state
		// of -1. If this happens, we will restore the control
		// to a stable and consistent state corresponding to
		// the most recent known good value. There has to be
		// a good value available because the problem can
		// not happen with an empty directory. This is a 
		// perfect solution to the problem. The user simply
		// sees the selected item staying stubbornly the same
		// same if he hits the down arrow or up arrow key too
		// quickly. When he slows down, the selection moves
		// in a predictable fashion
		
		for (i=0; i < CRX.items.length; i++)
		{
			if (CRX.items[i].name === CFG.cabName)
			{
				index = i;
				break;
			}
		}
		
		cabSelect.selectedIndex = index;
		
		// if index is still -1 at this point then it is due
		// to some other problem which will cause a run-time
		// error at the next statement.
	}

	setInfo('src', (index + 1) + ' of ' + CRX.items.length);	

	gel('cabName').value = CRX.items[index].name;

	CFG.save('cabName');
	   
	CAB = new Cab();	
	CAB.init(cabReadyHandler);
};

////////////////////////////////////////////////////////////////////////

function cabReadyHandler()
{
	var leadSelect;
	var cabLen;
	var i;
	var opt;
	var text;
	var index;
	
	try
	{
		if (CAB.state === CON.cabStates.errored)
		{
			throw "Error";
		}

		leadSelect = gel('leadSelect');
		cabLen = CAB.items.length;
		   
		if (cabLen === 0)
		{
			leadSelect.selectedIndex = -1;
			throw "Empty";
		}
		
		for (i=0; i < cabLen; i++)
		{
			text = CAB.items[i].caption;
			text = text.length > 0 ? text : 'Uncaptioned (No. ' + (i+1) + ')';
			opt = new Option();
			opt.text = text;
			leadSelect.options.add(opt);
		}
		 
		index = CAB.match(CFG.leadPhotoName);
		if (index < 0) {index = 0;}
			  
		leadSelect.selectedIndex = index;	
	}
	
	catch(err)
	{
		setAlert('cab', err);
		enable('cabSource', true);   
		enable('deferCache', true);   		
		enable('cabSelect', true);
		enable('theme', true);
		enableMainButtons(true);
		return;
	}
	
	selChangeHandler();
};

///////////////////////////////////////////////////////////////////////

function selChangeHandler()
{
	var leadSelect;
	var leadPhotoName;
	var selBox;
	var selWrapper;
	var index;   
	var selHeight;
	var selWidth;
	var selOptions;
	var spaceColor;
	var spaceStyle;
	var spaceWidth;
	var styleName;
	var cfgset;
	var i;
	
	disableAll();
	resetSel();

	leadSelect = gel('leadSelect');
	leadPhotoName = gel('leadPhotoName');
	selBox = gel('selBox');  
	selWrapper = gel('selWrapper');  
	
	index = leadSelect.selectedIndex;
	
	if (index === -1)
	{
		// See cabChangeHandler for this solution to CHROME BUG
		
		for (i=0; i < CAB.items.length; i++)
		{
			if (CAB.items[i].filename === CFG.leadPhotoName)
			{
				index = i;
				break;
			}
		}
		
		leadSelect.selectedIndex = index;
	}
	
	setInfo('cab', (index + 1) + ' of ' + CAB.items.length);	
		
	leadPhotoName.value = CAB.items[index].filename;

	// only use config set B when Slides page active

	cfgset = gel('cfgSlides').style.display === 'block' ? 'B' : 'A';
	
	if (cfgset === 'A')
	{
		spaceColor = CFG.spaceColorA;
		spaceStyle = CFG.spaceStyleA;
		spaceWidth = CFG.spaceWidthA;
	}
	else
	{
		spaceColor = CFG.spaceColorB;
		spaceStyle = CFG.spaceStyleB;
		spaceWidth = CFG.spaceWidthB;
	}
	
	selWrapper.style.paddingRight = spaceWidth + 'px';
	selWrapper.style.paddingBottom = spaceWidth + 'px';
	selWrapper.style.borderColor = '#FFFFFF';

	styleName = CON.spaceStyles.nameOf(spaceStyle);
	selWrapper.style.backgroundColor = styleName === 'solid' ? spaceColor : 'transparent';
	
	CFG.save('leadPhotoName');
	
	// Height available to selector is the selBox height minus the
	// selWrapper's dashed border (2 x 1px). Also create an artificial
	// space at the bottom to emphasise the photo-spacing setting
	// in the vertical direction if there were more photos in column
	
	selHeight = 174 - spaceWidth;
	
	// preview using single footer-less selection with mostly default options
	 
	selOptions =
	{
		height:				selHeight,
		grid:				[1],
		layout:				CON.layouts.exact,
		footerStyle:		CON.textStyles.none			
	};
	  
	SEL = new Sel("sel", index, cfgset, selOptions, selReadyHandler);
	SEL.show();
};

////////////////////////////////////////////////////////////////////////

function selReadyHandler()
{
	// Update calculated fields, preview boundary and selection status 

	var maxWidth;
	var scope;

	var slideOverhead;
	var selOverhead;
	var staticHeight;
	var compactWidth;

	var cabItem 			= CAB.items[SEL.items[0].cabIndex];
	
	var padding 			= CFG.padding;
	var noSlides 			= CFG.noSlides;
	var grid 				= CFG.grid; 
	var refHeight   		= CFG.refHeight;
	
	var frameWidthA 		= CFG.frameStyleA 	=== CON.frameStyles.none 	? 0 : CFG.frameWidthA;
	var matWidthA 			= CFG.matStyleA 	=== CON.matStyles.none 		? 0 : CFG.matWidthA;
	var edgeWidthA 			= CFG.edgeStyleA 	=== CON.edgeStyles.none 	? 0 : CFG.edgeWidthA;
	var revealWidthA		= CFG.revealStyleA 	=== CON.revealStyles.none 	? 0 : CFG.revealWidthA;
	var shadowWidthA 		= CFG.shadowStyleA 	=== CON.shadowStyles.none 	? 0 : CFG.shadowWidthA;
	var spaceWidthA 		= CFG.spaceWidthA;
		
	var frameWidthB 		= CFG.frameStyleB 	=== CON.frameStyles.none 	? 0 : CFG.frameWidthB;
	var matWidthB 			= CFG.matStyleB 	=== CON.matStyles.none 		? 0 : CFG.matWidthB;
	var edgeWidthB 			= CFG.edgeStyleB 	=== CON.edgeStyles.none 	? 0 : CFG.edgeWidthB;
	var revealWidthB 		= CFG.revealStyleB 	=== CON.revealStyles.none 	? 0 : CFG.revealWidthB;
	var shadowWidthB 		= CFG.shadowStyleB 	=== CON.shadowStyles.none 	? 0 : CFG.shadowWidthB;
	var spaceWidthB 		= CFG.spaceWidthB;
	
	var footerHeight 		= CFG.footerStyle	=== CON.textStyles.none 	? 0 : CFG.footerHeight;
	
	var upperHeight 		= CFG.upperStyle 	=== CON.textStyles.none 	? 0 : CFG.upperHeight;
	var panelHeight 		= CFG.panelStyle 	=== CON.panelStyles.none 	? 0 : CFG.panelHeight;
	var lowerHeight 		= CFG.lowerStyle	=== CON.textStyles.none 	? 0 : CFG.lowerHeight;
	
	var uplHeight 			= upperHeight + panelHeight + lowerHeight;
	var uplSpace 			= uplHeight === 0 ? 0 : spaceWidthB;

	var slideOverheadWidth 	= 2 * (frameWidthB + matWidthB + edgeWidthB + revealWidthB) + shadowWidthB;
	var slideOverheadHeight = slideOverheadWidth + uplSpace + uplHeight;
	var slideImageHeight 	= refHeight;
	var slideImageWidth 	= Math.ceil(slideImageHeight * cabItem.width / cabItem.height);
	var slideHeight 		= slideImageHeight + slideOverheadHeight;
	var slideWidth 			= slideImageWidth + slideOverheadWidth;

	var selOverheadWidth	= 2 * (frameWidthA + matWidthA + edgeWidthA + revealWidthA) + shadowWidthA;
	var selOverheadHeight 	= selOverheadWidth + footerHeight;
	var selImageHeight 		= slideHeight - selOverheadHeight;
	var selImageWidth 		= Math.ceil(selImageHeight * cabItem.width / cabItem.height);
	var selHeight 			= slideHeight;
	var selWidth 			= selImageWidth + selOverheadWidth;

	// provide helpful info in calculated fields

	slideOverhead = lpad3z(slideOverheadWidth) + ' x ' + lpad3z(slideOverheadHeight) + ' px';
	staticHeight  = slideHeight + 2 * padding + ' px';

	if (noSlides)
	{
		maxWidth = selWidth;

		if (selWidth == slideWidth)
		{	
			scope = 'A=X';
		}
		else if (selWidth > slideWidth)
		{
			scope = 'A>X';
		}
		else
		{
			scope = 'A<X';
		}
	}
	else
	{
		if (selWidth == slideWidth)
		{
			maxWidth = selWidth;
			scope = 'A=B';
		}
		else if (selWidth > slideWidth)
		{
			maxWidth = selWidth;
			scope = 'A>B';
		}
		else
		{
			maxWidth = slideWidth;
			scope = 'A<B';
		}
	}

	if (grid.length !== 1 || grid[0] != 1)
	{
		selOverhead = 'Grid !!';
		compactWidth = 'Grid !!';
	}
	else
	{
		selOverhead = lpad3z(selOverheadWidth) + ' x ' + lpad3z(selOverheadHeight) + ' px';

		if (cabItem.state !== CON.imgStates.preloaded)
		{
			compactWidth = 'No Photo !!';
		}
		else
		{
			compactWidth = scope + '  ' + lpad4s(maxWidth + 2 * padding) + ' px';
		}
	}

	gel('staticHeight').value = staticHeight;
	gel('compactWidth').value = compactWidth; 
	gel('selOverhead').value = selOverhead;
	gel('slideOverhead').value = slideOverhead;
	
	// Activate dashed border on image preview

	gel('selWrapper').style.borderColor = '#000000';

	// Update selection status

	if (cabItem.state === CON.imgStates.preloaded)
	{
		setInfo('sel', cabItem.width + ' x ' + cabItem.height);
	}
	else
	{
		setAlert('sel', 'Unavailable');
	}

	// Hand back control to user

	enableAll(true); 
};

////////////////////////////////////////////////////////////////////////

function xml()
{
	// Display XML representation of current configuration
	// suitable for pasting into a theme file. 
	
	CFG.popupXML();
};

////////////////////////////////////////////////////////////////////////

function refresh()
{
	// Want to refresh everything from the start of the chain going
	// right back to the themed configuration. The user might click
	// this button if there is a web glitch that causes a theme,
	// feed or photo load failure.
	
	cfgChangeHandler();
};

////////////////////////////////////////////////////////////////////////

function defaults()
{
	// This is only for user-configurable parameters with defaults whose
	// values are not forced by an active theme which remains active.
	// Where applicable, themed defaults are applied instead of original
	// defaults. All unaffected parameters will retain their current values.

	disableAll();
	CFG.loadDefaultAll();
	CFG.write();
	
	catchUpAndDo(crxChangeHandler, 100);
};

////////////////////////////////////////////////////////////////////////

function apply()
{
	// While this does perform a bulk write back to the as yet unsaved
	// back-end gadget prefs, the write is almost certainly redundant.
	// Back-end data is updated on the fly as indivuidual parameters are
	// changed regardless of whether the apply button is pressed. This
	// is really a "comfort" button to give the focus somewhere to go
	// so that the user is satisfied that his change has been applied
	// during the config session rather than clicking the main OK button.
	// However, it has practical value because IE can miss changes on
	// certain inputs when the main OK button is clicked DIRECTLY after
	// a new input value has been entered but not yet processed by the
	// input's change handler. My guess is that this is some kind of
	// asynchronous timing glitch that only arises in custom gadget
	// configuration views where the back-end prefs are sampled too
	// quickly before the current change has been applied.

	enableMainButtons(false);
	CFG.write();
	catchUpAndDo(bindEarly(enableMainButtons, this, true), 100);
};

////////////////////////////////////////////////////////////////////////

function activatePage(page, active)
{
	var t = gel('tab' + page);
	var c = t.parentElement;
	var p = gel('cfg' + page);

	if ( active )
	{
		t.style.color = '#000000';
		c.style.backgroundColor = '#7f9db9';
		p.style.display = 'block';
	}
	else
	{
		t.style.color = '#7f9db9';
		c.style.backgroundColor = '#FFFFFF';
		p.style.display = 'none';
	}
};

////////////////////////////////////////////////////////////////////////

function tabClick(page)
{
	clearSelection();

	activatePage('General', false);
	activatePage('Selection', false);
	activatePage('Slides', false);

	activatePage(page, true);

	selChangeHandler();
};

////////////////////////////////////////////////////////////////////////

function initCfgChangeSources()
{
	CFG.notifyParamChange('theme', cfgChangeHandler);	   
}

////////////////////////////////////////////////////////////////////////

function initCrxChangeSources()
{
	CFG.notifyParamChange('cabSource', crxChangeHandler);
	CFG.notifyParamChange('deferCache', crxChangeHandler);
}

////////////////////////////////////////////////////////////////////////

function initCabChangeSources()
{
	gel('cabSelect').onchange = cabChangeHandler;	  
}

////////////////////////////////////////////////////////////////////////

function initSelChangeSources()
{
	gel('leadSelect').onchange = selChangeHandler;	   
	
	// Attach selChangeHandler to any configuration parameters
	// which affect one or more of the following:
	//
	// - lead photo preview
	// - color picker states
	// - calculated fields

	// General

	CFG.notifyParamChange('padding',		selChangeHandler);
	CFG.notifyParamChange('refHeight',		selChangeHandler); 
	CFG.notifyParamChange('grid',			selChangeHandler);
	CFG.notifyParamChange('noSlides',		selChangeHandler);
	
	// Selection

	CFG.notifyParamChange('frameColorA', 	selChangeHandler);
	CFG.notifyParamChange('frameStyleA', 	selChangeHandler);
	CFG.notifyParamChange('frameWidthA',	selChangeHandler);

	CFG.notifyParamChange('shapeColorA', 	selChangeHandler);
	CFG.notifyParamChange('shapeStyleA', 	selChangeHandler);
	CFG.notifyParamChange('shapeRadiusA', 	selChangeHandler);	
	
	CFG.notifyParamChange('matColorA', 		selChangeHandler);
	CFG.notifyParamChange('matStyleA', 		selChangeHandler);
	CFG.notifyParamChange('matWidthA', 		selChangeHandler);	
	
	CFG.notifyParamChange('edgeColorA', 	selChangeHandler);
	CFG.notifyParamChange('edgeStyleA', 	selChangeHandler);
	CFG.notifyParamChange('edgeWidthA', 	selChangeHandler);	

	CFG.notifyParamChange('revealColorA', 	selChangeHandler);
	CFG.notifyParamChange('revealStyleA', 	selChangeHandler);
	CFG.notifyParamChange('revealWidthA', 	selChangeHandler);	
	
	CFG.notifyParamChange('shadowColorA', 	selChangeHandler);
	CFG.notifyParamChange('shadowStyleA', 	selChangeHandler);
	CFG.notifyParamChange('shadowWidthA', 	selChangeHandler);

	CFG.notifyParamChange('spaceColorA', 	selChangeHandler);
	CFG.notifyParamChange('spaceStyleA', 	selChangeHandler);
	CFG.notifyParamChange('spaceWidthA', 	selChangeHandler);

	CFG.notifyParamChange('footerColor', 	selChangeHandler);
	CFG.notifyParamChange('footerStyle', 	selChangeHandler);
	CFG.notifyParamChange('footerHeight', 	selChangeHandler);

	CFG.notifyParamChange('hoverColor', 	selChangeHandler);
	
	// Slides
	
	CFG.notifyParamChange('frameColorB', 	selChangeHandler);
	CFG.notifyParamChange('frameStyleB', 	selChangeHandler);
	CFG.notifyParamChange('frameWidthB', 	selChangeHandler);

	CFG.notifyParamChange('shapeColorB', 	selChangeHandler);
	CFG.notifyParamChange('shapeStyleB', 	selChangeHandler);
	CFG.notifyParamChange('shapeRadiusB', 	selChangeHandler);	
	
	CFG.notifyParamChange('matColorB', 		selChangeHandler);
	CFG.notifyParamChange('matStyleB', 		selChangeHandler);
	CFG.notifyParamChange('matWidthB', 		selChangeHandler);	
	
	CFG.notifyParamChange('edgeColorB', 	selChangeHandler);
	CFG.notifyParamChange('edgeStyleB', 	selChangeHandler);
	CFG.notifyParamChange('edgeWidthB', 	selChangeHandler);

	CFG.notifyParamChange('revealColorB', 	selChangeHandler);
	CFG.notifyParamChange('revealStyleB', 	selChangeHandler);
	CFG.notifyParamChange('revealWidthB', 	selChangeHandler);	
	
	CFG.notifyParamChange('shadowColorB', 	selChangeHandler);
	CFG.notifyParamChange('shadowStyleB', 	selChangeHandler);
	CFG.notifyParamChange('shadowWidthB', 	selChangeHandler);
	
	CFG.notifyParamChange('spaceColorB', 	selChangeHandler);
	CFG.notifyParamChange('spaceStyleB', 	selChangeHandler);
	CFG.notifyParamChange('spaceWidthB', 	selChangeHandler);

	CFG.notifyParamChange('upperColor', 	selChangeHandler);
	CFG.notifyParamChange('upperStyle', 	selChangeHandler);
	CFG.notifyParamChange('upperHeight', 	selChangeHandler);

	CFG.notifyParamChange('panelColor', 	selChangeHandler);
	CFG.notifyParamChange('panelStyle', 	selChangeHandler);
	CFG.notifyParamChange('panelHeight', 	selChangeHandler);

	CFG.notifyParamChange('lowerColor', 	selChangeHandler);
	CFG.notifyParamChange('lowerStyle', 	selChangeHandler);
	CFG.notifyParamChange('lowerHeight', 	selChangeHandler);

	CFG.notifyParamChange('buttonColor', 	selChangeHandler);
	CFG.notifyParamChange('spreadColor', 	selChangeHandler);
	CFG.notifyParamChange('beckonColor', 	selChangeHandler);
	CFG.notifyParamChange('glowColor', 		selChangeHandler);
};	

////////////////////////////////////////////////////////////////////////

function initMainButtons()
{
	gel('xmlButton').onclick = xml;
	gel('defaultsButton').onclick = defaults;
	gel('refreshButton').onclick = refresh;
	gel('applyButton').onclick = apply;
};

////////////////////////////////////////////////////////////////////////

function enableTabs()
{
	enableTab('General');
	enableTab('Selection');
	enableTab('Slides');
};

////////////////////////////////////////////////////////////////////////

function enableTab(page)
{
	var e = gel('tab' + page);

	e.style.cursor = 'default';
	e.onclick = bindEarly(tabClick, this, page);
};

////////////////////////////////////////////////////////////////////////

function disableTabs()
{
	disableTab('General');
	disableTab('Selection');
	disableTab('Slides');
};

////////////////////////////////////////////////////////////////////////

function disableTab(page)
{
	var e = gel('tab' + page);

	e.style.cursor = 'wait';
	e.onclick = null;
};

////////////////////////////////////////////////////////////////////////

function initPickAll()
{
	initPick('frame', 	'A');
	initPick('shape', 	'A');
	initPick('mat', 	'A');
	initPick('edge',	'A');
	initPick('reveal',	'A');
	initPick('shadow', 	'A');
	initPick('space',	'A');

	initPick('frame',	'B');
	initPick('shape', 	'B');
	initPick('mat',		'B');
	initPick('edge', 	'B');
	initPick('reveal', 	'B');
	initPick('shadow',	'B');
	initPick('space',	'B');

	initPick('footer');
	initPick('upper');
	initPick('panel');
	initPick('lower');
	initPick('button');
	initPick('spread');
	initPick('glow');
	initPick('beckon');
	initPick('hover');
};

////////////////////////////////////////////////////////////////////////

function initPick(prefix, suffix)
{
	var pickId;
	var colorId;
	var e;

	suffix = suffix === null || typeof suffix === "undefined" ? '' : suffix;
	pickId = prefix + 'Pick' + suffix;
	colorId = prefix + 'Color' + suffix;

	e = gel(pickId);

	e.onclick = bindEarly(pick, this, colorId, pickId);
	e.title = 'Apply Swatch';
};

////////////////////////////////////////////////////////////////////////

function pick(colorId, pickId)
{	
	var sc = COL.stableValue();
	
	if (COL.stableValue())
	{
		gel(colorId).value = sc;
		gel(pickId).style.backgroundColor = sc;
		
		CFG.save(colorId, true);
	}
};

////////////////////////////////////////////////////////////////////////

function disableAll()
{
	// This may be called before configuration data is available, so
	// use automatic and brutal enablePage(false) method that knows
	// nothing about configuration parameters. We want to avoid disabling
	// an already disabled page which is time-consuming if this function
	// is called a number of times in a chain of related events. We can
	// depend on our knowledge that one control, the refesh button, is
	// enabled in all non-disabled states. If it happens to be disabled,
	// we know the page as a whole is disabled and we can return immediately.
	
	if (gel('refreshButton').disabled)
	{
		return;
	}
	
	enablePage(false);

	disableTabs();
	
	// While swatch buttons are disabled at this stage, ensure that
	// their colors are not showing to make the disabled state obvious
	
	enablePickAll(false);
	
	// Disable the swatch which enablePage(false) knows nothing about 
	
	COL.enable(false);
};

////////////////////////////////////////////////////////////////////////

function enableAll()
{	  
	// Enables all input elements that are user-configurable.

	// First enable defined parameters but exclude those whose controls
	// are permanently disabled because they are controlled by selectors.
	// Any non-user configurable parameters will NOT be enabled. This could
	// happen to normal user parameters if their values are forced.
	
	CFG.enableAll(true,['cabName', 'leadPhotoName']);
	
	// Enable the said selectors conditionally as 'friends' of the above
	// exclusions and bound by the same user-configurability restrictions.
	
	CFG.enableFriend('cabSelect', 'cabName', true);
	CFG.enableFriend('leadSelect', 'leadPhotoName', true);
	
	// Enable the pick buttons conditionally as friends of their respective
	// color input boxes but show their colors even if they remain disabled.
	
	enablePickAll(true);
	
	// Enable miscellaneous unbound items
	
	enableMainButtons(true);
	COL.enable(true);

	enableTabs();
};

////////////////////////////////////////////////////////////////////////

function enablePickAll(enabled)
{
	enablePick(enabled, 'frame',	'A');
	enablePick(enabled, 'shape',	'A');
	enablePick(enabled, 'mat',		'A');
	enablePick(enabled, 'edge',		'A');
	enablePick(enabled, 'reveal',	'A');
	enablePick(enabled, 'shadow',	'A');
	enablePick(enabled, 'space', 	'A');

	enablePick(enabled, 'frame',	'B');
	enablePick(enabled, 'shape',	'B');
	enablePick(enabled, 'mat', 		'B');
	enablePick(enabled, 'edge', 	'B');
	enablePick(enabled, 'reveal', 	'B');
	enablePick(enabled, 'shadow', 	'B');
	enablePick(enabled, 'space',  	'B');

	enablePick(enabled, 'footer');
	enablePick(enabled, 'upper'	);
	enablePick(enabled, 'panel'	);
	enablePick(enabled, 'lower'	);
	enablePick(enabled, 'button');
	enablePick(enabled, 'spread');
	enablePick(enabled, 'glow'	);
	enablePick(enabled, 'beckon');
	enablePick(enabled, 'hover'	);
}

////////////////////////////////////////////////////////////////////////

function enablePick(enabled, prefix, suffix)
{
	// Assume CFG is initialised when enabling
	// Allow that CFG may not yet be initialised when disabling
	// Pick color is always shown when enabling even if button remain
	// disabled because of user-configurability restrictions
	
	suffix = suffix === null || typeof suffix === "undefined" ? '' : suffix;

	var pickId = prefix + 'Pick' + suffix;
	var pName = prefix + 'Color' + suffix;
	var e = gel(pickId);
	
	if (enabled)
	{
		e.style.backgroundColor = CFG[pName];
		CFG.enableFriend(pickId, pName, true);  
	}
	else
	{
		e.style.backgroundColor = '';
		e.disabled = true;
	}	
};

////////////////////////////////////////////////////////////////////////

function enableMainButtons(enabled)
{
	enable('xmlButton', enabled);
	enable('refreshButton', enabled);
	enable('defaultsButton', enabled);
	enable('applyButton', enabled);
};

////////////////////////////////////////////////////////////////////////

function resetCfg()
{
	setAlert('cfg', 'Busy');
	gel('theme').innerHTML = "";   
};

////////////////////////////////////////////////////////////////////////

function resetSrc()
{
	setAlert('src', 'Busy');
	
	if (CFG.deferCache)
	{
		gel('deferCacheLabel').style.color = '#8B0000';
	}
	else
	{
		gel('deferCacheLabel').style.color = '#000000';
	}

	if (CRX)
	{
		CRX.close();
		CRX = null;
	}

	gel('cabSelect').innerHTML = "";
}

////////////////////////////////////////////////////////////////////////

function resetCab()
{
	setAlert('cab', 'Busy');

	if (CAB)
	{
		CAB.close();
		CAB = null;
	}
	
	gel('cabName').value = "";
	gel('leadSelect').innerHTML = "";
};

////////////////////////////////////////////////////////////////////////

function resetSel()
{
	setAlert('sel', 'Busy');
	
	if (SEL)
	{
		SEL.close();
		SEL = null;
	}
	
	gel('leadPhotoName').value = "";   
	gel('selWrapper').style.borderColor = '#FFFFFF';

	gel('staticHeight').value 	= '';
	gel('compactWidth').value 	= ''; 
	gel('selOverhead').value 	= '';
	gel('slideOverhead').value 	= '';
};

////////////////////////////////////////////////////////////////////////

function setAlert(idPrefix, msg)
{
	var s = gel(idPrefix + 'Status');
	s.style.color = '#FF0000';
	s.innerHTML = msg;
};

////////////////////////////////////////////////////////////////////////

function setInfo(idPrefix, msg)
{
	var s = gel(idPrefix + 'Status');
	s.style.color = '#7f9db9';
	s.innerHTML = msg;
};

////////////////////////////////////////////////////////////////////////

function clrStatus(idPrefix)
{
	var s = gel(idPrefix + 'Status');
	s.style.color = '';	
	s.innerHTML = '';
};

///////////////////////// Start of Execution ///////////////////////////

init();

////////////////////////// End of Execution ////////////////////////////