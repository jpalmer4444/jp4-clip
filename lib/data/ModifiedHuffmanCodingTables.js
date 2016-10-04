/* 
 * Modified Huffman Encoding tables
 */

class ModifiedHuffmanCodingTables {

    constructor() {}

    static TerminatingCodes() {
        let map = new Map();
        //Run-Length || (White Bits, Black Bits)
        map.add(0, {whitebits: 0b00110101, blackbits: 0b0000110111});
        map.add(1, {whitebits: 0b000111, blackbits: 0b010});
        map.add(2, {whitebits: 0b0111, blackbits: 0b11});
        map.add(3, {whitebits: 0b1000, blackbits: 0b10});
        map.add(4, {whitebits: 0b1011, blackbits: 0b011});
        map.add(5, {whitebits: 0b1100, blackbits: 0b0011});
        map.add(6, {whitebits: 0b1110, blackbits: 0b0010});
        map.add(7, {whitebits: 0b1111, blackbits: 0b00011});
        map.add(8, {whitebits: 0b10011, blackbits: 0b000101});
        map.add(9, {whitebits: 0b10100, blackbits: 0b000100});
        map.add(10, {whitebits: 0b00111, blackbits: 0b0000100});
        map.add(11, {whitebits: 0b01000, blackbits: 0b0000101});
        map.add(12, {whitebits: 0b001000, blackbits: 0b0000111});
        map.add(13, {whitebits: 0b000011, blackbits: 0b00000100});
        map.add(14, {whitebits: 0b110100, blackbits: 0b00000111});
        map.add(15, {whitebits: 0b110101, blackbits: 0b000011000});
        map.add(16, {whitebits: 0b101010, blackbits: 0b0000010111});
        map.add(17, {whitebits: 0b101011, blackbits: 0b0000011000});
        map.add(18, {whitebits: 0b0100111, blackbits: 0b0000001000});
        map.add(19, {whitebits: 0b0001100, blackbits: 0b00001100111});
        map.add(20, {whitebits: 0b0001000, blackbits: 0b00001101000});
        map.add(21, {whitebits: 0b0010111, blackbits: 0b00001101100});
        map.add(22, {whitebits: 0b0000011, blackbits: 0b00000110111});
        map.add(23, {whitebits: 0b0000100, blackbits: 0b00000101000});
        map.add(24, {whitebits: 0b0101000, blackbits: 0b00000010111});
        map.add(25, {whitebits: 0b0101011, blackbits: 0b00000011000});
        map.add(26, {whitebits: 0b0010011, blackbits: 0b000011001010});
        map.add(27, {whitebits: 0b0100100, blackbits: 0b000011001011});
        map.add(28, {whitebits: 0b0011000, blackbits: 0b000011001100});
        map.add(29, {whitebits: 0b00000010, blackbits: 0b000011001101});
        map.add(30, {whitebits: 0b00000011, blackbits: 0b000001101000});
        map.add(31, {whitebits: 0b00011010, blackbits: 0b000001101001});
        map.add(32, {whitebits: 0b00011011, blackbits: 0b000001101010});
        map.add(33, {whitebits: 0b00010010, blackbits: 0b000001101011});
        map.add(34, {whitebits: 0b00010011, blackbits: 0b000011010010});
        map.add(35, {whitebits: 0b00010100, blackbits: 0b000011010011});
        map.add(36, {whitebits: 0b00010101, blackbits: 0b000011010100});
        map.add(37, {whitebits: 0b00010110, blackbits: 0b00011010101});
        map.add(38, {whitebits: 0b00010111, blackbits: 0b000011010110});
        map.add(39, {whitebits: 0b00101000, blackbits: 0b000011010111});
        map.add(40, {whitebits: 0b00101001, blackbits: 0b000001101100});
        map.add(41, {whitebits: 0b00101010, blackbits: 0b000001101101});
        map.add(42, {whitebits: 0b00101011, blackbits: 0b000011011010});
        map.add(43, {whitebits: 0b00101100, blackbits: 0b000011011011});
        map.add(44, {whitebits: 0b00101101, blackbits: 0b000001010100});
        map.add(45, {whitebits: 0b00000100, blackbits: 0b000001010101});
        map.add(46, {whitebits: 0b00000101, blackbits: 0b000001010110});
        map.add(47, {whitebits: 0b00001010, blackbits: 0b000001010111});
        map.add(48, {whitebits: 0b00001011, blackbits: 0b000001100100});
        map.add(49, {whitebits: 0b01010010, blackbits: 0b000001100101});
        map.add(50, {whitebits: 0b01010011, blackbits: 0b000001010010});
        map.add(51, {whitebits: 0b01010100, blackbits: 0b000001010011});
        map.add(52, {whitebits: 0b01010101, blackbits: 0b000000100100});
        map.add(53, {whitebits: 0b00100100, blackbits: 0b000000110111});
        map.add(54, {whitebits: 0b00100101, blackbits: 0b000000111000});
        map.add(55, {whitebits: 0b01011000, blackbits: 0b000000100111});
        map.add(56, {whitebits: 0b01011001, blackbits: 0b000000101000});
        map.add(57, {whitebits: 0b01011010, blackbits: 0b000001011000});
        map.add(58, {whitebits: 0b01011011, blackbits: 0b000001011001});
        map.add(59, {whitebits: 0b01001010, blackbits: 0b000000101011});
        map.add(60, {whitebits: 0b01001011, blackbits: 0b000000101100});
        map.add(61, {whitebits: 0b00110010, blackbits: 0b000001011010});
        map.add(62, {whitebits: 0b00110011, blackbits: 0b000001100110});
        map.add(63, {whitebits: 0b00110100, blackbits: 0b000001100111});
        return map;
    }
    
    static MakeUpCodes(){
        let map = new Map();
        map.add(64, {whitebits: 0b11011, blackbits: 0b0000001111});
        map.add(128, {whitebits: 0b10010, blackbits: 0b000011001000});
        map.add(192, {whitebits: 0b010111, blackbits: 0b000011001001});
        map.add(256, {whitebits: 0b0110111, blackbits: 0b000001011011});
        map.add(320, {whitebits: 0b00110110, blackbits: 0b000000110011});
        map.add(384, {whitebits: 0b00110111, blackbits: 0b000000110100});
        map.add(448, {whitebits: 0b01100100, blackbits: 0b000000110101});
        map.add(512, {whitebits: 0b01100101, blackbits: 0b0000001101100});
        map.add(576, {whitebits: 0b01101000, blackbits: 0b0000001101101});
        map.add(640, {whitebits: 0b01100111, blackbits: 0b0000001001010});
        map.add(704, {whitebits: 0b011001100, blackbits: 0b0000001001011});
        map.add(768, {whitebits: 0b011001101, blackbits: 0b0000001001100});
        map.add(832, {whitebits: 0b011010010, blackbits: 0b0000001001101});
        map.add(896, {whitebits: 0b011010011, blackbits: 0b0000001110010});
        map.add(960, {whitebits: 0b011010100, blackbits: 0b0000001110011});
        
        map.add(1024, {whitebits: 0b011010101, blackbits: 0b0000001110100});
        map.add(1088, {whitebits: 0b011010110, blackbits: 0b0000001110101});
        map.add(1152, {whitebits: 0b011010111, blackbits: 0b0000001110110});
        map.add(1216, {whitebits: 0b011011000, blackbits: 0b0000001110111});
        map.add(1280, {whitebits: 0b011011001, blackbits: 0b0000001010010});
        map.add(1344, {whitebits: 0b011011010, blackbits: 0b0000001010011});
        map.add(1408, {whitebits: 0b011011011, blackbits: 0b0000001010100});
        map.add(1472, {whitebits: 0b010011000, blackbits: 0b0000001010101});
        map.add(1536, {whitebits: 0b010011001, blackbits: 0b0000001011010});
        map.add(1600, {whitebits: 0b010011010, blackbits: 0b0000001011011});
        map.add(1664, {whitebits: 0b011000, blackbits: 0b0000001100100});
        map.add(1728, {whitebits: 0b010011011, blackbits: 0b0000001100101});
        map.add(1792, {whitebits: 0b00000001000, blackbits: 0b00000001000});
        map.add(1856, {whitebits: 0b00000001100, blackbits: 0b00000001100});
        map.add(1920, {whitebits: 0b00000001101, blackbits: 0b00000001101});
        map.add(1984, {whitebits: 0b000000010010, blackbits: 0b000000010010});
        map.add(2048, {whitebits: 0b000000010011, blackbits: 0b000000010011});
        map.add(2112, {whitebits: 0b000000010100, blackbits: 0b000000010100});
        map.add(2176, {whitebits: 0b000000010101, blackbits: 0b000000010101});
        map.add(2240, {whitebits: 0b000000010110, blackbits: 0b000000010110});
        map.add(2304, {whitebits: 0b000000010111, blackbits: 0b000000010111});
        map.add(2368, {whitebits: 0b000000011100, blackbits: 0b000000011100});
        map.add(2432, {whitebits: 0b000000011101, blackbits: 0b000000011101});
        map.add(2496, {whitebits: 0b000000011110, blackbits: 0b000000011110});
        map.add(2560, {whitebits: 0b000000011111, blackbits: 0b000000011111});
        
        return map;
    }

}

module.exports.ModifiedHuffmanCodingTables = ModifiedHuffmanCodingTables;


