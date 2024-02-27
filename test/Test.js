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

const test = require("ava");
const Eleventy = require("@11ty/eleventy");
const SpeculationRulesPlugin = require("../.eleventy.js");

function makeEleventy(options = {}) {
    return new Eleventy("./test/site/", "./test/site/_site/", {
        configPath: "nonexistent",
        config(eleventyConfig) {
            // Eleventy caches templates globally, but this doesn't account for
            // multiple configs being loaded. This normally happens on
            // eleventy.resourceModified, but just disable this cache
            // altogether.
            eleventyConfig.useTemplateCache = false;

            eleventyConfig.addPlugin(SpeculationRulesPlugin, options.pluginOptions);
        },
        pathPrefix: (options.pathPrefix ?? "/"),
    });
}

test("default config", async t => {
    let eleventy = await makeEleventy();
    let json = await eleventy.toJSON();
    let index = json.find(p => p.url === '/');
    t.snapshot(index.content);
});

test("with excluded paths", async t => {
    let eleventy = makeEleventy({
        pluginOptions: {exclude: ["/admin/*", "/logout"]}
    });
    let json = await eleventy.toJSON();
    let index = json.find(p => p.url === '/');
    t.snapshot(index.content);
});

test("with a path prefix that needs escaping", async t => {
    let eleventy = makeEleventy({
        pathPrefix: "/*{/",
    });
    let json = await eleventy.toJSON();
    let index = json.find(p => p.url === '/');
    t.snapshot(index.content);
});

test("with a path prefix and exclusions", async t => {
    let eleventy = makeEleventy({
        pathPrefix: "/foo/bar",
        pluginOptions: {exclude: ["/admin/*", "/logout"]},
    });
    let json = await eleventy.toJSON();
    let index = json.find(p => p.url === '/');
    t.snapshot(index.content);
});

test("with a path prefix with stronger escaping needs", async t => {
    // This path prefix not only contains :, a special character, but that
    // character also needs to be further escaped to avoid being treated as a
    // scheme separator.
    // https://github.com/whatwg/urlpattern/issues/210
    let eleventy = makeEleventy({
        pathPrefix: "/zone:5/",
        pluginOptions: {exclude: ["/dynamic/*"]},
    });
    let json = await eleventy.toJSON();
    let index = json.find(p => p.url === '/');
    t.snapshot(index.content);
});

test("with prerender", async t => {
    let eleventy = makeEleventy({
        pluginOptions: {action: "prerender"}
    });
    let json = await eleventy.toJSON();
    let index = json.find(p => p.url === '/');
    t.snapshot(index.content);
});

test("with conservative eagerness", async t => {
    let eleventy = makeEleventy({
        pluginOptions: {eagerness: "conservative"}
    });
    let json = await eleventy.toJSON();
    let index = json.find(p => p.url === '/');
    t.snapshot(index.content);
});