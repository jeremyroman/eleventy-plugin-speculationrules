# Speculation Rules + Eleventy

Automatically generates speculation rules enabling simple prefetching and prerendering across an [Eleventy](https://github.com/11ty/eleventy) site.

Just install into your eleventy project (not currently published on npm):

```
npm install [path to this repository] --save-dev
```

Add it to your `.eleventy.js`:

```javascript
// CJS syntax
const SpeculationRulesPlugin = require("eleventy-plugin-speculationrules");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(SpeculationRulesPlugin);
};

// ESM syntax
import SpeculationRulesPlugin from "eleventy-plugin-speculationrules";

export default function(eleventyConfig) {
    eleventyConfig.addPlugin(SpeculationRulesPlugin);
}
```

Add the `speculationRules` shortcode to your layout, likely at the end of the `<head>` or `<body>` element. For example, in a Nunjucks template:

```nunjucks
{% speculationRules %}
```

The following options can be passed to `addPlugin`:

<dl>
<dt><code>shortcode</code>
<dd>A string naming the generated shortcode (default <code>"speculationRules"</code>)
<dt><code>action</code>
<dd>What kind of preloading you would like (<code>"prefetch"</code> or <code>"prerender"</code>; default <code>"prefetch"</code>)
<dt><code>eagerness</code>
<dd>The speculation rules heuristic eagerness (<code>"immediate"</code>, <code>"eager"</code>, <code>"moderate"</code>, or <code>"conservative"</code>; default <code>"moderate"</code>)
<dt><code>exclude</code>
<dd>An array containing or more URL patterns within the path prefix not to preload; path-relative ones will be rewritten according to your Eleventy path prefix
</dl>

If you apply CSP to your site, you'll need to add `'inline-speculation-rules'` to the `script-src` directive (or another directive applicable to `<script>` elements).