function $d(e) {
    return document.getElementById(e)
}
var addeventatc = function () {
    var a, u, v, r, t, e = !1,
        l = 1,
        s = !1,
        p = !0,
        m = !1,
        g = !1,
        h = !1,
        _ = 1,
        f = "",
        b = !0,
        w = !0,
        x = !0,
        k = !0,
        y = !0,
        T = !0,
        // z = "Apple Calendar",
        // E = "Google <em>(online)</em>",
        // N = "Outlook",
        // C = "Outlook.com <em>(online)</em>",
        // I = "Yahoo <em>(online)</em>",
        // $ = "Facebook Event",
        z = "Apple Calendar <em>(.ics)</em>",
        E = "Google <em>(online)</em>",
        N = "Outlook <em>(.ics)</em>",
        C = "Outlook.com <em>(online)</em>",
        I = "Yahoo <em>(online)</em>",
        $ = "Facebook Event",
        A = null,
        L = null,
        n = null,
        H = null,
        R = null,
        M = null,
        S = !1;
    return {
        initialize: function () {
            if (!e) {
                e = !0;
                try {
                    addeventasync()
                }
                catch (e) { }
                "https:", "addevent.com", "https://addevent.com", a = "undefined" != typeof SVGRect ? "https://www.addevent.com/gfx/icon-calendar-t1.svg" : "https://www.addevent.com/gfx/icon-calendar-t5.png", addeventatc.trycss(), addeventatc.generate()
            }
        },
        generate: function () {
            for (var c = document.getElementsByTagName("*"), i = 0; i < c.length; i += 1) addeventatc.hasclass(c[i], "addeventatc") && function () {
                var a = "addeventatc" + l;
                c[i].id = a, c[i].title = "", c[i].style.visibility = "visible", c[i].setAttribute("aria-haspopup", "true"), c[i].setAttribute("aria-expanded", "false"), c[i].setAttribute("tabindex", "0"), s ? (c[i].onclick = function () {
                    return !1
                }, c[i].onmouseover = function () {
                    clearTimeout(r), addeventatc.toogle(this,
                        {
                            type: "mouseover",
                            id: a
                        })
                }, c[i].onmouseout = function () {
                    r = setTimeout(function () {
                        addeventatc.mouseout(this,
                            {
                                type: "mouseout",
                                id: a
                            })
                    }, 100)
                }) : (c[i].onclick = function () {
                    return addeventatc.toogle(this,
                        {
                            type: "click",
                            id: a
                        }), !1
                }, c[i].onmouseover = function () { }, c[i].onmouseout = function () { }), c[i].onkeydown = function (e) {
                    var t = e.which || e.keyCode;
                    "13" != t && "32" != t && "27" != t && "38" != t && "40" != t || e.preventDefault(), "13" != t && "32" != t || (addeventatc.keyboardclick(this,
                        {
                            type: "click",
                            id: a
                        }), addeventatc.toogle(this,
                            {
                                type: "click",
                                id: a,
                                keynav: !0
                            })), "27" == t && addeventatc.hideandreset(), "38" == t && addeventatc.keyboard(this,
                                {
                                    type: "keyboard",
                                    id: a,
                                    key: "up"
                                }), "40" == t && addeventatc.keyboard(this,
                                    {
                                        type: "keyboard",
                                        id: a,
                                        key: "down"
                                    }), S = !0
                }, c[i].onblur = function () {
                    S && setTimeout(function () {
                        addeventatc.hideandreset()
                    }, 300)
                };
                var e = c[i];
                if ("none" != c[i].getAttribute("data-styling") && "inline-buttons" != c[i].getAttribute("data-render") || (p = !1), p) {
                    var t = document.createElement("span");
                    t.className = "addeventatc_icon", e.appendChild(t)
                }
                l++ , m = !0;
                for (var n = c[i].getElementsByTagName("*"), o = 0; o < n.length; o += 1) addeventatc.hasclass(n[o], "atc_node") || ("" != n[o].className ? n[o].className += " atc_node" : n[o].className += "atc_node");
                if ("inline-buttons" == c[i].getAttribute("data-render")) {
                    c[i].onclick = function () { }, addeventatc.toogle(c[i],
                        {
                            type: "render",
                            id: a
                        }), c[i].setAttribute("aria-expanded", "true"), c[i].removeAttribute("tabindex"), c[i].onkeydown = function () { }, c[i].blur = function () { };
                    var d = document.getElementById(a + "-drop");
                    if (d) {
                        d.setAttribute("aria-hidden", "false");
                        for (n = d.getElementsByTagName("SPAN"), o = 0; o < n.length; o += 1) {
                            n[o];
                            n[o].tabIndex = "0", n[o].onkeydown = function (e) {
                                var t = e.which || e.keyCode;
                                "13" != t && "32" != t || e.target.click()
                            }
                        }
                    }
                }
            }();
            _ = addeventatc.topzindex(), p ? addeventatc.applycss() : (addeventatc.removeelement($d("ate_css")), addeventatc.removeelement($d("ate_tmp_css")), addeventatc.helpercss()), m && !g && (g = !0, addeventatc.track(
                {
                    typ: "exposure",
                    cal: ""
                }))
        },
        toogle: function (e, t) {
            var a, n, o, d = !1,
                c = "";
            if (n = $d(a = e.id)) {
                o = n.getAttribute("data-direct");
                var i = n.getAttribute("data-intel"),
                    r = n.getAttribute("data-intel-apple");
                if ("ios" == addeventatc.agent() && "click" == t.type && "true" !== r && "false" !== i && (o = "appleical", n.setAttribute("data-intel-apple", "true")), "outlook" == o || "google" == o || "yahoo" == o || "hotmail" == o || "outlookcom" == o || "appleical" == o || "apple" == o || "facebook" == o) "click" == t.type && (addeventatc.click(
                    {
                        button: a,
                        service: o,
                        id: t.id
                    }), null != A && addeventatc.trigger("button_click",
                        {
                            id: a
                        }));
                else if ("mouseover" == t.type && v != n && (h = !1), "click" == t.type || "render" == t.type || "mouseover" == t.type && !h) {
                    "mouseover" == t.type && (h = !0, null != L && addeventatc.trigger("button_mouseover",
                        {
                            id: a
                        })), d = addeventatc.getburl(
                            {
                                id: a,
                                facebook: !0
                            }), "" == f && (f = "appleical,google,outlook,outlookcom,yahoo,facebook");
                    for (var l = (f = (f += ",")
                        .replace(/ /gi, ""))
                        .split(","), s = 0; s < l.length; s += 1)(b && "ical" == l[s] || b && "appleical" == l[s]) && (c += '<span class="ateappleical" id="' + a + '-appleical" role="menuitem">' + z + "</span>"), w && "google" == l[s] && (c += '<span class="ategoogle" id="' + a + '-google" role="menuitem">' + E + "</span>"), x && "outlook" == l[s] && (c += '<span class="ateoutlook" id="' + a + '-outlook" role="menuitem">' + N + "</span>"), (k && "hotmail" == l[s] || k && "outlookcom" == l[s]) && (c += '<span class="ateoutlookcom" id="' + a + '-outlookcom" role="menuitem">' + C + "</span>"), y && "yahoo" == l[s] && (c += '<span class="ateyahoo" id="' + a + '-yahoo" role="menuitem">' + I + "</span>"), d && "facebook" == l[s] && T && "facebook" == l[s] && (c += '<span class="atefacebook" id="' + a + '-facebook" role="menuitem">' + $ + "</span>");
                    if (addeventatc.getlicense(u) || (c += '<em class="copyx"><em class="brx"></em><em class="frs"><a href="https://www.addevent.com" title="" tabindex="-1" id="' + a + '-home">AddEvent.com</a></em></em>'), !$d(a + "-drop")) {
                        var p = document.createElement("span");
                        p.id = a + "-drop", p.className = "addeventatc_dropdown", p.setAttribute("aria-hidden", "true"), p.setAttribute("aria-labelledby", a), p.innerHTML = c, n.appendChild(p)
                    }
                    $d(a + "-appleical") && ($d(a + "-appleical")
                        .onclick = function () {
                            addeventatc.click(
                                {
                                    button: a,
                                    service: "appleical",
                                    id: t.id
                                })
                        }), $d(a + "-google") && ($d(a + "-google")
                            .onclick = function () {
                                addeventatc.click(
                                    {
                                        button: a,
                                        service: "google",
                                        id: t.id
                                    })
                            }), $d(a + "-outlook") && ($d(a + "-outlook")
                                .onclick = function () {
                                    addeventatc.click(
                                        {
                                            button: a,
                                            service: "outlook",
                                            id: t.id
                                        })
                                }), $d(a + "-outlookcom") && ($d(a + "-outlookcom")
                                    .onclick = function () {
                                        addeventatc.click(
                                            {
                                                button: a,
                                                service: "outlookcom",
                                                id: t.id
                                            })
                                    }), $d(a + "-yahoo") && ($d(a + "-yahoo")
                                        .onclick = function () {
                                            addeventatc.click(
                                                {
                                                    button: a,
                                                    service: "yahoo",
                                                    id: t.id
                                                })
                                        }), $d(a + "-facebook") && ($d(a + "-facebook")
                                            .onclick = function () {
                                                addeventatc.click(
                                                    {
                                                        button: a,
                                                        service: "facebook",
                                                        id: t.id
                                                    })
                                            }), $d(a + "-home") && ($d(a + "-home")
                                                .onclick = function () {
                                                    addeventatc.click(
                                                        {
                                                            button: a,
                                                            service: "home",
                                                            id: t.id
                                                        })
                                                }), addeventatc.show(a, t)
                }
                return v = n, !1
            }
        },
        click: function (e) {
            var t, a, n, o = location.origin,
                d = !0;
            if (void 0 === location.origin && (o = location.protocol + "//" + location.host), t = $d(e.button)) {
                if ("home" == e.service) n = "https://www.addevent.com";
                else {
                    a = addeventatc.getburl(
                        {
                            id: e.button,
                            facebook: !1
                        }), n = "https://www.addevent.com/create/?service=" + e.service + a + "&reference=" + o, "outlook" != e.service && "appleical" != e.service || (d = !1, addeventatc.usewebcal() && (n = "webcal://www.addevent.com/create/?uwc=on&service=" + e.service + a + "&reference=" + o));
                    var c = t.getAttribute("data-id");
                    null !== c && (n = "https://www.addevent.com/event/" + c + "+" + e.service)
                }
                if (!$d("atecllink")) {
                    var i = document.createElement("a");
                    i.id = "atecllink", i.rel = "external", i.setAttribute("data-role", "none"), i.innerHTML = "{addeventatc-ghost-link}", i.style.display = "none", document.body.appendChild(i)
                }
                var r = $d("atecllink");
                if (r.target = d ? "_blank" : "_self", r.href = n, addeventatc.eclick("atecllink"), addeventatc.track(
                    {
                        typ: "click",
                        cal: e.service
                    }), null != M) {
                    addeventatc.trigger("button_dropdown_click",
                        {
                            id: e.button,
                            service: e.service
                        });
                    try {
                        (event || window.event)
                            .stopPropagation()
                    }
                    catch (e) { }
                }
            }
        },
        mouseout: function (e, t) {
            h = !1, addeventatc.hideandreset(), null != n && addeventatc.trigger("button_mouseout",
                {
                    id: t.id
                })
        },
        show: function (e, t) {
            var a = $d(e),
                n = $d(e + "-drop");
            if (a && n)
                if ("block" == addeventatc.getstyle(n, "display")) addeventatc.hideandreset();
                else {
                    addeventatc.hideandreset(!0), n.style.display = "block", a.style.outline = "0", a.style.zIndex = _ + 1, a.className = a.className + " addeventatc-selected", a.className = a.className.replace(/\s+/g, " "), a.setAttribute("aria-expanded", "true"), n.setAttribute("aria-hidden", "false"), t.keynav && addeventatc.keyboard(this,
                        {
                            type: "keyboard",
                            id: e,
                            key: "down"
                        });
                    var o = a.getAttribute("data-dropdown-x"),
                        d = a.getAttribute("data-dropdown-y"),
                        c = "auto",
                        i = "auto";
                    null != o && (i = o), null != d && (c = d), n.style.left = "0px", n.style.top = "0px", n.style.display = "block";
                    var r = parseInt(a.offsetHeight),
                        l = parseInt(a.offsetWidth),
                        s = parseInt(n.offsetHeight),
                        p = parseInt(n.offsetWidth),
                        u = addeventatc.viewport(),
                        v = parseInt(u.w),
                        m = parseInt(u.h),
                        g = parseInt(u.x),
                        h = parseInt(u.y),
                        f = addeventatc.elementposition(n),
                        b = parseInt(f.x),
                        w = parseInt(f.y) + s,
                        x = m + h,
                        k = 0,
                        y = 0;
                    "down" == c && "left" == i ? (k = "0px", y = r + "px") : "up" == c && "left" == i ? (k = "0px", y = -s + "px") : "down" == c && "right" == i ? (k = -(p - l) + "px", y = r + "px") : "up" == c && "right" == i ? (k = -(p - l) + "px", y = -s + "px") : "auto" == c && "left" == i ? (k = "0px", y = x < w ? -s + "px" : r + "px") : "auto" == c && "right" == i ? (k = -(p - l) + "px", y = x < w ? -s + "px" : r + "px") : (y = x < w ? -s + "px" : r + "px", k = v + g < b + p ? -(p - l) + "px" : "0px"), n.style.left = k, n.style.top = y, "click" == t.type && null != A && addeventatc.trigger("button_click",
                        {
                            id: e
                        }), null != H && addeventatc.trigger("button_dropdown_show",
                            {
                                id: e
                            })
                }
        },
        hide: function (e) {
            var t = !1;
            ("string" == typeof e && "" !== e || e instanceof String && "" !== e) && (-1 < e.indexOf("addeventatc") || -1 < e.indexOf("atc_node")) && (t = !0), t || addeventatc.hideandreset()
        },
        hideandreset: function (e) {
            for (var t = "", a = document.getElementsByTagName("*"), n = 0; n < a.length; n += 1)
                if (addeventatc.hasclass(a[n], "addeventatc")) {
                    a[n].className = a[n].className.replace(/addeventatc-selected/gi, ""), a[n].className = a[n].className.replace(/\s+$/, ""), a[n].style.zIndex = "auto", a[n].style.outline = "";
                    var o = $d(a[n].id + "-drop");
                    if (o) {
                        var d = addeventatc.getstyle(o, "display");
                        "block" == d && (t = a[n].id), o.style.display = "none", "block" !== (d = addeventatc.getstyle(o, "display")) && (a[n].setAttribute("aria-expanded", "false"), o.setAttribute("aria-hidden", "true"));
                        for (var c = o.getElementsByTagName("SPAN"), i = 0; i < c.length; i += 1) {
                            var r = new RegExp("(\\s|^)drop_markup(\\s|$)");
                            c[i].className = c[i].className.replace(r, " "), c[i].className = c[i].className.replace(/\s+$/, "")
                        }
                    }
                }
            e || null != R && addeventatc.trigger("button_dropdown_hide",
                {
                    id: t
                })
        },
        getburl: function (e) {
            var t = $d(e.id),
                a = "",
                n = !1;
            if (t) {
                for (var o = t.getElementsByTagName("*"), d = 0; d < o.length; d += 1)(addeventatc.hasclass(o[d], "_start") || addeventatc.hasclass(o[d], "start")) && (a += "&dstart=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_end") || addeventatc.hasclass(o[d], "end")) && (a += "&dend=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_zonecode") || addeventatc.hasclass(o[d], "zonecode")) && (a += "&dzone=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_timezone") || addeventatc.hasclass(o[d], "timezone")) && (a += "&dtime=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_summary") || addeventatc.hasclass(o[d], "summary") || addeventatc.hasclass(o[d], "title")) && (a += "&dsum=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_description") || addeventatc.hasclass(o[d], "description")) && (a += "&ddesc=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_location") || addeventatc.hasclass(o[d], "location")) && (a += "&dloca=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_organizer") || addeventatc.hasclass(o[d], "organizer")) && (a += "&dorga=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_organizer_email") || addeventatc.hasclass(o[d], "organizer_email")) && (a += "&dorgaem=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_attendees") || addeventatc.hasclass(o[d], "attendees")) && (a += "&datte=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_all_day_event") || addeventatc.hasclass(o[d], "all_day_event")) && (a += "&dallday=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_date_format") || addeventatc.hasclass(o[d], "date_format")) && (a += "&dateformat=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_alarm_reminder") || addeventatc.hasclass(o[d], "alarm_reminder")) && (a += "&alarm=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_recurring") || addeventatc.hasclass(o[d], "recurring")) && (a += "&drule=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_facebook_event") || addeventatc.hasclass(o[d], "facebook_event")) && (a += "&fbevent=" + encodeURIComponent(o[d].innerHTML), n = !0), (addeventatc.hasclass(o[d], "_client") || addeventatc.hasclass(o[d], "client")) && (a += "&client=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_calname") || addeventatc.hasclass(o[d], "calname")) && (a += "&calname=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_uid") || addeventatc.hasclass(o[d], "uid")) && (a += "&uid=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_status") || addeventatc.hasclass(o[d], "status")) && (a += "&status=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_method") || addeventatc.hasclass(o[d], "method")) && (a += "&method=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_transp") || addeventatc.hasclass(o[d], "transp")) && (a += "&transp=" + encodeURIComponent(o[d].innerHTML));
                "false" == t.getAttribute("data-google-api") && (a += "&gapi=false")
            }
            return e.facebook && (a = n), a
        },
        trycss: function () {
            if (!$d("ate_tmp_css")) {
                try {
                    var e = "";
                    e = ".addeventatc {visibility:hidden;}", e += ".addeventatc .data {display:none!important;}", e += ".addeventatc .start, .addeventatc .end, .addeventatc .timezone, .addeventatc .title, .addeventatc .description, .addeventatc .location, .addeventatc .organizer, .addeventatc .organizer_email, .addeventatc .facebook_event, .addeventatc .all_day_event, .addeventatc .date_format, .addeventatc .alarm_reminder, .addeventatc .recurring, .addeventatc .attendees, .addeventatc .client, .addeventatc .calname, .addeventatc .uid, .addeventatc .status, .addeventatc .method, .addeventatc .transp {display:none!important;}", p && (e += ".addeventatc {background-image:url(https://www.addevent.com/gfx/icon-calendar-t5.png), url(https://www.addevent.com/gfx/icon-calendar-t1.svg), url(https://www.addevent.com/gfx/icon-apple-t1.svg), url(https://www.addevent.com/gfx/icon-facebook-t1.svg), url(https://www.addevent.com/gfx/icon-google-t1.svg), url(https://www.addevent.com/gfx/icon-outlook-t1.svg), url(https://www.addevent.com/gfx/icon-yahoo-t1.svg);background-position:-9999px -9999px;background-repeat:no-repeat;}");
                    var t = document.createElement("style");
                    t.type = "text/css", t.id = "ate_tmp_css", t.styleSheet ? t.styleSheet.cssText = e : t.appendChild(document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(t)
                }
                catch (e) { }
                addeventatc.track(
                    {
                        typ: "jsinit",
                        cal: ""
                    })
            }
        },
        applycss: function () {
            if (!$d("ate_css")) {
                var e = "";
                e += '.addeventatc {display:inline-block;*display:inline;zoom:1;position:relative;z-index:1;font-family:Roboto,"Helvetica Neue",Helvetica,Optima,Segoe,"Segoe UI",Candara,Calibri,Arial,sans-serif;color:#000!important;font-weight:300;line-height:100%!important;background-color:#fff;border:1px solid;border-color:#e5e6e9 #dfe0e4 #d0d1d5;font-size:15px;text-decoration:none;padding:13px 12px 12px 43px;-webkit-border-radius:3px;border-radius:3px;cursor:pointer;-webkit-font-smoothing:antialiased!important;text-shadow:1px 1px 1px rgba(0,0,0,0.004);-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);background-image:url(https://www.addevent.com/gfx/icon-calendar-t5.png), url(https://www.addevent.com/gfx/icon-calendar-t1.svg), url(https://www.addevent.com/gfx/icon-apple-t1.svg), url(https://www.addevent.com/gfx/icon-facebook-t1.svg), url(https://www.addevent.com/gfx/icon-google-t1.svg), url(https://www.addevent.com/gfx/icon-outlook-t1.svg), url(https://www.addevent.com/gfx/icon-yahoo-t1.svg);background-position:-9999px -9999px;background-repeat:no-repeat;}', e += ".addeventatc:hover {border:1px solid #aab9d4;color:#000;font-size:15px;text-decoration:none;}", e += ".addeventatc:focus {outline:none;border:1px solid #aab9d4;}", e += ".addeventatc:active {top:1px;}", e += ".addeventatc-selected {background-color:#f9f9f9;}", e += ".addeventatc .addeventatc_icon {width:18px;height:18px;position:absolute;z-index:1;left:12px;top:10px;background:url(" + a + ") no-repeat;background-size:18px 18px;}", e += ".addeventatc .start, .addeventatc .end, .addeventatc .timezone, .addeventatc .title, .addeventatc .description, .addeventatc .location, .addeventatc .organizer, .addeventatc .organizer_email, .addeventatc .facebook_event, .addeventatc .all_day_event, .addeventatc .date_format, .addeventatc .alarm_reminder, .addeventatc .recurring, .addeventatc .attendees, .addeventatc .client, .addeventatc .calname, .addeventatc .uid, .addeventatc .status, .addeventatc .method, .addeventatc .transp {display:none!important;}", e += ".addeventatc .data {display:none!important;}", e += ".addeventatc br {display:none;}", addeventatc.getlicense(u) ? e += ".addeventatc_dropdown {width:200px;position:absolute;z-index:99999;padding:6px 0px 6px 0px;background:#fff;text-align:left;display:none;margin-top:-2px;margin-left:-1px;border-top:1px solid #c8c8c8;border-right:1px solid #bebebe;border-bottom:1px solid #a8a8a8;border-left:1px solid #bebebe;-moz-border-radius:2px;-webkit-border-radius:2px;-webkit-box-shadow:1px 3px 6px rgba(0,0,0,0.15);-moz-box-shadow:1px 3px 6px rgba(0,0,0,0.15);box-shadow:1px 3px 6px rgba(0,0,0,0.15);}" : e += ".addeventatc_dropdown {width:200px;position:absolute;z-index:99999;padding:6px 0px 0px 0px;background:#fff;text-align:left;display:none;margin-top:-2px;margin-left:-1px;border-top:1px solid #c8c8c8;border-right:1px solid #bebebe;border-bottom:1px solid #a8a8a8;border-left:1px solid #bebebe;-moz-border-radius:2px;-webkit-border-radius:2px;-webkit-box-shadow:1px 3px 6px rgba(0,0,0,0.15);-moz-box-shadow:1px 3px 6px rgba(0,0,0,0.15);box-shadow:1px 3px 6px rgba(0,0,0,0.15);}", e += ".addeventatc_dropdown span {display:block;line-height:100%;background:#fff;text-decoration:none;font-size:14px;color:#333;padding:9px 10px 9px 40px;}", e += ".addeventatc_dropdown span:hover {background-color:#f4f4f4;color:#000;text-decoration:none;font-size:14px;}", e += ".addeventatc_dropdown .drop_markup {background-color:#f4f4f4;color:#000;text-decoration:none;font-size:14px;}", e += ".addeventatc_dropdown .copyx {height:21px;display:block;position:relative;cursor:default;}", e += ".addeventatc_dropdown .brx {height:1px;overflow:hidden;background:#e0e0e0;position:absolute;z-index:100;left:10px;right:10px;top:9px;}", e += ".addeventatc_dropdown .frs {position:absolute;top:5px;cursor:pointer;right:10px;font-style:normal!important;font-weight:normal!important;text-align:right;z-index:101;line-height:9px!important;background:#fff;text-decoration:none;font-size:9px!important;color:#cacaca!important;}", e += ".addeventatc_dropdown .frs a {margin:0!important;padding:0!important;font-style:normal!important;font-weight:normal!important;line-height:9px!important;background-color:#fff!important;text-decoration:none;font-size:9px!important;color:#cacaca!important;padding-left:10px!important;display:inline-block;}", e += ".addeventatc_dropdown .frs a:hover {color:#999!important;}", e += ".addeventatc_dropdown .ateappleical {background-image:url(https://www.addevent.com/gfx/icon-apple-t1.svg);background-repeat:no-repeat;background-position:13px 50%;background-size:14px 100%;}", e += ".addeventatc_dropdown .ategoogle {background-image:url(https://www.addevent.com/gfx/icon-google-t1.svg);background-repeat:no-repeat;background-position:12px 50%;background-size:16px 100%;}", e += ".addeventatc_dropdown .ateoutlook {background-image:url(https://www.addevent.com/gfx/icon-outlook-t1.svg);background-repeat:no-repeat;background-position:12px 50%;background-size:16px auto;}", e += ".addeventatc_dropdown .ateoutlookcom {background-image:url(https://www.addevent.com/gfx/icon-outlook-t1.svg);background-repeat:no-repeat;background-position:12px 50%;background-size:16px auto;}", e += ".addeventatc_dropdown .ateyahoo {background-image:url(https://www.addevent.com/gfx/icon-yahoo-t1.svg);background-repeat:no-repeat;background-position:12px 50%;background-size:16px auto;}", e += ".addeventatc_dropdown .atefacebook {background-image:url(https://www.addevent.com/gfx/icon-facebook-t1.svg);background-repeat:no-repeat;background-position:12px 50%;background-size:16px auto;}", e += ".addeventatc_dropdown em {font-size:12px!important;color:#999!important;}";
                var t = document.createElement("style");
                t.type = "text/css", t.id = "ate_css", t.styleSheet ? t.styleSheet.cssText = e : t.appendChild(document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(t), addeventatc.removeelement($d("ate_tmp_css"))
            }
        },
        helpercss: function () {
            if (!$d("ate_helper_css")) {
                var e = "";
                e += ".addeventatc_dropdown .drop_markup {background-color:#f4f4f4;}", e += ".addeventatc_dropdown .frs a {margin:0!important;padding:0!important;font-style:normal!important;font-weight:normal!important;line-height:110%!important;background-color:#fff!important;text-decoration:none;font-size:9px!important;color:#cacaca!important;display:inline-block;}", e += ".addeventatc_dropdown .frs a:hover {color:#999!important;}", e += ".addeventatc .start, .addeventatc .end, .addeventatc .timezone, .addeventatc .title, .addeventatc .description, .addeventatc .location, .addeventatc .organizer, .addeventatc .organizer_email, .addeventatc .facebook_event, .addeventatc .all_day_event, .addeventatc .date_format, .addeventatc .alarm_reminder, .addeventatc .recurring, .addeventatc .attendees, .addeventatc .client, .addeventatc .calname, .addeventatc .uid, .addeventatc .status, .addeventatc .method {display:none!important;}";
                var t = document.createElement("style");
                t.type = "text/css", t.id = "ate_helper_css", t.styleSheet ? t.styleSheet.cssText = e : t.appendChild(document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(t)
            }
        },
        removeelement: function (e) {
            try {
                return !!(hdx = e) && hdx.parentNode.removeChild(hdx)
            }
            catch (e) { }
        },
        topzindex: function () {
            for (var e = 1, t = document.getElementsByTagName("*"), a = 0; a < t.length; a += 1)
                if (addeventatc.hasclass(t[a], "addeventatc") || addeventatc.hasclass(t[a], "addeventstc")) {
                    var n = addeventatc.getstyle(t[a], "z-index");
                    !isNaN(parseFloat(n)) && isFinite(n) && e < (n = parseInt(n)) && (e = n)
                }
            return e
        },
        viewport: function () {
            var e = 0,
                t = 0,
                a = 0,
                n = 0;
            return "number" == typeof window.innerWidth ? (e = window.innerWidth, t = window.innerHeight) : document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight) ? (e = document.documentElement.clientWidth, t = document.documentElement.clientHeight) : document.body && (document.body.clientWidth || document.body.clientHeight) && (e = document.body.clientWidth, t = document.body.clientHeight), document.all ? (n = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft, a = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) : (n = window.pageXOffset, a = window.pageYOffset),
                {
                    w: e,
                    h: t,
                    x: n,
                    y: a
                }
        },
        elementposition: function (e) {
            var t = 0,
                a = 0;
            if (e.offsetParent)
                for (t = e.offsetLeft, a = e.offsetTop; e = e.offsetParent;) t += e.offsetLeft, a += e.offsetTop;
            return {
                x: t,
                y: a
            }
        },
        getstyle: function (e, t) {
            var a, n = e;
            return n.currentStyle ? a = n.currentStyle[t] : window.getComputedStyle && (a = document.defaultView.getComputedStyle(n, null)
                .getPropertyValue(t)), a
        },
        getlicense: function (e) {
            var t = location.origin,
                a = !1;
            if (void 0 === location.origin && (t = location.protocol + "//" + location.host), e) {
                var n = e.substring(0, 1),
                    o = e.substring(9, 10),
                    d = e.substring(17, 18);
                "a" == n && "z" == o && "m" == d && (a = !0)
            }
            return (-1 == t.indexOf("addevent.com") && "aao8iuet5zp9iqw5sm9z" == e || -1 == t.indexOf("addevent.to") && "aao8iuet5zp9iqw5sm9z" == e || -1 == t.indexOf("addevent.com") && "aao8iuet5zp9iqw5sm9z" == e) && (a = !0), a
        },
        refresh: function () {
            for (var e = document.getElementsByTagName("*"), t = [], a = 0; a < e.length; a += 1)
                if (addeventatc.hasclass(e[a], "addeventatc")) {
                    e[a].className = e[a].className.replace(/addeventatc-selected/gi, ""), e[a].id = "";
                    for (var n = e[a].getElementsByTagName("*"), o = 0; o < n.length; o += 1)(addeventatc.hasclass(n[o], "addeventatc_icon") || addeventatc.hasclass(n[o], "addeventatc_dropdown")) && t.push(n[o])
                }
            for (var d = 0; d < t.length; d += 1) addeventatc.removeelement(t[d]);
            addeventatc.removeelement($d("ate_css")), g = !(l = 1), addeventatc.generate()
        },
        hasclass: function (e, t) {
            return new RegExp("(\\s|^)" + t + "(\\s|$)")
                .test(e.className)
        },
        eclick: function (e) {
            var t = document.getElementById(e);
            if (t.click) t.click();
            else if (document.createEvent) {
                var a = document.createEvent("MouseEvents");
                a.initEvent("click", !0, !0), t.dispatchEvent(a)
            }
        },
        track: function (e) {
            new Image, (new Date)
                .getTime(), encodeURIComponent(window.location.origin)
        },
        getguid: function () {
            for (var e = "addevent_track_cookie=", t = "", a = document.cookie.split(";"), n = 0; n < a.length; n++) {
                for (var o = a[n];
                    " " == o.charAt(0);) o = o.substring(1, o.length);
                0 == o.indexOf(e) && (t = o.substring(e.length, o.length))
            }
            if ("" == t) {
                var d = (addeventatc.s4() + addeventatc.s4() + "-" + addeventatc.s4() + "-4" + addeventatc.s4()
                    .substr(0, 3) + "-" + addeventatc.s4() + "-" + addeventatc.s4() + addeventatc.s4() + addeventatc.s4())
                    .toLowerCase(),
                    c = new Date;
                c.setTime(c.getTime() + 31536e6);
                var i = "expires=" + c.toUTCString();
                document.cookie = "addevent_track_cookie=" + d + "; " + i, t = d
            }
            return t
        },
        s4: function () {
            return (65536 * (1 + Math.random()) | 0)
                .toString(16)
                .substring(1)
        },
        documentclick: function (e) {
            e = (e = e || window.event)
                .target || e.srcElement, ate_touch_capable ? (clearTimeout(t), t = setTimeout(function () {
                    addeventatc.hide(e.className)
                }, 500)) : addeventatc.hide(e.className)
        },
        trigger: function (e, t) {
            if ("button_click" == e) try {
                    A(t)
                }
                catch (e) { }
            if ("button_mouseover" == e) try {
                    L(t)
                }
                catch (e) { }
            if ("button_mouseout" == e) try {
                    n(t)
                }
                catch (e) { }
            if ("button_dropdown_show" == e) try {
                    H(t)
                }
                catch (e) { }
            if ("button_dropdown_hide" == e) try {
                    R(t)
                }
                catch (e) { }
            if ("button_dropdown_click" == e) try {
                    M(t)
                }
                catch (e) { }
        },
        register: function (e, t) {
            "button-click" == e && (A = t), "button-mouseover" == e && (L = t), "button-mouseout" == e && (n = t), "button-dropdown-show" == e && (H = t), "button-dropdown-hide" == e && (R = t), "button-dropdown-click" == e && (M = t)
        },
        settings: function (e) {
            null != e.license && (u = e.license), null != e.css && (e.css ? p = !0 : (p = !1, addeventatc.removeelement($d("ate_css")))), null != e.mouse && (s = e.mouse), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (s = !1), null != e.outlook && null != e.outlook.show && (x = e.outlook.show), null != e.google && null != e.google.show && (w = e.google.show), null != e.yahoo && null != e.yahoo.show && (y = e.yahoo.show), null != e.hotmail && null != e.hotmail.show && (k = e.hotmail.show), null != e.outlookcom && null != e.outlookcom.show && (k = e.outlookcom.show), null != e.ical && null != e.ical.show && (b = e.ical.show), null != e.appleical && null != e.appleical.show && (b = e.appleical.show), null != e.facebook && null != e.facebook.show && (T = e.facebook.show), null != e.outlook && null != e.outlook.text && (N = e.outlook.text), null != e.google && null != e.google.text && (E = e.google.text), null != e.yahoo && null != e.yahoo.text && (I = e.yahoo.text), null != e.hotmail && null != e.hotmail.text && (C = e.hotmail.text), null != e.outlookcom && null != e.outlookcom.text && (C = e.outlookcom.text), null != e.ical && null != e.ical.text && (z = e.ical.text), null != e.appleical && null != e.appleical.text && (z = e.appleical.text), null != e.facebook && null != e.facebook.text && ($ = e.facebook.text), null != e.dropdown && null != e.dropdown.order && (f = e.dropdown.order)
        },
        keyboard: function (e, t) {
            var a = document.getElementById(t.id + "-drop");
            if (a && "block" == addeventatc.getstyle(a, "display")) {
                for (var n = a.getElementsByTagName("SPAN"), o = null, d = 0, c = 0, i = 0; i < n.length; i += 1) d++ , addeventatc.hasclass(n[i], "drop_markup") && (o = n[i], c = d);
                null === o ? c = 1 : "down" == t.key ? d <= c ? c = 1 : c++ : 1 == c ? c = d : c--;
                for (i = d = 0; i < n.length; i += 1)
                    if (++d == c) n[i].className += " drop_markup";
                    else {
                        var r = new RegExp("(\\s|^)drop_markup(\\s|$)");
                        n[i].className = n[i].className.replace(r, " "), n[i].className = n[i].className.replace(/\s+$/, "")
                    }
            }
        },
        keyboardclick: function (e, t) {
            var a = document.getElementById(t.id + "-drop");
            if (a) {
                for (var n = a.getElementsByTagName("SPAN"), o = null, d = 0; d < n.length; d += 1) addeventatc.hasclass(n[d], "drop_markup") && (o = n[d]);
                if (null !== o) {
                    o.click();
                    for (d = 0; d < n.length; d += 1) {
                        var c = new RegExp("(\\s|^)drop_markup(\\s|$)");
                        n[d].className = n[d].className.replace(c, " "), n[d].className = n[d].className.replace(/\s+$/, "")
                    }
                }
            }
        },
        usewebcal: function () {
            var e = !1,
                t = window.navigator.userAgent.toLowerCase(),
                a = /CriOS/i.test(navigator.userAgent),
                n = /instagram/.test(t),
                o = /iphone|ipod|ipad/.test(t),
                d = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
            return (o && d || o && a || o && n) && (e = !0), e
        },
        agent: function () {
            var e = navigator.userAgent || navigator.vendor || window.opera;
            return /windows phone/i.test(e) ? "windows_phone" : /android/i.test(e) ? "android" : /iPad|iPhone|iPod/.test(e) && !window.MSStream ? "ios" : "unknown"
        }
    }
}();
! function (e, t) {
    "use strict";
    e = e || "docReady", t = t || window;
    var a = [],
        n = !1,
        o = !1;

    function d() {
        if (!n) {
            n = !0;
            for (var e = 0; e < a.length; e++) a[e].fn.call(window, a[e].ctx);
            a = []
        }
    }

    function c() {
        "complete" === document.readyState && d()
    }
    t[e] = function (e, t) {
        if ("function" != typeof e) throw new TypeError("callback for docReady(fn) must be a function");
        n ? setTimeout(function () {
            e(t)
        }, 1) : (a.push(
            {
                fn: e,
                ctx: t
            }), "complete" === document.readyState || !document.attachEvent && "interactive" === document.readyState ? setTimeout(d, 1) : o || (document.addEventListener ? (document.addEventListener("DOMContentLoaded", d, !1), window.addEventListener("load", d, !1)) : (document.attachEvent("onreadystatechange", c), window.attachEvent("onload", d)), o = !0))
    }
}("addeventReady", window);
var ate_touch_capable = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch || 0 < navigator.maxTouchPoints || 0 < window.navigator.msMaxTouchPoints;
window.addEventListener ? (document.addEventListener("click", addeventatc.documentclick, !1), ate_touch_capable && document.addEventListener("touchend", addeventatc.documentclick, !1)) : window.attachEvent ? (document.attachEvent("onclick", addeventatc.documentclick), ate_touch_capable && document.attachEvent("ontouchend", addeventatc.documentclick)) : document.onclick = function () {
    addeventatc.documentclick(event)
}, addeventReady(function () {
    addeventatc.initialize(), setTimeout("addeventatc.initialize();", 200)
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwYXJ0aWFscy9hZGR0b2NhbGVuZGFyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uICRkKGUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZSlcbn1cbnZhciBhZGRldmVudGF0YyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSwgdSwgdiwgciwgdCwgZSA9ICExLFxuICAgICAgICBsID0gMSxcbiAgICAgICAgcyA9ICExLFxuICAgICAgICBwID0gITAsXG4gICAgICAgIG0gPSAhMSxcbiAgICAgICAgZyA9ICExLFxuICAgICAgICBoID0gITEsXG4gICAgICAgIF8gPSAxLFxuICAgICAgICBmID0gXCJcIixcbiAgICAgICAgYiA9ICEwLFxuICAgICAgICB3ID0gITAsXG4gICAgICAgIHggPSAhMCxcbiAgICAgICAgayA9ICEwLFxuICAgICAgICB5ID0gITAsXG4gICAgICAgIFQgPSAhMCxcbiAgICAgICAgLy8geiA9IFwiQXBwbGUgQ2FsZW5kYXJcIixcbiAgICAgICAgLy8gRSA9IFwiR29vZ2xlIDxlbT4ob25saW5lKTwvZW0+XCIsXG4gICAgICAgIC8vIE4gPSBcIk91dGxvb2tcIixcbiAgICAgICAgLy8gQyA9IFwiT3V0bG9vay5jb20gPGVtPihvbmxpbmUpPC9lbT5cIixcbiAgICAgICAgLy8gSSA9IFwiWWFob28gPGVtPihvbmxpbmUpPC9lbT5cIixcbiAgICAgICAgLy8gJCA9IFwiRmFjZWJvb2sgRXZlbnRcIixcbiAgICAgICAgeiA9IFwiQXBwbGUgQ2FsZW5kYXIgPGVtPiguaWNzKTwvZW0+XCIsXG4gICAgICAgIEUgPSBcIkdvb2dsZSA8ZW0+KG9ubGluZSk8L2VtPlwiLFxuICAgICAgICBOID0gXCJPdXRsb29rIDxlbT4oLmljcyk8L2VtPlwiLFxuICAgICAgICBDID0gXCJPdXRsb29rLmNvbSA8ZW0+KG9ubGluZSk8L2VtPlwiLFxuICAgICAgICBJID0gXCJZYWhvbyA8ZW0+KG9ubGluZSk8L2VtPlwiLFxuICAgICAgICAkID0gXCJGYWNlYm9vayBFdmVudFwiLFxuICAgICAgICBBID0gbnVsbCxcbiAgICAgICAgTCA9IG51bGwsXG4gICAgICAgIG4gPSBudWxsLFxuICAgICAgICBIID0gbnVsbCxcbiAgICAgICAgUiA9IG51bGwsXG4gICAgICAgIE0gPSBudWxsLFxuICAgICAgICBTID0gITE7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFlKSB7XG4gICAgICAgICAgICAgICAgZSA9ICEwO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGV2ZW50YXN5bmMoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkgeyB9XG4gICAgICAgICAgICAgICAgXCJodHRwczpcIiwgXCJhZGRldmVudC5jb21cIiwgXCJodHRwczovL2FkZGV2ZW50LmNvbVwiLCBhID0gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgU1ZHUmVjdCA/IFwiaHR0cHM6Ly93d3cuYWRkZXZlbnQuY29tL2dmeC9pY29uLWNhbGVuZGFyLXQxLnN2Z1wiIDogXCJodHRwczovL3d3dy5hZGRldmVudC5jb20vZ2Z4L2ljb24tY2FsZW5kYXItdDUucG5nXCIsIGFkZGV2ZW50YXRjLnRyeWNzcygpLCBhZGRldmVudGF0Yy5nZW5lcmF0ZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdlbmVyYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpLCBpID0gMDsgaSA8IGMubGVuZ3RoOyBpICs9IDEpIGFkZGV2ZW50YXRjLmhhc2NsYXNzKGNbaV0sIFwiYWRkZXZlbnRhdGNcIikgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhID0gXCJhZGRldmVudGF0Y1wiICsgbDtcbiAgICAgICAgICAgICAgICBjW2ldLmlkID0gYSwgY1tpXS50aXRsZSA9IFwiXCIsIGNbaV0uc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiLCBjW2ldLnNldEF0dHJpYnV0ZShcImFyaWEtaGFzcG9wdXBcIiwgXCJ0cnVlXCIpLCBjW2ldLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKSwgY1tpXS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjBcIiksIHMgPyAoY1tpXS5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gITFcbiAgICAgICAgICAgICAgICB9LCBjW2ldLm9ubW91c2VvdmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQociksIGFkZGV2ZW50YXRjLnRvb2dsZSh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibW91c2VvdmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSwgY1tpXS5vbm1vdXNlb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRldmVudGF0Yy5tb3VzZW91dCh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtb3VzZW91dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMClcbiAgICAgICAgICAgICAgICB9KSA6IChjW2ldLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhZGRldmVudGF0Yy50b29nbGUodGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLCAhMVxuICAgICAgICAgICAgICAgIH0sIGNbaV0ub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7IH0sIGNbaV0ub25tb3VzZW91dCA9IGZ1bmN0aW9uICgpIHsgfSksIGNbaV0ub25rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcbiAgICAgICAgICAgICAgICAgICAgXCIxM1wiICE9IHQgJiYgXCIzMlwiICE9IHQgJiYgXCIyN1wiICE9IHQgJiYgXCIzOFwiICE9IHQgJiYgXCI0MFwiICE9IHQgfHwgZS5wcmV2ZW50RGVmYXVsdCgpLCBcIjEzXCIgIT0gdCAmJiBcIjMyXCIgIT0gdCB8fCAoYWRkZXZlbnRhdGMua2V5Ym9hcmRjbGljayh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogYVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksIGFkZGV2ZW50YXRjLnRvb2dsZSh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogYSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5bmF2OiAhMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSwgXCIyN1wiID09IHQgJiYgYWRkZXZlbnRhdGMuaGlkZWFuZHJlc2V0KCksIFwiMzhcIiA9PSB0ICYmIGFkZGV2ZW50YXRjLmtleWJvYXJkKHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwia2V5Ym9hcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcInVwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksIFwiNDBcIiA9PSB0ICYmIGFkZGV2ZW50YXRjLmtleWJvYXJkKHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJrZXlib2FyZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJkb3duXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLCBTID0gITBcbiAgICAgICAgICAgICAgICB9LCBjW2ldLm9uYmx1ciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgUyAmJiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGV2ZW50YXRjLmhpZGVhbmRyZXNldCgpXG4gICAgICAgICAgICAgICAgICAgIH0sIDMwMClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBlID0gY1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoXCJub25lXCIgIT0gY1tpXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0eWxpbmdcIikgJiYgXCJpbmxpbmUtYnV0dG9uc1wiICE9IGNbaV0uZ2V0QXR0cmlidXRlKFwiZGF0YS1yZW5kZXJcIikgfHwgKHAgPSAhMSksIHApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICAgICAgdC5jbGFzc05hbWUgPSBcImFkZGV2ZW50YXRjX2ljb25cIiwgZS5hcHBlbmRDaGlsZCh0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsKysgLCBtID0gITA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbiA9IGNbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpLCBvID0gMDsgbyA8IG4ubGVuZ3RoOyBvICs9IDEpIGFkZGV2ZW50YXRjLmhhc2NsYXNzKG5bb10sIFwiYXRjX25vZGVcIikgfHwgKFwiXCIgIT0gbltvXS5jbGFzc05hbWUgPyBuW29dLmNsYXNzTmFtZSArPSBcIiBhdGNfbm9kZVwiIDogbltvXS5jbGFzc05hbWUgKz0gXCJhdGNfbm9kZVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoXCJpbmxpbmUtYnV0dG9uc1wiID09IGNbaV0uZ2V0QXR0cmlidXRlKFwiZGF0YS1yZW5kZXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY1tpXS5vbmNsaWNrID0gZnVuY3Rpb24gKCkgeyB9LCBhZGRldmVudGF0Yy50b29nbGUoY1tpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInJlbmRlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSwgY1tpXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiKSwgY1tpXS5yZW1vdmVBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKSwgY1tpXS5vbmtleWRvd24gPSBmdW5jdGlvbiAoKSB7IH0sIGNbaV0uYmx1ciA9IGZ1bmN0aW9uICgpIHsgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhICsgXCItZHJvcFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobiA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJTUEFOXCIpLCBvID0gMDsgbyA8IG4ubGVuZ3RoOyBvICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuW29dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5bb10udGFiSW5kZXggPSBcIjBcIiwgbltvXS5vbmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjEzXCIgIT0gdCAmJiBcIjMyXCIgIT0gdCB8fCBlLnRhcmdldC5jbGljaygpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSgpO1xuICAgICAgICAgICAgXyA9IGFkZGV2ZW50YXRjLnRvcHppbmRleCgpLCBwID8gYWRkZXZlbnRhdGMuYXBwbHljc3MoKSA6IChhZGRldmVudGF0Yy5yZW1vdmVlbGVtZW50KCRkKFwiYXRlX2Nzc1wiKSksIGFkZGV2ZW50YXRjLnJlbW92ZWVsZW1lbnQoJGQoXCJhdGVfdG1wX2Nzc1wiKSksIGFkZGV2ZW50YXRjLmhlbHBlcmNzcygpKSwgbSAmJiAhZyAmJiAoZyA9ICEwLCBhZGRldmVudGF0Yy50cmFjayhcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cDogXCJleHBvc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICBjYWw6IFwiXCJcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgfSxcbiAgICAgICAgdG9vZ2xlOiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICAgICAgdmFyIGEsIG4sIG8sIGQgPSAhMSxcbiAgICAgICAgICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChuID0gJGQoYSA9IGUuaWQpKSB7XG4gICAgICAgICAgICAgICAgbyA9IG4uZ2V0QXR0cmlidXRlKFwiZGF0YS1kaXJlY3RcIik7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBuLmdldEF0dHJpYnV0ZShcImRhdGEtaW50ZWxcIiksXG4gICAgICAgICAgICAgICAgICAgIHIgPSBuLmdldEF0dHJpYnV0ZShcImRhdGEtaW50ZWwtYXBwbGVcIik7XG4gICAgICAgICAgICAgICAgaWYgKFwiaW9zXCIgPT0gYWRkZXZlbnRhdGMuYWdlbnQoKSAmJiBcImNsaWNrXCIgPT0gdC50eXBlICYmIFwidHJ1ZVwiICE9PSByICYmIFwiZmFsc2VcIiAhPT0gaSAmJiAobyA9IFwiYXBwbGVpY2FsXCIsIG4uc2V0QXR0cmlidXRlKFwiZGF0YS1pbnRlbC1hcHBsZVwiLCBcInRydWVcIikpLCBcIm91dGxvb2tcIiA9PSBvIHx8IFwiZ29vZ2xlXCIgPT0gbyB8fCBcInlhaG9vXCIgPT0gbyB8fCBcImhvdG1haWxcIiA9PSBvIHx8IFwib3V0bG9va2NvbVwiID09IG8gfHwgXCJhcHBsZWljYWxcIiA9PSBvIHx8IFwiYXBwbGVcIiA9PSBvIHx8IFwiZmFjZWJvb2tcIiA9PSBvKSBcImNsaWNrXCIgPT0gdC50eXBlICYmIChhZGRldmVudGF0Yy5jbGljayhcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uOiBhLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZTogbyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkXG4gICAgICAgICAgICAgICAgICAgIH0pLCBudWxsICE9IEEgJiYgYWRkZXZlbnRhdGMudHJpZ2dlcihcImJ1dHRvbl9jbGlja1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoXCJtb3VzZW92ZXJcIiA9PSB0LnR5cGUgJiYgdiAhPSBuICYmIChoID0gITEpLCBcImNsaWNrXCIgPT0gdC50eXBlIHx8IFwicmVuZGVyXCIgPT0gdC50eXBlIHx8IFwibW91c2VvdmVyXCIgPT0gdC50eXBlICYmICFoKSB7XG4gICAgICAgICAgICAgICAgICAgIFwibW91c2VvdmVyXCIgPT0gdC50eXBlICYmIChoID0gITAsIG51bGwgIT0gTCAmJiBhZGRldmVudGF0Yy50cmlnZ2VyKFwiYnV0dG9uX21vdXNlb3ZlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSksIGQgPSBhZGRldmVudGF0Yy5nZXRidXJsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY2Vib29rOiAhMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLCBcIlwiID09IGYgJiYgKGYgPSBcImFwcGxlaWNhbCxnb29nbGUsb3V0bG9vayxvdXRsb29rY29tLHlhaG9vLGZhY2Vib29rXCIpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBsID0gKGYgPSAoZiArPSBcIixcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8gL2dpLCBcIlwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIixcIiksIHMgPSAwOyBzIDwgbC5sZW5ndGg7IHMgKz0gMSkoYiAmJiBcImljYWxcIiA9PSBsW3NdIHx8IGIgJiYgXCJhcHBsZWljYWxcIiA9PSBsW3NdKSAmJiAoYyArPSAnPHNwYW4gY2xhc3M9XCJhdGVhcHBsZWljYWxcIiBpZD1cIicgKyBhICsgJy1hcHBsZWljYWxcIiByb2xlPVwibWVudWl0ZW1cIj4nICsgeiArIFwiPC9zcGFuPlwiKSwgdyAmJiBcImdvb2dsZVwiID09IGxbc10gJiYgKGMgKz0gJzxzcGFuIGNsYXNzPVwiYXRlZ29vZ2xlXCIgaWQ9XCInICsgYSArICctZ29vZ2xlXCIgcm9sZT1cIm1lbnVpdGVtXCI+JyArIEUgKyBcIjwvc3Bhbj5cIiksIHggJiYgXCJvdXRsb29rXCIgPT0gbFtzXSAmJiAoYyArPSAnPHNwYW4gY2xhc3M9XCJhdGVvdXRsb29rXCIgaWQ9XCInICsgYSArICctb3V0bG9va1wiIHJvbGU9XCJtZW51aXRlbVwiPicgKyBOICsgXCI8L3NwYW4+XCIpLCAoayAmJiBcImhvdG1haWxcIiA9PSBsW3NdIHx8IGsgJiYgXCJvdXRsb29rY29tXCIgPT0gbFtzXSkgJiYgKGMgKz0gJzxzcGFuIGNsYXNzPVwiYXRlb3V0bG9va2NvbVwiIGlkPVwiJyArIGEgKyAnLW91dGxvb2tjb21cIiByb2xlPVwibWVudWl0ZW1cIj4nICsgQyArIFwiPC9zcGFuPlwiKSwgeSAmJiBcInlhaG9vXCIgPT0gbFtzXSAmJiAoYyArPSAnPHNwYW4gY2xhc3M9XCJhdGV5YWhvb1wiIGlkPVwiJyArIGEgKyAnLXlhaG9vXCIgcm9sZT1cIm1lbnVpdGVtXCI+JyArIEkgKyBcIjwvc3Bhbj5cIiksIGQgJiYgXCJmYWNlYm9va1wiID09IGxbc10gJiYgVCAmJiBcImZhY2Vib29rXCIgPT0gbFtzXSAmJiAoYyArPSAnPHNwYW4gY2xhc3M9XCJhdGVmYWNlYm9va1wiIGlkPVwiJyArIGEgKyAnLWZhY2Vib29rXCIgcm9sZT1cIm1lbnVpdGVtXCI+JyArICQgKyBcIjwvc3Bhbj5cIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhZGRldmVudGF0Yy5nZXRsaWNlbnNlKHUpIHx8IChjICs9ICc8ZW0gY2xhc3M9XCJjb3B5eFwiPjxlbSBjbGFzcz1cImJyeFwiPjwvZW0+PGVtIGNsYXNzPVwiZnJzXCI+PGEgaHJlZj1cImh0dHBzOi8vd3d3LmFkZGV2ZW50LmNvbVwiIHRpdGxlPVwiXCIgdGFiaW5kZXg9XCItMVwiIGlkPVwiJyArIGEgKyAnLWhvbWVcIj5BZGRFdmVudC5jb208L2E+PC9lbT48L2VtPicpLCAhJGQoYSArIFwiLWRyb3BcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwLmlkID0gYSArIFwiLWRyb3BcIiwgcC5jbGFzc05hbWUgPSBcImFkZGV2ZW50YXRjX2Ryb3Bkb3duXCIsIHAuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpLCBwLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxsZWRieVwiLCBhKSwgcC5pbm5lckhUTUwgPSBjLCBuLmFwcGVuZENoaWxkKHApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJGQoYSArIFwiLWFwcGxlaWNhbFwiKSAmJiAoJGQoYSArIFwiLWFwcGxlaWNhbFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZXZlbnRhdGMuY2xpY2soXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbjogYSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2U6IFwiYXBwbGVpY2FsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksICRkKGEgKyBcIi1nb29nbGVcIikgJiYgKCRkKGEgKyBcIi1nb29nbGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZXZlbnRhdGMuY2xpY2soXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uOiBhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2U6IFwiZ29vZ2xlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksICRkKGEgKyBcIi1vdXRsb29rXCIpICYmICgkZChhICsgXCItb3V0bG9va1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGV2ZW50YXRjLmNsaWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uOiBhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlOiBcIm91dGxvb2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSwgJGQoYSArIFwiLW91dGxvb2tjb21cIikgJiYgKCRkKGEgKyBcIi1vdXRsb29rY29tXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRldmVudGF0Yy5jbGljayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uOiBhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZTogXCJvdXRsb29rY29tXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksICRkKGEgKyBcIi15YWhvb1wiKSAmJiAoJGQoYSArIFwiLXlhaG9vXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGV2ZW50YXRjLmNsaWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbjogYSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlOiBcInlhaG9vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksICRkKGEgKyBcIi1mYWNlYm9va1wiKSAmJiAoJGQoYSArIFwiLWZhY2Vib29rXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZXZlbnRhdGMuY2xpY2soXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b246IGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2U6IFwiZmFjZWJvb2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSwgJGQoYSArIFwiLWhvbWVcIikgJiYgKCRkKGEgKyBcIi1ob21lXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRldmVudGF0Yy5jbGljayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uOiBhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZTogXCJob21lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksIGFkZGV2ZW50YXRjLnNob3coYSwgdClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPSBuLCAhMVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciB0LCBhLCBuLCBvID0gbG9jYXRpb24ub3JpZ2luLFxuICAgICAgICAgICAgICAgIGQgPSAhMDtcbiAgICAgICAgICAgIGlmICh2b2lkIDAgPT09IGxvY2F0aW9uLm9yaWdpbiAmJiAobyA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdCksIHQgPSAkZChlLmJ1dHRvbikpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJob21lXCIgPT0gZS5zZXJ2aWNlKSBuID0gXCJodHRwczovL3d3dy5hZGRldmVudC5jb21cIjtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYSA9IGFkZGV2ZW50YXRjLmdldGJ1cmwoXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGUuYnV0dG9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY2Vib29rOiAhMVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksIG4gPSBcImh0dHBzOi8vd3d3LmFkZGV2ZW50LmNvbS9jcmVhdGUvP3NlcnZpY2U9XCIgKyBlLnNlcnZpY2UgKyBhICsgXCImcmVmZXJlbmNlPVwiICsgbywgXCJvdXRsb29rXCIgIT0gZS5zZXJ2aWNlICYmIFwiYXBwbGVpY2FsXCIgIT0gZS5zZXJ2aWNlIHx8IChkID0gITEsIGFkZGV2ZW50YXRjLnVzZXdlYmNhbCgpICYmIChuID0gXCJ3ZWJjYWw6Ly93d3cuYWRkZXZlbnQuY29tL2NyZWF0ZS8/dXdjPW9uJnNlcnZpY2U9XCIgKyBlLnNlcnZpY2UgKyBhICsgXCImcmVmZXJlbmNlPVwiICsgbykpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IHQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgbnVsbCAhPT0gYyAmJiAobiA9IFwiaHR0cHM6Ly93d3cuYWRkZXZlbnQuY29tL2V2ZW50L1wiICsgYyArIFwiK1wiICsgZS5zZXJ2aWNlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoISRkKFwiYXRlY2xsaW5rXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAgICAgICAgIGkuaWQgPSBcImF0ZWNsbGlua1wiLCBpLnJlbCA9IFwiZXh0ZXJuYWxcIiwgaS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXJvbGVcIiwgXCJub25lXCIpLCBpLmlubmVySFRNTCA9IFwie2FkZGV2ZW50YXRjLWdob3N0LWxpbmt9XCIsIGkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiLCBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByID0gJGQoXCJhdGVjbGxpbmtcIik7XG4gICAgICAgICAgICAgICAgaWYgKHIudGFyZ2V0ID0gZCA/IFwiX2JsYW5rXCIgOiBcIl9zZWxmXCIsIHIuaHJlZiA9IG4sIGFkZGV2ZW50YXRjLmVjbGljayhcImF0ZWNsbGlua1wiKSwgYWRkZXZlbnRhdGMudHJhY2soXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cDogXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsOiBlLnNlcnZpY2VcbiAgICAgICAgICAgICAgICAgICAgfSksIG51bGwgIT0gTSkge1xuICAgICAgICAgICAgICAgICAgICBhZGRldmVudGF0Yy50cmlnZ2VyKFwiYnV0dG9uX2Ryb3Bkb3duX2NsaWNrXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGUuYnV0dG9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2U6IGUuc2VydmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZXZlbnQgfHwgd2luZG93LmV2ZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vdXNlb3V0OiBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICAgICAgaCA9ICExLCBhZGRldmVudGF0Yy5oaWRlYW5kcmVzZXQoKSwgbnVsbCAhPSBuICYmIGFkZGV2ZW50YXRjLnRyaWdnZXIoXCJidXR0b25fbW91c2VvdXRcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgc2hvdzogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgICAgIHZhciBhID0gJGQoZSksXG4gICAgICAgICAgICAgICAgbiA9ICRkKGUgKyBcIi1kcm9wXCIpO1xuICAgICAgICAgICAgaWYgKGEgJiYgbilcbiAgICAgICAgICAgICAgICBpZiAoXCJibG9ja1wiID09IGFkZGV2ZW50YXRjLmdldHN0eWxlKG4sIFwiZGlzcGxheVwiKSkgYWRkZXZlbnRhdGMuaGlkZWFuZHJlc2V0KCk7XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGV2ZW50YXRjLmhpZGVhbmRyZXNldCghMCksIG4uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIiwgYS5zdHlsZS5vdXRsaW5lID0gXCIwXCIsIGEuc3R5bGUuekluZGV4ID0gXyArIDEsIGEuY2xhc3NOYW1lID0gYS5jbGFzc05hbWUgKyBcIiBhZGRldmVudGF0Yy1zZWxlY3RlZFwiLCBhLmNsYXNzTmFtZSA9IGEuY2xhc3NOYW1lLnJlcGxhY2UoL1xccysvZywgXCIgXCIpLCBhLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJ0cnVlXCIpLCBuLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwiZmFsc2VcIiksIHQua2V5bmF2ICYmIGFkZGV2ZW50YXRjLmtleWJvYXJkKHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJrZXlib2FyZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJkb3duXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IGEuZ2V0QXR0cmlidXRlKFwiZGF0YS1kcm9wZG93bi14XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZCA9IGEuZ2V0QXR0cmlidXRlKFwiZGF0YS1kcm9wZG93bi15XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IFwiYXV0b1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgICAgICAgICBudWxsICE9IG8gJiYgKGkgPSBvKSwgbnVsbCAhPSBkICYmIChjID0gZCksIG4uc3R5bGUubGVmdCA9IFwiMHB4XCIsIG4uc3R5bGUudG9wID0gXCIwcHhcIiwgbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgciA9IHBhcnNlSW50KGEub2Zmc2V0SGVpZ2h0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGwgPSBwYXJzZUludChhLm9mZnNldFdpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgPSBwYXJzZUludChuLm9mZnNldEhlaWdodCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwID0gcGFyc2VJbnQobi5vZmZzZXRXaWR0aCksXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0gYWRkZXZlbnRhdGMudmlld3BvcnQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBwYXJzZUludCh1LncpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbSA9IHBhcnNlSW50KHUuaCksXG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gcGFyc2VJbnQodS54KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGggPSBwYXJzZUludCh1LnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IGFkZGV2ZW50YXRjLmVsZW1lbnRwb3NpdGlvbihuKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBwYXJzZUludChmLngpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdyA9IHBhcnNlSW50KGYueSkgKyBzLFxuICAgICAgICAgICAgICAgICAgICAgICAgeCA9IG0gKyBoLFxuICAgICAgICAgICAgICAgICAgICAgICAgayA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgXCJkb3duXCIgPT0gYyAmJiBcImxlZnRcIiA9PSBpID8gKGsgPSBcIjBweFwiLCB5ID0gciArIFwicHhcIikgOiBcInVwXCIgPT0gYyAmJiBcImxlZnRcIiA9PSBpID8gKGsgPSBcIjBweFwiLCB5ID0gLXMgKyBcInB4XCIpIDogXCJkb3duXCIgPT0gYyAmJiBcInJpZ2h0XCIgPT0gaSA/IChrID0gLShwIC0gbCkgKyBcInB4XCIsIHkgPSByICsgXCJweFwiKSA6IFwidXBcIiA9PSBjICYmIFwicmlnaHRcIiA9PSBpID8gKGsgPSAtKHAgLSBsKSArIFwicHhcIiwgeSA9IC1zICsgXCJweFwiKSA6IFwiYXV0b1wiID09IGMgJiYgXCJsZWZ0XCIgPT0gaSA/IChrID0gXCIwcHhcIiwgeSA9IHggPCB3ID8gLXMgKyBcInB4XCIgOiByICsgXCJweFwiKSA6IFwiYXV0b1wiID09IGMgJiYgXCJyaWdodFwiID09IGkgPyAoayA9IC0ocCAtIGwpICsgXCJweFwiLCB5ID0geCA8IHcgPyAtcyArIFwicHhcIiA6IHIgKyBcInB4XCIpIDogKHkgPSB4IDwgdyA/IC1zICsgXCJweFwiIDogciArIFwicHhcIiwgayA9IHYgKyBnIDwgYiArIHAgPyAtKHAgLSBsKSArIFwicHhcIiA6IFwiMHB4XCIpLCBuLnN0eWxlLmxlZnQgPSBrLCBuLnN0eWxlLnRvcCA9IHksIFwiY2xpY2tcIiA9PSB0LnR5cGUgJiYgbnVsbCAhPSBBICYmIGFkZGV2ZW50YXRjLnRyaWdnZXIoXCJidXR0b25fY2xpY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksIG51bGwgIT0gSCAmJiBhZGRldmVudGF0Yy50cmlnZ2VyKFwiYnV0dG9uX2Ryb3Bkb3duX3Nob3dcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgdCA9ICExO1xuICAgICAgICAgICAgKFwic3RyaW5nXCIgPT0gdHlwZW9mIGUgJiYgXCJcIiAhPT0gZSB8fCBlIGluc3RhbmNlb2YgU3RyaW5nICYmIFwiXCIgIT09IGUpICYmICgtMSA8IGUuaW5kZXhPZihcImFkZGV2ZW50YXRjXCIpIHx8IC0xIDwgZS5pbmRleE9mKFwiYXRjX25vZGVcIikpICYmICh0ID0gITApLCB0IHx8IGFkZGV2ZW50YXRjLmhpZGVhbmRyZXNldCgpXG4gICAgICAgIH0sXG4gICAgICAgIGhpZGVhbmRyZXNldDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHQgPSBcIlwiLCBhID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpLCBuID0gMDsgbiA8IGEubGVuZ3RoOyBuICs9IDEpXG4gICAgICAgICAgICAgICAgaWYgKGFkZGV2ZW50YXRjLmhhc2NsYXNzKGFbbl0sIFwiYWRkZXZlbnRhdGNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgYVtuXS5jbGFzc05hbWUgPSBhW25dLmNsYXNzTmFtZS5yZXBsYWNlKC9hZGRldmVudGF0Yy1zZWxlY3RlZC9naSwgXCJcIiksIGFbbl0uY2xhc3NOYW1lID0gYVtuXS5jbGFzc05hbWUucmVwbGFjZSgvXFxzKyQvLCBcIlwiKSwgYVtuXS5zdHlsZS56SW5kZXggPSBcImF1dG9cIiwgYVtuXS5zdHlsZS5vdXRsaW5lID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSAkZChhW25dLmlkICsgXCItZHJvcFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gYWRkZXZlbnRhdGMuZ2V0c3R5bGUobywgXCJkaXNwbGF5XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJibG9ja1wiID09IGQgJiYgKHQgPSBhW25dLmlkKSwgby5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIsIFwiYmxvY2tcIiAhPT0gKGQgPSBhZGRldmVudGF0Yy5nZXRzdHlsZShvLCBcImRpc3BsYXlcIikpICYmIChhW25dLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKSwgby5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgYyA9IG8uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJTUEFOXCIpLCBpID0gMDsgaSA8IGMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAoXCIoXFxcXHN8Xilkcm9wX21hcmt1cChcXFxcc3wkKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjW2ldLmNsYXNzTmFtZSA9IGNbaV0uY2xhc3NOYW1lLnJlcGxhY2UociwgXCIgXCIpLCBjW2ldLmNsYXNzTmFtZSA9IGNbaV0uY2xhc3NOYW1lLnJlcGxhY2UoL1xccyskLywgXCJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGUgfHwgbnVsbCAhPSBSICYmIGFkZGV2ZW50YXRjLnRyaWdnZXIoXCJidXR0b25fZHJvcGRvd25faGlkZVwiLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRidXJsOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIHQgPSAkZChlLmlkKSxcbiAgICAgICAgICAgICAgICBhID0gXCJcIixcbiAgICAgICAgICAgICAgICBuID0gITE7XG4gICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG8gPSB0LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSwgZCA9IDA7IGQgPCBvLmxlbmd0aDsgZCArPSAxKShhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcIl9zdGFydFwiKSB8fCBhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcInN0YXJ0XCIpKSAmJiAoYSArPSBcIiZkc3RhcnQ9XCIgKyBlbmNvZGVVUklDb21wb25lbnQob1tkXS5pbm5lckhUTUwpKSwgKGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwiX2VuZFwiKSB8fCBhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcImVuZFwiKSkgJiYgKGEgKz0gXCImZGVuZD1cIiArIGVuY29kZVVSSUNvbXBvbmVudChvW2RdLmlubmVySFRNTCkpLCAoYWRkZXZlbnRhdGMuaGFzY2xhc3Mob1tkXSwgXCJfem9uZWNvZGVcIikgfHwgYWRkZXZlbnRhdGMuaGFzY2xhc3Mob1tkXSwgXCJ6b25lY29kZVwiKSkgJiYgKGEgKz0gXCImZHpvbmU9XCIgKyBlbmNvZGVVUklDb21wb25lbnQob1tkXS5pbm5lckhUTUwpKSwgKGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwiX3RpbWV6b25lXCIpIHx8IGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwidGltZXpvbmVcIikpICYmIChhICs9IFwiJmR0aW1lPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9bZF0uaW5uZXJIVE1MKSksIChhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcIl9zdW1tYXJ5XCIpIHx8IGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwic3VtbWFyeVwiKSB8fCBhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcInRpdGxlXCIpKSAmJiAoYSArPSBcIiZkc3VtPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9bZF0uaW5uZXJIVE1MKSksIChhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcIl9kZXNjcmlwdGlvblwiKSB8fCBhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcImRlc2NyaXB0aW9uXCIpKSAmJiAoYSArPSBcIiZkZGVzYz1cIiArIGVuY29kZVVSSUNvbXBvbmVudChvW2RdLmlubmVySFRNTCkpLCAoYWRkZXZlbnRhdGMuaGFzY2xhc3Mob1tkXSwgXCJfbG9jYXRpb25cIikgfHwgYWRkZXZlbnRhdGMuaGFzY2xhc3Mob1tkXSwgXCJsb2NhdGlvblwiKSkgJiYgKGEgKz0gXCImZGxvY2E9XCIgKyBlbmNvZGVVUklDb21wb25lbnQob1tkXS5pbm5lckhUTUwpKSwgKGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwiX29yZ2FuaXplclwiKSB8fCBhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcIm9yZ2FuaXplclwiKSkgJiYgKGEgKz0gXCImZG9yZ2E9XCIgKyBlbmNvZGVVUklDb21wb25lbnQob1tkXS5pbm5lckhUTUwpKSwgKGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwiX29yZ2FuaXplcl9lbWFpbFwiKSB8fCBhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcIm9yZ2FuaXplcl9lbWFpbFwiKSkgJiYgKGEgKz0gXCImZG9yZ2FlbT1cIiArIGVuY29kZVVSSUNvbXBvbmVudChvW2RdLmlubmVySFRNTCkpLCAoYWRkZXZlbnRhdGMuaGFzY2xhc3Mob1tkXSwgXCJfYXR0ZW5kZWVzXCIpIHx8IGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwiYXR0ZW5kZWVzXCIpKSAmJiAoYSArPSBcIiZkYXR0ZT1cIiArIGVuY29kZVVSSUNvbXBvbmVudChvW2RdLmlubmVySFRNTCkpLCAoYWRkZXZlbnRhdGMuaGFzY2xhc3Mob1tkXSwgXCJfYWxsX2RheV9ldmVudFwiKSB8fCBhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcImFsbF9kYXlfZXZlbnRcIikpICYmIChhICs9IFwiJmRhbGxkYXk9XCIgKyBlbmNvZGVVUklDb21wb25lbnQob1tkXS5pbm5lckhUTUwpKSwgKGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwiX2RhdGVfZm9ybWF0XCIpIHx8IGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwiZGF0ZV9mb3JtYXRcIikpICYmIChhICs9IFwiJmRhdGVmb3JtYXQ9XCIgKyBlbmNvZGVVUklDb21wb25lbnQob1tkXS5pbm5lckhUTUwpKSwgKGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwiX2FsYXJtX3JlbWluZGVyXCIpIHx8IGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwiYWxhcm1fcmVtaW5kZXJcIikpICYmIChhICs9IFwiJmFsYXJtPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9bZF0uaW5uZXJIVE1MKSksIChhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcIl9yZWN1cnJpbmdcIikgfHwgYWRkZXZlbnRhdGMuaGFzY2xhc3Mob1tkXSwgXCJyZWN1cnJpbmdcIikpICYmIChhICs9IFwiJmRydWxlPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9bZF0uaW5uZXJIVE1MKSksIChhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcIl9mYWNlYm9va19ldmVudFwiKSB8fCBhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcImZhY2Vib29rX2V2ZW50XCIpKSAmJiAoYSArPSBcIiZmYmV2ZW50PVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9bZF0uaW5uZXJIVE1MKSwgbiA9ICEwKSwgKGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwiX2NsaWVudFwiKSB8fCBhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcImNsaWVudFwiKSkgJiYgKGEgKz0gXCImY2xpZW50PVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9bZF0uaW5uZXJIVE1MKSksIChhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcIl9jYWxuYW1lXCIpIHx8IGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwiY2FsbmFtZVwiKSkgJiYgKGEgKz0gXCImY2FsbmFtZT1cIiArIGVuY29kZVVSSUNvbXBvbmVudChvW2RdLmlubmVySFRNTCkpLCAoYWRkZXZlbnRhdGMuaGFzY2xhc3Mob1tkXSwgXCJfdWlkXCIpIHx8IGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwidWlkXCIpKSAmJiAoYSArPSBcIiZ1aWQ9XCIgKyBlbmNvZGVVUklDb21wb25lbnQob1tkXS5pbm5lckhUTUwpKSwgKGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwiX3N0YXR1c1wiKSB8fCBhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcInN0YXR1c1wiKSkgJiYgKGEgKz0gXCImc3RhdHVzPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9bZF0uaW5uZXJIVE1MKSksIChhZGRldmVudGF0Yy5oYXNjbGFzcyhvW2RdLCBcIl9tZXRob2RcIikgfHwgYWRkZXZlbnRhdGMuaGFzY2xhc3Mob1tkXSwgXCJtZXRob2RcIikpICYmIChhICs9IFwiJm1ldGhvZD1cIiArIGVuY29kZVVSSUNvbXBvbmVudChvW2RdLmlubmVySFRNTCkpLCAoYWRkZXZlbnRhdGMuaGFzY2xhc3Mob1tkXSwgXCJfdHJhbnNwXCIpIHx8IGFkZGV2ZW50YXRjLmhhc2NsYXNzKG9bZF0sIFwidHJhbnNwXCIpKSAmJiAoYSArPSBcIiZ0cmFuc3A9XCIgKyBlbmNvZGVVUklDb21wb25lbnQob1tkXS5pbm5lckhUTUwpKTtcbiAgICAgICAgICAgICAgICBcImZhbHNlXCIgPT0gdC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWdvb2dsZS1hcGlcIikgJiYgKGEgKz0gXCImZ2FwaT1mYWxzZVwiKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGUuZmFjZWJvb2sgJiYgKGEgPSBuKSwgYVxuICAgICAgICB9LFxuICAgICAgICB0cnljc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghJGQoXCJhdGVfdG1wX2Nzc1wiKSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgZSA9IFwiLmFkZGV2ZW50YXRjIHt2aXNpYmlsaXR5OmhpZGRlbjt9XCIsIGUgKz0gXCIuYWRkZXZlbnRhdGMgLmRhdGEge2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnQ7fVwiLCBlICs9IFwiLmFkZGV2ZW50YXRjIC5zdGFydCwgLmFkZGV2ZW50YXRjIC5lbmQsIC5hZGRldmVudGF0YyAudGltZXpvbmUsIC5hZGRldmVudGF0YyAudGl0bGUsIC5hZGRldmVudGF0YyAuZGVzY3JpcHRpb24sIC5hZGRldmVudGF0YyAubG9jYXRpb24sIC5hZGRldmVudGF0YyAub3JnYW5pemVyLCAuYWRkZXZlbnRhdGMgLm9yZ2FuaXplcl9lbWFpbCwgLmFkZGV2ZW50YXRjIC5mYWNlYm9va19ldmVudCwgLmFkZGV2ZW50YXRjIC5hbGxfZGF5X2V2ZW50LCAuYWRkZXZlbnRhdGMgLmRhdGVfZm9ybWF0LCAuYWRkZXZlbnRhdGMgLmFsYXJtX3JlbWluZGVyLCAuYWRkZXZlbnRhdGMgLnJlY3VycmluZywgLmFkZGV2ZW50YXRjIC5hdHRlbmRlZXMsIC5hZGRldmVudGF0YyAuY2xpZW50LCAuYWRkZXZlbnRhdGMgLmNhbG5hbWUsIC5hZGRldmVudGF0YyAudWlkLCAuYWRkZXZlbnRhdGMgLnN0YXR1cywgLmFkZGV2ZW50YXRjIC5tZXRob2QsIC5hZGRldmVudGF0YyAudHJhbnNwIHtkaXNwbGF5Om5vbmUhaW1wb3J0YW50O31cIiwgcCAmJiAoZSArPSBcIi5hZGRldmVudGF0YyB7YmFja2dyb3VuZC1pbWFnZTp1cmwoaHR0cHM6Ly93d3cuYWRkZXZlbnQuY29tL2dmeC9pY29uLWNhbGVuZGFyLXQ1LnBuZyksIHVybChodHRwczovL3d3dy5hZGRldmVudC5jb20vZ2Z4L2ljb24tY2FsZW5kYXItdDEuc3ZnKSwgdXJsKGh0dHBzOi8vd3d3LmFkZGV2ZW50LmNvbS9nZngvaWNvbi1hcHBsZS10MS5zdmcpLCB1cmwoaHR0cHM6Ly93d3cuYWRkZXZlbnQuY29tL2dmeC9pY29uLWZhY2Vib29rLXQxLnN2ZyksIHVybChodHRwczovL3d3dy5hZGRldmVudC5jb20vZ2Z4L2ljb24tZ29vZ2xlLXQxLnN2ZyksIHVybChodHRwczovL3d3dy5hZGRldmVudC5jb20vZ2Z4L2ljb24tb3V0bG9vay10MS5zdmcpLCB1cmwoaHR0cHM6Ly93d3cuYWRkZXZlbnQuY29tL2dmeC9pY29uLXlhaG9vLXQxLnN2Zyk7YmFja2dyb3VuZC1wb3NpdGlvbjotOTk5OXB4IC05OTk5cHg7YmFja2dyb3VuZC1yZXBlYXQ6bm8tcmVwZWF0O31cIik7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgICAgICAgICAgICAgICAgICB0LnR5cGUgPSBcInRleHQvY3NzXCIsIHQuaWQgPSBcImF0ZV90bXBfY3NzXCIsIHQuc3R5bGVTaGVldCA/IHQuc3R5bGVTaGVldC5jc3NUZXh0ID0gZSA6IHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZSkpLCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQodClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHsgfVxuICAgICAgICAgICAgICAgIGFkZGV2ZW50YXRjLnRyYWNrKFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXA6IFwianNpbml0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWw6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYXBwbHljc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghJGQoXCJhdGVfY3NzXCIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGUgKz0gJy5hZGRldmVudGF0YyB7ZGlzcGxheTppbmxpbmUtYmxvY2s7KmRpc3BsYXk6aW5saW5lO3pvb206MTtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjE7Zm9udC1mYW1pbHk6Um9ib3RvLFwiSGVsdmV0aWNhIE5ldWVcIixIZWx2ZXRpY2EsT3B0aW1hLFNlZ29lLFwiU2Vnb2UgVUlcIixDYW5kYXJhLENhbGlicmksQXJpYWwsc2Fucy1zZXJpZjtjb2xvcjojMDAwIWltcG9ydGFudDtmb250LXdlaWdodDozMDA7bGluZS1oZWlnaHQ6MTAwJSFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JvcmRlcjoxcHggc29saWQ7Ym9yZGVyLWNvbG9yOiNlNWU2ZTkgI2RmZTBlNCAjZDBkMWQ1O2ZvbnQtc2l6ZToxNXB4O3RleHQtZGVjb3JhdGlvbjpub25lO3BhZGRpbmc6MTNweCAxMnB4IDEycHggNDNweDstd2Via2l0LWJvcmRlci1yYWRpdXM6M3B4O2JvcmRlci1yYWRpdXM6M3B4O2N1cnNvcjpwb2ludGVyOy13ZWJraXQtZm9udC1zbW9vdGhpbmc6YW50aWFsaWFzZWQhaW1wb3J0YW50O3RleHQtc2hhZG93OjFweCAxcHggMXB4IHJnYmEoMCwwLDAsMC4wMDQpOy13ZWJraXQtdG91Y2gtY2FsbG91dDpub25lOy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTsta2h0bWwtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTstd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6cmdiYSgwLDAsMCwwKTtiYWNrZ3JvdW5kLWltYWdlOnVybChodHRwczovL3d3dy5hZGRldmVudC5jb20vZ2Z4L2ljb24tY2FsZW5kYXItdDUucG5nKSwgdXJsKGh0dHBzOi8vd3d3LmFkZGV2ZW50LmNvbS9nZngvaWNvbi1jYWxlbmRhci10MS5zdmcpLCB1cmwoaHR0cHM6Ly93d3cuYWRkZXZlbnQuY29tL2dmeC9pY29uLWFwcGxlLXQxLnN2ZyksIHVybChodHRwczovL3d3dy5hZGRldmVudC5jb20vZ2Z4L2ljb24tZmFjZWJvb2stdDEuc3ZnKSwgdXJsKGh0dHBzOi8vd3d3LmFkZGV2ZW50LmNvbS9nZngvaWNvbi1nb29nbGUtdDEuc3ZnKSwgdXJsKGh0dHBzOi8vd3d3LmFkZGV2ZW50LmNvbS9nZngvaWNvbi1vdXRsb29rLXQxLnN2ZyksIHVybChodHRwczovL3d3dy5hZGRldmVudC5jb20vZ2Z4L2ljb24teWFob28tdDEuc3ZnKTtiYWNrZ3JvdW5kLXBvc2l0aW9uOi05OTk5cHggLTk5OTlweDtiYWNrZ3JvdW5kLXJlcGVhdDpuby1yZXBlYXQ7fScsIGUgKz0gXCIuYWRkZXZlbnRhdGM6aG92ZXIge2JvcmRlcjoxcHggc29saWQgI2FhYjlkNDtjb2xvcjojMDAwO2ZvbnQtc2l6ZToxNXB4O3RleHQtZGVjb3JhdGlvbjpub25lO31cIiwgZSArPSBcIi5hZGRldmVudGF0Yzpmb2N1cyB7b3V0bGluZTpub25lO2JvcmRlcjoxcHggc29saWQgI2FhYjlkNDt9XCIsIGUgKz0gXCIuYWRkZXZlbnRhdGM6YWN0aXZlIHt0b3A6MXB4O31cIiwgZSArPSBcIi5hZGRldmVudGF0Yy1zZWxlY3RlZCB7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O31cIiwgZSArPSBcIi5hZGRldmVudGF0YyAuYWRkZXZlbnRhdGNfaWNvbiB7d2lkdGg6MThweDtoZWlnaHQ6MThweDtwb3NpdGlvbjphYnNvbHV0ZTt6LWluZGV4OjE7bGVmdDoxMnB4O3RvcDoxMHB4O2JhY2tncm91bmQ6dXJsKFwiICsgYSArIFwiKSBuby1yZXBlYXQ7YmFja2dyb3VuZC1zaXplOjE4cHggMThweDt9XCIsIGUgKz0gXCIuYWRkZXZlbnRhdGMgLnN0YXJ0LCAuYWRkZXZlbnRhdGMgLmVuZCwgLmFkZGV2ZW50YXRjIC50aW1lem9uZSwgLmFkZGV2ZW50YXRjIC50aXRsZSwgLmFkZGV2ZW50YXRjIC5kZXNjcmlwdGlvbiwgLmFkZGV2ZW50YXRjIC5sb2NhdGlvbiwgLmFkZGV2ZW50YXRjIC5vcmdhbml6ZXIsIC5hZGRldmVudGF0YyAub3JnYW5pemVyX2VtYWlsLCAuYWRkZXZlbnRhdGMgLmZhY2Vib29rX2V2ZW50LCAuYWRkZXZlbnRhdGMgLmFsbF9kYXlfZXZlbnQsIC5hZGRldmVudGF0YyAuZGF0ZV9mb3JtYXQsIC5hZGRldmVudGF0YyAuYWxhcm1fcmVtaW5kZXIsIC5hZGRldmVudGF0YyAucmVjdXJyaW5nLCAuYWRkZXZlbnRhdGMgLmF0dGVuZGVlcywgLmFkZGV2ZW50YXRjIC5jbGllbnQsIC5hZGRldmVudGF0YyAuY2FsbmFtZSwgLmFkZGV2ZW50YXRjIC51aWQsIC5hZGRldmVudGF0YyAuc3RhdHVzLCAuYWRkZXZlbnRhdGMgLm1ldGhvZCwgLmFkZGV2ZW50YXRjIC50cmFuc3Age2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnQ7fVwiLCBlICs9IFwiLmFkZGV2ZW50YXRjIC5kYXRhIHtkaXNwbGF5Om5vbmUhaW1wb3J0YW50O31cIiwgZSArPSBcIi5hZGRldmVudGF0YyBiciB7ZGlzcGxheTpub25lO31cIiwgYWRkZXZlbnRhdGMuZ2V0bGljZW5zZSh1KSA/IGUgKz0gXCIuYWRkZXZlbnRhdGNfZHJvcGRvd24ge3dpZHRoOjIwMHB4O3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6OTk5OTk7cGFkZGluZzo2cHggMHB4IDZweCAwcHg7YmFja2dyb3VuZDojZmZmO3RleHQtYWxpZ246bGVmdDtkaXNwbGF5Om5vbmU7bWFyZ2luLXRvcDotMnB4O21hcmdpbi1sZWZ0Oi0xcHg7Ym9yZGVyLXRvcDoxcHggc29saWQgI2M4YzhjODtib3JkZXItcmlnaHQ6MXB4IHNvbGlkICNiZWJlYmU7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2E4YThhODtib3JkZXItbGVmdDoxcHggc29saWQgI2JlYmViZTstbW96LWJvcmRlci1yYWRpdXM6MnB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czoycHg7LXdlYmtpdC1ib3gtc2hhZG93OjFweCAzcHggNnB4IHJnYmEoMCwwLDAsMC4xNSk7LW1vei1ib3gtc2hhZG93OjFweCAzcHggNnB4IHJnYmEoMCwwLDAsMC4xNSk7Ym94LXNoYWRvdzoxcHggM3B4IDZweCByZ2JhKDAsMCwwLDAuMTUpO31cIiA6IGUgKz0gXCIuYWRkZXZlbnRhdGNfZHJvcGRvd24ge3dpZHRoOjIwMHB4O3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6OTk5OTk7cGFkZGluZzo2cHggMHB4IDBweCAwcHg7YmFja2dyb3VuZDojZmZmO3RleHQtYWxpZ246bGVmdDtkaXNwbGF5Om5vbmU7bWFyZ2luLXRvcDotMnB4O21hcmdpbi1sZWZ0Oi0xcHg7Ym9yZGVyLXRvcDoxcHggc29saWQgI2M4YzhjODtib3JkZXItcmlnaHQ6MXB4IHNvbGlkICNiZWJlYmU7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2E4YThhODtib3JkZXItbGVmdDoxcHggc29saWQgI2JlYmViZTstbW96LWJvcmRlci1yYWRpdXM6MnB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czoycHg7LXdlYmtpdC1ib3gtc2hhZG93OjFweCAzcHggNnB4IHJnYmEoMCwwLDAsMC4xNSk7LW1vei1ib3gtc2hhZG93OjFweCAzcHggNnB4IHJnYmEoMCwwLDAsMC4xNSk7Ym94LXNoYWRvdzoxcHggM3B4IDZweCByZ2JhKDAsMCwwLDAuMTUpO31cIiwgZSArPSBcIi5hZGRldmVudGF0Y19kcm9wZG93biBzcGFuIHtkaXNwbGF5OmJsb2NrO2xpbmUtaGVpZ2h0OjEwMCU7YmFja2dyb3VuZDojZmZmO3RleHQtZGVjb3JhdGlvbjpub25lO2ZvbnQtc2l6ZToxNHB4O2NvbG9yOiMzMzM7cGFkZGluZzo5cHggMTBweCA5cHggNDBweDt9XCIsIGUgKz0gXCIuYWRkZXZlbnRhdGNfZHJvcGRvd24gc3Bhbjpob3ZlciB7YmFja2dyb3VuZC1jb2xvcjojZjRmNGY0O2NvbG9yOiMwMDA7dGV4dC1kZWNvcmF0aW9uOm5vbmU7Zm9udC1zaXplOjE0cHg7fVwiLCBlICs9IFwiLmFkZGV2ZW50YXRjX2Ryb3Bkb3duIC5kcm9wX21hcmt1cCB7YmFja2dyb3VuZC1jb2xvcjojZjRmNGY0O2NvbG9yOiMwMDA7dGV4dC1kZWNvcmF0aW9uOm5vbmU7Zm9udC1zaXplOjE0cHg7fVwiLCBlICs9IFwiLmFkZGV2ZW50YXRjX2Ryb3Bkb3duIC5jb3B5eCB7aGVpZ2h0OjIxcHg7ZGlzcGxheTpibG9jaztwb3NpdGlvbjpyZWxhdGl2ZTtjdXJzb3I6ZGVmYXVsdDt9XCIsIGUgKz0gXCIuYWRkZXZlbnRhdGNfZHJvcGRvd24gLmJyeCB7aGVpZ2h0OjFweDtvdmVyZmxvdzpoaWRkZW47YmFja2dyb3VuZDojZTBlMGUwO3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6MTAwO2xlZnQ6MTBweDtyaWdodDoxMHB4O3RvcDo5cHg7fVwiLCBlICs9IFwiLmFkZGV2ZW50YXRjX2Ryb3Bkb3duIC5mcnMge3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1cHg7Y3Vyc29yOnBvaW50ZXI7cmlnaHQ6MTBweDtmb250LXN0eWxlOm5vcm1hbCFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6bm9ybWFsIWltcG9ydGFudDt0ZXh0LWFsaWduOnJpZ2h0O3otaW5kZXg6MTAxO2xpbmUtaGVpZ2h0OjlweCFpbXBvcnRhbnQ7YmFja2dyb3VuZDojZmZmO3RleHQtZGVjb3JhdGlvbjpub25lO2ZvbnQtc2l6ZTo5cHghaW1wb3J0YW50O2NvbG9yOiNjYWNhY2EhaW1wb3J0YW50O31cIiwgZSArPSBcIi5hZGRldmVudGF0Y19kcm9wZG93biAuZnJzIGEge21hcmdpbjowIWltcG9ydGFudDtwYWRkaW5nOjAhaW1wb3J0YW50O2ZvbnQtc3R5bGU6bm9ybWFsIWltcG9ydGFudDtmb250LXdlaWdodDpub3JtYWwhaW1wb3J0YW50O2xpbmUtaGVpZ2h0OjlweCFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjojZmZmIWltcG9ydGFudDt0ZXh0LWRlY29yYXRpb246bm9uZTtmb250LXNpemU6OXB4IWltcG9ydGFudDtjb2xvcjojY2FjYWNhIWltcG9ydGFudDtwYWRkaW5nLWxlZnQ6MTBweCFpbXBvcnRhbnQ7ZGlzcGxheTppbmxpbmUtYmxvY2s7fVwiLCBlICs9IFwiLmFkZGV2ZW50YXRjX2Ryb3Bkb3duIC5mcnMgYTpob3ZlciB7Y29sb3I6Izk5OSFpbXBvcnRhbnQ7fVwiLCBlICs9IFwiLmFkZGV2ZW50YXRjX2Ryb3Bkb3duIC5hdGVhcHBsZWljYWwge2JhY2tncm91bmQtaW1hZ2U6dXJsKGh0dHBzOi8vd3d3LmFkZGV2ZW50LmNvbS9nZngvaWNvbi1hcHBsZS10MS5zdmcpO2JhY2tncm91bmQtcmVwZWF0Om5vLXJlcGVhdDtiYWNrZ3JvdW5kLXBvc2l0aW9uOjEzcHggNTAlO2JhY2tncm91bmQtc2l6ZToxNHB4IDEwMCU7fVwiLCBlICs9IFwiLmFkZGV2ZW50YXRjX2Ryb3Bkb3duIC5hdGVnb29nbGUge2JhY2tncm91bmQtaW1hZ2U6dXJsKGh0dHBzOi8vd3d3LmFkZGV2ZW50LmNvbS9nZngvaWNvbi1nb29nbGUtdDEuc3ZnKTtiYWNrZ3JvdW5kLXJlcGVhdDpuby1yZXBlYXQ7YmFja2dyb3VuZC1wb3NpdGlvbjoxMnB4IDUwJTtiYWNrZ3JvdW5kLXNpemU6MTZweCAxMDAlO31cIiwgZSArPSBcIi5hZGRldmVudGF0Y19kcm9wZG93biAuYXRlb3V0bG9vayB7YmFja2dyb3VuZC1pbWFnZTp1cmwoaHR0cHM6Ly93d3cuYWRkZXZlbnQuY29tL2dmeC9pY29uLW91dGxvb2stdDEuc3ZnKTtiYWNrZ3JvdW5kLXJlcGVhdDpuby1yZXBlYXQ7YmFja2dyb3VuZC1wb3NpdGlvbjoxMnB4IDUwJTtiYWNrZ3JvdW5kLXNpemU6MTZweCBhdXRvO31cIiwgZSArPSBcIi5hZGRldmVudGF0Y19kcm9wZG93biAuYXRlb3V0bG9va2NvbSB7YmFja2dyb3VuZC1pbWFnZTp1cmwoaHR0cHM6Ly93d3cuYWRkZXZlbnQuY29tL2dmeC9pY29uLW91dGxvb2stdDEuc3ZnKTtiYWNrZ3JvdW5kLXJlcGVhdDpuby1yZXBlYXQ7YmFja2dyb3VuZC1wb3NpdGlvbjoxMnB4IDUwJTtiYWNrZ3JvdW5kLXNpemU6MTZweCBhdXRvO31cIiwgZSArPSBcIi5hZGRldmVudGF0Y19kcm9wZG93biAuYXRleWFob28ge2JhY2tncm91bmQtaW1hZ2U6dXJsKGh0dHBzOi8vd3d3LmFkZGV2ZW50LmNvbS9nZngvaWNvbi15YWhvby10MS5zdmcpO2JhY2tncm91bmQtcmVwZWF0Om5vLXJlcGVhdDtiYWNrZ3JvdW5kLXBvc2l0aW9uOjEycHggNTAlO2JhY2tncm91bmQtc2l6ZToxNnB4IGF1dG87fVwiLCBlICs9IFwiLmFkZGV2ZW50YXRjX2Ryb3Bkb3duIC5hdGVmYWNlYm9vayB7YmFja2dyb3VuZC1pbWFnZTp1cmwoaHR0cHM6Ly93d3cuYWRkZXZlbnQuY29tL2dmeC9pY29uLWZhY2Vib29rLXQxLnN2Zyk7YmFja2dyb3VuZC1yZXBlYXQ6bm8tcmVwZWF0O2JhY2tncm91bmQtcG9zaXRpb246MTJweCA1MCU7YmFja2dyb3VuZC1zaXplOjE2cHggYXV0bzt9XCIsIGUgKz0gXCIuYWRkZXZlbnRhdGNfZHJvcGRvd24gZW0ge2ZvbnQtc2l6ZToxMnB4IWltcG9ydGFudDtjb2xvcjojOTk5IWltcG9ydGFudDt9XCI7XG4gICAgICAgICAgICAgICAgdmFyIHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICAgICAgICAgICAgdC50eXBlID0gXCJ0ZXh0L2Nzc1wiLCB0LmlkID0gXCJhdGVfY3NzXCIsIHQuc3R5bGVTaGVldCA/IHQuc3R5bGVTaGVldC5jc3NUZXh0ID0gZSA6IHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZSkpLCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQodCksIGFkZGV2ZW50YXRjLnJlbW92ZWVsZW1lbnQoJGQoXCJhdGVfdG1wX2Nzc1wiKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaGVscGVyY3NzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoISRkKFwiYXRlX2hlbHBlcl9jc3NcIikpIHtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZSArPSBcIi5hZGRldmVudGF0Y19kcm9wZG93biAuZHJvcF9tYXJrdXAge2JhY2tncm91bmQtY29sb3I6I2Y0ZjRmNDt9XCIsIGUgKz0gXCIuYWRkZXZlbnRhdGNfZHJvcGRvd24gLmZycyBhIHttYXJnaW46MCFpbXBvcnRhbnQ7cGFkZGluZzowIWltcG9ydGFudDtmb250LXN0eWxlOm5vcm1hbCFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6bm9ybWFsIWltcG9ydGFudDtsaW5lLWhlaWdodDoxMTAlIWltcG9ydGFudDtiYWNrZ3JvdW5kLWNvbG9yOiNmZmYhaW1wb3J0YW50O3RleHQtZGVjb3JhdGlvbjpub25lO2ZvbnQtc2l6ZTo5cHghaW1wb3J0YW50O2NvbG9yOiNjYWNhY2EhaW1wb3J0YW50O2Rpc3BsYXk6aW5saW5lLWJsb2NrO31cIiwgZSArPSBcIi5hZGRldmVudGF0Y19kcm9wZG93biAuZnJzIGE6aG92ZXIge2NvbG9yOiM5OTkhaW1wb3J0YW50O31cIiwgZSArPSBcIi5hZGRldmVudGF0YyAuc3RhcnQsIC5hZGRldmVudGF0YyAuZW5kLCAuYWRkZXZlbnRhdGMgLnRpbWV6b25lLCAuYWRkZXZlbnRhdGMgLnRpdGxlLCAuYWRkZXZlbnRhdGMgLmRlc2NyaXB0aW9uLCAuYWRkZXZlbnRhdGMgLmxvY2F0aW9uLCAuYWRkZXZlbnRhdGMgLm9yZ2FuaXplciwgLmFkZGV2ZW50YXRjIC5vcmdhbml6ZXJfZW1haWwsIC5hZGRldmVudGF0YyAuZmFjZWJvb2tfZXZlbnQsIC5hZGRldmVudGF0YyAuYWxsX2RheV9ldmVudCwgLmFkZGV2ZW50YXRjIC5kYXRlX2Zvcm1hdCwgLmFkZGV2ZW50YXRjIC5hbGFybV9yZW1pbmRlciwgLmFkZGV2ZW50YXRjIC5yZWN1cnJpbmcsIC5hZGRldmVudGF0YyAuYXR0ZW5kZWVzLCAuYWRkZXZlbnRhdGMgLmNsaWVudCwgLmFkZGV2ZW50YXRjIC5jYWxuYW1lLCAuYWRkZXZlbnRhdGMgLnVpZCwgLmFkZGV2ZW50YXRjIC5zdGF0dXMsIC5hZGRldmVudGF0YyAubWV0aG9kIHtkaXNwbGF5Om5vbmUhaW1wb3J0YW50O31cIjtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICAgICAgICAgICAgICB0LnR5cGUgPSBcInRleHQvY3NzXCIsIHQuaWQgPSBcImF0ZV9oZWxwZXJfY3NzXCIsIHQuc3R5bGVTaGVldCA/IHQuc3R5bGVTaGVldC5jc3NUZXh0ID0gZSA6IHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZSkpLCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQodClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlZWxlbWVudDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKGhkeCA9IGUpICYmIGhkeC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGhkeClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICAgICAgfSxcbiAgICAgICAgdG9wemluZGV4OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBlID0gMSwgdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSwgYSA9IDA7IGEgPCB0Lmxlbmd0aDsgYSArPSAxKVxuICAgICAgICAgICAgICAgIGlmIChhZGRldmVudGF0Yy5oYXNjbGFzcyh0W2FdLCBcImFkZGV2ZW50YXRjXCIpIHx8IGFkZGV2ZW50YXRjLmhhc2NsYXNzKHRbYV0sIFwiYWRkZXZlbnRzdGNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSBhZGRldmVudGF0Yy5nZXRzdHlsZSh0W2FdLCBcInotaW5kZXhcIik7XG4gICAgICAgICAgICAgICAgICAgICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKSAmJiBlIDwgKG4gPSBwYXJzZUludChuKSkgJiYgKGUgPSBuKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlXG4gICAgICAgIH0sXG4gICAgICAgIHZpZXdwb3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZSA9IDAsXG4gICAgICAgICAgICAgICAgdCA9IDAsXG4gICAgICAgICAgICAgICAgYSA9IDAsXG4gICAgICAgICAgICAgICAgbiA9IDA7XG4gICAgICAgICAgICByZXR1cm4gXCJudW1iZXJcIiA9PSB0eXBlb2Ygd2luZG93LmlubmVyV2lkdGggPyAoZSA9IHdpbmRvdy5pbm5lcldpZHRoLCB0ID0gd2luZG93LmlubmVySGVpZ2h0KSA6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpID8gKGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSA6IGRvY3VtZW50LmJvZHkgJiYgKGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggfHwgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQpICYmIChlID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCwgdCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0KSwgZG9jdW1lbnQuYWxsID8gKG4gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IDogZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0LCBhID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgOiBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgOiAobiA9IHdpbmRvdy5wYWdlWE9mZnNldCwgYSA9IHdpbmRvdy5wYWdlWU9mZnNldCksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB3OiBlLFxuICAgICAgICAgICAgICAgICAgICBoOiB0LFxuICAgICAgICAgICAgICAgICAgICB4OiBuLFxuICAgICAgICAgICAgICAgICAgICB5OiBhXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbGVtZW50cG9zaXRpb246IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgdCA9IDAsXG4gICAgICAgICAgICAgICAgYSA9IDA7XG4gICAgICAgICAgICBpZiAoZS5vZmZzZXRQYXJlbnQpXG4gICAgICAgICAgICAgICAgZm9yICh0ID0gZS5vZmZzZXRMZWZ0LCBhID0gZS5vZmZzZXRUb3A7IGUgPSBlLm9mZnNldFBhcmVudDspIHQgKz0gZS5vZmZzZXRMZWZ0LCBhICs9IGUub2Zmc2V0VG9wO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB4OiB0LFxuICAgICAgICAgICAgICAgIHk6IGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0c3R5bGU6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgICAgICB2YXIgYSwgbiA9IGU7XG4gICAgICAgICAgICByZXR1cm4gbi5jdXJyZW50U3R5bGUgPyBhID0gbi5jdXJyZW50U3R5bGVbdF0gOiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSAmJiAoYSA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUobiwgbnVsbClcbiAgICAgICAgICAgICAgICAuZ2V0UHJvcGVydHlWYWx1ZSh0KSksIGFcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0bGljZW5zZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciB0ID0gbG9jYXRpb24ub3JpZ2luLFxuICAgICAgICAgICAgICAgIGEgPSAhMTtcbiAgICAgICAgICAgIGlmICh2b2lkIDAgPT09IGxvY2F0aW9uLm9yaWdpbiAmJiAodCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdCksIGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IGUuc3Vic3RyaW5nKDAsIDEpLFxuICAgICAgICAgICAgICAgICAgICBvID0gZS5zdWJzdHJpbmcoOSwgMTApLFxuICAgICAgICAgICAgICAgICAgICBkID0gZS5zdWJzdHJpbmcoMTcsIDE4KTtcbiAgICAgICAgICAgICAgICBcImFcIiA9PSBuICYmIFwielwiID09IG8gJiYgXCJtXCIgPT0gZCAmJiAoYSA9ICEwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICgtMSA9PSB0LmluZGV4T2YoXCJhZGRldmVudC5jb21cIikgJiYgXCJhYW84aXVldDV6cDlpcXc1c205elwiID09IGUgfHwgLTEgPT0gdC5pbmRleE9mKFwiYWRkZXZlbnQudG9cIikgJiYgXCJhYW84aXVldDV6cDlpcXc1c205elwiID09IGUgfHwgLTEgPT0gdC5pbmRleE9mKFwiYWRkZXZlbnQuY29tXCIpICYmIFwiYWFvOGl1ZXQ1enA5aXF3NXNtOXpcIiA9PSBlKSAmJiAoYSA9ICEwKSwgYVxuICAgICAgICB9LFxuICAgICAgICByZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpLCB0ID0gW10sIGEgPSAwOyBhIDwgZS5sZW5ndGg7IGEgKz0gMSlcbiAgICAgICAgICAgICAgICBpZiAoYWRkZXZlbnRhdGMuaGFzY2xhc3MoZVthXSwgXCJhZGRldmVudGF0Y1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBlW2FdLmNsYXNzTmFtZSA9IGVbYV0uY2xhc3NOYW1lLnJlcGxhY2UoL2FkZGV2ZW50YXRjLXNlbGVjdGVkL2dpLCBcIlwiKSwgZVthXS5pZCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG4gPSBlW2FdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSwgbyA9IDA7IG8gPCBuLmxlbmd0aDsgbyArPSAxKShhZGRldmVudGF0Yy5oYXNjbGFzcyhuW29dLCBcImFkZGV2ZW50YXRjX2ljb25cIikgfHwgYWRkZXZlbnRhdGMuaGFzY2xhc3MobltvXSwgXCJhZGRldmVudGF0Y19kcm9wZG93blwiKSkgJiYgdC5wdXNoKG5bb10pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCB0Lmxlbmd0aDsgZCArPSAxKSBhZGRldmVudGF0Yy5yZW1vdmVlbGVtZW50KHRbZF0pO1xuICAgICAgICAgICAgYWRkZXZlbnRhdGMucmVtb3ZlZWxlbWVudCgkZChcImF0ZV9jc3NcIikpLCBnID0gIShsID0gMSksIGFkZGV2ZW50YXRjLmdlbmVyYXRlKClcbiAgICAgICAgfSxcbiAgICAgICAgaGFzY2xhc3M6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChcIihcXFxcc3xeKVwiICsgdCArIFwiKFxcXFxzfCQpXCIpXG4gICAgICAgICAgICAgICAgLnRlc3QoZS5jbGFzc05hbWUpXG4gICAgICAgIH0sXG4gICAgICAgIGVjbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciB0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZSk7XG4gICAgICAgICAgICBpZiAodC5jbGljaykgdC5jbGljaygpO1xuICAgICAgICAgICAgZWxzZSBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiTW91c2VFdmVudHNcIik7XG4gICAgICAgICAgICAgICAgYS5pbml0RXZlbnQoXCJjbGlja1wiLCAhMCwgITApLCB0LmRpc3BhdGNoRXZlbnQoYSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJhY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBuZXcgSW1hZ2UsIChuZXcgRGF0ZSlcbiAgICAgICAgICAgICAgICAuZ2V0VGltZSgpLCBlbmNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLm9yaWdpbilcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Z3VpZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgZSA9IFwiYWRkZXZlbnRfdHJhY2tfY29va2llPVwiLCB0ID0gXCJcIiwgYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdChcIjtcIiksIG4gPSAwOyBuIDwgYS5sZW5ndGg7IG4rKykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG8gPSBhW25dO1xuICAgICAgICAgICAgICAgICAgICBcIiBcIiA9PSBvLmNoYXJBdCgwKTspIG8gPSBvLnN1YnN0cmluZygxLCBvLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgMCA9PSBvLmluZGV4T2YoZSkgJiYgKHQgPSBvLnN1YnN0cmluZyhlLmxlbmd0aCwgby5sZW5ndGgpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFwiXCIgPT0gdCkge1xuICAgICAgICAgICAgICAgIHZhciBkID0gKGFkZGV2ZW50YXRjLnM0KCkgKyBhZGRldmVudGF0Yy5zNCgpICsgXCItXCIgKyBhZGRldmVudGF0Yy5zNCgpICsgXCItNFwiICsgYWRkZXZlbnRhdGMuczQoKVxuICAgICAgICAgICAgICAgICAgICAuc3Vic3RyKDAsIDMpICsgXCItXCIgKyBhZGRldmVudGF0Yy5zNCgpICsgXCItXCIgKyBhZGRldmVudGF0Yy5zNCgpICsgYWRkZXZlbnRhdGMuczQoKSArIGFkZGV2ZW50YXRjLnM0KCkpXG4gICAgICAgICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgICAgICAgICBjID0gbmV3IERhdGU7XG4gICAgICAgICAgICAgICAgYy5zZXRUaW1lKGMuZ2V0VGltZSgpICsgMzE1MzZlNik7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBcImV4cGlyZXM9XCIgKyBjLnRvVVRDU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gXCJhZGRldmVudF90cmFja19jb29raWU9XCIgKyBkICsgXCI7IFwiICsgaSwgdCA9IGRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0XG4gICAgICAgIH0sXG4gICAgICAgIHM0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKDY1NTM2ICogKDEgKyBNYXRoLnJhbmRvbSgpKSB8IDApXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKDE2KVxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSlcbiAgICAgICAgfSxcbiAgICAgICAgZG9jdW1lbnRjbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUgPSAoZSA9IGUgfHwgd2luZG93LmV2ZW50KVxuICAgICAgICAgICAgICAgIC50YXJnZXQgfHwgZS5zcmNFbGVtZW50LCBhdGVfdG91Y2hfY2FwYWJsZSA/IChjbGVhclRpbWVvdXQodCksIHQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkZXZlbnRhdGMuaGlkZShlLmNsYXNzTmFtZSlcbiAgICAgICAgICAgICAgICB9LCA1MDApKSA6IGFkZGV2ZW50YXRjLmhpZGUoZS5jbGFzc05hbWUpXG4gICAgICAgIH0sXG4gICAgICAgIHRyaWdnZXI6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgICAgICBpZiAoXCJidXR0b25fY2xpY2tcIiA9PSBlKSB0cnkge1xuICAgICAgICAgICAgICAgICAgICBBKHQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICAgICAgICAgIGlmIChcImJ1dHRvbl9tb3VzZW92ZXJcIiA9PSBlKSB0cnkge1xuICAgICAgICAgICAgICAgICAgICBMKHQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICAgICAgICAgIGlmIChcImJ1dHRvbl9tb3VzZW91dFwiID09IGUpIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG4odClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHsgfVxuICAgICAgICAgICAgaWYgKFwiYnV0dG9uX2Ryb3Bkb3duX3Nob3dcIiA9PSBlKSB0cnkge1xuICAgICAgICAgICAgICAgICAgICBIKHQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICAgICAgICAgIGlmIChcImJ1dHRvbl9kcm9wZG93bl9oaWRlXCIgPT0gZSkgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgUih0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkgeyB9XG4gICAgICAgICAgICBpZiAoXCJidXR0b25fZHJvcGRvd25fY2xpY2tcIiA9PSBlKSB0cnkge1xuICAgICAgICAgICAgICAgICAgICBNKHQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVnaXN0ZXI6IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgICAgICBcImJ1dHRvbi1jbGlja1wiID09IGUgJiYgKEEgPSB0KSwgXCJidXR0b24tbW91c2VvdmVyXCIgPT0gZSAmJiAoTCA9IHQpLCBcImJ1dHRvbi1tb3VzZW91dFwiID09IGUgJiYgKG4gPSB0KSwgXCJidXR0b24tZHJvcGRvd24tc2hvd1wiID09IGUgJiYgKEggPSB0KSwgXCJidXR0b24tZHJvcGRvd24taGlkZVwiID09IGUgJiYgKFIgPSB0KSwgXCJidXR0b24tZHJvcGRvd24tY2xpY2tcIiA9PSBlICYmIChNID0gdClcbiAgICAgICAgfSxcbiAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBudWxsICE9IGUubGljZW5zZSAmJiAodSA9IGUubGljZW5zZSksIG51bGwgIT0gZS5jc3MgJiYgKGUuY3NzID8gcCA9ICEwIDogKHAgPSAhMSwgYWRkZXZlbnRhdGMucmVtb3ZlZWxlbWVudCgkZChcImF0ZV9jc3NcIikpKSksIG51bGwgIT0gZS5tb3VzZSAmJiAocyA9IGUubW91c2UpLCAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgKHMgPSAhMSksIG51bGwgIT0gZS5vdXRsb29rICYmIG51bGwgIT0gZS5vdXRsb29rLnNob3cgJiYgKHggPSBlLm91dGxvb2suc2hvdyksIG51bGwgIT0gZS5nb29nbGUgJiYgbnVsbCAhPSBlLmdvb2dsZS5zaG93ICYmICh3ID0gZS5nb29nbGUuc2hvdyksIG51bGwgIT0gZS55YWhvbyAmJiBudWxsICE9IGUueWFob28uc2hvdyAmJiAoeSA9IGUueWFob28uc2hvdyksIG51bGwgIT0gZS5ob3RtYWlsICYmIG51bGwgIT0gZS5ob3RtYWlsLnNob3cgJiYgKGsgPSBlLmhvdG1haWwuc2hvdyksIG51bGwgIT0gZS5vdXRsb29rY29tICYmIG51bGwgIT0gZS5vdXRsb29rY29tLnNob3cgJiYgKGsgPSBlLm91dGxvb2tjb20uc2hvdyksIG51bGwgIT0gZS5pY2FsICYmIG51bGwgIT0gZS5pY2FsLnNob3cgJiYgKGIgPSBlLmljYWwuc2hvdyksIG51bGwgIT0gZS5hcHBsZWljYWwgJiYgbnVsbCAhPSBlLmFwcGxlaWNhbC5zaG93ICYmIChiID0gZS5hcHBsZWljYWwuc2hvdyksIG51bGwgIT0gZS5mYWNlYm9vayAmJiBudWxsICE9IGUuZmFjZWJvb2suc2hvdyAmJiAoVCA9IGUuZmFjZWJvb2suc2hvdyksIG51bGwgIT0gZS5vdXRsb29rICYmIG51bGwgIT0gZS5vdXRsb29rLnRleHQgJiYgKE4gPSBlLm91dGxvb2sudGV4dCksIG51bGwgIT0gZS5nb29nbGUgJiYgbnVsbCAhPSBlLmdvb2dsZS50ZXh0ICYmIChFID0gZS5nb29nbGUudGV4dCksIG51bGwgIT0gZS55YWhvbyAmJiBudWxsICE9IGUueWFob28udGV4dCAmJiAoSSA9IGUueWFob28udGV4dCksIG51bGwgIT0gZS5ob3RtYWlsICYmIG51bGwgIT0gZS5ob3RtYWlsLnRleHQgJiYgKEMgPSBlLmhvdG1haWwudGV4dCksIG51bGwgIT0gZS5vdXRsb29rY29tICYmIG51bGwgIT0gZS5vdXRsb29rY29tLnRleHQgJiYgKEMgPSBlLm91dGxvb2tjb20udGV4dCksIG51bGwgIT0gZS5pY2FsICYmIG51bGwgIT0gZS5pY2FsLnRleHQgJiYgKHogPSBlLmljYWwudGV4dCksIG51bGwgIT0gZS5hcHBsZWljYWwgJiYgbnVsbCAhPSBlLmFwcGxlaWNhbC50ZXh0ICYmICh6ID0gZS5hcHBsZWljYWwudGV4dCksIG51bGwgIT0gZS5mYWNlYm9vayAmJiBudWxsICE9IGUuZmFjZWJvb2sudGV4dCAmJiAoJCA9IGUuZmFjZWJvb2sudGV4dCksIG51bGwgIT0gZS5kcm9wZG93biAmJiBudWxsICE9IGUuZHJvcGRvd24ub3JkZXIgJiYgKGYgPSBlLmRyb3Bkb3duLm9yZGVyKVxuICAgICAgICB9LFxuICAgICAgICBrZXlib2FyZDogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodC5pZCArIFwiLWRyb3BcIik7XG4gICAgICAgICAgICBpZiAoYSAmJiBcImJsb2NrXCIgPT0gYWRkZXZlbnRhdGMuZ2V0c3R5bGUoYSwgXCJkaXNwbGF5XCIpKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbiA9IGEuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJTUEFOXCIpLCBvID0gbnVsbCwgZCA9IDAsIGMgPSAwLCBpID0gMDsgaSA8IG4ubGVuZ3RoOyBpICs9IDEpIGQrKyAsIGFkZGV2ZW50YXRjLmhhc2NsYXNzKG5baV0sIFwiZHJvcF9tYXJrdXBcIikgJiYgKG8gPSBuW2ldLCBjID0gZCk7XG4gICAgICAgICAgICAgICAgbnVsbCA9PT0gbyA/IGMgPSAxIDogXCJkb3duXCIgPT0gdC5rZXkgPyBkIDw9IGMgPyBjID0gMSA6IGMrKyA6IDEgPT0gYyA/IGMgPSBkIDogYy0tO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IGQgPSAwOyBpIDwgbi5sZW5ndGg7IGkgKz0gMSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKCsrZCA9PSBjKSBuW2ldLmNsYXNzTmFtZSArPSBcIiBkcm9wX21hcmt1cFwiO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gbmV3IFJlZ0V4cChcIihcXFxcc3xeKWRyb3BfbWFya3VwKFxcXFxzfCQpXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbltpXS5jbGFzc05hbWUgPSBuW2ldLmNsYXNzTmFtZS5yZXBsYWNlKHIsIFwiIFwiKSwgbltpXS5jbGFzc05hbWUgPSBuW2ldLmNsYXNzTmFtZS5yZXBsYWNlKC9cXHMrJC8sIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAga2V5Ym9hcmRjbGljazogZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodC5pZCArIFwiLWRyb3BcIik7XG4gICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG4gPSBhLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiU1BBTlwiKSwgbyA9IG51bGwsIGQgPSAwOyBkIDwgbi5sZW5ndGg7IGQgKz0gMSkgYWRkZXZlbnRhdGMuaGFzY2xhc3MobltkXSwgXCJkcm9wX21hcmt1cFwiKSAmJiAobyA9IG5bZF0pO1xuICAgICAgICAgICAgICAgIGlmIChudWxsICE9PSBvKSB7XG4gICAgICAgICAgICAgICAgICAgIG8uY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChkID0gMDsgZCA8IG4ubGVuZ3RoOyBkICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gbmV3IFJlZ0V4cChcIihcXFxcc3xeKWRyb3BfbWFya3VwKFxcXFxzfCQpXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbltkXS5jbGFzc05hbWUgPSBuW2RdLmNsYXNzTmFtZS5yZXBsYWNlKGMsIFwiIFwiKSwgbltkXS5jbGFzc05hbWUgPSBuW2RdLmNsYXNzTmFtZS5yZXBsYWNlKC9cXHMrJC8sIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHVzZXdlYmNhbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGUgPSAhMSxcbiAgICAgICAgICAgICAgICB0ID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICBhID0gL0NyaU9TL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgICAgICAgICAgICBuID0gL2luc3RhZ3JhbS8udGVzdCh0KSxcbiAgICAgICAgICAgICAgICBvID0gL2lwaG9uZXxpcG9kfGlwYWQvLnRlc3QodCksXG4gICAgICAgICAgICAgICAgZCA9IC8oaVBob25lfGlQb2R8aVBhZCkuKkFwcGxlV2ViS2l0KD8hLipTYWZhcmkpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgICAgIHJldHVybiAobyAmJiBkIHx8IG8gJiYgYSB8fCBvICYmIG4pICYmIChlID0gITApLCBlXG4gICAgICAgIH0sXG4gICAgICAgIGFnZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZSA9IG5hdmlnYXRvci51c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnZlbmRvciB8fCB3aW5kb3cub3BlcmE7XG4gICAgICAgICAgICByZXR1cm4gL3dpbmRvd3MgcGhvbmUvaS50ZXN0KGUpID8gXCJ3aW5kb3dzX3Bob25lXCIgOiAvYW5kcm9pZC9pLnRlc3QoZSkgPyBcImFuZHJvaWRcIiA6IC9pUGFkfGlQaG9uZXxpUG9kLy50ZXN0KGUpICYmICF3aW5kb3cuTVNTdHJlYW0gPyBcImlvc1wiIDogXCJ1bmtub3duXCJcbiAgICAgICAgfVxuICAgIH1cbn0oKTtcbiEgZnVuY3Rpb24gKGUsIHQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBlID0gZSB8fCBcImRvY1JlYWR5XCIsIHQgPSB0IHx8IHdpbmRvdztcbiAgICB2YXIgYSA9IFtdLFxuICAgICAgICBuID0gITEsXG4gICAgICAgIG8gPSAhMTtcblxuICAgIGZ1bmN0aW9uIGQoKSB7XG4gICAgICAgIGlmICghbikge1xuICAgICAgICAgICAgbiA9ICEwO1xuICAgICAgICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCBhLmxlbmd0aDsgZSsrKSBhW2VdLmZuLmNhbGwod2luZG93LCBhW2VdLmN0eCk7XG4gICAgICAgICAgICBhID0gW11cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGMoKSB7XG4gICAgICAgIFwiY29tcGxldGVcIiA9PT0gZG9jdW1lbnQucmVhZHlTdGF0ZSAmJiBkKClcbiAgICB9XG4gICAgdFtlXSA9IGZ1bmN0aW9uIChlLCB0KSB7XG4gICAgICAgIGlmIChcImZ1bmN0aW9uXCIgIT0gdHlwZW9mIGUpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYWxsYmFjayBmb3IgZG9jUmVhZHkoZm4pIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgbiA/IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZSh0KVxuICAgICAgICB9LCAxKSA6IChhLnB1c2goXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZm46IGUsXG4gICAgICAgICAgICAgICAgY3R4OiB0XG4gICAgICAgICAgICB9KSwgXCJjb21wbGV0ZVwiID09PSBkb2N1bWVudC5yZWFkeVN0YXRlIHx8ICFkb2N1bWVudC5hdHRhY2hFdmVudCAmJiBcImludGVyYWN0aXZlXCIgPT09IGRvY3VtZW50LnJlYWR5U3RhdGUgPyBzZXRUaW1lb3V0KGQsIDEpIDogbyB8fCAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA/IChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBkLCAhMSksIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBkLCAhMSkpIDogKGRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsIGMpLCB3aW5kb3cuYXR0YWNoRXZlbnQoXCJvbmxvYWRcIiwgZCkpLCBvID0gITApKVxuICAgIH1cbn0oXCJhZGRldmVudFJlYWR5XCIsIHdpbmRvdyk7XG52YXIgYXRlX3RvdWNoX2NhcGFibGUgPSBcIm9udG91Y2hzdGFydFwiIGluIHdpbmRvdyB8fCB3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIHdpbmRvdy5Eb2N1bWVudFRvdWNoIHx8IDAgPCBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgfHwgMCA8IHdpbmRvdy5uYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cztcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyID8gKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhZGRldmVudGF0Yy5kb2N1bWVudGNsaWNrLCAhMSksIGF0ZV90b3VjaF9jYXBhYmxlICYmIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBhZGRldmVudGF0Yy5kb2N1bWVudGNsaWNrLCAhMSkpIDogd2luZG93LmF0dGFjaEV2ZW50ID8gKGRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25jbGlja1wiLCBhZGRldmVudGF0Yy5kb2N1bWVudGNsaWNrKSwgYXRlX3RvdWNoX2NhcGFibGUgJiYgZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnRvdWNoZW5kXCIsIGFkZGV2ZW50YXRjLmRvY3VtZW50Y2xpY2spKSA6IGRvY3VtZW50Lm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgYWRkZXZlbnRhdGMuZG9jdW1lbnRjbGljayhldmVudClcbn0sIGFkZGV2ZW50UmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIGFkZGV2ZW50YXRjLmluaXRpYWxpemUoKSwgc2V0VGltZW91dChcImFkZGV2ZW50YXRjLmluaXRpYWxpemUoKTtcIiwgMjAwKVxufSk7Il0sImZpbGUiOiJwYXJ0aWFscy9hZGR0b2NhbGVuZGFyLmpzIn0=
