---
layout: default
title: MAGIC Dock — Linux only
description: MAGIC Dock is a native Qt dock for the COSMIC desktop on Pop!_OS. It pins apps into stacks. It runs on Linux.
keywords: MAGIC Dock, Linux, Pop!_OS, COSMIC, Qt, dock, stacks, The White Witch
permalink: /magic-dock/
hide_banner: true
image: /assets/images/magic-dock.jpg
image_width: 1200
image_height: 630
image_alt: MAGIC Dock. A dock of glowing tiles on a purple nebula. Linux only.
software_name: MAGIC Dock
software_category: DesktopApplication
software_os: Linux
software_features:
  - Stacks
  - COSMIC settings
  - Web app icons
  - Linux only
---

<header class="hero">
  <p class="hero-kicker">Native Qt · Linux only</p>
  <h1>MAGIC Dock</h1>
  <p class="hero-lead">A dock for the COSMIC desktop on Pop!_OS. It uses the edge, size, autohide, and opacity already stored by COSMIC Settings, pins apps into stacks, and keeps System Monitor at the far end.</p>
  <p class="hero-actions">
    <a class="btn" href="https://github.com/TheWhiteWitchTM/MAGIC-Dock" target="_blank" rel="noopener noreferrer">Source on GitHub</a>
  </p>
</header>

<figure class="plate">
  <img src="{{ '/assets/images/magic-dock.jpg' | relative_url }}" alt="MAGIC Dock. A pill-shaped dock of app tiles under a purple nebula." width="1200" height="630">
</figure>

<section class="band">
  <div class="band-head">
    <p class="kicker">Where it runs</p>
    <h2>Linux. Pop!_OS. COSMIC.</h2>
    <p>MAGIC Dock is the one that only works on Linux. It talks to the COSMIC panel, the Wayland layer shell, and the dock settings Pop!_OS already writes.</p>
  </div>
  <ol class="dial" aria-label="What the dock keeps">
    <li><strong>Linux only</strong><span>Pop!_OS with a COSMIC session. glibc 2.38 or newer.</span></li>
    <li><strong>Stacks</strong><span>Drag one pin onto another. Rename the stack, or ungroup it.</span></li>
    <li><strong>Your settings</strong><span>Edge, size, autohide, and opacity come from COSMIC Settings.</span></li>
    <li><strong>Web apps</strong><span>Chrome, Chromium, Brave, and Edge icons show up as themselves.</span></li>
  </ol>
</section>

<section class="band">
  <div class="band-head">
    <p class="kicker">A build that runs</p>
    <h2>Qt is in the bundle</h2>
    <p>The <a href="https://github.com/TheWhiteWitchTM/MAGIC-Dock/tree/dist">dist branch</a> is a prebuilt bundle for a 64-bit Pop!_OS COSMIC session. Qt 6.12 is included. <code>scripts/replace-cosmic-dock.sh</code> hides the COSMIC bottom dock, leaves the top panel, and starts MAGIC Dock again at the next login. Restore COSMIC Dock puts the old one back.</p>
  </div>
</section>

<p class="close-note">The program is <code>magic-dock</code>. The source is <a href="https://github.com/TheWhiteWitchTM/MAGIC-Dock">on GitHub</a>, under the MIT license. The bundle also carries Qt, under the LGPL. <a href="{{ '/' | relative_url }}">Back to the card</a>.</p>
