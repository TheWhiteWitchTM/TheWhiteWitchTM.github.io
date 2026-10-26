---
layout: default
title: Cinder — an editor for bash and sh
description: Cinder is a native Qt editor for bash and sh. Write a script, run it, trace it, or stop on a breakpoint.
keywords: Cinder, bash, sh, shell script editor, Qt, The White Witch
permalink: /cinder/
hide_banner: true
image: /assets/images/cinder.jpg
image_width: 1200
image_height: 630
image_alt: Cinder. Ember sparks on a black screen.
software_name: Cinder
software_category: DeveloperApplication
software_os: Linux
software_features:
  - Bash and sh
  - Run
  - Trace
  - Breakpoints
---

<header class="hero">
  <p class="hero-kicker">Native Qt</p>
  <h1>Cinder</h1>
  <p class="hero-lead">A black editor for bash and sh. Write a script, run it, trace it, or stop on a breakpoint.</p>
  <p class="hero-actions">
    <a class="btn" href="https://github.com/TheWhiteWitchTM/cinder" target="_blank" rel="noopener noreferrer">Source on GitHub</a>
  </p>
</header>

<figure class="plate">
  <img src="{{ '/assets/images/cinder.jpg' | relative_url }}" alt="Cinder. A dark monitor filled with ember-colored sparks." width="1200" height="630">
</figure>

<section class="band">
  <div class="band-head">
    <p class="kicker">On the black page</p>
    <h2>The script, and the line it is on</h2>
    <p>Tabs, a file tree, and an outline of functions. Keywords, builtins, strings, and variables are colored. Bash syntax in an sh script gets a warning color. Drop a script on the window, or pass it on the command line.</p>
  </div>
  <ol class="dial" aria-label="What Cinder does">
    <li><strong>Run</strong><span>F5. The interpreter follows the shebang, or the choice in the toolbar.</span></li>
    <li><strong>Trace</strong><span>F6. The line that is running is marked in the gutter.</span></li>
    <li><strong>Debug</strong><span>F7. Click the gutter for a breakpoint. Step over, step in, pause.</span></li>
    <li><strong>Check</strong><span>Unclosed quotes, and shellcheck when it is installed.</span></li>
  </ol>
</section>

<section class="band">
  <div class="band-head">
    <p class="kicker">A small limit</p>
    <h2>Breakpoints want bash</h2>
    <p>sh scripts run with <code>/bin/sh</code>. Breakpoints need bash, because dash has no debug trap. Cinder says so in the console. The editor is black. Ember is the accent. Settings live in <code>~/.config/cinder/</code>.</p>
  </div>
</section>

<p class="close-note">Built with Qt 6, in the same shape as Blogy and Vesper. The bundle in <code>dist/</code> carries Qt, so the editor can start where Qt is not installed. The source is <a href="https://github.com/TheWhiteWitchTM/cinder">on GitHub</a>, under the MIT license. <a href="{{ '/' | relative_url }}">Back to the card</a>.</p>
