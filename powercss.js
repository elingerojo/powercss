/*
 * powercss.js
 * Base class for JS-driven CSS
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
 */
/*jslint       browser : true, continue : true,
 devel : true,  indent : 2,      maxerr : 50,
 newcap : true,  nomen : true, plusplus : true,
 regexp : true, sloppy : true,     vars : false,
 white : true,    todo : true,  unparam : true
 */
/*global jQuery*/

// # PowerCSS by Michael S. Mikowski
// Feel the power of run-time CSS! Create run-time-defined, 
// highly compressible, extremely fast, infinitely adjustable,
// optimized, and double-buffered CSS without any files. 
// https://www.youtube.com/watch?v=rnkMjzhxw4s.

// # Getting started (bottom-up)
//
// # How it works (top-down)
//
// ## One active StyleSheet object
// PowerCSS under our control creates and maintains
// an active StyleSheet Object which is meant to replace
// **all** of our other site stylesheets.  While it is
// possible to still *have* other stylesheets,
// the goal of PowerCSS is to make them obsolete and 
// unnecessary, at least once our app hits production.
//
// The beauty of this approach is that our app can run
// much faster, because our style cascade is computed once
// in software and then presented in the one active
// StyleSheet object. Many redundancies are when creating
// this object too.  As a result, the web rendering engine
// can use just one single optimised StyleSheet Object instead
// of juggling sometimes dozens of sheets. We gain even more
// performance because separate CSS files are eliminated,
// and PowerCSS definitions compress *much* better than
// standard CSS.
//
// Third-party web components will, of course, provide
// their own stylesheets, and their sheets should integrate
// well with PowerCSS.
//
// ## Multiple StyleSheet objects
// We can create multiple PowerCSS StyleSheet objects even though
// only one will be active at any time.  These have, by default, the IDs
// of pcss-0 and pcss-1, ... pcss-N.  If there is a conflict with
// other DOM IDs, we can change the prefix using 
// `pcss._setSheetIdPrefix_( 'pre-' );`. This must be called *before*
// any other methods, or it will throw a nasty exception.
//
// ## Adding a StyleSheet object
// StyleSheet objects are added like so:
//
//    obj_idx = pcss._addStyleSheetObj_(
//      [ '_vsheet_0_', '_vsheet_2_', ... ],
//    );
//
// The index number of the created object is returned.
// The method requires a list of virtual sheets, or VSheets as we call
// them.  These contain the same information as a traditional CSS file.
// We will describe how to add these shortly.
//
// ## Enabling a StyleSheet object
// We can enable a defined StyleSheet object using
// `pcss._enableSheetObj_( 0 );`.  This will disable 
// any previously enabled sheet object (if any) and enable
// the first one.  We can use this capability for double,
// tripple, or n-level buffering.  Using StyleSheet Object
// switching can much faster than adjusting indivdual CSS
// values since it results in just one single document reflow.
// In some cases, the performance increase can be 10x or greater!
//
// ## Create your VSheet
// Virtual sheets hold the same information as a traditional CSS file.
// We may, for example, want to create a VSheet called '_base_css_'.
// We can do this using the 
//
//
// ## Writing a StyleSheet Object
//   - Add a VSheet
//   - Create a merged sheet using a list of vsheets (cached)
//   - Assign to a defined and disabled SS Object (either new(add) or existing)
//   - Enable the SS Object by index
//
//   - Need ability to recalc existing sheet (e.g. if mixin_map changes, see
//   below)
//
//  Properties:
//
//    mixin_map = { ... custom defined mixins ... }
//    Consider JSON.stringify() and then hash 'snapshot' to determine if mixin_map
//    has changed between when a SS Object was last used
//    and when it is being re-enabled.  If so, recalculate CSS and
//    reload the SS Object before re-enabling.
//
//    mixin_map property values are checked first, then
//    default css_value_map. All lookup values have this form: '_.*_'
//    All other properties are literals.
//    Use method: **_setMixinMap_** also **_rmMixinMap_**;
//    possibly **_updateMixinMap_** (try to avoid, though).
// 
// Think of this like the stylesheet list in html:
// merge0VSheetList = [ '_base_css_list_', '_mktg_style_' ];
//
/
//
// var lbSelectList = [
//    { _select_str_ : '#ao-_lb_', // literal
//      _rule_map_ : {
//        _display_       : '_block_',    // lookup mixin then stock
//        _opacity_       : '_0_',        // lookup
//        _position_      : '_absolute_', // lookup
//        _border_        : '0.125rem solid #aaa',
//        _border_radius_ : '.375rem .375rem 0 0',
//        _box_shadow_    : 'rgba(0, 0, 0, .14) 0 0 .625rem .375rem',
//        _background_    : '_xfff_',     // lookup
//        _z_index_       : '36',
//        _transition_    : 'opacity .3s ease'
//      },
//      end_... (see ref document)
//    },

var pcss = (function () {
  var
    __String    = String,
    __blank     = '',
    __docRef    = document,
    __false     = false,
    __isArray   = Array.isArray,
    __logError  = console.error,
    __true      = true,

    __0         = 0,
    __1         = 1,
    __2         = 2,
    __n1        = -1,

    vMap = {
      _array_          : 'array',
      _object_         : 'object',
      _string_         : 'string',
      _appendChild_    : 'appendChild',
      _createElement_  : 'createElement',
      _createTextNode_ : 'createTextNode',
      _cssText_        : 'cssText',
      _disabled_       : 'disabled',
      _getElById_      : 'getElementById',
      _hasOwnProp_     : 'hasOwnProperty',
      _head_           : 'head',
      _id_             : 'id',
      _innerText_      : 'innerText',
      _join_           : 'join',
      _length_         : 'length',
      _push_           : 'push',
      _setAttribute_   : 'setAttribute',
      _textContent_    : 'textContent',
      _text_           : 'text',
      _text_css_       : 'text/css'
    },

    topSmap = {
      _sheet_id_prefix_ : 'pcss-',
      _style_el_list_ : [],
      _style_el_idx_  : __n1
    },

    cssKeyMap = {
      __moz_box_sizing_            : '-moz-box-sizing',
      __webkit_font_smoothing_     : '-webkit-font-smoothing',
      __webkit_overflow_scrolling_ : '-webkit-overflow-scrolling',
      __webkit_user_select_        : '-webkit-user-select',
      __moz_user_select_           : '-moz-user-select',
      __o_user_select_             : '-o-user-select',

      _animation_              : 'animation',
      _background_             : 'background',
      _background_color_       : 'background-color',
      _background_image_       : 'background-image',
      _background_position_    : 'background-position',
      _background_repeat_      : 'background-repeat',
      _background_size_        : 'background-size',
      _baseline_               : 'baseline',
      _body_                   : 'body',
      _border_                 : 'border',
      _border_btm_             : 'border-bottom',
      _border_btm_color_       : 'border-bottom-color',
      _border_btm_width_       : 'border-bottom-width',
      _border_collapse_        : 'border-collapse',
      _border_color_           : 'border-color',
      _border_left_            : 'border-left',
      _border_left_color_      : 'border-left-color',
      _border_left_width_      : 'border-left-width',
      _border_radius_          : 'border-radius',
      _border_right_           : 'border-right',
      _border_right_color_     : 'border-right-color',
      _border_right_width_     : 'border-right-width',
      _border_spacing_         : 'border-spacing',
      _border_style_           : 'border-style',
      _border_top_             : 'border-top',
      _border_top_color_       : 'border-top-color',
      _border_top_left_radius_ : 'border-top-left-radius',
      _border_top_width_       : 'border-top-width',
      _border_width_           : 'border-width',
      _bottom_                 : 'bottom',
      _box_shadow_             : 'box-shadow',
      _box_sizing_             : 'box-sizing',
      _clear_                  : 'clear',
      _clip_                   : 'clip',
      _color_                  : 'color',
      _cursor_                 : 'cursor',
      _display_                : 'display',
      _empty_cells_            : 'empty_cells',
      _fill_                   : 'fill',
      _float_                  : 'float',
      _font_family_            : 'font-family',
      _font_size_              : 'font-size',
      _font_style_             : 'font-style',
      _font_weight_            : 'font-weight',
      _height_                 : 'height',
      _left_                   : 'left',
      _line_height_            : 'line-height',
      _list_style_position_    : 'list-style-position',
      _list_style_type_        : 'list-style-type',
      _margin_                 : 'margin',
      _margin_btm_             : 'margin-bottom',
      _margin_left_            : 'margin-left',
      _margin_right_           : 'margin-right',
      _margin_top_             : 'margin-top',
      _max_height_             : 'max-height',
      _max_width_              : 'max-width',
      _min_height_             : 'min-height',
      _min_width_              : 'min-width',
      _opacity_                : 'opacity',
      _outline_                : 'outline',
      _overflow_               : 'overflow',
      _overflow_x_             : 'overflow-x',
      _overflow_y_             : 'overflow-y',
      _padding_                : 'padding',
      _padding_btm_            : 'padding-bottom',
      _padding_left_           : 'padding-left',
      _padding_right_          : 'padding-right',
      _padding_top_            : 'padding-top',
      _position_               : 'position',
      _resize_                 : 'resize',
      _right_                  : 'right',
      _src_                    : 'src',
      _stroke_                 : 'stroke',
      _stroke_opacity_         : 'stroke-opacity',
      _stroke_width_           : 'stroke-width',
      _text_align_             : 'text-align',
      _text_decoration_        : 'text-decoration',
      _text_indent_            : 'text-indent',
      _text_overflow_          : 'text-overflow',
      _top_                    : 'top',
      _transition_             : 'transition',
      _user_select_            : 'user_select',
      _vertical_align_         : 'vertical-align',
      _visibility_             : 'visibility',
      _white_space_            : 'white-space',
      _width_                  : 'width',
      _z_index_                : 'z-index'
    },

    // css keyword values
    cssValMap = {
      __moz_none_     : '-moz-none',
      _0_             : '0',
      _1_             : '1',
      _1rem_          : '1rem',
      _2rem_          : '2rem',
      _3rem_          : '3rem',
      _50p_           : '50%',
      _100p_          : '100%',
      _400_           : '400',
      _800_           : '800',
      _xfff_          : '#fff',
      _absolute_      : 'absolute',
      _antialiased_   : 'antialiased',
      _auto_          : 'auto',
      _block_         : 'block',
      _border_box_    : 'border-box',
      _both_          : 'both',
      _center_        : 'center',
      _center_center_ : 'center center',
      _clip_          : 'clip',
      _collapse_      : 'collapse',
      _contain_       : 'contain',
      _content_box_   : 'content-box',
      _cover_         : 'cover',
      _default_       : 'default',
      _disc_          : 'disc',
      _ellipsis_      : 'ellipsis',
      _fixed_         : 'fixed',
      _font_fixed_    : 'courier, fixed',
      _font_sans_     : 'helvetica, arial, sans-serif',
      _hidden_        : 'hidden',
      _important_     : ' !important',
      _inherit_       : 'inherit',
      _inline_block_  : 'inline-block',
      _italic_        : 'italic',
      _left_          : 'left',
      _line_through_  : 'line-through',
      _middle_        : 'middle',
      _move_          : 'move',
      _no_repeat_     : 'no-repeat',
      _none_          : 'none',
      _normal_        : 'normal',
      _nowrap_        : 'nowrap',
      _outside_       : 'outside',
      _pointer_       : 'pointer',
      _relative_      : 'relative',
      _right_         : 'right',
      _show_          : 'show',
      _solid_         : 'solid',
      _text_          : 'text',
      _top_           : 'top',
      _touch_         : 'touch',
      _transparent_   : 'transparent',
      _underline_     : 'underline',
      _uppercase_     : 'uppercase',
      _vertical_      : 'vertical'
    },

    makeSheetStr,
    initStyleEls,

    updateCSS,
    setBaseSheetId
    ;

  makeSheetStr = function ( sheetSelectList ) {
    var
      select_count,  i, j,
      pkg_map,       select_str,
      rule_map,      close_str,
      rule_key_list, rule_key_count,
      rule_key,      rule_val,
      rule_val_type,

      solve_select_list,
      solve_lock_map,
      solve_rule_list,
      solve_key,
      solve_val,
      solve_select_str,
      solveSheetStr
      ;

    select_count = sheetSelectList[ vMap._length_ ];

    solve_select_list = [];
    solve_lock_map    = {};
    for ( i = __0; i < select_count; i++ ) {
      pkg_map    = sheetSelectList[ i ];
      select_str = pkg_map._select_str_;
      rule_map   = pkg_map._rule_map_;
      close_str  = pkg_map._close_str_;

      if ( ! rule_map ) {
        solve_select_list[ vMap._push_]( select_str );
        continue;
      }

      rule_key_list  = Object.keys( rule_map );
      rule_key_count = rule_key_list[ vMap._length_ ];

      solve_rule_list = [];
      for ( j = __0; j < rule_key_count; j++ ) {

        // Calc solve_key
        rule_key = rule_key_list[ j ];
        if ( cssKeyMap[ vMap._hasOwnProp_ ]( rule_key ) ) {
          solve_key = cssKeyMap[ rule_key ];
        }
        else {
          __logError( rule_key, '_css_rule_key_not_found_' );
          continue;
        }

        // Skip keys that are locked
        if ( solve_lock_map[ rule_key ] === __true ) { continue; }

        // Calc solve val
        rule_val = rule_map[ rule_key ];
        if ( ( typeof rule_val === vMap._object_ )
          && ( rule_val[ vMap._hasOwnProp_ ]( '_val_data_' ) )
        ) {
          solve_lock_map[ rule_key ] = rule_val._do_lock_;
          rule_val = rule_val._val_data_;
        }
        rule_val_type = __isArray( rule_val )
          ? vMap._array_ : typeof rule_val;

        if ( rule_val_type === vMap._object_ ) {
          rule_val = rule_val._val_data_;
        }

        switch( rule_val_type ) {
          case 'string' :
            if ( cssValMap[ vMap._hasOwnProp_ ]( rule_val ) ) {
              solve_val = cssValMap[ rule_val ];
            }
            else {
              __logError( rule_val, '_css_rule_val_not_found_' );
            }
            break;
          case '_array_' :
            if ( rule_val[ vMap._length_ ] > __0 ) {
              solve_val = rule_val[ __0 ];
            }
            else {
              __logError( rule_val, '_empty_array_' );
            }
            break;
          default :
            __logError( '_css_values_must_be_str_or_ary_' );
            break;
        }

        // Store rule string
        solve_rule_list[ vMap._push_ ](
          solve_key + ':' + solve_val
        );
      }

      // Construct selector and store
      solve_select_str = select_str + '{'
        + solve_rule_list[ vMap._join_ ](';') + '}'
        ;
      if ( close_str ) { solve_select_str += close_str; }

      solve_select_list[ vMap._push_]( solve_select_str );
    }

    // Join all selectors for sheet
    solveSheetStr = solve_select_list[ vMap._join_ ]( __blank );
    return solveSheetStr;
  };

  initStyleEls = function () {
    var
      head_el          = __docRef[ vMap._head_ ],
      style_el_list    = topSmap._style_el_list_,
      style_el_idx     = topSmap._style_el_idx_,
      sheet_id_prefix  = topSmap._sheet_id_prefix_,

      i, style_el_id, style_el
      ;

    if ( style_el_idx > __n1 ) {
      throw '_double_buffer_already_initialized_';
    }

    for ( i = __0; i < __2; i++ ) {
      style_el_id = sheet_id_prefix +  __String( i );
      if ( !! __docRef[ vMap._getElById_ ]( style_el_id ) ) {
        throw '_sheet_id_is_already_in_use_ ' + style_el_id;
      }
      style_el = __docRef[ vMap._createElement_]( 'style' );
      style_el[ vMap._setAttribute_ ]( vMap._type_,     vMap._text_css_ );
      style_el[ vMap._setAttribute_ ]( vMap._id_,       style_el_id     );
      style_el[ vMap._setAttribute_ ]( vMap._disabled_, __true          );

      head_el[ vMap._appendChild_ ]( style_el );
      style_el_list[ i ] = style_el;
    }

    topSmap._style_el_list_ = style_el_list;
    topSmap._style_el_idx_  = __0;
  };

  updateCSS = function ( sheet_select_list ) {
    var 
      style_el_idx = topSmap._style_el_idx_,

      style_el_list, write_el_idx,
      used_style_el, write_style_el, style_str
      ;

    if ( style_el_idx === __n1 ) { initStyleEls(); }

    style_el_list   = topSmap._style_el_list;
    style_el_idx    = topSmap._style_el_idx_;
    write_el_idx    = style_el_idx === __0 ? __1 : __0;
    used_style_el   = style_el_list[ style_el_idx ];
    write_style_el  = style_el_list[ write_el_idx ];

    write_style_el[ vMap._setAttribute_ ]( vMap._disabled_, __true );
    style_str = makeSheetStr( sheet_select_list );

    // Firefox and IE(?)
    if ( write_style_el[ vMap._hasOwnProp_ ]( vMap._cssText_ ) ) {
      write_style_el[ vMap._cssText_      ] = style_str;
    }
    // Newer Firefox
    else if ( write_style_el[ vMap._hasOwnProp_ ]( vMap._textContent_ ) ) {
      write_style_el[ vMap._textContent_ ] = style_str;
    }
    // Webkit
    else {
      __docRef[ vMap._createTextNode_ ] = __blank;
      write_style_el[ vMap._innerText_    ] = style_str;
    }

    used_style_el[  vMap._setAttribute_ ]( vMap._disabled_, __true  );
    write_style_el[ vMap._setAttribute_ ]( vMap._disabled_, __false );

    // toggle current in-use stylesheet
    topSmap._style_el_idx_ = write_el_idx;
  };

  setSheetIdPrefix = function ( sheet_id_prefix ) {
    topSmap._sheet_id_prefix = sheet_id_prefix;
  };

  return {
    _addMixinMap_      : addMixinMap,
    _addVSheetList_    : addVSheetList,
    _rmVSheetList_     : rmVSheetList,
    _getVSheetList_    : getVSheetList,
    _getVSheetKeyList_ : getVSheetKeyList,

    _setSheetIdPrefix_ : setSheetIdPrefix,
    _addSheetObj_      : addSheetObj,
    _enableSheetObj_   : enableSheetObj,
    _writeCSS_         : writeCss
  };
}());
