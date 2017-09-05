# Photofeed Gadget Changes

## V1.00: 2009-09-10: RVJ Callanan

* Initial Release


## V1.01: 2009-09-15: RVJ Callanan

* Fixed Source Parameter Parsing

* Fixed Err bug which inadvertently cleared error handler

* Moved SRC construction out of common.init
  It is now the responsibility of the appropriate view code
  e.g. config view needs to update SRC object after source
  parameter is modified. Historically there was no SRC object
  

## V1.02: 2011-10-04: RVJ Callanan

* Force HTTPS for feed URLs as per Google security changes


## V1.03: 2011-11-10: RVJ Callanan

* Changes for submission to Google's public gadget directory

* Renamed module title to "RVJC Photo Feed" to avoid
  confusion with other photo feeds.

* Changed category from "Photos" to standard public category
  called "Tools".

* Added default width to module preference to satisfy Google
  prechecker even though the width is automatic and dependent
  on height.

* Changed author e-mail to make it consistent with public account
  holder.

  Note that the prechecker still complains about absence of
  thumnail image but that is not a deal breaker for publication


## V1.04: 2011-11-13: RVJ Callanan

* Fixed bug first noticed in Internet Explorer. It is so marginal
  that it was only noticed during IE page reloads. This has
  something to do with IE's internal threading model. But it
  could potentially arise in all browsers. The solution is to use
  dumb constructors which cannot trigger callback functions before
  object variable has been been initialised by the creator.
  A separate "init" or 'show' method needs to be called after the
  object has been created. The changes were made to the following
  classes: CRX, CAB, SEL, SHO


## V1.10: 2012-01-20: RVJ Callanan  

* Incremented minor version number to remove backward compatiblity
  restriction on configuation data changes. From now on, a minor
  version change will imply a breaking change to existing sites
  which can continue to use older gadget versions.

* Fixed nasty bug where caching was not automatically disabled
  in config view as intended. This was traced to a number of
  straggling instances where comparisons were made to the now
  deprecated CON.viewConfig but did not raise an error due to 
  loose type-checking in Javascript. These were updated to the
  correct CON.views.config variable.

* Took the opportunity to clean up whole caching system. This
  involved major changes. The DOC.nocache flag is now set only
  if the nocache=1 query parameter is forcibly set in the parent
  URL. The new SRC.nocache flag accounts for all caching eventualities
  including the former. In addition to disabling caching in config
  mode, it continues to disable view mode caching for a short time
  after changes have been made so that Google's caching servers have
  time to catch up. Two hours are allowed even though the nominal
  cache expiry time is one hour. To achieve this, it was necessary
  to save the modification time of the page in the gadget's config
  data. There is no other way to recover this information from within
  the gadget code. The traditional document.lastModified method does
  not work either from within the gadget frame or the parent page.
  Before this change was incorporated, renaming the URL of a cabinet
  or image file would be immediately apparent in gadget config mode
  but not so in view mode which would show a "cabinet not found" or
  "cabinet item not found" error until Google's caches were refreshed
  about an hour later.

* As part of these changes, the global ENV.debug flag is now
  "detached" from caching functionality. Up to now, caching was
  automatically enabled in debug mode. Now, any combination is
  possible. If one wants to disable caching during debug mode,
  this can be done by appending "?nocache=1" to the URL. This
  extra level of control is actually important because sometimes
  it is necessary to debug code when caching is ENABLED.

* Fixed false logic relating to the interpretation of the global
  CFG.useImageProxy parameter re: caching. Although this parameter
  is currently enabled by default and hidden from page editor, it
  is necessary to treat it logically correct. Prior to this revision,
  disabling CFG.useImageProxy automatically resulted in caching
  being permanently disabled. This is incorrect. What happens now
  is that when caching is disabled, the use of image proxying is
  disabled but not the other way round.

* Some other clean-up of cache code was performed. Google's cache
  disabling trick for data feeds has been modified to use the server
  time rather than the local browser time. At this point, disabling
  caching has been tested in all scenarios and seems to be resilient.
  Of course, caching still works in "steady-state" page serving when
  it is needed for performance and scaling.

* Cleaned up a few issues with code where global DOC, CFG and SRC
  objects are now used instead of passing these objects or properties
  of these objects to the constructors of classes such as Cab, Crx,
  Sel and Sho. The overall code is much cleaner and it is now much
  easier to keep track of the objects. The original intention was to
  have more versatility in situations where there were multiple Cab
  objects present simultaneously but that is overkill for such a
  simple gadget.


## V1.11: 2012-02-16: RVJ Callanan  

* Removed distractive prefixes in cabinet list box in config view.
  But we continue to use index prefixes for photo list box.

* Reduced minimum allowable slide height to 150px.


## V1.20: 2012-04-26: RVJ Callanan

* Renamed showFooter config parameter to photoFooter and converted
  from boolean to enum list. There are now 5 footer options:

    None:          Equivalent to old DISABLED
    enlargeMore:   Equivalent to old ENABLED (this is the default)
    enlargeOnly:   Only shows click to enlarge (not more)
    photoCaption:  Shows caption of lead photo
    cabTitle:	   Shows title of photo cabinet

* Footer is now in bold text but still the same small font. However
  the text colour tracks the photo border colour. Also removed
  link underlining from "click to enlarge" and "more" and changed
  to capitalised form, i.e. "Click to Enlarge" and "More". This is
  consistent with use of footer for photo caption and cabinet title.
  Also updated the footer text width guesstimate for bold characters.
  Footer height has been increased from 15 to 20px and the footer
  text vertical aligned to the "middle" instead of "top".

* Slide footer text is now in bold text too and its colour also
  tracks the photo border colour

* Uncaptioned photos now get a default caption of "(Uncaptioned)"
  rather than "UNTITLED" which was both misleading and ugly

* A hints button is now included in config view to suggest gadget
  width and height for a tight lateral fit.

* A number of minor html tweaks have also been made.

* Renamed a number of misleading variable names

* A "mode" configuration parameter has been added to support future
  changes without breaking compatibility with existing gadgets. It
  currently defaults to "Select Toggle" mode which is essentially
  how the other version operates.


## V1.30: 2012-05-25: RVJ Callanan

* Shadows introduced using dynamically-generated PNG patterns.
* Mat patterns introduced using dynamically-generated PNG patterns.


## V1.31: 2012-07-16: RVJ Callanan

* Color Swatch and Image Preview implemented in config view.


## V1.32: 2012-08-01: RVJ Callanan

* Perform minimum gadget height validation in home view to pre-empt
  negative photo height, especially when unusually large selection
  metrics are taken into account.


## V2.00: 2013-11-14: RVJ Callanan

* Incremented major version number to facilitate complete overhaul
  as browser installation base matures and stabilises. 

* Many new configuration parameters introduced and config menu
  re-implemented using tab system. 

* Selection and Slides can have different decoration and metrics.

* Complete overhaul of selection footer and silde-show panel 

* Themes introduced to faciliate site-wide management.


## V2.01: 2013-12-05: RVJ Callanan

* Workaround for dynamic gadget height adjustment bug in IE9+ 


## V2.10: 2014-01-05: RVJ Callanan

* Localisation capability introduced by replacing hard-coded
  english in user interface with themeable parameters using 'lang'
  prefix.


## V2.20: 2014-02-17: RVJ Callanan

* Implemented forced themes and theme defaults.


## V2.30: 2014-05-02: RVJ Callanan

* Re-implemented potentially subjective global constants as
  themeable system configuration parameters.


## V2.31: 2014-05-10: RVJ Callanan

* Added calculated fields (compact width, static height, selection
  overhead and slide overhead) to expedite manual adjustments when
  gadget placement is dimension-sensitive e.g. left or right
  aligned with text wrapping.


## V2.40: 2014-06-16: RVJ Callanan

* Introduced panel dim opacity configuration parameter 


## V2.41: 2014-06-19: RVJ Callanan

* Implemented documented gadget body background-color fix to make
  gadget transparent to Sites theme gadget content background. 


## V2.50: 2014-06-23: RVJ Callanan

* Added gadget padding and align parameters.


## V2.51: 2014-06-27: RVJ Callanan

* General tweaks and some minor bug fixes


## V2.52: 2014-07-02: RVJ Callanan

* More tweaks and bug fixes after extensive cross-browser testing


## V2.53: 2014-07-05: RVJ Callanan

* Fixed code compaction issues not present in debug version 


## V2.60: 2016-10-05: RVJ Callanan

* Configuration parameters overhauled by incorporating distinct
  flag parameters into option lists. This will facilitate backward
  compatible configuration data changes in future releases albeit
  at the expense of bigger option lists.


## V2.61: 2016-10-05: RVJ Callanan

* Replaced unicode symbols used in slide panel with better looking
  Google material fonts


## V2.62: 2017-01-23: RVJ Callanan

* Incorporated simple help modal window for slide show.


## V2.63: 2017-02-02: RVJ Callanan

* Added blur effect options to shadow and panel button styles given
  widespread browser adoption of CSS3 box-shadow feature. Legacy
  shadow pattern option retained for backward compatibility and
  nostalgic look (if desired).


## V2.64: 2017-02-02: RVJ Callanan

* Added new shape stye to faciliate rounded corners on photos given
  widespread browser adoption of CSS3 border-radius feature. Rounded
  corners also available on panel buttons. Spread options introduced
  for buttons to facilitate better dimension/spacing control.


## V2.65: 2017-02-19: RVJ Callanan

* Long-overdue review of config parameter defaults. Some metrics
  ranges have been tightened up, others expanded. Default colors
  which were previously oriented towards white background are now
  reasonably neutral vis-a-vis light or dark pages. Default slide
  metrics are scaled up version of default selection metrics to
  emphasise the fact that they can be individually controlled.


## V2.66: 2017-03-10: RVJ Callanan

* Added an XML export button to the config menu. This opens a
  popup window containing an XML representation of all themeable
  parameters in the current configuration. The exported XML is
  theme file ready and can be pasted partially or wholly into
  a theme file. This feature is speeds up design iterations
  dramatically when experimenting and updating themes.


## V2.67: 2017-04-04: RVJ Callanan

* Slide show upper text will now fall back to cabinet title if
  photo caption is not available or is untitled. In this case,
  the lower text will show status only (without title). It is
  assumed that if one photo in a given cabinet is lazily uploaded
  (no caption or caption is untitled) then they all are. If this
  is not the case then lower text will alternate between two
  states depending on availability of photo caption.


## V2.70: 2017-05-10: RVJ Callanan

* Final feature-freeze release for Classic Google Sites with some
  minor configuration data tweaks. Sample theme files included in
  release. Gadget has now matured into a reliable, feature-rich
  and highly customisable component with unparalleled site-wide
  management features befitting the general philosophy of Google
  Sites. Code released on GitHub under MIT license offering
  maximum flexibility to end users. Self-hosting is recommended
  as Google's public gadget hosting has become saturated and
  fallen into general neglect. Gadget features are now showcased
  on Classic Google Sites demo web site at http://cgs.rvjc.com.
  Depending on the progression of the new Google Sites service
  (which is still in the early stages), twin versions of this
  gadget may be supported into the future. 
