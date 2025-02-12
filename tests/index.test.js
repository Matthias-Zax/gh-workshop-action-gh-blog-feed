const { _getRssFeed, _formatAndPrintLogOutput } = require('../index');
const sinon = require('sinon');
const { expect } = require('chai');
const Parser = require('rss-parser');

describe('index.js', () => {
  describe('_getRssFeed', () => {
    it('should fetch and parse RSS feed', async () => {
      const parserStub = sinon.stub(Parser.prototype, 'parseURL').resolves({
        items: [
          { title: 'Test Post 1', link: 'http://example.com/1', pubDate: '2023-01-01' },
          { title: 'Test Post 2', link: 'http://example.com/2', pubDate: '2023-01-02' }
        ]
      });

      const feed = await _getRssFeed('http://example.com/feed', 'test');

      expect(feed.items).to.have.lengthOf(2);
      expect(feed.items[0].title).to.equal('Test Post 1');
      expect(feed.items[1].title).to.equal('Test Post 2');

      parserStub.restore();
    });
  });

  describe('_formatAndPrintLogOutput', () => {
    it('should format and print log output', async () => {
      const consoleLogStub = sinon.stub(console, 'log');

      const feed = {
        items: [
          { title: 'Test Post 1', link: 'http://example.com/1', pubDate: '2023-01-01' },
          { title: 'Test Post 2', link: 'http://example.com/2', pubDate: '2023-01-02' }
        ]
      };

      await _formatAndPrintLogOutput(feed);

      expect(consoleLogStub.callCount).to.equal(6);
      expect(consoleLogStub.getCall(0).args[0]).to.equal('---');
      expect(consoleLogStub.getCall(1).args[0]).to.equal('Title: Test Post 1');
      expect(consoleLogStub.getCall(2).args[0]).to.equal('Link: http://example.com/1');
      expect(consoleLogStub.getCall(3).args[0]).to.equal('PubDate: 2023-01-01');
      expect(consoleLogStub.getCall(4).args[0]).to.equal('---');
      expect(consoleLogStub.getCall(5).args[0]).to.equal('Title: Test Post 2');
      expect(consoleLogStub.getCall(6).args[0]).to.equal('Link: http://example.com/2');
      expect(consoleLogStub.getCall(7).args[0]).to.equal('PubDate: 2023-01-02');

      consoleLogStub.restore();
    });
  });
});
