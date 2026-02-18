'use strict';

const striptags = require('striptags');

hexo.extend.filter.register('after_post_render', data => {
  if (data.layout !== 'posts') return data;

  const limit = 300;
  const chars = Array.from(
    striptags(data.content || '')
      .replace(/\s+/g, ' ')
      .trim()
  );

  data.excerpt = chars.length > limit
    ? chars.slice(0, limit).join('') + '...'
    : chars.join('');

  return data;
});
