'use strict';
/* DistroHopper – Pixel-Art. Jede Grafik ist ein Zeichen-Raster mit Palette. */
(function () {
  const P = {
    k: '#11131a', K: '#2b303b', g: '#5b6474', G: '#9ba5b3', w: '#f4f6f9', W: '#c9d1db',
    y: '#ffd23f', Y: '#e39a12', e: '#fff4b0', o: '#ff7b25', O: '#b9501a',
    r: '#ef3e4a', R: '#9a1b2b', p: '#ff8fc7', P: '#cf3f8c',
    b: '#3d8bff', B: '#1f47a3', c: '#5ce1e6', C: '#1e8f9c',
    n: '#3ddc84', N: '#17864c', l: '#b7f36b', v: '#a86fff', V: '#5a2aa6',
    u: '#a8693a', U: '#6a3e1d', s: '#ffcf9f', S: '#d9955f', h: '#4a3322',
    t: '#233044', T: '#101826', m: '#e0e6ee', x: '#ff5fb4', z: '#7ebae4',
  };

  const S = {};

  /* ------------------------------------------------------------ Tux */
  S.tuxBig = [
    '.........kkkkkkkk.........',
    '.......kkkkkkkkkkkk.......',
    '......kkkkkkkkkkkkkk......',
    '.....kkkkgkkkkkkkkkkk.....',
    '.....kkkwwwkkkkwwwkkk.....',
    '.....kkkwkwkkkkwkwkkk.....',
    '.....kkkwkwkkkkwkwkkk.....',
    '.....kkkkwkkkkkkwkkkk.....',
    '.....kkkkkyyyyyykkkkk.....',
    '....kkkkyyyyyyyyyykkkk....',
    '....kkkkkkYyyyyYkkkkkk....',
    '....kkkkkwwYYYYwwkkkkk....',
    '...kkkkkwwwwwwwwwwkkkkk...',
    '..kkkkkwwwwwwwwwwwwkkkkk..',
    '.kkkkkwwwwwwwwwwwwwwkkkkk.',
    '.kkkkkwwwwwwwwwwwwwWkkkkk.',
    'kkkkkwwwwwwwwwwwwwwWWkkkkk',
    'kkkk.kwwwwwwwwwwwwwWk.kkkk',
    'kkk..kwwwwwwwwwwwwwWk..kkk',
    '.kk..kwwwwwwwwwwwwwWk..kk.',
    '..k..kwwwwwwwwwwwwwWk..k..',
    '.....kwwwwwwwwwwwwwWk.....',
    '.....kkwwwwwwwwwwwWkk.....',
    '......kkwwwwwwwwwWkk......',
    '.....yyykkkkkkkkkkyyy.....',
    '...yyyyyykkkkkkkkyyyyyy...',
    '..yyyyyyyy......yyyyyyyy..',
    '..YYYYYYYY......YYYYYYYY..',
  ];
  // Blinzeln: Augen zu
  S.tuxBlink = S.tuxBig.slice();
  S.tuxBlink[4] = '.....kkkkkkkkkkkkkkkk.....';
  S.tuxBlink[5] = '.....kkkkkkkkkkkkkkkk.....';
  S.tuxBlink[6] = '.....kkkwwwkkkkwwwkkk.....';
  S.tuxBlink[7] = '.....kkkkkkkkkkkkkkkk.....';
  // Freude: Flossen hoch, ^^-Augen
  S.tuxHappy = S.tuxBig.slice();
  S.tuxHappy[4] = '.....kkkkwkkkkkkwkkkk.....';
  S.tuxHappy[5] = '.....kkkwkwkkkkwkwkkk.....';
  S.tuxHappy[6] = '.....kkkkkkkkkkkkkkkk.....';
  S.tuxHappy[7] = '.....kkkkkkkkkkkkkkkk.....';
  S.tuxHappy[12] = 'kk.kkkkkwwwwwwwwwwkkkkk.kk';
  S.tuxHappy[13] = 'kkkkkkkwwwwwwwwwwwwkkkkkkk';
  S.tuxHappy[14] = '.kkkkkwwwwwwwwwwwwwwkkkkk.';
  S.tuxHappy[15] = '.....kwwwwwwwwwwwwwWk.....';
  S.tuxHappy[16] = '.....kwwwwwwwwwwwwwWk.....';
  S.tuxHappy[17] = '.....kwwwwwwwwwwwwwWk.....';
  S.tuxHappy[18] = '.....kwwwwwwwwwwwwwWk.....';
  S.tuxHappy[19] = '.....kwwwwwwwwwwwwwWk.....';
  S.tuxHappy[20] = '.....kwwwwwwwwwwwwwWk.....';

  S.tux = [
    '......kkkk......',
    '.....kkkkkk.....',
    '....kkkkkkkk....',
    '....kwwkkwwk....',
    '....kwkkkkwk....',
    '....kkyyyykk....',
    '...kkyyyyyykk...',
    '...kkkyyyykkk...',
    '..kkkwwwwwwkkk..',
    '..kkwwwwwwwwkk..',
    '.kkkwwwwwwwwkkk.',
    '.kkkwwwwwwwWkkk.',
    '..kkwwwwwwwWkk..',
    '...kkwwwwwWkk...',
    '..yyyykkkkyyyy..',
    '.yyyyy....yyyyy.',
  ];

  /* ------------------------------------------------------------ Gebäude */
  S.bash = [
    '................',
    '.kkkkkkkkkkkkkk.',
    '.kGGGGGGGGGGGGk.',
    '.kGrGyGnGGGGGGk.',
    '.kGGGGGGGGGGGGk.',
    '.kkkkkkkkkkkkkk.',
    '.kTTTTTTTTTTTTk.',
    '.kTnTTTTTTTTTTk.',
    '.kTTnTTTTTTTTTk.',
    '.kTnTTwwTTTTTTk.',
    '.kTTTTTTTTTTTTk.',
    '.kTggggTgggTTTk.',
    '.kTTTTTTTTTTTTk.',
    '.kkkkkkkkkkkkkk.',
    '..KKKKKKKKKKKK..',
    '................',
  ];
  S.cron = [
    '................',
    '..kk........kk..',
    '.kyyk..kk..kyyk.',
    '.kyk.kkrrkk.kyk.',
    '..k.krwwwwrk.k..',
    '...krwwwkwwrk...',
    '...kwwwwkwwwk...',
    '..krwwwwkwwwrk..',
    '..kwwwwwkkkkwk..',
    '..krwwwwwwwwrk..',
    '...kwwwwwwwwk...',
    '...krwwwwwwrk...',
    '....kkrrrrkk....',
    '...kk.kkkk.kk...',
    '..kk........kk..',
    '................',
  ];
  S.pi = [
    '................',
    '.....nn..nn.....',
    '....nNNnnNNn....',
    '.....nNNNNn.....',
    '......kkkk......',
    '....kkrrrrkk....',
    '...krrprrprrk...',
    '...krrrrrrrrk...',
    '..krprrprrprrk..',
    '..krrrrrrrrrrk..',
    '..krrprrprrprk..',
    '...krrrrrrrrk...',
    '...kRrprrprRk...',
    '....kRRrrRRk....',
    '.....kkkkkk.....',
    '................',
  ];
  S.intern = [
    '................',
    '.....kkkkkk.....',
    '....kbbbbbbk....',
    '...kbbbbwbbbk...',
    '...kkkkkkkkkkkk.',
    '...kssssssssk...',
    '...kskssssksk...',
    '...kssssssssk...',
    '...kssSkkSssk...',
    '....kssssssk....',
    '...kgkkkkkkgk...',
    '..kgggggggggggk.',
    '..kggggwwggggk..',
    '..kgggwggwgggk..',
    '..kggggggggggk..',
    '..kkkkkkkkkkkk..',
  ];
  S.thinkpad = [
    '................',
    '..kkkkkkkkkkkk..',
    '..kKKKKKKKKKKk..',
    '..kKTTTTTTTTKk..',
    '..kKTnnnTTTTKk..',
    '..kKTTnnnnTTKk..',
    '..kKTnnTTTTTKk..',
    '..kKKKKKKKKKKk..',
    '..kkkkkkkkkkkk..',
    '.kKKKKKKKKKKKKk.',
    '.kKgKgKgKgKgKKk.',
    '.kKKgKgrKgKgKKk.',
    '.kKgKgKgKgKgKKk.',
    '.kKKKKKKKKKKKKk.',
    '..kkkkkkkkkkkk..',
    '................',
  ];
  S.homelab = [
    '................',
    '...kkkkkkkkkk...',
    '...kGGGGGGGGk...',
    '...kKKKKKKKKk...',
    '...kKnKyKKggk...',
    '...kKKKKKKKKk...',
    '...kGGGGGGGGk...',
    '...kKKKKKKKKk...',
    '...kKnKnKKggk...',
    '...kKKKKKKKKk...',
    '...kGGGGGGGGk...',
    '...kKKKKKKKKk...',
    '...kKrKnKKggk...',
    '...kKKKKKKKKk...',
    '...kkkkkkkkkk...',
    '...kk......kk...',
  ];
  S.docker = [
    '................',
    '................',
    '.......kkkk.....',
    '.......kbck.....',
    '....kkkkkkkkkk..',
    '....kbckbckbck..',
    '..kkkkkkkkkkkk.k',
    '.kbbbbbbbbbbbbkk',
    'kbbwbbbbbbbbbbbk',
    'kbbbbbbbbbbbbbk.',
    'kbbbbbbbbbbbbk..',
    '.kccccccccccck..',
    '..kkkkkkkkkkk...',
    '................',
    '..cc...cc...cc..',
    '................',
  ];
  S.k8s = [
    '................',
    '......kkkk......',
    '....kkbbbbkk....',
    '...kbbbwwbbbk...',
    '..kbwbbwwbbwbk..',
    '..kbbwwbbwwbbk..',
    '.kbbbbwwwwbbbbk.',
    '.kbwwwwkkwwwwbk.',
    '.kbbbbwwwwbbbbk.',
    '..kbbwwbbwwbbk..',
    '..kbwbbwwbbwbk..',
    '...kbbbwwbbbk...',
    '....kkbbbbkk....',
    '......kkkk......',
    '................',
    '................',
  ];
  S.community = [
    '................',
    '......rr.rr.....',
    '.....rrrrrrr....',
    '......rrrrr.....',
    '.......rrr......',
    '........r.......',
    '.kkkk.kkkk.kkkk.',
    '.kssk.kssk.kssk.',
    '.kssk.kssk.kssk.',
    '.kkkk.kkkk.kkkk.',
    'kooookvvvvknnnnk',
    'kooookvvvvknnnnk',
    'kooookvvvvknnnnk',
    'kkkkkkkkkkkkkkkk',
    '................',
    '................',
  ];
  S.datacenter = [
    '......c.c.......',
    '.......c........',
    '.kkkkkkkkkkkkkk.',
    '.kggggggggggggk.',
    '.kKnKKnKKyKKnKk.',
    '.kggggggggggggk.',
    '.kKKnKKyKKnKKKk.',
    '.kggggggggggggk.',
    '.kKnKKnKKnKKyKk.',
    '.kggggggggggggk.',
    '.kKKyKKnKKnKKKk.',
    '.kggggggggggggk.',
    '.kggggkkkkggggk.',
    '.kggggkGGkggggk.',
    '.kkkkkkkkkkkkkk.',
    '................',
  ];
  S.maintainer = [
    '................',
    '.....kkkkkk.....',
    '....kGGGGGGk....',
    '...kGssssssGk...',
    '...kssssssssk...',
    '..kkkkkskkkkkk..',
    '..kkwwkkkkwwkk..',
    '...kkkkssskkk...',
    '...kGssssssGk...',
    '...kGGGkkGGGk...',
    '...kGGGGGGGGk...',
    '....kGGGGGGk....',
    '....kGGGGGGk....',
    '.....kGGGGk.....',
    '......kGGk......',
    '.......kk.......',
  ];
  S.beowulf = [
    '................',
    '................',
    '.kkkk.kkkk.kkkk.',
    '.kGGk.kGGk.kGGk.',
    '.kKKk.kKKk.kKKk.',
    '.kGGk.kGGk.kGGk.',
    '.kKKk.kKKk.kKKk.',
    '.knKk.kyKk.knKk.',
    '.kKKk.kKKk.kKKk.',
    '.kkkk.kkkk.kkkk.',
    '..c....c....c...',
    '..cccccccccccc..',
    '.......c........',
    '.....kkkkk......',
    '.....knynk......',
    '.....kkkkk......',
  ];
  S.ai = [
    '.......yy.......',
    '.......kk.......',
    '...kkkkkkkkkk...',
    '..kGGGGGGGGGGk..',
    '..kGTTTTTTTTGk..',
    '.gkGTccTTccTGkg.',
    '.gkGTccTTccTGkg.',
    '..kGTTTTTTTTGk..',
    '..kGTccccccTGk..',
    '..kGTTTTTTTTGk..',
    '..kGGGGGGGGGGk..',
    '...kkkkkkkkkk...',
    '..kkGGGGGGGGkk..',
    '.kGGGGGGGGGGGGk.',
    '.kkkkkkkkkkkkkk.',
    '................',
  ];
  S.quantum = [
    '................',
    '......vvvv......',
    '....vv....vv....',
    '...v..cccc..v...',
    '..v.cc.vv.cc.v..',
    '..vc..v..v..cv..',
    '.vc..v....v..cv.',
    '.vc..v.yy.v..cv.',
    '.vc..v.yy.v..cv.',
    '.vc..v....v..cv.',
    '..vc..v..v..cv..',
    '..v.cc.vv.cc.v..',
    '...v..cccc..v...',
    '....vv....vv....',
    '......vvvv......',
    '................',
  ];
  S.satellite = [
    '................',
    '.w............y.',
    '................',
    '......kkkk......',
    'kkkkk.kGGk.kkkkk',
    'kbBbk.kGGk.kbBbk',
    'kBbBkkkggkkkBbBk',
    'kbBbk.kGGk.kbBbk',
    'kkkkk.kGGk.kkkkk',
    '......kkkk......',
    '.......kk.......',
    '......kGGk......',
    '.....kGWWGk.....',
    '....kkkkkkkk....',
    '..y.........w...',
    '................',
  ];
  S.dyson = [
    '................',
    '......oooo......',
    '....ooyyyyoo....',
    '...oyyeeyyyyo...',
    '..oyyeeyyyyyyo..',
    '..oyyyyyyyyyyo..',
    'kkkkkkkkkkkkkkkk',
    'kGcGcGcGcGcGcGck',
    'kkkkkkkkkkkkkkkk',
    '..oyyyyyyyyYYo..',
    '..oyyyyyyyyYYo..',
    '...oyyyyyyYYo...',
    '....ooYYYYoo....',
    '......oooo......',
    '................',
    '................',
  ];
  S.matrix = [
    'kkkkkkkkkkkkkkkk',
    'kkNkkkkkkkkNkkkk',
    'kknkkkNkkkknkkNk',
    'kkNkkknkkkkNkknk',
    'kklkkkNkkkknkkNk',
    'kkkkkklkkkkNkknk',
    'kkNkkkkkkkklkkNk',
    'kknkkNkkkkkkkklk',
    'kkNkknkkNkkkkkkk',
    'kknkkNkknkkkNkkk',
    'kklkknkkNkkknkkk',
    'kkkkklkknkkkNkkk',
    'kkkkkkkklkkknkkk',
    'kkkkkkkkkkkklkkk',
    'kkkkkkkkkkkkkkkk',
    '................',
  ];
  S.multiverse = [
    '................',
    '..kkk......kkk..',
    '.kvvvk....kccck.',
    '.kvwvk....kcwck.',
    '.kvvvk....kccck.',
    '..kkk......kkk..',
    '...v........c...',
    '....v......c....',
    '.....v....c.....',
    '......v..c......',
    '.......kk.......',
    '......kyyk......',
    '......kyek......',
    '.......kk.......',
    '.......y........',
    '.......y........',
  ];
  S.universe = [
    '................',
    '....vv.....w....',
    '...v..vvv.......',
    '..v......vv.....',
    '..v..ccc...v....',
    '.v..c...c...v...',
    '.v.c..y..c..v.w.',
    '.v.c.yey.c..v...',
    '..vc..y..c.v....',
    '...c....c..v....',
    '....cccc..v.....',
    '.w......vv......',
    '......vv........',
    '..........w.....',
    '................',
    '................',
  ];

  /* ------------------------------------------------------------ Figuren & Symbole */
  S.duck = [
    '................',
    '........kkkk....',
    '.......kyyyyk...',
    '......kyyykyyk..',
    '......kyyyyyykoo',
    '......kyyyyyykoo',
    '.......kyyyyyk..',
    '..kk...kyyyyk...',
    '.kyykkkyyyyyyk..',
    '.kyyyyyyyyyyyyk.',
    'kyyeyyyyyyyyyyk.',
    'kyyyeeyyyyyyyyk.',
    'kyyyyyyyyyyyyYk.',
    '.kYyyyyyyyyyYk..',
    '..kkYYYYYYYYk...',
    '....kkkkkkkk....',
  ];
  S.bugA = [
    '................',
    '.....k....k.....',
    '......k..k......',
    '......kkkk......',
    '.....kkkkkk.....',
    '..k.krrkkrrk.k..',
    '...kkrrkkrrkk...',
    '....krrkkrrk....',
    '.k.krkrkkrkrk.k.',
    '..kkrrrkkrrrkk..',
    '...krrrkkrrrk...',
    '..k.krkkkkrk.k..',
    '....krrkkrrk....',
    '.....kkkkkk.....',
    '................',
    '................',
  ];
  S.bugB = S.bugA.slice();
  S.bugB[5] = '.k..krrkkrrk..k.';
  S.bugB[8] = '..kkrkrkkrkrkk..';
  S.bugB[11] = '.k..krkkkkrk..k.';

  S.coffee = [
    '................',
    '......w..w......',
    '.....w..w.......',
    '......w..w......',
    '................',
    '...kkkkkkkkk....',
    '...kwwwwwwwkkk..',
    '...kwUUUUUwk.k..',
    '...kwwwwwwwk.k..',
    '...kwwwwwwwkkk..',
    '...kwwwwwwwk....',
    '....kwwwwwk.....',
    '..kkkkkkkkkkk...',
    '..kGGGGGGGGGk...',
    '...kkkkkkkkk....',
    '................',
  ];
  S.mate = [
    '......kkk.......',
    '......kYk.......',
    '......kuk.......',
    '.....kuuuk......',
    '.....kuuuk......',
    '....kuuuuuk.....',
    '....kyyyyyk.....',
    '....kybbbyk.....',
    '....kyyyyyk.....',
    '....kuuuuuk.....',
    '....kuueuuk.....',
    '....kuueuuk.....',
    '....kuuuuuk.....',
    '....kuuuuuk.....',
    '....kkkkkkk.....',
    '................',
  ];
  S.key = [
    '................',
    '................',
    '..kkkkkkkkkkkk..',
    '.kGGGGGGGGGGGGk.',
    '.kGwwwwwwwwwwGk.',
    '.kGwwwwwwwwwwGk.',
    '.kGwwwwwwwwwwGk.',
    '.kGwwwwwwwwwwGk.',
    '.kGwwwwwwwwwwGk.',
    '.kGwwwwwwwwwwGk.',
    '.kGWWWWWWWWWWGk.',
    '.kGGGGGGGGGGGGk.',
    '.kggggggggggggk.',
    '..kkkkkkkkkkkk..',
    '................',
    '................',
  ];
  S.monitor = [
    '................',
    '.kkkkkkkkkkkkkk.',
    '.kKKKKKKKKKKKKk.',
    '.kKbbbbbbbbbbKk.',
    '.kKbccbbbbbbbKk.',
    '.kKbbbbccbbbbKk.',
    '.kKbbcbbbbbbbKk.',
    '.kKbbbbbbbbbbKk.',
    '.kKKKKKKKKKKKKk.',
    '.kkkkkkkkkkkkkk.',
    '.......kk.......',
    '......kGGk......',
    '....kkGGGGkk....',
    '....kkkkkkkk....',
    '................',
    '................',
  ];
  S.cat = [
    '................',
    '..kk........kk..',
    '..kok......kok..',
    '..koookkkkoook..',
    '..kooooooooook..',
    '.kooooooooooook.',
    '.koonkooooknook.',
    '.koooooppoooook.',
    '.kWoooowwooooWk.',
    '..kooookkoooook.',
    '...kkkkkkkkkk...',
    '................',
    '................',
    '................',
    '................',
    '................',
  ];
  S.trophy = [
    '................',
    '...kkkkkkkkkk...',
    '.kkkyyyeyyyykkk.',
    'k..kyyyeyyyyk..k',
    'k..kyyeyyyyyk..k',
    '.k.kyyeyyyyyk.k.',
    '..kkyyyyyyyYkk..',
    '....kyyyyyYk....',
    '.....kyyyYk.....',
    '......kyYk......',
    '......kYYk......',
    '.....kkYYkk.....',
    '....kYYYYYYk....',
    '...kuuuuuuuuk...',
    '...kkkkkkkkkk...',
    '................',
  ];
  S.lock = [
    '................',
    '......kkkk......',
    '.....kGGGGk.....',
    '....kGk..kGk....',
    '....kGk..kGk....',
    '...kkkkkkkkkk...',
    '...kyyyyyyyyk...',
    '...kyyyyyyyyk...',
    '...kyyykkyyyk...',
    '...kyyykkyyyk...',
    '...kyyyyyyyyk...',
    '...kYYYYYYYYk...',
    '...kkkkkkkkkk...',
    '................',
    '................',
    '................',
  ];
  S.beard = [
    '................',
    '....kkkkkkkk....',
    '...kssssssssk...',
    '...kskssssksk...',
    '...kssssssssk...',
    '...kussssssuk...',
    '...kuuuuuuuuk...',
    '...kuuukkuuuk...',
    '..kuuuuuuuuuuk..',
    '..kuuUuuuuUuuk..',
    '...kuuuuuuuuk...',
    '....kuuUuuuk....',
    '.....kuuuuk.....',
    '......kuuk......',
    '.......kk.......',
    '................',
  ];
  S.karma = [
    '................',
    '.......kk.......',
    '......kvvk......',
    '.....kvvvvk.....',
    '....kvvwvvvk....',
    '...kvvwvvvvvk...',
    '..kvvvvvvvvvvk..',
    '.kkkkvvvvvvkkkk.',
    '....kvvvvvvk....',
    '....kvvvvvvk....',
    '....kvvvvvvk....',
    '....kVVVVVVk....',
    '....kVVVVVVk....',
    '....kkkkkkkk....',
    '................',
    '................',
  ];
  S.chat = [
    '................',
    '................',
    '..kkkkkkkkkkkk..',
    '.kwwwwwwwwwwwwk.',
    '.kwwwwwwwwwwwwk.',
    '.kwkkwwkkwwkkwk.',
    '.kwkkwwkkwwkkwk.',
    '.kwwwwwwwwwwwwk.',
    '..kkkwwkkkkkkk..',
    '....kwk.........',
    '....kk..........',
    '................',
    '................',
    '................',
    '................',
    '................',
  ];
  S.speaker = [
    '................',
    '................',
    '................',
    '......w.........',
    '.....ww....w....',
    '..wwwww..w..w...',
    '..wwwww...w..w..',
    '..wwwww...w..w..',
    '..wwwww..w..w...',
    '.....ww....w....',
    '......w.........',
    '................',
  ];
  S.speakerOff = [
    '................',
    '................',
    '................',
    '......w.........',
    '.....ww.........',
    '..wwwww..w...w..',
    '..wwwww...w.w...',
    '..wwwww....w....',
    '..wwwww...w.w...',
    '.....ww..w...w..',
    '......w.........',
    '................',
  ];
  S.box = [
    '................',
    '...kkkkkkkkkk...',
    '..kuuuuyyuuuuk..',
    '.kuuuuuyyuuuuuk.',
    '.kkkkkkkkkkkkkk.',
    '.kuuuuuyyuuuuuk.',
    '.kuuuuuyyuuuuuk.',
    '.kuuuuuyyuuuuuk.',
    '.kuuuuuuuuuuuuk.',
    '.kuukkkuuuuuuuk.',
    '.kuuuuuuuuuuuuk.',
    '.kUUUUUUUUUUUUk.',
    '.kkkkkkkkkkkkkk.',
    '................',
    '................',
    '................',
  ];
  S.disc = [
    '................',
    '.....kkkkkk.....',
    '...kkGGGGGGkk...',
    '..kGGcGGGGGGGk..',
    '..kGcGGGGGGGGk..',
    '.kGcGGGkkGGGGGk.',
    '.kGGGGk..kGGGGk.',
    '.kGGGGk..kGGGGk.',
    '.kGGGGGkkGGGvGk.',
    '..kGGGGGGGGvGk..',
    '..kGGGGGGGvGGk..',
    '...kkGGGGGGkk...',
    '.....kkkkkk.....',
    '................',
    '................',
    '................',
  ];
  S.gear = [
    '................',
    '......kkkk......',
    '...kk.kGGk.kk...',
    '..kGGkkGGkkGGk..',
    '..kGGGGGGGGGGk..',
    '...kGGGkkGGGk...',
    '.kkkGGk..kGGkkk.',
    '.kGGGk....kGGGk.',
    '.kGGGk....kGGGk.',
    '.kkkGGk..kGGkkk.',
    '...kGGGkkGGGk...',
    '..kGGGGGGGGGGk..',
    '..kGGkkGGkkGGk..',
    '...kk.kGGk.kk...',
    '......kkkk......',
    '................',
  ];
  S.link = [
    '................',
    '................',
    '....kkkk........',
    '...kGGGGk.......',
    '..kGk..kGk......',
    '..kGk..kGkkk....',
    '..kGk.kkGGGGk...',
    '...kGGGGk..kGk..',
    '....kkkGk..kGk..',
    '......kGk..kGk..',
    '.......kGGGGk...',
    '........kkkk....',
    '................',
    '................',
    '................',
    '................',
  ];
  S.calendar = [
    '................',
    '...k..k..k..k...',
    '.kkykkykkykkykk.',
    '.krrrrrrrrrrrrk.',
    '.krrrrrrrrrrrrk.',
    '.kkkkkkkkkkkkkk.',
    '.kwwwwwwwwwwwwk.',
    '.kwwwwwwwwwwwwk.',
    '.kwwwwwwwwwwwwk.',
    '.kwwwwwwwwwwwwk.',
    '.kwwwwwwwwwwwwk.',
    '.kwwwwwwwwwwwwk.',
    '.kWWWWWWWWWWWWk.',
    '.kkkkkkkkkkkkkk.',
    '................',
    '................',
  ];
  S.star = [
    '................',
    '.......k........',
    '......kyk.......',
    '......kyk.......',
    '.....kyyyk......',
    'kkkkkkyeyykkkkk.',
    '.kyyyyyeyyyyyk..',
    '..kyyyyyyyyyk...',
    '...kyyyyyyyk....',
    '...kyyykyyyk....',
    '..kyyyk.kyyyk...',
    '..kyyk...kyyk...',
    '.kyk.......kyk..',
    '.kk.........kk..',
    '................',
    '................',
  ];
  S.floppy = [
    '................',
    '.kkkkkkkkkkkkk..',
    '.kbbkGGGGGGkbbk.',
    '.kbbkGGGGkGkbbk.',
    '.kbbkGGGGkGkbbk.',
    '.kbbkkkkkkkkbbk.',
    '.kbbbbbbbbbbbbk.',
    '.kbwwwwwwwwwwbk.',
    '.kbwggggggggwbk.',
    '.kbwwwwwwwwwwbk.',
    '.kbwggggggwwwbk.',
    '.kbwwwwwwwwwwbk.',
    '.kkkkkkkkkkkkkk.',
    '................',
    '................',
    '................',
  ];
  S.shield = [
    '................',
    '..kkkkkkkkkkkk..',
    '..kbbbbbbwwwwk..',
    '..kbbbbbbwwwwk..',
    '..kbbbbbbwwwwk..',
    '..kbbbbbbwwwwk..',
    '..kwwwwwwbbbbk..',
    '..kwwwwwwbbbbk..',
    '...kwwwwwbbbk...',
    '....kwwwwbbk....',
    '.....kwwwbk.....',
    '......kkkk......',
    '................',
    '................',
    '................',
    '................',
  ];
  S.skull = [
    '................',
    '....kkkkkkkk....',
    '...kwwwwwwwwk...',
    '..kwwwwwwwwwwk..',
    '..kwwkkwwkkwwk..',
    '..kwwkkwwkkwwk..',
    '..kwwwwkkwwwwk..',
    '...kwwwwwwwwk...',
    '....kwkwkwkk....',
    '....kkkkkkkk....',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
  ];
  S.fish = [
    '................',
    '................',
    '................',
    '.....kkkkk......',
    'k...kooooook....',
    'kk.koooookook...',
    'kokooooooooook..',
    'koookoooooooook.',
    'kokooooooooook..',
    'kk.koooooooook..',
    'k...kooooook....',
    '.....kkkkk......',
    '................',
    '................',
    '................',
    '................',
  ];
  S.pizza = [
    '................',
    '.kkkkkkkkkkkkkk.',
    '.kuuuuuuuuuuuuk.',
    '..kyyryyyyyryk..',
    '..kyyyyyyryyyk..',
    '...kyyryyyyyk...',
    '...kyyyyyryyk...',
    '....kyyyyyyk....',
    '....kyryyyyk....',
    '.....kyyyyk.....',
    '.....kyyryk.....',
    '......kyyk......',
    '......kyyk......',
    '.......kk.......',
    '................',
    '................',
  ];
  S.pill = [
    '................',
    '................',
    '................',
    '........kkkk....',
    '.......kwwwwk...',
    '......kwwwwwwk..',
    '.....krrwwwwwk..',
    '....krrrrwwwk...',
    '...krrrrrrkk....',
    '..krrrrrrk......',
    '..krRrrrk.......',
    '...kRRkk........',
    '....kk..........',
    '................',
    '................',
    '................',
  ];

  /* ------------------------------------------------------------ Distro-Logos */
  S.d_ubuntu = [
    '................',
    '.....kkkkkk.....',
    '...kkooooookk...',
    '..koooowwooook..',
    '..koowwkkwwook..',
    '.kowwkooookwwok.',
    '.kowkoooooowwok.',
    '.kwwooooooookwk.',
    '.kowkoooooowwok.',
    '.kowwkooookwwok.',
    '..koowwkkwwook..',
    '..koooowwooook..',
    '...kkooooookk...',
    '.....kkkkkk.....',
    '................',
    '................',
  ];
  S.d_mint = [
    '................',
    '.kkkkkkkkkkk....',
    '.klllllllllkk...',
    '.klwwllllllllk..',
    '.klwwlllllllllk.',
    '.klwwwwwwwwwllk.',
    '.klwwlwwlwwwllk.',
    '.klwwlwwlwwwllk.',
    '.klwwlwwlwwwllk.',
    '.klwwlwwlwwwllk.',
    '.kllwwwwwwwwllk.',
    '.kllllllllllllk.',
    '..kNNNNNNNNNNk..',
    '...kkkkkkkkkk...',
    '................',
    '................',
  ];
  S.d_fedora = [
    '................',
    '.....kkkkkk.....',
    '...kkbbbbbbkk...',
    '..kbbbbbwwwbbk..',
    '..kbbbbwwbbwbk..',
    '.kbbbbbwwbbbbbk.',
    '.kbbbwwwwwwbbbk.',
    '.kbbbbbwwbbbbbk.',
    '.kbbbbbwwbbbbbk.',
    '.kbwbbbwwbbbbbk.',
    '..kbwwwwbbbbbk..',
    '..kbbbbbbbbbbk..',
    '...kkbbbbbbkk...',
    '.....kkkkkk.....',
    '................',
    '................',
  ];
  S.d_debian = [
    '................',
    '.....kkkkkk.....',
    '...kkrrrrrrkk...',
    '..krrr....rrrk..',
    '.krr...rrr..rrk.',
    '.krr..r...r.rrk.',
    'krr..r..rr.r.rk.',
    'krr..r.r...r.rk.',
    'krr..r..r.rr.rk.',
    '.krr..r.....rk..',
    '.krr...rrrrrk...',
    '..krrr......rk..',
    '...kkrrrr..rk...',
    '.....kkkkrrk....',
    '.........kk.....',
    '................',
  ];
  S.d_arch = [
    '.......kk.......',
    '......kbbk......',
    '......kbbk......',
    '.....kbbbbk.....',
    '.....kbbbbk.....',
    '....kbbbbbbk....',
    '....kbbbbbbk....',
    '...kbbbbbbbbk...',
    '...kbbbkkbbbk...',
    '..kbbbk..kbbbk..',
    '..kbbk....kbbk..',
    '.kbbbk....kbbbk.',
    '.kbbk......kbbk.',
    'kbbk........kbbk',
    'kkk..........kkk',
    '................',
  ];
  S.d_manjaro = [
    '................',
    '.kkkkkkk.kkkkk..',
    '.knnnnnk.knnnk..',
    '.knnnnnk.knnnk..',
    '.knnnnnk.knnnk..',
    '.kkkkkkk.knnnk..',
    '.knnnk...knnnk..',
    '.knnnk.kkknnnk..',
    '.knnnk.knnknnk..',
    '.knnnk.knnknnk..',
    '.knnnk.knnknnk..',
    '.knnnk.knnknnk..',
    '.kkkkk.kkkkkkk..',
    '................',
    '................',
    '................',
  ];
  S.d_opensuse = [
    '................',
    '................',
    '....kkkkkkkk....',
    '..kknnnnnnnnkk..',
    '.knnnnnnnkkknnk.',
    'knnnnnnnkwwwknk.',
    'knnnnnnnkwkwknk.',
    'knnnnnnnnkkknnk.',
    'kNnnnnnnnnnnnk..',
    '.kNNnnnnnnnkk...',
    '..kkNNNNNNk.....',
    '...knk..knk.....',
    '...kk....kk.....',
    '................',
    '................',
    '................',
  ];
  S.d_popos = [
    '................',
    '.....kkkkkk.....',
    '...kkccccccckk..',
    '..kccccwwcccck..',
    '..kcccwwwccccck.',
    '.kccccwwwcccccck',
    '.kccccwwcccccck.',
    '.kcccwwwccccck..',
    '.kcccwwcccccck..',
    '.kcccccccccccck.',
    '..kcccwwcccccck.',
    '..kcccwwccccck..',
    '...kkccccccckk..',
    '.....kkkkkkk....',
    '................',
    '................',
  ];
  S.d_kali = [
    '................',
    '.kk.............',
    '.kbk............',
    '..kbk....kkkk...',
    '..kbbk.kkbbbbk..',
    '...kbbkbbbbkkk..',
    '...kbbbbbbk.....',
    '....kbbbbbbk....',
    '....kbbkbbbbk...',
    '.....kbk.kbbbk..',
    '.....kbk..kbbk..',
    '......kk...kbk..',
    '............kbk.',
    '.............kk.',
    '................',
    '................',
  ];
  S.d_gentoo = [
    '................',
    '....kkkkkk......',
    '..kkvvvvvvkk....',
    '.kvvvvwwwvvvk...',
    '.kvvvwwwwwvvvk..',
    '.kvvvwwkkwwvvvk.',
    '..kvvvwwwwwvvvk.',
    '...kvvvwwwvvvvk.',
    '....kvvvvvvvvk..',
    '...kvvvvvvvvk...',
    '..kvvvvvvvvk....',
    '..kVvvvvvvk.....',
    '...kVVVVkk......',
    '....kkkk........',
    '................',
    '................',
  ];
  S.d_alpine = [
    '................',
    '.....kkkkkk.....',
    '...kkBBBBBBkk...',
    '..kBBBBBBBBBBk..',
    '..kBBBBwBBBBBk..',
    '.kBBBBwwwBBBBBk.',
    '.kBBBwwwwwBwBBk.',
    '.kBBwwwBwwwwwBk.',
    '.kBwwwBBBwwwwwk.',
    '.kBBBBBBBBBBBBk.',
    '..kBBBBBBBBBBk..',
    '..kBBBBBBBBBBk..',
    '...kkBBBBBBkk...',
    '.....kkkkkk.....',
    '................',
    '................',
  ];
  S.d_nixos = [
    '................',
    '.......kk.......',
    '....k..zz..k....',
    '...kzk.zz.kzk...',
    '....kzzzzzzk....',
    '..k..zzBBzz..k..',
    '.kzzzzB..Bzzzzk.',
    '..kk.zB..Bz.kk..',
    '.kzzzzB..Bzzzzk.',
    '..k..zzBBzz..k..',
    '....kzzzzzzk....',
    '...kzk.zz.kzk...',
    '....k..zz..k....',
    '.......kk.......',
    '................',
    '................',
  ];
  S.d_slackware = [
    '................',
    '.kkkkkkkkkkkkkk.',
    '.kggggggggggggk.',
    '.kgggwwwwwwgggk.',
    '.kggwwggggggggk.',
    '.kggwwggggggggk.',
    '.kgggwwwwwggggk.',
    '.kggggggggwwggk.',
    '.kggggggggwwggk.',
    '.kggwwwwwwwgggk.',
    '.kggggggggggggk.',
    '.kKKKKKKKKKKKKk.',
    '.kkkkkkkkkkkkkk.',
    '................',
    '................',
    '................',
  ];
  S.d_void = [
    '................',
    '.....kkkkkk.....',
    '...kkNNNNNNkk...',
    '..kNNNNNNNNwwk..',
    '..kNNNkkkkwwNk..',
    '.kNNNk....wwNNk.',
    '.kNNk....wwkNNk.',
    '.kNNk...ww.kNNk.',
    '.kNNk..ww..kNNk.',
    '.kNNkkww..kNNNk.',
    '..kNwwkkkkNNNk..',
    '..kwwNNNNNNNNk..',
    '...kkNNNNNNkk...',
    '.....kkkkkk.....',
    '................',
    '................',
  ];
  S.d_cachyos = [
    '................',
    '.....kkkkkkk....',
    '...kkcccccccck..',
    '..kcccnnnnnccck.',
    '.kccnnk...kkkk..',
    '.kcnnk..........',
    'kccnk.....kk....',
    'kcnnk....knnk...',
    'kccnk....knnk...',
    '.kcnnk....kk..k.',
    '.kccnnk...kkkknk',
    '..kcccnnnnnccck.',
    '...kkcccccccck..',
    '.....kkkkkkk....',
    '................',
    '................',
  ];
  S.d_rhel = [
    '................',
    '................',
    '................',
    '.....kkkkkk.....',
    '....krrrrrrk....',
    '...krrrrrrrrk...',
    '...krrrrrrrrk...',
    '...kkkkkkkkkk...',
    '.kkRRRRRRRRRRkk.',
    'krrrrrrrrrrrrrrk',
    '.kkrrrrrrrrrrkk.',
    '...kkkkkkkkkk...',
    '................',
    '................',
    '................',
    '................',
  ];
  S.d_freebsd = [
    '................',
    '.kk..........kk.',
    '.krk........krk.',
    '.krrk.kkkk.krrk.',
    '..krrkrrrrkrrk..',
    '...krrrrrrrrk...',
    '..krrrwrrrrrrk..',
    '..krrwwrrrrrrk..',
    '.krrrrrrrrrrrrk.',
    '.krrrrrrrrrrrrk.',
    '.kRrrrrrrrrrrRk.',
    '..kRrrrrrrrrRk..',
    '...kRRrrrrRRk...',
    '....kkkkkkkk....',
    '................',
    '................',
  ];
  S.d_lfs = [
    '................',
    '..kkk...........',
    '.kGGGk..........',
    '.kGkGGk.........',
    '.kGGkGGk........',
    '..kkkGGGk.......',
    '.....kGGGk......',
    '......kGGGk.....',
    '.......kouok....',
    '........kouok...',
    '.........kouok..',
    '..........kouok.',
    '...........kook.',
    '............kk..',
    '................',
    '................',
  ];
  S.d_hannah = [
    '................',
    '..kkk....kkk....',
    '.kxxxk..kxxxk...',
    'kxxwxxkkxxxxxk..',
    'kxwxxxxxxxxxxk..',
    'kxxxxxxxxxxxxk..',
    'kxxxxxxxxxxxxk..',
    '.kxxxxxxxxxxk...',
    '..kxxxxxxxxk..y.',
    '...kxxxxxxk..yey',
    '....kxxxxk....y.',
    '.....kxxk.......',
    '......kk........',
    '................',
    '................',
    '................',
  ];
  S.d_windows = [
    '................',
    '................',
    '..kkkkkk.kkkkkk.',
    '..kbbbbk.kbbbbk.',
    '..kbbbbk.kbbbbk.',
    '..kbbbbk.kbbbbk.',
    '..kkkkkk.kkkkkk.',
    '................',
    '..kkkkkk.kkkkkk.',
    '..kbbbbk.kbbbbk.',
    '..kbbbbk.kbbbbk.',
    '..kbbbbk.kbbbbk.',
    '..kkkkkk.kkkkkk.',
    '................',
    '................',
    '................',
  ];

  /* ------------------------------------------------------------ Hüte (26×12, sitzen auf dem großen Tux) */
  // Tux-Kopf-Oberkante liegt bei y=HAT_H (Hut-Canvas 26 breit)
  S.hat_beanie = [
    '..........................',
    '............ww............',
    '...........wwww...........',
    '..........kkwwkk..........',
    '........kkooooookk........',
    '.......koooooooooOk.......',
    '......kooooooooooooOk.....',
    '.....kooooooooooooooOk....',
    '.....kOwOwOwOwOwOwOwOk....',
    '.....kkkkkkkkkkkkkkkkk....',
  ];
  S.hat_fedora = [
    '..........................',
    '..........................',
    '..........kkkkkk..........',
    '........kkUuuuuUkk........',
    '.......kuuuuUUuuuuk.......',
    '.......kuuuuuuuuuuk.......',
    '.......kkkkkkkkkkkk.......',
    '.......kbbbbbbbbbbk.......',
    '..kkkkkkkkkkkkkkkkkkkkkk..',
    '.kuuuuuuuuuuuuuuuuuuuuuuk.',
    '..kkkkkkkkkkkkkkkkkkkkkk..',
  ];
  S.hat_redhat = S.hat_fedora.map((r) => r.replace(/u/g, 'r').replace(/U/g, 'R').replace(/b/g, 'k'));
  S.hat_cap = [
    '..........................',
    '..........................',
    '..........................',
    '..........kkkkkk..........',
    '........kkbbbbbbkk........',
    '.......kbbbbwwbbbbk.......',
    '......kbbbbbbbbbbbbk......',
    '......kbbbbbbbbbbbbk......',
    '......kkkkkkkkkkkkkkkkkkk.',
    '...................kBBBBk.',
    '...................kkkkk..',
  ];
  S.hat_wizard = [
    '............kk............',
    '...........kvvk...........',
    '...........kvvk...........',
    '..........kvyvvk..........',
    '..........kvvvvk..........',
    '.........kvvvvyvk.........',
    '.........kvvvvvvk.........',
    '........kvvyvvvvvk........',
    '.......kvvvvvvvvvvk.......',
    '....kkkkkkkkkkkkkkkkkk....',
    '...kVVVVVVVVVVVVVVVVVVk...',
    '....kkkkkkkkkkkkkkkkkk....',
  ];
  S.hat_crown = [
    '..........................',
    '..........................',
    '.......k....kk....k.......',
    '......kyk..kyyk..kyk......',
    '......kyyk.kyyk.kyyk......',
    '......kyyykyyyykyyyk......',
    '......kyyyyyryyyyyyk......',
    '......kyyryyyyyyryyk......',
    '......kYYYYYYYYYYYYk......',
    '......kkkkkkkkkkkkkk......',
  ];
  S.hat_leaf = [
    '..........................',
    '..............kkk.........',
    '.............kllk.........',
    '............kllNk.........',
    '...........kllNk..........',
    '...........kNNk...........',
    '............kNk...........',
    '............kNk...........',
    '............kk............',
  ];
  S.hat_horns = [
    '..........................',
    '..........................',
    '..........................',
    '....kk................kk..',
    '....krk..............krk..',
    '.....krk............krk...',
    '.....krrk..........krrk...',
    '......krrk........krrk....',
    '.......kk..........kk.....',
  ];
  S.hat_hardhat = [
    '..........................',
    '..........................',
    '..........................',
    '..........kkkkkk..........',
    '........kkyyyyyykk........',
    '.......kyyyyYYyyyyk.......',
    '......kyyyyyYYyyyyyk......',
    '......kyyyyyYYyyyyyk......',
    '....kkkkkkkkkkkkkkkkkk....',
    '....kYYYYYYYYYYYYYYYYk....',
    '....kkkkkkkkkkkkkkkkkk....',
  ];
  S.hat_headset = [
    '..........................',
    '..........................',
    '..........................',
    '..........kkkkkk..........',
    '........kkggggggkk........',
    '.......kgk......kgk.......',
    '......kgk........kgk......',
    '.....kgk..........kgk.....',
    '....kkk............kkk....',
    '...kcck............kcck...',
    '...kcck............kcck...',
    '...kcck............kcck...',
    '....kk..............kk....',
  ];
  S.hat_bow = [
    '..........................',
    '..........................',
    '..........................',
    '...........kk..kk.........',
    '..........kxxkkxxk........',
    '.........kxxxkkxxxk.......',
    '.........kxwxkkxwxk.......',
    '..........kxxkkxxk........',
    '...........kk..kk.........',
  ];
  S.hat_snow = [
    '..........................',
    '..........................',
    '..........................',
    '.......k...kzzk...k.......',
    '.......zk..kzzk..kz.......',
    '.......kzk.kzzk.kzk.......',
    '.......kzzkzwwzkzzk.......',
    '.......kzzzzzzzzzzk.......',
    '.......kkkkkkkkkkkk.......',
  ];
  S.hat_gecko = [
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '.......kk.................',
    '......knnkkkkkkkkk........',
    '.....knwnnnnnnnnnnkk......',
    '.....knnnnnnnnnnnnnnk.....',
    '......kkNkkkkkNkkkkk......',
    '........k.....k...........',
  ];
  S.hat_ninja = [
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '.....kkkkkkkkkkkkkkkkkk...',
    '.....kNNNNNNNNNNNNNNNNNkk.',
    '.....kkkkkkkkkkkkkkkkkkNk.',
    '.......................kNk',
    '........................k.',
  ];
  S.hat_shades = [
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '.......kkkkkkkkkkkkk......',
    '.......kKKKKkkkKKKKk......',
    '........kKKk...kKKk.......',
    '.........kk.....kk........',
  ];
  S.hat_pipe = [
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '................G.G.......',
    '...............G.G........',
    '.............kkkkkkk......',
    '.............kUuuuUk......',
    '.........kkkkkUuuuUk......',
    '.........kuuuuuuuuk.......',
    '..........kkkkkkkk........',
  ];
  S.hat_ski = [
    '..........................',
    '............ww............',
    '...........wwww...........',
    '..........kkwwkk..........',
    '........kkbbbbbbkk........',
    '.......kbwbwbwbwbwk.......',
    '......kbbbbbbbbbbbbk......',
    '.....kwwwwwwwwwwwwwwk.....',
    '.....kbbbbbbbbbbbbbbk.....',
    '.....kkkkkkkkkkkkkkkk.....',
  ];
  S.hat_clip = [
    '..........................',
    '..............kkkk........',
    '.............kGGGGk.......',
    '.............kGkkGk.......',
    '.............kGkkGk.......',
    '.............kGkGGk.......',
    '.............kGkGk........',
    '.............kGkGk........',
    '.............kGGGk........',
    '..............kkk.........',
  ];
  S.hat_mint = [
    '..........................',
    '..........................',
    '..........................',
    '..........kkkkkk..........',
    '........kknnnnnnkk........',
    '.......knnnnwwnnnnk.......',
    '......knnnnnnnnnnnnk......',
    '......kNNNNNNNNNNNNk......',
    '..kkkkkkkkkkkkkkkkkk......',
    '..kNNNNk..................',
    '..kkkkk...................',
  ];
  S.hat_swirl = [
    '..........................',
    '............kk............',
    '...........krrk...........',
    '..........krwrrk..........',
    '..........krrwrk..........',
    '.........krrrrwrk.........',
    '.........krwrrrrk.........',
    '........krrwwrrrrk........',
    '........krrrrrwwrk........',
    '.......kkkkkkkkkkkk.......',
  ];

  /* ------------------------------------------------------------ Pixel-Schrift 3×5 */
  const F = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111',
    F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010',
    K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010',
    P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
    U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010',
    Z: '111001010100111', 0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110',
    4: '101101111001001', 5: '111100110001110', 6: '011100111101111', 7: '111001010010010', 8: '111101111101111',
    9: '111101111001110', '!': '010010010000010', '?': '110001010000010', '$': '011110010011110', '_': '000000000000111',
    '-': '000000111000000', '>': '100010001010100', '/': '001001010100100', '.': '000000000000010', ':': '000010000010000',
    '+': '000010111010000', '#': '101111101111101', '~': '000011110000000', '*': '101010101000000', '<': '001010100010001',
    '|': '010010010010010', '=': '000111000111000', ' ': '000000000000000',
  };

  /* ------------------------------------------------------------ Rendering */
  const cache = new Map();
  const isBrowser = typeof document !== 'undefined';

  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  // rows -> canvas
  function rasterize(rows, opt) {
    const w = Math.max(...rows.map((r) => r.length));
    const h = rows.length;
    const c = makeCanvas(w, h);
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(w, h);
    const map = (opt && opt.map) || null;
    const sil = opt && opt.silhouette;
    for (let y = 0; y < h; y++) {
      const row = rows[y];
      for (let x = 0; x < w; x++) {
        const ch = row[x];
        if (!ch || ch === '.') continue;
        let col = (map && map[ch]) || P[ch];
        if (!col) continue;
        if (sil) col = sil;
        const [r, g, b] = hexToRgb(col);
        const i = (y * w + x) * 4;
        img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  function keyOf(name, opt) { return name + (opt ? JSON.stringify(opt) : ''); }

  const SP = DH.sprites = { P, S, F };

  SP.canvas = (name, opt) => {
    if (!isBrowser) return null;
    const k = 'c:' + keyOf(name, opt);
    if (cache.has(k)) return cache.get(k);
    const rows = S[name] || S.box;
    const c = rasterize(rows, opt);
    cache.set(k, c);
    return c;
  };

  SP.url = (name, opt) => {
    if (!isBrowser) return '';
    const k = 'u:' + keyOf(name, opt);
    if (cache.has(k)) return cache.get(k);
    const u = SP.canvas(name, opt).toDataURL();
    cache.set(k, u);
    return u;
  };

  // Pixeltext auf ctx zeichnen
  SP.text = (ctx, str, x, y, color, scale = 1) => {
    ctx.fillStyle = color;
    let cx = x;
    for (const ch of String(str).toUpperCase()) {
      const g = F[ch] || F['?'];
      for (let i = 0; i < 15; i++) {
        if (g[i] === '1') ctx.fillRect(cx + (i % 3) * scale, y + Math.floor(i / 3) * scale, scale, scale);
      }
      cx += 4 * scale;
    }
    return cx - x;
  };

  // Stufen-Farben für Upgrade-Juwelen
  SP.tierColors = ['#c98a4b', '#c7ced8', '#ffd23f', '#5ce1e6', '#3ddc84', '#a86fff', '#ef3e4a', '#ff8fc7', '#ffffff', '#ff7b25', '#7ebae4'];

  // Upgrade-Icon: Grafik + Stufen-Juwel unten rechts
  SP.tierIcon = (name, tier, opt) => {
    if (!isBrowser) return '';
    const k = 'tier:' + name + ':' + tier + JSON.stringify(opt || {});
    if (cache.has(k)) return cache.get(k);
    const base = SP.canvas(name, opt);
    const c = makeCanvas(18, 18);
    const ctx = c.getContext('2d');
    ctx.drawImage(base, 0, 0);
    const col = SP.tierColors[(tier - 1) % SP.tierColors.length];
    // Juwel (Raute) 6×6 bei (12,12)
    ctx.fillStyle = P.k;
    ctx.fillRect(13, 11, 4, 1); ctx.fillRect(12, 12, 6, 4); ctx.fillRect(13, 16, 4, 1);
    ctx.fillStyle = col;
    ctx.fillRect(13, 12, 4, 4);
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.fillRect(13, 12, 1, 1);
    const u = c.toDataURL();
    cache.set(k, u);
    return u;
  };

  // Buchstaben-Kachel (für Glaubenskriege etc.)
  SP.letterIcon = (txt, bg, fg) => {
    if (!isBrowser) return '';
    const k = 'let:' + txt + bg + fg;
    if (cache.has(k)) return cache.get(k);
    const c = makeCanvas(16, 16);
    const ctx = c.getContext('2d');
    ctx.fillStyle = P.k; ctx.fillRect(1, 1, 14, 14);
    ctx.fillStyle = bg; ctx.fillRect(2, 2, 12, 12);
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(2, 2, 12, 1);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(2, 13, 12, 1);
    const t = String(txt).slice(0, 3);
    const w = t.length * 4 - 1;
    SP.text(ctx, t, Math.round((16 - w) / 2), 6, fg || '#fff', 1);
    const u = c.toDataURL();
    cache.set(k, u);
    return u;
  };

  // Tastenkappe mit Buchstabe
  SP.keyIcon = (letter, tint) => {
    if (!isBrowser) return '';
    const k = 'key:' + letter + tint;
    if (cache.has(k)) return cache.get(k);
    const base = SP.canvas('key', tint ? { map: { w: tint, W: shade(tint, -0.2) } } : null);
    const c = makeCanvas(16, 16);
    const ctx = c.getContext('2d');
    ctx.drawImage(base, 0, 0);
    SP.text(ctx, letter, 7 - (letter.length * 2 - 1), 5, P.K, 1);
    const u = c.toDataURL();
    cache.set(k, u);
    return u;
  };

  function shade(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v + (amt < 0 ? v * amt : (255 - v) * amt))));
    return '#' + [f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
  }
  SP.shade = shade;

  // Mit Glanz-/Umrandung skalierter Canvas für Szenen
  SP.draw = (ctx, name, x, y, scale, opt) => {
    const c = SP.canvas(name, opt);
    if (!c) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(c, Math.round(x), Math.round(y), c.width * scale, c.height * scale);
  };

  // Nerd-Porträt mit wachsendem Bart (prozedural), Rückgabe: Canvas 32×32
  SP.portrait = (beardStage, hairColor, hoodie) => {
    if (!isBrowser) return null;
    const k = 'por:' + beardStage + hairColor + hoodie;
    if (cache.has(k)) return cache.get(k);
    const c = makeCanvas(32, 32);
    const x = c.getContext('2d');
    const px = (col, a, b, w = 1, h = 1) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
    const hc = hairColor || '#4a3322';
    const grey = beardStage >= 7 ? '#d8d8d8' : beardStage >= 6 ? '#9a8f86' : hc;
    // Hoodie
    px(P.k, 5, 25, 22, 7); px(hoodie || '#2b3a55', 6, 26, 20, 6);
    px(shade(hoodie || '#2b3a55', -0.3), 6, 26, 20, 1);
    px(P.w, 13, 27, 1, 4); px(P.w, 18, 27, 1, 4);
    // Hals
    px(P.S, 13, 22, 6, 4);
    // Kopf
    px(P.k, 8, 5, 16, 19); px(P.s, 9, 6, 14, 17);
    px(P.S, 9, 20, 14, 3);
    // Ohren
    px(P.k, 7, 12, 2, 5); px(P.s, 7, 13, 1, 3); px(P.k, 23, 12, 2, 5); px(P.s, 24, 13, 1, 3);
    // Haare
    px(P.k, 8, 3, 16, 5); px(hc, 9, 4, 14, 4); px(hc, 8, 7, 2, 4); px(hc, 22, 7, 2, 4);
    px(shade(hc, 0.25), 11, 4, 5, 1);
    // Brille
    px(P.k, 9, 11, 6, 5); px(P.k, 17, 11, 6, 5); px(P.k, 15, 12, 2, 1);
    px('#9fd8ff', 10, 12, 4, 3); px('#9fd8ff', 18, 12, 4, 3);
    px(P.w, 10, 12, 1, 1); px(P.w, 18, 12, 1, 1);
    px(P.k, 12, 13, 1, 1); px(P.k, 20, 13, 1, 1);
    // Nase & Mund
    px(P.S, 15, 15, 2, 3);
    px(P.R, 14, 19, 4, 1);
    // Bart
    if (beardStage > 0) {
      const len = [0, 0, 2, 4, 6, 8, 10, 12, 14][Math.min(8, beardStage)];
      if (beardStage === 1) {
        // Dreitagebart: Schatten + Stoppeln
        x.fillStyle = 'rgba(74,51,34,0.28)';
        x.fillRect(10, 17, 12, 6); x.fillRect(9, 14, 1, 7); x.fillRect(22, 14, 1, 7);
        x.fillStyle = shade(grey, 0.05);
        for (let yy = 17; yy < 23; yy++) for (let xx = 10; xx < 22; xx++) if ((xx * 3 + yy * 5) % 4 === 0) x.fillRect(xx, yy, 1, 1);
        px(P.R, 14, 19, 4, 1);
      } else {
        // Koteletten
        px(grey, 9, 12, 1, 8); px(grey, 22, 12, 1, 8);
        // Schnurrbart
        px(grey, 12, 17, 8, 2); px(P.R, 14, 19, 4, 1);
        // Bart
        const top = 19;
        for (let i = 0; i < len + 4; i++) {
          const yy = top + i;
          const half = Math.max(1, Math.round(7 - Math.max(0, i - 2) * (6 / Math.max(4, len + 2))));
          px(P.k, 16 - half - 1, yy, half * 2 + 2, 1);
          px(grey, 16 - half, yy, half * 2, 1);
          if (i % 3 === 1) px(shade(grey, -0.2), 16 - half + 1, yy, 1, 1);
          if (i % 3 === 2) px(shade(grey, 0.2), 16 + half - 2, yy, 1, 1);
        }
        px(P.R, 14, 19, 4, 1);
        px(P.k, 13, 20, 6, 1); px(grey, 14, 20, 4, 1);
      }
    }
    cache.set(k, c);
    return c;
  };
})();
