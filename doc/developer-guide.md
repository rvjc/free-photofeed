# Photofeed Gadget Developer Guide

By RVJ Callanan

Originated: 2009-11-23; last updated: 2016-07-02


# Introduction

If the Photofeed gadget is used extensively on your site, there are a number
of reasons why you might want to maintain your own customised version:

* Change hard defaults, e.g. theme file path
* Leverage code base to quickly add new features or tweak existing features
* Implement localisation/language tweaks not available via the theme file
* Discard non-essential features
* Take control of the software update schedule

The good news is that this gadget is now open-sourced with a permissive MIT
license. The latest source code and tools can be downloaded from:

https://github.com/rvjc/photofeed

The root directory contains tools, scripts, docs, intermediate outputs and the
consolidated build output (photofeed.xml) for uploading to your Gadget host.

Code changes are made in the /src directory. Please do not edit intermediate
Javascript files in the root directory as these will be over-written.

The /sample directory is used for sample themes and such like.


# The Build Environment

For historical reasons, the Photofeed build system is Windows-based (Windows 7
or greater). Once a local copy of the project directory has been downloaded,
one of two build scripts can be invoked in the root directory.

Use MAKE-DEBUG.BAT for debug builds which are optimised for fast edit/test
cycles and browser-based debugging (no code compaction is performed). These
builds also respect in-code debugging aids such as assertions. Additional
debugging aids can be invoked by enabling the DEBUG property of the CON object
in /src/photofeed-common.js. Don't forget to disable this in production builds!

Use MAKE.BAT for production builds (ensuring that the DEBUG property of the
CON object has been disabled). Production builds take much longer than debug
builds because the following additional steps are performed:

* In-code debugging aids (such as assertions) are removed
* Code is scanned for dangerous constructs and potential bugs
* Code compaction is performed

The following FART.EXE warning can be ignored during production builds:

Warning: unrecognized character escape sequence: \/


# Release Checks

Before releasing a production build, check the following validation reports in
the root directory:

photofeed-common.htm
photofeed-config.htm
photofeed-home.htm

Some warnings are subjective e.g. unnecessary semi-colons. However, others may
require your attention. Pay particular attention to undeclared local variables
leaking into the global namespace. These can produce nasty bugs which are
difficult to isolate.


# Notes

The Photofeed gadget has evolved from a simple front-end to a sophisticated
image rendering and management tool during a particularly chaotic phase in the
evolution of Web technologies. This was characterised by:

- The disruptive effects of the Gadget craze
- Incessant tinkering with the Gadget, Feed and Image Proxy APIs
- Lingering Google Sites issues without satisfactory resolutions
- Ongoing cross-browser issues
- Piecemeal browser adoption of new HTML, CSS and Javascript standards
- The demise of IE under the weight of legacy bloat and incompatibilities
- The rise of leaner and meaner browsers more aligned with open standards.

The Photofeed code reflects this chaotic heritage and would have a completely
different complexion if it were written from scratch today. So, please bear
this in mind when reviewing code or making changes. If something is in there,
it is probably for a good reason whether or not this is immediately obvious
from the accompanying documentation.
