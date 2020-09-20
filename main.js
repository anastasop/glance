#!/usr/bin/env node

const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const colors = require('colors');

const argv = require('yargs')
      .usage('Glance is a command line tool for mozilla readability')
      .option('short', {
        alias: 's',
        type: 'boolean',
        description: 'Output only url, title and excerpt lines'
      })
      .option('json', {
        alias: 'j',
        type: 'boolean',
        description: 'Output the readability article in json'
      })
      .option('colors', {
        alias: 'c',
        type: 'boolean',
        description: 'Colorize the output of short'
      })
      .check((argv) => {
        if (argv._.length > 0) {
          return true;
        } else {
          throw new Error('urls missing');
        }
      })
      .argv;

const requestConfig = {
  timeout: 10 * 1000,
  responseType: 'document',
  maxBodyLength: 5 * 1048576,
  validateStatus: (status) => status >= 200 && status < 300
};

const glance = (url) => axios.get(url, requestConfig)
      .then((response) => {
        const doc = new JSDOM(response.data, { url: url, runScripts: 'outside-only' });
        const reader = new Readability(doc.window.document);
        const article = reader.parse();
        if (!article) {
          throw new Error('parse failed');
        }
        return [url, article];
      });
      
const glances = argv._.map((url) => {
  return glance(url)
    .catch((error) => {
      process.stderr.write(('Error: ' + url + ' : ' + error.message + "\n").red);
      return null; // failed glances are resolved with null
    })
});

Promise.all(glances).then((values) => {
  const articles = values.filter((v) => v && v[1]);

  if (argv.json) {
    process.stdout.write(JSON.stringify(articles));
  } else {
    articles.forEach((value) => {
      var url = value[0]
      var title = value[1].title || url
      var excerpt = value[1].excerpt || ""

      if (argv.colors) {
        url = url.green;
        title = title.yellow;
        excerpt = excerpt.white;
      }

      process.stdout.write(["", url, title, "", excerpt, ""].join("\n"));
    });
  }
});
