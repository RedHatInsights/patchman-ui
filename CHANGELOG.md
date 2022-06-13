## [1.48.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.48.1...v1.48.2) (2022-06-13)


### Bug Fixes

* **SPM-1488:** filter out selected systems without patch sets ([9cb3f2d](https://github.com/RedHatInsights/patchman-ui/commit/9cb3f2db48ba5ba9ee05c467e5d46771647e15df))

## [1.48.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.48.0...v1.48.1) (2022-06-07)


### Bug Fixes

* **SPM-1457:** enable up-to-date systems to be operated on ([e368dca](https://github.com/RedHatInsights/patchman-ui/commit/e368dca3d1d15f9b351197b3787a5c4a83bbea7e))

# [1.48.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.47.5...v1.48.0) (2022-06-06)


### Features

* **SPM-1311:** enable patch set removal on System details page ([744a37b](https://github.com/RedHatInsights/patchman-ui/commit/744a37be1b7cb93003973c301901b37f9aaa4c4a))

## [1.47.5](https://github.com/RedHatInsights/patchman-ui/compare/v1.47.4...v1.47.5) (2022-05-31)


### Bug Fixes

* **SPM-1488:** remove systems from patch sets ([110ee38](https://github.com/RedHatInsights/patchman-ui/commit/110ee38619e0ecfbcf4357524fafb8ce254bc416))

## [1.47.4](https://github.com/RedHatInsights/patchman-ui/compare/v1.47.3...v1.47.4) (2022-05-26)


### Bug Fixes

* **SPM-1487:** let users create patch sets with zero systems assigned ([2b40e07](https://github.com/RedHatInsights/patchman-ui/commit/2b40e07edfc0584c648fa5df9644ce79249312c3))

## [1.47.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.47.2...v1.47.3) (2022-05-17)


### Bug Fixes

* **SPM-1489:** rename assign action title ([85ef085](https://github.com/RedHatInsights/patchman-ui/commit/85ef085e4d507d35ed91bba33332b3e68381ef61))
* **SPM-1490, SPM-1493:** wizard titles made dynamic ([86d2212](https://github.com/RedHatInsights/patchman-ui/commit/86d2212eb161bc040e6649c62dc2e384f7863c80))

## [1.47.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.47.1...v1.47.2) (2022-05-17)


### Bug Fixes

* **SPM-1492:** system details page refreshs after patch-set change ([a19f15d](https://github.com/RedHatInsights/patchman-ui/commit/a19f15dd1183815fc4f467ba7838adb1a964ccd1))

## [1.47.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.47.0...v1.47.1) (2022-05-16)


### Bug Fixes

* **1494:** fix selected systems across steps ([e218910](https://github.com/RedHatInsights/patchman-ui/commit/e21891011306e747dc7f903f6706c51f8fbae129))
* **SPM-1458:** change patch set page title ([91fae8c](https://github.com/RedHatInsights/patchman-ui/commit/91fae8ce5b84be1302cf5c37441cb4b750e36a59))

# [1.47.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.46.0...v1.47.0) (2022-04-26)


### Bug Fixes

* **SystemDetail:** show tags and baseline info ([00a2266](https://github.com/RedHatInsights/patchman-ui/commit/00a2266aa1bbde7dac6d7124d8256db544550964))


### Features

* **ReviewSystems:** add patch-set column ([64cc3e0](https://github.com/RedHatInsights/patchman-ui/commit/64cc3e0e1c5441203e3163f524055a86645f978b))

# [1.46.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.45.1...v1.46.0) (2022-04-20)


### Features

* **SPM-1311:** assign systems to a patch-set in System details page ([68af2b3](https://github.com/RedHatInsights/patchman-ui/commit/68af2b33d10cf5ac9cc84cfb5712914e24bc781d))

## [1.45.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.45.0...v1.45.1) (2022-04-14)


### Bug Fixes

* **Systems:** SPM-1394 fetch filtered data for selection when search param exists ([5be60fb](https://github.com/RedHatInsights/patchman-ui/commit/5be60fb26cbb6c072132936f6242c1ff65784180))

# [1.45.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.44.1...v1.45.0) (2022-04-12)


### Bug Fixes

* **ConfigurationFields:** validate toDate filed with regex ([cf42568](https://github.com/RedHatInsights/patchman-ui/commit/cf42568690d38d06702a416e62447abf182c345b))


### Features

* **PatchSet:** put patch set work under feature flag ([70703c9](https://github.com/RedHatInsights/patchman-ui/commit/70703c90d6e8e062dce98da036a4aa3f0b9f184c))

## [1.44.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.44.0...v1.44.1) (2022-04-12)


### Bug Fixes

* **PatchSetTable:** make columns sortable, remove kebab menu on empty table ([f78946e](https://github.com/RedHatInsights/patchman-ui/commit/f78946e66d9fa2178b4955bf49ed0d83499fd1c8))
* **ReviewSystems:** persist system selection across page and step change ([ab19432](https://github.com/RedHatInsights/patchman-ui/commit/ab19432c5316e1662df09affdfdb8011067decf1))

# [1.44.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.43.0...v1.44.0) (2022-04-11)


### Features

* **PatchSet:** assign multiple systems, existing patch-set selection filterable, paginated ([6dded43](https://github.com/RedHatInsights/patchman-ui/commit/6dded43c05b51863a841f492500b7a15856a72f8))

# [1.43.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.42.0...v1.43.0) (2022-04-08)


### Features

* **Systems:** patch-set column added ([83d3492](https://github.com/RedHatInsights/patchman-ui/commit/83d34923f9043e20fd03ad342efa50aec0cb38cf))

# [1.42.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.41.0...v1.42.0) (2022-04-08)


### Bug Fixes

* **PatchSet:** to_date field is moved into config object ([bba02fb](https://github.com/RedHatInsights/patchman-ui/commit/bba02fb0deced1bcb4da08fbed1889abe9e26336))
* **PatchSetWizard:** fetchPatchSetsAction is called only assigning a system ([a78d7df](https://github.com/RedHatInsights/patchman-ui/commit/a78d7dfe5269e021b436c58c61b3170185870e41))


### Features

* **SPM-1380:** integrate patch set table with patch set actions ([8158aad](https://github.com/RedHatInsights/patchman-ui/commit/8158aadff5d657842949b34c2492e1896d84572e))

# [1.41.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.40.4...v1.41.0) (2022-04-01)


### Features

* **RHIF-22:** enable AAP & MSSQL fitlers ([efa5df4](https://github.com/RedHatInsights/patchman-ui/commit/efa5df4cbaf8caac2805f417f526b2d53c36617d))

## [1.40.4](https://github.com/RedHatInsights/patchman-ui/compare/v1.40.3...v1.40.4) (2022-03-18)


### Bug Fixes

* **PatchSetWizard:** separate request to update and create set ([83aa7ab](https://github.com/RedHatInsights/patchman-ui/commit/83aa7aba6e4548e78d8a069186f0cecb4017d625))

## [1.40.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.40.2...v1.40.3) (2022-03-14)


### Bug Fixes

* **Remediation:** apply new loading approach ([260119f](https://github.com/RedHatInsights/patchman-ui/commit/260119f56d62859306dc41211d3853abf44ce036))

## [1.40.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.40.1...v1.40.2) (2022-03-10)


### Bug Fixes

* **tests:** failing tests are resolved with some cleanup ([d92953d](https://github.com/RedHatInsights/patchman-ui/commit/d92953d504a6515175f6bdffd5539eebfa90167f))


### Reverts

* Revert "chore(Travis): fix errors" ([92ea7e1](https://github.com/RedHatInsights/patchman-ui/commit/92ea7e18fad8b66960809f8742b01711a18f26c6))

## [1.40.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.40.0...v1.40.1) (2022-03-08)


### Bug Fixes

* **InventoryDetail:** Changed Alert to inline ([05d9389](https://github.com/RedHatInsights/patchman-ui/commit/05d938997c4a5d50436e6ebd5526fe7ac39e8a4d))
* **SPM-1381:** Pagination dropdown disabled when table empty ([#740](https://github.com/RedHatInsights/patchman-ui/issues/740)) ([2d126f7](https://github.com/RedHatInsights/patchman-ui/commit/2d126f7559d616ffc4a64fae82dea9908731ffa4))

# [1.40.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.39.0...v1.40.0) (2022-03-01)


### Bug Fixes

* **AdvisoriesStatusReport:** SPM-1358 fixed responsiblity ([aa5aca9](https://github.com/RedHatInsights/patchman-ui/commit/aa5aca94247af313c18fdd96ff365088423a557a))
* **SystemsStatusReport:** SPM-1358 fixed responsibility ([774f57d](https://github.com/RedHatInsights/patchman-ui/commit/774f57d26dede8e66d72502de5ffb5343ae09227))
* **Travis:** update node version ([c70c540](https://github.com/RedHatInsights/patchman-ui/commit/c70c540080667b1e6211b53fcb277580285742b9))


### Features

* **SPM-1305:** create patch set table ([b0a411d](https://github.com/RedHatInsights/patchman-ui/commit/b0a411d5fa91ef5cbc15106ed0f213536f7e172c))

# [1.39.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.38.3...v1.39.0) (2022-02-22)


### Features

* **SPM-1306:** create patch set wizard ([a24ccfb](https://github.com/RedHatInsights/patchman-ui/commit/a24ccfb9f1dd7c329fe75bd1c74ea467505283fd))
* **SPM-1308:** assign system to a patch set ([66498d7](https://github.com/RedHatInsights/patchman-ui/commit/66498d70526b112528fa8b435735ee617d8be40d))

## [1.38.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.38.2...v1.38.3) (2022-01-06)


### Bug Fixes

* **CVE:** SPM-1247 fix CVE-2021-3918 ([cc889f4](https://github.com/RedHatInsights/patchman-ui/commit/cc889f451a1984ebe2e0fcb403edfde436c0f833))

## [1.38.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.38.1...v1.38.2) (2021-12-08)


### Bug Fixes

* **modules:** unique module names introduced, should fix caching issues ([3219c16](https://github.com/RedHatInsights/patchman-ui/commit/3219c169090f9a56051a4ecc62c8e4818e7f627e))

## [1.38.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.38.0...v1.38.1) (2021-12-02)


### Bug Fixes

* **Last Seen:** fix invalid date in last seen column ([46a28c8](https://github.com/RedHatInsights/patchman-ui/commit/46a28c8a95c0be86fcf229f9e32fe87a93d6dd3c))

# [1.38.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.37.1...v1.38.0) (2021-11-29)


### Features

* **PackageSystems:** SPM-1178 add tag filter and column ([aa0c1a1](https://github.com/RedHatInsights/patchman-ui/commit/aa0c1a126539dece1bf72d2589ad0011da5f6e20))
* **Tags:** SPM-1178 add tags column, tag filter ([3653e2b](https://github.com/RedHatInsights/patchman-ui/commit/3653e2bcfec6a8b10766053b1964eb92ab950fbf))

## [1.37.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.37.0...v1.37.1) (2021-11-12)


### Bug Fixes

* **deps:** fix deps for running proxy ([95cf509](https://github.com/RedHatInsights/patchman-ui/commit/95cf5095507dcee8bc91c7ef0b26fbcc29c89449))

# [1.37.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.36.0...v1.37.0) (2021-11-08)


### Features

* **Reboot:** SPM-1228 add reboot req into system detail ([d3fe3d9](https://github.com/RedHatInsights/patchman-ui/commit/d3fe3d9b438f426d21696f59574e451082a13435))

# [1.36.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.35.1...v1.36.0) (2021-11-01)


### Features

* **AdvisoryType:** SPM-1197 add advisory type name ([0c4f0a2](https://github.com/RedHatInsights/patchman-ui/commit/0c4f0a20cbb590713891778ff80d125e240dd6a0))

## [1.35.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.35.0...v1.35.1) (2021-10-20)


### Bug Fixes

* **PackageHeader:** SPM-1210 fix title bottom space ([91122f0](https://github.com/RedHatInsights/patchman-ui/commit/91122f0120ee46ef5fce539a3847713d353a8486))

# [1.35.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.34.3...v1.35.0) (2021-10-14)


### Features

* **OSfilter:** SPM-1193 add os filter ([cbcbfc2](https://github.com/RedHatInsights/patchman-ui/commit/cbcbfc2658b3ca40e9427d9b4347e316f61c184e))

## [1.34.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.34.2...v1.34.3) (2021-10-13)


### Bug Fixes

* **advisory_type:** SPM-1199 fix advisory type in frontend ([38edb0a](https://github.com/RedHatInsights/patchman-ui/commit/38edb0a6e18db24dea1d45811f13355955ff149c))
* **sorting:** fix use advisory_type_name for sorting ([b60b1f0](https://github.com/RedHatInsights/patchman-ui/commit/b60b1f0a8281d73a585322772e6ce32d39b2900c))

## [1.34.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.34.1...v1.34.2) (2021-10-07)


### Bug Fixes

* **env:** fix environment setup ([743d7b2](https://github.com/RedHatInsights/patchman-ui/commit/743d7b2e44f35d27c1b2f2046c18a6890244aaad))

## [1.34.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.34.0...v1.34.1) (2021-09-30)


### Bug Fixes

* **headers:** SPM-1189 headers are ignored for export endpoints ([4c42676](https://github.com/RedHatInsights/patchman-ui/commit/4c426766561db6b0d23c7d37c616e559544d0fd8))

# [1.34.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.33.0...v1.34.0) (2021-09-29)


### Features

* **Reboot info:** SPM-1053 reboot required info is added ([a2e3e37](https://github.com/RedHatInsights/patchman-ui/commit/a2e3e3720ca314cd18b1cd3e49107b817c93dd61))

# [1.33.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.32.0...v1.33.0) (2021-09-24)


### Features

* **AdvisoriesReport:** SPM-1167 add most impactfull advisory info ([54742ed](https://github.com/RedHatInsights/patchman-ui/commit/54742ed0117eb484d20cf5d44e48bf58d9d72dbc))

# [1.32.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.31.2...v1.32.0) (2021-08-26)


### Features

* **Other type:** SPM-1133 "Other" type is added ([cbe2e9f](https://github.com/RedHatInsights/patchman-ui/commit/cbe2e9fcc181a5648a6c06838f07bd3a95bbd84d))

## [1.31.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.31.1...v1.31.2) (2021-08-25)


### Bug Fixes

* **SystemtatusBar:** regressions are resolved ([6d234a6](https://github.com/RedHatInsights/patchman-ui/commit/6d234a6ec152da428d85749d481a2f6da387ae47))

## [1.31.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.31.0...v1.31.1) (2021-08-24)


### Bug Fixes

* **Systems:** SPM-1120 OS column is placed correctly ([b9d9633](https://github.com/RedHatInsights/patchman-ui/commit/b9d963341ee0ede3c0744d6d5a78be46c8cabe79))

# [1.31.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.30.3...v1.31.0) (2021-08-24)


### Features

* **StatusReport:** SPM-1043 create System status report ([2ccee18](https://github.com/RedHatInsights/patchman-ui/commit/2ccee185721d4d06c8e6ee8ae273915724440fff))

## [1.30.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.30.2...v1.30.3) (2021-08-19)


### Bug Fixes

* **Filter Chips:** SPM-1095 make search filter chip text consistent with search filter title ([84ef6a2](https://github.com/RedHatInsights/patchman-ui/commit/84ef6a21acbedee33b2a48167fc4d5a9bab5febb))

## [1.30.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.30.1...v1.30.2) (2021-08-19)


### Bug Fixes

* **Advisories:** SPM-1100 make advisory description font consistent ([159ec14](https://github.com/RedHatInsights/patchman-ui/commit/159ec1453a2f74f9cae0075409fed9fe1581c0c3))
* **advisory:** SPM-1080 Don't show link on Advisories for EPEL ([9c65de1](https://github.com/RedHatInsights/patchman-ui/commit/9c65de172cc54cfd2bc368ef93532e609796efb8))
* **FilterChips:** SPM-1097 remove filter chip group ([93c101f](https://github.com/RedHatInsights/patchman-ui/commit/93c101f0fd9c6abc855ff87c8bd00649ab5b3000))
* **spacing:** SPM-1113 Fix inconsistent spacing on toolbars/tables ([e9162fe](https://github.com/RedHatInsights/patchman-ui/commit/e9162fee1e1fd7cac31e55b7853809049195b7bc))
* **VersionFilter:** SPM-1098 reword to Filter by version ([1bcceeb](https://github.com/RedHatInsights/patchman-ui/commit/1bcceeb5c371860aa25af6b75f856062b2d93d79))

## [1.30.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.30.0...v1.30.1) (2021-08-17)


### Bug Fixes

* **remediation:** SPM-1114 Fix remediation of package-systems ([71c90f5](https://github.com/RedHatInsights/patchman-ui/commit/71c90f562a5d1f5ce83bd52ed57484d1f4f7f7c4))

# [1.30.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.29.0...v1.30.0) (2021-08-16)


### Features

* **NoAccess:** SPM-968 use shared not-connected component ([e4c9186](https://github.com/RedHatInsights/patchman-ui/commit/e4c9186825844db5554574285ea4937cf06d6c69))

# [1.29.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.28.5...v1.29.0) (2021-08-12)


### Bug Fixes

* **Notifications:** do not fire multiple notifications ([6e2d87c](https://github.com/RedHatInsights/patchman-ui/commit/6e2d87cca8ebef2f41ccca8ab240d1320e08fad4))


### Features

* **remediation:** SPM-1050 redesign remediation button ([20bc20c](https://github.com/RedHatInsights/patchman-ui/commit/20bc20ca524a158e54f43003e5b721993ab58314))

## [1.28.5](https://github.com/RedHatInsights/patchman-ui/compare/v1.28.4...v1.28.5) (2021-08-10)


### Bug Fixes

* **advisoryDetail:** SPM-1080 don't show link to errata pages for non-RH content ([d3427d6](https://github.com/RedHatInsights/patchman-ui/commit/d3427d6f7bbeccf0f67830e2b04a54077105cc21))

## [1.28.4](https://github.com/RedHatInsights/patchman-ui/compare/v1.28.3...v1.28.4) (2021-08-05)


### Bug Fixes

* **PackageSystems:** SPM-1072 missing export button is added ([a4daa83](https://github.com/RedHatInsights/patchman-ui/commit/a4daa8312ffd70216bdbc82ba4c0826279e7ec1a))
* **Reducers:** SPM-1073 clear details page reducers ([ddd321e](https://github.com/RedHatInsights/patchman-ui/commit/ddd321e8632ded47641e54e182b69d958598588c))

## [1.28.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.28.2...v1.28.3) (2021-08-05)


### Bug Fixes

* **revert:** System details do not clear parameters on umount ([0ce8087](https://github.com/RedHatInsights/patchman-ui/commit/0ce8087c191fc1a65f49b32e22faa47322d1970c))

## [1.28.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.28.1...v1.28.2) (2021-08-05)


### Bug Fixes

* **VersionFilter:** make sure installed_evra type is handled correctly ([9af8966](https://github.com/RedHatInsights/patchman-ui/commit/9af8966159e1ee14c50f60bc4903e541146222d4))

## [1.28.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.28.0...v1.28.1) (2021-08-02)


### Bug Fixes

* **Clear Filters:** SPM-1020 redundant API call is removed ([3fdd793](https://github.com/RedHatInsights/patchman-ui/commit/3fdd7934cdbc7d93ecff6f64af165034098e6a95))

# [1.28.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.27.2...v1.28.0) (2021-08-02)


### Features

* **webpack:** SPM-1062 Switch to webpack proxy and enable auto reload ([428b052](https://github.com/RedHatInsights/patchman-ui/commit/428b052759e90857d7c900b07f66d7b99462d13e))

## [1.27.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.27.1...v1.27.2) (2021-07-29)


### Bug Fixes

* **Inventory:** problems after rebase are solved ([f03bab8](https://github.com/RedHatInsights/patchman-ui/commit/f03bab8f271c754702687a2afdf383cec3e9dda3))

## [1.27.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.27.0...v1.27.1) (2021-07-28)


### Bug Fixes

* **GlobalFilter:** SPM-1041 tags applied on load ([82c8e0c](https://github.com/RedHatInsights/patchman-ui/commit/82c8e0c0177527fde78c8ba63c3f677f928f8629))
* **Packages:** SPM-1040 remove status filter with X button ([b9b49af](https://github.com/RedHatInsights/patchman-ui/commit/b9b49af3d79e54d6bd13e2b5fef17a545e70fe86))

# [1.27.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.26.2...v1.27.0) (2021-07-27)


### Features

* **NoAccess:** SPM-968 use shared not-connected component ([61fbea8](https://github.com/RedHatInsights/patchman-ui/commit/61fbea85022bb3c80cbb20f707c9a8c488e10555))
* **StatusFilter:** SPM-1004 change to checkbox ([8d13cfd](https://github.com/RedHatInsights/patchman-ui/commit/8d13cfd2d6535aa204d127f5a3173c246a7fe527))

## [1.26.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.26.1...v1.26.2) (2021-07-23)


### Bug Fixes

* **select:** Don't ignore query params in bulk select ([d6ce685](https://github.com/RedHatInsights/patchman-ui/commit/d6ce685338ea2f5156c0884e4aae4403c1efa074))

## [1.26.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.26.0...v1.26.1) (2021-07-22)


### Bug Fixes

* **PackageSystems:** updatable key is added into reducer ([56987ad](https://github.com/RedHatInsights/patchman-ui/commit/56987ad5cdd90bd5cdca15f9710bfb954c81dfa9))

# [1.26.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.25.0...v1.26.0) (2021-07-22)


### Bug Fixes

* **select:** Disable checkbox on up-to-date systems ([1325ec7](https://github.com/RedHatInsights/patchman-ui/commit/1325ec76ba43a5f5c06c037a4c71113887d22ada))
* **select:** fix unselection of items on package-systems ([fafcbc4](https://github.com/RedHatInsights/patchman-ui/commit/fafcbc4c3f8d810da2383bf015472f8b67fe4dbf))


### Features

* **PackageDetail:** SPM-961 enable remediation ([e8cd664](https://github.com/RedHatInsights/patchman-ui/commit/e8cd664ab3c2c957100f35c4bc7f848f16291b94))
* **remediation:** Add provider for system-package remediation ([2e52da1](https://github.com/RedHatInsights/patchman-ui/commit/2e52da10b795dfc60479f553b47e6511292b0614))

# [1.25.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.24.2...v1.25.0) (2021-07-19)


### Features

* **Version filter:** SPM-914 version filter is finished ([d625681](https://github.com/RedHatInsights/patchman-ui/commit/d625681d0577413b6665bd5091642acef7603089))

## [1.24.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.24.1...v1.24.2) (2021-07-19)


### Bug Fixes

* **Inventory:** SPM-1019 unwanted hosts are removed ([d2b9c95](https://github.com/RedHatInsights/patchman-ui/commit/d2b9c9582cd56f49bdff7a8a0a10fd2a759e0910))

## [1.24.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.24.0...v1.24.1) (2021-07-07)


### Bug Fixes

* **PackageDetail:** SPM-1015 hot fix for status filter ([327c13e](https://github.com/RedHatInsights/patchman-ui/commit/327c13e016955a460c6cc2042a240a8aaa7843e5))

# [1.24.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.23.0...v1.24.0) (2021-07-01)


### Features

* **PackageSystems:** SPM-960 enable checkbox ([cc9b30c](https://github.com/RedHatInsights/patchman-ui/commit/cc9b30c15a2cfabb1009320d287ab347491a724e))

# [1.23.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.22.0...v1.23.0) (2021-06-30)


### Features

* **Inventory:** SPM-998 persist parameters ([5db3539](https://github.com/RedHatInsights/patchman-ui/commit/5db3539813615fbcd285603e980cfc63a542cc5b))

# [1.22.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.21.2...v1.22.0) (2021-06-29)


### Features

* **PackageSystems:** use getEntities ([531e052](https://github.com/RedHatInsights/patchman-ui/commit/531e05290bb2ce4e8e9d9e9d800f875f4f30ad80))

## [1.21.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.21.1...v1.21.2) (2021-06-28)


### Bug Fixes

* **Export button:** fix misalignment ([7a1cc01](https://github.com/RedHatInsights/patchman-ui/commit/7a1cc01323e4cedcf5fb73f67e8e1969a148330b))

## [1.21.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.21.0...v1.21.1) (2021-06-24)


### Bug Fixes

* **Headers:** isLoading is set correctly ([50355b4](https://github.com/RedHatInsights/patchman-ui/commit/50355b44e0d4bc6be5f91a6e892300acc92f1c1b))

# [1.21.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.20.4...v1.21.0) (2021-06-22)


### Bug Fixes

* **Global Filter:** SPM-969 global filters fixed on inventory ([d86f53a](https://github.com/RedHatInsights/patchman-ui/commit/d86f53a000fb0e3c237568aaae91a414d8cb34ec))


### Features

* **export:** SPM-916 enable export on detail pages ([25f158f](https://github.com/RedHatInsights/patchman-ui/commit/25f158f1a331795deeaaffdaadca7543c2125202))
* **notification:** Refactor exports and add notifications ([671ac38](https://github.com/RedHatInsights/patchman-ui/commit/671ac3812463fa26ad99c8cba370a8fdf34de8a6))

## [1.20.4](https://github.com/RedHatInsights/patchman-ui/compare/v1.20.3...v1.20.4) (2021-06-15)


### Bug Fixes

* **systems:** SPM-957 Fix setting per-page for getEntities ([7fdfe73](https://github.com/RedHatInsights/patchman-ui/commit/7fdfe731dd7cb4bc4ae84d950a4dd522fc9a2f4c))

## [1.20.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.20.2...v1.20.3) (2021-06-15)


### Bug Fixes

* **Inventory:** SPM:971 sort value needs correct initialization ([9fac81e](https://github.com/RedHatInsights/patchman-ui/commit/9fac81e811cea58668edc2dbb5dddb5b5cec70ad))

## [1.20.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.20.1...v1.20.2) (2021-06-09)


### Bug Fixes

* **OS:** SPM-925 column sorting is fixed ([b7a4d31](https://github.com/RedHatInsights/patchman-ui/commit/b7a4d310dd8cdd403a26162c32c08794afa61f0a))

## [1.20.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.20.0...v1.20.1) (2021-06-02)


### Bug Fixes

* **Inventory:** fix clear filters issue after custom inventory fetch ([7f11aaf](https://github.com/RedHatInsights/patchman-ui/commit/7f11aaf89e73d389cb8018ac9178b84ac0419d90))

# [1.20.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.19.3...v1.20.0) (2021-06-01)


### Features

* **InventoryComp:** SPM-754 use custom getEntities ([30701d4](https://github.com/RedHatInsights/patchman-ui/commit/30701d4411db3c1ef74ce68f12df88515a5210bc))

## [1.19.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.19.2...v1.19.3) (2021-05-24)


### Bug Fixes

* **SelectedRows:** fixlter out previously deselected rows ([8cacf58](https://github.com/RedHatInsights/patchman-ui/commit/8cacf5874c6d04ef689ffeb5d043a82e85933c9e))

## [1.19.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.19.1...v1.19.2) (2021-05-20)


### Bug Fixes

* **os_version:** Os version sorting is disabled ([93ec810](https://github.com/RedHatInsights/patchman-ui/commit/93ec810f5b9f8e34bb073d6baf0663dd35a9db91))

## [1.19.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.19.0...v1.19.1) (2021-05-20)


### Bug Fixes

* **Advisories:** blank page is fixed temporarly ([75e2e3d](https://github.com/RedHatInsights/patchman-ui/commit/75e2e3dbeccb5e373292130eb54e88a3f479e33a))

# [1.19.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.18.0...v1.19.0) (2021-05-12)


### Bug Fixes

* **Systems:** disabled systems are not selected on page select ([da29c67](https://github.com/RedHatInsights/patchman-ui/commit/da29c671adb428ab30d9a35c26b847cec7a84c49))


### Features

* **system detail:** use federated modules to share system detail ([7bc9d2d](https://github.com/RedHatInsights/patchman-ui/commit/7bc9d2d65e931f877be49704ceb9c20cc65d76c1))

# [1.19.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.18.0...v1.19.0) (2021-05-11)


### Features

* **system detail:** use federated modules to share system detail ([7bc9d2d](https://github.com/RedHatInsights/patchman-ui/commit/7bc9d2d65e931f877be49704ceb9c20cc65d76c1))

## [1.18.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.18.1...v1.18.2) (2021-05-07)


### Bug Fixes

* **SystemPackages:** Emptystate was incorrect set ([dd13f05](https://github.com/RedHatInsights/patchman-ui/commit/dd13f0569a2480674625d0bb5525756b8b5d7d38))

## [1.18.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.18.0...v1.18.1) (2021-05-06)


### Bug Fixes

* **UserStatuses:** use different approach to check user account status ([44618d4](https://github.com/RedHatInsights/patchman-ui/commit/44618d4987879edd7e9707836e1c6c227fc1af34))

# [1.18.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.17.12...v1.18.0) (2021-05-06)


### Features

* **Systems:** disable selecting on systems with 0 installed, updatable packages and advisories ([ed89173](https://github.com/RedHatInsights/patchman-ui/commit/ed89173522c6ea3bd3e8f876a78f7c7fe5bc2a11))

## [1.17.12](https://github.com/RedHatInsights/patchman-ui/compare/v1.17.11...v1.17.12) (2021-05-05)


### Bug Fixes

* **localStorage:** SPM-879 use latest store in localStorage ([69f0755](https://github.com/RedHatInsights/patchman-ui/commit/69f0755706141a49e71d1034c274cf2b96c200c3))

## [1.17.11](https://github.com/RedHatInsights/patchman-ui/compare/v1.17.10...v1.17.11) (2021-04-22)


### Bug Fixes

* **select:** SPM-876 Select only visible advisories ([60c8db5](https://github.com/RedHatInsights/patchman-ui/commit/60c8db55269016a92546d4a481b607fcba13fd97))

## [1.17.10](https://github.com/RedHatInsights/patchman-ui/compare/v1.17.9...v1.17.10) (2021-04-22)


### Bug Fixes

* **cves:** Fix link to Vulnerability to respect beta route ([8f7422d](https://github.com/RedHatInsights/patchman-ui/commit/8f7422d1b97a1cabc33ef54987b38d470738c4c9))

## [1.17.9](https://github.com/RedHatInsights/patchman-ui/compare/v1.17.8...v1.17.9) (2021-04-21)


### Bug Fixes

* **bulk select:** always select all when checkbox is not checked ([7e57002](https://github.com/RedHatInsights/patchman-ui/commit/7e5700276bfc45cae946c741226b5f684141c799))

## [1.17.8](https://github.com/RedHatInsights/patchman-ui/compare/v1.17.7...v1.17.8) (2021-04-20)


### Bug Fixes

* **Advisories:** SPM-837 make type column one line ([ab2bde7](https://github.com/RedHatInsights/patchman-ui/commit/ab2bde7b1d33dd6e042456e479a5a6d94b7ba24e))

## [1.17.7](https://github.com/RedHatInsights/patchman-ui/compare/v1.17.6...v1.17.7) (2021-04-20)


### Bug Fixes

* **remediation:** SPM-863 make remediation button smaller ([a911c55](https://github.com/RedHatInsights/patchman-ui/commit/a911c5567c3fb7adcaa19ae382980620e4081777))

## [1.17.5](https://github.com/RedHatInsights/patchman-ui/compare/v1.17.4...v1.17.5) (2021-04-19)


### Bug Fixes

* **Export button:** reorder the button ([25ec293](https://github.com/RedHatInsights/patchman-ui/commit/25ec29385f73ed07adce7a7fd1e1004822426c31))
* **Filters:** make filter placeholders lower case ([4ffac53](https://github.com/RedHatInsights/patchman-ui/commit/4ffac5383dacbf6798385425f3df16f247f5cd90))

## [1.17.4](https://github.com/RedHatInsights/patchman-ui/compare/v1.17.3...v1.17.4) (2021-04-15)


### Bug Fixes

* **bulk select:** make bulk select consistence across tables ([5ad17b6](https://github.com/RedHatInsights/patchman-ui/commit/5ad17b62d56378cd2531feb9c57f46e254ab189e))
* **EmmptyTables:** SPM-851 disable sorting and export on empty tables ([9c6e5f3](https://github.com/RedHatInsights/patchman-ui/commit/9c6e5f380fc4491184c6b24501e27b380a0d5336))

## [1.17.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.17.2...v1.17.3) (2021-04-14)


### Bug Fixes

* **remediation:** SPM-847 fix double mounted remediation modal ([08bd67b](https://github.com/RedHatInsights/patchman-ui/commit/08bd67bea4a263ea00d95887f670e3530721a0d1))

## [1.17.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.17.1...v1.17.2) (2021-04-13)


### Bug Fixes

* **Advisories:** SPM-844 wqremove unwanted checkbox ([8ed9317](https://github.com/RedHatInsights/patchman-ui/commit/8ed9317a0b95a5a3282e7fef25f31be56137ccfe))

## [1.17.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.17.0...v1.17.1) (2021-04-13)


### Bug Fixes

* **Clear filters:** onDelete function error fixed ([0d5b0e3](https://github.com/RedHatInsights/patchman-ui/commit/0d5b0e379cff9bd60e0f45ddfc42ec998c003a2e))

# [1.17.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.16.2...v1.17.0) (2021-04-09)


### Features

* **Filters:** reset filters introduced ([5c92da4](https://github.com/RedHatInsights/patchman-ui/commit/5c92da45a24f43fcd10c79da42b77e9b4a8f1be3))

## [1.16.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.16.1...v1.16.2) (2021-04-08)


### Bug Fixes

* **Packages:** rename packages column ([622c78f](https://github.com/RedHatInsights/patchman-ui/commit/622c78fabfd8053e5a4822a7391ed1ab220ceabf))

## [1.16.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.16.0...v1.16.1) (2021-04-07)


### Bug Fixes

* **env:** remove html-webpack-plugin and rebuild ([7e14d90](https://github.com/RedHatInsights/patchman-ui/commit/7e14d90dd12a9b66eb440421f402b20dc8adb19a))

# [1.16.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.15.0...v1.16.0) (2021-04-06)


### Features

* **TableHeaders:** enable sticky headers ([51d8acd](https://github.com/RedHatInsights/patchman-ui/commit/51d8acd554d0a5dee637f6d16dd0c0779db1cf35))

# [1.15.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.14.3...v1.15.0) (2021-04-06)


### Features

* **git commits:** SPM-769 use commitizer plugin to enable conventional commit names ([27bb715](https://github.com/RedHatInsights/patchman-ui/commit/27bb71540cd6084c23d7e2fa4e3adfde98fdf242))

## [1.14.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.14.2...v1.14.3) (2021-04-06)


### Bug Fixes

* **CveModal:** fix url to Vulnerability app ([947df70](https://github.com/RedHatInsights/patchman-ui/commit/947df7077ef0eff34d6b11b64894791ff440755f))

## [1.14.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.14.1...v1.14.2) (2021-04-01)


### Bug Fixes

* **Systems:** SPM-825 sorting systems table fixed ([7c97e5f](https://github.com/RedHatInsights/patchman-ui/commit/7c97e5ffe743cc56e18909e8e8a459de017b013b))

## [1.14.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.14.0...v1.14.1) (2021-03-26)


### Bug Fixes

* **OSLock:** add undefined case ([4ba677c](https://github.com/RedHatInsights/patchman-ui/commit/4ba677c8fcc90d67a60f5d4c37d4e6a76c0dc2e3))

# [1.14.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.13.2...v1.14.0) (2021-03-25)


### Bug Fixes

* **remediation:** add missing file ([8987a7b](https://github.com/RedHatInsights/patchman-ui/commit/8987a7b21daf8ea367a3769aecab022c459a1aff))
* **remediation:** create a separate component for remediation button ([513f7b6](https://github.com/RedHatInsights/patchman-ui/commit/513f7b6ed8a4dfffde25865dea548c8146235e78))


### Features

* **advisories:** Add checkboxes on advisory list page ([901082e](https://github.com/RedHatInsights/patchman-ui/commit/901082e1b321e54805644bc8ea2ad4325362753b))
* **remediation:** add remediation loading state to systems ([f44903b](https://github.com/RedHatInsights/patchman-ui/commit/f44903ba63222079f97bb1742899d3ede565e807))
* **remediation:** enable bulk remediations for advisory page ([075414d](https://github.com/RedHatInsights/patchman-ui/commit/075414dc3856997206462cf0f5ebb1711fca3996))
* **remediation:** introduce remediation on system list page ([8e6f557](https://github.com/RedHatInsights/patchman-ui/commit/8e6f557239dfa8aa2f3867dae2a7f59e856c29e8))
* **remediation:** Show animation when remediation is loading ([3f377c5](https://github.com/RedHatInsights/patchman-ui/commit/3f377c54e5047e402cd4d7e96fa81e1af19dc406))

## [1.13.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.13.1...v1.13.2) (2021-03-19)


### Bug Fixes

* **SonarCube:** issues are resolved ([68df8ff](https://github.com/RedHatInsights/patchman-ui/commit/68df8fff3fc4403e59706d4e7c7eb05197efba97))

## [1.13.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.13.0...v1.13.1) (2021-03-17)


### Bug Fixes

* **OSLock:** change rhsm_version object key name to rhsm ([fc1163e](https://github.com/RedHatInsights/patchman-ui/commit/fc1163e8b76a3807198b1becbfe26a8298e779dc))

# [1.13.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.12.1...v1.13.0) (2021-03-12)


### Features

* **Systems:** display OS version lock info ([ad93614](https://github.com/RedHatInsights/patchman-ui/commit/ad93614cdd02c2367cf1c35810a6e80cf4831102))

## [1.12.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.12.0...v1.12.1) (2021-03-11)


### Bug Fixes

* **SearchFilter:** wordings are made consistent with platform ([52b97c6](https://github.com/RedHatInsights/patchman-ui/commit/52b97c6228848ae57849384970be5f5841d7cf70))

# [1.12.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.11.3...v1.12.0) (2021-03-05)


### Features

* **SystemDetail:** add third party info ([f42978c](https://github.com/RedHatInsights/patchman-ui/commit/f42978c9c68ad0ff51a38dee2ada0eb4dbabef37))

## [1.11.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.11.2...v1.11.3) (2021-02-25)


### Bug Fixes

* **select:** after filering ([12ccc83](https://github.com/RedHatInsights/patchman-ui/commit/12ccc8396a8cd6fc586d88acc2afafe6a7d2db56))

## [1.11.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.11.1...v1.11.2) (2021-02-25)


### Bug Fixes

* **CVEs:** inconsistencies in cves info modal ([ff150b6](https://github.com/RedHatInsights/patchman-ui/commit/ff150b6873b29d1a40c8e357ede8fd24d8ea317f))

## [1.11.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.11.0...v1.11.1) (2021-02-19)


### Bug Fixes

* **bulkSelect): Revert "fix(bulkSelect:** page selecting after selecting all items" ([88210b2](https://github.com/RedHatInsights/patchman-ui/commit/88210b2369f98197044a1a337123562030a69ab8))

# [1.11.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.10.0...v1.11.0) (2021-02-19)


### Features

* **Packages:** change remediation identifier to patch-package ([b9d031f](https://github.com/RedHatInsights/patchman-ui/commit/b9d031ff6bd7be0ea33228f27e0e7755bea101e6))

# [1.10.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.9.1...v1.10.0) (2021-02-11)


### Bug Fixes

* **bulkSelect:** page selecting after selecting all items ([0e34ae9](https://github.com/RedHatInsights/patchman-ui/commit/0e34ae98adbee490885501ef21120a6cd0b127d8))


### Features

* **Advisories:** display cve info ([ab5d6de](https://github.com/RedHatInsights/patchman-ui/commit/ab5d6decb7be805b00af74b7625da7bc53eb1377))

## [1.9.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.9.0...v1.9.1) (2021-02-02)


### Bug Fixes

* **styles:** fix font-size of inventory tables ([abb41d8](https://github.com/RedHatInsights/patchman-ui/commit/abb41d83512245674d3ea960cfdc1d81f6d25bec))

# [1.9.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.8.4...v1.9.0) (2021-02-01)


### Bug Fixes

* **OS:** display No data if column is empty ([1de867c](https://github.com/RedHatInsights/patchman-ui/commit/1de867c461ff268386b4df3457a775bbeccf97d7))
* **sort:** Make sorting of multiple values work out of the box ([d80f3a5](https://github.com/RedHatInsights/patchman-ui/commit/d80f3a5b0f0764de87205870ed181966e55192fd))


### Features

* **OS:** Add OS column to systems pages ([277182a](https://github.com/RedHatInsights/patchman-ui/commit/277182a93e5cf07cfbb1e6537c94490b607ffcf4))

## [1.8.4](https://github.com/RedHatInsights/patchman-ui/compare/v1.8.3...v1.8.4) (2021-02-01)


### Bug Fixes

* **SystemDetail:** non-existing entity causes UI stuck ([76ba416](https://github.com/RedHatInsights/patchman-ui/commit/76ba416758da2f584892dce448ce146ee768d127))

## [1.8.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.8.2...v1.8.3) (2021-01-29)


### Bug Fixes

* **notifications:** Display notification when remediation is created ([6bb452b](https://github.com/RedHatInsights/patchman-ui/commit/6bb452b6dfe193129af497c447a09f14c3a4508e))

## [1.8.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.8.1...v1.8.2) (2021-01-28)


### Bug Fixes

* **packages:** ID should be unique for packages ([fba33e5](https://github.com/RedHatInsights/patchman-ui/commit/fba33e5e45ba008ec54dce704f08526bf8be6b3b))
* **select:** fix selection of packages with duplicate names ([4827cd0](https://github.com/RedHatInsights/patchman-ui/commit/4827cd0620cc29b1cbe3cc249aca74fb6c85c90c))

## [1.8.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.8.0...v1.8.1) (2021-01-25)


### Bug Fixes

* **imports:** update imports for TableVariant ([b453196](https://github.com/RedHatInsights/patchman-ui/commit/b453196700fd49f1eaae576abad803a9fabe3bfc))

# [1.8.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.7.0...v1.8.0) (2021-01-25)


### Features

* **tables:** use compact tables for consistency ([3515879](https://github.com/RedHatInsights/patchman-ui/commit/3515879bc6bc5f198726d06bfe4624339a3a5ee3))

# [1.7.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.6.0...v1.7.0) (2021-01-15)


### Features

* **GenericError:** use frontend components generic error component ([793aa4a](https://github.com/RedHatInsights/patchman-ui/commit/793aa4a69160ddb19cc6a5197a43b29deea90756))

# [1.6.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.5.1...v1.6.0) (2021-01-15)


### Features

* **Packages:**  sort by updatable packages by default ([27579d1](https://github.com/RedHatInsights/patchman-ui/commit/27579d17bd7e22679f87466ac1fda8add345ca05))

## [1.5.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.5.0...v1.5.1) (2021-01-13)


### Bug Fixes

* **store:** remove getState from reducer ([c2f03fa](https://github.com/RedHatInsights/patchman-ui/commit/c2f03facb181dc8e77f352169100a892659c0f9a))

# [1.5.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.4.0...v1.5.0) (2021-01-11)


### Features

* **internationalization:** translate presentational components ([46f1b45](https://github.com/RedHatInsights/patchman-ui/commit/46f1b45e9db943a64d9546cc36d3215a2436fa90))

# [1.4.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.3.2...v1.4.0) (2021-01-08)


### Features

* **Packages:** add export feature ([086338b](https://github.com/RedHatInsights/patchman-ui/commit/086338be8f6dbe515099e11b8b5f5e9687982907))

## [1.3.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.3.1...v1.3.2) (2021-01-07)


### Bug Fixes

* **breadcrumb:** Fix breadcrumb for consistency ([2f055b3](https://github.com/RedHatInsights/patchman-ui/commit/2f055b33632ec7cc86efc5033cca903fa500387a))

## [1.3.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.3.0...v1.3.1) (2020-12-21)


### Bug Fixes

* **titles:** add dynamic titles ([c957ca0](https://github.com/RedHatInsights/patchman-ui/commit/c957ca0e84be1b8e8398f719fad2cdd242eb5b71))

# [1.3.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.2.1...v1.3.0) (2020-12-18)


### Features

* **internationalization:** translate smart components ([43c46fa](https://github.com/RedHatInsights/patchman-ui/commit/43c46fa9bc5e7d62b2452e6cd763bb4e4c58514d))

## [1.2.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.2.0...v1.2.1) (2020-12-17)


### Bug Fixes

* **nav:** fix novaigation updates ([9c83dfa](https://github.com/RedHatInsights/patchman-ui/commit/9c83dfa8b8b629267072f8a30d20235e1de68ac3))

# [1.2.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.1.1...v1.2.0) (2020-12-15)


### Features

* **internationalization:** install dependencies and adopt intl ([044aadb](https://github.com/RedHatInsights/patchman-ui/commit/044aadbd0ae2e08f5e3691c951910e2c73db2ea2))

## [1.1.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.1.0...v1.1.1) (2020-12-10)


### Bug Fixes

* **treeshaking:** Improve treeshaking of imported patch detail ([6d70adc](https://github.com/RedHatInsights/patchman-ui/commit/6d70adc6fcf304e467e48d9ab41238d817de6d71))

# [1.1.0](https://github.com/RedHatInsights/patchman-ui/compare/v1.0.4...v1.1.0) (2020-12-08)


### Features

* **internationalization:** autogenerate translations ([df49a19](https://github.com/RedHatInsights/patchman-ui/commit/df49a19dde7c5d618cf2306590ff61ba9aa9c877))

## [1.0.4](https://github.com/RedHatInsights/patchman-ui/compare/v1.0.3...v1.0.4) (2020-12-03)


### Bug Fixes

* **select:** fix selecting of advisories ([5ea61fc](https://github.com/RedHatInsights/patchman-ui/commit/5ea61fceb7a935d03bd560c143d36b1894e6629d))

## [1.0.3](https://github.com/RedHatInsights/patchman-ui/compare/v1.0.2...v1.0.3) (2020-12-01)


### Bug Fixes

* **NoSystemData:** fix misleading wording ([0785947](https://github.com/RedHatInsights/patchman-ui/commit/07859479e710a96216b22084ffac64c0a4474632))

## [1.0.2](https://github.com/RedHatInsights/patchman-ui/compare/v1.0.1...v1.0.2) (2020-11-13)


### Bug Fixes

* **ConditionalFilter:** radio typw filter empty value is fixed ([cf7ca1f](https://github.com/RedHatInsights/patchman-ui/commit/cf7ca1fb289adf296b628bf9044d6fd5b7a01070))

## [1.0.1](https://github.com/RedHatInsights/patchman-ui/compare/v1.0.0...v1.0.1) (2020-11-10)


### Bug Fixes

* **SID:** SAP should work together with SID ([2f01afc](https://github.com/RedHatInsights/patchman-ui/commit/2f01afc594476de9d57e563b9edca20bcfb8f72f))

# [1.0.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.14...v1.0.0) (2020-10-27)


### Features

* **Patch:** Patch UI 1.0.0 ([0c305e7](https://github.com/RedHatInsights/patchman-ui/commit/0c305e73c9a27fc39feb6e4a294c0e5871a64f5d))


### BREAKING CHANGES

* **Patch:** Patch-UI 1.0.0 is released!

## [0.27.14](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.13...v0.27.14) (2020-10-27)


### Bug Fixes

* **url:** Fix URL parsing with global filter on ([56d606f](https://github.com/RedHatInsights/patchman-ui/commit/56d606f2a5adef6f06277655aa397063c87683a9))

## [0.27.13](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.12...v0.27.13) (2020-10-27)


### Bug Fixes

* **persistence:** Do not persist store when there was an error ([3a47235](https://github.com/RedHatInsights/patchman-ui/commit/3a47235998a3b9621458e7034a6e948f605a69df))

## [0.27.12](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.11...v0.27.12) (2020-10-26)


### Bug Fixes

* **SID:** check for SID existence before checking length ([45b3798](https://github.com/RedHatInsights/patchman-ui/commit/45b3798632ca0be6d844155f46644a1075fc559d))

## [0.27.11](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.10...v0.27.11) (2020-10-26)


### Bug Fixes

* **packages:** Fix "isBeta" variable in tests ([e1b7431](https://github.com/RedHatInsights/patchman-ui/commit/e1b7431e4961176758f59d72201ee87eaadc41b9))

## [0.27.10](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.9...v0.27.10) (2020-10-23)


### Bug Fixes

* **SAP:** Fix multiple SID filter result ([ae8502c](https://github.com/RedHatInsights/patchman-ui/commit/ae8502c91d0c978d44b15dae76bfc831f0dc1590))
* **sorting:** fix sorting of packageSystems table ([e44f444](https://github.com/RedHatInsights/patchman-ui/commit/e44f444154bb94cfec9ce255b1386c1fec188e77))

## [0.27.9](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.8...v0.27.9) (2020-10-22)


### Bug Fixes

* **exports:** Add new exports to rollup ([33f9e70](https://github.com/RedHatInsights/patchman-ui/commit/33f9e70de67eecd688cee5a65befdf92a5e89536))
* **exports:** fix exports of components ([b981c88](https://github.com/RedHatInsights/patchman-ui/commit/b981c888d913fc0459bf77c30875f3f7bf857903))

## [0.27.8](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.7...v0.27.8) (2020-10-22)


### Bug Fixes

* **tableView:** fix selectAll select page number ([015654e](https://github.com/RedHatInsights/patchman-ui/commit/015654ed9236fbea90d5b22ee9fc92c38f60a200))

## [0.27.7](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.6...v0.27.7) (2020-10-21)


### Bug Fixes

* **advisorySystems:** deselect of items fixed ([304750e](https://github.com/RedHatInsights/patchman-ui/commit/304750e0455688d904d44b7e51fb4782fa0a9193))
* **selectAll:** select should take tags into account ([cafe86a](https://github.com/RedHatInsights/patchman-ui/commit/cafe86a58f974c652bad3428c75bbbd1171c6071))

## [0.27.6](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.5...v0.27.6) (2020-10-21)


### Bug Fixes

* **SAP:** don't trigger update when there is no change ([2bc6355](https://github.com/RedHatInsights/patchman-ui/commit/2bc63555b88ee0da29a75d3ee322fda11d5e26ad))

## [0.27.5](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.4...v0.27.5) (2020-10-20)


### Bug Fixes

* **api:** reduce size of initial "/systems" response ([0dbca04](https://github.com/RedHatInsights/patchman-ui/commit/0dbca04166f437245fd821da9d330ca6258e469a))
* **packageDetail:** display latest version when same as installed ([7a9f07a](https://github.com/RedHatInsights/patchman-ui/commit/7a9f07a9cdd58548b94662ffc53ba21ac0f35816))

## [0.27.4](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.3...v0.27.4) (2020-10-20)


### Bug Fixes

* **packageDetail:** affected systems by a package are now clickable ([14eb462](https://github.com/RedHatInsights/patchman-ui/commit/14eb46269f0a5ffa43d6356ec940866b1690bc53))

## [0.27.3](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.2...v0.27.3) (2020-10-20)


### Bug Fixes

* **SAP:** enable SID filtering ([ed1f307](https://github.com/RedHatInsights/patchman-ui/commit/ed1f307d5592d6638c5b1c002e6f316a6fa00833))

## [0.27.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.1...v0.27.2) (2020-10-20)


### Bug Fixes

* **SAP:** fix offset when setting global filter ([ad8372e](https://github.com/RedHatInsights/patchman-ui/commit/ad8372ebfa4f0ee2ab4238275e3a9a8e304a452d))

## [0.27.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.27.0...v0.27.1) (2020-10-15)


### Bug Fixes

* **SAP:** fix SAP filtering, don't encode url ([3c52ae8](https://github.com/RedHatInsights/patchman-ui/commit/3c52ae89263b31bb46634b6e570f047cfbc5bc41))

# [0.27.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.26.2...v0.27.0) (2020-10-15)


### Features

* **systemPackages:** add systems view per package ([f1be044](https://github.com/RedHatInsights/patchman-ui/commit/f1be044f638029097c28492360251fd408fbfdd4))

## [0.26.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.26.1...v0.26.2) (2020-10-14)


### Bug Fixes

* **globalFilter:** remove Patch scope ([03be66f](https://github.com/RedHatInsights/patchman-ui/commit/03be66f5a328b0b8631a188cced11f038d74dd0b))

## [0.26.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.26.0...v0.26.1) (2020-10-13)

# [0.26.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.25.4...v0.26.0) (2020-10-12)


### Bug Fixes

* **packages:** fix loading of packages ([12b1db1](https://github.com/RedHatInsights/patchman-ui/commit/12b1db1eadf5a6888281c60b9c13c01a2d5a65f8))
* **packages:** make table compact ([e90caf9](https://github.com/RedHatInsights/patchman-ui/commit/e90caf9f446e8edb987f071438f6382976779a8b))
* **packages:** Trigger global filter ([c44d50d](https://github.com/RedHatInsights/patchman-ui/commit/c44d50d6917af5ec9bf7b0d1b90e94b932efc446))


### Features

* **package-detail:** implement package detail page ([34b8641](https://github.com/RedHatInsights/patchman-ui/commit/34b8641f8e77f67955b55a7a46031eedca3c2cad))
* **packages:** link package details ([b429005](https://github.com/RedHatInsights/patchman-ui/commit/b42900559dba4d68e8a32f25289efa567a9f2fd6))

## [0.25.4](https://github.com/RedHatInsights/patchman-ui/compare/v0.25.3...v0.25.4) (2020-10-09)


### Bug Fixes

* **packages:** Add padding to the tabs ([ac7fd75](https://github.com/RedHatInsights/patchman-ui/commit/ac7fd759df8fa06793dd4129280ce530b35f3857))

## [0.25.3](https://github.com/RedHatInsights/patchman-ui/compare/v0.25.2...v0.25.3) (2020-10-08)


### Bug Fixes

* **APP:** fix SAP error in App ([8b7d396](https://github.com/RedHatInsights/patchman-ui/commit/8b7d396f4c5dfe1c932eae3b53a3ffbbb78bcff1))

## [0.25.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.25.1...v0.25.2) (2020-10-05)


### Bug Fixes

* **packages:** Fix not updating entity ([115cd7a](https://github.com/RedHatInsights/patchman-ui/commit/115cd7a4d8d5e50931ff59851708f7b26023c0f5))

## [0.25.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.25.0...v0.25.1) (2020-10-02)


### Bug Fixes

* **packages:** reflect most recent mockups on system-packages ([304cab3](https://github.com/RedHatInsights/patchman-ui/commit/304cab307d2d7f7b496729fdc89dd28002e454b2))

# [0.25.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.24.2...v0.25.0) (2020-10-01)


### Features

* **GlobalFilter:** global filtering is enabled ([2366d55](https://github.com/RedHatInsights/patchman-ui/commit/2366d55039e4d65e3134cffb5bde6724f3c0e52e))

## [0.24.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.24.1...v0.24.2) (2020-09-29)


### Bug Fixes

* **SystemDetails:** infinite re-render is fixed ([1fb90ae](https://github.com/RedHatInsights/patchman-ui/commit/1fb90aeaed43b1ae8330ebe2b2143c47429d63ba))

## [0.24.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.24.0...v0.24.1) (2020-09-15)


### Bug Fixes

* **SystemPackages:** Empty state added for empty table in Systems packages page ([1524ba9](https://github.com/RedHatInsights/patchman-ui/commit/1524ba975222f2212c93ca1fb54c6b057f0cf4f3))

# [0.24.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.23.0...v0.24.0) (2020-09-10)


### Features

* **packages:** Add updatable column to package view ([336c896](https://github.com/RedHatInsights/patchman-ui/commit/336c8966afbec39731a1588130d5aefe1a358c48))

# [0.23.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.22.1...v0.23.0) (2020-09-08)


### Features

* **filter:** Filter by upgradable on packages ([2a59343](https://github.com/RedHatInsights/patchman-ui/commit/2a593430449607cbcabd9d3813489d9863c92ed2))

## [0.22.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.22.0...v0.22.1) (2020-09-03)


### Bug Fixes

* **LastSeen:** sorting bug fix by displaying last_upload instead of updated ([f7743b5](https://github.com/RedHatInsights/patchman-ui/commit/f7743b5208c324418ad1ba49b0c18837311d7e42))

# [0.22.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.21.0...v0.22.0) (2020-09-01)


### Features

* **packages-remediation:** Allow to remediate packages ([7e18ecc](https://github.com/RedHatInsights/patchman-ui/commit/7e18ecce89376764554350522571ea2f6a434b19))

# [0.21.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.20.0...v0.21.0) (2020-09-01)


### Features

* **packages-count:** Count of packages on system lists ([8ff4bca](https://github.com/RedHatInsights/patchman-ui/commit/8ff4bca64b7bd0c649191ac1cae946eee2d779fb))

# [0.20.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.19.3...v0.20.0) (2020-08-31)


### Features

* **SystemPackages:**  empty state is added ([cd74146](https://github.com/RedHatInsights/patchman-ui/commit/cd74146168aa9a45815bfbadd650ae98f19a1936))

## [0.19.3](https://github.com/RedHatInsights/patchman-ui/compare/v0.19.2...v0.19.3) (2020-08-28)


### Bug Fixes

* **select:** disallow selection of non-updatable packages ([62b17b3](https://github.com/RedHatInsights/patchman-ui/commit/62b17b3e21ddf7a826db5392c603042a06eb186e))

## [0.19.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.19.1...v0.19.2) (2020-08-28)


### Bug Fixes

* **notifications:** notifications has cancal button ([69fa459](https://github.com/RedHatInsights/patchman-ui/commit/69fa459dff8083baef727653fb4f949cb343686f))

## [0.19.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.19.0...v0.19.1) (2020-08-21)


### Bug Fixes

* **AffectedSystems:** header has space underneath ([16e2ecb](https://github.com/RedHatInsights/patchman-ui/commit/16e2ecbfab9e6394256877e8ebaf67959a533968))
* **Icons:** applicable advisories icons according to mockups ([25ca890](https://github.com/RedHatInsights/patchman-ui/commit/25ca890c59842ff0a6b088077a799bb47959a40b))
* **tableFooter:** footer misalignment fixed ([da1d728](https://github.com/RedHatInsights/patchman-ui/commit/da1d728619e3bc79b90183e5d4db1188e5e5d92d))

# [0.19.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.18.2...v0.19.0) (2020-08-18)


### Bug Fixes

* **packages:** add search and fix select all ([077d19d](https://github.com/RedHatInsights/patchman-ui/commit/077d19d4d5c1cf505786aa83467f2c5a12f55410))
* **packages:** Update placeholder for search ([549ad29](https://github.com/RedHatInsights/patchman-ui/commit/549ad2928a3a71b782dfd3ce9f06c9db3a73eb72))
* **style:** Update style of tabs ([2c43fae](https://github.com/RedHatInsights/patchman-ui/commit/2c43fae120f03e251fda294eed40beef068785dd))
* **tables:** Rename advisories table to TableView ([d048825](https://github.com/RedHatInsights/patchman-ui/commit/d0488252d35db250491ef510f23e86dbb56c2174))


### Features

* **packages:** add filtering and refactor usage on other talbes ([f3576cd](https://github.com/RedHatInsights/patchman-ui/commit/f3576cd488ff368c65f919aaaa54284c66caec2f))
* **system-packages:** Introduce tabs to select between advisories and packages ([d394a4b](https://github.com/RedHatInsights/patchman-ui/commit/d394a4b850ba1a11ba8a8251ed47925f14397a59))

## [0.18.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.18.1...v0.18.2) (2020-07-28)


### Bug Fixes

* **breadcrumbs:** fix breadcrumbs styling ([0ebad64](https://github.com/RedHatInsights/patchman-ui/commit/0ebad6495146872446ad6f1aae7c39021fa59245))

## [0.18.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.18.0...v0.18.1) (2020-07-27)


### Bug Fixes

* **manifest:** Change manifest prefixes ([f5df648](https://github.com/RedHatInsights/patchman-ui/commit/f5df6480df965a3fd0dd836383a37c360dd768cb))
* **revert): Revert "feat(advisoryDetail:** Add information about CVEs" ([817d05e](https://github.com/RedHatInsights/patchman-ui/commit/817d05ef8c458a701b62daa9a449ae301088eace))

# [0.18.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.17.1...v0.18.0) (2020-07-23)


### Features

* **advisoryDetail:** Add information about CVEs ([17d9571](https://github.com/RedHatInsights/patchman-ui/commit/17d9571076ea8e2d202e2dc92822da2f271f1063))

## [0.17.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.17.0...v0.17.1) (2020-07-22)


### Bug Fixes

* **deps:** Fix securitiy issue in lodash by updating ([f62d1c2](https://github.com/RedHatInsights/patchman-ui/commit/f62d1c2ff9e6c2e477b8470692193bd6fedd8630))

# [0.17.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.16.3...v0.17.0) (2020-07-09)


### Features

* **inventory:** pass react-redux to inventory ([031278e](https://github.com/RedHatInsights/patchman-ui/commit/031278e832365c6ab3c7d1ebca71a580367c8832))

## [0.16.3](https://github.com/RedHatInsights/patchman-ui/compare/v0.16.2...v0.16.3) (2020-06-25)


### Bug Fixes

* **routing:** refresh redirects to landing page ([0418d3a](https://github.com/RedHatInsights/patchman-ui/commit/0418d3a0f30c4f2179a500290561535da5e3ec90))

## [0.16.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.16.1...v0.16.2) (2020-06-25)


### Bug Fixes

* **styles:** fix PF4 styles ([c61725a](https://github.com/RedHatInsights/patchman-ui/commit/c61725ab52bf7c456aa8844d0142765f3303b7b2))

## [0.16.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.16.0...v0.16.1) (2020-06-25)


### Bug Fixes

* **remediation:** fix remediation color disabled ([693eb4f](https://github.com/RedHatInsights/patchman-ui/commit/693eb4f1a15bd338b5196ef5301d0bc3254f6d09))

# [0.16.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.15.0...v0.16.0) (2020-06-24)


### Features

* **pf4:** upgrade PF4 ([f5f2053](https://github.com/RedHatInsights/patchman-ui/commit/f5f20537ce2fa1f716644c93a05504d66d7fc205))

# [0.15.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.14.0...v0.15.0) (2020-06-18)


### Features

* **nav:** remove tabs and use only left navigation ([77b28c4](https://github.com/RedHatInsights/patchman-ui/commit/77b28c4b200bbf1bb378c9b9055693178243080c))

# [0.14.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.13.1...v0.14.0) (2020-06-17)


### Features

* **sort:** sort by applicable_advisories ([897fa88](https://github.com/RedHatInsights/patchman-ui/commit/897fa88f3e69b33648f66e6ba584c89ff6094eec))

## [0.13.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.13.0...v0.13.1) (2020-06-15)


### Bug Fixes

* **manifest:** Don't include dev deps in the manifest ([0703045](https://github.com/RedHatInsights/patchman-ui/commit/07030459f9a25ee413a98f5261393041621333ab))

# [0.13.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.12.0...v0.13.0) (2020-06-11)


### Features

* **filtering:** introduce persistent filtering ([babdc07](https://github.com/RedHatInsights/patchman-ui/commit/babdc07a280358eedc15ee9d052e09a21d51a368))

# [0.12.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.11.6...v0.12.0) (2020-06-08)


### Features

* **Build tool:** Use rollup for lib build ([f0d2051](https://github.com/RedHatInsights/patchman-ui/commit/f0d2051e0d4334b80831ea262c35940d5d1d83f2))

## [0.11.6](https://github.com/RedHatInsights/patchman-ui/compare/v0.11.5...v0.11.6) (2020-06-02)


### Bug Fixes

* **empty-state:** Polish display of empty states ([cb7cc49](https://github.com/RedHatInsights/patchman-ui/commit/cb7cc49515b7402c0b38f49b16ed4ce248c4ca8d))

## [0.11.5](https://github.com/RedHatInsights/patchman-ui/compare/v0.11.4...v0.11.5) (2020-06-02)


### Bug Fixes

* **empty-state:** Fix incorrect empty state ([919fa65](https://github.com/RedHatInsights/patchman-ui/commit/919fa651fa74194b0121e9b559a7459361d919af))

## [0.11.4](https://github.com/RedHatInsights/patchman-ui/compare/v0.11.3...v0.11.4) (2020-06-01)


### Bug Fixes

* **select:** fix select page number on advisories table ([9d7244f](https://github.com/RedHatInsights/patchman-ui/commit/9d7244fb9fe057f5592e611cee72f2548ec449b9))
* **select-all:** Fix select page number for affected systems ([7ad6212](https://github.com/RedHatInsights/patchman-ui/commit/7ad62121b7d96987856048b79e887f83a8a3018b))

## [0.11.3](https://github.com/RedHatInsights/patchman-ui/compare/v0.11.2...v0.11.3) (2020-06-01)


### Bug Fixes

* **manifest:** fix manifest format ([545d1f1](https://github.com/RedHatInsights/patchman-ui/commit/545d1f1beb107af8d77d4e3ac54c909d0dd8f4b7))

## [0.11.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.11.1...v0.11.2) (2020-05-28)


### Bug Fixes

* **pagination:** Fix bottom pagination in tables: ([634c595](https://github.com/RedHatInsights/patchman-ui/commit/634c595b51c4315867fd5ee0ddff479b68f30ccd))

## [0.11.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.11.0...v0.11.1) (2020-05-28)


### Bug Fixes

* **manifest:** Fix manifest format ([5168b9c](https://github.com/RedHatInsights/patchman-ui/commit/5168b9c4a003f2101e41ced1888dfe7146e1e78e))

# [0.11.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.10.1...v0.11.0) (2020-05-28)


### Features

* **export:** add export to advisories page ([dbead6a](https://github.com/RedHatInsights/patchman-ui/commit/dbead6a1645dd944e94b6018044a7a98c2825662))
* **export:** Add export to systems page ([7c284d9](https://github.com/RedHatInsights/patchman-ui/commit/7c284d9aac383bfc31dbb378d6f712fbfb376436))

## [0.10.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.10.0...v0.10.1) (2020-05-22)


### Bug Fixes

* **datetime:** Remove momentjs and use Date() instead ([3b389a1](https://github.com/RedHatInsights/patchman-ui/commit/3b389a19d9b700af97b254da6afc04761c0ebced))
* **tests:** Fix test for filter ([b70262b](https://github.com/RedHatInsights/patchman-ui/commit/b70262bb1e2ac133cc6bd9c3d0d308563b3c18c1))

# [0.10.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.9.0...v0.10.0) (2020-05-12)


### Features

* **select-all:** add indeterminate state for checkboxes ([2cb0605](https://github.com/RedHatInsights/patchman-ui/commit/2cb06051f1906133d2c45523dd6a3b3992773a4f))

# [0.9.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.8.2...v0.9.0) (2020-05-06)


### Bug Fixes

* **lint:** Fix lint ([0bb3cb5](https://github.com/RedHatInsights/patchman-ui/commit/0bb3cb54affeb1286963af23527a706ead5a3f64))


### Features

* **select-all:** Add select all for AffectedSystems ([2147b19](https://github.com/RedHatInsights/patchman-ui/commit/2147b192e85c2b517492fcf3f87ea3945b4f55fe))
* **select-all:** Support select all on the SystemAdvisories ([9e91d71](https://github.com/RedHatInsights/patchman-ui/commit/9e91d71b69c0a40f1e0657bdfcdd61616ee13eff))

## [0.8.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.8.1...v0.8.2) (2020-05-06)


### Bug Fixes

* **filter:** Remove Unknown filter ([60b798d](https://github.com/RedHatInsights/patchman-ui/commit/60b798d35bcda147f9134176b8f86ab3b0831504))

## [0.8.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.8.0...v0.8.1) (2020-04-23)


### Bug Fixes

* **advisory-link:** Fix advisory link from inventory ([d785347](https://github.com/RedHatInsights/patchman-ui/commit/d7853475f7f2c1a63d240e2fd95867f3c7378de0))

# [0.8.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.7.0...v0.8.0) (2020-04-22)


### Bug Fixes

* **inventory-loading:** Indicate that our API is loading ([bd7ef88](https://github.com/RedHatInsights/patchman-ui/commit/bd7ef88c4aba390dd6672aacf9fa1a493bd8fab2))


### Features

* **affected-systems:** Add sorting systems ([f90d03c](https://github.com/RedHatInsights/patchman-ui/commit/f90d03cf102da4b285b3639653b03b60816e61b5))
* **systems:** Add ability to sort columns ([04926db](https://github.com/RedHatInsights/patchman-ui/commit/04926dbc8b5ea1db3f07a5f702fbd5edbbff9107))

# [0.7.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.6.10...v0.7.0) (2020-04-22)


### Features

* **empty-state:** Add empty state for up-to-date system ([6bc18ed](https://github.com/RedHatInsights/patchman-ui/commit/6bc18ed030cc2550eeb1d25d782d7fee52006b2c))

## [0.6.10](https://github.com/RedHatInsights/patchman-ui/compare/v0.6.9...v0.6.10) (2020-04-20)


### Bug Fixes

* **affected-systems:** Disable default select all checkbox ([2742526](https://github.com/RedHatInsights/patchman-ui/commit/27425267ffdd2486a7467c2f9375c1072f622d66))

## [0.6.9](https://github.com/RedHatInsights/patchman-ui/compare/v0.6.8...v0.6.9) (2020-04-17)


### Bug Fixes

* **inventory-table:** generate different key for each fetch ([d1ffb45](https://github.com/RedHatInsights/patchman-ui/commit/d1ffb45d49f0d8081b91b209e719e6646f553683))

## [0.6.8](https://github.com/RedHatInsights/patchman-ui/compare/v0.6.7...v0.6.8) (2020-04-17)


### Bug Fixes

* **system-actions:** Don't disable kebabs on each row ([23a964e](https://github.com/RedHatInsights/patchman-ui/commit/23a964ee2a9e5b2cae10ef25489c2b8f9715a35d))

## [0.6.7](https://github.com/RedHatInsights/patchman-ui/compare/v0.6.6...v0.6.7) (2020-04-17)


### Bug Fixes

* **router:** Make trailing slash optional ([595ca6f](https://github.com/RedHatInsights/patchman-ui/commit/595ca6f4f678123cf38d98f248d52626b9bca4b8))

## [0.6.6](https://github.com/RedHatInsights/patchman-ui/compare/v0.6.5...v0.6.6) (2020-04-16)


### Bug Fixes

* **system-advisories:** Fixcolumn width changing with expands ([42aee80](https://github.com/RedHatInsights/patchman-ui/commit/42aee803e050800fdbe067256797f2842243cf12))

## [0.6.5](https://github.com/RedHatInsights/patchman-ui/compare/v0.6.4...v0.6.5) (2020-04-16)


### Bug Fixes

* **actions:** disable action when no applicable advisories ([4caf94d](https://github.com/RedHatInsights/patchman-ui/commit/4caf94de374b3c6ec1e5aec1f7af2ec00e4a33df))

## [0.6.4](https://github.com/RedHatInsights/patchman-ui/compare/v0.6.3...v0.6.4) (2020-04-14)


### Bug Fixes

* **advisories-table:** Justify column widths so it does not change width with row expands ([ee4f93b](https://github.com/RedHatInsights/patchman-ui/commit/ee4f93b4d2aa441bee4ab2bfe49b5fa8d60e6d4f))

## [0.6.3](https://github.com/RedHatInsights/patchman-ui/compare/v0.6.2...v0.6.3) (2020-04-09)


### Bug Fixes

* **text-style:** Wrap and truncate expandable description ([f1ee036](https://github.com/RedHatInsights/patchman-ui/commit/f1ee0367f064c5b7f66925082a4382b070d22f23))

## [0.6.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.6.1...v0.6.2) (2020-04-09)


### Bug Fixes

* **system-search:** don't call loading with each search ([08f3f62](https://github.com/RedHatInsights/patchman-ui/commit/08f3f6216207ab6c79c0e1ed8769235e203a65ca))

## [0.6.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.6.0...v0.6.1) (2020-04-07)


### Bug Fixes

* **remediation:** Rename remediation buttons ([de6204d](https://github.com/RedHatInsights/patchman-ui/commit/de6204d0d871c98ec8af2f2610b0f6fb7cbb8c9f))

# [0.6.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.5.0...v0.6.0) (2020-04-07)


### Bug Fixes

* **import:** Remove incorrect import ([fd1f002](https://github.com/RedHatInsights/patchman-ui/commit/fd1f0027155a22499bd955ce9ff572c682b08a7b))


### Features

* **system-search:** Add possibility to filter by system name ([5f58954](https://github.com/RedHatInsights/patchman-ui/commit/5f58954da0264129573a8f5397b4c2347ddddb10))

# [0.5.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.4.2...v0.5.0) (2020-04-01)


### Features

* **empty-state:** Add empty state when no systems are registered ([5372051](https://github.com/RedHatInsights/patchman-ui/commit/5372051566b6e4bc0e2ce8692987364181a1cc3d))

## [0.4.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.4.1...v0.4.2) (2020-04-01)


### Bug Fixes

* **empty-state:** Fix wording and style of no-data empty state ([d718c4f](https://github.com/RedHatInsights/patchman-ui/commit/d718c4fd3961e1565d257428f7693d0d8e86efba))

## [0.4.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.4.0...v0.4.1) (2020-03-25)


### Bug Fixes

* **error-handling:** Stop automatic notifications and handle error manually for SystemAdvisories ([d6bb711](https://github.com/RedHatInsights/patchman-ui/commit/d6bb711c4a99d541c79430aec2112a782bb9714b))

# [0.4.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.3.2...v0.4.0) (2020-03-24)


### Features

* **icons:** Advisories icons should have a tooltip on them ([9e00f3e](https://github.com/RedHatInsights/patchman-ui/commit/9e00f3e1e8dad44b9ffa306fb8ef08ec97bd0b95))

## [0.3.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.3.1...v0.3.2) (2020-03-24)


### Bug Fixes

* **breadcrumbs:** Add subpage links to breadcrumbs ([5572e45](https://github.com/RedHatInsights/patchman-ui/commit/5572e4530c534cb637740858d728e577a2ad8f0f))

## [0.3.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.3.0...v0.3.1) (2020-03-19)


### Bug Fixes

* **build:** travis stages do not share storage, merge it ([8bfe2ae](https://github.com/RedHatInsights/patchman-ui/commit/8bfe2ae0d07f1c5a75f503fc8747f8f378514ad4))

# [0.3.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.2.2...v0.3.0) (2020-03-19)


### Features

* **build:** Setup build of patchman components ([908945a](https://github.com/RedHatInsights/patchman-ui/commit/908945af4b11100e6509fe7fbbfda2097ead3601))
* **build:** setup travis to build components ([d9cb62b](https://github.com/RedHatInsights/patchman-ui/commit/d9cb62b4326ecd517f8de22dd96c70d3825fb585))

## [0.2.2](https://github.com/RedHatInsights/patchman-ui/compare/v0.2.1...v0.2.2) (2020-03-18)


### Bug Fixes

* **name:** Rename System Patch Manager to just Patch ([8dfac54](https://github.com/RedHatInsights/patchman-ui/commit/8dfac54ae5e43b062c93fa32d822d05ae7dd2455))

## [0.2.1](https://github.com/RedHatInsights/patchman-ui/compare/v0.2.0...v0.2.1) (2020-03-16)


### Bug Fixes

* **expand-rows:** Fix expansion of rows in tables ([8747d4c](https://github.com/RedHatInsights/patchman-ui/commit/8747d4c01c14b8f744155a68bb590396bc38e829))

# [0.2.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.1.0...v0.2.0) (2020-03-13)


### Features

* **select-all:** Implement select all for inventory tables ([ba86a4e](https://github.com/RedHatInsights/patchman-ui/commit/ba86a4eeb2c78a024101cc9e6a3bf3636b53b0ec))

# [0.1.0](https://github.com/RedHatInsights/patchman-ui/compare/v0.0.1...v0.1.0) (2020-03-13)


### Features

* **release:** setup semantic-release ([0b1076a](https://github.com/RedHatInsights/patchman-ui/commit/0b1076a74094bd7cad57e0938f5dcc1c611f7c91))
