/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const pkg = require("./package.json");

module.exports = function(eleventyConfig, options = {}) {
    try {
        eleventyConfig.versionCheck(pkg["11ty"].compatibility);
    } catch (e) {
        console.log(`Warning: ${pkg.name} may not be compatible with Eleventy: ${e.message}`);
    }

    let { shortcode, action, eagerness, exclude } = {
        shortcode: "speculationRules",
        action: "prefetch",
        eagerness: "moderate",
        exclude: [],
        ...options
    };

    // The functionality of the url filter is not conveniently exported elsewhere.
    // In the unlikely event it has a special URL pattern character, escape it.
    let root = eleventyConfig.getFilter("url")("/", eleventyConfig.pathPrefix);
    let escapedRoot = root.replaceAll(/[{}()*?+:]/g, "\\$&");
    let condition = {href_matches: escapedRoot + "*"};
    if (exclude.length !== 0) {
        let excludePatterns = exclude.map(e => e.replace(/^\/(?!\/)/, escapedRoot));
        condition = {and: [condition, {not: {href_matches: excludePatterns}}]};
    }
    let rules = {
        [action]: [{source: "document", where: condition, eagerness}]
    };
    let speculationRulesTag = `<script type="speculationrules">${JSON.stringify(rules)}</script>`;
    eleventyConfig.addShortcode(shortcode, () => speculationRulesTag);
};