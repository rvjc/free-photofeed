////////////////////////////////////////////////////////////////////////
//
// photofeed-home.js
//
// Copyright RVJ Callanan 2009-2017
// This is FREE software, released under a permissive MIT license
// For terms of use, see LICENSE file.
//
// This module contains gadget code for home view only
//
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
/////////////////////// Functions //////////////////////////////////////
////////////////////////////////////////////////////////////////////////

function init()
{
	commonInit("home");		
	ERR.setErrHandler(errHandler);
	gadgets.util.registerOnLoadHandler(loadHandler);
};

////////////////////////////////////////////////////////////////////////

function errHandler()
{
	// Silently ignore CFG initialisation errors which may not be fatal
	// and will get picked up by cfgReadyHandler. Any other errors are
	// fatal in home view and will be displayed within the content area.
	
	if (CFG.state !== CON.cfgStates.initialising)
	{
		 gel('content').innerHTML = htmlMsg(ERR.text());
	}
};

////////////////////////////////////////////////////////////////////////

function loadHandler()
{	
	CFG = new Cfg();
	CFG.init(cfgReadyHandler);
};

////////////////////////////////////////////////////////////////////////

function cfgReadyHandler()
{
	var e = gel('content');

	if (CFG.state === CON.cfgStates.errored)
	{	
		e.innerHTML = htmlMsg(CFG.error);
		throw CFG.error;
	}

	e.style.padding = CFG.padding + 'px';
	e.style.width = DOC.width - 2 * CFG.padding;
	e.style.textAlign = CON.aligns.nameOf(CFG.align);

	// Note: We have no interest in theme errors in home view
	
	SRC = new Src();

	CAB = new Cab();
	CAB.init(cabReadyHandler);
};

////////////////////////////////////////////////////////////////////////

function cabReadyHandler()
{
	var leadIndex;
	var selOptions;
	
	if (CAB.state === CON.cabStates.errored)
	{	
		gel('content').innerHTML = htmlMsg(CAB.error);
		throw CAB.error;
	}
	
	if (CAB.items.length === 0)
	{
		// This will get trapped by error handler
		ERR.WEB("Empty Photo Cabinet", CAB.webUrl());
	}
	   
	leadIndex = CAB.match(CFG.leadPhotoName);
	if (leadIndex < 0) {leadIndex = 0;}

	selOptions = {}; // Use default options
	
	SEL = new Sel("content", leadIndex, 'A', selOptions, selReadyHandler, selClickHandler);
	SEL.show();
};

////////////////////////////////////////////////////////////////////////

function selReadyHandler()
{
	// This is really only necessary after a slide show is closed
	// in order to bring the height back to normal. But we will 
	// also call the adjust height after a new load for consistency
	// To ensure contraction, an explicit height parameter is required
	// for IE

	gadgets.window.adjustHeight(DOC.height);
}

////////////////////////////////////////////////////////////////////////

function selClickHandler(index)
{
	var shoOptions;

	if (CFG.noSlides)
	{
		// link to image source as would normally happen with embedded images

		window.open(CAB.items[index].cabSrc(), this.options.linkNew ? '_blank' : '_top');
	}
	else
	{
		// close selector and open slides
		
		SEL.close(); SEL = null;
		
		shoOptions = {}; // use default options
		   
		SHO = new Sho("content", index, shoOptions, shoMoveHandler, shoCloseHandler); 
		SHO.show();
	}
};

////////////////////////////////////////////////////////////////////////

function shoMoveHandler()
{
	// Adjust gadget height to fit slide selection. While this API is called
	// each time a new slide is displayed, it is redundant for all except the
	// first occasion. However, it is called every time to ensure consistency
	// and mitigate against ocassional glitches in the adjustable height API

	gadgets.window.adjustHeight();
};

////////////////////////////////////////////////////////////////////////

function shoCloseHandler()
{
	SHO = null;	
	cabReadyHandler();
};

///////////////////////// Start of Execution ///////////////////////////

init();

////////////////////////// End of Execution ////////////////////////////