---
layout: default
title: Vesper — music and video for the quiet hours
description: Vesper is a native Qt player for music and video. Albums, a queue, and the film you paused. Drop a folder on the window.
keywords: Vesper, music player, video player, Qt, libVLC, The White Witch
permalink: /vesper/
hide_banner: true
image: /assets/images/vesper.jpg
image_width: 1200
image_height: 630
image_alt: Vesper. Headphones and a paused film in evening light.
software_name: Vesper
software_category: MultimediaApplication
software_os: Linux
software_features:
  - Music
  - Video
  - Queue
  - Continue watching
---

<header class="hero">
  <p class="hero-kicker">Native Qt</p>
  <h1>Vesper</h1>
  <p class="hero-lead">Music and video for the quiet hours. A dark player. Albums, a queue, and the film you paused.</p>
  <p class="hero-actions">
    <a class="btn" href="https://github.com/TheWhiteWitchTM/vesper" target="_blank" rel="noopener noreferrer">Source on GitHub</a>
  </p>
</header>

<figure class="plate">
  <img src="{{ '/assets/images/vesper.jpg' | relative_url }}" alt="Vesper. Headphones, a paused film, and evening light through a window." width="1200" height="630">
</figure>

<section class="band">
  <div class="band-head">
    <p class="kicker">Drop a folder</p>
    <h2>The first window is empty on purpose</h2>
    <p>Add a folder and Vesper keeps it. Scan home once, or scan the computer once. Drop files, folders, or links on the window. Nothing is written back into your files. Playback resumes when you ask.</p>
  </div>
  <ol class="dial" aria-label="What Vesper plays">
    <li><strong>Music</strong><span>Album, artist, track, and genre. Artwork and lyrics when the file has them.</span></li>
    <li><strong>Video</strong><span>Posters, continue-watching, and full screen while it plays.</span></li>
    <li><strong>Queue</strong><span>Shuffle, repeat, playlists, and a few smart lists.</span></li>
    <li><strong>The desk</strong><span>Media keys and MPRIS, so the desktop controls work.</span></li>
  </ol>
</section>

<section class="band">
  <div class="band-head">
    <p class="kicker">Qt, and VLC</p>
    <h2>The bundle carries what it needs</h2>
    <p>Vesper is Qt 6 and libVLC. <code>scripts/bundle-dist.sh</code> writes <code>dist/</code> with the binary, the Qt libraries, and the VLC modules. That copy starts on a machine where Qt is not installed. The library lives in <code>~/.local/share/vesper/</code>.</p>
  </div>
</section>

<p class="close-note">The About window is Mira, The White Witch. The source is <a href="https://github.com/TheWhiteWitchTM/vesper">on GitHub</a>, under the MIT license. <a href="{{ '/' | relative_url }}">Back to the card</a>.</p>
