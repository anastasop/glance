# Glance

Glance is command line utility for [mozilla readability](https://github.com/mozilla/readability). This is the 'engine' behind the [firefox reader view](https://support.mozilla.org/en-US/kb/firefox-reader-view-clutter-free-web-pages) that tries to strip away the clutter from web pages and present to the user only the important parts.

There are ports of readability to [ruby](https://github.com/cantino/ruby-readability) and [go](https://github.com/go-shiori/go-readability) and there is also the excellent [newspaper](https://newspaper.readthedocs.io/en/latest/) for python, but i wanted to have something to try the 'official' project.

The main use case is to feed it urls and then feed the results to a full text search engine to create a personal web search engine.

## Installation

Glance is a node application but is not yet published to npm. For local use, do:

```
git clone https://github.com/anastasop/glance
cd glance
npm install
npm link # may need sudo if you are not using nvm
```

and the glance executable will be available to use. If you don't want to use `npm link` then you will be able to using it only from the `glance` directory.

## Usage

Very simple:

```
% glance https://www.github.com https://nodejs.org

https://github.com
Build software better, together

GitHub is where people build software. More than 50 million people use GitHub to discover, fork, and contribute to over 100 million projects.

https://nodejs.org
Node.js

Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.

% glance --colors https://www.github.com # for colored output

% glance --json https://www.github.com # output json (including the full page text) suitable for adding to the a full text search corpus.

% glance --json https://www.github.com | jq . # for pretty printing
```

## License

Glance is released under the GNU public license version 3.

## Bugs

- Needs some better error reporting
- Expects the urls to point to html. Urls to pdfs, videos etc make it fail badly
- JSDOM is used with `runScripts: 'outside-only'` because this is the only way to get responses from youtube. Check [jsdom](https://github.com/jsdom/jsdom) if you are worried about security.
