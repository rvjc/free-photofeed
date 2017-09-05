# Photofeed Gadget Issues and Workarounds

By RVJ Callanan

Originated: 2009-11-23; last updated: 2016-07-02

------------------------------------------------------------------------------

# Dynamic height adjustment failure following edit/save cycle.

This is a well-known Classic Google Sites issue which affects all gadgets that
use the Gadget API's dynamic height feature. However, it only manifests itself
in the current browser tab/window immediately after an edit/save cycle. Normal
dynamic height functionality can be restored by performing a page refresh (F5).
This problem does NOT affect normal page viewing. 

------------------------------------------------------------------------------

# Blank content after back/forward navigation in Chrome/Windows 

This generic problem with embedded IFRAME content has been reported elsewhere
in a number of guises. Ironically, for Google Sites users, it has only been
noticed in Chrome (Windows version). Other mainstream browsers such as IE,
Firefox, Safari, Opera and non-Windows versions of Chrome do not exhibit this
problem. It appears to be an IFRAME caching bug where only the LAST gadget
instance displays correctly when you navigate back or forward to a previously
viewed page. It does NOT arise on pages with single gadget instances.

Chrome should either reproduce the cached IFRAME state or reload its cached
source, but, in some cases, it does neither. The gadget frame is present and
correctly dimensioned but the content is blank. In the case of the Photofeed
gadget, even the fallback "loading" status is NOT visible. The clue lies in
the fact that the last gadget instance on the page always displays correctly.
Until this bug is fixed by Google, it can be resolved by a page refresh (F5)
which will successfully reload all gadget instances.

------------------------------------------------------------------------------
