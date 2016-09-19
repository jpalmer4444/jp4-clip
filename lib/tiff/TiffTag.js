/* 
 * Tiff Tag support classes.
 */

class Code {
    constructor(dex, hex) {
        this.dex = dex;
        this.hex = hex;
    }
    get dex() {
        return this.dex;
    }
    set dex(dex) {
        this.dex = dex;
    }
    get hex() {
        return this.hex;
    }
    set hex(hex) {
        this.hex = hex;
    }
}

class TiffTag {
    constructor(dex, hex, name, description) {
        this.code = new Code(dex, hex);
        this.name = name;
        this.description = description;
    }
    get code() {
        return this.code;
    }
    set code(code) {
        this.code = code;
    }
    get name() {
        return this.name;
    }
    set name(name) {
        this.name = name;
    }
    get description() {
        return this.description;
    }
    set description(description) {
        this.description = description;
    }
    static make(dex, hex, name, description){
        return new TiffTag(dex, hex, name, description);
    }
}

class TIFFTAGS {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //BASELINE TAGS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static NewSubfileType = TiffTag.make(254, 0xFE, 'NewSubFileType', 'A general indication of the kind of data contained in this subfile.');
    

    static SubfileType = TiffTag.make(255, 0xFF, 'SubFileType', 'A general indication of the kind of data contained in this subfile.');
    

    static ImageWidth = TiffTag.make(256, 0x0100, 'ImageWidth', 'The number of columns in the image, i.e., the number of pixels per row.');
    

    static ImageLength = TiffTag.make(257, 0x0101, 'ImageLength', 'The number of rows of pixels in the image.');
    

    static BitsPerSample = TiffTag.make(258, 0x0102, 'BitsPerSample', 'Number of bits per component.');
    

    static Compression = TiffTag.make(259, 0x0103, 'Compression', 'Compression scheme used on the image data.');
    

    static PhotometricInterpretation = TiffTag.make(262, 0x0106, 'PhotometricInterpretation', 'The color space of the image data');
    

    static Threshholding = TiffTag.make(263, 0x0107, 'Threshholding', 'For black and white TIFF files that represent shades of gray, the technique used to convert from gray to black and white pixels.');
    

    static CellWidth = TiffTag.make(264, 0x0108, 'CellWidth', 'The width of the dithering or halftoning matrix used to create a dithered or halftoned bilevel file.');
    

    static CellLength = TiffTag.make(265, 0x0109, 'CellLength', 'The length of the dithering or halftoning matrix used to create a dithered or halftoned bilevel file.');
    

    static FillOrder = TiffTag.make(266, 0x010A, 'FillOrder', 'The logical order of bits within a byte.');
    

    static ImageDescription = TiffTag.make(270, 0x010E, 'ImageDescription', 'A string that describes the subject of the image.');
    

    static Make = TiffTag.make(271, 0x010F, 'Make', 'The scanner manufacturer.');
    

    static Model = TiffTag.make(272, 0x0110, 'Model', 'The scanner model name or number.');
    

    static StripOffsets = TiffTag.make(273, 0x0111, 'StripOffsets', 'For each strip, the byte offset of that strip.');
    

    static Orientation = TiffTag.make(274, 0x0112, 'Orientation', 'The orientation of the image with respect to the rows and columns.');
    

    static SamplesPerPixel = TiffTag.make(277, 0x0115, 'SamplesPerPixel', 'The number of components per pixel.');
    

    static RowsPerStrip = TiffTag.make(278, 0x0116, 'RowsPerStrip', 'The number of rows per strip.');
    

    static StripByteCounts = TiffTag.make(279, 0x0117, 'StripByteCounts', 'For each strip, the number of bytes in the strip after compression.');
    

    static MinSampleValue = TiffTag.make(280, 0x0118, 'MinSampleValue', 'The minimum component value used.');
    

    static MaxSampleValue = TiffTag.make(281, 0x0119, 'MaxSampleValue', 'The maximum component value used.');
    

    static XResolution = TiffTag.make(282, 0x011A, 'XResolution', 'The number of pixels per ResolutionUnit in the ImageWidth direction.');
    

    static YResolution = TiffTag.make(283, 0x011B, 'YResolution', 'The number of pixels per ResolutionUnit in the ImageLength direction.');
    

    static PlanarConfiguration = TiffTag.make(284, 0x011C, 'PlanarConfiguration', 'How the components of each pixel are stored.');
    

    static FreeOffsets = TiffTag.make(288, 0x0120, 'FreeOffsets', 'For each string of contiguous unused bytes in a TIFF file, the byte offset of the string.');
    

    static FreeByteCounts = TiffTag.make(289, 0x0121, 'FreeByteCounts', 'For each string of contiguous unused bytes in a TIFF file, the number of bytes in the string.');
    

    static GrayResponseUnit = TiffTag.make(290, 0x0122, 'GrayResponseUnit', 'The precision of the information contained in the GrayResponseCurve.');
    

    static GrayResponseCurve = TiffTag.make(291, 0x0123, 'GrayResponseCurve', 'For grayscale data, the optical density of each possible pixel value.');
    

    static ResolutionUnit = TiffTag.make(296, 0x0128, 'ResolutionUnit', 'The unit of measurement for XResolution and YResolution.');
    

    static Software = TiffTag.make(305, 0x0131, 'Software', 'Name and version number of the software package(s) used to create the image.');
    

    static DateTime = TiffTag.make(306, 0x0132, 'DateTime', 'Date and time of image creation.');
    

    static Artist = TiffTag.make(315, 0x013B, 'Artist', 'Person who created the image.');
    

    static HostComputer = TiffTag.make(316, 0x013C, 'HostComputer', 'The computer and/or operating system in use at the time of image creation.');
    

    static ColrMap = TiffTag.make(320, 0x0140, 'ColorMap', 'A color map for palette color images.');
    

    static ExtraSamples = TiffTag.make(338, 0x0152, 'ExtraSamples', 'Description of extra components.');
    

    static Copyright = TiffTag.make(33432, 0x8298, 'Copyright', 'Copyright notice.');
    

}

module.exports.TiffTag = TiffTag;

module.exports.TIFFTAGS = TIFFTAGS;
