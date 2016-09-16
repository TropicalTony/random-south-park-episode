# Random South Park Episode
[![Build Status](https://travis-ci.org/syyfilis/random-south-park-episode.svg?branch=master)](https://travis-ci.org/syyfilis/random-south-park-episode)
[![Code Climate](https://codeclimate.com/github/syyfilis/random-south-park-episode/badges/gpa.svg)](https://codeclimate.com/github/syyfilis/random-south-park-episode)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/d/gnejpgpadafimefcjbhnglbnfbboakjf.svg?maxAge=2592000)](https://chrome.google.com/webstore/detail/random-south-park-episode/gnejpgpadafimefcjbhnglbnfbboakjf)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/gnejpgpadafimefcjbhnglbnfbboakjf.svg?maxAge=2592000)](https://chrome.google.com/webstore/detail/random-south-park-episode/gnejpgpadafimefcjbhnglbnfbboakjf)

> Watch random [South Park](https://en.wikipedia.org/wiki/South_Park) episodes with a help from awesome web extension.

The extension will keep track of all your watched South Park episodes. All you need to do is click the little Kenny icon and you will get a *RANDOM* South Park episode which you have not seen.

![That's pretty cool](http://i.giphy.com/26tP7cDNJUZQy7w3u.gif)

## Start using it

"Random South Park Episode" extension is currently available for:

- [Chrome](https://chrome.google.com/webstore/detail/random-south-park-episode/gnejpgpadafimefcjbhnglbnfbboakjf)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/random-south-park-episode/)
- [Opera](https://addons.opera.com/en/extensions/details/random-south-park-episode/)

## Report an issue

You can report an issue in [here](https://github.com/syyfilis/random-south-park-episode/issues/new). Please include as much information as possible about your issue/request.

## Contribute

#### Install dependencies

```
$ npm install
```

#### Develop

```
$ npm run start
```

Write code that you're proud of and document it (using [JSDoc](http://usejsdoc.org/) rules).

#### Write automated tests

```
$ npm run test
```

#### Test manually

Read how-to-manually-test-extension docs:

- [Chrome](https://developer.chrome.com/extensions/getstarted#unpacked)
- [Firefox](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox)
- [Opera](https://dev.opera.com/extensions/testing/)

You can test extension in Firefox 49 by using command

```
$ npm run firefox
```

#### Keep the code clean

```
$ npm run lint
```

#### Make a pull request

Make sure the build is green and then make a [pull request](https://github.com/syyfilis/random-south-park-episode/pulls).

## Develop promo page

```
$ npm run start-promo
```

> NOTE: pushing a `index.html` changes to master branch will make changes instantly public.

## Publish

Bump up version number in `manifest.json` and run

```
$ npm run build
```

You can find ready-to-release extension in `dist/random-south-park-episode.zip`.

Read how-to-publish-extension docs:

- [Chrome](https://developer.chrome.com/extensions/hosting)
- [Firefox](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Publishing_your_WebExtension)
- [Opera](https://dev.opera.com/extensions/publishing-guidelines/#submit)

## License

[MIT](https://github.com/syyfilis/random-south-park-episode/blob/master/LICENSE)
