REM builds compressed production version of photofeed 
REM note that fart complains about "\// " parameter but it actually works.

copy .\src\photofeed-common.js photofeed-common-stripped.js
fart -C photofeed-common-stripped.js "ERR.CHK" "\// "
CScript build-photofeed-common.wsf

copy .\src\photofeed-config.js photofeed-config-stripped.js
fart -C photofeed-config-stripped.js "ERR.CHK" "\// "
CScript build-photofeed-config.wsf

copy .\src\photofeed-home.js photofeed-home-stripped.js
fart -C photofeed-home-stripped.js "ERR.CHK" "\// "
CScript build-photofeed-home.wsf

expand.vbs

pause