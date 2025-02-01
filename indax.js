( () => {
    var qv = Object.create;
    var Hi = Object.defineProperty;
    var $v = Object.getOwnPropertyDescriptor;
    var Lv = Object.getOwnPropertyNames;
    var Mv = Object.getPrototypeOf
      , Nv = Object.prototype.hasOwnProperty;
    var df = r => Hi(r, "__esModule", {
        value: !0
    });
    var hf = r => {
        if (typeof require != "undefined")
            return require(r);
        throw new Error('Dynamic require of "' + r + '" is not supported')
    }
    ;
    var P = (r, e) => () => (r && (e = r(r = 0)),
    e);
    var x = (r, e) => () => (e || r((e = {
        exports: {}
    }).exports, e),
    e.exports)
      , Ge = (r, e) => {
        df(r);
        for (var t in e)
            Hi(r, t, {
                get: e[t],
                enumerable: !0
            })
    }
      , Bv = (r, e, t) => {
        if (e && typeof e == "object" || typeof e == "function")
            for (let i of Lv(e))
                !Nv.call(r, i) && i !== "default" && Hi(r, i, {
                    get: () => e[i],
                    enumerable: !(t = $v(e, i)) || t.enumerable
                });
        return r
    }
      , pe = r => Bv(df(Hi(r != null ? qv(Mv(r)) : {}, "default", r && r.__esModule && "default"in r ? {
        get: () => r.default,
        enumerable: !0
    } : {
        value: r,
        enumerable: !0
    })), r);
    var m, u = P( () => {
        m = {
            platform: "",
            env: {},
            versions: {
                node: "14.17.6"
            }
        }
    }
    );
    var Fv, be, ft = P( () => {
        u();
        Fv = 0,
        be = {
            readFileSync: r => self[r] || "",
            statSync: () => ({
                mtimeMs: Fv++
            }),
            promises: {
                readFile: r => Promise.resolve(self[r] || "")
            }
        }
    }
    );
    var Fs = x( (oP, gf) => {
        u();
        "use strict";
        var mf = class {
            constructor(e={}) {
                if (!(e.maxSize && e.maxSize > 0))
                    throw new TypeError("`maxSize` must be a number greater than 0");
                if (typeof e.maxAge == "number" && e.maxAge === 0)
                    throw new TypeError("`maxAge` must be a number greater than 0");
                this.maxSize = e.maxSize,
                this.maxAge = e.maxAge || 1 / 0,
                this.onEviction = e.onEviction,
                this.cache = new Map,
                this.oldCache = new Map,
                this._size = 0
            }
            _emitEvictions(e) {
                if (typeof this.onEviction == "function")
                    for (let[t,i] of e)
                        this.onEviction(t, i.value)
            }
            _deleteIfExpired(e, t) {
                return typeof t.expiry == "number" && t.expiry <= Date.now() ? (typeof this.onEviction == "function" && this.onEviction(e, t.value),
                this.delete(e)) : !1
            }
            _getOrDeleteIfExpired(e, t) {
                if (this._deleteIfExpired(e, t) === !1)
                    return t.value
            }
            _getItemValue(e, t) {
                return t.expiry ? this._getOrDeleteIfExpired(e, t) : t.value
            }
            _peek(e, t) {
                let i = t.get(e);
                return this._getItemValue(e, i)
            }
            _set(e, t) {
                this.cache.set(e, t),
                this._size++,
                this._size >= this.maxSize && (this._size = 0,
                this._emitEvictions(this.oldCache),
                this.oldCache = this.cache,
                this.cache = new Map)
            }
            _moveToRecent(e, t) {
                this.oldCache.delete(e),
                this._set(e, t)
            }
            *_entriesAscending() {
                for (let e of this.oldCache) {
                    let[t,i] = e;
                    this.cache.has(t) || this._deleteIfExpired(t, i) === !1 && (yield e)
                }
                for (let e of this.cache) {
                    let[t,i] = e;
                    this._deleteIfExpired(t, i) === !1 && (yield e)
                }
            }
            get(e) {
                if (this.cache.has(e)) {
                    let t = this.cache.get(e);
                    return this._getItemValue(e, t)
                }
                if (this.oldCache.has(e)) {
                    let t = this.oldCache.get(e);
                    if (this._deleteIfExpired(e, t) === !1)
                        return this._moveToRecent(e, t),
                        t.value
                }
            }
            set(e, t, {maxAge: i=this.maxAge === 1 / 0 ? void 0 : Date.now() + this.maxAge}={}) {
                this.cache.has(e) ? this.cache.set(e, {
                    value: t,
                    maxAge: i
                }) : this._set(e, {
                    value: t,
                    expiry: i
                })
            }
            has(e) {
                return this.cache.has(e) ? !this._deleteIfExpired(e, this.cache.get(e)) : this.oldCache.has(e) ? !this._deleteIfExpired(e, this.oldCache.get(e)) : !1
            }
            peek(e) {
                if (this.cache.has(e))
                    return this._peek(e, this.cache);
                if (this.oldCache.has(e))
                    return this._peek(e, this.oldCache)
            }
            delete(e) {
                let t = this.cache.delete(e);
                return t && this._size--,
                this.oldCache.delete(e) || t
            }
            clear() {
                this.cache.clear(),
                this.oldCache.clear(),
                this._size = 0
            }
            resize(e) {
                if (!(e && e > 0))
                    throw new TypeError("`maxSize` must be a number greater than 0");
                let t = [...this._entriesAscending()]
                  , i = t.length - e;
                i < 0 ? (this.cache = new Map(t),
                this.oldCache = new Map,
                this._size = t.length) : (i > 0 && this._emitEvictions(t.slice(0, i)),
                this.oldCache = new Map(t.slice(i)),
                this.cache = new Map,
                this._size = 0),
                this.maxSize = e
            }
            *keys() {
                for (let[e] of this)
                    yield e
            }
            *values() {
                for (let[,e] of this)
                    yield e
            }
            *[Symbol.iterator]() {
                for (let e of this.cache) {
                    let[t,i] = e;
                    this._deleteIfExpired(t, i) === !1 && (yield[t, i.value])
                }
                for (let e of this.oldCache) {
                    let[t,i] = e;
                    this.cache.has(t) || this._deleteIfExpired(t, i) === !1 && (yield[t, i.value])
                }
            }
            *entriesDescending() {
                let e = [...this.cache];
                for (let t = e.length - 1; t >= 0; --t) {
                    let i = e[t]
                      , [n,s] = i;
                    this._deleteIfExpired(n, s) === !1 && (yield[n, s.value])
                }
                e = [...this.oldCache];
                for (let t = e.length - 1; t >= 0; --t) {
                    let i = e[t]
                      , [n,s] = i;
                    this.cache.has(n) || this._deleteIfExpired(n, s) === !1 && (yield[n, s.value])
                }
            }
            *entriesAscending() {
                for (let[e,t] of this._entriesAscending())
                    yield[e, t.value]
            }
            get size() {
                if (!this._size)
                    return this.oldCache.size;
                let e = 0;
                for (let t of this.oldCache.keys())
                    this.cache.has(t) || e++;
                return Math.min(this._size + e, this.maxSize)
            }
        }
        ;
        gf.exports = mf
    }
    );
    var yf, bf = P( () => {
        u();
        yf = r => r && r._hash
    }
    );
    function Wi(r) {
        return yf(r, {
            ignoreUnknown: !0
        })
    }
    var wf = P( () => {
        u();
        bf()
    }
    );
    function xt(r) {
        if (r = `${r}`,
        r === "0")
            return "0";
        if (/^[+-]?(\d+|\d*\.\d+)(e[+-]?\d+)?(%|\w+)?$/.test(r))
            return r.replace(/^[+-]?/, t => t === "-" ? "" : "-");
        let e = ["var", "calc", "min", "max", "clamp"];
        for (let t of e)
            if (r.includes(`${t}(`))
                return `calc(${r} * -1)`
    }
    var Gi = P( () => {
        u()
    }
    );
    var vf, xf = P( () => {
        u();
        vf = ["preflight", "container", "accessibility", "pointerEvents", "visibility", "position", "inset", "isolation", "zIndex", "order", "gridColumn", "gridColumnStart", "gridColumnEnd", "gridRow", "gridRowStart", "gridRowEnd", "float", "clear", "margin", "boxSizing", "lineClamp", "display", "aspectRatio", "size", "height", "maxHeight", "minHeight", "width", "minWidth", "maxWidth", "flex", "flexShrink", "flexGrow", "flexBasis", "tableLayout", "captionSide", "borderCollapse", "borderSpacing", "transformOrigin", "translate", "rotate", "skew", "scale", "transform", "animation", "cursor", "touchAction", "userSelect", "resize", "scrollSnapType", "scrollSnapAlign", "scrollSnapStop", "scrollMargin", "scrollPadding", "listStylePosition", "listStyleType", "listStyleImage", "appearance", "columns", "breakBefore", "breakInside", "breakAfter", "gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateColumns", "gridTemplateRows", "flexDirection", "flexWrap", "placeContent", "placeItems", "alignContent", "alignItems", "justifyContent", "justifyItems", "gap", "space", "divideWidth", "divideStyle", "divideColor", "divideOpacity", "placeSelf", "alignSelf", "justifySelf", "overflow", "overscrollBehavior", "scrollBehavior", "textOverflow", "hyphens", "whitespace", "textWrap", "wordBreak", "borderRadius", "borderWidth", "borderStyle", "borderColor", "borderOpacity", "backgroundColor", "backgroundOpacity", "backgroundImage", "gradientColorStops", "boxDecorationBreak", "backgroundSize", "backgroundAttachment", "backgroundClip", "backgroundPosition", "backgroundRepeat", "backgroundOrigin", "fill", "stroke", "strokeWidth", "objectFit", "objectPosition", "padding", "textAlign", "textIndent", "verticalAlign", "fontFamily", "fontSize", "fontWeight", "textTransform", "fontStyle", "fontVariantNumeric", "lineHeight", "letterSpacing", "textColor", "textOpacity", "textDecoration", "textDecorationColor", "textDecorationStyle", "textDecorationThickness", "textUnderlineOffset", "fontSmoothing", "placeholderColor", "placeholderOpacity", "caretColor", "accentColor", "opacity", "backgroundBlendMode", "mixBlendMode", "boxShadow", "boxShadowColor", "outlineStyle", "outlineWidth", "outlineOffset", "outlineColor", "ringWidth", "ringColor", "ringOpacity", "ringOffsetWidth", "ringOffsetColor", "blur", "brightness", "contrast", "dropShadow", "grayscale", "hueRotate", "invert", "saturate", "sepia", "filter", "backdropBlur", "backdropBrightness", "backdropContrast", "backdropGrayscale", "backdropHueRotate", "backdropInvert", "backdropOpacity", "backdropSaturate", "backdropSepia", "backdropFilter", "transitionProperty", "transitionDelay", "transitionDuration", "transitionTimingFunction", "willChange", "contain", "content", "forcedColorAdjust"]
    }
    );
    function kf(r, e) {
        return r === void 0 ? e : Array.isArray(r) ? r : [...new Set(e.filter(i => r !== !1 && r[i] !== !1).concat(Object.keys(r).filter(i => r[i] !== !1)))]
    }
    var Sf = P( () => {
        u()
    }
    );
    var Af = {};
    Ge(Af, {
        default: () => Qe
    });
    var Qe, Qi = P( () => {
        u();
        Qe = new Proxy({},{
            get: () => String
        })
    }
    );
    function js(r, e, t) {
        typeof m != "undefined" && m.env.JEST_WORKER_ID || t && Cf.has(t) || (t && Cf.add(t),
        console.warn(""),
        e.forEach(i => console.warn(r, "-", i)))
    }
    function zs(r) {
        return Qe.dim(r)
    }
    var Cf, G, Be = P( () => {
        u();
        Qi();
        Cf = new Set;
        G = {
            info(r, e) {
                js(Qe.bold(Qe.cyan("info")), ...Array.isArray(r) ? [r] : [e, r])
            },
            warn(r, e) {
                ["content-problems"].includes(r) || js(Qe.bold(Qe.yellow("warn")), ...Array.isArray(r) ? [r] : [e, r])
            },
            risk(r, e) {
                js(Qe.bold(Qe.magenta("risk")), ...Array.isArray(r) ? [r] : [e, r])
            }
        }
    }
    );
    var _f = {};
    Ge(_f, {
        default: () => Us
    });
    function qr({version: r, from: e, to: t}) {
        G.warn(`${e}-color-renamed`, [`As of Tailwind CSS ${r}, \`${e}\` has been renamed to \`${t}\`.`, "Update your configuration file to silence this warning."])
    }
    var Us, Vs = P( () => {
        u();
        Be();
        Us = {
            inherit: "inherit",
            current: "currentColor",
            transparent: "transparent",
            black: "#000",
            white: "#fff",
            slate: {
                50: "#f8fafc",
                100: "#f1f5f9",
                200: "#e2e8f0",
                300: "#cbd5e1",
                400: "#94a3b8",
                500: "#64748b",
                600: "#475569",
                700: "#334155",
                800: "#1e293b",
                900: "#0f172a",
                950: "#020617"
            },
            gray: {
                50: "#f9fafb",
                100: "#f3f4f6",
                200: "#e5e7eb",
                300: "#d1d5db",
                400: "#9ca3af",
                500: "#6b7280",
                600: "#4b5563",
                700: "#374151",
                800: "#1f2937",
                900: "#111827",
                950: "#030712"
            },
            zinc: {
                50: "#fafafa",
                100: "#f4f4f5",
                200: "#e4e4e7",
                300: "#d4d4d8",
                400: "#a1a1aa",
                500: "#71717a",
                600: "#52525b",
                700: "#3f3f46",
                800: "#27272a",
                900: "#18181b",
                950: "#09090b"
            },
            neutral: {
                50: "#fafafa",
                100: "#f5f5f5",
                200: "#e5e5e5",
                300: "#d4d4d4",
                400: "#a3a3a3",
                500: "#737373",
                600: "#525252",
                700: "#404040",
                800: "#262626",
                900: "#171717",
                950: "#0a0a0a"
            },
            stone: {
                50: "#fafaf9",
                100: "#f5f5f4",
                200: "#e7e5e4",
                300: "#d6d3d1",
                400: "#a8a29e",
                500: "#78716c",
                600: "#57534e",
                700: "#44403c",
                800: "#292524",
                900: "#1c1917",
                950: "#0c0a09"
            },
            red: {
                50: "#fef2f2",
                100: "#fee2e2",
                200: "#fecaca",
                300: "#fca5a5",
                400: "#f87171",
                500: "#ef4444",
                600: "#dc2626",
                700: "#b91c1c",
                800: "#991b1b",
                900: "#7f1d1d",
                950: "#450a0a"
            },
            orange: {
                50: "#fff7ed",
                100: "#ffedd5",
                200: "#fed7aa",
                300: "#fdba74",
                400: "#fb923c",
                500: "#f97316",
                600: "#ea580c",
                700: "#c2410c",
                800: "#9a3412",
                900: "#7c2d12",
                950: "#431407"
            },
            amber: {
                50: "#fffbeb",
                100: "#fef3c7",
                200: "#fde68a",
                300: "#fcd34d",
                400: "#fbbf24",
                500: "#f59e0b",
                600: "#d97706",
                700: "#b45309",
                800: "#92400e",
                900: "#78350f",
                950: "#451a03"
            },
            yellow: {
                50: "#fefce8",
                100: "#fef9c3",
                200: "#fef08a",
                300: "#fde047",
                400: "#facc15",
                500: "#eab308",
                600: "#ca8a04",
                700: "#a16207",
                800: "#854d0e",
                900: "#713f12",
                950: "#422006"
            },
            lime: {
                50: "#f7fee7",
                100: "#ecfccb",
                200: "#d9f99d",
                300: "#bef264",
                400: "#a3e635",
                500: "#84cc16",
                600: "#65a30d",
                700: "#4d7c0f",
                800: "#3f6212",
                900: "#365314",
                950: "#1a2e05"
            },
            green: {
                50: "#f0fdf4",
                100: "#dcfce7",
                200: "#bbf7d0",
                300: "#86efac",
                400: "#4ade80",
                500: "#22c55e",
                600: "#16a34a",
                700: "#15803d",
                800: "#166534",
                900: "#14532d",
                950: "#052e16"
            },
            emerald: {
                50: "#ecfdf5",
                100: "#d1fae5",
                200: "#a7f3d0",
                300: "#6ee7b7",
                400: "#34d399",
                500: "#10b981",
                600: "#059669",
                700: "#047857",
                800: "#065f46",
                900: "#064e3b",
                950: "#022c22"
            },
            teal: {
                50: "#f0fdfa",
                100: "#ccfbf1",
                200: "#99f6e4",
                300: "#5eead4",
                400: "#2dd4bf",
                500: "#14b8a6",
                600: "#0d9488",
                700: "#0f766e",
                800: "#115e59",
                900: "#134e4a",
                950: "#042f2e"
            },
            cyan: {
                50: "#ecfeff",
                100: "#cffafe",
                200: "#a5f3fc",
                300: "#67e8f9",
                400: "#22d3ee",
                500: "#06b6d4",
                600: "#0891b2",
                700: "#0e7490",
                800: "#155e75",
                900: "#164e63",
                950: "#083344"
            },
            sky: {
                50: "#f0f9ff",
                100: "#e0f2fe",
                200: "#bae6fd",
                300: "#7dd3fc",
                400: "#38bdf8",
                500: "#0ea5e9",
                600: "#0284c7",
                700: "#0369a1",
                800: "#075985",
                900: "#0c4a6e",
                950: "#082f49"
            },
            blue: {
                50: "#eff6ff",
                100: "#dbeafe",
                200: "#bfdbfe",
                300: "#93c5fd",
                400: "#60a5fa",
                500: "#3b82f6",
                600: "#2563eb",
                700: "#1d4ed8",
                800: "#1e40af",
                900: "#1e3a8a",
                950: "#172554"
            },
            indigo: {
                50: "#eef2ff",
                100: "#e0e7ff",
                200: "#c7d2fe",
                300: "#a5b4fc",
                400: "#818cf8",
                500: "#6366f1",
                600: "#4f46e5",
                700: "#4338ca",
                800: "#3730a3",
                900: "#312e81",
                950: "#1e1b4b"
            },
            violet: {
                50: "#f5f3ff",
                100: "#ede9fe",
                200: "#ddd6fe",
                300: "#c4b5fd",
                400: "#a78bfa",
                500: "#8b5cf6",
                600: "#7c3aed",
                700: "#6d28d9",
                800: "#5b21b6",
                900: "#4c1d95",
                950: "#2e1065"
            },
            purple: {
                50: "#faf5ff",
                100: "#f3e8ff",
                200: "#e9d5ff",
                300: "#d8b4fe",
                400: "#c084fc",
                500: "#a855f7",
                600: "#9333ea",
                700: "#7e22ce",
                800: "#6b21a8",
                900: "#581c87",
                950: "#3b0764"
            },
            fuchsia: {
                50: "#fdf4ff",
                100: "#fae8ff",
                200: "#f5d0fe",
                300: "#f0abfc",
                400: "#e879f9",
                500: "#d946ef",
                600: "#c026d3",
                700: "#a21caf",
                800: "#86198f",
                900: "#701a75",
                950: "#4a044e"
            },
            pink: {
                50: "#fdf2f8",
                100: "#fce7f3",
                200: "#fbcfe8",
                300: "#f9a8d4",
                400: "#f472b6",
                500: "#ec4899",
                600: "#db2777",
                700: "#be185d",
                800: "#9d174d",
                900: "#831843",
                950: "#500724"
            },
            rose: {
                50: "#fff1f2",
                100: "#ffe4e6",
                200: "#fecdd3",
                300: "#fda4af",
                400: "#fb7185",
                500: "#f43f5e",
                600: "#e11d48",
                700: "#be123c",
                800: "#9f1239",
                900: "#881337",
                950: "#4c0519"
            },
            get lightBlue() {
                return qr({
                    version: "v2.2",
                    from: "lightBlue",
                    to: "sky"
                }),
                this.sky
            },
            get warmGray() {
                return qr({
                    version: "v3.0",
                    from: "warmGray",
                    to: "stone"
                }),
                this.stone
            },
            get trueGray() {
                return qr({
                    version: "v3.0",
                    from: "trueGray",
                    to: "neutral"
                }),
                this.neutral
            },
            get coolGray() {
                return qr({
                    version: "v3.0",
                    from: "coolGray",
                    to: "gray"
                }),
                this.gray
            },
            get blueGray() {
                return qr({
                    version: "v3.0",
                    from: "blueGray",
                    to: "slate"
                }),
                this.slate
            }
        }
    }
    );
    function Hs(r, ...e) {
        for (let t of e) {
            for (let i in t)
                r?.hasOwnProperty?.(i) || (r[i] = t[i]);
            for (let i of Object.getOwnPropertySymbols(t))
                r?.hasOwnProperty?.(i) || (r[i] = t[i])
        }
        return r
    }
    var Ef = P( () => {
        u()
    }
    );
    function kt(r) {
        if (Array.isArray(r))
            return r;
        let e = r.split("[").length - 1
          , t = r.split("]").length - 1;
        if (e !== t)
            throw new Error(`Path is invalid. Has unbalanced brackets: ${r}`);
        return r.split(/\.(?![^\[]*\])|[\[\]]/g).filter(Boolean)
    }
    var Yi = P( () => {
        u()
    }
    );
    function we(r, e) {
        return Ki.future.includes(e) ? r.future === "all" || (r?.future?.[e] ?? Of[e] ?? !1) : Ki.experimental.includes(e) ? r.experimental === "all" || (r?.experimental?.[e] ?? Of[e] ?? !1) : !1
    }
    function Tf(r) {
        return r.experimental === "all" ? Ki.experimental : Object.keys(r?.experimental ?? {}).filter(e => Ki.experimental.includes(e) && r.experimental[e])
    }
    function Rf(r) {
        if (m.env.JEST_WORKER_ID === void 0 && Tf(r).length > 0) {
            let e = Tf(r).map(t => Qe.yellow(t)).join(", ");
            G.warn("experimental-flags-enabled", [`You have enabled experimental features: ${e}`, "Experimental features in Tailwind CSS are not covered by semver, may introduce breaking changes, and can change at any time."])
        }
    }
    var Of, Ki, ct = P( () => {
        u();
        Qi();
        Be();
        Of = {
            optimizeUniversalDefaults: !1,
            generalizedModifiers: !0,
            disableColorOpacityUtilitiesByDefault: !1,
            relativeContentPathsByDefault: !1
        },
        Ki = {
            future: ["hoverOnlyWhenSupported", "respectDefaultRingColorOpacity", "disableColorOpacityUtilitiesByDefault", "relativeContentPathsByDefault"],
            experimental: ["optimizeUniversalDefaults", "generalizedModifiers"]
        }
    }
    );
    function Pf(r) {
        ( () => {
            if (r.purge || !r.content || !Array.isArray(r.content) && !(typeof r.content == "object" && r.content !== null))
                return !1;
            if (Array.isArray(r.content))
                return r.content.every(t => typeof t == "string" ? !0 : !(typeof t?.raw != "string" || t?.extension && typeof t?.extension != "string"));
            if (typeof r.content == "object" && r.content !== null) {
                if (Object.keys(r.content).some(t => !["files", "relative", "extract", "transform"].includes(t)))
                    return !1;
                if (Array.isArray(r.content.files)) {
                    if (!r.content.files.every(t => typeof t == "string" ? !0 : !(typeof t?.raw != "string" || t?.extension && typeof t?.extension != "string")))
                        return !1;
                    if (typeof r.content.extract == "object") {
                        for (let t of Object.values(r.content.extract))
                            if (typeof t != "function")
                                return !1
                    } else if (!(r.content.extract === void 0 || typeof r.content.extract == "function"))
                        return !1;
                    if (typeof r.content.transform == "object") {
                        for (let t of Object.values(r.content.transform))
                            if (typeof t != "function")
                                return !1
                    } else if (!(r.content.transform === void 0 || typeof r.content.transform == "function"))
                        return !1;
                    if (typeof r.content.relative != "boolean" && typeof r.content.relative != "undefined")
                        return !1
                }
                return !0
            }
            return !1
        }
        )() || G.warn("purge-deprecation", ["The `purge`/`content` options have changed in Tailwind CSS v3.0.", "Update your configuration file to eliminate this warning.", "https://tailwindcss.com/docs/upgrade-guide#configure-content-sources"]),
        r.safelist = ( () => {
            let {content: t, purge: i, safelist: n} = r;
            return Array.isArray(n) ? n : Array.isArray(t?.safelist) ? t.safelist : Array.isArray(i?.safelist) ? i.safelist : Array.isArray(i?.options?.safelist) ? i.options.safelist : []
        }
        )(),
        r.blocklist = ( () => {
            let {blocklist: t} = r;
            if (Array.isArray(t)) {
                if (t.every(i => typeof i == "string"))
                    return t;
                G.warn("blocklist-invalid", ["The `blocklist` option must be an array of strings.", "https://tailwindcss.com/docs/content-configuration#discarding-classes"])
            }
            return []
        }
        )(),
        typeof r.prefix == "function" ? (G.warn("prefix-function", ["As of Tailwind CSS v3.0, `prefix` cannot be a function.", "Update `prefix` in your configuration to be a string to eliminate this warning.", "https://tailwindcss.com/docs/upgrade-guide#prefix-cannot-be-a-function"]),
        r.prefix = "") : r.prefix = r.prefix ?? "",
        r.content = {
            relative: ( () => {
                let {content: t} = r;
                return t?.relative ? t.relative : we(r, "relativeContentPathsByDefault")
            }
            )(),
            files: ( () => {
                let {content: t, purge: i} = r;
                return Array.isArray(i) ? i : Array.isArray(i?.content) ? i.content : Array.isArray(t) ? t : Array.isArray(t?.content) ? t.content : Array.isArray(t?.files) ? t.files : []
            }
            )(),
            extract: ( () => {
                let t = ( () => r.purge?.extract ? r.purge.extract : r.content?.extract ? r.content.extract : r.purge?.extract?.DEFAULT ? r.purge.extract.DEFAULT : r.content?.extract?.DEFAULT ? r.content.extract.DEFAULT : r.purge?.options?.extractors ? r.purge.options.extractors : r.content?.options?.extractors ? r.content.options.extractors : {})()
                  , i = {}
                  , n = ( () => {
                    if (r.purge?.options?.defaultExtractor)
                        return r.purge.options.defaultExtractor;
                    if (r.content?.options?.defaultExtractor)
                        return r.content.options.defaultExtractor
                }
                )();
                if (n !== void 0 && (i.DEFAULT = n),
                typeof t == "function")
                    i.DEFAULT = t;
                else if (Array.isArray(t))
                    for (let {extensions: s, extractor: a} of t ?? [])
                        for (let o of s)
                            i[o] = a;
                else
                    typeof t == "object" && t !== null && Object.assign(i, t);
                return i
            }
            )(),
            transform: ( () => {
                let t = ( () => r.purge?.transform ? r.purge.transform : r.content?.transform ? r.content.transform : r.purge?.transform?.DEFAULT ? r.purge.transform.DEFAULT : r.content?.transform?.DEFAULT ? r.content.transform.DEFAULT : {})()
                  , i = {};
                return typeof t == "function" ? i.DEFAULT = t : typeof t == "object" && t !== null && Object.assign(i, t),
                i
            }
            )()
        };
        for (let t of r.content.files)
            if (typeof t == "string" && /{([^,]*?)}/g.test(t)) {
                G.warn("invalid-glob-braces", [`The glob pattern ${zs(t)} in your Tailwind CSS configuration is invalid.`, `Update it to ${zs(t.replace(/{([^,]*?)}/g, "$1"))} to silence this warning.`]);
                break
            }
        return r
    }
    var If = P( () => {
        u();
        ct();
        Be()
    }
    );
    function ke(r) {
        if (Object.prototype.toString.call(r) !== "[object Object]")
            return !1;
        let e = Object.getPrototypeOf(r);
        return e === null || Object.getPrototypeOf(e) === null
    }
    var Kt = P( () => {
        u()
    }
    );
    function St(r) {
        return Array.isArray(r) ? r.map(e => St(e)) : typeof r == "object" && r !== null ? Object.fromEntries(Object.entries(r).map( ([e,t]) => [e, St(t)])) : r
    }
    var Xi = P( () => {
        u()
    }
    );
    function jt(r) {
        return r.replace(/\\,/g, "\\2c ")
    }
    var Zi = P( () => {
        u()
    }
    );
    var Ws, Df = P( () => {
        u();
        Ws = {
            aliceblue: [240, 248, 255],
            antiquewhite: [250, 235, 215],
            aqua: [0, 255, 255],
            aquamarine: [127, 255, 212],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            bisque: [255, 228, 196],
            black: [0, 0, 0],
            blanchedalmond: [255, 235, 205],
            blue: [0, 0, 255],
            blueviolet: [138, 43, 226],
            brown: [165, 42, 42],
            burlywood: [222, 184, 135],
            cadetblue: [95, 158, 160],
            chartreuse: [127, 255, 0],
            chocolate: [210, 105, 30],
            coral: [255, 127, 80],
            cornflowerblue: [100, 149, 237],
            cornsilk: [255, 248, 220],
            crimson: [220, 20, 60],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgoldenrod: [184, 134, 11],
            darkgray: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkgrey: [169, 169, 169],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkseagreen: [143, 188, 143],
            darkslateblue: [72, 61, 139],
            darkslategray: [47, 79, 79],
            darkslategrey: [47, 79, 79],
            darkturquoise: [0, 206, 209],
            darkviolet: [148, 0, 211],
            deeppink: [255, 20, 147],
            deepskyblue: [0, 191, 255],
            dimgray: [105, 105, 105],
            dimgrey: [105, 105, 105],
            dodgerblue: [30, 144, 255],
            firebrick: [178, 34, 34],
            floralwhite: [255, 250, 240],
            forestgreen: [34, 139, 34],
            fuchsia: [255, 0, 255],
            gainsboro: [220, 220, 220],
            ghostwhite: [248, 248, 255],
            gold: [255, 215, 0],
            goldenrod: [218, 165, 32],
            gray: [128, 128, 128],
            green: [0, 128, 0],
            greenyellow: [173, 255, 47],
            grey: [128, 128, 128],
            honeydew: [240, 255, 240],
            hotpink: [255, 105, 180],
            indianred: [205, 92, 92],
            indigo: [75, 0, 130],
            ivory: [255, 255, 240],
            khaki: [240, 230, 140],
            lavender: [230, 230, 250],
            lavenderblush: [255, 240, 245],
            lawngreen: [124, 252, 0],
            lemonchiffon: [255, 250, 205],
            lightblue: [173, 216, 230],
            lightcoral: [240, 128, 128],
            lightcyan: [224, 255, 255],
            lightgoldenrodyellow: [250, 250, 210],
            lightgray: [211, 211, 211],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255, 182, 193],
            lightsalmon: [255, 160, 122],
            lightseagreen: [32, 178, 170],
            lightskyblue: [135, 206, 250],
            lightslategray: [119, 136, 153],
            lightslategrey: [119, 136, 153],
            lightsteelblue: [176, 196, 222],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            limegreen: [50, 205, 50],
            linen: [250, 240, 230],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            mediumaquamarine: [102, 205, 170],
            mediumblue: [0, 0, 205],
            mediumorchid: [186, 85, 211],
            mediumpurple: [147, 112, 219],
            mediumseagreen: [60, 179, 113],
            mediumslateblue: [123, 104, 238],
            mediumspringgreen: [0, 250, 154],
            mediumturquoise: [72, 209, 204],
            mediumvioletred: [199, 21, 133],
            midnightblue: [25, 25, 112],
            mintcream: [245, 255, 250],
            mistyrose: [255, 228, 225],
            moccasin: [255, 228, 181],
            navajowhite: [255, 222, 173],
            navy: [0, 0, 128],
            oldlace: [253, 245, 230],
            olive: [128, 128, 0],
            olivedrab: [107, 142, 35],
            orange: [255, 165, 0],
            orangered: [255, 69, 0],
            orchid: [218, 112, 214],
            palegoldenrod: [238, 232, 170],
            palegreen: [152, 251, 152],
            paleturquoise: [175, 238, 238],
            palevioletred: [219, 112, 147],
            papayawhip: [255, 239, 213],
            peachpuff: [255, 218, 185],
            peru: [205, 133, 63],
            pink: [255, 192, 203],
            plum: [221, 160, 221],
            powderblue: [176, 224, 230],
            purple: [128, 0, 128],
            rebeccapurple: [102, 51, 153],
            red: [255, 0, 0],
            rosybrown: [188, 143, 143],
            royalblue: [65, 105, 225],
            saddlebrown: [139, 69, 19],
            salmon: [250, 128, 114],
            sandybrown: [244, 164, 96],
            seagreen: [46, 139, 87],
            seashell: [255, 245, 238],
            sienna: [160, 82, 45],
            silver: [192, 192, 192],
            skyblue: [135, 206, 235],
            slateblue: [106, 90, 205],
            slategray: [112, 128, 144],
            slategrey: [112, 128, 144],
            snow: [255, 250, 250],
            springgreen: [0, 255, 127],
            steelblue: [70, 130, 180],
            tan: [210, 180, 140],
            teal: [0, 128, 128],
            thistle: [216, 191, 216],
            tomato: [255, 99, 71],
            turquoise: [64, 224, 208],
            violet: [238, 130, 238],
            wheat: [245, 222, 179],
            white: [255, 255, 255],
            whitesmoke: [245, 245, 245],
            yellow: [255, 255, 0],
            yellowgreen: [154, 205, 50]
        }
    }
    );
    function $r(r, {loose: e=!1}={}) {
        if (typeof r != "string")
            return null;
        if (r = r.trim(),
        r === "transparent")
            return {
                mode: "rgb",
                color: ["0", "0", "0"],
                alpha: "0"
            };
        if (r in Ws)
            return {
                mode: "rgb",
                color: Ws[r].map(s => s.toString())
            };
        let t = r.replace(zv, (s, a, o, l, c) => ["#", a, a, o, o, l, l, c ? c + c : ""].join("")).match(jv);
        if (t !== null)
            return {
                mode: "rgb",
                color: [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)].map(s => s.toString()),
                alpha: t[4] ? (parseInt(t[4], 16) / 255).toString() : void 0
            };
        let i = r.match(Uv) ?? r.match(Vv);
        if (i === null)
            return null;
        let n = [i[2], i[3], i[4]].filter(Boolean).map(s => s.toString());
        return n.length === 2 && n[0].startsWith("var(") ? {
            mode: i[1],
            color: [n[0]],
            alpha: n[1]
        } : !e && n.length !== 3 || n.length < 3 && !n.some(s => /^var\(.*?\)$/.test(s)) ? null : {
            mode: i[1],
            color: n,
            alpha: i[5]?.toString?.()
        }
    }
    function Gs({mode: r, color: e, alpha: t}) {
        let i = t !== void 0;
        return r === "rgba" || r === "hsla" ? `${r}(${e.join(", ")}${i ? `, ${t}` : ""})` : `${r}(${e.join(" ")}${i ? ` / ${t}` : ""})`
    }
    var jv, zv, At, Ji, qf, Ct, Uv, Vv, Qs = P( () => {
        u();
        Df();
        jv = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i,
        zv = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i,
        At = /(?:\d+|\d*\.\d+)%?/,
        Ji = /(?:\s*,\s*|\s+)/,
        qf = /\s*[,/]\s*/,
        Ct = /var\(--(?:[^ )]*?)(?:,(?:[^ )]*?|var\(--[^ )]*?\)))?\)/,
        Uv = new RegExp(`^(rgba?)\\(\\s*(${At.source}|${Ct.source})(?:${Ji.source}(${At.source}|${Ct.source}))?(?:${Ji.source}(${At.source}|${Ct.source}))?(?:${qf.source}(${At.source}|${Ct.source}))?\\s*\\)$`),
        Vv = new RegExp(`^(hsla?)\\(\\s*((?:${At.source})(?:deg|rad|grad|turn)?|${Ct.source})(?:${Ji.source}(${At.source}|${Ct.source}))?(?:${Ji.source}(${At.source}|${Ct.source}))?(?:${qf.source}(${At.source}|${Ct.source}))?\\s*\\)$`)
    }
    );
    function Je(r, e, t) {
        if (typeof r == "function")
            return r({
                opacityValue: e
            });
        let i = $r(r, {
            loose: !0
        });
        return i === null ? t : Gs({
            ...i,
            alpha: e
        })
    }
    function Ae({color: r, property: e, variable: t}) {
        let i = [].concat(e);
        if (typeof r == "function")
            return {
                [t]: "1",
                ...Object.fromEntries(i.map(s => [s, r({
                    opacityVariable: t,
                    opacityValue: `var(${t}, 1)`
                })]))
            };
        let n = $r(r);
        return n === null ? Object.fromEntries(i.map(s => [s, r])) : n.alpha !== void 0 ? Object.fromEntries(i.map(s => [s, r])) : {
            [t]: "1",
            ...Object.fromEntries(i.map(s => [s, Gs({
                ...n,
                alpha: `var(${t}, 1)`
            })]))
        }
    }
    var Lr = P( () => {
        u();
        Qs()
    }
    );
    function ve(r, e) {
        let t = []
          , i = []
          , n = 0
          , s = !1;
        for (let a = 0; a < r.length; a++) {
            let o = r[a];
            t.length === 0 && o === e[0] && !s && (e.length === 1 || r.slice(a, a + e.length) === e) && (i.push(r.slice(n, a)),
            n = a + e.length),
            s = s ? !1 : o === "\\",
            o === "(" || o === "[" || o === "{" ? t.push(o) : (o === ")" && t[t.length - 1] === "(" || o === "]" && t[t.length - 1] === "[" || o === "}" && t[t.length - 1] === "{") && t.pop()
        }
        return i.push(r.slice(n)),
        i
    }
    var zt = P( () => {
        u()
    }
    );
    function en(r) {
        return ve(r, ",").map(t => {
            let i = t.trim()
              , n = {
                raw: i
            }
              , s = i.split(Wv)
              , a = new Set;
            for (let o of s)
                $f.lastIndex = 0,
                !a.has("KEYWORD") && Hv.has(o) ? (n.keyword = o,
                a.add("KEYWORD")) : $f.test(o) ? a.has("X") ? a.has("Y") ? a.has("BLUR") ? a.has("SPREAD") || (n.spread = o,
                a.add("SPREAD")) : (n.blur = o,
                a.add("BLUR")) : (n.y = o,
                a.add("Y")) : (n.x = o,
                a.add("X")) : n.color ? (n.unknown || (n.unknown = []),
                n.unknown.push(o)) : n.color = o;
            return n.valid = n.x !== void 0 && n.y !== void 0,
            n
        }
        )
    }
    function Lf(r) {
        return r.map(e => e.valid ? [e.keyword, e.x, e.y, e.blur, e.spread, e.color].filter(Boolean).join(" ") : e.raw).join(", ")
    }
    var Hv, Wv, $f, Ys = P( () => {
        u();
        zt();
        Hv = new Set(["inset", "inherit", "initial", "revert", "unset"]),
        Wv = /\ +(?![^(]*\))/g,
        $f = /^-?(\d+|\.\d+)(.*?)$/g
    }
    );
    function Ks(r) {
        return Gv.some(e => new RegExp(`^${e}\\(.*\\)`).test(r))
    }
    function K(r, e=null, t=!0) {
        let i = e && Qv.has(e.property);
        return r.startsWith("--") && !i ? `var(${r})` : r.includes("url(") ? r.split(/(url\(.*?\))/g).filter(Boolean).map(n => /^url\(.*?\)$/.test(n) ? n : K(n, e, !1)).join("") : (r = r.replace(/([^\\])_+/g, (n, s) => s + " ".repeat(n.length - 1)).replace(/^_/g, " ").replace(/\\_/g, "_"),
        t && (r = r.trim()),
        r = Yv(r),
        r)
    }
    function Ye(r) {
        return r.includes("=") && (r = r.replace(/(=.*)/g, (e, t) => {
            if (t[1] === "'" || t[1] === '"')
                return t;
            if (t.length > 2) {
                let i = t[t.length - 1];
                if (t[t.length - 2] === " " && (i === "i" || i === "I" || i === "s" || i === "S"))
                    return `="${t.slice(1, -2)}" ${t[t.length - 1]}`
            }
            return `="${t.slice(1)}"`
        }
        )),
        r
    }
    function Yv(r) {
        let e = ["theme"]
          , t = ["min-content", "max-content", "fit-content", "safe-area-inset-top", "safe-area-inset-right", "safe-area-inset-bottom", "safe-area-inset-left", "titlebar-area-x", "titlebar-area-y", "titlebar-area-width", "titlebar-area-height", "keyboard-inset-top", "keyboard-inset-right", "keyboard-inset-bottom", "keyboard-inset-left", "keyboard-inset-width", "keyboard-inset-height", "radial-gradient", "linear-gradient", "conic-gradient", "repeating-radial-gradient", "repeating-linear-gradient", "repeating-conic-gradient", "anchor-size"];
        return r.replace(/(calc|min|max|clamp)\(.+\)/g, i => {
            let n = "";
            function s() {
                let a = n.trimEnd();
                return a[a.length - 1]
            }
            for (let a = 0; a < i.length; a++) {
                let o = function(f) {
                    return f.split("").every( (d, p) => i[a + p] === d)
                }
                  , l = function(f) {
                    let d = 1 / 0;
                    for (let h of f) {
                        let b = i.indexOf(h, a);
                        b !== -1 && b < d && (d = b)
                    }
                    let p = i.slice(a, d);
                    return a += p.length - 1,
                    p
                }
                  , c = i[a];
                if (o("var"))
                    n += l([")", ","]);
                else if (t.some(f => o(f))) {
                    let f = t.find(d => o(d));
                    n += f,
                    a += f.length - 1
                } else
                    e.some(f => o(f)) ? n += l([")"]) : o("[") ? n += l(["]"]) : ["+", "-", "*", "/"].includes(c) && !["(", "+", "-", "*", "/", ","].includes(s()) ? n += ` ${c} ` : n += c
            }
            return n.replace(/\s+/g, " ")
        }
        )
    }
    function Xs(r) {
        return r.startsWith("url(")
    }
    function Zs(r) {
        return !isNaN(Number(r)) || Ks(r)
    }
    function Mr(r) {
        return r.endsWith("%") && Zs(r.slice(0, -1)) || Ks(r)
    }
    function Nr(r) {
        return r === "0" || new RegExp(`^[+-]?[0-9]*.?[0-9]+(?:[eE][+-]?[0-9]+)?${Xv}$`).test(r) || Ks(r)
    }
    function Mf(r) {
        return Zv.has(r)
    }
    function Nf(r) {
        let e = en(K(r));
        for (let t of e)
            if (!t.valid)
                return !1;
        return !0
    }
    function Bf(r) {
        let e = 0;
        return ve(r, "_").every(i => (i = K(i),
        i.startsWith("var(") ? !0 : $r(i, {
            loose: !0
        }) !== null ? (e++,
        !0) : !1)) ? e > 0 : !1
    }
    function Ff(r) {
        let e = 0;
        return ve(r, ",").every(i => (i = K(i),
        i.startsWith("var(") ? !0 : Xs(i) || ex(i) || ["element(", "image(", "cross-fade(", "image-set("].some(n => i.startsWith(n)) ? (e++,
        !0) : !1)) ? e > 0 : !1
    }
    function ex(r) {
        r = K(r);
        for (let e of Jv)
            if (r.startsWith(`${e}(`))
                return !0;
        return !1
    }
    function jf(r) {
        let e = 0;
        return ve(r, "_").every(i => (i = K(i),
        i.startsWith("var(") ? !0 : tx.has(i) || Nr(i) || Mr(i) ? (e++,
        !0) : !1)) ? e > 0 : !1
    }
    function zf(r) {
        let e = 0;
        return ve(r, ",").every(i => (i = K(i),
        i.startsWith("var(") ? !0 : i.includes(" ") && !/(['"])([^"']+)\1/g.test(i) || /^\d/g.test(i) ? !1 : (e++,
        !0))) ? e > 0 : !1
    }
    function Uf(r) {
        return rx.has(r)
    }
    function Vf(r) {
        return ix.has(r)
    }
    function Hf(r) {
        return nx.has(r)
    }
    var Gv, Qv, Kv, Xv, Zv, Jv, tx, rx, ix, nx, Br = P( () => {
        u();
        Qs();
        Ys();
        zt();
        Gv = ["min", "max", "clamp", "calc"];
        Qv = new Set(["scroll-timeline-name", "timeline-scope", "view-timeline-name", "font-palette", "anchor-name", "anchor-scope", "position-anchor", "position-try-options", "scroll-timeline", "animation-timeline", "view-timeline", "position-try"]);
        Kv = ["cm", "mm", "Q", "in", "pc", "pt", "px", "em", "ex", "ch", "rem", "lh", "rlh", "vw", "vh", "vmin", "vmax", "vb", "vi", "svw", "svh", "lvw", "lvh", "dvw", "dvh", "cqw", "cqh", "cqi", "cqb", "cqmin", "cqmax"],
        Xv = `(?:${Kv.join("|")})`;
        Zv = new Set(["thin", "medium", "thick"]);
        Jv = new Set(["conic-gradient", "linear-gradient", "radial-gradient", "repeating-conic-gradient", "repeating-linear-gradient", "repeating-radial-gradient"]);
        tx = new Set(["center", "top", "right", "bottom", "left"]);
        rx = new Set(["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-serif", "ui-sans-serif", "ui-monospace", "ui-rounded", "math", "emoji", "fangsong"]);
        ix = new Set(["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large"]);
        nx = new Set(["larger", "smaller"])
    }
    );
    function Wf(r) {
        let e = ["cover", "contain"];
        return ve(r, ",").every(t => {
            let i = ve(t, "_").filter(Boolean);
            return i.length === 1 && e.includes(i[0]) ? !0 : i.length !== 1 && i.length !== 2 ? !1 : i.every(n => Nr(n) || Mr(n) || n === "auto")
        }
        )
    }
    var Gf = P( () => {
        u();
        Br();
        zt()
    }
    );
    function Qf(r, e) {
        r.walkClasses(t => {
            t.value = e(t.value),
            t.raws && t.raws.value && (t.raws.value = jt(t.raws.value))
        }
        )
    }
    function Yf(r, e) {
        if (!_t(r))
            return;
        let t = r.slice(1, -1);
        if (!!e(t))
            return K(t)
    }
    function sx(r, e={}, t) {
        let i = e[r];
        if (i !== void 0)
            return xt(i);
