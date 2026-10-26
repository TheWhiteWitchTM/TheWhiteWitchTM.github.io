---
layout: default
title: Blogy — Markdown for the blogs you have
description: Blogy is a native Qt Markdown editor. Write a post, watch the preview, fix the front matter, and publish with git. Grok can help. Bluesky can hear about it.
keywords: Blogy, Markdown editor, Qt, Jekyll, GitHub Pages, Grok, The White Witch
permalink: /blogy/
hide_banner: true
image: /assets/images/blogy.jpg
image_width: 1200
image_height: 630
image_alt: Blogy. An open notebook with an amber caret.
software_name: Blogy
software_category: DeveloperApplication
software_os: Linux
software_features:
  - Markdown
  - Live preview
  - Front matter
  - Git publish
  - Grok
---

<header class="hero">
  <p class="hero-kicker">Native Qt</p>
  <h1>Blogy</h1>
  <p class="hero-lead">A black Markdown editor for the blogs you already have. Write the post, watch the preview, fix the front matter in a form, and publish with git.</p>
  <p class="hero-actions">
    <a class="btn" href="https://github.com/TheWhiteWitchTM/blogy" target="_blank" rel="noopener noreferrer">Source on GitHub</a>
  </p>
</header>

<figure class="plate">
  <img src="{{ '/assets/images/blogy.jpg' | relative_url }}" alt="Blogy. An open notebook with an amber caret on a dark desk." width="1200" height="630">
</figure>

<section class="band">
  <div class="band-head">
    <p class="kicker">What it does</p>
    <h2>The post, then the push</h2>
    <p>Blogy is generic. A Jekyll site, collections or <code>_posts</code>, or a Next.js MDX blog works once the config describes it. The example ships with whitewitch, Mira's World, and this site filled in. Keep them, edit them, or delete them.</p>
  </div>
  <ol class="dial" aria-label="What Blogy does">
    <li><strong>Write</strong><span>Markdown on a black page. Headings, lists, and fenced code.</span></li>
    <li><strong>Preview</strong><span>The preview fills the text area until you close it.</span></li>
    <li><strong>Front matter</strong><span>A form built from the keys already in the post.</span></li>
    <li><strong>Publish</strong><span>git add, commit, and push in the site's own clone.</span></li>
  </ol>
</section>

<section class="band">
  <div class="band-head">
    <p class="kicker">Beside the draft</p>
    <h2>Grok, and then Bluesky</h2>
    <p>A chat in the side pane can see the post. Finish the post, polish it, or ask for a title. After a publish, Blogy can offer the title and the URL as a Bluesky post. The app password stays in your config. Blogy uses your git credentials for the push. It never holds a GitHub token.</p>
  </div>
</section>

<p class="close-note">Built with Qt 6, in the same shape as Cinder and Vesper. The bundle in <code>dist/</code> runs on a machine where Qt is not installed. The source is <a href="https://github.com/TheWhiteWitchTM/blogy">on GitHub</a>, under the MIT license. <a href="{{ '/' | relative_url }}">Back to the card</a>.</p>
