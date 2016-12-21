/* 
 * Tiff Tag support classes.
 */

    ////////////////////////////////////////////////////
    //
    // BASELINE TIFF TAG TYPES
    //
    ////////////////////////////////////////////////////
    
    const T_BYTE = 1;
    const T_ASCII = 2;
    const T_SHORT = 3;
    const T_LONG = 4;
    const T_RATIONAL = 5;
    const T_SBYTE = 6;
    const T_UNDEFINED = 7;
    const T_SSHORT = 8;
    const T_SLONG = 9;
    const T_SRATIONAL = 10;
    const T_FLOAT = 11;
    const T_DOUBLE = 12;
    
    ////////////////////////////////////////////////////
    //
    // PHOTOSHOP RESOURCE RELATED TYPES
    //
    ////////////////////////////////////////////////////

    /** PSD 2+ Native format (.PSD) identifier "8BPS" */
    const SIGNATURE_8BPS = ('8' << 24) + ('B' << 16) + ('P' << 8) + 'S';

    /** PSD image resource marker "8BIM". */
    const RESOURCE_TYPE = ('8' << 24) + ('B' << 16) + ('I' << 8) + 'M';
    
    /** PSD image resource marker "8BIM". */
    const _8BIM = '8BIM';

    /** IPTC image resource id. (1028) */
    const RES_IPTC_NAA = 0x0404;

    /** ICC profile image resource id. (1039) */
    const RES_ICC_PROFILE = 0x040f;

    /** PSD Path resource id.  */
    const RES_CLIPPING_PATH = 0x07d0;
    
    /** LittleEndian */
    const LITTLE_ENDIAN_MARK_TIF = 'II';
    
    /** BigEndian */
    const BIG_ENDIAN_MARK_TIF = 'MM';

    module.exports.LITTLE_ENDIAN_MARK_TIF = LITTLE_ENDIAN_MARK_TIF;
    module.exports._8BIM = _8BIM;
    module.exports.BIG_ENDIAN_MARK_TIF = BIG_ENDIAN_MARK_TIF;
    module.exports.T_DOUBLE = T_DOUBLE;
    module.exports.T_FLOAT = T_FLOAT;
    module.exports.T_SRATIONAL = T_SRATIONAL;
    module.exports.T_SLONG = T_SLONG;
    module.exports.T_SSHORT = T_SSHORT;
    module.exports.T_UNDEFINED = T_UNDEFINED;
    module.exports.T_SBYTE = T_SBYTE;
    module.exports.T_RATIONAL = T_RATIONAL;
    module.exports.T_LONG = T_LONG;
    module.exports.T_SHORT = T_SHORT;
    module.exports.T_ASCII = T_ASCII;
    module.exports.T_BYTE = T_BYTE;
    module.exports.SIGNATURE_8BPS = SIGNATURE_8BPS;
    module.exports.RESOURCE_TYPE = RESOURCE_TYPE;
    module.exports.RES_IPTC_NAA = RES_IPTC_NAA;
    module.exports.RES_ICC_PROFILE = RES_ICC_PROFILE;
    module.exports.RES_CLIPPING_PATH = RES_CLIPPING_PATH;

    class TIFFTAGS {
        
        constructor(){
            this.RES_CLIPPING_PATH = 2000;
            //(Obsolete--Photoshop 2.0 only ) Contains five 2-byte values: number of channels, rows, columns, depth, and mode
            this.RES_CHANNELS_ROWS_COLUMNS_DEPTH_MODE = 1000;
            //Macintosh print manager print info record
            this.RES_MAC_PRINT_MANAGER_PRINT_INFO_RECORD = 1001;
            //Macintosh page format information. No longer read by Photoshop. (Obsolete)
            this.RES_MAC_PAGE_FORMAT_INFO = 1002;
            //(Obsolete--Photoshop 2.0 only ) Indexed color table
            this.RES_PHOTO_2_INDEXED_COLOR_TABLE = 1003;
            //ResolutionInfo structure. See Appendix A in Photoshop API Guide.pdf.
            this.RES_RESOLUTION_INFO = 1005;
            //as a series of Pascal strings
            this.RES_NAMES_OF_ALPHA_CHANNELS = 1006;
            //as a pascal string
            this.RES_CAPTION = 1008;
            //Border information. Contains a fixed number (2 bytes real, 2 bytes fraction) 
            //for the border width, and 2 bytes for border units (1 = inches, 2 = cm, 3 = points, 4 = picas, 5 = columns).
            this.RES_BORDER_INFO = 1009;
            //see Color Structure
            this.RES_BACKGROUND_COLOR = 1010;
            //A series of one-byte boolean values (see Page Setup dialog): labels, crop marks, color bars, 
            //registration marks, negative, flip, interpolate, caption, print flags.
            this.RES_PRINT_FLAGS = 1011;
            this.RES_GRAYSCALE_AND_MULTI_TONING_INFO = 1012;
            //Color half-toning information
            this.RES_COLOR_HALF_TONING_INFO = 1013;
            //Duo-toning information
            this.RES_DUO_TONING_INFO = 1014;
            //Grayscale and multichannel transfer function
            this.RES_GRAYSCALE_AND_MULTI_CHANNEL_TRANSFER_FUNC = 1015;
            //Color transfer functions
            this.RES_COLOR_TRANSFER_FUNCTS = 1016;
            //Duotone transfer functions
            this.RES_DUOTONE_TRANSFER_FUNCTS = 1017;
            //Duotone image information
            this.RES_DUOTONE_IMAGE_INFO = 1018;
            //Two bytes for the effective black and white values for the dot range
            this.RES_BLACK_AND_WHITE_DOT_RANGE = 1019;
            //EPS options
            this.RES_EPS_OPTS = 1021;
            //Quick Mask information. 2 bytes containing Quick Mask channel ID; 1- byte boolean 
            //indicating whether the mask was initially empty.
            this.RES_QUICK_MASK_INFO = 1022;
            //Layer state information. 2 bytes containing the index of target layer (0 = bottom layer).
            this.RES_LAYER_STATE_INFO = 1024;
            //Working path (not saved). See See Path resource format.
            this.RES_WORK_PATH = 1025;
            //Layers group information. 2 bytes per layer containing a group ID for the dragging groups. 
            //Layers in a group have the same group ID.
            this.RES_LAYERS_GROUP_INFO = 1026;
            //IPTC-NAA record. Contains the File Info... information. See the documentation in the IPTC 
            //folder of the Documentation folder. 
            this.RES_IPTC_NAA = 1028;
            //Image mode for raw format files
            this.RES_IMAGE_MODE_FOR_RAW = 1029;
            //JPEG quality. Private.
            this.RES_JPEG_QUALITY = 1030;
            //(Photoshop 4.0) Grid and guides information. See See Grid and guides resource format.
            this.RES_PHOTO_4_GRID_AND_GUIDE_INFO = 1032;
            //(Photoshop 4.0) Thumbnail resource for Photoshop 4.0 only. See See Thumbnail resource format.
            this.RES_PHOTO_4_THUMBNAIL = 1033;
            // (Photoshop 4.0) Copyright flag. Boolean indicating whether image is copyrighted. Can be set via 
            // Property suite or by user in File Info...
            this.RES_PHOTO_4_COPYRIGHT_FLAG = 1034;
            //(Photoshop 4.0) URL. Handle of a text string with uniform resource locator. Can be set via 
            //Property suite or by user in File Info...
            this.RES_PHOTO_4_URL = 1035;
            //(Photoshop 5.0) Thumbnail resource (supersedes resource 1033). See See Thumbnail resource format.
            this.RES_PHOTO_5_THUMBNAIL = 1036;
            //(Photoshop 5.0) Global Angle. 4 bytes that contain an integer between 0 and 359, which is the global 
            //lighting angle for effects layer. If not present, assumed to be 30.
            this.RES_PHOTO_5_GLOBAL_ANGLE = 1037;
            //(Obsolete) See ID 1073 below. (Photoshop 5.0) Color samplers resource. See See Color samplers resource format.
            this.RES_PHOTO_5_COLOR_SAMPLERS = 1038;
            //(Photoshop 5.0) ICC Profile. The raw bytes of an ICC (International Color Consortium) format profile. 
            //See ICC1v42_2006-05.pdf in the Documentation folder and icProfileHeader.h in Sample Code\Common\Includes .
            this.RES_PHOTO_5_ICC_PROFILE_RAW_BYTES = 1039;
            //(Photoshop 5.0) Watermark. One byte. 
            this.RES_PHOTO_5_WATERMARK = 1040;
            //(Photoshop 5.0) ICC Untagged Profile. 1 byte that disables any assumed profile handling when opening 
            //the file. 1 = intentionally untagged.
            this.RES_PHOTO_5_ICC_UNTAGGED_PROFILE = 1041;
            //(Photoshop 5.0) Effects visible. 1-byte global flag to show/hide all the effects layer. Only present when they are hidden.
            this.RES_PHOTO_5_EFFECTS_VISIBLE = 1042;
            //(Photoshop 5.0) Spot Halftone. 4 bytes for version, 4 bytes for length, and the variable length data.
            this.RES_PHOTO_5_SPOT_HALFTONE = 1043;
            //(Photoshop 5.0) Document-specific IDs seed number. 4 bytes: Base value, starting at which layer IDs will 
            //be generated (or a greater value if existing IDs already exceed it). Its purpose is to avoid the case 
            //where we add layers, flatten, save, open, and then add more layers that end up with the same IDs as the 
            //first set.
            this.RES_PHOTO_5_DOC_SPEC_IDS_SEED_NUMBER = 1044;
            //(Photoshop 5.0) Unicode Alpha Names. Unicode string
            this.RES_PHOTO_5_UNICODE_ALPHA_NAMES = 1045;
            //(Photoshop 6.0) Indexed Color Table Count. 2 bytes for the number of colors in table that are actually defined
            this.RES_PHOTO_6_INDEXED_COLOR_TABLE_COUNT = 1046;
            //(Photoshop 6.0) Transparency Index. 2 bytes for the index of transparent color, if any.
            this.RES_PHOTO_6_TRANSPARENCY_INDEX = 1047;
            //(Photoshop 6.0) Global Altitude. 4 byte entry for altitude
            this.RES_PHOTO_6_GLOBAL_ALTITUDE = 1049;
            //(Photoshop 6.0) Slices. See See Slices resource format.
            this.RES_PHOTO_6_SLICES = 1050;
            //(Photoshop 6.0) Workflow URL. Unicode string
            this.RES_PHOTO_6_WORKFLOW_URL = 1051;
            //(Photoshop 6.0) Jump To XPEP. 2 bytes major version, 2 bytes minor version, 4 bytes count. Following is 
            //repeated for count: 4 bytes block size, 4 bytes key, if key = 'jtDd' , then next is a Boolean for the dirty 
            //flag; otherwise it's a 4 byte entry for the mod date.
            this.RES_PHOTO_6_JUMP_TO_XPEP = 1052;
            //(Photoshop 6.0) Alpha Identifiers. 4 bytes of length, followed by 4 bytes each for every alpha identifier.
            this.RES_PHOTO_6_ALPHA_IDENTIFIERS = 1053;
            //(Photoshop 6.0) URL List. 4 byte count of URLs, followed by 4 byte long, 
            //4 byte ID, and Unicode string for each count.
            this.RES_PHOTO_6_URL_LIST = 1054;
            //(Photoshop 6.0) Version Info. 4 bytes version, 1 byte hasRealMergedData , 
            //Unicode string: writer name, Unicode string: reader name, 4 bytes file version.
            this.RES_PHOTO_6_VERSION_INFO = 1057;
            //(Photoshop 7.0) EXIF data 1. See http://www.kodak.com/global/plugins/acrobat/en/service/digCam/exifStandard2.pdf
            this.RES_PHOTO_7_EXIF_DATA_1 = 1058;
            //(Photoshop 7.0) EXIF data 3. See http://www.kodak.com/global/plugins/acrobat/en/service/digCam/exifStandard2.pdf
            this.RES_PHOTO_7_EXIF_DATA_3 = 1059;
            //(Photoshop 7.0) XMP metadata. File info as XML description. See http://www.adobe.com/devnet/xmp/
            this.RES_PHOTO_7_XMP = 1060;
            //(Photoshop 7.0) Caption digest. 16 bytes: RSA Data Security, MD5 message-digest algorithm
            this.RES_PHOTO_7_CAPTION_DIGEST = 1061;
            //(Photoshop 7.0) Print scale. 2 bytes style (0 = centered, 1 = size to fit, 2 = user defined). 
            //4 bytes x location (floating point). 4 bytes y location (floating point). 4 bytes scale (floating point)
            this.RES_PHOTO_7_PRINT_SCALE = 1062;
            //(Photoshop CS) Pixel Aspect Ratio. 4 bytes (version = 1 or 2), 8 bytes double, x / y of a pixel. Version 2, 
            //attempting to correct values for NTSC and PAL, previously off by a factor of approx. 5%.
            this.RES_PHOTO_CS_PIXEL_ASPECT_RATIO = 1064;
            //(Photoshop CS) Layer Comps. 4 bytes (descriptor version = 16), Descriptor (see See Descriptor structure)
            this.RES_PHOTO_CS_LAYER_COMPS = 1065;
            //(Photoshop CS) Alternate Duotone Colors. 2 bytes (version = 1), 2 bytes count, following is repeated for each 
            //count: [ Color: 2 bytes for space followed by 4 * 2 byte color component ], following this is another 2 byte 
            //count, usually 256, followed by Lab colors one byte each for L, a, b. This resource is not read or used by Photoshop.
            this.RES_PHOTO_CS_ALT_DUOTONE_COLORS = 1066;
            //(Photoshop CS)Alternate Spot Colors. 2 bytes (version = 1), 2 bytes channel count, following is repeated for each 
            //count: 4 bytes channel ID, Color: 2 bytes for space followed by 4 * 2 byte color component. This resource is not 
            //read or used by Photoshop.
            this.RES_PHOTO_CS_ALT_SPOT_COLORS = 1067;
            //(Photoshop CS2) Layer Selection ID(s). 2 bytes count, following is repeated for each count: 4 bytes layer ID
            this.RES_PHOTO_CS2_LAYER_SELECTION_ID = 1069;
            //(Photoshop CS2) HDR Toning information
            this.RES_PHOTO_CS2_HDR_TONING_INFO = 1070;
            //(Photoshop CS2) Print info
            this.RES_PHOTO_CS2_PRINT_INFO = 1071;
            //(Photoshop CS2) Layer Group(s) Enabled ID. 1 byte for each layer in the document, repeated by length of the 
            //resource. NOTE: Layer groups have start and end markers
            this.RES_PHOTO_CS2_LAYER_GROUP_ENABLED_ID = 1072;
            //(Photoshop CS3) Color samplers resource. Also see ID 1038 for old format. See See Color samplers resource format.
            this.RES_PHOTO_CS3_COLOR_SAMPLERS = 1073;
            //(Photoshop CS3) Measurement Scale. 4 bytes (descriptor version = 16), Descriptor (see See Descriptor structure)
            this.RES_PHOTO_CS3_MEASUREMENT_SCALE = 1074;
            //(Photoshop CS3) Timeline Information. 4 bytes (descriptor version = 16), Descriptor (see See Descriptor structure)
            this.RES_PHOTO_CS3_TIMELINE_INFO = 1075;
            //(Photoshop CS3) Sheet Disclosure. 4 bytes (descriptor version = 16), Descriptor (see See Descriptor structure)
            this.RES_PHOTO_CS3_SHEET_DISCLOSURE = 1076;
            //(Photoshop CS3) DisplayInfo structure to support floating point clors. Also see ID 1007. See Appendix A in Photoshop API Guide.pdf.
            this.RES_PHOTO_CS3_DISPLAY_INFO_STRUCTURE = 1077;
            //(Photoshop CS3) Onion Skins. 4 bytes (descriptor version = 16), Descriptor (see See Descriptor structure)
            this.RES_PHOTO_CS3_ONION_SKINS = 1078;
            //(Photoshop CS4) Count Information. 4 bytes (descriptor version = 16), Descriptor (see See Descriptor structure) Information 
            //about the count in the document. See the Count Tool.
            this.RES_PHOTO_CS4_COUNT_INFO = 1080;
            //(Photoshop CS5) Print Information. 4 bytes (descriptor version = 16), Descriptor (see See Descriptor structure) 
            //Information about the current print settings in the document. The color management options.
            this.RES_PHOTO_CS5_PRINT_INFO = 1082;
            //(Photoshop CS5) Print Style. 4 bytes (descriptor version = 16), Descriptor (see See Descriptor structure) 
            //Information about the current print style in the document. The printing marks, labels, ornaments, etc.
            this.RES_PHOTO_CS5_PRINT_STYLE = 1083;
            //(Photoshop CS5) Macintosh NSPrintInfo. Variable OS specific info for Macintosh. NSPrintInfo. It is recommened 
            //that you do not interpret or use this data.
            this.RES_PHOTO_CS5_MAC_NS_PRINT_INFO = 1084;
            //(Photoshop CS5) Windows DEVMODE. Variable OS specific info for Windows. DEVMODE. It is recommened that you do not 
            //interpret or use this data.
            this.RES_PHOTO_CS5_WINDOWS_DEVMODE = 1085;
            //(Photoshop CS6) Auto Save File Path. Unicode string. It is recommened that you do not interpret or use this data.
            this.RES_PHOTO_CS6_AUTO_SAVE_FILE_PATH = 1086;
            //(Photoshop CS6) Auto Save Format. Unicode string. It is recommened that you do not interpret or use this data.
            this.RES_PHOTO_CS6_AUTO_SAVE_FORMAT = 1087;
            //(Photoshop CC) Path Selection State. 4 bytes (descriptor version = 16), Descriptor (see See Descriptor structure) 
            //Information about the current path selection state.
            this.RES_PHOTO_CC_PATH_SELECTION_STATE = 1088;
            //Name of clipping path. See See Path resource format.
            this.RES_NAME_OF_CLIPPING_PATH = 2999;
            //(Photoshop CC) Origin Path Info. 4 bytes (descriptor version = 16), Descriptor (see See Descriptor structure) 
            //Information about the origin path data.
            this.RES_PHOTO_CC_ORIGIN_PATH_INFO = 3000;
            //Plug-In resource(s). Resources added by a plug-in. See the plug-in API found in the SDK documentation
            this.RES_PLUG_IN = 4000;
            //IMAGE READY STUFF OMITTED --> ADD LATER.
        }

    ////////////////////////////////////////////////////////
    //
    // STATIC METHODS
    //
    ////////////////////////////////////////////////////////

    static TYPE_BYTES(t, count) {
        if (typeof t === 'string' || typeof t === 'object') {
            t = new Number(t);
        }
        switch (t) {
            case T_SBYTE:
            case T_UNDEFINED :
            case T_BYTE :
            case T_ASCII :
            {
                return 1 * count;
            }
            case T_SSHORT :
            case T_SHORT :
            {
                return 2 * count;
            }
            case T_DOUBLE :
            case T_SRATIONAL :
            case T_RATIONAL :
            {
                return 8 * count;
            }
            case T_LONG :
            case T_SLONG :
            case T_FLOAT :
            {
                return 4 * count;
            }
            //NOT FOUND
            default :
            {
                return t + '';
            }
        }
    }

    static TYPE_DESC(t) {
        if (typeof t === 'string' || typeof t === 'object') {
            t = new Number(t);
        }
        switch (t) {
            case T_SBYTE:
            {
                return 'SBYTE';
            }
            case T_UNDEFINED :
            {
                return 'UNDEFINED';
            }
            case T_BYTE :
            {
                return 'BYTE';
            }
            case T_ASCII :
            {
                return 'ASCII';
            }
            case T_SSHORT :
            {
                return 'SSHORT';
            }
            case T_SHORT :
            {
                return 'SHORT';
            }
            case T_DOUBLE :
            {
                return 'DOUBLE';
            }
            case T_SRATIONAL :
            {
                return 'SRATIONAL';
            }
            case T_RATIONAL :
            {
                return 'RATIONAL';
            }
            case T_LONG :
            {
                return 'LONG';
            }
            case T_SLONG :
            {
                return 'SLONG';
            }
            case T_FLOAT :
            {
                return 'FLOAT';
            }
            //NOT FOUND
            default :
            {
                throw new Error('TIFF Tag Type not supported!');
            }
        }
    }
    
    static IFDEntryTypes() {
        return [
            'SBYTE','UNDEFINED','BYTE', 'ASCII', 'SSHORT', 'SHORT', 'DOUBLE', 'SRATIONAL', 'RATIONAL', 'LONG', 'SLONG', 'FLOAT'
        ];
    };
    

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //BASELINE TAGS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static CompressionMap(){
        return {
            1: 'No Compression',
            2: 'CCITT modified Huffman RLE',
            3: 'CCITT Group 3 fax encoding',
            4: 'CCITT Group 4 fax encoding',
            5: 'LZW',
            6: 'OJPEG',
            7: 'JPEG',
            8: 'Adobe Deflate',
            9: 'JBIG on black and white',
            10: 'JBIG on color',
            32766: 'NEXT',
            32771: 'CCITTRLEW',
            32773:'Macintosh RLE',
            32809: 'THUNDERSCAN',
            32895: 'IT8CTPAD',
            32896: 'IT8LW',
            32897: 'IT8MP',
            32898: 'IT8BL',
            32908: 'PIXARFILM',
            32909: 'PIXARLOG',
            32946: 'Deflate',
            32947: 'DCS',
            34661: 'JBIG',
            34676: 'SGILOG',
            34677: 'SGILOG24',
            34712: 'JP2000'
        };
    };

    static TagMap() {
        return {
            //BASELINE
            254: 'NewSubfileType',
            255: 'SubfileType',
            256: 'ImageWidth',
            257: 'ImageLength',
            258: 'BitsPerSample',
            259: 'Compression',
            262: 'PhotometricInterpretation',
            263: 'Threshholding',
            264: 'CellWidth',
            265: 'CellLength',
            266: 'FillOrder',
            270: 'ImageDescription',
            271: 'Make',
            272: 'Model',
            273: 'StripOffsets',
            274: 'Orientation',
            277: 'SamplesPerPixel',
            278: 'RowsPerStrip',
            279: 'StripByteCounts',
            280: 'MinSampleValue',
            281: 'MaxSampleValue',
            282: 'XResolution',
            283: 'YResolution',
            284: 'PlanarConfiguration',
            288: 'FreeOffsets',
            289: 'FreeByteCounts',
            290: 'GrayResponseUnit',
            291: 'GrayResponseCurve',
            296: 'ResolutionUnit',
            305: 'Software',
            306: 'DateTime',
            315: 'Artist',
            316: 'HostComputer',
            320: 'ColorMap',
            338: 'ExtraSamples',
            33432: 'Copyright',
            //EXTENSION
            269:'DocumentName',
            285:'PageName',
            286:'XPosition',
            287:'YPosition',
            292:'T4Options',
            293:'T6Options',
            297:'PageNumber',
            301:'TransferFunction',
            317:'Predictor',
            318:'WhitePoint',
            319:'PrimaryChromacities',
            321:'HalftoneHints',
            322:'TileWidth',
            323:'TileLength',
            324:'TileOffsets',
            325:'TileByteCounts',
            326:'BadFaxLines',
            327:'CleanFaxData',
            328:'ConsecutiveBadFaxLines',
            330:'SubIFDs',
            332:'InkSet',
            333:'InkNames',
            334:'NumberOfInks',
            336:'DotRange',
            337:'TargetPrinter',
            339:'SampleFormat',
            340:'SMinSampleValue',
            341:'SMaxSampleValue',
            342:'TransferRange',
            343:'ClipPath',
            344:'XClipPathUnits',
            345:'YClipPathUnits',
            346:'Indexed',
            347:'JPEGTables',
            351:'OPIProxy',
            400:'GlobalParametersIFD',
            401:'ProfileType',
            402:'FaxProfile',
            403:'CodingMethods',
            404:'VersionYear',
            405:'ModeNumber',
            433:'Decode',
            434:'DefaultImageColor',
            512:'JPEGProc',
            513:'JPEGInterchangeFormat',
            514:'JPEGInterchangeFormatLength',
            515:'JPEGRestartInterval',
            517:'JPEGLosslessPredictors',
            518:'JPEGPointTransforms',
            519:'JPEGQTables',
            520:'JPEGDCTables',
            521:'JPEGACTables',
            529:'YCbCrCoefficients',
            530:'YCbCrSubSampling',
            531:'YCbCrPositioning',
            532:'ReferenceBlackWhite',
            559:'StripRowCounts',
            700:'XMP',
            32781:'ImageID',
            34732:'ImageLayer',
            //PRIVATE
            32932:'Wang Annotation',
            33445:'MD FileTag',
            33446:'MD ScalePixel',
            33447:'MD ColorTable',
            33448:'MD LabName',
            33449:'MD SampleInfo',
            33450:'MD PrepDate',
            33451:'MD PrepTime',
            33452:'MD FileUnits',
            33550:'ModelPixelScaleTag',
            33723:'IPTC',
            33918:'INGR Packet Data Tag',
            33919:'INGR Flag Registers',
            33920:'IrasB Transformation Matrix',
            33922:'ModelTiepointTag',
            34264:'ModelTransformationTag',
            34377:'PhotoshopSettings',
            34665:'Exif IFD',
            34675:'ICC Profile',
            34735:'GeoKeyDirectoryTag',
            34736:'GeoDoubleParamsTag',
            34737:'GeoAsciiParamsTag',
            34853:'GPS IFD',
            34908:'HylaFAX FaxRecvParams',
            34909:'HylaFAX FaxSubAddress',
            34910:'HylaFAX FaxRecvTime',
            37724:'ImageSourceData',
            40965:'Interoperability IFD',
            42112:'GDAL_METADATA',
            42113:'GDAL_NODATA',
            50215:'Oce Scanjob Description',
            50216:'Oce Application Selector',
            50217:'Oce Identification Number',
            50218:'Oce ImageLogic Characteristics',
            50706:'DNGVersion',
            50707:'DNGBackwardVersion',
            50708:'UniqueCameraModel',
            50709:'LocalizedCameraModel',
            50710:'CFAPlaneColor',
            50711:'CFALayout',
            50712:'LinearizationTable',
            50713:'BlackLevelRepeatDim',
            50714:'BlackLevel',
            50715:'BlackLevelDeltaH',
            50716:'BlackLevelDeltaV',
            50717:'WhiteLevel',
            50718:'DefaultScale',
            50719:'DefaultCropOrigin',
            50720:'DefaultCropSize',
            50721:'ColorMatrix1',
            50722:'ColorMatrix2',
            50723:'CameraCalibration1',
            50724:'CameraCalibration2',
            50725:'ReductionMatrix1',
            50726:'ReductionMatrix2',
            50727:'AnalogBalance',
            50728:'AsShotNeutral',
            50729:'AsShotWhiteXY',
            50730:'BaselineExposure',
            50731:'BaselineNoise',
            50732:'BaselineSharpness',
            50733:'BayerGreenSplit',
            50734:'LinearResponseLimit',
            50735:'CameraSerialNumber',
            50736:'LensInfo',
            50737:'ChromaBlurRadius',
            50738:'AntiAliasStrength',
            50740:'DNGPrivateData',
            50741:'MakerNoteSafety',
            50778:'CalibrationIlluminant1',
            50779:'CalibrationIlluminant2',
            50780:'BestQualityScale',
            50784:'Alias Layer Metadata'
        };
    };
    
    static SignatureMap() {
        return {
            //BASELINE
            1000:RES_IPTC_NAA
        };
    };
    
    static getTagName(tag) {
        let namer = this.TagMap()[tag];
        if (namer) {
            return namer;
        } else {
            return tag;
        }
    }
    
    static getTagNumberByName(tag) {
        let tagMap = this.TagMap();
        for(let t in Object.keys(tagMap)){
            if(tagMap[t] === tag){
                return t;
            }
        }
        return 0;
    }

}


module.exports.TIFFTAGS = TIFFTAGS;

