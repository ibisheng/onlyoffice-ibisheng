"use strict";

var fontslot_ASCII    = 0x00;
var fontslot_EastAsia = 0x01;
var fontslot_CS       = 0x02;
var fontslot_HAnsi    = 0x03;

var fonthint_Default  = 0x00;
var fonthint_CS       = 0x01;
var fonthint_EastAsia = 0x02;

var lcid_unknown = 0x0000; // Unknown
var lcid_ar = 0x0001; // Arabic
var lcid_bg = 0x0002; // Bulgarian
var lcid_ca = 0x0003; // Catalan
var lcid_zhHans = 0x0004; // Chinese, Han (Simplified variant)
var lcid_cs = 0x0005; // Czech
var lcid_da = 0x0006; // Danish
var lcid_de = 0x0007; // German
var lcid_el = 0x0008; // Modern Greek (1453-)
var lcid_en = 0x0009; // English
var lcid_es = 0x000a; // Spanish
var lcid_fi = 0x000b; // Finnish
var lcid_fr = 0x000c; // French
var lcid_he = 0x000d; // Hebrew
var lcid_hu = 0x000e; // Hungarian
var lcid_is = 0x000f; // Icelandic
var lcid_it = 0x0010; // Italian
var lcid_ja = 0x0011; // Japanese
var lcid_ko = 0x0012; // Korean
var lcid_nl = 0x0013; // Dutch
var lcid_no = 0x0014; // Norwegian
var lcid_pl = 0x0015; // Polish
var lcid_pt = 0x0016; // Portuguese
var lcid_rm = 0x0017; // Romansh
var lcid_ro = 0x0018; // Romanian
var lcid_ru = 0x0019; // Russian
var lcid_hr = 0x001a; // Croatian
var lcid_sk = 0x001b; // Slovak
var lcid_sq = 0x001c; // Albanian
var lcid_sv = 0x001d; // Swedish
var lcid_th = 0x001e; // Thai
var lcid_tr = 0x001f; // Turkish
var lcid_ur = 0x0020; // Urdu
var lcid_id = 0x0021; // Indonesian
var lcid_uk = 0x0022; // Ukrainian
var lcid_be = 0x0023; // Belarusian
var lcid_sl = 0x0024; // Slovenian
var lcid_et = 0x0025; // Estonian
var lcid_lv = 0x0026; // Latvian
var lcid_lt = 0x0027; // Lithuanian
var lcid_tg = 0x0028; // Tajik
var lcid_fa = 0x0029; // Persian
var lcid_vi = 0x002a; // Vietnamese
var lcid_hy = 0x002b; // Armenian
var lcid_az = 0x002c; // Azerbaijani
var lcid_eu = 0x002d; // Basque
var lcid_hsb = 0x002e; // Upper Sorbian
var lcid_mk = 0x002f; // Macedonian
var lcid_tn = 0x0032; // Tswana
var lcid_xh = 0x0034; // Xhosa
var lcid_zu = 0x0035; // Zulu
var lcid_af = 0x0036; // Afrikaans
var lcid_ka = 0x0037; // Georgian
var lcid_fo = 0x0038; // Faroese
var lcid_hi = 0x0039; // Hindi
var lcid_mt = 0x003a; // Maltese
var lcid_se = 0x003b; // Northern Sami
var lcid_ga = 0x003c; // Irish
var lcid_ms = 0x003e; // Malay (macrolanguage)
var lcid_kk = 0x003f; // Kazakh
var lcid_ky = 0x0040; // Kirghiz
var lcid_sw = 0x0041; // Swahili (macrolanguage)
var lcid_tk = 0x0042; // Turkmen
var lcid_uz = 0x0043; // Uzbek
var lcid_tt = 0x0044; // Tatar
var lcid_bn = 0x0045; // Bengali
var lcid_pa = 0x0046; // Panjabi
var lcid_gu = 0x0047; // Gujarati
var lcid_or = 0x0048; // Oriya
var lcid_ta = 0x0049; // Tamil
var lcid_te = 0x004a; // Telugu
var lcid_kn = 0x004b; // Kannada
var lcid_ml = 0x004c; // Malayalam
var lcid_as = 0x004d; // Assamese
var lcid_mr = 0x004e; // Marathi
var lcid_sa = 0x004f; // Sanskrit
var lcid_mn = 0x0050; // Mongolian
var lcid_bo = 0x0051; // Tibetan
var lcid_cy = 0x0052; // Welsh
var lcid_km = 0x0053; // Central Khmer
var lcid_lo = 0x0054; // Lao
var lcid_gl = 0x0056; // Galician
var lcid_kok = 0x0057; // Konkani (macrolanguage)
var lcid_syr = 0x005a; // Syriac
var lcid_si = 0x005b; // Sinhala
var lcid_iu = 0x005d; // Inuktitut
var lcid_am = 0x005e; // Amharic
var lcid_tzm = 0x005f; // Central Atlas Tamazight
var lcid_ne = 0x0061; // Nepali
var lcid_fy = 0x0062; // Western Frisian
var lcid_ps = 0x0063; // Pushto
var lcid_fil = 0x0064; // Filipino
var lcid_dv = 0x0065; // Dhivehi
var lcid_ha = 0x0068; // Hausa
var lcid_yo = 0x006a; // Yoruba
var lcid_quz = 0x006b; // Cusco Quechua
var lcid_nso = 0x006c; // Pedi
var lcid_ba = 0x006d; // Bashkir
var lcid_lb = 0x006e; // Luxembourgish
var lcid_kl = 0x006f; // Kalaallisut
var lcid_ig = 0x0070; // Igbo
var lcid_ii = 0x0078; // Sichuan Yi
var lcid_arn = 0x007a; // Mapudungun
var lcid_moh = 0x007c; // Mohawk
var lcid_br = 0x007e; // Breton
var lcid_ug = 0x0080; // Uighur
var lcid_mi = 0x0081; // Maori
var lcid_oc = 0x0082; // Occitan (post 1500)
var lcid_co = 0x0083; // Corsican
var lcid_gsw = 0x0084; // Swiss German
var lcid_sah = 0x0085; // Yakut
var lcid_qut = 0x0086; //
var lcid_rw = 0x0087; // Kinyarwanda
var lcid_wo = 0x0088; // Wolof
var lcid_prs = 0x008c; // Dari
var lcid_gd = 0x0091; // Scottish Gaelic
var lcid_arSA = 0x0401; // Arabic, Saudi Arabia
var lcid_bgBG = 0x0402; // Bulgarian, Bulgaria
var lcid_caES = 0x0403; // Catalan, Spain
var lcid_zhTW = 0x0404; // Chinese, Taiwan, Province of China
var lcid_csCZ = 0x0405; // Czech, Czech Republic
var lcid_daDK = 0x0406; // Danish, Denmark
var lcid_deDE = 0x0407; // German, Germany
var lcid_elGR = 0x0408; // Modern Greek (1453-), Greece
var lcid_enUS = 0x0409; // English, United States
var lcid_esES_tradnl = 0x040a; // Spanish
var lcid_fiFI = 0x040b; // Finnish, Finland
var lcid_frFR = 0x040c; // French, France
var lcid_heIL = 0x040d; // Hebrew, Israel
var lcid_huHU = 0x040e; // Hungarian, Hungary
var lcid_isIS = 0x040f; // Icelandic, Iceland
var lcid_itIT = 0x0410; // Italian, Italy
var lcid_jaJP = 0x0411; // Japanese, Japan
var lcid_koKR = 0x0412; // Korean, Republic of Korea
var lcid_nlNL = 0x0413; // Dutch, Netherlands
var lcid_nbNO = 0x0414; // Norwegian Bokmal, Norway
var lcid_plPL = 0x0415; // Polish, Poland
var lcid_ptBR = 0x0416; // Portuguese, Brazil
var lcid_rmCH = 0x0417; // Romansh, Switzerland
var lcid_roRO = 0x0418; // Romanian, Romania
var lcid_ruRU = 0x0419; // Russian, Russian Federation
var lcid_hrHR = 0x041a; // Croatian, Croatia
var lcid_skSK = 0x041b; // Slovak, Slovakia
var lcid_sqAL = 0x041c; // Albanian, Albania
var lcid_svSE = 0x041d; // Swedish, Sweden
var lcid_thTH = 0x041e; // Thai, Thailand
var lcid_trTR = 0x041f; // Turkish, Turkey
var lcid_urPK = 0x0420; // Urdu, Pakistan
var lcid_idID = 0x0421; // Indonesian, Indonesia
var lcid_ukUA = 0x0422; // Ukrainian, Ukraine
var lcid_beBY = 0x0423; // Belarusian, Belarus
var lcid_slSI = 0x0424; // Slovenian, Slovenia
var lcid_etEE = 0x0425; // Estonian, Estonia
var lcid_lvLV = 0x0426; // Latvian, Latvia
var lcid_ltLT = 0x0427; // Lithuanian, Lithuania
var lcid_tgCyrlTJ = 0x0428; // Tajik, Cyrillic, Tajikistan
var lcid_faIR = 0x0429; // Persian, Islamic Republic of Iran
var lcid_viVN = 0x042a; // Vietnamese, Viet Nam
var lcid_hyAM = 0x042b; // Armenian, Armenia
var lcid_azLatnAZ = 0x042c; // Azerbaijani, Latin, Azerbaijan
var lcid_euES = 0x042d; // Basque, Spain
var lcid_wenDE = 0x042e; // Sorbian languages, Germany
var lcid_mkMK = 0x042f; // Macedonian, The Former Yugoslav Republic of Macedonia
var lcid_stZA = 0x0430; // Southern Sotho, South Africa
var lcid_tsZA = 0x0431; // Tsonga, South Africa
var lcid_tnZA = 0x0432; // Tswana, South Africa
var lcid_venZA = 0x0433; // South Africa
var lcid_xhZA = 0x0434; // Xhosa, South Africa
var lcid_zuZA = 0x0435; // Zulu, South Africa
var lcid_afZA = 0x0436; // Afrikaans, South Africa
var lcid_kaGE = 0x0437; // Georgian, Georgia
var lcid_foFO = 0x0438; // Faroese, Faroe Islands
var lcid_hiIN = 0x0439; // Hindi, India
var lcid_mtMT = 0x043a; // Maltese, Malta
var lcid_seNO = 0x043b; // Northern Sami, Norway
var lcid_msMY = 0x043e; // Malay (macrolanguage), Malaysia
var lcid_kkKZ = 0x043f; // Kazakh, Kazakhstan
var lcid_kyKG = 0x0440; // Kirghiz, Kyrgyzstan
var lcid_swKE = 0x0441; // Swahili (macrolanguage), Kenya
var lcid_tkTM = 0x0442; // Turkmen, Turkmenistan
var lcid_uzLatnUZ = 0x0443; // Uzbek, Latin, Uzbekistan
var lcid_ttRU = 0x0444; // Tatar, Russian Federation
var lcid_bnIN = 0x0445; // Bengali, India
var lcid_paIN = 0x0446; // Panjabi, India
var lcid_guIN = 0x0447; // Gujarati, India
var lcid_orIN = 0x0448; // Oriya, India
var lcid_taIN = 0x0449; // Tamil, India
var lcid_teIN = 0x044a; // Telugu, India
var lcid_knIN = 0x044b; // Kannada, India
var lcid_mlIN = 0x044c; // Malayalam, India
var lcid_asIN = 0x044d; // Assamese, India
var lcid_mrIN = 0x044e; // Marathi, India
var lcid_saIN = 0x044f; // Sanskrit, India
var lcid_mnMN = 0x0450; // Mongolian, Mongolia
var lcid_boCN = 0x0451; // Tibetan, China
var lcid_cyGB = 0x0452; // Welsh, United Kingdom
var lcid_kmKH = 0x0453; // Central Khmer, Cambodia
var lcid_loLA = 0x0454; // Lao, Lao People's Democratic Republic
var lcid_myMM = 0x0455; // Burmese, Myanmar
var lcid_glES = 0x0456; // Galician, Spain
var lcid_kokIN = 0x0457; // Konkani (macrolanguage), India
var lcid_mni = 0x0458; // Manipuri
var lcid_sdIN = 0x0459; // Sindhi, India
var lcid_syrSY = 0x045a; // Syriac, Syrian Arab Republic
var lcid_siLK = 0x045b; // Sinhala, Sri Lanka
var lcid_chrUS = 0x045c; // Cherokee, United States
var lcid_iuCansCA = 0x045d; // Inuktitut, Unified Canadian Aboriginal Syllabics, Canada
var lcid_amET = 0x045e; // Amharic, Ethiopia
var lcid_tmz = 0x045f; // Tamanaku
var lcid_neNP = 0x0461; // Nepali, Nepal
var lcid_fyNL = 0x0462; // Western Frisian, Netherlands
var lcid_psAF = 0x0463; // Pushto, Afghanistan
var lcid_filPH = 0x0464; // Filipino, Philippines
var lcid_dvMV = 0x0465; // Dhivehi, Maldives
var lcid_binNG = 0x0466; // Bini, Nigeria
var lcid_fuvNG = 0x0467; // Nigerian Fulfulde, Nigeria
var lcid_haLatnNG = 0x0468; // Hausa, Latin, Nigeria
var lcid_ibbNG = 0x0469; // Ibibio, Nigeria
var lcid_yoNG = 0x046a; // Yoruba, Nigeria
var lcid_quzBO = 0x046b; // Cusco Quechua, Bolivia
var lcid_nsoZA = 0x046c; // Pedi, South Africa
var lcid_baRU = 0x046d; // Bashkir, Russian Federation
var lcid_lbLU = 0x046e; // Luxembourgish, Luxembourg
var lcid_klGL = 0x046f; // Kalaallisut, Greenland
var lcid_igNG = 0x0470; // Igbo, Nigeria
var lcid_krNG = 0x0471; // Kanuri, Nigeria
var lcid_gazET = 0x0472; // West Central Oromo, Ethiopia
var lcid_tiER = 0x0473; // Tigrinya, Eritrea
var lcid_gnPY = 0x0474; // Guarani, Paraguay
var lcid_hawUS = 0x0475; // Hawaiian, United States
var lcid_soSO = 0x0477; // Somali, Somalia
var lcid_iiCN = 0x0478; // Sichuan Yi, China
var lcid_papAN = 0x0479; // Papiamento, Netherlands Antilles
var lcid_arnCL = 0x047a; // Mapudungun, Chile
var lcid_mohCA = 0x047c; // Mohawk, Canada
var lcid_brFR = 0x047e; // Breton, France
var lcid_ugCN = 0x0480; // Uighur, China
var lcid_miNZ = 0x0481; // Maori, New Zealand
var lcid_ocFR = 0x0482; // Occitan (post 1500), France
var lcid_coFR = 0x0483; // Corsican, France
var lcid_gswFR = 0x0484; // Swiss German, France
var lcid_sahRU = 0x0485; // Yakut, Russian Federation
var lcid_qutGT = 0x0486; // Guatemala
var lcid_rwRW = 0x0487; // Kinyarwanda, Rwanda
var lcid_woSN = 0x0488; // Wolof, Senegal
var lcid_prsAF = 0x048c; // Dari, Afghanistan
var lcid_pltMG = 0x048d; // Plateau Malagasy, Madagascar
var lcid_gdGB = 0x0491; // Scottish Gaelic, United Kingdom
var lcid_arIQ = 0x0801; // Arabic, Iraq
var lcid_zhCN = 0x0804; // Chinese, China
var lcid_deCH = 0x0807; // German, Switzerland
var lcid_enGB = 0x0809; // English, United Kingdom
var lcid_esMX = 0x080a; // Spanish, Mexico
var lcid_frBE = 0x080c; // French, Belgium
var lcid_itCH = 0x0810; // Italian, Switzerland
var lcid_nlBE = 0x0813; // Dutch, Belgium
var lcid_nnNO = 0x0814; // Norwegian Nynorsk, Norway
var lcid_ptPT = 0x0816; // Portuguese, Portugal
var lcid_roMO = 0x0818; // Romanian, Macao
var lcid_ruMO = 0x0819; // Russian, Macao
var lcid_srLatnCS = 0x081a; // Serbian, Latin, Serbia and Montenegro
var lcid_svFI = 0x081d; // Swedish, Finland
var lcid_urIN = 0x0820; // Urdu, India
var lcid_azCyrlAZ = 0x082c; // Azerbaijani, Cyrillic, Azerbaijan
var lcid_dsbDE = 0x082e; // Lower Sorbian, Germany
var lcid_seSE = 0x083b; // Northern Sami, Sweden
var lcid_gaIE = 0x083c; // Irish, Ireland
var lcid_msBN = 0x083e; // Malay (macrolanguage), Brunei Darussalam
var lcid_uzCyrlUZ = 0x0843; // Uzbek, Cyrillic, Uzbekistan
var lcid_bnBD = 0x0845; // Bengali, Bangladesh
var lcid_paPK = 0x0846; // Panjabi, Pakistan
var lcid_mnMongCN = 0x0850; // Mongolian, Mongolian, China
var lcid_boBT = 0x0851; // Tibetan, Bhutan
var lcid_sdPK = 0x0859; // Sindhi, Pakistan
var lcid_iuLatnCA = 0x085d; // Inuktitut, Latin, Canada
var lcid_tzmLatnDZ = 0x085f; // Central Atlas Tamazight, Latin, Algeria
var lcid_neIN = 0x0861; // Nepali, India
var lcid_quzEC = 0x086b; // Cusco Quechua, Ecuador
var lcid_tiET = 0x0873; // Tigrinya, Ethiopia
var lcid_arEG = 0x0c01; // Arabic, Egypt
var lcid_zhHK = 0x0c04; // Chinese, Hong Kong
var lcid_deAT = 0x0c07; // German, Austria
var lcid_enAU = 0x0c09; // English, Australia
var lcid_esES = 0x0c0a; // Spanish, Spain
var lcid_frCA = 0x0c0c; // French, Canada
var lcid_srCyrlCS = 0x0c1a; // Serbian, Cyrillic, Serbia and Montenegro
var lcid_seFI = 0x0c3b; // Northern Sami, Finland
var lcid_tmzMA = 0x0c5f; // Tamanaku, Morocco
var lcid_quzPE = 0x0c6b; // Cusco Quechua, Peru
var lcid_arLY = 0x1001; // Arabic, Libyan Arab Jamahiriya
var lcid_zhSG = 0x1004; // Chinese, Singapore
var lcid_deLU = 0x1007; // German, Luxembourg
var lcid_enCA = 0x1009; // English, Canada
var lcid_esGT = 0x100a; // Spanish, Guatemala
var lcid_frCH = 0x100c; // French, Switzerland
var lcid_hrBA = 0x101a; // Croatian, Bosnia and Herzegovina
var lcid_smjNO = 0x103b; // Lule Sami, Norway
var lcid_arDZ = 0x1401; // Arabic, Algeria
var lcid_zhMO = 0x1404; // Chinese, Macao
var lcid_deLI = 0x1407; // German, Liechtenstein
var lcid_enNZ = 0x1409; // English, New Zealand
var lcid_esCR = 0x140a; // Spanish, Costa Rica
var lcid_frLU = 0x140c; // French, Luxembourg
var lcid_bsLatnBA = 0x141a; // Bosnian, Latin, Bosnia and Herzegovina
var lcid_smjSE = 0x143b; // Lule Sami, Sweden
var lcid_arMA = 0x1801; // Arabic, Morocco
var lcid_enIE = 0x1809; // English, Ireland
var lcid_esPA = 0x180a; // Spanish, Panama
var lcid_frMC = 0x180c; // French, Monaco
var lcid_srLatnBA = 0x181a; // Serbian, Latin, Bosnia and Herzegovina
var lcid_smaNO = 0x183b; // Southern Sami, Norway
var lcid_arTN = 0x1c01; // Arabic, Tunisia
var lcid_enZA = 0x1c09; // English, South Africa
var lcid_esDO = 0x1c0a; // Spanish, Dominican Republic
var lcid_frWest = 0x1c0c; // French
var lcid_srCyrlBA = 0x1c1a; // Serbian, Cyrillic, Bosnia and Herzegovina
var lcid_smaSE = 0x1c3b; // Southern Sami, Sweden
var lcid_arOM = 0x2001; // Arabic, Oman
var lcid_enJM = 0x2009; // English, Jamaica
var lcid_esVE = 0x200a; // Spanish, Venezuela
var lcid_frRE = 0x200c; // French, Reunion
var lcid_bsCyrlBA = 0x201a; // Bosnian, Cyrillic, Bosnia and Herzegovina
var lcid_smsFI = 0x203b; // Skolt Sami, Finland
var lcid_arYE = 0x2401; // Arabic, Yemen
var lcid_enCB = 0x2409; // English
var lcid_esCO = 0x240a; // Spanish, Colombia
var lcid_frCG = 0x240c; // French, Congo
var lcid_srLatnRS = 0x241a; // Serbian, Latin, Serbia
var lcid_smnFI = 0x243b; // Inari Sami, Finland
var lcid_arSY = 0x2801; // Arabic, Syrian Arab Republic
var lcid_enBZ = 0x2809; // English, Belize
var lcid_esPE = 0x280a; // Spanish, Peru
var lcid_frSN = 0x280c; // French, Senegal
var lcid_srCyrlRS = 0x281a; // Serbian, Cyrillic, Serbia
var lcid_arJO = 0x2c01; // Arabic, Jordan
var lcid_enTT = 0x2c09; // English, Trinidad and Tobago
var lcid_esAR = 0x2c0a; // Spanish, Argentina
var lcid_frCM = 0x2c0c; // French, Cameroon
var lcid_srLatnME = 0x2c1a; // Serbian, Latin, Montenegro
var lcid_arLB = 0x3001; // Arabic, Lebanon
var lcid_enZW = 0x3009; // English, Zimbabwe
var lcid_esEC = 0x300a; // Spanish, Ecuador
var lcid_frCI = 0x300c; // French, Cote d'Ivoire
var lcid_srCyrlME = 0x301a; // Serbian, Cyrillic, Montenegro
var lcid_arKW = 0x3401; // Arabic, Kuwait
var lcid_enPH = 0x3409; // English, Philippines
var lcid_esCL = 0x340a; // Spanish, Chile
var lcid_frML = 0x340c; // French, Mali
var lcid_arAE = 0x3801; // Arabic, United Arab Emirates
var lcid_enID = 0x3809; // English, Indonesia
var lcid_esUY = 0x380a; // Spanish, Uruguay
var lcid_frMA = 0x380c; // French, Morocco
var lcid_arBH = 0x3c01; // Arabic, Bahrain
var lcid_enHK = 0x3c09; // English, Hong Kong
var lcid_esPY = 0x3c0a; // Spanish, Paraguay
var lcid_frHT = 0x3c0c; // French, Haiti
var lcid_arQA = 0x4001; // Arabic, Qatar
var lcid_enIN = 0x4009; // English, India
var lcid_esBO = 0x400a; // Spanish, Bolivia
var lcid_enMY = 0x4409; // English, Malaysia
var lcid_esSV = 0x440a; // Spanish, El Salvador
var lcid_enSG = 0x4809; // English, Singapore
var lcid_esHN = 0x480a; // Spanish, Honduras
var lcid_esNI = 0x4c0a; // Spanish, Nicaragua
var lcid_esPR = 0x500a; // Spanish, Puerto Rico
var lcid_esUS = 0x540a; // Spanish, United States
var lcid_bsCyrl = 0x641a; // Bosnian, Cyrillic
var lcid_bsLatn = 0x681a; // Bosnian, Latin
var lcid_srCyrl = 0x6c1a; // Serbian, Cyrillic
var lcid_srLatn = 0x701a; // Serbian, Latin
var lcid_smn = 0x703b; // Inari Sami
var lcid_azCyrl = 0x742c; // Azerbaijani, Cyrillic
var lcid_sms = 0x743b; // Skolt Sami
var lcid_zh = 0x7804; // Chinese
var lcid_nn = 0x7814; // Norwegian Nynorsk
var lcid_bs = 0x781a; // Bosnian
var lcid_azLatn = 0x782c; // Azerbaijani, Latin
var lcid_sma = 0x783b; // Southern Sami
var lcid_uzCyrl = 0x7843; // Uzbek, Cyrillic
var lcid_mnCyrl = 0x7850; // Mongolian, Cyrillic
var lcid_iuCans = 0x785d; // Inuktitut, Unified Canadian Aboriginal Syllabics
var lcid_zhHant = 0x7c04; // Chinese, Han (Traditional variant)
var lcid_nb = 0x7c14; // Norwegian Bokmal
var lcid_sr = 0x7c1a; // Serbian
var lcid_tgCyrl = 0x7c28; // Tajik, Cyrillic
var lcid_dsb = 0x7c2e; // Lower Sorbian
var lcid_smj = 0x7c3b; // Lule Sami
var lcid_uzLatn = 0x7c43; // Uzbek, Latin
var lcid_mnMong = 0x7c50; // Mongolian, Mongolian
var lcid_iuLatn = 0x7c5d; // Inuktitut, Latin
var lcid_tzmLatn = 0x7c5f; // Central Atlas Tamazight, Latin
var lcid_haLatn = 0x7c68; // Hausa, Latin

(function(document){

    function CDetectFontUse()
    {
        this.DetectData     = null;

        this.TableChunkLen  = 65536;
        this.TableChunks    = 4;

        this.TableChunkMain     = 0;
        this.TableChunkHintEA   = this.TableChunkLen;
        this.TableChunkHintZH   = 2 * this.TableChunkLen;
        this.TableChunkHintEACS = 3 * this.TableChunkLen;

        this.Init = function()
        {
            this.DetectData = g_memory.Alloc(this.TableChunkLen * this.TableChunks);
            var _data = this.DetectData.data;
            var i, j;

            // ********************** 1st table *********************** //
            j = 0;
            for (i = 0x0000; i <= 0x007F; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0x00A0; i <= 0x04FF; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 0x0590; i <= 0x07BF; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0x1100; i <= 0x11FF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x1E00; i <= 0x1EFF; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 0x1F00; i <= 0x27BF; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 0x2E80; i <= 0x319F; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x3200; i <= 0x4D8F; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x4E00; i <= 0x9FAF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xA000; i <= 0xA4CF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xAC00; i <= 0xD7AF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xD800; i <= 0xDFFF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xE000; i <= 0xF8FF; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 0xF900; i <= 0xFAFF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xFB00; i <= 0xFB1C; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 0xFB1D; i <= 0xFDFF; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0xFE30; i <= 0xFE6F; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xFE70; i <= 0xFEFE; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0xFF00; i <= 0xFFEF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }

            // ********************** 2nd table *********************** //
            j = this.TableChunkHintEA;
            for (i = 0x0000; i <= 0x007F; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0x00A0; i <= 0x04FF; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            _data[0xA1 + j] = fontslot_EastAsia;
            _data[0xA4 + j] = fontslot_EastAsia;
            _data[0xA7 + j] = fontslot_EastAsia;
            _data[0xA8 + j] = fontslot_EastAsia;
            _data[0xAA + j] = fontslot_EastAsia;
            _data[0xAD + j] = fontslot_EastAsia;
            _data[0xAF + j] = fontslot_EastAsia;
            _data[0xB0 + j] = fontslot_EastAsia;
            _data[0xB1 + j] = fontslot_EastAsia;
            _data[0xB2 + j] = fontslot_EastAsia;
            _data[0xB3 + j] = fontslot_EastAsia;
            _data[0xB4 + j] = fontslot_EastAsia;
            _data[0xB6 + j] = fontslot_EastAsia;
            _data[0xB7 + j] = fontslot_EastAsia;
            _data[0xB8 + j] = fontslot_EastAsia;
            _data[0xB9 + j] = fontslot_EastAsia;
            _data[0xBA + j] = fontslot_EastAsia;
            _data[0xBC + j] = fontslot_EastAsia;
            _data[0xBD + j] = fontslot_EastAsia;
            _data[0xBE + j] = fontslot_EastAsia;
            _data[0xBF + j] = fontslot_EastAsia;
            _data[0xD7 + j] = fontslot_EastAsia;
            _data[0xF7 + j] = fontslot_EastAsia;

            for (i = 0x02B0; i <= 0x04FF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x0590; i <= 0x07BF; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0x1100; i <= 0x11FF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x1E00; i <= 0x1EFF; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 0x1F00; i <= 0x1FFF; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 0x2000; i <= 0x27BF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x2E80; i <= 0x319F; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x3200; i <= 0x4D8F; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x4E00; i <= 0x9FAF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xA000; i <= 0xA4CF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xAC00; i <= 0xD7AF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xD800; i <= 0xDFFF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xE000; i <= 0xF8FF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xF900; i <= 0xFAFF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xFB00; i <= 0xFB1C; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xFB1D; i <= 0xFDFF; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0xFE30; i <= 0xFE6F; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xFE70; i <= 0xFEFE; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0xFF00; i <= 0xFFEF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }

            // ********************** 3rd table *********************** //
            j = this.TableChunkHintZH;
            for (i = 0x0000; i <= 0x007F; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0x00A0; i <= 0x00FF; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            _data[0xA1 + j] = fontslot_EastAsia;
            _data[0xA4 + j] = fontslot_EastAsia;
            _data[0xA7 + j] = fontslot_EastAsia;
            _data[0xA8 + j] = fontslot_EastAsia;
            _data[0xAA + j] = fontslot_EastAsia;
            _data[0xAD + j] = fontslot_EastAsia;
            _data[0xAF + j] = fontslot_EastAsia;
            _data[0xB0 + j] = fontslot_EastAsia;
            _data[0xB1 + j] = fontslot_EastAsia;
            _data[0xB2 + j] = fontslot_EastAsia;
            _data[0xB3 + j] = fontslot_EastAsia;
            _data[0xB4 + j] = fontslot_EastAsia;
            _data[0xB6 + j] = fontslot_EastAsia;
            _data[0xB7 + j] = fontslot_EastAsia;
            _data[0xB8 + j] = fontslot_EastAsia;
            _data[0xB9 + j] = fontslot_EastAsia;
            _data[0xBA + j] = fontslot_EastAsia;
            _data[0xBC + j] = fontslot_EastAsia;
            _data[0xBD + j] = fontslot_EastAsia;
            _data[0xBE + j] = fontslot_EastAsia;
            _data[0xBF + j] = fontslot_EastAsia;
            _data[0xD7 + j] = fontslot_EastAsia;
            _data[0xF7 + j] = fontslot_EastAsia;

            _data[0xE0 + j] = fontslot_EastAsia;
            _data[0xE1 + j] = fontslot_EastAsia;
            _data[0xE8 + j] = fontslot_EastAsia;
            _data[0xE9 + j] = fontslot_EastAsia;
            _data[0xEA + j] = fontslot_EastAsia;
            _data[0xEC + j] = fontslot_EastAsia;
            _data[0xED + j] = fontslot_EastAsia;
            _data[0xF2 + j] = fontslot_EastAsia;
            _data[0xF3 + j] = fontslot_EastAsia;
            _data[0xF9 + j] = fontslot_EastAsia;
            _data[0xFA + j] = fontslot_EastAsia;
            _data[0xFC + j] = fontslot_EastAsia;

            for (i = 0x0100; i <= 0x02AF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x02B0; i <= 0x04FF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x0590; i <= 0x07BF; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0x1100; i <= 0x11FF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x1E00; i <= 0x1EFF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x1F00; i <= 0x1FFF; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 0x2000; i <= 0x27BF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x2E80; i <= 0x319F; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x3200; i <= 0x4D8F; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x4E00; i <= 0x9FAF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xA000; i <= 0xA4CF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xAC00; i <= 0xD7AF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xD800; i <= 0xDFFF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xE000; i <= 0xF8FF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xF900; i <= 0xFAFF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xFB00; i <= 0xFB1C; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xFB1D; i <= 0xFDFF; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0xFE30; i <= 0xFE6F; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xFE70; i <= 0xFEFE; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0xFF00; i <= 0xFFEF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }

            // ********************** 4rd table *********************** //
            j = this.TableChunkHintEACS;
            for (i = 0x0000; i <= 0x007F; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0x00A0; i <= 0x00FF; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            _data[0xA1 + j] = fontslot_EastAsia;
            _data[0xA4 + j] = fontslot_EastAsia;
            _data[0xA7 + j] = fontslot_EastAsia;
            _data[0xA8 + j] = fontslot_EastAsia;
            _data[0xAA + j] = fontslot_EastAsia;
            _data[0xAD + j] = fontslot_EastAsia;
            _data[0xAF + j] = fontslot_EastAsia;
            _data[0xB0 + j] = fontslot_EastAsia;
            _data[0xB1 + j] = fontslot_EastAsia;
            _data[0xB2 + j] = fontslot_EastAsia;
            _data[0xB3 + j] = fontslot_EastAsia;
            _data[0xB4 + j] = fontslot_EastAsia;
            _data[0xB6 + j] = fontslot_EastAsia;
            _data[0xB7 + j] = fontslot_EastAsia;
            _data[0xB8 + j] = fontslot_EastAsia;
            _data[0xB9 + j] = fontslot_EastAsia;
            _data[0xBA + j] = fontslot_EastAsia;
            _data[0xBC + j] = fontslot_EastAsia;
            _data[0xBD + j] = fontslot_EastAsia;
            _data[0xBE + j] = fontslot_EastAsia;
            _data[0xBF + j] = fontslot_EastAsia;
            _data[0xD7 + j] = fontslot_EastAsia;
            _data[0xF7 + j] = fontslot_EastAsia;

            for (i = 0x0100; i <= 0x02AF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x02B0; i <= 0x04FF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x0590; i <= 0x07BF; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0x1100; i <= 0x11FF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x1E00; i <= 0x1EFF; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 0x1F00; i <= 0x1FFF; i++)
            {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 0x2000; i <= 0x27BF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x2E80; i <= 0x319F; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x3200; i <= 0x4D8F; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0x4E00; i <= 0x9FAF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xA000; i <= 0xA4CF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xAC00; i <= 0xD7AF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xD800; i <= 0xDFFF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xE000; i <= 0xF8FF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xF900; i <= 0xFAFF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xFB00; i <= 0xFB1C; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xFB1D; i <= 0xFDFF; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0xFE30; i <= 0xFE6F; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 0xFE70; i <= 0xFEFE; i++)
            {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 0xFF00; i <= 0xFFEF; i++)
            {
                _data[i + j] = fontslot_EastAsia;
            }
        }

        this.Get_FontClass = function(nUnicode, nHint, nEastAsia_lcid, bCS, bRTL)
        {
            var _glyph_slot = fontslot_ASCII;
            if (nHint != fonthint_EastAsia)
            {
                _glyph_slot = this.DetectData.data[nUnicode];
            }
            else
            {
                if (nEastAsia_lcid == lcid_zh)
                    _glyph_slot = this.DetectData.data[this.TableChunkHintZH + nUnicode];
                else
                    _glyph_slot = this.DetectData.data[this.TableChunkHintEA + nUnicode];

                if (_glyph_slot == fontslot_EastAsia)
                    return _glyph_slot;
            }

            if (bCS || bRTL)
                return fontslot_CS;

            return _glyph_slot;
        }
    }

    window.CDetectFontUse = CDetectFontUse;
})(window.document);

var g_font_detector = new window.CDetectFontUse();
g_font_detector.Init();