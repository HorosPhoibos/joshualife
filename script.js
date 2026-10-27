"use strict";

/*  JJ WORLD — perjalanan hidup Joshua Joviando
    Jovi berdiri di puncak planet kecil. Tiap chapter hidupnya ada di satu titik planet,
    dari lahir sampai sekarang. Tekan → (atau klik) dan planetnya berputar di bawah kaki Jovi.
    Jovi tumbuh dari bayi sampai dewasa, dan tiap pindah chapter kendaraannya beda.
    Setelah chapter terakhir, roket membawa Jovi kembali ke awal — loop.

    Mau ubah isi? Edit array CHAPTERS di bawah. `world` memilih dunia 3D-nya,
    `out.type` memilih kendaraan untuk pindah ke chapter berikutnya. */

(function () {
    const errorEl = document.getElementById("scene-error");
    if (!window.THREE) {
        errorEl.textContent = "Three.js gagal dimuat. Cek koneksi internet lalu refresh.";
        return;
    }
    const THREE = window.THREE;

    /* ============================================================
       DATA PERJALANAN HIDUP
       outfit.scale = tinggi badan Jovi (bayi 0.45 → dewasa 1)
       ============================================================ */
    const CHAPTERS = [
        {
            world: "baby", icon: "👶", year: "17 OKTOBER · UMUR 0", company: "Hello, World!",
            role: "Joshua Joviando lahir",
            detail: "Anak sulung dari tiga bersaudara. Di sinilah semua petualangan dimulai.",
            sign: ["17 OKTOBER · DAY ONE", "JOVI LAHIR!"],
            ground: 0xc9b6ff, sky: [0x2b1b6b, 0xffb3e6], accent: "#8a5cff", night: 0.6,
            outfit: { shirt: 0xffd6e8, pants: 0xffd6e8, scale: 0.45, acc: ["pacifier"] },
            out: { type: "balloon", caption: "🎈 Bayi Jovi terbang ke TK…", tease: "🎈 terbang pakai balon" }
        },
        {
            world: "tka", icon: "🧸", year: "UMUR 5 · TK A", company: "TK Tunas Bangsa",
            role: "Sekolah pertama: TK A",
            detail: "Mulai sekolah di umur 5 tahun. Dunia penuh perosotan, ayunan, dan balok ABC.",
            sign: ["UMUR 5 · TK A", "TUNAS BANGSA"],
            ground: 0xffe066, sky: [0x4cc9f0, 0xfff3b0], accent: "#ff9f1c", night: 0,
            outfit: { shirt: 0xffd23f, pants: 0x3d7bff, scale: 0.56, acc: ["backpack"], bag: 0xff4d6d },
            out: { type: "walk", caption: "🎒 Naik kelas ke TK B!", tease: "🎒 jalan ke TK B" }
        },
        {
            world: "tkb", icon: "🖍️", year: "TK B", company: "TK Tunas Bakti",
            role: "TK B",
            detail: "Lanjut TK B di Tunas Bakti sebelum masuk SD. Krayon raksasa dan komidi putar!",
            sign: ["SEBELUM SD · TK B", "TUNAS BAKTI"],
            ground: 0xff9ecb, sky: [0xff7eb6, 0xfff0f6], accent: "#ff4fa3", night: 0,
            outfit: { shirt: 0x4cc9f0, pants: 0xff9f1c, scale: 0.62, acc: ["backpack"], bag: 0x8a5cff },
            out: { type: "bus", caption: "🚌 Naik bus sekolah ke SD…", tease: "🚌 naik bus sekolah" }
        },
        {
            world: "sd", icon: "🎒", year: "2004 — 2010", company: "SD Maria",
            role: "Sekolah Dasar",
            detail: "Enam tahun berseragam merah-putih, upacara tiap Senin di depan tiang bendera.",
            sign: ["2004 — 2010", "SD MARIA"],
            ground: 0xffb3a7, sky: [0x4d9bff, 0xffffff], accent: "#e63946", night: 0,
            outfit: { shirt: 0xffffff, pants: 0xd62828, scale: 0.72, acc: ["backpack"], bag: 0x3d7bff },
            out: { type: "bicycle", caption: "🚲 Gowes sepeda ke SMP…", tease: "🚲 naik sepeda" }
        },
        {
            world: "smp", icon: "🏀", year: "2010 — 2013", company: "SMP Negeri 11 Depok",
            role: "Sekolah Menengah Pertama",
            detail: "Tiga tahun berseragam putih-biru di Depok.",
            sign: ["2010 — 2013 · DEPOK", "SMPN 11 DEPOK"],
            ground: 0x8ecae6, sky: [0x1f6feb, 0xd6ecff], accent: "#1f3a93", night: 0,
            outfit: { shirt: 0xffffff, pants: 0x1f3a93, scale: 0.85, acc: ["backpack"], bag: 0x2b2140 },
            out: { type: "krl", caption: "🚆 Naik kereta ke SMA…", tease: "🚆 naik kereta" }
        },
        {
            world: "sma", icon: "🍃", year: "2013 — 2016", company: "SMA Pondok Daun",
            role: "Sekolah Menengah Atas",
            detail: "Seragam putih-abu sampai lulus 2016, lalu siap masuk kuliah.",
            sign: ["2013 — 2016", "SMA PONDOK DAUN"],
            ground: 0x8fe388, sky: [0x2ec4b6, 0xeaffd6], accent: "#2a9d8f", night: 0,
            outfit: { shirt: 0xffffff, pants: 0x8d99ae, scale: 0.95, acc: ["backpack", "tie"], bag: 0x2a9d8f, tie: 0x8d99ae },
            out: { type: "walk", caption: "🍃 Lulus SMA! Jalan ke gereja…", tease: "🍃 jalan ke gereja" }
        },
        {
            world: "church", icon: "⛪", year: "2014 — SEKARANG", company: "GKPS Cijantung",
            role: "Guru Sekolah Minggu & Keyboardist",
            detail: "Side quest yang jalan terus di semua chapter: mengajar anak-anak dan ikut menghidupkan musik ibadah.",
            sign: ["2014 — NOW · SIDE QUEST", "GKPS CIJANTUNG"],
            ground: 0xffa8d8, sky: [0xff7ac6, 0xffe1a8], accent: "#ff4fa3", night: 0,
            outfit: { shirt: 0xff5fa2, acc: [] },
            out: { type: "walk", caption: "⛪ Lanjut ke kampus BINUS…", tease: "⛪ jalan ke kampus" }
        },
        {
            world: "binus", icon: "🎓", year: "SEP 2016 — 2020", company: "BINUS University",
            role: "S1 Akuntansi · Finance Club",
            detail: "Masuk 19 September 2016 dan lulus semester genap 2019/2020.",
            sign: ["2016 — 2020 · S1 AKUNTANSI", "BINUS"],
            ground: 0xffc078, sky: [0x35b8ff, 0xffe8c2], accent: "#3d7bff", night: 0,
            outfit: { shirt: 0x3d7bff, acc: ["gradCap"] },
            out: { type: "krl", caption: "🚆 Naik kereta ke Jogja buat lomba!", tease: "🚆 naik kereta ke Jogja" }
        },
        {
            world: "ugm", icon: "🏆", year: "2016 — 2019", company: "BEM FEB UGM",
            role: "Finalis Jogja International Paper Competition",
            detail: "Memimpin riset tentang kelayakan dan masa depan Bitcoin.",
            sign: ["JOGJA · PAPER COMPETITION", "UGM"],
            ground: 0xf6d365, sky: [0xff8c42, 0xfff1c1], accent: "#d4a017", night: 0,
            outfit: { shirt: 0x1d3557, acc: ["lanyard"] },
            out: { type: "plane", caption: "✈️ Terbang ke Garuda Indonesia…", tease: "✈️ naik pesawat" }
        },
        {
            world: "airport", icon: "✈️", year: "FEB — OKT 2019", company: "Garuda Indonesia",
            role: "Accounting & Finance Intern",
            detail: "Membuat laporan penjualan, jurnal SAP, dan rekonsiliasi pembayaran kartu kredit.",
            sign: ["FEB — OCT 2019 · FIRST JOB", "GARUDA INDONESIA"],
            ground: 0x56e0cf, sky: [0x2f8cff, 0xc4f4ff], accent: "#00a6a6", night: 0,
            outfit: { shirt: 0x00b3a4, acc: ["lanyard"] },
            out: { type: "hearts", caption: "💘 Balon hati… mendarat di samping May!", tease: "💘 balon hati" }
        },
        {
            world: "may", icon: "💞", year: "10 OKTOBER 2020", company: "Jovi & May",
            role: "Mulai pacaran dengan May Noviarta Purba",
            detail: "Chapter paling manis di planet ini.",
            sign: ["10 · 10 · 2020", "JOVI ♥ MAY"],
            ground: 0xffb3c6, sky: [0xff5c8a, 0xffe0ec], accent: "#ff2d6f", night: 0,
            outfit: { shirt: 0x2b2d6e, pants: 0x2b2d6e, acc: ["shirtFront", "rose"] },
            out: { type: "moto", caption: "🏍️ Ngebut ke kantor bank…", tease: "🏍️ naik motor" }
        },
        {
            world: "credit", icon: "📁", year: "OKT 2020 — OKT 2021", company: "State Bank of India",
            role: "Credit Admin Staff",
            detail: "Menangani pelaporan regulator dan appraisal properti sebagai bagian dari administrasi kredit.",
            sign: ["2020 — 2021 · CREDIT ADMIN", "STATE BANK OF INDIA"],
            ground: 0x86b8ff, sky: [0x5a6dff, 0xd2dcff], accent: "#5b6dff", night: 0,
            outfit: { shirt: 0xf4f7ff, acc: ["tie"], tie: 0x3d7bff },
            out: { type: "bus", caption: "🚌 Naik bus ke kampus Trisakti…", tease: "🚌 naik bus ke kampus" }
        },
        {
            world: "trisakti", icon: "📈", year: "SEP 2021 — 2023", company: "Universitas Trisakti",
            role: "S2 Magister Manajemen",
            detail: "Masuk 6 September 2021 dan lulus semester genap 2022/2023, sambil tetap bekerja.",
            sign: ["2021 — 2023 · MAGISTER", "TRISAKTI"],
            ground: 0x90e0ef, sky: [0x00b4d8, 0xe0fbff], accent: "#0077b6", night: 0,
            outfit: { shirt: 0x0077b6, acc: ["gradCap"] },
            out: { type: "coin", caption: "🪙 Balik ke bank, sekarang jadi teller…", tease: "🪙 menggelinding naik koin" }
        },
        {
            world: "teller", icon: "🏦", year: "OKT 2021 — JAN 2023", company: "State Bank of India",
            role: "Bank Teller",
            detail: "Melayani transaksi nasabah dan memastikan cash drawer selalu balance.",
            sign: ["2021 — 2023 · AT THE COUNTER", "SBI · TELLER"],
            ground: 0xffd24d, sky: [0xffa630, 0xfff3b8], accent: "#ff9f1c", night: 0,
            outfit: { shirt: 0x2f6bff, acc: ["tie"], tie: 0xff4d6d },
            out: { type: "bicycle", caption: "🚲 Gowes ke kuliah hukum di UT…", tease: "🚲 naik sepeda" }
        },
        {
            world: "ut", icon: "⚖️", year: "FEB 2022 — 2026", company: "Universitas Terbuka",
            role: "S1 Ilmu Hukum",
            detail: "Masuk 6 Februari 2022 dan lulus semester genap 2025/2026.",
            sign: ["2022 — 2026 · ILMU HUKUM", "UNIVERSITAS TERBUKA"],
            ground: 0xffe08a, sky: [0x1d4ed8, 0xfff4c2], accent: "#1d4ed8", night: 0,
            outfit: { shirt: 0x1d4ed8, acc: ["gradCap"] },
            out: { type: "ferry", caption: "⛴️ Nyebrang Selat Sunda ke Lampung…", tease: "⛴️ nyebrang naik ferry" }
        },
        {
            world: "refinery", icon: "🛢️", year: "JAN — JUN 2023", company: "Louis Dreyfus Company",
            role: "Finance Plant Controller · CPO Refinery",
            detail: "Merangkai budget, forecasting, dan insight finansial bersama tim lintas fungsi di Lampung.",
            sign: ["JAN — JUN 2023 · LAMPUNG", "LOUIS DREYFUS CO."],
            ground: 0xffb04a, sky: [0xff6a3d, 0xffd59a], accent: "#ff6a3d", night: 0,
            outfit: { shirt: 0xff8c1a, acc: ["hardhat"] },
            out: { type: "moto", caption: "🏍️ Gas balik ke Jakarta naik motor!", tease: "🏍️ ngebut naik motor" }
        },
        {
            world: "mega", icon: "💻", year: "OKT 2023 — SEP 2025", company: "Mega Dinamika",
            role: "Operations & Finance",
            detail: "Menghubungkan laporan, stok, klien, dan tim teknisi supaya semuanya tetap bergerak.",
            sign: ["2023 — 2025 · OPS & FINANCE", "MEGA DINAMIKA"],
            ground: 0x9b6bff, sky: [0x12063d, 0xc13cff], accent: "#b14dff", night: 1,
            outfit: { shirt: 0x9b5cff, acc: ["headset"] },
            out: { type: "pixel", caption: "👾 Didigitalisasi jadi piksel…", tease: "👾 berubah jadi piksel" }
        },
        {
            world: "artando", icon: "🚚", year: "2024", company: "PT Artando Translogistik",
            role: "Founder",
            detail: "Mendirikan usaha logistik sendiri dengan armada mobil dan truk.",
            sign: ["2024 · FOUNDER", "ARTANDO TRANSLOGISTIK"],
            ground: 0xa0c4ff, sky: [0x3a86ff, 0xffd6a5], accent: "#3a86ff", night: 0,
            outfit: { shirt: 0x3a86ff, acc: ["hardhat"] },
            out: { type: "truck", caption: "🚚 Naik truk Artando ke Nexia…", tease: "🚚 naik truk sendiri" }
        },
        {
            world: "nexia", icon: "🔍", year: "OKT 2025 — SEKARANG", company: "Nexia KPS",
            role: "Auditor",
            detail: "Menelusuri laporan dan kontrol internal, sekaligus memimpin koordinasi tim audit lapangan.",
            sign: ["OCT 2025 — NOW · AUDITOR", "NEXIA KPS"],
            ground: 0x4fe3a1, sky: [0x13c4a3, 0xeafff5], accent: "#0fb38a", night: 0,
            outfit: { shirt: 0x24304f, acc: ["glasses"] },
            out: { type: "paper", caption: "📄 Naik pesawat kertas audit… loop-de-loop!", tease: "📄 naik pesawat kertas" }
        },
        {
            world: "niaga", icon: "📊", year: "JAN 2026 — SEKARANG", company: "PT Niaga Integra Internasional",
            role: "Finance & Accounting Supervisor",
            detail: "Chapter terbaru: memegang pembukuan dan pelaporan keuangan perusahaan.",
            sign: ["JAN 2026 — NOW · F&A SUPERVISOR", "NIAGA INTEGRA"],
            ground: 0xff7a9a, sky: [0xff3d7f, 0xffd3a8], accent: "#ff3d7f", night: 0,
            outfit: { shirt: 0xff4f6d, acc: ["glasses", "tie"], tie: 0xffc93c },
            out: { type: "rocket", caption: "🚀 Roket balik ke awal — planetnya muter lagi!", tease: "🚀 naik roket balik ke awal" }
        }
    ];

    const N = CHAPTERS.length;
    const R = Math.round(Math.max(40, (N * 25) / (Math.PI * 2)));
    const TAU = Math.PI * 2;
    const STEP = TAU / N;
    const RS = R / 40;
    const WATER_F = CHAPTERS.findIndex((c) => c.world === "refinery") - 0.5;
    const LOOP_F = N - 0.5;
    const DUR = { walk: 2.9, back: 2.1, balloon: 4.6, hearts: 4.8, plane: 5, coin: 3.8, ferry: 5.2, moto: 3.8, pixel: 4.6, paper: 5.6, rocket: 8, warp: 3.6, bus: 4, bicycle: 3.8, krl: 4.4, truck: 4.2, intro: 3.6 };
    const DEFAULT_PANTS = 0x2b3a7a;

    /* ============================================================
       HELPERS
       ============================================================ */
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const seg = (t, a, b) => clamp((t - a) / (b - a));
    const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
    const easeOutBack = (t) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
    const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
    let seed = 20160;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const rr = (a, b) => a + (b - a) * rand();
    const pick = (arr) => arr[Math.floor(rand() * arr.length)];
    const mod = (a, n) => ((a % n) + n) % n;

    const RAINBOW = [0xff4d6d, 0xff9f1c, 0xffd23f, 0x2ee59d, 0x4cc9f0, 0x3d7bff, 0xb14dff, 0xff7eb6];
    const GOLD = 0xffc93c;
    const INK = 0x1d1530;

    const matCache = new Map();
    function M(color, opts) {
        const key = color + "|" + (opts ? JSON.stringify(opts) : "");
        let m = matCache.get(key);
        if (!m) {
            m = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.62, metalness: 0.04, flatShading: true }, opts || {}));
            matCache.set(key, m);
        }
        return m;
    }
    const glow = (color, k = 0.8) => M(color, { emissive: color, emissiveIntensity: k });
    const asMat = (c, o) => (typeof c === "number" ? M(c, o) : c);
    function mesh(geo, mat, shadow = true) {
        const m = new THREE.Mesh(geo, mat);
        m.castShadow = shadow;
        m.receiveShadow = true;
        return m;
    }
    const box = (w, h, d, c, o) => mesh(new THREE.BoxGeometry(w, h, d), asMat(c, o));
    const cyl = (rt, rb, h, c, s = 14, o) => mesh(new THREE.CylinderGeometry(rt, rb, h, s), asMat(c, o));
    const ball = (r, c, detail = 1, o) => mesh(new THREE.IcosahedronGeometry(r, detail), asMat(c, o));
    const cone = (r, h, c, s = 12, o) => mesh(new THREE.ConeGeometry(r, h, s), asMat(c, o));
    const torus = (r, t, c, arc = TAU, o) => mesh(new THREE.TorusGeometry(r, t, 8, 28, arc), asMat(c, o));
    function at(obj, x, y, z) { obj.position.set(x, y, z); return obj; }
    function rot(obj, x, y, z) { obj.rotation.set(x, y, z); return obj; }
    function grp(...kids) { const g = new THREE.Group(); kids.forEach((k) => g.add(k)); return g; }
    function prism(w, h, depth, c) {
        const s = new THREE.Shape();
        s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
        const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
        g.translate(0, 0, -depth / 2);
        return mesh(g, asMat(c));
    }
    function canvasTex(w, h, draw) {
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const ctx = c.getContext("2d");
        draw(ctx, w, h);
        const t = new THREE.CanvasTexture(c);
        t.anisotropy = 4;
        t.userData = { ctx, canvas: c };
        return t;
    }
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }
    const FONT = '"Fredoka", "Manrope", system-ui, sans-serif';
    const MONO = '"DM Mono", ui-monospace, monospace';
    const hex = (c) => "#" + c.toString(16).padStart(6, "0");

    function makeSign(top, title, bg, width = 5.2) {
        const tex = canvasTex(1024, 320, (ctx, w, h) => {
            roundRect(ctx, 8, 8, w - 16, h - 16, 48);
            ctx.fillStyle = bg; ctx.fill();
            ctx.lineWidth = 14; ctx.strokeStyle = "#1d1530"; ctx.stroke();
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.font = `500 34px ${MONO}`;
            ctx.globalAlpha = 0.9;
            ctx.fillText(top, w / 2, 92);
            ctx.globalAlpha = 1;
            let size = 104;
            ctx.font = `700 ${size}px ${FONT}`;
            while (ctx.measureText(title).width > w - 90 && size > 40) { size -= 4; ctx.font = `700 ${size}px ${FONT}`; }
            ctx.fillText(title, w / 2, 220);
        });
        const hgt = width / 3.2;
        const g = new THREE.Group();
        const board = new THREE.Mesh(new THREE.PlaneGeometry(width, hgt), new THREE.MeshBasicMaterial({ map: tex }));
        board.position.set(0, 1.5 + hgt / 2, 0.08);
        g.add(board);
        g.add(at(box(width + 0.1, hgt + 0.1, 0.12, INK), 0, 1.5 + hgt / 2, 0));
        [-1, 1].forEach((s) => g.add(at(cyl(0.09, 0.11, 1.6, 0xffffff, 6), s * width * 0.32, 0.8, -0.05)));
        return g;
    }
    function picture(w, h, pw, ph, draw) {
        const tex = canvasTex(pw, ph, draw);
        return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex }));
    }
    function letterBlock(letter, color, s = 0.9) {
        const tex = canvasTex(128, 128, (ctx, w, h) => {
            ctx.fillStyle = hex(color); ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 10; ctx.strokeRect(8, 8, w - 16, h - 16);
            ctx.fillStyle = "#ffffff"; ctx.font = `700 84px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(letter, w / 2, h / 2 + 4);
        });
        return mesh(new THREE.BoxGeometry(s, s, s), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 }));
    }
    function heartMesh(color, s = 1, o) {
        const m = asMat(color, o);
        const g = new THREE.Group();
        g.add(at(ball(0.42 * s, m, 1), -0.28 * s, 0.1 * s, 0));
        g.add(at(ball(0.42 * s, m, 1), 0.28 * s, 0.1 * s, 0));
        g.add(rot(at(cone(0.62 * s, 0.9 * s, m, 16), 0, -0.42 * s, 0), Math.PI, 0, 0));
        return g;
    }
    function gradCap(color = 0x1e1e2e, s = 1) {
        return grp(at(box(3 * s, 0.2 * s, 3 * s, color), 0, 0, 0), at(cyl(1.1 * s, 1.25 * s, 0.9 * s, color, 14), 0, -0.5 * s, 0), at(cyl(0.03 * s, 0.03 * s, 1.2 * s, GOLD, 5), 1.4 * s, -0.6 * s, 1.4 * s), at(ball(0.16 * s, GOLD, 0), 1.4 * s, -1.2 * s, 1.4 * s), at(ball(0.12 * s, GOLD, 0), 0, 0.14 * s, 0));
    }

    /* ============================================================
       SCENE
       ============================================================ */
    const canvas = document.getElementById("career-world");
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch (e) {
        errorEl.textContent = "Browser ini belum mendukung WebGL, jadi planetnya tidak bisa tampil.";
        return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffe1a8, 40, 140);
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 2400);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x9a7acc, 0.78);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff1dd, 0.85);
    sun.position.set(14, R + 30, 24);
    sun.target.position.set(0, R, 0);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 100 });
    sun.shadow.camera.updateProjectionMatrix();
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.03;
    scene.add(sun, sun.target);

    const skyU = { top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() }, space: { value: 0 } };
    const sky = new THREE.Mesh(
        new THREE.SphereGeometry(1100, 32, 16),
        new THREE.ShaderMaterial({
            side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyU,
            vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
            fragmentShader: "uniform vec3 top; uniform vec3 bottom; uniform float space; varying vec3 vP; void main(){ float h = clamp(vP.y * 0.5 + 0.5, 0.0, 1.0); vec3 col = mix(bottom, top, smoothstep(0.42, 0.85, h)); col = mix(col, vec3(0.04, 0.02, 0.14), space); gl_FragColor = vec4(col, 1.0); }"
        })
    );
    sky.renderOrder = -10;
    scene.add(sky);

    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(2200 * 3);
    for (let i = 0; i < 2200; i++) {
        const v = new THREE.Vector3(rr(-1, 1), rr(-1, 1), rr(-1, 1)).normalize().multiplyScalar(1000);
        starPos.set([v.x, v.y, v.z], i * 3);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const planet = new THREE.Group();
    scene.add(planet);
    const anims = [];

    function onPlanet(obj, phi, z = 0, lift = 0, yaw = 0) {
        const pivot = new THREE.Group();
        pivot.rotation.z = -phi;
        const h = Math.sqrt(Math.max(R * R - z * z, 1));
        const tilt = new THREE.Group();
        tilt.rotation.x = Math.atan2(z, h);
        obj.position.set(0, R + lift, 0);
        if (yaw) obj.rotation.y = yaw;
        tilt.add(obj);
        pivot.add(tilt);
        planet.add(pivot);
        return obj;
    }
    const placer = (i) => (dx, z, lift, obj, yaw) => onPlanet(obj, i * STEP + dx / R, z, lift, yaw);
    /** animasi naik-turun pelan untuk objek yang ditaruh dengan lift */
    function floaty(obj, lift, amp = 0.35, sp = 1.4, ph = 0) { anims.push((t) => { obj.position.y = R + lift + Math.sin(t * sp + ph) * amp; }); }

    /* ============================================================
       GROUND
       ============================================================ */
    function buildGround() {
        const geo = new THREE.SphereGeometry(R, 380, 200);
        geo.rotateX(Math.PI / 2);
        const pos = geo.attributes.position;
        const colors = new Float32Array(pos.count * 3);
        const c = new THREE.Color(), c2 = new THREE.Color();
        const pathC = new THREE.Color(0xfff3d6), edgeC = new THREE.Color(0xffffff);
        const water = new THREE.Color(0x29c6ff), deep = new THREE.Color(0x0b6dff), sand = new THREE.Color(0xffe6a3);
        const v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            const phi = mod(Math.atan2(v.x, v.y), TAU);
            const f = phi / STEP;
            const i0 = Math.floor(f) % N, i1 = (i0 + 1) % N, fr = f - Math.floor(f);
            c.setHex(CHAPTERS[i0].ground);
            c2.setHex(CHAPTERS[i1].ground);
            c.lerp(c2, smooth(0.4, 0.6, fr));
            const n = Math.sin(v.x * 0.9) * Math.cos(v.y * 0.7) * Math.sin(v.z * 0.8);
            c.offsetHSL(0, 0, n * 0.04);
            let r = R;
            const dw = Math.abs(f - WATER_F);
            const az = Math.abs(v.z);
            if (dw < 0.2) {
                c.copy(water).lerp(deep, 1 - dw / 0.2);
                r = R - 0.6 * smooth(0.2, 0.15, dw);
            } else if (dw < 0.26) {
                c.lerp(sand, smooth(0.26, 0.21, dw));
            } else if (az < 1.45) {
                c.lerp(pathC, 0.82);
            } else if (az < 1.75) {
                c.lerp(edgeC, 0.45);
            }
            if (dw >= 0.2) r += smooth(14, 24, az) * Math.sin(v.x * 0.23 + v.z * 0.19) * Math.cos(v.y * 0.21) * 1.2;
            v.setLength(r);
            pos.setXYZ(i, v.x, v.y, v.z);
            colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
        }
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geo.computeVertexNormals();
        const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, flatShading: true }));
        m.receiveShadow = true;
        planet.add(m);
    }

    /* ============================================================
       DECOR
       ============================================================ */
    function flower(color) {
        const g = grp(at(cyl(0.03, 0.03, 0.5, 0x3fa34d, 5), 0, 0.25, 0));
        g.add(at(ball(0.17, color, 0), 0, 0.55, 0));
        g.add(at(ball(0.07, 0xfff1a8, 0), 0, 0.57, 0.12));
        return g;
    }
    function bush(color, s = 1) {
        const g = new THREE.Group();
        for (let k = 0; k < 3; k++) g.add(at(ball(0.45 * s * (1 - k * 0.15), color, 1), (k - 1) * 0.45 * s, 0.3 * s, (k % 2) * 0.15));
        return g;
    }
    function lollipopTree(color, s = 1) {
        const g = grp(at(cyl(0.12 * s, 0.18 * s, 1.6 * s, 0x8b5a3c, 6), 0, 0.8 * s, 0));
        const crown = at(ball(1 * s, color, 1), 0, 2.1 * s, 0);
        crown.scale.y = 1.1;
        g.add(crown);
        g.add(at(ball(0.45 * s, new THREE.Color(color).offsetHSL(0, 0, 0.1).getHex(), 0), 0.35 * s, 2.6 * s, 0.4 * s));
        return g;
    }
    function pineTree(color, s = 1) {
        const g = grp(at(cyl(0.12 * s, 0.15 * s, 0.8 * s, 0x8b5a3c, 6), 0, 0.4 * s, 0));
        for (let k = 0; k < 3; k++) g.add(at(cone((1.1 - k * 0.28) * s, 1.2 * s, color, 7), 0, (1.1 + k * 0.7) * s, 0));
        return g;
    }
    function palmTree(s = 1) {
        const g = new THREE.Group();
        let y = 0;
        for (let k = 0; k < 6; k++) {
            const sgm = cyl(0.16 * s, 0.2 * s, 0.62 * s, k % 2 ? 0xb07a4a : 0x9a6a3e, 7);
            sgm.position.set(k * k * 0.025 * s, y + 0.31 * s, 0);
            sgm.rotation.z = -k * 0.04;
            g.add(sgm);
            y += 0.58 * s;
        }
        const top = new THREE.Group();
        top.position.set(0.62 * s, y, 0);
        for (let k = 0; k < 8; k++) {
            const fg = new THREE.BoxGeometry(2.2 * s, 0.06, 0.55 * s);
            fg.translate(1.1 * s, 0, 0);
            const frond = mesh(fg, M(k % 2 ? 0x2ecc71 : 0x1fae5b));
            frond.rotation.set(0, (k / 8) * TAU, -0.55);
            top.add(frond);
        }
        for (let k = 0; k < 4; k++) top.add(at(ball(0.22 * s, k % 2 ? 0xff5a36 : 0xff8c1a, 0), Math.cos(k * 1.6) * 0.3 * s, -0.3 * s, Math.sin(k * 1.6) * 0.3 * s));
        g.add(top);
        return g;
    }
    function cloud(s = 1) {
        const g = new THREE.Group();
        const m = M(0xffffff, { roughness: 1 });
        [[0, 0, 0, 1], [1, 0.2, 0.1, 0.8], [-1, 0.1, -0.1, 0.75], [0.4, 0.55, 0, 0.7], [-0.5, 0.4, 0.2, 0.6]].forEach(([x, y, z, r]) => {
            g.add(at(mesh(new THREE.IcosahedronGeometry(r * s, 1), m, false), x * s, y * s, z * s));
        });
        return g;
    }
    function hotAirBalloon(color, color2) {
        const g = new THREE.Group();
        const env = at(ball(1.6, color, 1), 0, 2.6, 0);
        env.scale.y = 1.2;
        g.add(env);
        g.add(rot(at(torus(1.55, 0.18, color2), 0, 2.4, 0), Math.PI / 2, 0, 0));
        g.add(rot(at(cone(0.8, 1, color, 10), 0, 0.95, 0), Math.PI, 0, 0));
        g.add(at(box(0.6, 0.45, 0.6, 0xb07a4a), 0, 0.1, 0));
        return g;
    }

    function chapterZone(phi, z) {
        const f = mod(phi / STEP, N);
        const i = Math.round(f);
        const dx = (f - i) * STEP * R;
        if (Math.abs(z) < 2.8) return true;
        if (Math.abs(dx) < 11 && z > -17 && z < -1.5) return true;
        if (Math.abs(f - WATER_F) < 0.28) return true;
        if (Math.abs(f - LOOP_F) < 0.24 && z > -11 && z < -3) return true;
        return false;
    }
    const isPalmZone = (f) => Math.abs(f - (WATER_F + 0.5)) < 0.5;

    function buildDecor() {
        const crowns = [0x2ee59d, 0x00c2a8, 0xff7eb6, 0xffd23f, 0x7c5cff, 0x4cc9f0, 0xff9f1c, 0x9ef01a, 0xff5d8f];
        let placed = 0, tries = 0;
        while (placed < 190 * RS && tries < 9000) {
            tries++;
            const phi = rr(0, TAU), z = rr(-30, -3);
            if (chapterZone(phi, z)) continue;
            const f = mod(phi / STEP, N);
            const s = rr(0.8, 1.5) * (1 + smooth(-8, -28, z) * 0.6);
            let t;
            if (isPalmZone(f) && rand() < 0.7) t = palmTree(s * 0.9);
            else t = rand() < 0.55 ? lollipopTree(pick(crowns), s) : rand() < 0.6 ? pineTree(pick(crowns), s) : bush(pick(crowns), s * 1.2);
            onPlanet(t, phi, z, -0.15, rr(0, TAU));
            placed++;
        }
        placed = 0; tries = 0;
        while (placed < 120 * RS && tries < 6000) {
            tries++;
            const phi = rr(0, TAU), z = rr(2.8, 10);
            if (chapterZone(phi, z)) continue;
            onPlanet(rand() < 0.75 ? flower(pick(RAINBOW)) : bush(pick(crowns), 0.6), phi, z, -0.05, rr(0, TAU));
            placed++;
        }
        for (let k = 0; k < 26 * RS; k++) {
            const c = cloud(rr(1, 2.2));
            const phi = rr(0, TAU), lift = rr(11, 22), z = rr(-34, -6);
            onPlanet(c, phi, z, lift);
            const base = R + lift, sp = rr(0.4, 0.9), ph = rr(0, TAU);
            anims.push((t) => { c.position.y = base + Math.sin(t * sp + ph) * 0.6; c.rotation.y = t * 0.03 * sp; });
        }
        for (let k = 0; k < 12; k++) {
            const b = hotAirBalloon(RAINBOW[k % 8], RAINBOW[(k + 3) % 8]);
            const lift = rr(13, 19);
            onPlanet(b, (k / 12) * TAU + rr(0, 0.15), rr(-26, -14), lift);
            floaty(b, lift, 1.2, 0.5, rr(0, TAU));
        }

        // Selat Sunda: buih, pelampung, ikan loncat
        for (let k = 0; k < 18; k++) {
            const foam = mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 10), M(0xffffff, { transparent: true, opacity: 0.8 }), false);
            foam.scale.set(rr(0.6, 2), 1, rr(0.4, 0.9));
            onPlanet(foam, (WATER_F + rr(-0.14, 0.14)) * STEP, rr(-22, 12), -0.5);
            const ph = rr(0, TAU);
            anims.push((t) => { const s = 0.8 + Math.sin(t * 1.5 + ph) * 0.25; foam.scale.x = s * 1.4; foam.position.y = R - 0.5 + Math.sin(t * 2 + ph) * 0.05; });
        }
        const buoy = grp(at(cyl(0.35, 0.45, 0.7, 0xff4d6d, 10), 0, 0.2, 0), at(cyl(0.36, 0.36, 0.2, 0xffffff, 10), 0, 0.45, 0), at(ball(0.15, 0xffd23f, 0, { emissive: 0xffd23f, emissiveIntensity: 1 }), 0, 0.9, 0));
        onPlanet(buoy, (WATER_F - 0.07) * STEP, -6, -0.6);
        anims.push((t) => { buoy.position.y = R - 0.6 + Math.sin(t * 2.2) * 0.12; buoy.rotation.z = Math.sin(t * 1.7) * 0.12; });
        for (let k = 0; k < 3; k++) {
            const fish = grp(at(ball(0.35, [0xff9f1c, 0xff4d6d, 0xffd23f][k], 1), 0, 0, 0), rot(at(cone(0.25, 0.4, 0xff7eb6, 4), -0.45, 0, 0), 0, 0, Math.PI / 2));
            fish.children[0].scale.set(1.5, 0.9, 0.7);
            const holder = new THREE.Group();
            holder.add(fish);
            onPlanet(holder, (WATER_F + (k - 1) * 0.08) * STEP, -4 - k * 3, -0.6);
            anims.push((t) => {
                const p = (t * 0.45 + k * 0.33) % 1;
                fish.visible = p < 0.4;
                const u = p / 0.4;
                fish.position.set((u - 0.5) * 2.4, Math.sin(Math.PI * u) * 2.2 - 0.3, 0);
                fish.rotation.z = -(u - 0.5) * 2.6;
            });
        }

        // Pelangi = gerbang loop antara chapter terakhir dan pertama
        const rainbow = new THREE.Group();
        RAINBOW.slice(0, 7).forEach((c, k) => rainbow.add(torus(5.4 - k * 0.36, 0.2, c, Math.PI, { emissive: c, emissiveIntensity: 0.35 })));
        [-1, 1].forEach((s) => rainbow.add(at(cloud(1.3), s * 4.4, 0.3, 0.3)));
        onPlanet(rainbow, LOOP_F * STEP, -7, -0.2);
        onPlanet(makeSign("THE END = THE START", "↻ LOOP", "#b14dff", 3.4), LOOP_F * STEP, -4.2, 0);
    }

    /* ============================================================
       CHAPTER WORLDS
       ============================================================ */
    function signFor(i, P, dx = -5) {
        const ch = CHAPTERS[i];
        P(dx, -2.7, 0, makeSign(ch.sign[0], ch.sign[1], ch.accent));
    }
    function schoolBuilding(w, h, body, trim, roof, windowsC = 0xbde0fe) {
        const b = new THREE.Group();
        b.add(at(box(w, h, 3.6, body), 0, h / 2, 0));
        b.add(at(box(w + 0.3, 0.35, 3.9, trim), 0, h, 0));
        b.add(at(prism(w + 0.6, 1.8, 4.2, roof), 0, h + 0.15, 0));
        const floors = Math.max(1, Math.round(h / 2.4));
        for (let f = 0; f < floors; f++) {
            for (let k = 0; k < Math.floor(w / 1.5); k++) {
                const x = -w / 2 + 0.9 + k * 1.5;
                if (f === 0 && Math.abs(x) < 0.8) continue;
                b.add(at(box(0.9, 0.9, 0.08, windowsC, { emissive: windowsC, emissiveIntensity: 0.25 }), x, 1.3 + f * 2.3, 1.82));
            }
            b.add(at(box(w + 0.02, 0.18, 3.62, trim), 0, 2.3 * (f + 1) - 0.25, 0));
        }
        b.add(at(box(1.2, 1.9, 0.1, trim), 0, 0.95, 1.82));
        return b;
    }
    function flagpole(h = 6) {
        const g = grp(at(cyl(0.06, 0.08, h, 0xffffff, 6), 0, h / 2, 0), at(ball(0.12, GOLD, 0), 0, h + 0.1, 0));
        const flag = new THREE.Group();
        flag.position.set(0, h - 0.6, 0);
        flag.add(at(box(1.6, 0.45, 0.04, 0xe63946), 0.82, 0.22, 0));
        flag.add(at(box(1.6, 0.45, 0.04, 0xffffff), 0.82, -0.23, 0));
        g.add(flag);
        anims.push((t) => { flag.rotation.y = Math.sin(t * 3) * 0.35; flag.children.forEach((c, k) => (c.rotation.y = Math.sin(t * 6 + k) * 0.15)); });
        return g;
    }
    function textBoard(w, h, draw, frame = 0x8b5a3c) {
        const g = new THREE.Group();
        [-1, 1].forEach((s) => g.add(rot(at(box(0.12, h + 1.4, 0.12, frame), s * w * 0.4, (h + 1.4) / 2, -0.2), -0.12, 0, 0)));
        g.add(at(box(w + 0.25, h + 0.25, 0.1, frame), 0, 1.3 + h / 2, 0));
        const pic = picture(w, h, Math.round(256 * w / h), 256, draw);
        pic.position.set(0, 1.3 + h / 2, 0.06);
        g.add(pic);
        return g;
    }

    // 0 — Lahir
    function buildBaby(i) {
        const P = placer(i);
        signFor(i, P);
        const crib = new THREE.Group();
        [[-1.9, -1.1], [1.9, -1.1], [-1.9, 1.1], [1.9, 1.1]].forEach(([x, z]) => crib.add(at(cyl(0.1, 0.1, 2.6, 0xffffff, 8), x, 1.3, z)));
        crib.add(at(box(3.8, 0.3, 2.2, 0xffffff), 0, 0.9, 0));
        crib.add(at(box(3.6, 0.3, 2, 0xffd6e8), 0, 1.15, 0));
        crib.add(at(box(1.4, 0.3, 1.9, 0xc9b6ff), 0.9, 1.35, 0));
        [-1.1, 1.1].forEach((z) => {
            crib.add(at(box(3.9, 0.12, 0.12, 0xffffff), 0, 2.5, z));
            for (let k = 0; k < 11; k++) crib.add(at(cyl(0.035, 0.035, 1.3, 0xffffff, 5), -1.7 + k * 0.34, 1.85, z));
        });
        crib.add(at(cyl(0.06, 0.06, 4, 0xffffff, 6), -1.9, 3.3, -1.1));
        crib.add(rot(at(cyl(0.05, 0.05, 1.9, 0xffffff, 6), -0.95, 5.3, -1.1), 0, 0, Math.PI / 2));
        const mobile = new THREE.Group();
        mobile.position.set(0, 5.3, -1.1);
        const items = [glow(0xffd23f, 0.6), glow(0xff7eb6, 0.6), glow(0x4cc9f0, 0.6), glow(0x2ee59d, 0.6), glow(0xb14dff, 0.6)];
        items.forEach((m, k) => {
            const a = (k / items.length) * TAU;
            const h = new THREE.Group();
            h.position.set(Math.cos(a) * 1.1, 0, Math.sin(a) * 1.1);
            h.add(at(cyl(0.015, 0.015, 0.9, 0xffffff, 4), 0, -0.45, 0));
            h.add(at(k % 2 ? ball(0.25, m, 0) : rot(cone(0.28, 0.4, m, 5), 0, 0, Math.PI), 0, -1, 0));
            mobile.add(h);
        });
        crib.add(mobile);
        anims.push((t) => { mobile.rotation.y = t * 0.6; });
        P(0.6, -7, 0, crib);

        const moon = grp(ball(3.2, 0xfff3b0, 2, { emissive: 0xfff3b0, emissiveIntensity: 0.7 }), at(ball(0.6, 0xf2e29a, 1), 1, 1, 2.8), at(ball(0.4, 0xf2e29a, 1), -1.2, -0.6, 2.9));
        P(3, -26, 16, moon);
        floaty(moon, 16, 0.6, 0.4);
        const starsG = new THREE.Group();
        P(0, -9, 0, starsG);
        const tw = [];
        for (let k = 0; k < 22; k++) {
            const s = rot(cone(0.28, 0.5, glow(0xfff3b0, 1), 5), 0, 0, k);
            s.castShadow = false;
            s.position.set(rr(-11, 11), rr(5, 12), rr(-6, 2));
            starsG.add(s); tw.push(s);
        }
        anims.push((t) => tw.forEach((s, k) => { const sc = 0.6 + Math.abs(Math.sin(t * 2 + k)) * 0.8; s.scale.setScalar(sc); s.rotation.z = t * 0.5 + k; }));

        const word = new THREE.Group();
        "JOVI".split("").forEach((l, k) => word.add(rot(at(letterBlock(l, [0xff4d6d, 0xffd23f, 0x2ee59d, 0x3d7bff][k]), k * 1.05, 0.45 + (k === 2 ? 0 : 0), 0), 0, rr(-0.25, 0.25), 0)));
        P(3.5, -3.6, 0, word, -0.1);

        const bear = new THREE.Group();
        const fur = 0xc68b59;
        bear.add(at(ball(0.65, fur, 1), 0, 0.65, 0));
        bear.add(at(ball(0.45, fur, 1), 0, 1.55, 0));
        [-1, 1].forEach((s) => {
            bear.add(at(ball(0.17, fur, 0), s * 0.32, 1.9, 0));
            bear.add(at(ball(0.2, fur, 0), s * 0.55, 0.85, 0.2));
            bear.add(at(ball(0.22, fur, 0), s * 0.35, 0.2, 0.35));
            bear.add(at(ball(0.05, INK, 0), s * 0.14, 1.62, 0.4));
        });
        bear.add(at(ball(0.16, 0xf1d1b5, 0), 0, 1.45, 0.38));
        bear.add(at(heartMesh(0xff4d6d, 0.35), 0, 0.75, 0.62));
        P(-1.5, -3.8, 0, bear, 0.3);

        // bangau pengantar bayi
        const stork = new THREE.Group();
        stork.add(at(ball(0.55, 0xffffff, 1), 0, 0, 0));
        stork.children[0].scale.set(1.6, 0.9, 0.9);
        stork.add(at(ball(0.3, 0xffffff, 1), 0.95, 0.35, 0));
        stork.add(rot(at(cone(0.08, 0.7, 0xff9f1c, 6), 1.5, 0.3, 0), 0, 0, -Math.PI / 2));
        stork.add(at(ball(0.05, INK, 0), 1.1, 0.42, 0.18));
        const wings = [];
        [-1, 1].forEach((s) => {
            const wg = new THREE.Group();
            wg.position.set(0, 0.2, s * 0.35);
            const wingGeo = new THREE.BoxGeometry(0.9, 0.06, 1.3);
            wingGeo.translate(0, 0, s * 0.65);
            wg.add(mesh(wingGeo, M(0xffffff)));
            stork.add(wg); wings.push([wg, s]);
        });
        const bundle = grp(at(cyl(0.012, 0.012, 0.6, 0xffffff, 4), 0, -0.3, 0), at(ball(0.35, 0xffd6e8, 1), 0, -0.75, 0));
        bundle.position.set(1.4, 0, 0);
        stork.add(bundle);
        const storkHold = new THREE.Group();
        storkHold.add(stork);
        P(0, -6, 0, storkHold);
        anims.push((t) => {
            const a = t * 0.5;
            stork.position.set(Math.cos(a) * 7, 8 + Math.sin(t * 1.2) * 0.6, Math.sin(a) * 3);
            stork.rotation.y = -a - Math.PI / 2;
            wings.forEach(([wg, s]) => (wg.rotation.x = s * Math.sin(t * 7) * 0.6));
        });
    }

    // 1 — TK A Tunas Bangsa
    function buildTKA(i) {
        const P = placer(i);
        signFor(i, P);
        P(0.5, -12, 0, schoolBuilding(8, 3.2, 0xfff1a8, 0xff9f1c, 0xff4d6d));

        const slide = new THREE.Group();
        [-0.5, 0.5].forEach((z) => slide.add(at(box(0.1, 2.8, 0.1, 0x3d7bff), -1.2, 1.4, z)));
        for (let k = 0; k < 6; k++) slide.add(at(box(0.08, 0.08, 1, 0xffffff), -1.2, 0.4 + k * 0.45, 0));
        slide.add(at(box(1, 0.15, 1.2, 0x3d7bff), -0.75, 2.75, 0));
        slide.add(rot(at(box(3.4, 0.12, 1, 0xffd23f), 0.75, 1.6, 0), 0, 0, -0.62));
        [-0.5, 0.5].forEach((z) => slide.add(rot(at(box(3.4, 0.3, 0.06, 0xff4d6d), 0.75, 1.75, z), 0, 0, -0.62)));
        P(2.2, -5.5, 0, slide);

        const swing = new THREE.Group();
        [-1.6, 1.6].forEach((x) => [-0.6, 0.6].forEach((z) => swing.add(rot(at(box(0.12, 3.2, 0.12, 0xff4d6d), x, 1.55, z * 0.6), z > 0 ? -0.35 : 0.35, 0, 0))));
        swing.add(rot(at(cyl(0.08, 0.08, 3.4, 0xff4d6d, 8), 0, 3.05, 0), 0, 0, Math.PI / 2));
        const seats = [];
        [-0.7, 0.7].forEach((x, k) => {
            const s = new THREE.Group();
            s.position.set(x, 3, 0);
            [-0.22, 0.22].forEach((z) => s.add(at(cyl(0.015, 0.015, 2.1, 0xffffff, 4), 0, -1.05, z)));
            s.add(at(box(0.55, 0.08, 0.5, [0x2ee59d, 0x4cc9f0][k]), 0, -2.1, 0));
            swing.add(s); seats.push(s);
        });
        P(7, -5.2, 0, swing);
        anims.push((t) => seats.forEach((s, k) => (s.rotation.z = Math.sin(t * 2.2 + k * 1.4) * 0.5)));

        const seesaw = new THREE.Group();
        seesaw.add(at(prism(0.8, 0.7, 0.6, 0x8a5cff), 0, 0, 0));
        const board = new THREE.Group();
        board.position.y = 0.7;
        board.add(box(3.2, 0.12, 0.45, 0xffd23f));
        [-1.4, 1.4].forEach((x) => board.add(at(box(0.08, 0.4, 0.4, 0xff4d6d), x, 0.25, 0)));
        seesaw.add(board);
        P(-1.6, -4, 0, seesaw);
        anims.push((t) => { board.rotation.z = Math.sin(t * 1.8) * 0.3; });

        const abc = new THREE.Group();
        ["A", "B", "C"].forEach((l, k) => abc.add(rot(at(letterBlock(l, RAINBOW[k * 2]), k * 0.95, 0.45, 0), 0, 0.2 * k, 0)));
        abc.add(rot(at(letterBlock("1", RAINBOW[5]), 0.5, 1.35, 0), 0, 0.4, 0));
        P(-2.6, -7.5, 0, abc);
        const ballG = at(ball(0.45, 0xff4d6d, 1), 0, 0.45, 0);
        const ballHold = grp(ballG);
        P(4.6, -3.4, 0, ballHold);
        anims.push((t) => { ballG.position.y = 0.45 + Math.abs(Math.sin(t * 3.2)) * 1.4; ballG.rotation.z = t * 2; });
    }

    // 2 — TK B Tunas Bakti
    function buildTKB(i) {
        const P = placer(i);
        signFor(i, P);
        P(0.5, -12, 0, schoolBuilding(8, 3.2, 0xffd6ec, 0x8a5cff, 0x8a5cff));
        [0xff4d6d, 0xffd23f, 0x2ee59d, 0x3d7bff, 0xb14dff].forEach((c, k) => {
            const h = 3 + (k % 3) * 0.8;
            const cr = grp(at(cyl(0.38, 0.38, h, c, 10), 0, h / 2, 0), at(cyl(0.4, 0.4, 0.3, 0xffffff, 10), 0, h * 0.75, 0), at(cone(0.38, 0.8, c, 10), 0, h + 0.4, 0));
            P(5 + k * 1.1, -8 + (k % 2) * 1.2, 0, cr);
            cr.rotation.z = (k - 2) * 0.08;
        });
        const art = textBoard(2.6, 1.9, (ctx, w, h) => {
            ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h);
            ctx.lineWidth = 8; ctx.lineCap = "round";
            ctx.fillStyle = "#ffd23f"; ctx.beginPath(); ctx.arc(w - 60, 60, 34, 0, TAU); ctx.fill();
            ctx.strokeStyle = "#ffd23f"; for (let k = 0; k < 8; k++) { const a = (k / 8) * TAU; ctx.beginPath(); ctx.moveTo(w - 60 + Math.cos(a) * 44, 60 + Math.sin(a) * 44); ctx.lineTo(w - 60 + Math.cos(a) * 62, 60 + Math.sin(a) * 62); ctx.stroke(); }
            ctx.fillStyle = "#ff4d6d"; ctx.fillRect(60, 130, 110, 90);
            ctx.fillStyle = "#3d7bff"; ctx.beginPath(); ctx.moveTo(50, 132); ctx.lineTo(115, 80); ctx.lineTo(180, 132); ctx.fill();
            ctx.strokeStyle = "#2ee59d"; ctx.beginPath(); ctx.moveTo(0, 230); ctx.quadraticCurveTo(w / 2, 200, w, 232); ctx.stroke();
            ctx.strokeStyle = "#1d1530";
            [[230, 150], [280, 160]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y - 30, 14, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - 16); ctx.lineTo(x, y + 30); ctx.moveTo(x - 20, y); ctx.lineTo(x + 20, y); ctx.moveTo(x, y + 30); ctx.lineTo(x - 14, y + 56); ctx.moveTo(x, y + 30); ctx.lineTo(x + 14, y + 56); ctx.stroke(); });
            ctx.fillStyle = "#ff4fa3"; ctx.font = `700 30px ${FONT}`; ctx.fillText("JOVI", 210, 60);
        });
        P(-1.2, -5, 0, art, 0.1);

        const mgr = new THREE.Group();
        mgr.add(at(cyl(2.2, 2.3, 0.3, 0xffffff, 24), 0, 0.15, 0));
        mgr.add(at(cyl(0.12, 0.12, 3.4, GOLD, 8), 0, 1.8, 0));
        const top = new THREE.Group();
        top.position.y = 3.5;
        for (let k = 0; k < 8; k++) {
            const sl = mesh(new THREE.ConeGeometry(2.5, 1.2, 8, 1, false, (k / 8) * TAU, TAU / 8), M(k % 2 ? 0xff4fa3 : 0xffffff));
            top.add(sl);
        }
        mgr.add(top);
        const spinner = new THREE.Group();
        const horses = [];
        for (let k = 0; k < 4; k++) {
            const a = (k / 4) * TAU;
            const h = new THREE.Group();
            h.position.set(Math.cos(a) * 1.6, 1.2, Math.sin(a) * 1.6);
            h.add(at(cyl(0.04, 0.04, 2.6, GOLD, 5), 0, 0.6, 0));
            const body = grp(box(0.9, 0.45, 0.35, RAINBOW[k * 2]), at(box(0.3, 0.55, 0.3, RAINBOW[k * 2]), 0.45, 0.3, 0), at(box(0.15, 0.4, 0.12, 0xffffff), -0.3, -0.35, 0), at(box(0.15, 0.4, 0.12, 0xffffff), 0.3, -0.35, 0));
            body.rotation.y = -a + Math.PI / 2;
            h.add(body);
            spinner.add(h); horses.push(body);
        }
        mgr.add(spinner);
        P(6, -4.8, 0, mgr);
        anims.push((t) => { spinner.rotation.y = t * 0.9; top.rotation.y = t * 0.9; horses.forEach((b, k) => (b.position.y = Math.sin(t * 3 + k * 1.5) * 0.3)); });
    }

    // 3 — SD Maria
    function buildSD(i) {
        const P = placer(i);
        signFor(i, P);
        const school = schoolBuilding(10, 5, 0xffffff, 0xe63946, 0xe63946, 0x9ad1ff);
        school.add(at(box(0.16, 1.1, 0.16, GOLD, { emissive: GOLD, emissiveIntensity: 0.4 }), 0, 7.6, 1.2));
        school.add(at(box(0.6, 0.16, 0.16, GOLD, { emissive: GOLD, emissiveIntensity: 0.4 }), 0, 7.8, 1.2));
        P(0.5, -12.5, 0, school);
        P(-1.6, -6.5, 0, flagpole(6.5));
        const bb = textBoard(3, 1.8, (ctx, w, h) => {
            ctx.fillStyle = "#1f5f3f"; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "#ffffff"; ctx.font = `600 52px ${FONT}`;
            ctx.fillText("1 + 1 = 2", 40, 90);
            ctx.font = `600 44px ${FONT}`; ctx.fillText("A B C  ✓", 40, 170);
            ctx.fillStyle = "#ffd23f"; ctx.fillText("★", w - 80, 80);
            ctx.fillStyle = "#ffffff"; ctx.font = `500 26px ${FONT}`; ctx.fillText("Senin: upacara", 40, 228);
        }, 0x8b5a3c);
        P(4, -5.2, 0, bb, -0.15);
        for (let k = 0; k < 3; k++) {
            const d = grp(at(box(1, 0.08, 0.6, 0xc68b59), 0, 0.75, 0), at(box(0.08, 0.75, 0.5, 0xc68b59), -0.45, 0.37, 0), at(box(0.08, 0.75, 0.5, 0xc68b59), 0.45, 0.37, 0), at(box(0.5, 0.06, 0.5, 0xe63946), 0, 0.45, 0.6), at(box(0.5, 0.5, 0.06, 0xe63946), 0, 0.7, 0.85));
            P(1.5 + k * 1.6, -3.6, 0, d, Math.PI);
        }
        const pencilG = new THREE.Group();
        const pencil = grp(rot(at(cyl(0.3, 0.3, 4, 0xffd23f, 6), 0, 0, 0), 0, 0, Math.PI / 2), rot(at(cone(0.3, 0.7, 0xf1d1b5, 6), 2.35, 0, 0), 0, 0, -Math.PI / 2), rot(at(cyl(0.31, 0.31, 0.4, 0xff7eb6, 6), -2.2, 0, 0), 0, 0, Math.PI / 2));
        pencilG.add(pencil);
        P(7.5, -6, 5, pencilG);
        anims.push((t) => { pencil.rotation.z = Math.sin(t) * 0.4; pencil.position.y = Math.sin(t * 1.5) * 0.4; });
    }

    // 4 — SMP Negeri 11 Depok
    function buildSMP(i) {
        const P = placer(i);
        signFor(i, P);
        P(0.5, -12.5, 0, schoolBuilding(10, 5, 0xeaf3ff, 0x1f3a93, 0x1f3a93, 0xbde0fe));
        P(-1.4, -7, 0, flagpole(6));
        const court = new THREE.Group();
        court.add(at(box(5, 0.05, 3.4, 0xff9f1c), 0, 0.03, 0));
        court.add(at(box(4.8, 0.06, 0.06, 0xffffff), 0, 0.06, 0));
        court.add(at(cyl(0.1, 0.12, 3.6, 0xffffff, 8), 2.3, 1.8, -1));
        court.add(at(box(0.1, 1.1, 1.6, 0xffffff), 2.15, 3.6, -1));
        court.add(rot(at(torus(0.32, 0.04, 0xff4d6d), 1.75, 3.2, -1), Math.PI / 2, 0, 0));
        const bball = ball(0.24, 0xff7b00, 1);
        court.add(bball);
        P(5, -5.6, 0, court);
        anims.push((t) => {
            const p = (t * 0.45) % 1;
            if (p < 0.6) { const u = p / 0.6; bball.position.set(lerp(-1.5, 1.75, u), 1 + Math.sin(Math.PI * u) * 3 + u * 1.7, -1); }
            else { const u = (p - 0.6) / 0.4; bball.position.set(lerp(1.75, -1.5, u), 3.2 - u * 2.9 + Math.abs(Math.sin(u * Math.PI * 3)) * 0.8 * (1 - u), -1); }
            bball.rotation.z = t * 4;
        });
        for (let k = 0; k < 2; k++) P(-1.2 + k * 1.6, -4.2, 0, makeBicycle([0x2ee59d, 0x1f3a93][k]), 0.25);
    }

    // 5 — SMA Pondok Daun
    function buildSMA(i) {
        const P = placer(i);
        signFor(i, P);
        P(0.5, -12.5, 0, schoolBuilding(10, 5, 0xf1f5f9, 0x2a9d8f, 0x2a9d8f, 0xcaffbf));
        const bigTree = lollipopTree(0x2ee59d, 2.4);
        P(-1, -8, 0, bigTree);
        const leavesG = new THREE.Group();
        P(0, -4, 0, leavesG);
        const leaves = [];
        for (let k = 0; k < 26; k++) {
            const lf = mesh(new THREE.IcosahedronGeometry(0.35, 0), M([0x2ee59d, 0x9ef01a, 0x57cc99, 0xffd23f][k % 4]));
            lf.scale.set(1, 0.12, 0.55);
            leavesG.add(lf); leaves.push([lf, rr(-10, 10), rr(-3, 3), rand()]);
        }
        anims.push((t) => leaves.forEach(([lf, x, z, o]) => {
            const p = (t * 0.1 + o) % 1;
            lf.position.set(x + Math.sin(t * 1.5 + o * 9) * 1.2, 10 - p * 10, z);
            lf.rotation.set(Math.sin(t * 2 + o * 5) * 0.8, t + o, Math.cos(t * 1.7 + o) * 0.6);
        }));
        const stage = new THREE.Group();
        stage.add(at(box(4.6, 0.5, 2.2, 0x2a9d8f), 0, 0.25, 0));
        stage.add(at(box(0.8, 1.1, 0.6, 0xffffff), 0.8, 1.05, 0.3));
        stage.add(at(box(4.6, 0.6, 0.08, 0xffd23f), 0, 2.8, -1));
        [-2.2, 2.2].forEach((x) => stage.add(at(cyl(0.08, 0.08, 2.6, 0xffffff, 6), x, 1.5, -1)));
        const banner = picture(4.2, 0.55, 512, 68, (ctx, w, h) => { ctx.fillStyle = "#ffd23f"; ctx.fillRect(0, 0, w, h); ctx.fillStyle = "#1d1530"; ctx.font = `700 46px ${FONT}`; ctx.textAlign = "center"; ctx.fillText("WISUDA 2016", w / 2, 50); });
        banner.position.set(0, 2.8, -0.95);
        stage.add(banner);
        P(5.5, -6, 0, stage);
        const capsG = new THREE.Group();
        P(5.5, -6, 1, capsG);
        const caps = [];
        for (let k = 0; k < 4; k++) { const c = gradCap(0x1e1e2e, 0.3); capsG.add(c); caps.push(c); }
        anims.push((t) => caps.forEach((c, k) => {
            const p = (t * 0.35 + k / 4) % 1;
            c.position.set((k - 1.5) * 1.1, Math.sin(Math.PI * p) * 6, Math.cos(k) * 0.4);
            c.rotation.set(p * 8, p * 4 + k, 0);
        }));
    }

    // 6 — GKPS Cijantung
    function buildChurch(i) {
        const P = placer(i);
        signFor(i, P);
        const church = new THREE.Group();
        church.add(at(box(6.2, 4.2, 5, 0xfff0f7), 0, 2, 0));
        church.add(at(prism(7, 2.8, 5.6, 0x8a5cff), 0, 4.1, 0));
        church.add(at(box(1.7, 3, 1.7, 0xff5fa2), 0, 5.6, 1.4));
        church.add(rot(at(cone(1.35, 2.6, 0x8a5cff, 4), 0, 8.4, 1.4), 0, Math.PI / 4, 0));
        church.add(at(box(0.18, 1.3, 0.18, GOLD, { emissive: GOLD, emissiveIntensity: 0.6 }), 0, 10.3, 1.4));
        church.add(at(box(0.8, 0.18, 0.18, GOLD, { emissive: GOLD, emissiveIntensity: 0.6 }), 0, 10.5, 1.4));
        church.add(at(box(1.4, 2.2, 0.2, 0xff8c42), 0, 1.1, 2.55));
        church.add(rot(at(cyl(0.7, 0.7, 0.2, 0xff8c42, 16), 0, 2.2, 2.55), Math.PI / 2, 0, 0));
        RAINBOW.slice(0, 4).forEach((c, k) => church.add(at(box(0.6, 1.4, 0.1, c, { emissive: c, emissiveIntensity: 0.55 }), [-2.3, -1.4, 1.4, 2.3][k], 2.4, 2.53)));
        church.add(rot(at(cyl(0.55, 0.55, 0.12, 0xff4fa3, 12, { emissive: 0xff4fa3, emissiveIntensity: 0.7 }), 0, 5.6, 2.27), Math.PI / 2, 0, 0));
        P(0.5, -10, 0, church);

        const kb = new THREE.Group();
        [-1, 1].forEach((s) => kb.add(rot(at(box(0.1, 1.4, 0.1, INK), s * 1.1, 0.6, 0), 0, 0, s * 0.35)));
        kb.add(at(box(3.4, 0.28, 1, 0x2b2140), 0, 1.25, 0));
        const keys = [];
        for (let k = 0; k < 14; k++) {
            const key = at(box(0.2, 0.08, 0.55, 0xffffff), -1.43 + k * 0.22, 1.42, 0.15);
            kb.add(key); keys.push(key);
            if (k % 7 !== 2 && k % 7 !== 6 && k < 13) kb.add(at(box(0.11, 0.1, 0.32, INK), -1.32 + k * 0.22, 1.47, 0.02));
        }
        P(4.8, -4, 0, kb, -0.25);
        anims.push((t) => keys.forEach((key, k) => { key.position.y = 1.42 - Math.max(0, Math.sin(t * 7 - k * 0.9)) * 0.06; }));

        const notesG = new THREE.Group();
        P(4.8, -4, 0, notesG);
        const notes = [];
        for (let k = 0; k < 10; k++) {
            const mat = glow(RAINBOW[k % RAINBOW.length], 0.45);
            const n = grp(at(ball(0.2, mat, 1), 0, 0, 0), at(box(0.05, 0.7, 0.05, mat), 0.17, 0.35, 0), at(box(0.26, 0.08, 0.05, mat), 0.28, 0.66, 0));
            n.children[0].scale.set(1.25, 0.9, 0.6);
            notesG.add(n); notes.push(n);
        }
        anims.push((t) => notes.forEach((n, k) => {
            const p = (t * 0.22 + k / notes.length) % 1;
            n.position.set(Math.sin(t * 1.3 + k) * 1.4 + (k % 3 - 1) * 0.8, 1.6 + p * 7.5, Math.cos(t + k) * 0.8);
            n.scale.setScalar(Math.sin(p * Math.PI) * 1.2 + 0.01);
            n.rotation.z = Math.sin(t * 2 + k) * 0.4;
        }));
        for (let k = 0; k < 4; k++) {
            const c = RAINBOW[k + 1];
            const chair = grp(at(box(0.6, 0.08, 0.6, c), 0, 0.5, 0), at(box(0.08, 0.6, 0.6, c), -0.27, 0.8, 0));
            [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]].forEach(([x, z]) => chair.add(at(box(0.06, 0.5, 0.06, c), x, 0.25, z)));
            P(-1.5 + k * 1.1, -4.5, 0, chair, 0.4 - k * 0.2);
        }
    }

    // 7 — BINUS
    function buildBinus(i) {
        const P = placer(i);
        signFor(i, P);
        const b = new THREE.Group();
        b.add(at(box(9.4, 0.6, 4.8, 0xffffff), 0, 0.3, 0));
        b.add(at(box(8.4, 4.2, 3.8, 0xfff4d6), 0, 2.6, -0.2));
        for (let k = 0; k < 6; k++) b.add(at(cyl(0.28, 0.32, 4, 0xffffff, 10), -3.5 + k * 1.4, 2.6, 2.1));
        for (let k = 0; k < 5; k++) b.add(at(box(0.7, 1.6, 0.1, 0xffe066, { emissive: 0xffd23f, emissiveIntensity: 0.4 }), -2.8 + k * 1.4, 2.6, 1.72));
        b.add(at(box(9.2, 0.6, 4.8, 0x3d7bff), 0, 4.9, 0));
        b.add(at(prism(9.2, 1.9, 4.8, 0xff9f1c), 0, 5.2, 0));
        b.add(rot(at(cyl(0.5, 0.5, 0.15, GOLD, 16), 0, 6.0, 2.42), Math.PI / 2, 0, 0));
        P(0.5, -10.5, 0, b);

        const cap = gradCap();
        P(-5.5, -5.5, 6, cap);
        anims.push((t) => { cap.rotation.y = t * 0.5; cap.position.y = R + 6 + Math.sin(t * 1.2) * 0.5; cap.rotation.z = Math.sin(t * 0.9) * 0.12; });

        // papan T-account: debit | kredit
        const ledger = textBoard(3.2, 2, (ctx, w, h) => {
            ctx.fillStyle = "#fffaf0"; ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = "#1d1530"; ctx.lineWidth = 6;
            ctx.beginPath(); ctx.moveTo(20, 66); ctx.lineTo(w - 20, 66); ctx.moveTo(w / 2, 66); ctx.lineTo(w / 2, h - 20); ctx.stroke();
            ctx.fillStyle = "#3d7bff"; ctx.font = `700 38px ${FONT}`; ctx.textAlign = "center";
            ctx.fillText("DEBIT", w / 4, 50); ctx.fillStyle = "#ff4d6d"; ctx.fillText("KREDIT", (w * 3) / 4, 50);
            ctx.fillStyle = "#1d1530"; ctx.font = `500 28px ${MONO}`;
            ["Kas 500", "Piutang 250", "Aset 750"].forEach((s, k) => ctx.fillText(s, w / 4, 112 + k * 44));
            ["Modal 600", "Utang 150", "Total 750"].forEach((s, k) => ctx.fillText(s, (w * 3) / 4, 112 + k * 44));
        }, 0x3d7bff);
        P(4.4, -5, 0, ledger, -0.15);

        const books = new THREE.Group();
        for (let k = 0; k < 6; k++) books.add(rot(at(box(1.5 - k * 0.08, 0.32, 1.1, RAINBOW[k]), 0, 0.16 + k * 0.33, 0), 0, rr(-0.3, 0.3), 0));
        P(-0.8, -3.8, 0, books);
        const conf = new THREE.Group();
        P(0, -3, 0, conf);
        const bits = [];
        for (let k = 0; k < 50; k++) {
            const m = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.12), new THREE.MeshBasicMaterial({ color: RAINBOW[k % RAINBOW.length], side: THREE.DoubleSide }));
            conf.add(m); bits.push([m, rr(-10, 10), rr(-2, 3), rr(0, 1), rr(0.6, 1.2)]);
        }
        anims.push((t) => bits.forEach(([m, x, z, o, s]) => {
            const p = (t * 0.12 * s + o) % 1;
            m.position.set(x + Math.sin(t * 2 + o * 9) * 0.5, 10 - p * 10, z);
            m.rotation.set(t * 3 * s + o, t * 2, t * s);
        }));
    }

    // 8 — UGM / Jogja
    function buildUGM(i) {
        const P = placer(i);
        signFor(i, P);
        const tugu = new THREE.Group();
        tugu.add(at(box(2.4, 0.5, 2.4, 0xffffff), 0, 0.25, 0));
        tugu.add(at(box(1.8, 1.6, 1.8, 0xf1f5f9), 0, 1.3, 0));
        tugu.add(at(cyl(0.45, 0.8, 5.5, 0xffffff, 8), 0, 4.85, 0));
        tugu.add(at(ball(0.55, GOLD, 1, { emissive: GOLD, emissiveIntensity: 0.4 }), 0, 7.8, 0));
        tugu.add(at(cone(0.3, 1.2, GOLD, 8, { emissive: GOLD, emissiveIntensity: 0.4 }), 0, 8.8, 0));
        P(-1, -8.5, 0, tugu);

        const joglo = new THREE.Group();
        [[-2.4, -1.6], [2.4, -1.6], [-2.4, 1.6], [2.4, 1.6], [-0.8, -1.6], [0.8, -1.6], [-0.8, 1.6], [0.8, 1.6]].forEach(([x, z]) => joglo.add(at(cyl(0.15, 0.15, 3, 0x8b5a3c, 8), x, 1.5, z)));
        joglo.add(at(box(5.8, 0.3, 4, 0xe9d8a6), 0, 0.15, 0));
        joglo.add(rot(at(cone(4.6, 1.6, 0xb5651d, 4), 0, 3.8, 0), 0, Math.PI / 4, 0));
        joglo.add(rot(at(cone(2.2, 1.8, 0x9c4f16, 4), 0, 5.2, 0), 0, Math.PI / 4, 0));
        joglo.children.slice(-2).forEach((c) => c.scale.set(1.25, 1, 0.9));
        P(5.5, -10.5, 0, joglo);

        const btcTex = canvasTex(256, 256, (ctx, w, h) => {
            ctx.fillStyle = "#ffb703"; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "#ffd23f"; ctx.beginPath(); ctx.arc(w / 2, h / 2, 108, 0, TAU); ctx.fill();
            ctx.fillStyle = "#ffffff"; ctx.font = `700 150px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("₿", w / 2, h / 2 + 8);
        });
        const faceMat = new THREE.MeshStandardMaterial({ map: btcTex, roughness: 0.4, metalness: 0.3, emissive: 0x332200 });
        const coinMesh = rot(mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.25, 32), [M(0xffb703, { metalness: 0.3 }), faceMat, faceMat]), Math.PI / 2, 0, 0);
        const btc = grp(coinMesh);
        P(3.6, -3.6, 4.4, btc);
        anims.push((t) => { btc.rotation.y = t * 1.4; btc.position.y = R + 4.4 + Math.sin(t * 2) * 0.35; });

        const trophy = grp(at(box(0.8, 0.25, 0.6, 0x8a5cff), 0, 0.12, 0), at(cyl(0.08, 0.12, 0.5, GOLD, 8), 0, 0.5, 0), at(cyl(0.45, 0.2, 0.7, GOLD, 12, { metalness: 0.4, roughness: 0.3 }), 0, 1.1, 0), at(torus(0.25, 0.06, GOLD), -0.45, 1.15, 0), at(torus(0.25, 0.06, GOLD), 0.45, 1.15, 0));
        trophy.scale.setScalar(1.6);
        P(1.2, -3.8, 0, trophy);
        anims.push((t) => { trophy.rotation.y = Math.sin(t) * 0.5; });

        const papers = new THREE.Group();
        for (let k = 0; k < 7; k++) papers.add(rot(at(box(1.1, 0.06, 1.4, 0xffffff), 0, 0.03 + k * 0.07, 0), 0, rr(-0.3, 0.3), 0));
        papers.add(rot(at(box(1, 0.03, 0.3, 0xd4a017), 0, 0.54, 0.4), 0, 0.1, 0));
        P(-1.8, -3.6, 0, papers);
        const sheetsG = new THREE.Group();
        P(-1.8, -3.6, 0, sheetsG);
        const sheets = [];
        for (let k = 0; k < 6; k++) { const s = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.8), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })); sheetsG.add(s); sheets.push(s); }
        anims.push((t) => sheets.forEach((s, k) => {
            const p = (t * 0.25 + k / 6) % 1;
            s.position.set(Math.sin(k * 2 + t) * 1.5, 0.6 + p * 6, Math.cos(k * 3) * 0.8);
            s.rotation.set(t * 2 + k, t + k, 0);
            s.scale.setScalar(Math.sin(p * Math.PI) + 0.01);
        }));
    }

    // 9 — Garuda / bandara
    function airliner() {
        const g = new THREE.Group();
        g.add(rot(at(cyl(0.75, 0.75, 7, 0xffffff, 16), 0, 1.6, 0), 0, 0, Math.PI / 2));
        const nose = at(ball(0.75, 0xffffff, 2), 3.5, 1.6, 0);
        nose.scale.x = 1.35;
        g.add(nose);
        g.add(rot(at(cone(0.75, 1.8, 0xffffff, 16), -4.4, 1.7, 0), 0, 0, Math.PI / 2));
        g.add(at(box(6.8, 0.24, 1.54, 0x00a6a6), 0, 1.45, 0));
        g.add(rot(at(box(1.6, 2, 0.14, 0x00a6a6), -4.1, 2.9, 0), 0, 0, 0.35));
        g.add(at(box(1, 0.1, 3, 0x00a6a6), -4.2, 1.9, 0));
        g.add(rot(at(box(2.2, 0.14, 8.4, 0xe8f6ff), 0.2, 1.3, 0), 0, 0.15, 0));
        [-2.2, 2.2].forEach((z) => g.add(rot(at(cyl(0.38, 0.38, 1.3, 0x9aa6c2, 12), 0.6, 0.85, z), 0, 0, Math.PI / 2)));
        for (let k = 0; k < 9; k++) g.add(at(box(0.24, 0.2, 0.06, 0x1d4e89), -2.6 + k * 0.6, 1.85, 0.74));
        g.add(at(box(0.5, 0.35, 0.06, 0x1d4e89), 3.5, 1.95, 0.6));
        [[2.6, 0], [-0.4, 0.8], [-0.4, -0.8]].forEach(([x, z]) => g.add(rot(at(cyl(0.22, 0.22, 0.2, INK, 10), x, 0.32, z), Math.PI / 2, 0, 0)));
        return g;
    }
    function buildAirport(i) {
        const P = placer(i);
        signFor(i, P);
        for (let k = -6; k <= 6; k++) {
            P(k * 1.8, -4.2, 0, box(1.85, 0.06, 2.4, 0x3b3f5c));
            if (k % 2 === 0) P(k * 1.8, -4.2, 0.04, box(0.9, 0.04, 0.18, 0xffffff));
        }
        const tower = grp(at(cyl(0.6, 0.9, 7, 0xffffff, 12), 0, 3.5, 0), at(cyl(1.4, 1.1, 1.4, 0x7ff3ff, 10, { emissive: 0x7ff3ff, emissiveIntensity: 0.45 }), 0, 7.6, 0), at(cyl(1.6, 1.6, 0.3, 0xff4d6d, 10), 0, 8.45, 0), at(cyl(0.05, 0.05, 1.2, 0xffffff, 5), 0, 9.2, 0));
        const beacon = at(ball(0.18, 0xff2d55, 0, { emissive: 0xff2d55, emissiveIntensity: 1.2 }), 0, 9.9, 0);
        tower.add(beacon);
        P(-7, -9, 0, tower);
        anims.push((t) => { beacon.visible = Math.sin(t * 5) > -0.2; });
        P(3, -13, 0, grp(at(box(12, 3, 4, 0xf7f7ff), 0, 1.5, 0), at(box(11.6, 1.2, 4.1, 0x58d6ff, { emissive: 0x58d6ff, emissiveIntensity: 0.25 }), 0, 1.8, 0), at(box(12.8, 0.3, 4.8, 0xff9f1c), 0, 3.15, 0)));
        P(3.5, -6.8, 0, airliner(), -0.22);
        const sock = new THREE.Group();
        sock.add(at(cyl(0.06, 0.06, 3, 0xffffff, 6), 0, 1.5, 0));
        const sockCone = new THREE.Group();
        sockCone.position.set(0, 2.9, 0);
        sockCone.add(rot(at(cone(0.3, 0.7, 0xff6a3d, 10), 0.35, 0, 0), 0, 0, -Math.PI / 2));
        sockCone.add(rot(at(cone(0.24, 0.6, 0xffffff, 10), 0.95, 0, 0), 0, 0, -Math.PI / 2));
        sock.add(sockCone);
        P(7.5, -3.6, 0, sock);
        anims.push((t) => { sockCone.rotation.y = Math.sin(t * 1.4) * 0.5; sockCone.rotation.z = -0.15 + Math.sin(t * 3) * 0.08; });
        const cart = grp(at(box(1.8, 0.15, 1, 0x5b6dff), 0, 0.4, 0));
        [[-0.6, 0x3d7bff, 0.8], [0.1, 0xff4d6d, 0.6], [0.7, 0xffd23f, 0.7]].forEach(([x, c, h]) => cart.add(at(box(0.55, h, 0.8, c), x, 0.48 + h / 2, 0)));
        [[-0.7, 0.45], [0.7, 0.45], [-0.7, -0.45], [0.7, -0.45]].forEach(([x, z]) => cart.add(rot(at(cyl(0.15, 0.15, 0.1, INK, 8), x, 0.17, z), Math.PI / 2, 0, 0)));
        P(-1.4, -3.6, 0, cart, 0.2);
        const clouds = [];
        for (let k = 0; k < 4; k++) {
            const c = cloud(rr(0.8, 1.2));
            P(0, -7, 0, grp(c));
            clouds.push([c, k]);
        }
        anims.push((t) => clouds.forEach(([c, k]) => { c.position.set(((t * 0.9 + k * 6) % 24) - 12, 6 + k * 0.9, k % 2 ? -2 : 1); }));
    }

    // 10 — Jovi & May
    let mayNPC = null;
    function makeMay() {
        const root = new THREE.Group();
        const body = new THREE.Group();
        root.add(body);
        const skin = M(0xf0c4a0), hair = M(0x2a1a14), dress = M(0xff5c8a), shoes = M(0xffffff);
        const legs = [], arms = [];
        [-1, 1].forEach((s) => {
            const p = new THREE.Group();
            p.position.set(0, 0.9, s * 0.15);
            p.add(at(mesh(new THREE.BoxGeometry(0.17, 0.8, 0.17), skin), 0, -0.42, 0));
            p.add(at(mesh(new THREE.BoxGeometry(0.32, 0.14, 0.22), shoes), 0.06, -0.84, 0));
            body.add(p); legs.push(p);
        });
        body.add(at(mesh(new THREE.BoxGeometry(0.4, 0.62, 0.52), dress), 0, 1.4, 0));
        body.add(at(mesh(new THREE.CylinderGeometry(0.27, 0.55, 0.78, 14), dress), 0, 0.78, 0));
        body.add(at(mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.06, 14), M(0xffffff)), 0, 0.4, 0));
        body.add(at(box(0.42, 0.07, 0.54, 0xffffff), 0, 1.13, 0));
        [-1, 1].forEach((s) => {
            const p = new THREE.Group();
            p.position.set(0, 1.62, s * 0.38);
            p.add(at(mesh(new THREE.BoxGeometry(0.15, 0.64, 0.15), skin), 0, -0.3, 0));
            p.add(at(mesh(new THREE.BoxGeometry(0.2, 0.16, 0.2), dress), 0, -0.04, 0));
            p.add(at(mesh(new THREE.IcosahedronGeometry(0.11, 0), skin), 0, -0.66, 0));
            if (s > 0) p.add(at(box(0.2, 0.07, 0.2, 0xd7dbe8, { metalness: 0.6, roughness: 0.3 }), 0, -0.56, 0));
            body.add(p); arms.push(p);
        });
        const head = new THREE.Group();
        head.position.y = 2.02;
        body.add(head);
        head.add(mesh(new THREE.BoxGeometry(0.58, 0.58, 0.58), skin));
        head.add(at(mesh(new THREE.BoxGeometry(0.64, 0.18, 0.64), hair), 0, 0.3, 0));
        head.add(at(mesh(new THREE.BoxGeometry(0.26, 1.2, 0.66), hair), -0.2, -0.22, 0));
        [-1, 1].forEach((s) => head.add(at(mesh(new THREE.BoxGeometry(0.34, 1.0, 0.08), hair), -0.03, -0.18, s * 0.33)));
        head.add(rot(at(mesh(new THREE.BoxGeometry(0.12, 0.16, 0.42), hair), 0.27, 0.22, 0.08), 0.35, 0, 0));
        [-1, 1].forEach((s) => {
            head.add(at(box(0.04, 0.1, 0.08, INK), 0.295, 0.03, s * 0.13));
            head.add(at(box(0.04, 0.03, 0.12, INK), 0.3, 0.1, s * 0.14));
            head.add(at(box(0.03, 0.06, 0.1, 0xff8fab), 0.295, -0.08, s * 0.19));
            head.add(at(ball(0.03, GOLD, 0), 0, -0.08, s * 0.31));
        });
        head.add(at(box(0.03, 0.05, 0.14, 0xd9455f), 0.3, -0.15, 0));
        head.add(at(ball(0.09, 0xffffff, 0), 0.05, 0.22, 0.36));
        head.add(at(ball(0.05, 0xffd23f, 0), 0.08, 0.22, 0.42));
        root.scale.setScalar(0.94);
        return { root, body, head, arms, legs };
    }
    function buildMay(i) {
        const P = placer(i);
        signFor(i, P);
        mayNPC = makeMay();
        P(1.32, 0, 0, mayNPC.root, Math.PI);
        [-1.8, 6.2].forEach((dx) => P(dx, -3.4, 0, grp(at(cyl(0.07, 0.09, 4.6, 0xffffff, 6), 0, 2.3, 0), at(ball(0.12, GOLD, 0), 0, 4.65, 0))));
        const lightsG = new THREE.Group();
        P(2.2, -3.4, 0, lightsG);
        const bulbs = [];
        for (let k = 0; k <= 18; k++) {
            const u = k / 18, x = lerp(-4, 4, u);
            const b = ball(0.11, 0xfff1b8, 0, { emissive: [0xffd23f, 0xff9fc6, 0xfff1b8][k % 3], emissiveIntensity: 1.2 });
            b.castShadow = false;
            b.position.set(x, 4.5 - Math.sin(Math.PI * u) * 0.9, 0);
            lightsG.add(b); bulbs.push(b);
        }
        anims.push((t) => bulbs.forEach((b, k) => b.scale.setScalar(0.8 + Math.max(0, Math.sin(t * 3 + k * 1.7)) * 0.5)));
        const bigHeart = heartMesh(0xff2d6f, 3.2, { emissive: 0xff2d6f, emissiveIntensity: 0.35 });
        const heartHold = grp(bigHeart);
        P(0.6, -10, 6, heartHold);
        anims.push((t) => { const b = 1 + Math.pow(Math.max(0, Math.sin(t * 3)), 6) * 0.12; bigHeart.scale.setScalar(b); heartHold.position.y = R + 6 + Math.sin(t) * 0.3; });

        const date = textBoard(3.6, 1.4, (ctx, w, h) => {
            const g = ctx.createLinearGradient(0, 0, w, 0); g.addColorStop(0, "#ff7eb6"); g.addColorStop(1, "#ff2d6f");
            ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "#ffffff"; ctx.font = `700 120px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("10·10·2020", w / 2, h / 2 + 6);
        }, 0xffffff);
        P(4.6, -5.4, 0, date, -0.2);

        const bench = grp(at(box(2.4, 0.12, 0.7, 0xffffff), 0, 0.7, 0), at(box(2.4, 0.7, 0.1, 0xffffff), 0, 1.15, -0.33), at(box(0.1, 0.7, 0.6, 0xff7eb6), -1.1, 0.35, 0), at(box(0.1, 0.7, 0.6, 0xff7eb6), 1.1, 0.35, 0));
        P(0.2, -4.6, 0, bench);
        const arch = new THREE.Group();
        arch.add(rot(torus(2.4, 0.18, 0xffffff, Math.PI), 0, 0, 0));
        for (let k = 0; k < 14; k++) {
            const a = (k / 13) * Math.PI;
            arch.add(at(ball(0.28, [0xff7eb6, 0xff2d6f, 0xffffff, 0xffd23f][k % 4], 0), Math.cos(a) * 2.4, Math.sin(a) * 2.4, 0.15));
        }
        P(0.2, -5.6, 0, arch);

        const floatG = new THREE.Group();
        P(0, -4, 0, floatG);
        const hs = [];
        for (let k = 0; k < 16; k++) { const h = heartMesh([0xff2d6f, 0xff7eb6, 0xffffff, 0xb14dff][k % 4], 0.35, { emissive: 0xff7eb6, emissiveIntensity: 0.25 }); floatG.add(h); hs.push([h, rr(-10, 10), rr(-2, 2), rand()]); }
        anims.push((t) => hs.forEach(([h, x, z, o]) => {
            const p = (t * 0.15 + o) % 1;
            h.position.set(x + Math.sin(t * 1.5 + o * 7) * 0.6, p * 9, z);
            h.scale.setScalar(Math.sin(p * Math.PI) + 0.01);
            h.rotation.y = Math.sin(t + o * 5) * 0.6;
        }));
        for (let k = 0; k < 10; k++) P(-2.5 + k * 1.3, -3.4 + (k % 2) * 0.4, 0, flower([0xff2d6f, 0xff7eb6, 0xffffff][k % 3]));
    }

    // 11 — SBI Credit Admin
    function bankFacade(bodyColor, trim, pedColor) {
        const b = new THREE.Group();
        for (let k = 0; k < 3; k++) b.add(at(box(9 - k * 0.5, 0.25, 5 - k * 0.3, 0xffffff), 0, 0.12 + k * 0.25, 0.1));
        b.add(at(box(8, 4.6, 4, bodyColor), 0, 3, -0.3));
        for (let k = 0; k < 5; k++) b.add(at(cyl(0.3, 0.34, 4.4, 0xffffff, 10), -3.2 + k * 1.6, 2.95, 2));
        b.add(at(box(8.8, 0.5, 4.6, trim), 0, 5.4, 0));
        b.add(at(prism(8.8, 1.8, 4.6, pedColor), 0, 5.65, 0));
        b.add(rot(at(cyl(0.55, 0.55, 0.15, GOLD, 18, { emissive: GOLD, emissiveIntensity: 0.3 }), 0, 6.35, 2.32), Math.PI / 2, 0, 0));
        b.add(at(box(1.6, 2.6, 0.12, 0x2d2d5a), 0, 2.1, 1.72));
        return b;
    }
    function buildCredit(i) {
        const P = placer(i);
        signFor(i, P);
        P(0.5, -11, 0, bankFacade(0xeaf1ff, 0x5b6dff, GOLD));
        const cab = grp(at(box(1.8, 3.2, 1.6, 0x5b6dff), 0, 1.6, 0));
        const drawers = [];
        for (let k = 0; k < 3; k++) {
            const d = grp(at(box(1.6, 0.85, 1.5, 0x8fb5ff), 0, 0, 0), at(box(0.5, 0.1, 0.1, 0xffffff), 0, 0.1, 0.78), at(box(1.3, 0.3, 1.2, 0xffffff), 0, 0.42, -0.05));
            d.position.set(0, 0.6 + k * 1, 0.1);
            cab.add(d); drawers.push(d);
        }
        P(7.3, -5, 0, cab, -0.35);
        anims.push((t) => drawers.forEach((d, k) => { d.position.z = 0.1 + Math.max(0, Math.sin(t * 1.4 + k * 1.6)) * 0.85; }));
        const docTex = canvasTex(128, 160, (ctx, w, h) => {
            ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "#5b6dff"; ctx.fillRect(12, 14, 60, 10);
            ctx.fillStyle = "#c9d2ff";
            for (let k = 0; k < 8; k++) ctx.fillRect(12, 38 + k * 14, k % 3 === 2 ? 60 : 100, 6);
            ctx.fillStyle = "#ff4d6d"; ctx.beginPath(); ctx.arc(100, 140, 10, 0, TAU); ctx.fill();
        });
        const docMat = new THREE.MeshBasicMaterial({ map: docTex, side: THREE.DoubleSide });
        const docsG = new THREE.Group();
        P(0, -6, 0, docsG);
        const docs = [];
        for (let k = 0; k < 14; k++) { const d = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.95), docMat); docsG.add(d); docs.push(d); }
        anims.push((t) => docs.forEach((d, k) => {
            const a = t * 0.45 + (k * TAU) / docs.length;
            d.position.set(Math.cos(a) * 6, 3.4 + Math.sin(t * 2 + k) * 0.5 + (k % 3) * 0.7, Math.sin(a) * 2.4);
            d.rotation.set(Math.sin(t * 3 + k) * 0.3, -a, Math.sin(t * 4 + k) * 0.3);
        }));
        const house = grp(at(cyl(1, 1.2, 0.6, 0xffffff, 16), 0, 0.3, 0), at(box(1.2, 1, 1.2, 0xffd23f), 0, 1.1, 0), at(prism(1.6, 0.8, 1.4, 0xff4d6d), 0, 1.6, 0), at(box(0.3, 0.5, 0.05, 0x8a5cff), 0, 0.85, 0.62));
        const mag = grp(at(torus(0.6, 0.08, 0x1d1530), 0, 0, 0), new THREE.Mesh(new THREE.CircleGeometry(0.58, 24), new THREE.MeshStandardMaterial({ color: 0xbdf7ff, transparent: true, opacity: 0.4 })), rot(at(cyl(0.07, 0.09, 0.9, 0xff4d6d, 8), 0.75, -0.75, 0), 0, 0, Math.PI / 4));
        house.add(mag);
        P(3.6, -4.2, 0, house);
        anims.push((t) => { mag.position.set(Math.cos(t * 1.2) * 0.9, 2.4 + Math.sin(t * 2.4) * 0.2, 0.9 + Math.sin(t * 1.2) * 0.3); });
        const stampTex = canvasTex(256, 160, (ctx, w, h) => {
            ctx.strokeStyle = "#ff2d55"; ctx.lineWidth = 12; roundRect(ctx, 14, 30, w - 28, h - 60, 16); ctx.stroke();
            ctx.fillStyle = "#ff2d55"; ctx.font = `700 52px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("APPROVED", w / 2, h / 2 + 2);
        });
        const stamp = new THREE.Group();
        stamp.add(at(box(1.8, 0.04, 1.3, 0xffffff), 0, 0.05, 0));
        const mark = rot(at(new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.95), new THREE.MeshBasicMaterial({ map: stampTex, transparent: true })), 0, 0.08, 0), -Math.PI / 2, 0, 0);
        stamp.add(mark);
        const head = grp(at(box(1.1, 0.35, 0.8, 0x2d2d5a), 0, 0, 0), at(cyl(0.16, 0.16, 0.8, 0xff4d6d, 10), 0, 0.55, 0), at(ball(0.3, 0xff4d6d, 1), 0, 1.05, 0));
        stamp.add(head);
        P(0.6, -3.6, 0, stamp, 0.2);
        anims.push((t) => {
            const p = (t * 0.7) % 1;
            head.position.y = p < 0.12 ? lerp(2.2, 0.25, p / 0.12) : lerp(0.25, 2.2, smooth(0.25, 0.85, p));
            mark.visible = p > 0.11;
            mark.scale.setScalar(p > 0.11 ? 1 + Math.max(0, 0.25 - (p - 0.11)) * 0.8 : 0.01);
        });
    }

    // 12 — Trisakti
    function buildTrisakti(i) {
        const P = placer(i);
        signFor(i, P);
        const b = new THREE.Group();
        b.add(at(box(9, 7, 3.6, 0x0077b6), 0, 3.5, 0));
        for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) b.add(at(box(1, 0.9, 0.06, 0xcaf0f8, { emissive: 0xcaf0f8, emissiveIntensity: 0.3 }), -3.3 + c * 1.32, 1.2 + r * 1.3, 1.82));
        b.add(at(box(9.4, 0.5, 4, 0xffffff), 0, 7.2, 0));
        b.add(at(box(3, 1.4, 3.4, 0x023e8a), 2.6, 8.1, 0));
        P(0.5, -12, 0, b);
        const swot = textBoard(3, 2, (ctx, w, h) => {
            const cs = ["#2ee59d", "#ff4d6d", "#4cc9f0", "#ff9f1c"], ls = ["S", "W", "O", "T"], ws = ["Strengths", "Weaknesses", "Opportunities", "Threats"];
            for (let k = 0; k < 4; k++) {
                const x = (k % 2) * (w / 2), y = Math.floor(k / 2) * (h / 2);
                ctx.fillStyle = cs[k]; ctx.fillRect(x + 4, y + 4, w / 2 - 8, h / 2 - 8);
                ctx.fillStyle = "#ffffff"; ctx.font = `700 70px ${FONT}`; ctx.fillText(ls[k], x + 20, y + 78);
                ctx.font = `500 22px ${MONO}`; ctx.fillText(ws[k], x + 20, y + h / 2 - 22);
            }
        }, 0x023e8a);
        P(4.4, -5, 0, swot, -0.15);
        const cap = gradCap(0x023e8a);
        P(-5.5, -6, 6.2, cap);
        anims.push((t) => { cap.rotation.y = t * 0.6; cap.position.y = R + 6.2 + Math.sin(t * 1.4) * 0.5; });
        const chess = new THREE.Group();
        chess.add(at(box(2.4, 0.15, 2.4, 0xffffff), 0, 0.08, 0));
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if ((r + c) % 2) chess.add(at(box(0.6, 0.02, 0.6, INK), -0.9 + c * 0.6, 0.17, -0.9 + r * 0.6));
        const king = grp(at(cyl(0.25, 0.32, 0.25, 0x023e8a, 12), 0, 0.3, 0), at(cyl(0.14, 0.2, 0.8, 0x023e8a, 12), 0, 0.8, 0), at(ball(0.2, 0x023e8a, 1), 0, 1.3, 0), at(box(0.06, 0.3, 0.06, GOLD), 0, 1.6, 0), at(box(0.2, 0.06, 0.06, GOLD), 0, 1.62, 0));
        king.position.set(0.3, 0, 0.3);
        chess.add(king);
        P(-0.8, -4, 0, chess, 0.3);
        anims.push((t) => { king.position.y = Math.abs(Math.sin(t * 1.5)) * 0.4; king.rotation.y = t; });
    }

    // 13 — SBI Teller
    function buildTeller(i) {
        const P = placer(i);
        signFor(i, P, -4.5);
        const wall = new THREE.Group();
        wall.add(at(box(11, 4.6, 1.4, 0xff7b54), 0, 2.3, 0));
        for (let k = 0; k < 5; k++) wall.add(at(box(11.02, 0.3, 1.42, k % 2 ? 0xffd23f : 0xffffff), 0, 0.6 + k * 0.9, 0));
        wall.add(at(box(11.6, 0.4, 1.8, 0x5b3cc4), 0, 4.8, 0));
        P(0.5, -10.5, 0, wall);
        const counter = new THREE.Group();
        counter.add(at(box(7, 1.2, 1.2, 0xffffff), 0, 0.6, 0));
        counter.add(at(box(7.2, 0.14, 1.4, 0xff4d6d), 0, 1.27, 0));
        counter.add(at(box(7, 1.5, 0.06, M(0x9be7ff, { transparent: true, opacity: 0.45 })), 0, 2.1, -0.3));
        [-1, 1].forEach((s) => counter.add(at(box(0.15, 1.6, 0.15, 0x5b3cc4), s * 3.5, 2.1, -0.3)));
        counter.add(at(box(7.2, 0.3, 0.3, 0x5b3cc4), 0, 2.95, -0.3));
        counter.add(grp(at(cyl(0.2, 0.25, 0.1, GOLD, 12), 1.5, 1.39, 0.3), at(ball(0.16, GOLD, 1), 1.5, 1.5, 0.3)));
        const tellerSign = makeSign("COUNTER 1", "TELLER", "#5b3cc4", 2.4);
        tellerSign.position.set(0, 2.1, -0.3);
        counter.add(tellerSign);
        P(1.2, -6.2, 0, counter);
        const coinMat = M(GOLD, { emissive: 0xffa600, emissiveIntensity: 0.25, metalness: 0.3, roughness: 0.35 });
        const coinsG = new THREE.Group();
        P(0, -3.5, 0, coinsG);
        const coins = [];
        for (let k = 0; k < 34; k++) { const c = mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16), coinMat); coinsG.add(c); coins.push(c); }
        anims.push((t) => coins.forEach((c, k) => {
            const p = (t * 0.22 + k * 0.137) % 1;
            c.position.set(((k * 2.3) % 18) - 9, 10 - p * 10, ((k * 1.7) % 4) - 2.5);
            c.rotation.set(t * 3 + k, t * 2, 0);
        }));
        const cash = new THREE.Group();
        for (let k = 0; k < 5; k++) {
            const h = 0.3 + (k % 3) * 0.25;
            cash.add(at(box(0.9, h, 0.45, 0x2ecc71), (k % 3) * 1 - 1, h / 2, Math.floor(k / 3) * 0.7));
            cash.add(at(box(0.25, h + 0.02, 0.47, 0xffd23f), (k % 3) * 1 - 1, h / 2, Math.floor(k / 3) * 0.7));
        }
        P(-1.2, -3.8, 0, cash);
        const scale = new THREE.Group();
        scale.add(at(cyl(0.8, 1, 0.3, 0x5b3cc4, 16), 0, 0.15, 0));
        scale.add(at(cyl(0.12, 0.12, 3.2, GOLD, 8), 0, 1.9, 0));
        const beam = new THREE.Group();
        beam.position.y = 3.5;
        beam.add(box(3.8, 0.16, 0.16, GOLD));
        const hangs = [];
        [-1, 1].forEach((s) => {
            const hang = new THREE.Group();
            hang.position.x = s * 1.8;
            hang.add(at(cyl(0.02, 0.02, 1.2, 0xffffff, 4), 0, -0.6, 0));
            hang.add(at(cyl(0.75, 0.5, 0.14, GOLD, 16), 0, -1.25, 0));
            for (let k = 0; k < 3; k++) hang.add(at(cyl(0.28, 0.28, 0.08, coinMat, 12), (k - 1) * 0.2, -1.12 + k * 0.08, 0));
            beam.add(hang); hangs.push(hang);
        });
        scale.add(beam);
        scale.add(at(ball(0.2, 0xff4d6d, 1), 0, 3.75, 0));
        P(6, -4.4, 0, scale);
        anims.push((t) => { beam.rotation.z = Math.sin(t * 1.4) * 0.28 * Math.max(0, Math.cos(t * 0.35)); hangs.forEach((h) => (h.rotation.z = -beam.rotation.z)); });
    }

    // 14 — Universitas Terbuka (Ilmu Hukum)
    function buildUT(i) {
        const P = placer(i);
        signFor(i, P);
        P(0.5, -11.5, 0, bankFacade(0xf8f9ff, 0x1d4ed8, 0xffd23f));
        const gavel = new THREE.Group();
        gavel.add(at(cyl(0.9, 1, 0.35, 0x8b5a3c, 18), 0, 0.18, 0));
        const arm = new THREE.Group();
        arm.position.set(-1.6, 0.6, 0);
        const hammer = grp(rot(at(cyl(0.09, 0.11, 2, 0x6d3f1f, 8), 1, 0, 0), 0, 0, Math.PI / 2), rot(at(cyl(0.38, 0.38, 1.1, 0x8b5a3c, 14), 1.9, 0, 0), Math.PI / 2, 0, 0), rot(at(cyl(0.4, 0.4, 0.12, GOLD, 14), 1.9, 0, 0.5), Math.PI / 2, 0, 0), rot(at(cyl(0.4, 0.4, 0.12, GOLD, 14), 1.9, 0, -0.5), Math.PI / 2, 0, 0));
        arm.add(hammer);
        gavel.add(arm);
        P(4.5, -4.4, 0, gavel, -0.2);
        anims.push((t) => {
            const p = (t * 0.8) % 1;
            arm.rotation.z = p < 0.15 ? lerp(0.9, 0, p / 0.15) : lerp(0, 0.9, smooth(0.3, 0.9, p));
        });
        const books = new THREE.Group();
        const titles = ["KUHP", "KUH PERDATA", "UUD 1945", "HUKUM PAJAK", "HUKUM DAGANG"];
        titles.forEach((tt, k) => {
            const bk = grp(box(1.8, 0.4, 1.3, [0x1d4ed8, 0x8a5cff, 0xe63946, 0x2a9d8f, 0xff9f1c][k]));
            const lbl = picture(1.6, 0.3, 256, 48, (ctx, w, h) => { ctx.fillStyle = "#ffffff"; ctx.font = `700 30px ${FONT}`; ctx.textAlign = "center"; ctx.fillText(tt, w / 2, 36); });
            lbl.position.set(0, 0, 0.66);
            bk.add(lbl);
            bk.position.y = 0.2 + k * 0.42;
            bk.rotation.y = rr(-0.15, 0.15);
            books.add(bk);
        });
        P(-1.2, -4, 0, books);
        const pasal = picture(1.6, 1.6, 256, 256, (ctx, w, h) => { ctx.fillStyle = "#ffd23f"; ctx.beginPath(); ctx.arc(w / 2, h / 2, 120, 0, TAU); ctx.fill(); ctx.fillStyle = "#1d4ed8"; ctx.font = `700 170px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("§", w / 2, h / 2 + 10); });
        pasal.material.transparent = true;
        const pasalHold = grp(pasal);
        P(1.6, -4.5, 4.5, pasalHold);
        anims.push((t) => { pasal.rotation.y = Math.sin(t * 1.2) * 0.8; pasalHold.position.y = R + 4.5 + Math.sin(t * 1.6) * 0.4; });
        const cap = gradCap(0x1d4ed8, 0.8);
        P(-5.5, -6, 6.4, cap);
        anims.push((t) => { cap.rotation.y = -t * 0.6; cap.position.y = R + 6.4 + Math.sin(t * 1.3) * 0.5; });
    }

    // 15 — LDC CPO Refinery
    function tank(r, h, c, band) {
        const g = grp(at(cyl(r, r, h, c, 24), 0, h / 2, 0));
        const dome = at(mesh(new THREE.SphereGeometry(r, 24, 8, 0, TAU, 0, Math.PI / 2), M(c)), 0, h, 0);
        dome.scale.y = 0.35;
        g.add(dome);
        g.add(at(cyl(r + 0.03, r + 0.03, 0.45, band, 24), 0, h * 0.62, 0));
        for (let k = 0; k < Math.floor(h / 0.5); k++) g.add(at(box(0.5, 0.05, 0.05, 0xffffff), 0, 0.3 + k * 0.5, r + 0.05));
        [-0.25, 0.25].forEach((x) => g.add(at(box(0.05, h, 0.05, 0xffffff), x, h / 2, r + 0.05)));
        return g;
    }
    function buildRefinery(i) {
        const P = placer(i);
        signFor(i, P, -4.8);
        P(-3.2, -10.5, 0, tank(2.4, 4.6, 0xffd23f, 0xff4d6d));
        P(2.4, -12.5, 0, tank(2.9, 5.4, 0x4ecdc4, 0xff7eb6));
        P(7, -9.5, 0, tank(1.8, 3.6, 0xff6b6b, 0xffffff));
        const col = grp(at(cyl(0.9, 0.9, 9, 0xffffff, 14), 0, 4.5, 0), at(ball(0.9, 0xffffff, 1), 0, 9, 0));
        for (let k = 0; k < 6; k++) col.add(at(cyl(1.05, 1.05, 0.2, 0xff9f1c, 14), 0, 1 + k * 1.4, 0));
        P(-7.6, -8.5, 0, col);
        const chimney = new THREE.Group();
        for (let k = 0; k < 6; k++) chimney.add(at(cyl(0.7 - k * 0.03, 0.75 - k * 0.03, 1.6, k % 2 ? 0xffffff : 0xff4d6d, 12), 0, 0.8 + k * 1.6, 0));
        P(-0.6, -15, 0, chimney);
        const puffs = [];
        const puffG = new THREE.Group();
        P(-0.6, -15, 9.8, puffG);
        for (let k = 0; k < 10; k++) { const p = ball(0.6, [0xffffff, 0xffc2e2, 0xe2d4ff][k % 3], 1, { roughness: 1 }); p.castShadow = false; puffG.add(p); puffs.push(p); }
        anims.push((t) => puffs.forEach((p, k) => {
            const u = (t * 0.18 + k / puffs.length) % 1;
            p.position.set(u * 4 + Math.sin(t + k) * 0.3, u * 7, Math.sin(k) * 0.5);
            p.scale.setScalar(0.6 + u * 2.4);
        }));
        for (let k = 0; k < 4; k++) P(-6 + k * 4, -7.2, 0, rot(at(cyl(0.28, 0.28, 4.1, 0x7c5cff, 10), 0, 1.3, 0), 0, 0, Math.PI / 2));
        for (let k = 0; k < 5; k++) P(-7 + k * 3.5, -7.2, 0, at(cyl(0.12, 0.12, 1.3, 0x7c5cff, 6), 0, 0.65, 0));
        [[-8.6, -4, 1.1], [8.8, -4.5, 1], [-5.8, -14.5, 1.3], [9.5, -13, 1.2], [5.2, -15.5, 1.1]].forEach(([dx, z, s]) => P(dx, z, -0.1, palmTree(s), rr(0, TAU)));
        const drop = new THREE.Group();
        const dropMat = M(0xffb703, { emissive: 0xff8c00, emissiveIntensity: 0.25, roughness: 0.25, metalness: 0.1 });
        drop.add(mesh(new THREE.IcosahedronGeometry(0.9, 2), dropMat));
        drop.add(at(cone(0.66, 1.1, dropMat, 16), 0, 0.85, 0));
        [-1, 1].forEach((s) => {
            drop.add(at(ball(0.18, 0xffffff, 1), s * 0.3, 0.15, 0.78));
            drop.add(at(ball(0.09, INK, 1), s * 0.3, 0.15, 0.93));
        });
        drop.add(rot(at(torus(0.2, 0.05, INK, Math.PI), 0, -0.12, 0.86), 0, 0, Math.PI));
        P(3.8, -3.8, 0, grp(drop));
        anims.push((t) => {
            const b = Math.abs(Math.sin(t * 3));
            drop.position.y = 0.9 + b * 1.4;
            drop.scale.set(1 + (1 - b) * 0.18, 1 - (1 - b) * 0.18, 1);
        });
        const ffb = new THREE.Group();
        for (let k = 0; k < 14; k++) ffb.add(at(ball(0.3, k % 3 ? 0xff5a36 : 0x8b1e2d, 0), rr(-0.8, 0.8), 0.3 + Math.floor(k / 5) * 0.35, rr(-0.5, 0.5)));
        P(6.5, -3.6, 0, ffb);
    }

    // 16 — Mega Dinamika
    let crtTex = null;
    function drawCRT(t) {
        const { ctx, canvas: c } = crtTex.userData;
        const w = c.width, h = c.height;
        ctx.fillStyle = "#0b0b2e"; ctx.fillRect(0, 0, w, h);
        ctx.font = `500 30px ${MONO}`;
        ctx.fillStyle = "#39ff88";
        ctx.fillText("> MEGA_DINAMIKA.EXE", 26, 50);
        ["BANK", "CORP", "STOK", "TEKNISI", "INVOICE"].forEach((lb, k) => {
            ctx.fillStyle = "#ffffff"; ctx.font = `500 22px ${MONO}`;
            ctx.fillText(lb, 26, 104 + k * 44);
            ctx.fillStyle = hex(RAINBOW[k]);
            ctx.fillRect(150, 86 + k * 44, 290 + Math.sin(t * 2 + k * 1.3) * 90, 24);
        });
        ctx.fillStyle = "#ff7eb6"; ctx.font = `500 22px ${MONO}`;
        ctx.fillText("RENTAL ONLINE ● 100%", 26, h - 26);
        if (Math.sin(t * 6) > 0) { ctx.fillStyle = "#39ff88"; ctx.fillRect(350, 30, 16, 26); }
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        for (let y = 0; y < h; y += 6) ctx.fillRect(0, y, w, 2);
        crtTex.needsUpdate = true;
    }
    function buildMega(i) {
        const P = placer(i);
        signFor(i, P);
        const crt = new THREE.Group();
        crt.add(at(box(3, 0.6, 2, 0xe9dfc8), 0, 0.3, 0));
        crt.add(at(box(1.2, 0.8, 1.2, 0xe9dfc8), 0, 0.9, 0));
        crt.add(at(box(7.6, 5.6, 4.4, 0xf3ead8), 0, 4, 0));
        crt.add(at(box(6.6, 4.6, 0.2, 0x2b2b3d), 0, 4.1, 2.2));
        crtTex = canvasTex(512, 340, () => {});
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 4.2), new THREE.MeshBasicMaterial({ map: crtTex }));
        screen.position.set(0, 4.1, 2.32);
        crt.add(screen);
        crt.add(at(ball(0.15, 0x39ff88, 0, { emissive: 0x39ff88, emissiveIntensity: 1.2 }), 3.2, 1.6, 2.25));
        P(0.6, -11.5, 0, crt);
        drawCRT(0);
        let crtClock = 0;
        anims.push((t, dt) => { crtClock += dt; if (crtClock > 0.12) { crtClock = 0; drawCRT(t); } });
        const screens = [];
        [-1.2, 2.2, 5.6].forEach((dx, k) => {
            const desk = new THREE.Group();
            desk.add(at(box(2.8, 0.15, 1.3, RAINBOW[k * 2]), 0, 1, 0));
            [[-1.2, -0.5], [1.2, -0.5], [-1.2, 0.5], [1.2, 0.5]].forEach(([x, z]) => desk.add(at(box(0.1, 1, 0.1, 0xffffff), x, 0.5, z)));
            desk.add(at(box(1.4, 1.05, 0.18, 0x2b2b3d), 0, 1.7, -0.25));
            desk.add(at(box(0.2, 0.4, 0.2, 0x2b2b3d), 0, 1.2, -0.3));
            const sm = new THREE.MeshBasicMaterial({ color: RAINBOW[k] });
            const sc = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.85), sm);
            sc.position.set(0, 1.72, -0.15);
            desk.add(sc); screens.push(sm);
            desk.add(at(box(1, 0.06, 0.35, 0xffffff), 0, 1.1, 0.25));
            desk.add(at(ball(0.4, 0x2b2b3d, 1), 0, 0.6, 1.1));
            P(dx, -5.2, 0, desk);
        });
        const tmpC = new THREE.Color();
        anims.push((t) => screens.forEach((m, k) => m.color.copy(tmpC.setHSL((t * 0.15 + k * 0.3) % 1, 0.85, 0.6))));
        const rack = grp(at(box(1.6, 4.4, 1.4, 0x22223a), 0, 2.2, 0));
        const leds = [];
        for (let r = 0; r < 9; r++) for (let c = 0; c < 3; c++) {
            const col = [0x39ff88, 0x4cc9f0, 0xff4fa3][c];
            const led = at(box(0.12, 0.12, 0.05, col, { emissive: col, emissiveIntensity: 1.4 }), -0.4 + c * 0.4, 0.6 + r * 0.42, 0.72);
            rack.add(led); leds.push(led);
        }
        P(-8.2, -7.5, 0, rack, 0.3);
        anims.push((t) => leds.forEach((l, k) => { l.visible = Math.sin(t * (3 + (k % 5)) + k * 1.7) > -0.3; }));
        const floppyG = new THREE.Group();
        P(-1, -4, 0, floppyG);
        const flops = [];
        for (let k = 0; k < 7; k++) {
            const f = grp(box(0.9, 0.9, 0.08, RAINBOW[k]), at(box(0.45, 0.32, 0.1, 0xd7dbe8), 0.05, 0.25, 0), at(box(0.6, 0.35, 0.1, 0xffffff), 0, -0.2, 0));
            floppyG.add(f); flops.push(f);
        }
        anims.push((t) => flops.forEach((f, k) => {
            const a = t * 0.6 + (k / flops.length) * TAU;
            f.position.set(Math.cos(a) * 4.5, 4 + Math.sin(t * 1.5 + k) * 0.7, Math.sin(a) * 1.5);
            f.rotation.set(Math.sin(t + k) * 0.4, t * 1.2 + k, 0);
        }));
        const pixG = new THREE.Group();
        P(0, -3, 0, pixG);
        const pixels = [];
        for (let k = 0; k < 28; k++) { const p = box(0.28, 0.28, 0.28, RAINBOW[k % 8], { emissive: RAINBOW[k % 8], emissiveIntensity: 0.9 }); p.castShadow = false; pixG.add(p); pixels.push([p, rr(-10, 10), rr(-3, 2), rr(0, 1)]); }
        anims.push((t) => pixels.forEach(([p, x, z, o]) => { const u = (t * 0.15 + o) % 1; p.position.set(x, u * 9, z); p.scale.setScalar(Math.sin(u * Math.PI) + 0.01); p.rotation.set(t, t * 1.3, 0); }));
        const van = new THREE.Group();
        van.add(at(box(3, 1.7, 1.6, 0x4cc9f0), -0.3, 1.25, 0));
        van.add(at(box(1.1, 1.2, 1.5, 0x4cc9f0), 1.7, 1, 0));
        van.add(at(box(0.05, 0.6, 1.2, 0xc8f4ff, { emissive: 0xc8f4ff, emissiveIntensity: 0.4 }), 2.26, 1.3, 0));
        van.add(at(box(2.6, 0.5, 0.02, 0xff4fa3), -0.3, 1.4, 0.81));
        [[-1.2, 0.8], [1.6, 0.8], [-1.2, -0.8], [1.6, -0.8]].forEach(([x, z]) => van.add(rot(at(cyl(0.38, 0.38, 0.25, INK, 12), x, 0.38, z), Math.PI / 2, 0, 0)));
        van.add(at(ball(0.14, 0xffff99, 0, { emissive: 0xffff99, emissiveIntensity: 1.5 }), 2.28, 0.7, 0.5));
        P(7.8, -3.8, 0, van, -0.15);
    }

    // 17 — PT Artando Translogistik
    function buildArtando(i) {
        const P = placer(i);
        signFor(i, P);
        const wh = new THREE.Group();
        wh.add(at(box(11, 4.4, 5, 0xe8eef7), 0, 2.2, 0));
        const roof = rot(mesh(new THREE.CylinderGeometry(2.6, 2.6, 11.2, 18, 1, false, -Math.PI / 2, Math.PI), M(0x3a86ff)), 0, 0, Math.PI / 2);
        roof.position.y = 4.4;
        roof.scale.set(1, 1, 0.55);
        wh.add(roof);
        [-2.6, 2.6].forEach((x) => {
            const door = new THREE.Group();
            for (let k = 0; k < 6; k++) door.add(at(box(3, 0.45, 0.06, k % 2 ? 0xd7dbe8 : 0xffffff), 0, 0.3 + k * 0.5, 0));
            door.position.set(x, 0, 2.52);
            wh.add(door);
        });
        const logo = picture(4.4, 0.8, 512, 94, (ctx, w, h) => { ctx.fillStyle = "#ff9f1c"; ctx.fillRect(0, 0, w, h); ctx.fillStyle = "#ffffff"; ctx.font = `700 64px ${FONT}`; ctx.textAlign = "center"; ctx.fillText("ARTANDO", w / 2, 70); });
        logo.position.set(0, 3.9, 2.53);
        wh.add(logo);
        P(0.5, -13, 0, wh);
        for (let k = -5; k <= 5; k++) P(k * 1.9, -5.9, 0.03, box(1, 0.04, 0.16, 0xffffff));
        P(-1.4, -7.2, 0, makeTruck(0xff9f1c), 0.05);
        P(4.6, -7.4, 0, makeTruck(0x3a86ff), -0.05);
        const car = new THREE.Group();
        car.add(at(box(2.4, 0.7, 1.3, 0xff4d6d), 0, 0.65, 0));
        car.add(at(box(1.3, 0.6, 1.2, 0xff4d6d), -0.2, 1.25, 0));
        car.add(at(box(1.2, 0.45, 1.22, 0xbde0fe, { emissive: 0xbde0fe, emissiveIntensity: 0.3 }), -0.2, 1.25, 0));
        [[-0.75, 0.62], [0.75, 0.62], [-0.75, -0.62], [0.75, -0.62]].forEach(([x, z]) => car.add(rot(at(cyl(0.3, 0.3, 0.2, INK, 12), x, 0.3, z), Math.PI / 2, 0, 0)));
        P(8, -4, 0, car, -0.3);
        const boxesG = new THREE.Group();
        P(0.8, -3.8, 0, boxesG);
        const parcels = [];
        for (let k = 0; k < 6; k++) {
            const pc = grp(box(0.7, 0.55, 0.6, 0xd4a373), at(box(0.72, 0.1, 0.12, 0xffd23f), 0, 0.2, 0.25));
            boxesG.add(pc); parcels.push([pc, k]);
        }
        anims.push((t) => parcels.forEach(([pc, k]) => {
            const x = (k % 3) * 0.75 - 0.75, layer = Math.floor(k / 3);
            const hop = Math.max(0, Math.sin(t * 3 - k * 0.9)) * 0.5;
            pc.position.set(x, 0.28 + layer * 0.57 + hop, layer * 0.1);
            pc.rotation.y = Math.sin(t * 3 - k) * 0.1;
        }));
        const cone1 = grp(at(cone(0.3, 0.8, 0xff6a3d, 10), 0, 0.4, 0), at(cyl(0.2, 0.24, 0.12, 0xffffff, 10), 0, 0.42, 0));
        [-2.6, -2, 3].forEach((dx) => P(dx, -3.2, 0, cone1.clone()));
    }

    // 18 — Nexia KPS
    function buildNexia(i) {
        const P = placer(i);
        signFor(i, P);
        const tower = new THREE.Group();
        tower.add(at(box(5, 11, 4, 0x2ec4b6), 0, 5.5, 0));
        for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) tower.add(at(box(0.8, 0.7, 0.06, 0xd8fff6, { emissive: 0xbffff0, emissiveIntensity: 0.35 }), -1.65 + c * 1.1, 1.4 + r * 1.1, 2.02));
        tower.add(at(box(5.4, 0.6, 4.4, 0xffffff), 0, 11.3, 0));
        const logo = makeSign("AUDIT · TAX · ADVISORY", "NEXIA", "#0fb38a", 3.6);
        logo.position.set(0, 10.1, 2.2);
        tower.add(logo);
        P(-0.5, -12.5, 0, tower);
        const t2 = new THREE.Group();
        t2.add(at(box(4, 7, 3.4, 0x7ae7c7), 0, 3.5, 0));
        for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) t2.add(at(box(0.8, 0.8, 0.06, 0xffffff, { emissive: 0xffffff, emissiveIntensity: 0.2 }), -1.1 + c * 1.1, 1.3 + r * 1.2, 1.72));
        P(5.8, -10.5, 0, t2);
        const pile = new THREE.Group();
        for (let k = 0; k < 6; k++) pile.add(rot(at(box(1.5, 0.12, 1.1, k % 2 ? 0xffffff : 0xeef3ff), 0, 0.06 + k * 0.13, 0), 0, rr(-0.4, 0.4), 0));
        const mag = new THREE.Group();
        mag.add(torus(1.2, 0.16, 0xff5d8f));
        mag.add(new THREE.Mesh(new THREE.CircleGeometry(1.16, 32), new THREE.MeshStandardMaterial({ color: 0xbdf7ff, transparent: true, opacity: 0.38 })));
        mag.add(rot(at(cyl(0.14, 0.18, 1.9, 0x2d2d5a, 10), 1.45, -1.45, 0), 0, 0, Math.PI / 4));
        mag.position.y = 2.6;
        pile.add(mag);
        P(3.4, -4.2, 0, pile);
        anims.push((t) => { mag.position.set(Math.sin(t * 0.9) * 1.2, 2.6 + Math.sin(t * 1.8) * 0.25, 0.4); mag.rotation.z = Math.sin(t * 0.9) * 0.2; });
        const binders = new THREE.Group();
        for (let k = 0; k < 7; k++) {
            binders.add(at(box(0.36, 1.6, 1.2, RAINBOW[k]), k * 0.38, 0.8, 0));
            binders.add(at(box(0.2, 0.5, 0.02, 0xffffff), k * 0.38, 1.0, 0.61));
        }
        P(-1.6, -4, 0, binders, 0.15);
        const checkG = new THREE.Group();
        P(0, -5.5, 0, checkG);
        const checks = [];
        for (let k = 0; k < 6; k++) {
            const m = glow(0x2ee59d, 0.7);
            const c = grp(rot(at(box(0.25, 0.7, 0.25, m), -0.25, 0, 0), 0, 0, 0.75), rot(at(box(0.25, 1.4, 0.25, m), 0.3, 0.3, 0), 0, 0, -0.6));
            c.position.set(-6 + k * 2.4, 4.6 + (k % 2) * 1.6, 0);
            checkG.add(c); checks.push(c);
        }
        anims.push((t) => checks.forEach((c, k) => {
            const p = (t * 0.45 + k / checks.length) % 1;
            c.scale.setScalar(Math.max(0.001, easeOutBack(seg(p, 0, 0.25)) * (1 - seg(p, 0.8, 1))));
            c.rotation.y = Math.sin(t + k) * 0.4;
        }));
        const clip = new THREE.Group();
        clip.add(box(1.5, 2, 0.1, 0xb07a4a));
        clip.add(at(box(1.3, 1.7, 0.02, 0xffffff), 0, -0.05, 0.06));
        clip.add(at(box(0.6, 0.2, 0.12, 0xc0c4d6), 0, 0.95, 0.04));
        const ticks = [];
        for (let k = 0; k < 3; k++) {
            clip.add(at(box(0.25, 0.25, 0.02, 0x2d2d5a), -0.4, 0.45 - k * 0.5, 0.08));
            clip.add(at(box(0.6, 0.08, 0.02, 0xc9d2ff), 0.15, 0.45 - k * 0.5, 0.08));
            const tk = at(box(0.18, 0.18, 0.03, 0x2ee59d, { emissive: 0x2ee59d, emissiveIntensity: 0.6 }), -0.4, 0.45 - k * 0.5, 0.1);
            clip.add(tk); ticks.push(tk);
        }
        clip.position.y = 1.2;
        clip.rotation.x = -0.25;
        P(7.2, -3.6, 0, grp(clip), -0.3);
        anims.push((t) => ticks.forEach((tk, k) => { tk.visible = ((t * 0.8) % 4) > k + 0.5; }));
    }

    // 19 — Niaga Integra
    let calcTex = null;
    function drawCalc(value) {
        const { ctx, canvas: c } = calcTex.userData;
        ctx.fillStyle = "#b8ffcf"; ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#13351f"; ctx.font = `500 46px ${MONO}`; ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText("Rp " + value.toLocaleString("id-ID"), c.width - 18, c.height / 2 + 2);
        calcTex.needsUpdate = true;
    }
    function buildNiaga(i) {
        const P = placer(i);
        signFor(i, P);
        const chart = new THREE.Group();
        chart.add(at(box(9.5, 0.3, 3, 0xffffff), 0, 0.15, 0));
        const bars = [];
        [1.6, 2.4, 2.1, 3.4, 4.2, 5.6].forEach((h, k) => { const b = box(1.1, 1, 1.6, RAINBOW[k]); b.position.x = -3.75 + k * 1.5; chart.add(b); bars.push([b, h]); });
        const ang = Math.atan2(5, 8);
        const arrow = new THREE.Group();
        arrow.add(rot(cyl(0.2, 0.2, 8.4, 0xffffff, 8, { emissive: 0xffffff, emissiveIntensity: 0.3 }), 0, 0, -(Math.PI / 2 - ang)));
        arrow.add(rot(at(cone(0.6, 1.2, 0xff3d7f, 10, { emissive: 0xff3d7f, emissiveIntensity: 0.4 }), Math.cos(ang) * 4.4, Math.sin(ang) * 4.4, 0), 0, 0, -(Math.PI / 2 - ang)));
        arrow.position.set(-0.3, 5, 1);
        chart.add(arrow);
        P(-0.8, -9.5, 0, chart);
        anims.push((t) => {
            bars.forEach(([b, h], k) => { const s = h * (0.82 + 0.18 * Math.sin(t * 1.6 + k * 0.8)); b.scale.y = s; b.position.y = 0.3 + s / 2; });
            arrow.position.y = 5 + Math.sin(t * 2) * 0.3;
        });
        const calc = new THREE.Group();
        calc.add(box(2.4, 3.4, 0.5, 0x3a3a7a));
        calcTex = canvasTex(320, 96, () => {});
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.6), new THREE.MeshBasicMaterial({ map: calcTex }));
        scr.position.set(0, 1.15, 0.26);
        calc.add(scr);
        const btns = [];
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
            const col = c === 3 ? 0xff9f1c : r === 3 && c === 2 ? 0xff3d7f : 0xf3ead8;
            const b = at(box(0.42, 0.42, 0.14, col), -0.75 + c * 0.5, 0.45 - r * 0.5, 0.3);
            calc.add(b); btns.push(b);
        }
        calc.position.y = 1.9;
        calc.rotation.x = -0.25;
        P(6, -4.4, 0, grp(calc), -0.35);
        let calcVal = 1250000, calcClock = 0, pressed = 0;
        drawCalc(calcVal);
        anims.push((t, dt) => {
            calcClock += dt;
            if (calcClock > 0.5) {
                calcClock = 0;
                calcVal += Math.floor(rr(50, 900)) * 1000;
                if (calcVal > 99000000) calcVal = 1250000;
                drawCalc(calcVal);
                btns[pressed].position.z = 0.3;
                pressed = Math.floor(rand() * btns.length);
                btns[pressed].position.z = 0.2;
            }
        });
        const pie = new THREE.Group();
        let start = 0;
        const slices = [];
        [0.4, 0.25, 0.2, 0.15].forEach((p, k) => {
            const s = mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.4, 24, 1, false, start * TAU, p * TAU), M([0xff3d7f, 0xffd23f, 0x3d7bff, 0x2ee59d][k]));
            s.userData.mid = (start + p / 2) * TAU;
            pie.add(s); slices.push(s);
            start += p;
        });
        pie.rotation.x = Math.PI / 2;
        const pieHold = grp(pie);
        P(1.8, -4, 3.6, pieHold);
        anims.push((t) => {
            pie.rotation.y = t * 0.7;
            const s = slices[0], pop = Math.max(0, Math.sin(t * 2)) * 0.35;
            s.position.set(Math.sin(s.userData.mid) * pop, 0, Math.cos(s.userData.mid) * pop);
            pieHold.position.y = R + 3.6 + Math.sin(t * 1.5) * 0.3;
        });
        const stacks = new THREE.Group();
        const cm = M(GOLD, { metalness: 0.35, roughness: 0.35 });
        [[0, 5], [0.7, 8], [1.4, 3]].forEach(([x, n]) => { for (let k = 0; k < n; k++) stacks.add(at(cyl(0.3, 0.3, 0.1, cm, 14), x, 0.05 + k * 0.11, 0)); });
        P(-1.6, -3.8, 0, stacks);
    }

    const BUILDERS = {
        baby: buildBaby, tka: buildTKA, tkb: buildTKB, sd: buildSD, smp: buildSMP, sma: buildSMA,
        church: buildChurch, binus: buildBinus, ugm: buildUGM, airport: buildAirport, may: buildMay,
        credit: buildCredit, trisakti: buildTrisakti, teller: buildTeller, ut: buildUT,
        refinery: buildRefinery, mega: buildMega, artando: buildArtando, nexia: buildNexia, niaga: buildNiaga
    };

    /* ============================================================
       SHARED VEHICLE MODELS
       ============================================================ */
    function makeBicycle(color) {
        const g = new THREE.Group();
        const wheels = [];
        [-0.85, 0.85].forEach((x) => {
            const w = grp(torus(0.55, 0.06, INK), box(0.04, 1.05, 0.04, 0xd7dbe8), rot(box(0.04, 1.05, 0.04, 0xd7dbe8), 0, 0, Math.PI / 2));
            w.position.set(x, 0.6, 0);
            g.add(w); wheels.push(w);
        });
        g.add(rot(at(box(1.3, 0.09, 0.09, color), 0.05, 1.2, 0), 0, 0, -0.05));
        g.add(rot(at(box(1.15, 0.09, 0.09, color), 0.25, 0.9, 0), 0, 0, 0.62));
        g.add(rot(at(box(0.9, 0.09, 0.09, color), -0.45, 0.9, 0), 0, 0, -0.95));
        g.add(rot(at(box(0.09, 0.75, 0.09, color), -0.3, 1.05, 0), 0, 0, -0.25));
        g.add(rot(at(box(0.09, 0.8, 0.09, color), 0.75, 1, 0), 0, 0, -0.25));
        g.add(at(box(0.5, 0.08, 0.3, INK), -0.4, 1.45, 0));
        g.add(at(box(0.07, 0.07, 0.75, INK), 0.85, 1.42, 0));
        g.add(at(box(0.3, 0.2, 0.28, 0xffffff), 1.05, 1.15, 0));
        g.userData.wheels = wheels;
        return g;
    }
    function makeTruck(color) {
        const g = new THREE.Group();
        g.add(at(box(4.8, 0.3, 1.6, 0x2b2b3d), 0, 0.55, 0));
        g.add(at(box(1.3, 1.6, 1.8, color), 1.75, 1.45, 0));
        g.add(at(box(0.06, 0.7, 1.5, 0xbde0fe, { emissive: 0xbde0fe, emissiveIntensity: 0.3 }), 2.42, 1.75, 0));
        g.add(at(box(0.6, 0.5, 0.06, 0xbde0fe, { emissive: 0xbde0fe, emissiveIntensity: 0.3 }), 1.85, 1.75, 0.92));
        g.add(at(box(3.4, 2.2, 1.95, 0xffffff), -0.75, 1.8, 0));
        const label = picture(3, 0.7, 512, 120, (ctx, w, h) => {
            ctx.fillStyle = hex(color); ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "#ffffff"; ctx.font = `700 76px ${FONT}`; ctx.textAlign = "center"; ctx.fillText("ARTANDO", w / 2, 88);
        });
        label.position.set(-0.75, 1.9, 0.985);
        g.add(label);
        g.add(at(ball(0.14, 0xffff99, 0, { emissive: 0xffff99, emissiveIntensity: 1.4 }), 2.42, 0.95, 0.6));
        const wheels = [];
        [[-1.7, 0.85], [-0.9, 0.85], [1.75, 0.85], [-1.7, -0.85], [-0.9, -0.85], [1.75, -0.85]].forEach(([x, z]) => {
            const w = grp(rot(cyl(0.42, 0.42, 0.28, INK, 14), Math.PI / 2, 0, 0), rot(at(cyl(0.18, 0.18, 0.3, 0xd7dbe8, 8), 0, 0, 0), Math.PI / 2, 0, 0));
            w.position.set(x, 0.42, z);
            g.add(w); wheels.push(w);
        });
        g.userData.wheels = wheels;
        return g;
    }

    /* ============================================================
       HERO — Jovi
       ============================================================ */
    function buildHero() {
        const root = new THREE.Group();
        const body = new THREE.Group();
        root.add(body);
        const shirt = new THREE.MeshStandardMaterial({ color: 0xff5fa2, roughness: 0.6, flatShading: true });
        const pants = new THREE.MeshStandardMaterial({ color: DEFAULT_PANTS, roughness: 0.6, flatShading: true });
        const tieMat = new THREE.MeshStandardMaterial({ color: 0x3d7bff, roughness: 0.5, flatShading: true });
        const bagMat = new THREE.MeshStandardMaterial({ color: 0xff4d6d, roughness: 0.5, flatShading: true });
        const skin = M(0xf2b98b), hair = M(0x20182a), shoe = M(0xffffff);
        const legs = [], arms = [];
        [-1, 1].forEach((s) => {
            const p = new THREE.Group();
            p.position.set(0, 0.92, s * 0.17);
            p.add(at(mesh(new THREE.BoxGeometry(0.26, 0.8, 0.26), pants), 0, -0.42, 0));
            p.add(at(mesh(new THREE.BoxGeometry(0.42, 0.18, 0.3), shoe), 0.07, -0.84, 0));
            body.add(p); legs.push(p);
        });
        body.add(at(mesh(new THREE.BoxGeometry(0.46, 0.84, 0.62), shirt), 0, 1.32, 0));
        [-1, 1].forEach((s) => {
            const p = new THREE.Group();
            p.position.set(0, 1.66, s * 0.42);
            p.add(at(mesh(new THREE.BoxGeometry(0.2, 0.66, 0.2), shirt), 0, -0.3, 0));
            p.add(at(mesh(new THREE.IcosahedronGeometry(0.12, 0), skin), 0, -0.68, 0));
            body.add(p); arms.push(p);
        });
        const head = new THREE.Group();
        head.position.y = 2.08;
        body.add(head);
        head.add(mesh(new THREE.BoxGeometry(0.62, 0.6, 0.62), skin));
        head.add(at(mesh(new THREE.BoxGeometry(0.68, 0.2, 0.68), hair), 0, 0.31, 0));
        head.add(at(mesh(new THREE.BoxGeometry(0.22, 0.46, 0.68), hair), -0.24, 0.08, 0));
        head.add(at(mesh(new THREE.BoxGeometry(0.2, 0.12, 0.68), hair), 0.24, 0.2, 0));
        [-1, 1].forEach((s) => {
            head.add(at(box(0.04, 0.1, 0.08, INK), 0.315, 0.02, s * 0.14));
            head.add(at(box(0.03, 0.06, 0.1, 0xff8fab), 0.315, -0.1, s * 0.2));
        });
        head.add(at(box(0.03, 0.04, 0.16, 0x7a2e3a), 0.315, -0.15, 0));

        const acc = {};
        acc.gradCap = grp(at(box(0.9, 0.06, 0.9, 0x1e1e2e), 0, 0.5, 0), at(box(0.66, 0.2, 0.66, 0x1e1e2e), 0, 0.4, 0), at(cyl(0.015, 0.015, 0.35, GOLD, 4), 0.42, 0.35, 0.42), at(ball(0.05, GOLD, 0), 0.42, 0.18, 0.42));
        head.add(acc.gradCap);
        acc.hardhat = grp(at(mesh(new THREE.SphereGeometry(0.42, 14, 8, 0, TAU, 0, Math.PI / 2), M(0xffd23f)), 0, 0.26, 0), at(cyl(0.5, 0.5, 0.05, 0xffd23f, 16), 0.06, 0.28, 0), at(box(0.5, 0.06, 0.06, 0xff4d6d), 0, 0.5, 0));
        head.add(acc.hardhat);
        acc.glasses = new THREE.Group();
        [-1, 1].forEach((s) => acc.glasses.add(rot(at(torus(0.1, 0.025, INK), 0.33, 0.03, s * 0.15), 0, Math.PI / 2, 0)));
        acc.glasses.add(at(box(0.03, 0.03, 0.12, INK), 0.33, 0.05, 0));
        head.add(acc.glasses);
        acc.headset = grp(rot(at(torus(0.36, 0.04, 0xb14dff, Math.PI), 0, 0.05, 0), 0, Math.PI / 2, 0));
        [-1, 1].forEach((s) => acc.headset.add(rot(at(cyl(0.13, 0.13, 0.08, 0xb14dff, 10), 0, 0, s * 0.34), Math.PI / 2, 0, 0)));
        acc.headset.add(rot(at(box(0.36, 0.04, 0.04, INK), 0.2, -0.15, 0.3), 0, 0.5, 0));
        acc.headset.add(at(ball(0.05, 0x39ff88, 0, { emissive: 0x39ff88, emissiveIntensity: 1 }), 0.36, -0.16, 0.22));
        head.add(acc.headset);
        acc.pacifier = grp(rot(at(torus(0.07, 0.025, 0xff7eb6), 0.36, -0.13, 0), 0, Math.PI / 2, 0), at(box(0.04, 0.12, 0.18, 0x4cc9f0), 0.33, -0.13, 0));
        head.add(acc.pacifier);
        acc.tie = grp(at(mesh(new THREE.BoxGeometry(0.05, 0.12, 0.12), tieMat), 0.24, 1.66, 0), rot(at(mesh(new THREE.BoxGeometry(0.04, 0.48, 0.12), tieMat), 0.245, 1.36, 0), 0, 0, 0.02));
        body.add(acc.tie);
        acc.lanyard = grp(at(box(0.03, 0.4, 0.04, 0x00a6a6), 0.235, 1.48, 0.12), at(box(0.03, 0.4, 0.04, 0x00a6a6), 0.235, 1.48, -0.12), at(box(0.04, 0.24, 0.18, 0xffffff), 0.245, 1.2, 0), at(box(0.045, 0.08, 0.12, 0xff4d6d), 0.25, 1.26, 0));
        body.add(acc.lanyard);
        acc.backpack = grp(at(mesh(new THREE.BoxGeometry(0.28, 0.55, 0.5), bagMat), -0.37, 1.35, 0), at(mesh(new THREE.BoxGeometry(0.1, 0.25, 0.4), bagMat), -0.53, 1.22, 0), at(box(0.48, 0.05, 0.06, 0x1d1530), 0, 1.62, 0.2), at(box(0.48, 0.05, 0.06, 0x1d1530), 0, 1.62, -0.2));
        body.add(acc.backpack);
        acc.shirtFront = grp(at(box(0.03, 0.82, 0.24, 0xffffff), 0.235, 1.32, 0), rot(at(box(0.04, 0.16, 0.12, 0xffffff), 0.24, 1.68, 0.09), 0.5, 0, 0), rot(at(box(0.04, 0.16, 0.12, 0xffffff), 0.24, 1.68, -0.09), -0.5, 0, 0));
        body.add(acc.shirtFront);
        acc.rose = grp(at(ball(0.075, 0xe0234e, 1), 0.25, 1.56, 0.2), at(box(0.03, 0.05, 0.1, 0x2ecc71), 0.25, 1.48, 0.22));
        body.add(acc.rose);
        return { root, body, legs, arms, head, shirt, pants, tieMat, bagMat, acc, phase: 0, scale: 0.45 };
    }

    /* ============================================================
       VEHICLES
       ============================================================ */
    const rig = new THREE.Group();
    rig.position.set(0, R, 0);
    scene.add(rig);
    let hero;
    const V = {};
    const v1 = new THREE.Vector3();

    function seat(g, x, y, z) { const s = new THREE.Group(); s.position.set(x, y, z); g.add(s); g.userData.seat = s; }

    function balloonBunch(colors, hearts) {
        const g = new THREE.Group();
        const knot = new THREE.Vector3(0.05, 2.35, 0.42);
        colors.forEach((c, k) => {
            const a = (k / colors.length) * TAU;
            const p = new THREE.Vector3(Math.cos(a) * 0.9 + 0.1, 4.6 + Math.sin(a * 2) * 0.35 + (k % 2) * 0.5, Math.sin(a) * 0.9 + 0.4);
            let b;
            if (hearts) b = heartMesh(c, 0.75, { roughness: 0.25, emissive: c, emissiveIntensity: 0.15 });
            else { b = ball(0.55, c, 2, { roughness: 0.25, emissive: c, emissiveIntensity: 0.12 }); b.scale.y = 1.2; }
            b.position.copy(p);
            g.add(b);
            const dir = p.clone().sub(knot);
            const len = dir.length() - 0.5;
            const str = mesh(new THREE.CylinderGeometry(0.012, 0.012, len, 4), M(0xffffff), false);
            str.position.copy(knot).add(dir.clone().normalize().multiplyScalar(len / 2));
            str.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
            g.add(str);
        });
        return g;
    }

    function buildVehicles() {
        V.balloon = balloonBunch(RAINBOW.slice(0, 7), false);
        V.hearts = balloonBunch([0xff2d6f, 0xff7eb6, 0xffffff, 0xff4d6d, 0xffb3c6, 0xb14dff], true);

        // pesawat
        const plane = new THREE.Group();
        const pl = new THREE.Group();
        pl.scale.setScalar(1.35);
        plane.add(pl);
        pl.add(rot(at(cyl(0.55, 0.38, 3.4, 0xffffff, 12), 0, 0.9, 0), 0, 0, Math.PI / 2));
        pl.add(rot(at(cyl(0.38, 0.55, 0.5, 0xff4d6d, 12), 1.9, 0.9, 0), 0, 0, Math.PI / 2));
        const prop = new THREE.Group();
        prop.position.set(2.2, 0.9, 0);
        prop.add(box(0.06, 1.8, 0.18, INK));
        prop.add(rot(box(0.06, 1.8, 0.18, INK), Math.PI / 2, 0, 0));
        prop.add(at(ball(0.14, GOLD, 0), 0.05, 0, 0));
        pl.add(prop);
        pl.add(at(box(1.1, 0.1, 5.2, 0x00a6a6), 0.2, 0.75, 0));
        pl.add(at(box(0.6, 0.85, 0.1, 0x00a6a6), -1.6, 1.4, 0));
        pl.add(at(box(0.55, 0.08, 1.7, 0x00a6a6), -1.6, 1, 0));
        [-0.5, 0.5].forEach((z) => pl.add(rot(at(cyl(0.18, 0.18, 0.1, INK, 10), 0.6, 0.2, z), Math.PI / 2, 0, 0)));
        pl.add(at(box(0.6, 0.06, 0.06, INK), 0.6, 0.35, 0));
        seat(pl, -0.2, 1.05, 0);
        plane.userData.seat = pl.userData.seat;
        plane.userData.prop = prop;
        V.plane = plane;

        // koin raksasa
        const coinV = new THREE.Group();
        const spin = new THREE.Group();
        spin.position.y = 1.7;
        coinV.add(spin);
        const rpTex = canvasTex(256, 256, (ctx, w, h) => {
            ctx.fillStyle = "#ffb703"; ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = "#ffe08a"; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(w / 2, h / 2, 100, 0, TAU); ctx.stroke();
            ctx.fillStyle = "#ffffff"; ctx.font = `700 96px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("Rp", w / 2, h / 2 + 6);
        });
        const rpMat = new THREE.MeshStandardMaterial({ map: rpTex, roughness: 0.35, metalness: 0.3 });
        spin.add(rot(mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.6, 36), [M(0xffa600, { metalness: 0.3 }), rpMat, rpMat]), Math.PI / 2, 0, 0));
        seat(coinV, 0, 3.42, 0);
        coinV.userData.spin = spin;
        V.coin = coinV;

        // ferry
        const ferry = new THREE.Group();
        ferry.add(at(box(4.6, 0.9, 1.9, 0xff4d6d), 0, 0.55, 0));
        ferry.add(at(box(3.8, 0.35, 1.7, 0x2d2d5a), 0, 0.1, 0));
        ferry.add(rot(at(cone(0.95, 1.1, 0xff4d6d, 4), 2.75, 0.55, 0), 0, Math.PI / 4, -Math.PI / 2));
        ferry.add(at(box(4.7, 0.14, 1.95, 0xffffff), 0, 1.0, 0));
        ferry.add(at(box(1.7, 1.1, 1.5, 0xffffff), -0.9, 1.6, 0));
        for (let k = 0; k < 3; k++) ferry.add(at(box(0.3, 0.3, 0.05, 0x4cc9f0, { emissive: 0x4cc9f0, emissiveIntensity: 0.4 }), -1.45 + k * 0.55, 1.75, 0.76));
        ferry.add(at(cyl(0.25, 0.3, 1.1, GOLD, 10), -1.3, 2.6, 0));
        ferry.add(at(box(0.04, 1.2, 0.04, 0xffffff), 1.9, 1.6, 0));
        ferry.add(at(box(0.5, 0.18, 0.02, 0xff2d2d), 2.16, 2.1, 0));
        ferry.add(at(box(0.5, 0.18, 0.02, 0xffffff), 2.16, 1.92, 0));
        ferry.add(at(torus(0.25, 0.08, 0xff9f1c), -0.2, 1.6, 0.78));
        const smokes = [];
        for (let k = 0; k < 5; k++) { const s = ball(0.25, 0xffffff, 1, { roughness: 1 }); s.castShadow = false; ferry.add(s); smokes.push(s); }
        const splashes = [];
        for (let k = 0; k < 6; k++) { const s = ball(0.15, 0xe6fbff, 0); s.castShadow = false; ferry.add(s); splashes.push(s); }
        seat(ferry, 1.1, 1.07, 0);
        ferry.userData.smokes = smokes;
        ferry.userData.splashes = splashes;
        V.ferry = ferry;

        // motor
        const moto = new THREE.Group();
        const tiltM = new THREE.Group();
        tiltM.position.x = -1.05;
        moto.add(tiltM);
        const bike = new THREE.Group();
        bike.position.x = 1.05;
        tiltM.add(bike);
        const wheels = [];
        [-1.05, 1.05].forEach((x) => {
            const w = grp(torus(0.42, 0.15, INK), box(0.06, 0.7, 0.06, 0xd7dbe8), rot(box(0.06, 0.7, 0.06, 0xd7dbe8), 0, 0, Math.PI / 2));
            w.position.set(x, 0.56, 0);
            bike.add(w); wheels.push(w);
        });
        bike.add(rot(at(box(1.9, 0.5, 0.5, 0x39d353), 0.05, 1.0, 0), 0, 0, 0.12));
        bike.add(rot(at(box(0.9, 0.6, 0.55, 0x39d353), 0.95, 1.2, 0), 0, 0, -0.5));
        bike.add(at(box(0.7, 0.3, 0.5, 0x2a9d3f), 0.25, 1.35, 0));
        bike.add(at(box(0.9, 0.14, 0.42, INK), -0.4, 1.32, 0));
        bike.add(at(box(0.08, 0.08, 0.9, 0xd7dbe8), 0.85, 1.55, 0));
        bike.add(at(ball(0.13, 0xffff99, 0, { emissive: 0xffff99, emissiveIntensity: 1.4 }), 1.33, 1.25, 0));
        bike.add(rot(at(cyl(0.1, 0.12, 0.8, 0xc0c4d6, 8), -0.7, 0.75, 0.3), 0, 0, Math.PI / 2 - 0.25));
        seat(bike, -0.25, 0.95, 0);
        moto.userData.seat = bike.userData.seat;
        moto.userData.tilt = tiltM;
        moto.userData.wheels = wheels;
        const lines = [];
        for (let k = 0; k < 10; k++) { const l = box(rr(1, 2.4), 0.05, 0.05, 0xffffff); l.castShadow = false; moto.add(l); lines.push([l, rr(0.3, 2.6), rr(-1, 1), rand()]); }
        moto.userData.lines = lines;
        V.moto = moto;

        // sepeda
        const bicycle = makeBicycle(0xff4d6d);
        bicycle.scale.setScalar(1.15);
        seat(bicycle, -0.4, 0.82, 0);
        V.bicycle = bicycle;

        // bus sekolah
        const bus = new THREE.Group();
        bus.add(at(box(5, 1.9, 2, 0xffc93c), 0, 1.45, 0));
        bus.add(at(box(1, 1.1, 1.95, 0xffc93c), 2.9, 1, 0));
        bus.add(at(box(5.02, 0.18, 2.02, INK), 0, 1.05, 0));
        for (let k = 0; k < 6; k++) bus.add(at(box(0.6, 0.6, 0.06, 0x9ad1ff, { emissive: 0x9ad1ff, emissiveIntensity: 0.3 }), -2 + k * 0.78, 1.85, 1.01));
        bus.add(at(box(0.06, 0.7, 1.6, 0x9ad1ff, { emissive: 0x9ad1ff, emissiveIntensity: 0.3 }), 2.52, 1.85, 0));
        bus.add(at(box(5.2, 0.12, 2.1, 0xffffff), 0, 2.45, 0));
        const busLabel = picture(2.6, 0.38, 512, 76, (ctx, w, h) => { ctx.fillStyle = "#1d1530"; ctx.fillRect(0, 0, w, h); ctx.fillStyle = "#ffc93c"; ctx.font = `700 54px ${FONT}`; ctx.textAlign = "center"; ctx.fillText("BUS SEKOLAH", w / 2, 58); });
        busLabel.position.set(-0.4, 1.3, 1.02);
        bus.add(busLabel);
        const busWheels = [];
        [[-1.7, 1], [1.8, 1], [-1.7, -1], [1.8, -1]].forEach(([x, z]) => { const w = grp(rot(cyl(0.45, 0.45, 0.3, INK, 14), Math.PI / 2, 0, 0), rot(cyl(0.2, 0.2, 0.32, 0xd7dbe8, 8), Math.PI / 2, 0, 0)); w.position.set(x, 0.45, z); bus.add(w); busWheels.push(w); });
        bus.add(at(ball(0.15, 0xffff99, 0, { emissive: 0xffff99, emissiveIntensity: 1.3 }), 3.42, 0.95, 0.7));
        seat(bus, 0.3, 2.5, 0);
        bus.userData.wheels = busWheels;
        V.bus = bus;

        // kereta
        const krl = new THREE.Group();
        const car = (x, front) => {
            const c = new THREE.Group();
            c.position.x = x;
            c.add(at(box(4.2, 0.3, 1.9, 0xf1f1f1), 0, 0.45, 0));
            [-0.95, 0.95].forEach((z) => {
                c.add(at(box(4.2, 0.9, 0.06, 0xffffff), 0, 1.05, z));
                c.add(at(box(4.22, 0.2, 0.08, 0xe63946), 0, 1.25, z));
            });
            c.add(at(box(4.4, 0.2, 2.1, 0xffffff), 0, 2.95, 0));
            c.add(at(box(4.42, 0.12, 2.12, 0xe63946), 0, 2.8, 0));
            [-2.05, 0, 2.05].forEach((px) => [-0.95, 0.95].forEach((z) => c.add(at(box(0.12, 2.4, 0.12, 0xffffff), px, 1.75, z))));
            c.add(at(box(0.1, 2.4, 1.9, 0xffffff), -2.1, 1.75, 0));
            if (front) {
                c.add(at(box(0.6, 2.2, 1.9, 0xe63946), 2.35, 1.6, 0));
                c.add(at(box(0.06, 0.8, 1.4, 0x1d1530), 2.66, 2, 0));
                c.add(at(ball(0.14, 0xffff99, 0, { emissive: 0xffff99, emissiveIntensity: 1.4 }), 2.67, 0.9, 0.6));
                c.add(at(ball(0.14, 0xffff99, 0, { emissive: 0xffff99, emissiveIntensity: 1.4 }), 2.67, 0.9, -0.6));
            }
            [-1.5, 1.5].forEach((wx) => [-0.85, 0.85].forEach((z) => c.add(rot(at(cyl(0.28, 0.28, 0.15, INK, 12), wx, 0.28, z), Math.PI / 2, 0, 0))));
            return c;
        };
        krl.add(car(0.6, true));
        krl.add(car(-3.9, false));
        krl.add(at(box(0.4, 0.2, 0.3, INK), -1.65, 0.55, 0));
        seat(krl, 0.6, 0.6, 0);
        V.krl = krl;

        // truk Artando
        const truck = makeTruck(0xff9f1c);
        seat(truck, -0.75, 2.9, 0);
        V.truck = truck;

        // piksel
        const pixel = new THREE.Group();
        const cubes = [];
        const parts = [[0, 0.1, 0.45, 0.13, 0.17], [0, 0.95, 1.7, 0.24, 0.32], [0, 1.75, 2.38, 0.31, 0.31], [0, 1.0, 1.65, 0.1, 0.5]];
        for (let k = 0; k < 110; k++) {
            const pp = parts[k % parts.length];
            let home;
            if (pp === parts[0]) home = new THREE.Vector3(rr(-0.13, 0.13), rr(0.1, 0.9), (k % 2 ? 1 : -1) * 0.17 + rr(-0.12, 0.12));
            else if (pp === parts[3]) home = new THREE.Vector3(rr(-0.1, 0.1), rr(1.0, 1.65), (k % 2 ? 1 : -1) * 0.45);
            else home = new THREE.Vector3(rr(-pp[3], pp[3]), rr(pp[1], pp[2]), rr(-pp[4], pp[4]));
            const c = RAINBOW[k % 8];
            const cube = box(0.17, 0.17, 0.17, c, { emissive: c, emissiveIntensity: 0.9 });
            cube.castShadow = false;
            pixel.add(cube);
            cubes.push({ cube, home, k });
        }
        pixel.userData.cubes = cubes;
        V.pixel = pixel;

        // pesawat kertas
        const paper = new THREE.Group();
        const pp2 = new THREE.Group();
        pp2.scale.setScalar(1.5);
        paper.add(pp2);
        const pts = { nose: [2.2, 0, 0], l: [-1.6, 0.15, -1.6], r: [-1.6, 0.15, 1.6], tail: [-1.6, 0, 0], keel: [-1.4, -0.55, 0] };
        const tri = (a, b, c) => [...pts[a], ...pts[b], ...pts[c]];
        const wingGeo = new THREE.BufferGeometry();
        wingGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([...tri("nose", "tail", "l"), ...tri("nose", "r", "tail")]), 3));
        wingGeo.computeVertexNormals();
        const keelGeo = new THREE.BufferGeometry();
        keelGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([...tri("nose", "keel", "tail")]), 3));
        keelGeo.computeVertexNormals();
        pp2.add(mesh(wingGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, flatShading: true, roughness: 0.8 })));
        pp2.add(mesh(keelGeo, new THREE.MeshStandardMaterial({ color: 0xc9d2ff, side: THREE.DoubleSide, flatShading: true })));
        pp2.add(at(box(1.6, 0.02, 0.06, 0x5b6dff), -0.4, 0.09, 0.9));
        pp2.add(at(box(1.6, 0.02, 0.06, 0x5b6dff), -0.4, 0.09, -0.9));
        pp2.position.y = 0.6;
        seat(pp2, -0.5, 0.05, 0);
        paper.userData.seat = pp2.userData.seat;
        V.paper = paper;

        // roket
        const rocket = new THREE.Group();
        rocket.add(at(cyl(0.85, 0.85, 3.6, 0xffffff, 18), 0, 2.4, 0));
        rocket.add(at(cone(0.85, 1.6, 0xff3d7f, 18), 0, 5, 0));
        rocket.add(at(cyl(0.88, 0.88, 0.3, 0xffd23f, 18), 0, 3.6, 0));
        rocket.add(rot(at(cyl(0.38, 0.38, 0.1, 0x4cc9f0, 16, { emissive: 0x4cc9f0, emissiveIntensity: 0.6 }), 0, 2.7, 0.82), Math.PI / 2, 0, 0));
        rocket.add(at(torus(0.38, 0.07, 0xd7dbe8), 0, 2.7, 0.86));
        for (let k = 0; k < 3; k++) {
            const fh = new THREE.Group();
            fh.add(at(box(0.12, 1.3, 0.9, 0xff3d7f), 0, 0.95, 0.95));
            fh.rotation.y = (k / 3) * TAU + 0.5;
            rocket.add(fh);
        }
        rocket.add(at(cyl(0.6, 0.75, 0.4, 0x5b6dff, 14), 0, 0.45, 0));
        const flame = new THREE.Group();
        flame.add(rot(at(cone(0.6, 1.8, 0xff9f1c, 12, { emissive: 0xff7b00, emissiveIntensity: 1.2 }), 0, -0.6, 0), Math.PI, 0, 0));
        flame.add(rot(at(cone(0.35, 1.2, 0xffee88, 12, { emissive: 0xffee88, emissiveIntensity: 1.5 }), 0, -0.3, 0), Math.PI, 0, 0));
        flame.children.forEach((c) => (c.castShadow = false));
        flame.position.y = 0.2;
        rocket.add(flame);
        const rsmoke = [];
        for (let k = 0; k < 12; k++) { const s = ball(0.6, 0xffffff, 1, { roughness: 1 }); s.castShadow = false; rocket.add(s); rsmoke.push(s); }
        seat(rocket, -0.1, 5.25, 0);
        rocket.userData.flame = flame;
        rocket.userData.smoke = rsmoke;
        V.rocket = rocket;

        // portal teleport
        const warp = new THREE.Group();
        const rings = [];
        RAINBOW.slice(0, 6).forEach((c, k) => {
            const r = rot(torus(0.9 + k * 0.28, 0.07, c, TAU, { emissive: c, emissiveIntensity: 1.1 }), Math.PI / 2, 0, 0);
            r.castShadow = false;
            r.position.y = 0.06 + k * 0.02;
            warp.add(r); rings.push(r);
        });
        const hole = rot(mesh(new THREE.CircleGeometry(0.95, 32), new THREE.MeshBasicMaterial({ color: 0x12063d }), false), -Math.PI / 2, 0, 0);
        hole.position.y = 0.05;
        warp.add(hole);
        const beam = mesh(new THREE.CylinderGeometry(0.9, 1.1, 14, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff1ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }), false);
        beam.position.y = 7;
        warp.add(beam);
        const sparks = [];
        for (let k = 0; k < 24; k++) { const sp = ball(0.09, RAINBOW[k % 8], 0, { emissive: RAINBOW[k % 8], emissiveIntensity: 1.2 }); sp.castShadow = false; warp.add(sp); sparks.push(sp); }
        warp.userData = { rings, beam, sparks };
        V.warp = warp;

        Object.values(V).forEach((g) => { g.visible = false; rig.add(g); });

        const poof = new THREE.Group();
        for (let k = 0; k < 14; k++) { const s = ball(0.12, RAINBOW[k % 8], 0, { emissive: RAINBOW[k % 8], emissiveIntensity: 1 }); s.castShadow = false; poof.add(s); }
        poof.visible = false;
        rig.add(poof);
        V._poof = poof;
    }

    let poofT = 1;
    function firePoof() { poofT = 0; V._poof.visible = true; }
    function updatePoof(dt) {
        if (poofT >= 1) return;
        poofT = Math.min(1, poofT + dt / 0.6);
        const p = V._poof;
        p.position.copy(hero.root.position);
        p.children.forEach((s, k) => {
            const a = (k / p.children.length) * TAU;
            const r = easeOutBack(poofT) * 1.6;
            s.position.set(Math.cos(a) * r * 0.6, 1.4 * hero.scale + Math.sin(a) * r, Math.sin(a * 3) * 0.6);
            s.scale.setScalar(Math.max(0.001, 1 - poofT));
        });
        if (poofT >= 1) p.visible = false;
    }

    let targetScale = 0.45;
    const MAY_IDX = CHAPTERS.findIndex((c) => c.world === "may");
    let kissClock = 0, kissHearts = null, kissHeartT = 1, kissFired = false;
    function buildKissHearts() {
        kissHearts = new THREE.Group();
        for (let k = 0; k < 9; k++) { const h = heartMesh([0xff2d6f, 0xff7eb6, 0xffffff][k % 3], 0.22, { emissive: 0xff2d6f, emissiveIntensity: 0.4 }); h.children.forEach((c) => (c.castShadow = false)); kissHearts.add(h); }
        kissHearts.visible = false;
        rig.add(kissHearts);
    }
    function updateMay(dt) {
        if (!mayNPC) return;
        const here = started && !trans && current === MAY_IDX;
        kissClock = here ? kissClock + dt : 0;
        const cyc = kissClock % 5;
        const k = here && kissClock > 0.6 ? Math.sin(Math.PI * seg(cyc, 0.5, 2.1)) : 0;
        const m = mayNPC;
        m.body.rotation.z = damp(m.body.rotation.z, -0.17 * k, 10, dt);
        m.head.rotation.x = damp(m.head.rotation.x, 0.22 * k, 10, dt);
        m.head.rotation.y = damp(m.head.rotation.y, here ? 0 : Math.sin(kissClock) * 0.1, 4, dt);
        const chin = here && k < 0.05 ? 0 : 1;
        m.arms[1].rotation.z = damp(m.arms[1].rotation.z, k > 0.05 ? 1.5 : 2.35 * (1 - chin * 0) , 8, dt);
        m.arms[0].rotation.z = damp(m.arms[0].rotation.z, k > 0.05 ? 0.9 : Math.sin(kissClock * 1.3) * 0.05, 8, dt);
        if (here) {
            hero.body.rotation.z = -0.17 * k;
            hero.head.rotation.x = -0.22 * k;
            hero.arms[1].rotation.z = damp(hero.arms[1].rotation.z, k > 0.05 ? 1.4 : 0.1, 10, dt);
            if (cyc > 1.25 && cyc < 1.4 && !kissFired) { kissFired = true; kissHeartT = 0; kissHearts.visible = true; }
            if (cyc < 1) kissFired = false;
        } else {
            hero.head.rotation.x = damp(hero.head.rotation.x, 0, 8, dt);
        }
        if (kissHeartT < 1) {
            kissHeartT = Math.min(1, kissHeartT + dt / 1.6);
            kissHearts.children.forEach((h, j) => {
                const a = (j / kissHearts.children.length) * TAU;
                const u = kissHeartT;
                h.position.set(0.66 + Math.cos(a) * u * 1.4, 2.3 + u * 2.6 + Math.sin(a * 2) * 0.3, Math.sin(a) * u * 1.2);
                h.rotation.y = u * 4 + j;
                h.scale.setScalar(Math.max(0.001, Math.sin(Math.PI * Math.min(1, u * 1.3)) * (1 + (j % 3) * 0.3)));
            });
            if (kissHeartT >= 1) kissHearts.visible = false;
        }
    }
    function setOutfit(i) {
        const o = CHAPTERS[i].outfit;
        hero.shirt.color.setHex(o.shirt);
        hero.pants.color.setHex(o.pants || DEFAULT_PANTS);
        if (o.tie) hero.tieMat.color.setHex(o.tie);
        if (o.bag) hero.bagMat.color.setHex(o.bag);
        Object.entries(hero.acc).forEach(([k, g]) => { g.visible = o.acc.includes(k); });
        hero.acc.gradCap.position.set(0, 0, 0);
        hero.acc.gradCap.rotation.set(0, 0, 0);
        targetScale = o.scale || 1;
    }

    /* ============================================================
       HERO POSES
       ============================================================ */
    function poseHero(dt, pose, speed, t) {
        hero.phase += dt * speed;
        const ph = hero.phase;
        let L0 = 0, L1 = 0, A0 = 0, A1 = 0, bob = 0, lean = 0, headTilt = 0;
        switch (pose) {
            case "walk":
            case "run": {
                const amp = pose === "run" ? 0.95 : 0.7;
                L0 = Math.sin(ph) * amp; L1 = -L0;
                A0 = -Math.sin(ph) * amp * 0.85; A1 = -A0;
                bob = Math.abs(Math.sin(ph)) * (pose === "run" ? 0.14 : 0.08);
                lean = pose === "run" ? -0.18 : -0.05;
                break;
            }
            case "sit": L0 = L1 = 1.45; A0 = A1 = 0.6; break;
            case "ride": L0 = L1 = 1.15; A0 = A1 = 1.35; lean = -0.32; break;
            case "pedal": L0 = 1.1 + Math.sin(ph) * 0.55; L1 = 1.1 - Math.sin(ph) * 0.55; A0 = A1 = 1.25; lean = -0.22; break;
            case "hang": A1 = Math.PI - 0.12; A0 = 2.4 + Math.sin(t * 3) * 0.2; L0 = Math.sin(t * 4) * 0.45; L1 = -L0; break;
            case "wave": A1 = 2.6 + Math.sin(t * 10) * 0.4; A0 = 0.1; break;
            case "jump": L0 = 0.6; L1 = 0.3; A0 = A1 = 2.5; break;
            case "cheer": A0 = A1 = 2.8 + Math.sin(t * 12) * 0.15; bob = Math.abs(Math.sin(t * 6)) * 0.25; break;
            default: {
                A0 = Math.sin(t * 1.6) * 0.06; A1 = -A0;
                bob = Math.sin(t * 2.2) * 0.02;
                headTilt = Math.sin(t * 0.7) * 0.12;
            }
        }
        const k = 14;
        hero.legs[0].rotation.z = damp(hero.legs[0].rotation.z, L0, k, dt);
        hero.legs[1].rotation.z = damp(hero.legs[1].rotation.z, L1, k, dt);
        hero.arms[0].rotation.z = damp(hero.arms[0].rotation.z, A0, k, dt);
        hero.arms[1].rotation.z = damp(hero.arms[1].rotation.z, A1, k, dt);
        hero.body.position.y = damp(hero.body.position.y, bob, 20, dt);
        hero.body.rotation.z = damp(hero.body.rotation.z, lean, 8, dt);
        hero.head.rotation.y = damp(hero.head.rotation.y, headTilt, 4, dt);
    }

    /* ============================================================
       TRANSITIONS
       ============================================================ */
    let angle = -0.6;
    let current = 0;
    let trans = null;
    let queued = 0;
    let autoSteps = 0, autoDir = 1;
    let started = false;
    let facing = 0;

    function placeOnSeat(veh, t, pose, inA = 0.03, inB = 0.13, outA = 0.87, outB = 0.97) {
        veh.updateMatrixWorld(true);
        veh.userData.seat.getWorldPosition(v1);
        rig.worldToLocal(v1);
        let s, arc = 0;
        if (t < inB) { const u = seg(t, inA, inB); s = easeInOut(u); arc = Math.sin(Math.PI * u) * 1.6; }
        else if (t > outA) { const u = seg(t, outA, outB); s = 1 - easeInOut(u); arc = Math.sin(Math.PI * u) * 1.6; }
        else s = 1;
        hero.root.position.set(v1.x * s, v1.y * s + arc, v1.z * s);
        hero.root.rotation.z = veh.rotation.z * s + (veh.userData.extraRot || 0) * s;
        hero.root.rotation.x = veh.rotation.x * s;
        return s > 0.7 ? pose : arc > 0.05 ? "jump" : "idle";
    }
    function popScale(t, a = 0, b = 0.12, c = 0.88, d = 1) {
        if (t < b) return Math.max(0.001, easeOutBack(seg(t, a, b)));
        if (t > c) return Math.max(0.001, 1 - easeInOut(seg(t, c, d)));
        return 1;
    }
    const flightProgress = (t, a = 0.13, b = 0.87) => easeInOut(seg(t, a, b));
    const travelled = (p) => p * R * STEP;

    function balloonRide(g, tr, t) {
        const a = seg(t, 0.12, 0.86);
        const alt = 8.5 * Math.pow(Math.sin(Math.PI * a), 0.8);
        angle = lerp(tr.a0, tr.a1, flightProgress(t, 0.14, 0.84));
        hero.root.position.set(0, alt, 0);
        hero.root.rotation.z = Math.sin(t * 9) * 0.05 * (alt > 0.2 ? 1 : 0);
        const s = (t < 0.12 ? Math.max(0.001, easeOutBack(seg(t, 0, 0.12))) : 1) * lerp(0.75, 1, hero.scale);
        g.scale.setScalar(s);
        const away = seg(t, 0.86, 1);
        g.position.set(0, alt * 1 + (hero.scale - 1) * 2.2 + away * away * 30, 0);
        g.rotation.z = Math.sin(t * 6) * 0.05;
        return { pose: t > 0.1 && t < 0.88 ? "hang" : t < 0.1 ? "idle" : "cheer", alt };
    }
    function groundRide(g, tr, t, wheelR, pose) {
        g.scale.setScalar(popScale(t));
        const p = flightProgress(t);
        angle = lerp(tr.a0, tr.a1, p);
        if (g.userData.wheels) g.userData.wheels.forEach((w) => (w.rotation.z = -travelled(p) / wheelR));
        g.position.y = Math.abs(Math.sin(p * Math.PI * 8)) * 0.08;
        return placeOnSeat(g, t, pose);
    }

    const RUN = {
        intro(tr, t) {
            angle = lerp(tr.a0, tr.a1, easeInOut(t));
            return { pose: "idle", far: 1 - easeInOut(seg(t, 0.15, 1)) };
        },
        walk(tr, t) {
            angle = lerp(tr.a0, tr.a1, easeInOutSine(t));
            if (tr.dir > 0 && hero.acc.gradCap.visible) {
                const u = seg(t, 0.05, 0.75);
                hero.acc.gradCap.position.y = Math.sin(Math.PI * u) * 4.5;
                hero.acc.gradCap.rotation.set(u * 9, 0, u * 6);
            }
            return { pose: t > 0.06 && t < 0.94 ? "walk" : "idle", speed: 9.5 / Math.max(0.6, hero.scale) };
        },
        balloon: (tr, t) => balloonRide(V.balloon, tr, t),
        hearts: (tr, t) => balloonRide(V.hearts, tr, t),
        plane(tr, t) {
            const g = V.plane;
            g.scale.setScalar(popScale(t));
            const a = seg(t, 0.14, 0.86);
            const alt = 11 * Math.pow(Math.sin(Math.PI * a), 0.75);
            angle = lerp(tr.a0, tr.a1, flightProgress(t));
            g.position.set(0, alt, 0);
            g.rotation.z = a > 0 && a < 1 ? 0.32 * Math.cos(Math.PI * a) : 0;
            g.rotation.x = Math.sin(TAU * a) * 0.22;
            g.userData.prop.rotation.x += 0.9;
            return { pose: placeOnSeat(g, t, "sit"), alt: alt * 0.9 };
        },
        coin(tr, t) {
            const g = V.coin;
            g.scale.setScalar(popScale(t));
            const p = flightProgress(t);
            angle = lerp(tr.a0, tr.a1, p);
            g.position.y = Math.abs(Math.sin(p * Math.PI * 5)) * 0.5;
            g.userData.spin.rotation.z = -travelled(p) / 1.7;
            return { pose: placeOnSeat(g, t, "run"), speed: 20, alt: g.position.y };
        },
        ferry(tr, t) {
            const g = V.ferry;
            g.scale.setScalar(popScale(t));
            const p = flightProgress(t);
            angle = lerp(tr.a0, tr.a1, p);
            const f = mod(angle / STEP, N);
            const wet = 1 - smooth(0.18, 0.27, Math.abs(f - WATER_F));
            g.position.y = -0.55 * wet + Math.sin(t * 9) * 0.1 * wet;
            g.rotation.x = Math.sin(t * 6) * 0.06 * wet;
            g.rotation.z = Math.sin(t * 4) * 0.05 * wet;
            g.userData.smokes.forEach((s, k) => {
                const u = (t * 3 + k / 5) % 1;
                s.position.set(-1.3 - u * 1.5, 3.1 + u * 1.6, 0);
                s.scale.setScalar(0.5 + u * 1.4);
            });
            g.userData.splashes.forEach((s, k) => {
                s.visible = wet > 0.5;
                const u = (t * 4 + k / 6) % 1;
                s.position.set(2.6 - u * 1.2, 0.2 + Math.sin(u * Math.PI) * 0.9, (k % 2 ? 1 : -1) * (1 + u));
            });
            return { pose: placeOnSeat(g, t, t > 0.3 && t < 0.7 ? "wave" : "idle"), alt: 0 };
        },
        moto(tr, t) {
            const g = V.moto;
            g.scale.setScalar(popScale(t));
            const p = flightProgress(t);
            angle = lerp(tr.a0, tr.a1, p);
            const wheelie = Math.sin(Math.PI * seg(t, 0.4, 0.62)) * 0.5;
            g.userData.tilt.rotation.z = wheelie;
            g.userData.extraRot = wheelie;
            g.userData.wheels.forEach((w) => (w.rotation.z = -travelled(p) / 0.5));
            const fast = t > 0.15 && t < 0.85;
            g.userData.lines.forEach(([l, y, z, o]) => {
                l.visible = fast;
                l.position.set(2 - ((t * 3 + o) % 1) * 9, y, z);
            });
            return { pose: placeOnSeat(g, t, "ride"), alt: 0 };
        },
        bicycle(tr, t) {
            const pose = groundRide(V.bicycle, tr, t, 0.55 * 1.15, "pedal");
            return { pose, speed: 14, alt: 0 };
        },
        bus(tr, t) {
            const pose = groundRide(V.bus, tr, t, 0.45, t > 0.25 && t < 0.75 ? "wave" : "idle");
            return { pose, alt: 0.8 };
        },
        truck(tr, t) {
            const pose = groundRide(V.truck, tr, t, 0.42, t > 0.25 && t < 0.75 ? "cheer" : "idle");
            return { pose, alt: 0.8 };
        },
        krl(tr, t) {
            const g = V.krl;
            g.scale.setScalar(popScale(t));
            const p = flightProgress(t);
            angle = lerp(tr.a0, tr.a1, p);
            g.position.y = Math.sin(t * 40) * 0.02;
            g.rotation.z = Math.sin(t * 13) * 0.008;
            return { pose: placeOnSeat(g, t, t > 0.2 && t < 0.8 ? "wave" : "idle"), alt: 0.6 };
        },
        pixel(tr, t) {
            const g = V.pixel;
            angle = lerp(tr.a0, tr.a1, flightProgress(t, 0.25, 0.75));
            hero.root.visible = t < 0.1 || t > 0.9;
            const w = smooth(0.12, 0.32, t) * (1 - smooth(0.68, 0.88, t));
            g.userData.cubes.forEach(({ cube, home, k }) => {
                const a = k * 2.4 + t * 11;
                const r = 1.2 + (k % 5) * 0.45;
                const sy = 3.6 + Math.sin(t * 4 + k) * 1.4 + ((k % 11) / 11 - 0.5) * 3.5;
                cube.position.set(lerp(home.x, Math.cos(a) * r, w), lerp(home.y, sy, w), lerp(home.z, Math.sin(a) * r, w));
                const vis = t < 0.04 ? 0 : t < 0.1 ? seg(t, 0.04, 0.1) : t > 0.96 ? 0 : t > 0.9 ? 1 - seg(t, 0.9, 0.96) : 1;
                cube.scale.setScalar(Math.max(0.001, vis * (1 + w * 0.6)));
                cube.rotation.set(t * 7 + k, t * 5, 0);
            });
            return { pose: "idle", alt: w * 2.2 };
        },
        paper(tr, t) {
            const g = V.paper;
            g.scale.setScalar(popScale(t));
            const a = seg(t, 0.13, 0.87);
            angle = lerp(tr.a0, tr.a1, flightProgress(t));
            let y = 7 * smooth(0, 0.28, a) * (1 - smooth(0.74, 1, a));
            let x = 0, rz = 0;
            if (a < 0.36) rz = 0.35 * Math.sin(Math.PI * seg(a, 0, 0.28));
            if (a > 0.7) rz = -0.3 * Math.sin(Math.PI * seg(a, 0.74, 1));
            if (a >= 0.36 && a <= 0.66) {
                const u = seg(a, 0.36, 0.66);
                y += 3.6 - 3.6 * Math.cos(TAU * u);
                x = 3.6 * Math.sin(TAU * u);
                rz = TAU * u;
            }
            g.position.set(x, y, 0);
            g.rotation.z = rz;
            g.rotation.x = Math.sin(t * 5) * 0.08;
            return { pose: placeOnSeat(g, t, "sit"), alt: y * 0.8 };
        },
        warp(tr, t) {
            const g = V.warp;
            const open = t < 0.32 ? easeOutBack(seg(t, 0, 0.12)) * (1 - seg(t, 0.24, 0.32)) : t > 0.66 ? easeOutBack(seg(t, 0.66, 0.78)) * (1 - seg(t, 0.92, 1)) : 0;
            g.scale.setScalar(Math.max(0.001, open));
            const { rings, beam, sparks } = g.userData;
            rings.forEach((r, k) => (r.rotation.z = t * (k % 2 ? -14 : 14)));
            beam.material.opacity = 0.35 * open * (0.7 + Math.sin(t * 60) * 0.3);
            sparks.forEach((sp, k) => {
                const u = (t * 3 + k / sparks.length) % 1;
                const a = k * 2.4 + t * 12;
                sp.position.set(Math.cos(a) * (1 - u) * 1.2, u * 6, Math.sin(a) * (1 - u) * 1.2);
                sp.scale.setScalar(Math.sin(u * Math.PI) + 0.01);
            });
            angle = lerp(tr.a0, tr.a1, easeInOut(seg(t, 0.3, 0.7)));
            const sink = easeInOut(seg(t, 0.08, 0.26));
            const rise = easeOutBack(seg(t, 0.72, 0.9));
            const y = t < 0.5 ? -2.8 * sink : -2.8 * (1 - rise);
            hero.root.position.set(0, y, 0);
            hero.root.visible = t < 0.27 || t > 0.72;
            hero.root.rotation.y = facing + (t < 0.5 ? sink : 1 - rise) * TAU * 3;
            if (t > 0.74 && !tr.poofed) { tr.poofed = true; firePoof(); }
            const far = smooth(0.18, 0.36, t) * (1 - smooth(0.64, 0.82, t));
            return { pose: t < 0.5 ? "cheer" : t > 0.9 ? "wave" : "jump", far, space: far * 0.6, alt: 0 };
        },
        rocket(tr, t) {
            const g = V.rocket;
            g.scale.setScalar(popScale(t, 0, 0.1, 0.9, 1));
            const up = easeInOut(seg(t, 0.14, 0.34));
            const down = easeInOut(seg(t, 0.7, 0.88));
            const alt = 30 * up * (1 - down);
            angle = lerp(tr.a0, tr.a1, easeInOut(seg(t, 0.3, 0.74)));
            g.position.set(0, alt, 0);
            const thrust = t > 0.13 && t < 0.9;
            const fl = g.userData.flame;
            fl.visible = thrust;
            fl.scale.set(1, 1 + Math.sin(t * 80) * 0.25 + (alt > 0.5 ? 0.4 : 0), 1);
            g.rotation.z = thrust ? Math.sin(t * 40) * 0.015 : 0;
            g.userData.smoke.forEach((s, k) => {
                const u = seg(t, 0.12, 0.42);
                const u2 = seg(t, 0.78, 0.95);
                const uu = u > 0 && u < 1 ? u : u2 > 0 && u2 < 1 ? u2 : 0;
                s.visible = uu > 0;
                const a = (k / 12) * TAU;
                s.position.set(Math.cos(a) * (0.5 + uu * 4), -g.position.y + 0.3 + Math.sin(uu * Math.PI) * 0.4, Math.sin(a) * (0.5 + uu * 4));
                s.scale.setScalar(0.4 + uu * 1.5);
            });
            const pose = placeOnSeat(g, t, t > 0.36 && t < 0.68 ? "cheer" : "sit", 0.02, 0.12, 0.89, 0.98);
            const far = smooth(0.18, 0.36, t) * (1 - smooth(0.68, 0.86, t));
            return { pose, alt: alt * 0.9, far, space: far * 0.9 };
        }
    };

    const ui = {
        start: document.getElementById("start-screen"),
        startBtn: document.getElementById("start-button"),
        caption: document.getElementById("caption"),
        card: document.getElementById("milestone-card"),
        chapterNo: document.getElementById("chapter-no"),
        date: document.getElementById("milestone-date"),
        company: document.getElementById("milestone-company"),
        role: document.getElementById("milestone-role"),
        detail: document.getElementById("milestone-detail"),
        next: document.getElementById("milestone-next"),
        dots: document.getElementById("dots"),
        mobile: document.getElementById("mobile-controls")
    };

    function showCard(i) {
        const ch = CHAPTERS[i];
        document.documentElement.style.setProperty("--accent", ch.accent);
        ui.chapterNo.textContent = `${ch.icon} CHAPTER ${String(i + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
        ui.date.textContent = ch.year;
        ui.company.textContent = ch.company;
        ui.role.textContent = ch.role;
        ui.detail.textContent = ch.detail;
        ui.next.textContent = `Berikutnya → ${ch.out.tease}`;
        ui.card.hidden = false;
        requestAnimationFrame(() => ui.card.classList.add("show"));
        const dots = [...ui.dots.querySelectorAll("button")];
        dots.forEach((b, k) => b.classList.toggle("active", k === i));
        const active = dots[i];
        if (active) ui.dots.scrollTo({ left: active.offsetLeft - ui.dots.clientWidth / 2 + active.clientWidth / 2, behavior: "smooth" });
    }
    function hideCard() { ui.card.classList.remove("show"); }
    let captionTimer = 0;
    function showCaption(text) {
        clearTimeout(captionTimer);
        ui.caption.textContent = text;
        ui.caption.hidden = false;
        requestAnimationFrame(() => ui.caption.classList.add("show"));
    }
    function hideCaption() {
        ui.caption.classList.remove("show");
        captionTimer = setTimeout(() => (ui.caption.hidden = true), 300);
    }

    function go(dir) {
        if (!started) return;
        if (trans) { queued = dir; return; }
        const from = current;
        const to = mod(from + dir, N);
        const type = dir > 0 ? CHAPTERS[from].out.type : "walk";
        const fast = autoSteps > 1;
        const dur = (dir > 0 ? DUR[type] : DUR.back) * (fast ? 0.6 : 1);
        trans = { type, from, to, dir, t: 0, dur, a0: angle, a1: angle + dir * STEP + (type === "rocket" ? TAU : 0), swapped: false };
        facing = dir > 0 ? 0 : Math.PI;
        if (V[type]) V[type].visible = true;
        hideCard();
        showCaption(dir > 0 ? CHAPTERS[from].out.caption : `↩ Balik ke ${CHAPTERS[to].icon} ${CHAPTERS[to].company}`);
    }

    let queuedWarp = -1;
    function warpTo(k) {
        if (!started || k === current) return;
        if (trans) { queuedWarp = k; queued = 0; return; }
        const fwd = mod(k - current, N), back = mod(current - k, N);
        const steps = fwd <= back ? fwd : -back;
        trans = { type: "warp", from: current, to: k, dir: Math.sign(steps), t: 0, dur: DUR.warp, a0: angle, a1: angle + steps * STEP, swapped: false };
        facing = 0;
        V.warp.visible = true;
        hideCard();
        showCaption(`🌀 Teleport ke ${CHAPTERS[k].icon} ${CHAPTERS[k].company}…`);
    }

    function finishTrans() {
        const tr = trans;
        angle = tr.a1;
        if (V[tr.type]) V[tr.type].visible = false;
        hero.root.position.set(0, 0, 0);
        hero.root.rotation.x = 0;
        hero.root.rotation.z = 0;
        hero.root.visible = true;
        if (tr.type === "warp") hero.root.rotation.y = facing;
        if (tr.type !== "intro") current = tr.to;
        setOutfit(current);
        trans = null;
        hideCaption();
        showCard(current);
        if (autoSteps > 0) { autoSteps--; if (autoSteps > 0) { go(autoDir); return; } }
        if (queuedWarp >= 0) { const q = queuedWarp; queuedWarp = -1; warpTo(q); return; }
        if (queued) { const q = queued; queued = 0; go(q); }
    }

    /* ============================================================
       CAMERA + ATMOSPHERE
       ============================================================ */
    const camState = { alt: 0, far: 1 };
    const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();
    const cTop = new THREE.Color(), cBot = new THREE.Color(), cTmp = new THREE.Color();

    function updateCamera(dt, alt, far) {
        camState.alt = damp(camState.alt, alt, 3.5, dt);
        camState.far = damp(camState.far, far, 2.6, dt);
        const aspect = window.innerWidth / window.innerHeight;
        const fit = aspect < 0.8 ? 1.75 : aspect < 1.25 ? 1.3 : 1;
        const a = camState.alt;
        const sc = lerp(0.72, 1, hero ? hero.scale : 1);
        const lookX = aspect < 0.8 ? 0.6 : 2.6 * sc;
        tmpA.set(lookX, R + 5.2 * fit * sc + a * 0.9, 17 * fit * sc + a * 0.45);
        tmpB.set(lookX, R + 2.3 * sc + a * 0.92, 0);
        const fz = R * (aspect < 0.8 ? 5.8 : 3.8);
        const k = easeInOut(clamp(camState.far));
        camera.position.set(lerp(tmpA.x, 0, k), lerp(tmpA.y, R * 0.3, k), lerp(tmpA.z, fz, k));
        camera.lookAt(lerp(tmpB.x, 0, k), lerp(tmpB.y, R * 0.15, k), lerp(tmpB.z, 0, k));
        scene.fog.near = 34 + k * R * 2.8;
        scene.fog.far = 130 + k * R * 6.5;
    }

    function updateAtmosphere(space) {
        const f = mod(angle / STEP, N);
        const i0 = Math.floor(f) % N, i1 = (i0 + 1) % N;
        const w = smooth(0.3, 0.7, f - Math.floor(f));
        cTop.setHex(CHAPTERS[i0].sky[0]).lerp(cTmp.setHex(CHAPTERS[i1].sky[0]), w);
        cBot.setHex(CHAPTERS[i0].sky[1]).lerp(cTmp.setHex(CHAPTERS[i1].sky[1]), w);
        skyU.top.value.copy(cTop);
        skyU.bottom.value.copy(cBot);
        skyU.space.value = space;
        const night = lerp(CHAPTERS[i0].night, CHAPTERS[i1].night, w);
        scene.fog.color.copy(cBot).lerp(cTmp.set(0x0a0620), space * 0.7);
        starMat.opacity = Math.max(night * 0.9, space);
        hemi.intensity = lerp(0.8, 0.5, night);
        hemi.color.setHex(0xffffff).lerp(cTmp.set(0xb9a4ff), night);
        sun.intensity = lerp(0.85, 0.35, night);
        renderer.setClearColor(cBot);
    }

    /* ============================================================
       BOOT
       ============================================================ */
    function buildDots() {
        CHAPTERS.forEach((ch, k) => {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = ch.icon;
            b.title = `${ch.company} · ${ch.year}`;
            b.setAttribute("aria-label", `Ke chapter ${k + 1}: ${ch.company}`);
            b.addEventListener("click", (e) => {
                e.stopPropagation();
                warpTo(k);
            });
            ui.dots.appendChild(b);
        });
        const loop = document.createElement("span");
        loop.className = "loop";
        loop.textContent = "↻";
        loop.setAttribute("aria-hidden", "true");
        ui.dots.appendChild(loop);
    }

    function start() {
        if (started) return;
        started = true;
        document.body.classList.add("playing");
        ui.start.classList.add("leaving");
        setTimeout(() => (ui.start.hidden = true), 650);
        ui.dots.hidden = false;
        ui.mobile.hidden = false;
        const target = Math.ceil((angle + Math.PI) / TAU) * TAU;
        trans = { type: "intro", from: 0, to: 0, dir: 1, t: 0, dur: DUR.intro, a0: angle, a1: target, swapped: true };
        showCaption("🌍 Selamat datang di JJ World!");
        canvas.focus();
    }

    function bindInput() {
        ui.startBtn.addEventListener("click", (e) => { e.stopPropagation(); start(); });
        window.addEventListener("keydown", (e) => {
            if (["ArrowRight", "ArrowLeft", " ", "Spacebar"].includes(e.key)) e.preventDefault();
            if (!started) { if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") start(); return; }
            if (e.repeat && trans) return;
            if (e.key === "ArrowRight" || e.key === "d" || e.key === "D" || e.key === " " || e.key === "Enter") go(1);
            if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") go(-1);
        });
        canvas.addEventListener("click", () => { if (started) go(1); });
        ui.mobile.querySelectorAll("button").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); go(Number(b.dataset.move)); }));
        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    const clock = new THREE.Clock();
    let time = 0;
    function tick() {
        const dt = Math.min(clock.getDelta(), 0.05);
        time += dt;
        let pose = "idle", alt = 0, far = started ? 0 : 1, space = 0, speed = 9;
        if (!started) angle += dt * 0.08;
        if (trans) {
            trans.t += dt / trans.dur;
            const t = Math.min(trans.t, 1);
            const r = RUN[trans.type](trans, t);
            pose = r.pose || "idle";
            alt = r.alt || 0;
            far = r.far !== undefined ? r.far : 0;
            space = r.space || 0;
            speed = r.speed || 9;
            if (!trans.swapped && t >= 0.5) {
                trans.swapped = true;
                setOutfit(trans.to);
                if (trans.type !== "pixel" && trans.type !== "warp") firePoof();
            }
            if (trans.t >= 1) finishTrans();
        } else if (started) {
            pose = Math.sin(time * 0.5) > 0.93 ? "wave" : "idle";
        }
        planet.rotation.z = angle;
        hero.scale = damp(hero.scale, targetScale, 2.5, dt);
        hero.root.scale.setScalar(hero.scale);
        if (!(trans && trans.type === "warp")) hero.root.rotation.y = damp(hero.root.rotation.y, facing, 8, dt);
        poseHero(dt, pose, speed, time);
        updatePoof(dt);
        updateMay(dt);
        for (let k = 0; k < anims.length; k++) anims[k](time, dt);
        updateCamera(dt, alt, far);
        updateAtmosphere(space);
        sky.position.copy(camera.position);
        stars.position.copy(camera.position);
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }

    function init() {
        buildGround();
        buildDecor();
        CHAPTERS.forEach((ch, i) => {
            const fn = BUILDERS[ch.world];
            if (fn) fn(i);
        });
        hero = buildHero();
        rig.add(hero.root);
        buildVehicles();
        buildKissHearts();
        setOutfit(0);
        hero.scale = targetScale;
        buildDots();
        bindInput();
        ui.startBtn.disabled = false;
        ui.startBtn.innerHTML = 'MULAI PERJALANAN <span aria-hidden="true">→</span>';
        updateCamera(1, 0, 1);
        tick();
    }

    const fontsReady = document.fonts && document.fonts.load
        ? Promise.all([document.fonts.load(`700 80px "Fredoka"`), document.fonts.load(`500 30px "DM Mono"`)]).catch(() => {})
        : Promise.resolve();
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 2500))]).then(() => {
        try { init(); } catch (err) {
            console.error(err);
            errorEl.textContent = "Ada error saat membangun planet: " + err.message;
        }
    });
})();
