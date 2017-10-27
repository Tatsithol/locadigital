"use strict";


/*
 * Author: ant_farm
 * Website: http://antfarmthemes.com
 * Portfolio: http://themeforest.net/user/ant_farm/portfolio?ref=ant_farm
 * This is not free software.
 * QCreative
 * Version: 1.08
 */

function getBrowserScrollSize(){

    var css = {
        "border":  "none",
        "height":  "200px",
        "margin":  "0",
        "padding": "0",
        "width":   "200px"
    };

    var inner = jQuery("<div>").css(jQuery.extend({}, css));
    var outer = jQuery("<div>").css(jQuery.extend({
        "left":       "-1000px",
        "overflow":   "scroll",
        "position":   "absolute",
        "top":        "-1000px"
    }, css)).append(inner).appendTo("body")
        .scrollLeft(1000)
        .scrollTop(1000);

    var scrollSize = {
        "height": (outer.offset().top - inner.offset().top) || 0,
        "width": (outer.offset().left - inner.offset().left) || 0
    };

    outer.remove();
    return scrollSize;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


Math.easeIn = function(t, b, c, d) {

    return -c *(t/=d)*(t-2) + b;

};
(function($) {
    $.fn.descendantOf = function(parentId) {
        return this.closest(parentId).length != 0;
    }
})(jQuery)

window.qcreative_document_ready_ed = false;
window.google_maps_loaded = false;
window.gooogle_maps_must_init = false;


window.preseter_options= {
    'delay_time_to_autohide': 1000000
    ,init_on_document_ready : false
};

window.scroll_top_object = { 'val' : 0 };

function goclone(source) {
    if (Object.prototype.toString.call(source) === '[object Array]') {
        var clone = [];
        for (var i=0; i<source.length; i++) {
            clone[i] = goclone(source[i]);
        }
        return clone;
    } else if (typeof(source)=="object") {
        var clone = {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                clone[prop] = goclone(source[prop]);
            }
        }
        return clone;
    } else {
        return source;
    }
}


function copy(source, deep) {
    var o, prop, type;

    if (typeof source != 'object' || source === null) {
        // What do to with functions, throw an error?
        o = source;
        return o;
    }

    o = new source.constructor();

    for (prop in source) {

        if (source.hasOwnProperty(prop)) {
            type = typeof source[prop];

            if (deep && type == 'object' && source[prop] !== null) {
                o[prop] = copy(source[prop]);

            } else {
                o[prop] = source[prop];
            }
        }
    }
    return o;
}

jQuery(document).ready(function($){
    //console.info('DOCUMENT READY');


    if(window.qcreative_document_ready_ed){
        return false;
    }else{
        window.qcreative_document_ready_ed = true;
    }

    $.fn.outerHTML = function() {
        return $(this).clone().wrap('<div></div>').parent().html();
    };

    var BlurStack = function() {
        return {
            r : 0,
            g : 0,
            b : 0,
            a : 0,
            next : null
        }
    };

    var
        _mainBg = null
        ,_body = $('body')
        ,_mainBgConCon = null

        ,_navCon = null
        ,_mainBgTransitioning = null
        ,_mainGalleryDescs = null
        ,_preloaderCon = null
        ,_theContent = null
        ,_mainContainer = null
        ,_navCon_520 = null
        ,_theActualNav = null
        ,___response = null
        ,_gallery_thumbs_con = null
        ,_sidebarMain = null
        ,_logoCon = null

        ,_qcre_aux_css = null
        ,_curr_parallaxer = null // -- the current parallax main bg
        ;

    var mainBgImgCSS = '';
    var mainBgImgUrl = '';

    var newclass_body = ''
        ,newclass_body_page = ''
        ,newclass_body_nopadding=false
        ,newclass_body_with_fullbg=false
        ,qcre_init_zoombox = false
        ,main_content_loaded=false
        ;

    var ww = 0
        ,wh = 0
        ,st = 0 // -- scrolltop
        ,mainbgoffset = 15
        ,currBgNr = 0
        ,bigimagewidth = 0
        ,bigimageheight = 0
        ,lastcontent_w = 0
        ,gallery_thumbs_img_container_nw = 0 // -- natural width for gallery thumbs image container
        ,gallery_thumbs_img_container_nh = 0
        ,gallery_thumbs_img_container_cw = 0
        ,gallery_thumbs_img_container_ch = 0
        ,gallery_thumbs_img_container_padding_space=20
        ,menu_width = 250
        ,thumbs_padding_left_and_right = 40
        ,thumbs_list_padding_right = 0
        ,menu_height = 0
        ,menu_width_on_right = 0
        ,content_width = 930
        ,force_content_width = 0
        ,force_content_gap_width = 0
        ,default_content_width = 930
        ,menu_content_space = 20
        ,native_scrollbar_width = 0

        ,initial_sidebar_offset = 0
        ,initial_theContent_offset = 0

        ,currNr_gallery_w_thumbs = 0


        ,bg_slideshow_time = 0
        ,initial_offset = 0
        ,responsive_breakpoint = 1000
        ,border_width = 0
        ,menu_is_scrollable = false
        ,menu_is_scrollable_offset = 0
        ,the_actual_nav_initial_top_offset = -1

        ,css_border_width = 0
        ;

    var bg_transition = "slidedown"
        ,initial_bg_transition = ''
        ;

    var bg_transition_delay = 500
        ;

    var
        busy_main_transition = false
        ,is_ready_load = false
        ,is_ready_transition = false
        ,parallax_reverse = true
        ,is_content_page = false // -- check if it is a content page ( page normal )
        ,allow_resizing_on_blur = true
        ,_cache = null
        ,_cache2 = null
        ,_content_translucent_canvas = null
        ,social_scripts_loaded = false
        ,social_scripts_reinit = false
        ,transitioned_via_ajax_first = false // -- set to true when the first ajax transition has been made
        ,first_page_not_transitioned = true// -- only on the first page load, only once
        ,first_bg_not_transitioned = true
        ,has_custom_outside_content_1 = false
        ,history_first_pushed_state = false
        ;

    var global_image_data = null;


    var scripts_loaded_arr = [];
    var scripts_tobeloaded = [];
    var stylesheets_tobeloaded = [];
    var elements_tobe_added_arr = []
        ,videoplayers_tobe_resized = []
        ;


    var inter_resizing = 0
        ,inter_calculate_dims_light = 0
        ,inter_enlarge_preseter = 0
        ,inter_preseter_scroll = 0
        ,inter_check_if_main_content_loaded = 0
        ,inter_bg_slideshow = 0
        ;


    var old_qcre_options = null
        ,customizer_force_blur = -1
        ;
    var old_zoombox_options = null;
    var zoombox_options = null;


    var _c_for_parallax_items = null;

    var ind_blur = 0

        ;

    var parallaxer_multiplier = 1.3;


    var page_is_fullwidth = false;



    var duration_vix = 20
        ;

    var target_vix = 0
        ;

    var begin_vix = 0
        ;

    var finish_vix = 0
        ;

    var change_vix = 0
        ;

    var state_curr_menu_items_links = [];



    var page =''
        ,page_change_ind = 0
        ;

    var windowhref = ''
        ,ajax_site_url = ''
        ,curr_html = ''
        ,curr_html_with_clear_cache = false
        ,new_bg_transition = 'on' // -- if set to "off" then the initial background will remain
        ;




    var is_menu_horizontal_and_full_bg = false
        ,custom_responsive_menu = false
        ,full_bg_init_y = 0
        ,_full_bg = null
        ;

    var debug_var = false;




    if($('.main-bg-con-con').length>0){
        _mainBgConCon = $('.main-bg-con-con').eq(0);
    }
    _mainContainer = $('.main-container').eq(0);
    _mainBg = $('.main-bg-con').eq(0);
    //console.info(_mainBg);
    _preloaderCon = $('.main-container > .preloader-con');
    _navCon = $('.qcreative--nav-con').eq(0);
    _navCon_520 = $('.qcreative--520-nav-con').eq(0);
    _theActualNav = $('ul.the-actual-nav').eq(0);


    _logoCon = _navCon.find('.logo-con').eq(0);

    if($('.the-content').length>0){
        _theContent = $('.the-content').eq(0);
    }


    if($('#qcre-aux-css').length>0){
        _qcre_aux_css=$('#qcre-aux-css').eq(0);
    }else{


        _body.append('<style id="qcre-aux-css"></style>');
        _qcre_aux_css=$('#qcre-aux-css').eq(0);

    }




    if(isiPad){
        _body.addClass('is-ipad');
    }


    var auxa = getBrowserScrollSize();

    native_scrollbar_width = auxa.width;


    // -- TBC calculate content width
    default_content_width = content_width;


    //console.log(getBrowserScrollSize());


    var qcreative_options_defaults = {
        images_arr: ['img/bg1.jpg']
        ,bg_slideshow_time: "0" // -- slideshow time in seconds. If it 0 then there the background images will not have a slideshow
        ,site_url: 'detect'
        ,enable_ajax: 'on' // -- if this is set to "on" then pages will load without browser reload ( can only be set on init )
        ,page: 'index'
        ,bg_isparallax: 'off'
        ,gallery_w_thumbs_autoplay_videos: 'on' // -- enable the native scrollbar
        ,enable_native_scrollbar: 'off'
        ,blur_ammount: 25
        ,border_width: "0" // -- if set to higher then 0, then a border of n pixels will sorround the site
        ,substract_parallaxer_pixels: 10
        ,content_width: "0" // -- set a custom content width
        ,content_gap_width: "0" // -- set a custom gap width between columns, needs to be a even value ( in pixels )

        ,menu_scroll_method: "scroll" // -- when the menu height is bigger then the window height, this is an option either to scroll with the mouse wheel ( "scroll" ) or to scroll based on mouse move ( "mousemove" )

        ,responsive_menu_type: "custom" // -- "custom" a custom forged, "select" a select menu for native mobile devices select menu
        ,bg_transition: "slidedown" // -- fade or slidedown
        ,new_bg_transition: "on" // -- if set to "off" then the initial background will remain

        ,video_player_settings: {
            init_each:true
            ,settings_youtube_usecustomskin: "off"
            ,design_skin: "skin_reborn"
            ,settings_video_overlay: "on"
        }
    };

    var qcreative_options_defaults_string = JSON.stringify(qcreative_options_defaults);
    //console.log(qcreative_options_defaults_string);
    if(window.qcreative_options){



        //console.log('this..');
        //var auxer =copy(qcreative_options_defaults);
        window.qcreative_options = $.extend(qcreative_options_defaults, window.qcreative_options);


    }else{
        window.qcreative_options = $.extend({}, qcreative_options_defaults);
    }

    initial_bg_transition = qcreative_options.bg_transition;

    new_bg_transition = window.qcreative_options.new_bg_transition;


    if(isNaN(parseInt(window.qcreative_options.border_width,10))==false && parseInt(window.qcreative_options.border_width,10)){
        border_width = parseInt(window.qcreative_options.border_width,10);

    }


    if(border_width>0){

        _body.addClass('with-border');
    }

    if(isNaN(parseInt(window.qcreative_options.blur_ammount,10))==false){
        window.qcreative_options.blur_ammount = parseInt(window.qcreative_options.blur_ammount,10);
    }else{

        window.qcreative_options.blur_ammount = 25;
    }



    //console.info(window.qcreative_options);


    $(window).scrollTop(0);

    setInterval(function(){
        debug_var=true;
    },1000)




    var regex_bodyclass = /(page-.*?)[ |"]/g;

    //console.log(String($('body').attr('class')))




    var regex_bodyclass_page = /.*?(page-(?:blogsingle|homepage|gallery-w-thumbs|normal|contact|about|contact|portfolio|portfolio-single))/g;

    var aux23 = regex_bodyclass_page.exec(String($('body').attr('class')));

    newclass_body_page = '';
    if(aux23){
        if(aux23[1]){
            newclass_body_page = aux23[1];
        }
    }



    if(isNaN(parseInt(_body.css('border-width'),10)),parseInt(_body.css('border-width'),10)){
        css_border_width = parseInt(_body.css('border-width'),10);
    }

    //console.info(css_border_width);
    //console.info(newclass_body);

    if(window.preseter_init){

        window.onload = function() {
            //console.info('ceva');


        };


        //$( window ).unload(function() {
        //
        //    localStorage.setItem("menu-type", '');
        //    localStorage.setItem("page-title-style", '');
        //    localStorage.setItem("page-title-align", '');
        //    localStorage.setItem("heading-style", '');
        //    localStorage.setItem("heading-aligment", '');
        //    localStorage.setItem("content-align", '');
        //    localStorage.setItem("parallax_bg", '');
        //    localStorage.setItem("blur_ammount", '');
        //    localStorage.setItem("saturation_ammount", '');
        //    localStorage.setItem("color_primary", '');
        //
        //
        //});

        if(typeof(Storage) !== "undefined") {



            if(get_query_arg(window.location.href, 'clearcache')=='on'){

                localStorage.setItem("menu-type", '');
                localStorage.setItem("page-title-style", '');
                localStorage.setItem("page-title-align", '');
                localStorage.setItem("heading-style", '');
                localStorage.setItem("heading-aligment", '');
                localStorage.setItem("content-align", '');
                localStorage.setItem("parallax_bg", '');
                localStorage.setItem("blur_ammount", '');
                localStorage.setItem("saturation_ammount", '');
                localStorage.setItem("color_primary", '');
            }



            // -- <h6>SECTION TITLE STYLE</h6> <select name="heading-style"> <option value="heading-style-1">Section Title 1</option> <option value="heading-style-2">Section Title 2</option> <option selected value="heading-style-3">Section Title 3</option> <option value="heading-style-4">Section Title 4</option> <option value="heading-style-5">Section Title 5</option> </select> </div> <div class="setting"> <h6>SECTION TITLE ALIGMENT</h6> <select name="heading-aligment"> <option value="heading-is-left">Left</option> <option value="heading-is-center">Center</option> <option value="heading-is-right">Right</option> </select> </div>
            //
            //
            //

            // <option value="menu-type-13">Menu 13 (overlay)</option> <option value="menu-type-14">Menu 14 (overlay)</option> <option value="menu-type-15">Menu 15 (overlay)</option> <option value="menu-type-16">Menu 16 (overlay)</option> <option value="menu-type-17">Menu 17 (overlay)</option> <option value="menu-type-18">Menu 18 (overlay)</option>


            if($('.preseter.align-right').length==0){
                _body.append('<div class="preseter align-right wait-for-activate preseter-opened-by-user" style=""> <div class="the-icon-con"> <i class="fa fa-chevron-left btn-show-customizer"></i> <i class="fa fa-times btn-close-customizer"></i>  </div> <div class="preseter-content-con auto-height overflow-x-visible" style="width: 260px; height: auto;"> <div class=" the-content-inner-con"> <div class="the-content inner" style=" " data-targetw="-260"> <div class="the-content-inner-inner"> <div class="the-bg"></div> <div class="setting"> <div class="dzstooltip-con js for-hover" > <i class="fa fa-info-circle"></i> <div class="clear"></div> <span class="dzstooltip arrow-right align-top skin-white transition-slidein no-arrow" style="right:100%; max-width: 300px; margin-right: 5px; "> <img class="fullwidth" src="img/tooltip_menu_style.jpg"/> <span class="content-inner">Change the menu style to completely change the look and feel of your website. Please note that the menu styles are not tied to the content skin style, so with the Q Creative it\'s possible to have a LIGHT menu style with the DARK content skin (however in the demo we are sticking to the same style for both menu and content skins)</span> </span> </div> <h6>Menu Style</h6> <select name="menu-type" autocomplete="off"> <option selected="selected" value="menu-type-1">Menu 1-Dark (vertical)</option> <option value="menu-type-2">Menu 2-Light (vertical)</option> <option value="menu-type-3">Menu 3-Dark (vertical)</option> <option value="menu-type-4">Menu 4-Light (vertical)</option> <option value="menu-type-5">Menu 5-Dark (vertical)</option> <option value="menu-type-6">Menu 6-Light (vertical)</option> <option value="menu-type-7">Menu 7-Dark (vertical)</option> <option value="menu-type-8">Menu 8-Light (vertical)</option> <option value="menu-type-9">Menu 9-Dark (horizontal)</option> <option value="menu-type-10">Menu 10-Light (horizontal)</option> <option value="menu-type-11">Menu 11 (overlay)</option> <option value="menu-type-12">Menu 12 (overlay)</option> <option value="menu-type-13">Menu 13-Dark (horizontal)</option> <option value="menu-type-14">Menu 14-Light (horizontal)</option> <option value="menu-type-15">Menu 15-Dark (horizontal)</option> <option value="menu-type-16">Menu 16-Light (horizontal)</option> <option value="menu-type-17">Menu 17-Dark (horizontal)</option> <option value="menu-type-18">Menu 18-Light (horizontal)</option> </select> </div> <div class="setting"> <div class="dzstooltip-con js for-hover" > <i class="fa fa-info-circle"></i> <div class="clear"></div> <span class="dzstooltip arrow-right align-top skin-white transition-slidein no-arrow" style="right:100%; max-width: 300px; margin-right: 5px; "> <img class="fullwidth" src="img/tooltip_page_title_style.jpg"/> <span class="content-inner">Play between page title styles to fit your own personal style. There are several page title styles available, that support one row or two rows, and creating other styles is a piece of cake.</span> </span> </div> <h6>Page Title Style</h6> <select name="page-title-style"> <option value="page-title-style-1">Page Title 1</option> <option selected="selected" value="page-title-style-2">Page Title 2</option> <option value="page-title-style-3">Page Title 3</option> <option value="page-title-style-3b">Page Title 3b</option> </select> </div> <div class="setting"> <h6>Page Title Position</h6> <select name="page-title-align"> <option value="page-title-align-right">Right</option> <option value="page-title-align-center">Center</option> <option value="page-title-align-left">Left</option> </select> </div> <div class="setting"> <div class="dzstooltip-con js for-hover" > <i class="fa fa-info-circle"></i> <div class="clear"></div> <span class="dzstooltip arrow-right align-top skin-white transition-slidein no-arrow" style="right:100%; max-width: 300px; margin-right: 5px; "> <img class="fullwidth" src="img/tooltip_section_title_style.jpg"/> <span class="content-inner">This option will affect the Section Title (or Section Heading) in normal pages such as ABOUT US or SERVICES. To see all Section Title Styles please go to Extras / Section Titles.</span> </span> </div>  <div class="setting"> <div class="dzstooltip-con js for-hover" > <i class="fa fa-info-circle"></i> <div class="clear"></div> <span class="dzstooltip arrow-right align-top skin-white transition-slidein no-arrow" style="right:100%; max-width: 300px; margin-right: 5px; "> <img class="fullwidth" src="img/tooltip_content_position.jpg"/> <span class="content-inner">With so many menu styles available, we figured that it would be a great thing to have multiple ways to position the content in the browser.</span> </span> </div> <h6>Content Position</h6> <select name="content-align"> <option value="content-align-center">Center</option> <option value="content-align-left">Left</option> <option value="content-align-right">Right</option> </select> </div>   <div class="setting"> <h6>Parallax Background</h6> &nbsp;<input type="radio" name="parallax_bg" value="on" checked>&nbsp;&nbsp;On&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="radio" name="parallax_bg" value="off">&nbsp;&nbsp;Off </div> <div class="setting slider-ui-con"> <div class="dzstooltip-con js for-hover" > <i class="fa fa-info-circle"></i> <div class="clear"></div> <span class="dzstooltip arrow-right align-top skin-white transition-slidein no-arrow" style="right:100%; max-width: 300px; margin-right: 5px; "> <img class="fullwidth" src="img/tooltip_blur_amount.jpg"/> <span class="content-inner">The blur effect is probably the biggest star of the show, and the Q Creative 2015 Edition is the first template to use this effect as part of the layout design.</span> </span> </div> <h6>Blur Amount</h6> <input type="hidden" class="slider-ui-target-field" name="blur_ammount" value="25"/> <div class="slider-ui slider-ui-for-blur"></div> </div> <div class="setting slider-ui-con"> <div class="dzstooltip-con js for-hover" > <i class="fa fa-info-circle"></i> <div class="clear"></div> <span class="dzstooltip arrow-right align-top skin-white transition-slidein no-arrow" style="right:100%; max-width: 300px; margin-right: 5px; "> <img class="fullwidth" src="img/tooltip_saturation_amount.jpg"/> <span class="content-inner">Besides the blur effect, you can use saturation as part of your design. It\'s classy, beautiful and impressive.</span> </span> </div> <h6>Saturation Amount</h6> <input type="hidden" class="slider-ui-target-field" name="saturation_ammount" value="100"/> <div class="slider-ui "></div> </div> <div class="setting setting-for-colorpicker"> <h6 style="float:left; ">Primary Color</h6> <input type="hidden" class="with-colorpicker" name="color_primary" value="#e74c3c"/> <div class="picker-con align-right"><div class="the-icon"></div><div class="picker"></div></div> </div> <div class="clear"></div> <div style="white-space: nowrap; position: relative;"> <span class="preseter-button preseter-button--save">Save changes</span> <span class="preseter-button preseter-button--default">To default</span> </div> <div class="clear"></div> </div><!--end the-content--> </div> </div> <div class="clear"></div> </div> </div>');
            }


            var datenow = new Date().getTime();
            if(localStorage.getItem('menu-type')){
                try{
                    var obj = JSON.parse(localStorage.getItem('menu-type'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        _body.removeClass('menu-type-1 menu-type-2 menu-type-3 menu-type-4 menu-type-5 menu-type-6 menu-type-7 menu-type-8 menu-type-9 menu-type-10 menu-type-11 menu-type-12 menu-type-13 menu-type-14 menu-type-15 menu-type-16 menu-type-17 menu-type-18 menu-is-sticky ');

                        _body.addClass(obj.value);


                        if(obj.value=='menu-type-13'||obj.value=='menu-type-14'||obj.value=='menu-type-15'||obj.value=='menu-type-16'||obj.value=='menu-type-17'||obj.value=='menu-type-18'){

                            _body.addClass('menu-is-sticky');
                        }

                        $('.preseter select[name=menu-type]').val(obj.value);

                    }
                }catch(err){
                    console.log(err);
                }


            }else{
                if(is_firefox()){

                    $('.preseter select[name=menu-type]').val('menu-type-1');
                }
            }

            //console.info(localStorage.getItem('page-title-style'))
            if(localStorage.getItem('page-title-style')){

                try{
                    var obj = JSON.parse(localStorage.getItem('page-title-style'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        _body.removeClass('page-title-style-1 page-title-style-2 page-title-style-3 page-title-style-3b ');

                        _body.addClass(obj.value);


                        $('.preseter select[name=page-title-style]').val(obj.value);


                        if(obj.value=='page-title-style-3b'){

                            var aux23 = 'body.page-title-style-3b .the-content-con > h1:first-of-type{ text-transform: lowercase; }';
                            //console.info('ceva',aux23);
                            //_qcre_aux_css.html(_qcre_aux_css.html()+aux23);
                        }
                    }
                }catch(err){
                    console.log(err);
                }


            }else{
                if(is_firefox()){

                    //console.info('FF COMMON, set default values', $('.preseter select[name=page-title-style]'),$('.preseter select[name=page-title-style] option:selected'))
                    $('.preseter select[name=page-title-style]').val('page-title-style-2');
                }
            }


            if(localStorage.getItem('page-title-align')){

                try{
                    var obj = JSON.parse(localStorage.getItem('page-title-align'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    //console.log(obj.value);
                    if(obj.value && datenow - obj.timestamp < 1800000){
                        //console.log(obj.value);
                        _body.removeClass('page-title-align-left page-title-align-center page-title-align-right');

                        _body.addClass(obj.value);


                        $('.preseter select[name=page-title-align]').val(obj.value);
                    }
                }catch(err){
                    console.log(err);
                }


            }
            if(localStorage.getItem('content-align')){

                try{
                    var obj = JSON.parse(localStorage.getItem('content-align'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        _body.removeClass('content-align-left content-align-center content-align-right');

                        _body.addClass(obj.value);


                        $('.preseter select[name=content-align]').val(obj.value);
                    }
                }catch(err){
                    console.log(err);
                }


            }


            if(localStorage.getItem('heading-style')){

                try{
                    var obj = JSON.parse(localStorage.getItem('heading-style'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        $('.the-content-sheet-text').removeClass('heading-style-1 heading-style-2 heading-style-3 heading-style-4 heading-style-5')

                        $('.the-content-sheet-text').addClass(obj.value);

                        if((obj.value=='heading-style-1'||obj.value=='heading-style-2')&&$('.the-content-sheet-text').eq(0).length>0){

                            $('.the-content-sheet-text').each(function(){
                                var _t232=$(this);

                                _t232.html(_t232.html().split('<br>').join(' '))
                            })

                        }
                        if((obj.value=='heading-style-4')&&$('.the-content-sheet-text').eq(0).length>0){

                            $('.the-content-sheet-text').each(function(){
                                var _t232=$(this);


                                var auxa = _t232.html().split('<br>');

                                var aux_str = String(_t232.html()).replace(/<h2>(.*)<br>(.*)<\/h2>/g, '<h2><span class="light">$1</span>$2<\/h2>');

                                //console.log(aux_str);
                                _t232.html(aux_str)
                            })

                        }

                        //console.info(obj, obj.value);
                        $('.preseter select[name=heading-style]').val(obj.value);

                    }
                }catch(err){
                    console.log(err);
                }


            }
            if(localStorage.getItem('heading-aligment')){

                try{
                    var obj = JSON.parse(localStorage.getItem('heading-aligment'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        $('.the-content-sheet-text').removeClass('heading-is-left heading-is-center heading-is-right')

                        $('.the-content-sheet-text').addClass(obj.value);


                        $('.preseter select[name=heading-aligment]').val(obj.value);
                    }
                }catch(err){
                    console.log(err);
                }


            }


            if(localStorage.getItem('menu-type')){

                try{
                    var obj = JSON.parse(localStorage.getItem('menu-type'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        _body.removeClass('menu-type-1 menu-type-2 menu-type-3 menu-type-4 menu-type-5 menu-type-6 menu-type-7 menu-type-8 menu-type-9 menu-type-10 menu-type-11 menu-type-12 ')

                        _body.addClass(obj.value);


                        $('.preseter select[name=menu-type]').val(obj.value);
                    }
                }catch(err){
                    console.log(err);
                }


            }


            if(localStorage.getItem('parallax_bg')){

                try{
                    var obj = JSON.parse(localStorage.getItem('parallax_bg'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        $('.preseter *[name=parallax_bg]').prop('checked',false);

                        window.qcreative_options.bg_isparallax = obj.value;


                        $('.preseter *[name=parallax_bg][value='+window.qcreative_options.bg_isparallax+']').prop('checked',true);
                    }
                }catch(err){
                    console.log(err);
                }


            }



            if(localStorage.getItem('menu-type')){

                try{
                    var obj = JSON.parse(localStorage.getItem('menu-type'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        _body.removeClass('menu-type-1 menu-type-2 menu-type-3 menu-type-4 menu-type-5 menu-type-6 menu-type-7 menu-type-8 menu-type-9 menu-type-10 menu-type-11 menu-type-12 ')

                        _body.addClass(obj.value);

                        if(obj.value=='menu-type-1'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_1-7.png');
                        }
                        if(obj.value=='menu-type-2'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_2-8.png');
                        }
                        if(obj.value=='menu-type-3'||obj.value=='menu-type-13'||obj.value=='menu-type-15'||obj.value=='menu-type-17'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_3-9.png');
                        }
                        if(obj.value=='menu-type-4'||obj.value=='menu-type-14'||obj.value=='menu-type-16'||obj.value=='menu-type-18'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_4-10.png');
                        }
                        if(obj.value=='menu-type-5'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_5.png');
                        }
                        if(obj.value=='menu-type-6'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_6.png');
                        }
                        if(obj.value=='menu-type-7'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_1-7.png');
                        }
                        if(obj.value=='menu-type-8'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_2-8.png');
                        }
                        if(obj.value=='menu-type-9'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_3-9.png');
                        }
                        if(obj.value=='menu-type-10'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_4-10.png');
                        }
                        if(obj.value=='menu-type-11'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_11-12.png');
                        }
                        if(obj.value=='menu-type-12'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_11-12.png');
                        }


                        $('.preseter select[name=menu-type]').val(obj.value);
                    }
                }catch(err){
                    console.log(err);
                }


            }
            if(localStorage.getItem('blur_ammount')){

                try{
                    var obj = JSON.parse(localStorage.getItem('blur_ammount'));



                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        window.qcreative_options.blur_ammount = Number(obj.value);
                        $('.preseter *[name=blur_ammount]').val(obj.value);


                        customizer_force_blur = Number(obj.value);
                        //$('.slider-ui-for-blur').slider("value", Number(localStorage.getItem('blur_ammount')));
                    }
                }catch(err){
                    console.log(err);
                }


            }

            if(localStorage.getItem('saturation_ammount')){

                try{
                    var obj = JSON.parse(localStorage.getItem('saturation_ammount'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        $('.preseter *[name=saturation_ammount]').val(obj.value);

                        var aux24 = 100-Number(obj.value);

                        var aux23 = '.translucent-con .translucent-canvas{ -webkit-filter: grayscale('+aux24+'%); -ms-filter: grayscale('+aux24+'%); -moz-filter: grayscale('+aux24+'%);  filter: grayscale('+aux24+'%); }';
                        //console.info('ceva',aux23);
                        _qcre_aux_css.html(_qcre_aux_css.html()+aux23);
                        //$('.slider-ui-for-blur').slider("value", Number(localStorage.getItem('blur_ammount')));
                    }
                }catch(err){
                    console.log(err);
                }


            }


            if(localStorage.getItem('color_primary')){

                try{
                    var obj = JSON.parse(localStorage.getItem('color_primary'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        $('.preseter *[name=color_primary]').val(obj.value);


                        var aux23 = 'ul.the-actual-nav li.current-menu-item > a, ul.the-actual-nav > li:hover > a, ul.redcircle li:before, .dzs-tabs.skin-qcre .tabs-menu .tab-menu-con.active .tab-menu, .btn-read-more.color-highlight, .ul.the-actual-nav li ul li > a, .dzs-tabs.skin-qcre.is-toggle .tabs-menu .tab-menu-con.active .tab-menu, .btn-read-more:hover, .btn-read-more:focus:hover, .bullet-feature-form .icon-con, .bullet-feature-form.form-hexagon .icon-con, ul.the-actual-nav li ul li > a,.sidebar-block h4, .dzstooltip.skin-red, .qc-pagination > li.active > a, .qc-pagination > li:hover > a,.btn-full-white:hover,body.page-blogsingle .blog-link-con .portfolio-link--title:hover,body.page-blogsingle .blog-link-con .portfolio-link--toback.center-td:hover > a,.btn-full-red,body.page-blogsingle .blog-comments .btn-load-more-comments:hover,.selector-con-for-skin-melbourne .a-category.active, .selector-con-for-skin-melbourne .a-category:hover,.zfolio.skin-melbourne .zfolio-item:hover .item-meta,.ajax-preloader .loader:after,.zfolio.skin-silver .selector-con .a-category.active, .zfolio.skin-silver .selector-con .a-category:hover, .zfolio.skin-melbourne .selector-con .a-category.active, .zfolio.skin-melbourne .selector-con .a-category:hover, .zfolio.skin-gazelia .selector-con .a-category.active, .zfolio.skin-gazelia .selector-con .a-category:hover, .zfolio.skin-qcre .selector-con .a-category.active, .zfolio.skin-qcre .selector-con .a-category:hover,ul.sidebar-count-list > li:hover > a .the-count,.sidebar-search-con .search-submit-con:hover, .team-member-element .meta-con .social-profiles .circle-con:hover,body.body-style-light .qc-pagination > li.active > a, body.body-style-light .qc-pagination > li:hover > a,.map-canvas-con .contact-info .services-lightbox--close:hover,.advancedscroller.skin-qcre > .arrowsCon > .arrow-left:hover, .advancedscroller.skin-qcre .arrowsCon > .arrow-right:hover,.qcreative-pricing-table a.signup-button:hover,.advancedscroller .item .description-wrapper:hover .description-wrapper--icon-con,.advancedscroller.skin-karma-inset .arrowsCon > .arrow-left:hover, .advancedscroller.skin-karma-inset .arrowsCon > .arrow-right:hover,body.page-portfolio-single .the-content-con.fullit .portfolio-single-liquid-title > h2,body.page-portfolio-single .the-content-con.fullit .portfolio-single-liquid-title .portfolio-single-liquid-info:hover,.main-container .the-content-con.fullit .portfolio-single-subtitle,.portfolio-link-con .portfolio-link--title:hover,.portfolio-link-con .portfolio-link--toback.center-td:hover,body.page-portfolio-single .the-content-con.fullit .arrow-left-for-skin-qcre:hover, body.page-portfolio-single .the-content-con.fullit .arrow-right-for-skin-qcre:hover,.zoombox-maincon.skin-whitefull .main-con > .slider-con .arrow-left-for-skin-qcre:hover, .zoombox-maincon.skin-whitefull .main-con > .slider-con .arrow-right-for-skin-qcre:hover,.services-lightbox-content .services-lightbox--close:hover,.advancedscroller .item .description-wrapper.active .description-wrapper--icon-con, ul.nostyle li > .icon-con, body.menu-type-13 nav.qcreative--nav-con ul.the-actual-nav > li.current-menu-item > a, body.menu-type-13 nav.qcreative--nav-con ul.the-actual-nav > li:hover > a, body.menu-type-14 nav.qcreative--nav-con ul.the-actual-nav > li.current-menu-item > a, body.menu-type-14 nav.qcreative--nav-con ul.the-actual-nav > li:hover > a, body.menu-type-15 nav.qcreative--nav-con ul.the-actual-nav > li.current-menu-item > a, body.menu-type-15 nav.qcreative--nav-con ul.the-actual-nav > li:hover > a, body.menu-type-16 nav.qcreative--nav-con ul.the-actual-nav > li.current-menu-item > a, body.menu-type-16 nav.qcreative--nav-con ul.the-actual-nav > li:hover > a, body.menu-type-17 nav.qcreative--nav-con ul.the-actual-nav > li.current-menu-item > a, body.menu-type-17 nav.qcreative--nav-con ul.the-actual-nav > li:hover > a, body.menu-type-18 nav.qcreative--nav-con ul.the-actual-nav > li.current-menu-item > a, body.menu-type-18 nav.qcreative--nav-con ul.the-actual-nav > li:hover > a,body.menu-type-15 nav.qcreative--nav-con ul.the-actual-nav > li ul, body.menu-type-16 nav.qcreative--nav-con ul.the-actual-nav > li ul, body.menu-type-17 nav.qcreative--nav-con ul.the-actual-nav > li ul, body.menu-type-18 nav.qcreative--nav-con ul.the-actual-nav > li ul, .audioplayer.skin-redlights .ap-controls .ap-controls-left .con-playpause:hover, .team-member-element-2 .meta-con .social-profiles .circle-con:hover, .dzs-tabs.skin-menu .tabs-menu .tab-menu-con.active .tab-menu, .dzs-tabs.skin-menu .tabs-menu .tab-menu-con:hover .tab-menu, .element-sideways.with-fa .icon-con{ background-color: '+obj.value+'; } body .zfolio.under-720 .selector-con div.a-category.active, body .selector-con-for-skin-melbourne.under-720 div.a-category.active{ background-color: '+obj.value+'!important; } ul.the-actual-nav li ul li.current-menu-item > a, ul.the-actual-nav li ul > li:hover > a, .btn-read-more.style-hallowred, .btn-read-more.style-hallowred:focus, .bullet-feature-red .icon-con .fa,a.post-main-link:hover,body.page-blogsingle .post-meta-below a:hover,body.page-blogsingle .blog-comments ul.itemCommentsList .comment-right-meta a:hover,ul.sidebar-count-list > li:hover > a .cat-name,.post-meta a:hover,.main-gallery--descs .main-gallery--desc .big-number,.contact-info a:hover,.sidebar-block-archive > a:last-child:hover,body.page-portfolio-single .portfolio-single-meta-con a,body.page-portfolio-single blockquote a:hover,body.menu-type-2 ul.the-actual-nav li ul li.current-menu-item > a, body.menu-type-2 ul.the-actual-nav li ul > li:hover > a,.zoombox-maincon.skin-whitefull .main-con > .info-con blockquote a:hover,.excerpt-content blockquote a:hover,.arrow-left-for-skin-qcre-2:hover > i, .arrow-right-for-skin-qcre-2:hover > i, .close-btn-for-skin-qcre:hover > i, .post-meta a,body.menu-type-15 nav.qcreative--nav-con ul.the-actual-nav > li ul li:hover > a, body.menu-type-15 nav.qcreative--nav-con ul.the-actual-nav > li ul li.current-menu-item > a, body.menu-type-16 nav.qcreative--nav-con ul.the-actual-nav > li ul li:hover > a, body.menu-type-16 nav.qcreative--nav-con ul.the-actual-nav > li ul li.current-menu-item > a, body.menu-type-17 nav.qcreative--nav-con ul.the-actual-nav > li ul li:hover > a, body.menu-type-17 nav.qcreative--nav-con ul.the-actual-nav > li ul li.current-menu-item > a, body.menu-type-18 nav.qcreative--nav-con ul.the-actual-nav > li ul li:hover > a, body.menu-type-18 nav.qcreative--nav-con ul.the-actual-nav > li ul li.current-menu-item > a{ color:  '+obj.value+';} .dzs-tabs.skin-qcre.is-toggle .tabs-menu .tab-menu-con.active .plus-sign rect{ fill: '+obj.value+';} .btn-read-more.style-hallowred, .btn-read-more.style-hallowred:focus, .bullet-feature-red .icon-con,.arrow-left-for-skin-qcre-2:hover, .arrow-right-for-skin-qcre-2:hover, .close-btn-for-skin-qcre:hover,.dzs-tabs.skin-qcre:not(.is-toggle) .tabs-menu .tab-menu-con.active{ border-color: '+obj.value+';} .bullet-feature-form.form-hexagon .icon-con:after,.selector-con.selector-con-for-skin-melbourne .categories .a-category:before,.main-container .the-content-con.fullit .zfolio.skin-silver .selector-con .categories .a-category:before, .main-container .the-content-con.fullit .zfolio.skin-melbourne .selector-con .categories .a-category:before, .dzs-tabs.skin-menu .tabs-menu .tab-menu-con:before{ border-top-color: '+obj.value+';} .bullet-feature-form.form-hexagon .icon-con:before, .ajax-preloader:before,.zfolio.skin-melbourne .zfolio-item:hover .item-meta:before,body.page-portfolio-single .portfolio-single-meta-con a:hover, .post-meta a:hover{ border-bottom-color: '+obj.value+';} .dzstooltip.skin-red.arrow-right:before{ border-left-color: '+obj.value+';} ::selection{ background-color: '+obj.value+'; } ::-moz-selection{ background-color: '+obj.value+'; } .btn-read-more.style-hallowred:hover, .btn-read-more.style-hallowred:focus, .bullet-feature-red .icon-con{  border-color: '+obj.value+';color: #fff;} .main-container .btn-zoomsounds:hover {  border-color: '+obj.value+'; background-color: '+obj.value+';}';
                        _qcre_aux_css.html(_qcre_aux_css.html()+aux23);
                    }
                }catch(err){
                    console.log(err);
                }


            }




            if($.fn.slider){
                $( ".slider-ui" ).each(function(){
                    var _t = $(this);
                    //console.info(_t);

                    var min = 0;
                    var max = 100;
                    var val = 1;

                    if(_t.parent().hasClass('slider-ui-con')){

                        val = _t.parent().find('.slider-ui-target-field').eq(0).val();
                        if(_t.hasClass('slider-ui-for-blur')){
                            max = 30;
                        }
                    }

                    _t.slider({
                        min: min,
                        max: max,
                        value: val,
                        slide: function( event, ui ) {

                            if($(this).parent().hasClass('slider-ui-con')){
                                $(this).parent().find('.slider-ui-target-field').eq(0).val(ui.value);
                            }
                        }
                    })
                })
            }

        } else {
            // Sorry! No Web Storage support..
        }



        var _c = $('.preseter .the-content');
        //console.info(_c, _c[0]);
        if (_c[0] && _c[0].addEventListener){
            _c[0].addEventListener('DOMMouseScroll', handle_the_wheel, false);
        }else{
        }
        _c[0].onmousewheel = handle_the_wheel;


    }



    force_content_width = parseInt(qcreative_options.content_width,10);
    //console.info(qcreative_options.content_width, force_content_width);

    if(isNaN(force_content_width) || force_content_width==0){
        force_content_width=0;
    }

    force_content_gap_width = parseInt(qcreative_options.content_gap_width,10);

    if(isNaN(force_content_gap_width) || force_content_gap_width==0){
        force_content_gap_width=0;
    }

    //console.info(qcreative_options.content_width, force_content_width);

    if(force_content_width>0){
        content_width = force_content_width;
        default_content_width = content_width;
        var aux23=' body .main-container .the-content-con, body.page-blogsingle .the-content-con{max-width:'+force_content_width+'px;} body.page-portfolio-single .the-content-con:not(.fullit){ max-width:'+force_content_width+'px; }';
        _qcre_aux_css.html(_qcre_aux_css.html()+aux23);
    }
    if(force_content_gap_width>0){
        var aux23=' @media (min-width:992px) { .row{  margin-left:-'+Math.round(force_content_gap_width/2)+'px; margin-right:-'+Math.round(force_content_gap_width/2)+'px; } .col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12{ padding-left:'+Math.round(force_content_gap_width/2)+'px; padding-right:'+Math.round(force_content_gap_width/2)+'px;} .the-content-con > .the-content{ padding: '+force_content_gap_width+'px; } }';
        _qcre_aux_css.html(_qcre_aux_css.html()+aux23);
    }

    if(_body.hasClass('menu-type-5')||_body.hasClass('menu-type-6')){

        _body.addClass('menu-is-sticky');
    }

    if(_body.hasClass('menu-type-9')||_body.hasClass('menu-type-10') ||_body.hasClass('menu-type-13') ||_body.hasClass('menu-type-14') ||_body.hasClass('menu-type-15') ||_body.hasClass('menu-type-16') ||_body.hasClass('menu-type-17') ||_body.hasClass('menu-type-18') ){

        // -- social icons rearrangement

        var _c23 = _navCon.children('.nav-social-con');
        if(_c23.length>0){
            _c23.width(_c23.children('.social-icons').eq(0).width() + 3);
        }

        _theActualNav.css('margin-right', String(_c23.outerWidth()+30) + 'px')
    }


    windowhref = window.location.href;
    if(window.qcreative_options.enable_ajax == 'on' && window) {


        if(window.qcreative_options.site_url=='detect'){


            var auxa = windowhref.split('/');

            var i = 0;
            for(i in auxa){

                if(i>0){
                    ajax_site_url+='/';
                }
                if(i<auxa.length-1){
                    ajax_site_url+=auxa[i];
                }


            }
        }else{
            ajax_site_url = window.qcreative_options.site_url;
        }
        //console.log(ajax_site_url);


    }



    if(ieVersion()==11){
        var head= document.getElementsByTagName('head')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        //script.src= 'js/StackBlur.js';
        script.src= 'js/FastBlur.js';
        head.appendChild(script);
    }



    $('script').each(function(){
        var _t = $(this);


        if(_t.attr('src')){
            scripts_loaded_arr.push(_t.attr('src'));
        }
        //console.info(_t.attr('src'));

        if(String(_t.attr('src')).indexOf('https://maps.googleapis.com/maps/api')==0){
            window.google_maps_loaded = true;
        }
    });


    $('link').each(function(){
        var _t = $(this);

        //console.info(_t);

        if(_t.attr('rel')=='stylesheet' && _t.attr('href')){
            var aux_href = _t.attr('href');
            if(aux_href.indexOf('./')==0){
                aux_href = aux_href.replace('./','');
            }
            scripts_loaded_arr.push(aux_href);
        }
    });


    //console.info(_navCon_520,_navCon.children('.logo-con'))




    $(this).scrollTop(0);

    setTimeout(function(){

    },4000);

    if(_body.children('.custom-outside-content-1').length>0){
        has_custom_outside_content_1 = true;
    };

    //console.info(has_custom_outside_content_1);



    if(page!='page-homepage' && page!='page-gallery-w-thumbs' && window.qcreative_options.bg_isparallax=='on'){
        $('.translucent-canvas').addClass('for-parallaxer');
    }
    //console.info(scripts_loaded_arr)


    if(window.qcreative_options.enable_ajax=='on'){
        if(_body.children('.ajax-preloader').length==0){
            _body.append('<div class="ajax-preloader"><div class="loader"></div></div>');


            // <div class="preloader-wandering-cubes"><div class="preloader-cube preloader-cube1"></div><div class="preloader-cube preloader-cube2"></div></div>
        }
    }



    determine_page();

    //console.info('reinit from document ready');
    reinit();




    //console.info($('.qcreative--520-nav-con .dzs-select-wrapper-head'));

    setTimeout(function(){

        //console.info($('.qcreative--520-nav-con .dzs-select-wrapper-head'));

        $('.qcreative--520-nav-con .dzs-select-wrapper-head').bind('click', handle_mouse);
    },1000);



    if(_body.children('#wpadminbar').length){
        $(document).bind('mousemove',mousemove_document);
    }

    $(document).delegate('.main-gallery-buttons-con > *, .qcreative--520-nav-con .dzs-select-wrapper-head, .close-responsive-con, .custom-menu a','click', handle_mouse);
    $(document).delegate('form.for-contact','submit', handle_submit);

    $(document).delegate('.map-toggler', 'click',handle_mouse)
    $(document).delegate('.menu-toggler', 'click',handle_mouse)
    $(document).delegate('.menu-closer', 'click',handle_mouse)
    $(document).delegate('.services-lightbox', 'click',handle_mouse)
    $(document).delegate('.services-lightbox--close', 'click',handle_mouse)
    $(document).delegate('.contact-form .contact-form-button', 'click',handle_mouse)
    $(document).delegate('.submit-comment', 'click',handle_mouse)
    $(document).delegate('.portfolio-single-liquid-info', 'click',handle_mouse)
    $(document).delegate('.arrow-left-for-skin-qcre', 'click',handle_mouse)
    $(document).delegate('.arrow-right-for-skin-qcre', 'click',handle_mouse)
    $(document).delegate('.description-wrapper--icon-con', 'click',handle_mouse)
    $(document).delegate('.submenu-toggler', 'click',handle_mouse)
    $(document).delegate('.preseter-button--save', 'click',handle_mouse)
    $(document).delegate('.preseter-button--default', 'click',handle_mouse)
    //console.info($('.qcreative--520-nav-con'));
    $(document).delegate('.gallery-thumbs--image-container .advancedscroller .arrow-right,.gallery-thumbs--image-container .advancedscroller .arrow-left', 'click',handle_mouse_for_gallery_w_thumbs);




    if(qcreative_options.menu_scroll_method=='mousemove'){

        _navCon.bind('mousemove', handle_mouse);
    }else{

        if (_navCon[0].addEventListener){
            _navCon[0].addEventListener('DOMMouseScroll', handle_wheel, false);
        }else{
        }
        _navCon[0].onmousewheel = handle_wheel;
    }
    _body.addClass('menu-scroll-method-'+qcreative_options.menu_scroll_method);


    $(window).bind('beforeunload',handle_beforeunload);
    $(window).bind('resize',handle_resize);
    handle_resize(null,{
        'redraw_canvas' : false
    });

    $(window).bind('scroll', handle_scroll);

    if(window.addEventListener){

        window.addEventListener('popstate', handle_popstate);
    }

    //console.log(_navCon_520.find('option'));

    //console.info(_navCon, _theActualNav);
    //_theActualNav.find('a').bind('click', click_menu_anchor);


    // console.warn($('.the-actual-nav a'))
    $(document).delegate('.the-actual-nav a', 'click', click_menu_anchor);
    $('.menu-toggler-target, .logo-con').find('a').bind('click', click_menu_anchor);

    if(_body.hasClass('menu-type-3')||_body.hasClass('menu-type-4')||_body.hasClass('menu-type-5')||_body.hasClass('menu-type-6')||_body.hasClass('menu-type-7')||_body.hasClass('menu-type-8')){

        _theActualNav.children().each(function(){
            var _t = $(this);

            //console.info(_t);
            if(_t.find('ul').length>0){
                _t.append('<i class="sub-menu-indicator fa fa-chevron-circle-right"></i>');
            }
        })
    }

    goto_bg(0);


    handle_frame();


    function handle_the_wheel(e){

        //console.info('ceva');

        clearTimeout(inter_preseter_scroll);

        inter_preseter_scroll = setTimeout(function(){

            //console.info('ceva');

            var _c = $('.preseter .the-content');

            _c.find('.dzstooltip-con').each(function(){
                var _t233 = $(this);

                if(_t233.get(0) && _t233.get(0).api_handle_resize){
                    _t233.get(0).api_handle_resize();
                }
            })


        },300);

        e.stopPropagation()
    }


    function handle_beforeunload(){
        if(window.preseter_init){

            //localStorage.setItem("menu-type", '');
            //localStorage.setItem("page-title-style", '');
            //localStorage.setItem("page-title-align", '');
            //localStorage.setItem("heading-style", '');
            //localStorage.setItem("content-align", '');
            //localStorage.setItem("parallax_bg", '');
            //localStorage.setItem("blur_ammount", '');
            //localStorage.setItem("saturation_ammount", '');
            //localStorage.setItem("color_primary", '');
        }
    }

    function misc_regulate_nav(){

        //console.info(_navCon);

        regulate_nav();

        return false;

        //if( _body.hasClass('menu-type-5')||_body.hasClass('menu-type-6') ){
        //    _navCon.css({
        //        'top' : $(window).scrollTop() + 'px'
        //    })
        //
        //    if(ww<responsive_breakpoint){
        //
        //    }
        //}

        if(_body.hasClass('page-blogsingle') && _sidebarMain){

            //console.info(_sidebarMain.offset().top);


            //console.info(_theContent.offset().top, _theContent.height(), _sidebarMain.offset().top, _sidebarMain.height())
            //console.info(_sidebarMain.offset().top, _sidebarMain.height(), $(window).scrollTop(),wh, _sidebarMain.offset().top + _sidebarMain.height() + 30 , $(window).scrollTop()+wh)
            if(initial_sidebar_offset + _sidebarMain.height() + 30 < $(window).scrollTop()+wh){
                //console.info('ceva');

                var aux = ($(window).scrollTop()+wh) - (initial_sidebar_offset + _sidebarMain.height() + 30);



                //console.info(aux + initial_sidebar_offset+_sidebarMain.height(), _theContent.offset().top + _theContent.height() );

                if(aux + initial_sidebar_offset + _sidebarMain.height()> _theContent.offset().top + _theContent.height() + 40){
                    aux = _theContent.offset().top + _theContent.height() - _sidebarMain.height() + 40 - initial_sidebar_offset;
                }

                _sidebarMain.css({
                    'top' : aux
                })
            }else{

                _sidebarMain.css({
                    'top' : 0
                })
            }
            if(ww<responsive_breakpoint){

                _sidebarMain.css({
                    'top' : ''
                })
            }
        }
        //();


    }


    function reinit(){

        console.info('reinit()');


        var auxa = String(window.location.href).split('/');


        var aux2 = auxa[auxa.length-1];

        if(aux2.indexOf('?')>-1){
            //console.info(aux2);

            if(aux2.indexOf('clearcache=on')>-1){

                curr_html_with_clear_cache = true;
            }
            curr_html = aux2.split('?')[0];
        }else{
            curr_html=aux2;
        }
        if(curr_html==''){
            curr_html = '';
        }

        //console.info(auxa,aux2,curr_html);

        //console.info(page_is_fullwidth, _mainContainer.hasClass('fullit'));


        //$(document).scrollTop(0);


        setTimeout(function(){

            _body.removeClass('q-ajax-transitioning');
        },100)
        _body.removeClass('qtransitioning');
        _body.removeClass('page-is-fullwidth');


        if(_theContent){
            // console.info(_theContent.find('.sc-final-closer'));
            _theContent.find('.sc-final-closer').each(function(){
                var _t = $(this);

                // console.info(_t, _t.html())
                if(_t.html()==''){

                    // console.warn(_t.parent().parent().parent().parent().children().length);
                    // if(_t.parent().parent().hasClass('vc_col-sm-12')){
                    //     _t.parent().parent().parent().remove();
                    // }

                    if(_t.parent().parent().parent().parent().children().length==1){
                        _t.parent().parent().parent().parent().parent().remove();
                    }
                }
            });


            _theContent.find('.delete-prev-cst').each(function(){
                var _t = $(this);

                if(_t.prev().hasClass('the-content-sheet-text')){

                    _t.prev().hide();
                }
            })
            _theContent.find('.wpb_wrapper').each(function(){
                var _t = $(this);

                // console.info(_t, _t.html())
                if(_t.html()==''){

                    console.info(_t.parent().parent());
                    if(_t.parent().parent().hasClass('vc_col-sm-12')){
                        _t.parent().parent().parent().remove();
                    }
                }
            });

            _theContent.find('.vc_empty_space').each(function(){
                var _t = $(this);

                if(_t.parent().parent().parent().parent().hasClass('vc_row')){

                    _t.parent().parent().parent().parent().addClass('no-margin-bottom');
                }
            })

        }




        function call_scroll_for_parallaxer(arg,argx,argy){
            //console.info('scroll is called', arg,argx, argy);

            window.scroll_top_object.val -= argy;

            if(window.scroll_top_object.val<0){
                window.scroll_top_object.val = 0;
            }

            //console.info('first', window.scroll_top_object.val);

            if(_curr_parallaxer && _curr_parallaxer.get(0) && _curr_parallaxer.get(0).api_handle_scroll){
                _curr_parallaxer.get(0).api_handle_scroll();
            }

            if(window.dzs_check_lazyloading_images_inited){
                window.dzs_check_lazyloading_images();
            }

            setTimeout(function(){

            },100);






        }


        //console.info(window.qcreative_options);
        if(window.qcreative_options.enable_native_scrollbar!='on' && get_query_arg(window.location.href, 'disable_scrollbar')!=='on' && window.dzsscr_init){

            var args = {
                'type':'scrollTop'
                ,'settings_skin':'skin_apple'
                ,enable_easing: 'on'
                ,settings_autoresizescrollbar: 'on'
                ,settings_chrome_multiplier : 0.12
                ,settings_firefox_multiplier : -3
                ,settings_safari_multiplier: 0.25
                , settings_ie_multiplier: 0.8 //scrollmultiplier for ie
                ,settings_refresh: 700
            };

            if(_body.hasClass('with-border')){
                //args.replace_window_object = $('.main-container').eq(0);
                args.replace_window_object = $('.main-container > .the-content-con').eq(0);
                args.settings_scrollTop_height_indicator = $('.main-container > .the-content-con').eq(0);
                args.settings_comHeight_surplus = $('.main-container > .the-content-con').eq(0).offset().top;
                args.settings_scrollTop_animate_top_instead_of_scroll = "on";



            }

            window.dzsscr_init($('.main-container'),args);


            if(_body.hasClass('with-border')){
                //console.log($('.main-container'), $('.main-container').get(0).api_set_action_handle_wheel_end);
                $('.main-container').get(0).api_set_action_handle_wheel_end(call_scroll_for_parallaxer);
            }


            if(_mainContainer.get(0) && _mainContainer.get(0).api_set_action_handle_frame){

                _mainContainer.get(0).api_set_action_handle_frame(misc_regulate_nav);
            }




        }else{
            $('html').addClass('has-native-scrollbar');
        }

        if(is_touch_device()){

            $('html').addClass('has-native-scrollbar');
        }


        //console.info('social_scripts_reinit', social_scripts_reinit)
        if(social_scripts_reinit){
            //console.info('REINIT SOCIAL SCRIPS');
            if(window.FB && FB.XFBML && FB.XFBML.parse){
                //console.info('REINIT SOCIAL SCRIPS - FB');
                FB.XFBML.parse();
            }


            if(window.twttr && window.twttr.widgets && window.twttr.widgets.load){
                //console.info('twitter - load');
                twttr.widgets.load()
            }
        }



        if(_mainContainer.find('.the-content-con').eq(0).hasClass('fullit')){
            page_is_fullwidth=true;
        }

        if(page=='page-gallery-w-thumbs'||page=='page-homepage'){

            page_is_fullwidth=true;
        }

        is_menu_horizontal_and_full_bg = false;
        if(page_is_fullwidth){

            $("body").addClass('page-is-fullwidth');


            if (_body.hasClass('menu-type-9') || _body.hasClass('menu-type-10') || _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-15') || _body.hasClass('menu-type-16') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18')) {
                is_menu_horizontal_and_full_bg = true;


                //console.log($('.fullbg').eq(0).css('top'));
                _full_bg = $('.fullbg').eq(0);

                full_bg_init_y = parseInt(_full_bg.css('top'),10);


            }
        }



        var the_select_str ='<select class="dzs-style-me-from-q skin-justvisible " name="the_layout"> <option value="default">default</option> <option value="random">random</option> </select>';

        //console.info(qcreative_options.responsive_menu_type);
        if(qcreative_options.responsive_menu_type=='custom'){

            the_select_str = '';
        }

        var the_custom_menu_str = '';
        if(qcreative_options.responsive_menu_type=='custom'){

            the_select_str = '';

            the_custom_menu_str = '<div class="custom-responsive-menu"><div class="close-responsive-con"><i class="fa fa-times"></i></div><div class="custom-menu-con"><ul class="custom-menu"></ul></div></div>';


        }

        if(_theContent){
            //console.info(the_select_str, window.qcreative_options.responsive_menu_type, _theContent);
            if(_theContent.parent().children('.qcreative--520-nav-con').length==0){



                _theContent.parent().prepend('<div class="qcreative--520-nav-con "> <div class="dzs-select-wrapper skin-justvisible "> <div class="dzs-select-wrapper-head"> <div class="nav-wrapper-head"><i class="fa fa-bars"></i></div> </div> '+the_select_str+' </div>'+the_custom_menu_str+' </div>');


                _navCon_520 = _theContent.parent().children('.qcreative--520-nav-con').eq(0);
            }


            var _c = _theContent.find('.responsive-featured-media-con').eq(0);
            if(_c.length>0){
                //console.info('ceva');

                if(_c.children().length==0){
                    if(_theContent.find('.responsive-featured-media-con--target').length>0){
                        //console.info(_theContent.find('.responsive-featured-media-con--target'),_theContent.find('.responsive-featured-media-con--target').html());


                        _c.append(_theContent.find('.responsive-featured-media-con--target').html());

                        if(_theContent.find('.responsive-featured-media-con--target').eq(0).hasClass('advancedscroller-con')){

                            _c.children('.advancedscroller').removeClass('skin-nonav').addClass('skin-qcre').height(400);
                            _c.children('.advancedscroller').attr('data-options','{ settings_mode: "onlyoneitem",design_arrowsize: "0" ,settings_swipe: "on" ,settings_autoHeight: "on",settings_autoHeight_proportional: "on",settings_swipeOnDesktopsToo: "on" ,settings_slideshow: "on" ,settings_slideshowTime: "150" }');

                        }

                    }
                }


                if(_c.children().length==0){
                    if(_theContent.find('.responsive-featured-media-con--target').length==0){

                        var aux = $('.main-bg-div').eq(0).css('background-image');
                        var aux2 = '<img src="'+window.qcreative_options.images_arr[0]+'" class="fullwidth"/>';

                        //console.log(window.qcreative_options);

                        _c.append(aux2);
                        //_c.append();
                        //_c.children('.main-bg-div').height(400);
                    }
                }


            }
        }else{
            if(page=='page-homepage'){



                if($('.the-content-con').eq(0).children('.qcreative--520-nav-con').length==0){

                    $('.the-content-con').eq(0).prepend('<div class="qcreative--520-nav-con "> <div class="dzs-select-wrapper skin-justvisible "> <div class="dzs-select-wrapper-head"> <div class="nav-wrapper-head"><i class="fa fa-bars"></i></div> </div> '+the_select_str+' </div>'+the_custom_menu_str+'</div>');


                    _navCon_520 = $('.the-content-con').eq(0).children('.qcreative--520-nav-con').eq(0);
                }

            }

        }




        if(_navCon_520.children('.logo-con').length==0){

            _navCon_520.prepend(_navCon.children('.logo-con').clone());
        }


        var _cac = _navCon_520.find('.dzs-select-wrapper select').eq(0);

        if(_navCon_520.children('.custom-responsive-menu').length>0){
            custom_responsive_menu=true;
            _cac = _navCon_520.children('.custom-responsive-menu').find('.custom-menu').eq(0);

            //console.info(_cac);
        }

        _cac.html('');
        _theActualNav.children('li').each(function(){
            var _t = $(this);
            //console.info(_t);

            var aux_str = '';

            if(custom_responsive_menu==false){
                aux_str = '<option';

                if(_t.hasClass('current-menu-item')){
                    aux_str+=' selected';
                }

                aux_str +=' value="'+_t.children('a').attr('href')+'">'+_t.children('a').eq(0).html()+'</option>';

                _cac.append(aux_str);

                //console.info(_t,_t.hasClass('current-menu-item'));
                if(_t.children('ul').length>0){

                    _t.children('ul').eq(0).children('li').each(function(){

                        var _t2 = $(this);
                        _cac.append('<option value="'+_t2.children('a').attr('href')+'"> - '+_t2.children('a').eq(0).html()+'</option>');


                        //console.info(_t2, _t2.children('ul'));

                        _t2.children('ul').eq(0).children('li').each(function(){

                            var _t3 = $(this);
                            //console.info(_t2);
                            _cac.append('<option value="'+_t3.children('a').attr('href')+'"> - - '+_t3.children('a').eq(0).html()+'</option>');


                        });
                    });
                }
            }else{

                //console.info(_cac, _theActualNav,_theActualNav.html());


                //aux_str = '<li class="';
                //
                //if(_t.hasClass('current-menu-item')){
                //    aux_str+=' current-menu-item';
                //}
                //
                //aux_str +='"><a  href="'+_t.children('a').attr('href')+'">'+_t.children('a').eq(0).html()+'</a>';
                //
                //
                ////console.info(_t,_t.hasClass('current-menu-item'));
                //if(_t.children('ul').length>0){
                //
                //    aux_str+='<ul>';
                //    _t.children('ul').eq(0).children('li').each(function(){
                //
                //        var _t2 = $(this);
                //        _cac.append('<li><a href="'+_t2.children('a').attr('href')+'"> - '+_t2.children('a').eq(0).html()+'</li>');
                //
                //
                //        //console.info(_t2, _t2.children('ul'));
                //
                //        _t2.children('ul').eq(0).children('li').each(function(){
                //
                //            var _t3 = $(this);
                //            //console.info(_t2);
                //            _cac.append('<option value="'+_t3.children('a').attr('href')+'"> - - '+_t3.children('a').eq(0).html()+'</option>');
                //
                //
                //        });
                //    });
                //    aux_str+='</ul>';
                //}
                //
                //aux_str+='</li>';
            }


        });

        if(custom_responsive_menu){

            _cac.append(_theActualNav.html());
            //_cac.append(aux_str);

            _cac.find('li').each(function(){
                var _t = $(this);

                //console.info(_t, _t.children('ul').length);



                if(_t.children('ul').length>0){

                    _t.addClass('has-children');
                    _t.prepend('<i class="submenu-toggler fa fa-angle-right"></i>')
                    //console.info('THIS HAS CHILDREN');
                }

            })

        }
        _navCon_520.find('select').eq(0).unbind('change', change_nav_con_520);
        _navCon_520.find('select').eq(0).bind('change', change_nav_con_520);


        //content_width = 930;

        if (_body.hasClass('menu-type-3') || _body.hasClass('menu-type-4')||_body.hasClass('menu-type-5') || _body.hasClass('menu-type-6')) {

            menu_width = 230;
        }
        if (_body.hasClass('menu-type-7') || _body.hasClass('menu-type-8') || _body.hasClass('menu-type-11')) {

            menu_width = 260;
        }
        if (_body.hasClass('menu-type-12')) {

            menu_width = 170;
            menu_width_on_right = 200;
        }
        if (_body.hasClass('page-portfolio') || _body.hasClass('page-blogsingle') ) {

            content_width = default_content_width - 60;
        }



        if (_body.hasClass('menu-type-5') || _body.hasClass('menu-type-6') || _body.hasClass('menu-type-7') || _body.hasClass('menu-type-8') || _body.hasClass('menu-type-11')) {
            menu_content_space = 30;
        }
        if (_body.hasClass('menu-type-9') || _body.hasClass('menu-type-10') || _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-15') || _body.hasClass('menu-type-16') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18') ) {
            //console.info('ceva',_theContent, _theContent.parent().prev(), _theContent.parent().prev().length==0, _theContent.parent().prev().hasClass('q-creative--nav-con'));
            menu_width=0;
            menu_width_on_right = 0;
            menu_content_space = 0;
            menu_height = 135;
            thumbs_padding_left_and_right = 40;
            thumbs_list_padding_right = 20;

            if( _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-15') || _body.hasClass('menu-type-16') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18')){
                menu_height = 100;
            }


            if( _theContent&& ( _theContent.parent().prev().length==0 || _theContent.parent().prev().hasClass('q-creative--nav-con')==false) && _mainContainer.children().eq(0).hasClass('qcreative--nav-con')==false ){

                //console.info('... hmm ', _mainContainer, $('.qcreative--nav-con').eq(0))
                _mainContainer.prepend($('.qcreative--nav-con').eq(0));
            }
        }



        if (_body.hasClass('menu-type-11') || _body.hasClass('menu-type-12')) {
            //console.info('ceva',_theContent, _theContent.parent().prev(), _theContent.parent().prev().length==0, _theContent.parent().prev().hasClass('q-creative--nav-con'));
            _navCon.append('<i class="fa fa-bars menu-toggler"></i>');

            _mainContainer.append('<div class="menu-toggler-target "><div class="q-close-btn menu-closer"><svg version="1.1" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="58.42px" height="58.96px" viewBox="0 0 58.42 58.96" xml:space="preserve"> <polygon fill-rule="evenodd" fill="#FFFFFF" points="57,0 29.21,27.78 1.42,0 0,1.42 27.78,29.21 0,57 1.42,58.42 29.21,30.64 57,58.42 58.42,57 30.63,29.21 58.42,1.42 "></polygon> </svg></div></div>');

            _mainContainer.find('.menu-toggler-target').eq(0).append(_navCon.find('.the-actual-nav').eq(0));
        }

        _body.removeClass('page-title-no-antetitle');

        if(_body.hasClass('page-title-style-1')){
            if(String(_body.find('h1').eq(0).html()).indexOf('<br>')>-1){

            }else{
                _body.addClass('page-title-no-antetitle');
            }
        }






        _gallery_thumbs_con = null;

        $('.social-icon').each(function(){

            var aux = window.location.href;
            var _t = $(this);
            _t.attr('onclick', String(_t.attr('onclick')).replace('{{replaceurl}}',aux));
        })






        if($('.sidebar-main').length>0){
            _sidebarMain = $('.sidebar-main').eq(0);

            initial_sidebar_offset = _sidebarMain.offset().top + border_width;

            initial_theContent_offset = _theContent.offset().top + border_width;
        }else{
            _sidebarMain = null;

            initial_sidebar_offset =0;
            initial_theContent_offset=0;
        }


        // console.info("Sidebar Main - ",_sidebarMain);



        var i23 = 0;
        $('.translucent-bg').each(function() {
            var _t = $(this);




            //console.info(_t, _t.parent(),_t.parent().parent(),mainBgImgCSS);

            calculate_translucent(_t);


            i23++;
        });


        var color_outside_circle = '#eeeeee';
        var color_inside_circle = '#333333';
        $('.qcre-progress-circle').each(function() {
            var _t = $(this);


            if($('.the-content-sheet.the-content-sheet-dark').find(_t).length>0){
                color_inside_circle='#ffffff';
                color_outside_circle='#333333';
            }
            //console.info($('.the-content-sheet.the-content-sheet-dark').find(_t).length);


            _t.html(' <div class="dzs-progress-bar skin-prev9copy" style="width:100%; max-width: 150px; height:auto;margin-top:0px;margin-left:auto;margin-right:auto;margin-bottom:0px;" data-animprops=\'{"animation_time":"'+_t.attr('data-animation_time')+'","maxperc":"'+_t.attr('data-maxperc')+'","maxnr":"'+_t.attr('data-maxnr')+'","initon":"scroll"}\'><canvas class="progress-bars-item progress-bars-item--circ" data-type="circ" data-animprops=\'{"height":"{{width}}","circle_outside_fill":"'+color_outside_circle+'","circle_inside_fill":"transparent","circle_outer_width":"1","circle_line_width":"10"}\' style="position: absolute; width: calc(100% + 8px); top: -4px; left: -4px; right: auto; bottom: auto; margin: 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: 1; font-size: 12px; background-color: transparent;" width="302" height="302"></canvas><canvas class="progress-bars-item progress-bars-item--circ" data-type="circ" data-animprops=\'{"height":"{{width}}","circle_outside_fill":"'+color_inside_circle+'","circle_inside_fill":"transparent","circle_outer_width":"{{perc-decimal}}","circle_line_width":"2"}\' style="position: relative; width: 100%; top: 0px; left: 0px; right: auto; bottom: auto; margin: 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: 1; font-size: 12px; background-color: transparent;" width="298" height="298"></canvas><div class="progress-bars-item progress-bars-item--text" data-type="text" data-animprops=\'{"left":"{{center}}"}\' style="position: absolute; top: 54px; width: 100%; height: auto; right: auto; bottom: auto; margin: 0px; color: rgb(33, 33, 33); border-radius: 0px; border: 0px; opacity: 1; font-size: 40px; background-color: transparent;"><div style="text-align: center; font-family: Lato, arial, serif; font-weight: 300;" data-mce-style="text-align: center;">{{perc}}</div></div></div>');

            _t.addClass('treated');
        });



        $('.qcre-progress-line').each(function() {
            var _t = $(this);

            //var auxhtml = _t.html();


            if($('.the-content-sheet.the-content-sheet-dark').find(_t).length>0){
                color_inside_circle='#ffffff';
                color_outside_circle='#333333';
            }
            // --'+_t.html()+'
            _t.html(' <div class="dzs-progress-bar auto-init skin-prev2copy" style="width:100%;height:auto;margin-top:0px;margin-left:0px;margin-right:0px;margin-bottom:0px;" data-animprops=\'{"animation_time":"'+_t.attr('data-animation_time')+'","maxperc":"'+_t.attr('data-maxperc')+'","maxnr":"'+_t.attr('data-maxnr')+'","initon":"scroll"}\'><div class="progress-bars-item progress-bars-item--text" data-type="text" data-animprops=\'{}\' style="position: relative; width: 100%; height: auto; top: 0px; left: 0px; right: auto; bottom: auto; margin: 0px; color: rgb(33, 33, 33); border-radius: 0px; border: 0px; opacity: 1; font-size: 14px; background-color: transparent;">'+_t.attr('data-title')+'</div><div class="progress-bars-item progress-bars-item--rect" data-type="rect" data-animprops=\'{"width":"{{perc}}%"}\' style="position: relative; height: 2px; top: 0px; left: 0px; right: auto; bottom: auto; margin: 11px 0px 0px; color: rgb(60, 1, 1); border-radius: 0px; border: 0px; opacity: 1; font-size: 12px; background-color: rgb(34, 34, 34);"></div><div class="progress-bars-item progress-bars-item--text" data-type="text" data-animprops=\'{"left":"{{perc}}"}\' style="position: absolute; width: 0px; height: auto; top: 0px; right: auto; bottom: auto; margin: 0px 0px 0px 0px; color: #999999; border-radius: 0px; border: 0px; font-size: 14px; background-color: transparent;"><div style="text-align: right; position:absolute; right:0; white-space:nowrap; " data-mce-style="text-align: left;">{{perc}}</div></div><div class="progress-bars-item progress-bars-item--rect" data-type="rect" data-animprops=\'{}\' style="position: absolute; width: 100%; height: 10px; top: 23px; left: 0px; right: auto; bottom: auto; margin: 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: 1; font-size: 12px; background-color: '+color_outside_circle+';"></div><div class="progress-bars-item progress-bars-item--rect" data-type="rect" data-animprops=\'{"width":"{{perc}}"}\' style="position: relative; height: 2px; top: auto; left: 0px; right: auto; bottom: 0px; margin: -5px 0px 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: 1; font-size: 12px; background-color: rgb(34, 34, 34);"></div></div>');

            _t.addClass('treated');
        });

        $('.qcre-progress-text').each(function() {
            var _t = $(this);



            _t.html('<div class="dzs-progress-bar auto-init skin-bignumber" style="width:100%;height:auto;margin-top:0px;margin-left:0px;margin-right:0px;margin-bottom:0px;" data-animprops=\'{"animation_time":"'+_t.attr('data-animation_time')+'","maxperc":"'+_t.attr('data-maxperc')+'","maxnr":"'+_t.attr('data-maxnr')+'","initon":"scroll"}\'><div class="progress-bars-item progress-bars-item--text" data-type="text" data-animprops=\'{}\' style="position: relative; width: 100%; height: auto; top: 0px; left: 0px; right: auto; bottom: auto; margin: 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: 1; font-size: 50px; background-color: transparent;"><div style="text-align: center;" data-mce-style="text-align: center;"><span style="color: rgb(255, 255, 255); font-family: \'Open Sans\', Helvetica, Arial, sans-serif; font-size: 50px; line-height: 20px; background-color: transparent;" data-mce-style="color: #ffffff; font-family: \'Open Sans\', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 20px; background-color: #313131;">{{percmaxnr}}</span></div></div></div>');

            _t.addClass('treated');
        });

        $('.qcre-progress-rect').each(function() {
            var _t = $(this);

            if(_t.hasClass('treated')){
                return;
            }


            var color_inside_circle = 'rgb(34,34,34)';
            var color_outside_circle = '';

            var color_opacity_line = '1';
            if($('.the-content-sheet.the-content-sheet-dark').find(_t).length>0){
                color_inside_circle='#ffffff';
                color_outside_circle='#333333';
                color_opacity_line = '0.25';
            }

            //console.info(_t, _t.children('div[class*="icon-"]'), _t.children('div[class*="icon-"]').length);

            if(_t.children('div[class*="icon-"]').length==0){

                _t.html('<div class="dzs-progress-bar auto-init skin-prev3copy" style="width:100%;height:auto;margin-top:0px;margin-left:0px;margin-right:0px;margin-bottom:0px;" data-animprops=\'{"animation_time":"'+_t.attr('data-animation_time')+'","maxperc":"'+_t.attr('data-maxperc')+'","maxnr":"'+_t.attr('data-maxnr')+'","initon":"scroll"}\'><div class="progress-bars-item progress-bars-item--text" data-type="text" data-animprops=\'{}\' style="position: relative; width: 100%; height: auto; top: 0px; left: 0px; right: auto; bottom: auto; margin: 0px 0px 5px 0px; padding-right:20px; color: '+color_inside_circle+'; border-radius: 0px; border: 0px; opacity: 1; font-family: Open Sans, serif; font-weight: 800;font-size: 70px; line-height: 1; background-color: transparent;"><div style="text-align: center;" data-mce-style="text-align: right;"><span>{{percmaxnr}}</span></div></div><div class="progress-bars-item progress-bars-item--text" data-type="text" data-animprops=\'{}\' style="position: relative; width: 100%; height: auto; top: 0px; left: 0px; right: auto; bottom: auto; margin: 0px 0px 0px 0px; padding-right:20px; padding-bottom:20px; color: '+color_inside_circle+'; border-radius: 0px; border: 0px; opacity: 1; font-size: 14px; background-color: transparent;"><div style="text-align: center; font-family: Lato,serif; font-weight:bold;" data-mce-style="text-align: center;">'+_t.attr('data-text')+'</div></div><div class="progress-bars-item progress-bars-item--rect" data-type="rect" data-animprops=\'{}\' style="position: absolute; width: 100%; height: 1px; top: auto; left: 0px; right: auto; bottom: 0px; margin: 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: '+color_opacity_line+'; font-size: 12px; background-color: rgb(205, 205, 205);"></div> <div class="progress-bars-item progress-bars-item--rect" data-type="rect" data-animprops=\'{}\' style="position: absolute; width: 1px; height: 120px; top: auto; left: auto; right: 0px; bottom: 0px; margin: 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: '+color_opacity_line+'; font-size: 12px; background-color: rgb(205, 205, 205);"></div> </div>');
            }else{


                var aux = _t.children('div[class*="icon-"]').eq(0).get(0).outerHTML;
                _t.html('<div class="dzs-progress-bar auto-init skin-prev3copy" style="width:100%;height:180px;margin-top:0px;margin-left:0px;margin-right:0px;margin-bottom:0px;" data-animprops=\'{"animation_time":"'+_t.attr('data-animation_time')+'","maxperc":"'+_t.attr('data-maxperc')+'","maxnr":"'+_t.attr('data-maxnr')+'","initon":"scroll"}\'><div class="progress-bars-item progress-bars-item--text" data-type="text" data-animprops=\'{}\' style="position: relative; width: 100%; height: auto; top: 0px; left: 0px; right: auto; bottom: auto; margin: 0px 0px 5px 0px; padding-right:20px;  padding-top: 71px;color: '+color_inside_circle+'; border-radius: 0px; border: 0px; opacity: 1; font-family: Open Sans, serif; font-weight: 800;font-size: 70px; line-height: 1; background-color: transparent;"><div style="text-align: right;" data-mce-style="text-align: right;"><span>{{percmaxnr}}</span></div></div><div class="progress-bars-item progress-bars-item--text" data-type="text" data-animprops=\'{}\' style="position: relative; width: 100%; height: auto; top: 0px; left: 0px; right: auto; bottom: auto; margin: 0px 0px 0px 0px; padding-right:20px; padding-bottom:20px; color:'+color_inside_circle+'; border-radius: 0px; border: 0px; opacity: 1; font-size: 14px; background-color: transparent;"><div style="text-align: right; font-family: Lato,serif; font-weight:bold;" data-mce-style="text-align: right;">'+_t.attr('data-text')+'</div></div><div class="progress-bars-item progress-bars-item--rect" data-type="rect" data-animprops=\'{}\' style="position: absolute; width: 100%; height: 1px; top: auto; left: 0px; right: auto; bottom: 0px; margin: 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: '+color_opacity_line+'; font-size: 12px; background-color: rgb(205, 205, 205);"></div> <div class="progress-bars-item progress-bars-item--rect" data-type="rect" data-animprops=\'{}\' style="position: absolute; width: 1px; height: 180px; top: auto; left: auto; right: 0px; bottom: 0px; margin: 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: '+color_opacity_line+'; font-size: 12px; background-color: rgb(205, 205, 205);"></div> </div>');

                _t.children('.dzs-progress-bar').prepend(aux);
            }

            _t.addClass('treated');


        });


        if(window.dzsprb_init){

            window.dzsprb_init('.dzs-progress-bar',{init_each:true});
        }


        //console.info(".translucent-canvas");

        $('.translucent-canvas').each(function() {
            var _t = $(this);


            //calculate_translucent_canvas(_t);




            //
            //
            //function drawStackBlur() {
            //
            //
            //    var aux2 = $('.main-bg').eq(0).css('background-image');
            //    //console.log(_t,_t.css('background-image'));
            //    aux2 = aux2.replace('url(', '');
            //    aux2 = aux2.replace(')', '');
            //    aux2 = aux2.replace("'", '');
            //    aux2 = aux2.replace('"', '');
            //
            //
            //
            //
            //}
            //
            //setTimeout(drawStackBlur, 1000);
            ////console.info(_t, mainBgImgCSS);



        });




        _c_for_parallax_items = [];
        if($('.translucent-canvas.for-parallaxer').length>0){
            $('.translucent-canvas.for-parallaxer').each(function(){
                var _t = $(this);
                _c_for_parallax_items.push(_t);
            })
            //= ;
        }



        // console.log("PAGE IS ", page, page=='page-gallery-w-thumbs', newclass_body_page);
        if(newclass_body_page=='page-gallery-w-thumbs') {


            // console.info($("#as-gallery-w-thumbs"));


            $("#as-gallery-w-thumbs").each(function(){
                var _t = $(this);


                var _t2_i = 0;
                _t.find('.items').eq(0).children().each(function(){
                    var _t2 = $(this);
                    //console.log(_t2);



                    if(_t2.hasClass('processed')){
                        return;
                    }

                    // console.info(_t2);

                    if(_t2.attr('data-gallery-thumbnail')){

                        var aux = '<li class="thumb';

                        if(_t2_i==0){
                            aux+=' curr-thumb';
                        }

                        aux+='"  style=";"><div class="bgimage"  style="background-image: url('+_t2.attr('data-gallery-thumbnail')+')"></div></li>';

                        $('.gallery-thumbs-con .thumbs-list').eq(0).append(aux);

                        _t2_i++;
                    }

                    if(_t2.attr('data-type')=='image'){
                        _t2.addClass('needs-loading')
                    }
                    if(_t2.attr('data-type')=='video'){
                        var aux = '<div class="wipeout-wrapper"><div class="wipeout-wrapper-inner"><div class="vplayer-tobe " ';

                        if(_t2.attr('data-width-for-gallery')){
                            aux+=' data-width-for-gallery="'+_t2.attr('data-width-for-gallery')+'"';
                        }
                        if(_t2.attr('data-height-for-gallery')){
                            aux+=' data-height-for-gallery="'+_t2.attr('data-height-for-gallery')+'"';
                        }

                        aux+=' data-src="'+_t2.attr('data-source')+'" >';


                        if(_t2.children('.cover-image').length>0){
                            //console.info(_t2.children('.cover-image'), _t2.children('.cover-image').eq(0).outerHTML())

                            aux+=_t2.children('.cover-image').eq(0).outerHTML();
                            _t2.children('.cover-image').remove();
                        }

                        aux+='</div></div></div>';

                        _t2.addClass('needs-loading')
                        _t2.attr('data-source','');

                        _t2.append(aux);




                        dzsvp_init(_t2.find('.vplayer-tobe'),qcreative_options.video_player_settings)
                    }

                    _t2.addClass('processed');
                });

                // -- as gallery w thumbs
                dzsas_init(_t,{
                    settings_mode: "onlyoneitem"
                    ,design_arrowsize: "0"
                    ,settings_swipe: "off"
                    ,settings_swipeOnDesktopsToo: "off"
                    ,settings_slideshow: "on"
                    ,settings_slideshowTime: "300000"
                    ,settings_transition:"wipeoutandfade"
                    ,settings_lazyLoading:'on'
                    ,settings_autoHeight:'on'
                    ,settings_centeritems:false
                    ,design_bulletspos: "none"
                    ,settings_wait_for_do_transition_call: "on"
                    ,settings_transition_only_when_loaded: "on"
                    ,mode_onlyone_autoplay_videos : window.qcreative_options.gallery_w_thumbs_autoplay_videos
                    ,mode_onlyone_reset_videos_to_0:'on'
                });
            });




            if (document.getElementById("as-gallery-w-thumbs") && document.getElementById("as-gallery-w-thumbs").api_set_action_call_on_gotoItem) {

                document.getElementById("as-gallery-w-thumbs").api_set_action_call_on_gotoItem(page_gallery_w_thumbs_calculate);
            }
        }

        if(_mainContainer.get(0) && _mainContainer.get(0).api_toggle_resize){
            _mainContainer.get(0).api_toggle_resize();
            //console.info('ceva');

            setTimeout(function(){

                _mainContainer.get(0).api_toggle_resize();
            },900);
        }
        //console.info(page);

        $('.zfolio-portfolio-classic a.zfolio-item--inner, .portfolio-link--toback a, a.portfolio-link--title').unbind('click', click_menu_anchor);
        $('.zfolio-portfolio-classic a.zfolio-item--inner, .portfolio-link--toback a, a.portfolio-link--title').bind('click', click_menu_anchor);
        $('a.ajax-link').unbind('click', click_menu_anchor);
        $('a.ajax-link').bind('click', click_menu_anchor);

        if(window.dzsvp_init){


            //zfolio-portfolio-expandable
            //console.info($('.vplayer-tobe.auto-init-from-q:not(".zfolio-portfolio-expandable .vplayer-tobe.auto-init-from-q")'));



            $('.vplayer-tobe.auto-init-from-q:not(".zfolio-portfolio-expandable .vplayer-tobe.auto-init-from-q")').each(function(){
                var _t = $(this);

                //console.warn(_t.get(0),  _t.get(0).style.height);

                //if(_t.get(0) && _t.get(0).style && _t.get(0).style.height){
                //    //console.log(content_width);
                //
                //
                //    if(_t.get(0).style.height=='auto'){
                //        _t.addClass('auto-height-16-9');
                //        videoplayers_tobe_resized.push(_t);
                //    }else{
                //        _t.data('original-width', _t.width());
                //        _t.data('original-height', _t.height());
                //        _t.data('reference-width', content_width-120);
                //
                //
                //
                //        //console.log(content_width, _theContent.find('.sidebar-main'), ((content_width-30)/3*2) - 30);
                //
                //        if(_theContent.find('.sidebar-main').length==1){
                //
                //            _t.data('reference-width', ((content_width-30)/3*2) - 30);
                //        }
                //
                //        videoplayers_tobe_resized.push(_t);
                //    }
                //
                //}

                //console.info('dzsvp_init', _t);

                var responsive_ratio = "0.562";

                if(_t.attr('data-responsive_ratio')){
                    responsive_ratio = _t.attr('data-responsive_ratio');
                }

                // console.info(_t);

                if(_t.parent().hasClass('slider-con')){
                    responsive_ratio = '';
                }
                dzsvp_init(_t,{
                    settings_youtube_usecustomskin:"off"
                    ,init_each:true
                    ,controls_out_opacity: "1"
                    ,controls_normal_opacity: "1"
                    ,settings_video_overlay: "on"
                    ,design_skin: "skin_reborn"
                    ,cueVideo: "off"
                    ,autoplay: "off"
                    ,responsive_ratio: responsive_ratio
                });
            })


        }



        if(window.dzstaa_init){


            //zfolio-portfolio-expandable
            //console.info($('.vplayer-tobe.auto-init-from-q:not(".zfolio-portfolio-expandable .vplayer-tobe.auto-init-from-q")'));

            dzstaa_init('.dzs-tabs.auto-init-from-q-for-tabs',{ 'design_tabsposition' : 'top'
                ,design_transition: 'fade'
                ,design_tabswidth: 'default'
                ,toggle_breakpoint : '300'
                ,settings_appendWholeContent: false
                ,toggle_type: 'accordion'});

            dzstaa_init('.dzs-tabs.auto-init-from-q-for-accordions',{ 'design_tabsposition' : 'top'
                ,design_transition: 'fade'
                ,design_tabswidth: 'default'
                ,toggle_breakpoint : '4000'
                ,settings_appendWholeContent: false
                ,toggle_type: 'accordion'});
        }

        if(window.dzsap_init){



            var settings_ap = {
                disable_volume: 'off'
                ,disable_scrub: 'default'
                ,design_skin: 'skin-redlights'
                ,skinwave_dynamicwaves:'off'
                ,skinwave_enableSpectrum:'off'
                ,settings_backup_type:'full'
                ,skinwave_enableReflect:'on'
                ,skinwave_comments_enable:'on'
                ,skinwave_timer_static:'off'
                ,disable_player_navigation: 'off'
                ,skinwave_mode: 'normal'
                ,default_volume:'last' // -- number / set the default volume 0-1 or "last" for the last known volume
                ,skinwave_comments_retrievefromajax:'off'

                ,soundcloud_apikey:"be48604d903aebd628b5bac968ffd14d"//insert api key here
                ,embed_code:"You can enable embed button for your viewers to embed on their site, the code will auto generate. &lt;iframe src=&quot;http://yoursite.com/bridge.php?type=gallery&amp;id=gal1&quot; &gt;&lt;/iframe&gt;"
                ,init_each: true
                ,settings_php_handler : ''
                ,action_audio_play2: dzsap_handle_play
            };

            //zfolio-portfolio-expandable
            //console.info($('.vplayer-tobe.auto-init-from-q:not(".zfolio-portfolio-expandable .vplayer-tobe.auto-init-from-q")'));




            window.dzsap_init('.audioplayer-tobe.auto-init-from-q',settings_ap);


            if(window.dzsag_init){
                window.dzsag_init('.audiogallery',{
                    'transition':'fade'
                    ,'cueFirstMedia' : 'off'
                    ,'autoplay' : 'on'
                    ,'autoplayNext' : 'on'
                    ,design_menu_position:'bottom'
                    ,'settings_ap':settings_ap
                    ,embedded: 'off'
                    ,init_each: true
                    ,enable_easing: 'on'
                    ,design_menu_height: 200
                    ,settings_mode: "mode-showall"
                    ,design_menu_state: 'open' // -- options are "open" or "closed", this sets the initial state of the menu, even if the initial state is "closed", it can still be opened by a button if you set design_menu_show_player_state_button to "on"
                    ,design_menu_show_player_state_button: 'on' // -- show a button that allows to hide or show the menu

                });
            }




        }

        if(window.dzsas_init){


            //zfolio-portfolio-expandable
            //console.info($('.vplayer-tobe.auto-init-from-q:not(".zfolio-portfolio-expandable .vplayer-tobe.auto-init-from-q")'));

            dzsas_init('.advancedscroller.auto-init-from-q.clients-slider',{
                init_each: true
                ,settings_swipe: "on"
                ,settings_swipeOnDesktopsToo: "on"
                ,design_itemwidth: "16.666667%"
                ,responsive_720_design_itemwidth: "50%"
            });




            //console.info($('.advancedscroller.skin-qcre.auto-init-from-q'), $('.advancedscroller.skin-qcre.auto-init-from-q').width(), $('.advancedscroller.skin-qcre.auto-init-from-q').parent().width());



            $('.advancedscroller.skin-qcre.auto-init-from-q,.advancedscroller.skin-trumpet.auto-init-from-q').each(function(){
                var _t = $(this);

                //_t.width(870);

                if(_t.hasClass('inited')){

                    _t.get(0).api_handleResize();
                }else{
                    dzsas_init(_t,{
                        init_each: true
                    });
                }

            })


            // console.info($('.advancedscroller.skin-whitefish.auto-init-from-q'));

            dzsas_init(".advancedscroller.testimonial-ascroller",{
                settings_mode: "onlyoneitem"
                ,design_arrowsize: "0"
                ,settings_swipe: "on"
                ,settings_swipeOnDesktopsToo: "on"
                ,settings_slideshow: "on"
                ,settings_slideshowTime: "300"
                ,settings_transition:"slide"
                ,settings_lazyLoading:'on'
                ,settings_autoHeight:'off'
                ,settings_centeritems:false
                ,design_bulletspos: "bottom"
                ,settings_wait_for_do_transition_call: "off"
                ,settings_transition_only_when_loaded: "off"
            });


            dzsas_init('.advancedscroller.skin-whitefish.auto-init-from-q',{
                init_each: true
                ,settings_swipe: "on"
                ,settings_swipeOnDesktopsToo: "on"
            });

            $('.advancedscroller.skin-nonav.auto-init-from-q:not(".inited")').each(function(){
                var _t21 = $(this);
                var args = {
                    init_each: true
                    ,settings_swipe: "on"
                    ,settings_swipeOnDesktopsToo: "on"
                };

                if(_t21.attr('data-options')){
                    aux = 'window.dzsas_self_options = ' + _t21.attr('data-options');
                    //console.info(aux);

                    try{

                        eval(aux);
                    }catch(err){
                        console.error(err);
                    }

                    //console.info(window.dzssc)
                    args = $.extend({},window.dzsas_self_options);
                    window.dzsas_self_options = $.extend({}, {});
                }

                if(_t21.hasClass('inited')==false){

                    dzsas_init(_t21,args);
                }
            })


            setTimeout(function(){
                $('.testimonial-ascroller').each(function(){
                    var _t = $(this);

                    if(_t.get(0) && _t.get(0).api_force_resize){
                        _t.get(0).api_force_resize();
                    }
                })
            },100)
        }


        // -- init
        // -- from reinit()
        if(window.dzszfl_init){

            //console.info('fromreinit', $('.zfolio.auto-init-from-q'));
            dzszfl_init('.zfolio.auto-init-from-q',{
                init_each: true
            });

        }
        if(window.dzssel_init){


            //zfolio-portfolio-expandable
            //console.info($('.vplayer-tobe.auto-init-from-q:not(".zfolio-portfolio-expandable .vplayer-tobe.auto-init-from-q")'));


            dzssel_init('select.dzs-style-me-from-q', {init_each: true});

        }

        clearInterval(inter_bg_slideshow);
        bg_slideshow_time = Number(window.qcreative_options.bg_slideshow_time);


        if(bg_slideshow_time){
            inter_bg_slideshow = setInterval(function(){
                goto_next_bg();
            }, bg_slideshow_time*1000);
        }



        //console.info(window.qcreative_options);
        //_theContent.find('.zfolio-portfolio-expandable').find('.item-tobe').addClass('loaded');



        //if(window.qcreative_options.bg_isparallax=='on'){
        //    $('.main-bg-con').addClass('dzsparallaxer');
        //    $('.main-bg').addClass('dzsparallaxer--target');
        //
        //    dzsprx_init('.dzsparallaxer', {mode_scroll: 'fromtop', direction: 'reverse'});
        //}
    }

    function dzsap_handle_play(argcthis){


        //console.info(argcthis);


        $('.audioplayer').each(function(){
            var _t = $(this);
            if(_t.get(0)!=argcthis.get(0)){
                if(_t.get(0).api_seek_to_perc){
                    _t.get(0).api_seek_to_perc(0);
                }
            }
        })
    }

    function page_gallery_w_thumbs_calculate(argcthis, arg,pargs){

        //console.info('page_gallery_w_thumbs_calculate()')

        var margs = {
            arg: 0
        };

        if(pargs){
            margs = $.extend(margs,pargs);
        }
        //console.info('ceva',arg, arg.data('naturalWidth'));

        //console.info(argcthis, argcthis.hasClass('transition-wipeoutandfade'));
        if(argcthis.hasClass('transition-wipeoutandfade')){

            _body.addClass('page-gallery-w-thumbs-transitioning-content');
            setTimeout(function(){

                //console.info(_theContent);

                gallery_thumbs_img_container_nw = arg.data('naturalWidth');
                gallery_thumbs_img_container_nh = arg.data('naturalHeight');


                if(!gallery_thumbs_img_container_nw){
                    // console.info("NATURAL WIDTH NOT DEFINED");

                    // console.info(arg);

                    setTimeout(function(){

                        if(arg.find('img').length){
                            if(arg.find('img').get(0).naturalWidth){
                                arg.data('naturalWidth', arg.find('img').get(0).naturalWidth);
                                arg.data('naturalHeight', arg.find('img').get(0).naturalHeight);
                            }
                        }

                        page_gallery_w_thumbs_calculate(argcthis,arg,margs);
                    },150);

                    return false;
                }


                // console.info('natural width and height', gallery_thumbs_img_container_nw, gallery_thumbs_img_container_nh);



                var args = {
                    'this_is_new_item' : true
                }
                //console.info('CALL calculate_dims_gallery_thumbs_img_container', 'from page_gallery_w_thumbs_calculate')
                calculate_dims_gallery_thumbs_img_container(args);

                setTimeout(function(){

                    _body.addClass('page-gallery-w-thumbs-transition-on-content');

                    //console.info('api_do_transition()');


                    // console.warn(gallery_thumbs_img_container_ch,gallery_thumbs_img_container_padding_space );

                    // console.info(gallery_thumbs_img_container_cw-gallery_thumbs_img_container_padding_space*2, (gallery_thumbs_img_container_ch-gallery_thumbs_img_container_padding_space*2) );
                    argcthis.get(0).api_do_transition({force_width: (gallery_thumbs_img_container_cw-gallery_thumbs_img_container_padding_space*2),force_height: (gallery_thumbs_img_container_ch-gallery_thumbs_img_container_padding_space*2),arg: margs.arg });
                    setTimeout(function(){

                        //argcthis.get(0).api_force_resize();
                    },20000)
                    _body.removeClass('page-gallery-w-thumbs-transitioning-content');
                },900);



            },700)
        }else{

            argcthis.get(0).api_do_transition();
        }
    }

    function handle_popstate(e){
        //console.log(e, e.state);

        if(e.state && e.state.href){
            click_menu_anchor(null, {
                'force_href': e.state.href
                ,force_no_ajax:'on'
            })

            //console.info(e.state.curr_menu_items,Object(e.state.curr_menu_items).size,Object.size(e.state.curr_menu_items));

            //console.log(e.state.curr_menu_items, e.state, history);

            if(Object.size(e.state.curr_menu_items)>0){


                //console.info('my docs', _theActualNav.find('.current-menu-item'))
                _theActualNav.find('.current-menu-item').removeClass('current-menu-item');

                for(var i2 = 0; i2< Object.size(e.state.curr_menu_items); i2++){
                    _theActualNav.find('li').eq(e.state.curr_menu_items[i2]).addClass('current-menu-item');
                }
            }
            return false;
        }
    }


    function imgLoaded_for_thumbs(e){

        //console.log('ceva', this.ref_t);

        if(this){
            if(this.ref_t){
                this.ref_t.addClass('img-loaded');
            }
            if(this.removeEventListener){
                this.removeEventListener('load',imgLoaded_for_thumbs);
            }
        }

    }

    function calculate_dims_gallery_thumbs_img_container(pargs){

        //console.log('calculate_dims_gallery_thumbs_img_container()', pargs);

        var margs = {
            'this_is_new_item' : false
        }

        // -- nw - natural width
        //console.info(gallery_thumbs_img_container_nw);

        //gallery_thumbs_img_container_cw = Number(gallery_thumbs_img_container_nw)+40;
        //gallery_thumbs_img_container_ch = Number(gallery_thumbs_img_container_nh)+40;








        //var ratio_w_h = gallery_thumbs_img_container_nw/gallery_thumbs_img_container_nh;

        //console.info(ratio_w_h);

        //console.info(gallery_thumbs_img_container_nw, gallery_thumbs_img_container_nh);


        var thumb_space = 140;

        var aux_menu_width = menu_width;
        var aux_menu_width_on_right = menu_width_on_right;
        var aux_menu_height = menu_height;

        if(_navCon.css('display')=='none'){
            aux_menu_width = 0;
            aux_menu_height = 0;
            aux_menu_width_on_right=0;

            // --d but on 0 account lets just leave normal scroller
        }



        var responsive_nav_and_thumbs_h = 0;


        var new_iw = 0;
        var new_ih = 0;

        var aux_sep_w = 80;
        var aux_sep_h = 110;


        var aux_iw = Number(gallery_thumbs_img_container_nw)+gallery_thumbs_img_container_padding_space*2;
        var aux_ih =  Number(gallery_thumbs_img_container_nh)+gallery_thumbs_img_container_padding_space*2;

        var aux_sw = ww-aux_menu_width-gallery_thumbs_img_container_padding_space*2;
        var aux_sh = wh-thumb_space-gallery_thumbs_img_container_padding_space*2 - aux_menu_height;

        //console.info(aux_sh);


        $('.the-content-bg-placeholder').eq(0).outerHeight(0);
        if(ww<=responsive_breakpoint){

            responsive_nav_and_thumbs_h = _theContent.parent().height();

            aux_sw = ww - 40;
            aux_sh = wh - responsive_nav_and_thumbs_h;
            if(aux_sh< 400){
                aux_sh = 400;
                _body.addClass('remove_overflow');
            }else{

                _body.removeClass('remove_overflow');
            }


            if(_theContent.prev().hasClass('the-content-bg')==false){
                _theContent.before('<div class="the-content-bg"></div>');
            }



            //console.info(responsive_nav_and_thumbs_h, _theContent.parent().height(), aux_sh);
            //aux_sh = wh - _theContent.parent().height();
        }


        var aux_ir = aux_iw/aux_ih;
        var aux_sr = aux_sw/aux_sh;

        // console.info(aux_iw, aux_ih, aux_sw, aux_sh);

        //console.log(aux_ir, aux_sr);

        if(aux_sr > aux_ir){

            gallery_thumbs_img_container_cw = aux_iw*(aux_sh/aux_ih);
            gallery_thumbs_img_container_ch = aux_sh;

        }else{
            gallery_thumbs_img_container_cw = aux_sw;

            gallery_thumbs_img_container_ch = aux_ih * (aux_sw/aux_iw);
        }


        if(gallery_thumbs_img_container_cw>aux_iw){
            gallery_thumbs_img_container_cw = aux_iw;
            gallery_thumbs_img_container_ch = gallery_thumbs_img_container_cw * (aux_ih /aux_iw);
        }



        // console.info('gallery_thumbs_img_container cw and ch', gallery_thumbs_img_container_cw, gallery_thumbs_img_container_ch)




        var _c = $('.the-content-con > .the-content').eq(0);


        var aux_left = ( aux_menu_width+gallery_thumbs_img_container_padding_space + (ww-aux_menu_width_on_right-aux_menu_width-gallery_thumbs_img_container_padding_space*2)/2 - gallery_thumbs_img_container_cw/2 );
        var aux_top = ( gallery_thumbs_img_container_padding_space + (wh-thumb_space-aux_menu_height-gallery_thumbs_img_container_padding_space*2)/2 - gallery_thumbs_img_container_ch/2 );

        //console.info(aux_top);

        if(ww<=responsive_breakpoint){
            //aux_top+=

            aux_top = responsive_nav_and_thumbs_h;


            $('.the-content-bg').css({
                'width': ww+'px'
                ,'height': gallery_thumbs_img_container_ch+'px'
                ,'top':responsive_nav_and_thumbs_h+'px'
            })

            if($('.the-content-bg').eq(0).offset().top + $('.the-content-bg').eq(0).outerHeight()<wh){
                $('.the-content-bg').eq(0).outerHeight(wh-$('.the-content-bg').eq(0).offset().top);
            }

            $('.the-content-bg-placeholder').eq(0).outerHeight($('.the-content-bg').eq(0).outerHeight());


        }


        setTimeout(function(){

            //console.info(_c, ratio_w_h, gallery_thumbs_img_container_cw, gallery_thumbs_img_container_ch);
            //console.info(cw);
            _c.outerWidth(gallery_thumbs_img_container_cw);
            _c.eq(0).css({
                'left': aux_left+'px'
            });

            //console.info(cw, _c.width(), _c);

            _c.outerHeight(gallery_thumbs_img_container_ch);
            _c.eq(0).css({
                'top': aux_top+'px'
            });
        },50);




        //console.info('1865', page, newclass_body)

        if(newclass_body_page=='page-gallery-w-thumbs'){

            if(document.getElementById("as-gallery-w-thumbs") && document.getElementById("as-gallery-w-thumbs").api_set_action_call_on_gotoItem){

                document.getElementById("as-gallery-w-thumbs").api_set_action_call_on_gotoItem(page_gallery_w_thumbs_calculate);
            }



            var delaytime = 0;

            if(margs.this_is_new_item){
                delaytime = 1000;
            }
            setTimeout(function(){

                _theContent.find('.advancedscroller').eq(0).find('.thumbsCon').eq(0).height(gallery_thumbs_img_container_ch-40);
                _theContent.find('.advancedscroller').eq(0).find('.thumbsCon').eq(0).width(gallery_thumbs_img_container_cw-40);
                _theContent.find('.advancedscroller').eq(0).find('.currItem').eq(0).height(gallery_thumbs_img_container_ch-40);
                _theContent.find('.advancedscroller').eq(0).find('.currItem').eq(0).width(gallery_thumbs_img_container_cw-40);
                //_theContent.find('.advancedscroller').eq(0).find('.currItem > img').eq(0).width(gallery_thumbs_img_container_cw-40);


                if(margs.this_is_new_item==false){

                    _theContent.find('.advancedscroller').eq(0).find('.currItem > img').eq(0).css({
                            'width' : (gallery_thumbs_img_container_cw-40)
                            ,'height' : (gallery_thumbs_img_container_ch-40)
                        }, {queue:false, duration: 400}
                    );
                }

                _theContent.addClass('active');
            },1000)

            //console.info($('.gallery-thumbs-con'));
            if($('.gallery-thumbs-con').length>0){
                _gallery_thumbs_con = $('.gallery-thumbs-con').eq(0);


                var gallery_width = 0;

                var gallery_max_width = ww - (menu_width + menu_content_space);

                _gallery_thumbs_con.find('li.thumb:not(.inited)').each(
                    function(){
                        var _t = $(this);

                        //console.info(_t);

                        _t.addClass('inited');

                        if(_t.children().eq(0).hasClass('bgimage')){
                            var aux32 = _t.children().eq(0).css('background-image');
                            aux32 = aux32.replace('url(','');
                            aux32 = aux32.replace(')','');
                            aux32 = aux32.replace(/"/g,'');
                            //console.log(aux32);


                            var auximg = new Image();
                            auximg.ref_t = _t;

                            //var auxfunc =


                            if(auximg.addEventListener){
                                auximg.addEventListener('load', imgLoaded_for_thumbs )
                            }


                            auximg.src = aux32;

                        }else{
                            _t.addClass('img-loaded');
                        }


                        //gallery_width+=100;

                        _t.bind('click',handle_mouse);

                    }
                )


                gallery_width = _gallery_thumbs_con.find('li.thumb').length * 100 + 40;


                _gallery_thumbs_con.find('.thumbs-list').width(gallery_width-40);

                //console.info(gallery_width);

                var aux_add_20 = 0;

                if(gallery_width>gallery_max_width){
                    gallery_width = gallery_max_width;

                    aux_add_20+=20;
                }

                // -- 40 padding
                var auxer23 = 0;
                if(aux_menu_width_on_right){
                    auxer23 = 20;
                }

                var aux_thumbs_list_padding_right = thumbs_list_padding_right;
                //console.info(ww/2, gallery_width/2);

                var aux =  ((menu_width + menu_content_space) + ( (ww - (menu_width + menu_content_space*2) )/2 - gallery_width/2));

                if(aux<menu_width+menu_content_space){
                    aux = menu_width + menu_content_space;
                }

                if(aux>0){
                    //aux = menu_width + menu_content_space;
                    aux_thumbs_list_padding_right = 0;
                }



                //console.log(aux , aux_thumbs_list_padding_right,(gallery_width+aux_add_20-thumbs_padding_left_and_right-aux_menu_width_on_right-auxer23-aux_thumbs_list_padding_right));
                _gallery_thumbs_con.find('.thumbs-list-con').eq(0).width(gallery_width+aux_add_20-thumbs_padding_left_and_right-aux_menu_width_on_right-auxer23-aux_thumbs_list_padding_right);

                _gallery_thumbs_con.css({
                    'left': aux + 'px'
                })

                if(aux_menu_width_on_right){

                    _gallery_thumbs_con.css({
                        'width': 'calc(100% - '+ (aux_menu_width_on_right+20+menu_width) + 'px)'
                    })
                }else{

                    _gallery_thumbs_con.css({
                        'width': ''
                    })
                }



                if(ww<=responsive_breakpoint){
                    _gallery_thumbs_con.css({
                        'left': 0
                        ,'width': '100%'
                    })
                    _gallery_thumbs_con.find('.thumbs-list-con').css('width', '100%');
                    //_gallery_thumbs_con.find('.thumbs-list').width(ww-40);
                    //console.info(ww);
                }


                if(is_touch_device()==false){

                    _gallery_thumbs_con.find('.thumbs-list-con').eq(0).unbind('mousemove');
                    _gallery_thumbs_con.find('.thumbs-list-con').eq(0).bind('mousemove',handle_mouse);
                }else{
                    _gallery_thumbs_con.find('.thumbs-list-con').css('overflow', 'auto');

                }
            }

            if(_theContent){
                //console.info(_theContent);

                if(_theContent.parent().css('opacity')==0){
                    //console.info('this is for gallery-w-thumbs')
                    if(_gallery_thumbs_con){

                        calculate_translucent_canvas(_gallery_thumbs_con.find('.translucent-canvas').eq(0));
                    }
                    //fade_the_content_con(_theContent.parent())
                }
            }

        }


    }



    function click_menu_anchor(e,pargs) {

        console.info('click_menu_anchor()', pargs);

        var _t = $(this);
        var thehref = _t.attr('href');
        var isselectoption = false;
        var newtitle = null;

        var margs = {
            _t: null
            ,force_href: ''
            ,force_no_ajax: 'off'
        }


        if(pargs){
            margs = $.extend(margs,pargs);
        }

        if(margs._t){
            _t = margs._t;
        }




        if(_t && _t.get(0) && _t.get(0).nodeName=='SELECT'){

            isselectoption = true;
            thehref = _t.val();
            //thehref = _t.find(':selected').attr('value');

        }

        if(_t && _t.get(0) && _t.get(0).nodeName=='OPTION'){

            isselectoption = true;
            thehref = _t.val();
            //thehref = _t.find(':selected').attr('value');

        }

        //console.info(_t.hasClass('current-menu-item'), _t, _t.attr('class'));
        //if(_t&&_t.parent().hasClass('current-menu-item') && margs.force_no_ajax!='on'){
        //
        //    return false;
        //}

        //console.log(thehref, curr_html);

        if(thehref==curr_html){
            return false;
        }


        if(is_touch_device()){
            margs.force_no_ajax = 'on';
            window.location.href = thehref;
        }

        //console.info(margs.force_href, margs.force_no_ajax);
        if(margs.force_href){
            thehref = margs.force_href;

            //console.info(margs.force_no_ajax, thehref);

            if(margs.force_no_ajax=='on'){
                window.location.href = thehref;
            }
        }




        //console.info(busy_main_transition);
        if(busy_main_transition){

            setTimeout(function(){
                var args = {};
                if(_t){ args._t = _t; args.force_href = thehref };

                click_menu_anchor(e,args);
            },1000);

            return false;
        }


        //console.info(_t,_t.val(), isselectoption,thehref);
        if(isselectoption){
            //return false;
        }
//        console.info(_t);

        //==== well test if it's an outer link, if its an outside link we dont need any ajax.

        // console.info(window.qcreative_options.enable_ajax, margs.force_no_ajax)
        if(window.qcreative_options.enable_ajax == 'on' && window && margs.force_no_ajax!='on') {


            if (thehref == '#') {


                if(window.qcreative_options.enable_native_scrollbar!='on'){
                    return false;
                }
            } else {
                //console.info('ceva', thehref.indexOf('file://'), window.location.href);
                //console.info('ceva', thehref.indexOf('http://') > -1, thehref.indexOf(ajax_site_url));

                // console.log(( window.location.href.indexOf('file://') ==0 || ( thehref.indexOf('http://') > -1 || ( thehref.indexOf('http://') > -1  && thehref.indexOf(ajax_site_url)!= 0) )),window.location.href.indexOf('file://') ==0, ( ( thehref.indexOf('http://') > -1  && thehref.indexOf(ajax_site_url)!= 0) ));
                //
                //
                // console.info( window.location.href, thehref, ajax_site_url )
                // return false;

                // console.info(thehref.indexOf(ajax_site_url));
                if ( window.location.href.indexOf('file://') ==0  || ((thehref.indexOf('http://') > -1||thehref.indexOf('https://') > -1) && ( thehref.indexOf(ajax_site_url)!= 0) ) ) {



                } else {
                    //if indeed we are going to history api it

                    //console.info(scripts_loaded_arr);
                    $('body').removeClass('loaded');
                    $('.q-toexecute').remove();
                    if (can_history_api()) {
                        scripts_tobeloaded=[];
                        stylesheets_tobeloaded=[];
                        var nr_scripts_tobeloaded = 0;


                        $('.portfolio-fulscreen--items').remove();
                        _body.addClass('q-ajax-transitioning');
                        $.ajax({
                            url: thehref,
                            context: document.body
                        }).done(function (response) {

                            if(_t){
                                //console.info(_t.parent().parent().parent());
                                if(_t.parent().parent().parent().hasClass('menu-toggler-target')){
                                    _t.parent().parent().parent().removeClass('active');
                                }
                                if(_t.parent().parent().parent().parent().parent().hasClass('menu-toggler-target')){
                                    _t.parent().parent().parent().parent().parent().removeClass('active');
                                }
                            }

                            ___response = $(response);




                            var regex_bodyclass = /<body.*?class="(.*?)"/g;
                            var regex_bodyclass_page = /<body.*?class=".*?(page-(?:blogsingle|homepage|gallery-w-thumbs|normal|contact|about|contact|portfolio|portfolio-single))[ |"]/g;
                            var regex_menu_type = /menu-type-\d*/g;


                            var aux23 = regex_bodyclass.exec(response);

                            newclass_body = '';
                            newclass_body_page = '';

                            if(aux23){
                                if(aux23[1]){
                                    newclass_body = aux23[1];
                                }
                            }


                            aux23=regex_bodyclass_page.exec(response);


                            if(aux23){
                                if(aux23[1]){
                                    newclass_body_page = aux23[1];
                                }
                            }
                            newclass_body+=' q-inited q-inited-bg';



                            // -- attributes which we need

                            // console.info('curr body class', _body.attr('class'));
                            var aux = regex_menu_type.exec(_body.attr('class'));

                            // console.info(aux);

                            newclass_body = newclass_body.replace(/menu-type-\d*/g, '');

                            if(aux && aux[0]){

                                // console.info(aux[0]);
                                newclass_body+=' '+aux[0];
                            }


                            // console.info('newclass_body - ',newclass_body);
                            // console.info('newclass_body_page - ',newclass_body_page);

                            //console.log(newclass_body);

                            newclass_body_nopadding = false;
                            newclass_body_with_fullbg = false;

                            regex_bodyclass = /<body.*?class=".*?(no-padding)[ |"]/g;


                            aux23 = regex_bodyclass.exec(response);
                            if(aux23){
                                if(aux23[1]){
                                    newclass_body_nopadding=true;
                                }
                            }


                            regex_bodyclass = /<body.*?class=".*?(with-fullbg)[ |"]/g;


                            aux23 = regex_bodyclass.exec(response);
                            if(aux23){
                                if(aux23[1]){
                                    newclass_body_with_fullbg=true;
                                }
                            }


                            // console.log(response, ___response);


                            //console.log(scripts_loaded_arr);
                            social_scripts_reinit = false;
                            for (i = 0; i < ___response.length; i++) {
                                var _t3 = ___response[i];

                                if(_t3.attr && _t3.attr('class')=='mainoptions'){
                                    //continue;
                                }


                                //console.info(_t3);



                                var aux_href = '';
                                if(_t3.href){
                                    aux_href = _t3.href;

                                    if(aux_href.indexOf('./')==0){
                                        aux_href = aux_href.replace('./','');
                                    }
                                }



                                if(has_custom_outside_content_1){
                                    //console.info(_t3, _t3.className);
                                    if(_t3.className=='custom-outside-content-1'){
                                        $('.custom-outside-content-1').html(_t3.innerHTML);

                                        //console.info();
                                    }
                                }

                                if(_t3.nodeName=='TITLE'){
                                    newtitle = _t3.innerHTML;

                                    // console.info(newtitle);
                                }

                                if(_t3.className=='main-container'){
                                    //console.info(_t3, _t , $(_t3).find('ul.the-actual-nav'))

                                    if(_t.attr('data-loadnewmenu')=='on'){

                                        $('ul.the-actual-nav').eq(0).html( $(_t3).find('ul.the-actual-nav').eq(0).html() );


                                    }
                                }

                                if(_t3.className=='social-scripts'){
                                    //console.info(_t3);



                                    if(social_scripts_loaded==false){

                                        _body.append(_t3);
                                        social_scripts_loaded=true;
                                    }
                                    social_scripts_reinit = true;

                                    //console.info('social_scripts_reinit INIT', social_scripts_reinit)
                                }

                                if(_t3.className=='portfolio-fulscreen--items'){
                                    //console.info(_t3);


                                    _body.append(_t3);

                                    //console.info('social_scripts_reinit INIT', social_scripts_reinit)
                                }

                                if (_t3 != undefined && _t3.nodeName != undefined && _t3.nodeName == 'SCRIPT') {

                                    //if(_t3.className=='toexecute'){
                                    //
                                    //    continue;
                                    //}

                                    //console.info(_t3,_t3.src, scripts_loaded_arr);




                                    if(_t3.className=='mainoptions'){
                                        //console.info(_t3);

                                        old_qcre_options = $.extend([],qcreative_options);
                                        var aux = eval(_t3.innerHTML);

                                        //console.log(qcreative_options_defaults);

                                        var auxer5 = JSON.parse(qcreative_options_defaults_string);
                                        //console.log(auxer5);

                                        qcreative_options = $.extend(auxer5, qcreative_options)



                                        if(customizer_force_blur>-1){
                                            qcreative_options.blur_ammount = customizer_force_blur;
                                        }


                                        if(isNaN(parseInt(window.qcreative_options.blur_ammount,10))==false){
                                            window.qcreative_options.blur_ammount = parseInt(window.qcreative_options.blur_ammount,10);
                                        }else{

                                            window.qcreative_options.blur_ammount = 25;
                                        }

                                        window.qcreative_options = qcreative_options;

                                        //--- not a good solution
//                                        console.info(aux,move_options, old_move_options);

                                        //console.info(qcreative_options);



                                    }

                                    if(_t3.className=='zoombox-settings'){
                                        //console.info(_t3);

                                        if(zoombox_options){

                                            old_zoombox_options = $.extend([],zoombox_options);
                                        }
                                        var aux = eval(_t3.innerHTML);


                                        if(window.zoombox_default_opts_string){
                                            var def_opts_parse  = $.extend(true, {},$.parseJSON(window.zoombox_default_opts_string));
                                            zoombox_options = $.extend(def_opts_parse, window.init_zoombox_settings);

                                            //console.info('new zoombox settings', zoombox_options,window.zoombox_default_opts,window.init_zoombox_settings);
                                            window.init_zoombox_settings = zoombox_options;
                                        }


                                        //console.info(init_zoombox_settings, _t3.innerHTML);

                                        //console.info('MAKE YOU MOVE', window.api_zoombox_setoptions, zoombox_options, $('.zoombox-maincon'))

                                        //console.log(window.api_zoombox_setoptions);

                                        if(window.api_zoombox_setoptions){
                                            //window.api_zoombox_setoptions(zoombox_options);
                                        }

                                        qcre_init_zoombox = true;

                                        //--- not a good solution
//                                        console.info(aux,move_options, old_move_options);

                                        //console.info(qcreative_options);



                                    }

                                    var sw = false;

                                    for(j=0;j<scripts_loaded_arr.length;j++){

                                        //console.info(_t3.src, scripts_loaded_arr[j], (qcreative_options.site_url + scripts_loaded_arr[j]));

                                        //console.info(_t3.src, scripts_loaded_arr[j], ajax_site_url);
                                        if(_t3.src=='' || scripts_loaded_arr[j] == _t3.src || ajax_site_url + scripts_loaded_arr[j] == _t3.src){
                                            sw=true;
                                        }
                                    }

                                    if(sw==false){

                                        scripts_tobeloaded.push(_t3.src);
                                    }
                                }


                                if (_t3 != undefined && _t3.nodeName != undefined && _t3.nodeName == 'LINK') {


                                    // -- stylesheets check

                                    if(_t3.rel!='stylesheet'){
                                        continue;
                                    }


                                    var sw = false;


                                    for(var j=0;j<scripts_loaded_arr.length;j++){


                                        //console.info(aux_href, scripts_loaded_arr[j],ajax_site_url, scripts_loaded_arr[j], (ajax_site_url + scripts_loaded_arr[j]));
                                        if(aux_href=='' || scripts_loaded_arr[j] == aux_href || ajax_site_url + scripts_loaded_arr[j] == aux_href){
                                            sw=true;
                                        }
                                    }

                                    if(sw==false){

                                        stylesheets_tobeloaded.push(_t3.href);
                                    }
                                }



                            }

                            //console.info(scripts_loaded_arr);
                            //console.info(scripts_tobeloaded, stylesheets_tobeloaded);


                            //console.info($.zfolio);
                            setTimeout(function() {
                                var i = 0;
                                nr_scripts_tobeloaded = scripts_tobeloaded.length;


                                function loadFunc(e){
                                    //console.info(e);
                                }

                                if(nr_scripts_tobeloaded<=0){



                                    load_new_page();
                                    return false;
                                }

                                //console.info(scripts_tobeloaded);


                                var i4 = 0;
                                for(i4=0;i4<scripts_tobeloaded.length;i4++){

                                    // console.info(scripts_tobeloaded[i4]);
                                    $.getScript( scripts_tobeloaded[i4]).done(function( data, textStatus, jqxhr ) {
                                        //console.log( data ); // Data returned
                                        //console.log( textStatus ); // Success
                                        //console.log( jqxhr.status ); // 200
                                        //console.log( "Load was performed." );


                                        //eval(data);

                                        //console.log(this, data,textStatus, jqxhr);


                                        if(String(this.url).indexOf('http://maps.googleapis.com/maps')>-1){

                                            window.google_maps_loaded = true;
                                            window.gooogle_maps_must_init = true;
                                        }
                                        //
                                        //if(!(data)){
                                        //    //console.info('load was not performed', i4, scripts_tobeloaded[i4], jqxhr);
                                        //
                                        //
                                        //    //console.info(window.google_maps_loaded)
                                        //    if(window.google_maps_loaded==false){
                                        //
                                        //        var scriptElement = document.createElement('script');
                                        //        //console.info(scriptElement.async);
                                        //        //scriptElement.async = true;
                                        //        //console.info(scriptElement.async);
                                        //        scriptElement.src = "https://maps.googleapis.com/maps/api/js?v=3&callback=qcreative_gm_init";
                                        //        document.getElementsByTagName('head')[0].appendChild(scriptElement);
                                        //
                                        //        window.google_maps_loaded = true;
                                        //    }else{
                                        //        window.gooogle_maps_must_init = true;
                                        //    }
                                        //}


                                        nr_scripts_tobeloaded--;

                                        // console.warn(nr_scripts_tobeloaded, scripts_tobeloaded);

                                        if(nr_scripts_tobeloaded<=0){
                                            //console.info('loadnewpage');

                                            //console.info($.zfolio);



                                            load_new_page();
                                        }

                                        //console.info(this,i4);

                                        var aux = this.url;

                                        if(aux.indexOf('?')>-1){
                                            aux = aux.split('?')[0];
                                        }

                                        //console.info(aux);
                                        scripts_loaded_arr.push(aux);

                                    }).fail(function( jqxhr, settings, exception ) {
                                        console.log( "Triggered ajaxError handler.",jqxhr, settings, exception, this );
                                    });
                                }
                                for(i4=0;i4<stylesheets_tobeloaded.length;i4++){

                                    $('<link/>', {
                                        rel: 'stylesheet',
                                        type: 'text/css',
                                        href: stylesheets_tobeloaded[i4]
                                    }).appendTo('head');

                                    scripts_loaded_arr.push(stylesheets_tobeloaded[i4]);


                                }


                                setTimeout(function(){
                                    //console.info(window.dzsprx_init);
                                    //console.info($.zfolio,jQuery.zfolio);
                                },1000)


//                            console.info(___response, ___response_scriptmo);
                            }, 100);


                            //console.info(thehref)

                            if(bg_transition=='fade'){
                                _mainBg.addClass('for-remove');

                                var aux9000 = _mainBg;

                                setTimeout(function(){

                                    if(aux9000.get(0) && aux9000.get(0).api_destroy){

                                        aux9000.get(0).api_destroy();
                                    }
                                },300);
                            }else{

                                if(_mainBg.get(0) && _mainBg.get(0).api_destroy){

                                    _mainBg.get(0).api_destroy();
                                }
                            }




                            //console.info('destroy zoombox');


                            if(window.api_destroy_zoombox){
                                window.api_destroy_zoombox();
                            }

                            //console.info()

                            //console.info('STATE CURR MENU ITEMS LINKS2',state_curr_menu_items_links);



                            if(_t.get(0)!=window) {



                                if(history_first_pushed_state==false){

                                    if ( window.location.href.indexOf('file://')===-1){

                                        var aux = curr_html;
                                        if(aux=='index.html'){
                                            aux = '';
                                        }
                                        if(aux=='index.php'){
                                            aux = '';
                                        }

                                        var stateObj = {href: curr_html};

                                        history.pushState(stateObj, null, aux);
                                    }
                                    history_first_pushed_state=true;
                                }

                                var aux_arr = state_curr_menu_items_links.slice(0);

                                var stateObj = {foo: page_change_ind, href: thehref, 'curr_menu_items': aux_arr};

                                page_change_ind++;
                                // console.info('PUSH STATE', stateObj, newtitle, thehref)
                                history.pushState(stateObj, newtitle, thehref);
                                if(newtitle){
                                    document.title = newtitle;
                                }
                            }
                        });


                        //console.info(_t.parent());




                        //console.info(state_curr_menu_items_links);

                        //state_curr_menu_items_links = _theActualNav.find('.current-menu-item');

                        if(_t.get(0)!=window){



                            state_curr_menu_items_links = [];

                            _theActualNav.find('.current-menu-item').each(function(){
                                var _t = $(this);

                                //console.log(_t,_theActualNav.find('*').index(_t));


                                state_curr_menu_items_links.push(_theActualNav.find('li').index(_t));
                            })

                            //console.info('STATE CURR MENU ITEMS LINKS', state_curr_menu_items_links);

                            //console.info(_t, _t.attr('rel'), _theActualNav);

                            if(_t.attr('rel')=='home'){
                                if(_theActualNav.find('a[rel=home]').length>0){

                                    _theActualNav.find('.current-menu-item').removeClass('current-menu-item');
                                    _theActualNav.find('a[rel=home]').eq(0).parent().addClass('current-menu-item');
                                }
                            }

                            if(_t.parent().parent().hasClass('the-actual-nav')){
                                _t.parent().parent().find('.current-menu-item').removeClass('current-menu-item');
                                _t.parent().addClass('current-menu-item');
                            }
                            if(_t.parent().parent().parent().parent().hasClass('the-actual-nav')){
                                _t.parent().parent().parent().parent().find('.current-menu-item').removeClass('current-menu-item');
                                _t.parent().parent().parent().addClass('current-menu-item');
                                _t.parent().addClass('current-menu-item');
                            }


                            if(_t.parent().parent().parent().parent().parent().parent().hasClass('the-actual-nav')){
                                _t.parent().parent().parent().parent().parent().parent().find('.current-menu-item').removeClass('current-menu-item');

                                // console.info(_t);
                                _t.parent().parent().parent().parent().parent().addClass('current-menu-item');
                                _t.parent().parent().parent().addClass('current-menu-item');
                                _t.parent().addClass('current-menu-item');
                            }
                        }

                        if(_t && _t.hasClass('ajax-link')){
                            _theActualNav.find('li > a').each(function(){
                                var _t3 = $(this);

                                //console.log(_t3, _t3.attr('href'), thehref);

                                if(_t3.attr('href')==thehref||_t3.attr('href')==ajax_site_url+thehref){
                                    _theActualNav.find('li').removeClass('current-menu-item');
                                    _t3.parent().addClass('current-menu-item');
                                }
                            })
                        }


                        return false;
                    }


                }

            }
        }

    }


    function load_new_page(){
        console.info('load_new_page()');


        videoplayers_tobe_resized = [];

        goto_bg(0,{newpage_transition: true});

        //console.info(___response);
    }

    function determine_page(){
        is_content_page = false;
        if(_body.hasClass('page-gallery-w-thumbs')){
            page='page-gallery-w-thumbs';
        }

        if(_body.hasClass('page-portfolio')){
            page='page-portfolio';
            is_content_page = true;
        }
        if(_body.hasClass('page-portfolio-single')){
            page='page-portfolio-single';
            is_content_page = true;
        }
        if(_body.hasClass('page-normal')){
            page='page-normal';
            is_content_page = true;
        }
        if(_body.hasClass('page-blog')){
            page='page-blog';
            is_content_page = true;
        }
        if(_body.hasClass('page-blogsingle')){
            page='page-blogsingle';
            is_content_page = true;
        }
        if(_body.hasClass('page-about')){
            page='page-about';
            is_content_page = true;
        }
        if(_body.hasClass('page-contact')){
            page='page-contact';
            is_content_page = true;
        }
        if(_body.hasClass('page-homepage')){
            page='page-homepage';
        }

        //console.info('CHECK AJAX', newclass_body,transitioned_via_ajax_first);
        if(transitioned_via_ajax_first && newclass_body){
            _body.removeClass('page-blogsingle page-homepage page-gallery-w-thumbs page-normal page-contact page-about page-contact page-portfolio page-portfolio-single');

            //console.info('REMOVE new-'+newclass_body)
            _body.removeClass('new-'+newclass_body_page);

            console.info("NEW CLASS_BODY - ",newclass_body);
            _body.addClass(newclass_body);
            _body.attr('class',newclass_body);



            newclass_body = newclass_body.replace(/menu-type-\d*/g, '');


            page=newclass_body_page;


            _body.removeClass('no-padding');
            _body.removeClass('with-fullbg');
            if(newclass_body_nopadding){

                _body.addClass('no-padding');
            }
        }


    }


    function handle_resize(e,pargs){


        var margs = {
            ignore_menu: false
            ,placew: true
            ,place_page: true
            ,redraw_canvas: true
            ,calculate_sidebar_main_is_bigger: true
        }

        if(pargs){
            margs = $.extend(margs,pargs);
        }

        //console.info('handle_resize', e, margs);

        ww = $(window).width();
        wh = $(window).height();

        //console.info(wh);
        if(border_width>0){

            ww = ww - (border_width*2);
            wh = wh - (border_width*2);
        }

        //console.info(wh);


        $('.main-bg-div').height(wh);



        //console.info(page, _theContent.parent().hasClass('fullit'))
        if(page=='page-portfolio-single' && _theContent.parent().hasClass('fullit')) {

            $('.advancedscroller').eq(0).css('height','100%');
            $('.advancedscroller-con').eq(0).height(wh);
            $('.advancedscroller-con-placeholder').eq(0).height(wh);

        }


        if(margs.placew){

            $('.placewh').each(function(){
                var _t = $(this);

                _t.attr('data-placeholderh',wh);

                if(_t.hasClass('for-parallaxer')){

                    _t.attr('data-placeholderh', (bigimageheight*parallaxer_multiplier) );
                }
            });
        }



        if(videoplayers_tobe_resized.length>0){
            for(var i4=0;i4<videoplayers_tobe_resized.length;i4++){
                var _c = videoplayers_tobe_resized[i4];


                //console.error(_c.hasClass('auto-height-16-9'));

                if(_c.hasClass('auto-height-16-9')){
                    _c.height(0.562 * _c.width());
                }else{

                    var aux_oh = _c.data('original-height');
                    var aux_cw = _c.width()
                    var aux_rw = _c.data('reference-width');


                    var aux_total = aux_cw/aux_rw * aux_oh;


                    //console.log(aux_cw, aux_rw, aux_oh, aux_total);

                    _c.height(aux_total);
                }




            }
        }

        if ( _body.hasClass('menu-type-1') || _body.hasClass('menu-type-2') || _body.hasClass('menu-type-3') || _body.hasClass('menu-type-4') || _body.hasClass('menu-type-5') || _body.hasClass('menu-type-6')|| _body.hasClass('menu-type-7') || _body.hasClass('menu-type-8')) {

            if(_theActualNav && _theActualNav.offset && _theActualNav.offset()){
                if(the_actual_nav_initial_top_offset==-1){
                    the_actual_nav_initial_top_offset = _theActualNav.offset().top
                }
            }else{
                console.warn('actual nav does not exist ? ');
            }

            var aux_sum = the_actual_nav_initial_top_offset + _theActualNav.outerHeight() + 10;

            if(_navCon.children('.nav-social-con').length>0){
                aux_sum+= _navCon.children('.nav-social-con').outerHeight() + 30;
            }



            //console.info(the_actual_nav_initial_top_offset, _navCon.children('.nav-social-con').outerHeight(), aux_sum,wh);

            if(aux_sum>wh){

                _navCon.addClass('menu-overflows-height');



                menu_is_scrollable = true;
                menu_is_scrollable_offset = aux_sum - wh;

                if(qcreative_options.menu_scroll_method=='scroll'){
                    menu_is_scrollable_offset += 100;
                }

                //console.info(menu_is_scrollable_offset)

            }else{

                _navCon.removeClass('menu-overflows-height');

                menu_is_scrollable = false;
                menu_is_scrollable_offset = 0;


                _logoCon.css({
                    'margin-top' : ''
                })
            }

        }



        //console.info(page);

        if(margs.place_page) {
            //console.info(page);
            if (page == 'page-portfolio' || page == 'page-portfolio-single' || page == 'page-normal' || page == 'page-blog' || page == 'page-blogsingle' || page == 'page-about' || page == 'page-contact') {
                //console.info(_theContent);


                //console.info(_body.hasClass('menu-type-9'));


                // -- setting the content left position, menu types excluded here
                if ((_theContent.parent().hasClass('fullit') == false && _body.hasClass('content-align-right')== false && _body.hasClass('content-align-left')== false && ( _body.hasClass('menu-type-5')==false && _body.hasClass('menu-type-6')==false && _body.hasClass('menu-type-9')==false && _body.hasClass('menu-type-10')==false  && _body.hasClass('menu-type-11')==false && _body.hasClass('menu-type-12')==false && _body.hasClass('menu-type-13')==false && _body.hasClass('menu-type-14')==false && _body.hasClass('menu-type-15')==false && _body.hasClass('menu-type-16')==false && _body.hasClass('menu-type-17')==false && _body.hasClass('menu-type-18')==false   ))) {

                    //console.info('Y DO U DO THIS');
                    var aux = menu_width + ((ww - menu_width) / 2 - _theContent.parent().width() / 2);

                    if(_body.hasClass('menu-type-7')||_body.hasClass('menu-type-8')){
                        aux = (menu_width-40) + ((ww - (menu_width-40) ) / 2 - _theContent.parent().width() / 2);
                    }
                    //console.log(menu_width, aux);


                    if(ww>(menu_width + content_width + menu_content_space)) {
                        _theContent.parent().css({
                            'left': aux
                        })
                    }else{
                        //--responsive mode so we delete this

                        _theContent.parent().css({
                            'left': ''
                        })
                    }
                }



                if (_body.hasClass('menu-is-sticky') && (_body.hasClass('content-align-right')== false && _body.hasClass('content-align-left')== false) && (  _theContent.parent().hasClass('fullit') == false)  &&  ( _body.hasClass('menu-type-5') || _body.hasClass('menu-type-6'))  ) {


                    //console.info('Y DO U DO THIS TOO / THIS IS ONLY FOR MENU-TYPE-5 and 6');
                    if(ww>(menu_width + content_width + menu_content_space)){
                        // console.info(ww/2,content_width, (menu_width + content_width)/2,menu_content_space)
                        _navCon.css({
                            'left': ww/2 - (menu_width + content_width)/2 - menu_content_space
                        })


                        //console.log(menu_content_space, menu_width);


                        // console.warn(ww/2, (menu_width + content_width + menu_content_space)/2 , menu_width);
                        _theContent.parent().css({
                            'left': (ww/2 - (menu_width + content_width + menu_content_space)/2)  + menu_width
                        })
                    }else{
                        // -- tbc
                        _navCon.css({
                            'left': ''
                        })
                        _theContent.parent().css({
                            'left': ''
                        })

                    }

                }

                if(_body.hasClass('page-is-fullwidth')==false && ( _body.hasClass('menu-type-5') || _body.hasClass('menu-type-6') ) ){

                    //console.log(ww, content_width)
                    //_navCon.css({
                    //    'left' : ww - (content_width + 60) - _navCon.width()
                    //})
                }


                if(_body.hasClass('page-is-fullwidth')==false && ( _body.hasClass('menu-type-1') || _body.hasClass('menu-type-2') || _body.hasClass('menu-type-3') || _body.hasClass('menu-type-4') || _body.hasClass('menu-type-5') || _body.hasClass('menu-type-6') || _body.hasClass('menu-type-7') || _body.hasClass('menu-type-8') ) ) {
                    //console.info(ww, menu_width, menu_content_space, content_width);


                    if(ww<menu_width+menu_content_space+content_width){

                        //console.info('whatsonot', menu_width, /menu_content_space, content_width);
                        _body.addClass('semi-responsive-mode');
                        _body.addClass('semi-responsive-mode-enforce');
                    }else{

                        _body.removeClass('semi-responsive-mode');
                        _body.removeClass('semi-responsive-mode-enforce');
                    }
                }
            }
        }

        if(ww+border_width*2<responsive_breakpoint){


            $('.testimonial-ascroller').each(function(){
                var _t3 = $(this);

                if(_t3.get(0) && _t3.get(0).style.height!='auto' && !( _t3.data('original-height')) ){

                    _t3.data('original-height', _t3.height());
                }
                _t3.css('height', 'auto');
                if(_t3.get(0) && _t3.get(0).api_force_resize){

                    _t3.get(0).api_force_resize();
                }

            });
            _body.removeClass('semi-responsive-mode');
            _body.removeClass('semi-responsive-mode-enforce');



        }else{

            $('.testimonial-ascroller').each(function(){
                var _t3 = $(this);
                if(_t3.data('original-height')){
                    _t3.css('height', _t3.data('original-height')+'px');
                    _t3.find('.thumbsCon').css('height', _t3.data('original-height')+'px');


                    if(_t3.get(0) && _t3.get(0).api_force_resize){

                        _t3.get(0).api_force_resize();
                    }
                }
            })

        }



        if(margs.place_page) {

            $('.translucent-bg').each(function(){
                var _t = $(this);

                if(margs.ignore_menu){
                    if(_t.parent().parent().hasClass('qcreative--nav-con')){
                        return;
                    }
                }

                //console.info(_t);


                calculate_translucent(_t);


            })



            calculate_mainbg();

            if(allow_resizing_on_blur){

                //console.info('resizing');

                clearTimeout(inter_resizing);
                inter_resizing = setTimeout(function(){
                    calculate_dims(margs);
                },500);
                $('body').addClass('resizing');
            }

        }


        if(margs.calculate_sidebar_main_is_bigger){
            // console.info("CALCULATING SIDEBAR MAIN IS BIGGER ? ",_sidebarMain);
            if(_sidebarMain){
                if(_sidebarMain.height() > _sidebarMain.prev().height()){
                    _body.addClass('sidebar-is-bigger-then-content');
                }else{

                    _body.removeClass('sidebar-is-bigger-then-content');
                }
            }
        }


        //console.info('added resizing');
    }

    function calculate_dims(margs){
        // -- only executes

        global_image_data = null;
        $('body').removeClass('resizing');

        //console.info(margs);

        if(margs.redraw_canvas){

            $('.translucent-canvas').each(function(){
                var _t = $(this);
                //console.info(_t);

                if(margs.ignore_menu){
                    if(_t.parent().parent().hasClass('qcreative--nav-con')){
                        return;
                    }
                }

                if(is_chrome() && String(window.location.href).indexOf('file://')==0){

                }else{

                    calculate_translucent_canvas(_t);
                }


            })
        }



        if(page=='page-gallery-w-thumbs'){
            calculate_dims_gallery_thumbs_img_container();
        }

        //console.info(_body.hasClass('page-is-fullwidth'));

        if(_body.hasClass('page-is-fullwidth')){
            if(_body.hasClass('menu-type-9') || _body.hasClass('menu-type-10')){
                _body.find('.fullbg').eq(0).height(_mainContainer.height());


                setTimeout(function(){
                    if(_mainContainer.get(0) && _mainContainer.get(0).api_handle_wheel) {
                        _mainContainer.get(0).api_handle_wheel();
                    }
                },100);

            }
        }

        //console.log(videoplayers_tobe_resized);


        if(window.qcreative_options.bg_isparallax=='on'){


            setTimeout(function(){
                if(_mainBg.get(0) && _mainBg.get(0).api_handle_scroll){

                    //console.info(bigimageheight, wh);
                    _mainBg.get(0).api_handle_scroll(null,{
                        'from':'qcre'
                        ,'force_th':bigimageheight
                        ,'force_ch':wh
                    });
                }
            },100)

        }



        if(window.preseter_init){
            var _cach = $('.preseter-content-con').eq(0);
            //console.log(_cach);
            //if(_cach.hasClass('scroller-con')){

            var _cach_cont = _cach.find('.the-content').eq(0);
            //_cach_cont.css('top', '0');

            _cach_cont.scrollTop(0);
            //console.info(110, _cach_cont.height(), wh, _cach_cont);

            if(110 + _cach_cont.find('.the-content-inner-inner').height() + 56>wh){

                _cach.outerHeight(wh - 110);
                _cach.removeClass('auto-height');
                _cach.addClass('needs-scrolling');

                _cach_cont.find('.the-content-inner-inner').css({
                    'padding-right' : (39-native_scrollbar_width)+'px'
                    ,'width' : (260-native_scrollbar_width)+'px'
                });
                _cach_cont.find('.the-bg').eq(0).css({
                    //'right' : -(39-native_scrollbar_width)+'px'
                    //,'width' : (260-native_scrollbar_width)+'px'
                });
            }else{

                _cach.css('height', 'auto');
                _cach.addClass('auto-height');
                _cach.removeClass('needs-scrolling');
                //console.info(_cach, _cach.css('height'));


                _cach_cont.find('.the-content-inner-inner').css({
                    'padding-right' : ''
                    ,'width' : ''
                });
                _cach_cont.find('.the-bg').eq(0).css({
                    'right' : ''
                    ,'width' : ''
                });
            }


            //}
        }

    }

    function calculate_dims_light(){

    }

    function calculate_translucent_canvas(arg,pargs){

        //console.info('calculate_translucent_canvas()', arg,pargs);


        var _t = arg;
        var margs = {

            'overwrite_bg_index' : ""
            ,'callback_func' : null
        }


        //console.info(_t,_t.css('display'));

        if(_t.length==0){
            return false;
        }


        //if(_t.css('display')=='none'){
        //
        //    if(margs.callback_func){
        //        var delaytime = 50;
        //        if(is_firefox()){
        //            delaytime=1500;
        //        }
        //        setTimeout(function(){
        //
        //            margs.callback_func();
        //        },delaytime)
        //    }
        //
        //    return false;
        //}

        if(pargs){
            margs = $.extend(margs,pargs);
        }



        if(ww<responsive_breakpoint){
            if (margs.callback_func) {
                var delaytime = 50;
                if (is_firefox()) {
                    delaytime = 50;
                }
                setTimeout(function () {

                    margs.callback_func();
                }, delaytime)
            }

            return false;
        }



        //console.info('calculate_translucent_canvas()', arg,margs);
        var tempNr = currBgNr;

        if( (margs.overwrite_bg_index!=null && margs.overwrite_bg_index!='') || margs.overwrite_bg_index===0){
            tempNr = margs.overwrite_bg_index;
        }


        //console.info('calculate_translucent_canvas', margs,tempNr,window.qcreative_options.images_arr[tempNr]);




        var width = _t.width();
        var height = _t.height();

        if(_t.parent().parent().hasClass('qcreative--nav-con')==false){

            if(_t.parent().parent().parent().hasClass('main-gallery--desc')){
                var tempNr2 = _t.parent().parent().parent().parent().children().index(_t.parent().parent().parent());
                if(tempNr2!=tempNr){
                    return false;
                }
                _t.parent().parent().parent().show();
            }

            width = _t.parent().width();
            height = _t.parent().height();




            //console.log(_t.parent().width(),width);
        }else{
            // -- if this is the navigation

            width = _t.parent().width();

            if(_t.attr('data-placeholderh')){
                height = Number(_t.attr('data-placeholderh'));
            }

            if( ( _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18') )  &&_body.hasClass('menu-is-sticky')==false){
                height = bigimageheight-wh+20;
            }

            //console.log(_t.hasClass('for-parallaxer'));

            if(_t.hasClass('for-parallaxer')==false && ( _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18') )){
                height = 100;
            }



        }

        //console.log(_t, width, height, bigimageheight-wh)

        if(_t.hasClass('for-parallaxer')){
            height=height*parallaxer_multiplier;
        }









        if(_t.parent().parent().hasClass('the-content')){

            width = bigimagewidth;
            height = bigimageheight;
        }


        //console.info(_t);





        //console.info(_t.get(0));
        var auximg = new Image();

        //auximg.reference_t = _t;

        _t.attr('width', width);
        _t.attr('height', height);

        _t.css({
            'width':width
            ,'height':height
        });


        //console.info(_t,$('.main-bg-image').width(),$('.main-bg-image').height())

        //console.log(bigimagewidth,bigimageheight);

        auximg.width = bigimagewidth;
        auximg.height = bigimageheight;





        //console.info('calculating for', _t,_t.hasClass('for-parallaxer'),auximg);
        auximg.onload = function(e){
            //console.info('onLoad',this,this.width,this.height, this.naturalHeight);

            //console.info(window.qcreative_options)

            var radius = window.qcreative_options.blur_ammount;

            var width = _t.width();
            var height = _t.height();

            if(_t.attr('data-placeholderh')){
                height = Number(_t.attr('data-placeholderh'));
            }


            var tot = (_t.offset().top);
            var tol = (_t.offset().left);


            //console.info('calculating for ..really ?', _t,_t.hasClass('for-parallaxer'), this.reference_t);


            if(_t.parent().parent().parent().hasClass('main-gallery--desc')){
                _t.parent().parent().parent().css('display','');
            }







            // -- when transitioning
            //console.log(_t.parent().parent())
            if(_t.parent().parent().hasClass('qcreative--nav-con')){

                tot=0;
            }
            //console.info(_t,tol,tot,width,height,$('.main-bg-image').width(),$('.main-bg-image').height());

            //console.log("DA",_t.data('lastwidth'), width, _t.data('lastheight'), height, _t.data('last_mainbg_width'), $('.main-bg-image').width(), _t.data('last_mainbg_height'), $('.main-bg-image').height(),_t.data('lastimgsrc'),this.src);

            if(_t.data('lastwidth')==width && _t.data('lastheight')==height && _t.data('lastww')==ww && _t.data('lastwh')==wh && _t.data('lastimgsrc')==this.src){

                //if(margs.callback_func){
                //    margs.callback_func();
                //}
                //return false;
            }


            var ctx;
            if(_t.get(0) && _t.get(0).getContext){
                ctx = _t.get(0).getContext('2d');
            }
            //var

            //console.info(tol,tot, bigimagewidth,bigimageheight);


            if(_t.parent().parent().hasClass('the-content')){
                //console.log(width,height);
                tol=0;
                tot=0;
            }


            var sw_is_dummy=false;



            if(_t.hasClass('dummy')){
                sw_is_dummy=true;
            }




            //console.log(_t.css('display')!='none' && sw_is_dummy==false && (is_ie()==false || (is_ie() && ieVersion>10)));


            // - -  &&isiPad==false
            if(_t.css('display')!='none' && sw_is_dummy==false  &&isiPad==false && (is_ie()==false || (is_ie() && ieVersion>10)) ) {

                ctx.drawImage(this, -tol, -tot, bigimagewidth, bigimageheight);

                //ctx.rect(20,20,150,100);
                //ctx.stroke();


                //console.info(tot,tol);

                //console.info(width,height);
                //console.log(width,height);

                var pol = 0;
                var pot = 0;


                _t.data('lastwidth', width);
                _t.data('lastheight', height);
                _t.data('lastww', ww);
                _t.data('lastwh', wh);
                _t.data('lastimgsrc', auximg.src);
                _t.data('last_mainbg_width', $('.main-bg-image').width());
                _t.data('last_mainbg_height', $('.main-bg-image').height());

                //console.info(_t,_t.parent(),_t.parent().parent(),_t.parent().parent().hasClass('the-content'), _theContent);


                if (_t.parent().parent().hasClass('the-content')) {
                    //console.info(pol,width);
                    pol = _t.parent().offset().left;

                    //console.info('POL IS', pol)
                    var sw = false;
                    if (pol > 30) {
                        pol -= 15;
                        sw = true;
                    }
                    width = _t.parent().width();
                    if (sw) {
                        width += 30;
                        if (width > bigimagewidth) {
                            width = bigimagewidth;
                        }
                    }
                }
                //console.log(height);


                var sw_trace_to_global = false;
                if (_t.parent().parent().hasClass('gallery-thumbs--image-container')) {

                    pot = gallery_thumbs_img_container_padding_space;
                    pol = 250 + gallery_thumbs_img_container_padding_space;
                    width = ww - 250 + gallery_thumbs_img_container_padding_space * 2;
                    height = wh - gallery_thumbs_img_container_padding_space;

                    sw_trace_to_global = true;

                    //console.info(pol,pot, width, height);
                }
                //console.info('dims are - ',pol,width,_t.parent().parent().hasClass('the-content'));

                //console.info(_t);
                if (_t.parent().parent().hasClass('qcreative--nav-con') || 1 == 1 || !global_image_data) {
                    //console.info(ctx, _body.has($(ctx)), $(ctx).descendantOf(_body));
                    var imageData;

                    try{
                        //console.info(pol,pot,width,height);

                        if(width && height){

                            imageData = ctx.getImageData(pol, pot, width, height);


                            if (sw_trace_to_global) {
                                global_image_data = imageData;
                            }
                            //console.info(imageData);
                            var pixels = imageData.data;


                            //console.info(_t.parent().parent());


                            var mul_table = [
                                512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
                                454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
                                482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
                                437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
                                497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
                                320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
                                446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
                                329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
                                505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
                                399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
                                324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
                                268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
                                451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
                                385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
                                332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
                                289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259
                            ];
                            var shg_table = [
                                9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
                                17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
                                19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
                                20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
                                21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
                                21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
                                22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
                                22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
                                23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
                                23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
                                23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
                                23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                                24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                                24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                                24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                                24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24
                            ]

                            var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
                                r_out_sum, g_out_sum, b_out_sum,
                                r_in_sum, g_in_sum, b_in_sum,
                                pr, pg, pb, rbs;

                            var div = radius + radius + 1,
                                w4 = width << 2,
                                widthMinus1 = width - 1,
                                heightMinus1 = height - 1,
                                radiusPlus1 = radius + 1,
                                sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2,
                                stackStart = BlurStack(),
                                stack = stackStart;

                            for (i = 1; i < div; i++) {
                                stack = stack.next = BlurStack();
                                if (i == radiusPlus1) var stackEnd = stack;
                            }

                            stack.next = stackStart;

                            var stackIn = null,
                                stackOut = null;

                            yw = yi = 0;

                            var mul_sum = mul_table[radius],
                                shg_sum = shg_table[radius];

                            for (y = 0; y < height; y++) {
                                r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;

                                r_out_sum = radiusPlus1 * (pr = pixels[yi]);
                                g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
                                b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

                                r_sum += sumFactor * pr;
                                g_sum += sumFactor * pg;
                                b_sum += sumFactor * pb;

                                stack = stackStart;

                                for (i = 0; i < radiusPlus1; i++) {
                                    stack.r = pr;
                                    stack.g = pg;
                                    stack.b = pb;
                                    stack = stack.next;
                                }

                                for (i = 1; i < radiusPlus1; i++) {
                                    p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
                                    r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
                                    g_sum += (stack.g = (pg = pixels[p + 1])) * rbs;
                                    b_sum += (stack.b = (pb = pixels[p + 2])) * rbs;

                                    r_in_sum += pr;
                                    g_in_sum += pg;
                                    b_in_sum += pb;

                                    stack = stack.next;
                                }

                                stackIn = stackStart;
                                stackOut = stackEnd;
                                for (x = 0; x < width; x++) {
                                    pixels[yi] = (r_sum * mul_sum) >> shg_sum;
                                    pixels[yi + 1] = (g_sum * mul_sum) >> shg_sum;
                                    pixels[yi + 2] = (b_sum * mul_sum) >> shg_sum;

                                    r_sum -= r_out_sum;
                                    g_sum -= g_out_sum;
                                    b_sum -= b_out_sum;

                                    r_out_sum -= stackIn.r;
                                    g_out_sum -= stackIn.g;
                                    b_out_sum -= stackIn.b;

                                    p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

                                    r_in_sum += (stackIn.r = pixels[p]);
                                    g_in_sum += (stackIn.g = pixels[p + 1]);
                                    b_in_sum += (stackIn.b = pixels[p + 2]);

                                    r_sum += r_in_sum;
                                    g_sum += g_in_sum;
                                    b_sum += b_in_sum;

                                    stackIn = stackIn.next;

                                    r_out_sum += (pr = stackOut.r);
                                    g_out_sum += (pg = stackOut.g);
                                    b_out_sum += (pb = stackOut.b);

                                    r_in_sum -= pr;
                                    g_in_sum -= pg;
                                    b_in_sum -= pb;

                                    stackOut = stackOut.next;

                                    yi += 4;
                                }
                                yw += width;
                            }


                            for (x = 0; x < width; x++) {
                                g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;

                                yi = x << 2;
                                r_out_sum = radiusPlus1 * (pr = pixels[yi]);
                                g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
                                b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

                                r_sum += sumFactor * pr;
                                g_sum += sumFactor * pg;
                                b_sum += sumFactor * pb;

                                stack = stackStart;

                                for (i = 0; i < radiusPlus1; i++) {
                                    stack.r = pr;
                                    stack.g = pg;
                                    stack.b = pb;
                                    stack = stack.next;
                                }

                                yp = width;

                                for (i = 1; i <= radius; i++) {
                                    yi = (yp + x) << 2;

                                    r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
                                    g_sum += (stack.g = (pg = pixels[yi + 1])) * rbs;
                                    b_sum += (stack.b = (pb = pixels[yi + 2])) * rbs;

                                    r_in_sum += pr;
                                    g_in_sum += pg;
                                    b_in_sum += pb;

                                    stack = stack.next;

                                    if (i < heightMinus1) yp += width;
                                }

                                yi = x;
                                stackIn = stackStart;
                                stackOut = stackEnd;
                                for (y = 0; y < height; y++) {
                                    p = yi << 2;
                                    pixels[p] = (r_sum * mul_sum) >> shg_sum;
                                    pixels[p + 1] = (g_sum * mul_sum) >> shg_sum;
                                    pixels[p + 2] = (b_sum * mul_sum) >> shg_sum;

                                    r_sum -= r_out_sum;
                                    g_sum -= g_out_sum;
                                    b_sum -= b_out_sum;

                                    r_out_sum -= stackIn.r;
                                    g_out_sum -= stackIn.g;
                                    b_out_sum -= stackIn.b;

                                    p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

                                    r_sum += (r_in_sum += (stackIn.r = pixels[p]));
                                    g_sum += (g_in_sum += (stackIn.g = pixels[p + 1]));
                                    b_sum += (b_in_sum += (stackIn.b = pixels[p + 2]));

                                    stackIn = stackIn.next;

                                    r_out_sum += (pr = stackOut.r);
                                    g_out_sum += (pg = stackOut.g);
                                    b_out_sum += (pb = stackOut.b);

                                    r_in_sum -= pr;
                                    g_in_sum -= pg;
                                    b_in_sum -= pb;

                                    stackOut = stackOut.next;

                                    yi += width;
                                }
                            }



                            ctx.clearRect( 0, 0, widthMinus1, heightMinus1 );
                            ctx.putImageData(imageData, pol, pot);

                        }
                    }catch(e){
                        console.info('putimage error error: ',e);
                    }


                } else {

                    ctx.putImageData(global_image_data, pol, pot);
                }


                //console.info('ceva', _t);
            }



            //console.info('callback func: ',margs.callback_func);
            if (margs.callback_func) {
                var delaytime = 50;
                if (is_firefox()) {
                    delaytime = 50;
                }
                setTimeout(function () {

                    margs.callback_func();
                }, delaytime)
            }



        };



        //console.info(tempNr);

        if(window.qcreative_options.images_arr[tempNr]&& window.qcreative_options.images_arr[tempNr].indexOf('#')==0){
            if (margs.callback_func) {
                var delaytime = 50;
                if (is_firefox()) {
                    delaytime = 50;
                }
                setTimeout(function () {

                    margs.callback_func();
                }, delaytime)
            }
        }else{

            // console.info('undefined? ',window.qcreative_options.images_arr[tempNr]);
            auximg.src = window.qcreative_options.images_arr[tempNr];
        }

    }
    function calculate_translucent(arg,pargs){
        var _t = arg;

        return false;
        var margs = {

            'overwrite_bg_index' : ""
            ,'callback_func' : null
        }

        if(pargs){
            margs = $.extend(margs,pargs);
        }



        if(_t.data('appliedblur')!='on'){

            _t.css('background-image', mainBgImgCSS);
        }



        //setTimeout(drawBlur,0);


        _t.css({
            'margin-left': 0
            ,'margin-top': 0
            //,'transform': 'translate3d(0,0,0)'
        });
        if(_t.hasClass('for-parallaxer')){
            _t.css({
                //'transform': 'translate3d(0,0,0)'
            });
        }


        var tot = (_t.offset().top);
        var tol = (_t.offset().left);


        var auxw = ww;
        var auxh = wh;

        //console.info(_t);

        if(_t.hasClass('dzsparallaxer--target') || _t.hasClass('for-parallaxer')){
            auxh=auxh*parallaxer_multiplier;
        }

        if(_t.offset().left<15){

            mainbgoffset = 0;
        }else{

            mainbgoffset = 0;
        }

        if(_t.data('substract-translate')=='on'){


            //console.info(_t.data('substract-translate'),tot);
            //tot+= (wh*0.3);
            _t.data('substract-translate','off');


        }

        _t.width(auxw + mainbgoffset*2);
        _t.height(auxh + mainbgoffset*2);


        //if(_t.parent().parent().hasClass('the-content')){
        tot-=st;
        //}

        _t.css({
            'margin-left': -tol - mainbgoffset
            ,'margin-top': -tot -mainbgoffset
        })

        //console.log(ieVersion());
        if(ieVersion()==11){


            //var _t_img = null;
            //var _t_img_cnv = null;
            //if(_t.next().hasClass('translucent-img')){
            //    _t_img = _t.next();
            //}
            //if(_t.next().next().hasClass('translucent-img-canvas')){
            //    _t_img_cnv = _t.next().next();
            //}
            //
            //
            //if(_t_img){
            //
            //    _t_img.css({
            //        'width' : (ww + mainbgoffset*2)
            //        ,'height': (wh + mainbgoffset*2)
            //        ,'left': -tol - mainbgoffset
            //        ,'top': -tot -mainbgoffset
            //    })
            //}
            //if(_t_img_cnv){
            //
            //    _t_img_cnv.css({
            //        'width' : (ww + mainbgoffset*2)
            //        ,'height': (wh + mainbgoffset*2)
            //        ,'left': -tol - mainbgoffset
            //        ,'top': -tot -mainbgoffset
            //    })
            //}

        }



        if(margs.callback_func){
            margs.callback_func();
        }

    }

    function goto_prev_bg(){
        var tempNr = currBgNr;

        tempNr--;

        if(tempNr<0){

            tempNr = qcreative_options.images_arr.length - 1;
        }

        goto_bg(tempNr);

    }

    function goto_next_bg(){
        var tempNr = currBgNr;

        tempNr++;

        if(tempNr>qcreative_options.images_arr.length - 1){

            tempNr = 0;
        }

        goto_bg(tempNr);

    }

    function update_parallaxer(arg){
        //console.log(arg);


        if(debug_var){
            //console.info(_c_for_parallax_items);
            debug_var = false;
        }


        if(_c_for_parallax_items){



            for(var i24 = 0;i24<_c_for_parallax_items.length;i24++){
                var _t = _c_for_parallax_items[i24];

                var arg2 = arg;

                if( ( _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18') ) && _body.hasClass('menu-is-sticky')==false){
                    //console.log(arg, $(window).scrollTop())

                    //console.log(_t.parent().parent());

                    if(_t.parent().parent().hasClass('qcreative--nav-con')){
                        arg2+=Number($(window).scrollTop());
                    }

                }

                _t.css({
                    'transform' : 'translate3d(0,'+(arg2)+'px,0)'
                })

            }



        }

    }



    function goto_bg(arg,pargs){
        console.info('goto_bg('+arg+')');

        if(busy_main_transition){
            return false;
        }


        var margs = {
            newpage_transition: false
        }
        if(pargs){
            margs = $.extend(margs,pargs);
        }

        var cek = qcreative_options.images_arr[arg];

        //console.info(margs);


        var img = new Image();



        if($('.main-gallery--descs').length>0){
            _mainGalleryDescs = $('.main-gallery--descs').eq(0);
        }


        if(_mainGalleryDescs){
            if(_mainGalleryDescs.children('.active').length>0){

                _mainGalleryDescs.css({
                    'width' : '0'
                })
                setTimeout(function(){
                    is_ready_transition=true;
                    if(is_ready_load==true){
                        goto_bg_doit(arg,margs);
                        //console.info('ceva from desc');
                    }

                    if(_mainGalleryDescs){

                        _mainGalleryDescs.css({
                            'height' : '0'
                        })
                    }

                },500);

            }else{
                is_ready_transition=true;
            }
        }else{
            is_ready_transition=true;
        }


        img.onload = function(e){
            // image  has been loaded

            is_ready_load = true;
            if(is_ready_transition==true){
                goto_bg_doit(arg, margs);
                //console.info('ceva from onload');
            }

        };
        img.onerror = function(e){
            // image  has been loaded

            //console.info(e);

        };




        if(cek.indexOf('#')==0){

            is_ready_load = true;
            if(is_ready_transition==true){
                goto_bg_doit(arg, margs);
                //console.info('ceva from onload');
            }

        }else{

            img.src = cek;
        }




        busy_main_transition = true;
    }

    function goto_bg_doit(arg,margs){

        // -- image has loaded


        wh = $(window).height();



        if(border_width>0){

            wh = wh - (border_width*2);
        }

        console.info('goto_bg_do_it('+arg+')', _theContent);

        var extra_class = '';
        var extra_class_main_bg = '';
        var isparallax = false;
        var targeth = '100%';
        var extra_translate = '';



        if(_theContent){

        }


        if(window.qcreative_options.bg_isparallax!='on'){

            //_mainBg.removeClass('dzsparallaxer');
            //_mainBg.children('.main-bg').removeClass('dzsparallaxer--target');
        }



        //console.info(page);
        if(window.qcreative_options.bg_isparallax=='on' && newclass_body_page!='page-homepage' && newclass_body_page!='page-gallery-w-thumbs'){
            extra_class+=' dzsparallaxer';
            extra_class_main_bg+=' dzsparallaxer--target';

            //targeth = '140%';
            isparallax=true;



            var auxpix = (wh*(parallaxer_multiplier-1) - qcreative_options.substract_parallaxer_pixels);
            //console.info('turn down the wha', auxpix);

            // -- for main-bg-con
            extra_translate='transform: translate3d(0,-'+auxpix+'px,0);';
            //wh*=1.3;
        }

        //console.info(margs);



        //<figure class="main-bg'+extra_class_main_bg+'" style="width: '+ww+'px; height: '+wh+'px; '+extra_translate+' background-image: url('+qcreative_options.images_arr[arg]+');">



        var aux_top = '-50';

        is_content_page = false;
        if(newclass_body.indexOf('page-normal')>-1||newclass_body.indexOf('page-blogsingle')>-1||newclass_body.indexOf('page-blog')>-1||newclass_body.indexOf('page-portfolio')>-1){

            is_content_page=true;

        }

        _body.addClass('new-'+newclass_body_page);
        //console.info('ADD new-',newclass_body);

        bg_transition='slidedown';
        if(initial_bg_transition){
            bg_transition = initial_bg_transition;
        }
        if(first_bg_not_transitioned==false&&margs.newpage_transition==false && is_content_page){

            bg_transition = 'fade';
        }

        first_bg_not_transitioned = false;
        if(bg_transition=='fade'){

            aux_top = 0;
        }

        //console.log(aux_top);



        if(bg_transition=='fade') {
            _mainBg.addClass('for-remove');

            var aux9000 = _mainBg;

            //console.info('aux9000 is ',aux9000);

            setTimeout(function () {

                if (aux9000.get(0) && aux9000.get(0).api_destroy) {

                    aux9000.get(0).api_destroy();
                }
            }, 1000);
        }

        //extra_translate = '';
        //console.info(extra_translate, wh);

        var aux23_img ='<img class="main-bg-image'+extra_class_main_bg+'" style=" '+extra_translate+'" src="'+qcreative_options.images_arr[arg]+'"/>';

        if(qcreative_options.images_arr[arg].indexOf("#")==0){
            aux23_img ='<div class="main-bg-image'+extra_class_main_bg+'" style=" width: 100%;height:120%; background-color: '+qcreative_options.images_arr[arg]+'; '+extra_translate+'"></div>';
        }

        var aux23 = '<div class="main-bg-con transitioning'+extra_class+'" style="height:0%; top: '+aux_top+'px;">'+aux23_img+'<div class="main-bg-div"  style="height: '+wh+'px; background-image:url('+qcreative_options.images_arr[arg]+');"></div></div>';



        //console.log(aux23);

        //aux23 = '';
        //console.info(window.qcreative_options.bg_isparallax,aux23);


        //console.info(aux23);


        if(margs.newpage_transition==true){


            //console.info('PAGE IS '+page);

            if(page=='page-homepage'){
                if($('.main-gallery--descs').length>0){

                    $('.main-gallery--descs').addClass('removed');
                    _mainGalleryDescs = null;
                }

                currBgNr=0;
            }


            //console.info(_navCon, aux23);



            if(_body.hasClass('menu-type-9')||_body.hasClass('menu-type-10') || _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-15') || _body.hasClass('menu-type-16') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18')){

                //_mainContainer.append(_t24);
                $('.the-content-con').addClass('transitioning-out');

                if(new_bg_transition!='off'){

                    _mainContainer.append(aux23);
                }

            }else{

                $('.the-content-con').addClass('transitioning-out');
                if(new_bg_transition!='off'){

                    _navCon.before(aux23);
                }
            }


            calculate_mainbg();

            //console.info($('.main-bg-con'));

            if($('.main-bg-con.transitioning').eq(0).hasClass('dzsparallaxer')){

                $('.main-bg-con.transitioning').eq(0).find('.dzsparallaxer--target').css({
                    'transform': 'translate3d(0,-'+(bigimageheight-wh-qcreative_options.substract_parallaxer_pixels)+'px,0)'
                })

                //console.info($(window).height(),bigimageheight-$(window).height(), 'translate3d(0,-'+(bigimageheight-$(window).height())+'px,0)');
            }

            if(_theContent){

                _theContent.find('.selector-con,.call-to-action-con, .row.services-lightbox-content, .dzs-tabs.skin-menu .tabs-menu').css({
                    'z-index':'auto'
                });
                _theContent.find('.advancedscroller.skin-whitefish.is-thicker .bulletsCon').animate({
                    'opacity':'0'
                },{
                    queue:false
                    ,duration: 300
                });




            }
            if(___response) {




                //$('.the-content-con').remove();




                ___response.find('.the-content-con').each(function () {
                    var _t24 = $(this);

                    //console.log(_t24);

                    _t24.addClass('transitioning');


                    //console.warn(force_content_width);
                    if(force_content_width){
                        //console.warn(_t24, force_content_width)
                        _t24.width(force_content_width);
                        _t24.css('width', force_content_width+'px');

                        setTimeout(function(){
                            //console.log(_t24);

                            _t24.css('width', '');
                        },1500)
                    }


                    initial_offset = _t24.offset().left;
                    if(_t24.hasClass('fullit')==false){

                        _t24.css({
                            'opacity': 0
                        })
                        page_is_fullwidth = false;


                        //console.info('page is', page,newclass_body);

                        //console.info(_t24, _t24.width(), _t24.outerWidth(), _t24.css('max-width'));
                        setTimeout(function(){



                            lastcontent_w = _t24.width();
                            //console.info(_t24 , _t24.outerWidth(), _t24.css('max-width'));

                            _t24.css({
                            })

                            _t24.css({
                                //'width': '0'
                                //,'left': -lastcontent_w/2
                                //,'overflow': 'hidden'
                                //,opacity: 1
                            })


                            //console.log(_t24.width());


                            _t24.children('').css({
                                //'width': lastcontent_w + 'px'
                            })

                            _t24.children('h1,.the-content,footer').css({
                                //'width': lastcontent_w + 'px'
                                //,'margin-left' : -lastcontent_w/2
                            })

                        },100)
                    }else{

                        _t24.css({
                            'opacity': 0
                        });

                        _t24.find('.zfolio.fullwidth').css({
                            'width' : $(window).width()-menu_width
                        })

                        page_is_fullwidth = true;


                    }
                    ;

                    //console.info(_t24);

                    //$('#map-canvas').eq(0).remove();
                    if(_body.hasClass('menu-type-9')||_body.hasClass('menu-type-10')  || _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-15') || _body.hasClass('menu-type-16') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18')){

                        _mainContainer.append(_t24);
                    }else{

                        //console.info(_t24);
                        _navCon.before(_t24);

                    }


                    if(_gallery_thumbs_con){

                        _gallery_thumbs_con.find('.thumbs-list-con').eq(0).unbind('mousemove');
                    }





                    // -- destroy listeners
                    $('.vplayer,.zfolio,.audioplayer').each(function(){
                        var _t = $(this);

                        //console.log(_t);
                        if(_t.get(0) && _t.get(0).api_destroy_listeners){
                            _t.get(0).api_destroy_listeners();
                        }

                        setTimeout(function(){
                            _t[0] = null;
                        },300);


                    });


                    //console.info("CEVA2", _t24.hasClass('fullit'));

                    if(window.dzsas_init){

                        if(ww>responsive_breakpoint){
                            if(_body.hasClass('page-portfolio') && newclass_body_page == 'page-portfolio-single' && _t24.hasClass('fullit')==false){
                                //_t24.css('width', (content_width-60)+'px');
                                //_t24.css('max-width', (content_width-60)+'px');
                                //$('.the-content-con.transitioning').outerWidth(default_content_width);
                                //_t24.width(default_content_width);

                                //console.log(_body.hasClass('page-portfolio'), ('.advancedscroller.skin-qcre.auto-init-from-q'), _t24.css('width'), String((default_content_width)+'px'));
                                //console.log('do we force the width here .. ? ', _body.hasClass('page-portfolio-single'), ('.advancedscroller.skin-qcre.auto-init-from-q'), _t24.css('width'), String((default_content_width)+'px'), (content_width-60));
                            }
                        }

                        //console.log(_t24.find('.advancedscroller.skin-qcre.auto-init-from-q'),_t24.find('.advancedscroller.skin-qcre.auto-init-from-q').width(), _body.hasClass('page-portfolio'), ('.advancedscroller.skin-qcre.auto-init-from-q'), $('.the-content-con.transitioning').css('width'));

                        dzsas_init(_t24.find('.advancedscroller.skin-qcre.auto-init-from-q'),{
                            init_each: true
                        });

                        // console.info(_t24.find('.advancedscroller.skin-trumpet.auto-init-from-q'));
                        dzsas_init(_t24.find('.advancedscroller.skin-trumpet.auto-init-from-q'),{
                            init_each: true
                        });
                    }

                    if(window.dzszfl_init){

                        //console.info($('.zfolio.auto-init-from-q'), ___response.find('.zfolio.auto-init-from-q'));

                        //console.log(newclass_body, $('.the-content-con').width(), $('.the-content-con.transitioning').width());
                        //_t24.find('.zfolio-portfolio-classic').width()

                        if(ww>responsive_breakpoint){
                            if(newclass_body_page == 'page-portfolio' && _t24.hasClass('fullit')==false){
                                //$('.the-content-con.transitioning').css('width', (content_width-60)+'px');
                                console.info($('.the-content-con.transitioning'),$('.the-content-con.transitioning').get(0).style,$('.the-content-con.transitioning').css('max-width'), _t24.find('.zfolio.auto-init-from-q'));
                            }
                        }

                        dzszfl_init(_t24.find('.zfolio.auto-init-from-q'),{
                            init_each: true
                        });


                        //dzszfl_init('.zfolio.zfolio-portfolio-fullscreen', { design_item_thumb_height:"1",item_extra_class:""});



                        setTimeout(function(){


                            $('.the-content-con .zfolio').each(function(){
                                var _t100 = $(this);

                                if(_t100.get(0) && _t100.get(0).api_handle_resize){

                                    if(_t100.parent().parent().parent().parent().hasClass('the-content-con')){
                                        _t100.parent().parent().parent().parent().css('width','');
                                    }
                                    //console.info(_t100.parent().parent().parent().parent().get(0), _t100.width(), _t100.parent().width(), _t100.parent().parent().width(), _t100.parent().parent().parent().width());
                                    _t100.get(0).api_handle_resize();
                                }
                            })
                        },1000)

                    }
                    //console.info(_t24);




                });
                //return false;


                for (var ij = 0; ij < ___response.length; ij++) {
                    var _t3 = ___response[ij];
                    var $t3 = $(_t3);


                    if(_t3.nodeName=='SCRIPT'){
                        if(_t3.className=='q-toexecute'){
                            if(_t3.className.indexOf('executed')==-1){


                                //console.info(_t3, _t3.textContent);

                                eval(_t3.textContent);
                                //$.ready();
                                $t3.addClass('executed');
                            }
                        }

                    }


                }
            }
        }else{

            //console.info('ceva');
            $('.the-content-con').addClass('transitioning-out');

            if(new_bg_transition!='off'){

                _mainBg.after(aux23);
            }

            calculate_mainbg();



            if($('.main-bg-con.transitioning').eq(0).hasClass('dzsparallaxer')){

                $('.main-bg-con.transitioning').eq(0).find('.dzsparallaxer--target').css({
                    'transform': 'translate3d(0,-'+(bigimageheight-wh-qcreative_options.substract_parallaxer_pixels)+'px,0)'
                })
                //console.info($(window).height(),bigimageheight-$(window).height(), 'translate3d(0,-'+(bigimageheight-$(window).height())+'px,0)');
            }


        }


        _mainBgTransitioning = $('body').find('.main-bg-con.transitioning');
        //console.info(aux23, _mainBgTransitioning.children('.main-bg-div').css('background-image'));


        var animation_time = 400; // -- set later

        function do_transition(){

            //console.log('do_transition()');


            function do_transition_really_do_it(){

                //console.log('do_transition_really_do_it()')

                $("body").removeClass('qtransitioned');
                $("body").addClass('qtransitioning');

                allow_resizing_on_blur=false;

                setTimeout(function(){
                    allow_resizing_on_blur=true;
                },2000);
                //console.log(_c2);


                $('body').addClass('q-inited-bg');

                setTimeout(function(){



                    //if(_cache2.find('.translucent-bg').data('appliedblur')!='on'){
                    //
                    //    //console.info('dadadadada', _c2);
                    //    _cache2.find('.translucent-bg').css({
                    //        'background-image': 'url(' + qcreative_options.images_arr[arg] + ')'
                    //    })
                    //}





                    //console.info(_c2);


                    var aux = animation_time;


                    //console.info(_cache2);
                    if(_cache2){



                        if(_cache2.find('.translucent-canvas').eq(0).hasClass('for-parallaxer')){
                            aux-=67;
                        }

                        //console.log(aux);

                        if(bg_transition!='fade' && (_body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18')) ) {
                            aux = 200;
                        }


                        if(bg_transition=='fade'){

                            //console.log($('.translucent-con.transitioning .for-parallaxer'));



                            if($('.translucent-con.transitioning .for-parallaxer').length>0){
                                //console.info(_c_for_parallax_items);
                                var auxlen = _c_for_parallax_items.length;

                                $(' .translucent-con.transitioning .for-parallaxer').each(function(){
                                    var _t = $(this);
                                    _c_for_parallax_items.push(_t);
                                })
                                //console.info(_c_for_parallax_items);

                                //console.log(auxlen);
                                for(var i23 = 0;i23<auxlen;i23++){
                                    _c_for_parallax_items.shift();
                                }
                                //console.info(_c_for_parallax_items);

                            }


                            var args = {
                                mode_scroll: "fromtop",
                                animation_duration: '20',
                                is_fullscreen: "on",
                                init_functional_delay: "0",
                                init_functional_remove_delay_on_scroll: "off"
                                ,settings_substract_from_th: qcreative_options.substract_parallaxer_pixels
                            };
                            if (parallax_reverse) {
                                args.direction = "reverse";
                            }

                            //console.info($('.main-bg-con.transitioning'))
                            //console.info(_mainBg);


                            var _c234 = ($('.qcreative--nav-con .translucent-con:not(.transitioning)'));

                            //console.info(_c234);

                            _c234.animate({


                                'opacity':0
                            },{
                                queue:false
                                ,duration: 300
                            })



                            setTimeout(function(){

                                if(_content_translucent_canvas){

                                    _content_translucent_canvas.next().animate({


                                        'opacity':1
                                    },{
                                        queue:false
                                        ,duration: 150
                                    })
                                    setTimeout(function(){
                                        _content_translucent_canvas.remove();
                                        _content_translucent_canvas.parent().children().removeClass('transitioning');
                                    },600);
                                }


                                _cache2.css({
                                    'opacity':0
                                    ,'height':'100%'
                                    ,'top':'0'
                                })
                                //_cache2.children('.translucent-con').css({
                                //    'height':0
                                //})
                                _cache2.animate({
                                    'opacity' : '1'
                                },{
                                    queue:false
                                    , duration: 250
                                    ,complete:function(){

                                        _cache2.removeClass('transitioning');
                                    }

                                });
                            },bg_transition_delay)
                        }else{



                            if(window.qcreative_options.images_arr[0].indexOf('#')==0){
                                aux+=35;
                            }

                            //var d = new Date(); console.info('menu transition started '+ d.getTime()+' delay - delay for menu_transition - '+0+' animation time '+aux);

                            // -- qcreative nav con .translcent-con
                            _cache2.animate({
                                'height' : '100%'
                                ,'top' : '0'
                            },{
                                queue:false
                                , duration: aux
                                ,complete:function(){

                                    _cache2.removeClass('transitioning');
                                }

                            });
                        }


                        if(_cache2.hasClass('dzsparallaxer')){

                        }
                    }

                    //console.log(_mainBgTransitioning, animation_time);


                    var delay_for_main_bg = 0;

                    if(_body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18')){
                        delay_for_main_bg = 100;
                    }

                    function main_bg_transition_complete(){

                        /// -- when main background has transitioned
                        //console.info('main_bg_transition_complete()');


                        _mainBg = _mainBgTransitioning;
                        _mainBgTransitioning = null;


                        if(bg_transition=='fade'){
                            $('.main-bg-con:not(".transitioning")').addClass('for-remove');
                            setTimeout(function(){

                                $('.main-bg-con.for-remove').remove();
                                //$('.main-bg-con:not(".transitioning")').remove();
                            },bg_transition_delay+100)
                        }else{

                            //console.info($('.main-bg-con.for-remove'),$('.main-bg-con:not(".transitioning")'));

                            //console.info(new_bg_transition);
                            if(new_bg_transition!='off'){

                                $('.main-bg-con:not(".transitioning")').remove();
                            }
                            //$('.main-bg-con:not(".transitioning")').remove();
                        }

                        _mainBg = $('.main-bg-con:not(".for-remove")').eq(0);

                        //console.info(_navCon,_navCon.find('.translucent-con').length);


                        if(_navCon.find('.translucent-con').length>1){
                            var aux2314=_navCon.find('.translucent-con').eq(0);

                            if(bg_transition=='fade'){
                                setTimeout(function(){
                                    aux2314.remove();
                                },500);
                            }else{
                                aux2314.remove();
                            }


                        }





                        //console.log(_navCon.find('.translucent-con'));


                        _mainBg.removeClass('transitioning');

                        //console.log(_mainBg, _mainBg.find('figure'))
                        _mainBg.find('figure').eq(0).css({
                            'width' : ''
                            ,'height' : ''
                        })

                        //console.info(newclass_body);
                        if( window.qcreative_options.bg_isparallax=='on' && newclass_body_page!='page-homepage' && newclass_body_page!='page-gallery-w-thumbs'){

                            //var args = {  mode_scroll: "fromtop", animation_duration : '20', is_fullscreen: "on", init_functional_delay: "10000",init_functional_remove_delay_on_scroll: "off" };
                            //if(parallax_reverse){
                            //    args.direction = "reverse";
                            //}
                            setTimeout(function(){

                            },30000);

                            _mainBg.addClass('dzsparallaxer');
                            _mainBg.children('.main-bg').addClass('dzsparallaxer--target');

                            //console.log(args);


                            _mainBg.addClass('stickto100');

                            //console.info(_mainBg);

                            setTimeout(function(){

                            },4000);

                            if($('.qcreative--nav-con .translucent-con').hasClass('dzsparallaxer')){
                                $('.qcreative--nav-con .translucent-con').addClass('stickto100');
                            }
                            if($('.the-content .translucent-con').hasClass('dzsparallaxer')){
                                $('.the-content .translucent-con').addClass('stickto100');
                            }
                        }else{

                            _mainBg.removeClass('dzsparallaxer');
                            _mainBg.children('.main-bg').removeClass('dzsparallaxer--target');
                            //_mainBg.children('.main-bg').removeClass('for-parallaxer');
                        }


                        if($('.main-gallery--descs').length>0){
                            if($('.main-gallery--descs').eq(0).hasClass('removed')==false){

                                _mainGalleryDescs = $('.main-gallery--descs').eq(0);
                            }
                        }

                        //reinit();
                        if(_mainGalleryDescs){

                            //console.info('curr desc', _mainGalleryDescs, _mainGalleryDescs.children().eq(arg));

                            _mainGalleryDescs.children().removeClass('active');
                            _mainGalleryDescs.children().eq(arg).addClass('active');


                            if(_mainGalleryDescs.children().eq(arg).hasClass('style2')){
                                _mainGalleryDescs.removeClass('style1').addClass('style2');
                                _mainGalleryDescs.css({
                                    //'right' : (ww-280-_mainGalleryDescs.children().eq(arg).width())+'px'
                                })
                            }else{

                                _mainGalleryDescs.removeClass('style2').addClass('style1');
                                _mainGalleryDescs.css({
                                    'right' : ''
                                })
                            }

                            //console.info(_mainGalleryDescs.children().eq(arg).find('.translucent-canvas').eq(0));



                            if(is_chrome() && String(window.location.href).indexOf('file://')==0){

                            }else{

                                //console.info('calculate translucent for desc')

                                calculate_translucent_canvas(_mainGalleryDescs.children().eq(arg).find('.translucent-canvas').eq(0), {overwrite_bg_index: arg});
                            }

                            _mainGalleryDescs.css({
                                'width' : _mainGalleryDescs.children().eq(arg).width() + 'px'
                                ,'height' : _mainGalleryDescs.children().eq(arg).height() + 'px'
                            })

                        }



                        setup_newBgImage(margs);
                        currBgNr = arg;

                        is_ready_load=false;
                        is_ready_transition=false;
                        busy_main_transition=false;

                        if($('body').hasClass('q-inited')==false) {
                            //console.log(is_ie(), ieVersion())
                            if (ieVersion() == 11) {
                                setTimeout(function () {
                                    $('body').addClass('q-inited');

                                    if (_theContent && _theContent.parent().css('opacity') == 0) {


                                        _theContent.parent().animate({
                                            'opacity': 1
                                            //,width : lastcontent_w
                                            //,left : 0
                                        }, {
                                            duration: 600
                                            , queue: false
                                        });
                                    }

                                    if (page == 'page-homepage') {
                                        $('.the-content-con').animate({
                                            'opacity': 1
                                            //,width : lastcontent_w
                                            //,left : 0
                                        }, {
                                            duration: 600
                                            , queue: false
                                        });
                                    }
                                }, 500)
                            } else {

                                setTimeout(function () {
                                    $('body').addClass('q-inited');
                                    if (_theContent && _theContent.find('.translucent-canvas').length > 0) {
                                        _theContent.find('.translucent-canvas').each(function () {
                                            var _t255 = $(this);

                                            //console.log('first translucent canvas on the content', _t255);


                                            if (is_chrome() && String(window.location.href).indexOf('file://') == 0) {

                                            } else {

                                                calculate_translucent_canvas(_t255);
                                            }

                                        })
                                    }


                                    var _c = null;

                                    //console.info(_theContent);
                                    if (_theContent) {


                                        _c = _theContent.parent();

                                    } else {
                                        if ($('.the-content-con').length > 0) {
                                            _c = ($('.the-content-con').eq(0));

                                        }
                                    }

                                    if (_c && _c.css('opacity') == 0) {


                                        fade_the_content_con(_c);
                                    }
                                }, 300)
                            }
                        }
                    }


                    if(bg_transition=='fade'){


                        _mainBg.animate({
                            'opacity' : '0'
                        },{
                            queue:false
                            , duration: animation_time
                        })

                        setTimeout(function(){



                            //console.info(_mainBgTransitioning, targeth);

                            _mainBgTransitioning.css({
                                'height' : targeth
                                ,'top' : '0'
                                ,'opacity' : '0'
                            })

                            _mainBgTransitioning.animate({
                                'opacity' : '1'
                            },{
                                queue:false
                                , duration: animation_time
                            })


                            main_bg_transition_complete();
                            setTimeout(function(){
                            }, animation_time-100)
                        },delay_for_main_bg+bg_transition_delay);

                    }else{


                        //var d = new Date(); console.info('main bg transition started '+ d.getTime()+' delay - delay for main_bg - '+delay_for_main_bg+' animation time '+animation_time);

                        setTimeout(function(){
                            //console.info(_mainBgTransitioning, targeth);

                            if(_mainBgTransitioning.length==0){

                                main_bg_transition_complete();
                            }else{
                                _mainBgTransitioning.animate({
                                    'height' : targeth
                                    ,'top' : '0'
                                },{
                                    queue:false
                                    , duration: animation_time
                                    ,complete: main_bg_transition_complete
                                })
                            }

                        },delay_for_main_bg);
                    }


                },300);

                main_content_loaded = true;
            }

            if(_body.hasClass('wait-for-main-content-to-load')){

                main_content_loaded = false;
                inter_check_if_main_content_loaded = setInterval(function(){

                    if(_theContent.find('.translucent-layer').eq(0).children().eq(0).hasClass('zfolio')){
                        var _c23 = _theContent.find('.translucent-layer').eq(0).children().eq(0);
                        if(_c23.hasClass('all-images-loaded')){

                            clearInterval(inter_check_if_main_content_loaded);
                            if(main_content_loaded==false){
                                do_transition_really_do_it()
                            }
                        }
                    }
                },100);

                setTimeout(function(){





                    clearInterval(inter_check_if_main_content_loaded);
                    if(main_content_loaded==false){
                        do_transition_really_do_it()
                    }
                },2000);
            }else{

                do_transition_really_do_it();
            }



            //return false;

        }



        //console.info('ceva23232');
        if($('.qcreative--nav-con .translucent-canvas').length>0){


            // --- menubg

            if(_body.hasClass('menu-type-5')==false && _body.hasClass('menu-type-5')==false && _body.hasClass('menu-type-7')==false && _body.hasClass('menu-type-8')==false && _body.hasClass('menu-type-9')==false && _body.hasClass('menu-type-10')==false && _body.hasClass('menu-type-15')==false && _body.hasClass('menu-type-16')==false){
                var _c = $('.qcreative--nav-con .translucent-con').eq(0);
                var targeth = '100%';

                //console.info('hony');
                _c.after(_c.clone());


                _cache2 = $('.qcreative--nav-con .translucent-con').eq(1);

                _cache2.find('.translucent-canvas').removeClass('dummy');


                if(window.qcreative_options.images_arr[0].indexOf('#')==0){
                    _cache2.find('.translucent-canvas').before('<div class="translucent-canvas-solid" style="width: 100%; height: 100%; background-color: '+window.qcreative_options.images_arr[0]+';"></div>');


                    setTimeout(function(){
                        _cache2.find('.translucent-canvas-solid').remove();
                    },800);
                }


                _cache2.addClass('transitioning');


                _cache2.css({
                    'height': '0%'
                    ,'top': '-50px'
                });



                //console.log();
                if(window.qcreative_options.bg_isparallax=='on' && newclass_body_page!='page-homepage' && newclass_body_page!='page-gallery-w-thumbs'){
                    //console.info(wh*0.3);
                    //_cache2.find('.translucent-bg').css({
                    //    'transform' : 'translate3d(0,-'+wh*0.3+'px,0)'
                    //    ,'height' : ((wh*parallaxer_multiplier) + 30)+'px'
                    //})

                    //console.info(bigimageheight,wh);
                    _cache2.find('.translucent-canvas').css({
                        'transform' : 'translate3d(0,-'+(bigimageheight-wh-qcreative_options.substract_parallaxer_pixels)+'px,0)'
                        ,'height' : ((bigimageheight) )+'px'
                    })

                    if(_cache2.find('.translucent-canvas').data('substract-translate')!='off'){
                        _cache2.find('.translucent-canvas').data('substract-translate','on');
                    }
                }else{

                    _cache2.find('.translucent-canvas').css({
                        'transform' : 'translate3d(0,0,0)'
                        ,'height' : ((wh) )+'px'
                    })

                    //console.info(wh, _c2.find('.translucent-bg').height());
                }




                //handle_resize();

                //console.log($('.main-bg-image'));


                //determine_page();
                //console.info(" -- page is really ", page, newclass_body);

                if(newclass_body_page!='page-homepage' && newclass_body_page!='page-gallery-w-thumbs' && qcreative_options.bg_isparallax=='on'){
                    //console.info(page);

                    _cache2.find('.translucent-canvas').addClass('for-parallaxer');
                    animation_time=400;
                    //animation_time=12000;
                    targeth=String(parallaxer_multiplier*10) + '0%';
                }else{

                    //console.info(_c2);
                    _cache2.find('.translucent-canvas').removeClass('for-parallaxer');
                    animation_time=400;
                }

                //console.info('ceva23232');
                handle_resize(null,{
                    placew: true
                    ,place_page:false
                    ,redraw_canvas:false
                });

            }

            //console.info(_cache2.find('.translucent-canvas'));

            if(is_chrome() && String(window.location.href).indexOf('file://')==0){

                do_transition();

            }else{

                //console.info(is_content_page);
                if(_cache2){

                    _content_translucent_canvas = null;
                    if(bg_transition=='fade' && is_content_page){

                        var _c23 = $('.the-content .translucent-canvas').eq(0);

                        setTimeout(function(){

                            _c23.animate({
                                'opacity':'0'
                            },{
                                queue:false
                                ,duration : animation_time
                            })
                        },500);


                        _c23.after(_c23.clone());
                        _c23.next().css('opacity','0').addClass('transitioning');
                        _content_translucent_canvas = _c23;



                        calculate_translucent_canvas(_c23.next(), {overwrite_bg_index: arg });
                    }
                    // -- cache2 is qcreative nav con
                    //console.info(_cache2, _cache2.find('.translucent-canvas'))
                    calculate_translucent_canvas(_cache2.find('.translucent-canvas'), {overwrite_bg_index: arg, callback_func: do_transition  });
                }else{
                    do_transition();
                }
            }







        }

    }

    function setup_newBgImage(margs){
        //console.info('setup_newBgImage() / this where the new page comes into play / both for new page and for init');

        //return false;

        if(_mainContainer.get(0) && _mainContainer.get(0).api_scrolly_to) {
            _body.addClass('has-custom-scroller');
        }



        console.info('INIT LAZYLOADING');
        if(window.dzs_check_lazyloading_images_inited==false){

            window.dzs_check_lazyloading_images_inited = true;


            $(window).bind('scroll',window.dzs_check_lazyloading_images);
            window.dzs_check_lazyloading_images();
            setTimeout(function(){
                window.dzs_check_lazyloading_images();
            },1500);
            setTimeout(function(){
                window.dzs_check_lazyloading_images();
            },2500);
        }else{
            if(window.dzs_check_lazyloading_images){
                window.dzs_check_lazyloading_images();
                setTimeout(function(){
                    if(window.dzs_check_lazyloading_images) {
                        window.dzs_check_lazyloading_images();
                    }
                },1000);
                setTimeout(function(){
                    if(window.dzs_check_lazyloading_images) {
                        window.dzs_check_lazyloading_images();
                    }
                },2000);
                setTimeout(function(){
                    if(window.dzs_check_lazyloading_images) {
                        window.dzs_check_lazyloading_images();
                    }
                },3000);
            }
        }


        //console.info($('.main-container > .the-content-con'));
        setTimeout(function(){




            if(_body.hasClass('with-border') && window.dzsscr_init){
                //console.log('apply BURNED WATER');

                var _c = $('.main-container').get(0);





                window.dzs_check_lazyloading_images_use_this_element_css_top_instead_of_window_scroll = $('.main-container > .the-content-con').eq(0);

                if(_c && _c.api_set_scrollTop_height_indicator){



                    _c.api_set_window_object($('.main-container > .the-content-con').eq(0));
                    _c.api_set_scrollTop_height_indicator($('.main-container > .the-content-con').eq(0));

                    var aux24=$('.main-container > .the-content-con').eq(0).offset().top + parseInt($('.main-container > .the-content-con').css('margin-bottom'),10);

                    aux24+=15;

                    //console.log(parseInt($('.main-container > .the-content-con').css('margin-bottom'),10));
                    _c.api_comHeight_surplus(aux24);
                }


                if(_mainBg.get(0) && _mainBg.get(0).api_set_scrollTop_is_another_element_top){

                    //console.info('api_set_scrollTop_is_another_element_top', $('.main-container > .the-content-con').eq(0))
                    _mainBg.get(0).api_set_scrollTop_is_another_element_top($('.main-container > .the-content-con').eq(0));
                }




            }
        },100);



        setTimeout(function(){
            if(window.preseter_init){

                $('.preseter.align-right').addClass('activated');
                window.preseter_init()




                if(window.dzsscr_init){
                    //console.log('apply BURNED WATER');

                    // -- preseter scroller
                    if($('.preseter .preseter-content-con').hasClass('scroller-con')){
                        window.dzsscr_init('.preseter .preseter-content-con',{
                            'settings_skin':'skin_apple'
                            ,enable_easing: 'on'
                            ,settings_autoresizescrollbar: 'on'
                            ,settings_chrome_multiplier : 0.12
                            ,settings_firefox_multiplier : -3
                            ,settings_refresh: 700
                            ,settings_autoheight: "off"
                            ,touch_leave_native_scrollbar: "on"
                        });


                    }



                }



                $('.preseter .preseter-content-con .the-content-inner-inner').bind('mouseenter',function(){

                    clearTimeout(inter_enlarge_preseter);
                    //console.info('mouseenter', $('.preseter .preseter-content-con .the-content'));
                    //$('.preseter .preseter-content-con .the-content-inner-con').css('width', '700px');
                    //$('.preseter .preseter-content-con .the-content-inner-con').css('left', 'auto');
                    //$('.preseter .preseter-content-con .the-content-inner-con').css('right', '0');
                    $('.preseter .preseter-content-con .the-content').css('width', '700px');
                    $('.preseter .preseter-content-con .the-content').css('left', 'auto');
                    $('.preseter .preseter-content-con .the-content').css('right', '0');

                    //$(this).css('width', '260px');
                    //$(this).css('left', 'auto');
                    //$(this).css('right', '0');
                })
                $('.preseter .preseter-content-con .the-content-inner-inner').bind('mouseleave',function(){


                    clearTimeout(inter_enlarge_preseter);
                    inter_enlarge_preseter = setTimeout(function(){

                        //$('.preseter .preseter-content-con .the-content-inner-con').css('width', '');
                        //$('.preseter .preseter-content-con .the-content-inner-con').css('left', '');
                        //$('.preseter .preseter-content-con .the-content-inner-con').css('right', '');
                        $('.preseter .preseter-content-con .the-content').css('width', '');
                        $('.preseter .preseter-content-con .the-content').css('left', '');
                        $('.preseter .preseter-content-con .the-content').css('right', '');
                        //$(this).css('width', '');
                        //$(this).css('left', '');
                        //$(this).css('right', '');
                    },300)
                    //console.info('mouseleave');
                })

            }
        },1500);


        //console.info(_mainBg);
        //console.info(margs);
        var aux = _mainBg.find('figure').eq(0).css('background-image');
        mainBgImgCSS = aux;

        if(aux){

            aux = aux.replace('url(','');
            aux = aux.replace('url("','');
            aux = aux.replace(')','');
            aux = aux.replace('")','');
        }else{
            //return false;
        }

        mainBgImgUrl = aux;



        //console.info('init zoombox is ',qcre_init_zoombox);
        if(qcre_init_zoombox){



            if(window.init_zoombox){

                window.init_zoombox(zoombox_options);
            }else{
                console.log('zoombox not defined .. why ? ')
            }
            qcre_init_zoombox = false;
        }


        _c_for_parallax_items = [];

        if( (page!='page-homepage' && page!='page-gallery-w-thumbs' && window.qcreative_options.bg_isparallax=='on' && (margs.newpage_transition || bg_transition=='fade') ) ){
            //_navCon.find('.translucent-con .translucent-bg').addClass('for-parallaxer');
            _navCon.find('.translucent-con .translucent-canvas').addClass('for-parallaxer');




            _c_for_parallax_items = [];
            if($('.for-parallaxer').length>0){
                $('.for-parallaxer').each(function(){
                    var _t = $(this);
                    _c_for_parallax_items.push(_t);
                })
                //= ;
            }
        }

        //console.info('DONE',margs);




        if(margs.newpage_transition && ___response) {

            transitioned_via_ajax_first = true;
            // -- this is the new page transition from setup_newBgImage() . destroy any listeners here
            determine_page();

            document.body.style.zoom = 1.0;


            $('.map-canvas-con:not(.transitioning)').remove();
            $('.fullbg').remove();
            $('.dzs-progress-bar').each(function(){
                var _t = $(this);

                //console.log(_t);
                if(_t.get(0) && _t.get(0).api_destroy_listeners){
                    _t.get(0).api_destroy_listeners();
                }

                setTimeout(function(){
                    _t[0] = null;
                },300);
                //_t = $();


            });



            if(newclass_body_with_fullbg){

                //console.info(_mainBg);

                // -- we do this here so we can access full DOM
                _body.addClass('with-fullbg');
                _mainBg.after('<div class="fullbg" style="opacity:0;"></div>');


                setTimeout(function(){
                    if(_mainBg.next().hasClass('fullbg')){
                        _mainBg.next().animate({
                            'opacity':1
                        },{
                            queue:false
                            ,duration: 300
                        })
                    }
                },50)
            }


            if (___response.find('.map-canvas-con').length > 0) {

                //console.info(___response.find('.map-canvas-con'), ___response.find('.map-canvas-con').html());
                ___response.find('.map-canvas-con').eq(0).addClass('transitioning');
                ___response.find('.map-canvas-con').eq(0).find('.map-canvas').addClass('transitioning');
                _mainContainer.append(___response.find('.map-canvas-con').eq(0));
            }



            window.scroll_top_object.val = 0;
            if(_mainContainer.get(0) && _mainContainer.get(0).api_scrolly_to){
                _mainContainer.get(0).api_scrolly_to(0, {
                    'force_no_easing':'on'
                    ,show_scrollbar : false
                })
            }else{

                $(window).scrollTop(0);
            }

        }

        //console.info($('#map-canvas'));





        //console.info(newclass_body,window.qcreative_options.bg_isparallax);


        if( window.qcreative_options.bg_isparallax=='on' && newclass_body_page!='page-homepage' && newclass_body_page!='page-gallery-w-thumbs') {

            var args = {
                mode_scroll: "fromtop",
                animation_duration: '20',
                is_fullscreen: "on",
                init_functional_delay: "0",
                init_functional_remove_delay_on_scroll: "off"
                ,settings_substract_from_th: qcreative_options.substract_parallaxer_pixels
            };
            if (parallax_reverse) {
                args.direction = "reverse";
            }





            var _aux_theContentCon = $('.main-container > .the-content-con').eq(0);


            if($('.main-container > .the-content-con.transitioning').length>0){
                _aux_theContentCon = $('.main-container > .the-content-con.transitioning').eq(0);
            }

            if(_body.hasClass('with-border')){
                //console.info(' THESE ARE CONTENT-CONS', _aux_theContentCon);
                args.settings_scrollTop_is_another_element_top = _aux_theContentCon;
                //args.settings_listen_to_object_scroll_top = window.scroll_top_object;
            }


            if(css_border_width){
                args.settings_clip_height_is_window_height = true;
            }

            //console.info($('.main-container > .the-content-con').eq(0));

            window.dzsprx_init(_mainBg, args);

            _curr_parallaxer = _mainBg;

            //console.info(_mainBg);


            if(_mainBg.get(0) && _mainBg.get(0).api_set_update_func){

                _mainBg.get(0).api_set_update_func(update_parallaxer);
            }



        }

        if(margs.newpage_transition && ___response){



            // -- part of setup_newBgImage



            //console.info($('.the-content-con:not(".transitioning")'));

            //console.info($('#map-canvas'));
            //console.info('map canvases to remove - ', $('.map-canvas.to-remove', _theContent));
            $('.map-canvas.to-remove').remove();
            $('.the-content-con:not(".transitioning") .translucent-canvas').addClass('removed');
            $('.the-content-con:not(".transitioning")').remove();
            $('.the-content-con:not(".transitioning")').find('.zfolio').remove();


            //console.info('PAGE IS ',page,newclass_body, $('.the-content-con.transitioning'));
            $('.the-content-con.transitioning').each(function(){
                var _t24 = $(this);

                //console.log(_t24);



                _t24.css('width', '');
                _t24.css('max-width', '');
                _t24.removeClass('transitioning');

                //_navCon.before(_t24);

                if(_theContent){
                    _theContent.find('.zfolio').each(function(){
                        var _t242 = $(this);
                        //console.info(_t242);
                        if(_t242.get(0) && _t242.get(0).api_destroy){
                            _t242.get(0).api_destroy();
                        }

                    })
                }


                // -- the new content-con is the real content-con NOW
                _theContent = $('.the-content').eq(0);



                handle_resize(null,{
                    placew: false
                    ,place_page:true
                    ,redraw_canvas:false
                });



                if(_t24.hasClass('fullit')){
                    _t24.find('.zfolio.fullwidth').css({
                        'width' : ''
                    })

                    page_is_fullwidth=true;
                }

                //_theContent.parent().removeClass("transitioning");



                if(_theContent && _theContent.find('.translucent-canvas').length>0){
                    _theContent.find('.translucent-canvas').each(function(){
                        var _t255 = $(this);


                        //console.info('PAGE IS', page);

                        if(page!='page-homepage' && page!='page-gallery-w-thumbs' && window.qcreative_options.bg_isparallax=='on'){
                            _t255.addClass('for-parallaxer');
                        }



                        _c_for_parallax_items = [];
                        if($('.for-parallaxer').length>0){
                            $('.for-parallaxer').each(function(){
                                var _t = $(this);
                                _c_for_parallax_items.push(_t);
                            })
                            //= ;
                        }else{
                            _c_for_parallax_items = [];
                        }

                        //console.log('content translucent cons', _t255, _theContent);
                        calculate_translucent_canvas(_t255);
                    })
                }

                setTimeout(function(){




                    //console.info('this is transition')



                    if(_t24.hasClass('fullit')==false){

                        //console.info();



                        //console.info(page);

                        if(page!='nuttin'){



                            _t24.css({
                                'opacity': 0
                                //,width : lastcontent_w
                                //,left : 0
                            });

                            //console.info('check page here ',newclass_body);

                            if(newclass_body_page=='page-gallery-w-thumbs'){

                                calculate_dims_gallery_thumbs_img_container();
                            }

                            //console.info('y no animation');
                            _t24.animate({
                                'opacity': 1
                                //,width : lastcontent_w
                                //,left : 0
                            },{
                                duration: 600
                                ,queue:false
                                ,complete:function(arg){


                                    //$(this).children('.the-content').css({
                                    //    'width':''
                                    //})
                                }
                                //,step: function(now,tween){
                                //    //console.info(now,tween);
                                //
                                //
                                //
                                //    handle_resize(null, {ignore_menu:true});
                                //}
                            });
                        }

                        _t24.children('.the-content').animate({
                            //'margin-left': 0
                        },{
                            queue:false
                            ,duration: 600
                        })


                        //_t24.find('.translucent-bg').css({
                        //    'margin-left': -ww
                        //})
                        //_t24.find('.translucent-bg').animate({
                        //    'margin-left': -initial_offset
                        //},{
                        //    duration: 600
                        //    ,queue:false
                        //})

                        setTimeout(function(){

                        },0);



                    }else{

                        //console.info('is fullit');

                        _t24.animate({
                            'opacity': 1
                        },{
                            duration: 600
                            ,queue:false
                        })


                    }


                },400);




            });



            setTimeout(function(){
                reinit();
                //console.info("REINIT");
                //handle_resize(null, {ignore_menu:true});
            },100)
        }else{


            if(first_page_not_transitioned){

                reinit();
                first_page_not_transitioned=false;
            }



            //$("body").removeClass('qtransitioned');
            //$("body").addClass('qtransitioning');


            //console.info("REINIT FROM non");
            //handle_resize();
        }


        setTimeout(function(){
            var args = {
                ignore_menu: false
                ,placew: false
                ,place_page: false
                ,redraw_canvas: false
                ,calculate_sidebar_main_is_bigger: true
            }

            handle_resize(null, args);
        },1000);


        //console.info('map canvases - ', $('.map-canvas'));
        if($('.map-canvas').length>0){
            gm_initialize();
        }
        $('.map-canvas').removeClass('transitioning').addClass('to-remove');
        $('.map-canvas-con').removeClass('transitioning');

        //handle_resize();
    }


    function fade_the_content_con(arg){

        //console.info('fade_the_content_con');
        arg.animate({
            'opacity': 1
        }, {
            duration: 1000
            , queue: false
        });

        if(_body.children('.fullbg').length>0){

            _body.children('.fullbg').animate({
                'opacity': 1
            }, {
                duration: 1000
                , queue: false
            });

        }
        if(is_ie11()){

            $('.fullbg').animate({
                'opacity': 1
            }, {
                duration: 1000
                , queue: false
            });
        }
    }

    function calculate_mainbg(){



        //var _c = $('.main-bg-con');
        //
        //_c.each(function(){
        //
        //    var _t =$(this);
        //
        //    if(_t.hasClass('')){
        //
        //    }
        //
        //});

        var _c = $('.main-bg-image');

        _c.each(function(){

            var _t =$(this);
            //console.info(_t);
            var wi = _t.get(0).naturalWidth;
            var he = _t.get(0).naturalHeight;
            //console.info(wi,he,ww,wh);

            var auxww = ww;
            var auxwh = wh;

            if(_t.parent().hasClass('dzsparallaxer')){

                auxwh*=parallaxer_multiplier;
            }

            //console.info(auxww, wh, auxwh);

            if(wi/he >auxww/auxwh){

                bigimagewidth=auxwh * (wi/he);
                bigimageheight=auxwh;

            }else{


                bigimagewidth=auxww;
                bigimageheight=auxww*(he/wi);
            }
            //console.info(bigimagewidth, bigimageheight);
            _t.width(bigimagewidth);
            _t.height(bigimageheight);
        })

    }

    function handle_frame(){

        //console.log('handle_frame()');

        if(page=='page-gallery-w-thumbs'){
            //console.info(_gallery_thumbs_con, finish_vix);
            if(finish_vix){



                begin_vix = target_vix;
                change_vix = finish_vix - begin_vix;


                //console.info('handle_frame', finish_viy, duration_viy, target_viy);

                //console.log(duration_viy);
                target_vix = Number(Math.easeIn(1, begin_vix, change_vix, duration_vix).toFixed(4));;


                //console.info(target_vix, _gallery_thumbs_con);

                if(!(_gallery_thumbs_con)){

                    if($('.gallery-thumbs-con').length>0) {
                        _gallery_thumbs_con = $('.gallery-thumbs-con').eq(0);
                    }
                }


                if(is_ios()==false && is_android()==false && _gallery_thumbs_con){
                    _gallery_thumbs_con.find('.thumbs-list').eq(0).css({
                        'transform': 'translate3d('+target_vix+'px,0,0)'
                    });
                }
            }
        }

        requestAnimFrame(handle_frame);

    }


    function change_nav_con_520(e){
        var _t = $(this);
        //console.info(e,_t, _t.val(), _t.find(':selected'));


        var _tc = _t.find(':selected').eq(0);



        click_menu_anchor(e, {_t:_tc});
    }

    function handle_wheel(e){


        var _t = $(this);


        //console.log(e, _t, menu_is_scrollable);

        if(menu_is_scrollable){
            var auxtop = parseInt(_logoCon.css('margin-top'),10);
            //console.log(auxtop);

            if(e && e.wheelDeltaY){

                auxtop+= (e.wheelDeltaY/3);
            }

            if(isNaN(auxtop)){
                auxtop=0;
            }
            if(is_firefox()){

                auxtop+= -(e.detail*12);
                //console.info(auxtop, e.detail*6)
            }else{

            }

            //console.info(auxtop, e.wheelDeltaY, menu_is_scrollable_offset);
            if(auxtop>0){
                auxtop = 0;
            }
            if(auxtop<-menu_is_scrollable_offset){
                auxtop = -menu_is_scrollable_offset;
            }
            //console.info(auxtop, e.wheelDeltaY);

            _logoCon.css('margin-top', auxtop+'px');

            e.preventDefault();
            return false;
        }
    }

    function submenu_animate_size(_arg){

        // -- _arg is the ul element


        //console.info(_arg);

        if(_arg.css('display')=='none'){


            var auxh = _arg.eq(0).height();

            if(_arg.parent().parent().hasClass('custom-menu')){


                //console.info('tru',_arg.parent().hasClass('children-active'));

                _arg.css('display','block');
                _arg.css('height','auto');

                _arg.css({
                    'display':'block'
                    ,'height':'0'
                })
                _arg.animate({
                    'height':auxh+'px'
                }, {
                    queue:false
                    ,duration:300
                    ,complete: function(e){
                        //console.info(this);

                        $(this).css('height','');
                    }
                })
                //console.info(auxh);

            }


            if(_arg.parent().parent().parent().parent().hasClass('custom-menu')){
                //console.info('tru third level');

                var _cach_parent = _arg.parent().parent();
                var _cach_parent_orig_h = _cach_parent.height();

                //console.info(_cach_parent,_cach_parent_orig_h);

                setTimeout(function(){

                    _arg.css({
                        'display':'block'
                        ,'height':'auto'
                    })

                    var targeth = _arg.height();
                    var _cach_parent_targeth = _cach_parent.height();

                    _cach_parent.css({
                        'display':'block'
                        ,'height':_cach_parent_orig_h+'px'
                    })
                    _cach_parent.animate({
                        'height':_cach_parent_targeth+'px'
                    }, {
                        queue:false
                        ,duration:300
                        ,complete: function(e){
                            //console.info(this);

                            $(this).css('height','');
                        }
                    });


                    _arg.css({
                        'display':'block'
                        ,'height':'0'
                    })
                    _arg.animate({
                        'height':auxh+'px'
                    }, {
                        queue:false
                        ,duration:300
                        ,complete: function(e){
                            //console.info(this);

                            $(this).css('height','');
                        }
                    })

                    //console.info();
                },50)


                //_arg.animate({
                //    'height':auxh+'px'
                //}, {
                //    queue:false
                //    ,duration:300
                //    ,complete: function(e){
                //        console.info(this);
                //    }
                //})
            }
        }else{

            // -- close submenu

            if(_arg.parent().parent().hasClass('custom-menu')){


                _arg.animate({
                    'height': 0
                }, {
                    queue:false
                    ,duration:300
                    ,complete: function(e){
                        console.info(this);

                        $(this).css('display','none');
                        $(this).css('height','');
                    }
                })

            }



            if(_arg.parent().parent().parent().parent().hasClass('custom-menu')){
                //console.info('tru third level');

                var _cach_parent = _arg.parent().parent();
                var _cach_parent_orig_h = _cach_parent.height();


                setTimeout(function(){

                    _arg.css({
                        'display':'block'
                        ,'height':'0'
                    })

                    var targeth = _arg.height();
                    var _cach_parent_targeth = _cach_parent.height();

                    _cach_parent.css({
                        'display':'block'
                        ,'height':_cach_parent_orig_h+'px'
                    })
                    _cach_parent.animate({
                        'height':_cach_parent_targeth+'px'
                    }, {
                        queue:false
                        ,duration:300
                        ,complete: function(e){
                            console.info(this);

                            $(this).css('height','');
                        }
                    });


                    _arg.css({
                        'display':'block'
                        ,'height':''
                    })
                    _arg.animate({
                        'height':'0'
                    }, {
                        queue:false
                        ,duration:300
                        ,complete: function(e){
                            //console.info(this);

                            $(this).css('display','none');
                            $(this).css('height','');
                        }
                    })

                    //console.info();
                },50)


            }

        }

    }

    function handle_submit(e){
        var _t = $(this);
        if(e.type=='submit'){
            if(_t.hasClass('for-contact')){


                //console.info('ceva');

                var sw_error = false;

                var _c = _t.find('input[name=name]').eq(0);
                if(_c.val()==''){

                    _c.addClass('needs-attention');
                    _c.eq(0).val('Please complete this field');

                    setTimeout(function(_arg){

                        _arg.removeClass('needs-attention');
                        _arg.val('');
                    },2000,_c);


                    sw_error=true;
                }



                _c = _t.find('input[name=subject]').eq(0);
                if(_c.val()==''){

                    _c.addClass('needs-attention');
                    _c.val('Please complete this field');

                    setTimeout(function(_arg){

                        _arg.removeClass('needs-attention');
                        _arg.val('');
                    },2000,_c);


                    sw_error=true;
                }

                _c = _t.find('*[name=comment]').eq(0);
                if(_c.val()==''){

                    _c.addClass('needs-attention');
                    _c.val('Please complete this field');

                    setTimeout(function(_arg){

                        _arg.removeClass('needs-attention');
                        _arg.val('');
                    },2000,_c);


                    sw_error=true;
                }


                _c = $('input[name=email]').eq(0);
                if(validateEmail(_c.val())==false){
                    _c.addClass('needs-attention');
                    _c.val('Invalid email address');

                    setTimeout(function(_arg){

                        _arg.removeClass('needs-attention');
                        _arg.val('');
                    },2000,_c);

                    sw_error=true;
                }

                if(sw_error){

                    return false;
                }


                var data = {
                    postdata: _t.serialize()
                };
                var ajaxurl = 'mail.php';
                $.post(ajaxurl, data, function(response) {
                    if(window.console !=undefined ){
                        console.log('Got this from the server: ' + response);
                    }
                    _t.find('.form-feedback').eq(0).addClass('active');
                    _t.find('input[name=name]').eq(0).val('');
                    _t.find('input[name=email]').eq(0).val('');
                    _t.find('input[name=subject]').eq(0).val('');
                    _t.find('textarea[name=comment]').eq(0).val('');
                    setTimeout(function(){

                        _t.find('.form-feedback').eq(0).removeClass('active');
                    },2000);
                });


                return false;



            }
        }
    }

    function mousemove_document(e){


        // console.log(e);

        if(e&&e.pageY){
            if(e.pageY<33){
                $('#wpadminbar').addClass('active');
            }else{

                $('#wpadminbar').removeClass('active');
            }
        }
    }


    function handle_mouse(e){

        var _t = $(this);

        // console.info(_t);

        if(e){
            if(e.type=='mousemove'){
                if(_t.hasClass('thumbs-list-con')){

                    var this_w = _t.width();

                    //console.info(this_w, _t.find('.thumbs-list').eq(0).width());

                    if(_t.find('.thumbs-list').eq(0).width() > this_w){

                        var mx = e.pageX - _t.offset().left;

                        var aux_tw = _t.find('.thumbs-list').eq(0).width();




                        //console.info(mx/this_w);


                        finish_vix = mx/this_w * (this_w-aux_tw-(thumbs_padding_left_and_right/2) + thumbs_list_padding_right);

                        //console.log(finish_vix);


                    }else{
                        finish_vix=0;
                    }

                }

                // -- mouse move
                if(_t.hasClass('qcreative--nav-con')){

                    if(_body.hasClass('menu-type-1') || _body.hasClass('menu-type-2')){
                        if(e.pageX>250){
                            return false;
                        }
                    }
                    //console.info(e.pageX);
                    //console.info(menu_is_scrollable);
                    if(menu_is_scrollable){
                        var aux_perc = e.pageY / wh;

                        //console.info(aux_perc, (aux_perc*menu_is_scrollable_offset));

                        _logoCon.css({
                            'margin-top' : '-'+(aux_perc*menu_is_scrollable_offset)+'px'
                        })
                    }else{

                    }
                }

            }
            if(e.type=='click'){

                if(_t.parent().hasClass('has-children') && _t.attr('href')=='#'){

                    _t.parent().children('.submenu-toggler').trigger('click');

                    return false;
                }

                if(_t.hasClass('prev-btn-con')){

                    goto_prev_bg()
                }
                if(_t.hasClass('next-btn-con')){

                    goto_next_bg()
                }
                if(_t.hasClass('map-show')){

                    contact_show_map();
                }
                if(_t.hasClass('map-hide')){

                    contact_hide_map();
                }
                if(_t.hasClass('submenu-toggler')){

                    //console.log(_t);

                    _t.parent().toggleClass('children-active');

                    var _cach = _t.parent().children('ul').eq(0);
                    submenu_animate_size(_cach);





                }
                if(_t.hasClass('dzs-select-wrapper-head')){

                    //console.log(_t);
                    //console.info(custom_responsive_menu);

                    if(custom_responsive_menu){
                        _body.addClass('custom-responsive-menu-active');
                        if(_mainContainer.get(0) && _mainContainer.get(0).api_block_scroll){
                            _mainContainer.get(0).api_block_scroll();
                        }
                    }
                }
                if(_t.hasClass('close-responsive-con')){

                    //console.log(_t);
                    //console.info(custom_responsive_menu);

                    if(custom_responsive_menu){
                        _body.removeClass('custom-responsive-menu-active');
                        if(_mainContainer.get(0) && _mainContainer.get(0).api_unblock_scroll){
                            _mainContainer.get(0).api_unblock_scroll();
                        }
                    }
                }

                if(_t.hasClass('menu-toggler') || _t.hasClass('menu-closer')){

                    $('.menu-toggler-target').eq(0).toggleClass('active');
                }

                if(_t.hasClass('thumb')){
                    var ind = _t.parent().children().index(_t);

                    currNr_gallery_w_thumbs = ind;

                    //console.info(ind);

                    _t.parent().children().removeClass('curr-thumb');
                    _t.addClass('curr-thumb');


                    //console.info(page);
                    if(page=='page-gallery-w-thumbs'){
                        if (document.getElementById("as-gallery-w-thumbs") && document.getElementById("as-gallery-w-thumbs").api_goto_page) {

                            document.getElementById("as-gallery-w-thumbs").api_goto_page(ind);
                        }

                    }
                }
                if(_t.hasClass('services-lightbox')){
                    //console.info('ceva');


                    _mainContainer.append('<div class="services-lightbox-overlay"></div>');
                    _mainContainer.append('<div class="services-lightbox-content"><div class="services-lightbox-content--content">'+_t.children('.lightbox-content').eq(0).html()+'</div><div class="services-lightbox--close"><i class="fa fa-times"></i></div></div>');

                    _mainContainer.children('.services-lightbox-content').width((_theContent.width()-60));
                    _mainContainer.children('.services-lightbox-content').css({
                        'left' : _theContent.offset().left + 30
                    });

                    if(ww<responsive_breakpoint){
                        _mainContainer.children('.services-lightbox-content').css({
                            'left' : ''
                            ,'width' : ''
                        });
                    }


                    setTimeout(function(){
                        _mainContainer.children('.services-lightbox-overlay,.services-lightbox-content').addClass('active');

                        setTimeout(function(){
                            _mainContainer.children('.services-lightbox-content').addClass('active-content');

                        },300)
                    },100);

                    if(_mainContainer.get(0) && _mainContainer.get(0).api_block_scroll){
                        _mainContainer.get(0).api_block_scroll();
                    }

                    return false;
                }
                if(_t.hasClass('services-lightbox--close')){
                    //console.info('ceva');


                    _mainContainer.children('.services-lightbox-overlay').removeClass('active');
                    _mainContainer.children('.services-lightbox-content').removeClass('active active-content');

                    setTimeout(function(){
                        _mainContainer.children('.services-lightbox-overlay,.services-lightbox-content').remove();
                    },600);


                    if(_mainContainer.get(0) && _mainContainer.get(0).api_unblock_scroll){
                        _mainContainer.get(0).api_unblock_scroll();
                    }

                    return false;
                }
                if(_t.hasClass('contact-form-button')){
                    //console.info('ceva');

                    var sw_error = false;

                    if($('input[name=the_name]').eq(0).val()==''){

                        $('input[name=the_name]').eq(0).addClass('needs-attention');
                        $('input[name=the_name]').eq(0).val('Please complete this field');

                        setTimeout(function(){

                            $('input[name=the_name]').eq(0).removeClass('needs-attention');
                            $('input[name=the_name]').eq(0).val('');
                        },2000);


                        sw_error=true;
                    }


                    if($('textarea[name=the_feedback]').eq(0).val()==''){

                        $('textarea[name=the_feedback]').eq(0).addClass('needs-attention');
                        $('textarea[name=the_feedback]').eq(0).val('Please complete this field');

                        setTimeout(function(){

                            $('textarea[name=the_feedback]').eq(0).removeClass('needs-attention');
                            $('textarea[name=the_feedback]').eq(0).val('');
                        },2000);


                        sw_error=true;
                    }


                    if(validateEmail($('input[name=the_email]').eq(0).val())==false){
                        $('input[name=the_email]').eq(0).addClass('needs-attention');
                        $('input[name=the_email]').eq(0).val('Invalid email address');

                        setTimeout(function(){

                            $('input[name=the_email]').eq(0).removeClass('needs-attention');
                            $('input[name=the_email]').eq(0).val('');
                        },2000)

                        sw_error=true;
                    }

                    if(sw_error){

                        return false;
                    }


                    var data = {
                        the_email: $('input[name=the_email]').eq(0).val()
                        ,the_name: $('input[name=the_name]').eq(0).val()
                        ,the_feedback: $('textarea[name=the_feedback]').eq(0).val()
                    };
                    var ajaxurl = $('form.contact-form').eq(0).attr('action');
                    jQuery.post(ajaxurl, data, function(response) {
                        if(window.console !=undefined ){
                            console.log('Got this from the server: ' + response);
                        }
                        $('.form-feedback').eq(0).addClass('active');
                        $('input[name=the_email]').eq(0).val('');
                        $('input[name=the_name]').eq(0).val('');
                        $('textarea[name=the_feedback]').eq(0).val('');
                        setTimeout(function(){

                            $('.form-feedback').eq(0).removeClass('active');
                        },2000);
                    });


                    return false;


                }


                if(_t.hasClass('submit-comment')){



                    // return false;


                }

                if(_t.hasClass('portfolio-single-liquid-info')){


                    if(_mainContainer.get(0) && _mainContainer.get(0).api_scrolly_to){

                        _mainContainer.find('.scrollbary').eq(0).addClass('animatetoptoo');
                        setTimeout(function(){

                            var aux = _theContent.find('.desc-content-wrapper h3').eq(0).offset().top;
                            _mainContainer.get(0).api_scrolly_to(aux, {
                                'force_no_easing':'off'
                            });
                        },50);
                    }


                }


                if(_t.hasClass('arrow-left-for-skin-qcre')){


                    if(_theContent.find('.advancedscroller').get(0) && _theContent.find('.advancedscroller').get(0).api_gotoPrevPage) {
                        _theContent.find('.advancedscroller').get(0).api_gotoPrevPage();
                    }


                }
                if(_t.hasClass('arrow-right-for-skin-qcre')){


                    if(_theContent.find('.advancedscroller').get(0) && _theContent.find('.advancedscroller').get(0).api_gotoNextPage){

                        _theContent.find('.advancedscroller').get(0).api_gotoNextPage();
                    }


                }
                if(_t.hasClass('description-wrapper--icon-con')){


                    _t.parent().toggleClass('active');


                }
                if(_t.hasClass('preseter-button--save')){


                    //console.log('ceva');


                    if(typeof(Storage) !== "undefined") {
                        //console.info($('input[name=parallax_bg]:checked').val());

                        var datenow = new Date().getTime();
                        var object = {value: $('select[name=menu-type]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("menu-type", JSON.stringify(object));

                        object = {value: $('select[name=page-title-style]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("page-title-style", JSON.stringify(object));


                        object = {value: $('select[name=page-title-align]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("page-title-align", JSON.stringify(object));

                        object = {value: $('select[name=heading-style]').eq(0).val(), timestamp: datenow};
                        //console.info(object);
                        localStorage.setItem("heading-style", JSON.stringify(object));

                        object = {value: $('select[name=heading-aligment]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("heading-aligment", JSON.stringify(object));

                        object = {value: $('select[name=content-align]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("content-align", JSON.stringify(object));

                        object = {value: $('input[name=parallax_bg]:checked').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("parallax_bg", JSON.stringify(object));

                        object = {value: $('input[name=blur_ammount]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("blur_ammount", JSON.stringify(object));

                        object = {value: $('input[name=saturation_ammount]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("saturation_ammount", JSON.stringify(object));

                        object = {value: $('input[name=color_primary]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("color_primary", JSON.stringify(object));

                        //console.info(localStorage.getItem('heading-style'));


                        var menu_type_aux = $('select[name=menu-type]').eq(0).val();
                        //console.info(menu_type_aux);
                        if(menu_type_aux=='menu-type-2'||menu_type_aux=='menu-type-4'||menu_type_aux=='menu-type-6'||menu_type_aux=='menu-type-8'||menu_type_aux=='menu-type-10'||menu_type_aux=='menu-type-14'||menu_type_aux=='menu-type-16'||menu_type_aux=='menu-type-18'){

                            //console.info()
                            if(String(curr_html).indexOf('light-')==0){




                                location.reload();
                            }else{

                                window.location.href = 'light-'+curr_html;
                            }
                        }else{

                            //console.info(String(window.location.href).indexOf('light-'), String(curr_html).substr(6))
                            if(String(curr_html).indexOf('light-')!=0){

                                //console.info(curr_html);

                                if(curr_html_with_clear_cache){
                                    window.location.href = curr_html;
                                }else{
                                    location.reload();
                                }
                                //location.reload();
                            }else{

                                window.location.href = String(curr_html).substr(6);
                            }
                        }

                    } else {
                        // Sorry! No Web Storage support..
                    }


                }
                if(_t.hasClass('preseter-button--default')){


                    //console.log('ceva');


                    if(typeof(Storage) !== "undefined") {
                        localStorage.setItem("menu-type", '');
                        localStorage.setItem("page-title-style", '');
                        localStorage.setItem("page-title-align", '');
                        localStorage.setItem("heading-style", '');
                        localStorage.setItem("heading-aligment", '');
                        localStorage.setItem("content-align", '');
                        localStorage.setItem("parallax_bg", '');
                        localStorage.setItem("blur_ammount", '');
                        localStorage.setItem("saturation_ammount", '');
                        localStorage.setItem("color_primary", '');

                        //location.reload();


                        if(String(curr_html).indexOf('light-')!=0){

                            //console.info(curr_html);

                            if(curr_html_with_clear_cache){
                                window.location.href = curr_html;
                            }else{
                                location.reload();
                            }
                            //location.reload();
                        }else{

                            window.location.href = String(curr_html).substr(6);
                        }
                    } else {
                        // Sorry! No Web Storage support..
                    }


                }
            }
        }
    }

    function handle_mouse_for_gallery_w_thumbs(e){
        var _t = $(this);


        if(_t.hasClass('arrow-left')){
            //console.info(currNr_gallery_w_thumbs);

            currNr_gallery_w_thumbs--;

            if(currNr_gallery_w_thumbs < 0){
                currNr_gallery_w_thumbs = _theContent.find('.advancedscroller').find('.thumbsClip').children().length-1;
            }

            //console.log(currNr_gallery_w_thumbs);
            //console.info(currNr_gallery_w_thumbs, _theContent.find('.advancedscroller').find('.thumbsClip'));


        }

        if(_t.hasClass('arrow-right')){
            //console.info(currNr_gallery_w_thumbs);

            currNr_gallery_w_thumbs++;

            if(currNr_gallery_w_thumbs >= _theContent.find('.advancedscroller').find('.thumbsClip').children().length){
                currNr_gallery_w_thumbs = 0;
            }

            //console.info(currNr_gallery_w_thumbs, _theContent.find('.advancedscroller').find('.thumbsClip'));


        }

        if(_gallery_thumbs_con){

            _gallery_thumbs_con.find('.thumbs-list .thumb').removeClass('curr-thumb');
            _gallery_thumbs_con.find('.thumbs-list .thumb').eq(currNr_gallery_w_thumbs).addClass('curr-thumb');
        }else{
            console.warn('gallery_thumb_con not found');
        }
    }

    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    function contact_show_map(){

        //console.info('contact_show_map()');

        $('.map-canvas-con').addClass('active');
    }

    function contact_hide_map(){

        //console.info('contact_show_map()');

        $('.map-canvas-con').removeClass('active');
    }


    function gm_initialize() {
        //console.info('gm_initialize()',window.google);



        //var _c_ = $('.map-canvas-con')[0];
        var _c_ = $('.map-canvas')[0];


        //$(_c_).removeClass('transitioning');
        //$(_c_).parent().removeClass('transitioning');

        //console.info(_c_, $('.map-canvas-con'), $('.map-canvas-con')[0])


        var lat = -33.890542;
        var long2 = 151.274856;


        if(_c_ && _c_.getAttribute && _c_.getAttribute('data-lat')){
            lat = _c_.getAttribute('data-lat');
        }
        if(_c_ && _c_.getAttribute && _c_.getAttribute('data-long')){
            long2 = _c_.getAttribute('data-long');
        }


        //console.info(window.google, window.google.maps);
        if(!(window.google) || !(google.maps) || !(google.maps.LatLng)){
            setTimeout(gm_initialize,1000);
            return false;
        }

        var gm_position = new google.maps.LatLng(lat, long2);
        var styleOptions = [{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}];

        //console.info(_c_, gm_position, lat, long2, $(_c_).width());

        styleOptions=[];

        var mapOptions = {
            zoom: 17
            ,center: gm_position
            ,mapTypeId: google.maps.MapTypeId.ROADMAP
            ,scrollwheel: false
            ,streetViewControl: false
            //,styles: styleOptions
        };





        var map = new google.maps.Map(_c_,
            mapOptions);

        //console.info(_c_);

        var image = 'img/gmaps_marker_1.png';

        if(_body.hasClass('page-normal') &&  $(_c_).hasClass('indicator-red')==false){
            image = 'img/gmaps_marker_2.png';
        }

        var beachMarker = new google.maps.Marker({
            position: gm_position,
            map: map,
            icon: image
        });


        //google.maps.event.addDomListener( map, 'drag', function(e) {
        //    //Code that runs consistantly everytime the user drags the map
        //    //load map tiles if not loaded yet
        //    console.log('ceva');
        //    google.maps.event.trigger(map,'resize');
        //    map.setZoom(map.getZoom());
        //});
        //
        //google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        //    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        //        google.maps.event.trigger(map, 'resize');
        //    });
        //});

        //window.console.log("Position center: "+map.getCenter()+"\nZoom: "+map.getZoom());

        //setTimeout(function(){
        //    console.log(map);
        //    google.maps.event.trigger(map, "resize");
        //    map.setZoom( map.getZoom() );
        //},2000);
        //
        //google.maps.event.addListenerOnce(map, 'idle', function(){
        //    $(window).resize();
        //    map.setCenter(gm_position);
        //});



        //var marker = new google.maps.Marker({
        //    position: gm_position,
        //    map: map,
        //    title: 'Hello World!'
        //});


    }

    window.qcreative_gm_init = gm_initialize;

    function loadScript() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
            'callback=gm_initialize';
        document.body.appendChild(script);
    }

    function handle_scroll(e){

        st = $(window).scrollTop();


        if(is_menu_horizontal_and_full_bg){
            var aux = full_bg_init_y - st;

            if(aux<0){
                aux = 0;
            }

            _full_bg.css('top', aux+'px');
        }

        //console.info(st);

        //if(css_border_width){
        //    //console.info(st,_mainBg);
        //
        //    _mainBg.css('top', st+'px');
        //}
        //console.log(is_menu_horizontal_and_full_bg);

        //console.log(st);

        //if(_theContent){
        //
        //    if(_theContent.children('.translucent-con').length>0){
        //        var _c = _theContent.children('.translucent-con').eq(0);
        //
        //        //_c.
        //
        //        _c.children('.translucent-bg').css({
        //            //'top' : ot+'px'
        //        })
        //    }
        //}


    }


    function regulate_nav(){


        //console.info(st);


        if(page=='page-blogsingle' && _sidebarMain){


            var st =$(window).scrollTop();
            if(_body.hasClass('with-border')){
                st = -(parseInt($('.the-content-con').eq(0).css('top'),10));
            }

            //console.info(_sidebarMain.offset().top);


            //console.info(_theContent.offset().top, _theContent.height(), _sidebarMain.offset().top, _sidebarMain.height())
            //console.info(_sidebarMain.offset().top, _sidebarMain.height(), $(window).scrollTop(),wh, _sidebarMain.offset().top + _sidebarMain.height() + 30 , $(window).scrollTop()+wh)






            //console.info(st,initial_sidebar_offset + _sidebarMain.height() + 20,st+wh);


            //console.log(initial_theContent_offset);

            _sidebarMain.css({
                'top' : '',
                'bottom' : '',
                'position': '',
                'width' : '',
                'left': ''
            })



            if(initial_sidebar_offset + _sidebarMain.height() + 20 < st+wh){
                //console.info('ceva');

                var aux = (st+wh) - (initial_sidebar_offset + _sidebarMain.height() + 20);

                //console.info(aux);


                //console.info(aux + initial_sidebar_offset+_sidebarMain.height(), _theContent.offset().top + _theContent.height() );

                var of_left = _sidebarMain.offset().left;
                var _sidebarMain_width = _sidebarMain.outerWidth();
                var aux_bottom = '25px';

                //console.warn(of_left, _sidebarMain_width);




                if(_body.hasClass('with-border')==false){


                }else{

                }



                if(aux + initial_sidebar_offset + _sidebarMain.height()> initial_theContent_offset + _theContent.height() + 35){
                    aux = initial_theContent_offset + _theContent.height() - _sidebarMain.height() + 35 - initial_sidebar_offset;

                    //console.info(st, wh, initial_theContent_offset, _theContent.height());
                    aux_bottom = (st+wh) - (initial_theContent_offset + _theContent.height()) - 33;

                }

                // console.info(_sidebarMain_width, ww, _sidebarMain.height(), wh);

                if(_sidebarMain.height()>=wh){
                    if(_sidebarMain_width<ww/2 && _body.hasClass('sidebar-is-bigger-then-content')==false){
                        _sidebarMain.css({
                            'top' : 'auto',
                            'bottom' : aux_bottom,
                            'position': 'fixed',
                            'width' : _sidebarMain_width+'px',
                            'left': of_left+'px'
                        })
                    }
                }else{

                    if(st>_sidebarMain.offset().top){
                        _sidebarMain.css({
                            'top' : aux_bottom,
                            'position': 'fixed',
                            'width' : _sidebarMain_width+'px',
                            'left': of_left+'px'
                        })
                    }
                }


                //console.info(initial_theContent_offset, aux + initial_sidebar_offset + _sidebarMain.height(),initial_theContent_offset.top + _theContent.height() + 35, aux);

                //_sidebarMain.css({
                //    'top' : aux
                //    //'transform' : 'translateY('+aux+'px)'
                //})
            }else{

                _sidebarMain.css({
                    'top' : 0
                })
            }
            if(ww<responsive_breakpoint){

                _sidebarMain.css({
                    'top' : ''
                })
            }
        }





    }


})


function qcre_callback_for_zoombox(arg){
    //console.info('qcre_callback_for_zoombox()', arg);
    //return false;

    //arg.prepend($('.qcreative--520-nav-con').eq(0).clone());


    arg.prepend('<div class="qcreative--520-nav-con--placeholder" style="height: '+jQuery('.qcreative--520-nav-con').eq(0).height()+'px;"></div>');

    if(window.dzsscr_init){
        //console.log('apply BURNED WATER');

        // -- zoombox scroller
        window.dzsscr_init('.zoombox-maincon .scroller-con',{
            'settings_skin':'skin_apple'
            ,enable_easing: 'on'
            ,settings_autoresizescrollbar: 'on'
            ,settings_chrome_multiplier : 0.12
            ,settings_firefox_multiplier : -3
            ,settings_refresh: 700
            ,settings_autoheight: "off"
            ,touch_leave_native_scrollbar: "on"
        });
    }

    if(jQuery('.main-container')){

    }
}


window.qcre_open_social_link = function(arg){
    var leftPosition, topPosition;
    var w = 500, h= 500;
    //Allow for borders.
    leftPosition = (window.screen.width / 2) - ((w / 2) + 10);
    //Allow for title and status bars.
    topPosition = (window.screen.height / 2) - ((h / 2) + 50);
    var windowFeatures = "status=no,height=" + h + ",width=" + w + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
    window.open(arg,"sharer", windowFeatures);
}

window.qcre_callback_for_zoombox = qcre_callback_for_zoombox;

function ieVersion() {
    //return 11;
    var ua = window.navigator.userAgent;
    if (ua.indexOf("Trident/7.0") > 0)
        return 11;
    else if (ua.indexOf("Trident/6.0") > 0)
        return 10;
    else if (ua.indexOf("Trident/5.0") > 0)
        return 9;
    else
        return 0;  // not IE9, 10 or 11
}

var isiPad = navigator.userAgent.match(/iPad/i) != null;

function is_ie11(){
    return !(window.ActiveXObject) && "ActiveXObject" in window;
}


function get_query_arg(purl, key){
//        console.log(purl, key)
    if(purl.indexOf(key+'=')>-1){
        //faconsole.log('testtt');
        var regexS = "[?&]"+key + "=.+";
        var regex = new RegExp(regexS);
        var regtest = regex.exec(purl);


        if(regtest != null){
            var splitterS = regtest[0];
            if(splitterS.indexOf('&')>-1){
                var aux = splitterS.split('&');
                splitterS = aux[1];
            }
            var splitter = splitterS.split('=');

            return splitter[1];

        }
        //$('.zoombox').eq
    }
}

function is_touch_device() {
    return !!('ontouchstart' in window);
}

function can_history_api() {
    return !!(window.history && history.pushState);
}

window.requestAnimFrame = (function() {
    //console.log(callback);
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */callback, /* DOMElement */element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();