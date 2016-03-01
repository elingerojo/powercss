# PowerCSS by Michael S. Mikowski
PowerCSS 0.5.x is **Beta** software.
All primary features are implemented and API should change little through
the official 1.x production release. Documentation, regression testing,
promotion, and examples are being updated in coordination with the library.

## Libraries provide freedom and power
This is a library that strives to be best-in-class. If you are considering
an SPA framework instead, please do read [do you really want an SPA framework?
][0] first.

## Overview
Unleash PowerCSS to create custom styling for every user that visits your
site. PowerCSS uses merging, caching, compression, and double-buffering
to exceed the flexibility and often the speed of static CSS files.
Here is a [presentation](https://www.youtube.com/watch?v=rnkMjzhxw4s) of
some of the PowerCSS concepts in practice.

## Code Style
This library is written in the code style presented in the book
book **Single Page Web Applications - JavaScript end-to-end**
which is available from [Amazon][1] and directly from [Manning][2].
It uses a **git** hook to block any code that fails to pass JSLint and
regression tests. All object keys have an underscore prefix and suffix
like `_this_` which makes them easy targets for compression.

## The Goal
A significant problem with traditional CSS files - whether written by an
expert or someone using {less} or Sass - is that they are **not** written
at run-time. With static CSS, application controlled styling that is
responsive to the user's environment is either limited or
simply not possible.

PowerCSS provides our application the tools to write and apply infinitely
adjustable CSS based on almost any real-time data available to us.
For example, our application could use PowerCSS to adjust styling based on
device orientation, ambient temperature, ambient light, GPS location,
heart rate, or time of day. Traditional static CSS files can't compete with
this flexibility.

We feel that PowerCSS has not only achieved its primary goal, but that
it is often better than static CSS in many other respects as well.
It provides a simple and familiar API where experienced CSS authors
can use their existing skills to be up and running in minutes.
When properly implemented, a PowerCSS solution usually downloads
faster, renders faster after loading, and can speed up some CSS
operations by 10x or more. What's not to like?

Sound exciting? If so, read on! First we implement a few PowerCSS
examples, and then we discuss how PowerCSS works.

## Example 001: The basics
This example is illustrated by `pcss._example001_.html` which
can be be found in the `./examples` directory of the GitHub repository.
Clone the repository and open the file with your browser to see the
results.

The first thing to remember about the PowerCSS API is that it
**never changes our data.** This means if we provide an array or
object or array as an argument to a PowerCSS call, it is **copied**
and we can use it again without fear of it being modified by PowerCSS
at some later time. For the inverse reason, PowerCSS **does not return
pointers to its data**. Instead there is a `_getAssetJson_` method to
get JSON copies of data. This method is very handy for debugging,
but it should be used sparingly in production as it can get expensive.

We were careful to change as little of the existing CSS work-flow as
possible. If we are comfortable with using static CSS, this should look
pretty familiar:

1. Create an HTML document that includes the PowerCSS library and
   JavaScript example code which uses it.
2. Add one or more virtual stylesheet lists (**vsheet**s).
   These look very much like traditional stylesheets modified
   a bit to work "fit" into JSON.
3. Define a **cascade** which includes an ordered list of **vsheets**.
   This is very much like traditional CSS development where we link to
   static stylesheet files in an HTML document.

### 1. Create `pcss._example001_.html` file
Let's create an HTML file named `pcss._example001_.html` to illustrate
the basic capabilities of PowerCSS. A complete copy of this file can
be found in the `examples` directory of the GitHub repository.

```html
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>PowerCSS Example 001</title>
      <script src="../pcss.js"></script>
      <script src="pcss._example001_.js"></script>
      <script>
      window.onload = pcss._example001_;
      </script>
    </head>
    <body>
      <div class="pcss-_logo_" title="PowerCSS"></div>
      <h2>Example 001: The basics</h2>
      <div class="pcss-_box_">PowerCSS 01<br/>
        <input title="name" type="text" placeholder="your name here"/>
      </div>
      <div class="pcss-_box_">PowerCSS 02</div>
      <div class="pcss-_box_">PowerCSS 03</div>
      <!-- add boxes 04-19 here -->
      <div class="pcss-_box_">PowerCSS 20</div>
    </body>
    </html>
```

### 2. Start the `pcss._example001_.js` file
Now let's start a JavaScript file named to `pcss._example001_.js` to
provide PowerCSS directives. A complete copy can of this file can
be found in the `examples` directory of the GitHub repository.

```js
/* pss._example001_.js
 * Example 001 of run-time generated and managed CSS
 * using PowerCSS - the basics
 * Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint        browser : true, continue : true,
  devel : true,  indent : 2,      maxerr : 50,
  newcap : true,  nomen : true, plusplus : true,
  regexp : true, sloppy : true,     vars : false,
  white : true,    todo : true,  unparam : true
*/
/*global pcss */

/*  I. Recommended units: rem and %.
 * II. Recommended order: Outside-In
 *    1. display, visibility, opacity, z-index
 *    2. box-sizing, position, floats, clear
 *    3. top, right, bottom, left and vertical-align
 *    4. margin defs, box-shadow
 *    5. border, border-radius
 *    6. height, width
 *    7. padding, overflow, cursor
 *    8. background, text-align, white-space,
 *    9. content defs - font-size, line-height, font, color everything else
 *    -- break --
 *    10. transition or animation definitions
*/

// BEGIN pcss._example001_
pcss._example001_ = function () {
  var
    base_selector_list,
    box_selector_list
    ;

  pcss._initModule_();
```


We start our module with identification, JSLint settings, and a reminder
of preferred CSS attribute order. Then we declare our function variables,
and finally we initialize the PowerCSS module. And, yes, Virginia, our
code really *does* pass JSLint.

### 3a. Add a 'base' **vsheet**
A virtual stylesheet (**vsheet**) contains the same information as a
traditional CSS file. An experienced CSS author should be able to adopt
the format with little trouble. Below we add a **vsheet** definition to
`pcss._example001_.js` by providing a list of selector definitions:

```js
  // Begin add _base_ vsheet
  base_selector_list = [
    { _selector_str_  : 'body',
      _rule_map_     : {
        _display_    : '_block_',
        _box_sizing_ : '_border_box_',
        _margin_     : '_0_',
        _padding_    : '_2rem_',
        _background_ : '_xddd_',
        _overflow_y_ : '_scroll_',
        _font_family_: '_font_sans_',
        _font_size_  : [ '16px' ],
        _color_      : '_x888_'
      }
    },
    { _selector_str_ : 'input',
      _rule_map_ : {
        _margin_        : '_d5rem_',
        _width_         : [ '10rem' ],
        _border_        : [[ '_d125rem_', '_solid_', '_xddd_' ]],
        _border_radius_ : '_d5rem_',
        _outline_       : '_none_',
        _padding_       : '_d5rem_',
        _background_    : '_x888_',
        _font_size_     : '_1rem_',
        _color_         : '_xddd_'
      }
    },
    { _selector_str_ : 'input:focus',
      _rule_map_   : {
        _border_color_ : '_xfff_',
        _background_   : '_x444_',
        _color_        : '_xfff_'
      }
    },
    { _selector_str_ : '.pcss-_logo_',
      _rule_map_     : {
        _background_image_ : [
          'url(http://mmikowski.github.io/images/2016-02-22-pcss.png)'
        ],
        _background_size_ : '_cover_',
        _width_  : [ '20.75rem' ],
        _height_ : [ '10.125rem' ]
      }
    }
  ];

  pcss._setVsheet_({
    _vsheet_id_     : '_base_',
    _mode_str_      : '_add_',
    _selector_list_ : base_selector_list
  });
// End add _base_ vsheet
```


We provide our selectors in a list because their order is important
in CSS. PowerCSS records the **vsheet** definition, but it doesn't
compile it to CSS yet - that comes later.

### 3b. Add a 'box' **vsheet**
Let's add another **vsheet** to style the boxes on our page:

```js
  // Begin add _box01_ vsheet
  box_selector_list = [
    { _selector_str_ : '.pcss-_box_',
      _rule_lock_list_ : [ '_font_size_' ],
      _rule_map_ : {
        _display_        : '_inline_block_',
        _opacity_        : '_1_',
        _box_sizing_     : '_border_box_',
        _position_       : '_relative_',
        _vertical_align_ : '_top_',
        _margin_         : '_1rem_',
        _box_shadow_     : [[
          [ 'rgba( 0, 0, 0, .5)' ], '_0_', '_0_', '_d25rem_', '_0_'
        ]],
        _border_         : [[ '_d25rem_', '_solid_', '_xeee_' ]],
        _border_radius_  : '_1rem_',
        _width_          : [ '16rem' ],
        _height_         : [ '8rem' ],
        _padding_top_    : '_1rem_',
        _background_     : {
          _alt_list_ : [
            [ '#f85032' ],
            [ '-moz-linear-gradient(left, #f85032 0%, #6d362d 100%)' ],
            [ '-webkit-linear-gradient(left, #f85032 0%, #6d362d 100%)' ],
            [ 'linear-gradient(to bottom, #f85032 0%, #6d362d 100%)' ]
          ]
        },
        _font_size_      : '_1d5rem_',
        _font_weight_    : '_800_',
        _color_          : '_xfff_',
        _text_align_     : '_center_'
      }
    }
  ];

  pcss._setVsheet_({
    _vsheet_id_     : '_box01_',
    _mode_str_      : '_add_',
    _selector_list_ : box_selector_list
  });
  // End add _box01_ vsheet
```


Here we use a few advanced features, but don't get lost in the details.
We clarify the PowerCSS selector later the **Mixin maps** section.
Now that we have two **vsheet**s, we can use them in a **cascade**.

### 4. Add an 'ex01' **cascade**
A **cascade** is used by PowerCSS to create and CSS. As it's name
implies, a **cascade** merges multiple virtual stylesheets (**vsheets**) into
one. This is similar to how a browser merges multiple CSS files when rendering
a static page. However, with PowerCSS we can have many **cascades** and
dynamically update them. Let's add one now:

```js
  // Begin add and use _ex01_ cascade
  pcss._setCascade_({
    _cascade_id_     : '_ex01_',
    _mode_str_       : '_add_',
    _vsheet_id_list_ : [ '_base_', '_box01_' ],
    _regen_type_     : '_use_'
  });
  // End add and use _ex01_ cascade
};
// END pcss._example001_
```

We can now save the `pcss._example001_.js` file. Next, we'll look at the
results.

## A tour of the results
When we open `pcss._example001_.html` in a modern browser, we should
multiple boxes that have been styled according to the **cascade**.
We can view the generated CSS in the browser using the development
tools and modify it as if we had written it ourselves:

```css
/* Begin _base_ style */
body {
  display     : block;
  box-sizing  : border-box;
  padding     : 2rem;
  margin      : 0;
  font-family : arial, helvetica, sans-serif;
  font-size   : 16px;
  color       : #888;
}
input{
  margin        : .5rem;
  width         : 10rem;
  border        : .125rem solid #ddd;
  border-radius : .5rem;
  outline       : none;
  padding       : .5rem;
  background    : #888;
  font-size     : 1rem;
  color         : #ddd;
}
input:focus{
  border-color : #fff;
  background   : #444;
  color        : #fff;
}
/* End _base_ style */

/* Begin _box_ style */
.pcss-_box_ {
  display         : inline-block;
  opacity         : 1;
  box-sizing      : border-box;
  position        : relative;
  vertical-align  : top;
  margin          : 1rem;
  box-shadow      : rgba( 0, 0, 0, .5) 0 0 .25rem 0;
  border          : 0.25rem solid #eee;
  border-radius   : 1rem;
  width           : 16rem;
  height          : 8rem;
  padding-top     : 1rem;
  background      : #f85032;
  background      : -moz-linear-gradient(left, #f85032 0%, #6d362d 100%);
  background      : -webkit-linear-gradient(left, #f85032 0%, #6d362d 100%);
  background      : linear-gradient(to bottom, #f85032 0%, #6d362d 100%);
  font-size       : 1.5rem;
  font-weight     : 800;
  color           : #fff;
  text-align      : center;
}
/* End _box_ style */
```


Of course, if that was all that PowerCSS provided, why bother?
When we need static styling it is certainly simpler to create
traditional CSS files using a nice, comfortable text editor or IDE.
However, when we need our application to change styling based on user
device or any other environmental factor, that's where PowerCSS really
starts to shine.

## Example 002: Double-buffering
This example is illustrated by `pcss._example002_.html` which
can be be found in the `examples` directory of the GitHub repository.
Clone the repository and open the file with your browser to see the
results.

Double-buffering is an common technique to minimize processing and
flicker across many areas of computer graphics. PowerCSS creates two
`style` elements, and switches between them to apply CSS.
PowerCSS never enables a `style` element until the CSS is completely
written to it. This allows us to change all styles on a page with just
one document re-flow, which can be insanely fast compared to changing
styles individually from multiple stylesheets.

PowerCSS is intended to replace **all** stylesheets for an
application. While we can use external sheets for our CSS during
development, we shouldn't need them for production release.
Don't worry, this isn't as drastic as it sounds. PowerCSS
plays very nicely with others and is designed to avoid conflict
with third-party web components.

## Example 003: **Mixin maps**
This example is illustrated by `pcss._example003_.html` which
can be be found in the `examples` directory of the GitHub repository.
Clone the repository and open the file with your browser to see the
results.

### Symbol substitution
A CSS rule declaration looks like the following:

```css
background-color : #fff;
```

The expression to the left of the color we refer to as the rule **key**.
The text after the colon but before the semicolon we refer to as the rule
**value**. Here the key is `color` and the `value` is `#fff`.

Our **vsheets** are defined using *symbol substitution*. That is, we
use a symbol to indicate the actual key and *often* the value instead of
the literal values. For example, to declare background-color, we use:

```js
_background_color_ : '_xfff_'
```

At first glance, that might seem silly. However, using symbols for rule
**keys** and **values** help us greatly when compressing our files.
In the example above, our JavaScript rule can be compressed like so:

```js
nx:'qr'
```

This is 24% of the size of the native CSS (7 vs 29 characters).
And some CSS keys and values can be especially verbose. One downside to
this approach, of course, is we must declare the symbols initially.
The `cssKeyMap` defines our rule **key** symbols in the PowerCSS library
file, `pcss.js`, and `cssValMap` defines our common rule **value** symbols.
**Value** symbols may also be extended with **mixin** maps.

We have compiled a pretty exhaustive list of commonly used keywords and values,
but the rule keys needed will vary depending on project. During development,
if we use a unknown key, a warning is logged to the JavaScript console and
the rule is skipped. One can easily copy these symbols into `pcss.js`
and make sure they are defined in `cssKeyMap` or `cssValMap` as required.

Alternately, when we have completed a project, we use a simple Perl script
to report the number of users for each `_symbol_` across the project.
A symbol that only appears once is not used except for its declaration,
and therefore can be safely deleted, e.g. "pruned."

We are exploring how to improve the initialization of the `cssKeyMap`
and `cssValMap` data. Suggestions are welcome :)

### Rule value substitutions
There are four types of CSS value subsitution supported by PowerCSS:

1. Mixin values : `'_key_'`
2. Literals     : `[ 'literal' ]`
3. Alternates   : `{ _alt_list_ : [ '_key_', [ 'literal' ], ... ] }`
4. Concatenated : `[[ '_key_', [ 'literal' ], ... ]]`

In addition, we can `lock` a rule value in a cascade.

### Setting a **mixin map**
**mixin map**s are settable at the **vsheet**, **cascade**, or global level
as illustrated below:

```js
  // Vsheet option - add
  pcss._setVsheet_({
    _vsheet_id_     : '_base_',
    _mode_str_      : '_add_',
    _selector_list_ : base_selector_list,
    _mixin_map_     : base_mixin_map
  });

  // Vsheet option - change
  pcss._setVsheet_({
    _vsheet_id_     : '_base_',
    _mode_str_      : '_change_',
    _mixin_map_     : base_mixin_map
  });

  // Cascade option - add
  pcss._setCascade_({
    _cascade_id_     : '_ex01_',
    _mode_str_       : '_add_',
    _vsheet_id_list_ : [ '_base_', '_box_' ],
    _mixin_map_      : ex01_mixin_map
  });

  // Cascade option - change
  pcss._setCascade_({
    _cascade_id_     : '_ex01_',
    _mode_str_       : '_change_',
    _mixin_map_      : ex01_mixin_map
  });

  // Global option
  pcss._setGlobalMixinMap_({
    _mixin_id_   : '_base_',
    _mode_str_   : '_add_',
    _mixin_map_  : global_mixin_map,
  });
```

A **mixin map** is simple key-value pair object as illustrated below:

```js
  // Example mixin map
  mixin_map = {
    _body_font_size_  : '16px',
    _body_font_color_ : '#a44',
    _input_width_     : '10rem',
    _input_border_    : '.125rem solid #ddd'
  };
```

We can get a copy of a **mixin map** using `_getAssetJson_`.

### The four type of **mixin map**s
PowerCSS uses values from four **mixin map** types:

1. The **builtin** value map, `cssValMap`. This is a set of common
   CSS values that are available by default. For example, the symbol
   `_fixed_` resolves to 'fixed' in the resulting CSS. This map is
   found in the the PowerCSS library file, `pcss.js`.
2. The **global mixin map** is used across all **cascades** and, as
   a consequence, by all **vsheets** they use.
3. **Cascade mixin map**s are exclusive to one **cascade** and
   are used by all **vsheets** in their cascade list.
4. **Vsheet mixin map**s are exclusive to one **vsheet**.

### **mixin map** precedence
The precedence of these **mixin map**s (also known as a 'scope chain')
is as follows:

```bash
  vsheet > cascade > global > builtin
```

This means that **vsheets** mixin values have priority over **cascade**
mixin values which have priority over **global** mixin values which have
priority over **builtin** values. Think of this as "the last match
wins." Consider the following PowerCSS rule definition:

```js
  rule_map : { background : '_bcolor_', ... }
```

Now let's define **mixin map** values at three levels.
In pseudo code, it looks something like this:

```js
  builtin._bcolor_ = undefined;
  global._bcolor_  = 'red';
  cascade._bcolor_ = 'green';
  vsheet._bcolor_  = 'blue';
```

Here the **vsheet** level value, 'blue', "wins" and the CSS processor
will use *that* instead of any **cascade**, **global**, or **builtin** value.
In other words, the resulting CSS will read `background:blue`.

What if we have multiple **vhseet**s that set `_bcolor_`? Easy: the last
vsheet in the cascade to set `_bcolor_` wins unless the value has been
**locked** earlier in the **cascade** - see the **Locked values**
section below.

What if we used a **vsheet** that didn't have a mixin map? Then
the mixin value would be defined at just two levels:

```js
  builtin._bcolor_ = undefined;
  global._bcolor_  = 'red';
  cascade._bcolor_ = 'green';
  vsheet._bcolor_  = undefined;
```

Here the **cascade** level value will "win" and the CSS generator
will use 'green' instead of any **global** or **builtin** value.
And so on. If the value is still undefined at the end of the scope chain,
a warning is issued and the property (`background`, in this case) is skipped.

An astute reader will notice that a **vsheet** can be used across many
**cascades** which is a powerful capability. However, do keep this in
in mind when setting **mixin map**s at the **vsheet** level.

### Literal values
Literal values are just that: a string we want to use as-is. Simply wrap any
string in an array to have it read as a literal, as illustrated below:

```js
  rule_map : { background : [ 'blue' ], ... }
```

We use an array wrapper as a literal array wrapper so that PowerCSS does not
rely on symbol names to determine how to parse values. This makes it makes it
compressor friendly.

### Alternate values
Sometimes we want to provide alternate rules for a style so that
our code will work across multiple browsers. In this case, we can
wrap all alternate values in an object with an `_alt_list_` property.

```js
  { _selector_str_ : 'body',
    rule_map : {
      _background_ : {
        _alt_list_ : [
          '_xfff_',
          [ '#f85032' ],
          [ '-moz-linear-gradient(left, #f85032 0%, #6d362d 100%)' ],
          [ '-webkit-linear-gradient(left, #f85032 0%, #6d362d 100%)' ],
          [ 'linear-gradient(to bottom, #f85032 0%, #6d362d 100%)' ]
        ]
      }
    }
  }
```


The resulting CSS:

```css
background : #fff;
background : #f85032;
background : -moz-linear-gradient(left, #f85032 0%, #6d362d 100%);
background : -webkit-linear-gradient(left, #f85032 0%, #6d362d 100%);
background : linear-gradient(to bottom, #f85032 0%, #6d362d 100%);
```

We are not limited literal values as the us of the builtin mixin key
like `_xfff_` shows. We could even define the entire alternatives map
as a mixin, like so:

```js
  mixin_map = {
    _global_red_grad_map_ : {
      _alt_list_ : [
        '_xfff_',
        [ '#f85032' ],
        [ '-moz-linear-gradient(left, #f85032 0%, #6d362d 100%)' ],
        [ '-webkit-linear-gradient(left, #f85032 0%, #6d362d 100%)' ],
        [ 'linear-gradient(to bottom, #f85032 0%, #6d362d 100%)' ]
      ]
    }
  };
```

... and replace the above declaration in the **vsheet** definition. If we
use gradient many times, we save lots of space, especially after compression.
Because now everywhere we want to use it, the line declaration becomes:

```js
      _background_ : '_global_red_grad_map_'
```

This compresses to something like the following, which is 2.9% the size
of the minimized CSS equivalent:

```js
ck:'_r'
```

Remember the order of alternatives in CSS is important: the last supported
declaration will always be used.

### Concatenated values
Sometimes we want to use multiple literal or key values as a single string,
usually separated by a space. For this we use a "double list" technique:

```js
  { _selector_str_ : 'li',
    _rule_map_ : {
      _border_ : [[ '_d125rem_', '_solid_' [ '#f85032' ] ]],
      ...
    }
  }
```

This is very similar to alternate values. The resulting CSS should
look like this.

    border : .125rem solid #f85032

We can use builtin, mixin and literal values, as the example above shows.

### Locked values
Typically in a cascade, the last property value in "wins". However, it
is feasible to prevent overwriting critical properties later
in the cascade. One just needs to specify rules to be locked for
the provided rule map in the **vsheet** definition:

    box_selector_list = [
      { _select_str_ : '.pcss-_box_',
        _locked_rule_list_ : [ '_font_size_' ],
        _rule_map_ : {
          _font_size_ : '16px'
          // ...
        }
      }
    ];

This prevents any later **vsheet** from overriding the value for
`_font_size_` for the `.pcss-_box_` selector in the cascade.

An astute reader will again notice that a **vsheet** can be used across
many **cascades**. Please keep this in mind when locking rule values.

## Example 004: Compression
This example is illustrated by `pcss._example004_.html` which
can be be found in the `examples` directory of the GitHub repository.
Clone the repository and open the file with your browser to see the
results.

CSS uses long keywords and values, and is often quite repetitive.
A PowerCSS solution can often be compressed to a fraction of the size
of minimized CSS. Consider the example above where we created the
`_global_red_grad_map__` symbol.  The initial definition required 276
characters, or 113% of minimized CSS. However, if we use this symbol
more than once, we come out far ahead, as the compressed PowerCSS
representation is only 2.9% the size of the minimized CSS.  If we use
the gradient 3 times, the PowerCSS representation is 39.5% the size of
minimized CSS. If we use it 5 times, the PowerCSS representation is
less than 25% the size.

PowerCSS code and modules that use it can be highly compressed thanks to
the use of easily recognized symbols that start and end in an underscore like
`_css_str_`. After concatenating all JavaScript files in our project,
we can replace these symbols with unique tokens, using the shortest tokens
for the most common symbols. We call this the **SuperPack** technique, and
we can often reduce file size to 50% of `UglifyJS` alone.

In Example 004, the PowerCSS library and the CSS directives were reduced to
30% of their original size, and to 15% when using the SuperPack" technique
described above.

## Example 005: Performance
This example is illustrated by `pcss._example005_.html` which
can be be found in the `examples` directory of the GitHub repository.
Clone the repository and open the file with your browser to see the
results.

We have taken great care to ensure PowerCSS is as fast, or sometimes
even faster than static CSS. We calculate the cascades in
software and only provide to the browser a single optimized stylesheet
to render. The browser rendering engine doesn't need to work loading
and merging sometimes dozens of external style sheets. It also
removes the expensive associated HTTP requests for external stylesheets.

PowerCSS uses incremental processing to minimize stutter. By default, when
we add a **vsheet** PowerCSS has almost no overhead. When we add a
**cascade** some processing time is spent creating the merged selector
list and the merged **mixin map**. Only when we use a **cascade**
does the final CSS get written and presented to the browser for processing.

This default behavior is changeable too:  The `_setVsheet_`,
`_setCascade_`, and `_setGlobalMixinMap_` methods all accept
a `_regen_type_` parameter which defines how far to proceed
with processing on **all cascades** affected by the method call.
For this reason, we tread carefully when using `_setVsheet_` and
`_setGlobalMixinMap_` methods as it may trigger processing across
many **cascades**.

```bash
_regen_type_ value means for the affect cascades:
  '_none_'      : no processing now
  '_merge_'[1]  : Merge selector lists and mixin maps now
  '_prepare_'   : Merge and create CSS now
  '_all_'[2]    : Merge, create CSS, and if the cascade is currently
                  active, double-buffer switch to the new CSS.
  '_use_'       : Double-buffer switch to new CSS of this cascade[3]

  [1] _merge_ This is the default when adding vsheets and cascades
  [2] _all_   This is the default when changing vsheets and cascades
              It is also the default for _setGlobalMixinMap_
  [3] _use_   This is only available for _setCascade_
```

The processing required to use a **cascade** is not enormous, and it
**must** be accomplished before we use it. If we delay all processing
until then, all the processing steps will be undertaken before showing
the newly generated CSS. Depending on your CSS and application needs, this
may be a perfectly suitable strategy.

We recommend sticking with the defaults until and if we see performance issues.
Depending on the application, setting `_regen_type_` to `_all_` for all
**vsheets** and **cascades** may make the most sense. For others, setting
`regen_type` to `none` and then directing all processing steps will provide
the best solution. Here is an example:

```js
  // Initial definition of cascade
  pcss._setCascade_({
    _cascade_id_     : '_ex01_',
    _mode_str_       : '_add_',
    _vsheet_id_list_ : [ '_base_', '_box_' ],
    _mixin_map_      : ex01_mixin_map,
    _regen_type_    : '_none_'
  });

  // Vsheet _selector_list_ change
  pcss._setVsheet_({
    _vsheet_id_     : '_base_',
    _mode_str_      : '_change_',
    _selector_list_ : base_selector_list,
    _regen_type_    : '_none_'
  });

  // Vsheet _mixin_map_ change
  base_mixin_map._red01_ = '#822';
  pcss._setVsheet_({
    _vsheet_id_     : '_base_',
    _mode_str_      : '_change_',
    _mixin_map_     : base_mixin_map,
    _regen_type_    : '_none_'
  });

  // Cascade _mixin_map_ change
  ex01_mixin_map._box_position_ = 'fixed';
  pcss._setCascade_({
    _cascade_id_ : '_ex01_',
    _mode_str_   : '_change_'
    _mixin_map_  : ex01_mixin_map
    _regen_type_ : '_none_'
  });

  // Process step 1: perform merge
  pcss._setCascade_({
    _cascade_id_ : '_ex01_',
    _mode_str_   : '_change_'
    _regen_type_ : '_merge_'
  });

  // Process step 2: create CSS
  pcss._setCascade_({
    _cascade_id_ : '_ex01_',
    _mode_str_   : '_change_'
    _regen_type_ : '_prepare_'
  });

  // Process step 3: write CSS to style el and enable
  pcss._setCascade_({
    _cascade_id_ : '_ex01_',
    _mode_str_   : '_change_'
    _regen_type_ : '_use_'
  });
```

The current `_regen_type_` default may change prior to the 1.x release
if test results warrant it.

## The PowerCSS cookbook
No matter how clean an API, sometimes its easier to think in terms
of "what do we want to accomplish."  This is perhaps the reason
programming language "cookbooks" have been so successful over the
years. Let's look at some popular recipes from our own JavaScript kitchen.

### Virtual stylesheet (**vsheet**) recipies
#### Add a **vsheet**

```js
  pcss._setVsheet_({
    _vsheet_id_     : '_base_',
    _mode_str_      : '_add_',
    _selector_list_ : [...],
    _mixin_map_     : {...}
  });
```

#### Change a **vsheet** selector list

```js
  pcss._setVsheet_({
    _vsheet_id_     : '_base_',
    _mode_str_      : '_change_',
    _selector_list_ : [...]
  });
```

#### Change a **vsheet** mixin map

```js
  pcss._setVsheet_({
    _vsheet_id_     : '_base_',
    _mode_str_      : '_change_',
    _mixin_map_     : {...}
  });
```

#### Delete only the vsheet selector list
Deleting a selector list independently is not supported.
However, one may change the `_selector_list_` to an empty array
for a similar effect. Setting the value to `undefined` will
not work.

```js
  pcss._setVsheet_({
    _vsheet_id_     : '_base_',
    _mode_str_      : '_change_',
    _selector_list_ : []
  });
```

#### Delete only the vsheet mixin map
Deleting a vsheet mixin map independently is not supported.
However, one may change `_mixin_map_` to an empty object
for a similar effect. Setting the value to `undefined` will
not work.

```js
  pcss._setVsheet_({
    _vsheet_id_ : '_base_',
    _mode_str_  : '_change_',
    _mixin_map_ : {}
  });
```

#### Delete an entire **vsheet**
Recall that deleting a single **vsheet** will redfine all
**cascades** that use it. Setting `_regen_type_` to
`_none_` will ensure no processing will take place as a result
of this call, whereas setting it to `_all_` will result in
all **cascades** being processed as fully is possible.
If an active cascade is currently in use, it will double-buffer
switched to the updated CSS as soon as it is ready.

```js
  pcss._setVsheet_({
    _vsheet_id_  : '_base_vsheet',
    _mode_str_   : '_delete_',
    _regen_str_  : '_none_'
  });
```

#### Copy an entire **vsheet**

```js
  pcss._getAssetJson_({
    _asset_type_ : '_vsheet_'
    _asset_id_   : '_base_'
  });
```

#### Copy the selector list of a **vsheet**

```js
  pcss._getAssetJson_({
    _asset_type_    : '_vsheet_'
    _asset_subtype_ : '_selector_list_'
    _asset_id_      : '_base_'
  });
```

#### Use the same selector list to define multiple **vsheets**
Because PowerCSS never changes our data, we can create a
selector list definition, use it to create a **vsheet**, modify it,
and then use it to create another, **vsheet**. This process can be repeated
indefinitely. Here is an example:

```js
  // Define _box01_ vsheet
  box_selector_list = [
    { _selector_str_   : '.pcss-_box_',
      _rule_lock_list_ : [ '_font_size_' ],
      _rule_map_ : {
        _display_        : '_inline_block_',
        _opacity_        : '_1_'
      }
    }
  ];
  pcss._setVsheet_({
    _vsheet_id_     : '_box01_',
    _mode_str_      : '_add_',
    _selector_list_ : box_selector_list
  });

  // Modify and create _box01_ vsheet
  pcss._extendRuleMap( box_selector_list, { _color_ : '_x444_' } );
  pcss._setVsheet_({
    _vsheet_id_     : '_box02_',
    _mode_str_      : '_add_',
    _selector_list_ : box_selector_list
  });
```

### **Cascade** recipes

#### Add a new **cascade**

```js
  pcss._setCascade_({
    _cascade_id_      : '_ex01_',
    _mode_str_        : '_add_',
    _vsheet_id_list_  : [ '_base_', '_box_' ]
    _mixin_map_       : {...}
  });
```

#### Change a **cascade** vsheet id list

```js
  pcss._setCascade_({
    _cascade_id_     : '_ex01_',
    _mode_str_       : '_change_',
    _vsheet_id_list_ : [...]
  });
```

#### Change a cascade mixin map

```js
  pcss._setCascade_({
    _cascade_id_     : '_ex01_',
    _mode_str_       : '_change_',
    _mixin_map_      : {...}
  });
```

#### Delete only a vsheet id list from a **cascade**
Deleting a vsheet ID list independently is not supported.
However, one may change the `_vsheet_id_list_` to an empty array
for a similar effect. Setting the value to `undefined` will
not work.

```js
  pcss._setCascade_({
    _cascade_id_     : '_ex01_',
    _mode_str_       : '_change_',
    _vsheet_id_list_ : []
  });
```


#### Delete only a mixin map from a **cascade**
Deleting a mixin map independently is not supported.
However, one may change the `_mixin_map_` to an empty array
for a similar effect. Setting the value to `undefined` will
not work.

```js
  pcss._setCascade_({
    _cascade_id_     : '_ex01_',
    _mode_str_       : '_change_',
    _mixin_map_      : {}
  });
```

#### Delete an entire **cascade**
Deleting a cascade will only affect that cascade, so setting
`_regen_type_` has no affect. If a cascade is in-use,
the styling will be removed.

```js
  pcss._setCascade_({
    _cascade_id_ : '_ex01_',
    _mode_str_   : '_delete_'
  });
```

#### Prepare a **cascade** so the CSS is ready to use

```js
  pcss._setCascade({
    _cascade_id_ : '_ex01_',
    _mode_str_   : '_change_',
    _regen_type_ : '_prepare_'
  }
```

#### Use a **cascade**

```js
  pcss._setCascade({
    _cascade_id_ : '_ex01_',
    _mode_str_   : '_change_',
    _regen_type_ : '_use_'
  }
```

#### Copy an entire **cascade**

```js
  pcss._getAssetJson_({
    _asset_type_    : '_cascade_'
    _asset_id_      : '_ex01_'
  });
```

#### Copy just the vsheet id list of a **cascade**

```js
  pcss._getAssetJson_({
    _asset_type_    : '_cascade_'
    _asset_subtype_ : '_vsheet_id_list_'
    _asset_id_      : '_ex01_'
  });
```

### General recipes

#### Disable PowerCSS

```js
  pcss._togglePcss_( false );
```

#### Enable PowerCSS

```js
  pcss._togglePcss_( true );
```

#### Toggle PowerCSS

```js
  pcss._togglePcss();
```

#### Change the global mixin map

```js
  pcss._setGlobalMixinMap_({ _mixin_map_ : { ... } });
```


## API reference 0.5.x
### `_initModule_`

```js
     Example   : pcss._initModule_({ _style_el_prefix_ : 'tri' });
     Purpose   : Initializes style elements using the provided prefix.
     Arguments : _style_el_prefix_ :
                 Optional: A prefix to name-space the two style elements.
                 If not provided, the prefix 'pcss' will be used.
     Settings  : none
     Throws    : A string error object if style elements already exist
     Returns   : --
```

### `_extendRuleMap_`

```js
     Example   : pcss._extendRuleMap_( rule_map, { _color_ : '_x444_' } );
     Purpose   : A utility to extend a rule_map with new or revised
                 values. Providing a value of 'null' deletes a key.
                 pcss._extendRuleMap_( rule_map, { _color_ : null } );
     Arguments : (positional)
                 0 : base_map   - the map to be extended
                 1 : extend_map - the map containing new key-value pairs
     Settings  : none
     Throws    : none
     Returns   : none
       - base_map is modified.
       - extend_map is not.
```

### `_setGlobalMixinMap_`

```js
     Example   : pcss._setGlobalMixinMap_({
                   _mode_type_       : 'add',
                   _mixin_map_       : mixin_map,
                   _regen_type_      : '_merge_'
                 });
     Purpose   : Add, change, delete, or update process status for
                 a global mixin map id.
     Arguments :
       - _mode_type_  (req) '_add_', '_change_', or '_delete_'
       - _mixin_map_  (opt)
       - _regen_type_ (opt) '_none_', '_merge_', '_prepare_', or '_all_'
     Settings  : none
     Throws    : none
     Returns   : The number of vsheets affected by the change
```

### `_togglePcss_`

```js
     Example   : pcss._togglePcss_( true );
     Purpose   : Enable or disable PowerCSS
     Arguments :
       - boolean (optional)
         If not provided, will toggle PowerCSS on or off.
         If provided, true will turn PowerCSS on, and false
           will turn PowerCSS off.
     Settings  : none
     Throws    : none
     Returns   : true (enabled) or false (disabled)
```

### `_getAssetIdList_`

```js
     Example   : vsheet_id_list = pcss._getAssetIdList_({
                   _asset_type_ : '_vsheet_'
                 });
     Example   : cascade_id_list = pcss._getAssetIdList_({
                   _asset_id_ : '_cascade_'
                 });
     Purpose   : Return the list of all vsheets or cascades.
```

### `_getAssetJson_`

```js
     Example   : pcss._getAssetJson_({
                   _asset_id_      : '_example001_',
                   _asset_type_    : '_cascade_'
                   _asset_subtype_ : '_vsheet_id_list_'
                 })
     Purpose   : Return a JSON snapshot of a vsheet or cascade.
     Arguments : _asset_id_ (req) The existing ID of either a cascade
                  or a vsheet.
                 _asset_type_ (req) '_vsheet_', '_cascade_',
                   '_global_mixin_', '_el_cascade_list_',
                 _asset_subtype_ (opt)
                   '_vsheet_' supports:
                      _vsheet_id_,    _selector_list_,
                      _selector_ms_,  _mixin_map_,
                      _mixin_ms_
                   '_cascade_' supports
                      _cascade_id_,       _vsheet_id_list_
                      _vsheet_ms_,        _mixin_map_
                      _mixin_ms_,         _merged_selector_list_
                      _merged_mixin_map_, _merged_selector_ms_
                      _css_str_          _css_ms_
     Settings  : none
     Throws    : none
     Returns   : A JSON string of the requested asset.
                 If there is no corresponding asset, the JSON string
                 returned is 'undefined'.
```

### `_setVsheet_`
See **The PowerCSS cookbook** section to see how `_setVsheet_`
may be used to accomplish common tasks.

```js
     Example   : pcss._setVsheet_({
                 _setVsheet_({
                   _vsheet_id_     : '_base_',
                   _mode_str_      : '_add_',
                   _selector_list_ : [...],
                   _mixin_map_     : {...},
                   _regen_type_    : '_merge_'
                 });
     Purpose   : Adds, changes, or deletes a vsheet
     Arguments : _vsheet_id_    (req) The ID for a vsheet
                 _mode_str_     (req) '_add_', '_change_', or '_delete_'
                 _selector_list (opt) List of selectors this vsheet will
                   represent in PowerCSS format.
                 _mixin_map_    (opt) The mixin_map for this vsheet.
                 _regen_type_   (opt) '_none_', '_merge_', '_prepare_',
                                      or '_all_'
     Settings  : none
     Throws    : none
     Returns   : vsheet_id, or undef on failure
```

### `_setCascade_`
See **The PowerCSS cookbook** section to see how `_setCascade_`
may be used to accomplish common tasks.

```js
     Example   : pcss._setCascade_({
                   _cascade_id_     : '_base_',
                   _mode_str_       : '_add_',
                   _vsheet_id_list_ : [...],
                   _mixin_map_      : {...},
                   _regen_type_     : '_merge_'
                 });
     Purpose   : Adds, changes, or deletes a cascade
     Arguments : _cascade_id_     (req) The ID for a cascade
                 _mode_str_       (req) '_add_', '_change_', or '_delete_'
                 _vsheet_id_list_ (opt) List of vsheet ids in order of
                   application.
                 _mixin_map_      (opt) The mixin_map for this cascade.
                 _regen_type_     (opt) '_none_', '_merge_', '_prepare_',
                                      or '_all_'
     Settings  : none
     Throws    : none
     Returns   : cascade_id, or undef on failure
```

## Regression tests
TODO

## Compatibility
Confirmed to work on Chrome 48, Safari 9, Firefox 44, IE 9+,
and Edge browsers. We expect it to work on much earlier versions of
Chrome, Safari, and Firefox, but have yet to determine how low we can go.

## Release Notes
### Copyright (c)
2016 Michael S. Mikowski (mike[dot]mikowski[at]gmail[dotcom])

### License
MIT

### Version 0.1.x
- 0.1.x development phase complete.
- First "public release" versions of PowerCSS with a working example.
- See prior revisions of this document for more detail.

### Version 0.2.x
- 0.2.x development phase complete.
- Added double-buffering support and example
- See prior revisions of this document for more detail.

### Version 0.3.x
- 0.3.x development phase complete.
- API changes
- Added mixin support at 4 levels
- Reverted to true double-buffering ( only 2 style elements )
- See prior revisions of this document for more detail.

### Version 0.4.x
- 0.3.x development phase complete.
- API changes
- Added **API reference** section
- See prior revisions of this document for more detail.

### Version 0.5.x
- Refactored and greatly simplify API
- Implemented time-based minimal processing
- Added `_regen_type_` option to manage CSS generation processing
- Added **Recipes** section
- Added **API reference** section
- Added `_getAssetIdList_`
- Restructured project and launched powercss.org
- Added Performance example (005)
- Added bower.json
- WIP Add inline API docs to code

### Version 0.6.x
- TODO: nodejs support, especially with nodeunit-b
- TODO: Compatibility test to earlier versions of Chrome and firefox

### Version 0.7.x
- TODO: regression tests
- TODO: error handling improvements as needed

### Version 1.x
- TODO: Production-ready code

## Similar Projects
[absurdjs][3], [responsive.j$][4]

## Contribute!
If you want to help out, like all jQuery plugins this is hosted at
GitHub. Any improvements or suggestions are welcome!
You can reach me at mike[dot]mikowski[at]gmail[dotcom].

## End
[0]:http://mmikowski.github.io/no-frameworks
[1]:http://www.amazon.com/dp/1617290750
[2]:http://manning.com/mikowski
[3]:http://absurdjs.com/
[4]:http://www.responsivejs.com/

