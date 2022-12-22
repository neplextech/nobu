type GenericScreen = Omit<NobuSplitView, "url"> & { default?: boolean };
type ScreenType = "mobile" | "tablet" | "all";
type FilterFn = (screen: GenericScreen) => boolean;

export const MobileScreens: GenericScreen[] = [
    {
        name: "Apple iPhone 12 Pro Max",
        width: 1284,
        height: 2778,
        cw: 428,
        ch: 926,
        type: "mobile",
        id: 0,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        default: true
    },
    {
        name: "Apple iPhone 12, 12 Pro",
        width: 1170,
        height: 2532,
        cw: 390,
        ch: 844,
        type: "mobile",
        id: 1,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPhone 12 mini",
        width: 1125,
        height: 2436,
        cw: 375,
        ch: 812,
        type: "mobile",
        id: 2,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPhone SE (2nd gen)",
        width: 750,
        height: 1334,
        cw: 375,
        ch: 667,
        type: "mobile",
        id: 3,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPhone 11 Pro Max, XS Max",
        width: 1242,
        height: 2688,
        cw: 414,
        ch: 896,
        type: "mobile",
        default: true,
        id: 4,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPhone 11, XR",
        width: 828,
        height: 1792,
        cw: 414,
        ch: 896,
        type: "mobile",
        id: 5,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPhone X, XS, 11 Pro",
        width: 1125,
        height: 2436,
        cw: 375,
        ch: 812,
        type: "mobile",
        id: 6,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPhone 7, iPhone 8",
        width: 750,
        height: 1334,
        cw: 375,
        ch: 667,
        default: true,
        type: "mobile",
        id: 7,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPhone 6+, 6S+, 7+, 8+",
        width: 1080,
        height: 1920,
        cw: 414,
        ch: 736,
        type: "mobile",
        id: 8,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPhone 6, 6S, SE2",
        width: 750,
        height: 1334,
        cw: 375,
        ch: 667,
        type: "mobile",
        id: 9,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPhone 5, SE",
        width: 640,
        height: 1136,
        cw: 320,
        ch: 568,
        type: "mobile",
        id: 10,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPhone 4",
        width: 640,
        height: 960,
        cw: 320,
        ch: 480,
        type: "mobile",
        id: 11,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPhone 3",
        width: 320,
        height: 480,
        cw: 320,
        ch: 480,
        type: "mobile",
        id: 12,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPod Touch",
        width: 640,
        height: 1136,
        cw: 320,
        ch: 568,
        type: "mobile",
        id: 13,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "LG G5",
        width: 1440,
        height: 2560,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 14,
        userAgent:
            "Mozilla/5.0 (Linux; Android 7.0; LGAS992) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.86 Mobile Safari/537.36"
    },
    {
        name: "LG G4",
        width: 1440,
        height: 2560,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 15,
        userAgent:
            "Mozilla/5.0 (Linux; Android 7.0; LGAS992) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.86 Mobile Safari/537.36"
    },
    {
        name: "LG G3",
        width: 1440,
        height: 2560,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 16,
        userAgent:
            "Mozilla/5.0 (Linux; Android 7.0; LGAS992) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.86 Mobile Safari/537.36"
    },
    {
        name: "LG Optimus G",
        width: 768,
        height: 1280,
        cw: 384,
        ch: 640,
        type: "mobile",
        id: 17,
        userAgent:
            "Mozilla/5.0 (Linux; Android 7.0; LGAS992) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.86 Mobile Safari/537.36"
    },
    {
        name: "Samsung Galaxy S8+",
        width: 1440,
        height: 2960,
        cw: 360,
        ch: 740,
        type: "mobile",
        id: 18,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy S8",
        width: 1440,
        height: 2960,
        cw: 360,
        ch: 740,
        type: "mobile",
        id: 19,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy S7, S7 edge",
        width: 1440,
        height: 2560,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 20,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy S6",
        width: 1440,
        height: 2560,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 21,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy S5",
        width: 1080,
        height: 1920,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 22,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy S4",
        width: 1080,
        height: 1920,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 23,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy S4 mini",
        width: 540,
        height: 960,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 24,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy S3",
        width: 720,
        height: 1280,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 25,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy S3 mini",
        width: 480,
        height: 800,
        cw: 320,
        ch: 533,
        type: "mobile",
        id: 26,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy S2",
        width: 480,
        height: 800,
        cw: 320,
        ch: 533,
        type: "mobile",
        id: 27,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy S",
        width: 480,
        height: 800,
        cw: 320,
        ch: 533,
        type: "mobile",
        id: 28,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy Nexus",
        width: 720,
        height: 1200,
        cw: 360,
        ch: 600,
        type: "mobile",
        id: 29,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy Note 8",
        width: 1440,
        height: 2960,
        cw: 360,
        ch: 740,
        type: "mobile",
        id: 30,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy Note 4",
        width: 1440,
        height: 2560,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 31,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy Note 3",
        width: 1080,
        height: 1920,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 32,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy Note 2",
        width: 720,
        height: 1280,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 33,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Galaxy Note",
        width: 800,
        height: 1280,
        cw: 400,
        ch: 640,
        type: "mobile",
        id: 34,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "OnePlus 6",
        width: 1080,
        height: 2280,
        cw: 384,
        ch: 783,
        type: "mobile",
        id: 35,
        userAgent:
            "Mozilla/5.0 (Linux; Android 10; GM1911 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36 Instagram 169.1.0.29.135 Android (29/10; 560dpi; 1440x3120; OnePlus; GM1911; OnePlus7Pro; qcom; en_US; 262886996)"
    },
    {
        name: "LG Nexus 5",
        width: 1080,
        height: 1920,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 36,
        userAgent:
            "Mozilla/5.0 (Linux; Android 7.0; LGAS992) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.86 Mobile Safari/537.36"
    },
    {
        name: "LG Nexus 4",
        width: 768,
        height: 1280,
        cw: 384,
        ch: 640,
        type: "mobile",
        id: 37,
        userAgent:
            "Mozilla/5.0 (Linux; Android 7.0; LGAS992) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.86 Mobile Safari/537.36"
    },
    {
        name: "Microsoft Lumia 1520",
        width: 1080,
        height: 1920,
        cw: 432,
        ch: 768,
        type: "mobile",
        id: 38,
        userAgent:
            "Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.79 Mobile Safari/537.36 EdgA/107.0.1418.62"
    },
    {
        name: "Microsoft Lumia 1020",
        width: 768,
        height: 1280,
        cw: 320,
        ch: 480,
        type: "mobile",
        id: 39,
        userAgent:
            "Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.79 Mobile Safari/537.36 EdgA/107.0.1418.62"
    },
    {
        name: "Microsoft Lumia 925",
        width: 768,
        height: 1280,
        cw: 320,
        ch: 480,
        type: "mobile",
        id: 40,
        userAgent:
            "Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.79 Mobile Safari/537.36 EdgA/107.0.1418.62"
    },
    {
        name: "Microsoft Lumia 920",
        width: 768,
        height: 1280,
        cw: 320,
        ch: 480,
        type: "mobile",
        id: 41,
        userAgent:
            "Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.79 Mobile Safari/537.36 EdgA/107.0.1418.62"
    },
    {
        name: "Microsoft Lumia 900",
        width: 480,
        height: 800,
        cw: 320,
        ch: 480,
        type: "mobile",
        id: 42,
        userAgent:
            "Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.79 Mobile Safari/537.36 EdgA/107.0.1418.62"
    },
    {
        name: "Microsoft Lumia 830",
        width: 720,
        height: 1280,
        cw: 320,
        ch: 480,
        type: "mobile",
        id: 43,
        userAgent:
            "Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.79 Mobile Safari/537.36 EdgA/107.0.1418.62"
    },
    {
        name: "Microsoft Lumia 620",
        width: 480,
        height: 800,
        cw: 320,
        ch: 480,
        type: "mobile",
        id: 44,
        userAgent:
            "Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.79 Mobile Safari/537.36 EdgA/107.0.1418.62"
    },
    {
        name: "Motorola Nexus 6",
        width: 1440,
        height: 2560,
        cw: 412,
        ch: 690,
        type: "mobile",
        id: 45,
        userAgent:
            "Mozilla/5.0 (Linux; Android 7.1.1; Moto G (5S) Build/NPPS26.102-49-11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.91 Mobile Safari/537.36"
    },
    {
        name: "HTC One",
        width: 1080,
        height: 1920,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 46,
        userAgent:
            "Mozilla/5.0 (Linux; Android 8.1.0; HTC Build/OPM2.171019.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.97 Mobile Safari/537.36"
    },
    {
        name: "HTC 8X",
        width: 720,
        height: 1280,
        cw: 320,
        ch: 480,
        type: "mobile",
        id: 47,
        userAgent:
            "Mozilla/5.0 (Linux; Android 8.1.0; HTC Build/OPM2.171019.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.97 Mobile Safari/537.36"
    },
    {
        name: "HTC Evo 3D",
        width: 540,
        height: 960,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 48,
        userAgent:
            "Mozilla/5.0 (Linux; Android 8.1.0; HTC Build/OPM2.171019.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.97 Mobile Safari/537.36"
    },
    {
        name: "Sony Xperia Z3",
        width: 1080,
        height: 1920,
        cw: 360,
        ch: 598,
        type: "mobile",
        id: 49,
        userAgent:
            "Mozilla/5.0 (Linux; Android 8.1; Xperia 1 Build/LMY47I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Mobile Safari/537.36"
    },
    {
        name: "Sony Xperia Z",
        width: 1080,
        height: 1920,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 50,
        userAgent:
            "Mozilla/5.0 (Linux; Android 8.1; Xperia 1 Build/LMY47I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Mobile Safari/537.36"
    },
    {
        name: "Sony Xperia S",
        width: 720,
        height: 1280,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 51,
        userAgent:
            "Mozilla/5.0 (Linux; Android 8.1; Xperia 1 Build/LMY47I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Mobile Safari/537.36"
    },
    {
        name: "Sony Xperia P",
        width: 540,
        height: 960,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 52,
        userAgent:
            "Mozilla/5.0 (Linux; Android 8.1; Xperia 1 Build/LMY47I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Mobile Safari/537.36"
    },
    {
        name: "Xiaomi Redmi Note 8T",
        width: 1080,
        height: 2340,
        cw: 393,
        ch: 775,
        type: "mobile",
        id: 53,
        userAgent:
            "Mozilla/5.0 (Linux; Android 6.0.1; Redmi 4A Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.116 Mobile Safari/537.36"
    },
    {
        name: "Xiaomi Redmi Note 5, 6",
        width: 1080,
        height: 2160,
        cw: 393,
        ch: 739,
        type: "mobile",
        id: 54,
        userAgent:
            "Mozilla/5.0 (Linux; Android 6.0.1; Redmi 4A Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.116 Mobile Safari/537.36"
    },
    {
        name: "Xiaomi Mi 4",
        width: 1080,
        height: 1920,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 55,
        userAgent:
            "Mozilla/5.0 (Linux; Android 6.0.1; Redmi 4A Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.116 Mobile Safari/537.36"
    },
    {
        name: "Xiaomi Mi 3",
        width: 1080,
        height: 1920,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 56,
        userAgent:
            "Mozilla/5.0 (Linux; Android 6.0.1; Redmi 4A Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.116 Mobile Safari/537.36"
    },
    {
        name: "Lenovo K900",
        width: 1080,
        height: 1920,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 57,
        userAgent:
            "Mozilla/5.0 (Linux; Android 4.4.1; Lenovo A859 Build/KOT49E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.93 Mobile Safari/E7FBAF"
    },
    {
        name: "Pantech Vega n°6",
        width: 1080,
        height: 1920,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 58,
        userAgent:
            "Mozilla/5.0 (Linux; Android 4.4.2; en-us; IM-A870K/2.10 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36"
    },
    {
        name: "Blackberry Leap",
        width: 720,
        height: 1280,
        cw: 390,
        ch: 695,
        type: "mobile",
        id: 59,
        userAgent:
            "Mozilla/5.0 (BlackBerry; U; BlackBerry 9780; en-GB) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.546 Mobile Safari/534.8+"
    },
    {
        name: "Blackberry Passport",
        width: 1440,
        height: 1440,
        cw: 504,
        ch: 504,
        type: "mobile",
        id: 60,
        userAgent:
            "Mozilla/5.0 (BlackBerry; U; BlackBerry 9780; en-GB) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.546 Mobile Safari/534.8+"
    },
    {
        name: "Blackberry Classic",
        width: 720,
        height: 720,
        cw: 390,
        ch: 390,
        type: "mobile",
        id: 61,
        userAgent:
            "Mozilla/5.0 (BlackBerry; U; BlackBerry 9780; en-GB) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.546 Mobile Safari/534.8+"
    },
    {
        name: "Blackberry Q10",
        width: 720,
        height: 720,
        cw: 346,
        ch: 346,
        type: "mobile",
        id: 62,
        userAgent:
            "Mozilla/5.0 (BlackBerry; U; BlackBerry 9780; en-GB) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.546 Mobile Safari/534.8+"
    },
    {
        name: "Blackberry Z30",
        width: 720,
        height: 1280,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 63,
        userAgent:
            "Mozilla/5.0 (BlackBerry; U; BlackBerry 9780; en-GB) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.546 Mobile Safari/534.8+"
    },
    {
        name: "Blackberry Z10",
        width: 768,
        height: 1280,
        cw: 384,
        ch: 640,
        type: "mobile",
        id: 64,
        userAgent:
            "Mozilla/5.0 (BlackBerry; U; BlackBerry 9780; en-GB) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.546 Mobile Safari/534.8+"
    },
    {
        name: "Blackberry Torch 9800",
        width: 360,
        height: 480,
        cw: 360,
        ch: 480,
        type: "mobile",
        id: 65,
        userAgent:
            "Mozilla/5.0 (BlackBerry; U; BlackBerry 9780; en-GB) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.546 Mobile Safari/534.8+"
    },
    {
        name: "ZTE Grand S",
        width: 1080,
        height: 1920,
        cw: 360,
        ch: 640,
        type: "mobile",
        id: 66,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1; es-us; Blade L5 Build/LMY47I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Mobile Safari/537.36 MMS/ZTE-Android-MMS-V2.0"
    },
    {
        name: "ZTE Open (Firefox OS)",
        width: 480,
        height: 720,
        cw: 320,
        ch: 480,
        type: "mobile",
        id: 67,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1; es-us; Blade L5 Build/LMY47I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Mobile Safari/537.36 MMS/ZTE-Android-MMS-V2.0"
    }
];

export const TabletScreens: GenericScreen[] = [
    {
        name: "Apple iPad Pro 12.9",
        width: 2048,
        height: 2732,
        cw: 1024,
        ch: 1366,
        type: "tablet",
        id: 0,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPad Pro 11",
        width: 1668,
        height: 2388,
        cw: 834,
        ch: 1194,
        type: "tablet",
        id: 1,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPad Pro 10.5",
        width: 1668,
        height: 2224,
        cw: 834,
        ch: 1112,
        type: "tablet",
        id: 2,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPad Pro 9.7",
        width: 1536,
        height: 2048,
        cw: 768,
        ch: 1024,
        type: "tablet",
        id: 3,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPad Air",
        width: 1640,
        height: 2360,
        cw: 820,
        ch: 1180,
        type: "tablet",
        id: 4,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPad",
        width: 1620,
        height: 2160,
        cw: 810,
        ch: 1080,
        type: "tablet",
        id: 5,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: "Apple iPad mini",
        width: 1536,
        height: 2048,
        cw: 768,
        ch: 1024,
        type: "tablet",
        id: 6,
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    },
    {
        name: 'Samsung Galaxy Tab 3 10"',
        width: 800,
        height: 1280,
        cw: 800,
        ch: 1280,
        type: "tablet",
        id: 7,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: 'Samsung Galaxy Tab 2 10"',
        width: 800,
        height: 1280,
        cw: 800,
        ch: 1280,
        type: "tablet",
        id: 8,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: 'Samsung Galaxy Tab (8.9")',
        width: 800,
        height: 1280,
        cw: 800,
        ch: 1280,
        type: "tablet",
        id: 9,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: 'Samsung Galaxy Tab 2 (7")',
        width: 600,
        height: 1024,
        cw: 600,
        ch: 1024,
        type: "tablet",
        id: 10,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "Samsung Nexus 10",
        width: 1600,
        height: 2560,
        cw: 800,
        ch: 1280,
        type: "tablet",
        id: 11,
        userAgent:
            "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG SM-G920P Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.2 Chrome/38.0.2125.102 Mobile Safari/E7FBAF"
    },
    {
        name: "HTC Nexus 9",
        width: 1538,
        height: 2048,
        cw: 768,
        ch: 1024,
        type: "tablet",
        id: 12,
        userAgent:
            "Mozilla/5.0 (Linux; Android 8.1.0; HTC Build/OPM2.171019.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.97 Mobile Safari/537.36"
    },
    {
        name: "Asus Nexus 7 (v2)",
        width: 1080,
        height: 1920,
        cw: 600,
        ch: 960,
        type: "tablet",
        id: 13,
        userAgent:
            "Mozilla/5.0 (Linux; Android 8.1.0; ASUS_Z01QD) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.76 Mobile Safari/537.36"
    },
    {
        name: "Asus Nexus 7 (v1)",
        width: 800,
        height: 1280,
        cw: 604,
        ch: 966,
        type: "tablet",
        id: 14,
        userAgent:
            "Mozilla/5.0 (Linux; Android 8.1.0; ASUS_Z01QD) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.76 Mobile Safari/537.36"
    },
    {
        name: "LG G Pad 8.3",
        width: 1200,
        height: 1920,
        cw: 600,
        ch: 960,
        type: "tablet",
        id: 15,
        userAgent:
            "Mozilla/5.0 (Linux; Android 7.0; LGAS992) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.86 Mobile Safari/537.36"
    },
    {
        name: "Amazon Kindle Fire HD 8.9",
        width: 1200,
        height: 1920,
        cw: 800,
        ch: 1280,
        type: "tablet",
        id: 16,
        userAgent:
            "Mozilla/5.0 (Linux; Android 9; KFONWI Build/PS7318; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Safari/537.36"
    },
    {
        name: "Amazon Kindle Fire HD 7",
        width: 800,
        height: 1280,
        cw: 480,
        ch: 800,
        type: "tablet",
        id: 17,
        userAgent:
            "Mozilla/5.0 (Linux; Android 9; KFONWI Build/PS7318; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Safari/537.36"
    },
    {
        name: "Amazon Kindle Fire",
        width: 600,
        height: 1024,
        cw: 600,
        ch: 1024,
        type: "tablet",
        id: 18,
        userAgent:
            "Mozilla/5.0 (Linux; Android 9; KFONWI Build/PS7318; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Safari/537.36"
    },
    {
        name: "Microsoft Surface Pro 3",
        width: 1440,
        height: 2160,
        cw: 1024,
        ch: 1440,
        type: "tablet",
        default: true,
        id: 19,
        userAgent:
            "Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.79 Mobile Safari/537.36 EdgA/107.0.1418.62"
    },
    {
        name: "Microsoft Surface Pro 2",
        width: 1080,
        height: 1920,
        cw: 720,
        ch: 1280,
        type: "tablet",
        id: 20,
        userAgent:
            "Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.79 Mobile Safari/537.36 EdgA/107.0.1418.62"
    },
    {
        name: "Microsoft Surface Pro",
        width: 1080,
        height: 1920,
        cw: 720,
        ch: 1280,
        type: "tablet",
        id: 21,
        userAgent:
            "Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.79 Mobile Safari/537.36 EdgA/107.0.1418.62"
    },
    {
        name: "Microsoft Surface",
        width: 768,
        height: 1366,
        cw: 768,
        ch: 1366,
        type: "tablet",
        id: 22,
        userAgent:
            "Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.79 Mobile Safari/537.36 EdgA/107.0.1418.62"
    },
    {
        name: "Blackberry Playbook",
        width: 600,
        height: 1024,
        cw: 600,
        ch: 1024,
        type: "tablet",
        id: 23,
        userAgent:
            "Mozilla/5.0 (BlackBerry; U; BlackBerry 9780; en-GB) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.546 Mobile Safari/534.8+"
    }
];

export function createScreens(url: string, type: ScreenType = "all", filter?: FilterFn): NobuSplitView[] {
    if (type === "all") {
        let screens = ([] as GenericScreen[]).concat(MobileScreens, TabletScreens);
        if (filter) screens = screens.filter(filter);
        return screens.map((m) => ({
            ...m,
            url
        }));
    }

    let screens = type === "mobile" ? MobileScreens : TabletScreens;
    if (filter) screens = screens.filter(filter);
    return screens.map((m) => ({
        ...m,
        url
    }));
}

export function getDefaultScreens(url: string, type: ScreenType = "all"): NobuSplitView[] {
    return createScreens(url, type, (s) => !!s.default);
}
