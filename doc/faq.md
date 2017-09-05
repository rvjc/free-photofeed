# Photofeed Gadget Frequently Asked Questions

By RVJ Callanan

Originated: 2009-11-23; last updated: 2016-07-02

------------------------------------------------------------------------------

# Why is the selection footer blank even though it is enabled?

This is expected behaviour when there are too many characters to fit in the
available footer space. Rather than truncating the content, it is blanked out
completely. In this case, there is usually enough space for the footer symbol
(assuming it has NOT been disabled using the NO SYMBOLS option).

Bear in mind that the footer space corresponds to the width of the selection
grid. Within any given column, the individual image heights are scaled to fit
the gadget height while maintaining fixed image widths throughout the column.
Therefore, blank footers are more likely to occur in a single-column grid
containing multiple images, especially if the images are unusually narrow. 

On the plus side, this behaviour is completely deterministic. It will be
immediately obvious after an edit/save cycle and can be fixed on the spot
if the standalone footer symbol is not deemed to be a suitable fall-back.
Short of disabling the footer altogether, the obvious solution is too nudge
up the gadget height until the footer text can be displayed. If the problem is
marginal, disabling the footer symbol may free up enough pixels to display
standalone footer text (without the symbol). Alternatively, the default footer
content can be abbreviated or summarised using the custom TEXT over-ride under
the GENERAL tab of the config menu.

Depending on the gadget configuration, the footer can display the cabinet
title, photo caption or custom text. So reasonable limits should be imposed
on the number of characters used by each of these elements. The hard limits
have to cater for exceptional situations and are usually far too generous.

------------------------------------------------------------------------------


# I can't find the latest gadget version in Google's public repository?

As of mid-2016, new submissions are no longer being accepted on the public
gadget repository. Other publishing tools such as the Google Gadget Editor and
Private Gadget Editor have also been discontinued. This is not a deal-breaker
because gadget self-hosting has been the norm for a number of years. While the
public repository is still accessible, it has become saturated with poorly
maintained gadgets and fallen into general neglect.

Self-hosting offers the key advantage that you have control of the gadget code
and your site is not vulnerable to the whims of the original publisher where
updates and version control are concerned.

The latest open-sourced version of the Photofeed gadget is available in a
dedicated GitHub code repository at:

https://github.com/rvjc/photofeed

The minified gadget file (photofeed.xml) is available in the root directory
of the code repository. This file is also hosted as a public URL on:

http://rep.rvj.com/gadgets/photofeed.xml

A self-hosted gadget can be inserted on any page using the ADD GADGET BY URL
option in the INSERT -> MORE GADGETS dialog. You are free to link to our
Public URL which is used by our demo site at http://cgs.rvjc.com and will
remain viable for the foreseeable future. However, self-hosting is always
preferred for the reasons outlined above.

------------------------------------------------------------------------------
