var cheerio = require('cheerio'),
	AbstractScraper = require('./AbstractScraper');

/**
 * A static scraper. This can only scrape static content, with the
 *   help of jQuery.
 * This version uses cheerio {@link https://github.com/cheeriojs/cheerio}.
 *
 * @extends {AbstractScraper}
 */
var StaticScraper = function() {
	AbstractScraper.call(this);
	/**
	 * jQuery.
	 *
	 * @type {!function}
	 * @private
	 */
	this.$ = null;
};
StaticScraper.prototype = Object.create(AbstractScraper.prototype);
/**
 * @override
 * @inheritDoc
 */
StaticScraper.prototype.loadBody = function(done) {
	this.$ = cheerio.load(this.body);
	done();
	return this;
};
/**
 * Scrapes the webpage. According to a function, and a callback.
 *
 * @param  {!function(function(), ...?)} scraperFn Function to scrape
 *   the content. It receives the jQuery function to manipulate the
 *   DOM, and the args as parameters, if passed.
 * @param  {!function(?)} callbackFn Function that receives the
 *   result of the scraping.
 * @param  {!Array=} args Extra arguments to pass to the scraping
 *   function.
 * @return {!AbstractScraper} This scraper.
 * @override
 * @public
 */
StaticScraper.prototype.scrape = function(scraperFn, callbackFn, args) {
	args = args || [];
	args.unshift(this.$);
	try {
		var result = scraperFn.apply(null, args);
		callbackFn(null, result);
	} catch (err) {
		callbackFn(err, null);
	}
	return this;
};
/**
 * @override
 * @inheritDoc
 */
StaticScraper.prototype.close = function() {};

StaticScraper.create = function(url) {
	return AbstractScraper.create(StaticScraper, url);
};

module.exports = StaticScraper;