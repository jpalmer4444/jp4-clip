/* 
 * Resource class. This class knows which Resource class to use for each type of 8BIM resource.
 */
let TiffTag = require('../TiffTag');
let TIFFTAGS = TiffTag.TIFFTAGS;
let LOG = require('../../logging').getLogger();
let PathResource = require('./resources/PathResource').PathResource;
let UnsupportedResource = require('./resources/UnsupportedResource').UnsupportedResource;

const endianness = 'BE';

class Resource {
    
    constructor(bytes, pascalString, identifier, signature, reader){
        this._resources = new Array();
        this._signature = signature;
        this._index = 0;
        this._pascalString = pascalString.string;
        this._reader = reader;
        this._identifier = identifier;
        this._length = Buffer.alloc(4, bytes.slice(this._index, this._index + 4)).readUInt32BE(0, false);
        this._index += 4;
        this._resourceData = bytes.slice(this._index, this.length + 4);
        
        //should never happen.
        if(this._length % 2 !== 0){
            this._index++;//padded to make even
        }else 
        if(this._length === 0){
            this._index+=2;//padded to make size even
        }
        
        switch(this._identifier){
            //Clipping Path
            case 2000 : {
                    
                    //push a PathResource for every PathPoint (26 bytes)
                    if(this._resourceData.length % 26 !== 0){
                        throw new Error('resourceData wrong length! Actual length: '+this._resourceData.length+' this.length: '+this._length);
                    }else{
                        for(let i = 0;i < (this._resourceData.length);i+=26){
                            let bytes26 = this._resourceData.slice(i, i + 26);
                            this._resources.push(new PathResource(bytes26, reader));
                        }
                    }
                    break;
            }
            
            default : {
                   this._resources.push(new UnsupportedResource(this._resourceData, reader));
                   break;
            }
        }
    }
    
    get resources(){return this._resources;}
    set resources(resources){this._resources=resources;}
    get resourceData(){return this._resourceData;}
    set resourceData(r){this._resourceData=r;}
    get length(){return this._length;}
    set length(l){this._length=l;}
    get identifier(){return this._identifier;}
    set identifier(i){this._identifier=i;}
    get index(){return this._index;}
    set index(r){this._index=r;}
    get pascalString(){return this._pascalString;}
    set pascalString(r){this._pascalString=r;}
    get endianness(){return this._endianness;}
    set endianness(r){this._endianness=r;}
    get signature(){return this._signature;}
    set signature(r){this._signature=r;}
    
    write(endianness){
        //4 bytes for the signature (8BIM)
        let bytes = [];
        bytes.push(Buffer.allocUnsafe(4)['writeUInt32' + endianness](this.signature, 0, false));
        
        
        //1 byte for Pascal length
        
        //? bytes for Pascal String
        
        return bytes;
    }
    
    toString() {
        let displayValue = this.pascalString ? this.pascalString : '';
        if(displayValue > 200){
            displayValue = displayValue.substring(194) + '[snip]';
        }
        let string = `  |   |   | ${Resource.getIdDesc(this.identifier)} = ${displayValue}`;
        switch(this._resources[0].constructor){
            case PathResource : {
                    for(let i = 0;i < this._resources.length;i++){
                        let resource = this._resources[i];
                        string += '\n';
                        string += resource.toString();
                    }
            }
            case UnsupportedResource : {
                  //string += '\n';//will only be one if type is UnsupportedResource!
                  //string += this._resources[0].toString();  
            }
        }
        return string;
    }
    
    static getIdentifer(bytes, endianness, index){
        return Buffer.alloc(2, bytes.slice(index, index + 2))['readUInt16' + endianness](0, false);;
    }
    
    static getIdDesc(identifier){
        let iden = Resource.ResourceNameMap().get(identifier);
        return iden ? iden : this.identifier;
    }
    
    static ResourceNameMap(){
        let names = new Map();
        names.set(1000, '1000:  (PS2) NumberOfChannelsRowsColumnsDepthAndMode');
        names.set(1001, '1001:  MacintoshPrintManagerPrintInfoRecord');
        names.set(1002, '1002:  (PS) MacintoshPageFormatInformation');
        names.set(1003, '1003:  (PS2) IndexedColorTable');
        names.set(1005, '1005:  ResolutionInfo');
        names.set(1006, '1006:  AlphaChannelNames');
        names.set(1007, '1007:  DisplayInfo');
        names.set(1008, '1008:  Caption');
        names.set(1009, '1009:  BorderInformation');
        names.set(1010, '1010:  BackgroundColor');
        names.set(1011, '1011:  PrintFlags');
        names.set(1012, '1012:  GrayscaleAndMultichannelHalftoningInformation');
        names.set(1013, '1013:  ColorHalftoningInformation');
        names.set(1014, '1014:  DuotoneHalftoningInformation');
        names.set(1015, '1015:  GrayscaleAndMultichannelTransferFunction');
        names.set(1016, '1016:  ColorTransferFunctions');
        names.set(1017, '1017:  DuotonetransferFunctions');
        names.set(1018, '1018:  DuotoneImageInformation');
        names.set(1019, '1019:  BlackAndWhiteValuesForDotRange');
        names.set(1020, '1020:  Obsolete-1020');
        names.set(1021, '1021:  EPSOptions');
        names.set(1022, '1022:  QuickMaskInformation');
        names.set(1023, '1023:  Obsolete-1023');
        names.set(1024, '1024:  LayerStateInformation');
        names.set(1025, '1025:  WorkingPath');
        names.set(1026, '1026:  LayersgroupInformation');
        names.set(1027, '1027:  Obsolete-1027');
        names.set(1028, '1028:  IPTC-NAA');
        names.set(1029, '1029:  ImageModeForRawFormatFiles');
        names.set(1030, '1030:  JPEGQuality');
        names.set(1032, '1032:  (PS4) GridAndGuidesInformation');
        names.set(1033, '1033:  (PS4) ThumbnailResource');
        names.set(1034, '1034:  CopyrightFlag');
        names.set(1035, '1035:  (PS4) URL');
        names.set(1036, '1036:  (PS5) ThumbnailResource');
        names.set(1037, '1037:  (PS5) GlobalAngle');
        names.set(1038, '1038:  Obsolete-1038');
        names.set(1039, '1039:  (PS5) ICCProfile');
        names.set(1040, '1040:  (PS5) Watermark');
        names.set(1041, '1041:  (PS5) ICCUntaggedProfile');
        names.set(1042, '1042:  (PS5) EffectsVisible');
        names.set(1043, '1043:  (PS5) SpotHalftone');
        names.set(1044, '1044:  (PS5) DocumentSpecificIDsSeedNumber');
        names.set(1045, '1045:  (PS5) UnicodeAlphaNames');
        names.set(1046, '1046:  (PS6) IndexedColorTableCount');
        names.set(1047, '1047:  (PS6) TransparencyIndex');
        names.set(1049, '1049:  (PS6) GlobalAltitude');
        names.set(1050, '1050:  (PS6) Slices');
        names.set(1051, '1051:  (PS6) WorkflowURL');
        names.set(1052, '1052:  (PS6) JumpToXPEP');
        names.set(1053, '1053:  (PS6) AlphaIdentifiers');
        names.set(1054, '1054:  (PS6) URList');
        names.set(1057, '1057:  (PS6) VersionInfo');
        names.set(1058, '1058:  (PS7) ExifData1');
        names.set(1059, '1059:  (PS7) ExifData3');
        names.set(1060, '1060:  (PS7) XMPMetadata');
        names.set(1061, '1061:  (PS7) CaptionDigest');
        names.set(1062, '1062:  (PS7) PrintScale');
        names.set(1064, '1064:  (CS1) PixelAspectRatio');
        names.set(1065, '1065:  (CS1) LayerComps');
        names.set(1066, '1066:  (CS1) AlternateDuotoneColors');
        names.set(1067, '1067:  (CS1) AlternateSpotColors');
        names.set(1069, '1069:  (CS2) LayerSelectionIDs');
        names.set(1070, '1070:  (CS2) HDRToningInformation');
        names.set(1071, '1071:  (CS2) PrintInfo');
        names.set(1072, '1072:  (CS2) LayerGroupEnabledID');
        names.set(1073, '1073:  (CS3) ColorSamplers');
        names.set(1074, '1074:  MeasureMentScale');
        names.set(1075, '1075:  (CS3) TimelineInformation');
        names.set(1076, '1076:  (CS3) SheetDisclosure');
        names.set(1077, '1077:  (CS3) DisplayInfo');
        names.set(1078, '1078:  (CS3) OnionSkins');
        names.set(1080, '1080:  (CS4) CountInformation');
        names.set(1082, '1082:  (CS5) PrintInformation');
        names.set(1083, '1083:  (CS5) PrintStyle');
        names.set(1084, '1084:  (CS5) MacintoshNSPrintInfo');
        names.set(1085, '1085:  (CS5) Windows DEVMODE');
        names.set(1086, '1086:  (CS6) AutoSaveFilePath');
        names.set(1087, '1087:  (CS6) AutoSaveFormat');
        names.set(1088, '1088:  (CC) PathSelectionState');
        names.set(2000, '2000:  PathInformation');
        //for(let i = 1;i < 998;i++){
            //names.set([2000 + i], '2000:   PathInformation' + i);
        //}
        names.set(2999, '2999:  NameOfClippingPath');
        names.set(3000, '3000:  (CC) OriginPathInfo');
        //for(let i = 1;i < 1000;i++){
            //names.set([3000 + i], 'CC: OriginPathInfo' + i);
        //}
        names.set(4000, '4000:  PlugInResources');
        names.set(7000, '7000:  ImageReadyVariables');
        names.set(7001, '7001:  ImageReadyDataSets');
        names.set(7002, '7002:  ImageReadyDefaultSelectedState');
        names.set(7003, '7003:  ImageReady7RolloverExpandedState');
        names.set(7004, '7004:  ImageReadyRolloverExpandedState');
        names.set(7005, '7005:  ImageReadySaveLayerSettings');
        names.set(7006, '7006:  ImageReadyVersion');
        names.set(8000, '7007:  (CS3) LightroomWorkflow');
        names.set(10000, '10000: PrintFlagsInformation');
        return names;
    }
    
}

module.exports.Resource = Resource;

