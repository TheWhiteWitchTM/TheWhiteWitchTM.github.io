---
layout: home
title: The White Witch™
description: Emoji games, MAGIC, and RETRO MAGIC. No accounts. No quiet sponsors.
image: /assets/images/og.jpg
image_width: 1200
image_height: 630
---

<div class="intro">
  <p align="center">
    <strong>Emoji games. A language. Then the old machines.</strong><br>
    No accounts. No quiet sponsors.<br>
    Argue with the code, not the caption.
  </p>
  <p align="center">
    <em>Enter at your own risk. Side effects may include a wagon, a sprite, and a breadbox that still boots.</em>
  </p>
  <p align="center">
    The politics stay on <a href="https://thewhitewitchtm.github.io/whitewitch/">The White Witch™</a>.<br>
    This door is the games, and the two compilers under them.
  </p>
</div>

<h2 id="emoji-games">🕹️ Emoji Games</h2>

Politics broke me, so the emojis got a room.

[Emoji Games](https://thewhitewitchtm.github.io/emojigames/) opened on 12 October 2026. Old games, drawn with emoji. The shelf is the catalog. The three below are the ones on the menu.

No “please create an account to play a 50-year-old idea with pictures.”

### [🚀 Galaxy Hunt](https://thewhitewitchtm.github.io/emojigames/games/galaxy-hunt/)

<img class="project-banner" src="https://thewhitewitchtm.github.io/emojigames/games/galaxy-hunt/banner.jpg" alt="Galaxy Hunt. An eight-by-eight galaxy, drawn with emoji.">

Super Star Trek, drawn with emoji. The galaxy is eight by eight. You are the Alliance hunter. Raiders sit in the quadrants, stars block a shot, and an outpost will repair you if you dock on its sector. Clear the fleet before the stardate runs out.

The same mission stands up in [🚀 Galaxy Hunt 3D](https://thewhitewitchtm.github.io/emojigames/games/galaxy-hunt-3d/). It is written in MAGIC. The charts are flat, the quadrant is solid, and the bridge takes the orders.

### [🐂 The Oregon Trail](https://thewhitewitchtm.github.io/emojigames/games/oregon-trail/)

<img class="project-banner" src="https://thewhitewitchtm.github.io/emojigames/games/oregon-trail/banner.jpg" alt="The Oregon Trail. A wagon on the road west.">

A wagon, five names, and the road from Independence to the Willamette. Banker, carpenter, or farmer. Matt sells the oxen. The rivers want a choice, the hunt wants the arrows, and the Columbia wants a raft that can find the channel. A score is written only if someone arrives.

### [🗡️ Hack](https://thewhitewitchtm.github.io/emojigames/games/hack/)

<img class="project-banner" src="https://thewhitewitchtm.github.io/emojigames/games/hack/banner.jpg" alt="Hack. Rooms, corridors, and an amulet.">

Rooms, corridors, and things that walk toward you. Weapons get wielded when they are better than the one in your hand. Armor takes the edge off a hit. `P` drinks a potion. The Amulet of Yendor is on the sixth floor. Pick it up and the delve is over.

### Also on the shelf

- [🏓 Pong](https://thewhitewitchtm.github.io/emojigames/games/pong/) — first to 5. You are the left paddle.
- [🐍 Snake](https://thewhitewitchtm.github.io/emojigames/games/snake/) — eat, grow, and don’t hit the furniture. One hundred points clears the board.
- [🌲 Adventureland](https://thewhitewitchtm.github.io/emojigames/games/adventureland/) — thirteen treasures, one hollow stump.
- [🏴‍☠️ Pirate Adventure](https://thewhitewitchtm.github.io/emojigames/games/pirate/) — leave the flat, find the island, bring the gold home.
- [🗡️ Rogue](https://thewhitewitchtm.github.io/emojigames/games/rogue/) — six floors, then the amulet.
- [🤖 Trump Super Intelligence](https://thewhitewitchtm.github.io/emojigames/games/trump-si/) — a conversation with a face. Not a match.
- [🧙‍♀️ Witch Hunt](https://thewhitewitchtm.github.io/emojigames/games/witch-hunt/) — ten levels. Symbols chase the witch.
- [🧙 A Witch's Tale](https://thewhitewitchtm.github.io/emojigames/games/witch-tales/) — a chaptered tile tale. You are a witch.
- [🖥️ Witch I](https://thewhitewitchtm.github.io/emojigames/games/witch-1/) — a 40-column machine. It speaks WASIC.
- [🖥️ Basic I](https://thewhitewitchtm.github.io/emojigames/games/basic-1/) — a 40-column computer for learning BASIC.
- [✨ Magic](https://thewhitewitchtm.github.io/emojigames/games/magic/) — a small language on the shelf. Lua, with the sharp corners filed off.
- [🖥️ Basic Learn](https://thewhitewitchtm.github.io/emojigames/games/basic-learn/) — BASIC with the picture, colored words, and plain errors.
- [🛸 Elite](https://thewhitewitchtm.github.io/emojigames/games/elite/) — a Cobra at Lave. Trade, fight, and dock. Eight galaxies.
- [🌙 Pale March](https://thewhitewitchtm.github.io/emojigames/games/pale-march/) — you are the White Witch. Four seals, then the gate.

The whole shelf, and the release notes, live on [Emoji Games](https://thewhitewitchtm.github.io/emojigames/).

<h2 id="magic">🪄 MAGIC</h2>

<img class="project-banner" src="{{ '/assets/images/magic.jpg' | relative_url }}" alt="MAGIC. Lua, BASIC, JavaScript.">

I got tired of the timeline, so I wrote a language. The name is MAGIC. A committee did not get a vote. You can tell.

It mixes Lua and BASIC, and it compiles to JavaScript. A newline ends a statement. `end` closes the block. Keywords ignore case. Names keep theirs. Indexes start at 0. `nil`, `false`, `0`, and `""` are false. `--` comments out the rest of the line. `$"..."` fills text. `=` assigns. `==` compares.

`@canvas` is a picture. `@terminal` is a grid of text. There's also 3D, a UI kit, sound, hex boards, and the usual game helpers. A language that cannot move a sprite is just a slower way to be annoyed.

```
@canvas
@games

let engine = new Engine({ width: 480, height: 270 })
let spark = engine.sprite("✦", 240, 135, 42)
```

`magic run` runs that file. `magic app` writes an Electron project around it. The window keeps `contextIsolation` on, `nodeIntegration` off, and `sandbox` on. Alpha. It can still change.

MIT. No account. No share-to-unlock. No quiet sponsor hiding in the footer.

The short course is [on the language site](https://thewhitewitchtm.github.io/MAGIC/). The long page, with Studio and Apprentice, is [on The White Witch](https://thewhitewitchtm.github.io/whitewitch/magic/). [MAGIC Studio](https://thewhitewitchtm.github.io/whitewitch/magic/studio/) is the dark window. [MAGIC Apprentice](https://thewhitewitchtm.github.io/whitewitch/magic/apprentice/) is the smaller desk, ages 8 to 16, with the big Run button.

[RETRO MAGIC](#retro-magic) is the other compiler. Same kind of script. The output is BASIC and assembly for three old machines. `@3d` stays here.

### Three repos

The language, the window, and the smaller desk.

{% include repo-links.html %}

<h2 id="retro-magic">🕹️ RETRO MAGIC</h2>

<img class="project-banner" src="{{ '/assets/images/retro-magic.jpg' | relative_url }}" alt="RETRO MAGIC. C64, Apple II, TI-99.">

[MAGIC](#magic) compiles to JavaScript. RETRO MAGIC writes BASIC and assembly for three machines that cannot show a notification.

The Commodore 64, the Apple II, and the TI-99/4A. A script still looks like MAGIC. The C64 and the Apple II share the 6502. The TI-99/4A uses the TMS9900. C64 BASIC is V2, so the listing avoids `ELSE`. Apple BASIC is Applesoft. TI sprite programs are Extended BASIC. Names in the C64 and Apple listings are two characters, and a `REM` line maps them back.

An emoji in a sprite becomes an 8×8 picture. On the C64 that picture is a VIC-II sprite. On the TI-99/4A it is a TMS9918 sprite. The Apple II has no sprite chip, so the same picture is plotted in lo-res.

`@canvas`, `@terminal`, `@sound`, `@hex`, `@games`, and a small text `@ui` stay. `@3d` does not fit these machines. The compiler stops and tells you to drop it.

```
@canvas

let engine = new Engine({ width: 320, height: 200 })
let spark = engine.sprite("✦", 40, 90, 28)
engine.motion(spark, 8, 0)
```

`✦` compiles to the same 8×8 bits on every machine. The note in the listing says where it landed: `VIC-II`, `TMS9918`, or lo-res.

The long page is [RETRO MAGIC](https://thewhitewitchtm.github.io/whitewitch/magic/retro/). The dark window for these three machines is [RETRO Studio](https://thewhitewitchtm.github.io/whitewitch/magic/retro/studio/).

MIT. No account. Alpha. It can still change.

### Two repos

The 8-bit compiler, and the window that runs it.

{% include retro-links.html %}
